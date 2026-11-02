/**
 * Deterministic stand-in for the Pretext measurer: average glyph widths and
 * greedy word wrap. Used by the unit tests (Node has no canvas) and as a
 * fallback before fonts load. Slightly pessimistic (wider) on purpose.
 */
const AVG = { CabinetGrotesk: 0.56, Satoshi: 0.53 };

export const fakeMeasure = {
  width(text, f) {
    const em = AVG[f.family] ?? 0.55;
    return text.length * f.size * (em + (f.letterSpacingEm || 0)) * (f.weight >= 700 ? 1.06 : 1);
  },
  lines(text, f, maxW) {
    const words = text.split(/\s+/).filter(Boolean);
    const space = this.width(" ", f);
    let lines = 0, cur = 0;
    for (const w of words) {
      const ww = this.width(w, f);
      if (cur === 0) { cur = ww; lines = Math.max(lines, 1); continue; }
      if (cur + space + ww <= maxW) cur += space + ww;
      else { lines++; cur = ww; }
      if (ww > maxW) lines += Math.floor(ww / maxW);
    }
    return lines;
  },
};
