# ChekOut AI — asset manifest

Sourced from `~/Documents/work/chekout-ai/{sentry-skin-website,chekoutai-frontend,design}`
on 2026-07-27. Videos are 1280w max, h264 + VP9 + poster, audio stripped.
Nothing exceeds the 10MB video budget in CLAUDE.md.

**Updated 2026-07-28:** added the live **Analytics dashboard — narrated flow**
capture (see that section). This fills one of the two previously-missing surfaces.

Totals: images 5.6MB, videos ~46MB.

## Current UI — the redesigned chat + recommendation panel

Dark-teal gradient chat panel with agent avatar, thumbs up/down feedback, and
"Powered by ChekOut AI" footer, plus the floating stacked product cards over
the PDP. Already web-optimized at source; copied unchanged.

| File | Shows |
|-|-|
| `videos/…/CK/current/app-experience-1.*` | Rec panel + chat, desktop, browser-framed |
| `videos/…/CK/current/app-experience-3.*` | Same, mobile |
| `videos/…/CK/current/maria-on-phone.*` | Hero clip |
| `images/…/CK/chat/chat-current.png` | Current chat, still |
| `images/…/CK/chat/rec-panel-current.png` / `.svg` | Current rec panel, still |

## Before state

| File | Shows |
|-|-|
| `videos/…/CK/before/rec-panel-before.*` | Jan 2026 chat: white rounded panel, emoji + blue send button, no avatar, no feedback |

Pairs with `current/app-experience-1` as a before/after slider. This is the
only true before we have — there is no earlier capture of the rec panel alone.

## Shopper scenarios

| File | Shows |
|-|-|
| `videos/…/CK/cases/question.*` | Product question |
| `videos/…/CK/cases/product.*` | "A product you don't sell yet" |
| `videos/…/CK/cases/bundle.*` | Bundle recommendation |

## Motion — raw vs. composited

Three persona spots, each as raw footage and as the finished composite with the
agent UI animated in. Cut from `design/Product Marketing Animations.aep`
(After Effects source is in that repo if the case study wants to show it).

`motion/{maria,old-man,young-mother}-{raw,with-ui}.*`

Posters for the `-with-ui` clips are pulled at 72% duration so the composited
UI is actually visible in the still.

## Builder — STALE, use as "before" only

`videos/…/CK/builder/agent-builder-full.*` is the Mar 2 2026 capture: 3-step
wizard (AI Persona → Knowledge Base → Channel) → Connect your online store →
Define your user → Shopify theme editor embed. **2:58 long — trim before use.**

It predates the prompt generator. The "Describe your ideal customer persona"
field is still a plain textarea, and the Analytics Dashboard nav item is never
opened.

| File | Shows |
|-|-|
| `videos/…/CK/builder/agent-builder-full.*` | Full old wizard walkthrough (trim) |
| `videos/…/CK/builder/embedding-agents.*` | Embed flow, 24s |
| `images/…/CK/builder/platform-connection.jpg` | Platform connection step |
| `images/…/CK/builder/shopify-app-thumbnail.jpg` | Shopify app listing thumbnail |

## Analytics dashboard — narrated flow (NEW, 2026-07-28)

The live analytics dashboard, captured as a continuous ~48s walkthrough: top
metrics settling in → slow scroll through every card → hovering an **insight
tooltip** ("kivakube is your most searched term…") → the signature **keyword →
conversation-thread** interaction. Real merchant data throughout (`kiva`, Mar–Jul
2026 range: 6,637 visitors, real conversation threads, keyword donut, sentiment).

This is the CURRENT dashboard — the one with insights, clickable keywords, and the
new-vs-returning visitor card. It supersedes the generic dashboard mockup.

| File | Shows |
|-|-|
| `videos/…/CK/dashboard/analytics-dashboard-flow.*` | Full narrated dashboard walkthrough, ~48s |
| `videos/…/CK/dashboard/analytics-dashboard-flow-poster.jpg` | Poster @40s: 6,637 visitors + open insight tooltip + keyword donut |

**Trim before use:** the first ~12s is the date-range being set (dropdown pick)
plus load skeletons — cut in for the populated board. The insight-tooltip and
keyword-click beats are in the back half.

**Capture provenance (important for re-shoots):** captured against the **canary**
build, NOT app.chekout.ai — the new dashboard features (insight lightbulbs,
clickable keywords, new-vs-returning card) are not on prod yet, so a prod capture
would silently miss them. Merchant `kiva` (real data on the prod backend);
`kivakube` only exists in the dev BigQuery. Spec:
`chekoutai-frontend/e2e/capture/analytics-flow.spec.ts`.

## Shipping evidence

`images/…/CK/clients/` — 13 named merchants running the product: apto, audab,
billest, blackcat, bykind, christinevalmy, kivakube, maebridal, nelly, nuele,
nuthatch, pacsoul, timeless.

`images/…/CK/products/` — 4 Nuele product cards used in the rec panel demos.

## Still missing

One surface still has no live capture (the older generic mockup only):

1. **Prompt generator** — the "Auto-generate from catalog" flow in
   `components/AgentSetup/AIPersona.tsx`. Stills exist in the capture harness
   (`portfolio.spec.ts`) but haven't been brought into Juniper yet; the narrated
   *flow* version (shot AG-02 in the shot list) is the next capture to do.

~~Analytics dashboard~~ — **DONE 2026-07-28**, see the section above.

Capture tooling:
`~/Documents/work/chekout-ai/chekoutai-frontend/e2e/capture/` — see its README,
plus `SHOTLIST.md` (full promo shot list) and `analytics-flow.spec.ts` (the flow
capture that produced the dashboard clip).
