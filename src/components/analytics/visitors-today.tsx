"use client";

import { useEffect, useState } from "react";

interface Stats {
  visitorsToday: number | null;
  dealsOpenedToday: number | null;
}

const fmt = new Intl.NumberFormat("en-US");

/**
 * Live "visitors today" figure from /api/stats. Renders nothing until a real,
 * measured count above the display threshold exists.
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

  if (!stats?.visitorsToday) return null;
  return (
    <>
      {separator && <span aria-hidden="true">•</span>}
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
        <strong className="tabular">{fmt.format(stats.visitorsToday)}</strong> visitors today
      </span>
      {stats.dealsOpenedToday ? (
        <>
          <span aria-hidden="true">•</span>
          <strong className="tabular">{fmt.format(stats.dealsOpenedToday)}</strong> deals opened
        </>
      ) : null}
    </>
  );
}
