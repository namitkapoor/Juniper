// Checks the content JSON against the shapes in schema.js.
// Run from anywhere: node src/data/validate.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILL_KINDS } from "./schema.js";
import { mergeGated } from "../gate.js";

const DATA = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(DATA, "../../public");
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
// IP gate: validate the FULL content (public + private/gated.json), as an unlocked visitor sees it.
const STORE = path.resolve(DATA, "../../private/gated.json");
const GATED = fs.existsSync(STORE) ? JSON.parse(fs.readFileSync(STORE, "utf8")) : null;
const PRIVATE = path.resolve(DATA, "../../private");

const isStr = (v) => typeof v === "string" && v.length > 0;
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);
const DASH = /[—–]/;

// Every string anywhere: no em or en dashes.
function walkStrings(v, where) {
  if (typeof v === "string") { if (DASH.test(v)) err(where, `contains an em/en dash: "${v.slice(0, 60)}"`); return; }
  if (Array.isArray(v)) return v.forEach((x, i) => walkStrings(x, `${where}[${i}]`));
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkStrings(x, `${where}.${k}`);
}

const assetsSeen = new Set();
function checkAsset(p, where) {
  if (!isStr(p)) return err(where, "asset path missing");
  if (p.startsWith("gated/")) {
    if (!fs.existsSync(path.join(PRIVATE, p))) return err(where, `gated asset not found: private/${p}`);
    return void assetsSeen.add(p);
  }
  if (!p.startsWith("assets/")) return err(where, `asset path must start with assets/: ${p}`);
  if (!fs.existsSync(path.join(PUBLIC, p))) return err(where, `asset file not found: public/${p}`);
  assetsSeen.add(p);
  // Light theme swaps to NAME-light (content.js themedSrc): demos must have one; any that exists is in use.
  const light = p.replace(/(\.[a-z0-9]+)$/i, "-light$1");
  if (fs.existsSync(path.join(PUBLIC, light))) assetsSeen.add(light);
  else if (/\/demos\//.test(p)) err(where, `demo has no light variant: public/${light}`);
}

function checkReceipt(r, where) {
  if (!r || typeof r !== "object") return err(where, "receipt is not an object");
  if (!["commit", "asset", "record"].includes(r.type)) err(where, `bad receipt type ${r.type}`);
  if (!isStr(r.ref)) err(where, "receipt.ref missing");
  if (r.type === "commit" && !isStr(r.repo)) err(where, "commit receipt needs repo");
  if (r.url !== undefined && !/^https:\/\//.test(r.url)) err(where, `receipt.url not https: ${r.url}`);
  if (r.date !== undefined && r.date !== null && !isDate(r.date)) err(where, `receipt.date not ISO: ${r.date}`);
  if (r.type === "asset" && r.ref.startsWith("assets/")) checkAsset(r.ref, where);
  if (r.preview !== undefined) checkPreview(r.preview, `${where}.preview`);
}

// Receipt.preview: a playable demo (device-framed GIF) shown in the Proof list.
const PREVIEW_FRAMES = ["phone", "laptop", "none"];
const PREVIEW_KEYS = new Set(["src", "poster", "aspect", "frame"]);
function checkPreview(p, where) {
  if (!p || typeof p !== "object" || Array.isArray(p)) return err(where, "preview is not an object");
  checkAsset(p.src, `${where}.src`);
  if (isStr(p.src) && !/\.(gif|webp|png|mp4|webm)$/i.test(p.src)) err(where, `preview.src not a gif/webp/png/mp4/webm: ${p.src}`);
  if (p.poster !== undefined) checkAsset(p.poster, `${where}.poster`);
  if (!(typeof p.aspect === "number" && Number.isFinite(p.aspect) && p.aspect > 0)) err(where, `preview.aspect must be a number > 0: ${p.aspect}`);
  if (!PREVIEW_FRAMES.includes(p.frame)) err(where, `preview.frame must be one of ${PREVIEW_FRAMES.join("|")}: ${p.frame}`);
  for (const k of Object.keys(p)) if (!PREVIEW_KEYS.has(k)) err(where, `preview has unknown key "${k}"`);
}
const checkReceipts = (rs, where, required) => {
  if (rs === undefined) { if (required) err(where, "receipts required"); return; }
  if (!Array.isArray(rs)) return err(where, "receipts must be an array");
  if (required && rs.length < 1) err(where, "needs at least one receipt");
  rs.forEach((r, i) => checkReceipt(r, `${where}.receipts[${i}]`));
};

function checkFill(f, where, ids) {
  if (!f || typeof f !== "object") return err(where, "fill is not an object");
  if (!FILL_KINDS.includes(f.kind)) err(where, `unknown kind ${f.kind}`);
  if (!isStr(f.id)) err(where, "id missing");
  else if (ids.has(f.id)) err(where, `duplicate fill id ${f.id}`);
  else ids.add(f.id);
  if (typeof f.weight !== "number" || f.weight < 0 || f.weight > 1) err(where, `weight must be 0..1, got ${f.weight}`);
  switch (f.kind) {
    case "title": if (!isStr(f.text)) err(where, "title.text missing"); break;
    case "kpi":
      if (!isStr(f.value)) err(where, "kpi.value must be a non-empty string");
      if (!isStr(f.label)) err(where, "kpi.label missing");
      checkReceipts(f.receipts, where, true);
      if (f.breakdown !== undefined) {
        if (!Array.isArray(f.breakdown) || f.breakdown.length === 0) err(where, "kpi.breakdown must be a non-empty array");
        else {
          let total = 0;
          f.breakdown.forEach((b, i) => {
            const w = `${where}.breakdown[${i}]`;
            if (!isStr(b.label)) err(w, "label missing");
            if (!isStr(b.value)) err(w, "value must be a non-empty string");
            if (b.share !== undefined) {
              if (typeof b.share !== "number" || b.share < 0 || b.share > 1) err(w, `share must be 0..1, got ${b.share}`);
              else total += b.share;
            }
            if (b.logo !== undefined) checkAsset(b.logo, `${w}.logo`);
          });
          if (total > 1.01) err(where, `breakdown shares sum to ${total.toFixed(3)} (> 1.01)`);
        }
      }
      break;
    case "logos":
      if (f.label !== undefined && !isStr(f.label)) err(where, "logos.label must be a non-empty string");
      if (!Array.isArray(f.items) || f.items.length === 0) err(where, "logos.items must be non-empty");
      else f.items.forEach((it, i) => {
        const w = `${where}.items[${i}]`;
        if (!isStr(it.name)) err(w, "name missing");
        checkAsset(it.src, `${w}.src`);
        if (it.invert !== undefined && typeof it.invert !== "boolean") err(w, "invert must be a boolean");
        if (typeof it.aspect !== "number" || !(it.aspect > 0)) err(w, `aspect must be > 0, got ${it.aspect}`);
        if (it.url !== undefined && !/^https:\/\//.test(it.url)) err(w, `url not https: ${it.url}`);
      });
      checkReceipts(f.receipts, where, false);
      break;
    case "prose":
      if (!isStr(f.text)) err(where, "prose.text missing");
      // A problem statement is a claim: it needs a source (research, a client reference, data or code).
      checkReceipts(f.receipts, where, /^\s*(THE PROBLEM|THREE PROBLEMS)\b/.test(f.text || ""));
      if (f.status !== undefined) {
        if (!isStr(f.status?.text)) err(where, "prose.status.text missing");
        if (f.status?.link && (!isStr(f.status.link.label) || !/^https:\/\//.test(f.status.link.url || ""))) err(where, "prose.status.link needs label + https url");
      }
      if (f.evidence !== undefined && (!Array.isArray(f.evidence) || !f.evidence.every(isStr))) err(where, "prose.evidence must be an array of fill ids");
      break;
    case "quote":
      if (!isStr(f.text)) err(where, "quote.text missing");
      if (!isStr(f.who)) err(where, "quote.who missing");
      checkReceipts(f.receipts, where, false);
      break;
    case "media":
      if (!["image", "video", "animation"].includes(f.media)) err(where, `bad media type ${f.media}`);
      checkAsset(f.src, `${where}.src`);
      if (f.poster !== undefined) checkAsset(f.poster, `${where}.poster`);
      if (typeof f.aspect !== "number" || !(f.aspect > 0)) err(where, `aspect must be > 0, got ${f.aspect}`);
      if (!isStr(f.alt)) err(where, "media.alt missing");
      if (f.explain !== undefined && !isStr(f.explain)) err(where, "media.explain must be a non-empty string");
      if (f.step !== undefined) {
        const st = f.step;
        if (!st || typeof st !== "object") err(where, "media.step must be an object");
        else {
          if (!Number.isInteger(st.of) || st.of < 1) err(where, `step.of must be an integer >= 1, got ${st.of}`);
          if (!Number.isInteger(st.n) || st.n < 1 || st.n > st.of) err(where, `step.n must be an integer in 1..of, got ${st.n} of ${st.of}`);
          if (!isStr(st.stage)) err(where, "step.stage missing");
          if (!STEP_STATUS.includes(st.status)) err(where, `step.status must be one of ${STEP_STATUS.join("/")}, got ${st.status}`);
        }
      }
      if (f.kpi !== undefined && typeof f.kpi !== "string") {
        if (!f.kpi || typeof f.kpi !== "object") err(where, "media.kpi must be a kpi fill id or an inline kpi");
        else {
          if (!isStr(f.kpi.value)) err(where, "media.kpi.value must be a non-empty string");
          if (!isStr(f.kpi.label)) err(where, "media.kpi.label missing");
          checkReceipts(f.kpi.receipts, `${where}.kpi`, true);
        }
      }
      checkReceipts(f.receipts, where, false);
      break;
    case "specimen": {
      if (!isStr(f.sample)) err(where, "specimen.sample missing");
      if (!isStr(f.font)) err(where, "specimen.font missing (\"display\", \"body\" or a CSS family)");
      if (f.mode !== undefined && !["scale", "fit"].includes(f.mode)) err(where, `specimen.mode must be scale|fit, got ${f.mode}`);
      if (f.direction !== undefined && !["up", "down"].includes(f.direction)) err(where, `specimen.direction must be up|down, got ${f.direction}`);
      const fin = (v) => typeof v === "number" && Number.isFinite(v);
      if (!Array.isArray(f.scale) || f.scale.length < 2) err(where, "specimen.scale needs at least two steps");
      else f.scale.forEach((st, i) => {
        const w = `${where}.scale[${i}]`;
        if (!isStr(st.role)) err(w, "role missing");
        if (!fin(st.size) || st.size <= 0) err(w, `size must be > 0, got ${st.size}`);
        if (!fin(st.lineHeight) || st.lineHeight <= 0) err(w, `lineHeight must be px > 0, got ${st.lineHeight}`);
        if (!fin(st.tracking) || Math.abs(st.tracking) > 1) err(w, `tracking must be em in -1..1, got ${st.tracking}`);
        if (!Number.isInteger(st.weight) || st.weight < 100 || st.weight > 900) err(w, `weight must be 100..900, got ${st.weight}`);
        if (st.font !== undefined && !isStr(st.font)) err(w, "font must be a non-empty string");
        if (st.upper !== undefined && typeof st.upper !== "boolean") err(w, "upper must be a boolean");
      });
      if (f.spacing !== undefined) {
        if (!Array.isArray(f.spacing)) err(where, "specimen.spacing must be an array");
        else f.spacing.forEach((sp, i) => {
          if (!isStr(sp.name)) err(`${where}.spacing[${i}]`, "name missing");
          if (!fin(sp.value) || sp.value < 0) err(`${where}.spacing[${i}]`, `value must be px >= 0, got ${sp.value}`);
        });
      }
      if (f.mode === "fit" && !(f.fit && fin(f.fit.pad) && f.fit.pad >= 0)) err(where, "fit mode needs fit.pad (px)");
      if (f.fit?.floor !== undefined && !fin(f.fit.floor)) err(where, "fit.floor must be a number");
      checkReceipts(f.receipts, where, false);
      break;
    }
    case "gate": {
      if (!isStr(f.label)) err(where, "gate.label missing");
      if (!isStr(f.text)) err(where, "gate.text missing");
      break;
    }
    case "tokens": {
      if (!["color", "type", "radius", "shadow"].includes(f.section)) err(where, `tokens.section must be color|type|radius|shadow, got ${f.section}`);
      if (f.group !== undefined && !isStr(f.group)) err(where, "tokens.group must be a non-empty string");
      checkReceipts(f.receipts, where, false);
      break;
    }
    case "rules": {
      const icon = (v, w) => { if (!/^lucide:[a-z0-9-]+$/.test(v || "")) err(w, `icon must be a Lucide id (lucide:name), got ${v}`); };
      if (!isStr(f.label)) err(where, "rules.label missing");
      if (f.tag !== undefined && !isStr(f.tag)) err(where, "rules.tag must be a non-empty string");
      if (f.mode !== undefined && !["list", "flow", "pairs"].includes(f.mode)) err(where, `rules.mode must be list|flow|pairs, got ${f.mode}`);
      if (f.dense !== undefined && typeof f.dense !== "boolean") err(where, "rules.dense must be a boolean");
      if (!Array.isArray(f.items) || f.items.length === 0) err(where, "rules.items must be non-empty");
      else f.items.forEach((it, i) => {
        const w = `${where}.items[${i}]`;
        icon(it.icon, w);
        if (!isStr(it.text)) err(w, "text missing");
        else if (it.text.split(/\s+/).length > 6) err(w, `text is a label, keep it to 6 words or fewer: "${it.text}"`);
        for (const k of ["note", "from", "group"]) if (it[k] !== undefined && !isStr(it[k])) err(w, `${k} must be a non-empty string`);
        if (it.lock !== undefined && typeof it.lock !== "boolean") err(w, "lock must be a boolean");
        if (it.lock && f.mode !== "flow") err(w, "lock only applies to a flow step");
        if (it.from !== undefined && f.mode !== "pairs") err(w, "from only applies to pairs");
      });
      if (f.mode === "pairs" && !f.items?.some((it) => it.from)) err(where, "pairs needs at least one item with from");
      if (f.mode === "flow" && (f.items?.length < 2 || f.items?.length > 5)) err(where, "a flow needs 2-5 steps");
      if (f.exit !== undefined) {
        if (f.mode !== "flow") err(where, "exit only applies to a flow");
        icon(f.exit?.icon, `${where}.exit`);
        if (!isStr(f.exit?.text)) err(`${where}.exit`, "text missing");
      }
      if (f.chips !== undefined) {
        if (!Array.isArray(f.chips?.items) || !f.chips.items.length) err(`${where}.chips`, "items must be non-empty");
        else f.chips.items.forEach((c, i) => { if (!isStr(c.text)) err(`${where}.chips.items[${i}]`, "text missing"); if (c.icon !== undefined) icon(c.icon, `${where}.chips.items[${i}]`); });
      }
      // Each item is a claim from a source.
      checkReceipts(f.receipts, where, true);
      break;
    }
    case "commits":
      if (!isStr(f.repo)) err(where, "commits.repo missing");
      if (!Array.isArray(f.items) || f.items.length === 0) err(where, "commits.items must be non-empty");
      else f.items.forEach((it, i) => {
        const w = `${where}.items[${i}]`;
        if (!/^[0-9a-f]{7,40}$/.test(it.sha || "")) err(w, `bad sha ${it.sha}`);
        if (!isDate(it.date)) err(w, `bad date ${it.date}`);
        if (!isStr(it.msg)) err(w, "msg missing");
        if (it.url !== undefined && !/^https:\/\/github\.com\/.+\/commit\/[0-9a-f]{40}$/.test(it.url)) err(w, `bad url ${it.url}`);
      });
      break;
  }
}

// A media fill's `kpi` id must name a kpi fill in the same answer (or unit).
const STEP_STATUS = ["explored", "tested", "cut", "shipped"];

// Within one answer, the steps of a sequence (same \`of\`) are unique and run 1..k with no gaps.
function checkSteps(fills, where) {
  const seqs = new Map();
  for (const f of fills) if (f.kind === "media" && f.step && Number.isInteger(f.step.n) && Number.isInteger(f.step.of)) {
    if (!seqs.has(f.step.of)) seqs.set(f.step.of, []);
    seqs.get(f.step.of).push(f.step.n);
  }
  for (const [of, ns] of seqs) {
    const sorted = [...ns].sort((a, b) => a - b);
    if (new Set(sorted).size !== sorted.length) err(where, `steps of ${of} repeat: ${sorted.join(",")}`);
    else if (sorted.some((n, i) => n !== i + 1)) err(where, `steps of ${of} are not contiguous from 1: ${sorted.join(",")}`);
  }
}

// One number per answer: a KPI value is stated once (its own fill or one media kpi),
// and is not repeated in the thesis or in another fill's visible text.
function checkNumbersOnce(a, where) {
  const shown = [];
  a.fills.forEach((f) => {
    if (f.kind === "kpi") shown.push([f.id, f.value]);
    if (f.kind === "media" && f.kpi && typeof f.kpi === "object") shown.push([f.id, f.kpi.value]);
  });
  const seen = new Map();
  for (const [id, v] of shown) {
    if (seen.has(v)) err(where, `number "${v}" appears in both ${seen.get(v)} and ${id}`);
    else seen.set(v, id);
  }
  // Single digits are too common in prose to police ("one", "3 sessions"); check the rest.
  const visible = (f) => [f.text, f.caption, f.explain, f.kind === "kpi" ? f.label : null].filter((t) => typeof t === "string");
  for (const [id, v] of shown) {
    if (/^\d$/.test(v)) continue;
    const re = new RegExp(`(^|[^\\d.,])${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\d,])`);
    if (re.test(a.thesis)) err(where, `number "${v}" (${id}) is repeated in the thesis`);
    for (const f of a.fills) if (f.id !== id && visible(f).some((t) => re.test(t))) err(where, `number "${v}" (${id}) is repeated in ${f.id}`);
  }
}

function checkKpiRefs(fills, where) {
  fills.forEach((f, i) => {
    if (f.kind !== "media" || typeof f.kpi !== "string") return;
    if (!fills.some((k) => k.kind === "kpi" && k.id === f.kpi)) err(`${where}.fills[${i}]`, `media.kpi "${f.kpi}" is not a kpi fill in the same answer`);
  });
}

function checkAnswer(a, where, caseIds) {
  if (!isStr(a.id)) err(where, "id missing");
  if (typeof a.question !== "string") err(where, "question must be a string");
  if (!isStr(a.thesis)) err(where, "thesis missing");
  if (a.caseStudy !== undefined && !caseIds.has(a.caseStudy)) err(where, `unknown caseStudy ${a.caseStudy}`);
  if (!Array.isArray(a.fills) || a.fills.length === 0) return err(where, "fills must be non-empty");
  const ids = new Set();
  a.fills.forEach((f, i) => checkFill(f, `${where}.fills[${i}]`, ids));
  checkKpiRefs(a.fills, where);
  checkSteps(a.fills, where);
  a.fills.forEach((f, i) => {
    if (f.kind !== "prose" || !Array.isArray(f.evidence)) return;
    for (const id of f.evidence) {
      const t = a.fills.find((x) => x.id === id);
      if (!t) err(`${where}.fills[${i}]`, `evidence "${id}" is not a fill in this answer`);
      else if (t.kind !== "kpi" && t.kind !== "media") err(`${where}.fills[${i}]`, `evidence "${id}" is a ${t.kind}, want kpi or media`);
    }
  });
  if (where.startsWith("decks")) checkNumbersOnce(a, where);
}

// ---- case-studies.json
const cases = load("case-studies.json");
walkStrings(cases, "case-studies");
if (!Array.isArray(cases) || cases.length !== 3) err("case-studies", "must be exactly 3");
const caseIds = new Set();
cases.forEach((c, i) => {
  const w = `case-studies[${i}]`;
  for (const k of ["id", "title", "kicker", "summary", "why"]) if (!isStr(c[k])) err(w, `${k} missing`);
  if (caseIds.has(c.id)) err(w, "duplicate id");
  caseIds.add(c.id);
});

// ---- decks.json
const PUBLIC_DECKS = load("decks.json");
const PUBLIC_CORPUS = load("corpus.json");
const { decks, corpus } = mergeGated(PUBLIC_DECKS, PUBLIC_CORPUS, GATED);
walkStrings(decks, "decks");
const deckIds = new Set();
decks.forEach((d, i) => {
  checkAnswer(d, `decks[${i}](${d.id})`, caseIds);
  if (deckIds.has(d.id)) err(`decks[${i}]`, "duplicate deck id");
  deckIds.add(d.id);
  if (!isStr(d.question)) err(`decks[${i}]`, "question must be non-empty");
  if (d.aliases !== undefined && (!Array.isArray(d.aliases) || !d.aliases.every(isStr)))
    err(`decks[${i}]`, "aliases must be an array of non-empty strings");
});
// Questions and aliases together: each phrasing opens exactly one deck.
{
  const seenQ = new Map();
  const key = (s) => s.trim().toLowerCase();
  for (const d of decks) for (const q of [d.question, ...(Array.isArray(d.aliases) ? d.aliases : [])]) {
    if (!isStr(q)) continue;
    const k = key(q);
    if (seenQ.has(k) && seenQ.get(k) !== d.id) err(`decks(${d.id})`, `question/alias "${q}" also belongs to ${seenQ.get(k)}`);
    else if (seenQ.has(k)) err(`decks(${d.id})`, `alias "${q}" repeats this deck's own question or alias`);
    seenQ.set(k, d.id);
  }
}
for (const id of caseIds) {
  const n = decks.filter((d) => d.caseStudy === id && !d.parent).length;
  if (n < 2 || n > 3) err("decks", `case study ${id} has ${n} starter decks, want 2-3`);
}
const other = decks.filter((d) => !d.caseStudy && !d.parent).length;
if (other < 2 || other > 4) err("decks", `${other} "any other work" decks, want 2-4`);

// ---- drill-downs: parent / opens
{
  const byId = new Map(decks.map((d) => [d.id, d]));
  for (const d of decks) {
    const w = `decks(${d.id})`;
    if (d.parent !== undefined) {
      const p = byId.get(d.parent);
      if (!p) { err(w, `parent "${d.parent}" is not a deck`); continue; }
      if (p.caseStudy !== d.caseStudy) err(w, `parent ${p.id} is in case study ${p.caseStudy}, this deck is in ${d.caseStudy}`);
      if (d.fills.length < 4 || d.fills.length > 7) err(w, `a drill-down deck needs 4-7 fills, has ${d.fills.length}`);
      // The chain must end at a top-level deck of the same case study, without looping.
      const seen = new Set([d.id]);
      let cur = d;
      while (cur.parent) {
        if (seen.has(cur.parent)) { err(w, `parent chain loops at ${cur.parent}`); break; }
        seen.add(cur.parent);
        cur = byId.get(cur.parent);
        if (!cur) { err(w, "parent chain breaks"); break; }
      }
      if (cur && !cur.parent && cur.caseStudy !== d.caseStudy) err(w, `parent chain ends at ${cur.id}, outside case study ${d.caseStudy}`);
      if (!d.fills.some((f) => f.opens === d.id) && !decks.some((x) => x.fills.some((f) => f.opens === d.id))) err(w, "no tile opens this drill-down deck");
    }
    d.fills.forEach((f, i) => {
      if (f.opens === undefined) return;
      const c = byId.get(f.opens);
      if (!c) err(`${w}.fills[${i}]`, `opens "${f.opens}" is not a deck`);
      else if (c.parent === d.id) { /* a drill-down of this deck */ }
      else if (!c.parent && c.caseStudy && c.caseStudy === d.caseStudy && c.id !== d.id) { /* a sibling top-level deck, e.g. ARCHITECTURE -> build */ }
      else if (f.id.endsWith("-sys") && c.caseStudy && c.caseStudy === d.caseStudy && /-d-design$/.test(c.id)) { /* SYSTEM shortcut: the case's first deck links straight to its design deck */ }
      else err(`${w}.fills[${i}]`, `opens ${c.id}, whose parent is ${c.parent ?? "none"}, not ${d.id} (and it is not a top-level deck of the same case study)`);
      if (f.opensPrimary !== undefined && typeof f.opensPrimary !== "boolean") err(`${w}.fills[${i}]`, "opensPrimary must be a boolean");
    });
    // Several tiles may open one target, but exactly one of them carries the affordance.
    const byTarget = new Map();
    d.fills.forEach((f) => { if (f.opens) { if (!byTarget.has(f.opens)) byTarget.set(f.opens, []); byTarget.get(f.opens).push(f); } });
    for (const [t, fs] of byTarget) {
      const primaries = fs.filter((f) => f.opensPrimary === true).length;
      if (primaries > 1) err(w, `${primaries} tiles are primary openers of ${t}; at most one`);
      if (fs.length > 1 && primaries !== 1) err(w, `${fs.length} tiles open ${t} but none is opensPrimary`);
    }
    d.fills.forEach((f, i) => { if (f.opensPrimary && !f.opens) err(`${w}.fills[${i}]`, "opensPrimary without opens"); });
  }
}

// ---- corpus.json
// (corpus is loaded and merged above, with the decks)
walkStrings(corpus, "corpus");
const unitIds = new Set();
corpus.forEach((u, i) => {
  const w = `corpus[${i}](${u.id})`;
  if (!isStr(u.id)) err(w, "id missing");
  if (unitIds.has(u.id)) err(w, "duplicate id");
  unitIds.add(u.id);
  if (!isStr(u.title)) err(w, "title missing");
  if (!isStr(u.text)) err(w, "text missing");
  if (!Array.isArray(u.tags) || u.tags.length === 0 || !u.tags.every(isStr)) err(w, "tags must be non-empty strings");
  if (!Array.isArray(u.fills) || u.fills.length === 0) err(w, "fills must be non-empty");
  else { const ids = new Set(); u.fills.forEach((f, j) => checkFill(f, `${w}.fills[${j}]`, ids)); checkKpiRefs(u.fills, w); }
  checkReceipts(u.receipts, w, true);
});

// ---- home.json
const home = load("home.json");
walkStrings(home, "home");
checkAnswer(home, "home", caseIds);
const t = home.fills?.find((f) => f.kind === "title");
if (!t || t.text !== "namit" || t.kicker !== "PRODUCT ENGINEER · NEW YORK") err("home", 'needs title "namit" with kicker "PRODUCT ENGINEER · NEW YORK"');

// ---- about.json
const about = load("about.json");
if (about && about.offClock !== undefined) {
  if (!Array.isArray(about.offClock)) err("about.offClock", "must be an array");
  else about.offClock.forEach((it, i) => {
    const w = `about.offClock[${i}]`;
    if (!["book", "game", "watch"].includes(it.kind)) err(w, `kind must be book|game|watch, got ${it.kind}`);
    if (!isStr(it.title)) err(w, "title missing");
    if (!isStr(it.by)) err(w, "by missing");
    if (it.note !== undefined && !isStr(it.note)) err(w, "note must be a non-empty string");
    if (it.url !== undefined && !/^https:\/\//.test(it.url)) err(w, `url not https: ${it.url}`);
  });
}
walkStrings(about, "about");
{
  const w = "about";
  // Contact details never belong on the page.
  const flat = JSON.stringify(about);
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(flat)) err(w, "contains an email address");
  if (/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(flat)) err(w, "contains a phone number");
  if (/linkedin\.com\/in\//i.test(flat)) err(w, "contains a LinkedIn profile URL");
  if (!Array.isArray(about.bio) || about.bio.length === 0) err(w, "bio must be a non-empty Fill[]");
  else {
    const ids = new Set();
    about.bio.forEach((f, i) => {
      checkFill(f, `${w}.bio[${i}]`, ids);
      if (!["title", "prose", "quote", "media"].includes(f.kind)) err(`${w}.bio[${i}]`, `bio fills are title/prose/quote/media, got ${f.kind}`);
    });
  }
  const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
  const KINDS = ["work", "education", "founding", "project"];
  if (!Array.isArray(about.timeline) || about.timeline.length === 0) err(w, "timeline must be non-empty");
  else {
    about.timeline.forEach((t, i) => {
      const tw = `${w}.timeline[${i}]`;
      if (!YM.test(t.start || "")) err(tw, `start must be YYYY-MM, got ${t.start}`);
      if (t.end !== "Present" && !YM.test(t.end || "")) err(tw, `end must be YYYY-MM or "Present", got ${t.end}`);
      if (YM.test(t.end || "") && YM.test(t.start || "") && t.end < t.start) err(tw, "ends before it starts");
      for (const k of ["title", "org", "summary"]) if (!isStr(t[k])) err(tw, `${k} missing`);
      if (!KINDS.includes(t.kind)) err(tw, `kind must be one of ${KINDS.join("/")}, got ${t.kind}`);
      if (t.caseStudy !== undefined && !caseIds.has(t.caseStudy)) err(tw, `unknown caseStudy ${t.caseStudy}`);
      checkReceipts(t.receipts, tw, false);
    });
    // Newest first: by start month, descending.
    for (let i = 1; i < about.timeline.length; i++) {
      if ((about.timeline[i].start || "") > (about.timeline[i - 1].start || "")) err(`${w}.timeline[${i}]`, `not newest first: ${about.timeline[i].start} after ${about.timeline[i - 1].start}`);
    }
  }
  if (!Array.isArray(about.stack) || about.stack.length === 0) err(w, "stack must be non-empty");
  else about.stack.forEach((g, i) => {
    const gw = `${w}.stack[${i}]`;
    if (!isStr(g.group)) err(gw, "group missing");
    if (!Array.isArray(g.items) || g.items.length === 0) err(gw, "items must be non-empty");
    else g.items.forEach((it, j) => {
      const iw = `${gw}.items[${j}]`;
      if (!isStr(it.name)) err(iw, "name missing");
      if (it.icon !== undefined) {
        const iconify = /^([a-z0-9-]+):([a-z0-9-]+)$/.exec(String(it.icon));
        if (iconify) {
          // An Iconify id: the set must be installed and carry the icon.
          const set = path.resolve(DATA, `../../node_modules/@iconify-json/${iconify[1]}/icons.json`);
          if (!fs.existsSync(set)) err(iw, `icon set ${iconify[1]} is not installed`);
          else {
            const j = JSON.parse(fs.readFileSync(set, "utf8"));
            if (!j.icons?.[iconify[2]] && !j.aliases?.[iconify[2]]) err(iw, `icon ${it.icon} not found in @iconify-json/${iconify[1]}`);
          }
        } else {
          if (!String(it.icon).startsWith("assets/about/")) err(iw, `icon must be under assets/about/ or an Iconify id: ${it.icon}`);
          checkAsset(it.icon, `${iw}.icon`);
        }
      }
      if (it.jobs !== undefined && (!Array.isArray(it.jobs) || !it.jobs.every(isStr))) err(iw, "jobs must be an array of strings");
      if (it.evidence !== undefined && !isStr(it.evidence)) err(iw, "evidence must be a non-empty string");
    });
  });
  if (!about.portrait || typeof about.portrait !== "object") err(w, "portrait missing");
  else {
    checkAsset(about.portrait.src, `${w}.portrait.src`);
    if (!isStr(about.portrait.alt)) err(w, "portrait.alt missing");
  }
}

// ---- report
const fills = [...decks.flatMap((d) => d.fills), ...corpus.flatMap((u) => u.fills), ...home.fills, ...about.bio];
const count = (k) => fills.filter((f) => f.kind === k).length;
const commitItems = new Set(fills.filter((f) => f.kind === "commits").flatMap((f) => f.items.map((it) => `${f.repo}:${it.sha}`)));
const allReceipts = [...fills.flatMap((f) => f.receipts || []), ...corpus.flatMap((u) => u.receipts)];
for (const r of allReceipts) if (r.type === "commit") commitItems.add(`${r.repo}:${r.ref}`);
const linked = new Set([
  ...fills.filter((f) => f.kind === "commits").flatMap((f) => f.items.filter((it) => it.url).map((it) => it.sha)),
  ...allReceipts.filter((r) => r.type === "commit" && r.url).map((r) => r.ref),
]);
const onDisk = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (!e.name.startsWith(".")) onDisk.push(path.relative(PUBLIC, p));
  }
})(path.join(PUBLIC, "assets"));
const unused = onDisk.filter((p) => !assetsSeen.has(p));

console.log(`case studies ${cases.length} · decks ${decks.length} · corpus units ${corpus.length}`);
console.log(`fills: ${FILL_KINDS.map((k) => `${k} ${count(k)}`).join(", ")}`);
console.log(`assets referenced ${assetsSeen.size} · on disk ${onDisk.length}${unused.length ? ` · unreferenced: ${unused.join(", ")}` : ""}`);
console.log(`commits ${commitItems.size} distinct · ${linked.size} with a public GitHub url`);
if (errors.length) {
  console.log(`\nFAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.log("  " + e));
  process.exit(1);
}
console.log("\nPASS");

// IP gate: nothing public may name a gated diagram.
{
  const pub = JSON.stringify(PUBLIC_DECKS) + JSON.stringify(PUBLIC_CORPUS) + fs.readFileSync(path.join(DATA, "home.json"), "utf8");
  const leak = pub.match(/assets\/(chekout|christine-valmy)\/(system-context|onboarding-flow|knowledge|data-observability|architecture|bridge|data-flow)(-light)?\.[a-z]+/g);
  if (leak && GATED) { console.log(`GATE LEAK: public data references ${[...new Set(leak)].join(", ")}`); process.exitCode = 1; }
  if (GATED) console.log(`gate: validated with private/gated.json (${Object.keys(GATED.decks).length} decks, ${Object.keys(GATED.corpus).length} corpus units gated)`);
}
