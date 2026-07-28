/**
 * Scan-path collector.
 *
 * vercel.json rewrites known probe paths here BEFORE the SPA catch-all, so a
 * bot asking for /.env gets a 404 from this function instead of a 200 with the
 * React shell. Two wins: scanners stop being told "that path exists", and we
 * get a server-side record of traffic that never runs JavaScript — which is all
 * of it. GA4 and Clarity cannot see any of this.
 *
 * Writes to the Notion "🛡️ Bot & Scan Log" DB. Notion is the sink rather than a
 * vault file because a file in the vault repo would mean a git commit per hit.
 */

const NOTION_VERSION = "2025-09-03";
const DS_ID = process.env.NOTION_BOTLOG_DS_ID;
const NOTION_KEY = process.env.NOTION_API_KEY;

/** Longest-prefix wins, so /.git/config classifies as git-probe not other. */
const RULES = [
  [/^\/\.env/i, "env-probe"],
  [/^\/\.git/i, "git-probe"],
  [/^\/(wp-|wordpress)/i, "wp-probe"],
  [/^\/(admin|administrator|manager)/i, "admin-probe"],
  [/\.(php|asp|aspx|jsp|cgi)$/i, "php-probe"],
  [/^\/\.well-known/i, "well-known"],
  [/^\/(config|configuration|settings|credentials|secrets)/i, "config-probe"],
  [/^\/\.(aws|ssh|docker|vscode|idea)/i, "config-probe"],
  [/^\/(vendor|phpmyadmin|pma|adminer)/i, "php-probe"],
];

function classify(path) {
  for (const [re, cat] of RULES) if (re.test(path)) return cat;
  return "other";
}

function clip(s, n) {
  if (!s) return "";
  return String(s).slice(0, n);
}

export default async function handler(req, res) {
  // Respond first. The scanner gets its 404 immediately and the Notion write
  // happens after — logging must never add latency or become a way to stall
  // the function by hammering it.
  const path = (req.url || "/").split("?")[0];
  const category = classify(path);

  res.status(404).setHeader("content-type", "text/plain");
  res.end("Not Found");

  if (!DS_ID || !NOTION_KEY) return; // unconfigured: stay silent, never throw

  const h = req.headers || {};
  const method = ["GET", "POST", "HEAD", "PUT"].includes(req.method) ? req.method : "OTHER";

  try {
    await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_KEY}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { type: "data_source_id", data_source_id: DS_ID },
        properties: {
          Path: { title: [{ text: { content: clip(path, 200) } }] },
          Site: { select: { name: "namit.me" } },
          Category: { select: { name: category } },
          Method: { select: { name: method } },
          "Seen At": { date: { start: new Date().toISOString() } },
          "User Agent": { rich_text: [{ text: { content: clip(h["user-agent"], 400) } }] },
          Country: { rich_text: [{ text: { content: clip(h["x-vercel-ip-country"], 8) } }] },
          Referer: { rich_text: [{ text: { content: clip(h.referer, 200) } }] },
          Hits: { number: 1 },
        },
      }),
    });
  } catch {
    // Never let a logging failure surface. The 404 already went out.
  }
}
