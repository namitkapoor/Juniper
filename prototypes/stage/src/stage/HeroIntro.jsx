/**
 * The original site's hero entrance (Juniper src/Pages/Home.jsx, timings from
 * src/contexts/HeroAnimationContext.jsx DEFAULT_HERO_CONTROLS), replayed on the
 * stage's "namit" wordmark during the first-load build:
 *
 *   name     letter by letter: opacity 0 -> 1, y 65px -> 0, blur 10px -> 0,
 *            500ms each, 200ms stagger (heroNameLetterDuration / Stagger)
 *   tagline  word by word, 800ms after the name starts: opacity 0 -> 1,
 *            x -10px -> 0, blur 10px -> 0, 200ms each, 200ms stagger
 *            (taglineDelay / WordDuration / WordStagger); here the kicker
 *   ease     Framer Motion's default for a tween with a duration: easeInOut
 *
 * Current type and colours; the letters land on the glyph positions the engine
 * painted, so the last frame is the resting cell. Only transform, opacity and
 * filter animate (WAAPI). The text is in the DOM from the first paint (the
 * sr-only h2 and the painted line); nothing is covered or made unclickable.
 * Any pointerdown or keydown finishes it, and fast-forwards the stage build.
 */
import { useContext, useEffect, useState } from "react";
import { RuntimeCtx } from "./runtimeCtx.js";
import "./hero-intro.css";

const EASE = "cubic-bezier(0.42, 0, 0.58, 1)"; // framer-motion "easeInOut"
// Original 65px rise was set against an 18rem (288px) name; keep the ratio.
const RISE_EM = 65 / 288;
export const HERO_INTRO = { at: 100, letterStagger: 200, letterDur: 500, taglineDelay: 800, wordStagger: 200, wordDur: 200 };

const isHomeTitle = (fill) => fill.kind === "title" && fill.text === "namit" && /(^|-)home(-|$)/.test(fill.id);
// A deep link (?page=about, ?a=deck) mounts home for a beat before routing away: no intro then.
const deepLinked = () => { try { const q = new URLSearchParams(window.location.search); return q.has("page") || q.has("a"); } catch { return false; } };

/** Split a painted line into fixed-width inline-blocks at the glyph positions the run already has. */
function splitLine(ln) {
  const node = ln.firstChild;
  const text = ln.textContent;
  if (!node || node.nodeType !== 3 || !text) return null;
  const r = document.createRange();
  const lefts = [];
  let lastW = 0;
  for (let i = 0; i < text.length; i++) {
    r.setStart(node, i); r.setEnd(node, i + 1);
    const b = r.getBoundingClientRect();
    lefts.push(b.left);
    lastW = b.width;
  }
  const frag = document.createDocumentFragment();
  const spans = [];
  for (let i = 0; i < text.length; i++) {
    const s = document.createElement("span");
    s.className = "hi-l";
    s.textContent = text[i];
    s.style.width = `${(i + 1 < text.length ? lefts[i + 1] - lefts[i] : lastW).toFixed(3)}px`;
    frag.appendChild(s);
    spans.push(s);
  }
  ln.textContent = "";
  ln.appendChild(frag);
  ln.classList.add("hi-split");
  return { ln, text, spans };
}

/**
 * @returns {{ play: boolean, kicker: (text: string) => any }}
 *   play    true while the intro runs (put "hi-play" on the cell root)
 *   kicker  renders the kicker as animatable words while playing
 */
export function useHeroIntro(fill, reduced, rootRef) {
  const rt = useContext(RuntimeCtx);
  // Decided at mount: the stage is mid first-load build (App gates it to once a
  // session, home/about, no reduced motion) and this is the home wordmark.
  const [play, setPlay] = useState(() => !reduced && isHomeTitle(fill) && !deepLinked() && !!rt?.plan?.intro && !rt.settled);

  useEffect(() => {
    if (!play) return;
    let raf = 0, tries = 0, done = false;
    const anims = [];
    const lines = [];
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      removeEventListener("pointerdown", skip, true);
      removeEventListener("keydown", skip, true);
      for (const a of anims) a.cancel();
      // Hand the line back to the painter exactly as it painted it.
      for (const l of lines) { l.ln.textContent = l.text; l.ln.classList.remove("hi-split"); }
      setPlay(false);
    };
    const skip = () => {
      // Fast-forward the stage's build too, settling it now (so its once-a-session flag is written).
      if (rt?.plan?.intro && !rt.settled) { rt.t0 = performance.now() - rt.plan.end - 1; rt.frame(performance.now()); }
      finish();
    };
    addEventListener("pointerdown", skip, true);
    addEventListener("keydown", skip, true);

    const start = () => {
      raf = 0;
      const root = rootRef.current;
      const lns = root ? [...root.querySelectorAll(".t-title .ln")].filter((l) => l.textContent) : [];
      if (!lns.length) { if (++tries < 30) raf = requestAnimationFrame(start); else finish(); return; }
      // Time from the stage build's start, so the choreography holds even if this frame was late.
      const base = rt?.t0 ? rt.t0 - performance.now() : 0;
      const T = HERO_INTRO;
      let i = 0;
      for (const ln of lns) {
        const l = splitLine(ln);
        if (!l) continue;
        lines.push(l);
        for (const s of l.spans) {
          anims.push(s.animate(
            [{ opacity: 0, transform: `translateY(${RISE_EM}em)`, filter: "blur(10px)" }, { opacity: 1, transform: "none", filter: "blur(0px)" }],
            { duration: T.letterDur, delay: base + T.at + i++ * T.letterStagger, easing: EASE, fill: "both" },
          ));
        }
      }
      [...root.querySelectorAll(".hi-w")].forEach((w, j) => {
        anims.push(w.animate(
          [{ opacity: 0, transform: "translateX(-10px)", filter: "blur(10px)" }, { opacity: 1, transform: "none", filter: "blur(0px)" }],
          { duration: T.wordDur, delay: base + T.at + T.taglineDelay + j * T.wordStagger, easing: EASE, fill: "both" },
        ));
      });
      if (!anims.length) { finish(); return; }
      Promise.all(anims.map((a) => a.finished)).then(finish, () => {});
    };
    raf = requestAnimationFrame(start);
    return finish;
  }, [play]); // eslint-disable-line react-hooks/exhaustive-deps

  const kicker = (text) => {
    if (!play) return text;
    const words = text.split(" ");
    return words.map((w, i) => <span key={i}><span className="hi-w">{w}</span>{i < words.length - 1 ? " " : null}</span>);
  };
  return { play, kicker };
}
