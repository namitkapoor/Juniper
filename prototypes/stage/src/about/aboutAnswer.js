/**
 * Namit's About page as stage fills, built by the same engine. His words are
 * kept verbatim from aboutContent.js; only the mapping to fill kinds is ours.
 *
 * Not carried over (no fill kind / no meaning here), listed in the report:
 *  - "Give me a nudge →" (points at his interactive canvas, which isn't here)
 *  - the timeline's per-row icon names (IoPinOutline, ...)
 *  - the section titles for skills and interests are folded into labels
 */
import { aboutSections } from "./aboutContent.js";
import { cleanFill } from "../content.js";
import { caseName } from "../caseName.js";

const ASSET = {
  "/images/Logo/figma logo vector.svg": "assets/about/figma-logo-vector.svg",
  "/images/Logo/blender icon vector.svg": "assets/about/blender-icon-vector.svg",
  "/images/Logo/adobe after effects logo vector.svg": "assets/about/adobe-after-effects-logo-vector.svg",
  "/images/Logo/unity logo vector.svg": "assets/about/unity-logo-vector.svg",
  "/images/Logo/react logo vector.svg": "assets/about/react-logo-vector.svg",
  "/images/Logo/swift logo vector.svg": "assets/about/swift-logo-vector.svg",
  "/images/Logo/C sharp logo vector.svg": "assets/about/c-sharp-logo-vector.svg",
  "/images/Logo/python logo vector.svg": "assets/about/python-logo-vector.svg",
};

const sec = (id) => aboutSections.find((s) => s.id === id);

export function aboutAnswer() {
  const hero = sec("about").heroContent;
  const who = sec("who");
  const why = sec("why");
  const journey = sec("journey");
  const drive = sec("drive"); void drive;
  const skills = Object.values(who.content.skills).flatMap((g) => g.software);
  const fills = [
    { kind: "title", id: "about-title", weight: 1, text: hero.heading, kicker: "About" },
    { kind: "prose", id: "about-hero", weight: 0.4, text: hero.description.replace(/\s*Give me a nudge\s*→\s*$/, "") },
    { kind: "prose", id: "about-who", weight: 0.75, kicker: who.title.toUpperCase(), text: who.content.description },
    { kind: "timeline", id: "about-journey", weight: 0.7, label: journey.title, items: journey.content.timeline.map(({ year, text }) => ({ year, text })) },
    { kind: "prose", id: "about-why", weight: 0.55, kicker: why.title.toUpperCase(), text: why.content.join(" ") },
    {
      kind: "logos", id: "about-skills", weight: 0.45,
      label: Object.values(who.content.skills).map((g) => g.title).join(" · "),
      items: skills.map((s) => ({ name: s.name, src: ASSET[s.icon], aspect: 1 })),
    },
    // The old interest illustrations are gone; the Off the clock slots replace them.
    offClockFill([]),
  ];
  return { id: "about", question: "About", thesis: hero.heading, page: "about", fills };
}

/**
 * The About stage from about.json (content side): the bio fills through the
 * normal engine, plus three About-only kinds: the particle portrait, the work
 * history (newest first, entries link to their case study) and the stack
 * (grouped; each item's evidence opens as its Proof list, one at a time).
 */
export function aboutFromJson(about, caseStudies = []) {
  // "about-off" (the off-the-clock line) becomes the intro of the Off the clock section.
  const offText = about.bio.find((f) => f.id === "about-off")?.text;
  // ONE bio tile: the main paragraph, closed by the subway-test line (their receipts merged).
  const now = about.bio.find((f) => f.id === "about-now");
  const subway = about.bio.find((f) => f.id === "about-subway");
  const merged = now && subway ? { ...now, text: `${now.text} ${subway.text}`, receipts: [...(now.receipts || []), ...(subway.receipts || []).filter((r) => !(now.receipts || []).some((q) => q.ref === r.ref))] } : now;
  const bio = about.bio
    .filter((f) => !["about-off", "about-subway", "about-now"].includes(f.id))
    .concat(merged ? [merged] : [])
    .map(cleanFill).filter(Boolean)
    .map((f) => (f.kind === "title" ? { ...f, weight: 0.98 } : f));
  const titleOf = (id) => caseName(id); void caseStudies;
  // Jobs a skill can map to: the timeline's orgs by short name (case studies by their NAME).
  const jobs = [];
  for (const t of about.timeline) {
    const label = t.caseStudy ? caseName(t.caseStudy) : t.org.replace(/\s*\(.*\)\s*$/, "").replace("Georgia Institute of Technology", "Georgia Tech");
    if (!jobs.some((j) => j.label === label)) jobs.push({ label, org: t.org, caseStudy: t.caseStudy || null });
  }
  const fills = [
    ...bio,
    // The cell keeps the particle plane's aspect (8 x 10); the shader keeps the
    // photo's own aspect inside it, so the face is never stretched.
    about.portrait && { kind: "portrait", id: "about-portrait", weight: 1, src: about.portrait.src, alt: about.portrait.alt, aspect: 0.8 },
    { kind: "worklog", id: "about-work", weight: 0.85, label: "Work", items: about.timeline.map((t) => ({ ...t, caseTitle: t.caseStudy ? titleOf(t.caseStudy) : null })) },
    {
      // A table: each skill beside the jobs it was used in (+ the evidence line).
      kind: "stack", id: "about-stack", weight: 0.62, label: "Stack",
      groups: about.stack.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, jobs: it.jobs || jobsFor(it.evidence, jobs) })) })),
      jobs,
    },
    offClockFill(about.offClock || [], offText),
  ].filter(Boolean);
  // The first row holds the wordmark and the particle portrait (visible without scrolling).
  const split = { axis: "h", at: 0.36, first: ["about-title", "about-portrait"], second: fills.map((f) => f.id).filter((id) => !["about-title", "about-portrait"].includes(id)) };
  return { id: "about", question: "About", thesis: "About", page: "about", fills, split };
}

/**
 * Off the clock: one slot per book / game, each a line-art (Hairline-style)
 * animation made later by the Motion Designer; until a `figure` exists the
 * slot shows a hairline placeholder. Namit will supply the list; until then
 * two empty slots say so.
 */
export function offClockFill(items, intro) {
  const slots = items.length ? items : [
    { kind: "book", title: "Reading list", by: "coming soon" },
    { kind: "game", title: "Games", by: "coming soon" },
  ];
  return { kind: "offclock", id: "about-off-clock", weight: 0.45, label: "Off the clock", intro, items: slots };
}

/** Jobs whose name appears in a skill's evidence line (an explicit `jobs` list wins). */
export function jobsFor(evidence = "", jobs = []) {
  const key = (label) => label.split(/\s+/).find((w) => w.replace(/[^A-Za-z]/g, "").length >= 4) || label;
  return jobs.filter((j) => new RegExp(key(j.label).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(evidence)).map((j) => j.label);
}
