/**
 * The answer step. Given a question, return an Answer (thesis + fills).
 *
 * Local answerer, in order:
 *  1. a starter deck whose question matches exactly or nearly (token overlap)
 *  2. the top corpus units by term overlap, their fills merged and reweighted
 *  3. a fixture (only while real content is missing)
 *
 * `setAnswerer(fn)` swaps in a real model later: fn(question, content) must
 * resolve to an Answer per src/data/schema.js. The stage does not care which.
 */
import { cleanAnswer } from "./content.js";

const STOP = new Set(("a an and are as at be but by can did do does for from has have how i in is it its me "
  + "my of on or show so tell that the their there this to was what when where which who why with you your about "
  + "work did made make any other some").split(" "));

export const tokens = (s) =>
  (s || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));

const norm = (s) => tokens(s).join(" ");

function overlap(a, b) {
  const A = new Set(a), B = new Set(b);
  if (!A.size || !B.size) return 0;
  let n = 0;
  for (const t of A) if (B.has(t)) n++;
  return n / Math.min(A.size, B.size) * 0.5 + n / new Set([...A, ...B]).size * 0.5;
}

function matchDeck(q, decks) {
  const nq = norm(q);
  // A deck answers to its question and to its earlier phrasings (`aliases`).
  const phrasings = (d) => [d.question, ...(Array.isArray(d.aliases) ? d.aliases : [])];
  const exact = decks.find((d) => phrasings(d).some((p) => norm(p) === nq));
  if (exact) return { answer: exact, how: "deck (exact)" };
  let best = null, bestS = 0;
  for (const d of decks) {
    for (const p of phrasings(d)) {
      const s = overlap(tokens(q), tokens(p));
      if (s > bestS) { bestS = s; best = d; }
    }
  }
  return bestS >= 0.5 ? { answer: best, how: `deck (near, ${bestS.toFixed(2)})` } : null;
}

const CASE_TAGS = { chekout: "chekout", "christine-valmy": "christine-valmy", kyuri: "kyuri-os", "kyuri-os": "kyuri-os" };
const caseOfUnit = (u) => {
  for (const t of u.tags || []) if (CASE_TAGS[t]) return CASE_TAGS[t];
  return null;
};

function retrieve(q, corpus) {
  const qt = tokens(q);
  if (!qt.length) return null;
  const scored = corpus.map((u) => {
    const tags = new Set((u.tags || []).flatMap(tokens));
    const title = new Set(tokens(u.title));
    const text = new Set(tokens(u.text));
    let s = 0;
    for (const t of qt) s += (tags.has(t) ? 3 : 0) + (title.has(t) ? 2 : 0) + (text.has(t) ? 1 : 0);
    return { u, s };
  }).filter((x) => x.s >= 2).sort((a, b) => b.s - a.s || (a.u.id < b.u.id ? -1 : 1));
  if (!scored.length) return null;
  const top = scored.filter((x) => x.s >= scored[0].s * 0.45).slice(0, 3);
  const seen = new Set();
  const fills = [];
  for (const { u, s } of top) {
    const rel = s / top[0].s;
    for (const f of u.fills) {
      if (seen.has(f.id)) continue;
      seen.add(f.id);
      fills.push({ ...f, weight: f.weight * rel });
    }
  }
  const max = Math.max(...fills.map((f) => f.weight));
  fills.forEach((f) => { f.weight = +(f.weight / max).toFixed(3); });
  const lead = top[0].u;
  // A corpus answer belongs to a case study when most of its units do.
  const votes = new Map();
  for (const { u } of top) {
    const c = caseOfUnit(u);
    if (c) votes.set(c, (votes.get(c) || 0) + 1);
  }
  const [caseStudy, n] = [...votes.entries()].sort((a, b) => b[1] - a[1])[0] || [];
  void n;
  const first = (lead.text || "").split(/(?<=[.!?])\s/)[0];
  return {
    answer: { id: `q-${lead.id}`, question: q, thesis: first || lead.title, fills, caseStudy: votes.get(caseStudy) > top.length / 2 ? caseStudy : undefined },
    how: `corpus (${top.map((x) => x.u.id).join(", ")})`,
  };
}

function fixtureFallback(q, fixtures) {
  let best = fixtures[0], bestS = -1;
  for (const f of fixtures) {
    const s = overlap(tokens(q), tokens(f.question));
    if (s > bestS) { bestS = s; best = f; }
  }
  if (bestS <= 0) {
    // Deterministic pick so the same question always lands on the same fixture.
    let h = 0;
    for (const c of q) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    best = fixtures[h % fixtures.length];
  }
  return { answer: best, how: "fixture" };
}

export async function localAnswer(q, content) {
  const d = content.decks.length ? matchDeck(q, content.decks) : null;
  if (d) return d;
  const r = content.corpus.length ? retrieve(q, content.corpus) : null;
  if (r) return r;
  if (content.decks.length) {
    // Real content exists but nothing matched: say so instead of faking.
    return {
      answer: { ...content.home, id: `nomatch-${Date.now()}`, thesis: "I don't have receipts for that yet. Try one of the suggested questions." },
      how: "no match",
    };
  }
  return fixtureFallback(q, content.fixtures);
}

let answerer = localAnswer;
export function setAnswerer(fn) { answerer = fn || localAnswer; }

export async function ask(q, content) {
  const r = await answerer(q, content);
  const answer = cleanAnswer(r.answer ?? r);
  return { answer, how: r.how ?? "custom" };
}

if (typeof window !== "undefined") window.setAnswerer = setAnswerer;
