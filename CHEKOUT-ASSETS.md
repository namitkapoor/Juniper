# ChekOut AI — asset manifest

Sourced from `~/Documents/work/chekout-ai/{sentry-skin-website,chekoutai-frontend,design}`
on 2026-07-27. Videos are 1280w max, h264 + VP9 + poster, audio stripped.
Nothing exceeds the 10MB video budget in CLAUDE.md.

Totals: images 5.6MB, videos 45MB.

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

## Shipping evidence

`images/…/CK/clients/` — 13 named merchants running the product: apto, audab,
billest, blackcat, bykind, christinevalmy, kivakube, maebridal, nelly, nuele,
nuthatch, pacsoul, timeless.

`images/…/CK/products/` — 4 Nuele product cards used in the rec panel demos.

## Still missing

Two surfaces have no usable asset in any repo:

1. **Prompt generator** — the "Auto-generate from catalog" flow in
   `components/AgentSetup/AIPersona.tsx`.
2. **Analytics dashboard** — only a generic mockup exists
   (`images/…/CK/dashboard/dashboard-mockup-tradeschool.png`) plus decorative
   `bar-chart.png` / `line-chart.png` in the app's own assets.

Capture script for both:
`~/Documents/work/chekout-ai/chekoutai-frontend/e2e/capture/` (see its README).
