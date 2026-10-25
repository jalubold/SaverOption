import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PromoteTrigger } from "@/components/promote/promote-modal";
import { BreakdownPanel, type PanelTab } from "@/components/stats/breakdown-panel";
import { TrafficChart } from "@/components/stats/daily-chart";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn, Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import {
  ANALYTICS_SINCE,
  DIMENSIONS,
  dimensionValueLabel,
  getTrafficStats,
  RANGES,
  statsHref,
  type Dimension,
  type RangeKey,
  type StatsQuery,
  type TrafficStats,
} from "@/lib/web-analytics";


export const statsMetadata = pageMetadata({
  title: "Traffic stats",
  description: `${siteConfig.name}'s audience in the open: visitors, pageviews, pages, traffic sources, countries and devices from Vercel Web Analytics.`,
  path: "/stats",
});

const num = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(iso));

/** The /stats page body for one range and set of filters. */
export async function StatsView({ q }: { q: StatsQuery }) {
  const result = await getTrafficStats(q);
  const activeFilters = Object.entries(q.filters) as [Dimension, string][];

  return (
    <div className="theme-dark bg-bg text-fg">
      <section className="hero-glow border-b border-line">
        <Container className="pb-8 pt-12 sm:pb-10 sm:pt-16">
          <p className="eyebrow">
            <span aria-hidden="true" className="relative inline-flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c58b] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#22c58b]" />
            </span>
            Live data
            <span aria-hidden="true">•</span>
            Source: <strong>Vercel Web Analytics</strong>
          </p>
          <h1 className="display mt-4 text-[2.75rem] sm:text-[4rem]">
            Traffic, <em>in the open.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
            Real audience numbers for advertisers and partners, counted by Vercel Web Analytics on {siteConfig.name}&apos;s
            production site. Filter by period, page, source, country or device.
          </p>

          {/* Toolbar: period + active filters */}
          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Period" className="-mx-1 overflow-x-auto px-1">
              <ul className="inline-flex rounded-full border border-line bg-surface p-1">
                {(Object.entries(RANGES) as [RangeKey, (typeof RANGES)[RangeKey]][]).map(([key, r]) => (
                  <li key={key}>
                    <Link
                      href={statsHref(q, { range: key })}
                      scroll={false}
                      aria-current={q.range === key ? "page" : undefined}
                      className={cn(
                        "inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-medium transition-colors sm:px-4",
                        q.range === key ? "bg-accent text-[var(--accent-contrast)] shadow-sm" : "text-muted hover:text-fg",
                      )}
                    >
                      <span className="sm:hidden">{r.short}</span>
                      <span className="hidden sm:inline">{r.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {activeFilters.length > 0 ? (
              <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
                {activeFilters.map(([dim, value]) => (
                  <li key={dim}>
                    <Link
                      href={statsHref(q, { unset: dim })}
                      scroll={false}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-accent/50 bg-accent/15 pl-3 pr-2 text-[13px] text-fg transition-colors hover:border-accent"
                    >
                      <span className="text-muted">{DIMENSIONS[dim].label}:</span>
                      <span className="max-w-[12rem] truncate font-medium">{dimensionValueLabel(dim, value)}</span>
                      <Icon name="x" size={14} className="text-muted" />
                      <span className="sr-only">Remove filter</span>
                    </Link>
                  </li>
                ))}
                {activeFilters.length > 1 && (
                  <li>
                    <Link href={statsHref(q, { unset: "all" })} scroll={false} className="inline-flex h-9 items-center px-2 text-[13px] font-medium text-accent-ink hover:underline">
                      Clear all
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-[13px] text-faint">Tip: click any row below to filter the whole dashboard.</p>
            )}
          </div>
        </Container>
      </section>

      <Container className="space-y-4 pb-24 pt-8 sm:space-y-5 sm:pt-10">
        {result.ok ? <Dashboard stats={result.stats} q={q} /> : <Unavailable reason={result.reason} />}

        <section
          aria-labelledby="advertise-heading"
          className="hero-glow !mt-12 overflow-hidden rounded-2xl border border-line bg-surface px-6 py-10 text-center sm:px-10 sm:py-12"
        >
          <h2 id="advertise-heading" className="display text-[2rem] sm:text-[2.6rem]">
            Reach these <em className="accent">visitors</em>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            List your software deal or talk to us about sponsored placements and partnerships.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <PromoteTrigger className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
              Promote your SaaS
              <Icon name="arrow-up-right" size={15} />
            </PromoteTrigger>
            <Link href="/partnerships" className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
              Partnerships
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

function Dashboard({ stats, q }: { stats: TrafficStats; q: StatsQuery }) {
  const { totals, previous } = stats;
  const periodLabel = q.range === "all" ? "since launch" : RANGES[q.range].label.toLowerCase();
  const buckets = Math.max(stats.series.length, 1);
  const avg = Math.round(stats.series.reduce((s, p) => s + p.visitors, 0) / buckets);

  // Rows link to the same view with that value added as a filter; the active value links back out.
  const tab = (id: Dimension, label: string, mono = false): PanelTab => ({
    id,
    label,
    mono,
    rows: stats.breakdowns[id].map((r) => {
      const active = q.filters[id] === r.value;
      return {
        label: r.label,
        visitors: r.visitors,
        active,
        href: r.other ? undefined : active ? statsHref(q, { unset: id }) : statsHref(q, { set: [id, r.value] }),
      };
    }),
  });

  return (
    <>
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile label="Visitors" value={num(totals.visitors)} delta={change(totals.visitors, previous?.visitors)} note={periodLabel} />
        <StatTile label="Pageviews" value={num(totals.pageviews)} delta={change(totals.pageviews, previous?.pageviews)} note={periodLabel} />
        <StatTile
          label="Pages per visitor"
          value={totals.visitors ? (totals.pageviews / totals.visitors).toFixed(1) : "–"}
          note="Pageviews ÷ visitors"
        />
        <StatTile
          label={stats.granularity === "hour" ? "Avg. visitors / hour" : "Avg. visitors / day"}
          value={num(avg)}
          note={stats.granularity === "hour" ? "Unique per hour" : "Unique per day"}
        />
      </section>

      <section className="rounded-[18px] border border-line bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-fg">Traffic over time</h2>
          <p className="text-xs text-muted">
            {fmtDate(stats.since)} – {fmtDate(stats.until)}
          </p>
        </div>
        <div className="mt-4">
          <TrafficChart points={stats.series} granularity={stats.granularity} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <BreakdownPanel tabs={[tab("requestPath", "Pages", true)]} />
        <BreakdownPanel tabs={[tab("referrerHostname", "Referrers"), tab("utmSource", "UTM sources")]} />
        <BreakdownPanel tabs={[tab("country", "Countries")]} />
        <BreakdownPanel tabs={[tab("deviceType", "Devices"), tab("browserName", "Browsers"), tab("osName", "OS")]} />
      </div>

      <p className="text-xs leading-relaxed text-faint">
        Figures come straight from Vercel Web Analytics (production traffic only, no cookies). Visitors are unique within
        the selected period; changes compare with the period of the same length just before it. Data starts on{" "}
        {fmtDate(`${ANALYTICS_SINCE}T00:00:00Z`)}, when analytics was switched on. Refreshed {fmtDate(stats.fetchedAt, true)} UTC
        and cached for up to an hour.
      </p>
    </>
  );
}

/** Percent change vs the previous period, or null when there is no comparable period. */
function change(current: number, previous: number | undefined): number | null {
  if (previous === undefined || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function StatTile({ label, value, note, delta = null }: { label: string; value: string; note: string; delta?: number | null }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">{label}</p>
      <p className="tabular mt-2 text-[2rem] font-semibold leading-none tracking-tight text-heading sm:text-[2.4rem]">{value}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        {delta !== null && (
          <span
            className={cn(
              "tabular inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              delta >= 0 ? "bg-[#22c58b]/15 text-[#5fe0a8]" : "bg-danger/15 text-danger",
            )}
          >
            <Icon name="arrow-up-right" size={11} className={cn(delta < 0 && "rotate-90")} />
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        <span>{note}</span>
      </p>
    </div>
  );
}

function Unavailable({ reason }: { reason: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <h2 className="text-lg font-semibold">Traffic stats are temporarily unavailable</h2>
      <p className="mt-1.5 text-sm text-muted">We couldn&apos;t load the latest numbers. Please check back shortly.</p>
      {/* A status code helps diagnose setup issues; it never includes the token. */}
      <p className="tabular mt-4 font-mono text-[11px] text-faint">Error: {reason}</p>
    </div>
  );
}
