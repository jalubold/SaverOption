"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { archiveSubscriptionsAction, bulkAssignAction } from "@/app/business/actions/records";
import type { FormState } from "@/lib/business/form";
import { ActionForm, ConfirmSubmit, Submit } from "@/components/business/forms";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill, StatusPill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

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
  /** When the price is shown converted: what it's billed as ("€99.00/mo"). */
  billed?: string | null;
  monthly: string | null;
  renewal: string | null;
  renewalDays: number | null;
  autoRenew: boolean;
  seats: string | null;
  owner: string | null;
  department: string | null;
  /** monthly | quarterly | yearly | custom: whether the price already is the monthly figure. */
  interval?: string;
  seatsUsed?: number | null;
  seatsTotal?: number | null;
}

/** "in 30 days", "today", "3 days ago". */
function relative(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

/** What sits under the software's name: plan and category, and the vendor when it isn't just the same name. */
function detailLine(r: SubscriptionRowView): string {
  const vendor = r.vendorName && !r.softwareName.toLowerCase().includes(r.vendorName.toLowerCase()) && !r.vendorName.toLowerCase().includes(r.softwareName.toLowerCase()) ? r.vendorName : null;
  return [r.planName, r.categoryLabel, vendor].filter(Boolean).join(" · ");
}

/** The cost's second line: what it's billed as when converted, or the monthly figure when it isn't monthly. */
function costNote(r: SubscriptionRowView): string | null {
  if (r.billed) return `billed ${r.billed}`;
  if (r.interval && r.interval !== "monthly" && r.monthly) return `≈ ${r.monthly}/mo`;
  return null;
}

function renewalTone(r: SubscriptionRowView): string {
  if (r.renewalDays === null) return "text-faint";
  if (r.renewalDays < 0) return "text-danger";
  if (r.renewalDays <= 7) return "text-warn";
  return "text-faint";
}

function SeatMeter({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <span aria-hidden="true" className="inline-block h-1.5 w-14 overflow-hidden rounded-full bg-subtle align-middle">
      <span className={cn("block h-full rounded-full", pct < 60 ? "bg-warn" : "bg-accent")} style={{ width: `${pct}%` }} />
    </span>
  );
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
  view = "list",
}: {
  rows: SubscriptionRowView[];
  view?: "list" | "cards";
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
      {view === "cards" ? (
        <>
          {selectable && rows.length > 0 && (
            <label className="mb-3 inline-flex items-center gap-2 text-[12.5px] text-muted">
              <input
                type="checkbox"
                checked={allOnPage}
                onChange={(e) => setSelected((s) => (e.target.checked ? [...new Set([...s, ...rows.map((r) => r.id)])] : s.filter((x) => !rows.some((r) => r.id === x))))}
                className="size-4 accent-[var(--accent)]"
              />
              Select all on this page
            </label>
          )}
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" data-subscription-cards>
            {rows.map((r) => {
              const on = selected.includes(r.id);
              const main = r.monthly && r.interval !== "monthly" ? `${r.monthly}` : r.price;
              const sub = r.interval && r.interval !== "monthly" && r.price ? `Billed ${r.price}` : r.billed ? `Billed ${r.billed}` : null;
              return (
                <li key={r.id} className={cn("biz-card group relative flex flex-col p-4 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-md", on && "border-accent/50 ring-2 ring-accent/25")}>
                  {/* The whole card opens the subscription; the checkbox sits above the link. */}
                  <Link href={`/business/subscriptions/${r.id}`} className="absolute inset-0 rounded-[inherit]" aria-label={`${r.softwareName}${r.planName ? ` ${r.planName}` : ""}`} />
                  <div className="flex items-start gap-3">
                    <SoftwareLogo name={r.softwareName} src={r.logoSrc} size={40} className="transition-transform group-hover:scale-105" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-fg">{r.softwareName}</p>
                      <p className="truncate text-[12.5px] text-faint">{detailLine(r) || " "}</p>
                    </div>
                    {selectable && (
                      <input
                        type="checkbox"
                        aria-label={`Select ${r.softwareName}${r.planName ? ` ${r.planName}` : ""}`}
                        checked={on}
                        onChange={(e) => toggle(r.id, e.target.checked)}
                        className="relative z-10 mt-1 size-4 accent-[var(--accent)]"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      {main ? (
                        <p className="tabular text-[19px] font-semibold leading-tight tracking-tight text-heading">
                          {main.replace(/\/mo$/, "")}
                          <span className="ml-0.5 text-[12.5px] font-normal text-faint">/mo</span>
                        </p>
                      ) : (
                        <p className="text-[14px] text-faint">No price yet</p>
                      )}
                      {sub && <p className="mt-0.5 truncate text-[12px] text-faint">{sub}</p>}
                    </div>
                    {r.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={r.status} label={r.statusLabel} />}
                  </div>
                  <div className="mt-4 space-y-2 border-t border-line pt-3 text-[12.5px]">
                    <p className="flex items-center gap-2">
                      <Icon name="calendar" size={14} className="shrink-0 text-faint" />
                      {r.renewal ? (
                        <span className="min-w-0 truncate text-fg">
                          {r.autoRenew ? "Renews" : "Ends"} {r.renewal}
                          {r.renewalDays !== null && <span className={renewalTone(r)}> · {relative(r.renewalDays)}</span>}
                        </span>
                      ) : (
                        <span className="text-faint">No renewal date</span>
                      )}
                    </p>
                    {r.seatsTotal != null && (
                      <p className="flex items-center gap-2">
                        <Icon name="key" size={14} className="shrink-0 text-faint" />
                        <span className="text-fg">
                          {r.seatsUsed ?? 0} of {r.seatsTotal} seats in use
                        </span>
                        <SeatMeter used={r.seatsUsed ?? 0} total={r.seatsTotal} />
                      </p>
                    )}
                    {(r.owner || r.department) && (
                      <p className="flex items-center gap-2">
                        <Icon name="users" size={14} className="shrink-0 text-faint" />
                        <span className="min-w-0 truncate text-fg">
                          {r.owner ?? "No owner"}
                          {r.department && <span className="text-faint"> · {r.department}</span>}
                        </span>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <SubscriptionList rows={rows} selectable={selectable} selected={selected} allOnPage={allOnPage} toggle={toggle} setSelected={setSelected} />
      )}
    </>
  );
}

/**
 * The list: one row per subscription with what people look for (name, status, cost, renewal,
 * seats, owner). Vendor and category sit under the name; the monthly figure shows only when it
 * differs from the price; Seats and Owner columns appear only when something in the view has them.
 * On phones each row is a two-line card (name and cost, then status and renewal).
 */
function SubscriptionList({
  rows,
  selectable,
  selected,
  allOnPage,
  toggle,
  setSelected,
}: {
  rows: SubscriptionRowView[];
  selectable: boolean;
  selected: string[];
  allOnPage: boolean;
  toggle: (id: string, on: boolean) => void;
  setSelected: (f: (s: string[]) => string[]) => void;
}) {
  const showSeats = rows.some((r) => r.seatsTotal != null || (r.seatsUsed ?? 0) > 0);
  const showOwner = rows.some((r) => r.owner || r.department);
  return (
    <div className="-mx-4 overflow-x-auto sm:-mx-5">
      <table className="biz-table max-sm:block" data-subscription-list>
        <thead className="max-sm:hidden">
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
            <th>Status</th>
            <th className="num">Cost</th>
            <th>Renewal</th>
            {showSeats && <th>Seats</th>}
            {showOwner && <th>Owner</th>}
          </tr>
        </thead>
        <tbody className="max-sm:block">
          {rows.map((r) => {
            const note = costNote(r);
            return (
              <tr
                key={r.id}
                className={cn(
                  "max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)_auto] max-sm:items-center max-sm:gap-x-3 max-sm:gap-y-1.5 max-sm:border-b max-sm:border-line max-sm:px-4 max-sm:py-3 max-sm:last:border-b-0 max-sm:[&>td]:border-0 max-sm:[&>td]:p-0",
                  selected.includes(r.id) && "[&>td]:bg-accent-soft/50 max-sm:bg-accent-soft/50",
                )}
              >
                {selectable && (
                  <td className="max-sm:col-start-1 max-sm:row-span-2 max-sm:self-start max-sm:pt-2">
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.softwareName}${r.planName ? ` ${r.planName}` : ""}`}
                      checked={selected.includes(r.id)}
                      onChange={(e) => toggle(r.id, e.target.checked)}
                      className="size-4 accent-[var(--accent)]"
                    />
                  </td>
                )}
                <td className="max-sm:col-start-2 max-sm:row-start-1 max-sm:min-w-0 sm:min-w-56">
                  <span className="flex items-center gap-3">
                    <SoftwareLogo name={r.softwareName} src={r.logoSrc} size={32} />
                    <span className="min-w-0">
                      <Link href={`/business/subscriptions/${r.id}`} className="font-medium text-fg underline-offset-2 hover:underline max-sm:line-clamp-2">
                        {r.softwareName}
                      </Link>
                      {detailLine(r) && <span className="block truncate text-[12px] text-faint">{detailLine(r)}</span>}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap max-sm:col-start-2 max-sm:row-start-2 max-sm:pl-11">
                  {r.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={r.status} label={r.statusLabel} />}
                </td>
                <td className="num max-sm:col-start-3 max-sm:row-start-1">
                  <span className="font-medium text-fg">{r.price ?? <span className="font-normal text-faint">No price</span>}</span>
                  {note && <span className="block text-[11.5px] font-normal text-faint">{note}</span>}
                </td>
                <td className="whitespace-nowrap max-sm:col-start-3 max-sm:row-start-2 max-sm:text-right max-sm:text-[12px]">
                  {r.renewal ? (
                    <>
                      <span className="text-fg max-sm:text-muted">{r.renewal}</span>
                      <span className={cn("block text-[11.5px] max-sm:inline", renewalTone(r))}>
                        {r.renewalDays !== null && <span className="max-sm:ml-1">{relative(r.renewalDays)}</span>}
                        {!r.autoRenew && <span className="max-sm:hidden">{r.renewalDays !== null ? " · " : ""}Manual renewal</span>}
                      </span>
                    </>
                  ) : (
                    <span className="text-faint">Not set</span>
                  )}
                </td>
                {showSeats && (
                  <td className="whitespace-nowrap max-sm:hidden">
                    {r.seatsTotal != null ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="tabular">
                          {r.seatsUsed ?? 0}/{r.seatsTotal}
                        </span>
                        <SeatMeter used={r.seatsUsed ?? 0} total={r.seatsTotal} />
                      </span>
                    ) : (r.seatsUsed ?? 0) > 0 ? (
                      <span className="tabular">{r.seatsUsed} in use</span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                )}
                {showOwner && (
                  <td className="max-sm:hidden">
                    {r.owner ?? <span className="text-faint">No owner</span>}
                    {r.department && <span className="block text-[11.5px] text-faint">{r.department}</span>}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
