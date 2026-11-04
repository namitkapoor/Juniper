#!/usr/bin/env node
/**
 * Hover kickers (Namit, 2026-11-03): "not every tile should read impact". The hovered
 * case's own tile keeps "· impact"; every other tile names what its number measures.
 */
import { readFileSync, writeFileSync } from "node:fs";
const TAGS = {
  "ap-time": "setup time", "ck-sessions": "engagement", "ap-contrast": "accessibility", "ap-prompts": "build",
  "ck-atc": "sales", "cv-conv": "conversion", "cv-rev": "revenue", "cv-hours": "time saved",
  "ky-made": "output", "ky-evals": "evals", "ky-interviews": "interviews", "ky-checks": "guardrails", "ky-build-boards-n": "job boards",
};
const f = "src/data/decks.json";
const j = JSON.parse(readFileSync(f, "utf8"));
let n = 0;
for (const d of j) for (const x of d.fills) if (x.kind === "kpi" && TAGS[x.id]) { x.tag = TAGS[x.id]; n++; }
writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
console.log("tagged", n);
