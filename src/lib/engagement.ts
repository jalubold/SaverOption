/**
 * Engagement data source for "Popular" rankings.
 *
 * Popularity must come from real measurements (outbound clicks recorded by
 * /go/[slug], or analytics exports) — never estimated or seeded by hand.
 * Until a store is connected this returns no data, and the homepage hides
 * the Popular section rather than showing invented numbers.
 */

export interface EngagementRecord {
  offerId: string;
  /** Outbound clicks in the reporting window. */
  clicks: number;
}

/** Minimum number of ranked offers before a "Popular" section is worth showing. */
export const MIN_POPULAR_OFFERS = 3;

export async function getTopOffersByEngagement(_windowDays = 30): Promise<EngagementRecord[]> {
  // TODO: read aggregated click counts from the analytics store.
  return [];
}

/**
 * Called by the outbound redirect for every click. No-op until a store is
 * connected — keep it fast and non-blocking when implemented.
 */
export async function recordOutboundClick(_event: {
  offerId: string;
  destination: "affiliate" | "official";
  referrer?: string | null;
}): Promise<void> {
  // TODO: persist to the analytics store (e.g. a Postgres table or event pipeline).
}
