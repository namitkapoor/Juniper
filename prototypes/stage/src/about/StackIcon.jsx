/**
 * Stack icons from Iconify (Simple Icons brand marks, Lucide line glyphs),
 * bundled at build time (src/about/stackIcons.js), rendered in currentColor
 * at one optical size. Skills without a brand mark get a neutral line glyph,
 * never an empty box.
 */
import { ICONS } from "./stackIcons.js";

const BY_NAME = [
  [/typescript/i, "simple-icons:typescript"], [/next\.?js/i, "simple-icons:nextdotjs"], [/react three|three\.?js/i, "simple-icons:threedotjs"],
  [/^react/i, "simple-icons:react"], [/node/i, "simple-icons:nodedotjs"], [/python/i, "simple-icons:python"],
  [/claude/i, "simple-icons:claude"], [/agents|rag/i, "lucide:bot"], [/langflow/i, "simple-icons:langflow"],
  [/vertex|cloud run|google cloud/i, "simple-icons:googlecloud"], [/postgres/i, "simple-icons:postgresql"],
  [/bigquery/i, "simple-icons:googlebigquery"], [/notion/i, "simple-icons:notion"], [/n8n/i, "simple-icons:n8n"],
  [/vercel/i, "simple-icons:vercel"], [/playwright/i, "simple-icons:playwright"], [/figma/i, "simple-icons:figma"],
  [/design system/i, "lucide:component"], [/embedding|pgvector/i, "lucide:database"], [/after effects/i, "simple-icons:adobeaftereffects"], [/blender/i, "simple-icons:blender"],
  [/unity/i, "simple-icons:unity"], [/c#|csharp/i, "simple-icons:csharp"],
];

export const iconFor = (name) => (BY_NAME.find(([re]) => re.test(name))?.[1]) || "lucide:layers";

/** An Iconify id from the data wins ("simple-icons:fastapi"); else the name map; else a neutral glyph. */
export function StackIcon({ name, icon, size = 16 }) {
  const ic = ICONS[icon && ICONS[icon] ? icon : iconFor(name)];
  return (
    <svg
      className={`stack-icon ${ic.line ? "line" : "brand"}`} width={size} height={size} viewBox={`0 0 ${ic.w} ${ic.h}`}
      aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ic.body }}
    />
  );
}
