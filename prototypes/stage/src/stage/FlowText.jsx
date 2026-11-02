/**
 * A block of text painted line by line with Pretext, re-flowed every frame
 * the Stage asks it to: around animating strokes, around static obstacles
 * (receipts tag, KPI inset).
 *
 * Pointer: deliberately no hover effect on text (it read as overkill).
 * Hook for later: a Lottie face that reacts to the pointer would subscribe to
 * `ctx.pointer` in Stage.jsx's frame loop and render in its own layer; it
 * should not displace text. Nothing is wired yet.
 */
import { useContext, useEffect, useRef } from "react";
import { RuntimeCtx } from "./runtimeCtx.js";
import { preparedFor } from "../text/measure.js";
import { flowParagraphs, LinePainter } from "../text/flow.js";
import { paragraphs, PARA_GAP } from "../engine/typo.js";

const STROKE_CLEAR = 14; // px of air a moving stroke pushes text away by

/**
 * @param props.flowKey   unique key in the runtime registry
 * @param props.fillId    which cell's geometry drives this flow
 * @param props.text
 * @param props.steps     [{size, lineHeight}] largest first
 * @param props.mkFont    size -> font spec
 * @param props.startStep index into steps the engine chose
 * @param props.box       (w,h) -> content box {x,y,w,h} relative to the cell
 * @param props.statics   (box) -> [{x,y,w,h}] obstacles in content coords
 * @param props.anchor    "top" | "bottom"
 * @param props.strictWords  treat a mid-word break as overflow and step the type down (default: always)
 */
export function FlowText({ flowKey, fillId, text, steps, mkFont, startStep = 0, box, statics, anchor = "top", strictWords = true, className = "" }) {
  const rt = useContext(RuntimeCtx);
  const el = useRef(null);
  const props = useRef(null);
  props.current = { fillId, text, steps, mkFont, startStep, box, statics, anchor, strictWords };

  useEffect(() => {
    const painter = new LinePainter(el.current);
    const restCache = new Map();
    let lastKey = "";
    let lastFontKey = "";

    const restFor = (P, b, statics) => {
      const k = `${P.text.length}|${b.w}|${b.h}|${P.startStep}|${JSON.stringify(statics)}|${P.steps[0].size}`;
      let r = restCache.get(k);
      if (r) return r;
      // Largest step (from the engine's choice down) that fits with no dynamic obstacles.
      for (let i = P.startStep; i < P.steps.length; i++) {
        const s = P.steps[i];
        const prepared = paragraphs(P.text).map((t) => preparedFor(t, P.mkFont(s.size)));
        const res = flowParagraphs({ prepareds: prepared, width: b.w, height: b.h, lineHeight: s.lineHeight, obstacles: statics, gap: Math.round(s.lineHeight * PARA_GAP) });
        const broke = P.strictWords && res.broke;
        const lastFits = !res.overflow && !broke;
        if (lastFits || i === P.steps.length - 1) {
          r = { step: i, prepared, lines: res.lines.length, slack: b.h - res.bottom, clip: !lastFits };
          break;
        }
      }
      restCache.set(k, r);
      return r;
    };

    const flow = {
      fillId,
      render(geom, ctx) {
        const P = props.current;
        if (!el.current || !P.text) return;
        const b = P.box(Math.round(geom.w), Math.round(geom.h));
        if (b.w < 20 || b.h < 10) { painter.paint([]); return; }
        const statics = P.statics ? P.statics(b) : [];
        // Stage-level reserved areas (the "Ask the site" button) are obstacles too;
        // bottom-anchored text simply sits above them.
        const R = ctx.reserve;
        if (R && !geom.moving) {
          const rx = R.x - (geom.x + b.x), ry = R.y - (geom.y + b.y);
          if (rx < b.w && rx + R.w > 0 && ry < b.h && ry + R.h > 0) {
            if (P.anchor === "bottom") b.h = Math.max(20, Math.floor(ry) - 8);
            else statics.push({ x: rx - 12, y: ry - 8, w: R.w + 12, h: R.h + 8 });
          }
        }
        const rest = restFor(P, b, statics);
        const s = P.steps[rest.step];
        const ox = geom.x + b.x, oy = geom.y + b.y;

        // Dynamic obstacles: strokes that are mid-flight through this box.
        const dyn = [];
        for (const seg of ctx.segments) {
          if (!seg.moving) continue;
          if (seg.axis === "v") {
            const x = seg.x1 - ox;
            const y0 = Math.min(seg.y1, seg.y2) - oy, y1 = Math.max(seg.y1, seg.y2) - oy;
            if (x < -STROKE_CLEAR || x > b.w + STROKE_CLEAR || y1 < 0 || y0 > b.h) continue;
            dyn.push({ x: x - STROKE_CLEAR, y: y0 - 4, w: STROKE_CLEAR * 2, h: y1 - y0 + 8 });
          } else {
            const y = seg.y1 - oy;
            const x0 = Math.min(seg.x1, seg.x2) - ox, x1 = Math.max(seg.x1, seg.x2) - ox;
            if (y < -STROKE_CLEAR || y > b.h + STROKE_CLEAR || x1 < 0 || x0 > b.w) continue;
            dyn.push({ x: x0 - 6, y: y - STROKE_CLEAR / 2, w: x1 - x0 + 12, h: STROKE_CLEAR });
          }
        }
        const key = `${b.x},${b.y},${b.w},${b.h},${rest.step},${dyn.map((o) => o.r != null ? `${o.cx | 0}:${o.cy | 0}:${o.r | 0}` : `${o.x | 0}:${o.y | 0}:${o.w | 0}:${o.h | 0}`).join(";")},${statics.length}`;
        if (key === lastKey) return;
        lastKey = key;

        const fontKey = `${s.size}|${s.lineHeight}`;
        if (fontKey !== lastFontKey) {
          const f = P.mkFont(s.size);
          el.current.style.font = `${f.weight} ${s.size}px/${s.lineHeight}px ${f.family}`;
          el.current.style.letterSpacing = `${(f.letterSpacingEm || 0) * s.size}px`;
          lastFontKey = fontKey;
        }
        el.current.style.transform = `translate(${b.x}px, ${b.y}px)`;
        el.current.style.width = `${b.w}px`;
        el.current.style.height = `${b.h}px`;
        el.current.classList.toggle("clip", rest.clip);
        if (rest.clip) el.current.dataset.clip = "1"; else delete el.current.dataset.clip;

        const startY = P.anchor === "bottom" ? Math.max(0, b.h - rest.lines * s.lineHeight) : 0;
        const res = flowParagraphs({ prepareds: rest.prepared, width: b.w, height: b.h, lineHeight: s.lineHeight, obstacles: [...statics, ...dyn], startY, gap: Math.round(s.lineHeight * PARA_GAP) });

        // At rest, a split word is a bug the sweep looks for (data-broke).
        if (!dyn.length) { if (res.broke) el.current.dataset.broke = "1"; else delete el.current.dataset.broke; }
        painter.paint(res.lines);
      },
    };
    rt.flows.set(flowKey, flow);
    rt.kick();
    return () => { rt.flows.delete(flowKey); };
  }, [flowKey, rt]);

  return <div className={`flow ${className}`} aria-hidden="true" ref={el} />;
}
