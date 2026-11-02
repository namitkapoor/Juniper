/**
 * Diff two layouts' strokes for the morph. Strokes are matched by id, which
 * encodes tree path + axis + cut index, so "the root's first vertical cut"
 * survives a re-layout and slides instead of being redrawn.
 *   kept:    in both -> slide from old geometry to new
 *   removed: only old -> retract toward their origin
 *   added:   only new -> draw in from their origin, in `order`
 */
export function diffStrokes(prev = [], next = []) {
  const old = new Map(prev.map((s) => [s.id, s]));
  const kept = [], added = [];
  for (const s of next) {
    const o = old.get(s.id);
    if (o) { kept.push({ from: o, to: s }); old.delete(s.id); } else added.push(s);
  }
  return { kept, added, removed: [...old.values()] };
}
