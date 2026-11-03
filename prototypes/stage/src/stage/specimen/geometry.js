/**
 * Specimen geometry: where every glyph, metric line, bracket and label of the
 * type drawing sits, for a continuous position along the ladder
 * (p = 2 is step 2 exactly; p = 2.4 is 40% of the way to step 3).
 *
 * Nothing is hardcoded to a font: every vertical metric (cap height, x-height,
 * ascent/descent) and every glyph advance comes from canvas measureText at a
 * 100px reference size, scaled linearly. Everything returned is in screen px
 * inside the drawing area.
 *
 * Two layouts share one core:
 *   scale: a close-up camera on one line of type that grows (or shrinks) step
 *          to step; the camera zooms only partly, so the growth stays visible.
 *   fit:   the stage's own rule. A cell shrinks; the line steps DOWN the
 *          ladder to the largest size that still fits inside its padding.
 */

export const FAMILIES = { display: "CabinetGrotesk", body: "Satoshi" };
const FALLBACK = '"Helvetica Neue", Arial, sans-serif';
const REF = 100;

/** Annotation labels: the stage's 12px small text. */
export const LABEL_PX = 12;
const LABEL_FONT = `400 ${LABEL_PX}px Satoshi, ${FALLBACK}`;

export const familyOf = (font) => FAMILIES[font] || font || FAMILIES.body;

/**
 * The fill's steps with every default resolved, in PLAY order:
 * direction "up" sorts small to large, "down" large to small; omitted keeps
 * data order (fit mode always plays largest first: that is how the engine looks).
 */
export function resolveSteps(fill) {
  const spacing = Array.isArray(fill.spacing) ? fill.spacing : [];
  let steps = (fill.scale || []).map((s, i) => {
    const family = familyOf(s.font || fill.font);
    const upper = !!s.upper;
    const raw = fill.sample || "Spacing";
    const gap = spacing.length ? spacing[Math.min(i, spacing.length - 1)] : null;
    return {
      role: s.role, size: s.size, lineHeight: s.lineHeight, tracking: s.tracking || 0,
      weight: s.weight || 400, family, upper,
      text: upper ? raw.toUpperCase() : raw,
      gap: gap && fill.mode !== "fit" ? { name: gap.name, value: gap.value } : null,
    };
  });
  const dir = fill.mode === "fit" ? "down" : fill.direction;
  if (dir === "up") steps = [...steps].sort((a, b) => a.size - b.size);
  if (dir === "down") steps = [...steps].sort((a, b) => b.size - a.size);
  return steps;
}

// ------------------------------------------------------------ measuring
let ctx = null;
const cache = new Map();
const getCtx = () => {
  if (!ctx && typeof document !== "undefined") ctx = document.createElement("canvas").getContext("2d");
  return ctx;
};
/** Drop measurements taken against a fallback face (call after fonts load). */
export const clearMetrics = () => cache.clear();

/** Glyph advances (kerning-aware, via prefix widths) and vertical metrics at 100px. */
export function metricsFor(step) {
  const key = `${step.weight}|${step.family}|${step.text}`;
  let m = cache.get(key);
  if (m) return m;
  const c = getCtx();
  const chars = Array.from(step.text);
  if (!c) {
    // No canvas (tests / SSR): a proportional guess, never used for paint.
    m = { chars, adv: chars.map((_, i) => i * 55).concat(chars.length * 55), capH: 70, xH: 50, asc: 95, desc: 25, inkDesc: 20 };
    cache.set(key, m);
    return m;
  }
  c.font = `${step.weight} ${REF}px "${step.family}", ${FALLBACK}`;
  const adv = [0];
  let acc = "";
  for (const ch of chars) { acc += ch; adv.push(c.measureText(acc).width); }
  const H = c.measureText("H"), x = c.measureText("x"), g = c.measureText("gpy");
  m = {
    chars, adv,
    capH: H.actualBoundingBoxAscent,
    xH: x.actualBoundingBoxAscent,
    asc: H.fontBoundingBoxAscent ?? H.actualBoundingBoxAscent * 1.3,
    desc: H.fontBoundingBoxDescent ?? g.actualBoundingBoxDescent,
    inkDesc: g.actualBoundingBoxDescent,
  };
  cache.set(key, m);
  return m;
}

export const labelW = (t) => {
  const c = getCtx();
  if (!c) return t.length * 7;
  c.font = LABEL_FONT;
  return c.measureText(t).width;
};

// ------------------------------------------------------------ formatting
const num = (v) => (Math.round(v * 10) / 10).toString();
const num2 = (v) => (Math.round(v * 100) / 100).toString();
export const fmtTracking = (em) => (Math.abs(em) < 0.0005 ? "0 em" : `${em > 0 ? "+" : "−"}${num2(Math.abs(em))}em`);
export const fmtSizeLH = (s) => `${num(s.size)} / ${num(s.lineHeight)}`;
export const fmtGap = (g) => (g ? `${g.name} ${num(g.value)}` : "");
/** Words a screen reader gets for one step. */
export const describeStep = (s) =>
  `${s.role}: ${num(s.size)} pixel type on a ${num(s.lineHeight)} pixel line, tracking ${fmtTracking(s.tracking).replace("−", "minus ")}, weight ${s.weight}, ${s.family}` +
  (s.gap ? `; ${s.gap.name} ${num(s.gap.value)} pixels to the next block` : "");

// ------------------------------------------------------------ helpers
const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

/** Fixed (unscaled) allowances around the drawing, px. */
export const A = { bracket: 14, labelGap: 6, ext: 12, rulerGap: 9, rulerLabel: 18, block: 26, edge: 6, dim: 26 };

/** Width of one line of a step at size 1 zoom (design px), and its tight-leading overshoot. */
export function stepWidth(step) {
  const m = metricsFor(step);
  const n = m.chars.length;
  return (m.adv[n] / REF) * step.size + Math.max(0, n - 1) * step.tracking * step.size;
}
function overshoot(step) {
  const m = metricsFor(step);
  const content = ((m.asc + m.desc) / REF) * step.size;
  const half = (step.lineHeight - content) / 2;
  return Math.max(0, (m.capH / REF) * step.size - (half + (m.asc / REF) * step.size));
}

/** Repel labels vertically so none overlap, inside [lo, hi]. */
function repel(items, minGap, lo, hi) {
  items.sort((a, b) => a.anchor - b.anchor);
  items.forEach((it) => { it.y = it.anchor; });
  for (let i = 1; i < items.length; i++) items[i].y = Math.max(items[i].y, items[i - 1].y + minGap);
  const over = items.length ? items[items.length - 1].y - hi : 0;
  if (over > 0) items.forEach((it) => { it.y -= over; });
  for (let i = 0; i < items.length; i++) items[i].y = Math.max(items[i].y, i ? items[i - 1].y + minGap : lo);
  return items;
}

/** Margins the label columns need, px (unscaled). */
/** Narrow boxes set the line-height label vertically along its bracket and shorten "x-height". */
export const NARROW = 520;
function sideMargins(steps, narrow) {
  const left = narrow
    ? A.bracket + LABEL_PX + A.edge
    : Math.max(...steps.map((s) => labelW(fmtSizeLH(s)))) + A.bracket + A.labelGap + A.edge;
  const right = Math.max(labelW(narrow ? "base" : "x-height"), ...steps.map((s) => labelW(fmtGap(s.gap)))) + A.ext + A.labelGap + A.edge;
  return { left, right };
}

// ------------------------------------------------------------ core
/**
 * The line of type at type-position tp, zoom k, with its left edge at textL
 * and line box top at lineTop (either may be a function of the measured
 * line, for centring). Returns glyphs, metric lines, line-height bracket,
 * tracking ruler. Callers add the layout-specific parts.
 */
function typeLine(steps, tp, k, place) {
  const n = steps.length;
  const i = clamp(Math.floor(tp), 0, n - 1);
  const j = Math.min(i + 1, n - 1);
  const t = clamp(tp - i, 0, 1);
  const a = steps[i], b = steps[j];
  const ma = metricsFor(a), mb = metricsFor(b);

  const S = lerp(a.size, b.size, t);
  const LH = lerp(a.lineHeight, b.lineHeight, t);
  const TR = lerp(a.tracking, b.tracking, t);
  const px = S * k;
  const u = px / REF;

  // Glyph positions for both faces at the interpolated size; faces crossfade mid-way.
  const mix = i === j ? 0 : smooth(0.3, 0.7, t);
  const pos = (m) => m.adv.map((x, c) => x * u + c * TR * px);
  const xa = pos(ma), xb = pos(mb);
  const nc = ma.chars.length;
  const xs = xa.map((x, c) => lerp(x, xb[Math.min(c, xb.length - 1)], mix));
  const textW = xs[nc] - (nc ? TR * px : 0);

  const capH = lerp(ma.capH, mb.capH, mix) * u;
  const xH = lerp(ma.xH, mb.xH, mix) * u;
  const asc = lerp(ma.asc, mb.asc, mix) * u;
  const desc = lerp(ma.desc, mb.desc, mix) * u;
  const inkDesc = lerp(ma.inkDesc, mb.inkDesc, mix) * u;
  const lineH = LH * k;
  const half = (lineH - (asc + desc)) / 2; // CSS half-leading
  const over = Math.max(0, capH - (half + asc));

  const { textL, lineTop } = place({ textW, lineH, over });
  const lineBottom = lineTop + lineH;
  const baseY = lineTop + half + asc;
  const capY = baseY - capH;
  const xY = baseY - xH;
  const rulerY = Math.min(lineTop, capY) - A.rulerGap;
  const textR = textL + textW;

  return {
    i, j, t, mix, k, px, S, LH, TR, a, b,
    fonts: [
      { key: "a", family: a.family, weight: a.weight, chars: ma.chars, xs, opacity: 1 - mix },
      { key: "b", family: b.family, weight: b.weight, chars: mb.chars, xs, opacity: mix },
    ],
    textL, textR, textW, lineTop, lineBottom, lineH, over, baseY, capY, xY, descY: baseY + inkDesc,
    rulerY, ticks: xs.slice(0, nc + 1).map((x) => textL + x),
    trackW: xs[nc],
    lh: { x: textL - A.bracket, top: lineTop, bottom: lineBottom, label: fmtSizeLH({ size: S, lineHeight: LH }) },
    tracking: { label: fmtTracking(TR), x: textL + xs[nc], y: rulerY - 6 },
  };
}

// ------------------------------------------------------------ scale layout
/**
 * Per-step zoom for the close-up. Small steps are magnified, but only partly
 * (exponent GAMMA < 1): the type still visibly GROWS step to step, and the
 * largest step just fits the box.
 */
const GAMMA = 0.45;
export function scaleZooms(steps, area) {
  const narrow = area.w < NARROW;
  const m = sideMargins(steps, narrow);
  const fixedH = A.rulerGap + A.rulerLabel + (steps.some((s) => s.gap) ? A.block : 0) + 2 * A.edge;
  const kFit = steps.map((s) => {
    const h = s.lineHeight + overshoot(s) + (s.gap ? s.gap.value : 0);
    return Math.max(0.05, Math.min((area.w - m.left - m.right) / stepWidth(s), (area.h - fixedH) / h));
  });
  const sMax = Math.max(...steps.map((s) => s.size));
  const want = (i) => Math.pow(sMax / steps[i].size, GAMMA);
  const kStar = Math.min(...kFit.map((k, i) => k / want(i)));
  return { k: steps.map((_, i) => Math.min(kFit[i], kStar * want(i), 8)), m, narrow };
}

export function scaleDrawing(steps, p, area, z) {
  const n = steps.length;
  const i = clamp(Math.floor(p), 0, n - 1), j = Math.min(i + 1, n - 1), t = clamp(p - i, 0, 1);
  const k = Math.exp(lerp(Math.log(z.k[i]), Math.log(z.k[j]), t));
  const ga = steps[i].gap, gb = steps[j].gap;
  const GAP = ga || gb ? lerp(ga?.value ?? 0, gb?.value ?? 0, t) : null;
  const gapH = GAP == null ? 0 : GAP * k;
  let blockH = 0;

  const L = typeLine(steps, p, k, ({ textW, lineH, over }) => {
    blockH = GAP == null ? 0 : clamp(lineH * 0.42, 6, 20);
    const stackH = A.rulerLabel + A.rulerGap + over + lineH + gapH + blockH;
    const top = Math.max(A.edge, (area.h - stackH) / 2);
    return {
      textL: clamp((area.w - textW) / 2, z.m.left, Math.max(z.m.left, area.w - z.m.right - textW)),
      lineTop: top + A.rulerLabel + A.rulerGap + over,
    };
  });

  const lineL = L.textL - A.ext, lineR = L.textR + A.ext;
  const blockTop = L.lineBottom + gapH;
  const block = GAP == null ? null : { x: L.textL, y: blockTop, w: Math.max(8, L.textW * 0.72), h: blockH };
  const gapName = (t < 0.5 ? ga : gb)?.name ?? "gap";

  const rx = lineR + A.labelGap;
  const right = metricLabels(L, area, rx, z.narrow);
  if (GAP != null) right.push({ id: "gap", text: fmtGap({ name: gapName, value: GAP }), anchor: L.lineBottom + gapH / 2, lineY: null });
  repel(right, LABEL_PX + 2, LABEL_PX, area.h - 4);

  return {
    ...L, mode: "scale", narrow: z.narrow, lineL, lineR, rx, right, block, blockTop,
    gapBracket: GAP == null ? null : { x: lineR, top: L.lineBottom, bottom: blockTop },
    box: null,
  };
}

function metricLabels(L, area, rx, narrow) {
  const right = [
    { id: "cap", text: "cap", anchor: L.capY, lineY: L.capY },
    { id: "x", text: "x-height", anchor: L.xY, lineY: L.xY },
    { id: "base", text: "base", anchor: L.baseY, lineY: L.baseY },
  ];
  if (narrow || area.w - rx < labelW("x-height") + A.edge) right[1].text = "x";
  return right;
}

// ------------------------------------------------------------ fit layout
/**
 * The stage's fit rule, drawn. `p` runs 0..n-1 along the CELL WIDTH: at an
 * integer i the cell is exactly wide enough for step i plus its padding; in
 * between it shrinks linearly. The type shown is the largest step that fits
 * (fitStep), and it tweens there separately (tp), so the drawing reads:
 * the cell closes in, touches the text, the text steps down.
 */
export function fitWidths(steps, pad) {
  return steps.map((s) => stepWidth(s) + 2 * pad);
}
export function cellWidthAt(widths, p) {
  const n = widths.length;
  const i = clamp(Math.floor(p), 0, n - 1), j = Math.min(i + 1, n - 1);
  return lerp(widths[i], widths[j], clamp(p - i, 0, 1));
}
/** Largest step (lowest index, steps are sorted large to small) whose width fits the cell. */
export function fitStep(widths, cellW) {
  for (let i = 0; i < widths.length; i++) if (widths[i] <= cellW + 0.01) return i;
  return widths.length - 1;
}

export function fitZoom(steps, area, pad) {
  const narrow = area.w < NARROW;
  const m = sideMargins(steps, narrow);
  const widths = fitWidths(steps, pad);
  const h0 = Math.max(...steps.map((s) => s.lineHeight + overshoot(s))) + 2 * pad;
  const k = Math.min((area.w - m.left - m.right) / widths[0], (area.h - A.dim - 2 * A.edge) / h0, 4);
  return { k: Math.max(0.05, k), m, narrow, widths };
}

export function fitDrawing(steps, p, tp, area, z, pad) {
  const k = z.k;
  const cellW = cellWidthAt(z.widths, p);
  const boxW = cellW * k;
  const padPx = pad * k;
  const boxL = clamp((area.w - boxW) / 2, z.m.left, Math.max(z.m.left, area.w - z.m.right - boxW));
  let boxTop = 0, boxH = 0;

  const L = typeLine(steps, tp, k, ({ lineH, over }) => {
    boxH = lineH + over + 2 * padPx;
    boxTop = Math.max(A.edge, (area.h - boxH - A.dim) / 2);
    return { textL: boxL + padPx, lineTop: boxTop + padPx + over };
  });

  const boxR = boxL + boxW;
  const lineL = boxL, lineR = boxR;
  const rx = boxR + A.labelGap;
  const right = metricLabels(L, area, rx, z.narrow);
  repel(right, LABEL_PX + 2, LABEL_PX, area.h - 4);
  // Tight: the text has reached the cell's inner edge (within half a design px).
  const slack = cellW - 2 * pad - L.textW / k;
  return {
    ...L, mode: "fit", narrow: z.narrow, lineL, lineR, rx, right, block: null, gapBracket: null,
    lh: { ...L.lh, x: boxL - A.bracket },
    box: {
      x: boxL, y: boxTop, w: boxW, h: boxH, pad: padPx, cellW, slack,
      dimY: boxTop + boxH + 12, label: `cell ${Math.round(cellW)}`, padLabel: `pad ${num(pad)}`,
    },
  };
}
