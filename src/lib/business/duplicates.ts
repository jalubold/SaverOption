/**
 * Potential duplicate software records, found by explainable rules:
 *   1. same vendor and same category,
 *   2. one normalised name contains the other ("Zoom" / "Zoom Workplace"),
 *   3. the same website host.
 * Every pair is a candidate for someone to review — never a confirmed duplicate.
 * Archived records are ignored. Pure module, so Node tests run it directly.
 */
import { normalizeName } from "./calc.ts";

export interface DuplicateCandidate {
  id: string;
  name: string;
  vendorId: string | null;
  category: string;
  website: string | null;
  status: string;
}

export interface DuplicatePair {
  a: DuplicateCandidate;
  b: DuplicateCandidate;
  reasons: string[];
}

function host(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Shortest normalised name that can count as "contained" — avoids matching on fragments like "go". */
const MIN_CONTAINED = 3;

export function findPotentialDuplicates(items: DuplicateCandidate[], categoryLabel: (category: string) => string = (c) => c): DuplicatePair[] {
  const live = items.filter((i) => i.status !== "archived");
  const pairs: DuplicatePair[] = [];
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i];
      const b = live[j];
      const reasons: string[] = [];
      if (a.vendorId && a.vendorId === b.vendorId && a.category === b.category) reasons.push(`Same vendor and category (${categoryLabel(a.category)})`);
      const na = normalizeName(a.name);
      const nb = normalizeName(b.name);
      const [short, long] = na.length <= nb.length ? [na, nb] : [nb, na];
      if (short.length >= MIN_CONTAINED && (long === short || ` ${long} `.includes(` ${short} `))) reasons.push(`Similar names (“${a.name}” and “${b.name}”)`);
      const ha = host(a.website);
      if (ha && ha === host(b.website)) reasons.push(`Same website (${ha})`);
      if (reasons.length) pairs.push({ a, b, reasons });
    }
  }
  return pairs.sort((x, y) => y.reasons.length - x.reasons.length || x.a.name.localeCompare(y.a.name));
}
