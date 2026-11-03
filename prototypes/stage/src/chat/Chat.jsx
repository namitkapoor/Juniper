import { useEffect, useRef, useState } from "react";
import { Face } from "./Face.jsx";

/**
 * The chat column: the reply is the thesis (one sentence); the evidence
 * arrives on the stage as a layout. Messages, suggested questions, input.
 */
export function Chat({ open, messages, chips, onAsk, onChip, busy, onClose, phone, busyFace, reduced, onReopen }) {
  const [q, setQ] = useState("");
  // Phone: the chat is a bottom sheet. Peek = face + latest reply + chips + input;
  // tap or drag the handle up to see the whole conversation, down to peek again.
  const [sheet, setSheet] = useState(false);
  const drag = useRef(null);
  const list = useRef(null);
  const input = useRef(null);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  // Opening the chat focuses its input, unless the visitor is working the stage by keyboard.
  useEffect(() => {
    if (!open || phone) return;
    const a = document.activeElement;
    if (a && a !== document.body && a.closest?.(".stage")) return;
    input.current?.focus({ preventScroll: true });
  }, [open, phone]);

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

  return (
    <aside className={`chat ${open ? "open" : ""} ${messages.length === 0 ? "empty" : ""} ${reduced ? "instant" : ""} ${phone && sheet ? "sheet-open" : ""}`} aria-label="Ask Kip" aria-hidden={!open && !phone}>
      {phone && (
        <button
          type="button" className="sheet-handle" aria-expanded={sheet} aria-label={sheet ? "Ask Kip, collapse the conversation" : "Ask Kip, expand the conversation"}
          onClick={() => setSheet((v) => !v)}
          onPointerDown={(e) => { drag.current = e.clientY; }}
          onPointerUp={(e) => { if (drag.current != null) { const dy = e.clientY - drag.current; if (dy < -24) setSheet(true); if (dy > 24) setSheet(false); } drag.current = null; }}
        >
          <span className="grip" aria-hidden />
          <Face size={30} busy={busyFace} reduced={reduced} />
          <span className="label">Ask Kip</span>
        </button>
      )}
      {/* One face: big and centered while the conversation is empty, then it
          shrinks into the header mark when the first answer arrives (a move,
          not a swap). */}
      {!phone && <div className="chat-face"><Face size="100%" busy={busyFace} reduced={reduced} /></div>}
      <header className="chat-head">
        <span className="chat-title"><span className="face-spot" aria-hidden /><span className="label">Ask Kip</span></span>
        {!phone && <button type="button" className="label link" onClick={onClose}>close</button>}
      </header>
      <ol className="chat-list" ref={list} aria-live="polite">
        {messages.length === 0 && (
          <li className="msg sys hint">Ask about the work. The answer comes back as a layout on the left, with receipts.</li>
        )}
        {/* Only the latest exchange is open; earlier ones collapse to their question
            (click one to bring that answer back on stage). */}
        {exchanges.map((ex, i) => (i < exchanges.length - 1 ? (
          <li key={i} className="turn-collapsed">
            <button type="button" onClick={() => onReopen?.(ex.q)} title="Show this answer on the stage">
              <span aria-hidden>→</span> {ex.q}
            </button>
          </li>
        ) : (
          <li key={i} className="turn-open">
            {ex.q && <div className="msg user"><div className="msg-text">{ex.q}</div></div>}
            {ex.a && (
              <div className="msg bot" data-match={ex.a.match || undefined}>
                <Face size={22} busy={busyFace} reduced={reduced} className="msg-face" />
                <div className="msg-text">{ex.a.text}</div>
                <div className="label msg-how">Kip{ex.a.how ? ` · ${ex.a.how}` : ""}</div>
              </div>
            )}
          </li>
        )))}
        {busy && <li className="msg sys">…</li>}
      </ol>
      {phone && !sheet && messages.length > 0 && (() => {
        const last = [...messages].reverse().find((m) => m.role === "bot");
        return last ? <div className="phone-reply" aria-live="polite">{last.text}</div> : null;
      })()}
      <div className="chips" role="group" aria-label="Suggested questions">
        {chips.map((c) => (
          <button key={c.label} type="button" className={`chip ${c.home || c.back ? "chip-home" : ""}`} onClick={() => onChip(c)} disabled={busy}>
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
  );
}
