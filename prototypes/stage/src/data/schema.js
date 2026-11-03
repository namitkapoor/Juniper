/**
 * The contract between the CONTENT (src/data/*.json, built from real sources)
 * and the STAGE (layout engine + renderer). Neither side knows about the other
 * beyond this file.
 *
 * An answer is a thesis plus a set of fills. The model (later) or the local
 * answerer (now) decides WHAT goes in and how much each piece matters
 * (`weight`); the layout engine alone decides WHERE it goes. Fills carry the
 * intrinsic needs the engine sizes cells from: media its aspect ratio, prose
 * its text (measured with Pretext), KPIs a compact footprint.
 *
 * Grounding: every fill that makes a claim carries `receipts`. Nothing on the
 * stage is allowed to state a number or fact that is not in a receipt's source.
 *
 * @typedef {{
 *   type: "commit" | "asset" | "record",
 *   ref: string,          // sha / asset path / evidence record id
 *   repo?: string,        // for commits: "kyuri-dashboard", "Juniper", ...
 *   url?: string,         // public link when one exists (GitHub commit, live page)
 *   date?: string,        // ISO date
 *   label?: string,       // short human label ("a572b5e · Seat the train on the rails")
 *   preview?: { src: string, poster?: string, aspect: number,   // a playable demo shown IN the Proof list:
 *               frame: "phone" | "laptop" | "none" }        // gif/mp4 under public/, already framed or framed at render
 * }} Receipt
 *
 * @typedef {(
 *   { kind: "title",   id: string, weight: number, text: string, kicker?: string } |
 *   { kind: "kpi",     id: string, weight: number, value: string, unit?: string, label: string,
 *                      baseline?: string, period?: string, receipts: Receipt[],
 *                      breakdown?: { label: string, value: string, share?: number,   // 0..1 of the total
 *                                    logo?: string }[] } |                          // the split behind
 *                                              // the number (e.g. sessions per merchant); every value
 *                                              // must be in a receipt's source, never derived to fit
 *   { kind: "logos",   id: string, weight: number, label?: string,                  // e.g. "LIVE ON"
 *                      items: { name: string, src: string, aspect: number, url?: string,
 *                              invert?: boolean }[],   // true: dark logo, render light on the stage
 *                      receipts?: Receipt[] } |
 *   { kind: "prose",   id: string, weight: number, text: string, receipts?: Receipt[],
 *                      evidence?: string[] } |   // ids of kpi/media fills in this answer that back this text;
 *                                                // the only fills the engine may inset into it
 *   { kind: "quote",   id: string, weight: number, text: string, who: string, receipts?: Receipt[] } |
 *   { kind: "media",   id: string, weight: number, media: "image" | "video" | "animation",
 *                      src: string, poster?: string, aspect: number, alt: string, caption?: string,
 *                      explain?: string,       // shown when the media is EXPANDED (clicked):
 *                                              // 1-3 sentences on what it demonstrates
 *                      kpi?: string | { value: string, unit?: string, label: string,
 *                                       period?: string, receipts: Receipt[] },
 *                                              // the number this asset proves: a kpi fill id
 *                                              // in the same answer, or an inline kpi
 *                      step?: { n: number, of: number, stage: string,      // where this asset sits in a
 *                               status: "explored" | "tested" | "cut" | "shipped" },  // sequential process,
 *                                              // e.g. { n: 1, of: 4, stage: "First concept", status: "cut" }
 *                      receipts?: Receipt[] } |
 *   { kind: "rules",   id: string, weight: number,          // icon + short-label items: rules, a flow,
 *                      label: string,                         // before -> after pairs ("THE ORDER")
 *                      tag?: string,                          // provenance, shown as a small chip:
 *                                                             // "Requirement" | "Design" | "Plan, not results" ...
 *                      mode?: "list" | "flow" | "pairs",      // list (default): a grid the engine sizes;
 *                                                             // flow: steps joined by arrows; pairs: from -> text
 *                      dense?: boolean,                       // list only: items as wrapped chips
 *                      items: { icon: string,                 // Lucide id ("lucide:tag"), decorative
 *                               text: string,                 // 2-5 words; carries the meaning
 *                               note?: string,                // a short qualifier under the text
 *                               lock?: boolean,               // flow: this step is gated (note says on what)
 *                               from?: string,                // pairs: the "before" side
 *                               group?: string }[],           // list: consecutive items under one heading
 *                      exit?: { icon: string, text: string, note?: string },  // flow: a branch off the steps
 *                      chips?: { label?: string, items: { icon?: string, text: string }[] },  // a footnote row
 *                      receipts: Receipt[] } |
 *   { kind: "commits", id: string, weight: number, repo: string,
 *                      items: { sha: string, date: string, msg: string, url?: string }[] } |
 *   { kind: "specimen", id: string, weight: number,          // a design system drawn as a live,
 *                      sample: string,                        // measured close-up (src/stage/specimen/)
 *                      font: "display" | "body" | string,     // default face; "display"/"body" = the
 *                                                             // stage's own, any other string = a CSS family
 *                      scale: { role: string, size: number,   // px
 *                               lineHeight: number,           // px (not a ratio)
 *                               tracking: number,             // em, e.g. 0.12 or -0.02
 *                               weight: number,
 *                               font?: string,                // per-step face override
 *                               upper?: boolean }[],          // set the sample in caps for this step
 *                      spacing?: { name: string, value: number }[],  // px; spacing[i] is drawn as the
 *                                                             // gap below step i (the last one repeats)
 *                      mode?: "scale" | "fit",                // scale: the close-up steps through the ladder;
 *                                                             // fit: a cell shrinks and the line steps DOWN to
 *                                                             // the largest step that fits (the engine's rule)
 *                      direction?: "up" | "down",             // play order (sorted by size); omitted = data order.
 *                                                             // fit always plays largest first
 *                      fit?: { pad: number,                   // cell padding, px (PAD.desktop 24)
 *                              floor?: number },              // steps under this size are marked (phone floor 16)
 *                      title?: string,                        // accessible name
 *                      receipts?: Receipt[] }                 // where the values were read from
 * )} Fill
 *
 * Any fill may carry `opens?: string`: the id of a child deck (same case study, `parent` set)
 * that this tile drills into when clicked: "HOW: the cart" opens the cart deck, and so on.
 * It may also name another top-level deck of the same case study (the ARCHITECTURE tile on a
 * case study's first deck opens its build deck).
 * `opensPrimary?: boolean`: when several tiles in one deck open the same target, exactly one
 * carries `opensPrimary: true`; the engine shows the "go deeper" affordance only on that tile.
 *
 * `weight` 0..1: how central this piece is to THIS answer. The engine gives
 * heavier fills bigger cells and earlier positions; it may drop the lightest
 * fills (and say so) when the stage is full.
 * `aspect` = width / height of the media's natural size.
 * `src` / `poster` are paths under public/ (e.g. "assets/chekout/hero.webp").
 *
 * @typedef {{
 *   id: string,
 *   question: string,
 *   aliases?: string[],    // earlier phrasings of `question` (typed or bookmarked) that must still
 *                          // open this deck; unique across all decks' questions and aliases
 *   thesis: string,        // one sentence, the argument this deck makes
 *   caseStudy?: string,    // id of the case study a starter deck belongs to
 *   parent?: string,       // id of the deck this one drills down from (a "stage of the build" deck);
 *                          // back goes to the parent, then to the case study's main deck
 *   fills: Fill[]
 * }} Answer
 *
 * Files the content side produces (src/data/):
 *   case-studies.json  [{ id, title, kicker, summary, why,           exactly 3
 *                        hook,          // the problem in as few words as possible (home tile)
 *                        metric?,       // { value, label }: shown on home only if there's room
 *                        priority,      // 0..1: how hard home pushes this one (type size, cell size, order)
 *                        hookShort, kickerShort }]  // used when the full hook/kicker won't fit (phone, narrow cells)
 *   decks.json         Answer[]   starter decks: 2-3 per case study + 2-3 "any other work"
 *   corpus.json        [{ id, title, tags: string[], text, fills: Fill[], receipts: Receipt[] }]
 *                      retrievable units for free-typed questions (one per evidence record /
 *                      case-study section / notable project), each with ready-made fills
 *   home.json          Answer   the stage before any question (name, currently, the 3 case studies)
 *   about.json         {
 *                        bio: Fill[],                    // title + prose (+ quote/media), first person
 *                        timeline: { start: string, end: string | "Present", title: string, org: string,
 *                                    kind: "work" | "education" | "founding" | "project",
 *                                    summary: string,     // one line: what I did there, concrete
 *                                    caseStudy?: string,  // id in case-studies.json when one exists
 *                                    receipts?: Receipt[] }[],   // newest first
 *                        stack: { group: string,          // e.g. "Build", "AI", "Design", "Data"
 *                                 items: { name: string, icon?: string,   // path under public/assets/about/,
 *                                                                         // or an Iconify id ("simple-icons:fastapi")
 *                                          evidence?: string,             // where I used it (one line)
 *                                          jobs?: string[] }[] }[],       // e.g. ["ChekOut AI"]
 *                        portrait: { src: string, alt: string }           // the image the particle portrait samples
 *                      }
 */
export const FILL_KINDS = ["title", "kpi", "prose", "quote", "media", "commits", "logos", "specimen", "rules"];
