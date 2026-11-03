"""Playwright screenshots -> device-framed demo MP4 + GIF + poster.

  python3 tools/demo/build.py --sheet rosendahl-mobile-sheet.png --device phone --name rosendahl-mobile --out public/assets/chekout/demos
  python3 tools/demo/build.py --frames shots/ --device laptop --name flow --out out/
  python3 tools/demo/build.py --manifest tools/demo/manifests/generator-390.json --out public/assets/chekout/demos

Each state is held (default 1.5s, --hold; per-frame "hold" in a manifest, or
--holds 1.2,1.2,2.4,...) and crossfades into the next (--fade 0.25s). The last
state fades back into the first so the loop has no jump.

Outputs (in --out):  NAME.mp4  H.264 yuv420p CRF 20, +faststart, 30fps, 2x (the master)
                     NAME.gif  exact encoder (default): a hold is ONE frame with a long delay,
                               crossfades at --gif-fps 10, one palette (bayer dither), no
                               inter-frame "close enough" reuse, so no ghosting. 1.5x phone,
                               1.25x laptop. --gif-encoder gifski is kept for comparison: it is
                               smaller but leaves a ghost of the previous state in each hold
                               below quality 100.
                     NAME.png / NAME.webp (/ NAME.avif if Pillow has it)  poster
                     NAME.json  sizes, fps, durations, aspect: what to put in Receipt.preview
See tools/demo/README.md.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, features

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from frames import Frame, load_files, load_manifest, normalize, slice_sheet  # noqa: E402
from frame_device import THEMES, Device, themed  # noqa: E402

FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
GIFSKI = shutil.which("gifski")

# CSS width of the SCREEN inside the device; the device adds ~17% (phone) / ~22% (laptop)
DEFAULT_SCREEN_CSS = {"phone": 310, "laptop": 600, "none": 600}


def rel(p):
    """Path as the site sees it (under public/), else relative to cwd."""
    ap_ = os.path.abspath(p)
    if "/public/" in ap_:
        return ap_.split("/public/", 1)[1]
    return os.path.relpath(ap_)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.stderr.write(" ".join(map(str, cmd)) + "\n" + r.stderr[-3000:])
        raise SystemExit(r.returncode)
    return r


def even(n):
    return n + (n % 2)


def render_states(frames, device, screen_css, scale, style_kw):
    """Framed RGB images, one per state, at `scale` px per CSS px."""
    cw = round(screen_css * scale)
    src_w, src_h = frames[0].img.size
    ch = round(src_h * cw / src_w)
    st = themed(scale=scale, **style_kw)
    dev = Device(device, (cw, ch), st) if device != "none" else None
    out = []
    for f in frames:
        content = f.img.resize((cw, ch), Image.LANCZOS) if (cw, ch) != f.img.size else f.img
        img = dev.frame(content) if dev else content
        if img.width % 2 or img.height % 2:  # yuv420p wants even sides
            c = Image.new("RGB", (even(img.width), even(img.height)), st.bg)
            c.paste(img, (0, 0))
            img = c
        out.append(img)
    return out, dev


def timeline(states, holds, fade, fps, out_args, workdir, tag):
    """ffmpeg xfade chain over still images; returns ffmpeg run result."""
    paths = []
    for i, im in enumerate(states):
        p = os.path.join(workdir, f"{tag}-{i:02d}.png")
        im.save(p)
        paths.append(p)
    seq = list(range(len(states))) + [0]           # fade back into the first state to loop
    durs = [holds[i] + fade for i in range(len(states))] + [fade + 1.0 / fps]
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error"]
    for k, i in enumerate(seq):
        cmd += ["-loop", "1", "-framerate", str(fps), "-t", f"{durs[k]:.3f}", "-i", paths[i]]
    chains, last, cum = [], "[0:v]", durs[0]
    for k in range(1, len(seq)):
        off = cum - fade
        lab = f"[x{k}]"
        chains.append(f"{last}[{k}:v]xfade=transition=fade:duration={fade}:offset={off:.3f}{lab}")
        last, cum = lab, cum + durs[k] - fade
    total = cum - fade - 1.0 / fps                  # drop the duplicate first state at the very end
    chains.append(f"{last}trim=duration={total:.3f},setpts=PTS-STARTPTS,fps={fps},format=rgb24[v]")
    cmd += ["-filter_complex", ";".join(chains), "-map", "[v]"] + out_args
    run(cmd)
    return total


DITHERS = {"bayer": "bayer:bayer_scale=4", "sierra": "sierra2_4a", "none": "none"}


def build_gif(states, holds, fade, fps, out, workdir, encoder, quality, lossy, motion=None, gif_dither="bayer"):
    framedir = os.path.join(workdir, "gifframes")
    os.makedirs(framedir, exist_ok=True)
    dur = timeline(states, holds, fade, fps, [os.path.join(framedir, "f%05d.png")], workdir, "g")
    files = sorted(os.path.join(framedir, f) for f in os.listdir(framedir))
    if encoder == "gifski":
        # gifski shrinks to ~800px by default: pin the size we rendered
        w, h = states[0].size
        cmd = [GIFSKI, "--fps", str(fps), "--quality", str(quality), "--repeat", "0",
               "--width", str(w), "--height", str(h), "-o", out]
        if lossy is not None:
            cmd += ["--lossy-quality", str(lossy)]
        if motion is not None:
            cmd += ["--motion-quality", str(motion)]
        run(cmd + files)
    else:
        # Exact encoder: collapse runs of identical frames into one frame with a long delay
        # (a hold is ONE gif frame), then encode with transparency-diffing OFF. Each frame
        # is cropped to the rectangle that actually changed, but pixels are never "kept from
        # the previous frame because they were close", so a crossfade can't leave a ghost
        # of the previous state in the hold (gifski < q100 and ffmpeg's default transdiff do).
        import numpy as np
        uniq, last = [], None
        for f in files:
            a = np.asarray(Image.open(f).convert("RGB"))
            if last is not None and np.array_equal(a, last):
                uniq[-1][1] += 1
            else:
                uniq.append([f, 1]); last = a
        lst = os.path.join(workdir, "concat.txt")
        with open(lst, "w") as fh:
            fh.write("ffconcat version 1.0\n")
            for f, n in uniq:
                fh.write(f"file '{f}'\nduration {n / fps:.4f}\n")
            fh.write(f"file '{uniq[-1][0]}'\n")  # concat needs the last file repeated for its duration
        pal = os.path.join(workdir, "palette.png")
        dither = DITHERS.get(gif_dither, gif_dither)
        src = ["-f", "concat", "-safe", "0", "-i", lst]
        run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *src,
             "-vf", "palettegen=max_colors=256:stats_mode=full", "-update", "1", "-frames:v", "1", pal])
        run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", *src, "-i", pal, "-lavfi",
             f"[0:v][1:v]paletteuse=dither={dither}", "-fps_mode", "vfr",
             "-gifflags", "-transdiff", "-loop", "0", out])
        files = [f for f, _ in uniq]
    return dur, len(files)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--sheet", help="contact sheet PNG (gutters are detected)")
    src.add_argument("--frames", nargs="+", help="PNG files and/or folders, in order (folders: natural sort)")
    src.add_argument("--manifest", help="JSON manifest (per-frame crop/fit/hold); see frames.load_manifest")
    ap.add_argument("--device", choices=["phone", "laptop", "none"])
    ap.add_argument("--style", choices=["outline", "filled"])
    ap.add_argument("--themes", help="comma list of stage themes to render (default dark,light); dark -> NAME.*, light -> NAME-light.*")
    ap.add_argument("--bg", help="override the dark ground #rrggbb")
    ap.add_argument("--stroke", help="override the dark hairline #rrggbb")
    ap.add_argument("--light-bg", help="override the light ground #rrggbb")
    ap.add_argument("--light-stroke", help="override the light hairline #rrggbb")
    ap.add_argument("--name")
    ap.add_argument("--out", required=True)
    ap.add_argument("--select", help="comma list of 0-based frame indices to keep, in order (e.g. 0,2,3,5)")
    ap.add_argument("--screen-css", type=float, help="screen width in CSS px (phone 310, laptop 600)")
    ap.add_argument("--scale", type=float, default=2.0, help="MP4/poster px per CSS px")
    ap.add_argument("--gif-scale", type=float, help="GIF px per CSS px (default 1.5 phone, 1.25 laptop)")
    ap.add_argument("--hold", type=float, help="seconds per state (default 1.5)")
    ap.add_argument("--holds", help="comma list of per-state holds (overrides --hold)")
    ap.add_argument("--key", help="comma list of indices held longer (x1.6)")
    ap.add_argument("--fade", type=float, help="crossfade seconds (default 0.25)")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--gif-fps", type=int, help="GIF crossfade frame rate (default 10; holds are single frames)")
    ap.add_argument("--gif-encoder", choices=["gifski", "ffmpeg"])
    ap.add_argument("--gif-quality", type=int)
    ap.add_argument("--gif-dither", help="ffmpeg encoder: bayer (default, compresses best) | sierra | none")
    ap.add_argument("--gif-lossy", type=int, help="gifski --lossy-quality (lower = smaller)")
    ap.add_argument("--gif-motion", type=int, help="gifski --motion-quality (default 100: lower values let the previous state ghost through holds)")
    ap.add_argument("--crf", type=int, default=20)
    ap.add_argument("--poster", type=int, help="state index for the poster (default: the longest hold)")
    ap.add_argument("--no-gif", action="store_true")
    a = ap.parse_args()

    settings = {}
    if a.manifest:
        frames, settings = load_manifest(a.manifest)
    elif a.sheet:
        imgs, grid = slice_sheet(Image.open(a.sheet))
        frames = [Frame(im, label=f"cell {i}") for i, im in enumerate(imgs)]
        print(f"sheet: {len(imgs)} cells, cols={grid['cols']} rows={grid['rows']}")
    else:
        frames = load_files(a.frames)
    pick = a.select or settings.get("select")
    if pick:
        idx = [int(x) for x in str(pick).split(",")] if isinstance(pick, str) else pick
        frames = [frames[i] for i in idx]
    frames, size = normalize(frames)

    def opt(k, default):
        v = getattr(a, k.replace("-", "_"), None)
        return v if v is not None else settings.get(k.replace("-", "_"), default)

    device = opt("device", "phone")
    name = opt("name", None) or os.path.splitext(os.path.basename(a.manifest or a.sheet or "demo"))[0]
    hold = opt("hold", 1.5)
    fade = opt("fade", 0.25)
    screen_css = opt("screen-css", DEFAULT_SCREEN_CSS[device])
    gif_scale = opt("gif-scale", 1.5 if device == "phone" else 1.25)
    gif_fps = opt("gif-fps", 10)
    style_kw = {"style": opt("style", "outline")}
    if settings.get("status_bar"):
        style_kw["status_bar"] = settings["status_bar"]

    holds = [f.hold if f.hold else hold for f in frames]
    if a.holds:
        holds = [float(x) for x in a.holds.split(",")]
    key = a.key or settings.get("key")
    if key:
        for i in ([int(x) for x in key.split(",")] if isinstance(key, str) else key):
            holds[i] = round(holds[i] * 1.6, 2)
    assert len(holds) == len(frames), f"{len(holds)} holds for {len(frames)} frames"

    os.makedirs(a.out, exist_ok=True)
    themes = opt("themes", "dark,light")
    themes = themes.split(",") if isinstance(themes, str) else themes
    colours = {"dark": (opt("bg", None), opt("stroke", None)),
               "light": (opt("light-bg", None), opt("light-stroke", None))}
    root_work = tempfile.mkdtemp(prefix=f"demo-{name}-")
    try:
        for theme in themes:
            assert theme in THEMES, theme
            kw = dict(style_kw, theme=theme, bg=colours[theme][0], stroke=colours[theme][1])
            out_name = name if theme == "dark" else f"{name}-{theme}"
            work = os.path.join(root_work, theme)
            os.makedirs(work)
            emit(a, opt, frames, size, device, screen_css, gif_scale, gif_fps, holds, fade, kw,
                 os.path.join(a.out, out_name), out_name, theme, work)
    finally:
        if not os.environ.get("DEMO_KEEP"):
            shutil.rmtree(root_work, ignore_errors=True)
        else:
            print("  work dir kept:", root_work)


def emit(a, opt, frames, size, device, screen_css, gif_scale, gif_fps, holds, fade, style_kw, base, name, theme, work):
    """One theme: MP4 + posters + GIF + JSON."""
    states, _ = render_states(frames, device, screen_css, a.scale, style_kw)
    W, H = states[0].size
    dur = timeline(states, holds, fade, a.fps,
                   ["-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-tune", "stillimage",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", base + ".mp4"], work, "m")
    poster_i = opt("poster", None)
    if poster_i is None:
        poster_i = max(range(len(holds)), key=lambda i: (holds[i], i))
    states[poster_i].save(base + ".png", optimize=True)
    states[poster_i].save(base + ".webp", quality=88, method=6)
    posters = [base + ".png", base + ".webp"]
    if features.check("avif"):
        try:
            states[poster_i].save(base + ".avif", quality=70)
            posters.append(base + ".avif")
        except Exception:
            pass
    info = {"name": name, "theme": theme, "device": device, "frames": len(frames), "holds": holds, "fade": fade,
            "mp4": {"path": rel(base + ".mp4"), "w": W, "h": H, "fps": a.fps, "duration": round(dur, 2),
                    "bytes": os.path.getsize(base + ".mp4")},
            "poster": {"index": poster_i, "files": {os.path.basename(p): os.path.getsize(p) for p in posters}},
            "aspect": round(W / H, 4), "source_frame": list(size)}
    if not a.no_gif:
        gstates, _ = render_states(frames, device, screen_css, gif_scale, style_kw)
        enc = opt("gif-encoder", "ffmpeg")
        if enc == "gifski" and not GIFSKI:
            enc = "ffmpeg"
        gdur, n = build_gif(gstates, holds, fade, gif_fps, base + ".gif", work, enc,
                            opt("gif-quality", 80), opt("gif-lossy", None), opt("gif-motion", 100),
                            opt("gif-dither", "bayer"))
        gw, gh = Image.open(base + ".gif").size  # measured, not assumed
        info["gif"] = {"path": rel(base + ".gif"), "w": gw, "h": gh, "fps": gif_fps,
                       "duration": round(gdur, 2), "frames": n, "encoder": enc,
                       "bytes": os.path.getsize(base + ".gif")}
    json.dump(info, open(base + ".json", "w"), indent=2)
    kb = lambda b: f"{b / 1024:.0f} KB" if b < 1 << 20 else f"{b / (1 << 20):.2f} MB"
    print(f"{name}: {len(frames)} states, {dur:.1f}s")
    print(f"  mp4 {W}x{H} {a.fps}fps {kb(info['mp4']['bytes'])}")
    if "gif" in info:
        g = info["gif"]
        print(f"  gif {g['w']}x{g['h']} {g['fps']}fps {kb(g['bytes'])} ({g['encoder']})")
    print("  poster " + ", ".join(f"{k} {kb(v)}" for k, v in info["poster"]["files"].items()))


if __name__ == "__main__":
    main()
