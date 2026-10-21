"use client";

import { useEffect, useState } from "react";

interface Stats {
  visitorsToday: number | null;
  dealsOpenedToday: number | null;
}

const fmt = new Intl.NumberFormat("en-US");

/**
 * Live "visitors today" figure from /api/stats. Shows the real measured count,
 * however small; renders nothing only when no count is available.
 */
export function VisitorsToday({ separator = true }: { separator?: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Stats | null) => !cancelled && setStats(s))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Zero is a real figure too; only hide when nothing was measured.
  if (stats?.visitorsToday == null) return null;
  return (
    <>
      {separator && <span aria-hidden="true">•</span>}
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
        <strong className="tabular">{fmt.format(stats.visitorsToday)}</strong> visitors today
      </span>
    </>
  );
}
