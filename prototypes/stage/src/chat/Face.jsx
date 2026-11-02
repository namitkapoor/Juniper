/**
 * The agent's face: Namit's pixel-glasses Lottie (from his Home hero).
 * Like Home.jsx, the animation data AND the lottie-web chunk load off the
 * critical path (after load, on idle), once, shared by every face on the page.
 *   idle      the blink loop at normal speed
 *   busy      answering / the stage morphing: the same loop, livelier (faster)
 *   reduced   prefers-reduced-motion: a still frame
 * Until it loads, a static line drawing of the same glasses holds the space.
 */
import { useEffect, useRef, useState } from "react";

let assets = null;
function loadAssets() {
  if (!assets) {
    assets = new Promise((resolve) => {
      const go = () => resolve(Promise.all([
        fetch("/lottie/pixel-face-glasses.json").then((r) => r.json()),
        import("lottie-web/build/player/lottie_light.js").then((m) => m.default || m),
      ]));
      const idle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 200));
      if (document.readyState === "complete") idle(); else window.addEventListener("load", idle, { once: true });
    }).catch(() => null);
  }
  return assets;
}

export function Face({ size = 28, busy = false, reduced = false, className = "" }) {
  const box = useRef(null);
  const anim = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dead = false;
    loadAssets().then((res) => {
      if (dead || !res || !box.current) return;
      const [data, lottie] = res;
      anim.current = lottie.loadAnimation({
        container: box.current, renderer: "svg", loop: true, autoplay: !reduced,
        animationData: data, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      if (reduced) anim.current.goToAndStop(0, true);
      setReady(true);
    });
    return () => { dead = true; anim.current?.destroy(); anim.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = anim.current;
    if (!a) return;
    if (reduced) { a.goToAndStop(0, true); return; }
    a.setSpeed(busy ? 2.6 : 1);
    if (a.isPaused) a.play();
  }, [busy, reduced, ready]);

  return (
    <span className={`face ${busy ? "busy" : ""} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="face-lottie" ref={box} />
      {!ready && (
        <svg className="face-still" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M20 25a15 15 0 1 1 30 0a15 15 0 1 1-30 0Z M70 25a15 15 0 1 1 30 0a15 15 0 1 1-30 0Z M50 25h20 M20 25C15 25 10 23 5 20 M100 25c5 0 10-2 15-5" />
        </svg>
      )}
    </span>
  );
}
