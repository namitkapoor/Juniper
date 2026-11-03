#!/usr/bin/env node
/**
 * Moves IP out of the public data into private/ (gitignored), leaving one
 * `gate` fill where gated fills were. Re-runnable: it merges any existing
 * private/gated.json back in first, then splits again.
 *
 *   node tools/content/split-gated.mjs          # split (writes src/data + private/)
 *   node tools/content/split-gated.mjs --merge  # put everything back (undo)
 *
 * Scope (owner, 2026-11-03): ChekOut + Christine Valmy only.
 *   - architecture diagrams (and their -light variants)
 *   - commit lists
 *   - stack prose (cells naming the services and how they connect)
 *   - Kip's corpus answers about the stack
 */
import fs from "node:fs";
import path from "node:path";
import { mergeGated } from "../../src/gate.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const P = (...a) => path.join(ROOT, ...a);
const readJ = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const writeJ = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2) + "\n"); };

const DECKS = P("src/data/decks.json");
const CORPUS = P("src/data/corpus.json");
const STORE = P("private/gated.json");

// Whole decks that are architecture end to end.
const WHOLE_DECKS = new Set(["ck-d-stack", "ck-d-knowledge", "ck-d-backend", "cv-d-bridge", "cv-d-handoff"]);
// Stack prose in otherwise public decks.
const PROSE = new Set(["ck-system", "cv-stack", "cv-sorts", "ckd-data"]);
// Commit lists from these repos are gated wherever they appear (also in "other work" decks).
const GATED_REPOS = /chekout|valmy/i;
// Partly gated decks whose thesis names the stack get this public line instead.
const PUBLIC_THESIS = {
  "cv-build": "I designed and built the enrollment agent's chat widget and its WordPress plugin; the architecture behind it is password-protected.",
};
// Corpus units that are about the stack.
const WHOLE_UNITS = new Set(["ck-architecture", "cv-architecture", "cv-agent", "rec-8ca0deab", "rec-868464ba", "rec-1b47815a", "rec-df2abd95", "rec-bb6dd897", "rec-c7c71106"]);
// Diagram files (base names, both themes) under these case folders.
const CASES = ["chekout", "christine-valmy"];
const DIAGRAMS = /^(system-context|onboarding-flow|knowledge|data-observability|architecture|bridge|data-flow)(-light)?\.(svg|webp|png)$/;
const STACK = /Langflow|Vertex|pgvector|Postgres|Cloud Run|FastAPI|BigQuery|Firebase|Databricks|Datadog|n8n|\bMCP\b|Gemini|Creatio|reCAPTCHA|\bRAG\b|embedding|canary|OAuth|webhook|Next\.js|Google Cloud|\bgcp\b|vector/i;

const inScope = (id, cs) => cs === "chekout" || cs === "christine-valmy" || /^(ck|cv|ap)-/.test(id);
const DIAG_REF = new RegExp(`assets/(${CASES.join("|")})/((?:system-context|onboarding-flow|knowledge|data-observability|architecture|bridge|data-flow)(?:-light)?\\.(?:svg|webp|png))`, "g");
const toGated = (fill) => JSON.parse(JSON.stringify(fill).replace(DIAG_REF, "gated/$1/$2"));
const DIAG_ONE = new RegExp(DIAG_REF.source);
const isDiagram = (f) => f.kind === "media" && DIAG_ONE.test(f.src || "");

const LABEL = "Password-protected";
const TEXT = {
  deck: "This part covers ChekOut and Christine Valmy system architecture, stack and commit history, which belong to the companies. Enter the password I shared with you to see it.",
  part: "Architecture and commit history for this part are password-protected. Enter the password I shared with you to see them.",
};
const THESIS = "The architecture behind this is password-protected. Enter the password I shared with you, or ask me on a call.";

function gateFill(ownerId, gated, whole) {
  const count = { diagrams: 0, commits: 0, notes: 0 };
  for (const { fill } of gated) {
    if (fill.kind === "media") count.diagrams++;
    else if (fill.kind === "commits") count.commits += (fill.items || []).length;
    else count.notes++;
  }
  const weight = Math.max(0.35, ...gated.map((g) => g.fill.weight ?? 0.5));
  // Say exactly what is locked here: "The architecture diagram and commit history for this part are ..."
  const what = [count.diagrams && (count.diagrams > 1 ? "architecture diagrams" : "architecture diagram"), count.notes && "stack notes", count.commits && "commit history"].filter(Boolean);
  const list = what.length > 1 ? `${what.slice(0, -1).join(", ")} and ${what[what.length - 1]}` : what[0] || "architecture";
  const plural = what.length > 1 || count.diagrams > 1 || (what.length === 1 && count.notes);
  const part = `The ${list} for this part ${plural ? "are" : "is"} password-protected. Enter the password I shared with you to see ${plural ? "them" : "it"}.`;
  return { kind: "gate", id: `${ownerId}~gate`, weight: whole ? 1 : weight, label: LABEL, text: whole ? TEXT.deck : part, count };
}

function split(items, kind, store) {
  let moved = 0;
  const out = items.map((it) => {
    const cs = it.caseStudy;
    const owner = kind === "decks" ? inScope(it.id, cs) : /^(ck|cv|ap)-|^rec-/.test(it.id);
    const repoCommits = (f) => f.kind === "commits" && GATED_REPOS.test(f.repo || "");
    if (!owner && !(it.fills || []).some(repoCommits)) return it;
    const whole = kind === "decks" ? WHOLE_DECKS.has(it.id) : WHOLE_UNITS.has(it.id);
    const gated = [];
    const pub = [];
    let before = -1; // public fills that come before the first gated one
    (it.fills || []).forEach((f, at) => {
      const take = repoCommits(f) || (owner && (whole || isDiagram(f) || f.kind === "commits" || (kind === "decks" && PROSE.has(f.id))))
        || (owner && kind === "corpus" && (f.kind === "prose" || f.kind === "quote") && STACK.test(f.text || ""));
      if (take) { if (before < 0) before = pub.length; gated.push({ at, fill: toGated(f) }); } else pub.push(f);
    });
    if (!gated.length) return it;
    moved += gated.length;
    const entry = { fills: gated };
    const next = { ...it };
    if (whole && kind === "decks" && it.thesis) { entry.thesis = it.thesis; next.thesis = THESIS; }
    if (whole && kind === "corpus") { entry.text = it.text; next.text = `${it.title}. ${THESIS}`; }
    if (!whole && kind === "decks" && it.thesis && (PUBLIC_THESIS[it.id] || STACK.test(it.thesis))) { entry.thesis = it.thesis; next.thesis = PUBLIC_THESIS[it.id] || THESIS; }
    if (kind === "corpus" && whole) {
      if (STACK.test(it.title || "")) { entry.title = it.title; next.title = `${it.title.split(":")[0]}: work record (password-protected)`; next.text = `${next.title}. ${THESIS}`; }
      if (it.tags?.some((t) => STACK.test(t))) { entry.tags = it.tags; next.tags = it.tags.filter((t) => !STACK.test(t)); }
    }
    if (whole && it.receipts?.length) { entry.receipts = it.receipts.map(toGated); next.receipts = []; }
    const g = gateFill(it.id, gated, whole);
    next.fills = [...pub.slice(0, before), g, ...pub.slice(before)];
    // A gated fill that opened a PUBLIC deck: keep that path open from a public fill.
    if (kind === "decks") for (const { fill } of gated) {
      if (!fill.opens || WHOLE_DECKS.has(fill.opens) || pub.some((f) => f.opens === fill.opens)) continue;
      const host = pub.find((f) => f.kind === "prose" && !f.opens);
      if (host) { const i = pub.indexOf(host); pub[i] = { ...host, opens: fill.opens }; entry.movedOpens = [...(entry.movedOpens || []), host.id]; }
    }
    store[kind][it.id] = entry;
    return next;
  });
  return { out, moved };
}

function moveAssets(dir, back) {
  let n = 0;
  for (const cs of CASES) {
    const from = back ? P("private/gated", cs) : P("public/assets", cs);
    const to = back ? P("public/assets", cs) : P("private/gated", cs);
    if (!fs.existsSync(from)) continue;
    for (const f of fs.readdirSync(from)) {
      if (!DIAGRAMS.test(f)) continue;
      fs.mkdirSync(to, { recursive: true });
      fs.renameSync(path.join(from, f), path.join(to, f));
      n++;
    }
  }
  return n;
}

// 1. Always start from the merged (full) data.
let decks = readJ(DECKS);
let corpus = readJ(CORPUS);
if (fs.existsSync(STORE)) {
  ({ decks, corpus } = mergeGated(decks, corpus, readJ(STORE)));
  // gated asset paths back to public ones
  const back = (o) => JSON.parse(JSON.stringify(o).replace(/gated\/(chekout|christine-valmy)\//g, "assets/$1/"));
  decks = back(decks); corpus = back(corpus);
  moveAssets(null, true);
}

if (process.argv.includes("--merge")) {
  writeJ(DECKS, decks); writeJ(CORPUS, corpus);
  if (fs.existsSync(STORE)) fs.rmSync(STORE);
  console.log("merged: public data restored, private/gated.json removed");
  process.exit(0);
}

// 2. Split.
const store = { v: 1, decks: {}, corpus: {} };
const d = split(decks, "decks", store);
const c = split(corpus, "corpus", store);
writeJ(DECKS, d.out);
writeJ(CORPUS, c.out);
writeJ(STORE, store);
const files = moveAssets(null, false);

// 3. Leak check: nothing public may still name a gated asset or carry stack prose for these cases.
const pubText = JSON.stringify(d.out) + JSON.stringify(c.out);
const leaks = [...pubText.matchAll(DIAG_REF)].map((m) => m[0]);
console.log(`gated: ${d.moved} deck fills in ${Object.keys(store.decks).length} decks, ${c.moved} corpus fills in ${Object.keys(store.corpus).length} units, ${files} files moved to private/gated/`);
if (leaks.length) { console.log("LEAK: public data still references", [...new Set(leaks)]); process.exitCode = 1; }
