// e2e/capture/save-auth.ts
//
// One-time auth bootstrap for the portfolio capture run.
//
//   npx tsx e2e/capture/save-auth.ts
//
// Starts the ChekOut dev server on a dedicated port (see shared.ts — NOT 3000,
// so a neighbouring project can't be captured by mistake), opens a headed
// Chromium at the login page and waits. Log in however you like — email/password
// or the Google OAuth button. The moment the app lands on /dashboard or
// /ai-agent, the session is written to portfolio-capture/.auth/ and the browser
// closes.
//
// This exists because the account with the interesting data (namit@chekout.ai,
// pro tier) is Google OAuth. Scripting Google's login is brittle and trips bot
// detection; doing it by hand once and reusing the session is both easier and
// more honest. Firebase tokens are good for a while — re-run this when the
// capture run starts bouncing you to the login screen.
//
// Note the session is saved in *two* pieces: Playwright's storageState (cookies
// + localStorage, which is where react-secure-storage keeps userData) and a
// separate dump of Firebase's IndexedDB store, which storageState does not see.
import { chromium } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
  AUTH_DIR,
  AUTH_STATE,
  BASE_URL,
  CAPTURE_PORT,
  IDB_STATE,
  IS_LOCAL_TARGET,
  assertServerIsChekout,
  dumpFirebaseIdb,
  portInUse,
} from './shared';

/** Start `next dev` on the capture port and resolve once it answers. */
async function startDevServer(): Promise<ChildProcess> {
  console.log(`  Starting dev server on :${CAPTURE_PORT}...`);
  const proc = spawn('npm', ['run', 'dev', '--', '-p', String(CAPTURE_PORT)], {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'ignore',
    detached: false,
  });

  const deadline = Date.now() + 120_000;
  for (;;) {
    if (Date.now() > deadline) {
      proc.kill();
      throw new Error(`dev server did not come up on :${CAPTURE_PORT} within 120s`);
    }
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) break;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('  Dev server ready.\n');
  return proc;
}

async function main() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  let devServer: ChildProcess | undefined;

  if (!IS_LOCAL_TARGET) {
    // Deployed target — there is nothing for us to start.
    await assertServerIsChekout(BASE_URL);
    console.log(`  Targeting ${BASE_URL} (deployed — no dev server started).\n`);
  } else if (await portInUse(CAPTURE_PORT)) {
    // Something's already there. Only proceed if it's actually this app — the
    // whole point of the dedicated port is that we never guess.
    await assertServerIsChekout(BASE_URL);
    console.log(`  Reusing the ChekOut server already on :${CAPTURE_PORT}.\n`);
  } else {
    devServer = await startDevServer();
    await assertServerIsChekout(BASE_URL);
  }

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL);

    console.log('\n  Log in in the browser window that just opened.');
    console.log('  Waiting for a redirect to /dashboard or /ai-agent...\n');

    // 5 minutes is plenty for a manual login including 2FA.
    await page.waitForURL(/\/(dashboard|ai-agent)/, { timeout: 300_000 });

    // Let Firebase finish persisting its token before snapshotting anything.
    await page.waitForTimeout(3000);

    // Cookies + localStorage (react-secure-storage's userData lives here).
    const state = await context.storageState({ path: AUTH_STATE });

    // Firebase's own session — IndexedDB, invisible to storageState.
    const idb = await dumpFirebaseIdb(page);
    fs.writeFileSync(IDB_STATE, JSON.stringify(idb, null, 2));

    if (!idb.length && !state.origins.length) {
      throw new Error(
        'Landed on an app route but captured an empty session — no Firebase\n' +
          '  IndexedDB records and no localStorage. That means the page reached was\n' +
          '  not a logged-in ChekOut page. Nothing usable was saved.'
      );
    }

    console.log(`  Saved storage state  -> ${AUTH_STATE}`);
    console.log(`  Saved Firebase IDB   -> ${IDB_STATE} (${idb.length} record(s))\n`);
  } finally {
    await browser.close().catch(() => {});
    if (devServer) devServer.kill();
  }
}

main().catch((err) => {
  console.error(`\n  Auth bootstrap failed: ${err.message}\n`);
  process.exit(1);
});
