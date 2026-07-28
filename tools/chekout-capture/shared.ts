// e2e/capture/shared.ts
//
// Shared between save-auth.ts, portfolio.spec.ts and playwright.capture.config.ts.
//
// Two things bit this capture run on the first attempt and both live here now:
//
//   1. Port collision. The capture used :3000 with reuseExistingServer, so a
//      different project's dev server that happened to be up got screenshotted
//      instead. We still use :3000 (see below) but never reuse a foreign server,
//      and we refuse to talk to anything that doesn't identify itself as ChekOut.
//   2. Firebase auth is persisted in IndexedDB, not cookies or localStorage.
//      Playwright's storageState() captures neither, so the saved session was
//      always going to be empty. We snapshot the IDB store separately and
//      replay it via an init script.
import * as fs from 'fs';
import * as path from 'path';

/**
 * Has to be 3000. The auth backend's CORS allowlist is origin-exact and only
 * has http://localhost:3000 on it — Firebase login succeeds on any localhost
 * port (Google authorizes the host, not the port), but the follow-up /auth/me
 * is then blocked and login silently fails.
 *
 * So the fix for the wrong-app capture is NOT a different port: it's refusing
 * to reuse whatever is already on 3000 (reuseExistingServer: false) plus the
 * ChekOut marker assertion below. If something else owns 3000, the run stops
 * with an error instead of capturing it.
 *
 * Overriding CAPTURE_PORT means adding that origin to the backend's
 * CORS_ALLOWED_ORIGINS first, or login will not complete.
 */
export const CAPTURE_PORT = Number(process.env.CAPTURE_PORT || 3000);

export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${CAPTURE_PORT}`;

/**
 * False when PLAYWRIGHT_BASE_URL points at a deployed environment, in which case
 * nobody should start a dev server.
 *
 * Worth targeting production: the backend `.env.local` points at is an older
 * auth-backend that has no agent and no plan for the account, so a local run
 * captures empty shells. Production has the real catalog and real analytics:
 *
 *   PLAYWRIGHT_BASE_URL=https://app.chekout.ai npx tsx e2e/capture/save-auth.ts
 *   PLAYWRIGHT_BASE_URL=https://app.chekout.ai npx playwright test --config=playwright.capture.config.ts
 *
 * The saved session is origin-scoped, so switching targets means re-running the
 * auth bootstrap against that target.
 */
export const IS_LOCAL_TARGET = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(BASE_URL);

export const CAPTURE_DIR = path.resolve(__dirname, '../../portfolio-capture');
export const STILLS_DIR = path.join(CAPTURE_DIR, 'stills');
/**
 * Sessions are scoped per target, so a localhost login and a production login
 * can coexist and neither can be silently applied to the wrong origin.
 */
const TARGET_SLUG = BASE_URL.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-');

export const AUTH_DIR = path.join(CAPTURE_DIR, '.auth', TARGET_SLUG);
export const AUTH_STATE = path.join(AUTH_DIR, 'state.json');

/** Firebase's IndexedDB session, saved alongside the cookie/localStorage state. */
export const IDB_STATE = path.join(AUTH_DIR, 'firebase-idb.json');

/**
 * Served in every page of this app by pages/_document.tsx and by nothing else.
 * Cheapest reliable "is this actually ChekOut" check available.
 */
export const APP_MARKER = '/assets/icons/chekout-white.svg';

// Firebase JS SDK internals — stable across v9/v10/v11.
const IDB_NAME = 'firebaseLocalStorageDb';
const IDB_STORE = 'firebaseLocalStorage';

/** Fetch the origin's HTML and confirm it's this app and not a neighbour on the port. */
export async function assertServerIsChekout(baseUrl: string): Promise<void> {
  let html: string;
  try {
    const res = await fetch(baseUrl);
    html = await res.text();
  } catch (err) {
    throw new Error(
      `Nothing answered at ${baseUrl}.\n` +
        `  Start it with:  npm run dev -- -p ${CAPTURE_PORT}`
    );
  }
  if (!html.includes(APP_MARKER)) {
    throw new Error(
      `${baseUrl} is serving some other app — no ChekOut marker in the HTML.\n` +
        `  This is the bug that produced the wrong screenshots. Stop whatever else\n` +
        `  is on port ${CAPTURE_PORT} and re-run.\n` +
        `  (Moving to another port needs that origin added to the auth backend's\n` +
        `  CORS allowlist first, or login won't complete.)`
    );
  }
}

/** True if something is already listening on the port. */
export async function portInUse(port: number): Promise<boolean> {
  const net = await import('net');
  return new Promise((resolve) => {
    const srv = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () => srv.close(() => resolve(false)))
      .listen(port, '127.0.0.1');
  });
}

export type IdbRecord = Record<string, unknown>;

/** Read every record out of Firebase's IndexedDB store in the current page. */
export async function dumpFirebaseIdb(page: {
  evaluate: <T>(fn: (args: [string, string]) => Promise<T> | T, arg: [string, string]) => Promise<T>;
}): Promise<IdbRecord[]> {
  return page.evaluate<IdbRecord[]>(
    ([dbName, storeName]) =>
      new Promise((resolve) => {
        const open = indexedDB.open(dbName);
        open.onerror = () => resolve([]);
        open.onsuccess = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains(storeName)) return resolve([]);
          const req = db.transaction(storeName, 'readonly').objectStore(storeName).getAll();
          req.onerror = () => resolve([]);
          req.onsuccess = () => resolve(req.result as IdbRecord[]);
        };
      }),
    [IDB_NAME, IDB_STORE]
  );
}

/**
 * Init-script body that writes the saved records back into IndexedDB before any
 * app code runs, so Firebase finds a session on boot. Must be installed with
 * page.addInitScript() *before* the first navigation.
 */
export function firebaseIdbRestore(records: IdbRecord[]) {
  return {
    fn: ([dbName, storeName, rows]: [string, string, IdbRecord[]]) =>
      new Promise<void>((resolve) => {
        if (!rows.length) return resolve();
        const open = indexedDB.open(dbName, 1);
        open.onupgradeneeded = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'fbase_key' });
          }
        };
        open.onerror = () => resolve();
        open.onsuccess = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains(storeName)) return resolve();
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          rows.forEach((r) => store.put(r));
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        };
      }),
    arg: [IDB_NAME, IDB_STORE, records] as [string, string, IdbRecord[]],
  };
}

/** Saved IDB records, or [] if the auth bootstrap hasn't been run. */
export function readIdbState(): IdbRecord[] {
  if (!fs.existsSync(IDB_STATE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(IDB_STATE, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Fail if Next.js's dev error overlay is on screen.
 *
 * This exists because a run "passed" while every single screenshot was actually
 * the overlay: a `Failed to fetch` in lib/attribution.ts threw, Next painted its
 * full-screen error dialog over the dashboard, and the harness happily shot 17
 * pictures of a stack trace. The skeleton-wait cleared (skeletons unmount when
 * the request rejects) and the card sweep found elements (the overlay has DOM),
 * so nothing else caught it.
 *
 * The overlay lives in a <nextjs-portal> custom element; Playwright pierces the
 * shadow root for CSS selectors. Checked separately from the text match because
 * the portal exists in dev even when no error is shown.
 */
export async function assertNoDevOverlay(page: import('@playwright/test').Page): Promise<void> {
  const dialog = page.locator('nextjs-portal [data-nextjs-dialog], nextjs-portal [role="dialog"]');
  if ((await dialog.count()) === 0) return;
  if (!(await dialog.first().isVisible().catch(() => false))) return;

  const detail = ((await dialog.first().innerText().catch(() => '')) || '')
    .split('\n')
    .filter(Boolean)
    .slice(0, 4)
    .join(' | ');

  throw new Error(
    `Next.js dev error overlay is covering the page — every screenshot would be a stack trace.\n` +
      `  ${detail}\n` +
      `  A backend call failed. Local .env.local points at partial dev/staging services;\n` +
      `  target production instead (see IS_LOCAL_TARGET in shared.ts).`
  );
}
