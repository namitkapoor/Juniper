/**
 * The home's HERO state: the live namit.me hero (Juniper src/Pages/Home.jsx) as a
 * layout of the stage itself, not a separate section.
 *
 *   "namit"   the same title cell (home-title), given most of the frame, with the
 *             live tagline as its kicker; HeroIntro plays the original letter/word
 *             entrance on it during the first-load build.
 *   tiles     the same three tile fills (same ids, so they morph), collapsed to
 *             the case name only: no hook, no metric.
 *   face      Kip's face (the live hero's pixel-glasses Lottie), pinned bottom-right.
 *
 * It is the desktop home while the chat is closed. Opening the chat (Ask Kip) shows
 * the INFO home (homeWithTiles) beside it as an ordinary stage morph: the title
 * shrinks to its column, CURRENTLY comes in, the tiles open to role, hook, metric;
 * closing the chat morphs back.
 */
export const TAGLINE = "Harmonizes pixels to lived experiences"; // live hero copy (Home.jsx AnimatedTagline)

// An empty metric, not a missing one: during a morph a cell can briefly pair the
// other state's spec with this fill, and the tile renderer reads number.value.
const NO_NUMBER = { value: "", label: "" };

export const HERO_ARRANGEMENT = { axis: "v", at: 0.62, bento: true, last: "home-face" };

/**
 * The case's impact numbers for the hover view: its top-level decks' KPIs by weight,
 * minus the one its tile already shows. Real fills (same values, labels, receipts).
 */
export function caseKpis(decks, cs, tileValue, n = 3) {
  const seen = new Set([String(tileValue ?? "")]);
  const out = [];
  const kpis = (decks || []).filter((d) => d.caseStudy === cs && !d.parent).flatMap((d) => d.fills.filter((f) => f.kind === "kpi"));
  for (const k of kpis.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))) {
    if (seen.has(String(k.value))) continue;
    seen.add(String(k.value));
    out.push(k);
    if (out.length >= n) break;
  }
  return out;
}

/**
 * @param info the info-state home answer (homeWithTiles output)
 * @param hot  the hovered case: its tile opens to full info, its impact numbers take
 *             the space around it, the other cases shrink to name strips (still
 *             hoverable), so hovering one case gives a detailed view of it.
 */
export function heroHome(info, { hot = null, decks = [] } = {}) {
  if (!info?.fills?.length) return info;
  const fills = [];
  for (const f of info.fills) {
    if (f.kind === "title") fills.push({ ...f, kicker: TAGLINE, weight: hot ? 1.6 : 2.4 });
    else if (f.kind === "tile" && hot && f.caseStudy === hot) {
      fills.push({ ...f, weight: 0.5 }); // the hovered case: role, hook and metric, as in the info state
      caseKpis(decks, hot, f.number?.value).forEach((k, i) => fills.push({ ...k, id: `${hot}~hk${i}`, caseStudy: hot, weight: 0.3 - i * 0.04, opens: undefined }));
    } else if (f.kind === "tile") fills.push({ ...f, role: "", roleShort: "", task: f.caseTitle, taskShort: f.caseTitle, number: NO_NUMBER, mustMetric: false, weight: hot ? 0.08 : 0.16 });
    else if (f.kind === "face") fills.push({ ...f, weight: hot ? 0.18 : 0.3 });
    // CURRENTLY (and anything else) waits for the info state.
  }
  const first = fills.filter((f) => f.kind === "title").map((f) => f.id);
  const second = fills.filter((f) => !first.includes(f.id)).map((f) => f.id);
  const A = HERO_ARRANGEMENT;
  const last = second.includes(A.last) ? A.last : undefined;
  return { ...info, id: `${info.id}+hero${hot ? `~${hot}` : ""}`, fills, split: { axis: A.axis, at: A.at, first, second, last, bento: A.bento } };
}

/**
 * Short facts for the "namit" hover, from the About page (src/data/about.json):
 * the ChekOut AI start year from the timeline, and the HCI master's and Arlene AR work
 * from the bio. Only what about.json says.
 */
export function aboutFacts(about) {
  const tl = about?.timeline || [];
  const yr = (d) => (d || "").slice(0, 4);
  const out = [];
  const ck = tl.find((t) => /chekout/i.test(t.org || "") && /founder/i.test(t.title || ""));
  if (ck) out.push({ value: yr(ck.start), label: `co-founded ${ck.org}, where I design and build the AI agents` });
  for (const t of tl.filter((x) => x.kind === "education")) {
    const school = /georgia/i.test(t.org) ? "Georgia Tech" : /dartmouth/i.test(t.org) ? "Dartmouth" : t.org;
    const logo = /georgia/i.test(t.org) ? "/assets/about/logo-georgia-tech.png" : /dartmouth/i.test(t.org) ? "/assets/about/logo-dartmouth.png" : null;
    out.push({ value: school, label: `${t.title}, ${yr(t.start)} to ${yr(t.end)}`, logo });
  }
  return out;
}
