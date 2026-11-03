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
import { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from "react";
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

const GLIDE_CELLS = ".cell:is(.drills, :has(> .c-tile), :has(> .c-media[data-act]), :has(> .c-face.asks)):not(.recede, .open)";

export function Stage({ tileOverlay, onNamit, layout, fillMap, expanded, onToggleReceipts, reduced, measure, height, reserve, onOpenCase, onExpand, onCollapse, focusId, onTile, hot, quick, preview, previewKey, onAskOpen, faceBusy, intro, onIntroDone, openId, onCloseFocus, onStep, onCaseLink, onDrill, drillLabel, onEscapeStage }) {
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

  // The hover highlight: one surface that GLIDES (spring) from lit tile to lit tile and
  // follows a morph of its tile; inside it a soft spotlight tracks the pointer. The real
  // cursor is never replaced. Off a lit tile it fades where it is; coming back from off
  // it appears in place, so only tile-to-tile moves travel.
  const cursorEl = useRef(null);
  const cur = useRef({ px: 0, py: 0, cell: null, shown: false });
  const paintCursor = useCallback(() => {
    const el = cursorEl.current, c = cur.current, r = c.cell;
    if (!el) return;
    if (!r) { el.classList.remove("on"); c.shown = false; c.lastId = null; return; }
    const fresh = !c.shown || c.lastId !== c.id; // a new tile: hide, place, then fade in
    if (fresh) el.classList.remove("on");
    el.style.transform = `translate3d(${Math.round(r.x)}px, ${Math.round(r.y)}px, 0)`;
    el.style.width = `${Math.round(r.w)}px`;
    el.style.height = `${Math.round(r.h)}px`;
    el.style.setProperty("--mx", `${Math.round(c.px - r.x)}px`);
    el.style.setProperty("--my", `${Math.round(c.py - r.y)}px`);
    if (fresh) { void el.offsetWidth; el.classList.add("on"); }
    c.shown = true;
    c.lastId = c.id;
  }, []);

  const onMove = useCallback((e) => {
    const r = stageEl.current.getBoundingClientRect();
    rt.pointer.x = e.clientX - r.left;
    rt.pointer.y = e.clientY - r.top;
    rt.pointer.inside = e.pointerType !== "touch";
    if (e.pointerType !== "touch") {
      const c = cur.current;
      c.px = rt.pointer.x; c.py = rt.pointer.y;
      maybeTip();
      // Spotlight: only two custom properties per move (no layout); rAF-batched.
      if (c.cell && cursorEl.current && !c.raf) c.raf = requestAnimationFrame(() => {
        c.raf = 0;
        if (!c.cell || !cursorEl.current) return;
        cursorEl.current.style.setProperty("--mx", `${Math.round(c.px - c.cell.x)}px`);
        cursorEl.current.style.setProperty("--my", `${Math.round(c.py - c.cell.y)}px`);
      });
    }
    // Tile hover is driven by pointer MOVEMENT, so a stationary pointer that
    // a morph slides a different tile under never flips the expansion.
    if (onTile && e.pointerType !== "touch") onTile(e.target.closest?.("[data-case]")?.dataset.case ?? null, "move", e);
  }, [rt, onTile]);
  const onLeave = useCallback((e) => {
    rt.pointer.inside = false;
    setGlideId(null);
    cur.current.cell = null; paintCursor();
    if (onTile && e.pointerType !== "touch") onTile(null, "move", e);
  }, [rt, onTile]);

  // No autoplay anywhere: a video plays only while hovered (never under
  // reduced motion); otherwise on an explicit click / Enter (see Video).
  const [hoverVideo, setHoverVideo] = useState(null);
  // One hover highlight that GLIDES from tile to tile with the pointer (instead of each
  // tile switching its own on and off). It sits behind the cells and follows the hovered
  // cell's rect, so a morph carries it along too.
  const [glideId, setGlideId] = useState(null);
  // Lit tile -> the cursor takes its rect (and follows a morph of it); none -> back to the circle.
  useLayoutEffect(() => {
    const g = glideId && !openId ? scene.cells.find((x) => x.fillId === glideId) : null;
    cur.current.cell = g ? { x: g.x, y: g.y, w: g.w, h: g.h } : null;
    cur.current.id = g ? g.fillId : null;
    paintCursor();
  });
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
  // Keyboard entry: with nothing focused (fresh load, or after a mouse click on
  // empty space), the first arrow key or Enter lands on the current tile, so
  // the keyboard works straight away instead of needing a Tab first.
  useEffect(() => {
    const ENTRY = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"]);
    const onKey = (e) => {
      if (!ENTRY.has(e.key) || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement;
      if (a && a !== document.body && a !== document.documentElement) return;
      if (document.querySelector("dialog[open]")) return;
      const id = stopId ?? order[0];
      if (!id || !rt.cellEls.get(id)) return;
      e.preventDefault();
      focusCell(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stopId, order, focusCell, rt]);
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
      // A tile's own action first; then Go deeper (the whole cell drills); then inner controls.
      const target = el.querySelector(".c-tile, .c-face.asks, .c-media[data-act]") || el.querySelector(".drill") || el.querySelector(".play-glyph, .wl-link, .status-link, .spec-expand");
      if (target) { e.preventDefault(); target.click(); }
      else if (el.hasAttribute("data-about")) { e.preventDefault(); el.click(); }
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

  // A click anywhere on a Go-deeper cell drills, except on its own controls
  // (Proof, expand, links, play, media that act themselves) or after a text-selection drag.
  const onCellDrill = useCallback((e, fill) => {
    if (e.defaultPrevented || e.button !== 0) return;
    const t = e.target;
    if (t instanceof Element && t.closest("a, button, input, select, textarea, video[controls], label, [role=button], [data-act], .receipts, .spec")) return;
    if (String(window.getSelection?.() || "").length) return;
    onDrill(fill.opens);
  }, [onDrill]);

  // The first keyboard focus on a tile shows the key hint once per session.
  const [hint, setHint] = useState(false);
  // Pointer users get a one-time tip that the arrow keys work too (after a few seconds
  // of mouse use on the stage, once per session; it leaves on its own).
  const tipTimer = useRef(0);
  const maybeTip = useCallback(() => {
    if (tipTimer.current) return;
    try { if (sessionStorage.getItem("stage-kbd-hint")) { tipTimer.current = -1; return; } } catch { tipTimer.current = -1; return; }
    tipTimer.current = window.setTimeout(() => {
      try { if (sessionStorage.getItem("stage-kbd-hint")) return; sessionStorage.setItem("stage-kbd-hint", "1"); } catch { return; }
      setHint("tip");
      window.setTimeout(() => setHint((h) => (h === "tip" ? false : h)), 9000);
    }, 3500);
  }, []);
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
        role="region" aria-label="Stage. Arrow keys move between tiles, Enter opens, P shows the source, Escape goes back."
        onBlur={(e) => { if (e.relatedTarget && !stageEl.current?.contains(e.relatedTarget)) hadFocus.current = false; }}
        ref={stageEl} id="stage"
        style={height ? { height } : undefined}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div ref={cursorEl} className="stage-cursor" aria-hidden="true" />
        {scene.cells.map((c) => {
          const fill = fillMap.get(c.fillId);
          if (!fill) return null;
          // Go deeper: the whole cell is the target (not while receded or open).
          const drills = !!(fill.opens && onDrill && !fill.recede && openId !== c.fillId && focusId !== c.fillId);
          // The "namit" wordmark on home opens the About page.
          const toAbout = !!(onNamit && fill.kind === "title" && fill.text === "namit" && !fill.recede);
          return (
            <section
              key={c.fillId}
              role="group" aria-roledescription="tile"
              aria-label={toAbout ? "namit: open the About page" : cellLabel(fill, { drillLabel })}
              tabIndex={liveIds.has(c.fillId) && !fill.recede ? (c.fillId === stopId ? 0 : -1) : undefined}
              aria-hidden={!liveIds.has(c.fillId) || fill.recede ? true : undefined}
              onKeyDown={(e) => onCellKey(e, c)}
              onFocus={(e) => { hadFocus.current = true; if (e.target === e.currentTarget) { setCurrent(c.fillId); maybeHint(e); } }}
              className={`cell k-${c.kind} ${fill.recede ? "recede" : ""} ${openId === c.fillId ? "open" : ""} ${focusId === c.fillId ? "is-focus" : ""} ${drills ? "drills" : ""} ${toAbout ? "drills to-about" : ""}`}
              onClickCapture={fill.recede && onCloseFocus ? (e) => { e.preventDefault(); e.stopPropagation(); onCloseFocus(); } : undefined}
              onClick={drills ? (e) => onCellDrill(e, fill) : toAbout ? (e) => { if (!e.defaultPrevented && !e.target.closest?.("a, button")) onNamit(); } : undefined}
              data-about={toAbout ? "" : undefined}
              {...(layout.mode === "stack" && openId === c.fillId ? swipe(onCloseFocus, onStep) : {})}
              data-fill={c.fillId}
              ref={(el) => { if (el) rt.cellEls.set(c.fillId, el); else rt.cellEls.delete(c.fillId); }}
              data-case={fill.caseStudy && onTile ? fill.caseStudy : toAbout && onTile ? "about" : undefined}
              onPointerEnter={(e) => {
                if (e.pointerType !== "touch") setGlideId(e.currentTarget.matches(GLIDE_CELLS) ? c.fillId : null);
                if (fill.kind === "face" && onAskOpen) setHoverCell(fill.id);
                if (isVideo(fill)) setHoverVideo(fill.id);
              }}
              onPointerLeave={(e) => {
                if (fill.kind === "face") setHoverCell((h) => (h === fill.id ? null : h));
                if (isVideo(fill)) setHoverVideo((h) => (h === fill.id ? null : h));
              }}
            >
              <CellContent tileOverlay={tileOverlay}
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
      {hint && <KeyHint tip={hint === "tip"} onClose={() => setHint(false)} />}
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
  ["P", "source"], ["Esc", "back"], ["?", "all shortcuts"],
];
function KeyHint({ onClose, tip = false }) {
  if (tip) return (
    <div className="key-hint tip" role="note">
      <span className="tip-k">Tip</span>
      <span><kbd>← ↑ → ↓</kbd> move between tiles</span>
      <span><kbd>Enter</kbd> open</span>
      <span><kbd>?</kbd> all shortcuts</span>
      <button type="button" aria-label="Dismiss keyboard tip" onClick={onClose}>×</button>
    </div>
  );
  return (
    <div className="key-hint" role="note">
      {KEYS.slice(0, 5).map(([k, v]) => <span key={k}><kbd>{k}</kbd> {v}</span>)}
      <button type="button" aria-label="Dismiss keyboard hint" onClick={onClose}>×</button>
    </div>
  );
}
