/**
 * /gated/<case>/<file>  (vercel.json rewrites it to /api/gated-asset?p=<case>/<file>)
 * Serves a gated diagram from private/gated/ only to an unlocked browser.
 */
import { readPrivate, send, verify } from "./_lib/gate.js";

const TYPES = { svg: "image/svg+xml", webp: "image/webp", png: "image/png", jpg: "image/jpeg" };
const SAFE = /^(chekout|christine-valmy)\/[a-z0-9-]+\.(svg|webp|png|jpg)$/;

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "", { Allow: "GET, HEAD" });
  const u = new URL(req.url, "http://x");
  const p = u.searchParams.get("p") || u.pathname.replace(/^\/gated\//, "");
  if (!SAFE.test(p)) return send(res, 404, "");
  if (!verify(req)) return send(res, 401, "");
  try {
    const buf = await readPrivate(`gated/${p}`);
    return send(res, 200, req.method === "HEAD" ? "" : buf, {
      "Content-Type": TYPES[p.split(".").pop()],
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    });
  } catch {
    return send(res, 404, "");
  }
}
