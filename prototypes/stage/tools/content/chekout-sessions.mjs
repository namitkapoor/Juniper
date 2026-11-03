#!/usr/bin/env node
/**
 * Merchant-wide session distribution for the ChekOut case study, from the prod
 * Databricks warehouse (chatbot_logs_prod.chatbot_logs.conversations).
 *
 * Prints AGGREGATES ONLY: counts per merchant, per month, per country. No
 * message text, no session ids, no shopper data. Run it yourself so the
 * credentials stay in your env file:
 *
 *   node --env-file=$HOME/Documents/work/chekout-ai/chekoutai-frontend/.env.production \
 *        tools/content/chekout-sessions.mjs > /tmp/chekout-sessions.json
 *
 * A "session" = a distinct session_id (the memory note's definition). A session
 * is "multi-turn" when it has 2+ rows, i.e. the shopper wrote back at least once.
 */
const host = process.env.DATABRICKS_HOST;
const token = process.env.DATABRICKS_TOKEN;
const warehouse = (process.env.DATABRICKS_HTTP_PATH || "").split("/").pop();
const T = process.env.CK_TABLE || "chatbot_logs_prod.chatbot_logs.conversations";
if (!host || !token || !warehouse) { console.error("Missing DATABRICKS_HOST / DATABRICKS_TOKEN / DATABRICKS_HTTP_PATH"); process.exit(1); }

async function sql(statement) {
  const r = await fetch(`${host}/api/2.0/sql/statements`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ statement, warehouse_id: warehouse, wait_timeout: "50s", disposition: "INLINE", format: "JSON_ARRAY" }),
  });
  const j = await r.json();
  if (j.status?.state !== "SUCCEEDED") throw new Error(`${j.status?.state}: ${j.status?.error?.message || JSON.stringify(j).slice(0, 300)}`);
  const cols = j.manifest.schema.columns.map((c) => c.name);
  return (j.result?.data_array || []).map((row) => Object.fromEntries(row.map((v, i) => [cols[i], v])));
}

const cols = (await sql(`DESCRIBE ${T}`)).map((r) => r.col_name).filter((c) => c && !c.startsWith("#"));
const pick = (re) => cols.find((c) => re.test(c));
const ts = pick(/^(created_at|timestamp|ts|event_time|created)$/i) || pick(/time|created|date/i);
const country = pick(/^country$/i) || pick(/country/i);
const device = pick(/^device(_type)?$/i) || pick(/device/i);
if (!ts) throw new Error(`No timestamp column among: ${cols.join(", ")}`);

const perSession = `SELECT merchant_id, session_id, COUNT(*) AS rows_n, MIN(${ts}) AS first_ts
  ${country ? `, MAX(${country}) AS country` : ""} ${device ? `, MAX(${device}) AS device` : ""}
  FROM ${T} WHERE session_id IS NOT NULL GROUP BY merchant_id, session_id`;

const out = { generated: new Date().toISOString(), table: T, columns_used: { ts, country, device } };
out.totals = (await sql(`SELECT COUNT(*) AS sessions, SUM(CASE WHEN rows_n >= 2 THEN 1 ELSE 0 END) AS multi_turn,
  COUNT(DISTINCT merchant_id) AS merchants, MIN(first_ts) AS first, MAX(first_ts) AS last FROM (${perSession})`))[0];
out.by_merchant = await sql(`SELECT merchant_id, COUNT(*) AS sessions, SUM(CASE WHEN rows_n >= 2 THEN 1 ELSE 0 END) AS multi_turn,
  MIN(first_ts) AS first, MAX(first_ts) AS last FROM (${perSession}) GROUP BY merchant_id ORDER BY sessions DESC`);
out.by_month = await sql(`SELECT date_format(first_ts, 'yyyy-MM') AS month, COUNT(*) AS sessions,
  SUM(CASE WHEN rows_n >= 2 THEN 1 ELSE 0 END) AS multi_turn FROM (${perSession}) GROUP BY 1 ORDER BY 1`);
if (country) out.top_countries = await sql(`SELECT country, COUNT(*) AS sessions FROM (${perSession}) GROUP BY 1 ORDER BY 2 DESC LIMIT 15`);
if (country) out.merchant_country_top3 = await sql(`SELECT merchant_id, country, sessions FROM (
  SELECT merchant_id, country, COUNT(*) AS sessions, ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY COUNT(*) DESC) AS rk
  FROM (${perSession}) GROUP BY merchant_id, country) WHERE rk <= 3 ORDER BY merchant_id, sessions DESC`);
if (device) out.by_device = await sql(`SELECT device, COUNT(*) AS sessions FROM (${perSession}) GROUP BY 1 ORDER BY 2 DESC`);
console.log(JSON.stringify(out, null, 2));
