"use client";

import { useEffect, useRef, useState } from "react";
import { OfferGrid } from "@/components/offers/offer-card";
import { buttonClass } from "@/components/ui/primitives";
import type { OfferView } from "@/lib/types";

/**
 * The rest of a category or collection page's cards, after the first FIRST_CARDS the page renders
 * itself: one click loads them (from /api/offers, cached at the CDN) and shows them right below,
 * in the same grid and order. Keeping them out of the page keeps each cached copy of it small.
 */
export function MoreOffers({
  source,
  total,
  headingLevel,
}: {
  source: { category: string } | { audience: string };
  /** Every card on the page, including the ones already shown. */
  total: number;
  headingLevel?: "h2" | "h3";
}) {
  const [offers, setOffers] = useState<OfferView[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard and screen reader users land on the first card that just appeared, not on <body>.
  useEffect(() => {
    if (offers) listRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
  }, [offers]);

  async function load() {
    setState("loading");
    try {
      const query = "category" in source ? `category=${encodeURIComponent(source.category)}` : `audience=${encodeURIComponent(source.audience)}`;
      const res = await fetch(`/api/offers?${query}`);
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { offers: OfferView[] };
      setOffers(body.offers);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (offers) {
    return (
      <div ref={listRef} className="mt-5">
        <OfferGrid offers={offers} headingLevel={headingLevel} />
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <button type="button" onClick={load} disabled={state === "loading"} aria-busy={state === "loading"} className={buttonClass("secondary", "md")}>
        {state === "loading" ? "Loading offers…" : `Show all ${total} offers`}
      </button>
      {state === "error" && (
        <p role="status" className="text-sm text-muted">
          The rest of the offers couldn&apos;t be loaded. Please try again.
        </p>
      )}
    </div>
  );
}
