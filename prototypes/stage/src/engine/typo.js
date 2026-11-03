/**
 * Typography + spacing constants shared by the layout engine (which sizes
 * cells from them) and the renderer (which paints with them). If these two
 * sides disagree, text overflows, so both read from here.
 */

export const DISPLAY = "CabinetGrotesk";
export const BODY = "Satoshi";

/** A font spec the measurer understands. letterSpacing is in em. */
export const font = (family, weight, size, letterSpacingEm = 0) => ({ family, weight, size, letterSpacingEm });

/** Canvas/CSS font shorthand for Pretext. */
export const fontString = (f) => `${f.weight} ${f.size}px ${f.family}`;

export const PAD = { desktop: 24, phone: 20 };

/** Small wide-tracked caps label (kickers, receipt tags, kpi labels). */
export const LABEL = { family: BODY, weight: 500, size: 11, letterSpacingEm: 0.2, lineHeight: 16 };

/** Prose steps, largest first. The engine picks the largest that fits. */
export const PROSE_STEPS = [
  { size: 22, lineHeight: 32 },
  { size: 19, lineHeight: 28 },
  { size: 17, lineHeight: 25 },
  { size: 15, lineHeight: 22 },
  { size: 14, lineHeight: 20 },
];
export const PROSE_FONT = (size) => font(BODY, 400, size);
/** A blank line in the source starts a paragraph; paragraphs sit this many lines apart. */
export const PARA_GAP = 0.6;
export const paragraphs = (text) => text.split(/\n\s*\n/).map((t) => t.replace(/\s+/g, " ").trim()).filter(Boolean);
/** A hyphenated word never breaks at its hyphen: glue it with a word joiner. */
export const glueHyphens = (t) => (t ? t.replace(/(\S)-(?=\S)/g, "$1-\u2060") : t);
/** Short prose may set larger, like a statement; long prose never does. */
const PROSE_BIG = [{ size: 30, lineHeight: 38 }, { size: 26, lineHeight: 34 }];
export const proseSteps = (text) => (text.length < 150 ? [...PROSE_BIG, ...PROSE_STEPS] : PROSE_STEPS);
/** Steps for a prose fill: `small` (an expanded media's caption/explain) stays at body size. */
export const stepsFor = (fill) => (fill.small ? PROSE_STEPS.slice(2) : proseSteps(fill.text || ""));

export const QUOTE_STEPS = [
  { size: 34, lineHeight: 40 },
  { size: 28, lineHeight: 34 },
  { size: 23, lineHeight: 29 },
  { size: 19, lineHeight: 25 },
  { size: 16, lineHeight: 22 },
];
export const QUOTE_FONT = (size) => font(DISPLAY, 300, size);
export const QUOTE_WHO_H = 30;
/** Small tracked caps (kickers, attributions, meta): every line counted, never cut. */
export const CAPS_FONT = font(BODY, 500, 11, 0.2);
export const capsH = (measure, text, innerW) => (text ? measure.lines(text.toUpperCase(), CAPS_FONT, innerW) * 16 : 0);
export const quoteWhoH = (measure, who, innerW) => (who ? 14 + capsH(measure, who, innerW) : 0);

export const TITLE_FONT = (size) => font(DISPLAY, 800, size, -0.02);
export const titleLineHeight = (size) => Math.round(size * (size >= 60 ? 0.92 : 1.08));
/**
 * The "namit" wordmark, as on his site's hero (Juniper src/style/home.css
 * .hero-name): Cabinet Grotesk 200, letter-spacing -0.03em, line-height 0.85.
 */
export const WORDMARK_FONT = (size) => font(DISPLAY, 200, size, -0.03);
export const wordmarkLineHeight = (size) => Math.round(size * 0.85);
export const isWordmark = (fill) => fill.kind === "title" && fill.text === "namit";
export const titleFontFor = (fill) => (isWordmark(fill) ? WORDMARK_FONT : TITLE_FONT);
export const titleLHFor = (fill) => (isWordmark(fill) ? wordmarkLineHeight : titleLineHeight);
export const KICKER_H = 30;
/** A display heading above prose (an expanded media's caption). */
export const HEADING = { size: 22, lineHeight: 28, gap: 14 };
export const HEADING_FONT = font(DISPLAY, 300, HEADING.size);
export const headingH = (measure, text, innerW) =>
  text ? measure.lines(text, HEADING_FONT, innerW) * HEADING.lineHeight + HEADING.gap : 0;

export const KPI_FONT = (size) => font(DISPLAY, 700, size, -0.02);
export const KPI_LABEL_H = 22; // one label line + gap
export const KPI_META_H = 18;
export const KPI_LABEL_FONT = font(BODY, 400, 14);

export const COMMITS = { headerH: 32, rowH: 48, msgLH: 20, metaH: 16, rowPad: 12, more: 24 };
export const COMMIT_MSG_FONT = font(BODY, 400, 14);

export const RECEIPTS = { tagW: 96, tagH: 22, headerH: 30, rowH: 32, cardH: 78, maxRows: 6 };

/**
 * Words the stage shows instead of engineer-speak. Swap here.
 * Proof tag alternatives: "Show me", "Sources", "See it".
 * Commit-log label alternatives: "The work", "Built", "In the code".
 */
export const WORDS = { proof: "Proof", proofClose: "Hide", shipped: "Shipped" };

/**
 * Media: cover only when the crop is tiny, otherwise contain (letterboxed on
 * the stage). Captions never sit on the media; they get their own strip,
 * below or beside, measured with Pretext.
 */
export const MEDIA = {
  coverCrop: 0.05,
  cap: { size: 13, lineHeight: 18, padTop: 12, padBottom: 14, side: 16, maxLines: 4 },
  beside: { min: 190, max: 280 },
};
export const CAPTION_FONT = font(BODY, 400, MEDIA.cap.size);

/** Merchant logo row: monochrome marks sized by aspect, wrapped greedily. */
export const LOGOS = { labelH: 26, gapX: 28, gapY: 16, maxH: 40, minH: 18, attachMaxH: 26 };

/** The split behind a KPI: rows (logo · name · value · share) or a thin stacked bar. */
export const BREAKDOWN = { headH: 24, rowH: 24, barH: 38, maxRows: 8, nameFont: font(BODY, 400, 12.5), legendFont: font(BODY, 400, 11) };

/** A case-study tile at rest: role line, task line (display), headline number. */
export const TILE = {
  // Includes every prose size, so a hook can match the CURRENTLY text exactly.
  steps: [64, 56, 48, 42, 36, 32, 30, 28, 26, 25, 22, 19, 17].map((size) => ({ size, lineHeight: Math.round(size * 1.1) })),
  numLabelH: 22, numGap: 14, numMax: 92, numMin: 48, // a metric shows only at a comfortable size
  openW: 78, // the "Open →" box, bottom-right: the metric label wraps in the width left of it
  labelSize: 14, labelLH: 18,
  floor: 22, // no hook sets smaller than this
};
/**
 * Hook size from priority on a modular scale (x1.25 per quarter of priority),
 * so the dominant case study reads first at a glance: 1.0 -> 44px,
 * 0.75 -> 35px, 0.55 -> 29px.
 */
// All case-study hooks share ONE size (the KYURI.OS hook's): priority changes
// only cell area and order, never type.
// The target is the CURRENTLY description's size (30px); the layout pass then
// sets hooks and CURRENTLY to the same size at every width.
export const HOOK_SIZE = 30;
export const hookTarget = () => HOOK_SIZE;
/** The metric scales with the tile too (same anatomy, smaller type for lower priority). */
export const metricMax = (priority = 0.5) => Math.round(TILE.numMax * (0.6 + 0.4 * priority));
// Descriptive text set large is LIGHT (Cabinet Grotesk 300), beside the 200 wordmark; numbers stay bold.
export const TILE_FONT = (size) => font(DISPLAY, 300, size, -0.01);
export const TILE_ROLE_FONT = font(BODY, 500, 11, 0.2);
export const tileRoleH = (lines) => lines * 16 + 16;

/** A year · line list (the About page's story). */
export const TIMELINE = { headH: 30, rowH: 26, yearW: 72, size: 14 };

/** About: work history rows and the stack's chips (all measured). */
export const WORKLOG = {
  headH: 30, rowPad: 14, link: 20,
  title: font(BODY, 400, 16), titleLH: 22,
  meta: font(BODY, 400, 12), metaLH: 16,
  summary: font(BODY, 400, 13.5), summaryLH: 19,
};
export const STACK = { groupH: 24, chipH: 28, gap: 6, groupGap: 12, chip: font(BODY, 400, 13), iconW: 16, colGap: 28, leftShare: 0.46 };
export const OFFCLOCK = { headH: 30, intro: font(BODY, 400, 15), introLH: 22, slotMinW: 150, slotH: 96, gap: 12 };

/** "Go deeper →" on a tile that opens a child deck: its own row at the bottom. */
export const DRILL_H = 26;

export const MIN_CELL = { w: 150, h: 104 };
