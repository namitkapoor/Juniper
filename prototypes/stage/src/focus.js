/**
 * Expanding a media fill is just another answer for the engine: the media at
 * full weight (it gets most of the stage at its real aspect), a text fill
 * with its caption as heading and `explain` as body, the KPI it proves, and
 * everything else at a fraction of its weight (compressed, or dropped behind
 * "+N more"). The stage morphs to it with the same stroke grammar.
 */
export function focusAnswer(answer, mediaId) {
  const m = answer.fills.find((f) => f.id === mediaId && f.kind === "media");
  if (!m) return answer;
  let kpi = null;
  if (typeof m.kpi === "string") kpi = answer.fills.find((f) => f.id === m.kpi && f.kind === "kpi") || null;
  else if (m.kpi && m.kpi.value != null && m.kpi.label) {
    kpi = { receipts: [], ...m.kpi, kind: "kpi", id: `${m.id}~kpi`, value: String(m.kpi.value) };
  }
  const fills = [{ ...m, caption: undefined, weight: 1, focused: true }];
  // Caption/explain and the KPI are a narrow strip at body size; the rest compress hard.
  if (m.explain) fills.push({ kind: "prose", id: `${m.id}~explain`, weight: 0.14, heading: m.caption, text: m.explain, receipts: [], small: true });
  else if (m.caption) fills.push({ kind: "prose", id: `${m.id}~explain`, weight: 0.12, text: m.caption, receipts: [], small: true });
  if (kpi) fills.push({ ...kpi, weight: 0.12 });
  for (const f of answer.fills) {
    if (f.id === m.id || f.id === kpi?.id) continue;
    fills.push({ ...f, weight: Math.max(0.02, f.weight * 0.04), recede: true });
  }
  return { ...answer, id: `${answer.id}~${m.id}`, fills, focus: m.id, base: answer.id };
}

/**
 * Proof / breakdown focus: the open cell owns the page. It keeps its weight
 * (the engine boosts an open list further), everything else recedes to a
 * fraction of its weight (compressed, or behind "+N more") and is dimmed.
 */
export function recedeAnswer(answer, openId) {
  if (!answer.fills.some((f) => f.id === openId)) return answer;
  const fills = answer.fills.map((f) => (f.id === openId ? { ...f, weight: 1 } : { ...f, weight: Math.max(0.02, f.weight * 0.3), recede: true }));
  return { ...answer, id: `${answer.id}~proof~${openId}`, fills, proof: openId };
}

/**
 * At most one "Go deeper" per target deck on a stage: the opener marked
 * `opensPrimary`, else the heaviest. Other tiles that open the same deck lose
 * the affordance (and its reserved space).
 */
export function dedupeOpens(answer) {
  const best = new Map();
  for (const f of answer.fills) {
    if (!f.opens) continue;
    const cur = best.get(f.opens);
    const better = !cur || (f.opensPrimary && !cur.opensPrimary) || (!!f.opensPrimary === !!cur.opensPrimary && (f.weight > cur.weight || (f.weight === cur.weight && f.id < cur.id)));
    if (better) best.set(f.opens, f);
  }
  if (![...answer.fills].some((f) => f.opens && best.get(f.opens) !== f)) return answer;
  return { ...answer, fills: answer.fills.map((f) => (f.opens && best.get(f.opens) !== f ? { ...f, opens: undefined } : f)) };
}
