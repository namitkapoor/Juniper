/**
 * Specimen: a design system drawn as a measured close-up that redraws itself.
 *
 * One line of real text steps through a type ladder; hairline measurement
 * strokes (baseline, x-height, cap height, line-height bracket, letter-spacing
 * ruler, gap bracket to a neighbouring block) are computed from the real glyph
 * metrics every frame, so they grow WITH the type. On each settle the strokes
 * are re-inked (stroke-dashoffset) and their value labels fade in.
 *
 * mode "scale": the close-up steps up (or down) the ladder.
 * mode "fit":   the stage's own rule. A cell shrinks; the line steps DOWN to
 *               the largest size that still fits inside its padding.
 *
 * It fills its parent (give the parent a size); nothing autoplays on load.
 * It plays while `active` (focus / expanded view), hovered, or focused, and
 * has its own play/pause, prev/next, ←/→ keys and a scrubber.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  resolveSteps, clearMetrics, describeStep, scaleZooms, scaleDrawing, fitZoom, fitDrawing,
  cellWidthAt, fitStep, fmtSizeLH, fmtTracking, labelW, clamp, LABEL_PX,
} from "./geometry.js";
import "./specimen.css";

const DUR = 480; // the stage's ease (cubic in-out), ms
const INK_OUT = 160;
const INK_IN = 520;
const DWELL = 1700; // rest on each step while playing
const FIT_TRAVEL = 1200; // cell shrink between two thresholds
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function usePrefersReduced(override) {
  const [r, setR] = useState(prefersReduced);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setR(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return override ?? r;
}

function useSize(ref) {
  const [s, setS] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setS({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return s;
}

/** Wait for every face the ladder uses; bump a version so metrics re-measure. */
function useFonts(steps) {
  const [v, setV] = useState(0);
  const key = steps.map((s) => `${s.weight} ${s.family}`).join("|");
  useEffect(() => {
    let live = true;
    const faces = [...new Set(steps.map((s) => `${s.weight} 100px "${s.family}"`)), "400 12px Satoshi", "500 12px Satoshi"];
    Promise.all(faces.map((f) => document.fonts?.load(f, "Hxgpy0123").catch(() => null)))
      .then(() => document.fonts?.ready)
      .finally(() => { if (live) { clearMetrics(); setV((x) => x + 1); } });
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

/** A tiny tween runner: value refs advanced by one rAF loop, rendered via state. */
function useTweens(initial) {
  const vals = useRef({ ...initial });
  const tw = useRef({});
  const raf = useRef(0);
  const [, force] = useState(0);
  const done = useRef({});
  const loop = useCallback((now) => {
    let any = false;
    for (const [k, t] of Object.entries(tw.current)) {
      if (!t) continue;
      if (t.start == null) t.start = now;
      const e = clamp((now - t.start) / t.dur, 0, 1);
      vals.current[k] = t.from + (t.to - t.from) * (t.ease ? t.ease(e) : e);
      if (e >= 1) { tw.current[k] = null; const cb = t.onEnd; if (cb) done.current[k] = cb; } else any = true;
    }
    force((x) => x + 1);
    const cbs = done.current; done.current = {};
    Object.values(cbs).forEach((cb) => cb());
    raf.current = any || Object.values(tw.current).some(Boolean) ? requestAnimationFrame(loop) : 0;
  }, []);
  const run = useCallback((k, to, dur, opts = {}) => {
    const from = vals.current[k];
    if (dur <= 0 || from === to) {
      tw.current[k] = null;
      vals.current[k] = to;
      force((x) => x + 1);
      opts.onEnd?.();
      return;
    }
    tw.current[k] = { from, to, dur, ease: opts.ease, onEnd: opts.onEnd, start: null };
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  }, [loop]);
  const set = useCallback((k, v) => { tw.current[k] = null; vals.current[k] = v; force((x) => x + 1); }, []);
  const busy = (k) => !!tw.current[k];
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { v: vals.current, run, set, busy };
}

const Icon = ({ d, fill }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d={d} fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.25" strokeLinecap="square" />
  </svg>
);
const I_PREV = "M8.5 3.5 5 7l3.5 3.5";
const I_NEXT = "M5.5 3.5 9 7l-3.5 3.5";
const I_PLAY = "M4.5 3v8l6.5-4z";
const I_PAUSE = "M4 3h2v8H4zM8 3h2v8H8z";

/** Drawn path with optional ink pass (pathLength 1 + dashoffset). */
const ink = (d, draw, cls = "spec-ink") =>
  d ? <path className={cls} d={d} pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - draw} /> : null;
const r5 = (v) => Math.round(v) + 0.5; // crisp 1px hairlines

/**
 * @param {{
 *   fill: object,               // a `specimen` fill (see src/data/schema.js)
 *   active?: boolean,           // the cell is focused/expanded: play
 *   reduced?: boolean,          // force reduced motion (default: the media query)
 *   initialStep?: number,
 *   onStepChange?: (i: number) => void,
 *   pad?: number,               // inner padding, px (default 16)
 *   className?: string,
 * }} props
 */
export default function Specimen({ fill, active = false, reduced: reducedProp, initialStep = 0, onStepChange, pad = 16, className = "" }) {
  const steps = useMemo(() => resolveSteps(fill), [fill]);
  const n = steps.length;
  const fit = fill.mode === "fit";
  const fitPad = fill.fit?.pad ?? 24;
  const floor = fill.fit?.floor;
  const reduced = usePrefersReduced(reducedProp);
  const fontsV = useFonts(steps);

  const rootRef = useRef(null);
  const drawRef = useRef(null);
  const area = useSize(drawRef);
  const start = clamp(initialStep | 0, 0, Math.max(0, n - 1));
  const T = useTweens({ p: start, tp: start, ink: 1 });
  const { p, tp, ink: inkV } = T.v;

  // ---------------------------------------------------------------- playback
  const [mode, setMode] = useState("auto"); // auto: play while active/hovered/focused; on; off
  const [hover, setHover] = useState(false);
  const [within, setWithin] = useState(false);
  const [announce, setAnnounce] = useState("");
  const playing = n > 1 && (mode === "on" || (mode === "auto" && !reduced && (active || hover || within)));
  const dir = useRef(1);
  const userMoved = useRef(false);

  // Fit: the cell width decides the type; the type tweens to it on its own clock.
  const z = useMemo(() => {
    if (!area.w || !area.h || !n) return null;
    return fit ? fitZoom(steps, area, fitPad) : scaleZooms(steps, area);
  }, [steps, area.w, area.h, fit, fitPad, fontsV]); // eslint-disable-line react-hooks/exhaustive-deps
  const fitTarget = fit && z ? fitStep(z.widths, cellWidthAt(z.widths, p)) : null;
  const cur = fit ? fitTarget ?? Math.round(tp) : Math.round(p);

  // Type change: erase the ink, tween the type, re-ink, then the labels.
  const typeTo = useCallback((target) => {
    const key = fit ? "tp" : "p";
    if (reduced) { T.set(key, target); T.set("ink", 1); return; }
    const dist = Math.abs(T.v[key] - target);
    T.run("ink", 0, INK_OUT * T.v.ink);
    T.run(key, target, Math.min(900, DUR + 140 * Math.max(0, dist - 1)), {
      ease: easeInOut,
      onEnd: () => T.run("ink", 1, INK_IN),
    });
  }, [fit, reduced, T]);

  useEffect(() => {
    if (fit && fitTarget != null && fitTarget !== Math.round(T.v.tp) && !T.busy("tp")) typeTo(fitTarget);
    else if (fit && fitTarget != null && T.busy("tp")) { /* retarget after the current tween */ }
  });

  const goTo = useCallback((target, user = false) => {
    target = clamp(target, 0, n - 1);
    if (user) userMoved.current = true;
    if (fit) {
      if (reduced) T.set("p", target);
      else T.run("p", target, FIT_TRAVEL * Math.max(0.4, Math.abs(T.v.p - target)), { ease: easeInOut });
    } else typeTo(target);
  }, [fit, n, reduced, T, typeTo]);

  const step = useCallback((delta, user) => {
    const base = fit ? Math.round(T.v.p) : Math.round(T.v.p);
    goTo(base + delta, user);
  }, [fit, goTo, T]);

  useEffect(() => { onStepChange?.(cur); }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!userMoved.current || !n) return;
    const s = steps[cur];
    setAnnounce(fit ? `Cell ${Math.round(cellWidthAt(z?.widths || [0], T.v.p))} pixels: ${describeStep(s)}` : describeStep(s));
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autoplay: when settled, rest, then move one step (bouncing at the ends).
  const settled = !T.busy("p") && !T.busy("tp") && !T.busy("ink");
  useEffect(() => {
    if (!playing || !settled) return;
    const first = T.v.ink >= 1 && !userMoved.current && Math.round(T.v.p) === start;
    const id = setTimeout(() => {
      const at = Math.round(T.v.p);
      if (at + dir.current > n - 1 || at + dir.current < 0) dir.current *= -1;
      goTo(at + dir.current);
    }, reduced ? 2600 : first ? 500 : fit ? 900 : DWELL);
    return () => clearTimeout(id);
  }, [playing, settled, p, tp, goTo, n, fit, reduced, start, T]);

  // ---------------------------------------------------------------- input
  const onKeyDown = (e) => {
    if (e.target.type === "range") return; // the scrubber handles its own keys (below)
    if (e.key === "ArrowRight") { e.preventDefault(); step(1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1, true); }
    else if ((e.key === " " || e.key === "k") && e.target === rootRef.current) { e.preventDefault(); togglePlay(); }
  };
  const togglePlay = () => setMode(playing ? "off" : "on");
  const scrubbing = useRef(false);
  const onScrub = (e) => {
    userMoved.current = true;
    scrubbing.current = true;
    const v = Number(e.target.value);
    T.set("p", v);
    if (!fit) T.set("ink", 0);
  };
  const endScrub = () => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    if (!fit) typeTo(Math.round(T.v.p));
  };
  const onScrubKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); step(1, true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); step(-1, true); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0, true); }
    else if (e.key === "End") { e.preventDefault(); goTo(n - 1, true); }
  };

  // ---------------------------------------------------------------- drawing
  const g = useMemo(() => {
    if (!z) return null;
    return fit ? fitDrawing(steps, p, tp, area, z, fitPad) : scaleDrawing(steps, p, area, z);
  }, [z, steps, p, tp, area, fit, fitPad]);

  const s = steps[cur] || steps[0];
  const compact = area.w < 380;
  const labelsOn = clamp((inkV - 0.55) / 0.45, 0, 1);
  const what = fit ? "fit" : "type scale";
  const title = fill.title || (fit ? "Type steps down to fit" : "Type scale");

  if (!n) return null;
  return (
    <div
      ref={rootRef}
      className={`spec ${compact ? "compact" : ""} ${playing ? "playing" : ""} ${className}`}
      role="group"
      aria-roledescription="specimen"
      aria-label={`${title}: ${n} steps. Arrow keys step, space plays or pauses.`}
      tabIndex={0}
      style={{ "--spec-pad": `${pad}px` }}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setWithin(true)}
      onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget)) setWithin(false); }}
    >
      <div className="spec-head">
        <p className="spec-now" aria-hidden="true">
          <span className="spec-role">{s.role}</span>
          <span className="spec-val">{fmtSizeLH(s)}</span>
          {!compact && <span className="spec-val">{fmtTracking(s.tracking)}</span>}
          {!compact && <span className="spec-val">{s.weight}</span>}
          {fit && floor != null && s.size < floor && <span className="spec-floor">under phone floor {floor}</span>}
        </p>
        <div className="spec-ctl">
          <button type="button" aria-label="Previous step" onClick={() => step(-1, true)} disabled={Math.round(p) <= 0}><Icon d={I_PREV} /></button>
          <button type="button" aria-label={playing ? `Pause ${what}` : `Play ${what}`} aria-pressed={playing} onClick={togglePlay}>
            <Icon d={playing ? I_PAUSE : I_PLAY} fill />
          </button>
          <button type="button" aria-label="Next step" onClick={() => step(1, true)} disabled={Math.round(p) >= n - 1}><Icon d={I_NEXT} /></button>
        </div>
      </div>

      <div className="spec-draw" ref={drawRef}>
        {g && (
          <svg width={area.w} height={area.h} aria-hidden="true" focusable="false">
            <Drawing g={g} inkV={inkV} labelsOn={labelsOn} area={area} compact={compact} />
          </svg>
        )}
      </div>

      <div className="spec-foot">
        <input
          className="spec-scrub" type="range" min={0} max={Math.max(1, n - 1)} step="any" value={p}
          aria-label={fit ? "Cell width" : "Position on the type scale"}
          aria-valuetext={fit ? `cell ${Math.round(g?.box?.cellW ?? 0)} pixels, ${s.role} ${fmtSizeLH(s)}` : `${s.role}, ${fmtSizeLH(s)}`}
          onInput={onScrub} onChange={onScrub}
          onPointerUp={endScrub} onKeyUp={endScrub} onBlur={endScrub} onKeyDown={onScrubKey}
        />
        <Ticks steps={steps} cur={cur} n={n} onPick={(i) => goTo(i, true)} fit={fit} floor={floor} widths={z?.widths} />
      </div>

      <div className="sr-only">
        <p>{fit
          ? `A cell shrinks and the text "${fill.sample}" steps down to the largest size that fits inside ${fitPad} pixel padding.`
          : `The text "${fill.sample}" set at each step of the scale, with its baseline, x-height, cap height, line-height and letter-spacing measured.`}</p>
        <ol>{steps.map((st, i) => <li key={i}>{describeStep(st)}{fit && z ? `; fits a cell ${Math.round(z.widths[i])} pixels wide` : ""}</li>)}</ol>
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}

function Ticks({ steps, cur, n, onPick, fit, floor, widths }) {
  const ref = useRef(null);
  const { w } = useSize(ref);
  const room = n > 1 ? w / (n - 1) : w;
  const maxW = Math.max(...steps.map((s) => labelW(String(fit ? s.size : s.role))));
  // Every label if they fit side by side, else every other one (always the ends and the current step).
  const stride = maxW + 12 < room / 1.25 ? 1 : 2 * maxW + 24 < 2 * room ? 2 : 0;
  const show = (i) => stride > 0 && (i % stride === 0 || i === cur || i === n - 1) &&
    !(stride > 1 && i !== cur && Math.abs(i - cur) === 1) && !(stride > 1 && i === n - 2);
  return (
    <div className="spec-ticks" ref={ref} aria-hidden="true">
      {steps.map((s, i) => {
        const x = n > 1 ? (i / (n - 1)) * 100 : 0;
        const edge = i === 0 ? "start" : i === n - 1 ? "end" : "mid";
        return (
          <button
            key={i} type="button" tabIndex={-1}
            className={`spec-tick ${edge} ${i === cur ? "on" : ""} ${floor != null && s.size < floor ? "below" : ""}`}
            style={{ left: `${x}%` }}
            onClick={() => onPick(i)}
            title={`${s.role} ${fmtSizeLH(s)}${fit && widths ? ` · cell ${Math.round(widths[i])}` : ""}`}
          >
            {show(i) ? (fit ? s.size : s.role) : ""}
          </button>
        );
      })}
    </div>
  );
}

function Drawing({ g, inkV, labelsOn, area, compact }) {
  const { lineL, lineR } = g;
  const H = (y) => `M${r5(lineL)} ${r5(y)}H${r5(lineR)}`;
  const lh = `M${r5(g.lh.x + 4)} ${r5(g.lh.top)}H${r5(g.lh.x)}V${r5(g.lh.bottom)}H${r5(g.lh.x + 4)}`;
  const showRuler = g.mode === "scale" || (g.box && g.rulerY > g.box.y + 3 && g.px >= 24);
  const ruler = showRuler && g.ticks.length > 1
    ? `M${r5(g.ticks[0])} ${r5(g.rulerY)}H${r5(g.ticks[g.ticks.length - 1])}` + g.ticks.map((x) => `M${r5(x)} ${r5(g.rulerY)}v5`).join("")
    : null;
  const guides = showRuler ? g.ticks.map((x) => `M${r5(x)} ${r5(g.rulerY + 5)}V${r5(g.baseY)}`).join("") : null;
  const gb = g.gapBracket;
  const gap = gb && gb.bottom - gb.top > 0.5
    ? `M${r5(gb.x - 4)} ${r5(gb.top)}H${r5(gb.x)}V${r5(gb.bottom)}H${r5(gb.x - 4)}` : null;
  const box = g.box;
  const padD = box ? `M${r5(box.x)} ${r5(box.y + box.pad / 2)}H${r5(box.x + box.pad)}M${r5(box.x + box.pad)} ${r5(box.y + box.pad / 2 - 3)}v6` : null;
  const dim = box ? `M${r5(box.x)} ${r5(box.dimY - 4)}v8M${r5(box.x + box.w)} ${r5(box.dimY - 4)}v8M${r5(box.x)} ${r5(box.dimY)}H${r5(box.x + box.w)}` : null;

  // Staggered ink: each stroke starts a little after the previous one.
  const order = [g.capY, g.xY, g.baseY];
  const st = (i, of) => clamp((inkV * (1 + 0.12 * (of - 1)) - 0.12 * i), 0, 1);
  const OF = 6;

  const lbl = (x, y, text, anchor = "start", cls = "spec-lbl") => (
    <text className={cls} x={x} y={y} textAnchor={anchor} dominantBaseline="middle">{text}</text>
  );
  const tight = box && box.slack < 0.5;

  return (
    <g>
      {/* the cell (fit) */}
      {box && <rect className={`spec-cell ${tight ? "tight" : ""}`} x={r5(box.x)} y={r5(box.y)} width={Math.round(box.w)} height={Math.round(box.h)} />}
      {box && <rect className="spec-content" x={r5(box.x + box.pad)} y={r5(box.y + box.pad)} width={Math.max(0, Math.round(box.w - 2 * box.pad))} height={Math.max(0, Math.round(box.h - 2 * box.pad))} />}

      {/* line box + glyph guides (faint, structural) */}
      <path className="spec-soft dashed" d={H(g.lineTop) + H(g.lineBottom)} />
      {guides && <path className="spec-soft" d={guides} />}

      {/* the neighbouring block */}
      {g.block && <rect className="spec-block" x={r5(g.block.x)} y={r5(g.block.y)} width={Math.round(g.block.w)} height={Math.max(1, Math.round(g.block.h))} />}

      {/* pencil: always there, following the type */}
      <path className="spec-pencil" d={order.map(H).join("") + lh + (ruler || "") + (gap || "") + (padD || "") + (dim || "")} />

      {/* ink: redrawn on each settle */}
      {order.map((y, i) => <g key={i}>{ink(H(y), st(i, OF))}</g>)}
      {ink(lh, st(3, OF))}
      {ink(ruler, st(4, OF))}
      {ink(gap, st(5, OF))}
      {padD && ink(padD, st(5, OF))}

      {/* the type itself */}
      {g.fonts.map((f) => f.opacity > 0.001 && (
        <text
          key={f.key} className="spec-glyphs" y={g.baseY} opacity={f.opacity}
          x={f.chars.map((_, c) => (g.textL + f.xs[c]).toFixed(2)).join(" ")}
          style={{ fontFamily: `"${f.family}", "Helvetica Neue", Arial, sans-serif`, fontWeight: f.weight, fontSize: `${g.px}px` }}
        >{f.chars.join("")}</text>
      ))}

      {/* labels */}
      <g opacity={labelsOn}>
        {g.narrow
          ? (() => { const cy = (g.lh.top + g.lh.bottom) / 2, cx = g.lh.x - 9; return (
              <text className="spec-lbl val" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" transform={`rotate(-90 ${cx} ${cy})`}>{g.lh.label}</text>); })()
          : lbl(g.lh.x - 6, (g.lh.top + g.lh.bottom) / 2, g.lh.label, "end", "spec-lbl val")}
        {showRuler && g.mode === "scale" && lbl(g.tracking.x, g.rulerY - 9, g.tracking.label, "end", "spec-lbl val")}
        {g.right.map((r) => (
          <g key={r.id}>
            {r.lineY != null && Math.abs(r.y - r.lineY) > 1.5 && (
              <path className="spec-soft" d={`M${lineR + 1} ${r5(r.lineY)}L${g.rx - 1} ${r.y}`} />
            )}
            {lbl(g.rx, r.y, r.text, "start", r.id === "gap" ? "spec-lbl val" : "spec-lbl")}
          </g>
        ))}
        {box && box.pad >= LABEL_PX + 4 && !compact && lbl(box.x + box.pad + 6, box.y + box.pad / 2, box.padLabel, "start", "spec-lbl")}
      </g>
      {box && lbl(box.x + box.w / 2, box.dimY + 12, box.label, "middle", "spec-lbl val")}
    </g>
  );
}
