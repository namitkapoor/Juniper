/**
 * Pretext-backed measurement.
 *
 * The engine asks two questions many thousands of times while it searches
 * layouts: "how many lines does this text take at width W in font F?" and
 * "how wide is this text on one line?". Pretext answers both with arithmetic
 * over a prepared handle, so we prepare each (text, family, weight) ONCE at a
 * 100px reference size and scale: at size s, wrapping at width W is the same
 * as wrapping the 100px handle at W * 100 / s. That keeps prepare() calls
 * proportional to the number of distinct texts, not to the search space.
 *
 * Painting uses real-size handles from `preparedFor()` (prepareWithSegments),
 * which feed layoutNextLine() in flow.js.
 */
import {
  prepare, prepareWithSegments, measureLineStats, measureNaturalWidth, clearCache,
} from "@chenglou/pretext";
import { fontString, DISPLAY, BODY } from "../engine/typo.js";

const REF = 100;
const refCache = new Map();
const paintCache = new Map();

const refHandle = (text, f) => {
  const key = `${f.family}|${f.weight}|${f.letterSpacingEm || 0}|${text}`;
  let h = refCache.get(key);
  if (!h) {
    h = prepare(text, `${f.weight} ${REF}px ${f.family}`, { letterSpacing: (f.letterSpacingEm || 0) * REF });
    refCache.set(key, h);
  }
  return h;
};

export const pretextMeasure = {
  lines(text, f, maxW) {
    if (!text) return 0;
    return measureLineStats(refHandle(text, f), (maxW * REF) / f.size).lineCount;
  },
  width(text, f) {
    if (!text) return 0;
    return (measureNaturalWidth(refHandle(text, f)) * f.size) / REF;
  },
};

/** Real-size handle with segments, for line-by-line painting. */
export function preparedFor(text, f) {
  const key = `${fontString(f)}|${f.letterSpacingEm || 0}|${text}`;
  let h = paintCache.get(key);
  if (!h) {
    h = prepareWithSegments(text, fontString(f), { letterSpacing: (f.letterSpacingEm || 0) * f.size });
    paintCache.set(key, h);
  }
  return h;
}

/**
 * Wait for the faces we measure with. document.fonts.ready alone does not
 * wait for faces nothing has used yet, so load each one explicitly, then
 * drop any widths Pretext measured against the fallback font.
 */
export async function loadFonts() {
  const faces = [
    `200 100px ${DISPLAY}`, `300 100px ${DISPLAY}`, `800 100px ${DISPLAY}`, `700 100px ${DISPLAY}`, `500 100px ${DISPLAY}`,
    `400 16px ${BODY}`, `500 16px ${BODY}`,
  ];
  try {
    await Promise.all(faces.map((f) => document.fonts.load(f, "namit 0123456789 ×→%")));
    await document.fonts.ready;
  } catch { /* fall through with whatever loaded */ }
  clearCache();
  refCache.clear();
  paintCache.clear();
}
