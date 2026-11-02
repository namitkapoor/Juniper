# Draws the hairline architecture SVGs for the stage (dark, 1px lines).
import html, os
OUT = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/public/assets"
BG, INK, MUTE, BODY = "#141414", "#ececea", "#7d7d79", "#a9a9a4"
HAIR, LIVE = "rgba(255,255,255,0.22)", "rgba(255,255,255,0.6)"
SANS = "Helvetica Neue, Helvetica, Arial, sans-serif"
MONO = "ui-monospace, Menlo, Consolas, monospace"
e = html.escape

class Svg:
    def __init__(s, w, h): s.w, s.h, s.parts = w, h, []
    def text(s, x, y, t, size=15, fill=BODY, mono=False, weight=400, anchor="start", ls=0):
        s.parts.append(f'<text x="{x}" y="{y}" font-family="{MONO if mono else SANS}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}">{e(t)}</text>')
    def box(s, x, y, w, h, title, lines=(), mine=True):
        dash = '' if mine else ' stroke-dasharray="4 4"'
        s.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="{LIVE if mine else HAIR}" stroke-width="1"{dash}/>')
        s.text(x + 16, y + 30, title, 18, INK, weight=600)
        for i, l in enumerate(lines): s.text(x + 16, y + 56 + i * 21, l, 14.5, BODY)
    def group(s, x, y, label): s.text(x, y, label.upper(), 11.5, MUTE, mono=True, ls=1.5)
    def line(s, pts, arrow=True, label=None, lx=None, ly=None, anchor="middle"):
        d = " ".join(f"{x},{y}" for x, y in pts)
        m = ' marker-end="url(#a)"' if arrow else ""
        s.parts.append(f'<polyline points="{d}" fill="none" stroke="{LIVE}" stroke-width="1"{m}/>')
        if label:
            s.text(lx, ly, label, 12.5, MUTE, mono=True, anchor=anchor)
    def save(s, path):
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}">'
                f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                f'<path d="M0,0 L10,5 L0,10" fill="none" stroke="{LIVE}" stroke-width="1.2"/></marker></defs>'
                f'<rect width="100%" height="100%" fill="{BG}"/>')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w").write(head + "".join(s.parts) + "</svg>\n")

def legend(s, y, note):
    s.parts.append(f'<rect x="48" y="{y-11}" width="22" height="12" fill="none" stroke="{LIVE}"/>')
    s.text(78, y, "built by me", 12.5, MUTE, mono=True)
    s.parts.append(f'<rect x="210" y="{y-11}" width="22" height="12" fill="none" stroke="{HAIR}" stroke-dasharray="4 4"/>')
    s.text(240, y, "teammate or outside service", 12.5, MUTE, mono=True)
    s.text(s.w - 48, y, note, 12.5, MUTE, mono=True, anchor="end")

# ---------------------------------------------------------------- KYURI.OS
s = Svg(1600, 1000)
s.text(48, 60, "KYURI.OS · SYSTEM CONTEXT", 13, MUTE, mono=True, ls=2)
s.text(48, 96, "The site runs on Vercel and works with my laptop asleep. Heavy AI work goes through a tunnel to the box.", 19, INK)
s.box(48, 190, 280, 180, "People", ["Visitors: public pages", "Candidates: Google sign-in,", "their own pipeline", "Me: the owner view"], mine=False)
s.box(420, 150, 340, 260, "kyuri.namit.me", ["Next.js on Vercel", "Every page and API route", "Data redacted per viewer", "Rate limits on token spend", "Offline cache in the browser"])
s.line([(328, 280), (418, 280)], label="use", lx=373, ly=270)
# site-only column
s.group(880, 138, "Site only")
s.box(880, 150, 300, 100, "Neon Postgres", ["Accounts, quotas, logs,", "evidence records"], mine=False)
s.box(880, 270, 300, 100, "Google", ["Sign-in, Gmail, Sheets"], mine=False)
s.box(880, 390, 300, 120, "Job boards", ["speedrun startups, a16z", "portfolio, Designer Fund,", "searched by FIND ROLES"], mine=False)
s.line([(760, 280), (830, 280)], arrow=False)
s.line([(830, 200), (830, 450)], arrow=False)
for y in (200, 320, 450): s.line([(830, y), (878, y)])
# tunnel and box
s.box(420, 480, 340, 90, "Cloudflare tunnel", ["Outbound from the laptop"], mine=False)
s.line([(590, 410), (590, 478)], label="jobs, demo runs", lx=600, ly=450, anchor="start")
s.box(420, 640, 340, 250, "The box (my laptop)", ["Resume pipeline: route, tailor,", "lint, QA, leak guard", "Evidence miner", "LinkedIn scout", "Claude CLI in a sandbox,", "no tools for untrusted text"])
s.line([(590, 570), (590, 638)])
s.group(880, 638, "Box only")
s.box(880, 650, 300, 100, "LinkedIn", ["Scouting people in a", "real browser"], mine=False)
s.box(880, 770, 300, 100, "Google Drive", ["Tailored resume PDFs"], mine=False)
s.line([(760, 760), (830, 760)], arrow=False)
s.line([(830, 700), (830, 820)], arrow=False)
for y in (700, 820): s.line([(830, y), (878, y)])
# shared column
s.group(1270, 288, "Shared by both")
s.box(1270, 300, 282, 100, "Notion", ["Applications + contacts"], mine=False)
s.box(1270, 430, 282, 100, "GitHub vault", ["Obsidian notes, synced"], mine=False)
s.box(1270, 560, 282, 100, "Anthropic", ["Claude: CLI on the box,", "API fallback on the site"], mine=False)
s.line([(590, 150), (590, 112), (1230, 112), (1230, 940), (590, 940), (590, 890)], arrow=False)
for y in (350, 480, 610): s.line([(1230, y), (1268, y)])
legend(s, 975, "drawn from the KYURI.OS architecture board, Nov 2026")
s.save(f"{OUT}/kyuri-os/architecture.svg")

# ---------------------------------------------------------------- Christine Valmy
s = Svg(1600, 900)
s.text(48, 60, "CHRISTINE VALMY · ENROLLMENT AGENT", 13, MUTE, mono=True, ls=2)
s.text(48, 96, "A bilingual agent on the school's site answers from the school's own content and hands sorted leads to officers.", 19, INK)
s.box(48, 330, 270, 130, "Prospective students", ["English or Spanish,", "on phone or desktop"], mine=False)
s.box(410, 310, 330, 170, "Chat on the school's site", ["React widget in a WordPress", "plugin: inquiry form, chat,", "social links, both languages,", "WCAG AA audited"])
s.line([(318, 395), (408, 395)], label="ask", lx=363, ly=385)
s.box(830, 310, 330, 170, "Enrollment agent", ["Answers through RAG. Persona", "and prompt mine, function a", "teammate's. Shipped with", "Claude, now on Gemini"], mine=False)
s.line([(740, 395), (828, 395)], label="question", lx=784, ly=385)
s.box(1250, 330, 300, 130, "School content", ["The school's own content,", "retrieved per question"], mine=False)
s.line([(1160, 395), (1248, 395)], label="retrieve", lx=1204, ly=385)
s.box(830, 150, 330, 100, "Schedule pipeline", ["Keeps class schedules fresh", "in the chat"])
s.line([(995, 250), (995, 308)])
s.box(830, 560, 330, 110, "n8n on GCP", ["Bridges the chat to the", "school's systems"])
s.line([(995, 480), (995, 558)], label="lead + contact", lx=1005, ly=525, anchor="start")
s.box(830, 740, 330, 110, "Enrollment officers", ["Leads in priority buckets,", "bad leads flagged"], mine=False)
s.line([(995, 670), (995, 738)])
legend(s, 880, "drawn from christineValmyData.js and the ChekOut architecture board")
s.save(f"{OUT}/christine-valmy/architecture.svg")
print("ok")
