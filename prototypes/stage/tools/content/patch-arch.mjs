// Load-modify-save: "How is it built?" decks with architecture, job boards and design system.
import fs from "node:fs";
import { execSync } from "node:child_process";
const D = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");
const REPOS = {
  "kyuri-dashboard": "/Users/namit/Documents/kyuri-dashboard",
  "chekoutai-frontend": "/Users/namit/Documents/work/chekout-ai/chekoutai-frontend",
};
const clean = (s) => s.replace(/\s+[—–]\s+/g, ": ").replace(/[—–]/g, " to ");
function commits(id, weight, repo, shas) {
  return {
    kind: "commits", id, weight, repo,
    items: shas.map((sha) => {
      const [h, date, msg] = execSync(`git -C "${REPOS[repo]}" log -1 --date=short --format="%h%x09%ad%x09%s" ${sha}`).toString().trim().split("\t");
      return { sha: h, date, msg: clean(msg) };
    }),
  };
}
const cr = (repo, sha, label) => {
  const [h, date, msg] = execSync(`git -C "${REPOS[repo]}" log -1 --date=short --format="%h%x09%ad%x09%s" ${sha}`).toString().trim().split("\t");
  return { type: "commit", ref: h, repo, date, label: label || `${h} · ${clean(msg)}` };
};
const figma = (file, node, label) => ({ type: "asset", ref: `figma:${file}#${node}`, date: "2026-11-01", label });
const file = (repo, ref, label, date) => ({ type: "asset", ref, repo, ...(date ? { date } : {}), label });
const asset = (src, label) => ({ type: "asset", ref: src, label });
const media = (id, weight, src, aspect, alt, caption, explain, receipts) =>
  ({ kind: "media", id, weight, media: "image", src, aspect, alt, caption, explain, receipts });
const prose = (id, weight, text, receipts) => ({ kind: "prose", id, weight, text, receipts });

const KYF = "qWq0Ce8ovFq7RkKWmGWQDD"; // KYURI.OS design source
const KYJ = "1WNTAaMtC2x7fr5VAB4lRM"; // KYURI.OS flows + architecture (FigJam)
const CKJ = "juckmsHrlBUBKcMkoJCiep"; // ChekOut AI system architecture (FigJam)
const CKF = "LPIuHW2bQIxkq7TWZSxI3G"; // ChekOut AI design system
const ARCH_DOC = file("kyuri-dashboard", "docs/architecture.md", "KYURI.OS system architecture, drafted from the code at d2fdc53", "2026-11-01");
const ROLE_SRC = file("kyuri-dashboard", "lib/role-sources.ts", "FIND ROLES: every board × every role, merged");
const ROLE_Q = file("kyuri-dashboard", "lib/role-queries.ts", "BOARDS: speedrun startups, a16z portfolio, Designer Fund");
const ROLES_API = file("kyuri-dashboard", "app/api/jobs/roles/route.ts", "Signed-in members only; LinkedIn deliberately not a source");
const CV_DATA = file("Juniper", "src/data/christineValmyData.js", "Christine Valmy case study", "2026-10-26");
const AP_DATA = file("Juniper", "src/data/agentPlatformData.js", "Agent platform case study", "2026-10-26");
const CK_DATA = file("Juniper", "src/data/chekoutData.js", "ChekOut AI case study", "2026-10-26");

// ------------------------------------------------------------------ KYURI.OS
const kyArch = media("ky-arch", 1, "assets/kyuri-os/architecture.svg", 1.6,
  "KYURI.OS system context: people use kyuri.namit.me on Vercel, which talks to Neon, Google and three job boards on its own, reaches the laptop box through a Cloudflare tunnel, and shares Notion, a GitHub vault and Anthropic with the box. The box writes resumes to Google Drive and scouts LinkedIn.",
  "Who talks to what. Solid boxes are mine; dashed are outside services.",
  "Read it left to right: people only ever touch the site on Vercel. Everything the site can do alone (accounts, sign-in, FIND ROLES) keeps working when my laptop sleeps; only the AI-heavy work crosses the tunnel to the box. Redrawn from the architecture board in Figma.",
  [asset("assets/kyuri-os/architecture.svg", "Drawn for the stage from the FigJam board"), figma(KYJ, "27:2045", "FigJam: 1. System context"), ARCH_DOC]);
const kyProblem = prose("ky-build-problem", 0.95,
  "THE CHALLENGE: The tailoring agents run on my laptop, on my Claude subscription, but the site has to answer visitors and candidates even when the laptop is asleep.",
  [ARCH_DOC]);
const kyHow = prose("ky-build-how", 0.85,
  "HOW: The site is Next.js on Vercel. It keeps applications in Notion and accounts, quotas and evidence in Neon Postgres. Anything that needs Claude goes through a Cloudflare tunnel to the box, which tailors the resume, checks it and writes the PDF to Google Drive.",
  [ARCH_DOC, cr("kyuri-dashboard", "282ad60"), cr("kyuri-dashboard", "e529892")]);
const kyBoards = prose("ky-build-boards", 0.75,
  "JOB BOARDS: FIND ROLES searches the a16z speedrun talent network (speedrun startups and the whole a16z portfolio) and Designer Fund's board straight from Vercel, so it works with the box asleep. Signed-in candidates and I can use it; visitors can't. LinkedIn is deliberately not a source, because I use that account for outreach.",
  [ROLE_Q, ROLES_API, cr("kyuri-dashboard", "564d10b")]);
const kyBoardsKpi = { kind: "kpi", id: "ky-build-boards-n", weight: 0.5, value: "3", label: "job boards behind FIND ROLES, searched from Vercel", receipts: [ROLE_SRC, ROLE_Q] };
const kyStudios = prose("ky-build-studios", 0.35,
  "OWNER ONLY: studio postings on Greenhouse and Lever feed my own Targets list, where a RESUME button queues a tailored resume.",
  [file("kyuri-dashboard", "lib/studio-postings.ts", "Studio postings: Greenhouse API, Lever page, plain HTML"), cr("kyuri-dashboard", "99f1030")]);
const kyDs = prose("ky-build-ds", 0.6,
  "DESIGN SYSTEM: The UI has a Figma source of truth: color tokens in dark and light modes, a pipeline status ramp, Jura type with Space Mono numbers, and components like the nav tabs, glance panels and a seven-segment clock. A figma-sync skill diffs the file against a baseline and builds each change.",
  [figma(KYF, "0:1", "KYURI.OS design source: Tokens page"), figma(KYF, "2:2", "KYURI.OS design source: Components page"), cr("kyuri-dashboard", "84e4a46")]);
const kyTokens = media("ky-ds-tokens", 0.55, "assets/kyuri-os/ds-tokens.webp", 0.8273,
  "KYURI.OS dark-mode color tokens: near-black surfaces, warm brown borders, a cream-to-tan ink ramp, a copper accent, and green and red status colors, each with its CSS variable and hex",
  "Dark-mode tokens, each bound to the CSS variable it ships as.",
  "The whole UI is two tones: near-black surfaces and a warm ink ramp from dim brown to cream, with one copper accent. Green and red are the only other hues, kept for status. Each swatch names the CSS variable it ships as, so Figma and the code stay in step.",
  [asset("assets/kyuri-os/ds-tokens.webp", "Exported from Figma"), figma(KYF, "2:112", "Tokens / Dark: Surface & ink")]);
const kyPixel = media("ky-ds-pixel", 0.45, "assets/kyuri-os/ds-pixel.webp", 3.7471,
  "Pixel-art sprites from the design source: a pixel person, a subway car in cream and red, and a rat",
  "The pixel sprites behind the subway game on the home page.",
  "The two-tone pixel language extends to the home page's subway game: every sprite is drawn on a pixel grid in Figma and exported for the site, so the game and the UI share one palette.",
  [asset("assets/kyuri-os/ds-pixel.webp", "Exported from Figma"), figma(KYF, "33:339", "Components: pixel assets"), cr("kyuri-dashboard", "79c21cb")]);
const kyHeader = media("ky-ds-header", 0.35, "assets/kyuri-os/ds-header.webp", 6.5455,
  "The KYURI.OS header component in three states: HOME, JOB HUNT and SHENANIGANS tabs, each lit in turn",
  "The header component, one variant per area.",
  "One component, three variants: the lit tab moves with the area you're in. Building variants in Figma first is what lets the figma-sync skill map a design change to the one file that renders it.",
  [asset("assets/kyuri-os/ds-header.webp", "Exported from Figma"), figma(KYF, "7:197", "Components: Header")]);
const kyCommits = commits("ky-build-commits", 0.5, "kyuri-dashboard", ["282ad60", "e529892", "4b5f540", "564d10b", "84e4a46", "6f124ad"]);
const kyBuild = {
  id: "ky-build",
  question: "How is KYURI.OS built?",
  thesis: "A Next.js site on Vercel that stays up on its own, a laptop box that does the AI work through a tunnel, three job boards searched without the box, and a Figma design system the code is synced from.",
  caseStudy: "kyuri-os",
  fills: [kyProblem, kyArch, kyHow, kyBoards, kyBoardsKpi, kyDs, kyTokens, kyPixel, kyCommits, kyStudios, kyHeader],
};

// ------------------------------------------------------------------ Christine Valmy
const cvArch = media("cv-arch", 0.95, "assets/christine-valmy/architecture.svg", 1.7778,
  "Christine Valmy agent architecture: prospective students chat in English or Spanish on the school's site; the enrollment agent answers through RAG from the school's content, a schedule pipeline keeps classes current, and leads pass through n8n on GCP to enrollment officers in priority buckets",
  "From a student's question to a sorted lead.",
  "Follow one question: the student asks in the widget on the school's WordPress site, the agent answers from the school's own content, and the conversation becomes a lead that n8n hands to the officers already sorted. Solid boxes are mine; the agent function is a teammate's code. Drawn from the case study and the ChekOut architecture board.",
  [asset("assets/christine-valmy/architecture.svg", "Drawn for the stage"), CV_DATA, figma(CKJ, "4:135", "FigJam: 4 · Sophia, enrollment agent")]);

// ------------------------------------------------------------------ ChekOut
const ckArch = media("ck-arch", 0.95, "assets/chekout/architecture.webp", 2.0645,
  "ChekOut AI system context: merchants build and manage agents in the ChekOut front end; shoppers chat on the storefront; the front end sends chat messages to per-merchant Langflow agents and talks to backend services on Cloud Run, which sync with Shopify and read and write Postgres and BigQuery",
  "Who uses ChekOut and what the front end talks to. Blue is my work.",
  "One Next.js app serves both sides: the merchant builder and the chat widget shoppers meet on a store. Chat goes to a Langflow agent per merchant; setup, store sync and billing go to backend services. Each box is tagged [code] when it is verified in a repo and [notes] when it comes from my notes.",
  [asset("assets/chekout/architecture.webp", "Exported from Figma, source footer cropped"), figma(CKJ, "3:39", "FigJam: 1 · System context")]);
const ckSystem = prose("ck-system", 0.7,
  "HOW IT FITS: Merchants build agents in the Next.js app; shoppers chat through a script and an iframe the same app serves onto their store. Messages go to a Langflow agent per merchant, and onboarding, store sync and billing go to backend services that connect to Shopify.",
  [figma(CKJ, "3:39", "FigJam: 1 · System context"), cr("chekoutai-frontend", "91ebf39"), cr("chekoutai-frontend", "e553f4b")]);
const ckDs = media("ck-ds-chat", 0.5, "assets/chekout/ds-chat-panel.webp", 2,
  "The ChekOut chat panel component in three states: welcome, a conversation with a shipping answer and suggestion pills, and the thinking loader",
  "The chat panel component: welcome, conversation, thinking.",
  "The widget's states as components in the ChekOut design file, documented from the shipped code: one panel, three states, with the composer and Powered by footer shared across them. Merchants' brand colors theme these at runtime.",
  [asset("assets/chekout/ds-chat-panel.webp", "Exported from Figma"), figma(CKF, "21:765", "Chat panel (current)"), cr("chekoutai-frontend", "7f4d4c0", "7f4d4c0 · frontend commit the design file was documented at")]);
const ckCommits = commits("ap-commits", 0.85, "chekoutai-frontend", ["fe5f2a1", "91ebf39", "e553f4b", "5264ce8", "d22f151", "bceb8f0", "2127ede"]);

// ------------------------------------------------------------------ apply to decks
const decks = load("decks.json");
const insertAfter = (fills, afterId, ...add) => {
  const i = fills.findIndex((f) => f.id === afterId);
  fills.splice(i >= 0 ? i + 1 : 0, 0, ...add.filter((a) => !fills.some((f) => f.id === a.id)));
};
for (const d of decks) {
  if (d.id === "ck-platform-build") {
    d.question = "How is ChekOut built, and how do merchants set it up?";
    insertAfter(d.fills, "ap-0-problem", ckArch, ckSystem);
    const ci = d.fills.findIndex((f) => f.id === "ap-commits");
    if (ci >= 0) d.fills[ci] = ckCommits;
    insertAfter(d.fills, "ap-embed", ckDs);
    for (const f of d.fills) if (f.id === "ap-ios") f.weight = 0.35;
  }
  if (d.id === "cv-build") {
    d.question = "How is the Christine Valmy agent built?";
    insertAfter(d.fills, "cv-0-build-problem", cvArch);
  }
}
// KYURI.OS keeps 3 starter decks: ky-open moves to the corpus, ky-build takes its slot.
const openIdx = decks.findIndex((d) => d.id === "ky-open");
const kyOpen = openIdx >= 0 ? decks.splice(openIdx, 1, kyBuild)[0] : null;
if (!decks.some((d) => d.id === "ky-build")) decks.push(kyBuild);
save("decks.json", decks);

// ------------------------------------------------------------------ corpus
const corpus = load("corpus.json");
const uniq = (rs) => { const s = new Set(); return rs.filter((r) => { const k = r.type + r.ref + (r.repo || ""); if (s.has(k)) return false; s.add(k); return true; }); };
const unit = (id, title, tags, text, fills) => {
  const receipts = uniq(fills.flatMap((f) => f.receipts || []).concat(fills.filter((f) => f.kind === "commits").flatMap((f) => f.items.map((it) => ({ type: "commit", ref: it.sha, repo: f.repo, date: it.date, label: `${it.sha} · ${it.msg}` })))));
  const u = { id, title, tags, text, fills, receipts };
  const i = corpus.findIndex((x) => x.id === id);
  if (i >= 0) corpus[i] = u; else corpus.push(u);
};
const re = (f, id) => ({ ...f, id }); // fill ids must be unique per unit only, but keep them distinct anyway
unit("ky-architecture", "KYURI.OS: system architecture", ["kyuri", "architecture", "system-design", "vercel", "nextjs", "neon", "notion", "cloudflare", "full-stack"],
  "The site is Next.js on Vercel and stays up when my laptop sleeps. Notion holds applications, Neon Postgres holds accounts, quotas and evidence, and anything that needs Claude goes through a Cloudflare tunnel to the box, which writes resumes to Google Drive.",
  [re(kyArch, "u-ky-arch"), re(kyProblem, "u-ky-arch-problem"), re(kyHow, "u-ky-arch-how"), commits("u-ky-arch-commits", 0.4, "kyuri-dashboard", ["282ad60", "e529892", "4b5f540", "6f124ad"])]);
unit("ky-job-boards", "KYURI.OS: job boards it searches", ["kyuri", "job-boards", "speedrun", "a16z", "designer-fund", "integrations", "find-roles"],
  "FIND ROLES searches three boards from Vercel: speedrun startups and the a16z portfolio through the speedrun talent network API, and Designer Fund's Getro board. Signed-in candidates and the owner can use it, not visitors. Greenhouse and Lever studio postings feed the owner's Targets list. LinkedIn is used only for scouting people, never as a job source.",
  [re(kyBoards, "u-ky-boards"), re(kyBoardsKpi, "u-ky-boards-n"), re(kyStudios, "u-ky-studios"), commits("u-ky-boards-commits", 0.4, "kyuri-dashboard", ["564d10b", "b20205a", "2564c44", "99f1030"])]);
unit("ky-design-system", "KYURI.OS: design system in Figma", ["kyuri", "design-system", "figma", "tokens", "pixel-art", "components", "design-engineering"],
  "KYURI.OS has a Figma design source: dark and light color tokens, a pipeline status ramp, Jura and Space Mono type, components and pixel sprites. A figma-sync skill diffs Figma against a baseline and builds each change in the file that renders it.",
  [re(kyDs, "u-ky-ds"), re(kyTokens, "u-ky-tokens"), re(kyPixel, "u-ky-pixel"), re(kyHeader, "u-ky-header")]);
unit("ck-architecture", "ChekOut: system architecture", ["chekout", "architecture", "system-design", "langflow", "cloud-run", "shopify", "nextjs"],
  "One Next.js app serves the merchant builder and the storefront widget. Chat goes to a Langflow agent per merchant; onboarding, store sync and billing go to backend services on Cloud Run that connect to Shopify.",
  [re(ckArch, "u-ck-arch"), re(ckSystem, "u-ck-system"), commits("u-ck-arch-commits", 0.4, "chekoutai-frontend", ["91ebf39", "e553f4b", "5264ce8", "313d08d"])]);
unit("ck-design-system", "ChekOut: design system in Figma", ["chekout", "design-system", "figma", "components", "chat-widget"],
  "The ChekOut design file documents the shipped widget and builder as tokens and components, including the chat panel in its welcome, conversation and thinking states.",
  [re(ckDs, "u-ck-ds")]);
unit("cv-architecture", "Christine Valmy: agent architecture", ["christine-valmy", "architecture", "rag", "n8n", "wordpress", "bilingual"],
  "A React widget in a WordPress plugin talks to an enrollment agent that answers through RAG from the school's content. A schedule pipeline keeps classes current, and n8n on GCP passes sorted leads to enrollment officers. The agent shipped with Claude and now runs on Gemini.",
  [re(cvArch, "u-cv-arch")]);
if (kyOpen) unit("ky-open-safely", kyOpen.question.replace(/\?$/, ""), ["kyuri", "security", "access-control", "rate-limits", "testing", "multi-user"], kyOpen.thesis,
  kyOpen.fills.map((f) => ({ ...f, id: `u-${f.id}` })));
save("corpus.json", corpus);
console.log("decks", decks.map((d) => d.id).join(" "), "| corpus", corpus.length);
