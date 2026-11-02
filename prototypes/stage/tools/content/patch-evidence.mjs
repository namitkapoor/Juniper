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

const HANDOFF = data("design-plans/HANDOFF-rebuild-2026-10-26.md", "Live recordings on KivaKube and Rosendahl only, approved; never click add to cart");
const CKMAP = data("../kyuri-dashboard/docs/chekout-figma.md", "ChekOut AI in Figma: what each page documents");
const decks = load("decks.json");
const g = (id) => decks.find((d) => d.id === id);
const newDecks = [];

// ---- CV: the Spanish tile leads to the EN to ES recording
{
  const d = g("cv-d-bilingual");
  if (!d.fills.some((f) => f.id === "cvb-video")) {
    d.fills.splice(1, 0, media("cvb-video", 1, "assets/christine-valmy/en-to-es.mp4", 1.9104,
      "The inquiry form and chat in English; a student types hola and the agent, the form labels and the buttons switch to Spanish",
      "One word switches the whole page to Spanish.",
      "Watch the start: the page is in English, the student types hola, and from the next reply the agent answers in Spanish and every form label switches with it. That is the change session three asked for, recorded on the school's site.",
      [CV]));
  }
  d.fills.find((f) => f.id === "cvb-en").step.stage = "EN";
  d.fills.find((f) => f.id === "cvb-es").step.stage = "ES";
}
// ---- ChekOut: the live conversation
newDecks.push({ id: "ck-d-live", parent: "ck-conversation", caseStudy: "chekout",
  question: "What does a real conversation look like on a live store?",
  thesis: "Recorded on a merchant's live store, the agent answers in words, shows the products that back the answer, and opens product detail beside the thread.",
  fills: [
    media("ckl-desktop", 1, "assets/chekout/live-rosendahl.mp4", 1.8338, "Rosendahl's live store: a shopper asks for a wedding gift on a budget, the agent answers with products, and a product detail opens beside the chat with Add to Cart",
      "A full conversation on Rosendahl's live store.", "The whole exchange in one take on Rosendahl Design Group's own site: the question, the answer with product names in the sentence, the cards that back it, and the detail panel opening beside the thread.", [CK]),
    media("ckl-mobile", 0.8, "assets/chekout/live-rosendahl-mobile.mp4", 0.4621, "The agent on Rosendahl's store on a phone: a greeting, suggested questions, then an answer with a row of product cards",
      "The same agent on a phone.", "On a phone the chat is a sheet and products arrive as a row of cards under the reply. Recorded on the deployed widget without clicking add to cart, so the store's real numbers stay clean.", [HANDOFF]),
    prose("ckl-live", 0.6, "LIVE, NOT A MOCKUP: Both clips are the deployed widget on a merchant that approved being shown.", [HANDOFF]),
    prose("ckl-read", 0.5, "WHAT TO LOOK FOR: The agent names products and prices inside the sentence, then shows the cards, so the answer reads first and the products prove it.", [CK]),
  ] });
// ---- ChekOut: which stores are live
const logos = g("ck-merchant-outcomes").fills.find((f) => f.kind === "logos");
const storefront = logos.receipts.filter((r) => String(r.ref).startsWith("storefront:"));
newDecks.push({ id: "ck-d-live-stores", parent: "ck-merchant-outcomes", caseStudy: "chekout",
  question: "Which stores is the agent live on?",
  thesis: "Four of the live stores can be checked from the outside: each homepage loads the ChekOut embed with its own agent id.",
  fills: [
    prose("cklv-how", 1, "HOW I CHECKED: On November 2, 2026 each of these homepages loaded ChekOut's embed with its own agent id: KivaKube, Rosendahl Design Group, Pacific Soul Foods and Nuthatch Naturals.", storefront),
    media("cklv-kiva", 0.7, "assets/chekout/store-kivakube.webp", 1.6, "KivaKube's storefront homepage", "KivaKube, a portable grill brand.",
      "One of the stores the agent is live on. Its homepage loads the ChekOut embed with the agent id kiva.", [storefront[0]]),
    media("cklv-rosen", 0.7, "assets/chekout/store-rosendahl.webp", 1.6, "Rosendahl Design Group's storefront homepage", "Rosendahl Design Group, Danish homeware.",
      "Another live store. Its homepage loads the embed with the agent id rosendahl-design-group.", [storefront[1]]),
    commits("cklv-commits", 0.45, "chekoutai-frontend", ["91ebf39", "0956b17", "b343c7e"]),
  ] });
// ---- ChekOut: the design system in Figma
newDecks.push({ id: "ck-d-design", parent: "ck-platform-build", caseStudy: "chekout",
  question: "What is in the ChekOut design system?",
  thesis: "I documented the shipped widget and builder in Figma from the code, so every token and component points at the file it ships from.",
  fills: [
    prose("ckds-what", 1, "WHAT IT IS: Tokens, components and screens for the builder and the widget, rebuilt in Figma from the frontend code and tagged with their source files.", [CKMAP]),
    media("ckds-family", 0.85, "assets/chekout/ds-widget-family.webp", 1.3793, "The current chat widget family: icons, launcher chip, suggestion pills, feedback, thinking loader, product card, share sheet and the chat panel in three states",
      "The widget's parts, as shipped.", "Every part a shopper meets, from the launcher chip to the share sheet, documented at the frontend commit it shipped in.", [figma(CKF, "19:86", "Chat widget, current (7f4d4c0)")]),
    media("ckds-tokens", 0.7, "assets/chekout/ds-widget-tokens.webp", 2.5688, "Widget and builder tokens: component colors, widget sizes, radii and shadows, each with its source file",
      "Widget tokens with their sources.", "The widget's own colors, sizes, corners and shadows, each labeled with the code file it comes from, so the design file can't quietly drift from what ships.", [figma(CKF, "16:23", "Widget & builder tokens, added at 7f4d4c0")]),
    prose("ckds-guest", 0.55, "GUEST TOKENS: The widget has its own tokens for corners, shadows and bubble shape, separate from the builder's, because it lives on someone else's page.", [AP]),
  ] });
// ---- KYURI.OS: the live Job Hunt capture
newDecks.push({ id: "ky-d-live", parent: "ky-live", caseStudy: "kyuri-os",
  question: "Where do the live totals come from?",
  thesis: "The public Job Hunt page counts the same rows I work from, with companies, roles and people cleared before anything is counted.",
  fills: [
    media("kyl-panel", 1, "assets/kyuri-os/job-pipeline-panel.webp", 1.2444, "KYURI.OS job pipeline panel, visitor view: totals for captured, active, interviewed, rounds and rejected, then the five stages from capture to Obsidian",
      "The pipeline panel, signed out, November 2, 2026.", "The totals and the five stages exactly as a visitor sees them. Capture, Notion and Obsidian are live; Drive is a dated snapshot because the site can't read my Drive.", [LIVE]),
    prose("kyl-redact", 0.75, "HOW IT'S COUNTED: The visitor view clears company, role, link, salary and source from every row before counting, so the totals show the shape of the search and nothing else.", [kyfile("app/components/ProofOfSearch.tsx", "Built only from the visitor projection"), kyfile("lib/job-apps.ts", "Visitor shape cached, redacted")]),
    kpi("kyl-rounds", 0.6, "12", "interview rounds across my applications", [LIVE]),
    kpi("kyl-bigday", 0.5, "27", "applications on my biggest single day", [LIVE], { period: "May 29" }),
    prose("kyl-snapshot", 0.45, "LIVE VS SNAPSHOT: The resume count is recounted by hand from Drive and dated, so the page never pretends it is live.", [kyfile("lib/proof.ts", "SNAPSHOT_DATE")]),
  ] });
// ---- KYURI.OS: tokens in both modes
newDecks.push({ id: "ky-d-tokens", parent: "ky-d-design", caseStudy: "kyuri-os",
  question: "What do the KYURI.OS tokens look like in both modes?",
  thesis: "Dark and light are two modes of one Figma variable collection, read from the same CSS file the site ships.",
  fills: [
    prose("kyk-modes", 1, "ONE COLLECTION, TWO MODES: The Figma collection mirrors app/globals.css: the dark mode from :root and the light mode from the light theme selector.", [figma(KYF, "2:111", "Collection kyuri, mode Dark. Source: app/globals.css")]),
    media("kyk-light", 0.8, "assets/kyuri-os/ds-tokens-light.webp", 0.8273, "KYURI.OS light-mode color tokens: grey surfaces, black ink and accent, green and red status colors",
      "The same tokens in light mode.", "Light mode swaps the warm ramp for greys and makes the accent black; each swatch still names the CSS variable it ships as.", [figma(KYF, "2:296", "Tokens / Light: Surface & ink")]),
    media("kyk-type", 0.6, "assets/kyuri-os/ds-type.webp", 1.5391, "Type styles: Jura for the interface and Space Mono for numbers, from display to meta",
      "Jura for words, Space Mono for numbers.", "Every text style the site uses, shown with real lines from the site, from the display numeral to the meta line.", [figma(KYF, "2:249", "Type styles")]),
    media("kyk-ramp", 0.5, "assets/kyuri-os/ds-status-ramp.webp", 2.122, "Pipeline status ramp: applying, applied, phone, interview, offer, rejected, closed",
      "One color per pipeline stage.", "The status ramp has its own tokens in both modes, so a stage reads the same on every panel.", [figma(KYF, "2:203", "Pipeline status ramp")]),
  ] });

// ---- opens
const OPENS = {
  "ck-merchant-outcomes": { "ck-atc": "ck-d-cart", "ck-top-metrics": "ck-d-dashboard", "ck-brands": "ck-d-live-stores", "ck-live-logos": "ck-d-live-stores" },
  "ck-conversation": { "ck-shape-product": "ck-d-live", "ck-shape-question": "ck-d-live", "ck-shape-bundle": "ck-d-live" },
  "ck-platform-build": { "ap-time": "ck-d-builder", "ck-ds-chat": "ck-d-design" },
  "cv-build": { "cv-mobile": "cv-d-a11y" },
  "ky-live": { "ky-jobhunt-shot": "ky-d-live", "ky-captured": "ky-d-live", "ky-sent": "ky-d-live", "ky-interviews": "ky-d-live", "ky-resumes": "ky-d-live", "ky-weekly": "ky-d-live" },
  "ky-guards": { "ky-checks": "ky-d-tailoring" },
  "ky-build": { "ky-build-boards-n": "ky-d-boards", "ky-ds-pixel": "ky-d-design", "ky-ds-header": "ky-d-design" },
  "ky-d-design": { "kyd-tokens": "ky-d-tokens" },
};
const all = [...decks.filter((d) => !newDecks.some((n) => n.id === d.id)), ...newDecks];
for (const d of all) for (const [fid, child] of Object.entries(OPENS[d.id] || {})) {
  const f = d.fills.find((x) => x.id === fid);
  if (!f) throw new Error(`${d.id} has no fill ${fid}`);
  f.opens = child;
}
save("decks.json", all);
console.log("evidence decks", newDecks.length);
