/**
 * Magnification for an expanded image (diagrams with tiny text): wheel or
 * trackpad pinch to zoom (up to 4x natural size), drag to pan, double-click
 * toggles fit / 100%, +/−/fit controls, keyboard (+, −, 0, arrows), and
 * pinch / drag on touch. Always the original asset, so zoomed text is sharp.
 * Mounted only while expanded, so closing resets it.
 *
 * Lens: at Fit, a fine pointer hovering the image (or a finger pressed and
 * dragged on touch) shows an elliptical loupe with the same <img> at LENS_ZOOM x,
 * so an SVG is rasterised at that size and stays sharp. Per frame it only
 * writes two transforms (rAF-throttled): no layout, no canvas. Off when zoomed.
 *
 * Refraction: the centre is a flat magnification; the outer band bends like a
 * convex glass rim. An SVG feDisplacementMap on the lens pane reads a static
 * displacement map (built once per lens size on a throwaway canvas, as a data
 * URL): R/G encode the outward offset, 0 inside, ramping up in the outer
 * RIM_BAND, so the rim samples content from further out and compresses it.
 * Without filter support it's the plain magnifier plus the specular rim (LENS_FILTER_OK).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./zoom-lens.css";

const LENS_ZOOM = 1.75; // magnification inside the lens; tune here
const TOUCH_GAP = 28; // px between the finger and the lens edge
const RIM_BAND = 0.18; // outer fraction of the radius that refracts
const RIM_PX = 22; // max outward sampling offset at the rim, px
const PAD = 28; // the filtered pane overhangs the lens so the rim has content to pull in (> RIM_PX)
const FRINGE = true; // a hair of chromatic split at the rim (R and B displaced slightly differently)
const FILTER_ID = "kip-lens";
// Feature check for SVG reference filters on HTML. Where it fails, the lens stays a
// clean magnifier with the CSS rim highlight. (Chromium and Playwright WebKit both
// render the filter correctly and hold 60fps; a real iOS device is the open check.)
const LENS_FILTER_OK = typeof CSS !== "undefined" && CSS.supports?.("filter", "url(#a)") === true;

/** Displacement map for a lw x lh ellipse inside a pane padded by PAD. Neutral = 128. */
function rimMap(lw, lh) {
  const W = lw + PAD * 2, H = lh + PAD * 2;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const im = ctx.createImageData(W, H), d = im.data;
  const a = lw / 2, b = lh / 2, cx = W / 2, cy = H / 2;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = (x + 0.5 - cx) / a, v = (y + 0.5 - cy) / b, r = Math.hypot(u, v);
    const t = Math.min(1, Math.max(0, (r - (1 - RIM_BAND)) / RIM_BAND));
    const f = t * t * (3 - 2 * t); // smoothstep: flat centre, strongest at the edge
    const nx = r ? u / r : 0, ny = r ? v / r : 0;
    const i = (y * W + x) * 4;
    d[i] = 128 + Math.round(127 * f * nx); d[i + 1] = 128 + Math.round(127 * f * ny); d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(im, 0, 0);
  return { url: c.toDataURL("image/png"), W, H };
}

export function ZoomImage({ src, alt, slot }) {
  const box = useRef(null);
  const img = useRef(null);
  const [t, setT] = useState({ s: 1, x: 0, y: 0 }); // s: scale over "fit"
  const fitScale = useRef(1); // fit width / natural width
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const lens = useRef(null);
  const lensImg = useRef(null);
  const feImg = useRef(null);
  const mapKey = useRef("");
  const sRef = useRef(1);
  sRef.current = t.s;
  // geometry measured once per enter / resize, never per frame
  const geo = useRef(null);
  const lensPt = useRef(null); // { x, y, touch } box-relative, latest pointer
  const raf = useRef(0);
  const lensOn = useRef(false);

  const measure = useCallback(() => {
    const el = box.current, n = img.current;
    if (!el || !n || !lensImg.current) return null;
    const r = el.getBoundingClientRect();
    const k = n.naturalWidth && n.naturalHeight ? Math.min(r.width / n.naturalWidth, r.height / n.naturalHeight) : 0;
    const cw = k ? n.naturalWidth * k : r.width, ch = k ? n.naturalHeight * k : r.height;
    const lw = Math.round(Math.min(280, r.width * 0.62)), lh = Math.round(lw * 200 / 280);
    const g = { left: r.left, top: r.top, w: r.width, h: r.height, cx0: (r.width - cw) / 2, cy0: (r.height - ch) / 2, cw, ch, lw, lh };
    lens.current.style.width = `${lw}px`; lens.current.style.height = `${lh}px`;
    lensImg.current.style.width = `${r.width * LENS_ZOOM}px`; lensImg.current.style.height = `${r.height * LENS_ZOOM}px`;
    if (LENS_FILTER_OK && feImg.current && mapKey.current !== `${lw}x${lh}`) {
      const m = rimMap(lw, lh);
      feImg.current.setAttribute("href", m.url);
      feImg.current.setAttribute("width", m.W); feImg.current.setAttribute("height", m.H);
      mapKey.current = `${lw}x${lh}`;
    }
    geo.current = g;
    return g;
  }, []);
  const hideLens = useCallback(() => {
    lensPt.current = null;
    if (lensOn.current && lens.current) { lens.current.classList.remove("on"); box.current?.classList.remove("lens-on"); }
    lensOn.current = false;
  }, []);
  const paintLens = useCallback(() => {
    raf.current = 0;
    const p = lensPt.current, g = geo.current, L = lens.current;
    if (!p || !g || !L) return;
    const inside = p.x >= g.cx0 && p.x <= g.cx0 + g.cw && p.y >= g.cy0 && p.y <= g.cy0 + g.ch;
    if (!inside || sRef.current > 1.001) { hideLens(); return; }
    let lx, ly, ax, ay;
    if (p.touch) {
      // above the finger; flips below when there's no room. The touched point sits at the lens centre.
      lx = p.x - g.lw / 2; ly = p.y - TOUCH_GAP - g.lh;
      if (ly < 0) ly = p.y + TOUCH_GAP;
      lx = Math.min(g.w - g.lw, Math.max(0, lx)); ly = Math.min(g.h - g.lh, Math.max(0, ly));
      ax = g.lw / 2; ay = g.lh / 2;
    } else {
      // centred on the cursor, clamped to the view; the magnified point stays under the cursor
      lx = Math.min(g.w - g.lw, Math.max(0, p.x - g.lw / 2)); ly = Math.min(g.h - g.lh, Math.max(0, p.y - g.lh / 2));
      ax = p.x - lx; ay = p.y - ly;
    }
    L.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
    // the image sits in a pane offset by -PAD, so add PAD back
    lensImg.current.style.transform = `translate3d(${ax + PAD - p.x * LENS_ZOOM}px, ${ay + PAD - p.y * LENS_ZOOM}px, 0)`;
    if (!lensOn.current) { lensOn.current = true; L.classList.add("on"); box.current.classList.add("lens-on"); }
  }, [hideLens]);
  const lensMove = useCallback((e, touch) => {
    const g = geo.current || measure();
    if (!g) return;
    lensPt.current = { x: e.clientX - g.left, y: e.clientY - g.top, touch };
    if (!raf.current) raf.current = requestAnimationFrame(paintLens);
  }, [measure, paintLens]);
  useEffect(() => {
    const el = box.current;
    const ro = new ResizeObserver(() => { geo.current = null; });
    ro.observe(el);
    const stale = () => { geo.current = null; };
    window.addEventListener("scroll", stale, true);
    return () => { ro.disconnect(); window.removeEventListener("scroll", stale, true); cancelAnimationFrame(raf.current); };
  }, []);
  useEffect(() => { if (t.s > 1.001) hideLens(); }, [t.s, hideLens]);

  const maxS = () => Math.max(1, 4 / Math.max(fitScale.current, 1e-6));
  const clamp = useCallback((n) => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return n;
    const s = Math.min(maxS(), Math.max(1, n.s));
    // keep the image covering the view when zoomed in
    const minX = b.width - b.width * s, minY = b.height - b.height * s;
    return { s, x: Math.min(0, Math.max(minX, n.x)), y: Math.min(0, Math.max(minY, n.y)) };
  }, []);
  const zoomAt = useCallback((factor, cx, cy) => {
    setT((p) => {
      const s = Math.min(maxS(), Math.max(1, p.s * factor));
      const k = s / p.s;
      return clamp({ s, x: cx - (cx - p.x) * k, y: cy - (cy - p.y) * k });
    });
  }, [clamp]);

  const onLoad = () => {
    geo.current = null;
    const b = box.current.getBoundingClientRect();
    const n = img.current;
    fitScale.current = Math.min(b.width / n.naturalWidth, b.height / n.naturalHeight);
  };
  useEffect(() => {
    const el = box.current;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const center = () => { const r = box.current.getBoundingClientRect(); return [r.width / 2, r.height / 2]; };
  const moved = useRef(0);
  const clickT = useRef(0);
  const toggleAt = (cx, cy) => {
    // A click zooms to 33% of natural size; if fit is already >= 33%, one step (x1.5, capped at 100%).
    const fit = Math.max(fitScale.current, 1e-6);
    const target = fit < 0.33 ? 0.33 / fit : Math.min(1.5, 1 / fit);
    setT((p) => (p.s > 1.01 ? { s: 1, x: 0, y: 0 } : clamp({ s: target, x: cx * (1 - target), y: cy * (1 - target) })));
  };
  const onPointerDown = (e) => {
    moved.current = 0;
    if (e.pointerType === "touch") {
      if (pointers.current.size === 0 && sRef.current <= 1.001) { measure(); lensMove(e, true); }
      else hideLens(); // second finger: pinch takes over
    }
    box.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    const atFit = sRef.current <= 1.001;
    if (atFit && (e.pointerType === "touch" ? prev && pointers.current.size === 1 : true)) lensMove(e, e.pointerType === "touch");
    if (!prev) return;
    moved.current += Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = box.current.getBoundingClientRect();
      zoomAt(d / pinch.current, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      pinch.current = d;
    } else if (!atFit) {
      setT((p) => clamp({ ...p, x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (e.pointerType === "touch" || e.type === "pointercancel") hideLens();
  };
  // A click/tap toggles fit <-> zoom at that point; a double-click/tap is the
  // same single toggle (the second click within 250ms is swallowed). A drag is a pan, not a click.
  const onClick = (e) => {
    e.stopPropagation();
    if (moved.current > 4) return;
    const now = performance.now();
    if (now - clickT.current < 250) return;
    clickT.current = now;
    const r = box.current.getBoundingClientRect();
    toggleAt(e.clientX - r.left, e.clientY - r.top);
  };
  const onKeyDown = (e) => {
    const [cx, cy] = center();
    if (e.key === "+" || e.key === "=") zoomAt(1.25, cx, cy);
    else if (e.key === "-") zoomAt(0.8, cx, cy);
    else if (e.key === "0") setT({ s: 1, x: 0, y: 0 });
    else if (e.key.startsWith("Arrow") && t.s > 1) {
      const d = 60, dx = e.key === "ArrowLeft" ? d : e.key === "ArrowRight" ? -d : 0, dy = e.key === "ArrowUp" ? d : e.key === "ArrowDown" ? -d : 0;
      setT((p) => clamp({ ...p, x: p.x + dx, y: p.y + dy }));
    } else return;
    e.preventDefault(); e.stopPropagation();
  };

  return (
    <div
      ref={box} className={`zoom-box ${t.s > 1 ? "zoomed" : ""}`} tabIndex={0} aria-label={`${alt} (zoom with + and −, 0 to fit)`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onPointerEnter={(e) => { if (e.pointerType !== "touch") measure(); }} onPointerLeave={(e) => { if (e.pointerType !== "touch") hideLens(); }}
      onKeyDown={onKeyDown} onClick={onClick} onDoubleClick={(e) => e.stopPropagation()}
    >
      <img ref={img} src={src} alt={alt} draggable={false} onLoad={onLoad}
        style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`, transformOrigin: "0 0" }} />
      <div ref={lens} className="zoom-lens" aria-hidden="true">
        <div className="zoom-lens-pane" style={{ inset: -PAD, filter: LENS_FILTER_OK ? `url(#${FILTER_ID})` : undefined }}>
          <img ref={lensImg} src={src} alt="" draggable={false} decoding="async" />
        </div>
        {LENS_FILTER_OK && (
          <svg className="zoom-lens-defs" width="0" height="0" focusable="false">
            <filter id={FILTER_ID} x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feImage ref={feImg} x="0" y="0" preserveAspectRatio="none" result="map" />
              {FRINGE ? (<>
                <feDisplacementMap in="SourceGraphic" in2="map" scale={RIM_PX * 2} xChannelSelector="R" yChannelSelector="G" result="d0" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale={RIM_PX * 2.12} xChannelSelector="R" yChannelSelector="G" result="d1" />
                <feColorMatrix in="d0" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
                <feColorMatrix in="d1" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
                <feComposite in="gb" in2="r" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
              </>) : (
                <feDisplacementMap in="SourceGraphic" in2="map" scale={RIM_PX * 2} xChannelSelector="R" yChannelSelector="G" />
              )}
            </filter>
          </svg>
        )}
      </div>
      {(() => { const ctl = (
      <div className="zoom-ctl" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(0.8, ...center())}>−</button>
        <span className="zoom-pct" role="status" aria-live="polite">{Math.round(t.s * fitScale.current * 100)}%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(1.25, ...center())}>+</button>
        <button type="button" aria-label="Fit" onClick={() => setT({ s: 1, x: 0, y: 0 })}>Fit</button>
      </div>); return slot ? createPortal(ctl, slot) : ctl; })()}
    </div>
  );
}
