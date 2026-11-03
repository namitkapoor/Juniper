import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { layoutStage, PHONE_BREAKPOINT } from "./engine/layout.js";
import { naturalHeight } from "./engine/fit.js";
import { fakeMeasure } from "./engine/fakeMeasure.js";
import { pretextMeasure, loadFonts } from "./text/measure.js";
import { loadContent } from "./content.js";
import { ask } from "./answer.js";
import { focusAnswer, recedeAnswer, dedupeOpens } from "./focus.js";
import { homeWithTiles, heroPreviews } from "./tiles.js";
import { Stage } from "./stage/Stage.jsx";
import { Chat } from "./chat/Chat.jsx";
import { Face } from "./chat/Face.jsx";
import { Navbar } from "./nav/Navbar.jsx";
import { aboutAnswer, aboutFromJson } from "./about/aboutAnswer.js";
import { caseName } from "./caseName.js";

const FRAME = 20; // outer gutter around the hairline frame
const NAV_H = 64; // the ported site nav sits on top of the frame, sharing its hairline

function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setVp({ w: window.innerWidth, h: window.innerHeight })); };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

function useReducedMotion() {
  const q = "(prefers-reduced-motion: reduce)";
  const [r, setR] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

/**
 * Chat history is a set ordered by recency: re-asking an earlier question
 * moves its turn to the end (latest, expanded) instead of adding a new line.
 */
function withoutTurn(messages, question) {
  const norm = (t) => (t || "").trim().toLowerCase();
  const out = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role === "user" && norm(m.text) === norm(question)) {
      if (messages[i + 1]?.role === "bot") i++; // drop its answer with it
      continue;
    }
    out.push(m);
  }
  return out;
}

export default function App() {
  const vp = useViewport();
  const reduced = useReducedMotion();
  const phone = vp.w < PHONE_BREAKPOINT;
  const [fontsReady, setFontsReady] = useState(false);
  const [content, setContent] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [promote, setPromote] = useState([]);
  const [focus, setFocus] = useState(null); // expanded media fill id
  const [hot, setHot] = useState(null); // previewed home tile (case study id)
  const hotRef = useRef(null);
  hotRef.current = hot;
  const seenFills = useRef(new Map());
  // The hero build plays once per session (sessionStorage); reduced motion skips it.
  const [introPending, setIntroPending] = useState(() => {
    try { return !sessionStorage.getItem("stage-intro-seen") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
  });
  const onIntroDone = useCallback(() => {
    try { sessionStorage.setItem("stage-intro-seen", "1"); } catch { /* private mode */ }
    setIntroPending(false);
  }, []);

  const answers = useRef(new Map()); // id -> answer, so Back can restore any of them

  useEffect(() => {
    loadFonts().then(() => setFontsReady(true));
    loadContent().then((c) => {
      setContent(c);
      setAnswer(c.home);
      answers.current.set(c.home.id, c.home);
      window.__content = c;
    });
  }, []);

  const measure = fontsReady ? pretextMeasure : fakeMeasure;

  // Desktop: the chat covers the right side; the stage is what's left.
  const chatW = phone ? 0 : chatOpen ? Math.round(Math.min(440, Math.max(340, vp.w * 0.3))) : 0;
  const frameW = vp.w - 2 * FRAME;
  const frameH = vp.h - 2 * FRAME - NAV_H + 1;
  // The About stage is a long page: taller than the frame, scrolled inside it,
  // so the whole work history and stack fit without cutting anything.
  const isLongPage = answer?.page === "about" && !phone;
  const stageW = frameW - chatW;
  // A long page's height comes from its content: the stacked heights of its
  // fills at half the width, over two columns, with room to spare.
  const longH = useMemo(() => {
    if (!isLongPage || !answer) return 0;
    const ctx = { pad: 24, measure: fontsReady ? pretextMeasure : fakeMeasure };
    const sum = answer.fills.reduce((t, f) => { const n = naturalHeight(f, Math.round(stageW / 2), ctx); return t + (typeof n === "number" ? n : n.h); }, 0);
    return Math.round(Math.max(frameH * 1.6, (sum / 2) * 1.25));
  }, [isLongPage, answer, stageW, frameH, fontsReady]);
  const tall = isLongPage ? Math.max(1, longH / frameH) : 1;
  const rect = phone
    ? { x: 0, y: 0, w: vp.w, h: vp.h }
    : { x: 0, y: 0, w: stageW, h: isLongPage ? longH : frameH };

  const onHomeStage = !!(content && answer && answer.id === content.home.id);
  const stageAnswer = useMemo(() => {
    if (!answer) return answer;
    if (focus) return focusAnswer(dedupeOpens(answer), focus);
    if (expanded.length && !onHomeStage) return recedeAnswer(dedupeOpens(answer), expanded[0]);
    if (onHomeStage) return homeWithTiles(answer, content.caseStudies, { chatOpen: chatOpen && !phone });
    return dedupeOpens(answer);
  }, [answer, focus, onHomeStage, content, expanded, chatOpen, phone]);
  const previews = useMemo(() => (content ? heroPreviews(content.home, content.caseStudies) : {}), [content]);

  // Layouts are cached by input, and the home tile variants are precomputed
  // when the browser is idle, so hovering a tile never waits on the search.
  const layoutCache = useRef(new Map());
  const layoutFor = useCallback((A) => {
    const key = `${A.id}|${rect.w}x${rect.h}|${vp.w}|${expanded.join(",")}|${promote.join(",")}|${fontsReady}`;
    let L = layoutCache.current.get(key);
    if (!L) {
      const t = performance.now();
      L = layoutStage({ rect, fills: A.fills, measure, expanded, promote, viewportW: vp.w, split: A.split });
      L.ms = Math.round(performance.now() - t);
      layoutCache.current.set(key, L);
      if (layoutCache.current.size > 80) layoutCache.current.delete(layoutCache.current.keys().next().value);
    }
    return L;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect.w, rect.h, vp.w, expanded, promote, fontsReady, measure]);

  const layout = useMemo(() => {
    if (!stageAnswer || !fontsReady) return null;
    const L = layoutFor(stageAnswer);
    window.__layout = L;
    return L;
  }, [stageAnswer, fontsReady, layoutFor]);


  // Every fill ever shown stays resolvable, so outgoing cells can fade out.
  const fillMap = useMemo(() => {
    if (stageAnswer) for (const f of stageAnswer.fills) seenFills.current.set(f.id, f);
    return new Map(seenFills.current);
  }, [stageAnswer]);

  const caseTitle = useCallback((id) => caseName(id), []); // short NAME, never the deck title
  const isHome = !!(content && answer && answer.id === content.home.id);

  /** Show an answer; push a history entry unless we are replaying one. */
  const go = useCallback((a, { push = true } = {}) => {
    answers.current.set(a.id, a);
    setFocus(null);
    setExpanded([]);
    setPromote([]);
    setAnswer(a);
    if (push && content) {
      const url = new URL(window.location.href);
      if (content.decks.some((d) => d.id === a.id)) url.searchParams.set("a", a.id);
      else url.searchParams.delete("a");
      if (a.page === "about") url.searchParams.set("page", "about");
      else url.searchParams.delete("page");
      window.history.pushState({ id: a.id }, "", url);
    }
  }, [content]);

  const goHome = useCallback(() => { if (content) go(content.home); }, [content, go]);
  // about.json (content side) when present; else the old About copy.
  const about = useMemo(() => (content?.about ? aboutFromJson(content.about, content.caseStudies) : aboutAnswer()), [content]);
  const goAbout = useCallback(() => go(about), [go, about]);
  const isAbout = answer?.id === "about";

  /** Open a starter deck as if its question had been asked. */
  /**
   * Asking is idempotent: a second ask while one is in flight (a double click,
   * a double Enter) is ignored, and asking for the answer already on stage only
   * re-focuses it. Only explicit asks append chat turns; routing never does.
   */
  const inFlight = useRef(null); // { key, until }
  const currentId = useRef(null);
  currentId.current = answer?.id;
  const claim = (key) => {
    const now = performance.now();
    if (inFlight.current && now < inFlight.current.until) return false;
    inFlight.current = { key, until: now + 900 };
    return true;
  };
  // Answers that already have their turn in the chat (so routing never repeats one).
  const turned = useRef(new Set());
  const lastQ = useRef(null); // the question of the latest turn in the chat
  const openDeck = useCallback((deck, { silent = false } = {}) => {
    setChatOpen(true);
    if (currentId.current === deck.id) return; // already on stage: nothing to append
    if (!silent && !claim(deck.id)) return;
    // The same question as the latest turn (e.g. chip, Back, same chip) only re-opens it.
    if (lastQ.current === deck.question) silent = true;
    if (!silent) turned.current.add(deck.id);
    if (!silent) lastQ.current = deck.question;
    if (!silent) setMessages((m) => [...withoutTurn(m, deck.question), { role: "user", text: deck.question }, { role: "bot", text: deck.thesis, how: deck.caseStudy ? caseTitle(deck.caseStudy) : "other work" }]);
    go(deck);
  }, [go, caseTitle]);

  const onOpenCase = useCallback((caseId) => {
    const deck = content?.decks.find((d) => d.caseStudy === caseId);
    if (deck) openDeck(deck);
  }, [content, openDeck]);

  /**
   * Tile preview: hovering a case-study tile (~120ms intent, short grace on
   * leave) crossfades the "namit" hero to that project's cover; the grid
   * itself never re-cuts. Focus previews at once, Escape clears, touch
   * previews on the first tap and opens on the second.
   */
  const hoverT = useRef(0);
  const pending = useRef(undefined);
  const lastPointer = useRef("mouse");
  const lastDownAt = useRef(0);
  useEffect(() => {
    const on = (e) => { lastPointer.current = e.pointerType || "mouse"; lastDownAt.current = performance.now(); };
    window.addEventListener("pointerdown", on, true);
    return () => window.removeEventListener("pointerdown", on, true);
  }, []);
  const commitHot = useCallback((cs) => {
    pending.current = undefined;
    if (cs === hotRef.current) return;
    setHot(cs);
  }, []);
  const onTile = useCallback((cs, kind) => {
    if (kind === "move") {
      if (cs === pending.current) return;
      clearTimeout(hoverT.current);
      pending.current = cs;
      if (cs === hotRef.current) return;
      hoverT.current = setTimeout(() => commitHot(cs), cs ? 120 : 320);
    } else if (kind === "focus") {
      // A tap focuses the tile too; let the tap itself decide (preview first, open second).
      if (lastPointer.current === "touch" && performance.now() - lastDownAt.current < 800) return;
      clearTimeout(hoverT.current);
      commitHot(cs);
    } else if (kind === "blur") {
      clearTimeout(hoverT.current);
      hoverT.current = setTimeout(() => { if (!document.activeElement?.closest("[data-case]")) commitHot(null); }, 320);
    } else if (kind === "activate") {
      clearTimeout(hoverT.current);
      if (lastPointer.current === "touch" && hotRef.current !== cs) commitHot(cs);
      else { setHot(null); onOpenCase(cs); }
    }
  }, [onOpenCase, commitHot]);
  useEffect(() => {
    if (!hot) return;
    const onKey = (e) => { if (e.key === "Escape") { clearTimeout(hoverT.current); commitHot(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hot, commitHot]);
  useEffect(() => { if (!onHomeStage) setHot(null); }, [onHomeStage]);

  // Whatever brings a deck on stage (a cover, ?a=, Back/Forward, a drill) the
  // chat shows its question + thesis as the current turn, once per answer.
  useEffect(() => {
    if (!answer || !content || answer.id === content.home.id || answer.page === "about" || !answer.question) return;
    if (turned.current.has(answer.id)) return;
    turned.current.add(answer.id);
    if (lastQ.current === answer.question) return;
    lastQ.current = answer.question;
    setMessages((m) => [...withoutTurn(m, answer.question), { role: "user", text: answer.question }, { role: "bot", text: answer.thesis, how: answer.caseStudy ? caseName(answer.caseStudy) : "other work" }]);
  }, [answer, content]);

  // Back / Forward replay the stage (and reopen the chat for answers).
  // The initial route (?page=about, ?a=deck) runs ONCE: a content reload (HMR
  // of the data files) must not replay it or touch history or the chat.
  const routed = useRef(false);
  useEffect(() => {
    if (!content || routed.current) return;
    routed.current = true;
    window.history.replaceState({ id: content.home.id }, "", window.location.href);
    answers.current.set(about.id, about);
    if (new URL(window.location.href).searchParams.get("page") === "about") {
      window.history.pushState({ id: about.id }, "", window.location.href);
      setAnswer(about);
    }
    const deep = new URL(window.location.href).searchParams.get("a");
    const deck = deep && content.decks.find((d) => d.id === deep);
    if (deck) {
      const url = new URL(window.location.href);
      url.searchParams.delete("a");
      window.history.replaceState({ id: content.home.id }, "", url);
      openDeck(deck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (!content) return;
    const onPop = (e) => {
      const a = answers.current.get(e.state?.id) ?? content.decks.find((d) => d.id === e.state?.id) ?? content.home;
      go(a, { push: false });
      setFocus(e.state?.focus ?? null);
      setExpanded(e.state?.proof ? [e.state.proof] : []);
      if (a.id !== content.home.id) setChatOpen(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  /**
   * Suggestions follow the conversation: inside a case study, its other
   * starter questions plus a way back; elsewhere, one entry per case study.
   */
  /**
   * Drill-down: a tile with `opens` goes into a child deck (`parent` set).
   * Back (browser) steps up one level; the "← <case>" control returns to the
   * case study's MAIN deck in one step from any depth.
   */
  const allDecks = useMemo(() => (content ? [...content.decks, ...content.fixtures] : []), [content]);
  const deckById = useCallback((id) => allDecks.find((d) => d.id === id), [allDecks]);
  const rootOf = useCallback((a) => {
    if (!a) return null;
    if (a.caseStudy) return content?.decks.find((d) => d.caseStudy === a.caseStudy && !d.parent) || null;
    let r = a;
    for (let i = 0; i < 8 && r?.parent; i++) r = deckById(r.parent) || null;
    return r && r !== a ? r : null;
  }, [content, deckById]);
  const onDrill = useCallback((id) => {
    const child = deckById(id);
    if (child) openDeck(child);
  }, [deckById, openDeck]);
  const backTarget = answer?.parent ? rootOf(answer) : null;
  const backLabel = backTarget ? (answer.caseStudy ? caseTitle(answer.caseStudy) : backTarget.question) : null;

  const chips = useMemo(() => {
    if (!content || !answer) return [];
    if (!content.decks.length) return content.fixtures.filter((d) => !d.parent).slice(0, 6).map((d) => ({ label: d.question, q: d.question }));
    const back = { label: "Back to all three", home: true };
    // Inside a child deck: its sibling stages, then back to the case study's main deck.
    if (answer.parent) {
      const sibs = allDecks.filter((d) => d.parent === answer.parent && d.id !== answer.id);
      const root = rootOf(answer);
      const name = answer.caseStudy ? caseTitle(answer.caseStudy) : root?.question;
      return [...sibs.map((d) => ({ label: d.question, deck: d, kicker: name })), ...(root ? [{ label: `back to ${name}`, deck: root, back: true }] : [])];
    }
    const cs = answer.caseStudy;
    if (cs) {
      // Child decks are reached by drilling in, never as starter chips.
      const rest = content.decks.filter((d) => d.caseStudy === cs && !d.parent && d.id !== answer.id && d.question !== answer.question);
      return [...rest.map((d) => ({ label: d.question, deck: d, kicker: caseTitle(cs) })), back];
    }
    const entries = content.caseStudies
      .map((c) => content.decks.find((d) => d.caseStudy === c.id && !d.parent))
      .filter(Boolean)
      .map((d) => ({ label: d.question, deck: d, kicker: caseTitle(d.caseStudy) }));
    if (isHome) return entries;
    const others = content.decks.filter((d) => !d.caseStudy && !d.parent && d.id !== answer.id).map((d) => ({ label: d.question, deck: d, kicker: "Other work" }));
    return [...entries, ...others, back];
  }, [content, answer, isHome, caseTitle, allDecks, rootOf]);

  const crumbs = useMemo(() => {
    if (!answer || isHome) return null;
    if (answer.page === "about") return { case: "About", q: null };
    const root = answer.parent ? rootOf(answer) : null;
    return { case: answer.caseStudy ? caseTitle(answer.caseStudy) : root ? root.question : null, q: answer.question, onCase: root ? () => openDeck(root, { silent: true }) : null };
  }, [answer, isHome, caseTitle, rootOf, openDeck]);

  const onAsk = useCallback(async (q) => {
    if (!content) return;
    setChatOpen(true);
    const norm = (t) => (t || "").trim().toLowerCase();
    if (norm(answers.current.get(currentId.current)?.question) === norm(q)) return; // already showing it
    if (norm(lastQ.current) === norm(q)) { const prev = [...answers.current.values()].find((a) => norm(a.question) === norm(q)); if (prev) go(prev); return; }
    if (!claim(norm(q))) return;
    lastQ.current = q;
    setBusy(true);
    setMessages((m) => [...withoutTurn(m, q), { role: "user", text: q }]);
    try {
      const { answer: a, how } = await ask(q, content);
      if (a) {
        turned.current.add(a.id);
        go(a);
        // The tag is the case study; the match kind/score is debug-only (data-match).
        setMessages((m) => [...m, { role: "bot", text: a.thesis, how: a.caseStudy ? caseName(a.caseStudy) : "other work", match: how }]);
      }
    } finally {
      setBusy(false);
    }
  }, [content, go]);

  // Expand / collapse one media fill. Expanding pushes a history entry, so
  // Back closes it; Escape and the close button go back through history too.
  const returnFocus = useRef(null);
  const onExpand = useCallback((id) => {
    if (!answer) return;
    if (focus === id) { window.history.back(); return; }
    returnFocus.current = id;
    setExpanded([]);
    if (focus || window.history.state?.proof) window.history.replaceState({ id: answer.id, focus: id }, "");
    else window.history.pushState({ id: answer.id, focus: id }, "");
    setFocus(id);
  }, [answer, focus]);
  // Prev / next step of a process sequence while a step is expanded (←/→ too).
  const onStep = useCallback((dir) => {
    if (!answer || !focus) return;
    const seq = answer.fills.filter((f) => f.kind === "media" && f.step).sort((a, b) => a.step.n - b.step.n);
    const i = seq.findIndex((f) => f.id === focus);
    const next = seq[i + dir];
    if (!next) return;
    window.history.replaceState({ id: answer.id, focus: next.id }, "");
    setFocus(next.id);
  }, [answer, focus]);
  useEffect(() => {
    if (!focus) return;
    const onKey = (e) => { if (e.key === "ArrowLeft") onStep(-1); if (e.key === "ArrowRight") onStep(1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, onStep]);
  const onCollapse = useCallback(() => {
    if (window.history.state?.focus) window.history.back();
    else setFocus(null);
  }, []);
  useEffect(() => {
    if (!focus) {
      const id = returnFocus.current;
      returnFocus.current = null;
      if (id) requestAnimationFrame(() => document.querySelector(`[data-fill="${CSS.escape(id)}"] .c-media`)?.focus({ preventScroll: true }));
      return;
    }
    returnFocus.current = focus;
    const onKey = (e) => { if (e.key === "Escape") onCollapse(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, onCollapse]);

  const onChip = useCallback((c) => {
    if (c.home) goHome();
    else if (c.deck) openDeck(c.deck, { silent: !!c.back }); // going back is navigation, not a new question
    else onAsk(c.q);
  }, [goHome, openDeck, onAsk]);

  // The agent's face is livelier while it answers and while the stage re-cuts.
  const [morphing, setMorphing] = useState(false);
  useEffect(() => {
    if (!stageAnswer) return;
    setMorphing(true);
    const t = setTimeout(() => setMorphing(false), 1300);
    return () => clearTimeout(t);
  }, [stageAnswer]);

  /**
   * One open thing at a time. Opening a Proof list (or breakdown / commit
   * cards inside it) puts the page in focus mode and closes anything else
   * open, including an expanded media; Hide / Escape / Back / a click on the
   * receded page closes it. Each open is a history entry.
   */
  const onToggleReceipts = useCallback((id) => {
    if (expanded.includes(id)) {
      if (window.history.state?.proof === id) window.history.back(); else setExpanded([]);
      return;
    }
    const st = { id: answer?.id, proof: id };
    if (window.history.state?.proof || window.history.state?.focus) window.history.replaceState(st, "");
    else window.history.pushState(st, "");
    setFocus(null);
    setExpanded([id]);
  }, [expanded, answer]);
  const closeFocusMode = useCallback(() => {
    if (window.history.state?.proof || window.history.state?.focus) window.history.back();
    else { setExpanded([]); setFocus(null); }
  }, []);
  useEffect(() => {
    if (!expanded.length) return;
    const onKey = (e) => { if (e.key === "Escape") closeFocusMode(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, closeFocusMode]);
  const onMore = useCallback((ids) => setPromote(ids), []);

  // A new answer starts at the top of the stack on phones.
  useEffect(() => { if (phone) document.querySelector(".app")?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }, [answer, phone, reduced]);

  // Test/screenshot hooks.
  useLayoutEffect(() => {
    window.__stage = {
      ask: onAsk,
      show: (a) => { setChatOpen(true); go(a); },
      drill: (id) => onDrill(id),
      home: goHome,
      openCase: onOpenCase,
      expand: onExpand,
      hover: (cs) => setHot(cs),
      replayIntro: () => { try { sessionStorage.removeItem("stage-intro-seen"); } catch {} window.location.reload(); },
      collapse: onCollapse,
      openChat: setChatOpen,
      toggle: onToggleReceipts,
      content,
    };
  }, [onAsk, content, onToggleReceipts, go, goHome, onOpenCase, onExpand, onCollapse, onDrill]);

  if (!layout) return <div className="boot label">loading</div>;

  const nav = <Navbar onHome={goHome} onAbout={goAbout} crumbs={crumbs} isHome={isHome} isAbout={isAbout} />;
  return (
    <>
    {!phone && <div className={`app-nav ${introPending && (isHome || isAbout) ? "intro" : ""}`}>{nav}</div>}
    <div className={`app ${phone ? "phone" : "desk"} ${introPending && (isHome || isAbout) ? "intro" : ""}`} style={phone ? undefined : { left: FRAME, right: FRAME, bottom: FRAME, top: FRAME + NAV_H - 1 }}>
      {phone && <div className="app-nav">{nav}</div>}
      <main className="stage-wrap" style={phone ? undefined : { width: rect.w }}>
        <div className={tall > 1 ? "stage-scroll" : "stage-plain"}>
        <Stage
          layout={layout} fillMap={fillMap} expanded={new Set(expanded)}
          onToggleReceipts={onToggleReceipts} onMore={onMore} reduced={reduced} measure={measure}
          height={phone || tall > 1 ? layout.rect.h : undefined}
          reserve={null}
          onOpenCase={isHome ? (cs) => onTile(cs, "activate") : undefined}
          onTile={isHome ? onTile : undefined} hot={hot} quick={isHome && !focus}
          preview={isHome && hot ? previews[hot] : null} previewKey={hot}
          onAskOpen={!chatOpen && !phone ? () => setChatOpen(true) : null} faceBusy={morphing}
          intro={introPending && (isHome || isAbout)} onIntroDone={onIntroDone}
          onExpand={isHome ? undefined : onExpand} onCollapse={onCollapse} focusId={focus}
          openId={expanded[0] || focus || null} onCloseFocus={closeFocusMode} onStep={onStep} onCaseLink={onOpenCase} onDrill={onDrill}
        />
        </div>
        <div className="gutter-left">
          {backTarget && (
            <button type="button" className="back-case" onClick={() => openDeck(backTarget, { silent: true })}>← {backLabel}</button>
          )}
          {layout.dropped?.length > 0 && (
            <button type="button" className="more-tag" onClick={() => onMore(layout.dropped)}>
              +{layout.dropped.length} more, not shown
            </button>
          )}
        </div>
        {!chatOpen && !phone && !isHome && (
          <button type="button" className="ask-btn gutter label" onClick={() => setChatOpen(true)}>
            <Face size={36} busy={morphing} reduced={reduced} /> Ask Kip <span aria-hidden>→</span>
          </button>
        )}
      </main>
      <div className="chat-wrap" style={phone ? undefined : { width: chatW }}>
        <Chat
          open={phone || chatOpen} phone={phone} messages={messages} chips={chips} onAsk={onAsk} onChip={onChip} busy={busy}
          onClose={() => setChatOpen(false)} busyFace={busy || morphing} reduced={reduced}
          onReopen={(q) => { const a = [...answers.current.values()].find((x) => x.question === q); if (a) go(a); }}
        />
      </div>
    </div>
    </>
  );
}
