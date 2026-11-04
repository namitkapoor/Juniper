#!/usr/bin/env node
/**
 * Namit, 2026-11-03: drop the "other stores were 2 to 8%" comparison; it doesn't help.
 * Rosendahl's 77% stands alone. The opened rows become the merchant spread by
 * sessions (share of all 16,841), with no per-store follow-up rates.
 */
import { readFileSync, writeFileSync } from "node:fs";
const TOTAL = 16841, L = "assets/chekout/logos/";
const row = (label, n, logo) => ({ label, value: n.toLocaleString("en-US"), share: +(n / TOTAL).toFixed(4), ...(logo ? { logo: L + logo } : {}) });
const breakdown = [
  row("KivaKube", 6756, "kivakube.webp"), row("Mae Bridal", 2347), row("Blackcat MFG", 1990),
  row("Nuthatch Naturals", 1977, "nuthatch.webp"), row("Billest", 1466), row("Pacific Soul Foods", 1093, "pacsoul.webp"),
  row("Rosendahl (furniture)", 132, "rosendahl.webp"), row("Apparel Online", 11),
];
const fix = (x) => {
  if (x.kind === "kpi" && (x.id === "ck-sessions" || x.id === "u-ck-sessions")) {
    x.label = "of Rosendahl's shoppers asked a follow-up question";
    x.breakdown = breakdown;
    delete x.breakdownOf;
    x.breakdownHead = "Sessions by store";
  }
  if (typeof x.text === "string") x.text = x.text.replace("77% of shoppers asked a follow-up question; at the other stores it was 2 to 8%.", "77% of shoppers asked a follow-up question.");
};
for (const f of ["src/data/decks.json", "src/data/corpus.json"]) {
  const j = JSON.parse(readFileSync(f, "utf8"));
  const walk = (x) => { if (Array.isArray(x)) return x.forEach(walk); if (x && typeof x === "object") { fix(x); Object.values(x).forEach(walk); } };
  walk(j); writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
}
