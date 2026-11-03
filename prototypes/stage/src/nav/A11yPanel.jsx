/**
 * The accessibility sign in the nav: a button that opens a dialog listing what the
 * site does for people using a keyboard, a screen reader, reduced motion or touch,
 * plus the keyboard shortcuts. Everything listed here is built and tested; claims
 * that aren't (e.g. a full WCAG audit) are not made.
 */
import { useEffect, useRef, useState } from "react";
import { KEYS } from "../stage/Stage.jsx";

const FEATURES = [
  ["Keyboard first", "Move between tiles with the arrow keys, open with Enter, step back with Escape. Every control is reachable with Tab, and the focused tile is outlined."],
  ["Ask Kip without a mouse", "Arrow keys move through earlier questions and suggestions; Escape clears the field, then closes the chat."],
  ["Readable in both themes", "Body text meets AAA contrast (7:1 or more) in light and dark; borders on controls are at least 3:1."],
  ["Screen readers", "Every tile is labelled with what it is and what it opens. Kip's replies are announced once, in full, not word by word."],
  ["Reduced motion", "With reduced motion on, the intro, streaming text, Kip's reactions and the hover spring all stay still, and videos never autoplay."],
  ["Focus mode", "When you expand something, the rest of the page goes quiet and is skipped by Tab and screen readers until you close it."],
  ["Touch", "Swipe the Kip sheet up or down on a phone; the magnifier lens follows your finger and steps aside for pinch zoom."],
];

export function A11yButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="a11y-nav" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Accessibility features">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="7" r="1.25" fill="currentColor" stroke="none" />
          <path d="M7 9.5l5 1 5-1M12 10.5v3.5M12 14l-2.5 4.5M12 14l2.5 4.5" />
        </svg>
      </button>
      {open && <A11yPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function A11yPanel({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    const back = document.activeElement;
    d?.showModal?.();
    if (d) d.scrollTop = 0; // open at the top, whatever got focus
    return () => back?.focus?.();
  }, []);
  return (
    <dialog ref={ref} className="a11y-panel" aria-modal="true" aria-labelledby="a11y-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="a11y-head">
        <h2 id="a11y-title" className="label">Accessibility</h2>
        <button type="button" className="close-btn" onClick={onClose} autoFocus><span aria-hidden>×</span> Close</button>
      </div>
      <p className="a11y-lede">Built in, not bolted on. Here is what works today.</p>
      <ul className="a11y-list">
        {FEATURES.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
      </ul>
      <h3 className="label a11y-keys-h">Keyboard</h3>
      <dl className="a11y-keys">{KEYS.map(([k, v]) => <div key={k}><dt><kbd>{k}</kbd></dt><dd>{v}</dd></div>)}</dl>
    </dialog>
  );
}
