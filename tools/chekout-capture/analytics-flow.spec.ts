// e2e/capture/analytics-flow.spec.ts
//
// A *flow* capture of the analytics dashboard — the narrated walkthrough behind
// shots AN-01/02/03/05/06 in SHOTLIST.md. Unlike portfolio.spec.ts (which grabs
// stills), this exists to produce one continuous .webm that tells the analytics
// story: the board settling in, a slow scroll through the cards, hovering an
// insight, and the signature keyword -> conversation-thread interaction.
//
//   npx tsx e2e/capture/save-auth.ts                     # once, manual login
//   PLAYWRIGHT_BASE_URL=https://app.chekout.ai \
//   CAPTURE_MERCHANT_ID=<id> \
//     npx playwright test --config=playwright.capture.config.ts e2e/capture/analytics-flow.spec.ts
//
// The video lands in portfolio-capture/_runner/. Convert with the ffmpeg snippet
// in README.md. The assertions here are guards only — they fail loudly if the
// session bounced to login or no analytics rendered, so we never ship a clip of
// a spinner or a login page. Interactions are best-effort (see below).
//
// NOTE ON SELECTORS: the dashboard has no data-testid hooks, so the interactive
// steps (insight hover, keyword click) locate by role/text and are wrapped so a
// miss is logged and skipped rather than failing the whole capture — the point
// is the motion, and a run that captures the scroll but misses one hover is
// still useful. Validate/tune these against a real authed run.
import { test, expect, Page } from '@playwright/test';
import {
  APP_MARKER,
  BASE_URL,
  IDB_STATE,
  assertNoDevOverlay,
  firebaseIdbRestore,
  readIdbState,
} from './shared';

const MERCHANT_ID = process.env.CAPTURE_MERCHANT_ID || '';

// Paced pauses so the resulting video reads as a deliberate walkthrough, not a
// robot. Tuned for a ~40s clip; bump for a slower narration track.
const BEAT = 1200;
const HOLD = 2200;

test.beforeEach(async ({ page }) => {
  // Same two guards as portfolio.spec.ts: right app on the origin, and a real
  // Firebase session to replay (storageState misses it — it's in IndexedDB).
  const res = await page.request.get(BASE_URL);
  expect(
    (await res.text()).includes(APP_MARKER),
    `${BASE_URL} is not serving ChekOut — refusing to capture another app.`
  ).toBe(true);

  const records = readIdbState();
  expect(
    records.length,
    `No Firebase session at ${IDB_STATE}. Run: npx tsx e2e/capture/save-auth.ts`
  ).toBeGreaterThan(0);

  const { fn, arg } = firebaseIdbRestore(records);
  await page.addInitScript(fn, arg);
});

/** Navigate and fail loudly if the replayed session wasn't accepted. */
async function gotoAuthed(page: Page, route: string) {
  await page.goto(route);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2000);
  expect(
    page.url(),
    'Bounced to login — the saved session expired. Re-run: npx tsx e2e/capture/save-auth.ts'
  ).not.toMatch(/\/(login|signin|sign-in)\b/);
}

/** Wait out the MUI loading skeletons the analytics cards mount while querying. */
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

/**
 * Enter the dashboard as the portfolio account does: on an admin account, flip
 * Admin Mode (which also lifts the paywall — Dashboard.tsx `isLocked`) and load
 * the target merchant. Non-admin accounts must be on a paid tier. Mirrors the
 * setup in portfolio.spec.ts; kept inline to stay self-contained, as that file does.
 */
async function enterDashboard(page: Page) {
  await gotoAuthed(page, '/dashboard');

  const isAdmin = await page
    .getByText('Admin Mode', { exact: true })
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (isAdmin) {
    expect(
      MERCHANT_ID,
      'Logged in as admin — set CAPTURE_MERCHANT_ID to the merchant whose analytics to capture.'
    ).not.toBe('');

    // MUI's Switch input is a zero-opacity overlay under a Stack that wins
    // hit-testing, so neither .check() nor .check({force:true}) flips it — the
    // browser delivers the click to the Stack. dispatchEvent skips hit-testing.
    const adminToggle = page.getByRole('switch').first();
    if (!(await adminToggle.isChecked())) {
      await adminToggle.dispatchEvent('click');
      if (!(await adminToggle.isChecked().catch(() => false))) {
        await adminToggle.evaluate((el: HTMLInputElement) => {
          const setChecked = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'checked'
          )?.set;
          setChecked?.call(el, true);
          el.dispatchEvent(new Event('click', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await expect(adminToggle, 'Admin Mode toggle did not flip').toBeChecked({ timeout: 5000 });
    }

    const adminSearch = page.getByPlaceholder('Enter client merchant ID');
    await expect(adminSearch).toBeVisible({ timeout: 10_000 });
    await adminSearch.fill(MERCHANT_ID);
    await page.getByRole('button', { name: 'View', exact: true }).click();
  } else {
    const paywall = page.getByText('Upgrade to Unlock Insights');
    expect(
      await paywall.isVisible({ timeout: 3000 }).catch(() => false),
      'Account gated behind "Upgrade to Unlock Insights" — use the pro/admin account.'
    ).toBe(false);
  }

  await expect(
    page.getByText('Enter a merchant ID above to view their analytics.'),
    `No analytics rendered for merchant "${MERCHANT_ID}" — check the ID.`
  ).toBeHidden({ timeout: 30_000 });

  await waitForCharts(page);
}

test('analytics dashboard — narrated flow', async ({ page }) => {
  await enterDashboard(page);
  console.log('  analytics flow: recording walkthrough...');

  // --- AN-02: hold on the top metrics row as it settles ---
  await page.mouse.move(720, 300);
  await page.waitForTimeout(HOLD);

  // --- AN-03: linger on the Total Visitors card so the new-vs-returning split
  //     (shipped this cycle) is legible. Best-effort scroll to it. ---
  const visitorsCard = page.getByText('Total Visitors', { exact: false }).first();
  if (await visitorsCard.isVisible().catch(() => false)) {
    await visitorsCard.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(HOLD);
  }

  // --- AN-01: slow scroll through the whole board so every card passes frame ---
  const totalScroll = await page.evaluate(() => document.body.scrollHeight);
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), (totalScroll * i) / steps);
    await page.waitForTimeout(BEAT);
  }
  await page.waitForTimeout(BEAT);

  // --- AN-05: hover an insight affordance to show these are insights, not just
  //     numbers. InsightTooltip renders an info icon; try a couple of selectors. ---
  const insight = page
    .locator('[aria-label*="insight" i], [data-testid*="insight" i], svg[data-testid="InfoOutlinedIcon"]')
    .first();
  if (await insight.isVisible().catch(() => false)) {
    await insight.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(BEAT);
    await insight.hover().catch(() => {});
    await page.waitForTimeout(HOLD);
  } else {
    console.log('    (skipped insight hover — no info affordance matched; tune selector)');
  }

  // --- AN-06: the signature keyword -> thread interaction. Scroll to Most Used
  //     Keywords, click a keyword, let Conversation Highlights filter + scroll +
  //     auto-expand. Best-effort: legend rows / slice labels are unlabelled. ---
  const kwHeading = page.getByRole('heading', { name: /Most Used Keywords/i }).first();
  if (await kwHeading.isVisible().catch(() => false)) {
    await kwHeading.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(BEAT);

    // The card renders keyword legend rows near the pie. Grab the nearest
    // clickable text within the card container and click the first real keyword.
    const kwCard = kwHeading.locator('xpath=ancestor::*[position()<=4][1]');
    const legendRow = kwCard.locator('text=/^[a-z]{3,}$/i').first();
    if (await legendRow.isVisible().catch(() => false)) {
      const term = (await legendRow.textContent().catch(() => '')) || '';
      await legendRow.click().catch(() => {});
      console.log(`    clicked keyword: "${term.trim()}"`);
      // Let Conversation Highlights filter, scroll into view, expand first match.
      await page.waitForTimeout(HOLD);
      // Follow the scroll the app performs to the filtered thread.
      await page.waitForTimeout(HOLD);
    } else {
      console.log('    (skipped keyword click — no legend row matched; tune selector)');
    }
  } else {
    console.log('    (skipped keyword interaction — Most Used Keywords card not found)');
  }

  // Tail hold so the clip doesn't cut on the last action.
  await page.waitForTimeout(HOLD);
  console.log('  analytics flow: done. Video in portfolio-capture/_runner/.');
});
