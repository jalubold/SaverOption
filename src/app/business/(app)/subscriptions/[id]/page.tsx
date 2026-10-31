import Link from "next/link";
import { notFound } from "next/navigation";
import { RadialGauge } from "@/components/business/charts";
import { ArchiveSubscriptionButton, DeletePaymentButton, PaymentForm, RecordRenewalForm, RenewalDecisionForm } from "@/components/business/record-forms";
import { LogoTitle } from "@/components/business/logo-title";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, DefinitionList, FxNoteLine, InlineNote, Kpi, LinkButton, Money, PageHeader, Pill, StatusPill, TableWrap } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import {
  addTo,
  annualized,
  daysBetween,
  formatIsoDate,
  formatMoney,
  intervalLabel,
  monthlyEquivalent,
  nextPeriodDate,
  periodSuffix,
  seatSummary,
  type CurrencyTotals,
} from "@/lib/business/calc";
import {
  categoryLabels,
  opportunityStatusLabels,
  opportunityTypeLabels,
  pricingModelLabels,
  renewalDecisionLabels,
  subscriptionStatusLabels,
} from "@/lib/business/constants";
import { isUuid } from "@/lib/business/form";
import { can, canEditRecord } from "@/lib/business/permissions";
import { liveOffersFor, verificationLabel } from "@/lib/server/business/catalog-match";
import { requireBizContext } from "@/lib/server/business/context";
import { displayCurrency, SUB_MONEY } from "@/lib/server/business/display-currency";
import { getImportJob } from "@/lib/server/business/import";
import {
  getActivity,
  getCostHistory,
  getOpportunities,
  getPayments,
  getPeople,
  getRenewalEvents,
  getSeatAssignments,
  getSoftware,
  getSubscription,
} from "@/lib/server/business/data";
import { offerTypeLabels } from "@/lib/labels";

export const metadata = { title: "Subscription" };

const outcomeLabels = { renewed: "Renewed", renegotiated: "Renegotiated", cancelled: "Cancelled" } as const;

export default async function SubscriptionPage(props: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id: rawId } = await props.params;
  const q = await props.searchParams;
  const ctx = await requireBizContext(`/business/subscriptions/${encodeURIComponent(rawId)}`);
  if (!isUuid(rawId)) notFound();
  const id = rawId.toLowerCase();
  const sub = await getSubscription(ctx, id);
  if (!sub) notFound();
  const ws = ctx.workspace.id;
  const [software, events, seats, history, payments, opportunities, activity, people] = await Promise.all([
    getSoftware(ctx, sub.softwareId),
    getRenewalEvents(ws),
    getSeatAssignments(ws),
    getCostHistory(ws),
    getPayments(ws),
    getOpportunities(ws),
    getActivity(ws, { entityIds: [id], limit: 30 }),
    getPeople(ws),
  ]);
  const [deals, importJob] = await Promise.all([liveOffersFor(software?.catalogProductId ?? null), sub.importJobId ? getImportJob(ws, sub.importJobId) : null]);
  const fmt = ctx.workspace.dateFormat;
  const d = (iso: string | null | undefined) => formatIsoDate(iso, fmt);
  const when = (date: Date) => {
    try {
      return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: ctx.workspace.timeZone }).format(date);
    } catch {
      return date.toISOString().slice(0, 16).replace("T", " ");
    }
  };

  const canEdit = canEditRecord(ctx.role, { ownerPersonId: sub.ownerPersonId }, ctx.personId);
  const canSpend = can(ctx.role, "spend.manage");
  const live = !sub.archived && (sub.status === "active" || sub.status === "trial");
  // The summary figures in the workspace currency (ECB rate); billing details, history and payments stay as recorded.
  const display = await displayCurrency(ctx, [sub.currency]);
  const shown = display.row(sub, SUB_MONEY);
  const fxNote = display.note();
  const billed = shown.original && sub.priceMinor !== null ? `billed ${formatMoney(sub.priceMinor, sub.currency)}` : null;
  const monthly = monthlyEquivalent(shown);
  const year = annualized(shown);
  const seatInfo = seatSummary(sub);
  const named = seats.filter((a) => a.subscriptionId === id && !a.releasedAt);
  const myEvents = events.filter((e) => e.subscriptionId === id);
  const myHistory = history.filter((h) => h.subscriptionId === id);
  const myPayments = payments.filter((p) => p.subscriptionId === id);
  const paid: CurrencyTotals = {};
  for (const p of myPayments) addTo(paid, p.currency, p.amountMinor);
  const opps = opportunities.filter((o) => o.subscriptionId === id && o.status !== "resolved");
  const renewalIn = sub.nextRenewalDate ? daysBetween(ctx.today, sub.nextRenewalDate) : null;
  const peopleOptions = people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }));

  type TimelineItem = { date: string; title: string; detail?: string; upcoming: boolean };
  const timeline: TimelineItem[] = [
    ...(sub.startDate ? [{ date: sub.startDate, title: "Started", upcoming: sub.startDate > ctx.today }] : []),
    ...myEvents.map((e) => ({
      date: e.renewalDate,
      title: outcomeLabels[e.outcome],
      detail: [e.amountMinor !== null ? formatMoney(e.amountMinor, e.currency) : null, e.newRenewalDate ? `next renewal ${d(e.newRenewalDate)}` : null, e.notes].filter(Boolean).join(" · "),
      upcoming: false,
    })),
    ...(sub.endedOn ? [{ date: sub.endedOn, title: "Ended", upcoming: sub.endedOn > ctx.today }] : []),
    ...(sub.cancellationDeadline ? [{ date: sub.cancellationDeadline, title: "Cancellation deadline", detail: "Last day to cancel before the next charge", upcoming: sub.cancellationDeadline >= ctx.today }] : []),
    ...(sub.nextRenewalDate && live
      ? [{ date: sub.nextRenewalDate, title: sub.status === "trial" ? "Trial ends / first charge" : "Next renewal", detail: [sub.priceMinor !== null ? `expected ${formatMoney(sub.priceMinor, sub.currency)}` : "amount unknown", sub.autoRenew ? "auto-renews" : "manual renewal"].join(" · "), upcoming: true }]
      : []),
    ...(sub.contractEndDate ? [{ date: sub.contractEndDate, title: "Contract ends", upcoming: sub.contractEndDate >= ctx.today }] : []),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const title = sub.planName ? `${sub.softwareName} · ${sub.planName}` : sub.softwareName;

  return (
    <>
      <PageHeader
        title={
          <LogoTitle name={sub.softwareName} src={sub.logoSrc}>
            {title}
          </LogoTitle>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            {sub.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={sub.status} label={subscriptionStatusLabels[sub.status]} />}
            <span>
              {[sub.vendorName, categoryLabels[sub.category], intervalLabel(sub)].filter(Boolean).join(" · ")}
            </span>
          </span>
        }
        crumbs={[{ label: "Subscriptions", href: "/business/subscriptions" }, { label: sub.softwareName }]}
        actions={
          <>
            {software && <LinkButton href={`/business/software/${software.id}`} icon="box">View software</LinkButton>}
            {!sub.archived && <LinkButton href={`/business/licenses/${id}`} icon="key">Manage seats</LinkButton>}
            {canEdit && !sub.archived && (
              <LinkButton href={`/business/subscriptions/${id}/edit`} icon="pen" variant="primary">
                Edit
              </LinkButton>
            )}
            {canEdit && <ArchiveSubscriptionButton workspaceId={ws} id={id} archived={sub.archived} name={sub.softwareName} />}
          </>
        }
      />

      <div className="space-y-3">
        {q.created === "1" && <Notice>Subscription saved. It&apos;s now part of your dashboard, renewals and reports.</Notice>}
        {q.saved === "1" && <Notice>Changes saved.</Notice>}
        {sub.archived && (
          <InlineNote tone="warn" title="This subscription is archived">
            It&apos;s kept for history and left out of every total, reminder and savings rule.{canEdit ? " Restore it to edit or track it again." : ""}
          </InlineNote>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Price per period"
          value={shown.priceMinor !== null ? `${formatMoney(shown.priceMinor, shown.currency)}` : "Not entered"}
          sub={sub.priceMinor !== null ? [billed, intervalLabel(sub), pricingModelLabels[sub.pricingModel]].filter(Boolean).join(" · ") : "Left out of spending totals"}
        />
        <Kpi label="Monthly equivalent" value={monthly !== null ? formatMoney(Math.round(monthly), shown.currency) : "—"} sub={sub.billingInterval === "monthly" ? "Billed monthly" : "Price ÷ months in the period"} />
        <Kpi label="Annualized recurring cost" value={year !== null ? formatMoney(Math.round(year), shown.currency) : "—"} sub="Monthly equivalent × 12, not cash spent" />
        <Kpi
          label={sub.status === "trial" ? "Trial ends" : "Next renewal"}
          value={sub.nextRenewalDate ? d(sub.nextRenewalDate) : "Not set"}
          sub={renewalIn === null ? (live ? "Add a date to get reminders" : undefined) : !live ? "Not renewing" : renewalIn < 0 ? `${Math.abs(renewalIn)} days ago — record the outcome` : renewalIn === 0 ? "Today" : `In ${renewalIn} day${renewalIn === 1 ? "" : "s"}`}
        />
      </div>

      <FxNoteLine note={fxNote} dateFormat={ctx.workspace.dateFormat} className="mt-2" />

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card title="Billing details">
            <DefinitionList
              items={[
                { label: "Plan", value: sub.planName ?? "—" },
                { label: "Price", value: sub.priceMinor !== null ? `${formatMoney(sub.priceMinor, sub.currency)}${periodSuffix(sub)}` : "Not entered" },
                { label: "Currency", value: sub.currency },
                { label: "Billing interval", value: intervalLabel(sub) },
                { label: "Pricing model", value: pricingModelLabels[sub.pricingModel], hint: sub.pricingModel === "per_seat" ? "The price covers all purchased seats." : undefined },
                { label: "Status", value: subscriptionStatusLabels[sub.status] },
                { label: "Start date", value: d(sub.startDate) },
                { label: "Auto-renewal", value: sub.autoRenew ? "Renews automatically" : "Manual renewal" },
                { label: "Payment method", value: sub.paymentMethod ?? "—" },
                ...(sub.billingInterval === "monthly" ? [{ label: "Annual price option", value: sub.annualPriceOptionMinor !== null ? formatMoney(sub.annualPriceOptionMinor, sub.currency) : "Not recorded", hint: "The vendor's price for a year, to compare with monthly billing." }] : []),
                ...(sub.endedOn ? [{ label: "Ended on", value: d(sub.endedOn) }] : []),
                { label: "Reminders", value: sub.reminderDays ? `${sub.reminderDays.join(", ")} days before` : `Workspace default (${ctx.workspace.reminderDays.length ? `${ctx.workspace.reminderDays.join(", ")} days` : "off"})` },
                {
                  label: "Record source",
                  value:
                    sub.source === "csv_import" ? (
                      importJob ? (
                        <>
                          Imported from CSV on {d(importJob.createdAt.toISOString().slice(0, 10))} ·{" "}
                          <Link href={`/business/subscriptions/import?job=${importJob.id}#history`} className="text-accent-ink underline underline-offset-2">
                            {importJob.fileName ?? "view import"}
                          </Link>
                        </>
                      ) : (
                        "Imported from CSV"
                      )
                    ) : sub.source === "mcp" ? (
                      "Added by an AI client (MCP)"
                    ) : sub.source === "assistant" ? (
                      "Added with the AI assistant"
                    ) : sub.source === "demo" ? (
                      "Demo data"
                    ) : (
                      "Entered in the app"
                    ),
                },
                {
                  label: "Last verified",
                  value: sub.lastVerifiedOn ? d(sub.lastVerifiedOn) : sub.source === "csv_import" ? <Pill tone="warn">Not verified since import</Pill> : "Not verified",
                  hint: "When someone last entered or saved these details. Editing and saving the subscription marks it verified.",
                },
              ]}
            />
          </Card>

          <Card title="Renewal" description="Timeline, decision and outcome of the next renewal.">
            {timeline.length === 0 ? (
              <p className="text-[13.5px] text-muted">No dates recorded yet.{canEdit ? " Add a start and renewal date to build the timeline." : ""}</p>
            ) : (
              <ol className="relative ml-1.5 border-l border-line">
                {timeline.map((t, i) => (
                  <li key={i} className="relative pb-3 pl-5 last:pb-0">
                    <span aria-hidden="true" className={`absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-surface ${t.upcoming ? "bg-accent" : "bg-line-strong"}`} />
                    <p className="text-[13.5px]">
                      <span className="font-medium text-fg">{t.title}</span> <span className="text-faint">· {d(t.date)}</span>
                    </p>
                    {t.detail && <p className="text-[12.5px] text-muted">{t.detail}</p>}
                  </li>
                ))}
              </ol>
            )}
            {live && (
              <div className="mt-5 grid gap-5 border-t border-line pt-4 xl:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-[13.5px] font-semibold">Decision</h3>
                  {canEdit ? (
                    <RenewalDecisionForm workspaceId={ws} subscriptionId={id} decision={sub.renewalDecision} ownerPersonId={sub.renewalOwnerPersonId} notes={sub.renewalNotes} people={peopleOptions} />
                  ) : (
                    <DefinitionList
                      className="sm:grid-cols-1"
                      items={[
                        { label: "Decision", value: renewalDecisionLabels[sub.renewalDecision] },
                        { label: "Renewal owner", value: sub.renewalOwnerName ?? "—" },
                        { label: "Notes", value: sub.renewalNotes ?? "—" },
                      ]}
                    />
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-[13.5px] font-semibold">Record the outcome</h3>
                  {!sub.nextRenewalDate ? (
                    <p className="text-[13px] text-muted">Add the next renewal date first.</p>
                  ) : canSpend ? (
                    <RecordRenewalForm
                      workspaceId={ws}
                      subscriptionId={id}
                      renewalDate={sub.nextRenewalDate}
                      suggestedNext={nextPeriodDate(sub.nextRenewalDate, sub)}
                      priceMinor={sub.priceMinor}
                      currency={sub.currency}
                      today={ctx.today}
                    />
                  ) : (
                    <p className="text-[13px] text-muted">Owners, admins and finance record renewal outcomes and payments.</p>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Card title="License allocation" action={!sub.archived ? <LinkButton href={`/business/licenses/${id}`}>Manage seats</LinkButton> : undefined}>
            {seatInfo.purchased === null && seatInfo.assigned === 0 ? (
              <p className="text-[13.5px] text-muted">Seats aren&apos;t tracked for this subscription.{canEdit ? " Add the purchased seat count to track utilization." : ""}</p>
            ) : (
              <>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  <RadialGauge value={seatInfo.utilization} label="Seat utilization" sub={seatInfo.purchased !== null ? "seats in use" : "no seat count"} size={116} />
                  <div className="grid w-full min-w-0 flex-1 grid-cols-2 gap-3">
                    <Stat label="Purchased" value={seatInfo.purchased ?? "—"} />
                    <Stat label="In use" value={seatInfo.assigned} sub={seatInfo.assignedSource === "named" ? "Named assignments" : seatInfo.assignedSource === "reported" ? "Reported count" : "None recorded"} />
                    <Stat label="Available" value={seatInfo.available ?? "—"} />
                    <Stat label="Cost per seat" value={seatInfo.costPerSeatMonthly !== null ? `${formatMoney(Math.round(seatInfo.costPerSeatMonthly), sub.currency)}/mo` : "—"} sub={sub.pricingModel === "per_seat" ? undefined : "Flat price"} />
                  </div>
                </div>
                {seatInfo.unusedMonthly !== null && seatInfo.unusedMonthly > 0 && (
                  <p className="mt-2 text-[13px] text-muted">
                    Unassigned seats cost about <strong className="text-fg">{formatMoney(Math.round(seatInfo.unusedMonthly), sub.currency)}</strong> a month.
                  </p>
                )}
                {seatInfo.overAssigned && <p className="mt-2 text-[13px] text-warn">More people are assigned than seats purchased — check the plan.</p>}
                {named.length > 0 && (
                  <p className="mt-3 text-[13px] text-muted">
                    <span className="text-faint">Assigned to: </span>
                    {named.map((a) => a.personName).join(", ")}
                  </p>
                )}
              </>
            )}
            <p className="mt-3 text-[12px] text-faint">Seats in use come from assignments and reported counts. Actual product usage isn&apos;t known — no usage integration is connected.</p>
          </Card>

          <Card title="Cost history" description="Price and billing terms over time, recorded whenever they change.">
            {myHistory.length === 0 ? (
              <p className="text-[13.5px] text-muted">No price history recorded.</p>
            ) : (
              <TableWrap>
                <table className="biz-table">
                  <thead>
                    <tr>
                      <th>Effective from</th>
                      <th className="num">Price</th>
                      <th>Pricing</th>
                      <th className="num">Seats</th>
                      <th className="num">Monthly equiv.</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...myHistory].reverse().map((h) => {
                      const m = monthlyEquivalent(h);
                      return (
                        <tr key={h.id}>
                          <td className="whitespace-nowrap">{d(h.effectiveFrom)}</td>
                          <td className="num">{h.priceMinor !== null ? `${formatMoney(h.priceMinor, h.currency)}${periodSuffix(h)}` : "—"}</td>
                          <td>{pricingModelLabels[h.pricingModel]}</td>
                          <td className="num">{h.purchasedSeats ?? "—"}</td>
                          <td className="num">{m !== null ? formatMoney(Math.round(m), h.currency) : "—"}</td>
                          <td className="text-muted">{h.reason ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Card>

          <Card
            title="Payments recorded"
            description="Actual expenditure as entered by your team — separate from the recurring estimate."
            action={myPayments.length > 0 ? <span className="text-[13px] text-muted">Total <Money totals={paid} className="!inline font-medium text-fg" /></span> : undefined}
          >
            {myPayments.length === 0 ? (
              <p className="text-[13.5px] text-muted">No payments recorded yet.</p>
            ) : (
              <TableWrap>
                <table className="biz-table">
                  <thead>
                    <tr>
                      <th>Paid on</th>
                      <th className="num">Amount</th>
                      <th>Reference</th>
                      <th>Source</th>
                      {canSpend && <th className="w-10"><span className="sr-only">Actions</span></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {myPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="whitespace-nowrap">{d(p.paidOn)}</td>
                        <td className="num">{formatMoney(p.amountMinor, p.currency)}</td>
                        <td>{p.reference ?? <span className="text-faint">—</span>}</td>
                        <td className="text-muted">{p.source === "renewal" ? "Renewal" : "Entered manually"}</td>
                        {canSpend && (
                          <td>
                            <DeletePaymentButton workspaceId={ws} paymentId={p.id} />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )}
            {canSpend && !sub.archived && (
              <div className="mt-4 border-t border-line pt-4">
                <h3 className="mb-2 text-[13.5px] font-semibold">Record a payment</h3>
                <PaymentForm workspaceId={ws} subscriptionId={id} currency={sub.currency} today={ctx.today} defaultAmount={sub.priceMinor} />
              </div>
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
          <Card title="Owner & department">
            <DefinitionList
              className="sm:grid-cols-1"
              items={[
                { label: "Owner", value: sub.ownerName ?? "No owner", hint: sub.ownerName && !sub.ownSubscriptionOwner ? "Inherited from the software record" : undefined },
                { label: "Department", value: sub.departmentName ?? "No department", hint: sub.departmentName && !sub.ownSubscriptionDepartment ? "Inherited from the software record" : undefined },
                { label: "Renewal owner", value: sub.renewalOwnerName ?? "—" },
              ]}
            />
          </Card>

          <Card title="Contract & notes">
            <DefinitionList
              className="sm:grid-cols-1"
              items={[
                { label: "Contract reference", value: sub.contractReference ?? "—" },
                { label: "Contract end", value: d(sub.contractEndDate) },
                { label: "Cancellation deadline", value: d(sub.cancellationDeadline) },
                { label: "Contract notes", value: sub.contractNotes ? <span className="whitespace-pre-line">{sub.contractNotes}</span> : "—" },
                { label: "Notes", value: sub.notes ? <span className="whitespace-pre-line">{sub.notes}</span> : "—" },
              ]}
            />
          </Card>

          <Card title="Savings opportunities" action={<LinkButton href="/business/savings">Savings center</LinkButton>}>
            {opps.length === 0 ? (
              <p className="text-[13.5px] text-muted">None found for this subscription.</p>
            ) : (
              <ul className="divide-y divide-line">
                {opps.map((o) => (
                  <li key={o.id} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={`/business/savings?focus=${o.id}#${o.id}`} className="text-[13.5px] font-medium text-fg hover:underline underline-offset-2">
                      {o.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
                      <Pill tone="outline">{opportunityTypeLabels[o.type]}</Pill>
                      <StatusPill status={o.status} label={opportunityStatusLabels[o.status]} />
                      <span>{o.estMonthlyMinor !== null && o.currency ? `≈ ${formatMoney(o.estMonthlyMinor * 12, o.currency, { whole: true })}/yr (estimate)` : "No estimate"}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Saver Option deals" description="Live listings for this software from the deals marketplace.">
            {deals.length === 0 ? (
              <p className="text-[13.5px] text-muted">No matching deals listed.</p>
            ) : (
              <ul className="divide-y divide-line">
                {deals.slice(0, 4).map((o) => (
                  <li key={o.slug} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
                    <SoftwareLogo name={o.product.name} src={o.product.logo?.src ?? sub.logoSrc} size={32} className="mt-0.5" />
                    <div className="min-w-0">
                      <Link href={`/business/software-deals/${o.slug}`} className="text-[13.5px] font-medium text-fg hover:underline underline-offset-2">
                        {o.title}
                      </Link>
                      <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
                        <Pill tone="accent">{offerTypeLabels[o.type]}</Pill>
                        <span>{verificationLabel(o)}</span>
                      </p>
                      {o.eligibility[0] && <p className="mt-1 text-[12px] text-faint">Eligibility: {o.eligibility[0]}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[12px] text-faint">Terms and eligibility are set by the provider; check the listing before relying on a discount.</p>
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

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2.5">
      <p className="text-[12px] text-faint">{label}</p>
      <p className="tabular mt-0.5 text-[16px] font-semibold text-fg">{value}</p>
      {sub && <p className="text-[11.5px] text-faint">{sub}</p>}
    </div>
  );
}
