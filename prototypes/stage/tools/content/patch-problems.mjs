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
const CALL = { type: "asset", ref: "memory/project_chekout_metrics.md", repo: "Claude memory (Juniper project)", date: "2026-07-04",
  label: "Client call note, KivaKube: Shopify analytics are basic and do not capture conversational or on-site behavior" };
const HANDOFF_A11Y = data("design-plans/HANDOFF-rebuild-2026-10-26.md", "A11y finding: white on #D0DD28 at 1.49:1 in the hero demo");
const decks = load("decks.json");
const corpus = load("corpus.json");
const g = (id) => decks.find((d) => d.id === id);
const f = (d, id) => d.fills.find((x) => x.id === id);
const setP = (deck, id, text, receipts, evidence) => {
  const p = f(g(deck), id);
  if (!p) throw new Error(`${deck}/${id}`);
  p.text = text;
  if (receipts) p.receipts = receipts;
  if (evidence) p.evidence = evidence; else delete p.evidence;
};

// ChekOut outcomes: the problem is backed by the client call; 13,981 moves to the outcome area.
setP("ck-merchant-outcomes", "ck-0-problem",
  "THE CHALLENGE: Merchants had no way to see what the agent did on their store. On a client call, KivaKube's team said Shopify's analytics are basic and don't capture conversational or on-site behavior.",
  [CALL, CK]);
{
  const d = g("ck-merchant-outcomes");
  const s = f(d, "ck-sessions");
  d.fills = d.fills.filter((x) => x !== s);
  const at = d.fills.findIndex((x) => x.kind === "logos");
  d.fills.splice(at + 1, 0, s);
  s.label = "shopper sessions with the agent, across 22 brands";
}
setP("ck-d-dashboard", "ckd-problem",
  "THE CHALLENGE: Shopify's own analytics show sessions and orders, not what shoppers asked, and that is what a merchant needs to read to fix their catalog.",
  [CALL, CK], ["ckd-flow"]);
setP("ck-d-cart", "ckc-problem",
  "THE CHALLENGE: Adding to cart from inside the chat has to land in each store's own cart, and early on it failed: Shopify answered with a 422 and Squarespace with a 404.",
  [cr("chekoutai-frontend", "62bde85"), CK], ["ckc-add"]);
setP("ck-d-motion", "ckm-problem",
  "THE DESIGN CALL: Each moment where the agent works or a tap lands gets one motion and a static cue that stays after it. This came from design review, not a study.",
  [CK]);
setP("ck-d-builder", "ckb-problem",
  "THE CHALLENGE: The builder's preview was a hand-built copy that drifted from what shipped, and merchants asked for control over how the widget sits on their page: some wanted the launcher without the floating questions.",
  [AP, cr("chekoutai-frontend", "faf5efd"), cr("chekoutai-frontend", "fe5f2a1")], ["ckb-flow"]);
setP("ck-d-stack", "cks-problem",
  "THE CHALLENGE: One Next.js app serves both the merchant builder and the widget shoppers meet on stores, so every release ships to both at once.",
  [figma(CKJ, "3:39", "FigJam: 1 · System context ([code] for the front end)")], ["cks-arch"]);
// ChekOut build: the brand-color problem gets its data.
{
  const d = g("ck-platform-build");
  if (!f(d, "ap-contrast")) {
    const i = d.fills.findIndex((x) => x.id === "ap-0-problem");
    d.fills.splice(i + 1, 0, kpi("ap-contrast", 0.7, "1.49:1", "contrast of white text on KivaKube's lime brand color, #D0DD28", [HANDOFF_A11Y, AP]));
  }
}
setP("ck-platform-build", "ap-0-problem",
  "THE CHALLENGE: The agent lives on pages full of someone else's fonts, colors, cookie banners and cart drawers, and merchants' brand colors include pale limes that white text can't sit on.",
  [AP, HANDOFF_A11Y, cr("chekoutai-frontend", "2127ede")], ["ap-contrast"]);

// Christine Valmy
setP("cv-results", "cv-0-problem",
  "THE CHALLENGE: At Christine Valmy, a school that trains estheticians and cosmetologists, prospective students filled in a form and waited for a reply, and enrollment officers answered the same questions on every call.",
  [CV]);
setP("cv-testing", "cv-0-test-problem",
  "THE CHALLENGE: I wanted enrollment to feel like an app: a student ID card that filled in as you chatted, and a bento grid of tiles so nobody had to think of a question first. It was a guess until students used it.",
  [CV], ["cv-bento"]);
setP("cv-build", "cv-0-build-problem",
  "THE CHALLENGE: The school's site runs on WordPress, its enrollment systems sit elsewhere, and many applicants speak Spanish first, so the agent had to live inside the existing site and work in both languages.",
  [CV], ["cv-arch"]);
setP("cv-d-bilingual", "cvb-problem",
  "THE CHALLENGE: Many applicants spoke Spanish first, and the form and the chat were English only.",
  [CV], ["cvb-en"]);
setP("cv-d-handoff", "cvh-problem",
  "THE CHALLENGE: Officers answered the same questions on every call, and their time went to leads that were never going to enroll.",
  [CV]);
setP("cv-d-concept", "cvc-problem",
  "THE CHALLENGE: Students filled in a form and waited, and officers answered the same questions on every call. I wanted the first visit to do more of that work.",
  [CV], ["cvc-bento"]);

// KYURI.OS: evidence links where a backing fill exists
setP("ky-live", "ky-0-problem",
  "THE CHALLENGE: Applying well means a tailored one-page resume for every role and knowing where each application stands. I wanted both to start from my phone, the moment I found a role.",
  [cr("kyuri-dashboard", "1be40d8"), kyfile("lib/proof.ts", "ITERATIONS: Jobs into Notion from my phone (Apr 12), real resumes (May 26)")], ["ky-jobhunt-shot"]);
setP("ky-build", "ky-build-problem",
  "THE CHALLENGE: The tailoring agents run on my laptop, on my Claude subscription, but the site has to answer visitors and candidates even when the laptop is asleep.",
  [ARCH], ["ky-arch"]);
setP("ky-d-box", "kyx-problem",
  "THE CHALLENGE: The tailoring agents run on my laptop, which sleeps, while the site has to keep answering visitors and candidates.",
  [ARCH], ["kyx-arch"]);

// other work
setP("other-agents", "oa-0-problem",
  "THREE PROBLEMS: Merchants couldn't see what shoppers asked on their stores; a school's officers answered the same enrollment questions on every call; and I needed a tailored resume for every role I applied to.",
  [CALL, CV, kyfile("lib/proof.ts", "ITERATIONS")]);

// Fix a receipt from the last round, and flag dark logos for the stage.
for (const d of decks) for (const x of d.fills) {
  for (const r of x.receipts || []) if (r.ref === "../kyuri-dashboard/docs/chekout-figma.md") { r.ref = "docs/chekout-figma.md"; r.repo = "kyuri-dashboard"; delete r.date; }
}
const DARK = new Set(["KivaKube", "Rosendahl Design Group"]);
for (const fill of [...decks.flatMap((d) => d.fills), ...corpus.flatMap((u) => u.fills)])
  if (fill.kind === "logos") for (const it of fill.items) if (DARK.has(it.name)) it.invert = true;
save("decks.json", decks);
save("corpus.json", corpus);
console.log("ok");
