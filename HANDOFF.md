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
