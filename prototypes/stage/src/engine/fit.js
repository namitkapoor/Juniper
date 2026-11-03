/**
 * How well one fill sits in one cell. Returns { cost, spec }:
 *  - cost: 0 is a perfect fit; >= INFEASIBLE means "this cell cannot hold it"
 *  - spec: the sizing decisions the renderer must reuse (font step, media box,
 *          rows shown, ...) so painting matches what was scored.
 *
 * `measure` is injected: { lines(text, fontSpec, width), width(text, fontSpec) }.
 * In the browser it is backed by Pretext; in tests by a deterministic fake.
 */
import {
  PROSE_STEPS, proseSteps, stepsFor, PROSE_FONT, paragraphs, PARA_GAP, QUOTE_STEPS, QUOTE_FONT, QUOTE_WHO_H,
  TITLE_FONT, titleLineHeight, titleFontFor, titleLHFor, isWordmark, KICKER_H, headingH, KPI_FONT, KPI_LABEL_H, KPI_META_H, KPI_LABEL_FONT, CAPS_FONT, capsH, quoteWhoH, COMMIT_MSG_FONT,
  COMMITS, RECEIPTS, MEDIA, DRILL_H, CTRL, WORDS, CAPTION_FONT, CAPTION_FONT_PHONE, CAPTION_PHONE, LABEL, font, LOGOS, BREAKDOWN, TILE, TILE_FONT, TILE_ROLE_FONT, TIMELINE, WORKLOG, STACK, OFFCLOCK, tileRoleH, hookTarget, metricMax,
} from "./typo.js";

export const INFEASIBLE = 50;
/** A status line under a prose block ("• OPEN TO … ROLES" + a quiet link). */
export const STATUS_H = 64;
/** A kicker shares its first row with the Proof tag, so it wraps in the width left of it. */
// The kicker has the full width: Proof no longer sits on its row (controls are one group at the bottom).
export const kickerW = (fill, innerW) => innerW;
/** Kicker block: all its lines (tracked caps) plus the gap under it. */
export const kickerH = (measure, kicker, innerW) => (kicker ? Math.max(KICKER_H, capsH(measure, kicker, innerW) + 14) : 0);
const BODY_FAMILY = "Satoshi";
export const tileNumLabelH = (lines) => 4 + lines * TILE.labelLH;

/**
 * Proof only where it's real: a fill shows its Proof list when a receipt is a
 * commit, has a url or a preview, is an evidence record, or when there are 2+
 * distinct sources. A lone pointer at the case-study data file is not proof.
 */
export function hasRealProof(fill) {
  const rs = fill.kind === "commits" ? [] : fill.receipts || [];
  if (!rs.length) return false;
  const caseFile = (r) => !r.url && !r.preview && (/^src\/data\/.*Data\.js$/.test(r.ref || "") || /case study$/i.test(r.label || ""));
  const real = rs.filter((r) => !caseFile(r));
  if (!real.length) return false;
  if (real.some((r) => r.type === "commit" || r.url || r.preview || r.type === "record")) return true;
  return new Set(real.map((r) => r.ref)).size >= 2;
}
export const receiptsOf = (fill) => (hasRealProof(fill) ? fill.receipts : []);

/* ---- the control group: [GO DEEPER →] [PROOF] [↗] -------------------------- */
const ctrlTextW = (measure, t) => Math.ceil(measure?.width ? measure.width(t.toUpperCase(), CAPS_FONT) : t.length * 9.5);
/** The group's items with their widths, in order. `exp`: the media/specimen expand square. */
export function ctrlItems(fill, measure, { drill = !!fill.opens, exp = false } = {}) {
  const items = [];
  if (drill) items.push({ k: "drill", w: 2 * CTRL.padX + ctrlTextW(measure, CTRL.drillText) + 4 });
  const rs = receiptsOf(fill);
  if (rs.length) {
    const icons = Math.min(3, new Set(rs.map((r) => r.type)).size);
    const text = Math.max(ctrlTextW(measure, WORDS.proof), ctrlTextW(measure, WORDS.proofClose));
    items.push({ k: "proof", w: 2 * CTRL.padX + icons * (CTRL.icon + CTRL.iconGap) + text + 4 });
  }
  if (exp) items.push({ k: "exp", w: CTRL.expW });
  return items;
}
/** Rows for the group within availW: one row if it fits, else it wraps (greedy, in order). */
export function ctrlRows(items, availW) {
  if (!items.length) return { rows: [], w: 0, h: 0 };
  const rows = [[]]; let rw = 0;
  for (const it of items) {
    const add = (rows.at(-1).length ? CTRL.gap : 0) + it.w;
    if (rows.at(-1).length && rw + add > availW) { rows.push([it]); rw = it.w; } else { rows.at(-1).push(it); rw += add; }
  }
  const w = Math.max(...rows.map((r) => r.reduce((a, it, i) => a + it.w + (i ? CTRL.gap : 0), 0)));
  return { rows, w, h: rows.length * CTRL.h + (rows.length - 1) * CTRL.gap };
}
export const ctrlFullW = (items) => items.reduce((a, it, i) => a + it.w + (i ? CTRL.gap : 0), 0);
/**
 * Height a bottom-anchored group takes from a cell's content box (below the pad):
 * the group sits CTRL.inset from the bottom, with CTRL.above clear space over it.
 */
export function ctrlReserve(fill, measure, w, P, opts) {
  const g = ctrlRows(ctrlItems(fill, measure, opts), w - 2 * CTRL.inset);
  return g.h ? Math.max(0, g.h + CTRL.inset + CTRL.above - P) : 0;
}

/* ---- the Proof list: every row measured, nothing ellipsized ---------------- */

const ROW_FONT = font("Satoshi", 400, 12.5);
const ROW_LH = 17;
const CARD_TITLE_FONT = font("Satoshi", 400, 14);
const CARD_META_FONT = font("Satoshi", 400, 12);
const DATE_W = 84;
const LIST_PAD = 24; // the list's side padding (the cell pad)

/** Commit message from a receipt label like "a572b5e · Seat the train". */
export const commitTitle = (r) => (r.label || "").replace(new RegExp(`^${r.ref}\\s*·\\s*`), "") || r.ref;
export const receiptText = (r) => `${r.label || r.ref}${r.label && r.ref !== r.label && r.type !== "asset" ? ` ${r.ref}` : ""}`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-07-16" -> "Jul 16, 2026"; "2026-04" -> "Apr 2026"; "Present" -> "now". */
export function fmtDate(d) {
  if (!d) return "";
  if (/^present$/i.test(d)) return "now";
  const m = d.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return d;
  return m[3] ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : `${MONTHS[+m[2] - 1]} ${m[1]}`;
}
export const commitMetaText = (r) => `${r.ref.slice(0, 7)} · Namit Kapoor${r.date ? ` · ${fmtDate(r.date)}` : ""}`;
export const commitFootText = (r) => `${r.repo || ""}  ${r.url ? "View on GitHub" : "PRIVATE REPO"}`;

/** Each block of a commit card, measured: title, meta, foot. */
export function commitCardParts(measure, r, innerW) {
  const w = innerW - 22;
  return {
    title: measure.lines(commitTitle(r), CARD_TITLE_FONT, w) * 20,
    meta: measure.lines(commitMetaText(r), CARD_META_FONT, w) * 16,
    foot: measure.lines(commitFootText(r), CARD_META_FONT, w) * 16,
  };
}
/** A receipt's playable preview: phone narrow and centred, laptop wide. */
export function previewBox(p, innerW) {
  if (!p) return null;
  const w = p.frame === "phone" ? Math.min(150, innerW) : Math.min(innerW - 24, 360);
  return { w: Math.round(w), h: Math.round(w / (p.aspect || 1)) };
}
export function receiptRowH(measure, r, innerW) {
  const pv = previewBox(r.preview, innerW);
  const extra = pv ? pv.h + 10 : 0;
  if (!measure) return (r.type === "commit" ? RECEIPTS.cardH : RECEIPTS.rowH) + extra;
  // title lines, 6px, meta line(s), 4px, repo line; 10px above and below
  if (r.type === "commit") { const p = commitCardParts(measure, r, innerW); return 10 + p.title + 6 + p.meta + 4 + p.foot + 10 + extra; }
  return 10 + measure.lines(receiptText(r), ROW_FONT, innerW - 24 - (r.date ? DATE_W : 0)) * ROW_LH + extra;
}

/** "KivaKube (May 4 to Jul 4)" -> name + period on its own line under it. */
export function splitPeriod(label) {
  const m = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { name: m[1], period: m[2] } : { name: label, period: null };
}
export const BD_COLS = { logo: 44, value: 64, bar: 56, pct: 38, gap: 10 };
export const bdNameW = (innerW) => innerW - BD_COLS.logo - BD_COLS.value - BD_COLS.bar - BD_COLS.pct - 4 * BD_COLS.gap;
export function breakdownRowHs(measure, fill, innerW) {
  return fill.breakdown.slice(0, BREAKDOWN.maxRows).map((b) => {
    const { name, period } = splitPeriod(b.label);
    if (!measure) return BREAKDOWN.rowH + (period ? 15 : 0);
    return Math.max(BREAKDOWN.rowH, 8 + measure.lines(name, BREAKDOWN.nameFont, bdNameW(innerW)) * 16 + (period ? measure.lines(period, BREAKDOWN.legendFont, bdNameW(innerW)) * 15 : 0));
  });
}

/** Height the open Proof list takes at the bottom of a cell (all rows, measured). */
export function receiptsListH(fill, measure, innerW = 320) {
  const list = receiptsOf(fill);
  if (!list.length) return 0;
  // An open KPI also lists its breakdown rows above the sources.
  const bd = fill.kind === "kpi" && fill.breakdown?.length ? breakdownRowsH(fill, measure, innerW) : 0;
  return bd + RECEIPTS.headerH + list.reduce((s, r) => s + receiptRowH(measure, r, innerW), 0) + 8;
}

/** Largest step whose wrapped text fits `availH` at `innerW`, or the smallest (overflowing). */
/** True when the longest word fits the width: we never break inside a word. */
export const wordsFit = (measure, text, f, innerW) => measure.width(longestWord(text), f) <= innerW;

function pickStep(measure, text, steps, mkFont, innerW, availH, extraArea = 0) {
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    // A step whose longest word can't fit the column is not a fit at all: step down.
    if (!wordsFit(measure, text, mkFont(s.size), innerW)) {
      if (i === steps.length - 1) return { step: i, ...s, lines: 99, need: 1e6, fits: false };
      continue;
    }
    const paras = paragraphs(text);
    const lines = paras.reduce((n, t) => n + measure.lines(t, mkFont(s.size), innerW), 0) + (paras.length - 1) * PARA_GAP;
    // An inset obstacle steals roughly its area from the column; charge it as extra lines.
    const stolen = extraArea > 0 ? Math.ceil((extraArea / Math.max(1, innerW)) / s.lineHeight) + 1 : 0;
    const need = (lines + stolen) * s.lineHeight;
    if (need <= availH) return { step: i, ...s, lines, need, fits: true };
    if (i === steps.length - 1) return { step: i, ...s, lines, need, fits: false };
  }
}

/** In focus mode a wide text cell sets its proof beside the text, not under a void. */
export const proofSide = (innerW) => (innerW >= 640 ? { textW: Math.round((innerW - 28) * 0.56), gap: 28 } : null);

function proseLike(fill, w, h, ctx, steps, mkFont, reserveBottom) {
  const P = ctx.pad;
  const outerW = w - 2 * P;
  if (outerW < 120) return { cost: INFEASIBLE + 10 };
  // Focus mode: proof beside the text (wide) or directly under it (narrow).
  const side = ctx.expanded ? proofSide(outerW) : null;
  const innerW = side ? side.textW : outerW;
  const listW = side ? outerW - side.textW - side.gap : outerW;
  const listH = ctx.expanded ? receiptsListH(fill, ctx.measure, listW) : 0;
  const boxH = h - 2 * P - reserveBottom - ctrlReserve(fill, ctx.measure, w, P) - (fill.status ? STATUS_H : 0) - kickerH(ctx.measure, fill.kicker, kickerW(fill, innerW)) - headingH(ctx.measure, fill.heading, innerW);
  if (side && listH > h - 2 * P) return { cost: INFEASIBLE + 4 };
  let availH = side ? boxH : boxH - listH;
  if (availH < 40) return { cost: INFEASIBLE + 10 };
  const hasTag = receiptsOf(fill).length > 0;
  const inset = ctx.inset;
  let insetArea = 0;
  if (inset) {
    // availH is already below the kicker.
    if (inset.w > innerW - 140 || inset.h > availH) return { cost: INFEASIBLE + 5 };
    insetArea = (inset.w + 18) * (inset.h + 42);
  }
  // Every step that fits is a candidate; the cheapest one wins (big type in a
  // narrow column is worse than smaller type at a comfortable measure).
  let best = null;
  const first = pickStep(ctx.measure, fill.text, steps, mkFont, innerW, availH, insetArea);
  for (let i = first.step; i < steps.length; i++) {
    const s = i === first.step ? first : pickStep(ctx.measure, fill.text, steps.slice(i), mkFont, innerW, availH, insetArea);
    const step = i;
    let cost = 0;
    if (!s.fits) cost += INFEASIBLE + 4 * (s.need / availH - 1);
    cost += step * 0.08;
    // Measure: comfortable lines are ~40-85 characters.
    const cpl = innerW / (s.size * 0.5);
    if (cpl > 85) cost += (cpl - 85) / 45;
    if (cpl < 28) cost += (28 - cpl) / 12;
    // A cell mostly empty reads as a mistake; in focus mode it must be nearly full.
    const fillRatio = s.need / availH;
    if (fillRatio < 0.3) cost += (0.3 - fillRatio) * 1.4;
    if (ctx.expanded) {
      const used = side ? Math.max(s.need, listH) / Math.max(1, boxH) : (s.need + listH) / Math.max(1, boxH);
      if (used < 0.85) cost += (0.85 - used) * 4;
    }
    if (!best || cost < best.cost - 1e-9) best = { cost, spec: { size: s.size, lineHeight: s.lineHeight, step, need: s.need, availH, side, listW, listH } };
    if (!s.fits) break;
  }
  return best;
}

function titleFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  let availH = h - 2 * P - ctrlReserve(fill, ctx.measure, w, P) - kickerH(ctx.measure, fill.kicker, kickerW(fill, w - 2 * P));
  if (innerW < 100 || availH < 24) return { cost: INFEASIBLE + 10 };
  const { measure } = ctx;
  const TF = titleFontFor(fill), TLH = titleLHFor(fill);
  const fits = (fs) => measure.lines(fill.text, TF(fs), innerW) * TLH(fs) <= availH
    && measure.width(longestWord(fill.text), TF(fs)) <= innerW;
  let lo = 12, hi = 300;
  if (!fits(lo)) return { cost: INFEASIBLE + 8 };
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (fits(mid)) lo = mid; else hi = mid;
  }
  const fs = lo;
  const chars = fill.text.length;
  const wt = Math.max(0.05, fill.weight);
  // Heavier titles want bigger type; long titles cannot be wordmarks.
  const target = Math.min(18 + 170 * Math.pow(wt, 1.4), 900 / Math.sqrt(chars + 4)) * (isWordmark(fill) ? 1.35 : 1);
  let cost = 0;
  if (fs < 20) cost += 3;
  if (fs < target) cost += 0.9 * Math.log(target / fs);
  else cost += 0.15 * Math.log(fs / target); // a little too big is fine
  // A thin wordmark can (and should) set larger than a heavy title.
  const cap = Math.round(target * (isWordmark(fill) ? 2.2 : 1.6));
  return { cost, spec: { size: Math.min(fs, cap), lineHeight: TLH(Math.min(fs, cap)) } };
}

const longestWord = (t) => t.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");

/** Returns the kpi value font size that fits a box, and the box's needs. */
export function kpiValueSize(measure, fill, innerW, innerH) {
  const value = `${fill.value}${fill.unit || ""}`;
  // Every line of the label and the meta counts: nothing is ever cut.
  const meta = [fill.period, fill.baseline].filter(Boolean).join(" · ");
  const metaH = meta ? 2 + capsH(measure, meta, innerW) : 0;
  const labelLines = measure.lines(fill.label, KPI_LABEL_FONT, innerW);
  const labelH = 8 + labelLines * 18;
  const w100 = measure.width(value, KPI_FONT(100));
  const byW = (innerW / w100) * 100;
  const byH = (innerH - labelH - metaH - 6) / 0.92;
  return { size: Math.floor(Math.min(byW, byH, 132)), labelH, metaH };
}

export const breakdownRowsH = (fill, measure, innerW) => BREAKDOWN.headH + 10 + breakdownRowHs(measure, fill, innerW).reduce((a, b) => a + b, 0) + 6;

/**
 * Logos wrapped greedily into rows at the largest height that fits.
 * Returns { logoH, rows, h } or null.
 */
export function logosLayout(items, innerW, availH, maxH = LOGOS.maxH, labelH = 0) {
  for (let lh = maxH; lh >= LOGOS.minH; lh -= 2) {
    let rows = 1, x = 0;
    let ok = true;
    for (const it of items) {
      const iw = it.aspect * lh;
      if (iw > innerW) { ok = false; break; }
      if (x > 0 && x + LOGOS.gapX + iw > innerW) { rows++; x = iw; } else x += (x > 0 ? LOGOS.gapX : 0) + iw;
    }
    if (!ok) continue;
    const h = labelH + rows * lh + (rows - 1) * LOGOS.gapY;
    if (h <= availH) return { logoH: lh, rows, h };
  }
  return null;
}

function kpiFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  let innerH = h - 2 * P - ctrlReserve(fill, ctx.measure, w, P);
  if (ctx.expanded) innerH -= receiptsListH(fill, ctx.measure, innerW);
  if (innerW < 90 || innerH < 60) return { cost: INFEASIBLE + 10 };
  if (w / h < 0.6) return { cost: INFEASIBLE + 3 }; // a number never sits in a sliver
  let cost = 0;
  const spec = {};
  // Logos attached to this number ("8 merchants live" + who they are) sit under it.
  if (ctx.attach) {
    const L = logosLayout(ctx.attach.items, innerW, innerH * 0.45, LOGOS.attachMaxH);
    if (!L) return { cost: INFEASIBLE + 6 };
    spec.attach = { logoH: L.logoH, h: L.h + 16 };
    innerH -= L.h + 16;
  }
  // The breakdown goes in the cell as rows when they fit, else as a thin bar;
  // an open KPI lists the rows with its sources instead.
  if (fill.breakdown?.length && !ctx.expanded) {
    const rowsH = breakdownRowsH(fill, ctx.measure, innerW);
    const withRows = kpiValueSize(ctx.measure, fill, innerW, innerH - rowsH);
    // Rows only when every name fits its column whole; else the bar + legend.
    const nameW = innerW - 44 - 64 - 56 - 34 - 40;
    const namesFit = fill.breakdown.every((b) => ctx.measure.width(b.label, BREAKDOWN.nameFont) <= nameW);
    const legend = fill.breakdown.filter((b) => b.share != null).slice(0, 2).map((b) => `${b.label} ${Math.round(b.share * 100)}%`).join(" · ");
    const legendOk = ctx.measure.lines(legend, BREAKDOWN.legendFont, innerW) <= 2;
    if (withRows.size >= 40 && bdNameW(innerW) >= 90) { spec.breakdown = "rows"; innerH -= rowsH; }
    else if (!legendOk) cost += 0.3;
    else if (fill.breakdown.some((b) => b.share != null)) {
      const withBar = kpiValueSize(ctx.measure, fill, innerW, innerH - BREAKDOWN.barH - 10);
      if (withBar.size >= 34) { spec.breakdown = "bar"; innerH -= BREAKDOWN.barH + 10; cost += 0.15; }
      else cost += 0.3;
    } else cost += 0.3;
  }
  const k = kpiValueSize(ctx.measure, fill, innerW, innerH);
  if (k.size < 34) cost += INFEASIBLE + (34 - k.size) / 10;
  // KPIs are compact: penalize big empty cells around a number.
  const used = (k.size * 0.92 + k.labelH + k.metaH) / innerH;
  if (used < 0.35) cost += (0.35 - used) * 1.2;
  return { cost, spec: { ...spec, size: Math.max(28, k.size) } };
}

function logosFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  let innerH = h - 2 * P - ctrlReserve(fill, ctx.measure, w, P);
  if (ctx.expanded) innerH -= receiptsListH(fill, ctx.measure, innerW);
  const labelH = fill.label || receiptsOf(fill).length ? LOGOS.labelH : 0;
  const L = innerW > 100 ? logosLayout(fill.items, innerW, innerH, LOGOS.maxH, labelH) : null;
  if (!L) return { cost: INFEASIBLE + 8 };
  let cost = (LOGOS.maxH - L.logoH) / 30;
  const used = L.h / innerH;
  if (used < 0.35) cost += (0.35 - used) * 1.2;
  return { cost, spec: { logoH: L.logoH } };
}

/** Headline number on a tile, from explicit data or null. */
function tileNumberSize(measure, num, innerW, maxH, priority) {
  const w100 = measure.width(`${num.value}${num.unit || ""}`, KPI_FONT_REF);
  return Math.floor(Math.min((innerW / w100) * 100, metricMax(priority), maxH / 0.92));
}
const KPI_FONT_REF = KPI_FONT(100);

/**
 * A case-study tile at rest leads with text: the role line, the task in
 * display type, and the headline number when there is one.
 */
function tileFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  const innerH = h - 2 * P;
  if (innerW < 140 || innerH < 90) return { cost: INFEASIBLE + 10 };
  // The kicker is always ONE line: the full one when it fits, else the short
  // one (always the short one on phones). Never cut, never ellipsized.
  const fits1 = (t) => t && ctx.measure.lines(t.toUpperCase(), TILE_ROLE_FONT, innerW) <= 1;
  const roleShort = ctx.phone ? !!fill.roleShort || !fits1(fill.role) : !fits1(fill.role);
  const roleText = roleShort ? fill.roleShort || fill.role : fill.role;
  const roleLines = ctx.measure.lines(roleText.toUpperCase(), TILE_ROLE_FONT, innerW);
  if (roleLines > (fill.roleShort ? 1 : 2)) return { cost: INFEASIBLE + 3 };
  const roleH = tileRoleH(roleLines);
  let avail = innerH - roleH;
  let num = 0;
  let labelLines = 1;
  let cost = 0;
  if (fill.number) {
    // The metric shows only when it fits at a comfortable size; the top
    // case study is the one that must show it.
    num = tileNumberSize(ctx.measure, fill.number, innerW, innerH * 0.38, fill.priority);
    // The label sits beside the reserved "Open →" box, never under it.
    labelLines = ctx.measure.lines(fill.number.label, font(BODY_FAMILY, 400, TILE.labelSize), innerW - TILE.openW - 16);
    if (labelLines > 2) num = 0;
    if (num >= TILE.numMin) avail -= num * 0.92 + tileNumLabelH(labelLines) + TILE.numGap;
    // Every tile keeps its metric unless it truly lacks room; the top one must.
    else { num = 0; cost += fill.mustMetric ? INFEASIBLE : 1.5; }
  }
  // On phones the spread is gentle (top 1.0, the rest ~0.9 of it): a step, not a jump.
  const target = hookTarget(ctx.phone ? 1 - (1 - (fill.priority ?? 0.5)) * 0.35 : fill.priority);
  // Every step that fits (no word split, comfortable measure, at most 3 lines
  // on phones / 4 on desktop) is a candidate. The full hook first; the short
  // one when the full hook can't stay within that many lines.
  const maxLines = ctx.phone ? 3 : 4;
  const pick = (text, extra) => {
    const longest = longestWord(text);
    let b = null;
    TILE.steps.forEach((s, i) => {
      const f = TILE_FONT(s.size);
      if (ctx.measure.width(longest, f) > innerW) return;
      const lines = ctx.measure.lines(text, f, innerW);
      if (lines > maxLines || lines * s.lineHeight > avail) return;
      // Size follows priority; a hook a step off its target costs, so the
      // layout itself makes room for the important one.
      let c = 1.6 * Math.abs(Math.log(s.size / target)) + extra;
      const cpl = innerW / (s.size * 0.5);
      if (cpl < 12) c += (12 - cpl) / 4;
      if (!b || c < b.c - 1e-9) b = { i, s, c, need: lines * s.lineHeight };
    });
    return b;
  };
  const full = ctx.phone && fill.taskShort ? null : pick(fill.task, 0);
  // The full hook only "fits comfortably" near its target size; otherwise the short one.
  const short = fill.taskShort ? pick(fill.taskShort, 0) : null;
  const useShort = !!short && (!full || full.s.size < target * 0.8);
  let best = useShort ? short : full;
  if (!best) return { cost: INFEASIBLE + 4 };
  cost += best.c;
  const used = (best.need + (innerH - roleH - avail)) / (innerH - roleH);
  if (used < 0.3) cost += (0.3 - used) * 1.0;
  return { cost, spec: { step: best.i, num, roleLines, labelLines, useShort, roleShort } };
}

/**
 * Can this tile set its hook at `size` (full hook, else the short one) within
 * its line cap, given the room its kicker and metric already take?
 */
export function hookFits(fill, cell, size, measure, phone, P) {
  const innerW = cell.w - 2 * P;
  const roleText = cell.spec?.roleShort && fill.roleShort ? fill.roleShort : fill.role;
  const roleH = tileRoleH(measure.lines(roleText.toUpperCase(), TILE_ROLE_FONT, innerW));
  const num = cell.spec?.num ?? 0;
  const numH = num ? num * 0.92 + tileNumLabelH(cell.spec?.labelLines ?? 1) + TILE.numGap : 0;
  const avail = cell.h - 2 * P - roleH - numH;
  const lh = Math.round(size * 1.1), f = TILE_FONT(size), maxLines = phone ? 3 : 4;
  for (const [text, short] of [[phone && fill.taskShort ? null : fill.task, false], [fill.taskShort, true]]) {
    if (!text) continue;
    if (measure.width(longestWord(text), f) > innerW) continue;
    const lines = measure.lines(text, f, innerW);
    if (lines <= maxLines && lines * lh <= avail) return { fits: true, useShort: short };
  }
  return { fits: false };
}

/** The site's character (the pixel-face Lottie) + Ask: wants a squarish cell. */
function faceFit(fill, w, h, ctx) {
  if (w < 170 || h < 170) return { cost: INFEASIBLE + 10 };
  // Locked: about a quarter of the stage wide and a third tall, bottom-right.
  const S = ctx.stage;
  if (!S) return { cost: 0.3 * Math.abs(Math.log(w / h)), spec: {} };
  return { cost: 3 * Math.abs(Math.log(w / (S.w * 0.25))) + 3 * Math.abs(Math.log(h / (S.h * 0.31))), spec: {} };
}

function timelineFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  const innerH = h - 2 * P - TIMELINE.headH;
  if (innerW < 220) return { cost: INFEASIBLE + 10 };
  const n = fill.items.length;
  let rows = Math.floor(innerH / TIMELINE.rowH);
  if (rows < n) rows = Math.floor((innerH - 24) / TIMELINE.rowH);
  let cost = 0;
  if (rows < Math.min(n, 6)) cost += INFEASIBLE;
  cost += 0.15 * Math.max(0, n - rows);
  // Each line stays on one line: no row may need wrapping.
  const textW = innerW - TIMELINE.yearW;
  const f = font("Satoshi", 400, TIMELINE.size);
  if (fill.items.some((it) => ctx.measure.width(it.text, f) > textW)) cost += 2;
  const empty = (innerH - Math.min(rows, n) * TIMELINE.rowH) / innerH;
  if (empty > 0.35) cost += (empty - 0.35) * 1.5;
  return { cost, spec: { rows: Math.min(rows, n) } };
}

/** Commit rows sized by their wrapped message (never ellipsized). */
export function commitRows(measure, fill, innerW) {
  return fill.items.map((c) => COMMITS.rowPad + measure.lines(c.msg, COMMIT_MSG_FONT, innerW) * COMMITS.msgLH + COMMITS.metaH);
}
export function commitsHeadH(measure, fill, innerW) {
  // "Shipped" + repo on one line when it fits, else the repo gets its own line.
  return measure.width(`SHIPPED   ${fill.repo}`, CAPS_FONT) + 24 <= innerW ? COMMITS.headerH : COMMITS.headerH + 18;
}

/* ---- About kinds ----------------------------------------------------------- */

export const worklogMeta = (it) => `${it.org} · ${fmtDate(it.start)} to ${fmtDate(it.end)}`;
export const worklogLink = () => "Case study →";
/** One work-history row, every part measured: title / org · dates / summary / case link. */
export function worklogRowH(measure, it, innerW) {
  // 8px rhythm: title / 4 / meta / 8 / summary / 8 / link; 28 between entries (14 + divider + 14)
  return 28
    + measure.lines(it.title, WORKLOG.title, innerW) * WORKLOG.titleLH
    + 4 + measure.lines(worklogMeta(it), WORKLOG.meta, innerW) * WORKLOG.metaLH
    + (it.summary ? 8 + measure.lines(it.summary, WORKLOG.summary, innerW) * WORKLOG.summaryLH : 0)
    + (it.caseStudy ? 8 + 16 : 0);
}
function worklogFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  if (innerW < 220) return { cost: INFEASIBLE + 10 };
  const innerH = h - 2 * P - WORKLOG.headH;
  const hs = fill.items.map((it) => worklogRowH(ctx.measure, it, innerW));
  let used = 0, rows = 0;
  for (const rh of hs) { if (used + rh > innerH) break; used += rh; rows++; }
  while (rows < hs.length && rows > 0 && used + 24 > innerH) { rows--; used -= hs[rows]; }
  let cost = 0;
  // The work history is never truncated: every entry or none.
  if (rows < hs.length) cost += INFEASIBLE;
  const empty = (innerH - used) / innerH;
  if (empty > 0.3) cost += (empty - 0.3) * 1.5;
  return { cost, spec: { rows, rowHs: hs.slice(0, rows) } };
}

const chipW = (measure, it) => (it.icon ? STACK.iconW + 6 : 0) + measure.width(it.name, STACK.chip) + 24; // + padding 20, border 2, rounding
/** Stack groups: a label, then chips wrapped greedily. Returns total height or null if a chip can't fit. */
export function stackLayout(measure, fill, innerW) {
  let h = 0;
  const groups = [];
  for (const g of fill.groups) {
    let rows = 1, x = 0;
    for (const it of g.items) {
      const cw = chipW(measure, it);
      if (cw > innerW) return null;
      if (x > 0 && x + STACK.gap + cw > innerW) { rows++; x = cw; } else x += (x > 0 ? STACK.gap : 0) + cw;
    }
    const gh = STACK.groupH + rows * STACK.chipH + (rows - 1) * STACK.gap;
    groups.push(gh);
    h += gh + STACK.groupGap;
  }
  return { h: h - STACK.groupGap, groups };
}
/**
 * The stack as a table: one row per skill, [icon + name] | [job tags + the
 * evidence line], under group headings. Narrow cells stack each row (skill
 * over its jobs). Every row measured; nothing cut.
 */
export function stackCols(innerW) {
  if (innerW < 440) return null;
  const left = Math.round(Math.max(150, Math.min(250, innerW * 0.32)));
  return { left, right: innerW - left - 20 };
}
const tagW = (measure, label) => measure.width(label.toUpperCase(), CAPS_FONT) + 16;
function tagRows(measure, labels, w) {
  if (!labels.length) return 0;
  let rows = 1, x = 0;
  for (const l of labels) { const tw = tagW(measure, l); if (x > 0 && x + 6 + tw > w) { rows++; x = tw; } else x += (x ? 6 : 0) + tw; }
  return rows;
}
export function stackRowH(measure, it, innerW) {
  const cols = stackCols(innerW);
  const nameW = cols ? cols.left - (STACK.iconW + 8) : innerW - (STACK.iconW + 8);
  const rightW = cols ? cols.right : innerW;
  const nameH = measure.lines(it.name, STACK.chip, nameW) * 18;
  const tagsH = tagRows(measure, it.jobs || [], rightW) * 24;
  const evH = it.evidence ? measure.lines(it.evidence, STACK.chip, rightW) * 18 : 0;
  const right = tagsH + (tagsH && evH ? 4 : 0) + evH;
  return 14 + (cols ? Math.max(nameH, right) : nameH + 6 + right);
}
export function stackTableH(measure, fill, innerW) {
  return fill.groups.reduce((h, g) => h + STACK.groupH + 6 + g.items.reduce((s, it) => s + stackRowH(measure, it, innerW), 0) + STACK.groupGap, 0);
}
function stackFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  const innerH = h - 2 * P - STACK.groupH;
  if (innerW < 220) return { cost: INFEASIBLE + 10 };
  const need = stackTableH(ctx.measure, fill, innerW);
  if (need > innerH) return { cost: INFEASIBLE + 2 + (need - innerH) / 400 };
  const empty = (innerH - need) / innerH;
  return { cost: empty > 0.3 ? (empty - 0.3) * 1.2 : 0, spec: { cols: stackCols(innerW) } };
}

/** Off the clock: an intro line, then compact lists (READING, PLAYING, WATCHING when it has data). */
export const OFFCLOCK_GROUPS = [["book", "Reading", "lucide:book-open"], ["game", "Playing", "lucide:gamepad-2"], ["watch", "Watching", "lucide:layers"]];
const OC_TITLE = font("Satoshi", 400, 13.5), OC_BY = font("Satoshi", 400, 12);
export const offclockSub = (it) => [it.by, it.note].filter(Boolean).join(" · ");
export function offclockLayout(measure, fill, innerW) {
  const introH = fill.intro ? measure.lines(fill.intro, OFFCLOCK.intro, innerW) * OFFCLOCK.introLH + 14 : 0;
  const groups = OFFCLOCK_GROUPS.map(([kind]) => fill.items.filter((it) => it.kind === kind)).filter((g) => g.length);
  const rowH = (it) => 8 + measure.lines(it.title, OC_TITLE, innerW) * 18 + (offclockSub(it) ? measure.lines(offclockSub(it), OC_BY, innerW) * 16 : 0);
  const listsH = groups.reduce((h, g) => h + 28 + g.reduce((s, it) => s + rowH(it), 0) + 16, 0);
  return { introH, h: OFFCLOCK.headH + introH + listsH, rowHs: fill.items.map(rowH) };
}
function offclockFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  if (innerW < 160) return { cost: INFEASIBLE + 10 };
  const L = offclockLayout(ctx.measure, fill, innerW);
  if (L.h > h - 2 * P) return { cost: INFEASIBLE + 4 };
  const empty = 1 - L.h / (h - 2 * P);
  return { cost: empty > 0.3 ? (empty - 0.3) * 1.2 : 0, spec: L };
}
/** A type specimen (src/stage/specimen): >= ~300x240 as a tile, >= 520 wide in focus; prefers landscape. */
function specimenFit(fill, w, h, ctx) {
  const listH = ctx.expanded ? receiptsListH(fill, ctx.measure, w - 2 * ctx.pad) : 0;
  const minW = fill.focused ? 520 : 300;
  if (w < minW || h - listH < 240) return { cost: INFEASIBLE + 6 };
  const ar = w / Math.max(1, h - listH);
  return { cost: ar < 1.1 ? 0.6 * (1.1 - ar) : 0, spec: { listH } };
}

function portraitFit(fill, w, h) {
  if (w < 200 || h < 220) return { cost: INFEASIBLE + 10 };
  const box = mediaBox(fill.aspect, w, h);
  return { cost: 2.5 * (1 - (box.w * box.h) / (w * h)), spec: { box } };
}

function commitsFit(fill, w, h, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  if (innerW < 180) return { cost: INFEASIBLE + 10 };
  const headH = commitsHeadH(ctx.measure, fill, innerW);
  const innerH = h - 2 * P - headH - ctrlReserve(fill, ctx.measure, w, P);
  const rowHs = commitRows(ctx.measure, fill, innerW);
  const n = rowHs.length;
  let used = 0, shown = 0;
  for (const rh of rowHs) { if (used + rh > innerH) break; used += rh; shown++; }
  while (shown < n && shown > 0 && used + COMMITS.more > innerH) { shown--; used -= rowHs[shown]; }
  const need = Math.min(n, 3);
  let cost = 0;
  if (shown < need) cost += INFEASIBLE + (need - shown);
  cost += 0.12 * Math.max(0, Math.min(n, 7) - shown);
  const ar = w / h;
  if (ar > 1.2) cost += 0.6 * (ar - 1.2); // tall-narrow reads as a log
  if (innerW > 560) cost += (innerW - 560) / 400;
  const empty = (innerH - used) / Math.max(1, innerH);
  if (empty > 0.35) cost += (empty - 0.35) * 1.5;
  return { cost, spec: { rows: shown, rowHs: rowHs.slice(0, shown), headH } };
}

/**
 * Media box inside an area: cover if that crops <= MEDIA.coverCrop, else
 * contain (the media's own aspect, nothing cut). Anchored top-left.
 */
export function mediaBox(aspect, w, h) {
  const ac = w / h;
  const visible = Math.min(ac / aspect, aspect / ac);
  if (1 - visible <= MEDIA.coverCrop + 1e-9) return { x: 0, y: 0, w, h, crop: 1 - visible, fit: "cover" };
  if (ac > aspect) {
    const bw = Math.floor(h * aspect);
    return { x: 0, y: 0, w: bw, h, crop: 0, fit: "contain" };
  }
  const bh = Math.floor(w / aspect);
  return { x: 0, y: 0, w, h: bh, crop: 0, fit: "contain" };
}

/**
 * Lay a media fill out in a w x h cell: media box + caption strip (+ the
 * receipts tag, which lives in the strip, never on the media). Tries the
 * caption below and beside; returns the cheaper.
 */
export const STEP_CHIP_W = 84;
export const stepText = (st) => `Step ${st.n} of ${st.of} · ${st.stage}`;

export const MEDIA_TOOLBAR_H = 36;
export function mediaLayout(fill, w, h, measure, expanded, phone = false) {
  const C = phone ? { ...MEDIA.cap, ...CAPTION_PHONE } : MEDIA.cap;
  const CF = phone ? CAPTION_FONT_PHONE : CAPTION_FONT;
  // An expanded media gets a slim toolbar (close, steps, zoom) ABOVE the image, never on it.
  const TB = fill.focused ? MEDIA_TOOLBAR_H : 0;
  const H = h - TB - (expanded ? receiptsListH(fill, measure, w - 2 * LIST_PAD) : 0);
  // The control group [GO DEEPER →] [PROOF] [↗] lives in the strip, never on the media.
  // ↗ (expand in place) is for deck media only.
  const hasExp = !fill.focused && !fill.caseStudy;
  const items = ctrlItems(fill, measure, { exp: hasExp });
  const gFull = ctrlFullW(items);
  const cap = fill.caption || "";
  const capLines = (cw) => (cap ? measure.lines(cap, CF, cw) : 0);
  // A process step ("STEP 1 OF 6 · FIRST CONCEPT" + status chip, + a track
  // when the deck has a sequence) sits on its own line in the strip.
  const stepH = (cw) => (fill.step ? measure.lines(stepText(fill.step).toUpperCase(), CAPS_FONT, cw - STEP_CHIP_W) * 16 + (fill.stepTrack ? 12 : 0) + 8 : 0);
  const variants = [];
  const availG = w - 2 * C.side;

  // Below: strip under the media box, full cell width.
  {
    // The whole group shares the caption's row when the caption keeps >= 180px; otherwise
    // the WHOLE group drops to its own row under the caption (it wraps only if that row is too narrow).
    const inline = items.length > 0 && (cap ? availG - gFull - 12 >= 180 : !fill.step && gFull <= availG);
    const cw = availG - (inline && cap ? gFull + 12 : 0);
    const n = cap ? (cw > 80 ? capLines(cw) : 99) : 0;
    const sH = stepH(cw);
    const g = inline ? { h: CTRL.h } : ctrlRows(items, availG);
    const textBlock = sH + n * C.lineHeight;
    // Inline, the 32px group is centred on the caption's first line (it starts 7px above it).
    const lift = Math.round((CTRL.h - C.lineHeight) / 2);
    const textH = !items.length ? textBlock : inline ? Math.max(textBlock, CTRL.h - lift) : textBlock + (textBlock ? 8 : 0) + g.h;
    const stripH = cap || items.length || fill.step ? textH + C.padTop + C.padBottom : 0;
    const box = mediaBox(fill.aspect, w, Math.max(1, H - stripH));
    const ctrlY = inline ? box.h + C.padTop - lift : box.h + C.padTop + textBlock + (textBlock ? 8 : 0);
    variants.push({
      layout: "below", box, n, ok: n <= C.maxLines && H - stripH >= 90,
      step: fill.step ? { x: C.side, y: box.h + C.padTop, w: cw, h: sH } : null,
      cap: cap ? { x: C.side, y: box.h + C.padTop + sH, w: cw, h: n * C.lineHeight, lines: n } : null,
      ctrl: items.length ? { y: ctrlY, right: C.side, w: availG } : null,
      used: box.h + stripH,
    });
  }
  // Beside: a caption column to the right of the media (never for diagrams: they want the full width).
  if (cap && !(fill.focused && fill.aspect > 1.6)) {
    const colW = Math.max(MEDIA.beside.min, Math.min(MEDIA.beside.max, Math.round(w * 0.3)));
    const box = mediaBox(fill.aspect, w - colW, H);
    const cx = box.w + C.side;
    const cw = w - cx - C.side;
    const n = cw > 120 ? capLines(cw) : 99;
    const sH = stepH(cw);
    const g = ctrlRows(items, cw);
    const top = 24 + (g.h ? g.h + 12 - 8 : 0);
    variants.push({
      layout: "beside", box, n, ok: n <= C.maxLines + 3 && top + sH + n * C.lineHeight + 20 <= H,
      step: fill.step ? { x: cx, y: top, w: cw, h: sH } : null,
      cap: { x: cx, y: top + sH, w: cw, h: n * C.lineHeight, lines: n },
      ctrl: items.length ? { y: 16, right: C.side, w: cw } : null,
      used: H, beside: true,
    });
  }
  // Media narrower than its cell (fit-contain, e.g. a portrait) is centred horizontally.
  // Caption, step, Proof and Expand stay anchored to the cell; only an expanded clip's
  // caption follows the image.
  for (const v of variants) {
    if (v.layout === "below" && v.box.w < w - 1) {
      const dx = Math.floor((w - v.box.w) / 2);
      v.box = { ...v.box, x: dx };
      if (fill.focused) {
        if (v.cap) v.cap = { ...v.cap, x: Math.max(C.side, dx) };
        if (v.step) v.step = { ...v.step, x: Math.max(C.side, dx) };
      }
    }
  }
  let best = null;
  for (const v of variants) {
    let cost = 2 * v.box.crop;
    let waste;
    if (v.layout === "below") {
      // Media area = cell minus the strip; whatever the box leaves empty is letterbox.
      const stripH = v.used - v.box.h;
      waste = 1 - (v.box.w * v.box.h) / Math.max(1, w * (H - stripH));
    } else {
      // Left of the caption column the media spans box.w; below it is empty.
      waste = 1 - v.box.h / H;
      const colFill = (v.cap.y + v.cap.h + 20) / H;
      cost += 0.2 + 0.8 * (1 - colFill) * (v.cap.w / w);
    }
    cost += 4 * Math.max(0, waste);
    if (!v.ok) cost += INFEASIBLE;
    if (v.box.w < 150 || v.box.h < 96) cost += INFEASIBLE;
    if (!best || cost < best.cost - 1e-9) best = { cost, spec: { layout: v.layout, box: v.box, cap: v.cap, step: v.step, ctrl: v.ctrl } };
  }
  if (best && TB) {
    const dn = (r) => (r ? { ...r, y: r.y + TB } : r);
    best.spec = { ...best.spec, box: dn(best.spec.box), cap: dn(best.spec.cap), step: dn(best.spec.step), ctrl: dn(best.spec.ctrl), toolbar: { h: TB } };
  }
  return best;
}

function mediaFit(fill, w, h, ctx) {
  if (h - (ctx.expanded ? receiptsListH(fill, ctx.measure, w - 2 * ctx.pad) : 0) < 96) return { cost: INFEASIBLE + 10 };
  const r = mediaLayout(fill, w, h, ctx.measure, ctx.expanded, ctx.phone);
  // An expanded media takes the majority of the stage (>= ~70% of its area).
  if (fill.focused && ctx.stage && r) {
    const share = (w * h) / (ctx.stage.w * ctx.stage.h);
    if (share < 0.7) r.cost += 30 * (0.7 - share);
  }
  return r;
}

export function fitFill(fill, w, h, ctx) {
  let r;
  switch (fill.kind) {
    case "prose": r = proseLike(fill, w, h, ctx, stepsFor(fill, ctx.phone), PROSE_FONT, 0); break;
    case "quote": {
      const whoH = quoteWhoH(ctx.measure, fill.who, w - 2 * ctx.pad);
      r = proseLike(fill, w, h, ctx, QUOTE_STEPS, QUOTE_FONT, whoH);
      if (r.spec) r.spec.whoH = whoH;
      break;
    }
    case "title": r = titleFit(fill, w, h, ctx); break;
    case "kpi": r = kpiFit(fill, w, h, ctx); break;
    case "commits": r = commitsFit(fill, w, h, ctx); break;
    case "media": r = mediaFit(fill, w, h, ctx); break;
    case "logos": r = logosFit(fill, w, h, ctx); break;
    case "tile": r = tileFit(fill, w, h, ctx); break;
    case "face": r = faceFit(fill, w, h, ctx); break;
    case "timeline": r = timelineFit(fill, w, h, ctx); break;
    case "worklog": r = worklogFit(fill, w, h, ctx); break;
    case "stack": r = stackFit(fill, w, h, ctx); break;
    case "portrait": r = portraitFit(fill, w, h); break;
    case "specimen": r = specimenFit(fill, w, h, ctx); break;
    case "offclock": r = offclockFit(fill, w, h, ctx); break;
    default: r = { cost: INFEASIBLE + 20 };
  }
  // Generic shape sanity for text cells: no slivers.
  if (fill.kind !== "media" && fill.kind !== "title" && fill.kind !== "portrait" && fill.kind !== "specimen") {
    const ar = w / h;
    if (ar > 4 || ar < 0.25) r.cost += 0.6 * Math.abs(Math.log(ar / (ar > 1 ? 4 : 0.25)));
  }
  return r;
}

/**
 * Natural height of a fill at a given width (phone stacking).
 */
export function naturalHeight(fill, w, ctx) {
  const P = ctx.pad;
  const innerW = w - 2 * P;
  const extra = ctx.expanded ? receiptsListH(fill, ctx.measure, innerW) : 0;
  const tag = ctrlReserve(fill, ctx.measure, w, P);
  switch (fill.kind) {
    case "prose": {
      const s = PROSE_STEPS[2];
      return Math.ceil(ctx.measure.lines(fill.text, PROSE_FONT(s.size), innerW) * s.lineHeight) + 2 * P + tag + extra + (fill.status ? STATUS_H : 0) + kickerH(ctx.measure, fill.kicker, kickerW(fill, innerW));
    }
    case "quote": {
      const s = QUOTE_STEPS[2];
      return Math.ceil(ctx.measure.lines(fill.text, QUOTE_FONT(s.size), innerW) * s.lineHeight) + quoteWhoH(ctx.measure, fill.who, innerW) + 2 * P + extra + tag;
    }
    case "title": {
      const target = Math.min(18 + 170 * Math.pow(Math.max(0.05, fill.weight), 1.4), 900 / Math.sqrt(fill.text.length + 4));
      let fs = Math.round(Math.min(target, 120));
      const TF = titleFontFor(fill), TLH = titleLHFor(fill);
      if (isWordmark(fill)) fs = 200;
      while (fs > 16 && ctx.measure.width(longestWord(fill.text), TF(fs)) > innerW) fs -= 2;
      const lines = ctx.measure.lines(fill.text, TF(fs), innerW);
      return { h: lines * TLH(fs) + 2 * P + kickerH(ctx.measure, fill.kicker, kickerW(fill, innerW)), spec: { size: fs, lineHeight: TLH(fs) } };
    }
    case "kpi": {
      const bd = fill.breakdown?.length && !ctx.expanded ? breakdownRowsH(fill, ctx.measure, innerW) : 0;
      const at = ctx.attach ? (logosLayout(ctx.attach.items, innerW, 400, LOGOS.attachMaxH)?.h ?? 0) + 16 : 0;
      return 168 + extra + bd + at;
    }
    case "logos": {
      const L = logosLayout(fill.items, innerW, 2000, 32, fill.label ? LOGOS.labelH : 0);
      return 2 * P + (L ? L.h : 80) + extra;
    }
    case "face": return Math.min(w, 300);
    case "worklog": return 2 * P + WORKLOG.headH + fill.items.reduce((s, it) => s + worklogRowH(ctx.measure, it, innerW), 0) + 4;
    case "stack": return 2 * P + STACK.groupH + stackTableH(ctx.measure, fill, innerW) + 8;
    case "portrait": return Math.round(Math.min(w / fill.aspect, 520));
    case "specimen": return Math.max(280, Math.round(w * 0.7)) + extra;
    case "offclock": return 2 * P + offclockLayout(ctx.measure, fill, innerW).h;
    case "timeline": return 2 * P + TIMELINE.headH + TIMELINE.rowH * fill.items.length + 4;
    case "tile": {
      const role = ctx.phone && fill.roleShort ? fill.roleShort : fill.role;
      let hh = 2 * P + tileRoleH(Math.min(2, ctx.measure.lines(role.toUpperCase(), TILE_ROLE_FONT, innerW))) + 8;
      if (fill.number) hh += Math.min(72, tileNumberSize(ctx.measure, fill.number, innerW, 72, fill.priority)) * 0.92 + tileNumLabelH(Math.min(2, ctx.measure.lines(fill.number.label, font(BODY_FAMILY, 400, TILE.labelSize), innerW - TILE.openW - 16))) + TILE.numGap;
      // Size the stacked tile for the hook at its priority's target size.
      const target = hookTarget(1 - (1 - (fill.priority ?? 0.5)) * 0.35);
      const s = TILE.steps.reduce((b, x) => (Math.abs(x.size - target) < Math.abs(b.size - target) ? x : b));
      const task = ctx.phone && fill.taskShort ? fill.taskShort : fill.task;
      return hh + Math.min(3, ctx.measure.lines(task, TILE_FONT(s.size), innerW)) * s.lineHeight + 8;
    }
    case "commits": {
      const rows = commitRows(ctx.measure, fill, innerW).slice(0, 5);
      return 2 * P + commitsHeadH(ctx.measure, fill, innerW) + rows.reduce((a, b) => a + b, 0) + (fill.items.length > 5 ? COMMITS.more + 4 : 4);
    }
    case "media": {
      // Media at full width (capped height), then whatever strip the caption needs.
      const mh = Math.round(Math.min(w / fill.aspect, 600));
      let h = mh + 40;
      for (let i = 0; i < 12; i++) {
        const L = mediaLayout(fill, w, h + extra, ctx.measure, ctx.expanded, ctx.phone);
        if (L.spec.layout === "below" && L.spec.box.h >= mh - 1) break;
        h += 18;
      }
      return h + extra;
    }
    default: return 120;
  }
}
