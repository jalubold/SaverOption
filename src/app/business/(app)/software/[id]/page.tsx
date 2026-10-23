import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveSoftwareButton } from "@/components/business/record-forms";
import { Card, DefinitionList, EmptyState, InlineNote, Kpi, LinkButton, Meter, Money, PageHeader, Pill, StatusPill, TableWrap } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { daysBetween, formatIsoDate, formatMoney, isLive, licenseTotals, monthlyEquivalent, periodSuffix, seatSummary, summarizeSpend, totalsList } from "@/lib/business/calc";
import { categoryLabels, OVERLAP_PRONE_CATEGORIES, softwareStatusLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { isUuid } from "@/lib/business/form";
import { can, canEditRecord } from "@/lib/business/permissions";
import { alternativesFor, liveOffersFor, verificationLabel } from "@/lib/server/business/catalog-match";
import { requireBizContext } from "@/lib/server/business/context";
import { getActivity, getSoftware, getSoftwareList, getSubscriptions } from "@/lib/server/business/data";
import { offerTypeLabels } from "@/lib/labels";

export const metadata = { title: "Software" };

export default async function SoftwarePage(props: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id: rawId } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireBizContext(`/business/software/${encodeURIComponent(rawId)}`);
  if (!isUuid(rawId)) notFound();
  const id = rawId.toLowerCase();
  const sw = await getSoftware(ctx, id);
  if (!sw) notFound();
  const ws = ctx.workspace.id;
  const [all, inventory] = await Promise.all([getSubscriptions(ws), getSoftwareList(ws)]);
  const subs = all.filter((s) => s.softwareId === id);
  const current = subs.filter((s) => !s.archived);
  const [activity, deals] = await Promise.all([getActivity(ws, { entityIds: [id, ...subs.map((s) => s.id)], limit: 30 }), liveOffersFor(sw.catalogProductId)]);
  const alternatives = alternativesFor(sw);
  const fmt = ctx.workspace.dateFormat;
  const d = (iso: string | null | undefined) => formatIsoDate(iso, fmt);
  const pref = ctx.workspace.defaultCurrency;
  const when = (date: Date) => {
    try {
      return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: ctx.workspace.timeZone }).format(date);
    } catch {
      return date.toISOString().slice(0, 16).replace("T", " ");
    }
  };

  const spend = summarizeSpend(current, ctx.today);
  const seats = licenseTotals(current);
  const next = current
    .filter((s) => isLive(s) && s.nextRenewalDate && s.nextRenewalDate >= ctx.today)
    .sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!))[0];
  const canEdit = canEditRecord(ctx.role, { ownerPersonId: sw.ownerPersonId }, ctx.personId);
  const archived = sw.status === "archived";
  const overlaps =
    !archived && OVERLAP_PRONE_CATEGORIES.has(sw.category) ? inventory.filter((o) => o.id !== id && o.category === sw.category && o.status !== "archived" && o.status !== "deprecated") : [];
  let websiteHost: string | null = null;
  try {
    websiteHost = sw.website ? new URL(sw.website).hostname.replace(/^www\./, "") : null;
  } catch {
    websiteHost = null;
  }

  return (
    <>
      <PageHeader
        title={sw.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusPill status={sw.status} label={softwareStatusLabels[sw.status]} />
            <span>{[sw.vendorName, categoryLabels[sw.category]].filter(Boolean).join(" · ")}</span>
          </span>
        }
        crumbs={[{ label: "Software Inventory", href: "/business/software" }, { label: sw.name }]}
        actions={
          <>
            {can(ctx.role, "records.manage") && !archived && (
              <LinkButton href={`/business/subscriptions/new?software=${id}`} icon="plus">
                Add subscription
              </LinkButton>
            )}
            {canEdit && !archived && (
              <LinkButton href={`/business/software/${id}/edit`} icon="pen" variant="primary">
                Edit
              </LinkButton>
            )}
            {canEdit && <ArchiveSoftwareButton workspaceId={ws} id={id} archived={archived} name={sw.name} />}
          </>
        }
      />

      <div className="space-y-3">
        {q.created === "1" && <Notice>{sw.name} was added to the software inventory.</Notice>}
        {q.saved === "1" && <Notice>Changes saved.</Notice>}
        {archived && (
          <InlineNote tone="warn" title="This software is archived">
            It&apos;s hidden from the inventory and left out of totals.{canEdit ? " Restore it to track or edit it again." : ""}
          </InlineNote>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Monthly equivalent" value={<Money totals={spend.monthly} preferred={pref} />} sub={spend.missingPrice ? `${spend.missingPrice} active without a price` : "Active subscriptions"} />
        <Kpi label="Annualized recurring cost" value={<Money totals={spend.annualized} preferred={pref} />} sub="Run-rate × 12, not cash spent" />
        <Kpi label="Seats in use" value={seats.tracked ? `${seats.assigned} / ${seats.purchased}` : "—"} sub={seats.tracked ? `${seats.available} available` : "Seats not tracked"} />
        <Kpi label="Next renewal" value={next ? d(next.nextRenewalDate) : "—"} sub={next ? `${next.planName ?? "Subscription"} · in ${daysBetween(ctx.today, next.nextRenewalDate!)} days` : current.some(isLive) ? "No upcoming date set" : "No live subscription"} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card title="Details">
            <DefinitionList
              items={[
                { label: "Vendor", value: sw.vendorName ?? "—" },
                { label: "Category", value: categoryLabels[sw.category] },
                { label: "Status", value: softwareStatusLabels[sw.status] },
                {
                  label: "Website",
                  value:
                    sw.website && websiteHost ? (
                      <a href={sw.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-accent-ink underline underline-offset-2">
                        {websiteHost} <Icon name="external" size={12} />
                      </a>
                    ) : (
                      "—"
                    ),
                },
                { label: "Owner", value: sw.ownerName ?? "No owner" },
                { label: "Department", value: sw.departmentName ?? "No department" },
                { label: "Business purpose", value: sw.businessPurpose ? <span className="whitespace-pre-line">{sw.businessPurpose}</span> : "—" },
                { label: "Description", value: sw.description ? <span className="whitespace-pre-line">{sw.description}</span> : "—" },
                { label: "Notes", value: sw.notes ? <span className="whitespace-pre-line">{sw.notes}</span> : "—" },
              ]}
            />
          </Card>

          <Card title="Subscriptions" action={can(ctx.role, "records.manage") && !archived ? <LinkButton href={`/business/subscriptions/new?software=${id}`}>Add subscription</LinkButton> : undefined}>
            {subs.length === 0 ? (
              <EmptyState icon="layers" title="No subscriptions">
                {sw.name} is in the inventory without a paid plan. Add a subscription when the company starts paying for it.
              </EmptyState>
            ) : (
              <TableWrap>
                <table className="biz-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Status</th>
                      <th className="num">Price</th>
                      <th className="num">Monthly equiv.</th>
                      <th>Next renewal</th>
                      <th className="num">Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s) => {
                      const m = monthlyEquivalent(s);
                      const st = seatSummary(s);
                      return (
                        <tr key={s.id}>
                          <td>
                            <Link href={`/business/subscriptions/${s.id}`} className="font-medium text-fg hover:underline underline-offset-2">
                              {s.planName ?? "Subscription"}
                            </Link>
                          </td>
                          <td>{s.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={s.status} label={subscriptionStatusLabels[s.status]} />}</td>
                          <td className="num">{s.priceMinor !== null ? `${formatMoney(s.priceMinor, s.currency)}${periodSuffix(s)}` : <span className="text-faint">No price</span>}</td>
                          <td className="num">{m !== null ? formatMoney(Math.round(m), s.currency) : "—"}</td>
                          <td className="whitespace-nowrap">{d(s.nextRenewalDate)}</td>
                          <td className="num">{st.purchased !== null ? `${st.assigned} / ${st.purchased}` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Card>

          <Card title="License allocation" description="Across this software's live subscriptions.">
            {seats.tracked === 0 ? (
              <p className="text-[13.5px] text-muted">No subscription tracks seats.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-line px-3 py-2.5">
                    <p className="text-[12px] text-faint">Purchased</p>
                    <p className="tabular text-[16px] font-semibold">{seats.purchased}</p>
                  </div>
                  <div className="rounded-xl border border-line px-3 py-2.5">
                    <p className="text-[12px] text-faint">In use</p>
                    <p className="tabular text-[16px] font-semibold">{seats.assigned}</p>
                  </div>
                  <div className="rounded-xl border border-line px-3 py-2.5">
                    <p className="text-[12px] text-faint">Available</p>
                    <p className="tabular text-[16px] font-semibold">{seats.available}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Meter value={seats.utilization} label="Seat utilization" tone={seats.utilization !== null && seats.utilization < 60 ? "warn" : "accent"} />
                </div>
                {totalsList(seats.unusedMonthly).length > 0 && (
                  <p className="mt-2 text-[13px] text-muted">
                    Unassigned per-seat licenses cost about <Money totals={seats.unusedMonthly} preferred={pref} className="!inline font-medium text-fg" /> a month.
                  </p>
                )}
                <p className="mt-3 text-[12px] text-faint">Seats in use come from named assignments and reported counts, not from actual product usage.</p>
              </>
            )}
          </Card>

          <Card title="Activity">
            {activity.length === 0 ? (
              <p className="text-[13.5px] text-muted">No activity recorded yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-3 text-[13px]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="text-fg">{a.summary}</span>
                      <span className="block text-[12px] text-faint">
                        {a.actorName ?? "Someone"} · {when(a.createdAt)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          {overlaps.length > 0 && (
            <Card title="Potential overlap">
              <p className="text-[13px] text-muted">
                Other active tools tracked as {categoryLabels[sw.category]}. Teams often need only one — this needs a review, not a confirmed duplicate.
              </p>
              <ul className="mt-2 space-y-1 text-[13.5px]">
                {overlaps.map((o) => (
                  <li key={o.id}>
                    <Link href={`/business/software/${o.id}`} className="font-medium text-fg hover:underline underline-offset-2">
                      {o.name}
                    </Link>
                    {o.ownerName && <span className="text-faint"> · {o.ownerName}</span>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Saver Option deals" description="Live listings for this software from the deals marketplace.">
            {deals.length === 0 ? (
              <p className="text-[13.5px] text-muted">No matching deals listed.</p>
            ) : (
              <ul className="divide-y divide-line">
                {deals.slice(0, 4).map((o) => (
                  <li key={o.slug} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={`/deals/${o.slug}`} className="text-[13.5px] font-medium text-fg hover:underline underline-offset-2">
                      {o.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
                      <Pill tone="accent">{offerTypeLabels[o.type]}</Pill>
                      <span>{verificationLabel(o)}</span>
                    </p>
                    {o.eligibility[0] && <p className="mt-1 text-[12px] text-faint">Eligibility: {o.eligibility[0]}</p>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[12px] text-faint">Terms and eligibility are set by the provider; check the listing before relying on a discount.</p>
          </Card>

          <Card title="Open-source alternatives" description="Listed in the Saver Option catalog for the same job.">
            {alternatives.length === 0 ? (
              <p className="text-[13.5px] text-muted">None listed for this kind of tool.</p>
            ) : (
              <ul className="divide-y divide-line">
                {alternatives.map((a) => (
                  <li key={a.productSlug} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={`/products/${a.productSlug}`} className="text-[13.5px] font-medium text-fg hover:underline underline-offset-2">
                      {a.productName}
                    </Link>
                    <p className="mt-0.5 text-[12.5px] text-muted">{a.tagline}</p>
                    <p className="mt-0.5 text-[12px] text-faint">
                      Listed under “{a.sharedTag}”{a.license ? ` · ${a.license}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {alternatives.length > 0 && <p className="mt-3 text-[12px] text-faint">No price comparison is made — self-hosting has its own running costs.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="flex items-start gap-2 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-[13.5px] text-fg">
      <Icon name="check" size={15} className="mt-0.5 shrink-0 text-accent-ink" />
      {children}
    </p>
  );
}
