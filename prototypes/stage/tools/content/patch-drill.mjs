// Load-modify-save: drill-down decks (parent/opens) for each case study's build stages.
import fs from "node:fs";
import { execSync } from "node:child_process";
const D = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");
const REPOS = {
  "kyuri-dashboard": "/Users/namit/Documents/kyuri-dashboard",
  "chekoutai-frontend": "/Users/namit/Documents/work/chekout-ai/chekoutai-frontend",
  "sentry-skin-website": "/Users/namit/Documents/work/chekout-ai/sentry-skin-website",
};
const clean = (s) => s.replace(/\s+[—–]\s+/g, ": ").replace(/[—–]/g, " to ");
const MSG = { "ab7171a": "offline: pages open from the last copy after a 4s wait, adds made with no signal wait in an outbox and send on reconnect, a pill says which" };
const git = (repo, sha) => {
  const [h, date, msg] = execSync(`git -C "${REPOS[repo]}" log -1 --date=short --format="%h%x09%ad%x09%s" ${sha}`).toString().trim().split("\t");
  return { h, date, msg: clean(MSG[h] || msg) };
};
const commits = (id, weight, repo, shas) => ({ kind: "commits", id, weight, repo, items: shas.map((s) => { const g = git(repo, s); return { sha: g.h, date: g.date, msg: g.msg }; }) });
const cr = (repo, sha) => { const g = git(repo, sha); return { type: "commit", ref: g.h, repo, date: g.date, label: `${g.h} · ${g.msg}` }; };
const asset = (ref, label) => ({ type: "asset", ref, ...(label ? { label } : {}) });
const data = (ref, label) => ({ type: "asset", ref, repo: "Juniper", date: "2026-10-26", label });
const kyfile = (ref, label) => ({ type: "asset", ref, repo: "kyuri-dashboard", label });
const figma = (file, node, label) => ({ type: "asset", ref: `figma:${file}#${node}`, date: "2026-11-01", label });
const record = (id, label) => ({ type: "record", ref: id, url: "https://kyuri.namit.me/", label });
const CK = data("src/data/chekoutData.js", "ChekOut AI case study");
const AP = data("src/data/agentPlatformData.js", "Agent platform case study");
const CV = data("src/data/christineValmyData.js", "Christine Valmy case study");
const RECON = data("design-plans/content-recon-2026-10-26.md", "Content recon of chekoutai-frontend");
const ARCH = kyfile("docs/architecture.md", "KYURI.OS system architecture");
const LIVE = { type: "asset", ref: "assets/kyuri-os/job-hunt.webp", url: "https://kyuri.namit.me/?area=job-hunt", date: "2026-11-02", label: "kyuri.namit.me Job Hunt, visitor view" };
const prose = (id, weight, text, receipts) => ({ kind: "prose", id, weight, text, receipts });
const quote = (id, weight, text, who, receipts) => ({ kind: "quote", id, weight, text, who, receipts });
const media = (id, weight, src, aspect, alt, caption, explain, receipts, extra = {}) => {
  const f = { kind: "media", id, weight, media: src.endsWith(".mp4") ? "video" : "image", src, aspect, alt, caption, explain, receipts: [asset(src), ...receipts], ...extra };
  if (src.endsWith(".mp4")) f.poster = src.replace(/\.mp4$/, ".jpg");
  return f;
};
const kpi = (id, weight, value, label, receipts, extra = {}) => ({ kind: "kpi", id, weight, value, label, receipts, ...extra });

const CKJ = "juckmsHrlBUBKcMkoJCiep", CKF = "LPIuHW2bQIxkq7TWZSxI3G", KYF = "qWq0Ce8ovFq7RkKWmGWQDD", KYJ = "1WNTAaMtC2x7fr5VAB4lRM";

// =================================================================== ChekOut
const children = [];
children.push({
  id: "ck-d-cart", parent: "ck-merchant-outcomes", caseStudy: "chekout",
  question: "How does the cart work inside the conversation?",
  thesis: "Shoppers add to cart without leaving the chat, the store's own cart closes the sale, and tagged carts let the merchant see what the agent sold.",
  fills: [
    prose("ckc-problem", 1, "THE PROBLEM: Acting on an answer shouldn't cost the shopper their place in the conversation, and a second cart beside the store's would be one more thing to reconcile.", [CK]),
    media("ckc-add", 0.85, "assets/chekout/add-to-cart.mp4", 1.8367, "A product card in the chat confirms the add in place and then shows the quantity",
      "Add to cart, in the chat.", "The card itself confirms the add and keeps showing the quantity, so the shopper never leaves the thread to check.", [CK]),
    media("ckc-view", 0.85, "assets/chekout/view-cart.mp4", 1.8367, "Two lampshades added in the widget, then View cart opens Rosendahl's own cart page",
      "View cart opens the store's real cart.", "The agent hands off to the merchant's own cart, with the discounts and checkout the store already runs. ChekOut keeps no second cart.", [CK]),
    prose("ckc-attr", 0.7, "ATTRIBUTION: Carts that pass through the agent are tagged with ChekOut attribution attributes on Shopify, so orders the agent helped with can be counted on the merchant's dashboard.", [cr("chekoutai-frontend", "d22f151"), cr("chekoutai-frontend", "99f80a8")]),
    commits("ckc-commits", 0.5, "chekoutai-frontend", ["d22f151", "62bde85", "2e113b9", "249c3ce"]),
  ],
});
children.push({
  id: "ck-d-dashboard", parent: "ck-merchant-outcomes", caseStudy: "chekout",
  question: "What does the merchant dashboard show?",
  thesis: "The dashboard answers a merchant's first question, what are shoppers asking, with the conversations themselves.",
  fills: [
    prose("ckd-problem", 1, "THE PROBLEM: A merchant's first question after going live is what shoppers are asking, and a count of sessions doesn't answer it.", [CK]),
    media("ckd-flow", 0.9, "assets/chekout/analytics.mp4", 2.1846, "The dashboard on Kivakube's data: an insight tooltip, then a keyword opening the conversations behind it",
      "Insight, keyword, threads.", "An insight turns a number into a next step, and clicking a keyword opens every thread that mentions it, so the merchant reads the actual questions.", [CK, cr("chekoutai-frontend", "ab03e36")]),
    prose("ckd-engaged", 0.65, "ENGAGEMENT: I replaced the conversion-rate card with an engagement rate that only counts visitors who actually replied, so a widget that opened and greeted no one doesn't inflate the number.", [cr("chekoutai-frontend", "c78b8c4"), cr("chekoutai-frontend", "3edaa92")]),
    prose("ckd-data", 0.55, "DATA: The cards read from a BigQuery-backed analytics payload, with a new-versus-returning split on visitors.", [cr("chekoutai-frontend", "5264ce8"), cr("chekoutai-frontend", "4c38f1f")]),
    commits("ckd-commits", 0.5, "chekoutai-frontend", ["5264ce8", "e957eb7", "ab03e36", "c78b8c4", "4c38f1f", "abe96e9"]),
  ],
});
children.push({
  id: "ck-d-motion", parent: "ck-conversation", caseStudy: "chekout",
  question: "What does the motion in the widget do?",
  thesis: "Each animation tells the shopper what the agent is doing, and each leaves a static cue behind when it ends.",
  fills: [
    prose("ckm-problem", 1, "THE PROBLEM: A static panel can't show that the agent is working, or that a tap landed.", [CK]),
    media("ckm-thinking", 0.8, "assets/chekout/thinking.mp4", 1.8367, "The thinking state holds the shopper's place, then the reply fades in word by word",
      "Thinking, then the reply.", "The thinking state holds the shopper's place while retrieval runs, and the newest reply fades in word by word.", [CK, cr("chekoutai-frontend", "cef8abf")]),
    media("ckm-carousel", 0.7, "assets/chekout/rec-carousel.mp4", 1.8367, "Products arrive with the answer in a carousel that keeps the thread on screen",
      "Products arrive with the answer.", "Recommendations slide in as a carousel under the reply, so the thread stays in view while the shopper browses.", [CK]),
    media("ckm-hover", 0.6, "assets/chekout/launcher-hover.mp4", 1.8367, "The closed launcher on a merchant's store offers two suggested questions on hover",
      "The closed launcher on hover.", "Before the chat opens, hovering the launcher ripples up two suggested questions, nearest first, and reverses on leave.", [AP, cr("chekoutai-frontend", "f56fbdf")]),
    commits("ckm-commits", 0.45, "chekoutai-frontend", ["cef8abf", "f56fbdf", "0c93dcc", "46525f2", "8d840f3"]),
  ],
});
children.push({
  id: "ck-d-builder", parent: "ck-platform-build", caseStudy: "chekout",
  question: "How does a merchant set the agent up?",
  thesis: "Three steps in the builder, one brand color, a preview that is the real widget, and an embed that only mounts on the merchant's own domains.",
  fills: [
    prose("ckb-problem", 1, "THE PROBLEM: Merchants set the agent up once, in our builder, and need to see exactly what their shoppers will see on a page we never control.", [AP]),
    media("ckb-flow", 0.9, "assets/chekout/onboarding.webp", 2.6667, "Onboarding and agent builder flow: app-store install, Step 1 AI Persona, store OAuth, product sync, Step 2 Knowledge Base, agent provisioning, Step 3 Channel",
      "From app-store install to a provisioned agent.", "The three builder steps in order, with what happens between them: store OAuth after the persona step, product sync, then agent provisioning before the channel step. Boxes are tagged [code] or [notes] by how each was verified.",
      [figma(CKJ, "3:112", "FigJam: 2 · Onboarding & agent builder")]),
    prose("ckb-color", 0.7, "ONE COLOR: Merchants type one brand color and the widget derives the rest. Text flips between dark and light by brightness, and the footer checks its text tiers against WCAG ratios.", [AP, cr("chekoutai-frontend", "a57a3e3")]),
    prose("ckb-preview", 0.65, "THE PREVIEW: The channel step renders the real widget in an iframe with the merchant's unsaved settings, and the embed mounts only on the domains the backend lists for that merchant.", [cr("chekoutai-frontend", "fe5f2a1"), cr("chekoutai-frontend", "91ebf39")]),
    prose("ckb-launcher", 0.5, "THE LAUNCHER: Our launcher covered cart drawers and cookie banners, so a fixed raised preset became two sliders, distance from the bottom and stacking level.", [AP, RECON, cr("chekoutai-frontend", "2127ede")]),
    commits("ckb-commits", 0.45, "chekoutai-frontend", ["fe5f2a1", "91ebf39", "2127ede", "2e4bff0", "faf5efd", "7a63949", "7f4d4c0"]),
  ],
});
children.push({
  id: "ck-d-stack", parent: "ck-platform-build", caseStudy: "chekout",
  question: "What is the ChekOut stack?",
  thesis: "One Next.js app on Cloud Run serves the builder and the widget, chat runs through a Langflow agent per merchant, and analytics come from BigQuery.",
  fills: [
    prose("cks-problem", 1, "THE PROBLEM: The same frontend has to serve merchants in a builder and shoppers inside other people's stores, and ship to both without breaking either.", [figma(CKJ, "3:39", "FigJam: 1 · System context")]),
    media("cks-arch", 0.85, "assets/chekout/architecture.webp", 2.0645, "ChekOut AI system context: merchants and shoppers, the Next.js front end, Langflow agents, backend services on Cloud Run, commerce platforms, Postgres and BigQuery",
      "Who talks to what.", "Chat messages go from the front end to a Langflow agent per merchant; setup, store sync and billing go to backend services. Blue is my work; [code] and [notes] say how each box was verified.",
      [figma(CKJ, "3:39", "FigJam: 1 · System context")]),
    prose("cks-ship", 0.65, "SHIPPING: The frontend builds as a Docker image on Cloud Build and runs on Cloud Run, with a canary service beside production that takes no live traffic.", [record("df2abd95", "Cloud Build to Cloud Run deployment path"), cr("chekoutai-frontend", "313d08d")]),
    prose("cks-watch", 0.5, "WATCHING IT: Datadog RUM measures latency in shoppers' browsers and stamps each session with the build it ran.", [cr("chekoutai-frontend", "e8fc7b7"), cr("chekoutai-frontend", "9bfc792")]),
    commits("cks-commits", 0.45, "chekoutai-frontend", ["64d2ed6", "313d08d", "e8fc7b7", "9bfc792", "5264ce8", "8fb5e0e"]),
  ],
});

// =================================================================== Christine Valmy
children.push({
  id: "cv-d-concept", parent: "cv-testing", caseStudy: "christine-valmy",
  question: "What was the first concept?",
  thesis: "I wanted enrollment to feel like an app, and every piece of it was a guess about what students wanted.",
  fills: [
    prose("cvc-problem", 1, "THE PROBLEM: Students filled in a form and waited, and officers answered the same questions on every call. I wanted the first visit to do more of that work.", [CV]),
    media("cvc-bento", 0.85, "assets/christine-valmy/bento-concept.webp", 1.9259, "Bento grid concept: green tiles for pricing, courses, alumni and schedule around a chat prompt",
      "Every topic one tap from the chat.", "Tiles for pricing, courses, alumni and schedules sat around the chat, so nobody had to think of a question first, and every tap would tell officers what the student cared about.", [CV]),
    media("cvc-id", 0.75, "assets/christine-valmy/student-id-concept.webp", 1.7741, "Student ID concept: a card with name, email and course picks for nails, haircare, makeup and esthetics",
      "A student ID card that filled in as you chatted.", "The card collected contact details and course interests along the way, so the conversation doubled as the inquiry form.", [CV]),
    prose("cvc-verdict", 0.6, "WHAT HAPPENED: Students skipped the tiles and asked whether the school had Instagram. The grid and the card were both cut.", [CV]),
  ],
});
children.push({
  id: "cv-d-bilingual", parent: "cv-testing", caseStudy: "christine-valmy",
  question: "How did the agent become bilingual?",
  thesis: "Many applicants spoke Spanish first, so the agent and every label work in both languages, not just the replies.",
  fills: [
    prose("cvb-problem", 1, "THE PROBLEM: Many applicants spoke Spanish first, and an English-only form and chat lost them before the first question.", [CV]),
    media("cvb-en", 0.7, "assets/christine-valmy/final-design.webp", 1.7778, "Inquiry form and chat in English with social links under the chat",
      "Before: English only.", "The tested layout from session two, still English only.", [CV], { step: { n: 1, of: 2, stage: "Session 2, English", status: "tested" } }),
    media("cvb-es", 0.85, "assets/christine-valmy/spanish.webp", 1.7778, "The same inquiry form and chat in Spanish",
      "After: the whole page in Spanish.", "What changed: the agent answers in Spanish and every label on the form switches with it. This is the version that shipped.", [CV], { step: { n: 2, of: 2, stage: "Session 3, shipped", status: "shipped" } }),
    quote("cvb-rosa", 0.7, "The Spanish option was huge for us. We're getting way more inquiries from our target demographic now.", "Rosa, enrollment officer (pseudonym)", [CV]),
    prose("cvb-toggle", 0.5, "ACCESSIBLE TOGGLE: The language switch is a combobox with arrow-key navigation and a screen-reader announcement when the language changes.", [{ type: "asset", ref: "cv-chat-flat/ACCESSIBILITY.md", repo: "chekout-ai (local)", label: "Accessibility notes for the Christine Valmy chat" }]),
  ],
});
children.push({
  id: "cv-d-handoff", parent: "cv-results", caseStudy: "christine-valmy",
  question: "How do leads reach the enrollment officers?",
  thesis: "The agent sorts every lead into a priority bucket and flags the bad ones, and n8n carries them to the school's systems.",
  fills: [
    prose("cvh-problem", 1, "THE PROBLEM: Officers spent their day answering the same questions on every call, with no way to tell a ready student from a bad lead before they dialed.", [CV]),
    media("cvh-arch", 0.85, "assets/christine-valmy/architecture.svg", 1.7778, "Christine Valmy agent architecture from student question to sorted lead",
      "From a question to a sorted lead.", "Follow the bottom of the diagram: the conversation becomes a lead with contact details, n8n on GCP hands it to the school's systems, and officers see it already sorted. Drawn from the case study and the ChekOut architecture board.",
      [CV, figma(CKJ, "4:135", "FigJam: 4 · Sophia, enrollment agent")]),
    prose("cvh-buckets", 0.7, "SORTING: The agent puts each lead in a priority bucket and flags the bad ones, so officers know whom to call first.", [CV]),
    prose("cvh-fresh", 0.55, "FRESH ANSWERS: The agent answers from the school's own content through RAG, and an automated pipeline keeps class schedules current in the chat.", [CV]),
    prose("cvh-n8n", 0.5, "THE BRIDGE: n8n on GCP connects the chat to the school's systems, so a lead doesn't wait for someone to copy it over.", [CV]),
  ],
});
children.push({
  id: "cv-d-a11y", parent: "cv-build", caseStudy: "christine-valmy",
  question: "What did the accessibility audit change?",
  thesis: "Before launch I audited the widget against WCAG AA and rebuilt the controls a screen reader couldn't use.",
  fills: [
    prose("cva-problem", 1, "THE PROBLEM: The first widget's language toggle and topic buttons were plain buttons with no accessibility attributes, so a screen-reader user couldn't tell what they did.", [{ type: "asset", ref: "cv-chat-flat/ACCESSIBILITY.md", repo: "chekout-ai (local)", label: "Before and after notes per control" }]),
    prose("cva-toggle", 0.75, "LANGUAGE TOGGLE: Now a combobox with labels, arrow keys, Enter, Space and Escape, and an announcement when the language changes.", [{ type: "asset", ref: "cv-chat-flat/ACCESSIBILITY.md", repo: "chekout-ai (local)", label: "1. Language Toggle Button" }]),
    prose("cva-topics", 0.6, "TOPIC BUTTONS: Grouped under one label, each with its own description and hidden help text.", [{ type: "asset", ref: "cv-chat-flat/ACCESSIBILITY.md", repo: "chekout-ai (local)", label: "2. Topic Buttons" }]),
    media("cva-mobile", 0.7, "assets/christine-valmy/final-mobile-framed.webp", 0.4719, "The agent on a phone: a bilingual greeting, a student's question about makeup classes, and the top of the inquiry form",
      "The audited widget on a phone.", "The shipped widget at phone width, after the audit: the same three pieces, with controls a keyboard and a screen reader can reach.", [{ type: "asset", ref: "assets/christine-valmy/final-mobile.webp", repo: "Juniper", label: "The unframed phone screenshot" }, CV]),
  ],
});

// =================================================================== KYURI.OS
children.push({
  id: "ky-d-pipeline", parent: "ky-live", caseStudy: "kyuri-os",
  question: "How does the job pipeline work?",
  thesis: "Every role is a Notion row; its status is a history I append to, and the current stage is derived from it.",
  fills: [
    prose("kyp-problem", 1, "THE PROBLEM: A single status field forgets where an application has been, so the funnel can't be counted.", [cr("kyuri-dashboard", "7ee2c40")]),
    prose("kyp-how", 0.8, "HOW: Status is a multi-select in Notion. Writers append a stage instead of overwriting, the current status is derived from the list, and the funnel is counted from it.", [cr("kyuri-dashboard", "7ee2c40")]),
    media("kyp-ramp", 0.65, "assets/kyuri-os/ds-status-ramp.webp", 2.122, "Pipeline status color ramp: applying, applied, phone, interview, offer, rejected, closed",
      "One color per stage.", "Each stage has its own token in the design source, from the teal of applying through the warm interview and offer tones to rejected and closed, so a status reads the same on every panel.",
      [figma(KYF, "2:203", "Tokens / Dark: Pipeline status ramp")]),
    prose("kyp-phone", 0.55, "FROM MY PHONE: Adding a role works with no signal; it waits in an outbox and sends on reconnect.", [record("ff5b2a3f", "Offline support"), cr("kyuri-dashboard", "ab7171a")]),
    commits("kyp-commits", 0.45, "kyuri-dashboard", ["7ee2c40", "e8cf026", "d95ee12", "d18f2c7", "ab7171a"]),
  ],
});
children.push({
  id: "ky-d-tailoring", parent: "ky-guards", caseStudy: "kyuri-os",
  question: "What happens between adding a role and getting a resume?",
  thesis: "Code routes the base resume, a tool-less agent tailors it, a lint checks facts against the base, QA gets two tries, and a leak guard scans the PDF.",
  fills: [
    prose("kyt-problem", 1, "THE PROBLEM: A model asked to tailor a resume will rename titles, borrow keywords it can't back, and print its own notes if nothing stops it.", [cr("kyuri-dashboard", "39023e3"), cr("kyuri-dashboard", "001f2e0")]),
    prose("kyt-route", 0.75, "ROUTE: Code, not the model, picks the base resume, so engineering roles stopped getting the spatial one.", [cr("kyuri-dashboard", "0380547")]),
    prose("kyt-facts", 0.7, "FIXED FACTS: Four things tailoring may never change: titles, companies, dates and degrees.", [cr("kyuri-dashboard", "39023e3")]),
    kpi("kyt-qa", 0.55, "2", "QA attempts before a resume job fails", [LIVE, kyfile("lib/proof.ts", "GUARDS: QA PASSES")]),
    prose("kyt-sandbox", 0.55, "SANDBOX: No agent that reads untrusted text, like a job posting, can touch the machine it runs on.", [cr("kyuri-dashboard", "e529892")]),
    commits("kyt-commits", 0.45, "kyuri-dashboard", ["0380547", "39023e3", "622c6e0", "e529892", "001f2e0", "9ae21e2"]),
  ],
});
children.push({
  id: "ky-d-boards", parent: "ky-build", caseStudy: "kyuri-os",
  question: "Which job boards does it search?",
  thesis: "FIND ROLES searches speedrun startups, the a16z portfolio and Designer Fund straight from Vercel; LinkedIn is deliberately not a source.",
  fills: [
    prose("kyb-problem", 1, "THE PROBLEM: Finding roles shouldn't depend on my laptop being awake, and it shouldn't put my LinkedIn account at risk.", [kyfile("app/api/jobs/roles/route.ts", "Why LinkedIn is not a source")]),
    prose("kyb-speedrun", 0.75, "SPEEDRUN AND A16Z: The speedrun talent network has a public, read-only API, so one integration covers speedrun's own companies and every a16z-backed company.", [kyfile("lib/speedrun.ts", "speedrun talent network as a job source")]),
    prose("kyb-df", 0.65, "DESIGNER FUND: Its board has no API, but each search page is server-rendered and robots.txt allows it, so one cached page per search stays polite.", [kyfile("lib/designer-fund.ts", "Designer Fund board as a job source")]),
    prose("kyb-match", 0.55, "MATCHING: A role must appear in the title as a phrase, because the boards match loosely and \"product engineer\" once returned a production planner.", [kyfile("lib/role-sources.ts", "Title phrase match")]),
    commits("kyb-commits", 0.45, "kyuri-dashboard", ["564d10b", "b20205a", "2564c44", "99f1030"]),
  ],
});
children.push({
  id: "ky-d-box", parent: "ky-build", caseStudy: "kyuri-os",
  question: "How does the laptop box fit in?",
  thesis: "The AI work runs on my laptop behind a tunnel, and the site degrades gracefully when the laptop sleeps.",
  fills: [
    prose("kyx-problem", 1, "THE PROBLEM: The tailoring agents run on my laptop, which sleeps, while the site has to keep answering visitors and candidates.", [ARCH]),
    media("kyx-arch", 0.8, "assets/kyuri-os/architecture.svg", 1.6, "KYURI.OS system context with the box below the site, reached through a Cloudflare tunnel",
      "The box sits behind the tunnel.", "Only the bottom half of this diagram needs the laptop: resume builds, the evidence miner and LinkedIn scouting. Everything above the tunnel keeps working on Vercel when it sleeps.",
      [ARCH, figma(KYJ, "27:2045", "FigJam: 1. System context")]),
    prose("kyx-asleep", 0.7, "WHEN IT SLEEPS: The public demo falls back to the API, a candidate whose add finds the box offline gets the try back, and pages open from the last cached copy.", [ARCH, cr("kyuri-dashboard", "1f1e7f7"), cr("kyuri-dashboard", "ab7171a")]),
    prose("kyx-queue", 0.55, "THE QUEUE: Demo runs go through a job queue on the box with polling and a capped number of tweaks, and the box pulls the latest code when it restarts.", [cr("kyuri-dashboard", "282ad60"), cr("kyuri-dashboard", "4b5f540")]),
    commits("kyx-commits", 0.45, "kyuri-dashboard", ["282ad60", "4b5f540", "e529892", "1f1e7f7", "c7098b6"]),
  ],
});
children.push({
  id: "ky-d-design", parent: "ky-build", caseStudy: "kyuri-os",
  question: "How does the KYURI.OS design system work?",
  thesis: "Figma is the source of truth for tokens and components, and a sync skill builds each design change in the file that renders it.",
  fills: [
    prose("kyd-problem", 1, "THE PROBLEM: Look-and-feel changes made by guessing in code drift from the design, and nobody can say which version is right.", [kyfile("HANDOFF.md", "Design through Figma, not guesses")]),
    media("kyd-tokens", 0.75, "assets/kyuri-os/ds-tokens.webp", 0.8273, "KYURI.OS dark-mode color tokens with CSS variable names and hex values",
      "Tokens, named as they ship.", "Each swatch carries the CSS variable it ships as, in dark and light modes, so a token edit in Figma maps to one line of CSS.", [figma(KYF, "2:112", "Tokens / Dark: Surface & ink")]),
    media("kyd-header", 0.6, "assets/kyuri-os/ds-header.webp", 6.5455, "Header component in three variants, one per area",
      "A component with a variant per area.", "The header's lit tab is a variant, not a one-off, which is what lets a change in Figma land in the one component that renders it.", [figma(KYF, "7:197", "Components: Header")]),
    prose("kyd-sync", 0.6, "THE LOOP: I say \"sync figma\" and the skill snapshots the file, diffs it against a baseline, builds each change in the component it names, checks it on the running site, and annotates the node with the commit.", [cr("kyuri-dashboard", "84e4a46")]),
    media("kyd-pixel", 0.45, "assets/kyuri-os/ds-pixel.webp", 3.7471, "Pixel sprites: a person, a subway car and a rat",
      "Pixel sprites for the subway game.", "The same two-tone palette drawn on a pixel grid for the home page's subway game.", [figma(KYF, "33:339", "Components: pixel assets"), cr("kyuri-dashboard", "79c21cb")]),
  ],
});

// =================================================================== wire parents
const decks = load("decks.json");
const OPENS = {
  "ck-merchant-outcomes": { "ck-cart-prose": "ck-d-cart", "ck-analytics": "ck-d-dashboard" },
  "ck-conversation": { "ck-thinking": "ck-d-motion", "ck-reading-surface": "ck-d-motion" },
  "ck-platform-build": { "ap-embed": "ck-d-builder", "ap-preview": "ck-d-builder", "ck-arch": "ck-d-stack", "ck-system": "ck-d-stack" },
  "cv-testing": { "cv-bento": "cv-d-concept", "cv-spanish": "cv-d-bilingual" },
  "cv-results": { "cv-sorts": "cv-d-handoff" },
  "cv-build": { "cv-a11y": "cv-d-a11y" },
  "ky-live": { "ky-why": "ky-d-pipeline" },
  "ky-guards": { "ky-incident": "ky-d-tailoring" },
  "ky-build": { "ky-build-boards": "ky-d-boards", "ky-build-studios": "ky-d-boards", "ky-arch": "ky-d-box", "ky-build-how": "ky-d-box", "ky-build-ds": "ky-d-design", "ky-ds-tokens": "ky-d-design" },
};
for (const d of decks) for (const [fid, child] of Object.entries(OPENS[d.id] || {})) {
  const f = d.fills.find((x) => x.id === fid);
  if (!f) throw new Error(`${d.id} has no fill ${fid}`);
  f.opens = child;
}
const out = decks.filter((d) => !children.some((c) => c.id === d.id));
save("decks.json", [...out, ...children]);
console.log("children", children.length);
