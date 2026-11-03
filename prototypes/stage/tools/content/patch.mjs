// Copy rewrite for the stage prototype. Applies text-only changes, guarded:
// a field is changed only if its current value still equals the snapshot
// taken before drafting (so a concurrent edit is never clobbered; it is reported).
import fs from "node:fs";
import path from "node:path";

const DATA = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const SNAP = path.join(path.dirname(new URL(import.meta.url).pathname), "snap");
const skipped = [];
const applied = { n: 0 };
const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------------------------------------------------------------- decks
const DECKS = {
  "ck-merchant-outcomes": {
    thesis: "On Kivakube, 20% of add-to-carts came through the agent, and the dashboard shows the merchant the questions behind them.",
    add: [{ id: "ck-0-problem", weight: 1, rfrom: ["ck-cart-prose"],
      text: "THE PROBLEM: Shoppers on a merchant's store had questions a product grid can't answer. Once the agent went live, the merchant's first question was what shoppers were asking it." }],
    fills: {
      "ck-sessions": { label: "shopper sessions with the agent, across all live stores" },
      "ck-brands": { label: "merchants running the agent on their own store" },
      "ck-engagement": { label: "engagement rate on one live store (conversations of 3+ turns)" },
      "ck-cart-prose": { text: "HOW: Shoppers add to cart inside the chat, and View cart opens the store's own cart and checkout, so there is no second cart to reconcile. The dashboard then shows the merchant what the agent sold and, one click on a keyword later, what shoppers asked." },
      "ck-top-metrics": { caption: "One live store's top line: visitors and engagement.",
        explain: "This is the top of the merchant dashboard on a live store. Engagement counts only visitors who sent the agent a real message. Merchants asked what the agent was worth, and this answers it in their own numbers.",
        kpi: "ck-engagement" },
      "ck-analytics": { caption: "An insight flags the most searched term; clicking the keyword opens the conversations that mention it.",
        explain: "The dashboard running on Kivakube's data. Watch the insight tooltip turn a number into a next step (check pricing and availability for the most searched term), then a keyword click open the actual threads. Merchants wanted to know what shoppers ask, so the answer is the conversations themselves, not a chart." },
    },
  },
  "ck-conversation": {
    thesis: "The agent answers first, and what retrieval finds decides the layout: words when nothing fits, one card for one match, a bundle when products go together.",
    add: [{ id: "ck-0-conv-problem", weight: 1, rfrom: ["ck-reading-surface"],
      text: "THE PROBLEM: In January the panel read like a support widget: small type, tight leading, and a canned \"Got it! I recommend:\" above a pile of cards, whatever the shopper had asked." }],
    fills: {
      "ck-reading-surface": { text: "HOW: In July I re-set the panel as a reading surface, with larger type, open leading, and names and prices in bold inside the sentence. Then I let retrieval pick the shape; the three clips show each one, and the shopper never picks a mode." },
      "ck-shape-product": { caption: "One clear match: one card, and a sentence saying why it fits.",
        explain: "A shopper asks something with one clear answer in the catalog. Watch the reply lead with the reason, then show a single card instead of a carousel. One intent gets one product, so the shopper isn't left comparing things they didn't ask for." },
      "ck-shape-question": { caption: "Nothing in the catalog fits, so no cards: the agent just answers.",
        explain: "Here the question has no product answer. Watch for what doesn't appear: no cards, no forced recommendation, just a plain reply. The old panel put cards under every message; this one only shows products when retrieval actually found some." },
      "ck-shape-bundle": { caption: "Products that only work together arrive as one set.",
        explain: "The shopper needs several items that belong together. Watch them arrive as a single set in the chat rather than as unrelated cards. The layout comes from what retrieval returned, not from a mode the shopper picked." },
      "ck-thinking": { caption: "While the agent works, the thinking state holds the shopper's place; then the reply fades in.",
        explain: "A static panel can't show that the agent is working. Watch the thinking state hold the spot where the answer will land, then the newest reply fade in word by word. The motion tells the shopper something is happening, and a static cue stays once it stops." },
      "ck-add-to-cart": { caption: "Tap add and the card confirms in place, then keeps showing the quantity.",
        explain: "The shopper adds a product without leaving the conversation. Watch the card itself confirm the add and keep the quantity visible afterwards, so the tap visibly landed and the thread stays where it was." },
    },
  },
  "ck-platform-build": {
    thesis: "A merchant types one brand color, previews the real widget, pastes one snippet, and is live in 5 to 30 minutes; I built the builder and widget mostly with Claude Code.",
    add: [{ id: "ap-0-problem", weight: 1, rfrom: ["ap-preview"],
      text: "THE PROBLEM: The agent has to live on a page full of someone else's fonts, colors, cookie banner and cart drawer, carry that store's brand, and stay readable when the brand color is pale yellow or neon." }],
    fills: {
      "ap-time": { label: "from starting setup to a branded agent live on a merchant's store" },
      "ap-preview": { text: "HOW: The builder's preview was a hand-built copy that drifted from what shipped. In July 2026 I swapped in the real widget in an iframe and fed it the merchant's unsaved settings, so what they edit in the clip is what shoppers get." },
      "ap-prompts": { label: "prompts to Claude Code over 14 sessions building the builder and widget" },
      "ap-ios": { text: "ON PHONES: In iOS Safari, pulling the chat past its top triggered pull-to-refresh and reloaded the merchant's page mid-conversation. I stopped the gesture at the widget's edge." },
      "ap-merchants": { label: "merchants live, all on the same codebase" },
      "ap-embed": { caption: "Watch the preview change as the settings change, then the one snippet a merchant pastes into their Shopify theme.",
        explain: "The builder's last setup step. On the left are the brand settings; on the right is the real widget, not a mockup, updating as they change. Then the embed snippet goes into a Shopify theme, which is the whole install. The old preview was a copy that drifted from what shipped, and this replaced it." },
    },
  },
  "cv-results": {
    thesis: "Visitor conversion went from 10% to 23% and brought in $120K in enrolled revenue, while each officer got about 3 hours a day back.",
    add: [{ id: "cv-0-problem", weight: 1, rfrom: ["cv-sorts"],
      text: "THE PROBLEM: At Christine Valmy, a school that trains estheticians and cosmetologists, prospective students filled in a form and waited for a reply, and enrollment officers answered the same questions on every call." }],
    fills: {
      "cv-conv": { label: "visitor conversion, before and after the agent" },
      "cv-rev": { label: "in enrolled revenue for the school" },
      "cv-hours": { label: "saved per enrollment officer, per day" },
      "cv-bad": { label: "as many bad leads flagged for officers" },
      "cv-sorts": { text: "HOW: The agent answers from the school's own content through RAG, and an automated pipeline keeps class schedules fresh. It sorts every lead into a priority bucket and flags the bad ones, so officers call the students who are ready first." },
      "cv-agent-reply": { caption: "A student asks what she can study after high school; the agent answers while the inquiry form stays beside it.",
        explain: "The shipped agent on the school's site. Watch it answer a new student's question from the school's own course content, with the short inquiry form still in reach. Students used to fill in the form and wait; now the answer comes first and the officer gets a lead that already knows the options." },
    },
  },
  "cv-testing": {
    thesis: "Testing showed students skipped my tile grid and went looking for Instagram, so I cut it and fixed one problem per session across three rounds.",
    add: [{ id: "cv-0-test-problem", weight: 1, rfrom: ["cv-bento"],
      text: "THE PROBLEM: I wanted enrollment to feel like an app: a student ID card that filled in as you chatted, and a bento grid of tiles so nobody had to think of a question first. It was a guess until students used it." }],
    fills: {
      "cv-cut": { text: "HOW: Students skipped the tiles and kept asking \"Do you have Instagram?\" The tiles read as marketing; photos from real students did not. I cut the grid and the ID card, kept the form, the chat and the social links, then fixed one thing per session: dropdowns, link placement, Spanish." },
      "cv-testing-payoff": { label: "visitor conversion once the tested design shipped" },
      "cv-bento": { caption: "The design I loved: every topic one tap from the chat. Students skipped it.",
        explain: "My first concept: green tiles for pricing, courses, alumni and schedules around the chat, so every tap would also tell officers what a student cared about. In testing, students went past the tiles and asked for Instagram instead. This is the design that testing killed." },
      "cv-final": { caption: "What survived testing: a short form, the chat, and social links in a row underneath.",
        explain: "The design that shipped after three rounds of testing. Compare it with the tile grid: everything students ignored is gone, and the social links they kept asking for sit right under the chat.",
        kpi: "cv-testing-payoff" },
      "cv-dd-before": { caption: "Session one, before: students read the Skin and NYC dropdowns as suggested topics.",
        explain: "I put location and course dropdowns beside the message box because structured values were easier to parse. In the first session students read them as suggested topics and stopped typing their own question. That was the first thing to go." },
      "cv-dd-after": { caption: "After: one message box; the agent picks location and course out of what the student types.",
        explain: "The fix from session one. The dropdowns are gone and the agent reads location and course from plain conversation, so the student just asks." },
      "cv-spanish": { caption: "Session three: many applicants spoke Spanish first, so the form and the agent switch languages.",
        explain: "The same form and agent in Spanish, with every label translated, not just the replies. Many applicants spoke Spanish first, and the enrollment officer's quote credits this switch with more inquiries from the school's target students." },
    },
  },
  "cv-build": {
    thesis: "I built it as a React widget inside the school's WordPress site, connected it to their systems through n8n on GCP, and audited it to WCAG AA before launch.",
    add: [{ id: "cv-0-build-problem", weight: 0.9, rfrom: ["cv-stack"],
      text: "THE PROBLEM: The school's site runs on WordPress, its enrollment data lives in other systems, and many applicants speak Spanish first. The agent had to fit inside the existing site and work in both languages." }],
    fills: {
      "cv-stack": { text: "HOW: The chat ships as a React widget in a WordPress plugin, with n8n on GCP bridging it to the school's systems. I tested the agent across the major models, launched it on Claude, and it now runs on Gemini." },
      "cv-a11y": { text: "BEFORE LAUNCH: I audited the widget against WCAG AA. The language toggle became a combobox with keyboard support and screen-reader announcements, and the topic buttons got a labeled group." },
      "cv-trade-school": { text: "THEN: In October 2025 the work became a vertical: a Trade School page, a site-wide product toggle and a separate trade-school chat route on the ChekOut company site." },
      "cv-mobile": { caption: "On a phone: the bilingual greeting, a question about makeup classes, and the inquiry form below.",
        explain: "The same widget on a phone. Watch the order: the agent greets in both languages, answers a question about makeup classes, and the inquiry form starts underneath: the same pieces that survived testing on desktop." },
      "cv-laptop": { caption: "The enrollment agent open on the school's site.",
        explain: "The live Christine Valmy site with the agent open. It runs inside the school's own WordPress site as a plugin, not on a separate page, so students meet it where they were already looking at courses." },
    },
  },
  "ky-live": {
    thesis: "Yes: since April 2026 it has captured 454 roles and logged 341 applications, and the public Job Hunt page shows those totals live.",
    add: [{ id: "ky-0-problem", weight: 1, rfrom: ["ky-why"],
      text: "THE PROBLEM: Applying well means a tailored one-page resume for every role and knowing where each application stands. I wanted all of that to start from my phone, the moment I found a role." }],
    fills: {
      "ky-captured": { label: "roles captured into my pipeline", period: "as of Nov 2, 2026" },
      "ky-sent": { label: "of those marked applied", period: "as of Nov 2, 2026" },
      "ky-interviews": { label: "applications that reached an interview", period: "as of Nov 2, 2026" },
      "ky-resumes": { label: "tailored resumes, for me and other candidates", period: "as of Oct 15, 2026" },
      "ky-why": { text: "HOW: I have run my search on it since April 2026. Adding a role from my phone writes a tailored one-page resume to Drive and logs the application; the screenshot is what a signed-out visitor sees, with companies and people left out." },
      "ky-jobhunt-shot": { caption: "Signed out, Nov 2, 2026: the totals are live; the companies and people are not shown.",
        explain: "The public Job Hunt page as any visitor sees it. The pipeline numbers come from the same system that runs my search, so they move as I apply. Company names and contacts are left out on purpose; the shape of the search is public, the people in it are not.",
        kpi: "ky-captured" },
    },
  },
  "ky-guards": {
    thesis: "Code, not the model, decides what a resume may say: a fit gate, fixed facts, a QA gate and a leak guard sit between the model and the PDF.",
    add: [{ id: "ky-0-guards-problem", weight: 1, rfrom: ["ky-incident"],
      text: "THE PROBLEM: On June 17 a tailored resume went out with the agent's own keyword notes printed under SKILLS. The model's working notes had reached the page." }],
    fills: {
      "ky-incident": { text: "HOW: The fix landed October 15: a leak guard, a QA gate and evals between the model and the page, and a tailoring agent with no tools. Code also picks the base resume, and four facts (titles, companies, dates, degrees) can never be renamed." },
      "ky-checks": { label: "agent checks every resume passes before it reaches Drive" },
      "ky-fitgate": { text: "BEFORE TAILORING: Since October 2026 a fit gate scores the posting, maps its duties to my background, and records a verdict that steers the tailoring and QA steps after it." },
      "ky-pagegate": { text: "ONE PAGE: The build refuses to publish a resume still over one page at the tightest layout, runs one trim pass and re-lints before rebuilding." },
    },
  },
  "ky-open": {
    thesis: "Before letting other job seekers sign in in October 2026, I scoped every route to an access tier, rate-limited everything that spends tokens, and made the tests unable to touch real data.",
    add: [{ id: "ky-0-open-problem", weight: 1, rfrom: ["ky-live/ky-jobhunt-shot#1", "ky-418"],
      text: "THE PROBLEM: By May a second person was using it, but the agents run on my machine, spend real model credits, and keep everyone's search beside mine. Letting more people in could not expose anyone's data or run up the bill." }],
    fills: {
      "ky-tiers": { text: "HOW: In October 2026 I scoped every route and panel to the viewer: visitors see public data, candidates see only their own pipeline, and I see everything. Google sign-in checks candidates against an allowlist." },
      "ky-email-cap": { label: "emails at most in any rolling 24 hours, enforced by a log table" },
      "ky-418": { label: "what a view-only test gets for any write, so it can't spend credits or touch real jobs" },
      "ky-hygiene": { text: "TEARDOWN: The end-to-end suite deletes only rows it created, by recorded id, email domain or hashed IP, never by time window." },
      "ky-offline": { text: "OFFLINE: Pages open from the last cached copy after a 4s wait, and jobs added with no signal wait in an outbox and send on reconnect." },
      "ky-home": { caption: "The public home, signed out: ASK MY WORK answers only from approved, dated records of my work.",
        explain: "What a visitor sees without signing in. The ASK MY WORK box answers questions about my work, but only from records I approved, each dated and traced to the work it describes. Nothing private reaches this view: the pipeline, the people and the resumes all sit behind sign-in.",
        kpiInline: { value: "26", label: "approved public records the ASK box answers from", period: "as of Nov 2, 2026", rfrom: ["ky-home#1"] } },
    },
  },
  "other-agents": {
    thesis: "Yes, three that are live: a shopping agent on merchants' stores, a bilingual enrollment agent for a beauty school, and the multi-agent pipeline that runs my own job search.",
    add: [{ id: "oa-0-problem", weight: 1, rfrom: ["oa-ck", "oa-cv"],
      text: "THREE PROBLEMS: Shoppers needed answers from a store's own catalog; a school's officers answered the same enrollment questions on every call; and I needed a tailored resume for every role I applied to." }],
    fills: {
      "oa-ck": { label: "of Kivakube's add-to-carts came through the ChekOut shopping agent" },
      "oa-cv": { label: "visitor conversion at Christine Valmy, before and after the enrollment agent" },
      "oa-kyuri": { text: "MY JOB SEARCH: Code routes the base resume, a fit gate judges the posting, a tool-less agent tailors, and a QA gate and leak guard check the PDF before it reaches Drive." },
      "oa-voice": { text: "EARLIER: In March 2025, on the ChekOut company site, I built a voice assistant that spoke its answers and moved a 3D sphere. It was later archived out of the production build." },
      "oa-ck-video": { caption: "ChekOut's agent on a merchant's store: the shopper asks, and the products arrive beside the answer.",
        explain: "The ChekOut agent running on a real merchant storefront. Watch the shopper ask in plain language and the agent answer from that store's catalog, with product cards beside the reply. This is the agent behind the Kivakube number: shoppers add to cart from inside this conversation.",
        kpi: "oa-ck" },
    },
  },
  "other-qa": {
    thesis: "I write tests that protect real users and real data: Vitest and Playwright on ChekOut since December 2025, and a Kyuri suite that can't spend credits or delete what it didn't create.",
    add: [{ id: "qa-0-problem", weight: 1, rfrom: ["qa-ck-preview", "qa-kyuri"],
      text: "THE PROBLEM: A bug in ChekOut's widget ships straight onto merchants' live stores, and a careless Kyuri test could spend real model credits or delete real rows." }],
    fills: {
      "qa-418": { label: "what Kyuri's suite returns to any write a view-only test fires" },
      "qa-kyuri": { text: "IN KYURI: Since October 2026 the Playwright suite answers any non-GET request a page fires on its own with a 418 unless allowlisted, and teardown removes only rows the suite created." },
      "qa-ck-preview": { text: "AT CHEKOUT: A Playwright suite runs the real widget on a preview page before it reaches a storefront: sending, suggestions, add-to-cart, fonts, and text that stays readable on a bright brand color. It runs on desktop Chrome for now." },
      "qa-a11y": { text: "ACCESSIBILITY: I count it as QA. The Christine Valmy widget was audited to WCAG AA before launch." },
    },
  },
  "other-research": {
    thesis: "Yes, and it changed the designs: task analysis cut My Influency's clicks by 28%, and testing the Manage Small Farms redesign raised its SUS score from 52 to 70.",
    add: [{ id: "re-0-problem", weight: 1, rfrom: ["re-clicks"],
      text: "THE PROBLEM: On My Influency, small business owners tracked each influencer across five status tabs and had to hop between them to see where anyone stood." }],
    fills: {
      "re-clicks": { label: "fewer clicks for a business owner to find an influencer's status" },
      "re-time": { label: "saved per task once five tabs became one timeline" },
      "re-success": { label: "task success across 8 core tasks, 12 participants" },
      "re-sus": { label: "SUS score after the Manage Small Farms redesign", period: "Aug to Dec 2022" },
      "re-im": { caption: "Five status tabs became this one timeline; here, an influencer's accepted offer.",
        explain: "The campaign timeline that replaced five status tabs. Task analysis with 12 small business owners showed the tabs forced them to hop around to find where an influencer stood; here an accepted offer sits in one row with everything before and after it.",
        kpi: "re-clicks" },
      "re-farms": { caption: "Manage Small Farms: lists became a spatial map of the farm's fields.",
        explain: "Five screens from the tested prototype: a status feed, field rows, a weekly work plan and two analysis views. Farmers with many crops lost track of work in lists, so the redesign lays the farm out as a map, and the SUS score rose from 52 to 70.",
        kpi: "re-sus" },
    },
  },
};

// ---------------------------------------------------------------- corpus
const CORPUS = {
  "ck-conversation": {
    text: "The ChekOut agent answers the shopper's question first, and what retrieval finds decides the layout: words when no product fits, one card for one clear match, a bundle when products belong together. I re-set the panel from a canned support widget into a reading surface, with product names and prices in bold inside the sentence.",
    fills: {
      "u-ck-conv": { text: "HOW: The shopper never picks a mode. The panel takes its shape from whatever retrieval returned, as the clips show." },
      "u-ck-product": { caption: "One clear match: one card, and why it fits.", explain: "A question with one clear answer in the catalog gets a single card and the reason for it, not a carousel. One intent, one product." },
      "u-ck-bundle": { caption: "Products that only work together arrive as one set.", explain: "When the shopper needs several items that belong together, retrieval returns them as a set and the panel shows them as one bundle. The shopper never asked for a bundle mode; the layout followed the answer." },
    },
  },
  "ck-motion": {
    text: "Every ChekOut animation tells the shopper what the agent is doing: a thinking state while it works, products arriving in a carousel, detail opening beside the thread, and a card that confirms an add in place. I shipped them in July 2026.",
    fills: {
      "u-ck-thinking": { caption: "The thinking state holds the shopper's place, then the reply fades in.", explain: "A static panel can't show that the agent is working. The thinking state holds the spot where the answer will land, then the newest reply fades in word by word." },
      "u-ck-carousel": { caption: "Products arrive with the answer, and the thread stays on screen.", explain: "Products come in with the reply as a carousel, so the shopper can browse without losing the conversation above it." },
      "u-ck-hover": { caption: "Hovering the closed launcher offers two suggested questions.", explain: "Before the chat is even open, hovering the launcher on a merchant's store offers two suggested questions, so a shopper who doesn't know what to ask has a place to start. Merchants can turn them off in the builder." },
    },
  },
  "ck-cart": {
    text: "20% of Kivakube's add-to-carts came through the ChekOut agent. Shoppers add to cart inside the conversation, View cart opens the store's own cart and checkout, and since May 2026 carts carry ChekOut attribution so the merchant's own orders show what the agent sold. It works with Shopify, Squarespace and Shopline carts.",
    fills: {
      "u-ck-viewcart": { caption: "Two lampshades added in the chat, then View cart opens Rosendahl's own cart page.", explain: "On Rosendahl's store the shopper adds two lampshades without leaving the chat, then View cart opens the store's real cart. ChekOut keeps no second cart, so the merchant's discounts and checkout work as they always did.", kpi: "u-ck-atc" },
    },
  },
  "ck-analytics": {
    text: "After going live, a merchant's first question is what shoppers are asking, so the ChekOut dashboard answers with the conversations themselves. Between June and July 2026 I built it so an insight turns a number into a next step and clicking a keyword opens the threads behind it.",
    fills: {
      "u-ck-metrics": { caption: "One live store's top line: visitors and engagement.", explain: "The top of the merchant dashboard on a live store. Engagement counts only visitors who sent the agent a real message." },
      "u-ck-analytics": { caption: "An insight flags the most searched term; the keyword opens its threads.", explain: "The dashboard on Kivakube's data. An insight says which term shoppers searched most and suggests checking its pricing and availability, then a keyword click opens the actual conversations behind the number." },
    },
  },
  "ck-scale": {
    text: "From February to July 2026 the ChekOut agent ran 13,981 shopper sessions, and it is live on 8 merchants' stores.",
    fills: {
      "u-ck-sessions": { label: "shopper sessions with the agent, across all live stores" },
      "u-ck-brands": { label: "merchants running the agent on their own store" },
    },
  },
  "ap-one-color": {
    text: "Merchants type one brand color, and the ChekOut widget derives everything else so it stays readable, even when that color is a pale yellow or a neon. Text flips between dark and light by brightness, and since August 2026 the footer measures its own text against WCAG ratios of 7, 5.5 and 4.5 to 1.",
    fills: {
      "u-ap-color": { text: "HOW: Merchants pick one color and the code makes it readable. The footer checks three text tiers against WCAG ratios of 7, 5.5 and 4.5 to 1 and corrects any that fall short." },
      "u-ap-kiva": { caption: "Kivakube's storefront, one of the ChekOut merchants.", explain: "Kivakube's homepage, a live ChekOut merchant. The widget has to sit on pages like this one, with the store's own colors, fonts and layout around it, and still read as part of the store." },
      "u-ap-rosen": { caption: "Rosendahl's storefront, another ChekOut merchant.", explain: "Rosendahl's homepage, another live ChekOut merchant with a very different brand from Kivakube. The same widget, given one brand color, has to look at home on both." },
    },
  },
  "ap-preview": {
    text: "A ChekOut merchant goes from setup to a live, branded agent in 5 to 30 minutes, in three steps: persona, knowledge base and channel. In July 2026 I replaced the builder's hand-built preview, which had drifted from what shipped, with the real widget in an iframe fed the merchant's unsaved settings.",
    fills: {
      "u-ap-time": { label: "from starting setup to a branded agent live on a merchant's store" },
      "u-ap-embed": { caption: "Watch the preview change as the settings change, then the one snippet that goes into the store.", explain: "The builder's channel step: brand settings on one side, the real widget on the other, updating as they change. Then the embed snippet goes into a Shopify theme, which is the whole install." },
    },
  },
  "ap-guest": {
    text: "ChekOut's launcher covered stores' cart drawers and cookie banners, so I replaced a fixed preset with two sliders: distance from the bottom and stacking level. The widget has its own tokens and lives in an iframe, so the store's CSS stays out.",
    fills: {
      "u-ap-guest": { text: "HOW: The builder speaks as ChekOut and the widget speaks as the store. Two sliders, bottom distance and stacking level, replaced a fixed raised preset that covered cart drawers." },
      "u-ap-hover": { caption: "On a merchant's store, the closed launcher offers two suggested questions on hover.", explain: "The launcher as a shopper first meets it, bottom right on a merchant's page. It has to stay clear of the store's own cart drawer and cookie banner, which is why merchants position it with two sliders instead of a fixed preset." },
    },
  },
  "ap-ios": {
    text: "On iOS, pulling past the top of the ChekOut chat reached Safari as pull-to-refresh and reloaded the merchant's page mid-conversation. I stopped the gesture at the widget's edge with overscroll-behavior on the embed root and contain on the message list.",
    fills: {},
  },
  "ap-claude-code": {
    text: "I built most of ChekOut's builder and widget with Claude Code: 577 prompts over 14 sessions, about one in seven a correction. A Playwright suite runs the real widget on a preview page before it reaches a storefront, on desktop Chrome for now.",
    fills: { "u-ap-prompts": { label: "prompts to Claude Code over 14 sessions building the builder and widget" } },
  },
  "cv-loved": {
    text: "My first Christine Valmy design made enrollment feel like an app: a student ID card that filled in as the student chatted, and a bento grid of tiles for pricing, courses, alumni and schedules. User testing killed it.",
    fills: {
      "u-cv-bento": { caption: "The bento grid: every topic one tap from the chat.", explain: "My first concept: tiles for pricing, courses, alumni and schedules around the chat, so nobody had to think of a question first and every tap told officers what a student cared about. In testing, students skipped the tiles." },
      "u-cv-id": { caption: "The student ID card that filled in as the student chatted.", explain: "The other half of the concept: an ID card that collected a student's name, email and course picks as they chatted. It was cut with the grid after testing." },
    },
  },
  "cv-testing": {
    text: "In testing, prospective Christine Valmy students skipped the tiles and kept asking whether the school had Instagram: the tiles read as marketing, and photos from real students did not. I cut the ID card and the grid and kept a short inquiry form, the chat and the social links.",
    fills: {
      "u-cv-social-before": { caption: "Before: social links in a side column, away from the chat.", explain: "Students wanted Instagram right after chatting, but the links sat in a column on the left, apart from the conversation. Session two moved them." },
      "u-cv-final": { caption: "After: a short form, the chat, and social links in a row underneath.", explain: "The design that shipped. Everything students ignored is gone, and the social links they kept asking for sit in a row right under the chat." },
    },
  },
  "cv-fixes": {
    text: "Three Christine Valmy test sessions each found one thing students tripped on, and I fixed it before the next: dropdowns read as topics, social links sat in the wrong place, and the agent spoke only English when many applicants spoke Spanish first. The agent and every label now work in both languages, and the widget was audited to WCAG AA.",
    fills: {
      "u-cv-ddb": { caption: "Before: students read these dropdowns as suggested topics.", explain: "Location and course dropdowns sat beside the message box because structured values were easier to parse. Students read them as suggested topics instead of typing their own question." },
      "u-cv-dda": { caption: "After: one message box; the agent picks location and course from the text.", explain: "The session one fix: the dropdowns are gone, and the agent reads location and course from plain conversation." },
      "u-cv-es": { caption: "The same form and agent in Spanish.", explain: "Many applicants spoke Spanish first, so the agent and every label switch languages, not just the replies. The enrollment officer credits this with more inquiries from the school's target students." },
    },
  },
  "cv-agent": {
    text: "The Christine Valmy enrollment agent took visitor conversion from 10% to 23% and brought in $120K in enrolled revenue. It answers from the school's own content through RAG, keeps class schedules fresh, and sorts each lead into a priority bucket so officers call the students who are ready first.",
    fills: {
      "u-cv-conv": { label: "visitor conversion, before and after the agent" },
      "u-cv-rev": { label: "in enrolled revenue for the school" },
      "u-cv-hrs": { label: "saved per enrollment officer, per day" },
      "u-cv-reply": { caption: "A new student asks a question and the agent answers beside the inquiry form.", explain: "The shipped agent on the school's site, answering a student from the school's own course content with the inquiry form in reach. Students used to fill in the form and wait for a call." },
    },
  },
  "ky-live-totals": {
    text: "My job search runs on KYURI.OS: as of Nov 2, 2026 the public Job Hunt page shows 454 roles captured, 341 marked applied and 9 that reached interviews. Across all users it has tailored 475 resumes.",
    fills: {
      "u-ky-cap": { label: "roles captured into my pipeline", period: "as of Nov 2, 2026" },
      "u-ky-sent": { label: "of those marked applied", period: "as of Nov 2, 2026" },
      "u-ky-int": { label: "applications that reached an interview", period: "as of Nov 2, 2026" },
      "u-ky-shot": { caption: "The public Job Hunt page, signed out, Nov 2, 2026.", explain: "The Job Hunt page as any visitor sees it. The totals come from the same pipeline that runs my search, so they move as I apply; companies and people are left out.", kpi: "u-ky-cap" },
    },
  },
  "ky-resume-guards": {
    text: "In KYURI.OS, code decides what an AI-written resume may say, because on June 17 a resume went out with the agent's own keyword notes printed under SKILLS. Since then code picks the base resume, four facts can never be renamed, a fit gate judges the posting, and a leak guard, QA gate and evals sit between the model and the PDF.",
    fills: { "u-ky-checks": { label: "agent checks every resume passes before it reaches Drive" } },
  },
  "ky-public-home": {
    text: "The public KYURI.OS home answers \"can he do your work?\" only from approved, dated records, each traced to the code or design it came from. As of Nov 2, 2026 it draws on 26 of them.",
    fills: {
      "u-ky-receipts": { label: "approved public records of my work" },
      "u-ky-home": { caption: "The public home, signed out, with ASK MY WORK.", explain: "What a visitor sees without signing in. ASK MY WORK answers only from records I approved, each dated and traced to the work it describes; nothing private reaches this view.", kpi: "u-ky-receipts" },
    },
  },
  "my-influency": {
    text: "On My Influency, task analysis with 12 small business owners showed five status tabs forced tab-hopping and hid where each influencer stood. One timeline replaced them: 28% fewer clicks, 1m 47s saved per task, and 95% task success across 8 core tasks.",
    fills: {
      "u-im-clicks": { label: "fewer clicks to find an influencer's status" },
      "u-im-time": { label: "saved per task once five tabs became one timeline" },
      "u-im-success": { label: "task success across 8 core tasks" },
      "u-im-laptop": { caption: "Five status tabs became this one timeline.", explain: "The campaign timeline that replaced five status tabs. Business owners can see where every influencer stands in one row instead of hopping between tabs.", kpi: "u-im-clicks" },
    },
  },
  "manage-farms": {
    text: "Manage Small Farms (Aug to Dec 2022) moved a farm-operations app for small, diverse-crop farms from lists to a spatial map. In testing, SUS rose from 52 to 70, tasks got 40% faster, and success rose from 50% to 64%.",
    fills: {
      "u-mf-sus": { label: "SUS score, up from 52", period: "Aug to Dec 2022" },
      "u-mf-fast": { label: "faster tasks in testing" },
      "u-mf-success": { label: "task success, up from 50%" },
      "u-mf-final": { caption: "Lists became a spatial map of the farm.", explain: "Five screens from the tested prototype: a status feed, field rows, a weekly work plan and two analysis views. The redesign lays the farm out spatially instead of in lists.", kpi: "u-mf-sus" },
    },
  },
  "clutch": {
    fills: { "u-clutch": { caption: "The match overview a player sees after a game.", explain: "From a head-of-design interview exercise: the post-game overview for padel players filmed by AI court cameras, with time in play, rallies, winners and errors. The brief was to make the data meaningful and worth sharing in the group chat." } },
  },
  "chekout-site": {
    fills: { "u-site": { text: "From October 2024 I built 3D product scenes and a voice assistant into ChekOut's company site; in November 2025 a performance pass archived them, with notes on how to bring each one back." } },
  },
  // evidence records: name ChekOut, drop details the record does not state
  "rec-faca7441": { fills: { "rec-faca7441-p": { text: "In December 2025 I wrote ChekOut's checklist for before every push: a TypeScript type-check, ESLint and a test run, to catch build errors like untyped 'any' before the build did." } } },
  "rec-c7c71106": { fills: { "rec-c7c71106-p": { text: "In December 2025 I brought Vitest into ChekOut's frontend, with its config and setup files, and tightened the email and merchant-ID validation in the same change." } } },
  "rec-8ca0deab": { fills: { "rec-8ca0deab-p": { text: "In December 2025 I connected the newsletter signup on ChekOut's company site to n8n." } } },
  "rec-868464ba": { fills: { "rec-868464ba-p": { text: "In November 2025 I documented how ChekOut's frontend ships: a multi-stage Docker build (deps, builder, runner) and Next.js standalone output for Cloud Run." } } },
  "rec-1b47815a": { fills: { "rec-1b47815a-p": { text: "I added deploy scripts for ChekOut's frontend: one deploys, and a pre-deploy check first verifies the service account, environment variables, gcloud setup, enabled APIs and Firebase config." } } },
  "rec-df2abd95": { fills: { "rec-df2abd95-p": { text: "In November 2025 I set up how ChekOut's frontend deploys: Cloud Build builds a Docker image and deploys it to Cloud Run, and Firebase Hosting routes requests to that service." } } },
  "rec-fc5b8ee7": { fills: { "rec-fc5b8ee7-p": { text: "On ChekOut's early company site I built an interactive 3D hair-follicle scene and 3D product models (bottle, dispenser, lipstick). They were later archived out of the production build." } } },
  "rec-56ba4fce": { fills: { "rec-56ba4fce-p": { text: "In November 2025 I made ChekOut's company site lighter on mobile: lazy loading, performance fixes and a Vite bundling change." } } },
  "rec-99f2b3cd": { fills: { "rec-99f2b3cd-p": { text: "I replaced the custom smooth-scroll code on ChekOut's company site with the Lenis library and archived the old helpers." } } },
  "rec-1e89a20c": { fills: { "rec-1e89a20c-p": { text: "When I moved the unused 3D, audio and shader components out of ChekOut's site for performance, I wrote down how to bring each one back." } } },
  "rec-bb9eabcf": { fills: { "rec-bb9eabcf-p": { text: "In October 2025 I added a Trade School vertical to ChekOut's company site: a page, routing, a site-wide product toggle and its own chat route." } } },
  "rec-f478b001": { fills: { "rec-f478b001-p": { text: "I added a sitemap to ChekOut's company site for SEO." } } },
  "rec-339f2c59": { fills: { "rec-339f2c59-p": { text: "In September 2025 I documented the EyePop.ai skin-analysis integration on ChekOut's site: image upload, camera capture and recommendations." } } },
  "rec-de429446": { fills: { "rec-de429446-p": { text: "In August 2025 I tried streaming the assistant's replies on ChekOut's site, across the GCP backend and the frontend, then rolled back to the original version." } } },
  "rec-bb6dd897": { fills: { "rec-bb6dd897-p": { text: "I added a Vercel API route that handles CORS and forwards chat requests from ChekOut's site to a Google Cloud Function, and wrote its setup doc." } } },
  "rec-bb34f79b": { fills: { "rec-bb34f79b-p": { text: "I added Google Analytics 4 to ChekOut's company site and wrote a setup guide for its events: page views, scroll depth, button clicks and form interactions. It was exploratory; production tracking wasn't confirmed." } } },
  "rec-d70f6969": { fills: { "rec-d70f6969-p": { text: "In March 2025 I built a voice assistant into ChekOut's early company site: it spoke its answers, and its responses moved a 3D sphere. It was later archived." } } },
  "rec-f21be06a": { fills: { "rec-f21be06a-p": { text: "A public demo at /try runs the full tailoring pipeline through a job queue on my own machine, with polling, a fallback, capped tweaks, redownload and a per-visitor try quota. It sits behind a feature flag." } } },
  "rec-ff6a6375": { fills: { "rec-ff6a6375-p": { text: "The resume build refuses to publish a resume still over one page at the tightest layout. It runs one trim pass and re-lints before rebuilding; if it still overflows, it ships with a page-count warning." } } },
  "rec-b2f287c5": { fills: { "rec-b2f287c5-p": { text: "Before tailoring a resume, the pipeline scores the job posting for fit, maps its duties to my background, and records a verdict. The verdict steers the tailoring and QA steps that follow." } } },
  "rec-b0b443c6": { fills: { "rec-b0b443c6-p": { text: "Three access tiers: visitors see public data, candidates see their own pipeline, and I see everything. Google sign-in gates candidates against a per-candidate allowlist." } } },
};

// ---------------------------------------------------------------- home + case studies
const HOME = {
  thesis: "Namit is a product engineer in New York who designs and ships AI agents, and every number here links to where it came from.",
  fills: {
    "home-currently": { text: "CURRENTLY: Co-founder of ChekOut AI, designing and building the shopping agent live on 8 merchants' stores." },
    "home-ck": { caption: "ChekOut AI: Shoppers had questions a product grid can't answer. My agent answers from the store's catalog, and 20% of Kivakube's add-to-carts came through it.",
      explain: "ChekOut's shopping agent open beside a merchant's storefront. I designed and built the shopper conversation, the product cards, the motion and the merchant dashboard, and the builder merchants use to brand it. Ask how it works or what it changed to see the evidence." },
    "home-cv": { caption: "Christine Valmy: Students waited on a form while officers repeated themselves. A bilingual agent took visitor conversion from 10% to 23%.",
      explain: "The enrollment agent beside the school's inquiry form. User testing killed my first design; the bilingual agent that shipped answers students in English or Spanish and sorts every lead for the officers. Ask how testing changed it to see the before and after." },
    "home-ky": { caption: "KYURI.OS: My own job search, built as a system: 454 roles captured and 341 applications logged since April 2026, with guards on every AI-written resume.",
      explain: "The public Job Hunt page of KYURI.OS, the system I built to run my own search. The totals are live, from the same pipeline that tailors each resume behind a fit gate, a QA gate and a leak guard. Companies and people are left out of the public view.",
      kpiInline: { value: "454", label: "roles captured", period: "as of Nov 2, 2026", rfrom: ["home-ky#1"] } },
  },
};

const CASES = {
  chekout: {
    kicker: "PRODUCTION AI · 8 MERCHANTS LIVE · AUG 2024 TO NOW",
    summary: "Shoppers had questions a product grid can't answer. I designed and built the agent that answers from the store's own catalog, and 20% of Kivakube's add-to-carts came through it.",
    why: "This is Namit's strongest current work and the closest match to the roles he targets: as co-founder he designed and built a shopping agent that is live on 8 merchants' stores, with an outcome a merchant approved for publishing (20% of Kivakube's add-to-carts) and 13,981 shopper sessions from Feb to Jul 2026. It also has the richest media: recorded response shapes, motion clips, the analytics dashboard and the builder. The agent-platform work is folded in as the \"how merchants set it up\" deck, because on a three-slot stage two ChekOut studies would crowd out range.",
  },
  "christine-valmy": {
    kicker: "BILINGUAL AI ENROLLMENT AGENT · CONVERSION 10% → 23%",
    summary: "Prospective students waited on a form while officers answered the same questions on every call. Testing killed my first design, and the bilingual agent that shipped took conversion from 10% to 23%.",
    why: "It is the clearest design-process story here, and it ends in numbers: conversion 10% → 23%, $120K in enrolled revenue, about 2× the bad leads flagged and about 3 hours saved per officer per day. It has what the other two lack: real participant quotes, three before and after testing rounds with images, and a WCAG AA audit. It is also a second shipped AI agent, for different users (prospective students and enrollment officers) in a different domain, which keeps the three distinct.",
  },
  "kyuri-os": {
    kicker: "PERSONAL PROJECT · LIVE SINCE APR 2026",
    summary: "My job search needed a tailored resume for every role. I built the system that writes them behind guards and tracks each application: 454 roles captured and 341 applied as of Nov 2026.",
    why: "It has the most checkable evidence of anything Namit has built: dated work from April 5, 2026 to today, 26 approved public records of that work, and live numbers anyone can check on kyuri.namit.me (454 roles captured, 341 marked applied, 9 interviewed, 475 resumes across all users). It shows product engineering end to end: multi-agent pipelines with guards and evals, access tiers, rate limits, an offline mode and a Playwright suite. Its weakness, fewer polished visuals, is offset by live screenshots of the public pages.",
  },
};

// ---------------------------------------------------------------- apply
const NEW_FIELDS = new Set(["explain", "kpi"]);
function setField(obj, snapObj, key, val, where) {
  if (NEW_FIELDS.has(key)) {
    if (obj[key] !== undefined && JSON.stringify(obj[key]) !== JSON.stringify(val)) { skipped.push(`${where}.${key}: already set by someone else, left alone`); return; }
    obj[key] = val; applied.n++; return;
  }
  const cur = obj[key], was = snapObj ? snapObj[key] : undefined;
  if (cur !== was) { skipped.push(`${where}.${key}: changed concurrently (now "${String(cur).slice(0, 50)}"), left alone`); return; }
  obj[key] = val; applied.n++;
}
const findFill = (fills, id) => fills.find((f) => f.id === id);

function receiptsFrom(refs, localFills, allDecks) {
  const out = [], seen = new Set();
  for (const r of refs) {
    let [loc, idx] = r.split("#");
    let fills = localFills, fid = loc;
    if (loc.includes("/")) { const [d, f] = loc.split("/"); fills = allDecks.find((x) => x.id === d).fills; fid = f; }
    const f = findFill(fills, fid);
    if (!f) throw new Error(`receipt source ${r} not found`);
    const rs = idx !== undefined ? [f.receipts[+idx]] : f.receipts || [];
    for (const x of rs) { const k = JSON.stringify(x); if (!seen.has(k)) { seen.add(k); out.push(clone(x)); } }
  }
  if (!out.length) throw new Error(`no receipts from ${refs}`);
  return out;
}

function patchFills(fills, snapFills, patch, where, allDecks) {
  for (const [fid, ch] of Object.entries(patch || {})) {
    const f = findFill(fills, fid);
    if (!f) { skipped.push(`${where}/${fid}: fill no longer exists`); continue; }
    const sf = snapFills ? findFill(snapFills, fid) : null;
    for (const [k, v] of Object.entries(ch)) {
      if (k === "kpiInline") {
        const { rfrom, ...rest } = v;
        setField(f, sf, "kpi", { ...rest, receipts: receiptsFrom(rfrom, fills, allDecks) }, `${where}/${fid}`);
      } else setField(f, sf, k, v, `${where}/${fid}`);
    }
  }
}

const load = (dir, f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const save = (f, d) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2) + "\n");

// decks
{
  const d = load(DATA, "decks.json"), s = load(SNAP, "decks.json");
  for (const [id, p] of Object.entries(DECKS)) {
    const a = d.find((x) => x.id === id), sa = s.find((x) => x.id === id);
    if (!a) { skipped.push(`deck ${id} missing`); continue; }
    if (p.thesis) setField(a, sa, "thesis", p.thesis, id);
    patchFills(a.fills, sa.fills, p.fills, id, d);
    for (const n of p.add || []) {
      if (findFill(a.fills, n.id)) { skipped.push(`${id}/${n.id}: already present`); continue; }
      a.fills.unshift({ kind: "prose", id: n.id, weight: n.weight, text: n.text, receipts: receiptsFrom(n.rfrom, a.fills, d) });
      applied.n++;
    }
  }
  save("decks.json", d);
}
// corpus
{
  const d = load(DATA, "corpus.json"), s = load(SNAP, "corpus.json");
  for (const [id, p] of Object.entries(CORPUS)) {
    const u = d.find((x) => x.id === id), su = s.find((x) => x.id === id);
    if (!u) { skipped.push(`corpus ${id} missing`); continue; }
    if (p.text) setField(u, su, "text", p.text, `corpus/${id}`);
    patchFills(u.fills, su.fills, p.fills, `corpus/${id}`, []);
  }
  save("corpus.json", d);
}
// home
{
  const d = load(DATA, "home.json"), s = load(SNAP, "home.json");
  setField(d, s, "thesis", HOME.thesis, "home");
  patchFills(d.fills, s.fills, HOME.fills, "home", []);
  save("home.json", d);
}
// case studies
{
  const d = load(DATA, "case-studies.json"), s = load(SNAP, "case-studies.json");
  for (const [id, p] of Object.entries(CASES)) {
    const c = d.find((x) => x.id === id), sc = s.find((x) => x.id === id);
    for (const [k, v] of Object.entries(p)) setField(c, sc, k, v, `case/${id}`);
  }
  save("case-studies.json", d);
}
console.log(`applied ${applied.n} changes`);
console.log(skipped.length ? "SKIPPED:\n" + skipped.join("\n") : "no skips");
