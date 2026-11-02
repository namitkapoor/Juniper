/**
 * Any bundled Iconify icon (see scripts/build-icons.mjs) in currentColor.
 * Lucide is the one line set for every UI glyph we draw ourselves; Simple
 * Icons only for brand marks.
 */
import { ICONS } from "./stackIcons.js";

export function Glyph({ name, size = 16, className = "" }) {
  const ic = ICONS[name];
  if (!ic) return null;
  return (
    <svg
      className={`glyph ${ic.line ? "line" : "brand"} ${className}`} width={size} height={size} viewBox={`0 0 ${ic.w} ${ic.h}`}
      aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ic.body }}
    />
  );
}
