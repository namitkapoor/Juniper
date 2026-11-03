/**
 * /api/gate
 *   POST {password}  -> 200 + signed cookie | 401 | 429 | 503
 *   GET              -> 200 private/gated.json when the cookie is valid | 401
 *   DELETE           -> clears the cookie
 */
import { checkPassword, clearCookie, configured, readBody, readPrivate, send, sendJson, setCookie, throttled, verify } from "./_lib/gate.js";

const sameOrigin = (req) => {
  const o = req.headers.origin;
  if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  if (!configured()) return sendJson(res, 503, { ok: false });
  if (req.method === "GET") {
    if (!verify(req)) return sendJson(res, 401, { ok: false });
    try {
      return send(res, 200, await readPrivate("gated.json"), { "Content-Type": "application/json; charset=utf-8" });
    } catch {
      return sendJson(res, 500, { ok: false });
    }
  }
  if (req.method === "POST") {
    if (!sameOrigin(req)) return sendJson(res, 403, { ok: false });
    if (throttled(req)) return sendJson(res, 429, { ok: false });
    let pw = "";
    try { pw = JSON.parse((await readBody(req)) || "{}").password; } catch { /* bad body */ }
    if (!checkPassword(pw)) { await wait(700); return sendJson(res, 401, { ok: false }); }
    setCookie(req, res);
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "DELETE") {
    clearCookie(req, res);
    return sendJson(res, 200, { ok: true });
  }
  res.setHeader("Allow", "GET, POST, DELETE");
  return sendJson(res, 405, { ok: false });
}
