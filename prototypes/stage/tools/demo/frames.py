"""Turn Playwright output into an ordered list of same-sized frames.

Three ways in:
  * a contact sheet  -> slice_sheet(): finds the gutters (bands of uniform rows /
                         columns that run the full height / width) and cuts the grid,
                         reading order left-to-right, top-to-bottom.
  * a folder / list  -> load_files(): natural sort, one PNG per state.
  * a manifest       -> load_manifest(): per-frame src + optional crop / fit / hold,
                         for screenshots that were not captured at the same crop.

Every path ends in normalize(): all frames become the same size (crop box, then
trim, then fit into a common canvas) so the device frame and the encoders see
a stable sequence.

CLI (debug):  python3 tools/demo/frames.py SHEET.png --out DIR   # writes 01.png, 02.png, ...
"""
from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass, field

import numpy as np
from PIL import Image


@dataclass
class Frame:
    img: Image.Image
    hold: float | None = None  # seconds; None -> build default
    label: str = ""
    meta: dict = field(default_factory=dict)


# ---------------------------------------------------------------- sheets
def _uniform_runs(mask: np.ndarray, min_run: int):
    """[(start, end_exclusive)] runs of True at least min_run long."""
    runs, start = [], None
    for i, v in enumerate(list(mask) + [False]):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_run:
                runs.append((start, i))
            start = None
    return runs


def _segments(length: int, gutters, min_size: int):
    """Content segments between gutters (edges count as gutters)."""
    cuts, pos = [], 0
    for a, b in gutters:
        if a - pos >= min_size:
            cuts.append((pos, a))
        pos = b
    if length - pos >= min_size:
        cuts.append((pos, length))
    return cuts


def trim_seams(img: Image.Image, max_px: int = 2, jump: float = 24.0):
    """Drop up to max_px edge lines per side that differ sharply from the line
    just inside them (sheet borders / anti-aliased gutter seams)."""
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    t = l = 0
    b, r = a.shape[0], a.shape[1]

    def d(u, v):
        return float(np.abs(u - v).mean())

    for _ in range(max_px):
        if b - t > 4 and d(a[t], a[t + 1]) > jump and d(a[t + 1], a[t + 2]) < jump / 2: t += 1
        if b - t > 4 and d(a[b - 1], a[b - 2]) > jump and d(a[b - 2], a[b - 3]) < jump / 2: b -= 1
        if r - l > 4 and d(a[:, l], a[:, l + 1]) > jump and d(a[:, l + 1], a[:, l + 2]) < jump / 2: l += 1
        if r - l > 4 and d(a[:, r - 1], a[:, r - 2]) > jump and d(a[:, r - 2], a[:, r - 3]) < jump / 2: r -= 1
    return img.crop((l, t, r, b)) if (t, l, b, r) != (0, 0, a.shape[0], a.shape[1]) else img


def slice_sheet(img: Image.Image, tol: int = 6, min_gutter: int = 3, min_frac: float = 0.35):
    """Cut a contact sheet into frames by detecting gutters.

    A gutter column is one whose pixels are all within `tol` of each other over
    the whole sheet height (same for rows across the whole width), so a white
    band inside ONE frame does not split it: it has to run across the grid.
    Segments narrower than `min_frac` of the median segment are dropped (stray
    uniform strips at an edge).
    """
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    h, w, _ = a.shape
    col_uniform = (a.max(0) - a.min(0)).max(1) <= tol
    row_uniform = (a.max(1) - a.min(1)).max(1) <= tol
    xs = _segments(w, _uniform_runs(col_uniform, min_gutter), 8)
    ys = _segments(h, _uniform_runs(row_uniform, min_gutter), 8)

    def keep(segs):
        if not segs:
            return segs
        med = float(np.median([b - a for a, b in segs]))
        return [s for s in segs if (s[1] - s[0]) >= min_frac * med]

    xs, ys = keep(xs), keep(ys)
    frames = []
    for (y0, y1) in ys:
        for (x0, x1) in xs:
            frames.append(trim_seams(img.crop((x0, y0, x1, y1)).convert("RGB")))
    return frames, {"cols": xs, "rows": ys}


# ---------------------------------------------------------------- files
def _natural_key(s: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def load_files(paths):
    out = []
    for p in paths:
        if os.path.isdir(p):
            kids = sorted((f for f in os.listdir(p) if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))),
                          key=_natural_key)
            out += [Frame(Image.open(os.path.join(p, f)).convert("RGB"), label=f) for f in kids]
        else:
            out.append(Frame(Image.open(p).convert("RGB"), label=os.path.basename(p)))
    return out


# ---------------------------------------------------------------- crop / fit helpers
def edge_color(img: Image.Image):
    """Median color of the outermost 2px ring: what to pad with."""
    a = np.asarray(img.convert("RGB"))
    ring = np.concatenate([a[:2].reshape(-1, 3), a[-2:].reshape(-1, 3), a[:, :2].reshape(-1, 3), a[:, -2:].reshape(-1, 3)])
    return tuple(int(v) for v in np.median(ring, 0))


def crop_box(img: Image.Image, box, fill=None):
    """Crop [x, y, w, h]; parts outside the image are filled (default: edge color)."""
    x, y, w, h = [int(round(v)) for v in box]
    fill = tuple(fill) if fill else edge_color(img)
    canvas = Image.new("RGB", (w, h), fill)
    sx0, sy0 = max(0, x), max(0, y)
    sx1, sy1 = min(img.width, x + w), min(img.height, y + h)
    if sx1 > sx0 and sy1 > sy0:
        canvas.paste(img.crop((sx0, sy0, sx1, sy1)), (sx0 - x, sy0 - y))
    return canvas


def fit(img: Image.Image, size, mode="cover", fill=None, anchor=(0.5, 0.0)):
    """Fit into size=(w,h). cover: fill + crop (anchor picks what survives,
    default top-centre: a page reads from the top). contain: letterbox with
    `fill`. none: paste at native scale (anchored), cropping or padding."""
    W, H = size
    fill = tuple(fill) if fill else edge_color(img)
    if mode == "none":
        s = 1.0
    elif mode == "contain":
        s = min(W / img.width, H / img.height)
    else:
        s = max(W / img.width, H / img.height)
    if abs(s - 1) > 1e-3:
        img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
    canvas = Image.new("RGB", (W, H), fill)
    ox = round((W - img.width) * anchor[0])
    oy = round((H - img.height) * anchor[1])
    canvas.paste(img, (ox, oy))
    return canvas


def trim(img: Image.Image, px):
    """Shave px from each side: int, or [top, right, bottom, left]."""
    if not px:
        return img
    t, r, b, l = (px, px, px, px) if isinstance(px, int) else px
    return img.crop((l, t, img.width - r, img.height - b))


def normalize(frames, size=None, mode="cover"):
    """Make every frame the same size: the most common size wins (or `size`)."""
    if not frames:
        raise SystemExit("no frames")
    if size is None:
        sizes = [f.img.size for f in frames]
        size = max(set(sizes), key=sizes.count)
    for f in frames:
        if f.img.size != tuple(size):
            # sheet cells can differ by a pixel: centre-crop/pad, never rescale for that
            small = abs(f.img.width - size[0]) <= 4 and abs(f.img.height - size[1]) <= 4
            f.img = fit(f.img, size, "none" if small else f.meta.get("fit", mode), anchor=(0.5, 0.5) if small else (0.5, 0.0))
    return frames, tuple(size)


def find_exact(hay: Image.Image, needle: Image.Image, tol: float = 3.0):
    """[x, y] where `needle` sits in `hay` (mean abs diff <= tol).
    Vectorised: keep positions where 24 sample points of the needle match, then verify those."""
    H = np.asarray(hay.convert("L")).astype(np.int16)
    N = np.asarray(needle.convert("L")).astype(np.int16)
    nh, nw = N.shape
    Hh, Hw = H.shape[0] - nh + 1, H.shape[1] - nw + 1
    if Hh <= 0 or Hw <= 0:
        raise SystemExit("overlay match: needle larger than frame")
    rng = np.random.default_rng(0)
    pts = list(zip(rng.integers(0, nh, 24), rng.integers(0, nw, 24)))
    ok = np.ones((Hh, Hw), bool)
    for dy, dx in pts:
        ok &= np.abs(H[dy:dy + Hh, dx:dx + Hw] - N[dy, dx]) <= max(8, tol * 3)
    best = (1e9, None)
    for y, x in zip(*np.nonzero(ok)):
        d = float(np.abs(H[y:y + nh, x:x + nw] - N).mean())
        if d < best[0]:
            best = (d, [int(x), int(y)])
    if best[1] is None or best[0] > tol:
        raise SystemExit(f"overlay match not found (best diff {best[0]:.1f})")
    return best[1]


# ---------------------------------------------------------------- manifest
def load_manifest(path):
    """JSON:
    {
      "base": "dir the srcs are relative to (default: the manifest's dir)",
      "sheet": "optional contact sheet; then 'frames' entries may use {index: n}",
      "size": [w, h],              // optional common screen size (px) before scaling
      "trim": 0 | [t, r, b, l],    // applied to every frame after crop
      "frames": [
        { "src": "a.png", "crop": [x, y, w, h], "fit": "cover|contain|none",
          "fill": [r,g,b], "hold": 1.6, "label": "default" },
        { "index": 3, "hold": 2.4 },          // from the sheet, 0-based
        ...
      ]
    }
    Returns (frames, settings dict)."""
    m = json.load(open(path))
    base = m.get("base", os.path.dirname(os.path.abspath(path)))
    if not os.path.isabs(base):
        base = os.path.join(os.path.dirname(os.path.abspath(path)), base)
    sheet_frames = None
    if m.get("sheet"):
        sheet_frames, _ = slice_sheet(Image.open(os.path.join(base, m["sheet"])), **m.get("slice", {}))
    entries = m.get("frames") or [{"index": i} for i in range(len(sheet_frames or []))]
    out = []
    for e in entries:
        if "index" in e:
            img = sheet_frames[e["index"]]
        elif "row" in e:
            # element captures (cards) laid side by side on the page colour, at native scale
            parts = []
            for it in e["row"]:  # "file.png" or {"src": ..., "crop": [x, y, w, h]}
                it = {"src": it} if isinstance(it, str) else it
                im = Image.open(os.path.join(base, it["src"])).convert("RGB")
                parts.append(crop_box(im, it["crop"]) if it.get("crop") else im)
            gap = e.get("gap", 24)
            fill = tuple(e.get("fill") or edge_color(parts[0]))
            img = Image.new("RGB", (sum(p.width for p in parts) + gap * (len(parts) - 1), max(p.height for p in parts)), fill)
            x = 0
            for p_ in parts:
                img.paste(p_, (x, 0)); x += p_.width + gap
        else:
            img = Image.open(os.path.join(base, e["src"])).convert("RGB")
        for ov in e.get("overlay", []):
            # paste an element capture back where it was taken (e.g. a button's busy state);
            # "at" is [x, y] in this frame's pixels, or "match": an image whose exact
            # location in the frame gives the spot
            piece = Image.open(os.path.join(base, ov["src"])).convert("RGB")
            at = ov.get("at") or find_exact(img, Image.open(os.path.join(base, ov["match"])).convert("RGB"))
            img.paste(piece, tuple(at))
        if e.get("crop"):
            img = crop_box(img, e["crop"], e.get("fill"))
        img = trim(img, e.get("trim", m.get("trim", 0)))
        meta = {k: e[k] for k in ("fit", "fill", "anchor") if k in e}
        out.append(Frame(img, hold=e.get("hold"), label=e.get("label", e.get("src", f"#{e.get('index')}")), meta=meta))
    size = tuple(m["size"]) if m.get("size") else None
    if size:
        for f in out:
            if f.img.size != size:
                f.img = fit(f.img, size, f.meta.get("fit", "cover"), f.meta.get("fill"),
                            tuple(f.meta.get("anchor", (0.5, 0.0))))
    return out, m


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sheet")
    ap.add_argument("--out", required=True)
    ap.add_argument("--tol", type=int, default=6)
    a = ap.parse_args()
    frames, grid = slice_sheet(Image.open(a.sheet), tol=a.tol)
    os.makedirs(a.out, exist_ok=True)
    for i, f in enumerate(frames, 1):
        f.save(os.path.join(a.out, f"{i:02d}.png"))
    print(f"{len(frames)} frames; cols={grid['cols']} rows={grid['rows']}")


if __name__ == "__main__":
    main()
