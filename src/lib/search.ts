import type { OfferView } from "@/lib/types";

/**
 * In-memory keyword search with field weighting. Every query term must
 * match the start of a word somewhere in the offer (AND semantics), so
 * "ai" matches "AI tools" but not "email".
 *
 * Fine for a catalog of a few thousand offers. Beyond that, swap the body
 * of `scoreOffer`/`searchOffers` for Postgres full-text search or a hosted
 * index — callers only depend on the function signature.
 */

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9$%.+#-]+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter(Boolean);
}

interface IndexedField {
  words: string[];
  weight: number;
}

const indexCache = new WeakMap<OfferView, IndexedField[]>();

function indexOffer(offer: OfferView): IndexedField[] {
  const cached = indexCache.get(offer);
  if (cached) return cached;
  const fields: [string, number][] = [
    [offer.product.name, 10],
    [offer.title, 5],
    [offer.product.tags.join(" "), 4],
    [offer.categoryList.map((c) => c.name).join(" "), 3],
    [offer.provider.name, 3],
    [offer.product.tagline, 2],
    [offer.summary, 2],
    [offer.description, 1],
  ];
  const indexed = fields.map(([text, weight]) => ({ words: tokenize(text), weight }));
  indexCache.set(offer, indexed);
  return indexed;
}

export function scoreOffer(offer: OfferView, terms: string[]): number {
  if (terms.length === 0) return 0;
  const fields = indexOffer(offer);
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const field of fields) {
      for (const word of field.words) {
        if (word === term) best = Math.max(best, field.weight * 1.5);
        else if (word.startsWith(term)) best = Math.max(best, field.weight);
      }
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}
