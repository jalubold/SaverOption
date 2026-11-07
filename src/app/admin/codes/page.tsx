import { DashboardShell, fmtDate, Panel, StatCard } from "@/components/advertiser/dashboard-shell";
import { DeactivateCodesForm, ImportCodesForm } from "@/components/advertiser/codes-forms";
import { dbConfigured } from "@/lib/server/db";
import { lifetimeCodeStats, type LifetimeStats } from "@/lib/server/business/lifetime";
import { requireAdmin } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Lifetime codes", description: "AppSumo lifetime codes.", path: "/admin/codes", noIndex: true });

/** Import the AppSumo codes CSV, see how many are redeemed, and deactivate refunded codes. */
export default async function AdminCodesPage() {
  const user = await requireAdmin();
  let stats: LifetimeStats | null = null;
  let problem: string | null = dbConfigured() ? null : "The database isn't configured.";
  if (!problem) {
    try {
      stats = await lifetimeCodeStats();
    } catch (err) {
      console.error("[lifetime] stats failed:", err instanceof Error ? err.message : err);
      problem = "The lifetime codes table couldn't be read. Deploy once so the latest database migration runs, then reload.";
    }
  }
  const n = (v: number) => v.toLocaleString("en-US");

  return (
    <DashboardShell email={user.email} admin section="codes">
      <h1 className="display text-[2.4rem] sm:text-[3rem]">
        Lifetime <em className="accent">codes</em>
      </h1>
      <p className="mt-1 max-w-2xl text-[15px] text-muted">
        AppSumo codes buyers redeem on /business/redeem. One code gives a workspace Pro for life, a second gives Business. Only a hash of each code is stored, so keep your CSV as the
        record of the codes themselves.
      </p>

      {problem && <p className="mt-6 rounded-[14px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-fg">{problem}</p>}

      {stats && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Available" value={n(stats.available)} hint="Imported, not redeemed yet" />
            <StatCard label="Redeemed" value={n(stats.redeemed)} hint={`${n(stats.workspaces.pro)} Pro · ${n(stats.workspaces.business)} Business workspaces`} />
            <StatCard label="Deactivated" value={n(stats.deactivated)} hint="Refunded or withdrawn" />
            <StatCard label="Imported" value={n(stats.total)} />
          </div>
          {stats.batches.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-[16px] border border-line bg-surface">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.08em] text-faint">
                    <th scope="col" className="px-4 py-3 font-medium">Batch</th>
                    <th scope="col" className="px-4 py-3 font-medium">Imported</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Codes</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.batches.map((b) => (
                    <tr key={`${b.batch ?? ""}-${b.importedAt.toISOString()}`} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-fg">{b.batch ?? <span className="text-faint">No name</span>}</td>
                      <td className="px-4 py-3 text-muted">{fmtDate(b.importedAt)}</td>
                      <td className="tabular px-4 py-3 text-right text-fg">{n(b.total)}</td>
                      <td className="tabular px-4 py-3 text-right text-fg">{n(b.redeemed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Import codes">
          <p className="mb-4 text-[13px] text-muted">
            Import the same CSV you upload to AppSumo, before you upload it there, so every code a buyer gets already works here.
          </p>
          <ImportCodesForm />
        </Panel>
        <Panel title="Deactivate codes">
          <p className="mb-4 text-[13px] text-muted">
            For refunded purchases, or a codes file you delete on AppSumo (paste the deactivated codes it lists). A deactivated code can&apos;t be redeemed, and a workspace that
            used it loses that code&apos;s plan.
          </p>
          <DeactivateCodesForm />
        </Panel>
      </div>
    </DashboardShell>
  );
}
