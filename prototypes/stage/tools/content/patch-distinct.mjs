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
const PROOF = kyfile("lib/proof.ts", "RESUMES_BY_MONTH, counted on SNAPSHOT_DATE 2026-10-15");
const SITE = "ihrhBKvJkXqj7emP5ht3cL";
const decks = load("decks.json");
const g = (id) => decks.find((d) => d.id === id);
const f = (d, id) => d.fills.find((x) => x.id === id);
const drop = (d, ...ids) => { d.fills = d.fills.filter((x) => !ids.includes(x.id)); };
const open = (d, id, target, primary) => { const x = f(d, id); if (!x) throw new Error(`${d.id}/${id}`); x.opens = target; if (primary) x.opensPrimary = true; else delete x.opensPrimary; };
const unopen = (d, ...ids) => { for (const id of ids) { const x = f(d, id); if (x) { delete x.opens; delete x.opensPrimary; } } };
const archTile = (id, src, aspect, alt, explain, receipts, target) => ({ ...media(id, 0.7, src, aspect, alt, "ARCHITECTURE: how the pieces connect.", explain, receipts), opens: target, opensPrimary: true });

// ---------------- KYURI.OS live: split the shared drill-down
{
  const d = g("ky-live");
  drop(d, "ky-weekly", "ky-why");
  if (!f(d, "ky-arch-main")) d.fills.push(archTile("ky-arch-main", "assets/kyuri-os/architecture.svg", 1.6,
    "KYURI.OS system context: the site on Vercel, the laptop box behind a Cloudflare tunnel, and the services each one talks to",
    "The site on Vercel answers everyone and stays up on its own; the AI work runs on my laptop behind a tunnel. Open it for how each piece is built.",
    [ARCH, figma(KYJ, "27:2045", "FigJam: 1. System context")], "ky-build"));
  unopen(d, "ky-captured", "ky-sent", "ky-interviews", "ky-resumes", "ky-jobhunt-shot");
  open(d, "ky-jobhunt-shot", "ky-d-live", true);
  open(d, "ky-sent", "ky-d-live", false);
  open(d, "ky-captured", "ky-d-pipeline", false);
  open(d, "ky-interviews", "ky-d-funnel", false);
  open(d, "ky-resumes", "ky-d-resumes", false);
}
{
  const d = g("ky-d-live");
  drop(d, "kyl-rounds", "kyl-bigday", "kyl-snapshot");
  if (!f(d, "kyl-stages")) d.fills.push(
    prose("kyl-stages", 0.6, "WHAT EACH STAGE COUNTS: Capture is every role I add, Notion is what's marked applied, Agents are the checks before Drive, and Obsidian reads the weekly habit from my vault log.", [kyfile("app/components/JobPipelineClient.tsx", "The five stages and what each one counts")]),
    prose("kyl-dots", 0.45, "LIVE OR DATED: A dot beside a number means it is read live; the resume count carries its date instead.", [LIVE, kyfile("lib/proof.ts", "A snapshot, not live")]));
}
const live = (label) => ({ ...LIVE, ref: "assets/kyuri-os/behaviour-panel.webp", label: label || "kyuri.namit.me Job Hunt, APPLICATION.BEHAVIOUR panel, captured 2026-11-02" });
const funnel = { id: "ky-d-funnel", parent: "ky-live", caseStudy: "kyuri-os",
  question: "How do my applications actually move?",
  thesis: "The behaviour panel reads every row for the habit and the funnel: how often I apply, my biggest day, and how many reached a phone screen.",
  fills: [
    media("kyf-panel", 1, "assets/kyuri-os/behaviour-panel.webp", 2.1277, "KYURI.OS APPLICATION.BEHAVIOUR panel: applications sent, day streak, active days, and read-outs on weekly pace, weekdays, the biggest day and interviews",
      "The behaviour panel, signed out.", "Each line is computed from the same visitor rows: the weekly pace, which weekday carries the most applications, the biggest single day, and how far applications got. Rows without a submission date are left out of the rates, and the panel says so.", [live()]),
    kpi("kyf-reach", 0.8, "3%", "of sent applications reached a phone screen or beyond", [live()]),
    kpi("kyf-rounds", 0.6, "12", "interview rounds across those applications", [live(), LIVE]),
    kpi("kyf-pace", 0.55, "8.4", "applications per week, on average", [live()]),
    kpi("kyf-bigday", 0.45, "27", "applications on my biggest single day", [live()], { period: "May 29" }),
    prose("kyf-how", 0.5, "HOW STAGES ARE COUNTED: Each application keeps every stage it reached, so the funnel counts how far it got even after a rejection, the same signed in or out.", [cr("kyuri-dashboard", "7ee2c40"), kyfile("HANDOFF.md", "Visitors see the stage history (interviews count the same signed in or out)")]),
  ] };
const resumes = { id: "ky-d-resumes", parent: "ky-live", caseStudy: "kyuri-os",
  question: "How are the resumes made and counted?",
  thesis: "Every resume comes out of the same guarded pipeline and lands in Drive; the count is taken by hand from Drive and dated.",
  fills: [
    prose("kyr-made", 1, "HOW ONE IS MADE: Code picks the base resume, an agent with no tools tailors it, a lint checks facts against the base, QA gets two tries, and a leak guard scans the PDF before it is written to Drive.", [LIVE, cr("kyuri-dashboard", "0380547"), cr("kyuri-dashboard", "001f2e0")]),
    kpi("kyr-months", 0.85, "474", "tailored resume PDFs, May to October 2026, all users", [PROOF], {
      breakdown: [["May", "78"], ["June", "111"], ["July", "36"], ["August", "141"], ["September", "88"], ["October", "20"]].map(([label, value]) => ({ label, value })) }),
    prose("kyr-counted", 0.65, "COUNTED BY HAND: PDFs per person in the Drive resumes folder, superseded copies excluded, counted on October 15, 2026 and dated on the page so it never pretends to be live. One more was built by hand in September 2025.", [PROOF]),
    commits("kyr-commits", 0.45, "kyuri-dashboard", ["ea92807", "a6289fe", "9ae21e2", "0d43d67"]),
  ] };

// ---------------- ChekOut outcomes
{
  const d = g("ck-merchant-outcomes");
  drop(d, "ck-brands", "ck-analytics");
  if (!f(d, "ck-arch-main")) d.fills.push(archTile("ck-arch-main", "assets/chekout/architecture.webp", 2.0645,
    "ChekOut AI system context: merchants and shoppers, the Next.js front end, Langflow agents, backend services, commerce platforms and the data stores",
    "One front end serves merchants in the builder and shoppers on their stores; chat goes to a Langflow agent per merchant. Open it for how it is built.",
    [figma(CKJ, "3:39", "FigJam: 1 · System context")], "ck-platform-build"));
  unopen(d, "ck-atc", "ck-cart-prose", "ck-top-metrics", "ck-live-logos");
  open(d, "ck-cart-prose", "ck-d-cart", true);
  open(d, "ck-atc", "ck-d-cart", false);
  open(d, "ck-top-metrics", "ck-d-dashboard", false);
  open(d, "ck-live-logos", "ck-d-live-stores", false);
}
{
  const d = g("ck-conversation");
  unopen(d, "ck-shape-question", "ck-shape-bundle", "ck-reading-surface");
}
{
  const d = g("ck-platform-build");
  unopen(d, "ap-time");
  open(d, "ck-arch", "ck-d-stack", true); open(d, "ck-system", "ck-d-stack", false);
  open(d, "ap-preview", "ck-d-builder", true); open(d, "ap-embed", "ck-d-builder", false);
}
// ---------------- Christine Valmy
{
  const d = g("cv-results");
  drop(d, "cv-bad", "cv-rosa");
  if (!f(d, "cv-arch-main")) d.fills.push(archTile("cv-arch-main", "assets/christine-valmy/architecture.svg", 1.7778,
    "Christine Valmy agent architecture: students chat on the school's site, the agent answers through RAG, and n8n hands sorted leads to officers",
    "A widget on the school's WordPress site, an agent that answers from the school's own content, and n8n carrying sorted leads to the officers. Open it for how it is built.",
    [CV, figma(CKJ, "4:135", "FigJam: 4 · Sophia, enrollment agent")], "cv-build"));
}
{ const d = g("cv-build"); open(d, "cv-a11y", "cv-d-a11y", true); open(d, "cv-mobile", "cv-d-a11y", false); }
// ---------------- KYURI.OS guards and build
{ const d = g("ky-guards"); open(d, "ky-checks", "ky-d-tailoring", true); open(d, "ky-incident", "ky-d-tailoring", false); }
{
  const d = g("ky-build");
  unopen(d, "ky-build-studios");
  open(d, "ky-arch", "ky-d-box", true); open(d, "ky-build-how", "ky-d-box", false);
  open(d, "ky-build-boards", "ky-d-boards", true); open(d, "ky-build-boards-n", "ky-d-boards", false);
  open(d, "ky-build-ds", "ky-d-design", true);
  for (const id of ["ky-ds-tokens", "ky-ds-pixel", "ky-ds-header"]) open(d, id, "ky-d-design", false);
}

// ---------------- this site
const site = { id: "other-site", question: "How was this site built?",
  thesis: "Content is built offline with receipts and validated against one schema; the stage only lays it out, cutting a 12 x 12 grid for each answer.",
  fills: [
    prose("site-problem", 1, "THE CHALLENGE: A static case study answers the questions I guessed a reader would have, not the one a recruiter actually brings, so I wanted a page that rebuilds itself around the question.",
      [figma(SITE, "5:12", "Juniper stage: system architecture"), { type: "commit", ref: "080dd99", repo: "Juniper", date: "2026-08-17", label: "080dd99 · lab: give /lab an agent that answers by re-partitioning the page" }]),
    media("site-arch", 0.9, "assets/site/architecture.webp", 1.0025, "Juniper stage system architecture: a content pipeline from sources through generators, the schema and the validator to JSON, and a runtime from the shell through the answerer and layout engine to the renderer",
      "Built offline with receipts; laid out live.", "The top half runs at build time: sources, generators, the schema contract and the validator. The bottom half runs on every question: the answerer picks an answer, the layout engine cuts the stage, and the renderer morphs to it.",
      [figma(SITE, "5:12", "System architecture")]),
    prose("site-content", 0.7, "CONTENT: Generators read the case-study data, public evidence records, commits and Figma exports. Every KPI is checked against its source text, and a validator gates shapes, assets, dashes, repeated numbers and backed problem statements.",
      [{ type: "asset", ref: "src/data/validate.mjs", repo: "Juniper (stage prototype)", label: "Content validator" }, figma(SITE, "5:12", "Content pipeline")]),
    prose("site-stage", 0.65, "THE STAGE: The answerer matches a starter question or merges the closest corpus units. The layout engine searches guillotine cuts snapped to a 12 x 12 grid, at most seven cells, sizing text with Pretext, and each new answer morphs from the strokes already on screen.",
      [{ type: "asset", ref: "src/engine/layout.js", repo: "Juniper (stage prototype)", label: "Guillotine cuts on a 12 x 12 grid, exact memoized search" },
       { type: "asset", ref: "src/stage/morph.js", repo: "Juniper (stage prototype)", label: "Stroke morph timeline" },
       { type: "asset", ref: "src/answer.js", repo: "Juniper (stage prototype)", label: "Local answerer" }]),
    media("site-ds", 0.55, "assets/site/design-system.webp", 0.6525, "Juniper stage design system: one ink color, type styles from the name to meta, spacing and grid limits, the stroke grammar and the morph timings",
      "One color of ink, one weight of line.", "Every value the renderer paints with is a Figma variable mirrored from the code, so if the two disagree text overflows. The stroke grammar and morph timings are drawn from the engine's own constants.",
      [figma(SITE, "7:2", "Design system: foundations")]),
  ] };

const add = [funnel, resumes, site];
const all = [...decks.filter((d) => !add.some((a) => a.id === d.id)), ...add];
save("decks.json", all);
console.log("ok");
