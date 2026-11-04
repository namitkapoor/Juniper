#!/usr/bin/env node
/**
 * Live status per Namit, 2026-11-03: KivaKube, Pacific Soul Foods and Nuthatch
 * Naturals still run the agent; Rosendahl and the other stores have taken it down.
 * (A raw-HTML check can't see it: the embed loads client-side.) So: run on 8,
 * Copy names only the 3 live stores as live and never says which stores took it
 * down (Namit: Rosendahl is one of the best data points, so it stays, neutrally).
 */
import { readFileSync, writeFileSync } from "node:fs";

const SWAPS = [
  ["a shopping agent that is live on 8 merchants' stores", "a shopping agent that has run on 8 merchants' stores"],
  ["An AI shopping agent I designed and built, live on 8 merchants' stores, that answers shoppers from each store's own catalog.",
    "An AI shopping agent I designed and built that has run on 8 merchants' stores, answering shoppers from each store's own catalog."],
  ["An AI shopping agent, live on 8 stores, answering from each store's catalog.", "An AI shopping agent that has run on 8 stores, answering from each store's catalog."],
  ["CURRENTLY: Co-founder of ChekOut AI, designing and building the shopping agent live on 8 merchants' stores.",
    "CURRENTLY: Co-founder of ChekOut AI, designing and building a shopping agent that has run on 8 merchants' stores."],
  ["Recorded on a merchant's live store, the agent answers", "Recorded on a merchant's store, the agent answers"],
  ["Rosendahl's live store: a shopper asks", "Rosendahl's store: a shopper asks"],
  ["A full conversation on Rosendahl's live store", "A full conversation on Rosendahl's store"],
  ["Rosendahl on desktop, recorded on the live store", "Rosendahl on desktop, recorded on the store"],
  ["Rosendahl on a phone, recorded on the live store", "Rosendahl on a phone, recorded on the store"],
  ["in the widget on the live store", "in the widget on the store"],
  ["Søren, the agent live on Rosendahl Design Group.", "Søren, the agent on Rosendahl Design Group."],
  ["The homepage loads the embed with the agent id rosendahl-design-group.", "The homepage loaded the embed with the agent id rosendahl-design-group."],
  ["Four of the live stores can be checked from the outside: each homepage loads the ChekOut embed with its own agent id.",
    "The agent is live on KivaKube, Pacific Soul Foods and Nuthatch Naturals, and has run on 8 merchants' stores since February 2026, Rosendahl Design Group among them."],
  ["LIVE ON · 4 OF 8 SHOWN", "4 OF 8 STORES SHOWN"],
];
// No question renames: "Which stores is it live on?" is still a fair question.
const QUESTIONS = [];

const files = ["src/data/decks.json", "src/data/corpus.json", "src/data/case-studies.json", "src/data/home.json", "private/gated.json"];
const hits = new Map(SWAPS.map(([a]) => [a, 0]));
for (const file of files) {
  let j;
  try { j = JSON.parse(readFileSync(file, "utf8")); } catch { continue; }
  const walk = (x) => {
    if (Array.isArray(x)) { x.forEach((v, i) => { if (typeof v === "string") x[i] = fix(v); else walk(v); }); return; }
    if (!x || typeof x !== "object") return;
    for (const [old, neu] of QUESTIONS) if (x.question === old) {
      x.question = neu;
      x.aliases = [...new Set([...(x.aliases || []), old])];
    }
    for (const k of Object.keys(x)) if (typeof x[k] === "string") x[k] = fix(x[k]); else walk(x[k]);
  };
  const fix = (s) => { for (const [a, b] of SWAPS) if (s.includes(a)) { s = s.split(a).join(b); hits.set(a, hits.get(a) + 1); } return s; };
  walk(j);
  writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
}
for (const [a, n] of hits) console.log(String(n).padStart(3), a.slice(0, 70));
