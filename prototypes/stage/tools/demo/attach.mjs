// Attach built demos to receipts in src/data/decks.json as Receipt.preview.
// By default each demo becomes its own asset receipt on the fill it backs; `receipt` gives
// that new receipt explicitly (e.g. the commit that shipped the UI); `onReceipt` puts the
// preview on a receipt already there. Idempotent: re-running replaces by ref.
// Light variants (NAME-light.gif/.webp) sit next to each file; the schema has one src, so
// a light theme can swap by that suffix.
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
  // KivaKube: avatar ("Herb", a photo of a person) approved by Namit 2026-11-02
  { deck: "ck-d-live-stores", fill: "cklv-kiva", demo: "kivakube-mobile", date: "2026-10-27",
    label: "The agent answering on kivakube.com, recorded on a phone: best seller, then which one suits a small patio" },
  { deck: "ck-d-live", fill: "ckl-live", demo: "kivakube-mobile", date: "2026-10-27",
    label: "KivaKube on a phone, recorded on the live store: the agent recommends the KivaStand with product cards" },
  // The real merchant builder. Its "Regenerate from catalog" / "Analyzing your catalog" UI was
  // introduced in 9596ff6 (git log -S), so that commit is the receipt; fe5f2a1 is the Channels
  // iframe preview, which these captures do not show.
  { deck: "ck-d-builder", fill: "ckb-flow", demo: "builder-desktop",
    receipt: { type: "commit", ref: "9596ff6", repo: "chekoutai-frontend", date: "2026-07-16",
               label: "9596ff6 · Shopline connection state, prompt-gen fixes, dashboard + pricing polish" } },
  // The dashboard on KivaKube, captured Jul 27 2026: conversation logs + keywords, which 5264ce8 wired to BigQuery
  { deck: "ck-d-dashboard", fill: "ckd-data", demo: "dashboard-desktop", onReceipt: "5264ce8" },
];

const decks = JSON.parse(fs.readFileSync(DECKS, "utf8"));
let n = 0;
for (const a of ATTACH) {
  const info = JSON.parse(fs.readFileSync(path.join(ROOT, "public", DEMOS, `${a.demo}.json`), "utf8"));
  const deck = decks.find((d) => d.id === a.deck);
  const fill = deck?.fills.find((f) => f.id === a.fill);
  if (!fill) throw new Error(`no fill ${a.deck}/${a.fill}`);
  const gif = `${DEMOS}/${a.demo}.gif`;
  const preview = { src: gif, poster: `${DEMOS}/${a.demo}.webp`, aspect: +(info.gif.w / info.gif.h).toFixed(4),
                    frame: info.device === "laptop" ? "laptop" : info.device === "phone" ? "phone" : "none" };
  fill.receipts = fill.receipts || [];
  if (a.onReceipt) {
    // put the preview on a receipt that is already there (e.g. the commit that shipped what it shows)
    const r = fill.receipts.find((x) => x.ref === a.onReceipt);
    if (!r) throw new Error(`no receipt ${a.onReceipt} on ${a.deck}/${a.fill}`);
    r.preview = preview;
  } else {
    const receipt = a.receipt ? { ...a.receipt, preview } : { type: "asset", ref: gif, date: a.date, label: a.label, preview };
    fill.receipts = fill.receipts.filter((r) => r.ref !== receipt.ref);
    fill.receipts.push(receipt);
  }
  n++;
}
fs.writeFileSync(DECKS, JSON.stringify(decks, null, 2) + "\n");
console.log(`attached ${n} previews`);
