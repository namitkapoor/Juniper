/**
 * Standalone check for the specimen component (no app, no engine).
 * Query: ?preset=stage-fit|stage-scale|stage-hooks|kyuri-scale  &theme=light
 *        &layout=both|tile|focus  &step=N  &active=1 (focus frame plays, as in focus mode)
 */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Specimen from "./stage/specimen/Specimen.jsx";
import { PRESETS } from "./stage/specimen/presets.js";

const q = new URLSearchParams(location.search);

function Preview() {
  const [theme, setTheme] = useState(q.get("theme") === "light" ? "light" : "dark");
  const [preset, setPreset] = useState(PRESETS[q.get("preset")] ? q.get("preset") : "stage-scale");
  const [active, setActive] = useState(q.get("active") === "1");
  const layout = q.get("layout") || "both";
  const step = Number(q.get("step") || 0);
  useEffect(() => {
    if (theme === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
  }, [theme]);
  const fill = PRESETS[preset];
  return (
    <div className="sp-page">
      <style>{CSS}</style>
      <header className="sp-bar">
        <h1>Specimen</h1>
        <div className="sp-opts" role="group" aria-label="Preset">
          {Object.keys(PRESETS).map((k) => (
            <button key={k} type="button" aria-pressed={k === preset} onClick={() => setPreset(k)}>{k}</button>
          ))}
        </div>
        <label><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> focus mode (active)</label>
        <button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} theme</button>
      </header>
      <main className={`sp-frames ${layout}`}>
        {layout !== "focus" && (
          <section className="sp-frame tile" aria-label="As a bento tile">
            <Specimen key={`t-${preset}`} fill={fill} initialStep={step} />
          </section>
        )}
        {layout !== "tile" && (
          <section className="sp-frame focus" aria-label="As the expanded focus view">
            <Specimen key={`f-${preset}`} fill={fill} initialStep={step} active={active} pad={24} />
          </section>
        )}
      </main>
    </div>
  );
}

const CSS = `
#root { overflow: auto; }
.sp-page { min-height: 100%; display: flex; flex-direction: column; }
.sp-bar { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--hair); font-size: 13px; color: var(--ink-2); }
.sp-bar h1 { margin: 0; font: 800 15px var(--display); color: var(--ink); }
.sp-bar button { background: none; border: 1px solid var(--hair-ctl); padding: 4px 8px; cursor: pointer; font-size: 12px; }
.sp-bar button[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); }
.sp-opts { display: flex; flex-wrap: wrap; gap: 6px; }
.sp-frames { flex: 1; display: grid; grid-template-columns: 380px 1fr; gap: 16px; padding: 16px; }
.sp-frames.tile, .sp-frames.focus { grid-template-columns: 1fr; }
.sp-frame { position: relative; border: 1px solid var(--hair); background: var(--bg); min-width: 0; }
.sp-frame.tile { height: 300px; align-self: start; }
.sp-frames.tile .sp-frame.tile { width: min(380px, 100%); }
.sp-frame.focus { min-height: 520px; height: calc(100vh - 110px); }
@media (max-width: 760px) {
  .sp-frames { grid-template-columns: 1fr; }
  .sp-frame.tile { height: 260px; }
  .sp-frame.focus { min-height: 460px; height: 70vh; }
}
`;

createRoot(document.getElementById("root")).render(<StrictMode><Preview /></StrictMode>);
