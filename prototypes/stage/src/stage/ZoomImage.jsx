/**
 * Magnification for an expanded image (diagrams with tiny text): wheel or
 * trackpad pinch to zoom (up to 4x natural size), drag to pan, double-click
 * toggles fit / 100%, +/−/fit controls, keyboard (+, −, 0, arrows), and
 * pinch / drag on touch. Always the original asset, so zoomed text is sharp.
 * Mounted only while expanded, so closing resets it.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ZoomImage({ src, alt, slot }) {
  const box = useRef(null);
  const img = useRef(null);
  const [t, setT] = useState({ s: 1, x: 0, y: 0 }); // s: scale over "fit"
  const fitScale = useRef(1); // fit width / natural width
  const pointers = useRef(new Map());
  const pinch = useRef(null);

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
    box.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    moved.current += Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = box.current.getBoundingClientRect();
      zoomAt(d / pinch.current, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      pinch.current = d;
    } else {
      setT((p) => clamp({ ...p, x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
    }
  };
  const onPointerUp = (e) => { pointers.current.delete(e.pointerId); if (pointers.current.size < 2) pinch.current = null; };
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
      onKeyDown={onKeyDown} onClick={onClick} onDoubleClick={(e) => e.stopPropagation()}
    >
      <img ref={img} src={src} alt={alt} draggable={false} onLoad={onLoad}
        style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`, transformOrigin: "0 0" }} />
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
