/**
 * What fills a cell. Static parts are plain DOM laid out by CSS (they follow
 * the cell's size during a morph for free); running text goes through
 * FlowText so it can wrap around strokes and insets.
 */
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlowText } from "./FlowText.jsx";
import { Icon } from "./icons.jsx";
import { Face } from "../chat/Face.jsx";
import { StackIcon } from "../about/StackIcon.jsx";
import { Glyph } from "../about/Glyph.jsx";
import { ZoomImage } from "./ZoomImage.jsx";
import Specimen from "./specimen/Specimen.jsx";
import { shortName } from "../a11y.js";
import { assetUrl, INVERT_LOGOS } from "../content.js";
import { ctrlItems, ctrlReserve, receiptsOf, receiptsListH, kpiValueSize, tileNumLabelH, kickerH, kickerW, receiptRowH, previewBox, commitCardParts, commitTitle, commitMetaText, receiptText, breakdownRowHs, splitPeriod, BD_COLS, stepText, STEP_CHIP_W, worklogMeta, worklogLink, fmtDate, OFFCLOCK_GROUPS, STATUS_H } from "../engine/fit.js";
import {
  PAD, proseSteps, stepsFor, PROSE_FONT, QUOTE_STEPS, QUOTE_FONT, QUOTE_WHO_H, TITLE_FONT, titleLineHeight, titleFontFor, titleLHFor,
  KICKER_H, RECEIPTS, COMMITS, MEDIA, DRILL_H, CTRL, WORDS, HEADING, headingH, LOGOS, BREAKDOWN, TILE, TILE_FONT, tileRoleH, TIMELINE, WORKLOG, STACK, OFFCLOCK,
} from "../engine/typo.js";

// The Proof rule lives in one place (engine/fit.js hasRealProof).

export function CellContent({ drillLabel, onDrill, onCaseLink, onStep, cell, fill, insetFill, attachFill, onTile, hot, preview, reduced, onAskOpen, faceBusy, expanded, onToggle, pad, measure, activeVideo, onOpenCase, onExpand, onCollapse, focused }) {
  const P = pad;
  const open = expanded.has(fill.id);
  const innerW = Math.round(cell.w) - 2 * P;
  const [sel, setSel] = useState(null); // stack: the item whose evidence is highlighted
  const listH = open ? receiptsListH(fill, measure, innerW) : 0;
  const tag = receiptsOf(fill).length > 0;
  const body = (() => {
    switch (fill.kind) {
      case "title": return <TitleCell fill={fill} cell={cell} P={P} listH={listH} preview={preview} reduced={reduced} measure={measure} />;
      case "prose": return <ProseCell fill={fill} cell={cell} P={P} listH={listH} insetFill={insetFill} measure={measure} />;
      case "quote": return <QuoteCell fill={fill} cell={cell} P={P} listH={listH} measure={measure} />;
      case "kpi": return <KpiCell fill={fill} cell={cell} P={P} listH={listH} attachFill={attachFill} measure={measure} innerW={innerW} />;
      case "logos": return <LogosCell fill={fill} cell={cell} P={P} listH={listH} measure={measure} />;
      case "timeline": return <TimelineCell fill={fill} cell={cell} P={P} />;
      case "worklog": return <WorklogCell fill={fill} cell={cell} P={P} onCaseLink={onCaseLink} />;
      case "stack": return <StackCell fill={fill} cell={cell} P={P} />;
      case "offclock": return <OffClockCell fill={fill} cell={cell} P={P} />;
      case "portrait": return <PortraitCell fill={fill} cell={cell} reduced={reduced} />;
      case "specimen": {
        // A 36px top strip holds the controls (Expand / Close, Proof), never the specimen itself.
        // Controls anchor to the cell; Proof keeps its usual top-right place.
        const strip = tag || onExpand || focused;
        return (<>
          {focused && (
            <div className="media-toolbar" style={{ height: 36 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="close-btn" aria-label="Close the expanded specimen" onClick={(e) => { e.stopPropagation(); onCollapse(); }}>
                <span aria-hidden>×</span> Close
              </button>
            </div>
          )}
          <div className="c-specimen" style={{ position: "absolute", left: 0, right: 0, top: strip ? 36 : 0, bottom: listH }}>
            <Specimen fill={fill} active={open || !!focused || !!fill.focused} reduced={reduced} pad={20} />
          </div>
        </>);
      }
      case "face": return <FaceCell cell={cell} P={P} onAskOpen={onAskOpen} reduced={reduced} busy={faceBusy} />;
      case "tile": return <TileCell fill={fill} cell={cell} P={P} onTile={onTile} hot={hot} />;
      case "media": return <MediaCell fill={fill} cell={cell} listH={listH} active={activeVideo === fill.id} onOpenCase={onOpenCase} onExpand={onExpand} onCollapse={onCollapse} focused={focused} onStep={onStep} onDrill={onDrill} />;
      case "commits": return <CommitsCell fill={fill} cell={cell} P={P} />;
      default: return null;
    }
  })();
  return (
    <>
      {body}
      <CtrlGroup fill={fill} cell={cell} P={P} open={open} listH={listH} measure={measure} focused={focused}
        onToggle={onToggle} onDrill={onDrill} drillLabel={drillLabel} onExpand={onExpand} onOpenCase={onOpenCase} />
      {open && fill.kind !== "stack" && (
        // Focus mode: beside the text when the engine set it there, else right under it.
        cell.spec?.side
          ? <ReceiptsList fill={fill} P={0} h={cell.spec.listH} measure={measure} innerW={cell.spec.listW} highlight={sel}
              place={{ left: P + cell.spec.side.textW + cell.spec.side.gap, top: P, width: cell.spec.listW, height: cell.spec.listH, bottom: "auto", right: "auto" }} />
          : (fill.kind === "prose" || fill.kind === "quote") && cell.spec?.need != null
            ? <ReceiptsList fill={fill} P={P} h={listH} measure={measure} innerW={innerW} highlight={sel}
                place={{ top: P + (cell.spec.listTop ?? 0) + textTop(fill, cell, P, measure) + cell.spec.need + 12, bottom: "auto" }} />
            : <ReceiptsList fill={fill} P={P} h={listH} measure={measure} innerW={innerW} highlight={sel} />
      )}
    </>
  );
}

/* ---------------------------------------------------------------- title */

function TitleCell({ fill, cell, P, listH, preview, reduced, measure }) {
  const base = cell.spec?.size ?? 48;
  // Sizes from the engine's choice down in ~6% steps; the flow picks the first that fits.
  const steps = [];
  const TLH = titleLHFor(fill);
  for (let s = base; s >= 14 && steps.length < 24; s = Math.floor(s * 0.94)) steps.push({ size: s, lineHeight: TLH(s) });
  const kick = kickerH(measure, fill.kicker, kickerW(fill, Math.round(cell.w) - 2 * P));
  const showing = preview?.current ? preview.key : null;
  return (
    <div className={`c-title ${showing ? "previewing" : ""}`}>
      <div className="wordmark">
        {fill.kicker && <p className="label kicker" style={{ left: P, top: P, width: kickerW(fill, Math.round(cell.w) - 2 * P) }}>{fill.kicker}</p>}
        <h2 className="sr-only">{fill.text}</h2>
        <FlowText
          flowKey={`${fill.id}:t`} fillId={fill.id} text={fill.text} steps={steps} mkFont={titleFontFor(fill)}
          box={(w, h) => ({ x: P, y: P + kick, w: w - 2 * P, h: h - 2 * P - kick - listH })}
          anchor="bottom" strictWords className="t-title"
        />
      </div>
      {preview && <HeroPreview fillId={fill.id} P={P} preview={preview} reduced={reduced} />}
    </div>
  );
}

/**
 * The hero cell as a preview canvas: while a case-study tile is hovered or
 * focused, the wordmark crossfades to that project's cover (whole, contain,
 * centered) with its role line set small in the corner. Layers stay mounted
 * once seen, so A -> B is a direct crossfade.
 */
const PREVIEW_LINE = [{ size: 12, lineHeight: 16 }];
const PREVIEW_FONT = (size) => ({ family: "Satoshi", weight: 500, size, letterSpacingEm: 0.04 });
function HeroPreview({ fillId, P, preview, reduced }) {
  const seen = useRef(new Map());
  const [, bump] = useState(0);
  const key = preview.current ? preview.key : null;
  useEffect(() => {
    if (key && !seen.current.has(key)) { seen.current.set(key, preview.current); bump((n) => n + 1); }
  }, [key, preview]);
  return (
    <div className={`hero-preview ${reduced ? "instant" : ""}`} aria-live="polite">
      {[...seen.current.entries()].map(([k, pv]) => {
        const on = k === key;
        const f = pv.cover;
        const isVideo = f.media === "video" || /\.(mp4|webm|mov)$/i.test(f.src);
        return (
          <div key={k} className={`hp-layer ${on ? "on" : ""}`} aria-hidden={!on}>
            <FlowText
              flowKey={`${fillId}:pv:${k}`} fillId={fillId} text={pv.line.toUpperCase()} steps={PREVIEW_LINE} mkFont={PREVIEW_FONT}
              box={(w) => ({ x: P, y: P, w: w - 2 * P, h: 18 })} className="t-preview"
            />
            <div className="hp-media" style={{ left: P, top: P + 30, right: P, bottom: P }}>
              {isVideo
                ? <Video src={assetUrl(f.src)} poster={assetUrl(f.poster)} alt={f.alt} active={false} />
                : <img src={assetUrl(f.src)} alt={on ? f.alt : ""} draggable={false} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- prose */

function ProseCell({ fill, cell, P, listH, insetFill, measure }) {
  const inset = cell.inset;
  const ctl = ctrlReserve(fill, measure, Math.round(cell.w), P);
  const headH = fill.heading ? headingH(measure, fill.heading, Math.round(cell.w) - 2 * P) : 0;
  const kw = kickerW(fill, Math.round(cell.w) - 2 * P);
  const kickOnly = kickerH(measure, fill.kicker, kw);
  const kick = kickOnly + headH;
  return (
    <div className="c-prose">
      {fill.kicker && <h2 className="label kicker" style={{ left: P, top: P, width: kw, margin: 0 }}>{fill.kicker}</h2>}
      {fill.heading && (
        <h3 className="p-heading" style={{ left: P, right: P, top: P + kickOnly, font: `300 ${HEADING.size}px/${HEADING.lineHeight}px CabinetGrotesk` }}>{fill.heading}</h3>
      )}
      <p className="sr-only">{fill.text}</p>
      <FlowText
        flowKey={`${fill.id}:p`} fillId={fill.id} text={fill.text} steps={stepsFor(fill, P === PAD.phone)} mkFont={PROSE_FONT}
        startStep={cell.spec?.step ?? 0}
        box={(w, h) => (cell.spec?.side && listH
          ? { x: P, y: P + kick, w: cell.spec.side.textW, h: h - 2 * P - kick - ctl }
          : { x: P, y: P + kick, w: w - 2 * P, h: h - 2 * P - kick - listH - ctl })}
        statics={(b) => {
          const o = [];
          if (inset) o.push({ x: b.w - inset.w - 18, y: inset.y - P - kick, w: inset.w + 18, h: inset.h + 10 });
          return o;
        }}
        className="t-prose"
      />
      {fill.status && (
        <div className="status-line" style={{ left: P, right: P, top: P + kick + (cell.spec?.need ?? 0) + 16 }}>
          <div className="label status-text"><i className="status-dot" aria-hidden /> {fill.status.text}</div>
          {fill.status.link && <a className="status-link" href={fill.status.link.url} target="_blank" rel="noreferrer">{fill.status.link.label} →</a>}
        </div>
      )}
      {inset && insetFill && (
        <div className="inset" style={{ right: P, top: inset.y, width: inset.w, height: inset.h }}>
          <KpiBody fill={insetFill} w={inset.w} h={inset.h} P={14} measure={measure} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- quote */

function QuoteCell({ fill, cell, P, listH, measure }) {
  const ctl = ctrlReserve(fill, measure, Math.round(cell.w), P);
  return (
    <div className="c-quote">
      <blockquote className="sr-only">{fill.text} — {fill.who}</blockquote>
      <FlowText
        flowKey={`${fill.id}:q`} fillId={fill.id} text={`“${fill.text}”`} steps={QUOTE_STEPS} mkFont={QUOTE_FONT}
        startStep={cell.spec?.step ?? 0}
        box={(w, h) => ({ x: P, y: P, w: w - 2 * P, h: h - 2 * P - (cell.spec?.whoH ?? QUOTE_WHO_H) - listH - ctl })}
        className="t-quote"
      />
      <div className="label who" style={{ left: P, right: P, bottom: P + listH + ctl }}>{fill.who}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ kpi */

function KpiCell({ fill, cell, P, listH, attachFill, measure, innerW }) {
  const bd = cell.spec?.breakdown;
  const at = cell.attach && attachFill;
  return (
    <div className="c-kpi" style={{ padding: P, paddingBottom: P + listH + ctrlReserve(fill, measure, Math.round(cell.w), P) }}>
      <KpiBody fill={fill} size={cell.spec?.size} />
      {bd === "rows" && <BreakdownRows fill={fill} measure={measure} innerW={innerW} />}
      {bd === "bar" && <BreakdownBar fill={fill} />}
      {at && (
        <div className="kpi-attach" style={{ height: cell.attach.h }}>
          <LogoRow items={attachFill.items} logoH={cell.attach.logoH} />
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------- breakdown + logos */

const pctOf = (b) => (b.share != null ? `${Math.round(b.share * 100)}%` : "");

/**
 * The split behind a number as a measured grid: logo | name (+ period on its
 * own line) | value | mini-bar | share. Row heights come from the engine
 * (Pretext-measured), so a long name grows its row; nothing overlaps.
 */
export function BreakdownRows({ fill, measure, innerW }) {
  const rows = fill.breakdown.slice(0, BREAKDOWN.maxRows);
  const hs = breakdownRowHs(measure, fill, innerW);
  const cols = `${BD_COLS.logo}px minmax(0, 1fr) ${BD_COLS.value}px ${BD_COLS.bar}px ${BD_COLS.pct}px`;
  return (
    <div className="breakdown" style={{ marginTop: 6 }}>
      <div className="label bd-head" style={{ height: BREAKDOWN.headH }}>Split</div>
      <ShareBar fill={fill} />
      <ul aria-label={`${fill.label}, split`}>
        {rows.map((b, i) => {
          const { name, period } = splitPeriod(b.label);
          return (
            <li key={i} style={{ height: hs[i], gridTemplateColumns: cols, columnGap: BD_COLS.gap }}>
              <span className="bd-logo">{b.logo ? <img src={assetUrl(b.logo)} alt="" className={INVERT_LOGOS.has(b.logo) ? "inv" : ""} /> : null}</span>
              <span className="bd-name">{name}{period && <span className="bd-period">{period}</span>}</span>
              <span className="bd-val">{b.value}</span>
              <span className="bd-share">{b.share != null && <i style={{ width: `${b.share * 100}%` }} />}</span>
              <span className="bd-pct">{pctOf(b)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Stacked share bar. When the known rows don't add up to the whole, the rest
 * is one dim, unlabeled "other" segment: shown honestly, never split up.
 */
function ShareBar({ fill, h = 4 }) {
  const parts = fill.breakdown.filter((b) => b.share != null);
  if (!parts.length) return null;
  const rest = Math.max(0, 1 - parts.reduce((s, b) => s + b.share, 0));
  return (
    <div className="bd-bar" style={{ height: h + 6 }} role="img"
      aria-label={`Split: ${parts.map((b) => `${b.label} ${b.value} (${pctOf(b)})`).join(", ")}${rest > 0.005 ? `, other ${Math.round(rest * 100)}%` : ""}`}>
      {parts.map((b, i) => <i key={i} style={{ flexGrow: b.share, height: h }} title={`${b.label} · ${b.value} · ${pctOf(b)}`} />)}
      {rest > 0.005 && <i className="rest" style={{ flexGrow: rest, height: h }} title="other" />}
    </div>
  );
}

function BreakdownBar({ fill }) {
  const known = fill.breakdown.filter((b) => b.share != null);
  return (
    <div className="bd-compact" style={{ height: BREAKDOWN.barH, marginTop: 10 }}>
      <ShareBar fill={fill} />
      <div className="bd-legend">{known.slice(0, 2).map((b) => `${b.label} ${pctOf(b)}`).join(" · ")}</div>
    </div>
  );
}

/** Logos on the dark stage: dark marks (`invert`) are flipped to light; the rest show as they are. */
function LogoRow({ items, logoH, label }) {
  return (
    <div className="logo-wrap">
      {label && <div className="label logos-label" style={{ height: LOGOS.labelH }}>{label}</div>}
      <ul className="logos" style={{ columnGap: LOGOS.gapX, rowGap: LOGOS.gapY }}>
        {items.map((it) => {
          const img = <img src={assetUrl(it.src)} alt={it.name} className={it.invert ? "inv" : ""} style={{ height: logoH, width: Math.round(it.aspect * logoH) }} draggable={false} />;
          return <li key={it.name}>{it.url ? <a href={it.url} target="_blank" rel="noreferrer" aria-label={it.name}>{img}</a> : img}</li>;
        })}
      </ul>
    </div>
  );
}

function LogosCell({ fill, cell, P, listH, measure }) {
  const label = fill.label || (fill.receipts?.length ? " " : "");
  return (
    <div className="c-logos" style={{ padding: P, paddingBottom: P + listH + ctrlReserve(fill, measure, Math.round(cell.w), P) }}>
      <LogoRow items={fill.items} logoH={cell.spec?.logoH ?? 28} label={label} />
    </div>
  );
}

/* ------------------------------------------------------------- timeline */

function TimelineCell({ fill, cell, P }) {
  const rows = cell.spec?.rows ?? fill.items.length;
  return (
    <div className="c-timeline" style={{ padding: P }}>
      <div className="label tl-head" style={{ height: TIMELINE.headH }}>{fill.label}</div>
      <ol>
        {fill.items.slice(0, rows).map((it, i) => (
          <li key={i} className="tl-row" style={{ height: TIMELINE.rowH }}>
            <span className="tl-year" style={{ width: TIMELINE.yearW }}>{it.year}</span>
            <span className="tl-text">{it.text}</span>
          </li>
        ))}
      </ol>
      {rows < fill.items.length && <div className="label">+{fill.items.length - rows} more</div>}
    </div>
  );
}

/* ------------------------------------------------------------- about */

/** Work history, newest first; an entry with a case study opens it (with the chat). */
function WorklogCell({ fill, cell, P, onCaseLink }) {
  const rows = cell.spec?.rows ?? fill.items.length;
  // A job tag picked in the stack lights its timeline entry.
  const [job, setJob] = useState(null);
  useEffect(() => {
    const on = (e) => setJob(e.detail);
    window.addEventListener("stage:job", on);
    return () => window.removeEventListener("stage:job", on);
  }, []);
  const short = (it) => (it.caseTitle || it.org.replace(/\s*\(.*\)\s*$/, "").replace("Georgia Institute of Technology", "Georgia Tech"));
  return (
    <div className="c-worklog" style={{ padding: P }}>
      <div className="label tl-head" style={{ height: WORKLOG.headH }}>{fill.label}</div>
      <ol>
        {fill.items.slice(0, rows).map((it, i) => (
          <li key={i} style={{ height: cell.spec?.rowHs?.[i] }} className={`wl-row k-${it.kind} ${job && short(it) === job ? "lit" : ""}`}>
            <div className="wl-title">{it.title}</div>
            <div className="wl-meta">{worklogMeta(it)}</div>
            {it.summary && <div className="wl-summary">{it.summary}</div>}
            {it.caseStudy && onCaseLink && (
              <button type="button" className="wl-link" aria-label={`Open the ${it.caseTitle || ""} case study`} onClick={() => onCaseLink(it.caseStudy)}>{worklogLink(it)}</button>
            )}
          </li>
        ))}
      </ol>
      {rows < fill.items.length && <div className="label">+{fill.items.length - rows} earlier</div>}
    </div>
  );
}

/** A monochrome icon in the stage ink: the SVG is used as a mask, so brand colours never show. */
const MaskIcon = ({ src, size = STACK.iconW }) => (
  <span className="mask-icon" aria-hidden style={{ width: size, height: size, WebkitMaskImage: `url("${assetUrl(src)}")`, maskImage: `url("${assetUrl(src)}")` }} />
);

/**
 * The stack as a scannable table: [icon + skill] | [jobs it was used in, as
 * tags, + the evidence line], under group headings. Click a skill to light
 * its jobs; click a job to light every skill used there (and its timeline
 * entry). One selection at a time; Escape clears.
 */
function StackCell({ fill, cell, P }) {
  const [sel, setSel] = useState(null); // { skill } | { job }
  const cols = cell.spec?.cols;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("stage:job", { detail: sel?.job ?? null }));
  }, [sel]);
  useEffect(() => {
    if (!sel) return;
    const onKey = (e) => { if (e.key === "Escape") { e.stopImmediatePropagation(); setSel(null); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [sel]);
  const lit = (it) => (sel?.skill ? sel.skill === it.name : sel?.job ? (it.jobs || []).includes(sel.job) : false);
  return (
    <div className="c-stack" style={{ padding: P }}>
      <div className="label" style={{ height: STACK.groupH }}>{fill.label}</div>
      {fill.groups.map((g) => (
        <section key={g.group} className="st-group" style={{ marginBottom: STACK.groupGap }}>
          <div className="label st-head" style={{ height: STACK.groupH + 6 }}>{g.group}</div>
          {g.items.map((it) => (
            <div
              key={it.name} className={`st-row ${cols ? "cols" : "stacked"} ${lit(it) ? "lit" : ""} ${sel && !lit(it) ? "dim" : ""}`}
              style={cols ? { gridTemplateColumns: `${cols.left}px ${cols.right}px`, columnGap: 20 } : undefined}
            >
              <button type="button" className="st-skill" aria-pressed={sel?.skill === it.name}
                onClick={() => setSel((s) => (s?.skill === it.name ? null : { skill: it.name }))}>
                <StackIcon name={it.name} icon={it.icon} size={STACK.iconW} />
                <span>{it.name}</span>
              </button>
              <div className="st-where">
                {(it.jobs || []).length > 0 && (
                  <div className="st-jobs">
                    {it.jobs.map((j) => (
                      <button key={j} type="button" className={`st-job ${sel?.job === j ? "on" : ""}`} aria-pressed={sel?.job === j} aria-label={`${it.name} at ${j}: show every skill used there`}
                        onClick={() => setSel((s) => (s?.job === j ? null : { job: j }))}>{j}</button>
                    ))}
                  </div>
                )}
                {it.evidence && <div className="st-ev">{it.evidence}</div>}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/* Off the clock: compact lists (READING, PLAYING; WATCHING once it has data). */
function OffClockCell({ fill, cell, P }) {
  const L = cell.spec ?? {};
  const rowH = new Map(fill.items.map((it, i) => [it, L.rowHs?.[i]]));
  return (
    <div className="c-offclock" style={{ padding: P }}>
      <div className="label" style={{ height: OFFCLOCK.headH }}>{fill.label}</div>
      {fill.intro && <p className="oc-intro" style={{ minHeight: (L.introH ?? 0) - 14 }}>{fill.intro}</p>}
      {OFFCLOCK_GROUPS.map(([kind, label, icon]) => {
        const items = fill.items.filter((it) => it.kind === kind);
        if (!items.length) return null;
        return (
          <section key={kind} className="oc-list">
            <div className="label oc-head"><Glyph name={icon} size={14} /> {label}</div>
            <ul>
              {items.map((it, i) => (
                <li key={i} style={{ minHeight: rowH.get(it) }}>
                  <OffClockSlot {...it} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/**
 * One off-the-clock entry: { kind, title, by, note?, url?, figure? }. A
 * line-art figure (made later by the Motion Designer) can sit beside it.
 */
export function OffClockSlot({ title, by, note, url, figure }) {
  const sub = [by, note].filter(Boolean).join(" · ");
  return (
    <div className="oc-item">
      {figure && <object className="oc-fig" data={assetUrl(figure)} type={figure.endsWith(".svg") ? "image/svg+xml" : "text/html"} aria-hidden />}
      <div className="oc-title">{url ? <a href={url} target="_blank" rel="noreferrer">{title}</a> : title}</div>
      {sub && <div className="oc-by">{sub}</div>}
    </div>
  );
}
function HairlinePlaceholder({ kind }) {
  return <Glyph name={kind === "game" ? "lucide:gamepad-2" : "lucide:book-open"} size={28} />;
}

/** His particle portrait, lazy (three.js stays off the critical path, loaded when idle). */
const ParticlePortrait = lazy(() => import("../about/ParticlePortrait.jsx"));
function PortraitCell({ fill, cell, reduced }) {
  // The canvas keeps the particle plane's aspect inside the cell (letterboxed on the stage).
  const box = cell.spec?.box ?? { x: 0, y: 0, w: cell.w, h: cell.h };
  const pct = (v, of) => `${(100 * v) / of}%`;
  const at = { position: "absolute", left: pct((cell.w - box.w) / 2, cell.w), top: pct((cell.h - box.h) / 2, cell.h), width: pct(box.w, cell.w), height: pct(box.h, cell.h) };
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const id = idle(() => setReady(true), { timeout: 1500 });
    return () => (window.cancelIdleCallback || clearTimeout)(id);
  }, []);
  return (
    <div className="c-portrait" role="img" aria-label={fill.alt}>
      <div style={at}>{ready && <Suspense fallback={null}><ParticlePortrait src={assetUrl(fill.src)} reduced={reduced} background={getComputedStyle(document.documentElement).getPropertyValue("--portrait-bg").trim() || "#141414"} /></Suspense>}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- face */

/** The site's character, large, with Ask Kip under it (while the chat is closed). */
function FaceCell({ cell, P, onAskOpen, reduced, busy }) {
  const btnH = onAskOpen ? 52 : 0;
  const size = Math.max(80, Math.min(cell.w - 2 * P, cell.h - 2 * P - btnH));
  // The whole tile opens the chat (keyboard too); the button is its label.
  const act = onAskOpen ? {
    role: "button", tabIndex: 0, "aria-label": "Ask Kip", onClick: onAskOpen,
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onAskOpen(); } },
  } : {};
  return (
    <div className={`c-face ${onAskOpen ? "asks" : ""}`} {...act}>
      <div className="face-slot" style={{ left: P, right: P, top: P, bottom: P + btnH }}>
        <Face size={size} reduced={reduced} busy={busy} />
      </div>
      {onAskOpen && (
        <span className="ask-btn in-cell label" aria-hidden="true" style={{ bottom: P - 4 }}>
          Ask Kip <span>→</span>
        </span>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- tile */

/**
 * A case-study tile: leads with the role and the task; the product shot only
 * appears when the tile is expanded (hover / focus / first tap).
 */
function TileCell({ fill, cell, P, onTile, hot }) {
  const step = cell.spec?.step ?? 3;
  const num = cell.spec?.num ?? 0;
  const numH = num ? num * 0.92 + tileNumLabelH(cell.spec?.labelLines ?? 1) + TILE.numGap : 0;
  const roleH = tileRoleH(cell.spec?.roleLines ?? 1);
  const act = (e) => onTile?.(fill.caseStudy, "activate", e);
  return (
    <div
      className={`c-tile ${hot ? "hot" : ""}`} role="button" tabIndex={0}
      onClick={act}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(e); } }}
      onFocus={() => onTile?.(fill.caseStudy, "focus")}
      onBlur={() => onTile?.(fill.caseStudy, "blur")}
    >
      <p className="sr-only">{cell.spec?.useShort && fill.taskShort ? fill.taskShort : fill.task}</p>
      <div className="label tile-role" style={{ left: P, top: P, right: P }}>{cell.spec?.roleShort && fill.roleShort ? fill.roleShort : fill.role}</div>
      <FlowText
        flowKey={`${fill.id}:task`} fillId={fill.id} text={cell.spec?.useShort && fill.taskShort ? fill.taskShort : fill.task} steps={TILE.steps} mkFont={TILE_FONT}
        startStep={step} strictWords
        box={(w, h) => ({ x: P, y: P + roleH, w: w - 2 * P, h: h - 2 * P - roleH - numH })}
        className="t-tile"
      />
      {num > 0 && (
        <div className="tile-num" style={{ left: P, bottom: P, right: P }}>
          <div className="kpi-value" style={{ fontSize: num }}>{fill.number.value}{fill.number.unit && <span className="kpi-unit">{fill.number.unit}</span>}</div>
          <div className="kpi-label tile-num-label" style={{ marginRight: TILE.openW + 16, fontSize: TILE.labelSize, lineHeight: `${TILE.labelLH}px` }}>{fill.number.label}</div>
        </div>
      )}
      <span className="label tile-open" style={{ right: P, bottom: P, width: TILE.openW }} aria-hidden>Open →</span>
    </div>
  );
}

function KpiBody({ fill, size, w, h, P, measure }) {
  let fs = size;
  if (fs == null && measure) fs = kpiValueSize(measure, fill, w - 2 * P - 2, h - 2 * P - 4).size; // -border
  return (
    <div className="kpi-body" style={P != null ? { padding: P } : undefined}>
      <div className="kpi-value" style={{ fontSize: fs ?? 56 }}>
        {fill.value}{fill.unit && <span className="kpi-unit">{fill.unit}</span>}
      </div>
      <div className="kpi-label">{fill.label}</div>
      {(fill.period || fill.baseline) && (
        <div className="label kpi-meta">{[fill.period, fill.baseline].filter(Boolean).join(" · ")}</div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- media */

function MediaCell({ fill, cell, listH, active, onOpenCase, onExpand, onCollapse, focused, onStep, onDrill }) {
  const spec = cell.spec ?? {};
  const box = spec.box ?? { x: 0, y: 0, w: cell.w, h: cell.h - listH, fit: "contain" };
  const src = assetUrl(fill.src);
  const isVideo = fill.media === "video" || (fill.media === "animation" && /\.(mp4|webm|mov)$/i.test(fill.src));
  const opens = fill.caseStudy && onOpenCase;
  // A media tile with `opens` drills into its child deck on click; expanding in
  // place stays available from its own small control.
  const drills = !opens && fill.opens && onDrill && !focused;
  const expands = !opens && !drills && onExpand && !focused;
  const cap = spec.cap;
  // Positions are fractions of the cell, so mid-morph the media scales with its
  // cell instead of jumping to the final size.
  const pct = (v, of) => `${(100 * v) / of}%`;
  const W = cell.w, H = cell.h;
  const closeRef = useRef(null);
  const [zoomSlot, setZoomSlot] = useState(null);
  // Focus moves into the expanded cell (its close button) and back on close (App).
  useEffect(() => { if (focused) closeRef.current?.focus({ preventScroll: true }); }, [focused]);
  const act = opens ? () => onOpenCase(fill.caseStudy) : drills ? () => onDrill(fill.opens) : expands ? () => onExpand(fill.id) : null;
  const label = opens ? `Open the ${fill.caseTitle || ""} case study` : drills ? `Go deeper: ${fill.alt}` : expands ? `Expand: ${fill.alt}` : undefined;
  return (
    <div
      role="figure" aria-label={fill.alt}
      className={`c-media ${opens ? "opens" : ""} ${expands ? "expands" : ""} ${focused ? "focused" : ""}`}
      {...(act ? {
        // Mouse: click the media. Keyboard: the tile (cell) is the control; Enter runs this.
        "data-act": label,
        onClick: act,
      } : {})}
      onClick={focused && !isVideo ? onCollapse : act || undefined}
    >
      <div className={`media-box fit-${box.fit || "cover"}`} style={{ left: pct(box.x, W), top: pct(box.y, H), width: pct(box.w, W), height: pct(box.h, H) }}>
        {isVideo ? (
          <Video src={src} poster={assetUrl(fill.poster)} alt={fill.alt} active={active} controls={focused} />
        ) : (
          focused ? <ZoomImage src={src} alt={fill.alt} slot={zoomSlot} /> : <img src={src} alt={fill.alt} draggable={false} />
        )}
      </div>
      {focused && (
        // The toolbar sits above the image, never on it: close, step nav, zoom.
        <div className="media-toolbar" style={{ height: spec.toolbar?.h ?? 36 }} onClick={(e) => e.stopPropagation()}>
          <button ref={closeRef} type="button" className="close-btn" aria-label="Close the expanded view" onClick={(e) => { e.stopPropagation(); onCollapse(); }}>
            <span aria-hidden>×</span> Close
          </button>
          {fill.step && onStep && (
            <div className="step-nav">
              <button type="button" aria-label="Previous step" onClick={(e) => { e.stopPropagation(); onStep(-1); }} disabled={fill.step.n <= 1}>←</button>
              <button type="button" aria-label="Next step" onClick={(e) => { e.stopPropagation(); onStep(1); }} disabled={fill.step.n >= fill.step.of}>→</button>
            </div>
          )}
          <div className="zoom-slot" ref={setZoomSlot} />
        </div>
      )}
      {fill.step && spec.step && (
        <div className="step-mark" style={{ left: pct(spec.step.x, W), top: pct(spec.step.y, H), width: pct(spec.step.w, W) }}>
          <span className="step-text" style={{ marginRight: STEP_CHIP_W }}>{stepText(fill.step)}</span>
          <span className={`step-chip s-${fill.step.status}`}>{fill.step.status}</span>
          {fill.stepTrack && (
            <span className="step-track" aria-hidden>
              {Array.from({ length: fill.step.of }, (_, i) => <i key={i} className={i + 1 === fill.step.n ? "on" : ""} />)}
            </span>
          )}
        </div>
      )}

      {fill.caption && cap && (
        <div className="caption" style={{ left: pct(cap.x, W), top: pct(cap.y, H), width: pct(cap.w, W) }}>
          <span className="cap-t" style={{ WebkitLineClamp: Math.max(1, cap.lines) }}>{fill.caption}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Only one video plays at a time (the Stage picks it: hovered, else the
 * heaviest on stage; none under reduced motion). The rest rest on their
 * poster frame.
 */
function Video({ src, poster, alt, active, controls }) {
  const v = useRef(null);
  const [manual, setManual] = useState(false); // played by an explicit click / Enter / tap
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    // Hover plays; leaving pauses and keeps the position. A manual play stays until toggled.
    if (active || manual) el.play().catch(() => {}); else el.pause();
  }, [active, manual]);
  const toggle = (e) => { e?.stopPropagation(); setManual((m) => (m ? (v.current?.pause(), false) : true)); };
  return (
    <>
      <video ref={v} src={src} poster={poster} muted loop playsInline preload="metadata" controls={controls} aria-label={alt}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {!controls && (
        <button type="button" className={`play-glyph ${playing ? "is-playing" : ""}`} aria-label={`Play: ${alt}`} aria-pressed={playing} onClick={toggle}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); } }}>
          <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
        </button>
      )}
    </>
  );
}

/* -------------------------------------------------------------- commits */

function CommitsCell({ fill, cell, P }) {
  const rows = cell.spec?.rows ?? Math.min(fill.items.length, 4);
  const shown = fill.items.slice(0, rows);
  const headH = cell.spec?.headH ?? COMMITS.headerH;
  return (
    <div className="c-commits" style={{ padding: P }}>
      <div className={`commits-head ${headH > COMMITS.headerH ? "two" : ""}`} style={{ height: headH }}>
        <Icon type="commit" size={13} />
        <span className="label">{WORDS.shipped}</span>
        <code className="repo">{fill.repo}</code>
      </div>
      <ol>
        {shown.map((c, i) => (
          <li key={c.sha} style={{ height: cell.spec?.rowHs?.[i] ?? COMMITS.rowH }}>
            <div className="commit-msg">{c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.msg}</a> : c.msg}</div>
            <div className="commit-meta"><code>{c.sha.slice(0, 7)}</code> · {c.date}</div>
          </li>
        ))}
      </ol>
      {rows < fill.items.length && <div className="label commits-more">+{fill.items.length - rows} more</div>}
    </div>
  );
}

/* ------------------------------------------------------------- receipts */

/**
 * The control group: [GO DEEPER →] [PROOF] [↗], one height, one type style, right-aligned
 * at the cell's 16px inset. Media place it in their strip (spec.ctrl); a specimen in its
 * top strip; every other kind at the bottom, above an open Proof list. Widths come from
 * the engine (ctrlItems) so the DOM wraps exactly where the layout reserved room.
 */
function CtrlGroup({ fill, cell, P, open, listH, measure, focused, onToggle, onDrill, drillLabel, onExpand, onOpenCase }) {
  const drill = !!(fill.opens && onDrill);
  const exp = !!(onExpand && !focused && (fill.kind === "specimen" || (fill.kind === "media" && !(fill.caseStudy && onOpenCase))));
  const items = ctrlItems(fill, measure, { drill, exp });
  if (!items.length) return null;
  const W = Math.round(cell.w);
  let place;
  if (fill.kind === "media" && cell.spec?.ctrl) place = { top: cell.spec.ctrl.y, right: cell.spec.ctrl.right, maxWidth: cell.spec.ctrl.w };
  else if (fill.kind === "specimen") place = { top: 2, right: CTRL.inset, maxWidth: W - 2 * CTRL.inset };
  else {
    // The open list sits at the cell bottom unless it was placed beside / right under the text.
    const listAtBottom = open && !cell.spec?.side && !((fill.kind === "prose" || fill.kind === "quote") && cell.spec?.need != null);
    place = { bottom: CTRL.inset + (listAtBottom ? listH : 0), right: CTRL.inset, maxWidth: W - 2 * CTRL.inset };
  }
  return (
    <div className="ctrl-group" style={place}>
      {items.map((it) => it.k === "drill" ? (
        <button key="drill" type="button" className="drill" style={{ width: it.w }} aria-label={`Go deeper: ${drillLabel?.(fill.opens) || "more on this"}`}
          onClick={(e) => { e.stopPropagation(); onDrill(fill.opens); }}>
          Go deeper <span aria-hidden>→</span>
        </button>
      ) : it.k === "proof" ? (
        <ReceiptsTag key="proof" fill={fill} open={open} onToggle={onToggle} width={it.w} />
      ) : (
        <button key="exp" type="button" className={`expand-mini ${fill.kind === "specimen" ? "spec-expand" : ""}`} style={{ width: it.w }}
          aria-label={`Expand: ${fill.alt || shortName(fill)}`} onClick={(e) => { e.stopPropagation(); onExpand(fill.id); }}>
          <span aria-hidden>↗</span>
        </button>
      ))}
    </div>
  );
}

function ReceiptsTag({ fill, open, onToggle, width }) {
  const list = receiptsOf(fill);
  const types = [...new Set(list.map((r) => r.type))].slice(0, 3);
  const style = { width };
  return (
    <button
      type="button"
      className={`receipts-tag ${open ? "open" : ""}`}
      style={style}
      aria-expanded={open}
      aria-label={open ? `Hide proof for ${shortName(fill)}` : `Show proof for ${shortName(fill)} (${list.length} source${list.length === 1 ? "" : "s"})`}
      onClick={(e) => { e.stopPropagation(); onToggle(fill.id); }}
    >
      {!open && types.map((t) => <Icon key={t} type={t} size={11} />)}
      <span>{open ? WORDS.proofClose : WORDS.proof}</span>
    </button>
  );
}

const DAY = 86400000;
export function relativeDate(iso, now = Date.now()) {
  const d = Math.round((now - Date.parse(iso)) / DAY);
  if (!Number.isFinite(d)) return "";
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 45) return `${d} days ago`;
  const m = Math.round(d / 30.4);
  if (m < 18) return `${m} month${m === 1 ? "" : "s"} ago`;
  const y = Math.round(d / 365);
  return `${y} years ago`;
}

/** A commit receipt as a GitHub-style card; every block wraps, heights measured. */
function CommitCard({ r, measure, innerW }) {
  const p = commitCardParts(measure, r, innerW);
  return (
    <li className="commit-card" style={{ height: receiptRowH(measure, { ...r, preview: undefined }, innerW) }}>
      <div className="cc-title" style={{ height: p.title }}><Icon type="commit" size={14} /><span>{commitTitle(r)}</span></div>
      <div className="cc-meta" style={{ height: p.meta }}>
        <code>{r.ref.slice(0, 7)}</code> · Namit Kapoor
        {r.date && <> · <time dateTime={r.date} title={relativeDate(r.date)}>{fmtDate(r.date)}</time></>}
      </div>
      <div className="cc-foot" style={{ height: p.foot }}>
        <code className="repo">{r.repo}</code>{" "}
        {r.url
          ? <a href={r.url} target="_blank" rel="noreferrer">View on GitHub <Icon type="external" size={10} /></a>
          : <span className="cc-private">private repo</span>}
      </div>
    </li>
  );
}

/** Top of a text cell's flow box (kicker + heading), so the proof list can sit right under the text. */
const textTop = (fill, cell, P, measure) => kickerH(measure, fill.kicker, kickerW(fill, Math.round(cell.w) - 2 * P)) + (fill.heading ? headingH(measure, fill.heading, Math.round(cell.w) - 2 * P) : 0);

/** A playable preview on a receipt (device-framed GIF). Click opens it large. */
function ReceiptPreview({ p, innerW, alt }) {
  const box = previewBox(p, innerW);
  const [hover, setHover] = useState(false);
  const [big, setBig] = useState(false);
  const btn = useRef(null);
  const dlg = useRef(null);
  // A real modal: showModal() traps focus; Escape (cancel) closes; focus returns to the preview.
  useEffect(() => {
    if (!big) return;
    dlg.current?.showModal?.();
    dlg.current?.querySelector(".close-btn")?.focus();
  }, [big]);
  const close = () => { setBig(false); requestAnimationFrame(() => btn.current?.focus()); };
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Poster until hovered; the animated GIF only while the pointer is on it.
  // Light theme: the demo's NAME-light variant (same file name + "-light").
  const light = typeof document !== "undefined" && document.documentElement.dataset.theme === "light";
  const themed = (u) => (u && light && /\/demos\//.test(u) ? u.replace(/(\.[a-z0-9]+)$/i, "-light$1") : u);
  const src = assetUrl(themed(hover && !reduced ? p.src : p.poster || p.src));
  return (
    <>
      <button ref={btn} type="button" className={`r-preview f-${p.frame || "none"}`} style={{ width: box.w, height: box.h }}
        onPointerEnter={(e) => e.pointerType !== "touch" && setHover(true)} onPointerLeave={() => setHover(false)}
        onClick={() => setBig(true)} aria-label={`Play: ${alt}`}>
        <img src={src} alt="" draggable={false} />
        {!hover && <span className="play-glyph static" aria-hidden>▶</span>}
      </button>
      {big && (
        <dialog ref={dlg} className="preview-big" aria-modal="true" aria-label={alt}
          onCancel={(e) => { e.preventDefault(); close(); }} onClick={(e) => { if (e.target === dlg.current) close(); }}
          onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } }}>
          <img src={assetUrl(themed(reduced ? p.poster || p.src : p.src))} alt={alt} style={{ aspectRatio: p.aspect }} />
          <button type="button" className="close-btn" onClick={close}><span aria-hidden>×</span> Close</button>
        </dialog>
      )}
    </>
  );
}

function ReceiptsList({ fill, P, h, measure, innerW, highlight, place }) {
  const list = receiptsOf(fill);
  return (
    <div className={`receipts ${place ? (place.left != null ? "placed side" : "placed under") : ""}`} style={{ top: "auto", left: 0, right: 0, bottom: 0, height: h, padding: `0 ${P}px`, ...place }}>
      {fill.kind === "kpi" && fill.breakdown?.length > 0 && <BreakdownRows fill={fill} measure={measure} innerW={innerW} />}
      <div className="label receipts-head" style={{ height: RECEIPTS.headerH }}>{WORDS.proof}</div>
      <ul>
        {list.map((r, i) => {
          if (r.type === "commit") return (
            <li key={`${r.ref}-${i}`} className="commit-wrap" style={{ height: receiptRowH(measure, r, innerW) }}>
              <ul className="cc-inner"><CommitCard r={r} measure={measure} innerW={innerW} /></ul>
              {r.preview && <ReceiptPreview p={r.preview} innerW={innerW} alt={commitTitle(r)} />}
            </li>
          );
          const text = receiptText(r);
          return (
            <li key={`${r.ref}-${i}`} className={`r-row ${r.preview ? "has-preview" : ""} ${highlight && (r.item || r.ref) === highlight ? "hi" : ""}`} style={{ height: receiptRowH(measure, r, innerW) }}>
              <div className="r-line">
                <Icon type={r.type} size={14} />
                <span className="r-what">{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{text}</a> : text}</span>
                {r.date && <span className="r-date">{r.date.slice(0, 10)}</span>}
              </div>
              {r.preview && <ReceiptPreview p={r.preview} innerW={innerW} alt={text} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { PAD };
