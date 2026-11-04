#!/usr/bin/env node
/**
 * Durations for the two headline numbers, and the Australia insight (Namit, 2026-11-03):
 *  - KivaKube's 20% of add-to-carts was measured over one month.
 *  - Christine Valmy's 10% → 23% conversion was over 3 months.
 *  - The Australia shoppers were KivaKube's (prod BigQuery: 18 sessions from Australia).
 */
import { readFileSync, writeFileSync } from "node:fs";

const SWAPS = [
  ["20% of Kivakube's add-to-carts came through the agent.", "20% of Kivakube's add-to-carts in one month came through the agent."],
  ["20% of Kivakube's add-to-carts came through it.", "20% of Kivakube's add-to-carts in one month came through it."],
  ["20% of Kivakube's add-to-carts came through the ChekOut agent.", "20% of Kivakube's add-to-carts in one month came through the ChekOut agent."],
  ["(20% of Kivakube's add-to-carts)", "(20% of Kivakube's add-to-carts in one month)"],
  ["took visitor conversion from 10% to 23%.", "took visitor conversion from 10% to 23% over 3 months."],
  ["took conversion from 10% to 23%.", "took conversion from 10% to 23% over 3 months."],
  ["conversion 10% → 23%, $120K", "conversion 10% → 23% over 3 months, $120K"],
  ["2 to 8%.", "2 to 8%. KivaKube's chat logs showed potential customers as far away as Australia."],
];
const UNIT_TEXT = /^From February to October 2026 the ChekOut agent ran 16,841/;

const AUS = {
  kind: "prose",
  id: "ck-aus",
  weight: 0.55,
  text: "WHAT THE CHATS SHOWED: The agent logs where each chat comes from, and KivaKube's logs showed potential customers as far away as Australia.",
  receipts: [{
    type: "asset",
    ref: "tools/content/chekout-sessions.mjs",
    repo: "Juniper",
    date: "2026-11-03",
    label: "ChekOut production BigQuery: KivaKube sessions by customer_country, Australia among them",
  }],
};

function patch(file, fn) {
  const j = JSON.parse(readFileSync(file, "utf8"));
  const walk = (x) => {
    if (Array.isArray(x)) { x.forEach((v, i) => (typeof v === "string" ? (x[i] = str(v)) : walk(v))); return; }
    if (!x || typeof x !== "object") return;
    fn(x);
    for (const k of Object.keys(x)) if (typeof x[k] === "string") x[k] = str(x[k]); else walk(x[k]);
  };
  // The "2 to 8%" swap is only for the corpus unit's running text, never the KPI label.
  const str = (s) => {
    for (const [a, b] of SWAPS) {
      if (a === "2 to 8%." && !UNIT_TEXT.test(s)) continue;
      if (s.includes(a) && !s.includes(b)) s = s.split(a).join(b);
    }
    return s;
  };
  walk(j);
  writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
}

const kpis = (x) => {
  if (x.kind === "kpi" && (x.id === "ck-atc" || x.id === "u-ck-atc")) x.period = "OVER ONE MONTH";
  if (x.kind === "kpi" && x.id === "cv-conv") x.period = "OVER 3 MONTHS";
  // Case-study tile metrics carry no period field; the label says it.
  if (x.metric?.value === "20%") x.metric.label = "of KivaKube's add-to-carts in one month, via the agent";
  if (x.metric?.value === "10% → 23%") x.metric.label = "conversion, 3 months";
  if (x.id === "ck-merchant-outcomes" && Array.isArray(x.fills) && !x.fills.some((f) => f.id === "ck-aus")) {
    x.fills.splice(x.fills.findIndex((f) => f.id === "ck-sessions") + 1, 0, AUS);
  }
};
for (const f of ["src/data/decks.json", "src/data/corpus.json", "src/data/case-studies.json", "src/data/home.json", "src/data/about.json"]) patch(f, kpis);
