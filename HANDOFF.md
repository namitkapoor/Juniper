# Handoff — 2026-07-29 (Asset audit + repo cleanup)

Small session on this repo; the bulk of the day was in `kyuri-dashboard` — see
its `HANDOFF.md` for the Félix post-mortem and the Q&A data-loss fix.

## Shipped (`2d3802c`, live on namit.me)

- **11 `.DS_Store` files untracked.** They were committed before `.gitignore`
  covered them, so the ignore rule never applied. Files stay on disk.
- **`/dev/assets`** — a contact sheet for the ChekOut assets, at
  `src/Pages/AssetReview.jsx`, routed behind `import.meta.env.DEV`
  (`src/Pages/App.jsx:66`). Verified tree-shaken out of the prod bundle.
  Run `npm run dev` → http://localhost:5173/dev/assets.

## ChekOut assets — audited, all healthy

16 video sets, every one with mp4 + webm + poster, no gaps. 22 stills. Largest
file 2.4MB, well under the 10MB budget. `CHEKOUT-ASSETS.md` matches disk exactly.

Three things to know before cutting anything:

- `builder/agent-builder-full.mp4` is **177s** — needs trimming, "before" only.
- `dashboard/analytics-dashboard-flow.mp4` — first ~12s is date-picking and
  load skeletons.
- `before/rec-panel-before` is 1144×720, off the 1280 grid everything else uses.
  Fine in a slider, visible next to a 1280 clip.

## Still missing (unchanged from 07-28)

| Project | Gap |
|-|-|
| ChekOut | Prompt-generator capture; **and the case study itself** — no route, no data file, no Home card, so all 46MB in `public/` is unreferenced |
| Kyuri.OS | Everything — zero assets, zero refs in `src/`. Password-gated, so the recording has to be you |
| Studio | Cover recording of the 3D shelf |

## Note

GitHub flagged **12 Dependabot vulnerabilities** (2 high) on push. Unrelated to
this work, not looked at.

---

# Handoff — 2026-07-28 (Direction: role target, positioning page, content gap)

No code changed in this thread. It settled three decisions that everything
downstream depends on. Picking up tomorrow starts here.

## TL;DR

Role target is **product engineer**. ChekOut is being wound down — a job
replaces it, not funds it. The site's **home page becomes a positioning page**
(one thesis + evidence + three deep links) instead of a four-card case-study
grid; About is untouched. Everything is now blocked on **one thing**: the
ChekOut case study doesn't exist.

## 1. Role decision — settled

**Product engineer.** Not technical PM, not FDE.

- Technical PM is out. It's the one option where building stops being what
  you're paid for, and it puts you against people who've done only that for
  five years.
- FDE vs product engineer was the real fork. Product engineer wins: the
  evidence shows steering through copy, screenshots, positioning, and nav
  hierarchy rather than technical specs — a product engineer's instrument set,
  not an FDE's.
- Corroborated by YC Paxel (https://paxel.ycombinator.com/results/pks7fjn0),
  which analysed 6 Claude Code sessions and independently landed on "strong
  AI-directed product engineer."

**Caveat on that result:** it only saw six *marketing-site* sessions
(2026-06-15 → 07-23). It never saw the design research, the WebGL work, or
Kyuri.OS. Don't over-fit to it.

## 2. The approach to own

Descriptive, not aspirational — every line has a receipt. That's the guard: if
a principle has no receipt it doesn't go on the site.

**Thesis: I find the thing that shouldn't exist, remove it, and prove the
removal worked.**

| Project | Removed | Moved |
|-|-|-|
| Christine Valmy | 7 components → 3 (bento grid + Student ID killed) | 143% more submissions |
| Influencer Marketing | 5 status tabs → 1 | 28% fewer clicks |
| Manage Farms | Unused features cluttering core workflows | SUS 52 → 70 |
| Clutch | The whole Duolingo direction, after one founder note | The pivot that made it legible |
| ChekOut cleanup | Orphaned assets, dead code paths | 0.36 deletion ratio |
| Capture harness | The pipeline itself | Replaced by 4 recordings |

Four practices under it, each evidenced:

1. **Work backwards from the workflow, not the feature list** — MI reorganised
   around what users *do* (analytics vs tracking) not data states; Manage Farms
   found farmers reference crops by location, not category.
2. **Kill your best idea when the data says so** — the bento grid was your
   favourite and already built; 8 students ignored it and asked for Instagram.
3. **Name the exact words** — the Shopify disclaimer catch (copy implied the
   whole *product* was Shopify-only; reframed as a demo constraint).
4. **Anchor every change to the working version** — before/after discipline
   throughout, including refusing a staged "before" for the rec panel.

**The one gap, stated precisely:** you verify *outcomes*, not *implementations*.
You'll measure a 143% lift but not run the dev server to confirm the CSS landed,
not write a test, not rotate a key after untracking it. Paxel's three growth
areas (visual verification, secrets closure, no tests) are all this one thing.
It's also exactly the product-designer → product-engineer delta, and it's cheap
to close: say yes when the offer to verify appears.

## 3. Site restructure — decided, not started

The **positioning page replaces Home**, not About.

| Page | Question it answers |
|-|-|
| Home (positioning) | How do I work, and what have I shipped? |
| About | Who am I, and why do I do this? |

About stays exactly as is — "Breaking and Rebuilding", the Design/Development
split, the timeline, the interests section. It's doing real work and merging it
into a professional thesis would weaken both.

**The only structural change:** the four-card case-study grid at
`src/Pages/Home.jsx:295` becomes the evidence table plus three deep links
(ChekOut · Kyuri.OS · Studio). The hero survives, compressed so the thesis lands
above the fold or one scroll in.

Nothing gets deleted. `/case-study/manage-farms` and `/case-study/influencer-marketing`
keep working, they just stop being front-door content. Fully reversible.

**Don't explain the format on the page.** A site that opens with a thesis and
immediately backs it with removals→numbers doesn't need a note about why it
isn't a case-study grid. The note is the only thing that would make it read as
odd.

**Ship on a branch.** Vercel is already building previews; `nk-edits-2026`
exists at `e39ffd9`. `namit.me` stays on the current build until it's good.

## 4. What's actually blocking it

The **evidence table is writable today** — it draws entirely on projects that
already have full content (CV, MI, Manage Farms, Clutch). Only the three deep-link
cards need new material.

| Project | Case study content | Cover video |
|-|-|-|
| **ChekOut** | ✗ Doesn't exist — the real blocker | ✓ Have it — `CK/motion/maria-with-ui.mp4`, 1280×720, 14s, matches the existing cover convention exactly |
| **Kyuri.OS** | ✗ Nothing | ✗ Needs a recording — dashboard is password-gated, so it has to be you |
| **Studio** | Live site, no writeup | ✗ Needs a recording of the 3D shelf. Studio's `public/videos` has only Experiments |

Kyuri and Studio can ship as cards that link out. The page is gated on ChekOut,
not on all three.

### Recording list — one sitting

1. **ChekOut prompt generator** — the last missing ChekOut surface (see the
   07-28 capture entry below; same canary + `kiva` pattern should work)
2. **Kyuri dashboard** — panel walkthrough. Careful with real job/apartment data
   on screen
3. **Studio** — 3D shelf, ~10s, for the cover

All 1280×720, no audio, 10–15s for covers. Transcode to mp4 + webm + poster.

> The analytics dashboard is **done** — see the entry below. The manual shot
> list in the 07-27 section is superseded for that surface.

## 5. Open items

- **Rotate the two GCP service accounts.** `git show 64d2ed6:shopify-473015-firebase-adminsdk-fbsvc-8651a0e9a2.json`
  still returns a file containing a private key; second key in `55cb9ba`.
  `SentrySkin/chekoutai-frontend` is private so this isn't public exposure, and
  Cloud Run build-time secrets live in Secret Manager separately — but the
  committed admin key bypasses Firebase security rules for anyone with repo
  access. Rotation makes the committed blob inert; history rewriting is optional.
  **User is handling this.**
- **Credibility fixes** — not urgent, ~10 min, worth doing before anyone
  technical reads the site: the CV model-vendor contradiction (§ 07-27 below),
  the `product-recommendations` description, the Home.jsx array drift. Note the
  first is the only one with real cost; the other two aren't live.
- **Verify Kyuri's API routes are gated**, not just the UI, before linking it
  publicly. The shell currently renders panel labels (`SCRATCHPAD`, `Job
  Pipeline`, `Apartment`) with no data, which is fine — but check the routes.
- **Uncommitted in this repo right now** (three separate threads, none mine):
  analytics dashboard assets + `CHEKOUT-ASSETS.md`; the bot-scan trap
  (`vercel.json` rewrites + `api/trap.js` → Notion); and this handoff.

---

# Handoff — 2026-07-28 (Analytics dashboard capture — shipped)

## TL;DR

Un-parked the capture harness and shipped the **Analytics dashboard** asset — one
of the two surfaces the 07-27 handoff listed as missing. The 07-27 note said the
harness was "blocked on backend data" and the flows were "faster to screen-record
by hand." That diagnosis was wrong: the block was a **target/data-location**
problem, not a capture problem. Fixing the target made it fully automated.

## What was actually wrong (so it isn't re-learned)

- **Prod runs an older frontend.** `app.chekout.ai` has none of the new dashboard
  features (insight tooltips, clickable keywords, new-vs-returning card), so a
  prod capture silently misses them. Capture against the **canary** build instead
  (built from the current tree).
- **Data lives in two BigQuery projects.** `kivakube` is dev-only
  (`shopify-473015`); the prod backend (which canary also uses) only has `kiva`
  (`production-aibuilder`, 6.8k turns, current). So: **canary + `kiva`**.
- The dashboard defaults to *today* (empty). The spec now drives the react-date-
  range picker (dropdown month/year — its inputs are readonly) to Mar→today.
- Prod builds strip MUI icon `data-testid`, so the insight lightbulb is matched by
  SVG path, not testid.

## Files added

**In Juniper (this repo):**
- `public/videos/Case Studies/CK/dashboard/analytics-dashboard-flow.mp4` (457KB)
- `…/analytics-dashboard-flow.webm` (603KB)
- `…/analytics-dashboard-flow-poster.jpg` (54KB) — populated board + open insight tooltip
- `CHEKOUT-ASSETS.md` — new "Analytics dashboard" section; dropped it from "Still missing"

**In `chekoutai-frontend/e2e/capture/` (uncommitted, per that harness's convention):**
- `analytics-flow.spec.ts` — the flow-capture spec (canary + kiva baked into its header)
- `SHOTLIST.md` — full promo shot list across all five feature areas

## Reproduce

```bash
BASE=https://canary---nextjs-l6tdgloqva-uc.a.run.app
PLAYWRIGHT_BASE_URL=$BASE CAPTURE_MERCHANT_ID=kiva \
  npx playwright test --config=playwright.capture.config.ts e2e/capture/analytics-flow.spec.ts
# then the ffmpeg 3-file recipe in e2e/capture/README.md
```

## Next

- **Prompt generator flow (AG-02)** — the last missing surface. Same pattern:
  new spec on the canary target, then convert into `CK/builder/`.
- Trim the first ~12s (date-pick + skeletons) off the dashboard clip before use.

---

# Handoff — 2026-07-27 (Case study audit + ChekOut asset migration)

## TL;DR

Audited the four live case studies against an 8-point recruiter-red-flag
checklist and found real failures on 5 of 8. Migrated every reusable ChekOut AI
asset out of the three work repos into this one (23 images, 16 video sets).
Built a Playwright capture harness for the two surfaces that had no assets
anywhere, got it fully working, then **parked it** — it was blocked on backend
data rather than code, and the remaining two flows are faster to screen-record
by hand. The manual shot list is below.

---

## 1. Case study audit

Scope: `/case-study/clutch`, `/christine-valmy`, `/manage-farms`,
`/influencer-marketing`. Task Reminders + Sustainable Packaging are built but
commented out of the Home grid (`src/Pages/Home.jsx:337`).

| # | Check | Verdict | Where |
|-|-|-|-|
| 1 | Reams of text | Fails | `manageFarmsData.js` 693 lines, `christineValmyData.js` 405 |
| 2 | Template > work | Risk | All four run an identical scaffold; only Clutch differs |
| 3 | AI signals | **Fails** | See below — worst offender |
| 4 | Weak gut feeling | Fails | Lead card is Clutch: metric slot reads "Data-Dense Mobile Experience", impact reads "Rejected" |
| 5 | No evidence of shipping | Partial | No `liveUrl` field exists anywhere in the data layer |
| 6 | Double diamond | Passes | Not in the live four. `StrategicApproach.jsx` / `ProcessFlow.jsx` still power the two disabled XR studies — don't re-enable without rewriting |
| 7 | Unclear what YOU did | Mixed | MI is clean ("1 designer (me)"); Manage Farms says "2 Designers, 2 Researchers" and never says which parts were yours |
| 8 | Scope/title mismatch | Fails | "Hire Influencer Marketing" is ungrammatical and describes discovery, but the work is a tracking IA redesign |

### #3 — the credibility bugs, fix these first

- **`christineValmyData.js` contradicts itself on the model vendor.**
  `meta.techStack` says "React, PHP, Gemini, Claude, N8N"; iteration 3 says
  "Used Gemini's multilingual capabilities"; but `techStack.Backend` says
  "OpenAI GPT-4 API" and `technicalChallenges` has an entry titled "GPT-4
  Response Streaming". One case study, three vendors. This is the single line a
  reviewer points at to say "generated, unread."
- **"X, not Y" appears five times** across four case studies: "Strava, not
  Duolingo" / "ammunition, not encouragement" / "execution transparency, not
  status grouping" / "Build for humans, not for your tech stack" / "motion as
  tool, not goal."
- **Rule-of-three everywhere** — 3 design principles, 3 learnings, 3 insights,
  3 key problems, 3 components. Plus "Kill your darlings."
- **`caseStudies.js` `product-recommendations`** has a copy-pasted description
  from influencer-marketing on a haircare product. It's `enabled: false` today,
  so it isn't live — but it ships that bug the moment it's turned on.
- **`Home.jsx:295` hardcodes its own `caseStudies` array** separate from
  `src/data/caseStudies.js`, and they've drifted ("Enroll More Students" vs
  "Improve Beauty School Enrollment").

---

## 2. ChekOut assets — migrated

Sourced from `~/Documents/work/chekout-ai/{sentry-skin-website,chekoutai-frontend,design}`.
Full inventory in **`CHEKOUT-ASSETS.md`**.

`public/images/Case Studies/CK/` (5.6MB) · `public/videos/Case Studies/CK/` (45MB)

| Folder | Contents |
|-|-|
| `current/` | Redesigned chat + rec panel — desktop, mobile, hero |
| `before/` | Jan 2026 chat panel — pairs with `current/` as a before/after |
| `cases/` | 3 shopper scenarios (question, product, bundle) |
| `motion/` | 3 persona spots × raw + composited-with-UI |
| `builder/` | Old wizard walkthrough + embed flow |
| `chat/` `clients/` `products/` `dashboard/` `builder/` | Stills, 13 client logos, Nuele product cards |

Videos are 1280w max, h264 + VP9 + poster, audio stripped. Largest single file
5.4MB — within the <10MB budget in CLAUDE.md.

Two things to know:

- **`builder/agent-builder-full.mp4` is 2:58 and needs trimming.** It's also
  stale — verified frame-by-frame that it predates the prompt generator (the
  persona field is still a plain textarea) and never opens the Analytics tab.
  Use it as a "before" only.
- **The 13 client logos in `images/…/CK/clients/`** are the strongest shipping
  evidence on the site — no existing case study even has a live link.

---

## 3. What still needs capturing

Two surfaces have no usable asset in any repo: the **prompt generator** and the
**analytics dashboard**. Record these manually.

Target **app.chekout.ai** (not localhost — see "Why the harness is parked"),
logged in as `namit@chekout.ai`, Admin Mode on, merchant `kivakube`.

### Priority 1

**Prompt generator** — `/ai-agent`, AI Persona step
1. Land on the persona form, system prompt empty
2. Pick a theme from "Select Prompt Theme"
3. Click **Auto-generate from catalog**
4. Hold on "Analyzing your catalog…" (~30s, trim in post)
5. Slow-scroll the filled prompt, persona, and Top-3 Questions
6. If a prompt already exists, catch the "Replace with auto-generated content?" dialog

**Analytics dashboard** — `/dashboard` → Admin Mode on → `kivakube` → View
1. Full top-to-bottom scroll once the board settles
2. Top metrics row (Visitors / Revenue / Attributed Orders / Engagement)
3. Total Visitors card — the new-vs-returning split shipped this cycle
4. Hover one insight tooltip
5. Click a keyword in Most Used Keywords → Conversation Highlights filters + expands
6. Change the date range, let the board re-query

### Priority 2

- Wizard spine — StepIndicator 0→1→2, plus the SyncProcess catalog-pull animation
- Customize agent — color/avatar change with the live widget preview alongside

### Skip

Chat, recommendation panel, embed flow, motion b-roll — already in `CK/`.
Don't re-shoot the old builder walkthrough; its value is that it's a "before".

### Recording notes

- Kill the Next.js dev-tools badge and browser extensions before recording
- 1280w or 1440w, no audio — transcode to mp4 + webm + poster to match the rest
- `kivakube` has the richest data; check nothing store-identifying leaks in

---

## 4. Why the capture harness is parked

Archived under `tools/chekout-capture/` (see its README). It does **not** run
from this repo — it belongs in `chekoutai-frontend`.

It reached fully working: Firebase-IndexedDB auth replay, Admin Mode toggle,
merchant load, and a 16-card sweep that names each shot from the card's own
heading. Four fixes landed getting there:

1. Session moved to the per-target `.auth/<slug>/` layout `shared.ts` expects
2. Admin Mode toggle via `dispatchEvent` — MUI's Switch input is a zero-opacity
   overlay under a Stack that wins hit-testing, so `.check()` timed out and
   `.check({force:true})` delivered the click to the Stack instead
3. `assertNoDevOverlay()` — a run "passed" while producing 17 screenshots of a
   Next.js error dialog. Skeletons unmount on rejection the same as on success,
   and the overlay has DOM, so nothing caught it
4. Junk stills cleared

**Blocked on environment, not code.** Against localhost:
`NEXT_PUBLIC_SHOPIFY_SYNC_BASE_URL=http://localhost:8000` with nothing
listening → no synced catalog → the generator button never renders. And the
dashboard hits a failed `apiRequest` plus a 403 `Invalid access token` from
Databricks. Production has the real catalog and analytics, but sessions are
origin-scoped so it needs a fresh manual login.

Verified final state: guard fires correctly, 0 junk stills written.

---

## 5. Next steps

1. **Fix the credibility bugs** (§1) — model-vendor contradiction, the
   `product-recommendations` description, and the Home.jsx array duplication.
   Fast, and they're the highest-damage items.
2. **Record the two flows** (§3).
3. **Decide the ChekOut shape.** `App.jsx:33` documents a planned split into
   `/chekout-builder` and `/chekout-agent`. Recommend **one** case study framed
   as merchant-side vs shopper-side — two thin studies read weaker than one
   substantial one, and checklist #4 rewards depth.
4. **Restructure the existing four** — cut the Manage Farms duplication, merge
   CV's `learnings` + `retrospective`, add `liveUrl` across the data layer,
   rewrite the "X, not Y" lines. Do this after ChekOut, so ChekOut's structure
   becomes the new template rather than inheriting the current one.
5. **Reorder the grid** — ChekOut first, CV, Manage Farms, Influencer
   Marketing, Clutch last; reframe Clutch as an exercise rather than leading
   with "Rejected".

---

## Refs

- Assets: `CHEKOUT-ASSETS.md`
- Parked harness: `tools/chekout-capture/` (+ its `SHOTLIST.md` for the wider
  promo set — billing, connectors, z-index explainer, multi-platform diagram)
- Source repos: `~/Documents/work/chekout-ai/{sentry-skin-website,chekoutai-frontend,design}`
- Live harness location: `chekoutai-frontend/e2e/capture/`
