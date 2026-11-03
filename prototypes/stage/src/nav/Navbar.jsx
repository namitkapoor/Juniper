/**
 * Port of Juniper's src/components/layout/Navbar.jsx (read-only reference):
 * the blinking glasses logo, the ↘ studio / about / resume links with the
 * vertical text-mask hover, the theme toggle, and a hamburger under 480px.
 * Differences, on purpose:
 *  - the logo is the stage's one way home (it morphs back to the index);
 *  - the breadcrumb (case study / question) sits in the bar, next to it;
 *  - about opens the prototype's own About stage; studio/resume point at the live site;
 *  - framer-motion is swapped for CSS keyframes (same blink/glance timing);
 *  - the theme toggle switches light / dark (default: the OS preference; remembered).
 */
import { A11yButton } from "./A11yPanel.jsx";
import { useEffect, useRef, useState } from "react";
import { Glyph } from "../about/Glyph.jsx";

const SITE = "https://www.namit.me";
const LINKS = [
  { label: "studio", href: "https://studio.namit.me", sameTab: true }, // a sibling site: same tab, like a page of this one
  { label: "about", href: "?page=about", internal: true },
  { label: "resume", href: "/files/KapoorNamit_Resume.pdf" },
];

function useBlink() {
  const [blink, setBlink] = useState(false);
  const [glance, setGlance] = useState(false);
  useEffect(() => {
    // Reduced motion: the glasses stay still.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let t1, t2, t3, t4;
    const blinkLoop = () => { t1 = setTimeout(() => { setBlink(true); t2 = setTimeout(() => { setBlink(false); blinkLoop(); }, 200); }, Math.random() * 4000 + 2000); };
    const glanceLoop = () => { t3 = setTimeout(() => { setGlance(true); t4 = setTimeout(() => { setGlance(false); glanceLoop(); }, 2000); }, Math.random() * 5000 + 3000); };
    blinkLoop(); glanceLoop();
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);
  return { blink, glance };
}

function Glasses() {
  const { blink, glance } = useBlink();
  const eye = `nav-eye ${blink ? "blink" : ""} ${glance ? "glance" : ""}`;
  return (
    <svg width="60" height="30" viewBox="0 0 120 50" fill="none" aria-hidden="true">
      <path d="M20 25C20 16.7157 26.7157 10 35 10C43.2843 10 50 16.7157 50 25C50 33.2843 43.2843 40 35 40C26.7157 40 20 33.2843 20 25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M70 25C70 16.7157 76.7157 10 85 10C93.2843 10 100 16.7157 100 25C100 33.2843 93.2843 40 85 40C76.7157 40 70 33.2843 70 25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 25C50 25 55 25 60 25C65 25 70 25 70 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 25C15 25 10 23 5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 25C105 25 110 23 115 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse className={eye} cx="35" cy="25" rx="4" ry="6" fill="currentColor" />
      <ellipse className={eye} cx="85" cy="25" rx="4" ry="6" fill="currentColor" />
    </svg>
  );
}

/**
 * Off home, the glasses mark turns into "← Back" text in the same spot (one
 * step home from any depth). The swap is a quick stepped pixel transition; if
 * public/lottie/logo-to-back.json exists it is used instead (played forward to
 * go to "back", in reverse to return to the glasses).
 */
let lottieSwap; // undefined: unknown, null: absent, else [data, lottie]
function useLottieSwap() {
  const [res, setRes] = useState(lottieSwap);
  useEffect(() => {
    if (lottieSwap !== undefined) return;
    fetch("/lottie/logo-to-back.json").then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : null)).catch(() => null)
      .then(async (data) => {
        lottieSwap = data ? [data, (await import("lottie-web/build/player/lottie_light.js")).default] : null;
        setRes(lottieSwap);
      });
  }, []);
  return res;
}
function LottieSwap({ res, back }) {
  const box = useRef(null);
  const anim = useRef(null);
  useEffect(() => {
    const [data, lottie] = res;
    anim.current = lottie.loadAnimation({ container: box.current, renderer: "svg", loop: false, autoplay: false, animationData: data });
    anim.current.goToAndStop(back ? anim.current.totalFrames - 1 : 0, true);
    return () => anim.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);
  useEffect(() => { if (anim.current) { anim.current.setDirection(back ? 1 : -1); anim.current.play(); } }, [back]);
  return <span ref={box} className="logo-lottie" aria-hidden />;
}

export function Navbar({ onHome, onAbout, crumbs, isHome, isAbout, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const burger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const on = (e) => { if (e.key === "Escape") { setOpen(false); burger.current?.focus(); } };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open]);
  const swap = useLottieSwap();
  const back = !isHome;
  const backText = isAbout ? "Home" : "All work";
  return (
    <nav className="navigation" aria-label="Site">
      <div className="nav-items">
        <div className="logo-container">
          <a
            className={`logo-placeholder ${back ? "is-back" : ""}`} href="/" aria-label={isHome ? "namit, home" : `Back: ${backText}`}
            onClick={(e) => { e.preventDefault(); onHome(); }}
          >
            {swap ? <LottieSwap res={swap} back={back} /> : (
              <span className="logo-swap" key={back ? "back" : "glasses"}>
                {back ? <span className="logo-back">← {backText}</span> : <Glasses />}
              </span>
            )}
          </a>
          {crumbs && (
            <div className="nav-crumbs" aria-label="You are here">
              {crumbs.onCase
                ? <button type="button" className="crumb-case" onClick={crumbs.onCase}>{crumbs.case}</button>
                : <span className="crumb-case">{crumbs.case || "Other work"}</span>}
              {crumbs.q && <><span aria-hidden>/</span><span className="crumb-q" aria-current="page">{crumbs.q}</span></>}
            </div>
          )}
        </div>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a
              key={l.label} className={`nav-item-nk26 ${l.internal && isAbout ? "active" : ""}`} href={l.href}
              {...(l.internal ? { onClick: (e) => { e.preventDefault(); onAbout(); }, "aria-current": isAbout ? "page" : undefined } : l.sameTab ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <span className="nav-arrow-nk26" aria-hidden="true">↘</span>
              <span className="nav-text-wrapper-nk26">
                <span className="nav-text-nk26">{l.label}</span>
                <span className="nav-text-nk26 nav-text-clone-nk26" aria-hidden="true">{l.label}</span>
              </span>
              {!l.internal && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          ))}
          <A11yButton />
          <button className="theme-toggle-nav" type="button" onClick={onToggleTheme} aria-pressed={theme === "light"}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <Glyph name={theme === "light" ? "lucide:moon" : "lucide:sun"} size={18} />
          </button>
        </div>
        <span className="a11y-phone"><A11yButton /></span>
        <button ref={burger} className="hamburger-menu" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <span className={`hamburger-line ${open ? "l1" : ""}`} />
          <span className={`hamburger-line ${open ? "l2" : ""}`} />
          <span className={`hamburger-line ${open ? "l3" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="mobile-nav-menu">
          <div className="mobile-nav-links">
            {LINKS.map((l) => (
              <a key={l.label} className="mobile-nav-item" href={l.href}
                {...(l.internal || l.sameTab ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                onClick={(e) => { setOpen(false); if (l.internal) { e.preventDefault(); onAbout(); } }}>{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
