/**
 * The stage layout engine: Answer.fills + a stage rect -> a guillotine cut
 * tree, the cells it leaves behind, and the strokes (one per cut) that draw it.
 *
 * Search: fills are ordered by weight (ties by id). A guillotine node splits
 * its rect along one axis into 2 or 3 children, each child taking a
 * CONTIGUOUS run of that order, so heavier fills land earlier (left / top).
 * Cut positions snap to a 12 x 12 grid over the stage, so every stroke sits
 * on a shared grid line and layouts read as designed rather than random.
 * Because each leaf's score depends only on its own rect, the best tree is
 * found exactly by memoized dynamic programming over
 * (grid rect, run of fills, depth).
 *
 * Score per leaf (lower is better), see fit.js for each kind:
 *   fit cost        aspect error / crop / overflow / font-step / emptiness
 * + weight-area     (ln(areaShare / weightShare))^2, so area follows weight
 * Score per layout: sum of leaves + a penalty for every fill dropped.
 *
 * Guardrails: depth <= 3 cut levels, <= 7 cells, every cell >= MIN_CELL,
 * lightest fills dropped (reported in `dropped`) when they do not fit.
 * Deterministic: no randomness, fixed iteration order, strict tie-breaks.
 */
import { fitFill, naturalHeight, INFEASIBLE, kickerH, kickerW, hookFits, STATUS_H, ctrlReserve } from "./fit.js";
import { MIN_CELL, PAD, TILE, KPI_LABEL_FONT, capsH, headingH, proseSteps, stepsFor, QUOTE_STEPS } from "./typo.js";
const TILE_STEPS = TILE.steps.length;

export const GRID = 12;
export const MAX_DEPTH = 3;
export const MAX_CELLS = 7;
export const PHONE_BREAKPOINT = 760;

const EPS = 1e-9;

/** Weight order: heavier first, ties broken by id so the order is total. */
export function orderFills(fills) {
  return [...fills].sort((a, b) => (b.weight - a.weight) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * @param {object} args
 * @param {{x:number,y:number,w:number,h:number}} args.rect   stage rect (left region)
 * @param {import('../data/schema.js').Fill[]} args.fills
 * @param {{lines:Function,width:Function}} args.measure
 * @param {string[]} [args.expanded]  fill ids whose receipts are open
 * @param {string[]} [args.promote]   fill ids to bring in even if light ("+N more")
 * @param {boolean} [args.phone]      force phone mode (default: rect.w < 760)
 * @param {number} [args.viewportW]   viewport width for the phone decision
 */
export function layoutStage({ rect, fills, measure, expanded = [], promote = [], phone, viewportW, split }) {
  const isPhone = phone ?? (viewportW ?? rect.w) < PHONE_BREAKPOINT;
  const exp = new Set(expanded);
  const prom = new Set(promote);
  // Expanded receipts and promoted fills get more room: weight is the lever.
  const weighted = fills.map((f) => {
    let weight = Math.max(0.02, Math.min(1, f.weight ?? 0.5));
    if (prom.has(f.id)) weight = Math.max(weight, 0.55);
    if (exp.has(f.id)) weight = Math.min(1.4, weight * 1.5 + 0.25);
    return { fill: f, weight };
  });
  // Process steps keep reading order: the step media swap weights among
  // themselves so step 1 sorts first (same set of weights, same total room).
  // (Not while one step is expanded: the expanded one must keep its weight.)
  const steps = weighted.filter((w) => w.fill.step).sort((a, b) => a.fill.step.n - b.fill.step.n);
  if (steps.length > 1 && !weighted.some((w) => w.fill.focused)) {
    const ws = steps.map((w) => w.weight).sort((a, b) => b - a);
    steps.forEach((w, i) => { w.weight = ws[i] - i * 1e-4; });
  }
  // A logos fill reads as one unit with the KPI it names ("8 merchants live"):
  // sort it right behind that KPI so the two land in adjacent cells.
  const pair = logosPartner(weighted);
  if (pair) pair.logos.weight = Math.max(0.02, pair.kpi.weight - 1e-4);
  if (isPhone) return stackLayout({ rect, weighted, measure, exp, split });
  if (split) return splitLayout({ rect, weighted, measure, exp, split });
  return gridLayout({ rect, weighted, measure, exp, pair });
}

/**
 * A fixed first cut (an "arrangement"): `first` fills on one side of a cut
 * near `at`, `second` on the other, each side searched as usual. The cut
 * position is still chosen by score among grid lines near `at`.
 */
function splitLayout({ rect, weighted, measure, exp, split }) {
  const xs = gridLines(rect.x, rect.w);
  const ys = gridLines(rect.y, rect.h);
  const byWeight = (a, b) => (b.weight - a.weight) || (a.fill.id < b.fill.id ? -1 : 1);
  const A = weighted.filter((w) => split.first.includes(w.fill.id)).sort(byWeight);
  let B = weighted.filter((w) => !split.first.includes(w.fill.id)).sort(byWeight);
  // A pinned fill goes last in its group: every cut puts the last child at the
  // right / bottom, so it lands in the bottom-right corner.
  if (split.last) B = [...B.filter((w) => w.fill.id !== split.last), ...B.filter((w) => w.fill.id === split.last)];
  const items = [...A, ...B].map((w) => ({ ...w, inset: null }));
  const sumW = items.reduce((s, it) => s + it.weight, 0);
  const fitCache = new Map();
  const solveA = makeSolver({ rect, xs, ys, items, sumW, measure, exp, fitCache, bento: split.bento ? { even: 0.35, aligned: 0, avoidY: new Set() } : null });
  const ideal = Math.round(split.at * GRID);
  let best = null;
  const hCuts = (t, out = new Set()) => { if (!t.leaf) { if (t.axis === "h") t.cuts.forEach((c) => out.add(c)); t.children.forEach((k) => hCuts(k, out)); } return out; };
  for (let c = Math.max(2, ideal - 2); c <= Math.min(GRID - 2, ideal + 2); c++) {
    const a = split.axis === "v" ? solveA(0, 0, c, GRID, 0, A.length, 1) : solveA(0, 0, GRID, c, 0, A.length, 1);
    if (!a) continue;
    // The other side avoids the first side's horizontal lines (no full-width grid line).
    const solveB = split.bento ? makeSolver({ rect, xs, ys, items, sumW, measure, exp, fitCache, bento: { even: 0.35, aligned: 0.6, avoidY: hCuts(a.tree) } }) : solveA;
    const b = split.axis === "v" ? solveB(c, 0, GRID, GRID, A.length, items.length, 1) : solveB(0, c, GRID, GRID, A.length, items.length, 1);
    if (!b) continue;
    const cost = a.cost + b.cost + 0.15 * Math.abs(c - ideal);
    if (!best || cost < best.cost - EPS) best = { cost, tree: { leaf: false, axis: split.axis, g: [0, 0, GRID, GRID], cuts: [c], children: [a.tree, b.tree] } };
  }
  if (!best) return gridLayout({ rect, weighted, measure, exp });
  const cells = [], strokes = [];
  emit(best.tree, "r", 0, { rect, xs, ys, cells, strokes, measure, exp });
  strokes.sort((a, b) => (a.depth - b.depth) || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0) || (a.index - b.index));
  strokes.forEach((s, i) => { s.order = i; });
  tileHierarchy(cells, weighted);
  equalizeHomeType(cells, weighted, measure, false);
  return { mode: "grid", rect, cells, strokes, dropped: [], tree: best.tree, score: best.cost };
}

/** The KPI a logos fill belongs to: one whose label names merchants/stores/brands, else the heaviest. */
function logosPartner(items) {
  const logos = items.find((w) => w.fill.kind === "logos");
  if (!logos) return null;
  const kpis = items.filter((w) => w.fill.kind === "kpi");
  if (!kpis.length) return null;
  const named = kpis.find((w) => /merchant|store|brand|client|customer|school|partner|live/i.test(w.fill.label));
  return { logos, kpi: named || kpis.reduce((a, b) => (b.weight > a.weight ? b : a)) };
}

/* ------------------------------------------------------------------ phone */

function stackLayout({ rect, weighted, measure, exp, split }) {
  let order = [...weighted].sort((a, b) => (b.weight - a.weight) || (a.fill.id < b.fill.id ? -1 : 1));
  // Anchors read top to bottom on phones: the first group's title (the
  // wordmark), then the case-study tiles by priority, then the rest of the
  // first group (CURRENTLY), then the others, the pinned one last.
  if (split) {
    const inA = (w) => split.first.includes(w.fill.id);
    const head = order.filter((w) => inA(w) && w.fill.kind === "title");
    const tiles = order.filter((w) => w.fill.kind === "tile").sort((a, b) => (b.fill.priority ?? 0) - (a.fill.priority ?? 0));
    const restA = order.filter((w) => inA(w) && w.fill.kind !== "title" && w.fill.kind !== "tile");
    const restB = order.filter((w) => !inA(w) && w.fill.kind !== "tile" && w.fill.id !== split.last);
    order = [...head, ...tiles, ...restA, ...restB, ...order.filter((w) => w.fill.id === split.last)];
  }
  // A fill with `follow` (an expanded tile's media) sits right under its tile.
  const followers = order.filter((w) => w.fill.follow && order.some((o) => o.fill.id === w.fill.follow));
  if (followers.length) {
    order = order.filter((w) => !followers.includes(w));
    for (const f of followers) order.splice(order.findIndex((o) => o.fill.id === f.fill.follow) + 1, 0, f);
  }
  const ctx = { pad: PAD.phone, measure, phone: true };
  let y = rect.y;
  const cells = [];
  const strokes = [];
  order.forEach(({ fill }, i) => {
    const nh = naturalHeight(fill, rect.w, { ...ctx, expanded: exp.has(fill.id) });
    let h = typeof nh === "number" ? nh : nh.h;
    let spec = typeof nh === "number" ? undefined : nh.spec;
    if (["media", "quote", "kpi", "commits", "logos", "tile", "timeline", "worklog", "stack", "portrait", "offclock", "specimen", "rules"].includes(fill.kind)) {
      spec = fitFill(fill, rect.w, h, { ...ctx, expanded: exp.has(fill.id) }).spec;
    }
    h = Math.max(h, MIN_CELL.h);
    if (i > 0) {
      strokes.push({
        id: `s${i}h0`, axis: "h", path: `s${i}`, depth: 1, order: i - 1, origin: "start",
        x1: rect.x, y1: y, x2: rect.x + rect.w, y2: y, pos: y,
      });
    }
    cells.push({ id: fill.id, fillId: fill.id, kind: fill.kind, x: rect.x, y, w: rect.w, h, spec, path: `s${i}` });
    y += h;
  });
  tileHierarchy(cells, weighted);
  equalizeHomeType(cells, weighted, measure, true);
  monotonicType(cells, weighted);
  // Text whose size changed above gets its height back (all lines, never cut),
  // and everything below it moves down: the stack is re-laid top to bottom.
  const stackH = restack(cells, strokes, weighted, measure, rect);
  return {
    mode: "stack", rect: { ...rect, h: stackH }, cells, strokes, dropped: [], tree: null, score: 0,
  };
}


/* ------------------------------------------------------------------- grid */

function gridLayout(args) {
  // The lead (heaviest) fill must get the largest cell: if the search gave it
  // less, boost its weight and search again (deterministic, a few tries).
  let L = gridLayoutOnce(args);
  const lead = [...args.weighted].sort((a, b) => b.weight - a.weight || (a.fill.id < b.fill.id ? -1 : 1))[0];
  for (let i = 0; i < 4 && lead && !leadIsLargest(L, lead.fill.id); i++) {
    args = { ...args, weighted: args.weighted.map((w) => (w.fill.id === lead.fill.id ? { ...w, weight: w.weight * 1.5 } : w)) };
    L = gridLayoutOnce(args);
  }
  return L;
}
function leadIsLargest(L, id) {
  const c = L.cells.find((x) => x.fillId === id);
  if (!c) return true; // dropped would be another problem; not this check's
  return L.cells.every((o) => o === c || c.w * c.h >= o.w * o.h);
}

function gridLayoutOnce({ rect, weighted, measure, exp, pair }) {
  const ordered = [...weighted].sort((a, b) => (b.weight - a.weight) || (a.fill.id < b.fill.id ? -1 : 1));
  const xs = gridLines(rect.x, rect.w);
  const ys = gridLines(rect.y, rect.h);
  const totalW = ordered.reduce((s, f) => s + f.weight, 0);

  // Candidate fill sets: everything that fits the cell cap, then drop the
  // lightest one at a time. Also try insetting a light KPI into a prose cell.
  const candidates = [];
  const capped = ordered.slice(0, MAX_CELLS);
  for (let n = capped.length; n >= Math.max(1, capped.length - 3); n--) {
    candidates.push({ items: capped.slice(0, n).map((w) => ({ ...w, inset: null })) });
  }
  for (const base of [...candidates]) {
    // A KPI is set inside prose only when that prose cites it as its evidence
    // (`evidence: [ids]`); unrelated fills are never paired.
    const prose = base.items.find((it) => it.fill.kind === "prose" && it.fill.text.length > 160 && (it.fill.evidence || []).length);
    // A KPI that logos belong to stays its own cell, so the two can read as one unit.
    const kpis = base.items.filter((it) => it.fill.kind === "kpi" && it.weight <= 0.6 && it.fill.id !== pair?.kpi.fill.id && (prose?.fill.evidence || []).includes(it.fill.id));
    if (prose && kpis.length) {
      const k = kpis[kpis.length - 1];
      const items = base.items
        .filter((it) => it !== k)
        .map((it) => (it === prose ? { ...it, weight: it.weight + k.weight * 0.6, inset: k.fill } : it));
      items.sort((a, b) => (b.weight - a.weight) || (a.fill.id < b.fill.id ? -1 : 1));
      candidates.push({ items, insetBonus: true });
    }
  }

  // Logos inside their KPI's cell, when that fits.
  for (const base of [...candidates]) {
    if (!pair) break;
    const logos = base.items.find((it) => it.fill.id === pair.logos.fill.id);
    const kpi = base.items.find((it) => it.fill.id === pair.kpi.fill.id && !it.inset);
    if (!logos || !kpi) continue;
    const items = base.items
      .filter((it) => it !== logos)
      .map((it) => (it === kpi ? { ...it, weight: it.weight + logos.weight * 0.5, attach: logos.fill } : it));
    items.sort((a, b) => (b.weight - a.weight) || (a.fill.id < b.fill.id ? -1 : 1));
    candidates.push({ items, insetBonus: true });
  }

  // Fit costs depend only on (fill, inset, cell size), so candidates share them.
  const fitCache = new Map();
  let best = null;
  for (const cand of candidates) {
    const shown = new Set(cand.items.flatMap((it) => [it.fill.id, it.inset?.id, it.attach?.id].filter(Boolean)));
    const droppedW = ordered.filter((o) => !shown.has(o.fill.id));
    const dropPenalty = droppedW.reduce((s, o) => s + 1.1 + 9 * (o.weight / totalW), 0);
    const sumW = cand.items.reduce((s, it) => s + it.weight, 0);
    const solver = makeSolver({ rect, xs, ys, items: cand.items, sumW, measure, exp, fitCache });
    const r = solver(0, 0, GRID, GRID, 0, cand.items.length, 0);
    if (!r) continue;
    const score = r.cost + dropPenalty - (cand.insetBonus ? 0.25 : 0);
    if (!best || score < best.score - EPS) best = { score, tree: r.tree, items: cand.items, dropped: droppedW.map((o) => o.fill.id), feasibleCost: r.cost };
  }
  if (!best) {
    // Nothing fits at all: heaviest fill alone fills the stage.
    const it = ordered[0];
    best = { score: INFEASIBLE, tree: { leaf: true, g: [0, 0, GRID, GRID], item: { ...it, inset: null } }, dropped: ordered.slice(1).map((o) => o.fill.id) };
  }

  const cells = [];
  const strokes = [];
  emit(best.tree, "r", 0, { rect, xs, ys, cells, strokes, measure, exp });
  // Draw order: breadth-first (shallow cuts first), then left/top first.
  strokes.sort((a, b) => (a.depth - b.depth) || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0) || (a.index - b.index));
  strokes.forEach((s, i) => { s.order = i; });
  tileHierarchy(cells, weighted);
  return { mode: "grid", rect, cells, strokes, dropped: best.dropped, tree: best.tree, score: best.score };
}

/**
 * Phones: type never grows going down the stack (the wordmark is the largest;
 * each hook is capped by the text above it; CURRENTLY and body below them).
 * Numbers are exempt: they are numbers, not the reading order of the text.
 */
export function stackTypeSize(c) {
  if (!c.spec) return null;
  if (c.kind === "tile") return TILE.steps[c.spec.step]?.size ?? null;
  if (c.kind === "title" || c.kind === "prose" || c.kind === "quote") return c.spec.size ?? null;
  return null;
}
function monotonicType(cells, weighted) {
  const text = new Map(weighted.map((w) => [w.fill.id, w.fill.text || ""]));
  let cap = Infinity;
  for (const c of cells) {
    const size = stackTypeSize(c);
    if (size == null) continue;
    if (size > cap) {
      if (c.kind === "tile") {
        const i = TILE.steps.findIndex((s) => s.size <= cap);
        c.spec = { ...c.spec, step: i < 0 ? TILE.steps.length - 1 : i };
      } else if (c.kind === "prose" || c.kind === "quote") {
        const f = weighted.find((w) => w.fill.id === c.fillId)?.fill;
        const steps = c.kind === "prose" ? stepsFor(f || { text: text.get(c.fillId) }, true) : QUOTE_STEPS;
        let i = steps.findIndex((s) => s.size <= cap);
        if (i < 0) i = steps.length - 1;
        c.spec = { ...c.spec, size: steps[i].size, lineHeight: steps[i].lineHeight, step: i };
      } else {
        c.spec = { ...c.spec, size: cap };
      }
    }
    cap = stackTypeSize(c);
  }
}

function restack(cells, strokes, weighted, measure, rect) {
  const fills = new Map(weighted.map((w) => [w.fill.id, w.fill]));
  let y = rect.y;
  cells.forEach((c, i) => {
    const f = fills.get(c.fillId);
    if (c.kind === "prose" && c.spec?.size) {
      const innerW = c.w - 2 * PAD.phone;
      const paras = (f.text || "").split(/\n\s*\n/);
      const lines = paras.reduce((n, t) => n + measure.lines(t, { family: "Satoshi", weight: 400, size: c.spec.size }, innerW), 0) + (paras.length - 1) * 0.6;
      const need = Math.ceil(lines * c.spec.lineHeight) + 2 * PAD.phone + kickerH(measure, f.kicker, kickerW(f, innerW)) + (f.status ? STATUS_H : 0) + ctrlReserve(f, measure, c.w, PAD.phone);
      c.h = Math.max(need, MIN_CELL.h);
      c.spec = { ...c.spec, need: Math.ceil(lines * c.spec.lineHeight) };
    }
    if (i > 0) { const s = strokes[i - 1]; if (s) { s.y1 = s.y2 = s.pos = y; } }
    c.y = y;
    y += c.h;
  });
  return y - rect.y;
}

/**
 * Home: the case-study hooks and the CURRENTLY description are ONE size. Start
 * at CURRENTLY's own size; if any tile can't set its hook there (full or
 * short), step both down together until every tile can.
 */
function equalizeHomeType(cells, weighted, measure, phone) {
  const fills = new Map(weighted.map((w) => [w.fill.id, w.fill]));
  const tiles = cells.filter((c) => c.kind === "tile" && c.spec);
  const desc = cells.find((c) => c.kind === "prose" && fills.get(c.fillId)?.id === "home-currently");
  if (desc && !desc.spec) desc.spec = { size: 0, lineHeight: 0, step: 0 };
  if (!tiles.length || !desc) return;
  const P = phone ? PAD.phone : PAD.desktop;
  const steps = proseSteps(fills.get(desc.fillId).text || "");
  // Phones re-lay the stack afterwards, so CURRENTLY can start at its largest step there.
  const start = phone ? 0 : steps.findIndex((s) => s.size <= desc.spec.size);
  for (let i = start; i >= 0 && i < steps.length; i++) {
    const size = steps[i].size;
    // Check the hook at the size it will actually set (CURRENTLY can go below
    // the smallest hook step; the hook then sets at that smallest step).
    const ti0 = TILE.steps.findIndex((s) => s.size === size);
    const ti = ti0 < 0 ? TILE.steps.length - 1 : ti0;
    const res = tiles.map((c) => hookFits(fills.get(c.fillId), c, TILE.steps[ti].size, measure, phone, P));
    if (res.every((r) => r.fits) || i === steps.length - 1) {
      desc.spec = { ...desc.spec, size, lineHeight: steps[i].lineHeight, step: i };
      // A tile whose hook can't fit even here keeps its metric and drops the
      // hook (a cut line is never an option).
      tiles.forEach((c, k) => {
        const r = res[k];
        c.spec = r.fits
          ? { ...c.spec, step: ti, useShort: r.useShort, num: r.num ?? c.spec.num }
          : { ...c.spec, step: ti, useShort: false, noTask: true };
      });
      shareMetric(tiles);
      return;
    }
  }
}

/** One metric size across the case-study tiles: the smallest any of them sets. */
function shareMetric(tiles) {
  const nums = tiles.map((c) => c.spec.num).filter((n) => n > 0);
  const num = nums.length ? Math.min(...nums) : 0;
  for (const c of tiles) c.spec = { ...c.spec, num: c.spec.num > 0 ? num : 0 };
}

/**
 * Case-study tiles share one hook size and one metric size; priority shows in
 * cell area and order only.
 */
function tileHierarchy(cells) {
  // One hook size and one metric size across all case-study tiles: the
  // smallest any tile needs (stepping down always still fits).
  const tiles = cells.filter((c) => c.kind === "tile" && c.spec);
  if (!tiles.length) return;
  // (A tile set without its hook has no say in the hook size.)
  const withHook = tiles.filter((c) => !c.spec.noTask);
  const step = withHook.length ? Math.max(...withHook.map((c) => c.spec.step)) : TILE.steps.length - 1;
  for (const c of tiles) c.spec = { ...c.spec, step };
  shareMetric(tiles);
}

/** 13 grid lines (0..12) in px, rounded so strokes and cell edges coincide. */
function gridLines(origin, size) {
  return Array.from({ length: GRID + 1 }, (_, i) => Math.round(origin + (size * i) / GRID));
}

function makeSolver({ rect, xs, ys, items, sumW, measure, exp, fitCache, bento = null }) {
  const memo = new Map();
  const leafMemo = new Map();
  const stageArea = rect.w * rect.h;

  const leafCost = (it, g) => {
    const key = `${it.fill.id}|${g.join(",")}`;
    if (leafMemo.has(key)) return leafMemo.get(key);
    const w = xs[g[2]] - xs[g[0]];
    const h = ys[g[3]] - ys[g[1]];
    let r;
    if (w < MIN_CELL.w || h < MIN_CELL.h) r = { cost: Infinity };
    else {
      const ctx = { pad: PAD.desktop, measure, expanded: exp.has(it.fill.id), inset: it.inset ? insetSize(it.inset, w, measure) : null, attach: it.attach || null, stage: rect };
      const fk = `${it.fill.id}|${it.inset?.id || ""}|${it.attach?.id || ""}|${w}x${h}`;
      let f = fitCache.get(fk);
      if (!f) { f = fitFill(it.fill, w, h, ctx); fitCache.set(fk, f); }
      const areaShare = (w * h) / stageArea;
      const wShare = it.weight / sumW;
      // Too little room hurts more than too much, and more the heavier the fill.
      const wa = Math.log(areaShare / wShare) ** 2 * (areaShare < wShare ? 1 + 6 * wShare : 1);
      r = { cost: f.cost + wa, fit: f.cost, spec: f.spec };
      if (f.cost >= INFEASIBLE) r.cost = Infinity;
    }
    leafMemo.set(key, r);
    return r;
  };

  const solve = (gx0, gy0, gx1, gy1, i, j, depth) => {
    const key = `${gx0},${gy0},${gx1},${gy1},${i},${j},${depth}`;
    if (memo.has(key)) return memo.get(key);
    let best = null;
    if (j - i === 1) {
      const g = [gx0, gy0, gx1, gy1];
      const r = leafCost(items[i], g);
      if (Number.isFinite(r.cost)) best = { cost: r.cost, tree: { leaf: true, g, item: items[i], spec: r.spec } };
    } else if (depth < MAX_DEPTH) {
      for (const axis of ["v", "h"]) {
        const lo = axis === "v" ? gx0 : gy0;
        const hi = axis === "v" ? gx1 : gy1;
        const lines = axis === "v" ? xs : ys;
        const minPx = axis === "v" ? MIN_CELL.w : MIN_CELL.h;
        for (let k = 2; k <= Math.min(3, j - i); k++) {
          for (const groups of partitions(i, j, k)) {
            for (const cuts of cutPositions(lo, hi, k, lines, minPx)) {
              // Bento: an even split, or a horizontal cut lining up with one on the
              // other side of the frame (one long grid line), reads as a table.
              let cost = 0;
              if (bento) {
                const sizes = [lo, ...cuts, hi].slice(1).map((v, i) => v - [lo, ...cuts][i]);
                if (Math.max(...sizes) - Math.min(...sizes) <= (hi - lo) * 0.12) cost += bento.even;
                if (axis === "h") for (const c of cuts) if (bento.avoidY.has(c)) cost += bento.aligned;
              }
              const kids = [];
              let ok = true;
              const bounds = [lo, ...cuts, hi];
              for (let c = 0; c < k; c++) {
                const r = axis === "v"
                  ? solve(bounds[c], gy0, bounds[c + 1], gy1, groups[c][0], groups[c][1], depth + 1)
                  : solve(gx0, bounds[c], gx1, bounds[c + 1], groups[c][0], groups[c][1], depth + 1);
                if (!r) { ok = false; break; }
                cost += r.cost;
                if (best && cost >= best.cost - EPS) { ok = false; break; }
                kids.push(r.tree);
              }
              if (ok && (!best || cost < best.cost - EPS)) {
                best = { cost, tree: { leaf: false, axis, g: [gx0, gy0, gx1, gy1], cuts, children: kids } };
              }
            }
          }
        }
      }
    }
    memo.set(key, best);
    return best;
  };
  return solve;
}

/** Contiguous partitions of [i, j) into k non-empty runs. */
function partitions(i, j, k) {
  const out = [];
  if (k === 2) for (let a = i + 1; a < j; a++) out.push([[i, a], [a, j]]);
  else for (let a = i + 1; a < j - 1; a++) for (let b = a + 1; b < j; b++) out.push([[i, a], [a, b], [b, j]]);
  return out;
}

/** Interior grid positions for k-1 cuts, every child at least minPx wide. */
function cutPositions(lo, hi, k, lines, minPx) {
  const out = [];
  const okSpan = (a, b) => lines[b] - lines[a] >= minPx;
  if (k === 2) {
    for (let a = lo + 1; a < hi; a++) if (okSpan(lo, a) && okSpan(a, hi)) out.push([a]);
  } else {
    for (let a = lo + 1; a < hi - 1; a++) {
      if (!okSpan(lo, a)) continue;
      for (let b = a + 1; b < hi; b++) if (okSpan(a, b) && okSpan(b, hi)) out.push([a, b]);
    }
  }
  return out;
}

/** KPI inset footprint inside a prose cell (top-right corner). */
export function insetSize(kpiFill, cellW, measure) {
  const w = Math.round(Math.min(240, Math.max(170, cellW * 0.34)));
  if (!measure) return { w, h: 148 };
  // Tall enough for the number plus every line of its label and meta.
  const inner = w - 28;
  const labelH = 8 + measure.lines(kpiFill.label, KPI_LABEL_FONT, inner) * 18;
  const meta = [kpiFill.period, kpiFill.baseline].filter(Boolean).join(" · ");
  const metaH = meta ? 2 + capsH(measure, meta, inner) : 0;
  return { w, h: Math.ceil(28 + 52 * 0.92 + labelH + metaH + 6) };
}

/* ------------------------------------------------- tree -> cells, strokes */

function emit(node, path, depth, env) {
  const { xs, ys, rect } = env;
  const [gx0, gy0, gx1, gy1] = node.g;
  const x = xs[gx0], y = ys[gy0], w = xs[gx1] - x, h = ys[gy1] - y;
  if (node.leaf) {
    const it = node.item;
    let spec = node.spec;
    if (!spec) {
      spec = fitFill(it.fill, w, h, { pad: PAD.desktop, measure: env.measure, expanded: env.exp.has(it.fill.id) }).spec;
    }
    const cell = { id: it.fill.id, fillId: it.fill.id, kind: it.fill.kind, x, y, w, h, spec, path, g: node.g };
    if (it.attach) cell.attach = { fillId: it.attach.id, ...spec.attach };
    if (it.inset) {
      const s = insetSize(it.inset, w, env.measure);
      // Below the kicker (all its lines) or the Proof tag, whichever is taller.
      // Kicker and heading (all lines) both sit above the inset: no text runs under it.
      const kick = kickerH(env.measure, it.fill.kicker, kickerW(it.fill, w - 2 * PAD.desktop)) + headingH(env.measure, it.fill.heading, w - 2 * PAD.desktop);
      const below = Math.max((it.fill.receipts || []).length ? 32 : 0, kick);
      cell.inset = { fillId: it.inset.id, x: w - PAD.desktop - s.w, y: PAD.desktop + below, w: s.w, h: s.h };
    }
    env.cells.push(cell);
    return;
  }
  const bounds = [node.axis === "v" ? gx0 : gy0, ...node.cuts, node.axis === "v" ? gx1 : gy1];
  node.cuts.forEach((c, m) => {
    const id = `${path}${node.axis}${m}`;
    if (node.axis === "v") {
      const px = xs[c];
      // Grow from the end that touches an existing stroke, not the frame.
      const topIsFrame = y === rect.y;
      const botIsFrame = y + h === rect.y + rect.h;
      const origin = topIsFrame && !botIsFrame ? "end" : "start";
      env.strokes.push({ id, axis: "v", path, depth, index: m, origin, x1: px, y1: y, x2: px, y2: y + h, pos: px });
    } else {
      const py = ys[c];
      const leftIsFrame = x === rect.x;
      const rightIsFrame = x + w === rect.x + rect.w;
      const origin = leftIsFrame && !rightIsFrame ? "end" : "start";
      env.strokes.push({ id, axis: "h", path, depth, index: m, origin, x1: x, y1: py, x2: x + w, y2: py, pos: py });
    }
  });
  node.children.forEach((child, c) => emit(child, `${path}${c}`, depth + 1, env));
  void bounds;
}
