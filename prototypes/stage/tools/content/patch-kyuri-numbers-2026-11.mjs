#!/usr/bin/env node
/**
 * Kyuri numbers beyond applications (Namit, 2026-11-03): lead with what the system
 * made and how it is tested; keep interviews as the outcome; tell the failure story.
 * Sources (kyuri-dashboard):
 *  - lib/proof.ts: RESUMES_TOTAL 475, PEOPLE 5 (snapshot 2026-10-15)
 *  - local-server/evals/cases/agent_cases.json: 17 model-run cases (4 adversarial)
 *  - local-server/evals/fixtures/guard_cases.json: 64 leak-guard cases
 *  - local-server/evals/README.md: lint, Resume QA, leak guard, page gate and upload
 *    guard can each stop a resume (fit gate and keyword loop only steer)
 *  - HANDOFF.md:176: the sweep of past resumes (4 notes printed, 5 empty summary,
 *    6 changed titles, 4 invented numbers). Rebuilding those is still open: don't claim it.
 */
import { readFileSync, writeFileSync } from "node:fs";

const KD = "kyuri-dashboard";
const R = {
  proof: { type: "asset", ref: "lib/proof.ts", repo: KD, date: "2026-10-15", label: "RESUMES_TOTAL 475 across 5 people" },
  agentCases: { type: "asset", ref: "local-server/evals/cases/agent_cases.json", repo: KD, label: "17 agent eval cases that run the real model, 4 adversarial" },
  guardCases: { type: "asset", ref: "local-server/evals/fixtures/guard_cases.json", repo: KD, label: "64 leak-guard cases" },
  evalsReadme: { type: "asset", ref: "local-server/evals/README.md", repo: KD, label: "What now guards a resume, in pipeline order" },
  sweep: { type: "asset", ref: "HANDOFF.md", repo: KD, label: "Sweep of past resumes: 4 notes printed, 5 empty summary, 6 changed titles, 4 invented numbers" },
};
const MADE = { value: "475", label: "tailored resumes, for 5 people", period: "MAY TO OCT 2026", receipts: [R.proof] };
const EVALS = { value: "81", label: "eval cases on the resume agent: 17 real model runs (4 adversarial) and 64 leak-guard cases", receipts: [R.agentCases, R.guardCases] };
const STOPS = { value: "5", label: "checks that can stop a resume before it's sent: lint, QA, leak guard, page gate and upload guard", receipts: [R.evalsReadme] };
const SWEEP = {
  kind: "prose", id: "ky-sweep", weight: 0.6,
  text: "WHAT A SWEEP FOUND: Run over my past resumes, the new checks found 4 with the agent's notes printed, 5 with an empty summary, 6 with a changed job title and 4 with a number my base resume doesn't have. Each of those now stops a resume before it's sent.",
  receipts: [R.sweep, R.evalsReadme],
};

const SWAPS = [
  ["454 roles captured and 341 applied as of Nov 2026.", "475 tailored resumes for 5 people, and 81 eval cases on the agent."],
  ["My own job search, built as a system: 454 roles captured and 341 applications logged since April 2026, with guards on every AI-written resume.",
    "My own job search, built as a system: 475 tailored resumes for 5 people since May 2026, with 5 checks that can stop any AI-written resume."],
  ["(454 roles captured, 341 marked applied, 9 interviewed, 475 resumes across all users)", "(475 resumes for 5 people, 9 interviewed from 341 applications; 81 eval cases on the resume agent)"],
  ["as of Nov 2, 2026 the public Job Hunt page shows 454 roles captured, 341 marked applied and 9 that reached interviews",
    "it has tailored 475 resumes for 5 people, 81 eval cases test the resume agent, and as of Nov 2, 2026 the public Job Hunt page shows 9 interviews from 341 applications"],
];

const fix = (x) => {
  if (x.kind === "kpi" && (x.id === "ky-captured" || x.id === "u-ky-cap")) Object.assign(x, MADE, { id: x.id === "ky-captured" ? "ky-made" : "u-ky-made", weight: 0.85 });
  if (x.kind === "kpi" && (x.id === "ky-sent" || x.id === "u-ky-sent")) Object.assign(x, EVALS, { id: x.id === "ky-sent" ? "ky-evals" : "u-ky-evals" }), delete x.period;
  if (x.kind === "kpi" && (x.id === "ky-interviews" || x.id === "u-ky-int")) x.label = "interview invites from 341 applications";
  if (x.kind === "kpi" && x.id === "ky-checks") Object.assign(x, STOPS);
  // A media fill that points at a renamed KPI follows it.
  if (x.kind === "media" && x.kpi === "u-ky-cap") x.kpi = "u-ky-made";
  if (x.kind === "media" && x.kpi === "ky-captured") x.kpi = "ky-made";
  if (x.id === "ky-guards" && Array.isArray(x.fills) && !x.fills.some((f) => f.id === "ky-sweep")) x.fills.splice(x.fills.findIndex((f) => f.id === "ky-incident") + 1, 0, SWEEP);
  if (x.id === "kyuri-os" && x.metric) x.metric = { value: "475", label: "tailored resumes, for 5 people", source: "kyuri-dashboard lib/proof.ts RESUMES_TOTAL 475, PEOPLE 5 (2026-10-15)" };
};
const str = (s) => { for (const [a, b] of SWAPS) if (s.includes(a)) s = s.split(a).join(b); return s; };
for (const f of ["src/data/decks.json", "src/data/corpus.json", "src/data/case-studies.json", "src/data/home.json"]) {
  const j = JSON.parse(readFileSync(f, "utf8"));
  const walk = (x) => {
    if (Array.isArray(x)) { x.forEach((v, i) => (typeof v === "string" ? (x[i] = str(v)) : walk(v))); return; }
    if (!x || typeof x !== "object") return;
    fix(x);
    for (const k of Object.keys(x)) if (typeof x[k] === "string") x[k] = str(x[k]); else walk(x[k]);
  };
  walk(j);
  writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
}
