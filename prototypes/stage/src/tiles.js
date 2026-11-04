/**
 * Home tiles. Each case study is TEXT: its role line, the task in display
 * type, and the headline number. Its cover is previewed large in the hero
 * cell while the tile is hovered or focused.
 *
 * Data: case-studies.json may carry `role` ("Co-founder · ChekOut AI"),
 * `task` (one short line) and `headline` ({ value, unit?, label }). Until it
 * does, they are derived here (see `tileText`), and the derivation says so.
 */

const YEAR = /^(19|20)\d\d$/;

/** First number-ish run in a kicker segment, e.g. "8 MERCHANTS LIVE", "CONVERSION 10% → 23%". */
function numberFromKicker(kicker = "") {
  for (const seg of kicker.split("·").map((s) => s.trim())) {
    const m = seg.match(/(\d[\d,.]*\s*%?(?:\s*→\s*\d[\d,.]*\s*%?)?)/);
    if (!m || YEAR.test(m[1].trim())) continue;
    const value = m[1].replace(/\s+/g, " ").trim();
    const label = seg.replace(m[1], " ").replace(/\s+/g, " ").trim().toLowerCase();
    if (label) return { value, label };
  }
  return null;
}

const sentenceCase = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : s);

import { caseName } from "./caseName.js";
import { glueHyphens } from "./engine/typo.js";

export function tileText(cs, cover) {
  const client = cover?.caption?.includes(":") ? cover.caption.split(":")[0].trim() : cs.title;
  // Small line above the hook: client · what it is (e.g. "Christine Valmy · Bilingual AI enrollment agent").
  const firstKicker = (cs.kicker || "").split("·")[0].trim();
  const role = cs.role || [client, firstKicker].filter(Boolean).join(" · ");
  // The big line: `hook`, the problem in a few words. Fallback: first summary sentence.
  const task = glueHyphens(cs.hook || cs.task || (cs.summary || "").split(/(?<=[.!?])\s+/)[0] || cs.title);
  const number = cs.metric || cs.headline || numberFromKicker(cs.kicker);
  return { role, task, number, roleShort: cs.kickerShort || null, taskShort: cs.hookShort ? glueHyphens(cs.hookShort) : null, derived: !cs.hook };
}

/**
 * Home with text-first tiles. The grid never re-cuts on hover: the hovered
 * tile only highlights, and the "namit" hero cell previews its cover
 * (see `heroPreviews` and TitleCell).
 */
/**
 * Home arrangements as ANCHORS the cut search must respect:
 * the "namit" wordmark + CURRENTLY as the left column; the face + Ask pinned
 * to the bottom-right corner; the case studies fill the rest by priority.
 */
export const ARRANGEMENT = { axis: "v", at: 0.36, bento: true, firstIds: (f) => f.kind === "title" || (f.kind === "prose" && f.id === "home-currently"), last: "home-face" };

export function homeWithTiles(home, cases, { chatOpen = false } = {}) {
  if (!cases?.length) return home;
  const fills = [];
  const top = Math.max(...cases.map((c) => c.priority ?? 0.5));
  for (const f of home.fills) {
    // The "THREE CASE STUDIES" heading becomes the site's character: the face + Ask.
    // While the chat is open Kip lives there; the tile (and its anchor) goes away.
    if (f.kind === "title" && /case stud/i.test(f.text)) { if (!chatOpen) fills.push({ kind: "face", id: "home-face", weight: 0.42 }); continue; }
    const cs = f.kind === "media" && f.caseStudy ? cases.find((c) => c.id === f.caseStudy) : null;
    if (!cs) { fills.push(f); continue; }
    const t = tileText(cs, f);
    const priority = cs.priority ?? 0.5;
    fills.push({
      kind: "tile", id: `tile-${cs.id}`, caseStudy: cs.id, caseTitle: caseName(cs.id),
      // Priority is the tile's weight: the engine gives the important one the room.
      // A steep curve so sizes differ clearly: 1.0 -> 1.0, 0.75 -> 0.6, 0.55 -> 0.43.
      weight: 0.12 + 0.88 * Math.pow(priority, 1.6), priority, mustMetric: priority === top,
      role: t.role, task: t.task, roleShort: t.roleShort, taskShort: t.taskShort, number: t.number, mediaId: f.id,
    });
  }
  const A = ARRANGEMENT;
  const first = fills.filter(A.firstIds).map((f) => f.id);
  const second = fills.filter((f) => !first.includes(f.id)).map((f) => f.id);
  return { ...home, id: `${home.id}@home${chatOpen ? "+chat" : ""}`, fills, split: { axis: A.axis, at: A.at, first, second, last: chatOpen ? undefined : A.last, bento: A.bento } };
}

/** case id -> { cover media fill, title line } for the hero's preview. */
export function heroPreviews(home, cases) {
  const out = {};
  for (const f of home?.fills || []) {
    if (f.kind !== "media" || !f.caseStudy) continue;
    const cs = cases?.find((c) => c.id === f.caseStudy);
    if (cs) { const t = tileText(cs, f); out[cs.id] = { cover: f, line: t.role, title: cs.title, number: t.number }; }
  }
  return out;
}
