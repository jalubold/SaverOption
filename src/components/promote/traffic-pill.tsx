"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

const countFormat = new Intl.NumberFormat("en-US");

/**
 * "N visitors today" pill linking to /stats. Uses the same public counter as the homepage
 * (/api/stats) and shows the real figure, however small; without one it still links to /stats.
 */
export function TrafficPill() {
  const [visitors, setVisitors] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { visitorsToday: number | null } | null) => !cancelled && setVisitors(s?.visitorsToday ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/stats"
      className="group inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface pl-2.5 pr-3 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <span aria-hidden="true" className="relative inline-flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c58b] opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-[#22c58b]" />
      </span>
      {visitors !== null ? (
        <span>
          <strong className="tabular font-semibold text-fg">{countFormat.format(visitors)}</strong> visitors today
        </span>
      ) : (
        <span>See live traffic stats</span>
      )}
      <Icon name="arrow-up-right" size={12} className="text-faint transition-colors group-hover:text-fg" />
    </Link>
  );
}
