# tools/demo: Playwright screenshots to framed demo GIF + MP4

Turns a contact sheet or a folder of Playwright screenshots into a looping demo,
framed in a hairline iPhone or laptop outline on the stage's #141414 ground:

- `NAME.mp4`: the master. H.264 High, yuv420p, CRF 20, `+faststart`, 30fps, 2x pixels.
- `NAME.gif`: what the Proof list plays. Exact encoder (see below), 1.5x for a phone and 1.25x for a laptop, crossfades at 10fps.
- `NAME.webp` / `NAME.avif` / `NAME.png`: the poster, a still of the key state. The stage shows the webp until hover.
- `NAME.json`: sizes, fps, durations and holds, plus the numbers `Receipt.preview` needs.
- `NAME-light.*`: the same set on the light stage ground (see Themes).

Needs Python 3 with Pillow and numpy, plus ffmpeg (`/opt/homebrew/bin/ffmpeg`).
gifski is optional and only used if you ask for it.

## Run it

```sh
# a contact sheet: gutters are detected (uniform rows/columns that run the whole sheet)
python3 tools/demo/build.py --sheet path/to/rosendahl-mobile-sheet.png --device phone \
  --name rosendahl-mobile --out public/assets/chekout/demos --key 3,7

# a folder of screenshots, natural-sorted (01-, 02-, ... 10-), or an explicit list in order
python3 tools/demo/build.py --frames e2e/screenshots/phone --device phone --name flow --out /tmp/flow
python3 tools/demo/build.py --frames a.png b.png c.png --device laptop --name flow --out /tmp/flow

# a manifest: per-frame crop / fit / hold, for shots that weren't captured at one crop
python3 tools/demo/build.py --manifest tools/demo/manifests/generator-390.json --out public/assets/chekout/demos

# rebuild everything here, then attach the previews to decks.json and validate
for m in tools/demo/manifests/*.json; do python3 tools/demo/build.py --manifest "$m" --out public/assets/chekout/demos; done
node tools/demo/attach.mjs && node src/data/validate.mjs
```

Useful flags:

- `--select 0,2,3,5` keeps those frames, in that order.
- `--hold 1.5` sets the seconds per state. `--holds 1.4,1.6,...` sets each state, and `--key 3,7` holds those states 1.6x longer.
- `--fade 0.25` sets the crossfade. The last state fades back into the first, so the loop doesn't jump.
- `--style outline|filled`: outline is the default. Filled uses a near-black bezel.
- `--themes dark,light` (default both) renders `NAME.*` and `NAME-light.*`. `--bg/--stroke` and `--light-bg/--light-stroke` (`#rrggbb`) override the ground and hairline once the stage's light tokens exist.
- `--screen-css 310` sets the screen width in CSS px (phone 310, laptop 600). The device adds about 17% (phone) or 22% (laptop).
- `--scale 2` sets the MP4/poster density. `--gif-scale` and `--gif-fps` size the GIF.
- `--poster N` picks the poster state. The default is the longest hold.
- `DEMO_KEEP=1` keeps the work directory, with the framed state PNGs `m-XX.png` / `g-XX.png`.

Debug the steps on their own:

```sh
python3 tools/demo/frames.py SHEET.png --out /tmp/cells     # writes 01.png..NN.png, prints the grid it found
python3 tools/demo/frame_device.py shot.png --device phone --width 620 --out framed.png --svg phone.svg
```

## Manifest

```json
{
  "name": "generator-mobile", "device": "phone",
  "base": "/abs/or/relative/dir/of/the/pngs",
  "sheet": "optional-contact-sheet.png",
  "frames": [
    { "src": "390-light-1-default.png", "crop": [0, 160, 390, 860], "hold": 1.6, "label": "default" },
    { "src": "390-light-6-suggestion.png", "crop": [-19, -1, 390, 860], "fill": [221, 221, 221], "hold": 2.0 },
    { "index": 3, "hold": 2.4 }
  ],
  "poster": 2
}
```

- `crop` is `[x, y, w, h]` in source pixels. It may run outside the image, and the overflow is filled with `fill` (default: the image's edge color). Use it to line up shots taken at different crops: pick a fixed element, such as an input box, and offset each crop so that element lands in the same place in every frame.
- `index` picks a cell from `sheet` (0-based, reading order).
- `row: ["a.png", {"src": "b.png", "crop": [x, y, w, h]}]` lays element captures (dashboard cards) side by side on `fill`, at native scale (`gap` defaults to 24).
- `overlay: [{"src": "busy.png", "match": "idle.png"}]` pastes an element capture back where it was taken. `match` finds the exact spot of the idle twin in the frame by pixel match; `at: [x, y]` sets it directly. The builder's "Analyzing your catalog" state is made this way: its 780x67 capture replaces the identical-size idle control at (380,323).
- `anchor: [0.5, 0.5]` places a frame with `fit: "none"` (native scale, centred) instead of top-centre.
- `fit` (`cover` | `contain` | `none`) controls how a frame of a different size is fitted to the common size.
- Any CLI option can also go at the top level (`hold`, `fade`, `key`, `gif_scale`, `screen_css`, `style`, `status_bar: "none"`).

The base paths in `manifests/` are absolute: the round-4 recordings live in the main Juniper checkout (`design-plans/hm-audit/rebuild/round4`), not in this worktree.

## How it works, and the choices behind it

- **Slicing** (`frames.py`). A column is a gutter if all its pixels match within ±6 levels across the whole sheet height (rows likewise across the whole width), so a white band inside one frame doesn't split it. Runs under 3px and slivers under 35% of the median cell are dropped. Each cell then gets `trim_seams()`: up to 2 edge lines that jump sharply from the line inside them are removed (the sheets have a 1px light seam on top). Cells are evened up to the most common size with a centre crop or pad, never a rescale.
- **Device** (`frame_device.py`). The geometry is defined once in output pixels and emitted both as SVG (`--svg`) and as a 4x-supersampled PIL raster, which avoids a cairo/rsvg dependency. Strokes are 1.6 CSS px in #969696, roughly `rgba(255,255,255,.55)` on #141414, which matches the stage's `.line` 1.6 stroke. The phone uses iPhone 15 proportions: 55pt screen radius, an 11pt bezel, a 124x36pt dynamic island and side-button stubs. Playwright mobile shots have no status bar, so the phone adds a 54pt strip above the content, filled with the screen's own top color, and the island sits in it instead of covering the page. The laptop has a lid with a camera dot, a thin screen hairline, and a wider base with a thumb notch.
- **Timeline** (`build.py`). An ffmpeg `xfade` chain runs over the framed stills, rendered once at 30fps for the MP4 and once at the GIF's fps.
- **The GIF encoder matters most.** gifski (q80-95) and ffmpeg's default `transdiff` both store each frame as "pixels close enough to the previous frame are kept". After a crossfade, the last fade frame is still about 20% of the previous state, so that state **ghosts through the whole hold**. It shows plainly on flat backgrounds: the generator page's heading stayed visible for 2 seconds. Only gifski q100 avoids it, and that doubled the size. The exact encoder here does three things:
  1. It collapses runs of identical frames, so a hold is ONE GIF frame with a long delay.
  2. It builds one palette for the whole animation (`stats_mode=full`) with bayer dither.
  3. It encodes with `-gifflags -transdiff`. Each frame is still cropped to its changed rectangle, but nothing is ever "kept because it was close".

  Fades run at 10fps (2 to 3 frames per 250ms fade): fade frames are the bulk of the bytes, and holds are nearly free. `--gif-encoder gifski` stays available for comparison.
- **Themes.** Dark is the stage today: ground #141414, hairline #969696, about `rgba(255,255,255,.55)`. Light is its mirror: ground #f4f4f1, hairline #767674. The stage has no light tokens yet, so pass the real ones with `--light-bg/--light-stroke` when they land. Each theme is rendered on a solid ground rather than transparent: GIF alpha is 1-bit, so the anti-aliased hairlines would halo on any ground they weren't blended against, and MP4 has no alpha at all. The schema has one `src`, so a light theme can swap `NAME.gif` for `NAME-light.gif` by suffix (likewise the webp poster).
- **Phone GIFs at 1.5x, not 2x.** At 2x the GIF needs no dither to fit 4 MB, and that bands the chat widget's gradients. At 1.5x with bayer dither it stays smooth and lands at about 3 MB. The sheet cells are only 300px wide, so 2x adds no text detail. The 2x master is the MP4. Laptop GIFs from half-size sheets use 1.25x. Full 1280px captures of dense UI (the builder, the dashboard) set `"gif_scale": 2` in their manifest, so text stays near 1:1; they're flat UIs, so that's still under 1 MB.

## Wiring into the stage

`tools/demo/attach.mjs` sets `preview: { src: <gif>, poster: <webp>, aspect: gif w/h, frame: "phone" | "laptop" }`.
By default each demo becomes its own `asset` receipt on the fill it backs. `receipt: {...}` makes that new receipt
a specific one instead, such as the commit that shipped the UI; check it with `git log -S "<ui string>"`. `onReceipt: "<ref>"`
puts the preview on a receipt that's already there. It's idempotent. The GIFs are already framed, so
`frame` only tells the engine how to lay the preview out (phone 150px wide, laptop up to 360px).
`src/data/validate.mjs` checks every preview: `src` and `poster` exist under `public/`, `aspect` is greater than 0,
`frame` is one of `phone`/`laptop`/`none`, and there are no unknown keys.

## Other screenshot sets that could become demos (counted 2026-11-02, not processed)

| Count | Where | What |
|---|---|---|
| 22 | `~/Documents/work/chekout-ai/chekoutai-frontend/portfolio-capture/stills` | **Used** (`manifests/builder.json`, `manifests/dashboard.json`). The dashboard number cards 02-05 and 08 come from a different run than `dashboard-01-full` (6,593 vs 3,712 visitors), so they're left out. |
| 8 / 8 / 9 | `~/Documents/kyuri-dashboard/e2e/screenshots/{phone,tablet,desktop}` | KYURI.OS e2e baselines per viewport |
| 78 / 91 / 96 | `~/Documents/kyuri-dashboard/e2e/screenshots/failures/{phone,tablet,desktop}` | e2e failure captures (debug, not demo material) |
| 191 | `/private/tmp/claude-501/-Users-namit-Documents-kyuri-dashboard/cb7d3ac0-c58e-453b-8bb4-32bf6a48924d/scratchpad/stage` | stage prototype review shots by round (`r2` 18, `r3` 19, `r5` 28, `r10` 21, …). Temp dir, so it will disappear. |
| 19 | `Juniper/design-plans/hm-audit/rebuild/round4/generator` | used here (generator flows); the dark variants are unused |
| 4 | `Juniper/design-plans/hm-audit/rebuild/round4/recordings` | used here; `kivakube-desktop-sheet.png` is unused |
| 10 | `Juniper/design-plans/hm-audit/rebuild/round4/no-js` | no-JS fallback shots |
| 25 | `Juniper/design-plans/hm-audit/rebuild/round3` | earlier rebuild round |
| 8 / 8 | `Juniper/design-plans/hm-audit/rebuild/{agent-platform,christine-valmy}` | case-page shots, 1440/390, dark/light; includes `contrast-demo-*` |
| ~200 | `Juniper/design-plans/hm-audit/shots/{nk-*,hm-*,studio-explore}/{desktop,mobile}` | `nk-*` = Namit's site (home, chekout and cv cases, 7-16 each). `hm-*` = the Hello Monday reference audit: someone else's site, never demo material. |
| 111 | `~/Documents/work/chekout-ai/deck-build/preview` | slide previews of the sales deck (not UI flows) |
