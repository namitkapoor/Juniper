#!/usr/bin/env node
/**
 * Merchant-wide session distribution for the ChekOut case study, from the prod
 * BigQuery table the dashboard reads (shopify-473015.chatbot_logs.conversations,
 * same as chekout-backend/app/config.py).
 *
 * Prints AGGREGATES ONLY: counts per merchant, per month, per country, per OS.
 * No message text, no session ids, no shopper data. Runs through your own `bq`
 * CLI login, so no key file is involved:
 *
 *   gcloud auth login            # once, if bq says reauthentication failed
 *   node tools/content/chekout-sessions.mjs > /tmp/chekout-sessions.json
 *
 * A "session" = a distinct session_id. A session is "multi-turn" when it has
 * 2+ rows, i.e. the shopper wrote back at least once.
 */
import { execFileSync } from "node:child_process";

const T = process.env.CK_TABLE || "shopify-473015.chatbot_logs.conversations";
const project = T.split(".")[0];

function sql(statement) {
  let out;
  try {
    out = execFileSync("bq", ["--project_id", project, "query", "--use_legacy_sql=false", "--format=json", "--max_rows=10000", "--quiet", statement],
      { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    const msg = `${e.stdout || ""}${e.stderr || ""}`.trim();
    if (/reauthentication|auth tokens|gcloud auth login/i.test(msg)) {
      console.error("bq is not logged in. Run `gcloud auth login` (as namit@chekout.ai), then rerun.");
    } else console.error(msg || e.message);
    process.exit(1);
  }
  return JSON.parse(out || "[]");
}

const perSession = `SELECT merchant_id, session_id, COUNT(*) AS rows_n, MIN(timestamp) AS first_ts,
  ANY_VALUE(customer_country) AS country, ANY_VALUE(LOWER(os)) AS os
  FROM \`${T}\` WHERE session_id IS NOT NULL GROUP BY merchant_id, session_id`;

const out = { generated: new Date().toISOString(), table: T };
out.totals = sql(`SELECT COUNT(*) AS sessions, COUNTIF(rows_n >= 2) AS multi_turn,
  COUNT(DISTINCT merchant_id) AS merchants, MIN(first_ts) AS first, MAX(first_ts) AS last FROM (${perSession})`)[0];
out.by_merchant = sql(`SELECT merchant_id, COUNT(*) AS sessions, COUNTIF(rows_n >= 2) AS multi_turn,
  MIN(first_ts) AS first, MAX(first_ts) AS last FROM (${perSession}) GROUP BY merchant_id ORDER BY sessions DESC`);
out.by_month = sql(`SELECT FORMAT_TIMESTAMP('%Y-%m', first_ts) AS month, COUNT(*) AS sessions,
  COUNTIF(rows_n >= 2) AS multi_turn FROM (${perSession}) GROUP BY month ORDER BY month`);
out.by_merchant_month = sql(`SELECT merchant_id, FORMAT_TIMESTAMP('%Y-%m', first_ts) AS month, COUNT(*) AS sessions
  FROM (${perSession}) GROUP BY merchant_id, month ORDER BY merchant_id, month`);
out.top_countries = sql(`SELECT IFNULL(country, 'unknown') AS country, COUNT(*) AS sessions
  FROM (${perSession}) GROUP BY country ORDER BY sessions DESC LIMIT 15`);
out.merchant_country_top3 = sql(`SELECT merchant_id, country, sessions FROM (
  SELECT merchant_id, IFNULL(country, 'unknown') AS country, COUNT(*) AS sessions,
    ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY COUNT(*) DESC) AS rk
  FROM (${perSession}) GROUP BY merchant_id, country) WHERE rk <= 3 ORDER BY merchant_id, sessions DESC`);
out.by_os = sql(`SELECT IFNULL(os, 'unknown') AS os, COUNT(*) AS sessions FROM (${perSession}) GROUP BY os ORDER BY sessions DESC`);
console.log(JSON.stringify(out, null, 2));
