/**
 * The stage: cells + strokes, driven by one requestAnimationFrame loop.
 *
 * React decides WHICH cells and strokes exist (the union of old and new
 * during a morph). The loop decides WHERE they are each frame: it samples the
 * morph timeline, writes geometry straight to the elements, then asks every
 * FlowText to re-wrap against the strokes currently in flight. When nothing
 * moves, the loop sleeps. The pointer position is tracked (for a future Lottie
 * face, see FlowText.jsx) but never moves text.
 */
import { useLayoutEffect, useRef, useState, useMemo, useCallback } from "react";
import { RuntimeCtx } from "./runtimeCtx.js";
import { planMorph, strokeAt, cellAt, snapshot } from "./morph.js";
import { CellContent } from "./cells.jsx";

function createRuntime() {
  const rt = {
    strokeEls: new Map(),
    cellEls: new Map(),
    flows: new Map(),
    plan: null,
    t0: 0,
    raf: 0,
    settled: true,
    onSettle: null,
    pointer: { x: 0, y: 0, inside: false },
    kick() {
      if (!rt.raf) rt.raf = requestAnimationFrame(rt.tick);
    },
    tick(now) {
      rt.raf = 0;
      if (rt.frame(now)) rt.kick();
    },
    frame(now) {
      const plan = rt.plan;
      if (!plan) return false;
      const t = now - rt.t0;
      const segments = [];
      for (const [id, a] of plan.strokes) {
        const g = strokeAt(a, t);
        segments.push(g);
        const el = rt.strokeEls.get(id);
        if (!el) continue;
        const x = Math.min(g.x1, g.x2), y = Math.min(g.y1, g.y2);
        const w = g.axis === "v" ? 1 : Math.abs(g.x2 - g.x1);
        const h = g.axis === "h" ? 1 : Math.abs(g.y2 - g.y1);
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.opacity = g.alpha;
        el.classList.toggle("live", !!g.moving);
      }
      const geoms = new Map();
      let cellsMoving = false;
      for (const [fillId, a] of plan.cells) {
        const g = cellAt(a, t);
        geoms.set(fillId, g);
        cellsMoving ||= g.moving;
        const el = rt.cellEls.get(fillId);
        if (!el) continue;
        el.style.transform = `translate(${g.x}px, ${g.y + g.dy}px)`;
        el.style.width = `${g.w}px`;
        el.style.height = `${g.h}px`;
        el.style.opacity = g.opacity;
        el.style.pointerEvents = a.kind === "out" ? "none" : "";
      }
      const ctx = { segments, pointer: rt.pointer, reserve: rt.reserve };
      for (const f of rt.flows.values()) {
        const g = geoms.get(f.fillId);
        if (g) f.render(g, ctx);
      }
      const morphing = t < plan.end;
      if (!morphing && !rt.settled) {
        rt.settled = true;
        rt.onSettle?.();
      }
      return morphing || cellsMoving;
    },
  };
  return rt;
}

export function Stage({ layout, fillMap, expanded, onToggleReceipts, reduced, measure, height, reserve, onOpenCase, onExpand, onCollapse, focusId, onTile, hot, quick, preview, previewKey, onAskOpen, faceBusy, intro, onIntroDone, openId, onCloseFocus, onStep, onCaseLink, onDrill }) {
  const rtRef = useRef(null);
  if (!rtRef.current) rtRef.current = createRuntime();
  const rt = rtRef.current;
  rt.reduced = reduced;
  rt.reserve = reserve;
  const prevRef = useRef(null);
  const [scene, setScene] = useState({ cells: [], strokes: [], planned: null });
  const [introOn, setIntroOn] = useState(false);
  const stageEl = useRef(null);

  useLayoutEffect(() => {
    if (!layout) return;
    const now = performance.now();
    // Interrupted mid-morph? Continue from the frame on screen, not the old target.
    const interrupted = !!(rt.plan && !rt.settled && now - rt.t0 < rt.plan.end);
    const prev = interrupted ? snapshot(rt.plan, now - rt.t0) : prevRef.current;
    const plan = planMorph(prev, layout, reduced, { quick, interrupted, intro });
    setIntroOn(!!plan.intro);
    prevRef.current = layout;
    rt.plan = plan;
    rt.t0 = now;
    rt.settled = plan.end === 0;
    rt.onSettle = () => {
      setScene({ cells: layout.cells, strokes: layout.strokes, planned: layout });
      if (plan.intro) { setIntroOn(false); onIntroDone?.(); }
    };
    setScene({ cells: plan.sceneCells, strokes: plan.sceneStrokes, planned: layout });
  }, [layout, reduced, rt]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    // Position freshly mounted elements before paint, then let the loop run.
    rt.frame(performance.now());
    rt.kick();
  }, [scene, rt]);

  const onMove = useCallback((e) => {
    const r = stageEl.current.getBoundingClientRect();
    rt.pointer.x = e.clientX - r.left;
    rt.pointer.y = e.clientY - r.top;
    rt.pointer.inside = e.pointerType !== "touch";
    // Tile hover is driven by pointer MOVEMENT, so a stationary pointer that
    // a morph slides a different tile under never flips the expansion.
    if (onTile && e.pointerType !== "touch") onTile(e.target.closest?.("[data-case]")?.dataset.case ?? null, "move", e);
  }, [rt, onTile]);
  const onLeave = useCallback((e) => {
    rt.pointer.inside = false;
    if (onTile && e.pointerType !== "touch") onTile(null, "move", e);
  }, [rt, onTile]);

  // One video at a time: the hovered one, else the heaviest on stage.
  const [hoverVideo, setHoverVideo] = useState(null);
  const isVideo = (f) => f?.kind === "media" && (f.media === "video" || (f.media === "animation" && /\.(mp4|webm|mov)$/i.test(f.src)));
  const activeVideo = useMemo(() => {
    if (reduced) return null;
    const live = new Set(layout?.cells.map((c) => c.fillId));
    // An expanded media owns playback: its video plays, nothing else does.
    const focused = layout?.cells.map((c) => fillMap.get(c.fillId)).find((f) => f?.focused);
    if (focused) return isVideo(focused) ? focused.id : null;
    if (hoverVideo && live.has(hoverVideo)) return hoverVideo;
    let best = null;
    for (const c of layout?.cells ?? []) {
      const f = fillMap.get(c.fillId);
      if (isVideo(f) && (!best || f.weight > best.weight)) best = f;
    }
    return best?.id ?? null;
  }, [reduced, hoverVideo, layout, fillMap]);

  const insetOwners = useMemo(() => {
    const m = new Map();
    for (const c of scene.cells) if (c.inset) m.set(c.fillId, fillMap.get(c.inset.fillId));
    return m;
  }, [scene.cells, fillMap]);

  return (
    <RuntimeCtx.Provider value={rt}>
      <div
        className={`stage ${introOn ? "intro" : ""} ${openId ? "focus-mode" : ""}`}
        ref={stageEl}
        style={height ? { height } : undefined}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {scene.cells.map((c) => {
          const fill = fillMap.get(c.fillId);
          if (!fill) return null;
          const ariaLabel = fill.kind === "media" ? fill.alt : undefined;
          return (
            <section
              key={c.fillId}
              className={`cell k-${c.kind} ${fill.recede ? "recede" : ""} ${openId === c.fillId ? "open" : ""}`}
              onClickCapture={fill.recede && onCloseFocus ? (e) => { e.preventDefault(); e.stopPropagation(); onCloseFocus(); } : undefined}
              {...(layout.mode === "stack" && openId === c.fillId ? swipe(onCloseFocus, onStep) : {})}
              data-fill={c.fillId}
              aria-label={ariaLabel}
              ref={(el) => { if (el) rt.cellEls.set(c.fillId, el); else rt.cellEls.delete(c.fillId); }}
              data-case={fill.caseStudy && onTile ? fill.caseStudy : undefined}
              onPointerEnter={(e) => {
                if (isVideo(fill)) setHoverVideo(fill.id);
              }}
              onPointerLeave={(e) => {
                if (isVideo(fill)) setHoverVideo((h) => (h === fill.id ? null : h));
              }}
            >
              <CellContent
                cell={c} fill={fill} insetFill={insetOwners.get(c.fillId)}
                expanded={expanded} onToggle={onToggleReceipts} pad={layout.mode === "stack" ? 20 : 24} measure={measure}
                activeVideo={activeVideo} onOpenCase={onOpenCase} onStep={onStep} onCaseLink={onCaseLink} onDrill={onDrill} onTile={onTile} hot={hot === fill.caseStudy}
                attachFill={c.attach ? fillMap.get(c.attach.fillId) : undefined}
                preview={fill.kind === "title" && fill.text === "namit" && onTile ? { current: preview, key: previewKey } : undefined}
                reduced={reduced} onAskOpen={onAskOpen} faceBusy={faceBusy}
                onExpand={onExpand} onCollapse={onCollapse} focused={focusId === c.fillId}
              />
            </section>
          );
        })}
        {scene.strokes.map((s) => (
          <div
            key={s.id}
            className={`stroke ${s.axis}`}
            data-stroke={s.id}
            ref={(el) => { if (el) rt.strokeEls.set(s.id, el); else rt.strokeEls.delete(s.id); }}
          />
        ))}
      </div>
      <Highlight layout={layout} fillMap={fillMap} hot={hot} openId={openId} />
    </RuntimeCtx.Provider>
  );
}

/**
 * The highlighted tile's outline: exactly the four stroke SEGMENTS that bound
 * its cell, whichever line owns them (a cut, or the frame / chat border just
 * outside the stage), clipped to the cell's extent and drawn above everything.
 */
function Highlight({ layout, fillMap, hot, openId }) {
  if ((!hot && !openId) || !layout) return null;
  // The open (focused) cell, else the hovered home tile.
  const c = openId
    ? layout.cells.find((x) => x.fillId === openId)
    : layout.cells.find((x) => fillMap.get(x.fillId)?.caseStudy === hot && x.kind === "tile");
  if (!c) return null;
  const W = layout.rect.w, H = layout.rect.h;
  const left = c.x <= 0 ? -1 : c.x;
  const right = c.x + c.w >= W ? W : c.x + c.w;
  const top = c.y <= 0 ? -1 : c.y;
  const bottom = c.y + c.h >= H ? H : c.y + c.h;
  const segs = [
    { k: "t", x: left, y: top, w: right - left + 1, h: 1 },
    { k: "b", x: left, y: bottom, w: right - left + 1, h: 1 },
    { k: "l", x: left, y: top, w: 1, h: bottom - top + 1 },
    { k: "r", x: right, y: top, w: 1, h: bottom - top + 1 },
  ];
  return (
    <div className={`hl-layer ${openId ? "is-open" : ""}`} aria-hidden data-for={c.fillId}>
      {segs.map((g) => <i key={g.k} className={`hl-seg hl-${g.k}`} style={{ left: g.x, top: g.y, width: g.w, height: g.h }} />)}
    </div>
  );
}

/**
 * Phone sheets: swipe down (from the top of the sheet) closes the open cell;
 * swipe left / right steps through a process sequence.
 */
function swipe(onClose, onStep) {
  let x0 = null, y0 = null, top0 = 0;
  return {
    onTouchStart: (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; top0 = e.currentTarget.scrollTop; },
    onTouchEnd: (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (dy > 80 && Math.abs(dx) < 60 && top0 <= 0) onClose?.();
      else if (Math.abs(dx) > 60 && Math.abs(dy) < 50) onStep?.(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    },
  };
}
