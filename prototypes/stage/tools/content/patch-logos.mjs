// Load-modify-save: adds the LIVE ON logos fill and the sessions breakdown.
import fs from "node:fs";
const D = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");

const CHECKED = "2026-11-02";
// Live = the store's homepage HTML loads chekout.ai/chatbot.js with an agent id, fetched on CHECKED.
const LIVE = [
  { name: "KivaKube", file: "kivakube", aspect: 7.3394, url: "https://www.kivakube.com/", agent: "kiva" },
  { name: "Rosendahl Design Group", file: "rosendahl", aspect: 1.5474, url: "https://www.rosendahl.com/", agent: "rosendahl-design-group" },
  { name: "Pacific Soul Foods", file: "pacsoul", aspect: 1.9704, url: "https://pacsoulfoods.com/", agent: "pacsoulfoods" },
  { name: "Nuthatch Naturals", file: "nuthatch", aspect: 1.0051, url: "https://nuthatchnaturals.com/", agent: "nuthatch-naturals" },
];
const liveReceipt = (m) => ({
  type: "asset",
  ref: `storefront:${new URL(m.url).hostname.replace(/^www\./, "")}`,
  url: m.url,
  date: CHECKED,
  label: `Homepage loads chekout.ai/chatbot.js with data-agent-id="${m.agent}", checked ${CHECKED}`,
});
const AP = { type: "asset", ref: "src/data/agentPlatformData.js", repo: "Juniper", date: "2026-10-26", label: "Agent platform case study · Client: ChekOut AI (8 merchants live)" };
const logosFill = (id, weight) => ({
  kind: "logos",
  id,
  weight,
  label: `LIVE ON · ${LIVE.length} OF 8 SHOWN`,
  items: LIVE.map((m) => ({ name: m.name, src: `assets/chekout/logos/${m.file}.webp`, aspect: m.aspect, url: m.url })),
  receipts: [AP, ...LIVE.map(liveReceipt), { type: "asset", ref: "public/images/Case Studies/CK/clients/logos/", repo: "Juniper", label: "Merchant logo files (kivakube, rosendahl, pacsoul, nuthatch)" }],
});

// Sessions: the only per-merchant number on file is Kivakube's.
const METRICS = {
  type: "asset",
  ref: "memory/project_chekout_metrics.md",
  repo: "Claude memory (Juniper project)",
  date: "2026-07-04",
  label: "Prod Databricks: 13,981 conversations across 22 brands Feb 27 to Jul 4 2026; Kivakube 6,124 May 4 to Jul 4, ~44% of all",
};
const breakdown = [{ label: "KivaKube (May 4 to Jul 4)", value: "6,124", share: 0.44, logo: "assets/chekout/logos/kivakube.webp" }];

function patch(fills, logosId, logosWeight) {
  for (const f of fills) {
    if (f.kind === "kpi" && f.value === "13,981") {
      f.label = "shopper sessions across 22 brands"; // the source says 22 brands, not live stores
      f.breakdown = breakdown;
      if (!f.receipts.some((r) => r.ref === METRICS.ref)) f.receipts.push(METRICS);
    }
  }
  const i = fills.findIndex((f) => f.kind === "kpi" && f.value === "8" && /merchant/.test(f.label));
  if (i >= 0 && !fills.some((f) => f.kind === "logos")) fills.splice(i + 1, 0, logosFill(logosId, logosWeight));
}

const decks = load("decks.json");
for (const d of decks) {
  if (d.id === "ck-merchant-outcomes") patch(d.fills, "ck-live-logos", 0.55);
  if (d.id === "ck-platform-build") patch(d.fills, "ap-live-logos", 0.4);
}
save("decks.json", decks);

const corpus = load("corpus.json");
for (const u of corpus) {
  if (u.id === "ck-scale") {
    patch(u.fills, "u-ck-live-logos", 0.5);
    u.text = "From February to July 2026 the ChekOut agent ran 13,981 shopper sessions across 22 brands, 6,124 of them on KivaKube. It is live on 8 merchants' stores; KivaKube, Rosendahl Design Group, Pacific Soul Foods and Nuthatch Naturals are four of them.";
    u.tags = [...new Set([...u.tags, "merchants", "clients", "logos", "live"])];
    for (const r of [METRICS, AP, ...LIVE.map(liveReceipt)]) if (!u.receipts.some((x) => x.ref === r.ref)) u.receipts.push(r);
  }
}
save("corpus.json", corpus);
console.log("patched");
