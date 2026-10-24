import { ImportWizard } from "@/components/business/import/import-wizard";
import { Card, InlineNote, PageHeader, Pill, TableWrap } from "@/components/business/ui";
import { formatIsoDate } from "@/lib/business/calc";
import { dateOrderFor, IMPORT_FIELDS } from "@/lib/business/csv-import";
import { isUuid } from "@/lib/business/form";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getImportJobs } from "@/lib/server/business/import";

export const metadata = { title: "Import subscriptions from CSV" };

export default async function ImportSubscriptionsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const ctx = await requireBizContext("/business/subscriptions/import");
  const q = await props.searchParams;
  const focusJob = typeof q.job === "string" && isUuid(q.job) ? q.job.toLowerCase() : null;
  const crumbs = [{ label: "Subscriptions", href: "/business/subscriptions" }, { label: "Import from CSV" }];
  const fmt = ctx.workspace.dateFormat;

  if (!can(ctx.role, "records.manage")) {
    return (
      <>
        <PageHeader title="Import subscriptions from CSV" crumbs={crumbs} />
        <InlineNote title="Your role can't import subscriptions">Owners, admins and finance can import subscriptions. Ask one of them to run the import, or to change your role.</InlineNote>
      </>
    );
  }

  const jobs = await getImportJobs(ctx.workspace.id, 20);
  return (
    <>
      <PageHeader
        title="Import subscriptions from CSV"
        crumbs={crumbs}
        description="Bring in a spreadsheet of the software your company pays for. You'll see exactly what happens to every row — and can fix the column mapping — before anything is saved."
      />

      <ImportWizard
        workspaceId={ctx.workspace.id}
        dateFormat={fmt}
        defaults={{ dateOrder: dateOrderFor(fmt), decimal: "dot", defaultCurrency: ctx.workspace.defaultCurrency, defaultInterval: "" }}
      />

      <Card className="mt-5" title="Columns the import understands" description="Only the software name is required. Column names don't have to match exactly — common spellings such as “Tool”, “Cost” or “Billing cycle” are recognised, and you can map the rest by hand.">
        <TableWrap>
          <table className="biz-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Required</th>
                <th>Format</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {IMPORT_FIELDS.map((f) => (
                <tr key={f.key}>
                  <td className="whitespace-nowrap font-medium">{f.header}</td>
                  <td>{f.required ? <Pill tone="accent">Required</Pill> : <span className="text-faint">Optional</span>}</td>
                  <td className="min-w-72 text-[13px] text-muted">{f.format}</td>
                  <td className="whitespace-nowrap text-[13px]">{f.example || <span className="text-faint">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] text-muted">
          <li>Duplicates — the same software, plan, billing interval and currency as another row or an existing subscription — are skipped, never overwritten.</li>
          <li>Departments and owners are matched to the ones already in your workspace; unknown names are left blank rather than created.</li>
          <li>Totals stay per currency. Nothing is converted between currencies.</li>
          <li>Imported records are marked “Imported from CSV” and “Not verified” until someone opens and saves them.</li>
        </ul>
      </Card>

      <Card id="history" className="mt-5 scroll-mt-20" title="Import history" description="The last 20 imports in this workspace. Only counts and row messages are kept — never the file itself.">
        {jobs.length === 0 ? (
          <p className="text-[13.5px] text-muted">No imports yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {jobs.map((j) => (
              <li key={j.id} id={`job-${j.id}`} className={focusJob === j.id ? "-mx-2 rounded-lg bg-accent-soft/50 px-2" : undefined}>
                <details open={focusJob === j.id} className="py-3">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-fg">{j.fileName ?? "Untitled file"}</span>
                      <span className="block text-[12px] text-faint">
                        {formatIsoDate(j.createdAt.toISOString().slice(0, 10), fmt)} · {j.createdByName ?? "Someone"} · {j.rowCount} row{j.rowCount === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="flex flex-wrap gap-1.5">
                      <Pill tone="success">{j.created} created</Pill>
                      <Pill tone="neutral">{j.skipped} skipped</Pill>
                      <Pill tone={j.failed ? "danger" : "neutral"}>{j.failed} failed</Pill>
                    </span>
                  </summary>
                  <div className="mt-3 text-[13px]">
                    {Object.keys(j.mapping).length > 0 && (
                      <p className="text-muted">
                        <span className="font-medium text-fg">Columns used:</span>{" "}
                        {Object.entries(j.mapping)
                          .map(([field, header]) => `${IMPORT_FIELDS.find((f) => f.key === field)?.label ?? field} ← “${header ?? "?"}”`)
                          .join(" · ")}
                      </p>
                    )}
                    {j.issues.length === 0 ? (
                      <p className="mt-2 text-faint">No row messages.</p>
                    ) : (
                      <ul className="mt-2 space-y-1">
                        {j.issues.map((i, n) => (
                          <li key={n} className={i.level === "error" ? "text-danger" : "text-warn"}>
                            Line {i.line}: {i.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
