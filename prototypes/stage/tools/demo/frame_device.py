"""Frame a screen image in a device outline: an iPhone ("phone") or a laptop.

The device is described once as geometry (rounded rects, a pill, a base
polygon) in output pixels. That geometry is
  * written out as an SVG (device_svg(): the hairline drawing, screen left open), and
  * rasterised with PIL at 4x supersampling (frame()) so strokes come out
    anti-aliased at the final size without needing cairo / rsvg.

Style matches the stage: dark #141414 ground, ~1.6 CSS px light-grey hairlines.
  style="outline" (default)  body is ground-coloured, drawn only as hairlines
  style="filled"             bezel filled near-black, hairline on the outside edge

All sizes are in CSS px times `scale` (2 = retina), so a phone ~360 CSS px wide
renders 720 px wide with 3.2 px strokes.

CLI (debug):  python3 tools/demo/frame_device.py shot.png --device phone --out framed.png [--svg out.svg]
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageDraw

SS = 4  # supersampling factor for the vector parts


# Ground + hairline per stage theme. Dark matches the stage today (--bg #141414, lines ~
# rgba(255,255,255,.55)); light is the mirror (off-white ground, ~rgba(0,0,0,.5) lines),
# a guess until the light tokens land: override with bg= / stroke= (hex) when they do.
THEMES = {
    "dark": {"bg": (20, 20, 20), "stroke": (150, 150, 150)},
    "light": {"bg": (244, 244, 241), "stroke": (118, 118, 116)},
}


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def themed(theme="dark", bg=None, stroke=None, **kw):
    """Style for a theme, with optional '#rrggbb' overrides for ground / hairline."""
    t = dict(THEMES[theme])
    if bg:
        t["bg"] = hex_rgb(bg) if isinstance(bg, str) else tuple(bg)
    if stroke:
        t["stroke"] = hex_rgb(stroke) if isinstance(stroke, str) else tuple(stroke)
    return Style(**t, **kw)


@dataclass
class Style:
    style: str = "outline"          # outline | filled
    bg: tuple = (20, 20, 20)        # #141414, the stage ground
    stroke: tuple = (150, 150, 150) # ~ rgba(255,255,255,.55) on #141414
    stroke_css: float = 1.6         # stage .line stroke-width
    bezel_fill: tuple = (10, 10, 10)
    scale: float = 2.0              # device px per CSS px
    status_bar: str = "auto"        # phone: auto (strip in the frame's own top colour) | none


def _hex(c):
    return "#%02x%02x%02x" % tuple(c[:3])


def _top_color(img: Image.Image):
    a = np.asarray(img.convert("RGB"))[2:8]
    return tuple(int(v) for v in np.median(a.reshape(-1, 3), 0))


# ---------------------------------------------------------------- geometry
def phone_geometry(screen_w, screen_h, st: Style, status_h=0):
    """All in output px. screen_w/h = content size; status_h = strip above it."""
    W = screen_w
    k = W / 390.0                                    # iPhone 15 logical width = 390
    bezel = max(round(11 * k), 6)                    # thin, ~11pt
    r_screen = round(55 * k)
    sw = st.stroke_css * st.scale
    pad = round(18 * k) + round(4 * k)               # room for the side buttons + breathing space
    body = (pad, pad, pad + W + 2 * bezel, pad + status_h + screen_h + 2 * bezel)
    screen = (pad + bezel, pad + bezel, pad + bezel + W, pad + bezel + status_h + screen_h)
    iw, ih = round(124 * k), round(36 * k)
    cx = (screen[0] + screen[2]) / 2
    iy = screen[1] + round(11 * k) if status_h == 0 else screen[1] + (status_h - ih) / 2
    island = (cx - iw / 2, iy, cx + iw / 2, iy + ih)
    bw = max(round(3.5 * k), 3)
    by = body[1]
    buttons = [  # (x0,y0,x1,y1) hairline stubs outside the body
        (body[0] - bw, by + round(120 * k), body[0], by + round(152 * k)),   # action
        (body[0] - bw, by + round(180 * k), body[0], by + round(240 * k)),   # vol up
        (body[0] - bw, by + round(255 * k), body[0], by + round(315 * k)),   # vol down
        (body[2], by + round(200 * k), body[2] + bw, by + round(300 * k)),   # side
    ]
    canvas = (body[2] + pad, body[3] + pad)
    return dict(kind="phone", canvas=canvas, body=body, r_body=r_screen + bezel, screen=screen,
                r_screen=r_screen, island=island, buttons=buttons, sw=sw, status_h=status_h,
                content_xy=(screen[0], screen[1] + status_h))


def laptop_geometry(screen_w, screen_h, st: Style):
    W = screen_w
    k = W / 1000.0  # proportions tuned on a 1000 px wide screen
    side = round(18 * k)
    top = round(24 * k)
    bottom = round(26 * k)
    sw = st.stroke_css * st.scale
    overhang = round(70 * k)
    base_h = round(20 * k)
    pad = round(24 * k)
    lid = (pad + overhang, pad, pad + overhang + W + 2 * side, pad + top + screen_h + bottom)
    screen = (lid[0] + side, lid[1] + top, lid[0] + side + W, lid[1] + top + screen_h)
    base = (pad, lid[3], lid[2] + overhang, lid[3] + base_h)
    notch_w = round(150 * k)
    cx = (base[0] + base[2]) / 2
    notch = (cx - notch_w / 2, base[1], cx + notch_w / 2, base[1] + round(7 * k))
    cam_r = max(2.5 * k, 2)
    cam = (cx - cam_r, lid[1] + top / 2 - cam_r, cx + cam_r, lid[1] + top / 2 + cam_r)
    canvas = (base[2] + pad, base[3] + pad)
    return dict(kind="laptop", canvas=canvas, lid=lid, r_lid=round(18 * k), screen=screen,
                r_screen=round(4 * k), base=base, notch=notch, cam=cam, sw=sw, content_xy=(screen[0], screen[1]))


# ---------------------------------------------------------------- svg
def device_svg(g, st: Style):
    """The outline as SVG (screen area left open). Same geometry as the raster."""
    W, H = g["canvas"]
    sw = g["sw"]
    stroke = f'fill="none" stroke="{_hex(st.stroke)}" stroke-width="{sw:.2f}" stroke-linejoin="round" stroke-linecap="round"'
    filled = st.style == "filled"
    bf = _hex(st.bezel_fill)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']

    def rr(b, r, attrs):
        x0, y0, x1, y1 = b
        return f'<rect x="{x0:.1f}" y="{y0:.1f}" width="{x1 - x0:.1f}" height="{y1 - y0:.1f}" rx="{r:.1f}" {attrs}/>'

    if g["kind"] == "phone":
        for b in g["buttons"]:
            parts.append(rr(b, 1.5 * st.scale, stroke))
        if filled:
            parts.append(rr(g["body"], g["r_body"], f'fill="{bf}"'))
        parts.append(rr(g["body"], g["r_body"], stroke))
        parts.append(rr(g["screen"], g["r_screen"], stroke))
        i = g["island"]
        parts.append(rr(i, (i[3] - i[1]) / 2, 'fill="#050505"'))
    else:
        if filled:
            parts.append(rr(g["lid"], g["r_lid"], f'fill="{bf}"'))
        parts.append(rr(g["lid"], g["r_lid"], stroke))
        parts.append(rr(g["screen"], g["r_screen"], stroke))
        c = g["cam"]
        parts.append(f'<circle cx="{(c[0] + c[2]) / 2:.1f}" cy="{(c[1] + c[3]) / 2:.1f}" r="{(c[2] - c[0]) / 2:.1f}" {stroke}/>')
        b, n = g["base"], g["notch"]
        r = (b[3] - b[1]) * 0.6
        d = (f'M{b[0]:.1f},{b[1]:.1f} L{n[0]:.1f},{b[1]:.1f} Q{n[0]:.1f},{n[3]:.1f} {n[0] + r:.1f},{n[3]:.1f} '
             f'L{n[2] - r:.1f},{n[3]:.1f} Q{n[2]:.1f},{n[3]:.1f} {n[2]:.1f},{b[1]:.1f} L{b[2]:.1f},{b[1]:.1f} '
             f'L{b[2]:.1f},{b[3] - r:.1f} Q{b[2]:.1f},{b[3]:.1f} {b[2] - r * 3:.1f},{b[3]:.1f} '
             f'L{b[0] + r * 3:.1f},{b[3]:.1f} Q{b[0]:.1f},{b[3]:.1f} {b[0]:.1f},{b[3] - r:.1f} Z')
        if filled:
            parts.append(f'<path d="{d}" fill="{bf}"/>')
        parts.append(f'<path d="{d}" {stroke}/>')
    parts.append("</svg>")
    return "\n".join(parts)


# ---------------------------------------------------------------- raster
def _S(b):
    return tuple(v * SS for v in b)


def _down(layer):
    return layer.resize((layer.width // SS, layer.height // SS), Image.LANCZOS)


def _base_path(g):
    """Laptop base outline as a polygon (approximates the SVG quads)."""
    b, n = g["base"], g["notch"]
    r = (b[3] - b[1]) * 0.6
    pts = [(b[0], b[1]), (n[0], b[1])]
    for t in np.linspace(0, 1, 8):  # notch dip
        pts.append((n[0] + r * t, b[1] + (n[3] - b[1]) * (1 - (1 - t) ** 2)))
    pts += [(n[2] - r, n[3])]
    for t in np.linspace(0, 1, 8):
        pts.append((n[2] - r + r * t, n[3] - (n[3] - b[1]) * t ** 2))
    pts += [(b[2], b[1]), (b[2], b[3] - r)]
    for t in np.linspace(0, 1, 10):  # rounded bottom corners
        a = t * np.pi / 2
        pts.append((b[2] - r * 3 + r * 3 * np.cos(a), b[3] - r + r * np.sin(a)))
    for t in np.linspace(0, 1, 10):
        a = np.pi / 2 + t * np.pi / 2
        pts.append((b[0] + r * 3 + r * 3 * np.cos(a), b[3] - r + r * np.sin(a)))
    return pts


def build_overlay(g, st: Style):
    """(fill_layer RGBA, stroke_layer RGBA, screen_mask L) at final size."""
    W, H = g["canvas"]
    fill = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    line = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    mask = Image.new("L", (W * SS, H * SS), 0)
    df, dl, dm = ImageDraw.Draw(fill), ImageDraw.Draw(line), ImageDraw.Draw(mask)
    sw = max(1, round(g["sw"] * SS))
    col = tuple(st.stroke) + (255,)
    bf = tuple(st.bezel_fill) + (255,)
    filled = st.style == "filled"
    if g["kind"] == "phone":
        for b in g["buttons"]:
            dl.rounded_rectangle(_S(b), radius=1.5 * st.scale * SS, outline=col, width=sw)
        if filled:
            df.rounded_rectangle(_S(g["body"]), radius=g["r_body"] * SS, fill=bf)
        # the body covers the button stubs' inner ends
        dl.rounded_rectangle(_S(g["body"]), radius=g["r_body"] * SS, fill=bf if filled else tuple(st.bg) + (255,))
        dl.rounded_rectangle(_S(g["body"]), radius=g["r_body"] * SS, outline=col, width=sw)
        dl.rounded_rectangle(_S(g["screen"]), radius=g["r_screen"] * SS, fill=(0, 0, 0, 0))
        dm.rounded_rectangle(_S(g["screen"]), radius=g["r_screen"] * SS, fill=255)
        i = g["island"]
        island = _S(i)
        dl_island = (island, (i[3] - i[1]) / 2 * SS)
    else:
        if filled:
            df.rounded_rectangle(_S(g["lid"]), radius=g["r_lid"] * SS, fill=bf)
            df.polygon([(x * SS, y * SS) for x, y in _base_path(g)], fill=bf)
        dl.rounded_rectangle(_S(g["lid"]), radius=g["r_lid"] * SS, outline=col, width=sw)
        dl.line([(x * SS, y * SS) for x, y in _base_path(g)] + [(g["base"][0] * SS, g["base"][1] * SS)],
                fill=col, width=sw, joint="curve")
        c = g["cam"]
        dl.ellipse(_S(c), outline=col, width=max(1, sw // 2))
        dm.rounded_rectangle(_S(g["screen"]), radius=g["r_screen"] * SS, fill=255)
        dl_island = None
    # hairline on the screen edge goes on top of the content
    edge = Image.new("RGBA", line.size, (0, 0, 0, 0))
    de = ImageDraw.Draw(edge)
    r = g["r_screen"] * SS
    de.rounded_rectangle(_S(g["screen"]), radius=r, outline=col, width=max(1, round(sw * 0.75)))
    if dl_island:
        de.rounded_rectangle(dl_island[0], radius=dl_island[1], fill=(5, 5, 5, 255))
    # punch the screen out of the body layer so content shows through
    line = Image.composite(Image.new("RGBA", line.size, (0, 0, 0, 0)), line, mask)
    return _down(fill), _down(line), _down(edge), _down(mask)


class Device:
    """Build once per demo (geometry + overlay), then frame() each screen image."""

    def __init__(self, kind, content_size, st: Style, sample=None):
        self.kind, self.st = kind, st
        self.cw, self.ch = content_size
        if kind == "phone":
            status_h = round(54 * self.cw / 390) if st.status_bar == "auto" else 0
            self.g = phone_geometry(self.cw, self.ch, st, status_h)
        elif kind == "laptop":
            self.g = laptop_geometry(self.cw, self.ch, st)
        else:
            raise ValueError(kind)
        self.fill, self.line, self.edge, self.mask = build_overlay(self.g, st)

    @property
    def size(self):
        return self.g["canvas"]

    def frame(self, content: Image.Image) -> Image.Image:
        """content must already be content_size (scaled)."""
        W, H = self.size
        out = Image.new("RGBA", (W, H), tuple(self.st.bg) + (255,))
        out.alpha_composite(self.fill)
        out.alpha_composite(self.line)
        scr = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        if self.kind == "phone" and self.g["status_h"]:
            s = self.g["screen"]
            strip = Image.new("RGBA", (s[2] - s[0], self.g["status_h"] + 2), _top_color(content) + (255,))
            scr.paste(strip, (s[0], s[1]))
        scr.paste(content.convert("RGBA"), self.g["content_xy"])
        out.paste(scr, (0, 0), self._mask_for(scr))
        out.alpha_composite(self.edge)
        return out.convert("RGB")

    def _mask_for(self, scr):
        a = np.minimum(np.asarray(scr.getchannel("A")), np.asarray(self.mask))
        return Image.fromarray(a)

    def svg(self):
        return device_svg(self.g, self.st)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image")
    ap.add_argument("--device", choices=["phone", "laptop"], default="phone")
    ap.add_argument("--style", choices=["outline", "filled"], default="outline")
    ap.add_argument("--theme", choices=list(THEMES), default="dark")
    ap.add_argument("--bg", help="ground colour #rrggbb (overrides the theme)")
    ap.add_argument("--stroke", help="hairline colour #rrggbb (overrides the theme)")
    ap.add_argument("--width", type=int, default=0, help="screen width in px (default: image width)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--svg")
    a = ap.parse_args()
    img = Image.open(a.image).convert("RGB")
    if a.width:
        img = img.resize((a.width, round(img.height * a.width / img.width)), Image.LANCZOS)
    d = Device(a.device, img.size, themed(a.theme, a.bg, a.stroke, style=a.style))
    d.frame(img).save(a.out)
    if a.svg:
        open(a.svg, "w").write(d.svg())
    print(a.out, d.size)


if __name__ == "__main__":
    main()
