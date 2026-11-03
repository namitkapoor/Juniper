// Load-modify-save: the white FigJam exports become dark hairline SVGs (tools/content/arch-ck.py,
// light variants by svg-light.mjs). The export stays as the tile's Source receipt.
// Run after patch-arch, patch-backend, patch-drill and patch-distinct (they still write the .webp srcs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src/data");
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");
export const SWAPS = {
  "assets/chekout/architecture.webp": { src: "assets/chekout/system-context.svg", aspect: 2.0253, board: "FigJam: 1 · System context" },
  "assets/chekout/onboarding.webp": { src: "assets/chekout/onboarding-flow.svg", aspect: 2.5, board: "FigJam: 2 · Onboarding & agent builder" },
  "assets/chekout/data-flow.webp": { src: "assets/chekout/data-observability.svg", aspect: 2.0253, board: "FigJam: 5 · Data & observability" },
};
const reword = (t) => t && t.replace(/Blue is my work/g, "Solid boxes are mine; dashed are a teammate's or an outside service");
let n = 0;
function fix(f) {
  const s = f.kind === "media" && SWAPS[f.src];
  if (!s) return;
  const old = f.src;
  f.src = s.src; f.aspect = s.aspect;
  f.receipts = (f.receipts || []).filter((r) => r.ref !== old);
  f.receipts.unshift({ type: "asset", ref: old, label: `The FigJam export this is redrawn from (${s.board.replace(/^FigJam: /, "")})` });
  f.caption = reword(f.caption); f.explain = reword(f.explain);
  n++;
}
for (const file of ["decks.json", "corpus.json"]) {
  const v = load(file);
  for (const a of v) for (const f of a.fills) fix(f);
  save(file, v);
}
console.log(`swapped ${n} fills`);
