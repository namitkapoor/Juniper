/**
 * Morph planning: old layout -> new layout as a timeline of stroke and cell
 * animations. Pure functions; Stage.jsx samples them every frame.
 *
 *  removed strokes retract toward their origin            0   -> 280ms
 *  outgoing cells fade (their text still re-wraps around   0   -> 560ms
 *    strokes drawing through them)
 *  surviving strokes slide, surviving cells resize        120 -> 640ms
 *  new strokes draw in from their origin, in tree order   180 + 90*i, 440ms each
 *  new cells settle once the strokes around them land     (after their last ancestor cut)
 */
import { diffStrokes } from "../engine/diff.js";

// Crisp, like the pixel Lottie: short segments, fast-out easing, no long soft tails.
// Smooth, not snappy: ~400-500ms per morph with a symmetric ease-in-out
// (cubic-bezier(0.65, 0, 0.35, 1)), strokes gently staggered. Small UI swaps stay stepped in CSS.
export const BASE = { retract: 300, slideAt: 40, slide: 460, drawAt: 80, stagger: 70, draw: 380, out: 300, in: 280 };

const easeOut = (p) => cubicBezier(0.65, 0, 0.35, 1, p);
const easeInOut = (p) => cubicBezier(0.65, 0, 0.35, 1, p);
/** CSS cubic-bezier(x1, y1, x2, y2) at progress p (solve x for t, return y). */
function cubicBezier(x1, y1, x2, y2, p) {
  const bx = (t) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  let lo = 0, hi = 1, t = p;
  for (let i = 0; i < 18; i++) { t = (lo + hi) / 2; if (bx(t) < p) lo = t; else hi = t; }
  return by(t);
}
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const lerp = (a, b, p) => a + (b - a) * p;

/**
 * @param prev  the previous layout, or a snapshot() of the frame on screen
 *              when a morph is interrupted (so it continues from there)
 * @param opts.quick  shorter timings (hover-driven tile expansion)
 */
/**
 * First-load build, on the timings of Namit's site hero
 * (Juniper src/contexts/HeroAnimationContext.jsx DEFAULT_HERO_CONTROLS):
 *   frame strokes   left 0.35s+0.7s, right 0.7s+0.8s, top/bottom 0s+1.6s (heroName*)
 *   cuts            from 0.8s (taglineDelay), 0.2s apart (taglineWordStagger), 0.6s each
 *   cells fill      once the cuts around them land; the wordmark reveals
 *                   letter by letter (0.2s stagger) as the frame draws
 *   the face        0.3s after the last cell (lottieDelayAfterTagline), 0.35s fade
 */
export const HERO = {
  // His timings, tightened (x~0.5) for a crisper build.
  frameLeft: [180, 380], frameRight: [360, 420], frameTop: [0, 800], frameBottom: [0, 800],
  cutsAt: 420, cutStagger: 110, cutDur: 260, cellIn: 160, faceAfter: 160, faceFade: 180,
};

function planIntro(next) {
  const { w, h } = next.rect;
  const strokes = new Map();
  const frame = [
    { id: "frame-l", axis: "v", x1: 0, y1: 0, x2: 0, y2: h, origin: "start", t: HERO.frameLeft },
    { id: "frame-r", axis: "v", x1: w - 1, y1: 0, x2: w - 1, y2: h, origin: "start", t: HERO.frameRight },
    { id: "frame-t", axis: "h", x1: 0, y1: 0, x2: w, y2: 0, origin: "start", t: HERO.frameTop },
    { id: "frame-b", axis: "h", x1: 0, y1: h - 1, x2: w, y2: h - 1, origin: "start", t: HERO.frameBottom },
  ];
  for (const f of frame) strokes.set(f.id, { kind: "added", to: f, start: f.t[0], dur: f.t[1] });
  const endOf = new Map();
  [...next.strokes].sort((a, b) => a.order - b.order).forEach((s, i) => {
    const start = HERO.cutsAt + i * HERO.cutStagger;
    strokes.set(s.id, { kind: "added", to: s, start, dur: HERO.cutDur });
    endOf.set(s.id, start + HERO.cutDur);
  });
  const cells = new Map();
  let lastIn = 0;
  for (const c of next.cells) {
    if (c.kind === "face") continue;
    // The wordmark arrives with the frame; everything else when its cuts land.
    let at = c.kind === "title" ? 200 : HERO.cutsAt;
    if (c.kind !== "title") for (const s of next.strokes) if (c.path.startsWith(s.path)) at = Math.max(at, (endOf.get(s.id) ?? 0) - 120);
    cells.set(c.fillId, { kind: "in", to: c, start: at, dur: HERO.cellIn, cell: c });
    lastIn = Math.max(lastIn, at + HERO.cellIn);
  }
  for (const c of next.cells) {
    if (c.kind !== "face") continue;
    cells.set(c.fillId, { kind: "in", to: c, start: lastIn + HERO.faceAfter, dur: HERO.faceFade, cell: c });
    lastIn = lastIn + HERO.faceAfter + HERO.faceFade;
  }
  let end = lastIn;
  for (const a of strokes.values()) end = Math.max(end, a.start + a.dur);
  return { strokes, cells, end, intro: true, sceneStrokes: [...next.strokes, ...frame], sceneCells: next.cells };
}

export function planMorph(prev, next, reduced, opts = {}) {
  if (!prev && opts.intro && !reduced) return planIntro(next);
  const k = opts.quick ? 0.7 : 1;
  const T = Object.fromEntries(Object.entries(BASE).map(([key, v]) => [key, Math.round(v * k)]));
  // Continuing an interrupted morph: no pause before things start moving.
  if (opts.interrupted) { T.slideAt = 0; T.drawAt = Math.round(T.drawAt * 0.4); }
  const strokes = new Map();
  const cells = new Map();
  if (!prev || reduced) {
    for (const s of next.strokes) strokes.set(s.id, { kind: "static", to: s });
    for (const c of next.cells) cells.set(c.fillId, { kind: "static", to: c, cell: c });
    return { strokes, cells, end: 0, sceneStrokes: next.strokes, sceneCells: next.cells };
  }
  const d = diffStrokes(prev.strokes, next.strokes);
  const endOf = new Map();
  for (const s of d.removed) strokes.set(s.id, { kind: "removed", from: s, start: 0, dur: T.retract });
  for (const { from, to } of d.kept) {
    const same = from.x1 === to.x1 && from.y1 === to.y1 && from.x2 === to.x2 && from.y2 === to.y2;
    strokes.set(to.id, same ? { kind: "static", to } : { kind: "kept", from, to, start: T.slideAt, dur: T.slide });
    endOf.set(to.id, same ? 0 : T.slideAt + T.slide);
  }
  const added = [...d.added].sort((a, b) => a.order - b.order);
  added.forEach((s, i) => {
    const start = T.drawAt + i * T.stagger;
    strokes.set(s.id, { kind: "added", to: s, start, dur: T.draw });
    endOf.set(s.id, start + T.draw);
  });

  // Cells mid-fade in an interrupted morph keep their opacity.
  const prevCells = new Map([...(prev.outs || []), ...prev.cells].map((c) => [c.fillId, c]));
  let end = T.out;
  for (const c of next.cells) {
    const o = prevCells.get(c.fillId);
    if (o) {
      cells.set(c.fillId, { kind: "kept", from: o, to: c, start: T.slideAt, dur: T.slide, cell: c, startOpacity: o.opacity ?? 1 });
      prevCells.delete(c.fillId);
      end = Math.max(end, T.slideAt + T.slide);
    } else {
      // Arrive once the cuts that bound this cell have landed.
      let at = Math.round(160 * k);
      for (const s of next.strokes) if (c.path.startsWith(s.path)) at = Math.max(at, (endOf.get(s.id) ?? 0) - Math.round(140 * k));
      cells.set(c.fillId, { kind: "in", to: c, start: at, dur: T.in, cell: c });
      end = Math.max(end, at + T.in);
    }
  }
  for (const o of prevCells.values()) cells.set(o.fillId, { kind: "out", from: o, start: 0, dur: T.out, cell: o, startOpacity: o.opacity ?? 1 });
  for (const s of strokes.values()) if (s.kind !== "static") end = Math.max(end, s.start + s.dur);

  return {
    strokes, cells, end,
    sceneStrokes: [...next.strokes, ...d.removed],
    sceneCells: [...next.cells, ...prevCells.values()],
  };
}

/** Current segment of a stroke at time t (ms since morph start). */
export function strokeAt(a, t) {
  if (a.kind === "static") return { ...pick(a.to), moving: false, alpha: 1 };
  const p = clamp01((t - a.start) / a.dur);
  if (a.kind === "kept") {
    const e = easeInOut(p);
    return {
      axis: a.to.axis, moving: p < 1, alpha: 1,
      x1: lerp(a.from.x1, a.to.x1, e), y1: lerp(a.from.y1, a.to.y1, e),
      x2: lerp(a.from.x2, a.to.x2, e), y2: lerp(a.from.y2, a.to.y2, e),
    };
  }
  const s = a.kind === "added" ? a.to : a.from;
  const q = a.kind === "added" ? easeOut(p) : 1 - easeInOut(p);
  const fromStart = s.origin !== "end";
  const ox = fromStart ? s.x1 : s.x2, oy = fromStart ? s.y1 : s.y2;
  const tx = fromStart ? s.x2 : s.x1, ty = fromStart ? s.y2 : s.y1;
  return {
    axis: s.axis, moving: a.kind === "added" ? p < 1 : p < 1, alpha: a.kind === "removed" ? 1 - p * 0.3 : 1,
    head: q > 0 && q < 1,
    x1: ox, y1: oy, x2: lerp(ox, tx, q), y2: lerp(oy, ty, q),
  };
}

const pick = (s) => ({ axis: s.axis, x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 });

/** Current rect + opacity of a cell at time t. */
export function cellAt(a, t) {
  if (a.kind === "static") return { x: a.to.x, y: a.to.y, w: a.to.w, h: a.to.h, opacity: 1, dy: 0, moving: false };
  const p = clamp01((t - a.start) / a.dur);
  if (a.kind === "kept") {
    const e = easeInOut(p);
    return {
      x: lerp(a.from.x, a.to.x, e), y: lerp(a.from.y, a.to.y, e),
      w: lerp(a.from.w, a.to.w, e), h: lerp(a.from.h, a.to.h, e), opacity: lerp(a.startOpacity ?? 1, 1, e), dy: 0, moving: p < 1,
    };
  }
  if (a.kind === "in") {
    const e = easeOut(p);
    return { x: a.to.x, y: a.to.y, w: a.to.w, h: a.to.h, opacity: e, dy: (1 - e) * 10, moving: p < 1 };
  }
  const e = easeOut(p);
  return { x: a.from.x, y: a.from.y, w: a.from.w, h: a.from.h, opacity: (a.startOpacity ?? 1) * (1 - e), dy: 0, moving: p < 1 };
}

/**
 * The frame on screen, as a layout: what an interrupted morph continues
 * from (strokes at their current partial geometry, cells at their current
 * rects and opacities), instead of jumping to the previous target first.
 */
export function snapshot(plan, t) {
  const strokes = [];
  for (const a of plan.strokes.values()) {
    const g = strokeAt(a, t);
    if (Math.hypot(g.x2 - g.x1, g.y2 - g.y1) < 1) continue;
    const s = a.to || a.from;
    const x1 = Math.min(g.x1, g.x2), x2 = Math.max(g.x1, g.x2), y1 = Math.min(g.y1, g.y2), y2 = Math.max(g.y1, g.y2);
    strokes.push({ ...s, x1, y1, x2, y2, pos: s.axis === "v" ? x1 : y1 });
  }
  const cells = [], outs = [];
  for (const a of plan.cells.values()) {
    const g = cellAt(a, t);
    const c = { ...a.cell, x: g.x, y: g.y + g.dy, w: g.w, h: g.h, opacity: g.opacity };
    if (a.kind === "out") { if (g.opacity > 0.02) outs.push(c); } else cells.push(c);
  }
  return { strokes, cells, outs };
}
