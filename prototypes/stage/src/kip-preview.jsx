/**
 * Standalone check for Kip (the chat's pixel face) animation candidates. Open /kip.html.
 * Not wired into Face.jsx or the chat. Plays the original Lottie next to each new one,
 * in the dark theme (the site's --face-filter) and the light theme (no filter, paper ground).
 * Query: ?only=<name>  &size=<px>  &capture=dark|light (one big face, no chrome, for frame grabs)
 * window.__kip = { ready, names, anims, seek(frame) } for scripted checks.
 */
import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import lottie from "lottie-web/build/player/lottie_light.js";
import "./styles.css";

export const KIP = [
  { name: "pixel-face-glasses", label: "Original · idle", trigger: "Always: blink, then the glasses lift and slide down the nose.", loop: true },
  { name: "kip-thinking", label: "Thinking", trigger: "busy: a question is sent, until the first token lands. Loops.", loop: true },
  { name: "kip-answer", label: "Answer arrived", trigger: "Once, when the answer finishes streaming. Then back to idle.", loop: false },
  { name: "kip-sheepish", label: "No receipts", trigger: "Once, when the reply is the 'nothing on the record for that' fallback.", loop: false },
];

const q = new URLSearchParams(location.search);
const only = q.get("only");
const size = Number(q.get("size")) || 160;
const capture = q.get("capture");
const list = only ? KIP.filter((k) => k.name === only) : KIP;

window.__kip = { ready: false, names: list.map((k) => k.name), anims: {}, errors: [] };
window.__kip.seek = (f) => Object.values(window.__kip.anims).flat().forEach((a) => a.goToAndStop(f, true));

const cache = {};
const load = (name) => (cache[name] ||= fetch(`/lottie/${name}.json`).then((r) => r.json()));

function Player({ k, theme, play }) {
  const box = useRef(null);
  const anim = useRef(null);
  useEffect(() => {
    let dead = false;
    load(k.name).then((data) => {
      if (dead || !box.current) return;
      const a = lottie.loadAnimation({
        container: box.current, renderer: "svg", loop: k.loop || !capture, autoplay: !capture,
        animationData: data, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      a.addEventListener("data_failed", () => window.__kip.errors.push(k.name));
      anim.current = a;
      (window.__kip.anims[k.name] ||= []).push(a);
      if (Object.keys(window.__kip.anims).length === list.length) window.__kip.ready = true;
    }).catch((e) => window.__kip.errors.push(`${k.name}: ${e.message}`));
    return () => {
      dead = true;
      const arr = window.__kip.anims[k.name];
      if (arr && anim.current) arr.splice(arr.indexOf(anim.current), 1);
      anim.current?.destroy(); anim.current = null;
    };
  }, [k]);
  useEffect(() => { if (play && anim.current) anim.current.goToAndPlay(0, true); }, [play]);
  return <div className={`kp-face kp-${theme}`} ref={box} style={{ width: size, height: size }} aria-hidden="true" />;
}

function Card({ k }) {
  const [n, setN] = useState(0);
  return (
    <section className="kp-card" aria-label={k.label}>
      <header>
        <h2>{k.label}</h2>
        <code>{k.name}.json</code>
        {!k.loop && <button type="button" onClick={() => setN(n + 1)}>Replay</button>}
      </header>
      <p>{k.trigger}</p>
      <div className="kp-pair">
        <div className="kp-tile kp-tile-dark"><Player k={k} theme="dark" play={n} /><span>dark</span></div>
        <div className="kp-tile kp-tile-light"><Player k={k} theme="light" play={n} /><span>light</span></div>
      </div>
    </section>
  );
}

function Preview() {
  if (capture) {
    return (
      <div className={`kp-cap kp-tile-${capture}`}><style>{CSS}</style>
        {list.map((k) => <Player key={k.name} k={k} theme={capture} />)}
      </div>
    );
  }
  return (
    <div className="kp-page">
      <style>{CSS}</style>
      <h1>Kip · animation candidates</h1>
      <p className="kp-note">Same 400×400 grid and 20px pixels as the original; every move is a whole grid cell on a hold keyframe. One-shots end on the idle pose so they can hand back to the blink loop.</p>
      <main className="kp-grid">{list.map((k) => <Card key={k.name} k={k} />)}</main>
    </div>
  );
}

/* Dark tiles use the page's own (dark) tokens, so --face-filter is the site's. The light tile
   copies the light theme's values (--bg #f6f3eb, --face-filter: none) so both show at once. */
const CSS = `
.kp-page { min-height: 100%; padding: 24px 16px; background: var(--bg); color: var(--ink); font-family: var(--body); }
.kp-page h1 { font-family: var(--display); font-weight: 300; font-size: clamp(24px, 4vw, 36px); margin: 0 0 8px; }
.kp-note { color: var(--chat-mute); max-width: 60ch; margin: 0 0 24px; font-size: 14px; }
.kp-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); }
.kp-card { border: 1px solid var(--hair); padding: 16px; background: var(--panel-2); }
.kp-card header { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.kp-card h2 { font-size: 16px; margin: 0; font-weight: 500; }
.kp-card code { font-size: 11px; color: var(--chat-mute); }
.kp-card button { margin-left: auto; background: none; color: inherit; border: 1px solid var(--hair-ctl); padding: 4px 10px; cursor: pointer; font: inherit; font-size: 12px; }
.kp-card p { font-size: 13px; color: var(--chat-mute); margin: 8px 0 12px; }
.kp-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.kp-tile { display: grid; justify-items: center; gap: 4px; padding: 12px 4px 6px; }
.kp-tile span { font-size: 11px; }
.kp-tile-dark { background: var(--bg); color: var(--chat-mute); }
.kp-tile-light { background: #f6f3eb; color: #54504a; }
.kp-face { max-width: 100%; aspect-ratio: 1; }
.kp-dark svg { filter: var(--face-filter); }
.kp-light svg { filter: none; }
.kp-cap { display: inline-block; padding: 0; line-height: 0; }
`;

createRoot(document.getElementById("root")).render(<StrictMode><Preview /></StrictMode>);
