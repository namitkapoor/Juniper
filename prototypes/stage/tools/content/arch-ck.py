# Redraws three ChekOut FigJam frames as dark hairline SVGs, in the style of arch.py.
# Run: python3 tools/content/arch-ck.py
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, "arch.py")).read().split("# ---------------------------------------------------------------- KYURI.OS")[0])

BODY_K, TITLE_K, MONO_K = 0.55, 0.58, 0.6   # conservative em widths per char
PAD = 16

def wrap(text, w, size=14.5):
    cap = int((w - 2 * PAD) / (size * BODY_K))
    out, cur = [], ""
    for word in text.split():
        nxt = (cur + " " + word).strip()
        if len(nxt) <= cap: cur = nxt
        else:
            assert len(word) <= cap, f"word too long for box: {word}"
            out.append(cur); cur = word
    if cur: out.append(cur)
    return out

def height(n): return 55 + 21 * n

def node(s, x, y, w, title, text, mine, tag=None, h=None):
    assert len(title) * 18 * TITLE_K <= w - 2 * PAD, f"title too wide: {title}"
    lines = wrap(text, w)
    need = height(len(lines))
    h = h or need
    assert need <= h, f"{title}: needs {need}, has {h}"
    s.box(x, y, w, h, title, lines, mine=mine)
    if tag:  # provenance marker sitting on the top border, right side
        tw = len(tag) * 12.5 * MONO_K
        tx = x + w - 14
        s.parts.append(f'<rect x="{tx - tw - 6:.1f}" y="{y - 9}" width="{tw + 12:.1f}" height="18" fill="{BG}"/>')
        s.text(tx, y + 4, tag, 12.5, MUTE, mono=True, anchor="end")
    return dict(x=x, y=y, w=w, h=h, cx=x + w / 2, cy=y + h / 2, r=x + w, b=y + h)

def lab(s, x, y, lines, anchor="middle"):
    """Stacked edge label; y is the baseline of the LAST line (sits just above a line)."""
    if isinstance(lines, str): lines = [lines]
    for i, t in enumerate(lines):
        s.text(x, y - (len(lines) - 1 - i) * 16, t, 12.5, MUTE, mono=True, anchor=anchor)

def header(s, kicker, thesis):
    s.text(48, 60, kicker, 13, MUTE, mono=True, ls=2)
    assert len(thesis) * 19 * 0.52 <= s.w - 96, "thesis too long"
    s.text(48, 96, thesis, 19, INK)

def cols(w, n=4):
    gap = (1504 - n * w) / (n - 1)
    return [48 + i * (w + gap) for i in range(n)], gap

OUTCK = f"{OUT}/chekout"

# ---------------------------------------------------------------- 1 · System context
W = 270
C, G = cols(W)
s = Svg(1600, 790)
header(s, "CHEKOUT AI · SYSTEM CONTEXT",
       "Merchants and shoppers both come in through one front end, which calls the Langflow agents and the backend services.")
H = 130
merch = node(s, C[0], 170, W, "Merchants", "Install from the Shopify or Shopline app stores, then build and run agents", False, "[notes]", H)
lang = node(s, C[2], 170, W, "Langflow agents", "Per-merchant flow via /run; built on Vertex AI with RAG Engine", True, "[code + notes]", H)
y2 = 370
fe = node(s, C[1], y2, W, "ChekOut front end", "Next.js + MUI merchant app; also serves chatbot.js and the /chatbot/embed page", True, "[code]", H)
be = node(s, C[2], y2, W, "Backend services", "Cloud Run APIs: auth, onboarding, store sync, CRM, billing; FastAPI and Node", True, "[code + notes]", H)
com = node(s, C[3], y2, W, "Commerce platforms", "Shopify (OAuth in code); Shopline, WooCommerce", False, "[code + notes]", H)
y3 = 570
shop = node(s, C[0], y3, W, "Shoppers", "Storefront visitors who chat with a merchant's agent", False, "[notes]", H)
db = node(s, C[2], y3, W, "Postgres + BigQuery", "Operational data in Postgres; long-term logs in BigQuery", False, "[notes]", H)
# merchants -> front end
s.line([(merch["cx"], merch["b"]), (merch["cx"], fe["cy"] - 30), (fe["x"] - 2, fe["cy"] - 30)])
lab(s, merch["cx"] + 12, (merch["b"] + fe["cy"] - 30) / 2 + 5, "build & manage agents", "start")
# shoppers -> front end
s.line([(shop["r"], shop["cy"]), (fe["cx"], shop["cy"]), (fe["cx"], fe["b"] + 2)])
lab(s, (shop["r"] + fe["cx"]) / 2, shop["cy"] - 10, "chat on storefront")
# front end -> langflow
s.line([(fe["cx"], fe["y"]), (fe["cx"], lang["cy"]), (lang["x"] - 2, lang["cy"])])
lab(s, (fe["cx"] + lang["x"]) / 2, lang["cy"] - 10, "chat messages")
# front end -> backend
s.line([(fe["r"], be["cy"]), (be["x"] - 2, be["cy"])])
lab(s, (fe["r"] + be["x"]) / 2, be["cy"] - 10, ["REST +", "Firebase", "ID token"])
# backend -> commerce
s.line([(be["r"], com["cy"]), (com["x"] - 2, com["cy"])])
lab(s, (be["r"] + com["x"]) / 2, com["cy"] - 10, ["OAuth,", "product sync"])
# backend -> data
s.line([(be["cx"], be["b"]), (be["cx"], db["y"] - 2)])
lab(s, be["cx"] + 12, (be["b"] + db["y"]) / 2 + 5, "read / write", "start")
legend(s, 765, "drawn from FigJam: 1 · System context")
s.save(f"{OUTCK}/system-context.svg")

# ---------------------------------------------------------------- 2 · Onboarding & agent builder
W = 280
C, G = cols(W)
s = Svg(1600, 640)
header(s, "CHEKOUT AI · ONBOARDING & AGENT BUILDER",
       "A merchant goes from an app-store install to a live agent in three steps; store OAuth and product sync run inside step 1.")
H = 150
y1, y2 = 170, 400
inst = node(s, C[0], y1, W, "App-store install", "Shopify and Shopline listings; embedded Shopify app", True, "[notes]", H)
st1 = node(s, C[1], y1, W, "Step 1 · AI Persona", "Agent name, store URL, tone, platform; Connect starts store sync", True, "[code]", H)
oauth = node(s, C[2], y1, W, "Store OAuth", "generate-url, consent, /sync/[platform]/callback, /api/oauth/complete with hmac + state; signed-state CSRF check", True, "[code + notes]", H)
sync = node(s, C[3], y1, W, "Product sync", "Platform webhooks push product changes; per-product connections fixed, about 30 s down to ms", True, "[notes]", H)
st2 = node(s, C[1], y2, W, "Step 2 · Knowledge Base", "Upload pdf, txt, doc, csv, json up to 10 MB via a signed upload URL", True, "[code]", H)
prov = node(s, C[2], y2, W, "Agent provisioning", "POST /agents/create; a prompt generated from the storefront, which the merchant can edit", True, "[code + notes]", H)
st3 = node(s, C[3], y2, W, "Step 3 · Channel", "Widget styling + embed snippet; progress via SSE, with polling as the fallback", True, "[code + notes]", H)
for a, b, t in ((inst, st1, "opens app"), (st1, oauth, "Connect"), (oauth, sync, ["store", "authorized"]),
                (st2, prov, "createAgent"), (prov, st3, ["progress", "events"])):
    s.line([(a["r"], a["cy"]), (b["x"] - 2, b["cy"])])
    lab(s, (a["r"] + b["x"]) / 2, a["cy"] - 10, t)
s.line([(st1["cx"], st1["b"]), (st1["cx"], st2["y"] - 2)])
lab(s, st1["cx"] + 12, (st1["b"] + st2["y"]) / 2 + 5, "Save and Next", "start")
legend(s, 615, "drawn from FigJam: 2 · Onboarding & agent builder")
s.save(f"{OUTCK}/onboarding-flow.svg")

# ---------------------------------------------------------------- 5 · Data & observability
W = 300
C, G = cols(W)
s = Svg(1600, 790)
header(s, "CHEKOUT AI · DATA & OBSERVABILITY",
       "Every chat turn is logged and streamed into BigQuery; my daily DAG and notebooks turn those rows into reports.")
H = 130
y1, y2, y3 = 170, 370, 570
logg = node(s, C[1], y1, W, "Cloud Logging", "Structured log entries per event and error", False, "[code]", H)
ma = node(s, C[3], y1, W, "Merchant analytics", "Databricks notebooks (sentiment, intent), then migrated to BigQuery-backed APIs", True, "[code]", H)
chat = node(s, C[0], y2, W, "Chat agent functions", "Cloud Functions log each turn as structured JSON: latency, stage, model. A teammate's code", False, "[code]", H)
bq = node(s, C[2], y2, W, "BigQuery", "Long-term store: the conversation logs dataset", False, "[code]", H)
air = node(s, C[3], y2, W, "Airflow on Composer", "Daily aggregated reporting DAG", True, "[notes]", H)
ins = node(s, C[1], y3, W, "BigQuery streaming insert", "insert_rows_json per message; a Pub/Sub logger variant. A teammate's code", False, "[code]", H)
look = node(s, C[3], y3, W, "Looker Studio reports", "Usage by hour, pricing inquiries, program interest, chat fall-off", True, "[notes]", H)
# chat -> logging / insert
s.line([(chat["cx"], chat["y"]), (chat["cx"], logg["cy"]), (logg["x"] - 2, logg["cy"])])
lab(s, (chat["cx"] + logg["x"]) / 2, logg["cy"] - 10, "log_struct")
s.line([(chat["cx"], chat["b"]), (chat["cx"], ins["cy"]), (ins["x"] - 2, ins["cy"])])
lab(s, (chat["cx"] + ins["x"]) / 2, ins["cy"] - 10, "per-message row")
# logging -> bq, insert -> bq
s.line([(logg["r"], logg["cy"]), (bq["cx"], logg["cy"]), (bq["cx"], bq["y"] - 2)])
lab(s, (logg["r"] + bq["cx"]) / 2, logg["cy"] - 10, "pipeline [notes]")
s.line([(ins["r"], ins["cy"]), (bq["cx"], ins["cy"]), (bq["cx"], bq["b"] + 2)])
lab(s, (ins["r"] + bq["cx"]) / 2, ins["cy"] - 10, "rows")
# bq -> airflow (lower), bq -> merchant analytics (upper, via the gap)
yd = bq["b"] - 32
s.line([(bq["r"], yd), (air["x"] - 2, yd)])
lab(s, (bq["r"] + air["x"]) / 2, yd - 10, "daily DAG")
vx = (bq["r"] + air["x"]) / 2
s.line([(bq["r"], bq["y"] + 32), (vx, bq["y"] + 32), (vx, ma["cy"]), (ma["x"] - 2, ma["cy"])])
lab(s, vx + 12, (ma["b"] + air["y"]) / 2 + 5, "queried on demand", "start")
# airflow -> looker
s.line([(air["cx"], air["b"]), (air["cx"], look["y"] - 2)])
lab(s, air["cx"] + 12, (air["b"] + look["y"]) / 2 + 5, "aggregates", "start")
legend(s, 765, "drawn from FigJam: 5 · Data & observability")
s.save(f"{OUTCK}/data-observability.svg")
print("ok")
