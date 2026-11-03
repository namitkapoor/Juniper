# ChekOut footage (phase 1)

Source: `Juniper/public/videos/Case Studies/CK/`. All four were already web-encoded at
the stage's sizes (h264 mp4 + vp9 webm, ~0.7-1.1 MB), so they are byte copies, not
re-encodes. Naming follows `live-rosendahl-mobile.*`: flat `live-<store>[-mobile]`,
`.jpg` poster (what `fill.poster` uses today), `.webp` poster alongside where the source
had one. The stage's `<video>` takes one `src` (mp4); the webm is there for a later
`<source>` list. No light/dark variants: only `demos/` assets have `-light` siblings
(`hasLight()` in content.js), and these are not demos.

`live-rosendahl.mp4` is already taken by the 84.8 s cases cut, so the new 18.4 s desktop
clip is `live-rosendahl-desktop.*`. None of these are in `tools/content/manifest.json`
yet (phase 2: add w/h/bytes/dur there if the engine needs them).

| File | Size | WxH | Duration | Poster |
|-|-|-|-|-|
| live-kivakube.mp4 / .webm | 1,087,648 / 899,290 | 1440x900 | 16.63 s | .jpg 136 KB, .webp 70 KB |
| live-kivakube-mobile.mp4 / .webm | 929,179 / 666,743 | 390x844 | 19.70 s | .jpg 47 KB, .webp 25 KB |
| live-rosendahl-desktop.mp4 / .webm | 1,114,973 / 931,978 | 1440x900 | 18.40 s | .jpg 129 KB, .webp 70 KB |
| prompt-generator.mp4 / .webm | 808,791 / 704,041 | 1280x698 | 17.13 s | .jpg 105 KB |

All eight video files decode end to end (`ffmpeg -f null`). Durations from ffprobe.

Not copied: `dashboard/analytics-dashboard-flow.mp4` (47.9 s). The extra 12 s over the
stage's 35.9 s crop (`analytics.mp4`) are skeleton loaders and an "Upgrade your plan"
card. Nothing new.

---

## live-kivakube (desktop, storefront)

Intended deck: ChekOut, "the agent working" (desktop). Pairs with live-kivakube-mobile.

- 0-1 s: KivaKube home ("The only portable BBQ..."). Launcher pill "Ask me about KivaKube" with two suggestion chips above it.
- 2-3 s: widget opens on its welcome screen: KivaKube logo, "Hey, I'm Herb!", "I can answer your questions".
- 4-5 s: header docks; greeting bubble and a suggested question appear; shopper types "What's your best seller?".
- 6-7 s: question sent, halftone "thinking" field.
- 8 s: the product sheet fades in to the left while images are still blank (about 1 s of empty frames).
- 9-11 s: KivaStand sheet ($449) plus two cards (KivaStand, Founder's Edition $1099, struck $1249); agent reply "Our KivaKube Founder's Edition is a customer favorite..."; shopper types "Which one suits a small patio?".
- 12-14 s: sent, thinking.
- 15-16 s: reply "The KivaKube Founder's Edition is an excellent choice for smaller spaces..."

Alt: "On the KivaKube store, a shopper asks the ChekOut agent for the best seller, then which one suits a small patio. The agent opens a product sheet and recommends the Founder's Edition."

## live-kivakube-mobile

Intended deck: ChekOut, "the agent working" (mobile), next to the desktop clip or in place of it at narrow widths.

- 0 s: KivaKube mobile home with two suggestion chips and the launcher.
- 1-3 s: widget opens full screen, welcome, shopper types "What's your best".
- 4 s: greeting "Hi there! Welcome to Kiva. How can I help you today?"
- 5-9 s: "What's your best seller?" then a long reply: "I don't have a specific 'best sellers' category to show you right now. However, I can help you find products..."
- 10-13 s: shopper types "Which one suits a small patio?", thinking.
- 14-15 s: the KivaStand product sheet ($449, Add to Cart) slides up and covers the chat.
- 16-19 s: the chat sheet comes back over it: "The KivaKube Founder's Edition is perfect for small patios..." with two product cards.

Alt: "The same KivaKube conversation on a phone: the agent answers, opens a product sheet, then returns to the chat with two recommended products."

## live-rosendahl-desktop

Intended deck: ChekOut, "the agent working" (desktop, second store). Mobile pair is the existing live-rosendahl-mobile.

- 0-1 s: Rosendahl home ("Where every pour becomes a moment"). Chips "How can I help you shop?" and "What are your best-selling products right now?", launcher "Let's Shop Together".
- 2-3 s: widget opens in the store's wine-dark theme: agent "Søren", "Learn About Our Brands". The site's hero carousel moves on behind it.
- 4-7 s: greeting plus two suggested questions; shopper types "I'm looking for a wedding gift under $150".
- 8-9 s: sent, thinking.
- 10-11 s: product sheet (Rosendahl Premium Champagne glasses) plus cards ($34.95, $110); reply "Here are some lovely wedding gift ideas under $150 that celebrate Danish design and craftsmanship." Shopper types "Which one is best for everyday use?"
- 12-15 s: sent, thinking.
- 16-18 s: sheet swaps to the Kähler Hammershøi Bonbonnière ($55, $40); reply "For everyday use, these timeless pieces are perfect for starting their life together."

Alt: "On Rosendahl's store, a shopper asks the ChekOut agent, Søren, for a wedding gift under $150, then for something for everyday use. The agent swaps the product sheet to match."

## prompt-generator (merchant builder)

Intended deck: ChekOut, builder or onboarding ("how a merchant sets the agent up"). It replaces nothing on the stage today.

- 0 s: Agent configuration, "Agent information" form: name "Mark", Prompt theme "General Retail (The Shopping Assistant Approach)", system prompt holding a template with [BRAND NAME] placeholders.
- 1-2 s: cursor goes to "Regenerate from catalog".
- 3 s: modal "Replace with auto-generated content?", then Replace.
- 4-6 s: the button shows "Generating your..."; the template is still in place.
- 7-11 s: scrolls the template (History, What we sell, Behavior, Off-limits, Sales behavior).
- 12-16 s: the generated prompt replaces it: "The e-commerce store 'chekout-dev' specializes in snowboards...", with answers to top questions. The "Define your user" section follows.

Alt: "In the ChekOut builder, a merchant clicks Regenerate from catalog. The template prompt is replaced by one written from the store's own products and policies."

---

## Flags

| Clip | Time | Issue | Severity |
|-|-|-|-|
| prompt-generator | 0-17 s, top right | Account menu shows **namit@chekout.ai**, Namit's own work email. Not a third party, but it is an email address in a public portfolio. Crop the top 40 px or blur it before shipping. | private info, low |
| prompt-generator | 12-17 s | The generated prompt describes **"chekout-dev"**, Shopify's demo snowboard catalog ("The Collection Snowboard: Liquid"...). Reads as a test store. Use 0-11 s, or caption it as the dev store. | off-brand |
| live-kivakube-mobile | 4 s | Greeting reads **"Welcome to Kiva."** (brand truncated). | off-brand |
| live-kivakube-mobile | 5-9 s | Agent answers "I don't have a specific 'best sellers' category..." Weak answer, held for 5 s. A trim to 10-19 s avoids it. | off-brand |
| live-kivakube-mobile | 14-15 s | The product sheet covers the agent's reply until the chat sheet returns at 16 s. | known UX issue |
| live-kivakube | 8 s | Product sheet shows blank image slots for about 1 s while images load. Shorter than the 5 s seen before. | minor |
| live-rosendahl-desktop | whole clip | No accessibility-button overlap on desktop; that overlap is on the existing live-rosendahl-mobile. | none here |
| analytics.mp4 (existing) | 2-24 s | Dashboard shows **$0.00 total revenue and 0 attributed orders** next to 6,637 visitors. That contradicts the case study's 20% ATC story if anyone reads the numbers. | off-brand, check |
| analytics.mp4 (existing) | 28-36 s | "Conversation highlights" lists real shopper sessions: device, country (United States), first question, transcript. No names or emails visible at this resolution, but the transcripts are real shoppers' words. | private-ish, check |

Avatar on KivaKube's agent bubble is the merchant's chosen agent photo (a face). It belongs to the store config, not a shopper.

---

## Widget part crops (component plate sample)

`parts/kivakube-*.webp` are cut from live-kivakube at 16.2 s (1x, so low resolution):
header, agent-bubble (the dark bubble variant: `agent-bubble-ink-dark` on black), product-card,
suggestion-chip, composer, footer. Phase 2 proposal: show them as an HTML plate on the
token sheet's neutral ground (#ececea), each with a text caption naming its tokens
(`radius/bubble-ai`, `shadow/card`, `radius/pill`, `color/widget/footer-plate`), not burnt
into the image. For a sharp plate, recapture the widget at DPR 2 instead of cropping 1x
footage.
