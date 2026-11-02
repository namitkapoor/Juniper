/**
 * One place for a case study's short NAME ("ChekOut AI", "Christine Valmy",
 * "KYURI.OS"), used by chips, breadcrumbs, timeline links and cover labels,
 * so a deck/case TITLE ("Fewer tiles, more students") never leaks in as a name.
 * Source: the client before ":" in the home cover caption; else the title.
 */
const names = new Map();

export function setCaseNames(home, cases = []) {
  names.clear();
  for (const c of cases) {
    const cover = home?.fills?.find((f) => f.kind === "media" && f.src?.startsWith(`assets/${c.id}/`));
    const fromCaption = cover?.caption?.includes(":") ? cover.caption.split(":")[0].trim() : null;
    names.set(c.id, c.name || fromCaption || c.title);
  }
}

export const caseName = (id) => (id ? names.get(id) ?? id : "Other work");
