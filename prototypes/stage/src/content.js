/**
 * Loads the real content (src/data/*.json, produced by the content side) when
 * it exists, and falls back to the fake fixtures when it does not. The glob is
 * lazy, so a missing file is simply absent rather than a build error, and Vite
 * picks up files that appear later.
 */
import { FILL_KINDS } from "./data/schema.js";
import { glueHyphens } from "./engine/typo.js";
import { fixtureHome, fixtureAnswers } from "./fixtures/index.js";
import { setCaseNames, caseName } from "./caseName.js";
import { useEffect, useState } from "react";
import MANIFEST from "../tools/content/manifest.json";

const files = import.meta.glob("./data/*.json");

async function load(name) {
  const key = `./data/${name}.json`;
  if (!files[key]) return null;
  try {
    const mod = await files[key]();
    return mod.default ?? mod;
  } catch (e) {
    console.warn(`[content] could not load ${name}.json`, e);
    return null;
  }
}

/** Logo sources marked `invert` (dark marks), so a breakdown row reusing the same file tints it too. */
export const INVERT_LOGOS = new Set();

const isNum = (x) => typeof x === "number" && Number.isFinite(x);

/** Keep only fills the stage can render; the contract is enforced here, once. */
export function cleanFill(f) {
  if (!f || !FILL_KINDS.includes(f.kind) || !f.id) return null;
  const weight = isNum(f.weight) ? Math.max(0, Math.min(1, f.weight)) : 0.5;
  switch (f.kind) {
    case "title": return f.text ? { ...f, text: glueHyphens(f.text), weight } : null;
    case "prose": return f.text ? proseConventions({ ...f, text: glueHyphens(f.text), weight }) : null;
    case "quote": return f.text ? { ...f, text: glueHyphens(f.text), weight, who: f.who || "" } : null;
    case "kpi": return f.value != null && f.label ? { ...f, value: String(f.value), weight, receipts: f.receipts || [] } : null;
    case "media": return f.src && isNum(f.aspect) && f.aspect > 0 ? { ...f, weight } : null;
    case "commits": return Array.isArray(f.items) && f.items.length ? { ...f, weight } : null;
    case "specimen": return f.sample && Array.isArray(f.scale) && f.scale.length >= 2 ? { ...f, weight } : null;
    case "rules": {
      const items = (f.items || []).filter((it) => it && it.text && it.icon);
      return f.label && items.length ? { ...f, items, weight, receipts: f.receipts || [] } : null;
    }
    case "logos": {
      const items = (f.items || []).filter((it) => it && it.src && it.name && isNum(it.aspect) && it.aspect > 0);
      for (const it of items) if (it.invert) INVERT_LOGOS.add(it.src);
      return items.length ? { ...f, items, weight } : null;
    }
    default: return null;
  }
}

/**
 * Content written for the old static home uses typographic conventions in
 * prose: an ALL-CAPS line is a section heading, and "LABEL: sentence" is a
 * kicker plus a sentence. Render them as such instead of as body text.
 * (`kicker` on prose is a stage-side extension; the engine reserves room.)
 */
function proseConventions(f) {
  const t = f.text.trim();
  if (t.length < 48 && /^[A-Z0-9 ·&'.,/+-]+$/.test(t)) return { ...f, kind: "title", text: t, kicker: undefined };
  const m = t.match(/^([A-Z][A-Z0-9 ·&'/-]{2,40}):\s+(.+)$/s);
  if (m) return { ...f, kicker: m[1], text: m[2] };
  return f;
}

export function cleanAnswer(a) {
  if (!a || !Array.isArray(a.fills)) return null;
  let fills = a.fills.map(cleanFill).filter(Boolean);
  if (!fills.length) return null;
  // Two or more steps in one answer make a sequence: show the step track.
  if (fills.filter((f) => f.kind === "media" && f.step).length > 1) fills = fills.map((f) => (f.step ? { ...f, stepTrack: true } : f));
  return { ...a, fills };
}

/** "assets/x.webp" -> "/assets/x.webp"; absolute URLs untouched. */
/**
 * Light theme: an asset with a NAME-light sibling swaps to it. Demos (assets/.../demos/)
 * always have one; anything else must be listed in tools/content/manifest.json.
 */
const LIGHT = new Set(Object.keys(MANIFEST).filter((k) => /-light\.[a-z0-9]+$/i.test(k)).map((k) => `assets/${k}`));
export const lightVariant = (src) => (src ? src.replace(/(\.[a-z0-9]+)$/i, "-light$1") : src);
export const hasLight = (src) => !!src && (/\/demos\//.test(src) || LIGHT.has(lightVariant(src)));
export const themedSrc = (src, light) => (light && hasLight(src) ? lightVariant(src) : src);
const isLight = () => typeof document !== "undefined" && document.documentElement.dataset.theme === "light";
/** Re-renders when <html data-theme> flips. */
export function useLightTheme() {
  const [light, setLight] = useState(isLight);
  useEffect(() => {
    const mo = new MutationObserver(() => setLight(isLight()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    setLight(isLight());
    return () => mo.disconnect();
  }, []);
  return light;
}

export const assetUrl = (src) => (!src ? src : /^(https?:)?\/\//.test(src) || src.startsWith("/") ? src : `/${src}`);

export async function loadContent() {
  const [decks, corpus, home, caseStudies, about] = await Promise.all([
    load("decks"), load("corpus"), load("home"), load("case-studies"), load("about"),
  ]);
  const realDecks = Array.isArray(decks) ? decks.map(cleanAnswer).filter(Boolean) : [];
  const realCorpus = Array.isArray(corpus)
    ? corpus.map((u) => ({ ...u, fills: (u.fills || []).map(cleanFill).filter(Boolean) })).filter((u) => u.fills.length)
    : [];
  const cases = Array.isArray(caseStudies) ? caseStudies : [];
  setCaseNames(home, cases);
  let realHome = cleanAnswer(home);
  // Home covers open their case study. The link is read from the asset folder
  // (assets/<case id>/...), so the content needs no extra field.
  if (realHome) {
    realHome = {
      ...realHome,
      fills: realHome.fills.map((f) => {
        if (f.kind !== "media") return f;
        const c = cases.find((cs) => f.src.startsWith(`assets/${cs.id}/`));
        return c ? { ...f, caseStudy: c.id, caseTitle: caseName(c.id) } : f;
      }),
    };
  }
  return {
    home: realHome || fixtureHome,
    decks: realDecks,
    corpus: realCorpus,
    caseStudies: cases,
    about: about && Array.isArray(about.bio) ? about : null,
    fixtures: fixtureAnswers.map((a) => cleanAnswer(a) || a),
    source: { home: realHome ? "data" : "fixture", decks: realDecks.length ? "data" : "fixture", corpus: realCorpus.length ? "data" : "none" },
  };
}
