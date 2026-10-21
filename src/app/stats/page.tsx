import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PromoteSaasTrigger } from "@/components/promote/promote-saas";
import { DailyChart } from "@/components/stats/daily-chart";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { ANALYTICS_SINCE, getTrafficStats, type Breakdown } from "@/lib/web-analytics";

// Re-render at most hourly; the API responses are cached for the same period.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Traffic stats",
  description: `${siteConfig.name}'s audience in the open: visitors, pageviews, countries and traffic sources from Vercel Web Analytics, updated hourly.`,
  path: "/stats",
});

const num = (n: number) => n.toLocaleString("en-US");
const date = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`));

export default async function StatsPage() {
  const stats = await getTrafficStats();

  return (
    <>
      <section className="theme-dark hero-glow border-b border-line bg-bg">
        <Container className="py-12 sm:py-16">
          <Eyebrow>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22c58b]" />
            Live data
            <span aria-hidden="true">•</span>
            Updated hourly
            <span aria-hidden="true">•</span>
            Source: <strong>Vercel Web Analytics</strong>
          </Eyebrow>
          <h1 className="display mt-4 text-[2.75rem] sm:text-[4rem]">
            Traffic, <em>in the open.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
            Real audience numbers for advertisers and partners, counted by Vercel Web Analytics on {siteConfig.name}&apos;s
            production site.
            {stats && (
              <>
                {" "}
                Showing {date(stats.since)} – {date(stats.until)}.
              </>
            )}
          </p>
        </Container>
      </section>

      <Container className="space-y-6 pb-24 pt-10 sm:pt-14">
        {stats ? (
          <>
            <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatTile label="Visitors" value={num(stats.visitors)} note={`Last ${stats.days} ${stats.days === 1 ? "day" : "days"}`} />
              <StatTile label="Pageviews" value={num(stats.pageviews)} note={`Last ${stats.days} ${stats.days === 1 ? "day" : "days"}`} />
              <StatTile
                label="Pages per visitor"
                value={stats.visitors ? (stats.pageviews / stats.visitors).toFixed(1) : "–"}
                note="Pageviews ÷ visitors"
              />
              <StatTile
                label="Avg. daily visitors"
                value={num(Math.round(stats.daily.reduce((s, d) => s + d.visitors, 0) / Math.max(stats.days, 1)))}
                note="Unique per day"
              />
            </section>

            <Card title="Daily visitors" subtitle={`Unique visitors per day (UTC), ${date(stats.since)} – ${date(stats.until)}`}>
              <DailyChart days={stats.daily} />
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="Top countries" subtitle="By visitors">
                <BarList rows={stats.countries} />
              </Card>
              <Card title="Traffic sources" subtitle="Referring sites, by visitors">
                <BarList rows={stats.referrers} />
              </Card>
              <Card title="Top pages" subtitle="By pageviews">
                <BarList rows={stats.pages} metric="pageviews" mono />
              </Card>
              <Card title="Devices" subtitle="By visitors">
                <BarList rows={stats.devices} />
              </Card>
            </div>

            <p className="text-xs leading-relaxed text-faint">
              Figures come straight from Vercel Web Analytics (production traffic only, no cookies). Visitors are
              counted per day, so a person who returns on another day counts again. Data starts on {date(ANALYTICS_SINCE)},
              when analytics was switched on. Last refreshed{" "}
              {new Intl.DateTimeFormat("en-US", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }).format(new Date(stats.fetchedAt))} UTC.
            </p>
          </>
        ) : (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">Traffic stats are temporarily unavailable</h2>
            <p className="mt-1.5 text-sm text-muted">We couldn&apos;t load the latest numbers. Please check back shortly.</p>
          </div>
        )}

        <section
          aria-labelledby="advertise-heading"
          className="theme-dark hero-glow mt-10 overflow-hidden rounded-2xl border border-line bg-bg px-6 py-10 text-center sm:px-10 sm:py-12"
        >
          <h2 id="advertise-heading" className="display text-[2rem] sm:text-[2.6rem]">
            Reach these <em className="accent">visitors</em>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            List your software deal or talk to us about sponsored placements and partnerships.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <PromoteSaasTrigger className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
              Promote your SaaS
              <Icon name="arrow-up-right" size={15} />
            </PromoteSaasTrigger>
            <Link href="/partnerships" className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
              Partnerships
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}

function StatTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">{label}</p>
      <p className="tabular mt-2 text-[2rem] font-semibold leading-none tracking-tight text-heading sm:text-[2.4rem]">{value}</p>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-6">
      <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
      <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Ranked list with a single-hue magnitude bar behind each row; values stay in text ink. */
function BarList({ rows, metric = "visitors", mono = false }: { rows: Breakdown[]; metric?: "visitors" | "pageviews"; mono?: boolean }) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-muted">No data yet.</p>;
  const max = Math.max(...rows.map((r) => r[metric]), 1);
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md px-2.5 py-1.5">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-md bg-accent/15"
            style={{ width: `${(r[metric] / max) * 100}%` }}
          />
          <span className={`relative min-w-0 truncate text-sm text-fg ${mono ? "font-mono text-[13px]" : ""}`}>{r.label}</span>
          <span className="tabular relative shrink-0 text-sm font-medium text-fg">{num(r[metric])}</span>
        </li>
      ))}
    </ul>
  );
}
