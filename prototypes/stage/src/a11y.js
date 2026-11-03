/**
 * Accessible names for stage cells: one sentence that says what the tile is
 * and what Enter does, read when a tile gets keyboard focus. The painted
 * Pretext lines are aria-hidden; each block keeps one full-text copy, so the
 * content is read once in browse mode and summarised once on focus.
 */
import { caseName } from "./caseName.js";

const first = (t = "", n = 140) => {
  const s = t.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s/)[0];
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
};
const metric = (m) => (m ? `${m.value}${m.unit || ""} ${m.label}` : "");

export function cellLabel(fill, { drillLabel } = {}) {
  if (!fill) return "";
  const act = [];
  if (fill.opens) act.push(`go deeper: ${drillLabel?.(fill.opens) || "more"}`);
  let s;
  switch (fill.kind) {
    case "tile": s = [caseName(fill.caseStudy), fill.task, metric(fill.number), "open case study"]; break;
    case "title": s = [fill.kicker, fill.text]; break;
    case "prose": s = [fill.kicker || fill.heading, first(fill.text)]; break;
    case "quote": s = [`Quote: ${first(fill.text)}`, fill.who]; break;
    case "kpi": s = [`${fill.value}${fill.unit || ""}`, fill.label, fill.period, fill.baseline]; break;
    case "media": s = [fill.alt, fill.caption, fill.media === "video" ? "video, press Enter to play" : fill.caseStudy ? "open case study" : "press Enter to expand"]; break;
    case "commits": {
      const c = fill.items[0];
      s = [`Shipped in ${fill.repo}`, `${fill.items.length} commits`, c ? `latest: ${c.msg}, ${c.date}` : ""]; break;
    }
    case "logos": s = [fill.label || "Logos", fill.items.map((i) => i.name).join(", ")]; break;
    case "face": s = ["Kip, the site's guide", "press Enter to ask Kip"]; break;
    case "worklog": s = [fill.label || "Work history", `${fill.items.length} roles`]; break;
    case "stack": s = [fill.label || "Stack", fill.groups.map((g) => g.group).join(", ")]; break;
    case "offclock": s = [fill.label || "Off the clock"]; break;
    case "rules": s = [fill.tag ? `${fill.label} (${fill.tag})` : fill.label, `${fill.items.length} ${fill.mode === "flow" ? "steps" : "items"}`, fill.mode === "flow" ? fill.items.map((i) => i.text).join(", then ") : ""]; break;
    case "portrait": s = [fill.alt]; break;
    case "gate": s = [fill.label, fill.text]; break;
    case "tokens": s = [fill.label || `ChekOut ${fill.section} tokens`, fill.group || ""]; break;
    case "specimen": s = [fill.title || "Type specimen", `${fill.scale.length} steps, ${fill.scale.map((x) => x.size).join(" / ")} px`]; break;
    default: s = [fill.text || fill.kind];
  }
  // Word joiners (glued hyphens) and trailing full stops don't belong in a spoken label.
  return [...s, ...act].filter(Boolean).map((x) => String(x).replace(/\u2060/g, "").replace(/[.]+$/, "")).join(", ");
}

/** Short name of a fill for button labels ("Source for …"). */
export const shortName = (fill) => first(cellLabel(fill).split(", ").slice(0, 2).join(", "), 80);
