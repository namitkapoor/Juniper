import { describe, it, expect } from "vitest";
import { layoutStage, MAX_CELLS, MAX_DEPTH } from "./layout.js";
import { diffStrokes } from "./diff.js";
import { fakeMeasure } from "./fakeMeasure.js";
import { MIN_CELL, MEDIA } from "./typo.js";
import { fixtureAnswers, fixtureHome } from "../fixtures/index.js";

const RECTS = [
  { x: 0, y: 0, w: 1000, h: 820 },
  { x: 20, y: 20, w: 1400, h: 860 }, // wide, chat closed
  { x: 0, y: 0, w: 820, h: 900 }, // narrow-ish desktop
];
const ALL = [fixtureHome, ...fixtureAnswers];

const run = (answer, rect, extra = {}) =>
  layoutStage({ rect, fills: answer.fills, measure: fakeMeasure, viewportW: 1440, ...extra });

function expectMedia(c, answer) {
  const f = answer.fills.find((x) => x.id === c.fillId);
  const { box, cap } = c.spec;
  expect(box.crop).toBeLessThanOrEqual(MEDIA.coverCrop + 1e-6);
  if (box.fit === "contain") expect(Math.abs(box.w / box.h - f.aspect) / f.aspect).toBeLessThan(0.02);
  expect(box.x + box.w).toBeLessThanOrEqual(c.w);
  expect(box.y + box.h).toBeLessThanOrEqual(c.h);
  if (f.caption) {
    expect(cap).toBeTruthy();
    const ox = Math.min(box.x + box.w, cap.x + cap.w) - Math.max(box.x, cap.x);
    const oy = Math.min(box.y + box.h, cap.y + cap.h) - Math.max(box.y, cap.y);
    expect(ox > 0 && oy > 0).toBe(false); // caption never overlays media
    expect(cap.x + cap.w).toBeLessThanOrEqual(c.w);
    expect(cap.y + cap.h).toBeLessThanOrEqual(c.h);
  }
}

const depthOf = (node) => (node.leaf ? 0 : 1 + Math.max(...node.children.map(depthOf)));

describe("grid layout invariants", () => {
  for (const answer of ALL) {
    for (const rect of RECTS) {
      describe(`${answer.id} @ ${rect.w}x${rect.h}`, () => {
        const L = run(answer, rect);

        it("is deterministic", () => {
          const again = run(answer, rect);
          expect(JSON.stringify(again.cells)).toEqual(JSON.stringify(L.cells));
          expect(JSON.stringify(again.strokes)).toEqual(JSON.stringify(L.strokes));
        });

        it("respects depth and cell-count caps", () => {
          expect(L.mode).toBe("grid");
          expect(depthOf(L.tree)).toBeLessThanOrEqual(MAX_DEPTH);
          expect(L.cells.length).toBeLessThanOrEqual(MAX_CELLS);
          expect(L.cells.length).toBeGreaterThan(0);
        });

        it("keeps every cell above the minimum size", () => {
          for (const c of L.cells) {
            expect(c.w).toBeGreaterThanOrEqual(MIN_CELL.w);
            expect(c.h).toBeGreaterThanOrEqual(MIN_CELL.h);
          }
        });

        it("tiles the stage exactly: inside, no overlap, full coverage", () => {
          let area = 0;
          for (const c of L.cells) {
            expect(c.x).toBeGreaterThanOrEqual(rect.x);
            expect(c.y).toBeGreaterThanOrEqual(rect.y);
            expect(c.x + c.w).toBeLessThanOrEqual(rect.x + rect.w);
            expect(c.y + c.h).toBeLessThanOrEqual(rect.y + rect.h);
            area += c.w * c.h;
          }
          for (let i = 0; i < L.cells.length; i++)
            for (let j = i + 1; j < L.cells.length; j++) {
              const a = L.cells[i], b = L.cells[j];
              const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
              const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
              expect(ox > 0 && oy > 0).toBe(false);
            }
          expect(area).toBe(rect.w * rect.h);
        });

        it("draws one stroke per cut, each on a cell edge", () => {
          // A k-way split leaves k-1 strokes, so a guillotine tree has leaves-1 cuts.
          expect(L.strokes.length).toBe(L.cells.length - 1);
          for (const s of L.strokes) {
            const onEdge = L.cells.some((c) =>
              s.axis === "v" ? c.x === s.pos || c.x + c.w === s.pos : c.y === s.pos || c.y + c.h === s.pos);
            expect(onEdge).toBe(true);
            if (s.axis === "v") expect(s.x1).toBe(s.x2); else expect(s.y1).toBe(s.y2);
          }
          const orders = L.strokes.map((s) => s.order).sort((a, b) => a - b);
          expect(orders).toEqual(L.strokes.map((_, i) => i));
        });

        it("fits media (cover only under 5% crop) and never puts a caption on it", () => {
          for (const c of L.cells.filter((c) => c.kind === "media")) expectMedia(c, answer);
        });

        it("places the heaviest shown fill first and largest-ish", () => {
          const fills = new Map(answer.fills.map((f) => [f.id, f]));
          const shown = L.cells.map((c) => fills.get(c.fillId));
          const heaviest = shown.reduce((a, b) => (b.weight > a.weight ? b : a));
          const cell = L.cells.find((c) => c.fillId === heaviest.id);
          expect(cell.x === rect.x || cell.y === rect.y).toBe(true); // touches the top or left frame
        });
      });
    }
  }
});

describe("dropping and disclosure", () => {
  const crowd = fixtureAnswers.find((a) => a.id === "fx-crowd");
  it("caps at seven cells and drops the lightest fills", () => {
    const L = run(crowd, RECTS[0]);
    const shownIds = new Set(L.cells.flatMap((c) => [c.fillId, c.inset?.fillId, c.attach?.fillId].filter(Boolean)));
    expect(L.cells.length).toBeLessThanOrEqual(MAX_CELLS);
    expect(L.dropped.length).toBeGreaterThan(0);
    const minShown = Math.min(...crowd.fills.filter((f) => shownIds.has(f.id)).map((f) => f.weight));
    for (const id of L.dropped) {
      const f = crowd.fills.find((x) => x.id === id);
      expect(f.weight).toBeLessThanOrEqual(minShown);
    }
    expect(shownIds.size + L.dropped.length).toBe(crowd.fills.length);
  });

  it("promoting a dropped fill brings it on stage", () => {
    const L = run(crowd, RECTS[0]);
    const target = L.dropped[0];
    const P = run(crowd, RECTS[0], { promote: [target] });
    const ids = P.cells.flatMap((c) => [c.fillId, c.inset?.fillId, c.attach?.fillId]);
    expect(ids).toContain(target);
  });
});

describe("receipts expansion is a re-layout", () => {
  it("gives the expanded fill more area", () => {
    const kpi = fixtureAnswers.find((a) => a.id === "fx-kpi");
    const before = run(kpi, RECTS[0]);
    const after = run(kpi, RECTS[0], { expanded: ["fx-k2"] });
    const a = before.cells.find((c) => c.fillId === "fx-k2");
    const b = after.cells.find((c) => c.fillId === "fx-k2");
    expect(b.w * b.h).toBeGreaterThan(a.w * a.h);
  });
});

describe("phone stacking", () => {
  for (const answer of ALL) {
    it(`${answer.id}: single column, ordered by weight, no gaps`, () => {
      const rect = { x: 0, y: 0, w: 390, h: 700 };
      const L = layoutStage({ rect, fills: answer.fills, measure: fakeMeasure, viewportW: 390 });
      expect(L.mode).toBe("stack");
      let y = 0;
      let lastW = Infinity;
      for (const c of L.cells) {
        expect(c.x).toBe(0);
        expect(c.w).toBe(390);
        expect(c.y).toBe(y);
        y += c.h;
        const w = answer.fills.find((f) => f.id === c.fillId).weight;
        // Logos ride directly behind the KPI they name, whatever their own weight.
        if (c.kind !== "logos") { expect(w).toBeLessThanOrEqual(lastW); lastW = w; }
        if (c.kind === "media") expectMedia(c, answer);
      }
      expect(L.strokes.every((s) => s.axis === "h")).toBe(true);
      expect(L.cells.length).toBe(answer.fills.length);
    });
  }
});

describe("stroke diff", () => {
  it("keeps the root cut across answers and splits the rest", () => {
    const a = run(fixtureHome, RECTS[0]);
    const b = run(fixtureAnswers[0], RECTS[0]);
    const d = diffStrokes(a.strokes, b.strokes);
    expect(d.kept.length + d.removed.length).toBe(a.strokes.length);
    expect(d.kept.length + d.added.length).toBe(b.strokes.length);
    const same = diffStrokes(a.strokes, a.strokes);
    expect(same.added.length + same.removed.length).toBe(0);
  });
});

describe("expanded media", async () => {
  const { focusAnswer } = await import("../focus.js");
  it("gives the expanded media the largest cell, at its own aspect, with explain + kpi beside it", () => {
    const media = fixtureAnswers.find((a) => a.id === "fx-media");
    const A = focusAnswer(media, "fx-m-vid");
    const L = run(A, RECTS[0]);
    const m = L.cells.find((c) => c.fillId === "fx-m-vid");
    for (const c of L.cells) expect(m.w * m.h).toBeGreaterThanOrEqual(c.w * c.h);
    expect(m.spec.box.crop).toBeLessThanOrEqual(MEDIA.coverCrop + 1e-6);
    const ids = L.cells.map((c) => c.fillId);
    expect(ids).toContain("fx-m-vid~explain");
    expect(ids).toContain("fx-m-vid~kpi");
  });
});

describe("logos and breakdowns", () => {
  const A = fixtureAnswers.find((a) => a.id === "fx-logos");
  for (const rect of RECTS) {
    it(`logos sit with their KPI @ ${rect.w}x${rect.h}`, () => {
      const L = run(A, rect);
      const kpi = L.cells.find((c) => c.fillId === "fx-l-live");
      const logos = L.cells.find((c) => c.fillId === "fx-l-logos");
      if (kpi.attach) expect(kpi.attach.fillId).toBe("fx-l-logos");
      else {
        // adjacent: they share an edge
        const shareV = (kpi.x + kpi.w === logos.x || logos.x + logos.w === kpi.x) && Math.min(kpi.y + kpi.h, logos.y + logos.h) > Math.max(kpi.y, logos.y);
        const shareH = (kpi.y + kpi.h === logos.y || logos.y + logos.h === kpi.y) && Math.min(kpi.x + kpi.w, logos.x + logos.w) > Math.max(kpi.x, logos.x);
        expect(shareV || shareH).toBe(true);
      }
      const s = L.cells.find((c) => c.fillId === "fx-l-sessions");
      expect(["rows", "bar", undefined]).toContain(s.spec.breakdown);
    });
  }
});

describe("insets only with an evidence link", () => {
  const long = "Placeholder prose long enough to be an inset candidate. ".repeat(6);
  const kpi = { kind: "kpi", id: "k", weight: 0.4, value: "13,981", label: "sessions", receipts: [] };
  for (const rect of RECTS) {
    it(`no inset without evidence @ ${rect.w}`, () => {
      const L = run({ fills: [{ kind: "prose", id: "p", weight: 0.9, text: long }, kpi, { kind: "title", id: "t", weight: 0.5, text: "Title" }] }, rect);
      expect(L.cells.some((c) => c.inset)).toBe(false);
    });
    it(`an inset, when it happens, is evidence the prose cites @ ${rect.w}`, () => {
      const L = run({ fills: [{ kind: "prose", id: "p", weight: 0.9, text: long, evidence: ["k"] }, kpi, { kind: "title", id: "t", weight: 0.5, text: "Title" }] }, rect);
      for (const c of L.cells) if (c.inset) expect(c.fillId === "p" && c.inset.fillId === "k").toBe(true);
    });
  }
});

describe("the lead fill gets the most room; numbers never in slivers", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const url = await import("node:url");
  const DATA = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../data");
  const decks = fs.existsSync(path.join(DATA, "decks.json")) ? JSON.parse(fs.readFileSync(path.join(DATA, "decks.json"), "utf8")) : [];
  for (const d of [...decks, ...fixtureAnswers]) {
    for (const rect of RECTS) {
      it(`${d.id} @ ${rect.w}x${rect.h}`, () => {
        const L = run(d, rect);
        const lead = [...d.fills].sort((a, b) => b.weight - a.weight || (a.id < b.id ? -1 : 1))[0];
        const c = L.cells.find((x) => x.fillId === lead.id);
        if (c) for (const o of L.cells) expect(c.w * c.h, `${lead.id} vs ${o.fillId}`).toBeGreaterThanOrEqual(o.w * o.h);
        for (const k of L.cells.filter((x) => x.kind === "kpi")) expect(k.w / k.h, k.fillId).toBeGreaterThanOrEqual(0.6);
      });
    }
  }
});

describe("at most one Go deeper per target deck", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const url = await import("node:url");
  const { dedupeOpens } = await import("../focus.js");
  const DATA = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../data");
  const decks = fs.existsSync(path.join(DATA, "decks.json")) ? JSON.parse(fs.readFileSync(path.join(DATA, "decks.json"), "utf8")) : [];
  for (const d of [...decks, ...fixtureAnswers]) {
    it(d.id, () => {
      const A = dedupeOpens(d);
      for (const rect of RECTS) {
        const L = run(A, rect);
        const shown = L.cells.map((c) => A.fills.find((f) => f.id === c.fillId)).filter((f) => f?.opens);
        const per = {};
        for (const f of shown) per[f.opens] = (per[f.opens] || 0) + 1;
        for (const [t, n] of Object.entries(per)) expect(n, `${t} on ${rect.w}`).toBeLessThanOrEqual(1);
      }
    });
  }
});

describe("phone: type never grows going down the stack", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const url = await import("node:url");
  const { homeWithTiles } = await import("../tiles.js");
  const { stackTypeSize } = await import("./layout.js");
  const DATA = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../data");
  const load = (f) => (fs.existsSync(path.join(DATA, f)) ? JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8")) : null);
  const home = load("home.json"), cases = load("case-studies.json") || [], decks = load("decks.json") || [];
  const answers = [...decks];
  if (home && cases.length) {
    const h = { ...home, fills: home.fills.map((f) => (f.kind === "media" ? { ...f, caseStudy: cases.find((c) => f.src.startsWith(`assets/${c.id}/`))?.id } : f)) };
    answers.unshift(homeWithTiles(h, cases));
  }
  for (const A of answers) {
    for (const w of [390, 430]) {
      it(`${A.id} @ ${w}`, () => {
        const L = layoutStage({ rect: { x: 0, y: 0, w, h: 844 }, fills: A.fills, measure: fakeMeasure, viewportW: w, split: A.split });
        let prev = Infinity;
        for (const c of L.cells) { const s = stackTypeSize(c); if (s == null) continue; expect(s, c.fillId).toBeLessThanOrEqual(prev); prev = s; }
        if (A.split) expect(L.cells.slice(1, 4).every((c) => c.kind === "tile")).toBe(true); // case studies right after the wordmark
      });
    }
  }
});

describe("type weights are locked per role (priority changes size only)", async () => {
  const { TILE, TILE_FONT, KPI_FONT, TILE_ROLE_FONT } = await import("./typo.js");
  it("one weight for every hook size, every metric size", () => {
    expect(new Set(TILE.steps.map((s) => TILE_FONT(s.size).weight)).size).toBe(1);
    expect(new Set([28, 48, 72, 92].map((s) => KPI_FONT(s).weight)).size).toBe(1);
    expect(TILE_ROLE_FONT.weight).toBeTypeOf("number");
  });
});

describe("Proof only where it's real", async () => {
  const { hasRealProof } = await import("./fit.js");
  const caseFile = { type: "asset", ref: "src/data/chekoutData.js", label: "ChekOut AI case study" };
  it("hides a lone case-study data pointer", () => {
    expect(hasRealProof({ kind: "prose", receipts: [caseFile] })).toBe(false);
    expect(hasRealProof({ kind: "prose", receipts: [] })).toBe(false);
  });
  it("shows commits, urls, previews, records, or 2+ sources", () => {
    expect(hasRealProof({ kind: "kpi", receipts: [caseFile, { type: "commit", ref: "abc1234", repo: "x" }] })).toBe(true);
    expect(hasRealProof({ kind: "kpi", receipts: [{ type: "asset", ref: "a.webp", url: "https://x.y" }] })).toBe(true);
    expect(hasRealProof({ kind: "kpi", receipts: [{ type: "asset", ref: "a.webp", preview: { src: "a.gif", aspect: 1 } }] })).toBe(true);
    expect(hasRealProof({ kind: "kpi", receipts: [{ type: "record", ref: "rec-1" }] })).toBe(true);
    expect(hasRealProof({ kind: "kpi", receipts: [{ type: "asset", ref: "a.webp" }, { type: "asset", ref: "b.webp" }] })).toBe(true);
    expect(hasRealProof({ kind: "kpi", receipts: [{ type: "asset", ref: "a.webp" }] })).toBe(false);
  });
});

describe("Source: two receipts, strongest first, or one polite line", async () => {
  const { sourcesOf, emptyLine, EMPTY_LINES, SOURCE_CAP, receiptsListH } = await import("./fit.js");
  const img = { type: "asset", ref: "assets/chekout/cover.webp", label: "cover" };
  const commit = { type: "commit", ref: "abc1234", repo: "x" };
  const link = { type: "asset", ref: "page", url: "https://example.com/" };
  const figma = { type: "asset", ref: "figma:abc#1:2", label: "FigJam" };
  const homeRecord = { type: "record", ref: "rec-1", url: "https://kyuri.namit.me/" };
  it("caps at two, in order image, commit, link, rest", () => {
    const s = sourcesOf({ id: "a", kind: "prose", receipts: [figma, link, commit, img] });
    expect(s.shown).toEqual([img, commit]);
    expect(s.rest).toEqual([link, figma]);
    expect(s.shown.length).toBeLessThanOrEqual(SOURCE_CAP);
    expect(s.line).toBe(null);
  });
  it("a tile's own media is not an image receipt, but keeps its link", () => {
    const self = { type: "asset", ref: "assets/chekout/cover.webp", url: "https://example.com/" };
    const s = sourcesOf({ id: "m", kind: "media", src: "assets/chekout/cover.webp", receipts: [self, commit] });
    expect(s.shown).toEqual([commit, self]);
  });
  it("no image, commit or public link: one line, the same every time", () => {
    const f = { id: "rec-x-p", kind: "prose", receipts: [homeRecord, figma] };
    const s = sourcesOf(f);
    expect(s.shown).toEqual([]);
    expect(EMPTY_LINES).toContain(s.line);
    expect(sourcesOf(f).line).toBe(emptyLine(f));
    expect(receiptsListH(f, null, 320)).toBeGreaterThan(0);
  });
  it("a media tile never says it has no screengrab; lines carry no dashes", () => {
    for (let i = 0; i < 40; i++) expect(emptyLine({ id: `m${i}`, kind: "media" })).not.toMatch(/screengrab/);
    for (const l of EMPTY_LINES) expect(l).not.toMatch(/[—–]/);
  });
});

describe("spatial keyboard navigation", async () => {
  const { neighbor, readingOrder } = await import("./nav.js");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const url = await import("node:url");
  const DATA = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../data");
  const decks = fs.existsSync(path.join(DATA, "decks.json")) ? JSON.parse(fs.readFileSync(path.join(DATA, "decks.json"), "utf8")) : [];
  it("moves to the adjacent cell on a known grid", () => {
    const cells = [
      { fillId: "a", x: 0, y: 0, w: 100, h: 100 }, { fillId: "b", x: 100, y: 0, w: 100, h: 50 },
      { fillId: "c", x: 100, y: 50, w: 100, h: 50 }, { fillId: "d", x: 0, y: 100, w: 200, h: 50 },
    ];
    expect(neighbor(cells, "a", "right")).toBe("b");
    expect(neighbor(cells, "b", "down")).toBe("c");
    expect(neighbor(cells, "c", "left")).toBe("a");
    expect(neighbor(cells, "a", "down")).toBe("d");
    expect(neighbor(cells, "d", "up")).toBe("a");
    expect(neighbor(cells, "a", "left")).toBe(null);
    expect(readingOrder(cells)).toEqual(["a", "b", "c", "d"]);
  });
  for (const d of decks) {
    it(`every cell of ${d.id} is reachable by arrows, moves are geometric`, () => {
      const L = run(d, RECTS[1]);
      const seen = new Set([L.cells[0].fillId]);
      const queue = [L.cells[0].fillId];
      while (queue.length) {
        const id = queue.shift();
        const a = L.cells.find((c) => c.fillId === id);
        for (const dir of ["left", "right", "up", "down"]) {
          const n = neighbor(L.cells, id, dir);
          if (!n) continue;
          const b = L.cells.find((c) => c.fillId === n);
          if (dir === "right") expect(b.x).toBeGreaterThanOrEqual(a.x + a.w - 1);
          if (dir === "left") expect(b.x + b.w).toBeLessThanOrEqual(a.x + 1);
          if (dir === "down") expect(b.y).toBeGreaterThanOrEqual(a.y + a.h - 1);
          if (dir === "up") expect(b.y + b.h).toBeLessThanOrEqual(a.y + 1);
          if (!seen.has(n)) { seen.add(n); queue.push(n); }
        }
      }
      expect(seen.size).toBe(L.cells.length);
    });
  }
});
