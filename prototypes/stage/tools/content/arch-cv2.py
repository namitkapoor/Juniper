exec(open("/private/tmp/claude-501/-Users-namit-Documents-kyuri-dashboard/cb7d3ac0-c58e-453b-8bb4-32bf6a48924d/scratchpad/arch.py").read().split("# ---------------------------------------------------------------- KYURI.OS")[0])
# --- Architecture (replaces the earlier CV diagram)
s = Svg(1600, 900)
s.text(48, 60, "CHRISTINE VALMY · ENROLLMENT AGENT", 13, MUTE, mono=True, ls=2)
s.text(48, 96, "A widget on the school's WordPress site talks to n8n; n8n reaches the agent, and finished chats become leads.", 19, INK)
s.box(48, 330, 260, 130, "Prospective students", ["English or Spanish,", "on phone or desktop"], mine=False)
s.box(390, 300, 320, 190, "Widget (WordPress plugin)", ["React chat and inquiry form,", "both languages, WCAG AA,", "reCAPTCHA v3 on each message"])
s.line([(308, 395), (388, 395)], label="ask", lx=348, ly=385)
s.box(800, 170, 330, 150, "n8n chat webhook", ["Message in; reply and the", "conversation stage out"], mine=False)
s.line([(710, 340), (755, 340), (755, 245), (798, 245)])
s.box(1220, 170, 332, 150, "Agent Cloud Function", ["Teammate's code; persona and", "prompt mine; answers through", "RAG on the school's content"], mine=False)
s.line([(1130, 245), (1218, 245)], label="query", lx=1174, ly=235)
s.box(1220, 30, 332, 110, "Schedule pipeline", ["Keeps class schedules", "fresh in the agent"])
s.line([(1386, 140), (1386, 168)])
s.box(800, 420, 330, 150, "n8n transcript webhook", ["Full chat when it ends:", "stage reached, tab closed", "or widget closed"], mine=False)
s.line([(710, 450), (755, 450), (755, 495), (798, 495)])
s.box(1220, 420, 332, 150, "Lead for officers", ["Priority bucket,", "bad leads flagged"], mine=False)
s.line([(1130, 495), (1218, 495)], label="lead", lx=1174, ly=485)
s.box(800, 660, 330, 130, "Creatio CRM", ["The school's CRM: the inquiry", "form creates a lead"], mine=False)
s.line([(550, 490), (550, 725), (798, 725)], label="inquiry form", lx=560, ly=712, anchor="start")
legend(s, 870, "drawn from the plugin code (cv-chat-flat) and the ChekOut architecture board")
s.save(f"{OUT}/christine-valmy/architecture.svg")

# --- The bridge: the three webhooks in order
s = Svg(1600, 760)
s.text(48, 60, "CHRISTINE VALMY · THE BRIDGE", 13, MUTE, mono=True, ls=2)
s.text(48, 96, "Three calls leave the widget: one per message, one when the chat ends, one when the form is sent.", 19, INK)
rows = [
  (170, "1 · Each message", ["query, user and thread ids,", "history, reCAPTCHA v3 token"], "n8n chat webhook", ["reply, conversation stage,", "enrollment state, complete?"]),
  (360, "2 · When the chat ends", ["full transcript, completion", "reason, message count, page"], "n8n transcript webhook", ["sent once per reason; sendBeacon", "if the tab is closing"]),
  (550, "3 · The inquiry form", ["name, contact details,", "location and language"], "Creatio CRM webhook", ["creates the lead in the", "school's CRM"]),
]
for y, a, al, b, bl in rows:
    s.box(48, y, 420, 140, a, al)
    s.box(620, y, 420, 140, b, bl, mine=False)
    s.line([(468, y + 70), (618, y + 70)])
s.box(1180, 360, 372, 140, "Lead for officers", ["n8n answers whether a lead", "was generated; the widget", "stops sending after that"], mine=False)
s.line([(1040, 430), (1178, 430)], label="lead", lx=1109, ly=420)
s.text(1180, 560, "Stages that end a chat: enrollment collection,", 13, MUTE, mono=True)
s.text(1180, 580, "completion, post enrollment.", 13, MUTE, mono=True)
legend(s, 735, "drawn from christine-valmy-floating.js and claude.md in the plugin")
s.save(f"{OUT}/christine-valmy/bridge.svg")
print("ok")
