// e2e/capture/portfolio.spec.ts
//
// Captures the two ChekOut surfaces that have no usable assets anywhere:
// the builder's prompt generator and the analytics dashboard. Everything else
// (chat, recommendation panel, embed flow, motion b-roll) already exists in
// sentry-skin-website / design and did not need re-shooting.
//
//   npx tsx e2e/capture/save-auth.ts            # once, manual login
//   npx playwright test --config=playwright.capture.config.ts
//
// Output lands in portfolio-capture/. This is a capture pass, not a test — the
// assertions exist only to fail loudly when a surface didn't render, so we
// don't end up shipping a screenshot of a spinner.
import { test, expect, Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  APP_MARKER,
  BASE_URL,
  IDB_STATE,
  STILLS_DIR,
  assertNoDevOverlay,
  firebaseIdbRestore,
  readIdbState,
} from './shared';

const STILLS = STILLS_DIR;
const MERCHANT_ID = process.env.CAPTURE_MERCHANT_ID || '';

test.beforeAll(() => {
  fs.mkdirSync(STILLS, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  // Guard against the failure that produced the first bad capture: a different
  // project's dev server answering on the port we aimed at.
  const res = await page.request.get(BASE_URL);
  expect(
    (await res.text()).includes(APP_MARKER),
    `${BASE_URL} is not serving ChekOut — refusing to screenshot another app.`
  ).toBe(true);

  // storageState carries cookies + localStorage, but Firebase keeps its session
  // in IndexedDB, which storageState cannot see. Replay it before app boot.
  const records = readIdbState();
  expect(
    records.length,
    `No Firebase session at ${IDB_STATE}. Run: npx tsx e2e/capture/save-auth.ts`
  ).toBeGreaterThan(0);

  const { fn, arg } = firebaseIdbRestore(records);
  await page.addInitScript(fn, arg);
});

/** Slugify a card heading into a filename. */
const slug = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

/**
 * Navigate, then fail loudly if the replayed session wasn't accepted. Without
 * this the run just screenshots the login page and looks like it worked.
 */
async function gotoAuthed(page: Page, route: string) {
  await page.goto(route);
  await page.waitForLoadState('networkidle').catch(() => {});
  // AuthContext redirects on onAuthStateChanged, which is async — give it a beat.
  await page.waitForTimeout(2000);
  expect(
    page.url(),
    'Bounced to the login page — the saved session expired. Re-run: npx tsx e2e/capture/save-auth.ts'
  ).not.toMatch(/\/(login|signin|sign-in)\b/);
}

/** Named full-page shot. */
async function shootPage(page: Page, name: string) {
  await assertNoDevOverlay(page);
  await page.screenshot({ path: path.join(STILLS, `${name}.png`), fullPage: true });
  console.log(`    ${name}.png`);
}

/** Named shot of one element, with a little breathing room around it. */
async function shootEl(el: Locator, name: string) {
  await el.scrollIntoViewIfNeeded();
  await el.page().waitForTimeout(400); // let any entrance animation settle
  await el.screenshot({ path: path.join(STILLS, `${name}.png`) });
  console.log(`    ${name}.png`);
}

/**
 * Flip the Admin Mode switch, which unlocks both merchant selection and the
 * plan paywall (Dashboard.tsx: `isLocked = !adminMode && !!userData && !isPaidTier`).
 *
 * MUI renders the real <input role="switch"> as a zero-opacity overlay and the
 * wrapping Stack sits on top of it. A plain .check() never clears Playwright's
 * actionability check; .check({force:true}) clears the check but the *browser*
 * still hit-tests, so the click is delivered to the Stack and React never sees
 * an onChange. dispatchEvent goes straight to the node and skips hit-testing
 * entirely, which is the only thing that actually flips it.
 */
async function enableAdminMode(page: Page, toggle: Locator) {
  if (await toggle.isChecked()) return;

  await toggle.dispatchEvent('click');
  if (await toggle.isChecked().catch(() => false)) return;

  // Fallback: set the input and fire React's synthetic change by hand.
  await toggle.evaluate((el: HTMLInputElement) => {
    const setChecked = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'checked'
    )?.set;
    setChecked?.call(el, true);
    el.dispatchEvent(new Event('click', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(
    toggle,
    'Admin Mode would not flip — without it the dashboard stays paywalled and merchant-less.'
  ).toBeChecked({ timeout: 5000 });
  await page.waitForTimeout(500);
}

/**
 * The app renders charts asynchronously off BigQuery-backed endpoints. Waiting
 * on networkidle alone is not enough — MUI Skeletons stay mounted while the
 * request is in flight. Wait for them to disappear.
 */
async function waitForCharts(page: Page, timeout = 90_000) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await expect
    .poll(async () => page.locator('.MuiSkeleton-root').count(), {
      timeout,
      message: 'analytics cards still showing loading skeletons',
    })
    .toBe(0);
  await page.waitForTimeout(1500); // chart draw-in animations
  await assertNoDevOverlay(page);
}

// ---------------------------------------------------------------------------
// 1. Prompt generator — components/AgentSetup/AIPersona.tsx
// ---------------------------------------------------------------------------
test('prompt generator', async ({ page }) => {
  await gotoAuthed(page, '/ai-agent');

  // The wizard resumes at the last completed step, so an account with a fully
  // built agent (which is exactly the account worth capturing) lands on step 3
  // "Channels". The generator lives on step 0. Click back to it.
  const personaStep = page.getByText('AI Persona', { exact: true });
  if (await personaStep.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await personaStep.click();
    await expect(
      page.getByRole('heading', { name: /Build Your Own AI Agent|Agent Information/ }).first(),
      'Clicked "AI Persona" in the stepper but the persona form never rendered.'
    ).toBeVisible({ timeout: 20_000 });
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  // The generator only renders when the merchant has a synced catalog
  // (canAutoGeneratePrompt). If it's absent, the account isn't synced — fail
  // with a useful message rather than shooting an empty form.
  const genButton = page.getByRole('button', {
    name: /(Auto-generate|Regenerate) from catalog/,
  });
  await expect(
    genButton,
    'No auto-generate button — this account has no synced catalog. Connect a store first, or set CAPTURE_MERCHANT_ID.'
  ).toBeVisible({ timeout: 45_000 });

  console.log('  prompt generator:');

  // (a) The persona step as the merchant first sees it.
  await shootPage(page, 'builder-01-persona-form');

  // (b) The generator affordance on its own — button + explainer copy. This is
  //     the shot that actually shows the feature, so frame it tightly.
  const genBlock = genButton.locator('xpath=..');
  await shootEl(genBlock, 'builder-02-generator-affordance');

  // (c) The theme picker that seeds the prompt, if present.
  const themePicker = page.getByText('Select a theme to auto-populate your system prompt');
  if (await themePicker.isVisible().catch(() => false)) {
    await shootEl(themePicker.locator('xpath=ancestor::*[position()<=3][1]'), 'builder-03-prompt-theme');
  }

  // (d) Trigger it. When a prompt already exists the app asks first.
  await genButton.click();

  const confirm = page.getByRole('heading', { name: 'Replace with auto-generated content?' });
  if (await confirm.isVisible({ timeout: 3000 }).catch(() => false)) {
    await shootPage(page, 'builder-04-regenerate-confirm');
    await page.getByRole('button', { name: 'Replace', exact: true }).click();
  }

  // (e) The working state — "Analyzing your catalog…". Short-lived, so shoot
  //     immediately and don't fail the run if we miss it.
  const working = page.getByRole('button', { name: /Analyzing your catalog/ });
  if (await working.isVisible({ timeout: 4000 }).catch(() => false)) {
    await shootEl(working.locator('xpath=..'), 'builder-05-generating');
  } else {
    console.log('    (skipped generating state — completed too fast to catch)');
  }

  // (f) The generated result. Copy says it can take ~30s; allow double.
  await expect(working).toBeHidden({ timeout: 75_000 });
  await page.waitForTimeout(1000);
  await shootPage(page, 'builder-06-generated-prompt');

  // The system prompt textarea should now have real content — this is the
  // assertion that stops us shipping a screenshot of an empty field.
  const filled = await page
    .locator('textarea')
    .evaluateAll((els) => els.some((el) => (el as HTMLTextAreaElement).value.trim().length > 80));
  expect(filled, 'generator ran but no textarea ended up with generated copy').toBe(true);
});

// ---------------------------------------------------------------------------
// 2. Analytics dashboard — components/Dashboard/*
// ---------------------------------------------------------------------------
test('analytics dashboard', async ({ page }) => {
  await gotoAuthed(page, '/dashboard');

  // Admin accounts get a mode toggle. Turning it on does two useful things at
  // once (Dashboard.tsx: `isLocked = !adminMode && !!userData && !isPaidTier`):
  // it lets us pick any merchant, and it lifts the plan paywall — so an admin
  // account does not need to be on a paid tier to capture the charts.
  const adminToggle = page.getByRole('switch');
  const isAdmin = await page
    .getByText('Admin Mode', { exact: true })
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (isAdmin) {
    expect(
      MERCHANT_ID,
      'Logged in as admin — set CAPTURE_MERCHANT_ID to the merchant whose analytics you want captured.'
    ).not.toBe('');

    await enableAdminMode(page, adminToggle.first());

    const adminSearch = page.getByPlaceholder('Enter client merchant ID');
    await expect(adminSearch).toBeVisible({ timeout: 10_000 });
    await adminSearch.fill(MERCHANT_ID);
    await page.getByRole('button', { name: 'View', exact: true }).click();
  } else {
    // Non-admin: a free/tier1 plan renders an upsell instead of the charts.
    const paywall = page.getByText('Upgrade to Unlock Insights');
    expect(
      await paywall.isVisible({ timeout: 3000 }).catch(() => false),
      'This account is gated behind "Upgrade to Unlock Insights" — capture with the pro account, or an admin account (Admin Mode lifts the paywall).'
    ).toBe(false);
  }

  // Either path must end with real analytics, not the pre-search empty state.
  await expect(
    page.getByText('Enter a merchant ID above to view their analytics.'),
    `No analytics rendered for merchant "${MERCHANT_ID}" — check the ID.`
  ).toBeHidden({ timeout: 30_000 });

  await waitForCharts(page);

  console.log('  analytics dashboard:');
  await shootPage(page, 'dashboard-01-full');

  // Rather than hardcoding card names (they drift), walk the grid and shoot
  // every card that rendered, naming each from its own heading.
  const cards = page.locator('.MuiGrid-root > .MuiGrid-root').filter({ hasText: /\S/ });
  const count = await cards.count();
  const used = new Set<string>();
  let n = 0;

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const box = await card.boundingBox();
    // Skip layout wrappers and slivers; keep things that look like a real card.
    if (!box || box.width < 220 || box.height < 140) continue;

    const heading = ((await card.innerText().catch(() => '')) || '').split('\n')[0];
    let name = slug(heading) || `card-${i}`;
    while (used.has(name)) name = `${name}-2`;
    used.add(name);

    n += 1;
    await shootEl(card, `dashboard-${String(n + 1).padStart(2, '0')}-${name}`);
  }

  expect(n, 'no analytics cards were captured — the grid selector needs updating').toBeGreaterThan(2);
  console.log(`  captured ${n} cards`);
});
