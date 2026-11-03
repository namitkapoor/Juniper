/**
 * Standalone check for TokenSheet (no app, no engine). Open /tokens.html.
 * Query: ?theme=light  &section=all|color|type|radius|shadow  &cells=1 (adds small-cell frames)
 */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import TokenSheet from "./stage/TokenSheet.jsx";

const q = new URLSearchParams(location.search);
const SECTIONS = ["all", "color", "type", "radius", "shadow"];

function Preview() {
  const [theme, setTheme] = useState(q.get("theme") === "light" ? "light" : "dark");
  const [section, setSection] = useState(SECTIONS.includes(q.get("section")) ? q.get("section") : "all");
  const cells = q.get("cells") !== "0";
  useEffect(() => {
    if (theme === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
  }, [theme]);
  return (
    <div className="tp-page">
      <style>{CSS}</style>
      <header className="tp-bar">
        <h1>Token sheet · ChekOut</h1>
        <div className="tp-opts" role="group" aria-label="Section">
          {SECTIONS.map((k) => (
            <button key={k} type="button" aria-pressed={k === section} onClick={() => setSection(k)}>{k}</button>
          ))}
        </div>
        <button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} theme</button>
      </header>
      <main className="tp-main">
        {cells && (
          <div className="tp-cells" aria-label="As small bento cells">
            <section className="tp-cell" aria-label="Color cell"><TokenSheet section="color" group="Widget" /></section>
            <section className="tp-cell" aria-label="Type cell"><TokenSheet section="type" group="Widget" /></section>
            <section className="tp-cell short" aria-label="Radius cell"><TokenSheet section="radius" /></section>
            <section className="tp-cell short" aria-label="Shadow cell"><TokenSheet section="shadow" /></section>
          </div>
        )}
        <section className="tp-full" aria-label="Full sheet"><TokenSheet section={section} headingLevel={2} /></section>
      </main>
    </div>
  );
}

const CSS = `
#root { overflow: auto; }
.tp-page { min-height: 100%; display: flex; flex-direction: column; }
.tp-bar { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--hair); font-size: 13px; color: var(--ink-2); }
.tp-bar h1 { margin: 0; font: 800 15px var(--display); color: var(--ink); }
.tp-bar button { background: none; border: 1px solid var(--hair-ctl); padding: 4px 8px; cursor: pointer; font-size: 12px; }
.tp-bar button[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); }
.tp-opts { display: flex; flex-wrap: wrap; gap: 6px; }
.tp-main { padding: 16px; display: grid; gap: 16px; }
.tp-cells { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.tp-cell { border: 1px solid var(--hair); background: var(--bg); padding: 16px; height: 420px; overflow: hidden; }
.tp-cell.short { height: 420px; }
.tp-full { border: 1px solid var(--hair); background: var(--bg); padding: 16px; }
`;

createRoot(document.getElementById("root")).render(<StrictMode><Preview /></StrictMode>);
