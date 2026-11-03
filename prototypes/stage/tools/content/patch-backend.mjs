// Load-modify-save: drill-down decks (parent/opens) for each case study's build stages.
import fs from "node:fs";
import { execSync } from "node:child_process";
const D = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");
const REPOS = {
  "kyuri-dashboard": "/Users/namit/Documents/kyuri-dashboard",
  "chekoutai-frontend": "/Users/namit/Documents/work/chekout-ai/chekoutai-frontend",
  "sentry-skin-website": "/Users/namit/Documents/work/chekout-ai/sentry-skin-website",
  "shopify-sync": "/Users/namit/Documents/work/chekout-ai/shopify-sync",
  "shopline-sync": "/Users/namit/Documents/work/chekout-ai/shopline-sync",
  "chekout-backend": "/Users/namit/Documents/work/chekout-ai/chekout-backend",
};
const clean = (s) => s.replace(/\s+[—–]\s+/g, ": ").replace(/[—–]/g, " to ");
const MSG = { "ab7171a": "offline: pages open from the last copy after a 4s wait, adds made with no signal wait in an outbox and send on reconnect, a pill says which" };
const git = (repo, sha) => {
  const [h, date, msg] = execSync(`git -C "${REPOS[repo]}" log -1 --date=short --format="%h%x09%ad%x09%s" ${sha}`).toString().trim().split("\t");
  return { h, date, msg: clean(MSG[h] || msg) };
};
const commits = (id, weight, repo, shas) => ({ kind: "commits", id, weight, repo, items: shas.map((s) => { const g = git(repo, s); return { sha: g.h, date: g.date, msg: g.msg }; }) });
const cr = (repo, sha) => { const g = git(repo, sha); return { type: "commit", ref: g.h, repo, date: g.date, label: `${g.h} · ${g.msg}` }; };
const asset = (ref, label) => ({ type: "asset", ref, ...(label ? { label } : {}) });
const data = (ref, label) => ({ type: "asset", ref, repo: "Juniper", date: "2026-10-26", label });
const kyfile = (ref, label) => ({ type: "asset", ref, repo: "kyuri-dashboard", label });
const figma = (file, node, label) => ({ type: "asset", ref: `figma:${file}#${node}`, date: "2026-11-01", label });
const record = (id, label) => ({ type: "record", ref: id, url: "https://kyuri.namit.me/", label });
const CK = data("src/data/chekoutData.js", "ChekOut AI case study");
const AP = data("src/data/agentPlatformData.js", "Agent platform case study");
const CV = data("src/data/christineValmyData.js", "Christine Valmy case study");
const RECON = data("design-plans/content-recon-2026-10-26.md", "Content recon of chekoutai-frontend");
const ARCH = kyfile("docs/architecture.md", "KYURI.OS system architecture");
const LIVE = { type: "asset", ref: "assets/kyuri-os/job-hunt.webp", url: "https://kyuri.namit.me/?area=job-hunt", date: "2026-11-02", label: "kyuri.namit.me Job Hunt, visitor view" };
const prose = (id, weight, text, receipts) => ({ kind: "prose", id, weight, text, receipts });
const quote = (id, weight, text, who, receipts) => ({ kind: "quote", id, weight, text, who, receipts });
const media = (id, weight, src, aspect, alt, caption, explain, receipts, extra = {}) => {
  const f = { kind: "media", id, weight, media: src.endsWith(".mp4") ? "video" : "image", src, aspect, alt, caption, explain, receipts: [asset(src), ...receipts], ...extra };
  if (src.endsWith(".mp4")) f.poster = src.replace(/\.mp4$/, ".jpg");
  return f;
};
const kpi = (id, weight, value, label, receipts, extra = {}) => ({ kind: "kpi", id, weight, value, label, receipts, ...extra });

const CKJ = "juckmsHrlBUBKcMkoJCiep", CKF = "LPIuHW2bQIxkq7TWZSxI3G", KYF = "qWq0Ce8ovFq7RkKWmGWQDD", KYJ = "1WNTAaMtC2x7fr5VAB4lRM";
// Public repos: commit and file links.
const PUB = { "shopify-sync": "adk-sentryskin/shopify-sync", "shopline-sync": "adk-sentryskin/shopline-sync" };
const onRemote = (repo, sha) => execSync(`git -C "${REPOS[repo]}" branch -r --contains ${sha} 2>/dev/null || true`).toString().trim().length > 0;
const full = (repo, sha) => execSync(`git -C "${REPOS[repo]}" rev-parse ${sha}`).toString().trim();
const crp = (repo, sha) => { const r = cr(repo, sha); if (PUB[repo] && onRemote(repo, sha)) r.url = `https://github.com/${PUB[repo]}/commit/${full(repo, sha)}`; return r; };
const commitsP = (id, weight, repo, shas) => { const c = commits(id, weight, repo, shas); for (const it of c.items) if (PUB[repo] && onRemote(repo, it.sha)) it.url = `https://github.com/${PUB[repo]}/commit/${full(repo, it.sha)}`; return c; };
const file = (repo, path, label) => ({ type: "asset", ref: path, repo, label, ...(PUB[repo] ? { url: `https://github.com/${PUB[repo]}/blob/main/${path}` } : {}) });
const NAMIT = { type: "asset", ref: "namit-confirmation-2026-11-02", date: "2026-11-02", label: "Confirmed by Namit, Nov 2 2026" };
const FIREBASE = { type: "asset", ref: "firebase.json", repo: "chekoutai-frontend", label: "Firebase Hosting rewrites every request to the Cloud Run service nextjs" };

const decks = load("decks.json");
const g = (id) => decks.find((d) => d.id === id);
const f = (d, id) => d.fills.find((x) => x.id === id);

const knowledge = { id: "ck-d-knowledge", parent: "ck-d-stack", caseStudy: "chekout",
  question: "How does the agent learn a store's catalog?",
  thesis: "Product sync turns each store's catalog into embeddings in Postgres with pgvector, and the merchant's agent retrieves from them when a shopper asks.",
  fills: [
    prose("ckk-problem", 1, "THE CHALLENGE: The agent can only answer from what it knows about a store, and a product that loses its embedding becomes invisible to semantic search while the sync still reports clean.",
      [crp("shopline-sync", "f62a338"), NAMIT], ["ckk-diagram"]),
    media("ckk-diagram", 0.95, "assets/chekout/knowledge.svg", 1.7778,
      "How a catalog becomes the agent's knowledge: OAuth install, product sync in FastAPI, Vertex AI embeddings, Postgres with pgvector, a Langflow agent per merchant retrieving at answer time, and conversation logs into BigQuery for the analytics API",
      "From a merchant's catalog to an answer.",
      "Follow the top row: install, sync, embed. Product sync sends each product's text to Vertex AI and stores the vector beside the product in Postgres. The middle row is answer time: the merchant's agent retrieves products from those vectors. Solid boxes are mine. Drawn from the sync and backend repos and the ChekOut architecture board.",
      [file("shopify-sync", "app/services/embedding_service.py", "Vertex AI embedding service"), figma(CKJ, "3:39", "FigJam: 1 · System context"), NAMIT]),
    prose("ckk-how", 0.75, "HOW: Product sync builds one text per product, with its variant options and HTML entities cleaned, embeds it with Vertex AI's text-embedding-004, and stores the vector with the product in Postgres through pgvector. Each merchant's agent is a Langflow flow that retrieves from those vectors when a shopper asks.",
      [file("shopify-sync", "app/models.py", "Product.embedding = Vector(768)"), crp("shopify-sync", "859a164"), NAMIT, figma(CKJ, "3:39", "Langflow agents per merchant via /run")]),
    kpi("ckk-dims", 0.6, "768", "dimensions in each product embedding, Vertex AI text-embedding-004", [file("shopify-sync", "app/models.py", "embedding = Column(Vector(768)) # 768-dim embedding from Vertex AI text-embedding-004")]),
    prose("ckk-safe", 0.55, "NEVER SILENTLY BLIND: Transient Vertex failures are retried with backoff and products left without a vector are counted, and a batched write never overwrites a stored embedding with nothing.",
      [crp("shopline-sync", "f62a338"), crp("shopify-sync", "2e7c541")]),
    media("ckk-logs", 0.5, "assets/chekout/data-flow.webp", 2.7119,
      "ChekOut data and observability: chat agent functions log to Cloud Logging and stream rows into BigQuery, which feeds merchant analytics and reporting",
      "Conversations land in BigQuery.",
      "Every agent turn is logged and streamed into BigQuery; merchant analytics query it on demand. I wrote the analytics endpoints on top; the logging functions are a teammate's.",
      [figma(CKJ, "2:39", "FigJam: 5 · Data & observability"), cr("chekout-backend", "14cc82b")]),
    commitsP("ckk-commits", 0.45, "shopify-sync", ["859a164", "2e7c541"]),
  ] };

const backend = { id: "ck-d-backend", parent: "ck-d-stack", caseStudy: "chekout",
  question: "What did I build in the ChekOut backend?",
  thesis: "The store connection end to end: OAuth installs for Shopify and Shopline, a product sync that writes a page at a time, resilient Admin API calls, and FastAPI endpoints behind a builder hosted on Firebase.",
  fills: [
    prose("ckbe-problem", 1, "THE CHALLENGE: Product sync wrote one product at a time, several database round trips each, and a partial payload from Shopify could blank out the fields the agent reads.",
      [crp("shopify-sync", "2e7c541")], ["ckbe-trips"]),
    kpi("ckbe-trips", 0.85, "~1,250", "database round trips a full 250-product page used to take; now one batched upsert, committed once", [crp("shopify-sync", "2e7c541")]),
    prose("ckbe-oauth", 0.75, "OAUTH: The Shopify install checks a signed state against CSRF, normalizes merchant IDs on the server, runs as an embedded app, and reads each merchant's real scope grant, so order reading stays off until a merchant grants it. On Shopline I built the callback back into the builder.",
      [crp("shopify-sync", "f325a58"), crp("shopify-sync", "8e718d9"), crp("shopline-sync", "f62229c"), NAMIT]),
    prose("ckbe-retry", 0.6, "RESILIENCE: Every Shopify Admin API call got an explicit timeout and a bounded backoff that only replays requests that can't be applied twice.",
      [crp("shopify-sync", "9927b62")]),
    prose("ckbe-host", 0.6, "SERVICES AND HOSTING: The sync services and the analytics endpoints are FastAPI. The builder is a Next.js app on Cloud Run behind Firebase Hosting, which rewrites every request to it.",
      [file("shopify-sync", "requirements.txt", "fastapi"), { type: "asset", ref: "requirements.txt", repo: "chekout-backend", label: "fastapi, google-cloud-bigquery" }, FIREBASE, cr("chekoutai-frontend", "64d2ed6"), NAMIT]),
    prose("ckbe-orders", 0.5, "ORDERS: Agent-attributed orders persist in Postgres with a PII-free field allowlist, kept on a rolling 60-day window and deleted when a merchant uninstalls.",
      [crp("shopify-sync", "b3fccad")]),
    commitsP("ckbe-commits", 0.5, "shopify-sync", ["f325a58", "8e718d9", "b3fccad", "7bd249c", "9927b62", "2e7c541"]),
  ] };

// Stack deck: name the pieces and open the two new decks.
{
  const d = g("ck-d-stack");
  const ship = f(d, "cks-ship");
  ship.text = "SHIPPING: The builder runs on Cloud Run behind Firebase Hosting, which rewrites every request to the Next.js service, with a canary service beside production that takes no live traffic. The backend services are FastAPI.";
  ship.receipts = [FIREBASE, cr("chekoutai-frontend", "64d2ed6"), cr("chekoutai-frontend", "313d08d"), file("shopify-sync", "requirements.txt", "fastapi"), NAMIT];
  ship.opens = "ck-d-backend"; ship.opensPrimary = true;
  if (!f(d, "cks-knowledge")) {
    const i = d.fills.findIndex((x) => x.id === "cks-ship");
    d.fills.splice(i, 0, prose("cks-knowledge", 0.7, "KNOWLEDGE: Each store's catalog is synced, embedded with Vertex AI and stored in Postgres with pgvector; the merchant's Langflow agent retrieves from it at answer time, and conversation logs land in BigQuery.",
      [file("shopify-sync", "app/models.py", "Product.embedding = Vector(768)"), NAMIT, figma(CKJ, "2:39", "FigJam: 5 · Data & observability")]));
  }
  const kn = f(d, "cks-knowledge"); kn.opens = "ck-d-knowledge"; kn.opensPrimary = true;
  const arch = f(d, "cks-arch"); arch.opens = "ck-d-knowledge"; delete arch.opensPrimary;
}
{
  const d = g("ck-platform-build");
  const sys = f(d, "ck-system");
  sys.text = "HOW IT FITS: The builder is a Next.js app on Cloud Run behind Firebase Hosting, and shoppers chat through a script and an iframe the same app serves. Each merchant's agent is a Langflow flow retrieving from pgvector embeddings; FastAPI services handle OAuth, product sync and analytics; conversation logs land in BigQuery.";
  sys.receipts = [figma(CKJ, "3:39", "FigJam: 1 · System context"), FIREBASE, file("shopify-sync", "app/models.py", "pgvector embeddings"), file("shopify-sync", "requirements.txt", "fastapi"), NAMIT];
}
const add = [knowledge, backend];
save("decks.json", [...decks.filter((d) => !add.some((a) => a.id === d.id)), ...add]);

// About stack
const about = load("about.json");
const grp = (name) => about.stack.find((s) => s.group === name);
const put = (group, item, after) => {
  const gp = grp(group);
  const at = gp.items.findIndex((x) => x.name === item.name);
  if (at >= 0) gp.items[at] = item; else gp.items.splice(after != null ? gp.items.findIndex((x) => x.name === after) + 1 : gp.items.length, 0, item);
};
put("Build", { name: "FastAPI", icon: "simple-icons:fastapi", jobs: ["ChekOut AI"], evidence: "ChekOut's product sync services and analytics endpoints." }, "Python");
put("Build", { name: "OAuth", icon: "lucide:key-round", jobs: ["ChekOut AI"], evidence: "Shopify and Shopline app installs: signed state, scope checks per merchant." }, "FastAPI");
put("Ship", { name: "Firebase Hosting", icon: "simple-icons:firebase", jobs: ["ChekOut AI"], evidence: "Serves ChekOut's builder, rewriting every request to its Cloud Run service." }, "Vercel");
put("AI", { name: "Embeddings and pgvector", jobs: ["ChekOut AI"], evidence: "Every product in a store's catalog embedded with Vertex AI and stored in Postgres for retrieval." }, "Agents and RAG");
const pg = grp("Data").items.find((x) => x.name.startsWith("Postgres"));
if (pg && !pg.icon) pg.icon = "simple-icons:postgresql";
save("about.json", about);
console.log("ok");
