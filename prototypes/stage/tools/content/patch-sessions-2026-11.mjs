#!/usr/bin/env node
/**
 * ChekOut sessions, refreshed from PRODUCTION BigQuery on 2026-11-03
 * (production-aibuilder.chatbot_logs.conversations, via chekout-sessions.mjs).
 *
 * Leads with Rosendahl's follow-up rate; the merchant spread is the context.
 * A row is one shopper message, so a "follow-up" session has 2+ messages.
 *
 * Production, Feb 27 to Oct 31 2026: 16,841 sessions.
 *   Rosendahl 132 sessions, 102 with 2+ messages (77%), avg 3.1 messages
 *   Kiva(Kube) 6,756 / 119 · Mae Bridal 2,347 / 64 · Blackcat 1,990 / 167
 *   Nuthatch 1,977 / 38 · Billest 1,466 / 24 · Pacific Soul Foods 1,093 / 70
 */
import { readFileSync, writeFileSync } from "node:fs";

const TOTAL = 16841;
const L = "assets/chekout/logos/";
// Rate rows: value = sessions, bar + % = share of that store's sessions with a follow-up.
const row = (name, n, multi, logo) => ({
  label: name,
  value: n.toLocaleString("en-US"),
  share: +(multi / n).toFixed(4),
  ...(logo ? { logo: L + logo } : {}),
});
const breakdown = [
  row("Rosendahl (furniture)", 132, 102, "rosendahl.webp"),
  row("KivaKube", 6756, 119, "kivakube.webp"),
  row("Mae Bridal", 2347, 64),
  row("Blackcat MFG", 1990, 167),
  row("Nuthatch Naturals", 1977, 38, "nuthatch.webp"),
  row("Billest", 1466, 24),
  row("Pacific Soul Foods", 1093, 70, "pacsoul.webp"),
];
const receipt = {
  type: "asset",
  ref: "tools/content/chekout-sessions.mjs",
  repo: "Juniper",
  date: "2026-11-03",
  label: "ChekOut production BigQuery: 16,841 sessions, Feb 27 to Oct 31 2026; Rosendahl 102 of 132 sessions had 2+ shopper messages",
};
const lead = {
  value: "77%",
  label: "of Rosendahl's shoppers asked a follow-up question. At the other stores it was 2 to 8%.",
  period: "JUL 29 TO OCT 31, 2026 · 102 OF 132 SESSIONS",
  breakdown,
  breakdownOf: "rate",
  breakdownHead: "Sessions · asked a follow-up",
  breakdownNote: `All 8 stores: ${TOTAL.toLocaleString("en-US")} sessions since Feb 2026`,
};
// Rosendahl's own dashboard on launch day backs the same engagement story.
const dash = { type: "asset", ref: "assets/chekout/top-metrics.webp", repo: "Juniper", label: "Rosendahl's ChekOut dashboard on launch day: 86% engagement" };
const keepCaseStudy = (rs) => [...rs.filter((r) => r.ref === "src/data/chekoutData.js"), receipt, dash];

function patch(file, fn) {
  const j = JSON.parse(readFileSync(file, "utf8"));
  let n = 0;
  const walk = (x) => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (x && typeof x === "object") { if (fn(x)) n++; Object.values(x).forEach(walk); }
  };
  walk(j);
  writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
  console.log(file, n, "patched");
}

const fix = (o) => {
  if (o.kind === "kpi" && (o.id === "ck-sessions" || o.id === "u-ck-sessions")) {
    Object.assign(o, lead, { receipts: keepCaseStudy(o.receipts || []) });
    return true;
  }
  if (o.kind === "kpi" && o.id === "oa-ck") {
    Object.assign(o, { value: "16,841", label: "shopper sessions with the ChekOut agent", period: "Feb to Oct 2026" });
    return true;
  }
  if (typeof o.text === "string" && o.text.startsWith("From February to July 2026 the ChekOut agent ran 13,981")) {
    o.text = "From February to October 2026 the ChekOut agent ran 16,841 shopper sessions across 8 merchants' stores. At Rosendahl Design Group, a furniture store, 77% of shoppers asked a follow-up question; at the other stores it was 2 to 8%.";
    return true;
  }
  if (o.type === "asset" && o.ref === "memory/project_chekout_metrics.md" && /13,981/.test(o.label || "")) {
    Object.assign(o, receipt);
    return true;
  }
  return false;
};

patch("src/data/decks.json", fix);
patch("src/data/corpus.json", fix);
