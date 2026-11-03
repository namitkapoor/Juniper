/**
 * Password gate for IP (ChekOut + Christine Valmy architecture, stack notes,
 * commit lists, and Kip's answers about them).
 *
 * The gated content never ships in the bundle or in public/: it lives in
 * private/gated.json (gitignored) and private/gated/<case>/<file>, served only
 * by api/gate.js and api/gated-asset.js to a browser holding the signed,
 * HttpOnly cookie that a correct password sets. The public data keeps one
 * `gate` fill where the gated fills were; once unlocked, mergeGated() puts
 * the real fills back at their original positions.
 *
 * Store shape (private/gated.json):
 *   { v: 1,
 *     decks:  { [deckId]: { thesis?: string, fills: [{ at: number, fill }] } },
 *     corpus: { [unitId]: { text?: string, title?: string, fills: [{ at: number, fill }] } } }
 */

/** Put gated fills back into a deck/unit at their original indices; drop the gate placeholder. */
export function mergeItem(item, entry) {
  if (!entry) return item;
  const pub = (item.fills || []).filter((f) => f.kind !== "gate");
  const gated = [...(entry.fills || [])].sort((a, b) => a.at - b.at);
  const n = pub.length + gated.length;
  const out = new Array(n);
  for (const g of gated) if (g.at >= 0 && g.at < n) out[g.at] = g.fill;
  let p = 0;
  for (let i = 0; i < n; i++) if (out[i] === undefined) out[i] = pub[p++];
  const moved = new Set(entry.movedOpens || []); // public hosts that only carried a gated fill's "Go deeper"
  const merged = { ...item, fills: out.filter(Boolean).map((f) => (moved.has(f.id) ? (({ opens, ...rest }) => rest)(f) : f)) };
  if (entry.receipts) merged.receipts = entry.receipts;
  if (entry.thesis) merged.thesis = entry.thesis;
  if (entry.text) merged.text = entry.text;
  if (entry.title) merged.title = entry.title;
  if (entry.tags) merged.tags = entry.tags;
  return merged;
}

export function mergeGated(decks, corpus, store) {
  if (!store || store.v !== 1) return { decks, corpus };
  return {
    decks: Array.isArray(decks) ? decks.map((d) => mergeItem(d, store.decks?.[d.id])) : decks,
    corpus: Array.isArray(corpus) ? corpus.map((u) => mergeItem(u, store.corpus?.[u.id])) : corpus,
  };
}

/** Gated assets are served from /gated/... (rewritten to api/gated-asset). */
export const isGatedSrc = (src) => typeof src === "string" && /^\/?gated\//.test(src);

const json = (r) => (r.ok ? r.json() : null);

/** The gated store when this browser is unlocked, else null. Never throws. */
export async function fetchGated() {
  try {
    const r = await fetch("/api/gate", { credentials: "same-origin", cache: "no-store" });
    return r.status === 200 ? await json(r) : null;
  } catch {
    return null;
  }
}

/** Try a password. Resolves { ok: true } or { ok: false, error }. On success, tells the app to reload content. */
export async function unlockGate(password) {
  try {
    const r = await fetch("/api/gate", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.status === 200) {
      window.dispatchEvent(new CustomEvent("stage:unlocked"));
      return { ok: true };
    }
    if (r.status === 429) return { ok: false, error: "Too many tries. Wait a minute and try again." };
    if (r.status === 503) return { ok: false, error: "The gate isn't configured on this deploy." };
    return { ok: false, error: "That password didn't work." };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Check your connection." };
  }
}

export async function lockGate() {
  try { await fetch("/api/gate", { method: "DELETE", credentials: "same-origin" }); } catch { /* offline */ }
  window.dispatchEvent(new CustomEvent("stage:unlocked"));
}
