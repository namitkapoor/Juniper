import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Face } from "./Face.jsx";

/* ---------------------------------------------------------------- drag
 * One gesture model for the phone sheet (y) and the desktop panel (x).
 * Position runs 0 (open) .. span (closed). Past either end it rubber-bands.
 * On release a flick (|v| over FLICK px/ms) wins; otherwise the nearer end.
 */
const SLOP = 6; // px before a press becomes a drag (below it, it's a tap)
const FLICK = 0.45; // px/ms
const BAND = 48; // rubber band asymptote, px
const rubber = (d) => (BAND * d * 0.5) / (d * 0.5 + BAND);
export const band = (p, span) => (p < 0 ? -rubber(-p) : p > span ? span + rubber(p - span) : p);
/** Where a released sheet goes: true = open. */
export const settleOpen = (pos, v, span) => (Math.abs(v) > FLICK ? v < 0 : pos < span / 2);
// Velocity over the last 100ms of movement; a hold before release reads as 0.
const velocity = (s, tEnd) => {
  const last = s[s.length - 1];
  if (tEnd - last.t > 90) return 0;
  let first = last;
  for (let i = s.length - 1; i >= 0 && last.t - s[i].t <= 100; i--) first = s[i];
  const dt = last.t - first.t;
  return dt > 0 ? (last.c - first.c) / dt : 0;
};
const now = () => performance.now();

function useDrag(cfg) {
  const c = useRef(cfg);
  c.current = cfg;
  const g = useRef(null);
  const suppress = useRef(false);
  const api = useRef(null);
  if (!api.current) {
    const begin = (co, el, id) => {
      const span = c.current.span();
      g.current = { c0: co, b: c.current.base(span), pos: 0, span, moved: false, el, id, s: [{ t: now(), c: co }] };
      g.current.pos = g.current.b;
    };
    const move = (co) => {
      const d = g.current;
      if (!d) return;
      let dd = co - d.c0;
      if (!d.moved) {
        if (Math.abs(dd) < SLOP) return;
        d.moved = true;
        d.c0 += Math.sign(dd) * SLOP;
        dd = co - d.c0;
        if (d.el && d.id != null) try { d.el.setPointerCapture(d.id); } catch { /* pointer already gone */ }
        c.current.start();
      }
      d.pos = band(d.b + dd, d.span);
      c.current.apply(d.pos, d.span);
      d.s.push({ t: now(), c: co });
      if (d.s.length > 12) d.s.shift();
    };
    const end = (co, cancel) => {
      const d = g.current;
      g.current = null;
      if (!d || !d.moved) return;
      suppress.current = true;
      setTimeout(() => { suppress.current = false; }, 0);
      if (co != null && co !== d.s[d.s.length - 1].c) d.s.push({ t: now(), c: co });
      c.current.finish(settleOpen(d.pos, cancel ? 0 : velocity(d.s, now()), d.span), d.pos, d.span);
    };
    const xy = (e) => (c.current.axis === "x" ? e.clientX : e.clientY);
    api.current = {
      begin, move, end,
      bind: {
        onPointerDown: (e) => {
          if (e.button !== 0 || !c.current.enabled()) return;
          const el = e.currentTarget;
          begin(xy(e), el, e.pointerId);
          // Capture now unless the press is on a nested control (the header's close
          // button), which must keep its own click; that one captures once it moves.
          if (e.target.closest?.("button, a, input") === el || !el.contains(e.target.closest?.("button, a, input"))) {
            try { el.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
          }
        },
        onPointerMove: (e) => { if (g.current?.id === e.pointerId) move(xy(e)); },
        onPointerUp: (e) => { if (g.current?.id === e.pointerId) end(xy(e)); },
        onPointerCancel: (e) => { if (g.current?.id === e.pointerId) end(null, true); },
        // a drag is not a click
        onClickCapture: (e) => { if (suppress.current) { e.preventDefault(); e.stopPropagation(); } },
      },
    };
  }
  return api.current;
}

const SNAP_MS = 300;
const EASE = "cubic-bezier(.2,.7,.2,1)";
const snapMs = (dist, span) => Math.round(Math.max(160, Math.min(SNAP_MS, (SNAP_MS * Math.abs(dist)) / Math.max(span, 1))));

/**
 * The chat column: the reply is the thesis (one sentence); the evidence
 * arrives on the stage as a layout. Messages, suggested questions, input.
 * Renders its own wrap (.chat-wrap). Desktop opens from Kip's face tile or the gutter "Ask Kip" button.
 */
/**
 * Kip's reply streams in word by word (about 30 words a second), each word
 * fading in on two pixel steps. Screen readers get the whole reply at once
 * (sr-only copy); the animated words are aria-hidden. Reduced motion: instant.
 */
function StreamText({ text, reduced }) {
  const parts = useMemo(() => String(text || "").split(/(\s+)/), [text]);
  const [n, setN] = useState(reduced ? parts.length : 0);
  useEffect(() => {
    if (reduced) { setN(parts.length); return undefined; }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(parts.length, i + 2); // a word and the space after it
      setN(i);
      if (i >= parts.length) clearInterval(id);
    }, 33);
    return () => clearInterval(id);
  }, [parts, reduced]);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{parts.slice(0, n).map((w, i) => <span key={i} className="st-w">{w}</span>)}</span>
    </>
  );
}

export function Chat({ open, messages, chips, onAsk, onChip, busy, onClose, onOpen, phone, busyFace, reduced, onReopen, focusNonce, chatW = 0, openW = 0 }) {
  const [q, setQ] = useState("");
  // Phone: the chat is a bottom sheet. Peek = face + latest reply + chips + input;
  // drag (or tap) the handle up to see the whole conversation, down to peek again.
  const [sheet, setSheet] = useState(false);
  // null | "drag" (finger down) | "settle" (snapping) | "settled" (one frame, no width transition)
  const [drag, setDrag] = useState(null);
  const aside = useRef(null);
  const wrap = useRef(null);
  const tab = useRef(null);
  const drawer = useRef(null);
  const body = useRef(null);
  const reply = useRef(null);
  const list = useRef(null);
  const input = useRef(null);
  const peek = useRef(0);
  const st = useRef({});
  st.current = { open, sheet, phone, reduced, openW, onOpen, onClose };

  // A closed (hidden) panel takes no focus at all.
  useEffect(() => {
    if (!aside.current) return;
    if (!open && !phone) aside.current.setAttribute("inert", ""); else aside.current.removeAttribute("inert");
  }, [open, phone]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  // Asking Kip explicitly always lands in the input.
  useEffect(() => { if (focusNonce) requestAnimationFrame(() => input.current?.focus({ preventScroll: true })); }, [focusNonce]);
  // Opening the chat focuses its input, unless the visitor is working the stage by keyboard.
  useEffect(() => {
    if (!open || phone) return;
    const a = document.activeElement;
    if (a && a !== document.body && a.closest?.(".stage")) return;
    input.current?.focus({ preventScroll: true });
  }, [open, phone]);

  // Phone: how far the drawer sits down at peek = the conversation's height
  // minus the latest reply (which is what peek shows). Re-measured on resize.
  useLayoutEffect(() => {
    if (!phone) return;
    const d = drawer.current, b = body.current;
    if (!d || !b) return;
    const measure = () => {
      const p = Math.max(0, b.offsetHeight - (reply.current?.offsetHeight || 0));
      if (p === peek.current && d.style.getPropertyValue("--peek")) return;
      peek.current = p;
      const prev = d.style.transition;
      d.style.transition = "none";
      d.style.setProperty("--peek", `${p}px`);
      void d.offsetHeight;
      d.style.transition = prev;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    if (reply.current) ro.observe(reply.current);
    return () => ro.disconnect();
  }, [phone, messages]);

  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };

  const styleAll = (els, s) => els.forEach((el) => el && Object.assign(el.style, s));

  const sheetDrag = useDrag({
    axis: phone ? "y" : "x",
    enabled: () => true,
    span: () => (st.current.phone ? peek.current : st.current.openW),
    base: (span) => (st.current.phone ? (st.current.sheet ? 0 : span) : st.current.open ? 0 : span),
    start: () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      styleAll(st.current.phone ? [drawer.current, list.current, reply.current] : [aside.current, tab.current], { transition: "none" });
      setDrag("drag");
    },
    apply: (pos, span) => {
      if (st.current.phone) {
        drawer.current.style.transform = `translate3d(0, ${pos}px, 0)`;
        const p = span ? Math.min(1, Math.max(0, 1 - pos / span)) : 1;
        if (list.current) list.current.style.opacity = String(p);
        if (reply.current) reply.current.style.opacity = String(1 - p);
      } else {
        aside.current.style.transform = `translate3d(${pos}px, 0, 0)`;
        if (tab.current) tab.current.style.transform = `translate3d(${pos - span}px, 0, 0)`;
      }
    },
    finish: (toOpen, pos, span) => {
      const { phone: ph, reduced: rd } = st.current;
      const target = toOpen ? 0 : span;
      const ms = rd ? 0 : snapMs(target - pos, span);
      const tr = ms ? `transform ${ms}ms ${EASE}, opacity ${ms}ms ${EASE}` : "none";
      setDrag("settle");
      if (ph) {
        styleAll([drawer.current, list.current, reply.current], { transition: tr });
        drawer.current.style.transform = `translate3d(0, ${target}px, 0)`;
        if (list.current) list.current.style.opacity = toOpen ? "1" : "0";
        if (reply.current) reply.current.style.opacity = toOpen ? "0" : "1";
        setSheet(toOpen);
        later(() => {
          styleAll([drawer.current, list.current, reply.current], { transition: "", transform: "", opacity: "" });
          setDrag(null);
        }, ms + 20);
      } else {
        styleAll([aside.current, tab.current], { transition: tr });
        aside.current.style.transform = `translate3d(${target}px, 0, 0)`;
        if (tab.current) tab.current.style.transform = `translate3d(${target - span}px, 0, 0)`;
        later(() => {
          // Settle the stage width once, then drop the overlay in the same frame.
          flushSync(() => {
            if (toOpen !== st.current.open) (toOpen ? st.current.onOpen : st.current.onClose)?.();
            setDrag("settled");
          });
          styleAll([aside.current, tab.current], { transition: "", transform: "" });
          requestAnimationFrame(() => requestAnimationFrame(() => setDrag((d) => (d === "settled" ? null : d))));
        }, ms + 20);
      }
    },
  });

  // Escape anywhere inside the chat closes it (desktop) or collapses the sheet
  // (phone) and stops there: the stage's own Escape (focus mode, drill, a
  // selection) never also fires. A capture listener on window, registered at
  // mount, runs before the stage's (bubble, or capture registered later).
  // With text in the input, the first Escape clears it; the next one closes.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape" || e.defaultPrevented || !aside.current?.contains(e.target)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const s = st.current;
      if (e.target === input.current && input.current.value) { setQ(""); return; }
      if (s.phone) {
        if (s.sheet) setSheet(false);
        aside.current.querySelector(".sheet-handle")?.focus({ preventScroll: true });
      } else if (s.open) s.onClose?.();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  // Phone: with the sheet open, pulling the list down collapses it only once
  // the list is scrolled to the top; every other touch scrolls the list.
  useEffect(() => {
    const el = list.current;
    if (!phone || !el) return;
    let t0 = null, decided = false, pulling = false;
    const ts = (e) => {
      pulling = false; decided = false;
      t0 = st.current.sheet && e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    };
    const tm = (e) => {
      if (!t0) return;
      const t = e.touches[0];
      if (!decided) {
        const dy = t.clientY - t0.y, dx = t.clientX - t0.x;
        if (!dy && !dx) return;
        decided = true;
        if (dy > 0 && el.scrollTop <= 0 && Math.abs(dy) >= Math.abs(dx)) { pulling = true; sheetDrag.begin(t0.y, null, null); }
        else { t0 = null; return; }
      }
      if (pulling) { if (e.cancelable) e.preventDefault(); sheetDrag.move(t.clientY); }
    };
    const te = (e) => {
      if (pulling) sheetDrag.end(e.changedTouches[0]?.clientY ?? null, e.type === "touchcancel");
      t0 = null; pulling = false;
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", te);
    el.addEventListener("touchcancel", te);
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", te);
      el.removeEventListener("touchcancel", te);
    };
  }, [phone, sheetDrag]);

  // user + bot pairs
  const exchanges = [];
  for (const m of messages) {
    if (m.role === "user") exchanges.push({ q: m.text, a: null });
    else if (m.role === "bot") { if (!exchanges.length || exchanges[exchanges.length - 1].a) exchanges.push({ q: null, a: m }); else exchanges[exchanges.length - 1].a = m; }
  }
  const submit = (text) => {
    const t = (text ?? q).trim();
    if (!t || busy) return;
    onAsk(t);
    setQ("");
  };

  /* ------------------------------------------------------- roving list
   * Earlier questions + suggested chips are one composite widget: a single
   * Tab stop, arrows move inside it, ArrowUp from the input (caret at 0)
   * enters it from the bottom, ArrowDown off the last item returns there. */
  const [rove, setRove] = useState(null);
  const histOn = !phone || sheet; // on phone peek the history is hidden
  const keys = [
    ...(histOn ? exchanges.slice(0, -1).map((_, i) => `h${i}`) : []),
    ...chips.map((c) => `c${c.label}`),
  ];
  const cur = keys.includes(rove) ? rove : keys.find((k) => k[0] === "c") ?? keys[0];
  const roveProps = (k) => ({ "data-rove": k, tabIndex: k === cur ? 0 : -1, onFocus: () => setRove(k) });
  const roveItems = () => [...(aside.current?.querySelectorAll("[data-rove]") ?? [])]
    .filter((el) => !el.disabled && (el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true));
  const focusItem = (el) => { setRove(el.dataset.rove); el.focus(); el.scrollIntoView?.({ block: "nearest", inline: "nearest" }); };
  const onKeyDown = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t === input.current) {
      if (!e.key.startsWith("Arrow")) return;
      e.stopPropagation(); // arrows in the input move the caret, never the stage
      if (e.key === "ArrowUp" && !e.shiftKey && (!t.value || (t.selectionStart === 0 && t.selectionEnd === 0))) {
        const items = roveItems();
        if (items.length) { e.preventDefault(); focusItem(items[items.length - 1]); }
      }
      return;
    }
    if (!t.dataset?.rove) return;
    const items = roveItems();
    const i = items.indexOf(t);
    let j;
    switch (e.key) {
      case "ArrowDown": case "ArrowRight": j = i + 1; break;
      case "ArrowUp": case "ArrowLeft": j = i - 1; break;
      case "Home": j = 0; break;
      case "End": j = items.length - 1; break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (j >= items.length) { if (e.key === "ArrowDown") input.current?.focus(); return; }
    if (j >= 0 && items[j]) focusItem(items[j]);
  };

  const lastBot = phone && messages.length > 0 ? [...messages].reverse().find((m) => m.role === "bot") : null;
  const latestBot = [...messages].reverse().find((m) => m.role === "bot");
  const faceMood = latestBot ? { mood: latestBot.mood || "answer", moodKey: `${messages.length}:${latestBot.text}` } : {};
  const sliding = drag === "drag" || drag === "settle";

  const listEl = (
    <ol className="chat-list" ref={list} aria-live="polite">
      {messages.length === 0 && (
        <li className="msg sys hint">Ask about the work. The answer comes back as a layout on the left, with receipts.</li>
      )}
      {/* Only the latest exchange is open; earlier ones collapse to their question
          (click one to bring that answer back on stage). */}
      {exchanges.map((ex, i) => (i < exchanges.length - 1 ? (
        <li key={i} className="turn-collapsed">
          <button type="button" {...roveProps(`h${i}`)} onClick={() => onReopen?.(ex.q)} title="Show this answer on the stage">
            <span aria-hidden>→</span> {ex.q}
          </button>
        </li>
      ) : (
        <li key={i} className="turn-open">
          {ex.q && <div className="msg user"><div className="msg-text">{ex.q}</div></div>}
          {ex.a && (
            <div className="msg bot" data-match={ex.a.match || undefined}>
              <Face size={56} busy={busyFace} mood={ex.a.mood || "answer"} moodKey={`${i}:${ex.a.text}`} reduced={reduced} className="msg-face" />
              <div className="msg-text"><StreamText text={ex.a.text} reduced={reduced} /></div>
              {ex.a.link && <a className="msg-link" href={ex.a.link.url} target="_blank" rel="noopener noreferrer">{ex.a.link.label} <span aria-hidden>→</span></a>}
              <div className="label msg-how">Kip{ex.a.how ? ` · ${ex.a.how}` : ""}</div>
            </div>
          )}
        </li>
      )))}
      {busy && <li className="msg sys">…</li>}
    </ol>
  );

  return (
    <>
      <div ref={wrap} className={`chat-wrap ${sliding ? "dragging" : ""} ${drag === "settled" ? "settled" : ""}`} style={phone ? undefined : { width: drag ? openW : chatW }}>
        <aside ref={aside} id="kip-chat" onKeyDown={onKeyDown}
          className={`chat ${open ? "open" : ""} ${messages.length === 0 ? "empty" : ""} ${reduced ? "instant" : ""} ${phone && sheet ? "sheet-open" : ""} ${sliding ? "dragging" : ""}`}
          aria-label="Ask Kip" aria-hidden={!open && !phone}>
          {phone ? (
            <div className="sheet-drawer" ref={drawer}>
              <button
                type="button" className="sheet-handle" aria-expanded={sheet} aria-label={sheet ? "Ask Kip, collapse the conversation" : "Ask Kip, expand the conversation"}
                onClick={() => setSheet((v) => !v)} {...sheetDrag.bind}
              >
                <span className="grip" aria-hidden />
                <Face size={30} busy={busyFace} {...faceMood} reduced={reduced} />
                <span className="label">Ask Kip</span>
              </button>
              <div className="sheet-body" ref={body}>
                {listEl}
                {lastBot && <div className="phone-reply" ref={reply} tabIndex={0} role="region" aria-label="Kip's latest reply"><StreamText text={lastBot.text} reduced={reduced} /></div>}
              </div>
            </div>
          ) : (
            <>
              {/* One face: big and centered while the conversation is empty, then it
                  shrinks into the header mark when the first answer arrives (a move,
                  not a swap). */}
              <div className="chat-face"><Face size="100%" busy={busyFace} {...faceMood} reduced={reduced} /></div>
              <header className="chat-head" {...sheetDrag.bind}>
                <span className="chat-title"><span className="face-spot" aria-hidden /><span className="label">Ask Kip</span></span>
                <button type="button" className="label link" onClick={onClose}>close</button>
              </header>
              {listEl}
            </>
          )}
          <div className="chips" role="group" aria-label="Suggested questions">
            {chips.map((c) => (
              <button key={c.label} type="button" {...roveProps(`c${c.label}`)} className={`chip ${c.home || c.back ? "chip-home" : ""}`} aria-label={c.aria} onClick={() => onChip(c)} disabled={busy}>
                {c.kicker && <span className="chip-k">{c.kicker}</span>}
                {(c.home || c.back) && <span aria-hidden>← </span>}{c.label}
              </button>
            ))}
          </div>
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question" aria-label="Your question" />
            <button type="submit" className="label" disabled={busy || !q.trim()}>Ask</button>
          </form>
        </aside>
      </div>
    </>
  );
}
