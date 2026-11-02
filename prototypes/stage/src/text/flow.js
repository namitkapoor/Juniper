/**
 * Text that flows around things, one line at a time, with Pretext's
 * layoutNextLine(): each row asks "what horizontal intervals are free here?"
 * (the box minus any obstacle crossing this row: a stroke mid-animation, a KPI
 * inset, the receipts tag, the pointer) and pours the next line into each free
 * interval, left to right. Because Pretext's per-line call is pure arithmetic
 * over a prepared handle, this runs every animation frame without touching
 * DOM layout.
 *
 * Painting is real DOM: absolutely positioned spans (selectable). The caller
 * keeps a screen-reader copy of the full text; the line layer is aria-hidden.
 */
import { layoutNextLine } from "@chenglou/pretext";

/**
 * @param {object} p
 * @param p.prepared     PreparedTextWithSegments at the painted font size
 * @param p.width        content box width
 * @param p.height       content box height (lines past it are reported as overflow)
 * @param p.lineHeight
 * @param p.obstacles    [{x,y,w,h}] rects or [{cx,cy,r}] circles, content-box coords
 * @param p.minSlot      narrowest interval worth a line (px)
 * @param p.startY       first row's top (for bottom-anchored titles)
 */
export function flowLines({ prepared, width, height, lineHeight, obstacles = [], minSlot = 48, startY = 0 }) {
  const lines = [];
  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = startY;
  let done = false;
  let guard = 0;
  let broke = false;
  while (!done && guard++ < 400) {
    const slots = freeSlots(width, y, y + lineHeight, obstacles, minSlot);
    for (const [a, b] of slots) {
      const line = layoutNextLine(prepared, b - a, cursor);
      if (!line) { done = true; break; }
      // A narrow slot beside an obstacle should not split a word; leave it empty.
      if (line.end.graphemeIndex !== 0 && b - a < width * 0.9) continue;
      if (line.end.graphemeIndex !== 0) broke = true;
      lines.push({ x: a, y, text: line.text, width: line.width, slotW: b - a });
      cursor = line.end;
    }
    y += lineHeight;
    if (y > height + 4000) break;
  }
  const bottom = lines.length ? lines[lines.length - 1].y + lineHeight : startY;
  return { lines, bottom, overflow: bottom > height + 0.5, broke };
}

/**
 * Several paragraphs flowed one after another (a blank line in the source
 * starts a new one), with `gap` px between them.
 */
export function flowParagraphs({ prepareds, width, height, lineHeight, obstacles = [], startY = 0, gap = 0 }) {
  const lines = [];
  let y = startY, broke = false;
  prepareds.forEach((prepared, i) => {
    const r = flowLines({ prepared, width, height, lineHeight, obstacles, startY: y });
    lines.push(...r.lines);
    broke ||= r.broke;
    y = (r.lines.length ? r.bottom : y) + (i < prepareds.length - 1 ? gap : 0);
  });
  return { lines, bottom: y, overflow: y > height + 0.5, broke };
}

/** Free [a,b) intervals of [0,width) in the row band [y0,y1). */
export function freeSlots(width, y0, y1, obstacles, minSlot) {
  const blocked = [];
  for (const o of obstacles) {
    if (o.r != null) {
      const ny = Math.max(y0, Math.min(o.cy, y1));
      const dy = Math.abs(o.cy - ny);
      if (dy >= o.r) continue;
      const half = Math.sqrt(o.r * o.r - dy * dy);
      blocked.push([o.cx - half, o.cx + half]);
    } else {
      if (o.y + o.h <= y0 || o.y >= y1) continue;
      blocked.push([o.x, o.x + o.w]);
    }
  }
  if (!blocked.length) return [[0, width]];
  blocked.sort((p, q) => p[0] - q[0]);
  const out = [];
  let x = 0;
  for (const [a, b] of blocked) {
    if (a > x && Math.min(a, width) - x >= minSlot) out.push([x, Math.min(a, width)]);
    x = Math.max(x, b);
    if (x >= width) break;
  }
  if (width - x >= minSlot) out.push([x, width]);
  return out;
}

/**
 * Paints lines into a container by reusing a pool of spans. Only touches
 * the DOM properties that changed, so idle frames are nearly free.
 */
export class LinePainter {
  constructor(el) {
    this.el = el;
    this.pool = [];
  }
  paint(lines, { offsetX = 0, offsetY = 0, nudges } = {}) {
    const { pool, el } = this;
    while (pool.length < lines.length) {
      const s = document.createElement("span");
      s.className = "ln";
      el.appendChild(s);
      pool.push({ s, text: null, tf: null, op: null });
    }
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (i >= lines.length) {
        if (p.text !== "") { p.s.textContent = ""; p.text = ""; }
        continue;
      }
      const l = lines[i];
      const nx = nudges ? nudges[i] || 0 : 0;
      // Hanging spaces at a line's end are not part of its measured width; drop them.
      const t = l.text.replace(/\s+$/, "");
      if (p.text !== t) { p.s.textContent = t; p.text = t; }
      const tf = `translate(${(l.x + offsetX + nx).toFixed(2)}px, ${(l.y + offsetY).toFixed(2)}px)`;
      if (p.tf !== tf) { p.s.style.transform = tf; p.tf = tf; }
    }
  }
}
