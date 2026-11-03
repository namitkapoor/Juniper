/**
 * One light/dark choice across namit.me and studio.namit.me.
 *
 * localStorage is per-origin, so the two sites can't see each other's. The
 * choice also goes in a cookie scoped to .namit.me, which both read on load.
 * Off namit.me (localhost, *.vercel.app previews) the cookie is host-only, so
 * nothing leaks between unrelated hosts. The same file lives in both repos:
 * Juniper prototypes/stage/src/sharedTheme.js and Studio src/sharedTheme.js.
 */
const COOKIE = "nk-theme";
const valid = (t) => (t === "light" || t === "dark" ? t : null);

function cookieDomain() {
  const h = location.hostname;
  return h === "namit.me" || h.endsWith(".namit.me") ? "; Domain=.namit.me" : "";
}

/** The saved choice (cookie first, then this site's old localStorage key), or null. */
export function readTheme(legacyKey) {
  const m = document.cookie.match(/(?:^|;\s*)nk-theme=(light|dark)/);
  if (m) return m[1];
  try { return valid(legacyKey && localStorage.getItem(legacyKey)); } catch { return null; }
}

/** The saved choice, else the OS preference. */
export function initialTheme(legacyKey, fallback) {
  return readTheme(legacyKey) || fallback || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}

export function saveTheme(t, legacyKey) {
  if (!valid(t)) return;
  document.cookie = `${COOKIE}=${t}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${cookieDomain()}`;
  try { if (legacyKey) localStorage.setItem(legacyKey, t); } catch { /* private mode */ }
}
