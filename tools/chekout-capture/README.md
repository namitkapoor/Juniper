# Portfolio asset capture

> **Parked — archived copy.** These files do not run from this repo. They were
> written for and last ran inside `~/Documents/work/chekout-ai/chekoutai-frontend`
> (`e2e/capture/` + `playwright.capture.config.ts` at that repo's root), which is
> where Playwright, the app, and `.env.local` live. Kept here so the portfolio
> repo carries a record of how the ChekOut captures were meant to be produced.
>
> **Current approach is manual screen recording** — see the flow list in
> `../../HANDOFF.md`. The harness worked end to end (auth replay, admin mode,
> merchant load, 16-card sweep); it was blocked on backend data, not code, and
> maintaining it cost more than the assets were worth. To revive it, copy these
> six files back to `e2e/capture/` and `playwright.capture.config.ts` to that
> repo's root.

Captures the two ChekOut surfaces that have no usable assets in any repo: the
builder's **prompt generator** and the **analytics dashboard**. Everything else
the case study needs (chat, recommendation panel, embed flow, motion b-roll)
already exists in `sentry-skin-website/public/assets` and `design/`.

## Run it

```bash
cd chekoutai-frontend

# 0. Make sure nothing else is on :3000 (it has to be 3000 — see below).
lsof -nP -iTCP:3000 -sTCP:LISTEN

# 1. Auth, once. Reuses your dev server if it's already up, otherwise starts one.
#    Opens a headed browser; log in by hand (Google OAuth is fine).
npx tsx e2e/capture/save-auth.ts

# 2. Capture.
npx playwright test --config=playwright.capture.config.ts
```

Output:

```
portfolio-capture/
  stills/                    retina PNGs, 1440x900 @2x
  _runner/                   Playwright's own video recordings (.webm)
  .auth/state.json           cookies + localStorage — do not commit
  .auth/firebase-idb.json    Firebase session — do not commit
```

Re-run `save-auth.ts` whenever the capture run starts bouncing to the login page.

## Two things that broke the first run

Both are now guarded, but worth knowing since they fail in ways that *look* like
success:

**Port 3000, and it can't move.** The first attempt used `:3000` with
`reuseExistingServer: true`, so a different project's dev server that happened to
be up got captured instead — Playwright's reuse check is only "does this URL
respond", which cannot tell two Next apps apart.

The obvious fix (a dedicated port) does not work: the auth backend's
`CORS_ALLOWED_ORIGINS` is origin-exact and only lists `http://localhost:3000`.
Firebase login still succeeds on any localhost port — Google authorizes the host,
not the port — but the follow-up `/auth/me` gets CORS-blocked and login fails
with nothing useful in the UI.

So the guard is behavioural, not a port change: `reuseExistingServer: false`, so
Playwright refuses to run when something else already owns 3000, plus a
ChekOut-only marker assertion (`/assets/icons/chekout-white.svg`, emitted by
`pages/_document.tsx`) that both scripts check before doing anything. Free the
port rather than working around it. `CAPTURE_PORT=<n>` exists but requires adding
that origin to the backend allowlist first.

**Firebase auth lives in IndexedDB.** Playwright's `storageState()` captures
cookies and localStorage only, so the Firebase session was never in it — the
first `state.json` was an empty `{"cookies":[],"origins":[]}`. `save-auth.ts` now
dumps the `firebaseLocalStorageDb` store to `.auth/firebase-idb.json` separately,
and the spec replays it via `addInitScript` before the app boots. If that file is
missing or empty the run fails up front instead of screenshotting a login page.

## Target production, not localhost

The backend `.env.local` points at (`auth-backend-…us-east5`) is an older service
that has no agent and no plan for the account — a local run captures an empty
"Build Your Own AI Agent" form and a zeroed dashboard. Pointing at production
skips that entirely, and needs no CORS changes since the deployed frontend and
backend already talk to each other:

```bash
export PLAYWRIGHT_BASE_URL=https://app.chekout.ai

npx tsx e2e/capture/save-auth.ts
CAPTURE_MERCHANT_ID=<id> npx playwright test --config=playwright.capture.config.ts
```

No dev server is started for a deployed target. Sessions are stored per target
(`.auth/<host>/`), so switching between localhost and production means running
the auth bootstrap again for that target.

## Account requirements

Two gates will stop the run, both with an explicit error message:

- **Prompt generator** only renders when the merchant has a synced catalog
  (`canAutoGeneratePrompt` in `components/AgentSetup/AIPersona.tsx`). Use an
  account with a connected store.
- **Dashboard** — on an admin account, flipping **Admin Mode** both selects the
  merchant and lifts the plan paywall (`isLocked = !adminMode && !!userData &&
  !isPaidTier` in `Dashboard.tsx`), so an admin does *not* need a paid tier. The
  spec toggles it automatically but needs the merchant to shoot:
  `CAPTURE_MERCHANT_ID=<id>`. Non-admin accounts must be on a paid tier or the
  run stops at "Upgrade to Unlock Insights".

## Turning the recordings into portfolio video

Playwright writes `.webm` at viewport size into `portfolio-capture/_runner/`.
Convert to the same shape as the rest of the case study assets (1280 wide, h264
+ vp9 + poster, no audio):

```bash
IN=portfolio-capture/_runner/<test-dir>/video.webm
OUT=prompt-generator

ffmpeg -y -i "$IN" -vf "scale=1280:-2,fps=30" \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$OUT.mp4"
ffmpeg -y -i "$IN" -vf "scale=1280:-2,fps=30" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -an "$OUT.webm"
ffmpeg -y -ss 1 -i "$IN" -vf "scale=1280:-2" -frames:v 1 -q:v 4 "$OUT-poster.jpg"
```

Then drop the three files into
`Juniper/public/videos/Case Studies/CK/builder/`.

## Note on selectors

The dashboard has no `data-testid` hooks, so the card sweep walks the MUI grid
and names each shot from the card's own heading rather than hardcoding titles.
If MUI's grid classes change, the run fails with "no analytics cards were
captured" rather than silently producing nothing.
