// Light-theme variants of the stage's hairline diagrams: NAME.svg -> NAME-light.svg.
// The diagrams use only the arch.py palette, so this is a color swap, nothing else.
// The stage swaps to NAME-light.svg when it is listed in manifest.json (content.js themedSrc).
// Run: node tools/content/svg-light.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(HERE, "../../public");
const MANIFEST = path.join(HERE, "manifest.json");
export const DIAGRAMS = [
  "assets/chekout/system-context.svg", "assets/chekout/onboarding-flow.svg", "assets/chekout/data-observability.svg",
  "assets/chekout/knowledge.svg", "assets/kyuri-os/architecture.svg",
  "assets/christine-valmy/architecture.svg", "assets/christine-valmy/bridge.svg",
];
// dark -> light, matched to the stage's light tokens (panel #e2e2e0, ink #1a1a1a, ink-2 #3a3a38, mute #545450).
const SWAP = [
  ["#141414", "#e2e2e0"], ["#ececea", "#1a1a1a"], ["#a9a9a4", "#3a3a38"], ["#85857f", "#545450"],
  ["rgba(255,255,255,0.22)", "rgba(0,0,0,0.34)"], ["rgba(255,255,255,0.6)", "rgba(0,0,0,0.62)"],
];
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
for (const rel of DIAGRAMS) {
  let s = fs.readFileSync(path.join(PUBLIC, rel), "utf8");
  for (const [a, b] of SWAP) s = s.split(a).join(b);
  const left = s.match(/#(?:141414|ececea|a9a9a4|85857f)|rgba\(255,255,255/gi);
  if (left) throw new Error(`${rel}: unswapped dark color ${left[0]}`);
  const out = rel.replace(/\.svg$/, "-light.svg");
  fs.writeFileSync(path.join(PUBLIC, out), s);
  for (const r of [rel, out]) {
    const t = fs.readFileSync(path.join(PUBLIC, r), "utf8");
    const [, w, h] = t.match(/width="(\d+)" height="(\d+)"/);
    manifest[r.replace(/^assets\//, "")] = { w: +w, h: +h, bytes: Buffer.byteLength(t), aspect: +(w / h).toFixed(4) };
  }
  console.log(out);
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + "\n");
