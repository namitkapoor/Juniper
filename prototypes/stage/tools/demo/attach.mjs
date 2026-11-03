// Attach built demos to receipts in src/data/decks.json as Receipt.preview.
// Each demo becomes its own asset receipt on the fill it backs (existing receipts are
// left alone: they describe other evidence). Idempotent: re-running replaces by ref.
// Reads public/<path>.json written by build.py for size; GIF is src, webp poster.
// Usage: node tools/demo/attach.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DECKS = path.join(ROOT, "src/data/decks.json");
const DEMOS = "assets/chekout/demos";

const ATTACH = [
  { deck: "ck-d-live", fill: "ckl-mobile", demo: "rosendahl-mobile", date: "2026-10-27",
    label: "Rosendahl on a phone, recorded on the live store: ask, product cards, follow-up, answer" },
  { deck: "ck-d-live", fill: "ckl-desktop", demo: "rosendahl-desktop", date: "2026-10-26",
    label: "Rosendahl on desktop, recorded on the live store: the agent opens product detail beside the thread" },
  { deck: "ck-d-live-stores", fill: "cklv-rosen", demo: "rosendahl-mobile", date: "2026-10-27",
    label: "The agent answering on rosendahl.com, recorded on a phone" },
  { deck: "ck-d-builder", fill: "ckb-color", demo: "generator-mobile", date: "2026-10-26",
    label: "My rebuild of ChekOut's sales demo: paste a store, the widget takes its one brand color and flips its text dark or light (stores other than KivaKube and Rosendahl are mockups)" },
  { deck: "ck-platform-build", fill: "ap-0-problem", demo: "generator-desktop", date: "2026-10-26",
    label: "My rebuild of ChekOut's sales demo: the same widget set on KivaKube's lime, Rosendahl's black and a mockup store's red" },
  // kivakube-mobile is built but NOT attached: its agent avatar is a photo of a person (open avatar question)
];

const decks = JSON.parse(fs.readFileSync(DECKS, "utf8"));
let n = 0;
for (const a of ATTACH) {
  const info = JSON.parse(fs.readFileSync(path.join(ROOT, "public", DEMOS, `${a.demo}.json`), "utf8"));
  const deck = decks.find((d) => d.id === a.deck);
  const fill = deck?.fills.find((f) => f.id === a.fill);
  if (!fill) throw new Error(`no fill ${a.deck}/${a.fill}`);
  const ref = `${DEMOS}/${a.demo}.gif`;
  const receipt = {
    type: "asset", ref, date: a.date, label: a.label,
    preview: { src: ref, poster: `${DEMOS}/${a.demo}.webp`, aspect: +(info.gif.w / info.gif.h).toFixed(4),
               frame: info.device === "laptop" ? "laptop" : info.device === "phone" ? "phone" : "none" },
  };
  fill.receipts = (fill.receipts || []).filter((r) => r.ref !== ref);
  fill.receipts.push(receipt);
  n++;
}
fs.writeFileSync(DECKS, JSON.stringify(decks, null, 2) + "\n");
console.log(`attached ${n} previews`);
