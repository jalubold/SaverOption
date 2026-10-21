"use client";

import { useEffect } from "react";

/** Counts one listing page view (deduplicated per visitor per day on the server). Bots without JS never send it. */
export function ListingViewBeacon({ id }: { id: string }) {
  useEffect(() => {
    const body = JSON.stringify({ id });
    if (!navigator.sendBeacon?.("/api/listings/view", new Blob([body], { type: "application/json" }))) {
      fetch("/api/listings/view", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  }, [id]);
  return null;
}
