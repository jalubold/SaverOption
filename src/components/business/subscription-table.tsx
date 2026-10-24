"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { archiveSubscriptionsAction, bulkAssignAction } from "@/app/business/actions/records";
import type { FormState } from "@/lib/business/form";
import { ActionForm, ConfirmSubmit, Submit } from "@/components/business/forms";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill, StatusPill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";

/** Display-ready subscription row (formatted on the server). */
export interface SubscriptionRowView {
  id: string;
  softwareId: string;
  softwareName: string;
  logoSrc: string | null;
  planName: string | null;
  vendorName: string | null;
  categoryLabel: string;
  status: string;
  statusLabel: string;
  archived: boolean;
  price: string | null;
  monthly: string | null;
  renewal: string | null;
  renewalDays: number | null;
  autoRenew: boolean;
  seats: string | null;
  owner: string | null;
  department: string | null;
}

/** The subscription list with row selection and bulk archive / assign actions. */
export function SubscriptionTable({
  rows,
  workspaceId,
  canBulkAssign,
  canArchive,
  archivedView,
  departments,
  people,
}: {
  rows: SubscriptionRowView[];
  workspaceId: string;
  canBulkAssign: boolean;
  canArchive: boolean;
  archivedView: boolean;
  departments: { id: string; name: string }[];
  people: { id: string; name: string }[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const selectable = canBulkAssign || canArchive;
  const allOnPage = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const toggle = (id: string, on: boolean) => setSelected((s) => (on ? [...new Set([...s, id])] : s.filter((x) => x !== id)));
  const clearOnSuccess = useCallback((state: FormState) => {
    if (state.ok) setSelected([]);
  }, []);
  const ids = selected.map((id) => <input key={id} type="hidden" name="ids" value={id} />);

  return (
    <>
      {selectable && selected.length > 0 && (
        <div className="mb-3 flex flex-wrap items-end gap-3 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2.5" role="region" aria-label="Bulk actions">
          <p className="self-center text-[13px] font-medium text-fg">
            {selected.length} selected
            <button type="button" onClick={() => setSelected([])} className="ml-2 text-[12.5px] font-normal text-accent-ink underline underline-offset-2">
              Clear
            </button>
          </p>
          {canArchive && (
            <ActionForm action={archiveSubscriptionsAction} workspaceId={workspaceId} onDone={clearOnSuccess}>
              {ids}
              {archivedView ? (
                <>
                  <input type="hidden" name="restore" value="1" />
                  <Submit variant="secondary" size="sm" pendingLabel="Restoring…">
                    Restore selected
                  </Submit>
                </>
              ) : (
                <ConfirmSubmit
                  title={`Archive ${selected.length} subscription${selected.length === 1 ? "" : "s"}?`}
                  body="Archived subscriptions are kept for history but left out of totals, reminders and savings rules. Their seat assignments are released. You can restore them from the archived view."
                  confirmLabel="Archive"
                >
                  <Icon name="archive" size={14} /> Archive
                </ConfirmSubmit>
              )}
            </ActionForm>
          )}
          {canBulkAssign && !archivedView && (
            <>
              <ActionForm action={bulkAssignAction} workspaceId={workspaceId} onDone={clearOnSuccess} className="flex items-end gap-2">
                {ids}
                <input type="hidden" name="field" value="departmentId" />
                <label className="text-[12px] text-muted">
                  <span className="block">Department</span>
                  <select name="value" className="biz-select mt-1" defaultValue="">
                    <option value="">No department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Submit variant="secondary" size="sm" pendingLabel="Saving…">
                  Set
                </Submit>
              </ActionForm>
              <ActionForm action={bulkAssignAction} workspaceId={workspaceId} onDone={clearOnSuccess} className="flex items-end gap-2">
                {ids}
                <input type="hidden" name="field" value="ownerPersonId" />
                <label className="text-[12px] text-muted">
                  <span className="block">Owner</span>
                  <select name="value" className="biz-select mt-1" defaultValue="">
                    <option value="">No owner</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Submit variant="secondary" size="sm" pendingLabel="Saving…">
                  Set
                </Submit>
              </ActionForm>
            </>
          )}
        </div>
      )}
      <div className="-mx-4 overflow-x-auto sm:-mx-5">
        <table className="biz-table">
          <thead>
            <tr>
              {selectable && (
                <th className="w-8">
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    checked={allOnPage}
                    onChange={(e) => setSelected((s) => (e.target.checked ? [...new Set([...s, ...rows.map((r) => r.id)])] : s.filter((x) => !rows.some((r) => r.id === x))))}
                    className="size-4 accent-[var(--accent)]"
                  />
                </th>
              )}
              <th>Software</th>
              <th className="hidden md:table-cell">Vendor</th>
              <th className="hidden md:table-cell">Category</th>
              <th>Status</th>
              <th className="num">Price</th>
              <th className="num">Monthly equiv.</th>
              <th>Next renewal</th>
              <th className="num">Seats</th>
              <th>Owner</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={selected.includes(r.id) ? "[&>td]:bg-accent-soft/50" : undefined}>
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.softwareName}${r.planName ? ` ${r.planName}` : ""}`}
                      checked={selected.includes(r.id)}
                      onChange={(e) => toggle(r.id, e.target.checked)}
                      className="size-4 accent-[var(--accent)]"
                    />
                  </td>
                )}
                <td className="min-w-40 sm:min-w-48">
                  <span className="flex items-center gap-2.5">
                    <SoftwareLogo name={r.softwareName} src={r.logoSrc} size={30} />
                    <span className="min-w-0">
                      <Link href={`/business/subscriptions/${r.id}`} className="font-medium text-fg hover:underline underline-offset-2">
                        {r.softwareName}
                      </Link>
                      {r.planName && <span className="block text-[12px] text-faint">{r.planName}</span>}
                    </span>
                  </span>
                </td>
                <td className="hidden whitespace-nowrap md:table-cell">{r.vendorName ?? <span className="text-faint">—</span>}</td>
                <td className="hidden whitespace-nowrap md:table-cell">{r.categoryLabel}</td>
                <td className="whitespace-nowrap">
                  {r.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={r.status} label={r.statusLabel} />}
                </td>
                <td className="num">{r.price ?? <span className="text-faint">No price</span>}</td>
                <td className="num">{r.monthly ?? <span className="text-faint">—</span>}</td>
                <td className="whitespace-nowrap">
                  {r.renewal ? (
                    <>
                      {r.renewal}
                      {r.renewalDays !== null && (
                        <span className={r.renewalDays < 0 ? "text-danger" : "text-faint"}>
                          {" "}
                          · {r.renewalDays < 0 ? `${Math.abs(r.renewalDays)}d ago` : `${r.renewalDays}d`}
                        </span>
                      )}
                      {!r.autoRenew && <span className="block text-[11.5px] text-faint">Manual renewal</span>}
                    </>
                  ) : (
                    <span className="text-faint">Not set</span>
                  )}
                </td>
                <td className="num">{r.seats ?? <span className="text-faint">—</span>}</td>
                <td className="whitespace-nowrap">{r.owner ?? <span className="text-faint">—</span>}</td>
                <td className="whitespace-nowrap">{r.department ?? <span className="text-faint">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
