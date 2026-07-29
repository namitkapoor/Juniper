import React, { useState } from 'react';

// Dev-only contact sheet for reviewing case-study assets before they get wired
// into a page. Route is registered only when import.meta.env.DEV — this never
// ships. Add a group here when a new asset folder lands in /public.

const VIDEO_BASE = '/videos/Case Studies/CK';
const IMAGE_BASE = '/images/Case Studies/CK';

const VIDEO_GROUPS = [
  {
    id: 'current',
    title: 'current/ — redesigned chat + rec panel',
    note: 'Pairs with before/ as the before-after slider.',
    clips: [
      { file: 'current/app-experience-1', label: 'Rec panel + chat, desktop', meta: '17s · 1280×770 · 592K' },
      { file: 'current/app-experience-3', label: 'Same, mobile', meta: '31s · 618×1080 · 1.0M' },
      { file: 'current/maria-on-phone', label: 'Hero clip', meta: '12s · 1280×720 · 828K' },
    ],
  },
  {
    id: 'before',
    title: 'before/ — Jan 2026 chat panel',
    note: 'The only true "before" that exists. 1144×720, off the 1280 grid.',
    clips: [
      { file: 'before/rec-panel-before', label: 'Jan 2026 chat panel', meta: '10s · 1144×720 · 480K' },
    ],
  },
  {
    id: 'dashboard',
    title: 'dashboard/ — analytics walkthrough (newest)',
    note: 'Trim the first ~12s: date-range pick + load skeletons. Insight tooltip and keyword-click beats are in the back half.',
    clips: [
      { file: 'dashboard/analytics-dashboard-flow', label: 'Full narrated dashboard flow', meta: '47s · 1280×800 · 448K' },
    ],
  },
  {
    id: 'cases',
    title: 'cases/ — shopper scenarios',
    clips: [
      { file: 'cases/question', label: 'Product question', meta: '11s · 1280×720 · 996K' },
      { file: 'cases/product', label: "A product you don't sell yet", meta: '14s · 1280×720 · 2.4M' },
      { file: 'cases/bundle', label: 'Bundle recommendation', meta: '14s · 1280×720 · 1.0M' },
    ],
  },
  {
    id: 'motion',
    title: 'motion/ — persona spots, raw vs composited',
    note: 'maria-with-ui is the cover candidate for the ChekOut card.',
    clips: [
      { file: 'motion/maria-raw', label: 'Maria — raw', meta: '12s · 1280×720 · 700K' },
      { file: 'motion/maria-with-ui', label: 'Maria — with UI', meta: '14s · 1280×720 · 2.0M', flag: 'cover candidate' },
      { file: 'motion/old-man-raw', label: 'Old man — raw', meta: '24s · 1280×720 · 1.3M' },
      { file: 'motion/old-man-with-ui', label: 'Old man — with UI', meta: '11s · 1280×720 · 976K' },
      { file: 'motion/young-mother-raw', label: 'Young mother — raw', meta: '16s · 1280×720 · 668K' },
      { file: 'motion/young-mother-with-ui', label: 'Young mother — with UI', meta: '14s · 1280×720 · 1.1M' },
    ],
  },
  {
    id: 'builder',
    title: 'builder/ — STALE, use as "before" only',
    note: 'agent-builder-full is 2:58 and predates the prompt generator. Never opens the Analytics tab.',
    clips: [
      { file: 'builder/agent-builder-full', label: 'Old wizard walkthrough', meta: '177s · 1280×720 · 2.0M', flag: 'needs trim' },
      { file: 'builder/embedding-agents', label: 'Embed flow', meta: '23s · 1280×694 · 964K' },
    ],
  },
];

const IMAGE_GROUPS = [
  {
    id: 'clients',
    title: 'clients/ — 13 merchants running the product',
    note: 'Strongest shipping evidence on the site. No other case study has a live link.',
    files: ['apto', 'audab', 'billest', 'blackcat', 'bykind', 'christinevalmy', 'kivakube', 'maebridal', 'nelly', 'nuele', 'nuthatch', 'pacsoul', 'timeless'].map(
      (n) => ({ src: `clients/${n}.jpg`, label: n })
    ),
    small: true,
  },
  {
    id: 'chat',
    title: 'chat/ — stills',
    files: [
      { src: 'chat/chat-current.png', label: 'Current chat' },
      { src: 'chat/rec-panel-current.png', label: 'Current rec panel' },
    ],
  },
  {
    id: 'products',
    title: 'products/ — Nuele cards used in the rec panel demos',
    files: [
      { src: 'products/bond-repair.jpg', label: 'Bond repair' },
      { src: 'products/curl-revival-bundle.jpg', label: 'Curl revival bundle' },
      { src: 'products/the-daily-glow-set.jpg', label: 'Daily glow set' },
      { src: 'products/the-full-system.jpg', label: 'The full system' },
    ],
    small: true,
  },
  {
    id: 'builder-stills',
    title: 'builder/ + dashboard/ — stills',
    files: [
      { src: 'builder/platform-connection.jpg', label: 'Platform connection step' },
      { src: 'builder/shopify-app-thumbnail.jpg', label: 'Shopify listing thumbnail' },
      { src: 'dashboard/dashboard-mockup-tradeschool.png', label: 'Dashboard mockup (superseded by the video)' },
    ],
  },
];

const GAPS = [
  ['ChekOut', 'Prompt generator flow', 'No capture. Last missing ChekOut surface — canary target + `kiva` merchant.'],
  ['ChekOut', 'Case study page', 'No route, no data file, no Home card. All 46MB below is currently unreferenced.'],
  ['Kyuri.OS', 'Everything', 'Zero assets, zero references in src/. Dashboard is password-gated, so the recording has to be you.'],
  ['Studio', 'Cover recording', 'Live site, no writeup, no 3D-shelf clip.'],
];

const shell = { background: '#111', color: '#e6e6e6', minHeight: '100vh', padding: '2rem clamp(1rem, 4vw, 3rem)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.6 };
const grid = (small) => ({ display: 'grid', gridTemplateColumns: small ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' });
const card = { background: '#1b1b1b', border: '1px solid #2e2e2e', borderRadius: 6, overflow: 'hidden' };
const caption = { padding: '0.5rem 0.65rem', borderTop: '1px solid #2e2e2e' };
const dim = { color: '#8a8a8a', fontSize: 11 };
const flagStyle = { display: 'inline-block', marginLeft: 6, padding: '0 5px', borderRadius: 3, background: '#4a3300', color: '#ffcc66', fontSize: 10 };

function Section({ title, note, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: 14, margin: '0 0 0.25rem', color: '#fff' }}>{title}</h2>
      {note && <p style={{ ...dim, margin: '0 0 0.9rem', maxWidth: '70ch' }}>{note}</p>}
      {children}
    </section>
  );
}

export default function AssetReview() {
  const [posterOnly, setPosterOnly] = useState(true);

  return (
    <div style={shell}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #2e2e2e', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: 16, margin: 0, color: '#fff' }}>Case-study asset review — dev only</h1>
        <p style={{ ...dim, margin: '0.4rem 0 0.9rem' }}>
          Everything under <code>public/…/CK/</code>. 16 video sets (mp4 + webm + poster, all complete) and 22 stills.
          None of it is referenced by any page yet.
        </p>
        <label style={{ cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={posterOnly} onChange={(e) => setPosterOnly(e.target.checked)} style={{ marginRight: 6 }} />
          posters only (uncheck to load all {VIDEO_GROUPS.reduce((n, g) => n + g.clips.length, 0)} videos)
        </label>
      </header>

      <Section title="Gaps — what is not ready" note="Assets that exist are healthy. These are the holes.">
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 900 }}>
          <tbody>
            {GAPS.map(([proj, item, why]) => (
              <tr key={proj + item} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '0.4rem 0.8rem 0.4rem 0', color: '#ffcc66', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{proj}</td>
                <td style={{ padding: '0.4rem 0.8rem 0.4rem 0', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{item}</td>
                <td style={{ ...dim, padding: '0.4rem 0' }}>{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {VIDEO_GROUPS.map((g) => (
        <Section key={g.id} title={g.title} note={g.note}>
          <div style={grid(false)}>
            {g.clips.map((c) => (
              <figure key={c.file} style={{ ...card, margin: 0 }}>
                {posterOnly ? (
                  <img src={`${VIDEO_BASE}/${c.file}-poster.jpg`} alt={c.label} style={{ width: '100%', display: 'block', background: '#000' }} />
                ) : (
                  <video
                    controls
                    preload="metadata"
                    muted
                    playsInline
                    poster={`${VIDEO_BASE}/${c.file}-poster.jpg`}
                    style={{ width: '100%', display: 'block', background: '#000' }}
                  >
                    <source src={`${VIDEO_BASE}/${c.file}.webm`} type="video/webm" />
                    <source src={`${VIDEO_BASE}/${c.file}.mp4`} type="video/mp4" />
                  </video>
                )}
                <figcaption style={caption}>
                  <div>
                    {c.label}
                    {c.flag && <span style={flagStyle}>{c.flag}</span>}
                  </div>
                  <div style={dim}>{c.meta}</div>
                  <div style={dim}>{c.file}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ))}

      {IMAGE_GROUPS.map((g) => (
        <Section key={g.id} title={g.title} note={g.note}>
          <div style={grid(g.small)}>
            {g.files.map((f) => (
              <figure key={f.src} style={{ ...card, margin: 0 }}>
                <img src={`${IMAGE_BASE}/${f.src}`} alt={f.label} loading="lazy" style={{ width: '100%', display: 'block', background: '#fff' }} />
                <figcaption style={caption}>
                  <div>{f.label}</div>
                  <div style={dim}>{f.src}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
