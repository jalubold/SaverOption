import Link from "next/link";
import { formatCents } from "@/config/listing-plans";
import { DashboardShell, Panel, StatCard } from "@/components/advertiser/dashboard-shell";
import { cn } from "@/components/ui/primitives";
import { dbConfigured } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/supabase";
import { FUNNEL_EVENTS, funnelMetrics } from "@/lib/server/tracking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Advertiser metrics", description: "Admin metrics.", path: "/admin/metrics", noIndex: true });

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: null },
] as const;

export default async function AdminMetricsPage(props: PageProps<"/admin/metrics">) {
  const user = await requireAdmin();
  const q = await props.searchParams;
  const range = RANGES.find((r) => r.key === q.range) ?? RANGES[1];
  const m = dbConfigured() ? await funnelMetrics(range.days) : null;

  return (
    <DashboardShell email={user.email} admin section="metrics">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[2.4rem] sm:text-[3rem]">
            Advertiser <em className="accent">funnel</em>
          </h1>
          <p className="mt-1 text-[15px] text-muted">From recorded events and webhook-verified orders only. Test orders are excluded from revenue.</p>
        </div>
        <nav aria-label="Range" className="flex gap-1.5">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={r.key === "30" ? "/admin/metrics" : `/admin/metrics?range=${r.key}`}
              aria-current={r.key === range.key ? "true" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[13px]",
                r.key === range.key ? "border-accent bg-accent-soft text-fg" : "border-line text-muted hover:text-fg",
              )}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </div>

      {!m ? (
        <p className="mt-8 text-sm text-muted">The database isn&apos;t configured.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Gross paid revenue" value={formatCents(m.revenue.grossCents)} hint={`${m.revenue.paidOrders} paid order${m.revenue.paidOrders === 1 ? "" : "s"}`} />
            <StatCard label="Refunds" value={m.revenue.refundCount} hint={formatCents(m.revenue.refundedCents)} />
            <StatCard label="Net" value={formatCents(m.revenue.grossCents - m.revenue.refundedCents)} />
            <StatCard label="Test orders" value={m.revenue.testOrders} hint="Not counted as revenue" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Conversion rates">
              <dl className="space-y-2.5 text-sm">
                {m.rates.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3">
                    <dt className="text-muted">
                      {r.label}
                      <span className="block text-[11px] text-faint">
                        {r.numerator} ÷ {r.denominator}
                      </span>
                    </dt>
                    <dd className="tabular text-fg">{r.value === null ? "—" : `${(r.value * 100).toFixed(1)}%`}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title="Events">
              <dl className="space-y-1.5 text-sm">
                {FUNNEL_EVENTS.map((e) => (
                  <div key={e} className="flex items-center justify-between gap-3 border-b border-line pb-1.5 last:border-0">
                    <dt className="font-mono text-[12px] text-muted">{e}</dt>
                    <dd className="tabular text-fg">{m.counts[e].toLocaleString("en-US")}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-faint">
                Each step counts once per submission (or per browser before a submission exists). Drop-off between steps is shown; reasons
                aren&apos;t inferred.
              </p>
            </Panel>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
