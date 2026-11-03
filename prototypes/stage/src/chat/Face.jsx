/**
 * The agent's face: Namit's pixel-glasses Lottie (from his Home hero).
 * Like Home.jsx, the animation data AND the lottie-web chunk load off the
 * critical path (after load, on idle), once, shared by every face on the page.
 *   idle      the blink loop
 *   busy      a question is in flight: kip-thinking (eyes reading, a lens glint), looped
 *   mood      a one-shot reaction, then back to idle:
 *               "answer"   a nod and a smile when a reply lands
 *               "sheepish" looks away, glasses slip, when there's nothing on record
 *             `moodKey` changing replays the mood (a new reply).
 *   reduced   prefers-reduced-motion: a still frame, no reactions
 * Until it loads, a static line drawing of the same glasses holds the space.
 */
import { useEffect, useRef, useState } from "react";

// Pace: reactions play slower than authored and hold their last pose before idle returns,
// so a new reply's mood is actually seen. Tune here.
const SPEED = { idle: 1, thinking: 0.7, answer: 0.55, sheepish: 0.6 };
const HOLD_MS = 1400;
const FILES = { idle: "pixel-face-glasses", thinking: "kip-thinking", answer: "kip-answer", sheepish: "kip-sheepish" };
const data = {};
const getData = (k) => (data[k] ||= fetch(`/lottie/${FILES[k]}.json`).then((r) => r.json()).catch(() => null));

let lottieLib = null;
function loadAssets() {
  if (!lottieLib) {
    lottieLib = new Promise((resolve) => {
      const go = () => resolve(Promise.all([getData("idle"), import("lottie-web/build/player/lottie_light.js").then((m) => m.default || m)]));
      const idle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 200));
      if (document.readyState === "complete") idle(); else window.addEventListener("load", idle, { once: true });
    }).catch(() => null);
  }
  return lottieLib;
}

export function Face({ size = 28, busy = false, mood = null, moodKey = null, reduced = false, className = "" }) {
  const box = useRef(null);
  const anim = useRef(null);
  const lib = useRef(null);
  const cur = useRef(null); // which clip is mounted
  const [ready, setReady] = useState(false);
  const [oneShot, setOneShot] = useState(null); // the mood currently playing once
  const hold = useRef(null);

  // Mount a clip in the box (one lottie instance at a time per face).
  const show = async (key, { loop }) => {
    if (!lib.current || !box.current) return;
    const d = await getData(key);
    if (!d || !box.current) return;
    anim.current?.destroy();
    cur.current = key;
    const a = lib.current.loadAnimation({
      container: box.current, renderer: "svg", loop, autoplay: !reduced,
      animationData: d, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
    });
    anim.current = a;
    a.setSpeed(SPEED[key] ?? 1);
    if (reduced) a.goToAndStop(0, true);
    if (!loop) a.addEventListener("complete", () => { clearTimeout(hold.current); hold.current = setTimeout(() => setOneShot(null), HOLD_MS); });
  };

  useEffect(() => {
    let dead = false;
    loadAssets().then((res) => {
      if (dead || !res) return;
      lib.current = res[1];
      setReady(true);
    });
    return () => { dead = true; clearTimeout(hold.current); anim.current?.destroy(); anim.current = null; };
  }, []);

  // A new reply: play its mood once (not under reduced motion, not while still thinking).
  useEffect(() => {
    if (!mood || reduced || !FILES[mood]) return;
    setOneShot(mood);
    getData(mood); // warm it
  }, [mood, moodKey, reduced]);

  // What to show: thinking while busy, else the one-shot mood, else idle.
  const want = reduced ? "idle" : busy ? "thinking" : oneShot || "idle";
  useEffect(() => {
    if (!ready) return;
    if (want === cur.current && !(want === oneShot)) return;
    show(want, { loop: want === "idle" || want === "thinking" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want, ready, moodKey]);

  return (
    <span className={`face ${busy ? "busy" : ""} ${!reduced && (busy || oneShot) ? "reacting" : ""} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="face-lottie" ref={box} />
      {!ready && (
        <svg className="face-still" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M20 25a15 15 0 1 1 30 0a15 15 0 1 1-30 0Z M70 25a15 15 0 1 1 30 0a15 15 0 1 1-30 0Z M50 25h20 M20 25C15 25 10 23 5 20 M100 25c5 0 10-2 15-5" />
        </svg>
      )}
    </span>
  );
}
