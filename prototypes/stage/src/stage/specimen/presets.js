/**
 * Demo `specimen` fills, every value read from source (see each `receipts`).
 * The stage's own system is the meta case: the specimen draws the rules that
 * lay out the stage it sits on.
 */

const stageRefs = (...refs) => refs.map((ref) => ({ type: "asset", ref, label: ref }));

/** The stage's fit ladder: prose steps the engine walks DOWN until a line fits. */
export const STAGE_FIT = {
  kind: "specimen", id: "spec-stage-fit", weight: 0.6, mode: "fit",
  title: "Prose steps down until it fits",
  sample: "Type is computed",
  font: "body",
  // src/engine/typo.js PROSE_STEPS: sizes 22/19/17/15/14 on whole-pixel line-heights.
  scale: [
    { role: "prose", size: 22, lineHeight: 32, tracking: 0, weight: 400 },
    { role: "prose", size: 19, lineHeight: 28, tracking: 0, weight: 400 },
    { role: "prose", size: 17, lineHeight: 25, tracking: 0, weight: 400 },
    { role: "prose", size: 15, lineHeight: 22, tracking: 0, weight: 400 },
    { role: "prose", size: 14, lineHeight: 20, tracking: 0, weight: 400 },
  ],
  // PAD.desktop 24; stepsFor(): phones drop every prose step under 16px.
  fit: { pad: 24, floor: 16 },
  receipts: stageRefs("src/engine/typo.js"),
};

/** Case-study tile headlines: TILE.steps 64 down to 17, line-height round(1.1 x size). */
export const STAGE_HOOKS = {
  kind: "specimen", id: "spec-stage-hooks", weight: 0.6, mode: "fit",
  title: "Tile headlines step down until they fit",
  sample: "Proof",
  font: "display",
  scale: [64, 56, 48, 42, 36, 32, 30, 28, 26, 25, 22, 19, 17].map((size) => ({
    role: "hook", size, lineHeight: Math.round(size * 1.1), tracking: -0.01, weight: 300,
  })),
  fit: { pad: 24 },
  receipts: stageRefs("src/engine/typo.js"),
};

/** The close-up: one word through the stage's roles, small to large. */
export const STAGE_SCALE = {
  kind: "specimen", id: "spec-stage-scale", weight: 0.6, mode: "scale", direction: "up",
  title: "The stage's type scale",
  sample: "Spacing",
  font: "body",
  scale: [
    // LABEL: Satoshi 500 12/16, +0.12em, caps.
    { role: "label", size: 12, lineHeight: 16, tracking: 0.12, weight: 500, upper: true },
    // PROSE_STEPS[2]: Satoshi 400 17/25.
    { role: "body", size: 17, lineHeight: 25, tracking: 0, weight: 400 },
    // HEADING: Cabinet Grotesk 300 22/28.
    { role: "heading", size: 22, lineHeight: 28, tracking: 0, weight: 300, font: "display" },
    // HOOK_SIZE 30, TILE_FONT: Cabinet Grotesk 300, -0.01em, line-height round(1.1 x 30).
    { role: "hook", size: 30, lineHeight: 33, tracking: -0.01, weight: 300, font: "display" },
    // TITLE_FONT: Cabinet Grotesk 800, -0.02em; titleLineHeight(64) = round(64 x 0.92).
    { role: "title", size: 64, lineHeight: 59, tracking: -0.02, weight: 800, font: "display" },
  ],
  spacing: [
    { name: "gap", value: 16 },      // tileRoleH: lines x 16 + 16 below the role label
    { name: "para", value: 15 },     // PARA_GAP 0.6 lines x 25
    { name: "gap", value: 14 },      // HEADING.gap
    { name: "gap", value: 14 },      // TILE.numGap
    { name: "pad", value: 24 },      // PAD.desktop
  ],
  receipts: stageRefs("src/engine/typo.js", "src/styles.css"),
};

/**
 * KYURI.OS (second preset, proves the component is data-driven): Jura for UI,
 * Space Mono for anything that ticks. Values from kyuri-dashboard
 * app/globals.css and its Figma text styles.
 */
export const KYURI_SCALE = {
  kind: "specimen", id: "spec-kyuri-scale", weight: 0.6, mode: "scale", direction: "up",
  title: "KYURI.OS type scale",
  sample: "Pipeline",
  font: "Jura",
  scale: [
    { role: "meta", size: 11, lineHeight: 17.6, tracking: 0.1, weight: 400, upper: true },   // .t-meta 11 / 1.6, 0.1em
    { role: "line", size: 14, lineHeight: 20.3, tracking: 0, weight: 400 },                 // .t-line 14 / 1.45
    { role: "H1", size: 26, lineHeight: 32.5, tracking: 0.01, weight: 700 },                // Figma H1 26 / 125%, 1%
    { role: "display", size: 40, lineHeight: 40, tracking: -0.02, weight: 700, font: "Space Mono" }, // .t-display
    { role: "clock", size: 64, lineHeight: 64, tracking: -0.02, weight: 700, font: "Space Mono" },   // .big-num
  ],
  spacing: [
    { name: "gap", value: 6 },       // space/gap-6
    { name: "gap", value: 10 },      // hr margin 10
    { name: "gap", value: 14 },      // .panel-label margin-bottom 14
    { name: "pad", value: 16 },      // space/panel-pad
    { name: "gap", value: 24 },      // space/gap-24
  ],
  receipts: [{ type: "asset", ref: "kyuri-dashboard/app/globals.css", label: "app/globals.css" }],
};

export const PRESETS = { "stage-fit": STAGE_FIT, "stage-scale": STAGE_SCALE, "stage-hooks": STAGE_HOOKS, "kyuri-scale": KYURI_SCALE };
