# ChekOut promo shot list

Master list of capture + authored assets for promoting the builder. Grounded in
the actual app surfaces (`components/…` paths cited). Two production paths — keep
them separate:

- **CAPTURE** — real UI, shot with the Playwright harness in `e2e/capture/`
  (Firebase-IDB auth already solved in `shared.ts`). Screen truth, low effort.
- **AUTHORED** — motion graphic / diagram built in After Effects / Rive / Lottie.
  For concepts a flat screen recording can't convey (layering, architecture).
  Capture only supplies an end-frame or reference.

Everything here is additive to the product code, same as the rest of `e2e/capture/`.

## Destination → format legend

| Dest | Code | Aspect | Length | Polish |
|---|---|---|---|---|
| Landing / website | `LAND` | 16:9 + 1:1 loop | 6–15s, autoplay-muted | highest |
| Investor / sales deck | `DECK` | 16:9 still or clip | 1 point each, ≤10s | medium |
| Social / short-form | `SOC` | 9:16 / 1:1, captioned | 10–20s | medium-high |
| Case study / portfolio | `CASE` | 1280w h264+vp9+poster | narrated, 20–60s | high |

Existing assets (per README — do **not** re-shoot): chat, recommendation panel,
embed flow, motion b-roll live in `sentry-skin-website/public/assets` + `design/`.

---

## 1. Data analytics — `components/Dashboard/*`  · CAPTURE

Real merchant data: `kivakube`, prod target, Admin Mode on. Prereqs in README.

| ID | Shot | Type | Dest | Notes |
|---|---|---|---|---|
| AN-01 | Full dashboard scroll-through, top→bottom | clip | LAND CASE | the hero "look how much it knows" moment |
| AN-02 | TopMetrics row settling in (Visitors / Revenue / Orders / Engagement) | clip | LAND DECK SOC | numbers counting up as charts draw |
| AN-03 | **New-vs-returning split** filling under Total Visitors | still+clip | DECK CASE | the card shipped this cycle; hero it |
| AN-04 | Total Sessions time-series draw-in | clip | LAND | `TotalSessions.tsx` area chart |
| AN-05 | Hover an insight tooltip (InsightTooltip) | clip | CASE SOC | shows it's insight, not just data |
| AN-06 | **Keyword → thread**: click a keyword, Highlights filter+scroll+expand | clip | CASE SOC DECK | the signature interaction; needs backend keyword deploy to actually filter |
| AN-07 | Product leaderboard w/ trend arrows | still | DECK | `ProductLeaderBoard.tsx` |
| AN-08 | Sentiment / intent / language / device / location card sweep | stills | DECK CASE | per-card, named by heading (harness already walks these) |
| AN-09 | Date-range change re-querying the whole board | clip | CASE | `DateRangeSelector` → charts re-draw |
| AN-10 | Conversion funnel (Sankey) | still | DECK | `ConversionFunnel.tsx` |

## 2. Agent creation — `components/AgentSetup/*`  · CAPTURE

The 3-step wizard. Prompt-generator stills already done (`portfolio.spec.ts`);
the *flow* is the gap. Merchant needs a synced catalog (`canAutoGeneratePrompt`).

| ID | Shot | Type | Dest | Notes |
|---|---|---|---|---|
| AG-01 | StepIndicator walking 0→1→2 | clip | LAND CASE | `StepIndicator.tsx` — the spine of the story |
| AG-02 | AIPersona: auto-generate prompt from catalog (empty→analyzing→filled) | clip | LAND DECK SOC CASE | the signature "it writes itself" moment |
| AG-03 | Theme picker seeding the prompt | clip | CASE | `AIPersona.tsx` |
| AG-04 | KnowledgeBase file upload → indexed | clip | CASE DECK | `KnowledgeBase/` |
| AG-05 | SyncProcess animation (catalog pulling in) | clip | LAND CASE | `SyncProcess.tsx` — already animated, just capture |
| AG-06 | CustomizeAgent: color/avatar → live widget preview updates | clip | LAND SOC | `Channel/CustomizeAgent.tsx` — before/after |
| AG-07 | End-to-end wizard, sped up | clip | CASE | full arc, 30–45s |

## 3. Multi-platform engine — `components/AgentSetup/Channel/*`  · AUTHORED + CAPTURE

"One engine, many storefronts." The *engine* is architecture → diagram. The
connector UI is capturable.

| ID | Shot | Type | Dest | Notes |
|---|---|---|---|---|
| MP-01 | Animated architecture: one core → Shopify / Shopline / Woo / Instagram | AUTHORED | LAND DECK CASE | the actual differentiator; no single screen shows it |
| MP-02 | AgentChannels grid — all connectors | still | DECK | `Channel/AgentChannels.tsx` |
| MP-03 | Connect-a-store flow (OAuth handoff, "Connected" state) | clip | CASE | ⚠️ don't expose real store tokens/URLs |
| MP-04 | HtmlEmbed snippet → widget appears on a page | clip | LAND CASE | `Channel/HtmlEmbed.tsx` |
| MP-05 | Instagram connection details | still | DECK | `Channel/InstagramConnectionDetails.tsx` |
| MP-06 | Platform logos assembling (Shopify/Shopline/Woo/IG) | AUTHORED | SOC | short logo-fan sting |

## 4. Billing / subscription — `components/Billing/*`  · CAPTURE (bounded)

⚠️ Capture UI only. **Never** real card entry, invoice numbers, or a live Stripe
receipt. Shoot to the checkout boundary and stop, or use a test-mode plan state.

| ID | Shot | Type | Dest | Notes |
|---|---|---|---|---|
| BL-01 | Plan tiers table | still | DECK LAND | `Billing/BillingTable.tsx` |
| BL-02 | Current plan card + tier badge | still | DECK | `Billing/CurrentPlan.tsx`, `getPlanIcon.tsx` |
| BL-03 | Upgrade CTA → checkout boundary (stop before card) | clip | CASE | hard stop at Stripe redirect |
| BL-04 | Subscription success state | still | CASE | `pages/subscription/success.tsx` — use test data |

## 5. z-index / agent layering — `components/Chatbot/*`  · AUTHORED (+ live end-frame)

Your instinct is right: this is a **vector motion explainer**, not a screen
capture. The concept is stacking order — launcher `zIndex:6` floating over the
merchant's DOM, chat panel above content (`ChatBoxView.tsx` z-layers 1→20).

| ID | Shot | Type | Dest | Notes |
|---|---|---|---|---|
| ZX-01 | Exploded layers: store page → launcher → panel → overlay, pulling apart on Z | AUTHORED | LAND SOC CASE | the tiny UI vector video you described |
| ZX-02 | Widget floating above real store content (assembled end-frame) | CAPTURE | LAND SOC | the "resolves to this" real shot ZX-01 lands on |
| ZX-03 | Launcher → open → chat panel stacks above page | clip | SOC | `ChatLauncher.tsx` → `ChatBoxView.tsx` |
| ZX-04 | Recommendation panel sliding over content | clip | LAND | already exists as b-roll — reuse |

---

## Priority order (proposed)

1. **AN-01/02/03/05/06** — analytics flow (starting here; harness extends cleanly)
2. **AG-02, AG-01** — the "it writes itself" wizard moment
3. **ZX-01** — z-index explainer (authored; longest lead time, start the storyboard early)
4. **MP-01** — engine diagram (authored)
5. Billing + remaining connectors — quick stills, batch last

## Open questions before authored work

- ZX-01 / MP-01 / MP-06 need a motion tool + design source. Rive vs After Effects
  vs Lottie? (Rive gives you interactive/loopable web assets for LAND.)
- Which merchant for the capture set — `kivakube` has the richest data but check
  nothing store-identifying leaks into a public asset.
