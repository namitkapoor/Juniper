/**
 * Server side of the IP gate. Fails closed: with GATE_PASSWORD or GATE_SECRET
 * unset, nothing unlocks and nothing gated is served.
 *
 * Cookie: stage_gate=v1.<expiryMs>.<hmac>, HttpOnly, SameSite=Strict, Secure off localhost.
 * The HMAC covers the expiry AND a hash of the current password, so rotating
 * GATE_PASSWORD signs every visitor out.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const COOKIE = "stage_gate";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const secret = () => process.env.GATE_SECRET || "";
const password = () => process.env.GATE_PASSWORD || "";
export const configured = () => secret().length >= 16 && password().length >= 8;

const sha = (s) => crypto.createHash("sha256").update(s).digest();
const mac = (exp) => crypto.createHmac("sha256", secret()).update(`v1.${exp}.`).update(sha(password())).digest("base64url");

function cookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

const isLocal = (req) => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(String(req.headers.host || ""));

export function setCookie(req, res) {
  const exp = Date.now() + TTL_MS;
  res.setHeader("Set-Cookie", `${COOKIE}=v1.${exp}.${mac(exp)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL_MS / 1000}${isLocal(req) ? "" : "; Secure"}`);
}

export function clearCookie(req, res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isLocal(req) ? "" : "; Secure"}`);
}

export function verify(req) {
  if (!configured()) return false;
  const c = cookies(req)[COOKIE];
  if (!c) return false;
  const [v, exp, got] = c.split(".");
  if (v !== "v1" || !/^\d{10,16}$/.test(exp || "") || Number(exp) < Date.now() || !got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(mac(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(given) {
  if (!configured() || typeof given !== "string" || given.length > 256) return false;
  return crypto.timingSafeEqual(sha(given), sha(password()));
}

/** Files bundled with the functions (vercel.json includeFiles: private/**). */
export const PRIVATE_DIR = path.join(process.cwd(), "private");
export const readPrivate = (rel) => fs.readFile(path.join(PRIVATE_DIR, rel));

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex", ...headers })) res.setHeader(k, v);
  res.end(body);
}
export const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });

/** Best-effort per-instance throttle (serverless instances don't share memory; the delay on failure is the real brake). */
const tries = new Map();
export function throttled(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim() || "?";
  const now = Date.now();
  const t = (tries.get(ip) || []).filter((x) => now - x < 60_000);
  t.push(now);
  tries.set(ip, t);
  if (tries.size > 5000) tries.clear();
  return t.length > 8;
}

export function readBody(req, limit = 2048) {
  if (req.body !== undefined) return Promise.resolve(typeof req.body === "string" ? req.body : JSON.stringify(req.body));
  return new Promise((resolve, reject) => {
    let s = "";
    req.on("data", (c) => { s += c; if (s.length > limit) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => resolve(s));
    req.on("error", reject);
  });
}
