/**
 * FAKE answers for exercising the layout engine. Nothing here is a real
 * claim about Namit's work: every receipt ref starts with "fixture-", every
 * image is a solid-colour placeholder labelled FIXTURE. The real content
 * lives in src/data/ (built by the content side) and replaces these.
 */

const rc = (n, prefix = "fixture-rec") =>
  Array.from({ length: n }, (_, i) => ({
    type: i % 3 === 0 ? "commit" : i % 3 === 1 ? "asset" : "record",
    ref: i % 3 === 0 ? `f1x7${i}e0` : `${prefix}-${i + 1}`,
    repo: i % 3 === 0 ? "fixture-repo" : undefined,
    date: `2026-0${(i % 8) + 1}-1${i % 9}`,
    label: ["Placeholder commit message", "placeholder-asset.png", "Fixture evidence record"][i % 3] + ` ${i + 1}`,
    url: i % 3 === 0 ? "https://example.com/fixture" : undefined,
  }));

const commits = (n) =>
  Array.from({ length: n }, (_, i) => ({
    sha: `f1x${(i * 7919 + 4096).toString(16).slice(0, 4)}`,
    date: `2026-10-${String(28 - i).padStart(2, "0")}`,
    msg: [
      "Fixture: seat the stroke on the grid line",
      "Fixture: let prose wrap around the KPI inset",
      "Fixture: drop the lightest fill when the stage is full",
      "Fixture: retract removed strokes toward their origin",
      "Fixture: honour reduced motion with an instant swap",
      "Fixture: measure once per text and font",
      "Fixture: cap media crop at fifteen percent",
      "Fixture: stack by weight below 760px",
    ][i % 8],
    url: "https://example.com/fixture",
  }));

const LONG =
  "This is placeholder prose for the layout engine. It stands in for a case-study paragraph long enough to need real measurement: the engine prepares the text once with Pretext, lays it out at a handful of candidate widths, and picks the cell whose height holds it without wasting the stage. When a stroke passes through the cell during a morph, the lines re-wrap around it every frame, and when the pointer rests on the paragraph the lines part around it. None of the facts in this paragraph are real; it exists so the shapes can be judged before the content arrives.";

const MED =
  "Placeholder prose: a short argument the deck makes, sized so it fits a medium cell at a comfortable measure of roughly sixty characters per line.";

export const fixtureHome = {
  id: "fx-home",
  question: "",
  thesis: "Fixture home stage. Ask a question to watch the page re-partition.",
  fills: [
    { kind: "title", id: "fx-home-name", weight: 1, text: "namit", kicker: "Product engineer · New York" },
    { kind: "title", id: "fx-home-now", weight: 0.42, text: "Designing and shipping AI agents at a fixture company.", kicker: "Currently" },
    { kind: "title", id: "fx-home-cases", weight: 0.4, text: "Commerce, beauty education, and a placeholder third.", kicker: "Three case studies" },
  ],
};

const LOGOS = [
  ["fixture-alpha", "Alpha (fixture)", 3.38], ["fixture-bo", "Bo & Co (fixture)", 2.48], ["fixture-cedar", "Cedar (fixture)", 4.86],
  ["fixture-dune", "Dune (fixture)", 2.19], ["fixture-eko", "Eko (fixture)", 1.89], ["fixture-fern", "Fern (fixture)", 5.16],
  ["fixture-gild", "Gild (fixture)", 2.19], ["fixture-halo", "Halo (fixture)", 3.08],
].map(([f, name, aspect]) => ({ name, src: `fixtures/logos/${f}.svg`, aspect, invert: true }));

export const fixtureAnswers = [
  {
    id: "fx-media",
    question: "Show me the visual work (fixture: media-heavy)",
    thesis: "Fixture: three pieces of media at different aspect ratios, one video, one caption-only image.",
    fills: [
      { kind: "media", id: "fx-m-wide", weight: 0.95, media: "image", src: "fixtures/wide-16x9.svg", aspect: 16 / 9, alt: "Fixture wide placeholder", caption: "Fixture · 16:9 hero", receipts: rc(2),
        explain: "Fixture explanation for a still image. The expanded view gives the photo most of the stage at its real aspect ratio and sets this text beside it." },
      { kind: "media", id: "fx-m-vid", weight: 0.7, media: "video", src: "fixtures/video-16x9.mp4", poster: "fixtures/video-16x9-poster.jpg", aspect: 16 / 9, alt: "Fixture video", caption: "Fixture · looping video",
        explain: "Fixture explanation: what this clip demonstrates, in two sentences. It exists so the expanded view has body text to measure and wrap.",
        kpi: { value: "3.2", unit: "×", label: "Fixture: faster than the old flow", period: "fake period", receipts: rc(2) } },
      { kind: "media", id: "fx-m-tall", weight: 0.55, media: "image", src: "fixtures/tall-3x4.svg", aspect: 3 / 4, alt: "Fixture tall placeholder", caption: "Fixture · 3:4" },
      { kind: "prose", id: "fx-m-note", weight: 0.35, text: MED, receipts: rc(1) },
    ],
  },
  {
    id: "fx-kpi", parent: "fx-commits",
    question: "What was the impact? (fixture: kpi-heavy)",
    thesis: "Fixture: four numbers and one sentence of context. None of these numbers are real.",
    fills: [
      { kind: "kpi", id: "fx-k1", weight: 0.9, value: "38", unit: "%", label: "Fixture conversion lift", baseline: "vs. fixture baseline", period: "Q3 (fake)", receipts: rc(3) },
      { kind: "kpi", id: "fx-k2", weight: 0.7, value: "3.2", unit: "×", label: "Fixture speed-up", period: "per session", receipts: rc(2) },
      { kind: "kpi", id: "fx-k3", weight: 0.55, value: "1,204", label: "Fixture sessions observed", receipts: rc(1) },
      { kind: "kpi", id: "fx-k4", weight: 0.45, value: "12", unit: "d", label: "Fixture time to ship", receipts: rc(1) },
      { kind: "prose", id: "fx-k-ctx", weight: 0.5, text: MED },
    ],
  },
  {
    id: "fx-commits",
    question: "How do you actually build? (fixture: commit-heavy)",
    thesis: "Fixture: two commit logs and a paragraph, to test tall-narrow cells.",
    fills: [
      { kind: "commits", id: "fx-c1", weight: 0.85, repo: "fixture-repo", items: commits(8) },
      { kind: "prose", id: "fx-c-p", weight: 0.65, text: LONG.split(". ").slice(0, 2).join(". ") + ".", receipts: rc(2), opens: "fx-prose" },
      { kind: "commits", id: "fx-c2", weight: 0.5, repo: "fixture-other", items: commits(4) },
      { kind: "kpi", id: "fx-c-k", weight: 0.35, value: "214", label: "Fixture commits this month", receipts: rc(1), opens: "fx-kpi" },
    ],
  },
  {
    id: "fx-prose", parent: "fx-commits",
    question: "Tell me the whole story (fixture: prose-long)",
    thesis: "Fixture: one long paragraph that needs measuring, a pull quote, and a number it can wrap around.",
    fills: [
      { kind: "prose", id: "fx-p-long", weight: 0.9, text: LONG, receipts: rc(4) },
      { kind: "quote", id: "fx-p-q", weight: 0.55, text: "A fixture quote that sounds like something a teammate might say.", who: "Fixture Person, Fixture Co." },
      { kind: "kpi", id: "fx-p-k", weight: 0.35, value: "9", unit: "→3", label: "Fixture steps removed", receipts: rc(1) },
      { kind: "title", id: "fx-p-t", weight: 0.5, text: "The long version", kicker: "Fixture case study" },
    ],
  },
  {
    id: "fx-hero",
    question: "One thing (fixture: single-hero)",
    thesis: "Fixture: a single wide media fill should take the stage alone.",
    fills: [
      { kind: "media", id: "fx-h-pano", weight: 1, media: "animation", src: "fixtures/anim-3x2.svg", aspect: 3 / 2, alt: "Fixture animation", caption: "Fixture · animated SVG", receipts: rc(1) },
    ],
  },
  {
    id: "fx-crowd",
    question: "Everything at once (fixture: crowded, 9 fills)",
    thesis: "Fixture: nine fills for a stage that holds seven. The lightest two drop behind “+2 more”.",
    fills: [
      { kind: "title", id: "fx-x-t", weight: 0.8, text: "Everything, at once", kicker: "Fixture" },
      { kind: "media", id: "fx-x-m", weight: 0.75, media: "image", src: "fixtures/card-4x3.svg", aspect: 4 / 3, alt: "Fixture 4:3", caption: "Fixture · 4:3", receipts: rc(2) },
      { kind: "prose", id: "fx-x-p", weight: 0.6, text: MED, receipts: rc(1) },
      { kind: "kpi", id: "fx-x-k1", weight: 0.5, value: "38", unit: "%", label: "Fixture lift", receipts: rc(2) },
      { kind: "commits", id: "fx-x-c", weight: 0.45, repo: "fixture-repo", items: commits(5) },
      { kind: "kpi", id: "fx-x-k2", weight: 0.4, value: "3.2", unit: "×", label: "Fixture faster", receipts: rc(1) },
      { kind: "quote", id: "fx-x-q", weight: 0.3, text: "Fixture quote, short.", who: "Fixture" },
      { kind: "media", id: "fx-x-sq", weight: 0.2, media: "image", src: "fixtures/square.svg", aspect: 1, alt: "Fixture square" },
      { kind: "kpi", id: "fx-x-k3", weight: 0.15, value: "7", label: "Fixture extra", receipts: rc(1) },
    ],
  },
  {
    id: "fx-phone-media",
    question: "Extreme aspect ratios (fixture)",
    thesis: "Fixture: a panorama and a phone screenshot, both far from any cell's natural shape.",
    fills: [
      { kind: "media", id: "fx-e-pano", weight: 0.8, media: "image", src: "fixtures/pano-21x9.svg", aspect: 21 / 9, alt: "Fixture panorama", caption: "Fixture · 21:9" },
      { kind: "media", id: "fx-e-phone", weight: 0.7, media: "image", src: "fixtures/phone-9x19.svg", aspect: 9 / 19, alt: "Fixture phone screen", caption: "Fixture · phone" },
      { kind: "prose", id: "fx-e-p", weight: 0.4, text: MED },
    ],
  },
  {
    id: "fx-logos",
    question: "Who runs it? (fixture: logos + breakdown)",
    thesis: "Fixture: a merchant count with the logos behind it, and a number split by merchant.",
    fills: [
      { kind: "kpi", id: "fx-l-live", weight: 0.85, value: "8", label: "Fixture merchants live", period: "fake period", receipts: rc(2) },
      { kind: "logos", id: "fx-l-logos", weight: 0.5, label: "Live on", items: LOGOS, receipts: rc(1) },
      {
        kind: "kpi", id: "fx-l-sessions", weight: 0.8, value: "13,981", label: "Fixture sessions", period: "fake period", receipts: rc(3),
        breakdown: [
          { label: "Alpha (fixture)", value: "6,120", share: 0.44, logo: "fixtures/logos/fixture-alpha.svg" },
          { label: "Cedar (fixture)", value: "3,904", share: 0.28, logo: "fixtures/logos/fixture-cedar.svg" },
          { label: "Dune (fixture)", value: "2,210", share: 0.16, logo: "fixtures/logos/fixture-dune.svg" },
          { label: "Five others (fixture)", value: "1,747", share: 0.12 },
        ],
      },
      { kind: "prose", id: "fx-l-p", weight: 0.55, text: "Placeholder prose: the logos and the split are fixtures; the real ones arrive from the content side with a receipt for every value." },
    ],
  },
];
