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
import { neighbor, readingOrder } from "../engine/nav.js";
import { cellLabel } from "../a11y.js";

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

export function Stage({ layout, fillMap, expanded, onToggleReceipts, reduced, measure, height, reserve, onOpenCase, onExpand, onCollapse, focusId, onTile, hot, quick, preview, previewKey, onAskOpen, faceBusy, intro, onIntroDone, openId, onCloseFocus, onStep, onCaseLink, onDrill, drillLabel, onEscapeStage }) {
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

  // No autoplay anywhere: a video plays only while hovered (never under
  // reduced motion); otherwise on an explicit click / Enter (see Video).
  const [hoverVideo, setHoverVideo] = useState(null);
  const isVideo = (f) => f?.kind === "media" && (f.media === "video" || (f.media === "animation" && /\.(mp4|webm|mov)$/i.test(f.src)));
  const activeVideo = reduced ? null : hoverVideo;

  /* ---- keyboard: one tab stop for the stage, arrows move between tiles ---- */
  const [current, setCurrent] = useState(null); // fillId holding the roving tab stop
  const [hoverCell, setHoverCell] = useState(null); // face tile hovered (lit by the 4-edge layer)
  const hadFocus = useRef(false);
  const liveIds = useMemo(() => new Set(layout?.cells.map((c) => c.fillId)), [layout]);
  const order = useMemo(() => (layout ? readingOrder(layout.cells) : []), [layout]);
  const stopId = current && liveIds.has(current) ? current : order[0];
  const focusCell = useCallback((id) => {
    if (!id) return;
    setCurrent(id);
    rt.cellEls.get(id)?.focus({ preventScroll: false });
  }, [rt]);
  // After a morph: focus stays on the tile that caused it, else the first tile (only if focus was in the stage).
  useLayoutEffect(() => {
    if (!hadFocus.current || !layout) return;
    const el = document.activeElement;
    if (el && el !== document.body && stageEl.current?.contains(el) && el.closest(".cell") && liveIds.has(el.closest(".cell").dataset.fill)) return;
    // the new scene mounts on the next frame
    requestAnimationFrame(() => focusCell(current && liveIds.has(current) ? current : order[0]));
  }, [layout]); // eslint-disable-line react-hooks/exhaustive-deps
  // Receded cells (focus mode) are inert: out of the tab order and the a11y tree.
  useLayoutEffect(() => {
    for (const [id, el] of rt.cellEls) {
      const f = fillMap.get(id);
      if (f?.recede) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    }
  });
  // Closing an open cell (proof / expanded) returns focus to that tile.
  const prevOpen = useRef(null);
  useLayoutEffect(() => {
    const was = prevOpen.current;
    prevOpen.current = openId;
    if (was && !openId && hadFocus.current) {
      const el = document.activeElement;
      if (!el || el === document.body || rt.cellEls.get(was)?.contains(el)) requestAnimationFrame(() => focusCell(liveIds.has(was) ? was : order[0]));
    }
  }, [openId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Focus group: the tile holding the tab stop (and an open tile) lets Tab walk
  // into its own controls; every other tile's controls wait their turn.
  useLayoutEffect(() => {
    for (const [id, el] of rt.cellEls) {
      const reachable = id === openId || (!openId && id === stopId);
      const inner = el.querySelectorAll("a, button, [tabindex], video, input");
      for (const n of inner) {
        if (n === el) continue;
        if (!n.hasAttribute("data-ti")) n.setAttribute("data-ti", n.getAttribute("tabindex") ?? "");
        if (reachable) { const o = n.getAttribute("data-ti"); if (o === "" || o === "-1") n.removeAttribute("tabindex"); else n.setAttribute("tabindex", o); }
        else n.setAttribute("tabindex", "-1");
      }
    }
  });
  const onCellKey = useCallback((e, c) => {
    // A specimen owns its keys (←/→/Space) while it has focus.
    if (e.target.closest?.(".spec") && e.target !== rt.cellEls.get(c.fillId)) return;
    const el = rt.cellEls.get(c.fillId);
    const onSelf = e.target === el;
    const dirs = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    if (onSelf && dirs[e.key]) {
      e.preventDefault();
      const n = neighbor(layout.cells.filter((x) => liveIds.has(x.fillId)), c.fillId, dirs[e.key]);
      if (n) focusCell(n);
      return;
    }
    if (onSelf && (e.key === "Home" || e.key === "End")) { e.preventDefault(); focusCell(e.key === "Home" ? order[0] : order[order.length - 1]); return; }
    if (onSelf && (e.key === "Enter" || e.key === " ")) {
      const target = el.querySelector(".c-tile, .c-face.asks, .drill, .c-media[data-act], .play-glyph, .wl-link, .status-link, .spec-expand");
      if (target) { e.preventDefault(); target.click(); }
      return;
    }
    if (onSelf && (e.key === "p" || e.key === "P")) {
      const tag = el.querySelector(".receipts-tag");
      if (tag) { e.preventDefault(); tag.click(); }
      return;
    }
    if (onSelf && e.key === "Escape" && !openId) { e.preventDefault(); onEscapeStage?.(); return; }
    // Focus trap inside an open (focused) cell.
    if (e.key === "Tab" && openId === c.fillId) {
      const f = [el, ...el.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1']), video[controls]")].filter((n) => n.offsetParent !== null || n === el);
      const i = f.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i >= f.length - 1 ? 0 : i + 1);
      e.preventDefault(); f[next]?.focus();
    }
  }, [layout, liveIds, order, focusCell, openId, onEscapeStage, rt]);

  // The first keyboard focus on a tile shows the key hint once per session.
  const [hint, setHint] = useState(false);
  const maybeHint = useCallback((e) => {
    try {
      if (sessionStorage.getItem("stage-kbd-hint") || !e.currentTarget.matches(":focus-visible")) return;
      sessionStorage.setItem("stage-kbd-hint", "1");
    } catch { return; }
    setHint(true);
  }, []);

  const insetOwners = useMemo(() => {
    const m = new Map();
    for (const c of scene.cells) if (c.inset) m.set(c.fillId, fillMap.get(c.inset.fillId));
    return m;
  }, [scene.cells, fillMap]);

  return (
    <RuntimeCtx.Provider value={rt}>
      <div
        className={`stage ${introOn ? "intro" : ""} ${openId ? "focus-mode" : ""}`}
        role="region" aria-label="Stage. Arrow keys move between tiles, Enter opens, P shows proof, Escape goes back."
        onBlur={(e) => { if (e.relatedTarget && !stageEl.current?.contains(e.relatedTarget)) hadFocus.current = false; }}
        ref={stageEl} id="stage"
        style={height ? { height } : undefined}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {scene.cells.map((c) => {
          const fill = fillMap.get(c.fillId);
          if (!fill) return null;
          return (
            <section
              key={c.fillId}
              role="group" aria-roledescription="tile"
              aria-label={cellLabel(fill, { drillLabel })}
              tabIndex={liveIds.has(c.fillId) && !fill.recede ? (c.fillId === stopId ? 0 : -1) : undefined}
              aria-hidden={!liveIds.has(c.fillId) || fill.recede ? true : undefined}
              onKeyDown={(e) => onCellKey(e, c)}
              onFocus={(e) => { hadFocus.current = true; if (e.target === e.currentTarget) { setCurrent(c.fillId); maybeHint(e); } }}
              className={`cell k-${c.kind} ${fill.recede ? "recede" : ""} ${openId === c.fillId ? "open" : ""}`}
              onClickCapture={fill.recede && onCloseFocus ? (e) => { e.preventDefault(); e.stopPropagation(); onCloseFocus(); } : undefined}
              {...(layout.mode === "stack" && openId === c.fillId ? swipe(onCloseFocus, onStep) : {})}
              data-fill={c.fillId}
              ref={(el) => { if (el) rt.cellEls.set(c.fillId, el); else rt.cellEls.delete(c.fillId); }}
              data-case={fill.caseStudy && onTile ? fill.caseStudy : undefined}
              onPointerEnter={(e) => {
                if (fill.kind === "face" && onAskOpen) setHoverCell(fill.id);
                if (isVideo(fill)) setHoverVideo(fill.id);
              }}
              onPointerLeave={(e) => {
                if (fill.kind === "face") setHoverCell((h) => (h === fill.id ? null : h));
                if (isVideo(fill)) setHoverVideo((h) => (h === fill.id ? null : h));
              }}
            >
              <CellContent
                cell={c} fill={fill} insetFill={insetOwners.get(c.fillId)}
                expanded={expanded} onToggle={onToggleReceipts} pad={layout.mode === "stack" ? 20 : 24} measure={measure}
                activeVideo={activeVideo} onOpenCase={onOpenCase} onStep={onStep} onCaseLink={onCaseLink} onDrill={onDrill} drillLabel={drillLabel} onTile={onTile} hot={hot === fill.caseStudy}
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
            className={`stroke ${s.axis}`} aria-hidden="true"
            data-stroke={s.id}
            ref={(el) => { if (el) rt.strokeEls.set(s.id, el); else rt.strokeEls.delete(s.id); }}
          />
        ))}
      </div>
      {hint && <KeyHint onClose={() => setHint(false)} />}
      <Highlight layout={layout} fillMap={fillMap} hot={hot} openId={openId} cellId={hoverCell && liveIds.has(hoverCell) ? hoverCell : null} />
    </RuntimeCtx.Provider>
  );
}

/**
 * The highlighted tile's outline: exactly the four stroke SEGMENTS that bound
 * its cell, whichever line owns them (a cut, or the frame / chat border just
 * outside the stage), clipped to the cell's extent and drawn above everything.
 */
function Highlight({ layout, fillMap, hot, openId, cellId }) {
  if ((!hot && !openId && !cellId) || !layout) return null;
  // The open (focused) cell, else the hovered home tile, else another hovered tile (Kip).
  const c = openId
    ? layout.cells.find((x) => x.fillId === openId)
    : hot ? layout.cells.find((x) => fillMap.get(x.fillId)?.caseStudy === hot && x.kind === "tile")
    : layout.cells.find((x) => x.fillId === cellId);
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
    onTouchStart: (e) => {
      // A zoomed image owns its gestures: no swipe-to-close or step swipes while zoomed.
      if (e.target.closest?.(".zoom-box.zoomed")) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; top0 = e.currentTarget.scrollTop;
    },
    onTouchEnd: (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (dy > 80 && Math.abs(dx) < 60 && top0 <= 0) onClose?.();
      else if (Math.abs(dx) > 60 && Math.abs(dy) < 50) onStep?.(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    },
  };
}

export const KEYS = [
  ["← ↑ → ↓", "move between tiles"], ["Tab", "into a tile's links and buttons"], ["Enter", "open"],
  ["P", "proof"], ["Esc", "back"], ["?", "all shortcuts"],
];
function KeyHint({ onClose }) {
  return (
    <div className="key-hint" role="note">
      {KEYS.slice(0, 5).map(([k, v]) => <span key={k}><kbd>{k}</kbd> {v}</span>)}
      <button type="button" aria-label="Dismiss keyboard hint" onClick={onClose}>×</button>
    </div>
  );
}
