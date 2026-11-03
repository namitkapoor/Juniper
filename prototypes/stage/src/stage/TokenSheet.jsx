/**
 * TokenSheet: ChekOut's real design tokens (src/data/tokens-chekout.json) drawn
 * inside this site's frame. The chrome (hairlines, labels, ink) follows the stage
 * theme; the swatches, corners, shadows and type samples use ChekOut's values.
 *
 * Pure: no state, no animation. `section` picks one part so a small cell can
 * show just color, just type, and so on; "all" stacks every section.
 *
 *   <TokenSheet section="color" />         one section
 *   <TokenSheet section="type" group="Widget" />   one group inside it
 */
import { useId } from "react";
import TOKENS from "../data/tokens-chekout.json";
import "./token-sheet.css";

const SECTIONS = ["color", "type", "radius", "shadow"];
const TITLES = { color: "Color", type: "Type", radius: "Radius", shadow: "Shadow" };

const base = (f) => f.split("/").pop();

/** "from tokens.ts @ 9596ff6 · chatbot.js @ b343c7e" for the files a section reads. */
function Sources({ items }) {
  const seen = new Map();
  for (const t of items) {
    const s = t.source;
    if (s && !seen.has(s.file)) seen.set(s.file, s.commit);
  }
  return (
    <p className="tks-src">
      <span className="tks-src-k">Source</span>{" "}
      {[...seen].map(([file, sha], i) => (
        <span key={file} title={file}>
          {i > 0 && " · "}
          {base(file)}{sha ? <> @ <code>{sha}</code></> : null}
        </span>
      ))}
    </p>
  );
}

const groupsOf = (items) => {
  const m = new Map();
  for (const t of items) {
    const g = t.group || "";
    if (!m.has(g)) m.set(g, []);
    m.get(g).push(t);
  }
  return [...m];
};

const short = (name) => name.split("/").slice(-1)[0];

function ColorSection({ items , GH = "h4" }) {
  return groupsOf(items).map(([g, list]) => (
    <div className="tks-group" key={g}>
      {g && <GH className="tks-gh">{g}</GH>}
      <ul className="tks-grid tks-colors">
        {list.map((t) => (
          <li key={t.name} className="tks-item">
            <span className="tks-swatch" aria-hidden="true">
              <span style={{ background: t.value }} />
            </span>
            <dl className="tks-dl">
              <dt><code>{short(t.name)}</code></dt>
              <dd className="tks-val"><span className="sr-only">Value: </span>{t.value}{t.derived ? " (derived)" : ""}</dd>
              <dd className="tks-role"><span className="sr-only">Use: </span>{t.role}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  ));
}

const FAMILY = (fonts, fam) => (fam === "display" ? fonts.display.stack : fam === "body" ? fonts.body.stack : fonts.widget.stack);
/* The face each plate is set in, named on the plate so the sample reads as a specimen, not copy. */
const FACE = { widget: "Helvetica · merchant font", display: "Sorts Mill Goudy · display", body: "Helvetica · stand-in for Tenorite" };
const WEIGHT = { 300: "Light", 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold", 800: "Heavy" };
const minus = (v) => String(v).replace(/^-/, "−");
const pad2 = (n) => String(n).padStart(2, "0");
const NOT_SET = <span className="tks-unset" title="Not set in code; inherits">not set</span>;

function sampleStyle(fonts, t) {
  return {
    fontFamily: FAMILY(fonts, t.family),
    fontSize: `min(${t.size}px, var(--tks-max, ${t.size}px))`,
    lineHeight: t.lineHeight || "normal",
    fontWeight: t.weight || 400,
    letterSpacing: t.letterSpacing || "normal",
    textTransform: t.transform || "none",
  };
}

/* Font + type props for a token drawn inside the mock (always at real size). */
const css = (fonts, t) => t && ({
  fontFamily: FAMILY(fonts, t.family), fontSize: t.size, lineHeight: t.lineHeight || "normal",
  fontWeight: t.weight || 400, letterSpacing: t.letterSpacing || "normal", textTransform: t.transform || "none",
});

/**
 * The widget group in context: a chat panel drawn from the tokens in this file
 * (type, radius, color, shadow), with numbered callouts matching the rows below.
 * Not a screenshot; the figcaption says so and names what is simplified.
 */
function WidgetMock({ list, fonts, tokens }) {
  const by = (k) => list.find((t) => short(t.name) === k);
  const no = (k) => pad2(list.indexOf(by(k)) + 1);
  const col = (k) => (tokens.color || []).find((t) => t.name === `color/widget/${k}`)?.value;
  const rad = (k) => (tokens.radius || []).find((t) => t.name === `radius/${k}`)?.value;
  const sh = (k) => (tokens.shadow || []).find((t) => t.name === `shadow/${k}`)?.value;
  const Tag = ({ k, side = "l" }) => by(k) ? <span className={`tkm-tag is-${side}`} aria-hidden="true">{no(k)}</span> : null;
  const T = ({ k, as: E = "span", className = "", style, side, children }) => (
    <E className={`tkm-el ${className}`} style={{ ...css(fonts, by(k)), ...style }}>
      <Tag k={k} side={side} />{children ?? by(k)?.sample}
    </E>
  );
  const brand = col("brand-default");
  return (
    <figure className="tkm">
      <div className="tkm-plate" aria-hidden="true">
        <div className="tkm-panel" style={{ borderRadius: rad("panel"), boxShadow: sh("panel") }}>
          <div className="tkm-head">
            <span className="tkm-dot" style={{ background: col("online-dot") }} />
            <T k="header-brand" style={{ color: brand }} />
          </div>
          <div className="tkm-body">
            <T k="eyebrow" className="tkm-eyebrow" style={{ color: brand }} />
            <T k="welcome-title" className="tkm-title" style={{ color: brand }} />
            <T k="user-message" className="tkm-bubble is-user" side="r"
              style={{ background: brand, color: col("agent-bubble-ink-dark"), borderRadius: rad("bubble-user") }} />
            <T k="agent-message" className="tkm-bubble is-ai"
              style={{ color: col("agent-bubble-ink"), borderRadius: rad("bubble-ai"), boxShadow: `inset 0 0 0 1px ${col("outline")}` }} />
            <T k="chip" className="tkm-chip"
              style={{ color: col("launcher-chip-ink"), background: col("launcher-chip-surface"), borderRadius: rad("pill"), boxShadow: sh("launcher-chip") }} />
          </div>
          <div className="tkm-foot" style={{ background: col("footer-plate"), color: col("footer-brand-ink") }}>
            <T k="powered-by" />
            <T k="disclaimer" />
          </div>
        </div>
      </div>
      <figcaption className="tks-note">
        <span className="tks-cap">In context</span> Drawn live from this file's type, color, radius and shadow tokens, not a screenshot.
        Numbers match the rows below. Simplified: flat white panel (the real one carries an animated brand blob),
        user bubble filled with the brand colour, footer text in the 7:1 brand ink.
      </figcaption>
    </figure>
  );
}

function TypeSection({ items, fonts, tokens, GH = "h4" }) {
  return groupsOf(items).map(([g, list]) => {
    const fam = list[0]?.family;
    const note = fam === "display"
      ? "Headings in Sorts Mill Goudy (SIL OFL), builder app only. Body falls back to Helvetica: Tenorite is not licensed for this site."
      : "The widget ships the merchant's font. Plates are set in Helvetica, one of its seven options.";
    const gid = `tks-g-${(g || "x").replace(/\W+/g, "-").toLowerCase()}`;
    return (
      <div className="tks-group" key={g}>
        {g && <GH className="tks-gh" id={gid}>{g} <span className="tks-count">{list.length} styles</span></GH>}
        {fam === "widget" && tokens && <WidgetMock list={list} fonts={fonts} tokens={tokens} />}
        <table className="tks-spec" aria-labelledby={g ? gid : undefined}>
          <colgroup><col /><col /><col /><col /></colgroup>
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Line</th>
              <th scope="col">Weight</th>
              <th scope="col">Tracking</th>
            </tr>
          </thead>
          {list.map((t, i) => (
            <tbody key={t.name} className={`tks-tok ${t.size > 28 ? "is-big" : ""}`}>
              <tr className="tks-tok-h">
                <th scope="rowgroup" colSpan={4}>
                  <span className="tks-no" aria-hidden="true">{pad2(i + 1)}</span>
                  <code className="tks-chip">{t.name}</code>
                </th>
              </tr>
              <tr className="tks-tok-m">
                <td>{t.size}<span className="tks-u">px</span></td>
                <td>{t.lineHeight
                  ? <>{Math.round(t.size * t.lineHeight)}<span className="tks-u">px</span> <span className="tks-x">×{t.lineHeight}</span></>
                  : NOT_SET}</td>
                <td>{t.weight ? <>{t.weight} <span className="tks-x">{WEIGHT[t.weight] || ""}</span></> : NOT_SET}</td>
                <td>{t.letterSpacing ? minus(t.letterSpacing) : <>0</>}{t.transform === "uppercase" && <> <span className="tks-x">caps</span></>}</td>
              </tr>
              <tr className="tks-tok-s">
                <td colSpan={4}>
                  <div className="tks-plate-t">
                    <p className="tks-plate-cap">
                      <span>{FACE[t.family] || FACE.widget}</span>
                      <span className="tks-actual">actual size</span>
                      <span className="tks-scaled">scaled to fit</span>
                    </p>
                    <p className="tks-sample" style={sampleStyle(fonts, t)}>
                      <span className="tks-bl" aria-hidden="true" />{t.sample}
                    </p>
                  </div>
                  <p className="tks-use"><span className="tks-use-k">Used for</span> {t.role}</p>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        <p className="tks-note">{note}</p>
      </div>
    );
  });
}

function RadiusSection({ items }) {
  return (
    <ul className="tks-grid tks-radii">
      {items.map((t) => {
        const pill = /999/.test(t.value);
        const bubble = /bubble-(ai|user)/.test(t.name);
        return (
          <li key={t.name} className="tks-item">
            <span className={`tks-corner ${pill ? "is-pill" : ""} ${bubble ? "is-bubble" : ""}`} aria-hidden="true">
              <span style={{ borderRadius: t.value }} />
            </span>
            <dl className="tks-dl">
              <dt><code>{short(t.name)}</code></dt>
              <dd className="tks-val"><span className="sr-only">Value: </span>{t.value}</dd>
              <dd className="tks-role"><span className="sr-only">Use: </span>{t.role}</dd>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}

function ShadowSection({ items }) {
  return (
    <div className="tks-plate">
      <ul className="tks-grid tks-shadows">
        {items.map((t) => (
          <li key={t.name} className="tks-item">
            <span className="tks-lift" aria-hidden="true">
              <span style={{ boxShadow: t.value }} />
            </span>
            <dl className="tks-dl">
              <dt><code>{short(t.name)}</code></dt>
              <dd className="tks-val"><span className="sr-only">Value: </span>{t.value}</dd>
              <dd className="tks-role"><span className="sr-only">Use: </span>{t.role}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

const BODY = { color: ColorSection, type: TypeSection, radius: RadiusSection, shadow: ShadowSection };

/* Compact (a bento tile): the drawn values only, no roles. The full sheet opens on Expand. */
function CompactBody({ section, items, fonts }) {
  if (section === "color") return (
    <ul className="tkc-swatches">
      {items.map((t) => (
        <li key={t.name} title={`${short(t.name)} ${t.value}`}>
          <span className="tks-swatch"><span style={{ background: t.value }} /></span>
          <span className="sr-only">{short(t.name)}: {t.value}</span>
        </li>
      ))}
    </ul>
  );
  if (section === "type") return (
    <ul className="tkc-type">
      {items.map((t) => (
        <li key={t.name}>
          <span className="tkc-meta">{t.size}</span>
          <span className="tkc-sample" style={{ fontFamily: FAMILY(fonts, t.family), fontSize: Math.min(t.size, 30), fontWeight: t.weight || 400, letterSpacing: t.letterSpacing || "normal", textTransform: t.transform || "none" }}>{t.sample}</span>
        </li>
      ))}
    </ul>
  );
  if (section === "radius") return (
    <ul className="tkc-radii">
      {items.map((t) => (
        <li key={t.name}>
          <span className={`tks-corner ${/999/.test(t.value) ? "is-pill" : ""} ${/bubble-(ai|user)/.test(t.name) ? "is-bubble" : ""}`} aria-hidden="true"><span style={{ borderRadius: t.value }} /></span>
          <code>{t.value}</code>
          <span className="sr-only"> {short(t.name)}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <ul className="tkc-shadows tks-plate">
      {items.map((t) => (
        <li key={t.name}>
          <span className="tks-lift" aria-hidden="true"><span style={{ boxShadow: t.value }} /></span>
          <code>{short(t.name)}</code>
        </li>
      ))}
    </ul>
  );
}

export default function TokenSheet({ section = "all", group, tokens = TOKENS, className = "", headingLevel = 3, compact = false }) {
  const list = section === "all" ? SECTIONS : [section].filter((s) => SECTIONS.includes(s));
  const H = `h${headingLevel}`;
  const uid = useId();
  return (
    <div className={`tks ${compact ? "tks-compact" : ""} ${className}`} data-section={section}>
      {list.map((s) => {
        const items = (tokens[s] || []).filter((t) => !group || t.group === group || t.group?.startsWith(group));
        const Body = BODY[s];
        return (
          <section key={s} className={`tks-sec tks-${s}`} aria-labelledby={`${uid}-${s}`}>
            <H id={`${uid}-${s}`} className="tks-h">
              {TITLES[s]} <span className="tks-count">{items.length}</span>
            </H>
            {compact
              ? <CompactBody section={s} items={items} fonts={tokens.fonts} />
              : <Body items={items} fonts={tokens.fonts} tokens={tokens} GH={`h${Math.min(6, headingLevel + 1)}`} />}
            {!compact && <Sources items={items} />}
          </section>
        );
      })}
    </div>
  );
}
