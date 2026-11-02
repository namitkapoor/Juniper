/**
 * No word is ever split across lines: for every deck, the home (both
 * arrangements) and the About page, at every stage size, each text cell's
 * chosen type size fits its longest word in the cell's text width. (The
 * browser sweep additionally checks the painted lines: data-broke.)
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { layoutStage } from "./layout.js";
import { fakeMeasure } from "./fakeMeasure.js";
import { PROSE_FONT, QUOTE_FONT, titleFontFor, TILE, TILE_FONT, PAD } from "./typo.js";
import { homeWithTiles } from "../tiles.js";
import { aboutAnswer, aboutFromJson } from "../about/aboutAnswer.js";

const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");
const load = (f) => (fs.existsSync(path.join(DATA, f)) ? JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8")) : null);
const decks = load("decks.json") || [];
const home = load("home.json");
const cases = load("case-studies.json") || [];

const longest = (t) => t.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");
const RECTS = [[820, 760], [968, 860], [1060, 700], [1400, 860], [1840, 1040]].map(([w, h]) => ({ x: 0, y: 0, w, h }));

function answers() {
  const out = decks.map((d) => [d.id, d]);
  if (home && cases.length) {
    const h = { ...home, fills: home.fills.map((f) => (f.kind === "media" ? { ...f, caseStudy: cases.find((c) => f.src.startsWith(`assets/${c.id}/`))?.id } : f)) };
    out.push(["home", homeWithTiles(h, cases)]);
  }
  const aboutJson = load("about.json");
  out.push(["about", aboutJson ? aboutFromJson(aboutJson, cases) : aboutAnswer()]);
  return out;
}

describe("never break a word", () => {
  for (const [id, A] of answers()) {
    for (const rect of RECTS) {
      it(`${id} @ ${rect.w}x${rect.h}`, () => {
        const L = layoutStage({ rect, fills: A.fills, measure: fakeMeasure, viewportW: 1440, split: A.split });
        const fills = new Map(A.fills.map((f) => [f.id, f]));
        for (const c of L.cells) {
          const f = fills.get(c.fillId);
          const innerW = c.w - 2 * PAD.desktop;
          let font = null, text = null;
          if (f.kind === "prose") { font = PROSE_FONT(c.spec.size); text = f.text; }
          if (f.kind === "quote") { font = QUOTE_FONT(c.spec.size); text = f.text; }
          if (f.kind === "title") { font = titleFontFor(f)(c.spec.size); text = f.text; }
          if (f.kind === "tile") { font = TILE_FONT(TILE.steps[c.spec.step].size); text = f.task; }
          if (!font) continue;
          expect(fakeMeasure.width(longest(text), font), `${c.fillId}: "${longest(text)}"`).toBeLessThanOrEqual(innerW + 0.5);
        }
      });
    }
  }
});
