/**
 * Spatial keyboard navigation over the stage: from a cell, the next cell in a
 * direction is the nearest one beyond that edge that overlaps it on the other
 * axis (ties by the larger overlap, then by distance along the cross axis).
 * Pure geometry over the engine's cell rects, so it works for any layout.
 */
export function neighbor(cells, fromId, dir) {
  const a = cells.find((c) => c.fillId === fromId);
  if (!a) return cells[0]?.fillId ?? null;
  const horiz = dir === "left" || dir === "right";
  let best = null;
  for (const b of cells) {
    if (b === a) continue;
    let gap;
    if (dir === "right") gap = b.x - (a.x + a.w);
    else if (dir === "left") gap = a.x - (b.x + b.w);
    else if (dir === "down") gap = b.y - (a.y + a.h);
    else gap = a.y - (b.y + b.h);
    if (gap < -1) continue; // not beyond that edge
    const overlap = horiz
      ? Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
      : Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const cross = horiz ? Math.abs((b.y + b.h / 2) - (a.y + a.h / 2)) : Math.abs((b.x + b.w / 2) - (a.x + a.w / 2));
    // Prefer cells that share the edge band; fall back to the nearest beyond it.
    const score = [overlap > 1 ? 0 : 1, Math.max(0, gap), overlap > 1 ? -overlap : cross];
    const less = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    if (!best || less(score, best.score) < 0) best = { id: b.fillId, score };
  }
  return best?.id ?? null;
}

/** Reading order: top to bottom, then left to right (Home/End, Tab entry). */
export const readingOrder = (cells) => [...cells].sort((a, b) => (a.y - b.y) || (a.x - b.x)).map((c) => c.fillId);
