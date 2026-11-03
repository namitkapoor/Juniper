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
const PLUGIN = (ref, label) => ({ type: "asset", ref: `cv-chat-flat/${ref}`, repo: "chekout-ai (local)", label });
const FLOAT = PLUGIN("christine-valmy-floating.js", "N8nService: chat and transcript webhooks, payloads, completion stages");
const NOTES = PLUGIN("claude.md", "Plugin notes: endpoint connectors (n8n chat, n8n transcript, Creatio CRM), WordPress settings");
const PHP = PLUGIN("christine-valmy-step1.php", "WordPress plugin: settings page and config passed to the widget");
const BOARD = figma(CKJ, "4:135", "FigJam: 4 · Sophia, enrollment agent (agent function marked a teammate's)");
const decks = load("decks.json");
const corpus = load("corpus.json");
const about = load("about.json");
const g = (id) => decks.find((d) => d.id === id);
const f = (d, id) => d.fills.find((x) => x.id === id);

const ARCH_ALT = "Christine Valmy agent architecture: students use the widget on the school's WordPress site; each message goes to an n8n chat webhook that reaches the agent's Cloud Function, finished chats go to an n8n transcript webhook that produces a lead for officers, and the inquiry form creates a lead in the school's Creatio CRM";
const ARCH_EXPLAIN = "Follow a student's message: the widget posts it to n8n, n8n reaches the agent (a teammate's Cloud Function; the persona and prompt are mine), and the reply comes back with the conversation stage. When the chat ends, the transcript goes to a second n8n webhook that turns it into a lead; the inquiry form goes straight to the school's Creatio CRM. Drawn from the plugin code and the ChekOut architecture board.";

// The architecture tiles everywhere they appear
for (const fill of [...decks.flatMap((d) => d.fills), ...corpus.flatMap((u) => u.fills)]) {
  if (fill.kind === "media" && fill.src === "assets/christine-valmy/architecture.svg") {
    fill.alt = ARCH_ALT;
    if (fill.id === "cv-arch-main") fill.explain = "A widget on the school's WordPress site, n8n webhooks between it and the agent, and finished chats turned into leads for the officers. Open it for how it is built.";
    else fill.explain = ARCH_EXPLAIN;
    for (const r of [FLOAT, NOTES]) if (!fill.receipts.some((x) => x.ref === r.ref)) fill.receipts.push(r);
  }
}
// cv-build
{
  const d = g("cv-build");
  d.thesis = "I built it as a React widget in a WordPress plugin that talks to the agent through n8n webhooks, and audited it to WCAG AA before launch.";
  const s = f(d, "cv-stack");
  s.text = "HOW: The chat ships as a React widget in a WordPress plugin. Every message goes to an n8n webhook in front of the agent, finished chats go to a second webhook that makes the lead, and the inquiry form writes to the school's Creatio CRM. I tested the agent across the major models, launched it on Claude, and it now runs on Gemini.";
  s.receipts = [CV, FLOAT, NOTES];
}
// cv-d-handoff
{
  const d = g("cv-d-handoff");
  d.thesis = "Finished chats travel through an n8n webhook that turns them into leads, sorted into priority buckets with bad leads flagged; the inquiry form goes straight to the school's CRM.";
  const b = f(d, "cvh-n8n");
  b.text = "THE BRIDGE: The WordPress widget posts every message to an n8n webhook in front of the agent. When a chat ends, the full transcript goes to a second webhook that turns it into a lead, and the inquiry form writes to the school's Creatio CRM.";
  b.receipts = [FLOAT, NOTES, PHP];
  b.opens = "cv-d-bridge"; b.opensPrimary = true;
  const a = f(d, "cvh-arch");
  a.explain = ARCH_EXPLAIN;
}
const bridge = { id: "cv-d-bridge", parent: "cv-d-handoff", caseStudy: "christine-valmy",
  question: "What exactly happens between the chat and the officers?",
  thesis: "Three calls leave the widget: one per message, one when the chat ends, one when the form is sent; the end-of-chat call is what becomes a lead.",
  fills: [
    prose("cvbr-problem", 1, "THE CHALLENGE: Students close the tab mid-chat, especially on phones, and a conversation that ends that way still has to reach the officers once, not twice.",
      [FLOAT], ["cvbr-graph"]),
    media("cvbr-graph", 0.9, "assets/christine-valmy/bridge.svg", 2.1053,
      "The three calls that leave the widget: each message to the n8n chat webhook, the transcript to the n8n transcript webhook when a chat ends, and the inquiry form to the Creatio CRM webhook",
      "Three calls, in the order a student triggers them.",
      "Read top to bottom. Every message carries the conversation so far; the reply carries the stage. Reaching enrollment collection, completion or post enrollment, or closing the widget or the tab, sends the transcript once. n8n answers whether a lead was made, and the widget stops sending after that. Drawn from the plugin code.",
      [FLOAT, NOTES]),
    prose("cvbr-msg", 0.7, "1 · EACH MESSAGE: The widget posts the question, user and thread ids, the history and a reCAPTCHA v3 token to the n8n chat webhook. The reply carries the answer, the conversation stage, the enrollment state and whether the chat is complete.",
      [FLOAT, NOTES]),
    prose("cvbr-end", 0.65, "2 · WHEN IT ENDS: A completing stage, closing the widget or hiding the tab sends the full transcript, the reason, the message count and the page to the transcript webhook, once per reason and by sendBeacon when the tab is closing. If n8n reports a lead was made, nothing more is sent.",
      [FLOAT]),
    prose("cvbr-form", 0.55, "3 · THE FORM: The inquiry form creates the lead in the school's Creatio CRM through its webhook. The webhook addresses live in the plugin's WordPress settings, not hardcoded per page.",
      [NOTES, PHP]),
    prose("cvbr-who", 0.45, "WHO BUILT WHAT: The widget, the plugin, the persona and the prompt are mine; the agent's Cloud Function is a teammate's. The priority buckets and bad-lead flags run inside the n8n workflow, which isn't exported in my sources, so its nodes aren't shown.",
      [BOARD, CV, NOTES]),
  ] };
const all = [...decks.filter((d) => d.id !== bridge.id), bridge];
// corpus cv-architecture text
for (const u of corpus) if (u.id === "cv-architecture") {
  u.text = "A React widget in a WordPress plugin posts each message to an n8n webhook in front of the agent's Cloud Function, which answers through RAG from the school's content. Finished chats go to a second n8n webhook that turns them into leads in priority buckets, and the inquiry form writes to the school's Creatio CRM. The agent shipped with Claude and now runs on Gemini.";
  for (const r of [FLOAT, NOTES]) if (!u.receipts.some((x) => x.ref === r.ref)) u.receipts.push(r);
}
const n8n = about.stack.flatMap((s) => s.items).find((x) => x.name === "n8n");
if (n8n) n8n.evidence = "Webhooks between the Christine Valmy widget, its agent and the lead flow; a newsletter signup on ChekOut's site.";
save("decks.json", all); save("corpus.json", corpus); save("about.json", about);
console.log("ok");
