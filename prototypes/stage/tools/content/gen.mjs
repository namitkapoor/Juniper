// Generates src/data/{case-studies,decks,corpus,home}.json for the stage prototype.
// Every KPI value is asserted to appear verbatim in its source text.
import fs from "node:fs";
import { execSync } from "node:child_process";

const SCR = "/private/tmp/claude-501/-Users-namit-Documents-kyuri-dashboard/cb7d3ac0-c58e-453b-8bb4-32bf6a48924d/scratchpad";
const OUT = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const JUN = "/Users/namit/Documents/personal/code/Juniper";
const KY = "/Users/namit/Documents/kyuri-dashboard";
const CKW = "/Users/namit/Documents/work/chekout-ai";
const REPOS = {
  Juniper: JUN,
  "kyuri-dashboard": KY,
  "chekoutai-frontend": `${CKW}/chekoutai-frontend`,
  "sentry-skin-website": `${CKW}/sentry-skin-website`,
};
const manifest = JSON.parse(fs.readFileSync(`${SCR}/manifest.json`, "utf8"));
const records = JSON.parse(fs.readFileSync(`${SCR}/records.json`, "utf8"));
const R = Object.fromEntries(records.map((r) => [r.id, r]));

// ---------- text hygiene ----------
const clean = (s) =>
  s.replace(/\s+[—–]\s+/g, ": ").replace(/[—–]/g, " to ").replace(/\s+/g, " ").trim();

// ---------- sources for the verbatim check ----------
const read = (p) => fs.readFileSync(p, "utf8");
const SRC = {
  chekoutData: { text: read(`${JUN}/src/data/chekoutData.js`), receipt: dataReceipt("src/data/chekoutData.js", "ChekOut case study data") },
  agentPlatformData: { text: read(`${JUN}/src/data/agentPlatformData.js`), receipt: dataReceipt("src/data/agentPlatformData.js", "Agent platform case study data") },
  cvData: { text: read(`${JUN}/src/data/christineValmyData.js`), receipt: dataReceipt("src/data/christineValmyData.js", "Christine Valmy case study data") },
  imData: { text: read(`${JUN}/src/data/influencerMarketingData.js`), receipt: dataReceipt("src/data/influencerMarketingData.js", "My Influency case study data") },
  mfData: { text: read(`${JUN}/src/data/manageFarmsData.js`), receipt: dataReceipt("src/data/manageFarmsData.js", "Manage Small Farms case study data") },
  rebuildHandoff: { text: read(`${JUN}/design-plans/HANDOFF-rebuild-2026-10-26.md`), receipt: dataReceipt("design-plans/HANDOFF-rebuild-2026-10-26.md", "Portfolio rebuild handoff, perf section") },
  proof: { text: read(`${KY}/lib/proof.ts`), receipt: { type: "asset", ref: "lib/proof.ts", repo: "kyuri-dashboard", date: "2026-10-15", label: "RESUMES_TOTAL snapshot, shown on the public Job Hunt page" } },
};
function dataReceipt(ref, label) {
  return { type: "asset", ref, repo: "Juniper", date: "2026-10-26", label };
}
// The live public pages, captured signed out on 2026-11-02. Values were read off the capture.
const LIVE_JOBHUNT = {
  type: "asset",
  ref: "assets/kyuri-os/job-hunt.webp",
  url: "https://kyuri.namit.me/?area=job-hunt",
  date: "2026-11-02",
  label: "kyuri.namit.me Job Hunt, visitor view, captured 2026-11-02",
};
const LIVE_HOME = {
  type: "asset",
  ref: "assets/kyuri-os/home.webp",
  url: "https://kyuri.namit.me/",
  date: "2026-11-02",
  label: "kyuri.namit.me Home, visitor view, captured 2026-11-02",
};
const LIVE_TEXT = [
  "341 SENT", "88 ACTIVE DAYS", "454 roles captured", "341 marked applied", "3 checks before Drive",
  "475 resumes, all users", "8 sent weekly", "INTERVIEWED 9", "ROUNDS 12", "QA 2 strikes",
  "BROWSE ALL 26 RECEIPTS", "Averaging 8.4 applications per week",
].join("\n");

// ---------- commits ----------
const remoteCache = {};
function onRemote(repo, sha) {
  const k = repo + sha;
  if (k in remoteCache) return remoteCache[k];
  const out = execSync(`git -C "${REPOS[repo]}" branch -r --contains ${sha} 2>/dev/null || true`).toString().trim();
  return (remoteCache[k] = out.length > 0);
}
// Subjects trimmed for publishing: no email addresses, no host internals.
const MSG_OVERRIDE = {
  "240471c": "auth: self-serve Google sign-up with approval; transactional email",
  "ab7171a": "offline: pages open from the last copy after a 4s wait, adds made with no signal wait in an outbox and send on reconnect, a pill says which",
};
const PUBLIC_REPOS = { Juniper: "namitkapoor/Juniper" }; // gh repo view: PUBLIC. All others are private.
function commit(repo, sha) {
  const line = execSync(`git -C "${REPOS[repo]}" log -1 --date=short --format="%h%x09%H%x09%ad%x09%s" ${sha}`).toString().trim();
  const [short, full, date, subject] = line.split("\t");
  const c = { sha: short, full, date, msg: clean(MSG_OVERRIDE[short] || subject), repo };
  if (PUBLIC_REPOS[repo] && onRemote(repo, short)) c.url = `https://github.com/${PUBLIC_REPOS[repo]}/commit/${full}`;
  return c;
}
const commitsUsed = new Map();
function cr(repo, sha, label) {
  const c = commit(repo, sha);
  commitsUsed.set(repo + ":" + c.sha, c);
  const r = { type: "commit", ref: c.sha, repo, date: c.date, label: label ? clean(label) : `${c.sha} · ${c.msg}` };
  if (c.url) r.url = c.url;
  return r;
}
function commitsFill(id, weight, repo, shas, overrides = {}) {
  const items = shas.map((s) => {
    const c = commit(repo, s);
    commitsUsed.set(repo + ":" + c.sha, c);
    const it = { sha: c.sha, date: c.date, msg: overrides[s] ? clean(overrides[s]) : c.msg };
    if (c.url) it.url = c.url;
    return it;
  });
  return { kind: "commits", id, weight, repo, items };
}

// ---------- evidence records ----------
function rr(id) {
  const r = R[id];
  if (!r) throw new Error("no record " + id);
  return { type: "record", ref: id, url: "https://kyuri.namit.me/", date: r.whenEnd, label: clean(r.claim).slice(0, 90).replace(/\s+\S*$/, "") + "…" };
}

// ---------- fill builders ----------
const problems = [];
function kpi(id, weight, value, label, srcKey, extra = {}) {
  let receipts, text;
  if (srcKey === "live") { receipts = [LIVE_JOBHUNT]; text = LIVE_TEXT; }
  else if (srcKey === "liveHome") { receipts = [LIVE_HOME]; text = LIVE_TEXT; }
  else if (srcKey.startsWith("record:")) { const rid = srcKey.slice(7); receipts = [rr(rid)]; text = JSON.stringify(R[rid]); }
  else { receipts = [SRC[srcKey].receipt]; text = SRC[srcKey].text; }
  if (!text.includes(value)) problems.push(`KPI ${id}: "${value}" not verbatim in ${srcKey}`);
  const { more = [], ...rest } = extra;
  return { kind: "kpi", id, weight, value, label: clean(label), ...rest, receipts: [...receipts, ...more] };
}
const prose = (id, weight, text, receipts) => ({ kind: "prose", id, weight, text: clean(text), ...(receipts ? { receipts } : {}) });
const quote = (id, weight, text, who, receipts) => ({ kind: "quote", id, weight, text: clean(text), who: clean(who), ...(receipts ? { receipts } : {}) });
function media(id, weight, src, alt, extra = {}) {
  const key = src.replace(/^assets\//, "");
  const m = manifest[key];
  if (!m) throw new Error("no asset " + src);
  const isVideo = src.endsWith(".mp4");
  const f = { kind: "media", id, weight, media: isVideo ? "video" : "image", src, aspect: m.aspect, alt: clean(alt) };
  if (isVideo) {
    const poster = src.replace(/\.mp4$/, ".jpg");
    if (manifest[poster.replace(/^assets\//, "")]) f.poster = poster;
  }
  if (extra.caption) f.caption = clean(extra.caption);
  f.receipts = [{ type: "asset", ref: src, ...(extra.from ? { repo: "Juniper", label: extra.from } : {}) }, ...(extra.receipts || [])];
  return f;
}
const title = (id, text, kicker) => ({ kind: "title", id, weight: 1, text, ...(kicker ? { kicker } : {}) });

// =====================================================================
// CASE STUDIES
// =====================================================================
const caseStudies = [
  {
    id: "chekout",
    title: "ChekOut AI",
    kicker: "AI SHOPPING AGENT · 2024 TO NOW",
    summary: "A shopping agent that lives inside a merchant's own store, and the builder that brands it from one color.",
    why: "This is the strongest current work and the closest match to the roles Namit targets: he designed and built a shipped AI agent as co-founder, with a measured outcome a merchant approved for publishing (20% of Kivakube's add-to-carts), 13,981 shopper sessions across 22 brands, and a long private commit trail in chekoutai-frontend (Dec 2025 to Sep 2026) that backs each chapter. It also has the richest media of any project: recorded response shapes, motion clips, the analytics dashboard and the builder. The separate agent-platform study is folded in here as the \"how merchants set it up\" deck, because on a three-slot stage two ChekOut studies would crowd out range.",
  },
  {
    id: "christine-valmy",
    title: "Fewer tiles, more students",
    kicker: "AI ENROLLMENT AGENT · BILINGUAL",
    summary: "User testing killed the design I loved, and the bilingual enrollment agent that replaced it more than doubled conversion.",
    why: "It is the clearest design-process story in the portfolio and it ends in numbers: conversion 10% → 23%, $120K enrolled revenue, about 2x the bad leads flagged and about 3 hours saved per officer per day, all confirmed in the 2026-10-26 facts list. It adds what the other two lack: real participant quotes, three before and after testing rounds with images, and a WCAG AA audit. It is also a second shipped AI agent, for a different user (prospective students and enrollment officers) in a different domain, which keeps the three distinct.",
  },
  {
    id: "kyuri-os",
    title: "KYURI.OS",
    kicker: "JOB-SEARCH SYSTEM · LIVE",
    summary: "The job-search system I built and run: AI resume tailoring with guards, a live pipeline, and a public box that answers from dated receipts.",
    why: "It has the strongest evidence of anything Namit has built: a commit trail from 2026-04-05 to today, 26 approved public evidence records, and live numbers anyone can check on kyuri.namit.me (454 roles captured, 341 marked applied, 9 interviewed, 475 resumes across all users). It shows product engineering end to end: multi-agent pipelines with guards and evals, access tiers, rate limits, an offline mode and a Playwright suite. It is the most distinct of the candidates, and its weakness (fewer polished visuals) is offset by live screenshots of the public pages.",
  },
];

// =====================================================================
// DECKS
// =====================================================================
const decks = [];

// ---------- ChekOut ----------
decks.push({
  id: "ck-merchant-outcomes",
  question: "What did the ChekOut agent change for merchants?",
  thesis: "Shoppers buy through the conversation, and merchants can see exactly what they asked.",
  caseStudy: "chekout",
  fills: [
    kpi("ck-atc", 1, "20%", "of Kivakube's add-to-carts came through the agent", "chekoutData", { more: [cr("chekoutai-frontend", "d22f151", "d22f151 · Tag Shopify carts with ChekOut AI attribution attributes for order attribution")] }),
    kpi("ck-sessions", 0.8, "13,981", "shopper sessions", "chekoutData", { period: "Feb to Jul 2026" }),
    kpi("ck-brands", 0.6, "22", "brands the agent served", "chekoutData", { period: "Feb to Jul 2026" }),
    media("ck-top-metrics", 0.75, "assets/chekout/top-metrics.webp", "Dashboard top metrics: 126 total visitors, 86% engagement rate", { caption: "Top metrics from a live store.", from: "src/data/chekoutData.js ck-analytics" }),
    kpi("ck-engagement", 0.5, "86%", "engagement rate on a live store", "chekoutData", { more: [cr("chekoutai-frontend", "c78b8c4")] }),
    prose("ck-cart-prose", 0.6, "The agent sells, and the store's own cart closes the sale. View cart opens the merchant's real cart with the discounts and checkout it already runs, so there is no second cart to reconcile.", [SRC.chekoutData.receipt]),
    media("ck-analytics", 0.55, "assets/chekout/analytics.mp4", "The analytics dashboard on Kivakube: visitors, an insight tooltip, and a keyword opening the conversations behind it", { caption: "Each keyword opens the threads that mention it.", from: "src/data/chekoutData.js ck-analytics", receipts: [cr("chekoutai-frontend", "ab03e36")] }),
  ],
});
decks.push({
  id: "ck-conversation",
  question: "How does the shopper conversation work?",
  thesis: "Retrieval picks the layout: words when nothing fits, one card for one match, a bundle when products belong together.",
  caseStudy: "chekout",
  fills: [
    media("ck-shape-product", 1, "assets/chekout/shape-product.mp4", "A shopper asks a question with one clear match and the agent answers with one product card and the reason for it", { caption: "One clear intent gets one card and the reason for it.", from: "src/data/chekoutData.js ck-conversation" }),
    media("ck-shape-question", 0.7, "assets/chekout/shape-question.mp4", "A question the catalog cannot resolve, answered in plain words with no product cards", { caption: "No product fits, so the agent answers in words.", from: "src/data/chekoutData.js ck-conversation" }),
    media("ck-shape-bundle", 0.7, "assets/chekout/shape-bundle.mp4", "Products that belong together arrive as a set in the chat", { caption: "Products that only make sense together arrive as a bundle.", from: "src/data/chekoutData.js ck-conversation" }),
    prose("ck-reading-surface", 0.6, "In January the panel read like a support widget, with a canned \"Got it! I recommend:\" above a pile of cards. I re-set it as a reading surface: larger type, open leading, product names and prices in bold inside the sentence.", [SRC.chekoutData.receipt, cr("chekoutai-frontend", "ae7b695")]),
    media("ck-thinking", 0.4, "assets/chekout/thinking.mp4", "The thinking state holds the shopper's place, then the reply fades in", { caption: "Motion that carries state: the agent is working.", from: "src/data/chekoutData.js ck-motion" }),
    media("ck-add-to-cart", 0.4, "assets/chekout/add-to-cart.mp4", "A product card confirms the add in place and shows the quantity from then on", { caption: "The card confirms in place.", from: "src/data/chekoutData.js ck-motion" }),
    commitsFill("ck-conv-commits", 0.35, "chekoutai-frontend", ["cef8abf", "8d840f3", "3987a9b", "ae7b695"]),
  ],
});
decks.push({
  id: "ck-platform-build",
  question: "How was it built, and how do merchants set it up?",
  thesis: "One brand color in, a readable branded agent out, live on a store in 5 to 30 minutes, built in the browser with Claude Code.",
  caseStudy: "chekout",
  fills: [
    kpi("ap-time", 0.9, "5 to 30", "minutes from setup to a live, branded agent", "agentPlatformData", { unit: "min" }),
    commitsFill("ap-commits", 0.85, "chekoutai-frontend", ["fe5f2a1", "bceb8f0", "2127ede", "a57a3e3", "faf5efd", "b343c7e", "cb6e4a8"]),
    media("ap-embed", 0.8, "assets/chekout/embedding-agents.mp4", "The builder's channel step: brand settings beside the live widget preview, then the embed snippet pasted into a Shopify theme", { caption: "The channel step: brand settings beside the live widget, then one snippet into the store.", from: "src/data/agentPlatformData.js preview-is-the-widget" }),
    prose("ap-preview", 0.6, "The builder's preview started as a hand-built copy and drifted from what shipped. I replaced it with the real widget in an iframe and passed the merchant's unsaved settings through the URL.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "fe5f2a1")]),
    kpi("ap-prompts", 0.55, "577", "Claude Code prompts across 14 sessions on the frontend", "agentPlatformData"),
    prose("ap-ios", 0.45, "On iOS, pulling the chat past its top reached Safari as pull-to-refresh and reloaded the merchant's page mid-conversation. I stopped the gesture at the widget's edge.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "bceb8f0", "bceb8f0 · overscroll-behavior on the embed root, contain on the message list")]),
    kpi("ap-merchants", 0.4, "8", "merchants live on one codebase", "agentPlatformData", { more: [] }),
  ],
});

// ---------- Christine Valmy ----------
decks.push({
  id: "cv-results",
  question: "What did the enrollment agent change for the school?",
  thesis: "A bilingual agent answering on the school's site more than doubled conversion and gave officers back their day.",
  caseStudy: "christine-valmy",
  fills: [
    kpi("cv-conv", 1, "10% → 23%", "conversion", "cvData"),
    kpi("cv-rev", 0.85, "$120K", "enrolled revenue", "cvData"),
    kpi("cv-hours", 0.6, "~3 hrs", "saved per officer, per day", "cvData"),
    kpi("cv-bad", 0.5, "~2×", "bad leads flagged", "cvData"),
    media("cv-agent-reply", 0.8, "assets/christine-valmy/agent-reply.mp4", "A student asks what she can study after high school and the agent replies beside the inquiry form", { caption: "The shipped agent answering a new student on the school's site.", from: "src/data/christineValmyData.js cv-agent" }),
    quote("cv-rosa", 0.65, "The Spanish option was huge for us. We're getting way more inquiries from our target demographic now. And the quality of leads is better, people come in already knowing what we offer.", "Rosa, enrollment officer (pseudonym)", [SRC.cvData.receipt]),
    prose("cv-sorts", 0.45, "The agent answers from the school's own content through RAG, and an automated pipeline keeps class schedules fresh. It sorts every lead into a priority bucket and flags the bad ones, so officers know whom to call first.", [SRC.cvData.receipt]),
  ],
});
decks.push({
  id: "cv-testing",
  question: "How did user testing change the design?",
  thesis: "Students skipped the clever tiles and went looking for Instagram, so I cut the design I loved and fixed one thing per session.",
  caseStudy: "christine-valmy",
  fills: [
    media("cv-bento", 0.9, "assets/christine-valmy/bento-concept.webp", "Bento grid concept: green tiles for pricing, courses, alumni and schedule around a chat prompt", { caption: "The design I loved: every topic one tap from the chat.", from: "src/data/christineValmyData.js cv-design-i-loved" }),
    quote("cv-maria", 0.8, "The first thing I do after talking to someone about a school is check out their Instagram. That tells me more than any brochure.", "Maria, 19, prospective student (pseudonym)", [SRC.cvData.receipt]),
    media("cv-final", 0.75, "assets/christine-valmy/final-design.webp", "Inquiry form beside the chat, with a row of social links underneath", { caption: "What survived: a short form, the chat, and the social links.", from: "src/data/christineValmyData.js cv-three-fixes" }),
    media("cv-dd-before", 0.45, "assets/christine-valmy/dropdown-before.webp", "Chat with Skin and NYC dropdowns beside the message input", { caption: "Session one, before: students read the dropdowns as suggested topics.", from: "src/data/christineValmyData.js cv-three-fixes" }),
    media("cv-dd-after", 0.45, "assets/christine-valmy/dropdown-after.webp", "Chat with a single message input and no dropdowns", { caption: "After: the agent reads location and course from the message.", from: "src/data/christineValmyData.js cv-three-fixes" }),
    media("cv-spanish", 0.5, "assets/christine-valmy/spanish.webp", "The same inquiry form and chat in Spanish", { caption: "Session three: the form and the agent switch to Spanish.", from: "src/data/christineValmyData.js cv-three-fixes" }),
    prose("cv-cut", 0.5, "The tiles read as marketing. Photos from real students did not, and officers said students who had checked Instagram arrived more serious. I cut the student ID card and the grid.", [SRC.cvData.receipt]),
  ],
});
decks.push({
  id: "cv-build",
  question: "How was the Christine Valmy agent built?",
  thesis: "A React widget inside a WordPress plugin, bridged to the school's systems through n8n, audited to WCAG AA before launch.",
  caseStudy: "christine-valmy",
  fills: [
    prose("cv-stack", 0.85, "The chat ships as a React widget in a WordPress plugin, with n8n on GCP bridging it to the school's systems. I tested the agent across the major models, shipped it with Claude, and it now runs on Gemini.", [SRC.cvData.receipt]),
    media("cv-mobile", 0.7, "assets/christine-valmy/final-mobile.webp", "The agent on a phone: a bilingual greeting, a student's question about makeup classes, the inquiry form and social links below", { caption: "The same agent on a phone.", from: "public/images/Case Studies/CV/cv-final-mobile.png" }),
    commitsFill("cv-commits", 0.65, "sentry-skin-website", ["4a3eae5", "2aef9aa", "9045ebc", "56c6c5c", "c455e47"]),
    prose("cv-a11y", 0.55, "I audited the widget against WCAG AA before launch: the language toggle became a combobox with keyboard support and screen-reader announcements, and topic buttons got a labeled group.", [SRC.cvData.receipt, { type: "asset", ref: "cv-chat-flat/ACCESSIBILITY.md", repo: "chekout-ai (local)", label: "Accessibility notes for the Christine Valmy chat" }]),
    prose("cv-trade-school", 0.4, "The work became a vertical: I added a Trade School page, a site-wide product toggle and a separate trade-school chat route to the ChekOut company site.", [rr("bb9eabcf")]),
    media("cv-laptop", 0.5, "assets/christine-valmy/laptop.mp4", "The Christine Valmy site on a laptop with the enrollment agent open", { from: "src/data/christineValmyData.js hero" }),
  ],
});

// ---------- KYURI.OS ----------
decks.push({
  id: "ky-live",
  question: "Does KYURI.OS actually run his job search?",
  thesis: "Yes: the public Job Hunt page shows the live totals from the same pipeline candidates use, with companies and people left out.",
  caseStudy: "kyuri-os",
  fills: [
    media("ky-jobhunt-shot", 1, "assets/kyuri-os/job-hunt.webp", "KYURI.OS Job Hunt, visitor view: 341 sent, 88 active days, a pipeline of 454 roles captured, 341 marked applied, 3 agent checks, 475 resumes and 8 sent weekly", { caption: "The public Job Hunt page, signed out, 2026-11-02.", receipts: [LIVE_JOBHUNT] }),
    kpi("ky-captured", 0.8, "454", "roles captured", "live", { period: "as of 2026-11-02" }),
    kpi("ky-sent", 0.8, "341", "marked applied", "live", { period: "as of 2026-11-02" }),
    kpi("ky-interviews", 0.6, "9", "reached interviews", "live", { period: "as of 2026-11-02" }),
    kpi("ky-resumes", 0.6, "475", "tailored resumes, all users", "proof", { period: "snapshot 2026-10-15", more: [LIVE_JOBHUNT] }),
    kpi("ky-weekly", 0.35, "8", "applications sent weekly", "live"),
    prose("ky-why", 0.5, "I built this for my own job hunt and it has been running it since April. Adding a role from my phone writes a tailored one-page resume to Drive and logs the application.", [cr("kyuri-dashboard", "1be40d8", "1be40d8 · first commit, 2026-04-05"), LIVE_JOBHUNT]),
  ],
});
decks.push({
  id: "ky-guards",
  question: "How does it keep AI-written resumes honest?",
  thesis: "Code, not the model, decides what a resume may say: routing, a fit gate, a fact lint, a QA gate and a leak guard stand between the model and the PDF.",
  caseStudy: "kyuri-os",
  fills: [
    commitsFill("ky-guard-commits", 1, "kyuri-dashboard", ["0380547", "39023e3", "001f2e0", "5cc8009", "9ae21e2", "0c4506f"]),
    prose("ky-incident", 0.75, "In June a tailored resume went out with the agent's own keyword notes printed under SKILLS. The fix put a leak guard, a QA gate and evals between the model and the page, and the tailoring agent now runs with no tools.", [cr("kyuri-dashboard", "001f2e0"), LIVE_JOBHUNT]),
    kpi("ky-checks", 0.6, "3", "agent checks before a resume reaches Drive", "live"),
    prose("ky-fitgate", 0.55, "Before tailoring, a fit gate scores the posting, maps its duties to my background and records a verdict that steers the tailoring and QA steps after it.", [rr("b2f287c5")]),
    prose("ky-pagegate", 0.45, "The build refuses to publish a resume still over one page at the tightest layout, runs one trim pass and re-lints before rebuilding.", [rr("ff6a6375")]),
  ],
});
decks.push({
  id: "ky-open",
  question: "How did he open it to other people safely?",
  thesis: "Before letting anyone else in, every route got an access tier, every token-spending action a rate limit, and every test a guard against touching real data.",
  caseStudy: "kyuri-os",
  fills: [
    prose("ky-tiers", 0.9, "Every route and panel is scoped to the viewer: visitors see public data, candidates see their own pipeline, and I see everything. Google sign-in gates candidates against an allowlist.", [rr("b0b443c6"), cr("kyuri-dashboard", "008461c"), cr("kyuri-dashboard", "8e51eb5")]),
    kpi("ky-email-cap", 0.7, "200", "emails per rolling 24 hours, enforced by a log table", "record:46faab54"),
    kpi("ky-418", 0.6, "418", "returned for any unsanctioned write a view-only test fires", "record:de8e5fc1"),
    media("ky-home", 0.75, "assets/kyuri-os/home.webp", "KYURI.OS home, visitor view: the subway-test headline, a pixel subway game, and the ASK MY WORK box that cites 26 receipts", { caption: "The public home: ASK MY WORK answers only from approved, dated records.", receipts: [LIVE_HOME] }),
    prose("ky-hygiene", 0.45, "The end-to-end suite tears down only rows it created, by recorded id, email domain or hashed IP, never by time window.", [rr("88ce4fc3")]),
    prose("ky-offline", 0.35, "Offline, pages open from the last cached copy after a 4s wait, and jobs added with no signal wait in an outbox and send on reconnect.", [rr("ff5b2a3f")]),
    commitsFill("ky-open-commits", 0.4, "kyuri-dashboard", ["008461c", "bd34a2c", "282ad60", "ab7171a", "c2c2a19"]),
  ],
});

// ---------- any other work ----------
decks.push({
  id: "other-agents",
  question: "Has he shipped AI agents?",
  thesis: "Three, in production: a shopping agent for merchants, an enrollment agent for a school, and the multi-agent resume pipeline that runs his own search.",
  fills: [
    kpi("oa-ck", 0.9, "20%", "of Kivakube's add-to-carts came through the ChekOut agent", "chekoutData"),
    kpi("oa-cv", 0.9, "10% → 23%", "conversion with the Christine Valmy enrollment agent", "cvData"),
    media("oa-ck-video", 0.8, "assets/chekout/app-experience.mp4", "The ChekOut agent on a storefront answering a shopper with product cards beside the chat", { caption: "ChekOut's agent on a merchant's store.", from: "src/data/caseStudies.js agent-platform videoSrc" }),
    prose("oa-kyuri", 0.6, "KYURI.OS chains agents with guards: code routes the base resume, a fit gate judges the posting, a tool-less agent tailors, and a QA gate and leak guard check the PDF.", [cr("kyuri-dashboard", "0380547"), cr("kyuri-dashboard", "001f2e0"), rr("b2f287c5")]),
    prose("oa-voice", 0.35, "Earlier, on the ChekOut company site, I built a voice assistant that spoke its answers and drove a 3D sphere. It was later archived out of the production build.", [rr("d70f6969")]),
    commitsFill("oa-commits", 0.4, "chekoutai-frontend", ["4828dd9", "329e82d", "fe5f2a1"]),
  ],
});
decks.push({
  id: "other-qa",
  question: "What QA work has he done?",
  thesis: "Test suites that guard real users and real data: Playwright on ChekOut's widget, Vitest on its builder, and a Kyuri suite that cannot spend credits or delete what it did not create.",
  fills: [
    kpi("qa-418", 0.7, "418", "Kyuri's answer to any write a view-only test fires", "record:de8e5fc1"),
    prose("qa-kyuri", 0.8, "Kyuri's Playwright suite answers any non-GET request a page fires on its own with a 418 unless allowlisted, and teardown removes only rows the suite created.", [rr("de8e5fc1"), rr("88ce4fc3")]),
    prose("qa-ck-preview", 0.65, "ChekOut's preview suite runs the real widget before it reaches a storefront: sending, suggestions, add-to-cart, fonts, and text that stays readable on a bright brand color.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "bceb8f0")]),
    commitsFill("qa-ck-commits", 0.75, "chekoutai-frontend", ["ae9a132", "596e4eb", "c7a46a7", "5cd35a6", "04aef3a", "3193982", "67919c7"]),
    prose("qa-a11y", 0.45, "Accessibility is part of QA for me: the Christine Valmy widget was audited to WCAG AA before launch.", [SRC.cvData.receipt]),
  ],
});
decks.push({
  id: "other-research",
  question: "Has he run user research?",
  thesis: "Every agent above started as a research problem: task analysis and usability tests are where the designs changed.",
  fills: [
    kpi("re-clicks", 0.8, "28%", "fewer clicks to find an influencer's status", "imData"),
    kpi("re-time", 0.6, "1m 47s", "saved per task", "imData"),
    kpi("re-success", 0.6, "95%", "task success across 8 core tasks", "imData"),
    media("re-im", 0.75, "assets/other/influencer-laptop.webp", "My Influency on a laptop: a campaign timeline showing an influencer's offer accepted", { caption: "My Influency: 5 status tabs became one timeline.", from: "public/images/Project Cover Photos/MI on Laptop.png" }),
    quote("re-maria", 0.6, "The first thing I do after talking to someone about a school is check out their Instagram. That tells me more than any brochure.", "Maria, 19, prospective student (pseudonym)", [SRC.cvData.receipt]),
    kpi("re-sus", 0.45, "70", "SUS score on the Manage Small Farms redesign", "mfData", { baseline: "52" }),
    media("re-farms", 0.4, "assets/other/farms-final.webp", "Five phone screens from the Manage Small Farms prototype: status feed, field rows, weekly work plan and two analysis views", { caption: "Manage Small Farms: a spatial map instead of lists.", from: "public/images/Case Studies/JD/Final prototype combined.png" }),
  ],
});

// =====================================================================
// HOME
// =====================================================================
const home = {
  id: "home",
  question: "",
  thesis: "Namit designs and ships AI agents, and every claim on this stage comes with a receipt.",
  fills: [
    title("home-title", "namit", "PRODUCT DESIGNER · NEW YORK"),
    prose("home-currently", 0.7, "CURRENTLY: Designing and shipping AI agents at ChekOut AI."),
    prose("home-three", 0.5, "THREE CASE STUDIES"),
    media("home-ck", 0.6, "assets/chekout/cover.webp", "ChekOut AI's agent open on a laptop beside a merchant's storefront", { caption: "ChekOut AI: " + caseStudies[0].summary, from: "public/images/Project Cover Photos/CK on laptop.webp" }),
    media("home-cv", 0.55, "assets/christine-valmy/cover.webp", "Christine Valmy's enrollment agent beside the inquiry form", { caption: "Christine Valmy: " + caseStudies[1].summary, from: "public/images/Project Cover Photos/CV thumbnail.webp" }),
    media("home-ky", 0.55, "assets/kyuri-os/job-hunt.webp", "KYURI.OS Job Hunt page with live pipeline totals", { caption: "KYURI.OS: " + caseStudies[2].summary, receipts: [LIVE_JOBHUNT] }),
  ],
};

// =====================================================================
// CORPUS
// =====================================================================
const corpus = [];
function unit(id, titleText, tags, text, fills) {
  const receipts = [];
  const seen = new Set();
  for (const f of fills) for (const r of f.receipts || []) { const k = r.type + r.ref + (r.repo || ""); if (!seen.has(k)) { seen.add(k); receipts.push(r); } }
  for (const f of fills) if (f.kind === "commits") for (const it of f.items) { const k = "commit" + it.sha + f.repo; if (!seen.has(k)) { seen.add(k); receipts.push({ type: "commit", ref: it.sha, repo: f.repo, date: it.date, label: `${it.sha} · ${it.msg}`, ...(it.url ? { url: it.url } : {}) }); } }
  corpus.push({ id, title: clean(titleText), tags, text: clean(text), fills, receipts });
}

// --- ChekOut sections
unit("ck-conversation", "ChekOut: answer the question the shopper asked", ["chekout", "ai-agent", "conversational-ui", "ecommerce", "retrieval", "product-design", "typography"],
  "Retrieval picks the response shape: no product fits, so the agent answers in words; one clear match gets one card; products that belong together arrive as a bundle. I re-set the panel as a reading surface with product names and prices in bold inside the sentence.",
  [media("u-ck-product", 0.8, "assets/chekout/shape-product.mp4", "One clear match gets one product card", { from: "src/data/chekoutData.js" }),
   media("u-ck-bundle", 0.6, "assets/chekout/shape-bundle.mp4", "A bundle of products that belong together", { from: "src/data/chekoutData.js" }),
   prose("u-ck-conv", 0.6, "The shopper never picks a mode. The panel takes its shape from whatever retrieval returned.", [SRC.chekoutData.receipt])]);
unit("ck-motion", "ChekOut: motion that carries state", ["chekout", "motion", "micro-interactions", "frontend", "product-design"],
  "Each animation tells the shopper what the agent is doing: a thinking state, products arriving in a carousel, product detail opening beside the thread, and a card that confirms an add in place.",
  [media("u-ck-thinking", 0.5, "assets/chekout/thinking.mp4", "The thinking state, then the reply fades in", { from: "src/data/chekoutData.js" }),
   media("u-ck-carousel", 0.5, "assets/chekout/rec-carousel.mp4", "Products arrive with the answer in a carousel", { from: "src/data/chekoutData.js" }),
   media("u-ck-hover", 0.4, "assets/chekout/launcher-hover.mp4", "The closed launcher offers two suggested questions on hover", { from: "src/data/agentPlatformData.js" }),
   commitsFill("u-ck-motion-commits", 0.4, "chekoutai-frontend", ["cef8abf", "f56fbdf", "0c93dcc"])]);
unit("ck-cart", "ChekOut: the cart stays the store's", ["chekout", "ecommerce", "conversion", "shopify", "metrics"],
  "Shoppers add to cart inside the conversation, and View cart opens the merchant's real cart. 20% of Kivakube's add-to-carts came through the agent.",
  [kpi("u-ck-atc", 0.9, "20%", "of Kivakube's add-to-carts came through the agent", "chekoutData"),
   media("u-ck-viewcart", 0.6, "assets/chekout/view-cart.mp4", "Two lampshades added in the widget, then View cart opens Rosendahl's own cart", { from: "src/data/chekoutData.js" }),
   commitsFill("u-ck-cart-commits", 0.35, "chekoutai-frontend", ["d22f151", "62bde85", "2e113b9"])]);
unit("ck-analytics", "ChekOut: merchants read the conversation", ["chekout", "dashboard", "analytics", "data-viz", "b2b", "bigquery"],
  "The merchant dashboard answers what shoppers are asking with the conversations themselves. Insights turn a number into a next step, and each keyword opens the threads behind it.",
  [media("u-ck-metrics", 0.7, "assets/chekout/top-metrics.webp", "126 total visitors, 86% engagement rate", { from: "src/data/chekoutData.js" }),
   media("u-ck-analytics", 0.6, "assets/chekout/analytics.mp4", "Dashboard: an insight tooltip and a keyword opening its threads", { from: "src/data/chekoutData.js" }),
   commitsFill("u-ck-dash-commits", 0.5, "chekoutai-frontend", ["5264ce8", "ab03e36", "c78b8c4", "99f80a8", "4c38f1f"])]);
unit("ck-scale", "ChekOut: sessions and brands", ["chekout", "scale", "metrics", "ai-agent"],
  "Across Feb to Jul 2026 the agent ran 13,981 shopper sessions across 22 brands.",
  [kpi("u-ck-sessions", 0.8, "13,981", "shopper sessions across 22 brands", "chekoutData", { period: "Feb to Jul 2026" }),
   kpi("u-ck-brands", 0.5, "22", "brands", "chekoutData")]);
unit("ap-one-color", "Agent platform: one color in", ["chekout", "design-system", "theming", "accessibility", "contrast", "wcag"],
  "Merchants type one brand color; the widget derives the rest. Text flips between dark and light by brightness, and the footer checks three text tiers against WCAG ratios of 7, 5.5 and 4.5 to 1.",
  [prose("u-ap-color", 0.7, "Merchants pick one color and the code makes it readable. The footer checks three text tiers against WCAG ratios of 7, 5.5 and 4.5 to 1 and corrects any that fall short.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "a57a3e3"), cr("chekoutai-frontend", "6762f5d")]),
   media("u-ap-kiva", 0.5, "assets/chekout/store-kivakube.webp", "Kivakube's storefront homepage, a ChekOut merchant", { from: "public/images/Case Studies/CK/demo/kivakube/home.webp" }),
   media("u-ap-rosen", 0.5, "assets/chekout/store-rosendahl.webp", "Rosendahl's storefront homepage, a ChekOut merchant", { from: "public/images/Case Studies/CK/demo/rosendahl/home.webp" })]);
unit("ap-preview", "Agent platform: the preview is the widget", ["chekout", "builder", "b2b", "onboarding", "iframe", "frontend"],
  "The builder's preview is the real widget in an iframe with the merchant's unsaved settings passed through the URL. Setup is three steps (persona, knowledge base, channel), and a merchant goes live in 5 to 30 minutes.",
  [kpi("u-ap-time", 0.7, "5 to 30", "minutes to a live, branded agent", "agentPlatformData", { unit: "min" }),
   media("u-ap-embed", 0.7, "assets/chekout/embedding-agents.mp4", "The channel step and the embed snippet going into a Shopify theme", { from: "src/data/agentPlatformData.js" }),
   commitsFill("u-ap-prev-commits", 0.5, "chekoutai-frontend", ["fe5f2a1", "7f4d4c0", "ccc8edb"])]);
unit("ap-guest", "Agent platform: a guest on someone else's page", ["chekout", "design-system", "embed", "launcher", "frontend"],
  "The widget has its own tokens and lives in an iframe so the store's CSS stays out. Our launcher covered cart drawers and cookie banners, so a fixed preset became two sliders: distance from the bottom and stacking level.",
  [prose("u-ap-guest", 0.6, "The builder speaks as ChekOut and the widget speaks as the store. Two sliders, bottom distance and stacking level, replaced a fixed raised preset that covered cart drawers.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "2127ede")]),
   media("u-ap-hover", 0.5, "assets/chekout/launcher-hover.mp4", "The closed launcher on a merchant's store", { from: "src/data/agentPlatformData.js" }),
   commitsFill("u-ap-guest-commits", 0.4, "chekoutai-frontend", ["35d7869", "2127ede", "2e4bff0", "faf5efd", "106c2d2", "7a63949"])]);
unit("ap-ios", "Agent platform: the iOS pull-to-refresh bug", ["chekout", "mobile", "ios", "bug", "frontend", "debugging"],
  "On iOS a pull past the top of the chat reached Safari as pull-to-refresh and reloaded the merchant's page with the shopper's conversation in it. I stopped the gesture at the widget's edge with overscroll-behavior on the embed root and contain on the message list.",
  [prose("u-ap-ios", 0.7, "A pull past the top of the chat reloaded the merchant's store on iOS. I stopped the gesture at the widget's edge.", [SRC.agentPlatformData.receipt, cr("chekoutai-frontend", "bceb8f0"), cr("chekoutai-frontend", "9f7b1e2")])]);
unit("ap-claude-code", "Agent platform: built in the browser with Claude Code", ["chekout", "claude-code", "ai-tooling", "process", "testing", "playwright"],
  "I built most of the agent platform with Claude Code: 14 sessions and 577 prompts, about one in seven a correction. A Playwright suite runs the real widget on a preview page before it reaches a storefront, on desktop Chrome for now.",
  [kpi("u-ap-prompts", 0.6, "577", "prompts across 14 Claude Code sessions", "agentPlatformData"),
   commitsFill("u-ap-cc-commits", 0.5, "chekoutai-frontend", ["bceb8f0", "cb6e4a8", "67919c7"])]);

// --- Christine Valmy sections
unit("cv-loved", "Christine Valmy: the design I loved", ["christine-valmy", "concept", "bento", "product-design", "process"],
  "I wanted enrollment to feel like an app: a student ID card filled in as the student chatted, with a bento grid of tiles for pricing, courses, alumni and schedules around it.",
  [media("u-cv-bento", 0.7, "assets/christine-valmy/bento-concept.webp", "The bento grid concept around the chat", { from: "src/data/christineValmyData.js" }),
   media("u-cv-id", 0.5, "assets/christine-valmy/student-id-concept.webp", "Student ID concept: a card with name, email and course picks for nails, haircare, makeup and esthetics", { from: "public/images/Case Studies/CV/cv-student-id-concept.png" })]);
unit("cv-testing", "Christine Valmy: what testing showed", ["christine-valmy", "user-research", "usability-testing", "quotes", "social-proof"],
  "Prospective students skipped the tiles and kept asking whether the school had Instagram. I cut the ID card and the grid and kept a short inquiry form, the chat and the social links.",
  [quote("u-cv-maria", 0.7, "The first thing I do after talking to someone about a school is check out their Instagram. That tells me more than any brochure.", "Maria, 19, prospective student (pseudonym)", [SRC.cvData.receipt]),
   media("u-cv-social-before", 0.5, "assets/christine-valmy/social-before.webp", "Chat with topic buttons and social links in a left column", { from: "src/data/christineValmyData.js" }),
   media("u-cv-final", 0.5, "assets/christine-valmy/final-design.webp", "Inquiry form beside the chat with social links underneath", { from: "src/data/christineValmyData.js" })]);
unit("cv-fixes", "Christine Valmy: three fixes, three sessions", ["christine-valmy", "iteration", "bilingual", "spanish", "accessibility", "wcag"],
  "Each session found one thing students tripped on: dropdowns read as topics, social links in the wrong place, and English only for students who spoke Spanish first. The agent and every label now work in both languages, and the widget was audited to WCAG AA.",
  [media("u-cv-ddb", 0.4, "assets/christine-valmy/dropdown-before.webp", "Dropdowns beside the chat input", { from: "src/data/christineValmyData.js" }),
   media("u-cv-dda", 0.4, "assets/christine-valmy/dropdown-after.webp", "A single message input, no dropdowns", { from: "src/data/christineValmyData.js" }),
   media("u-cv-es", 0.5, "assets/christine-valmy/spanish.webp", "The form and chat in Spanish", { from: "src/data/christineValmyData.js" }),
   quote("u-cv-rosa", 0.6, "The Spanish option was huge for us. We're getting way more inquiries from our target demographic now.", "Rosa, enrollment officer (pseudonym)", [SRC.cvData.receipt])]);
unit("cv-agent", "Christine Valmy: an agent that sorts leads", ["christine-valmy", "ai-agent", "rag", "n8n", "outcomes", "metrics", "lead-scoring"],
  "The agent answers from the school's content through RAG, keeps schedules fresh, and sorts each lead into a priority bucket. Conversion went from 10% to 23%, with $120K in enrolled revenue.",
  [kpi("u-cv-conv", 0.9, "10% → 23%", "conversion", "cvData"),
   kpi("u-cv-rev", 0.7, "$120K", "enrolled revenue", "cvData"),
   kpi("u-cv-hrs", 0.5, "~3 hrs", "saved per officer, per day", "cvData"),
   media("u-cv-reply", 0.6, "assets/christine-valmy/agent-reply.mp4", "The agent replying to a new student", { from: "src/data/christineValmyData.js" })]);

// --- KYURI.OS sections
unit("ky-live-totals", "KYURI.OS: live job-hunt totals", ["kyuri", "job-search", "metrics", "live-data", "pipeline", "notion"],
  "The public Job Hunt page shows the live shape of my search: 454 roles captured, 341 marked applied, 9 reached interviews, 475 tailored resumes across all users.",
  [kpi("u-ky-cap", 0.7, "454", "roles captured", "live", { period: "as of 2026-11-02" }),
   kpi("u-ky-sent", 0.7, "341", "marked applied", "live", { period: "as of 2026-11-02" }),
   kpi("u-ky-int", 0.5, "9", "reached interviews", "live", { period: "as of 2026-11-02" }),
   media("u-ky-shot", 0.7, "assets/kyuri-os/job-hunt.webp", "KYURI.OS Job Hunt, visitor view", { receipts: [LIVE_JOBHUNT] })]);
unit("ky-resume-guards", "KYURI.OS: guards on AI resume tailoring", ["kyuri", "ai-agent", "guardrails", "evals", "llm", "qa", "resume"],
  "Code picks the base resume, four facts may never be renamed, a fit gate judges the posting, and since a resume shipped the agent's own notes in June, a leak guard, QA gate and evals sit between the model and the PDF.",
  [commitsFill("u-ky-guard-commits", 0.7, "kyuri-dashboard", ["0380547", "39023e3", "001f2e0", "5cc8009", "9ae21e2"]),
   kpi("u-ky-checks", 0.4, "3", "agent checks before Drive", "live")]);
unit("ky-public-home", "KYURI.OS: ASK MY WORK and the public site", ["kyuri", "evidence", "receipts", "rag", "public-site", "portfolio"],
  "The public home answers \"can he do your work?\" only from approved, dated evidence records, each traced to the commit or design it came from. It currently cites 26 receipts.",
  [kpi("u-ky-receipts", 0.5, "26", "approved public evidence records", "liveHome"),
   media("u-ky-home", 0.6, "assets/kyuri-os/home.webp", "KYURI.OS public home with ASK MY WORK", { receipts: [LIVE_HOME] }),
   commitsFill("u-ky-ask-commits", 0.5, "kyuri-dashboard", ["82bfacf", "c2c2a19", "e42e005", "e9bc16c"])]);

// --- one unit per public evidence record
const AREA_TAGS = { frontend: ["frontend"], ai: ["ai-agent", "ai"], qa: ["qa", "testing"], "backend-data": ["backend", "data"], infra: ["infra", "devops", "deployment"] };
const REPO_FOR = { "kyuri-os": "kyuri-dashboard", "ChekOut AI frontend": "chekoutai-frontend", "ChekOut AI company site": "sentry-skin-website" };
const PROJ_TAG = { "kyuri-os": "kyuri", "ChekOut AI frontend": "chekout", "ChekOut AI company site": "chekout-site" };
for (const r of records) {
  const repo = REPO_FOR[r.project];
  const shas = [...new Set(r.sources.map((s) => s.commit).filter(Boolean))];
  const fills = [prose(`rec-${r.id}-p`, 0.7, r.context || r.claim, [rr(r.id)])];
  if (shas.length) fills.push(commitsFill(`rec-${r.id}-c`, 0.4, repo, shas));
  // KPIs only where the record states the number.
  if (r.id === "46faab54") fills.push(kpi(`rec-${r.id}-k`, 0.6, "200", "emails per rolling 24 hours", "record:46faab54"));
  if (r.id === "de8e5fc1") fills.push(kpi(`rec-${r.id}-k`, 0.5, "418", "for any unsanctioned write in a view-only test", "record:de8e5fc1"));
  if (r.id === "ff5b2a3f") fills.push(kpi(`rec-${r.id}-k`, 0.4, "4s", "offline wait before the cached copy opens", "record:ff5b2a3f"));
  const t = clean(r.claim).split(/[,.]/)[0];
  unit(`rec-${r.id}`, `${r.project}: ${t.length > 80 ? t.slice(0, 77).replace(/\s+\S*$/, "") + "…" : t}`,
    ["evidence-record", PROJ_TAG[r.project], ...(AREA_TAGS[r.area] || [r.area])],
    r.claim + (r.limits ? ` Limits: ${r.limits}` : ""), fills);
}

// --- other projects
unit("my-influency", "My Influency: one timeline instead of five tabs", ["influencer-marketing", "ux-research", "b2b", "dashboard", "information-architecture", "usability-testing"],
  "Task analysis with 12 small business owners showed five status tabs forced tab-hopping and hid where each influencer was. Consolidating into one tracking timeline cut clicks by 28% and saved 1m 47s per task, with 95% task success across 8 core tasks.",
  [kpi("u-im-clicks", 0.7, "28%", "fewer clicks", "imData"),
   kpi("u-im-time", 0.5, "1m 47s", "saved per task", "imData"),
   kpi("u-im-success", 0.5, "95%", "task success", "imData"),
   media("u-im-laptop", 0.6, "assets/other/influencer-laptop.webp", "My Influency campaign timeline on a laptop", { from: "public/images/Project Cover Photos/MI on Laptop.png" }),
   quote("u-im-quote", 0.5, "I don't have to text my influencers anymore to ask \"hey, where are you at?\" I just check the timeline.", "Small business owner, usability testing", [SRC.imData.receipt])]);
unit("manage-farms", "Manage Small Farms: spatial crop management", ["manage-farms", "mobile", "ux-research", "usability", "sus", "accessibility"],
  "A 4-month research and design project (Aug to Dec 2022) on a farm-operations app for small farms with diverse crops, moving from lists to a spatial map. SUS rose from 52 to 70, tasks were 40% faster, and success rose from 50% to 64%.",
  [kpi("u-mf-sus", 0.6, "70", "SUS score", "mfData", { baseline: "52" }),
   kpi("u-mf-fast", 0.5, "40%", "faster tasks", "mfData"),
   kpi("u-mf-success", 0.4, "64%", "task success", "mfData", { baseline: "50%" }),
   media("u-mf-final", 0.5, "assets/other/farms-final.webp", "Five screens from the Manage Small Farms prototype", { from: "public/images/Case Studies/JD/Final prototype combined.png" })]);
unit("clutch", "Clutch: post-game analytics for padel", ["clutch", "mobile", "data-viz", "sports", "interview-exercise", "product-design"],
  "A head-of-design interview exercise: a data-dense post-game experience for competitive padel players filmed by AI court cameras, balancing analytical depth with something worth sharing in the group chat. I did not get the role.",
  [media("u-clutch", 0.6, "assets/other/clutch-overview.webp", "Clutch match overview: time in play, longest rally, average rally, winners and errors", { from: "public/images/Case Studies/CLUTCH/ s1-match-overview.png" }),
   prose("u-clutch-p", 0.5, "The brief: show players what happened, make the data meaningful, and give them something worth sharing.", [{ type: "asset", ref: "src/data/clutchData.js", repo: "Juniper", label: "Clutch case study data" }, cr("Juniper", "143e8a1")])]);
unit("xr-work", "Spatial work: Luminote and Recyclar", ["xr", "ar", "spatial", "unity", "quest", "sustainability"],
  "Luminote anchors notes to physical places on Quest using scene understanding, so a reminder appears where you can act on it. Recyclar scans packaging in AR and gives plain-language, location-specific disposal guidance.",
  [prose("u-xr", 0.6, "Luminote pins reminders to real-world anchors on Quest, built with Unity and MRTK3. Recyclar uses AR to tell you how to dispose of a package where you live.", [{ type: "asset", ref: "src/data/projectsData.js", repo: "Juniper", label: "Luminote and Recyclar project notes" }])]);
unit("portfolio-rebuild", "This portfolio: lighter and readable by agents", ["portfolio", "performance", "web-vitals", "seo", "agent-readability", "frontend"],
  "In the October rebuild I cut page weight (Home 1.40 to 0.77MB, ChekOut 2.50 to 0.72MB) and pre-rendered every case study as static HTML plus llms.txt, so the pages read without JavaScript.",
  [kpi("u-pf-home", 0.6, "0.77MB", "Home page weight after the rebuild", "rebuildHandoff", { baseline: "1.40MB" }),
   kpi("u-pf-ck", 0.5, "0.72MB", "ChekOut case study weight after the rebuild", "rebuildHandoff", { baseline: "2.50MB" }),
   prose("u-pf-nojs", 0.5, "A prerender step writes per-route HTML from the case-study data, plus llms.txt and a Markdown copy of each study.", [SRC.rebuildHandoff.receipt])]);
unit("portfolio-lab", "This portfolio: the /lab stage", ["portfolio", "generative-ui", "ai-agent", "layout", "lab"],
  "Before this stage, /lab normalised the case studies into one schema and gave the page an agent that answers by re-partitioning the layout.",
  [commitsFill("u-lab-commits", 0.6, "Juniper", ["b65dc6d", "080dd99", "978b9e3"])]);
unit("chekout-site", "ChekOut company site", ["chekout-site", "marketing-site", "frontend", "3d", "threejs", "performance"],
  "On the ChekOut company site I built early 3D product scenes and a voice assistant, later archived them for performance, swapped custom smooth scroll for Lenis, and added a Trade School vertical.",
  [prose("u-site", 0.6, "Early 3D scenes and a voice assistant, then a performance pass that archived them and documented how to bring them back.", [rr("fc5b8ee7"), rr("1e89a20c"), rr("56ba4fce")]),
   commitsFill("u-site-commits", 0.5, "sentry-skin-website", ["c010f39", "fd13eec", "85c0692", "32ca1ff", "9045ebc"])]);

// =====================================================================
// write
// =====================================================================
const write = (name, data) => fs.writeFileSync(`${OUT}/${name}`, JSON.stringify(data, null, 2) + "\n");
write("case-studies.json", caseStudies);
write("decks.json", decks);
write("corpus.json", corpus);
write("home.json", home);
const linked = [...commitsUsed.values()];
console.log(JSON.stringify({
  decks: decks.length, corpus: corpus.length,
  commits: linked.length, commitsWithUrl: linked.filter((c) => c.url).length,
  byRepo: linked.reduce((m, c) => ((m[c.repo] = (m[c.repo] || 0) + 1), m), {}),
  problems,
}, null, 1));
