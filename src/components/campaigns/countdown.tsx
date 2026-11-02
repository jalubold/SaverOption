"use client";

import { useEffect, useState } from "react";

/**
 * Days, hours, minutes and seconds until a sale starts, then until it ends. The first render uses the
 * time the page was made (so server and browser agree), then it ticks every second.
 */
export function Countdown({ startsAt, endsAt, renderedAt, label }: { startsAt: string; endsAt: string; renderedAt: number; label: { before: string; live: string; after: string } }) {
  const [now, setNow] = useState(renderedAt);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- switch from the page's time to the browser's, after hydration
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const phase = now < start ? "before" : now <= end ? "live" : "after";
  if (phase === "after") return <p className="text-[14px] font-medium text-muted" data-countdown="after">{label.after}</p>;

  const left = Math.max(0, (phase === "before" ? start : end) - now);
  const parts: [number, string][] = [
    [Math.floor(left / 86_400_000), "days"],
    [Math.floor(left / 3_600_000) % 24, "hours"],
    [Math.floor(left / 60_000) % 60, "min"],
    [Math.floor(left / 1000) % 60, "sec"],
  ];
  return (
    <div data-countdown={phase}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{phase === "before" ? label.before : label.live}</p>
      <ol className="mt-2 flex gap-2" aria-label={`${parts[0][0]} days, ${parts[1][0]} hours and ${parts[2][0]} minutes`}>
        {parts.map(([n, unit]) => (
          <li key={unit} className="flex min-w-[58px] flex-col items-center rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2" aria-hidden="true">
            <span className="tabular text-[22px] font-semibold leading-none text-heading">{String(n).padStart(2, "0")}</span>
            <span className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-faint">{unit}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
