// playwright.capture.config.ts
//
// Separate from playwright.config.ts on purpose: this run is not a test suite,
// it is an asset-capture pass for the portfolio case study. Different viewport,
// different output dir, no retries, no HTML reporter.
//
//   npx playwright test --config=playwright.capture.config.ts
//
// See e2e/capture/README.md for the auth step that has to happen first.
import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  AUTH_STATE,
  BASE_URL,
  CAPTURE_DIR,
  CAPTURE_PORT,
  IS_LOCAL_TARGET,
} from './e2e/capture/shared';

// Same .env.local loader as the main config.
const envLocalPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  fs.readFileSync(envLocalPath, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...rest] = trimmed.split('=');
      const value = rest.join('=');
      if (key && value && !process.env[key]) process.env[key] = value;
    });
}

export { CAPTURE_DIR, AUTH_STATE };

export default defineConfig({
  testDir: './e2e/capture',

  // Generous: the dashboard waits on BigQuery-backed analytics calls, and the
  // prompt generator round-trips through the catalog.
  timeout: 180_000,
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: [['list']],

  outputDir: path.join(CAPTURE_DIR, '_runner'),

  use: {
    baseURL: BASE_URL,

    // 1440x900 at 2x = retina stills that hold up on a portfolio at full width.
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,

    // Video is recorded at 1x — Playwright caps video to the viewport size.
    // Post-process with the ffmpeg snippet in the README.
    video: { mode: 'on', size: { width: 1440, height: 900 } },
    trace: 'off',
    screenshot: 'off', // we take explicit named shots instead

    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: 'capture',
      // Only wire storageState if the bootstrap has run — otherwise Playwright
      // dies with an ENOENT before the spec can print the actionable message.
      use: {
        ...devices['Desktop Chrome'],
        ...(fs.existsSync(AUTH_STATE) ? { storageState: AUTH_STATE } : {}),
      },
    },
  ],

  // Dedicated port, and we never reuse whatever happens to be listening: the
  // first capture attempt silently screenshotted a different project's app that
  // was occupying :3000. Playwright's own reuse check is just "does the URL
  // respond", which cannot tell two Next apps apart — so we always own the
  // server. The spec additionally asserts a ChekOut marker before shooting.
  // ...and no dev server at all when PLAYWRIGHT_BASE_URL points at a deployed
  // environment, which is the better target: see IS_LOCAL_TARGET in shared.ts.
  ...(IS_LOCAL_TARGET
    ? {
        webServer: {
          command: `npm run dev -- -p ${CAPTURE_PORT}`,
          url: BASE_URL,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      }
    : {}),
});
