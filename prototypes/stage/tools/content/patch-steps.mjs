// Load-modify-save: one number per deck, no headline-repeating media kpis, and CV testing as numbered steps.
import fs from "node:fs";
const D = "/Users/namit/Documents/personal/code/Juniper/.worktrees/stage-proto/prototypes/stage/src/data";
const load = (f) => JSON.parse(fs.readFileSync(`${D}/${f}`, "utf8"));
const save = (f, v) => fs.writeFileSync(`${D}/${f}`, JSON.stringify(v, null, 2) + "\n");
const decks = load("decks.json");
const deck = (id) => decks.find((d) => d.id === id);
const fill = (d, id) => d.fills.find((f) => f.id === id);
const drop = (d, ...ids) => { d.fills = d.fills.filter((f) => !ids.includes(f.id)); };
const CV_DATA = { type: "asset", ref: "src/data/christineValmyData.js", repo: "Juniper", date: "2026-10-26", label: "Christine Valmy case study, chapters 01 to 03" };

// ---------------- ChekOut: outcomes
{
  const d = deck("ck-merchant-outcomes");
  d.thesis = "On Kivakube the agent sells inside the conversation, and the dashboard shows the merchant the questions behind each sale.";
  const eng = fill(d, "ck-engagement");
  const m = fill(d, "ck-top-metrics");
  if (eng && m) {
    // The engagement rate is visible in this capture, so it lives on the asset, not in a second fill.
    m.kpi = { value: eng.value, label: eng.label, receipts: eng.receipts };
    drop(d, "ck-engagement");
  }
  m.caption = "One live store's top line: visitors, engagement, and the order and revenue the agent drove.";
}
// ---------------- ChekOut: build (the 8-merchant count and logos live in the outcomes deck)
{
  const d = deck("ck-platform-build");
  d.thesis = "A merchant types one brand color, previews the real widget, pastes one snippet and is live; I built the builder and the widget mostly with Claude Code.";
  drop(d, "ap-merchants", "ap-live-logos");
}
// ---------------- Christine Valmy: results
{
  const d = deck("cv-results");
  d.thesis = "The agent more than doubled visitor conversion, brought in enrolled revenue, and gave each officer hours back every day.";
}
// ---------------- Christine Valmy: testing, as a numbered sequence (christineValmyData.js ch. 01 to 03)
{
  const d = deck("cv-testing");
  d.thesis = "Testing showed students skipped my tile grid and went looking for Instagram, so I cut it and fixed one problem per session until the bilingual version shipped.";
  drop(d, "cv-testing-payoff");
  const OF = 6;
  const set = (id, n, stage, status, caption, explain, weight) => {
    const f = fill(d, id);
    if (!f) throw new Error("missing " + id);
    delete f.kpi;
    Object.assign(f, { step: { n, of: OF, stage, status }, caption, explain, weight });
    return f;
  };
  const cut = fill(d, "cv-cut");
  cut.text = "WHAT TESTING FOUND: Students skipped the tiles and kept asking \"Do you have Instagram?\" The tiles read as marketing; photos from real students did not. I cut the grid and the ID card, kept the form, the chat and the social links, then fixed one thing per session.";
  cut.weight = 0.95;
  fill(d, "cv-maria").weight = 0.85;

  const bento = set("cv-bento", 1, "First concept", "cut",
    "Step 1, first concept: every topic one tap from the chat. Testing cut it.",
    "Where it started: green tiles for pricing, courses, alumni and schedules around the chat, so every tap would tell officers what a student cared about. Students went past the tiles and asked for Instagram instead, so the grid and the ID card were cut. What survived was a short form, the chat and the social links.", 0.8);
  const ddb = set("cv-dd-before", 2, "Session 1, before", "cut",
    "Step 2, session 1 before: students read the dropdowns as suggested topics.",
    "The first version after the cut. I had put location and course dropdowns beside the message box because structured values were easier to parse. In session one students read them as suggested topics and stopped typing their own question, so they went.", 0.6);
  const dda = set("cv-dd-after", 3, "Session 1, after", "tested",
    "Step 3, session 1 after: one message box, no dropdowns.",
    "What changed from step 2: the dropdowns are gone, and the agent picks location and course out of what the student types. Students just ask.", 0.6);
  let sb = fill(d, "cv-social-before");
  if (!sb) {
    sb = { kind: "media", id: "cv-social-before", weight: 0.55, media: "image", src: "assets/christine-valmy/social-before.webp", aspect: 1.7778,
      alt: "Chat with topic buttons, social links in a left column and an enrollment form link on the right",
      receipts: [{ type: "asset", ref: "assets/christine-valmy/social-before.webp", repo: "Juniper", label: "public/images/Case Studies/CV/cv-social-before-16x9.jpg" }, CV_DATA] };
    d.fills.push(sb);
  }
  set("cv-social-before", 4, "Session 2, before", "cut",
    "Step 4, session 2 before: the social links sat in a side column.",
    "Going into session two the social links lived in a column beside the chat. Students wanted Instagram right after chatting, and the side column was not where they looked, so the column was cut.", 0.55);
  const fin = set("cv-final", 5, "Session 2, after", "tested",
    "Step 5, session 2 after: the social links move to a row under the chat.",
    "What changed from step 4: the links moved from the side column to a row directly under the chat, where students finish a conversation. The page is now the three pieces that survived step 1: a short form, the chat and the social links.", 0.7);
  const es = set("cv-spanish", 6, "Session 3, shipped", "shipped",
    "Step 6, session 3: the form and the agent switch to Spanish. This version shipped.",
    "What changed from step 5: many applicants spoke Spanish first, so the agent and every label now work in both languages, not just the replies. This bilingual version is the one that shipped.", 0.7);
  // Order: problem, finding, quote, then the steps in order.
  const head = ["cv-0-test-problem", "cv-cut", "cv-maria"].map((id) => fill(d, id));
  const steps = [bento, ddb, dda, sb, fin, es];
  const rest = d.fills.filter((f) => !head.includes(f) && !steps.includes(f));
  d.fills = [...head, ...steps, ...rest];
}
// ---------------- KYURI.OS: live
{
  const d = deck("ky-live");
  d.thesis = "Yes: it has run my search since April 2026, and the public Job Hunt page shows the live totals with companies and people left out.";
  delete fill(d, "ky-jobhunt-shot").kpi; // the totals already have their own fills
}
// ---------------- other work
{
  const d = deck("other-agents");
  // Lead with use, not with each case study's headline outcome, which their own decks carry.
  const ck = fill(d, "oa-ck");
  Object.assign(ck, { value: "13,981", label: "shopper sessions with the ChekOut agent, across 22 brands", period: "Feb to Jul 2026",
    receipts: [{ type: "asset", ref: "src/data/chekoutData.js", repo: "Juniper", date: "2026-10-26", label: "ChekOut AI case study" }] });
  delete ck.breakdown;
  const cv = fill(d, "oa-cv");
  Object.assign(cv, { value: "~3 hrs", label: "saved per Christine Valmy enrollment officer, per day",
    receipts: [{ type: "asset", ref: "src/data/christineValmyData.js", repo: "Juniper", date: "2026-10-26", label: "Christine Valmy case study" }] });
  delete fill(d, "oa-ck-video").kpi;
}
{
  const d = deck("other-qa");
  const p = fill(d, "qa-kyuri");
  p.text = p.text.replace(/with a 418/g, "with a refusal").replace(/\b418\b/g, "a refusal");
}
{
  const d = deck("other-research");
  d.thesis = "Yes, and it changed the designs: task analysis reshaped how My Influency tracks influencers, and usability testing lifted the Manage Small Farms redesign.";
  delete fill(d, "re-im").kpi;
  const farms = fill(d, "re-farms");
  delete farms.kpi;
  const im = fill(d, "re-im");
  for (const f of [farms, im]) if (f.explain) f.explain = f.explain;
}
save("decks.json", decks);
console.log("ok");
