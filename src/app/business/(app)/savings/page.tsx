import Link from "next/link";
import { deleteRealizedSavingAction, recordRealizedSavingAction, setOpportunityStatusAction } from "@/app/business/actions/savings";
import { BarList, type BarRow } from "@/components/business/charts";
import { ActionForm, ConfirmSubmit, SelectField, Submit, TextAreaField, TextField } from "@/components/business/forms";
import { SoftwareLogo } from "@/components/business/software-logo";
import { BilledAs, Card, EmptyState, FxNoteLine, Kpi, LinkButton, Money, PageHeader, Pagination, Pill, StatusPill, TableWrap, Tabs } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { firstYearValue, formatIsoDate, formatMoney, minorToInput, potentialSavings, realizedTotals, totalsList } from "@/lib/business/calc";
import {
  COMMON_CURRENCIES,
  OPPORTUNITY_TYPES,
  opportunityStatusLabels,
  opportunityTypeLabels,
  type Confidence,
  type OpportunityStatus,
  type OpportunityType,
} from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import {
  ANNUAL_PROMPT_AFTER_DAYS,
  ANNUAL_PROMPT_TOP,
  DEALS_PER_SOFTWARE,
  EXPENSIVE_MIN_SUBSCRIPTIONS,
  EXPENSIVE_SHARE,
  RENEWAL_REVIEW_DAYS,
  UNDERUTILIZED_BELOW,
} from "@/lib/business/savings";
import { requireBizContext } from "@/lib/server/business/context";
import { workspaceDisplay } from "@/lib/server/business/display-currency";
import { getRealizedSavings, getSoftwareList, getSubscriptions, type Opportunity } from "@/lib/server/business/data";
import { refreshSavings } from "@/lib/server/business/savings-sync";

export const metadata = { title: "Spend Detective — savings opportunities" };

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined);

const STATUS_VIEWS = ["open", "actioned", "dismissed", "resolved", "all"] as const;
type StatusView = (typeof STATUS_VIEWS)[number];
const viewLabels: Record<StatusView, string> = { open: "New & reviewing", actioned: "Accepted", dismissed: "Dismissed", resolved: "No longer detected", all: "All" };
const inView = (o: Opportunity, v: StatusView) => (v === "all" ? true : v === "open" ? o.status === "open" || o.status === "reviewed" : o.status === v);

const confidenceTone: Record<Confidence, "success" | "accent" | "neutral"> = { high: "success", medium: "accent", low: "neutral" };
const confidenceLabels: Record<Confidence, string> = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" };
const recurrenceLabels = { one_time: "One-time", monthly: "Monthly", yearly: "Yearly" } as const;

export default async function SavingsPage(props: { searchParams: Promise<Raw> }) {
  const ctx = await requireBizContext("/business/savings");
  const sp = await props.searchParams;
  const ws = ctx.workspace.id;
  const fmt = ctx.workspace.dateFormat;
  const pref = ctx.workspace.defaultCurrency;
  const canManage = can(ctx.role, "spend.manage");

  // Re-run the rules against current data first, so the list is never stale.
  const billedOpps = await refreshSavings(ctx);
  const [subs, software, billedRealized, display] = await Promise.all([getSubscriptions(ws), getSoftwareList(ws), getRealizedSavings(ws), workspaceDisplay(ctx)]);
  // Estimates and realized savings in the workspace currency (ECB rate); forms keep the currency it's billed in.
  const opps = display.rows(billedOpps, ["estMonthlyMinor"]);
  const realized = display.rows(billedRealized, ["amountMinor"]);
  const subById = new Map(subs.map((s) => [s.id, s]));
  const softwareById = new Map(software.map((s) => [s.id, s]));

  const viewRaw = one(sp.status);
  const view: StatusView = (STATUS_VIEWS as readonly string[]).includes(viewRaw ?? "") ? (viewRaw as StatusView) : "open";
  const typeRaw = one(sp.type);
  const type = (OPPORTUNITY_TYPES as readonly string[]).includes(typeRaw ?? "") ? (typeRaw as OpportunityType) : null;
  const confRaw = one(sp.confidence);
  const confidence = confRaw === "high" || confRaw === "medium" || confRaw === "low" ? (confRaw as Confidence) : null;

  const potential = potentialSavings(opps);
  const active = opps.filter((o) => o.status === "open" || o.status === "reviewed");
  const realizedTotal = realizedTotals(realized);
  const realizedFor = new Set(realized.map((r) => r.opportunityId).filter((id): id is string => Boolean(id)));
  const list = opps
    .filter((o) => inView(o, view) && (!type || o.type === type) && (!confidence || o.confidence === confidence))
    .sort((a, b) => (b.estMonthlyMinor ?? -1) - (a.estMonthlyMinor ?? -1) || b.createdAt.getTime() - a.createdAt.getTime());

  // Ten per page; ?focus=<id> (from links elsewhere in the app) opens the page holding that opportunity.
  const PER_PAGE = 10;
  const pageCount = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const focusIndex = list.findIndex((o) => o.id === one(sp.focus));
  const pageRaw = Number(one(sp.page));
  const page = focusIndex >= 0 ? Math.floor(focusIndex / PER_PAGE) + 1 : Number.isInteger(pageRaw) && pageRaw >= 1 && pageRaw <= pageCount ? pageRaw : 1;
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Visual summary of the open findings: the largest estimates (one per subscription) and how many of each type.
  const estCount = new Map<string, number>();
  for (const o of active) if (o.estMonthlyMinor !== null && o.currency) estCount.set(o.currency, (estCount.get(o.currency) ?? 0) + 1);
  const vizCurrency = estCount.has(pref) ? pref : ([...estCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? pref);
  const largest = new Map<string, BarRow>();
  for (const o of active) {
    if (o.estMonthlyMinor === null || o.currency !== vizCurrency) continue;
    const key = o.subscriptionId ?? o.softwareId ?? o.id;
    const annual = o.estMonthlyMinor * 12;
    if ((largest.get(key)?.value ?? -1) >= annual) continue;
    const sub = o.subscriptionId ? subById.get(o.subscriptionId) : undefined;
    const sw = o.softwareId ? softwareById.get(o.softwareId) : undefined;
    largest.set(key, {
      label: sub?.softwareName ?? sw?.name ?? o.title,
      sub: opportunityTypeLabels[o.type],
      value: annual,
      display: `${formatMoney(annual, vizCurrency, { whole: true })}/yr`,
      href: `/business/savings?focus=${o.id}#${o.id}`,
      logo: sub?.logoSrc ?? sw?.logoSrc ?? null,
    });
  }
  const largestRows = [...largest.values()].sort((a, b) => b.value - a.value);
  const typeRows: BarRow[] = OPPORTUNITY_TYPES.map((t) => {
    const n = active.filter((o) => o.type === t).length;
    return { label: opportunityTypeLabels[t], value: n, display: String(n), href: `/business/savings?type=${t}` };
  })
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const query = (patch: Record<string, string | null>) => {
    const q = new URLSearchParams();
    const merged = { status: view, type, confidence, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "status" && v === "open")) q.set(k, v);
    const s = q.toString();
    return `/business/savings${s ? `?${s}` : ""}`;
  };
  const currencyOptions = [...new Set([pref, ...subs.filter((s) => !s.archived).map((s) => s.currency), ...COMMON_CURRENCIES])].map((c) => ({ value: c, label: c }));

  return (
    <>
      <PageHeader
        title={
          <span className="flex flex-wrap items-baseline gap-x-2">
            Spend Detective <span className="text-[15px] font-normal text-faint">· savings opportunities</span>
          </span>
        }
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Savings opportunities" }]}
        description="Rule-based checks of your own subscription, seat and renewal records, plus matching Saver Option listings. Every estimate comes from prices your team entered, and no product usage is assumed — Saver Option has no usage data, so seats count as used when they're assigned or reported. Potential savings aren't realized until someone confirms them."
        actions={<LinkButton href="/business/reports">Reports</LinkButton>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Potential savings"
          icon="piggy"
          value={totalsList(potential.annual).length ? <span><Money totals={potential.annual} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /yr</span></span> : "—"}
          sub={totalsList(potential.monthly).length ? <span>≈ <Money totals={potential.monthly} preferred={pref} className="!inline" /> /mo · estimates</span> : "No estimates yet"}
        />
        <Kpi label="Open opportunities" icon="layers" value={active.length} sub={`${potential.counted} subscriptions with an estimate`} />
        <Kpi label="Need a manual comparison" icon="info" value={potential.withoutEstimate} sub="No verified price to base an amount on" />
        <Kpi
          label="Confirmed realized savings"
          icon="check"
          value={totalsList(realizedTotal).length ? <Money totals={realizedTotal} preferred={pref} /> : "—"}
          sub="First-year value of confirmed savings"
        />
      </div>
      <p className="mt-2 text-[12px] text-faint">
        Potential savings count each subscription once — when several findings concern the same subscription (say, unused seats and a possible overlap that would
        cancel it), only the largest estimate is added, so they aren&apos;t double-counted.
      </p>
      <FxNoteLine note={display.note()} dateFormat={fmt} className="mt-1" />

      {active.length > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="min-w-0" title="Largest estimates" description={`Open findings with an amount, one per subscription (${vizCurrency}, per year).`}>
            {largestRows.length === 0 ? (
              <p className="text-[13.5px] text-muted">No open finding has an estimate yet — the ones listed need a manual comparison.</p>
            ) : (
              <BarList rows={largestRows} caption="Largest estimated savings by subscription" valueHead="Estimate /yr" max={6} />
            )}
          </Card>
          <Card className="min-w-0" title="Open findings by type" description="How many open or reviewed findings each rule produced.">
            <BarList rows={typeRows} caption="Open findings by type" valueHead="Open" max={8} />
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Tabs items={STATUS_VIEWS.map((v) => ({ label: viewLabels[v], href: query({ status: v }), active: v === view, count: opps.filter((o) => inView(o, v)).length }))} />
        <form method="get" action="/business/savings" className="mb-4 flex flex-wrap items-end gap-2">
          {view !== "open" && <input type="hidden" name="status" value={view} />}
          <label className="text-[12.5px] text-muted">
            <span className="mb-1 block">Type</span>
            <select name="type" defaultValue={type ?? ""} className="biz-select">
              <option value="">All types</option>
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {opportunityTypeLabels[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[12.5px] text-muted">
            <span className="mb-1 block">Confidence</span>
            <select name="confidence" defaultValue={confidence ?? ""} className="biz-select">
              <option value="">Any confidence</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <button type="submit" className="btn btn-secondary h-9 rounded-[9px] px-3 text-[13px]">
            Apply
          </button>
          {(type || confidence) && (
            <Link href={query({ type: null, confidence: null })} className="h-9 px-2 text-[13px] leading-9 text-muted hover:text-fg">
              Clear filters
            </Link>
          )}
        </form>

        {opps.length === 0 ? (
          <Card>
            <EmptyState icon="piggy" title="No opportunities found yet">
              Opportunities appear as you add subscriptions with prices, seats and renewal dates — for example unused per-seat licenses, tools that may overlap,
              renewals that need a decision, or Saver Option deals for software you use.
            </EmptyState>
          </Card>
        ) : list.length === 0 ? (
          <Card>
            <EmptyState icon="info" title="Nothing matches these filters">
              Try another status or clear the filters.
            </EmptyState>
          </Card>
        ) : (
          <>
          <ul className="space-y-3">
            {shown.map((o) => {
              const sub = o.subscriptionId ? subById.get(o.subscriptionId) : undefined;
              const sw = o.softwareId ? softwareById.get(o.softwareId) : undefined;
              return (
                <OpportunityCard
                  key={o.id}
                  o={o}
                  ctx={{ workspaceId: ws, today: ctx.today, fmt, pref, canManage }}
                  subscription={sub}
                  softwareName={sw?.name}
                  logo={sub ? { name: sub.softwareName, src: sub.logoSrc } : sw ? { name: sw.name, src: sw.logoSrc } : undefined}
                  realized={realizedFor.has(o.id)}
                  currencyOptions={currencyOptions}
                />
              );
            })}
          </ul>
          <Pagination page={page} pageCount={pageCount} href={(p) => query({ page: p > 1 ? String(p) : null })} />
          </>
        )}
      </div>

      <Card title="Confirmed savings" description="Savings your team confirmed actually happened, with the amount they entered. Only these count as realized." className="mt-6">
        {realized.length === 0 ? (
          <p className="text-[13.5px] text-muted">None yet. Record one from an opportunity once a change has gone through (a plan reduced, a tool cancelled, a better price agreed).</p>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Confirmed</th>
                  <th>Description</th>
                  <th className="num">Amount</th>
                  <th className="num">First-year value</th>
                  <th>Evidence</th>
                  {canManage && <th>
                    <span className="sr-only">Actions</span>
                  </th>}
                </tr>
              </thead>
              <tbody>
                {realized.map((r) => {
                  const sub = r.subscriptionId ? subById.get(r.subscriptionId) : undefined;
                  return (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap">{formatIsoDate(r.confirmedOn, fmt)}</td>
                      <td className="min-w-56">
                        {r.description}
                        {sub && (
                          <Link href={`/business/subscriptions/${sub.id}`} className="block text-[12px] text-faint hover:underline">
                            {sub.softwareName}
                          </Link>
                        )}
                      </td>
                      <td className="num">
                        {formatMoney(r.amountMinor, r.currency)} <span className="text-faint">{recurrenceLabels[r.recurrence].toLowerCase()}</span>
                        <BilledAs original={r.original} field="amountMinor" />
                      </td>
                      <td className="num">{formatMoney(firstYearValue(r), r.currency)}</td>
                      <td className="min-w-40 text-[12.5px] text-muted">{r.evidence ?? "—"}</td>
                      {canManage && (
                        <td>
                          <ActionForm action={deleteRealizedSavingAction} workspaceId={ws} className="inline">
                            <input type="hidden" name="id" value={r.id} />
                            <ConfirmSubmit title="Remove this confirmed saving?" body="It will no longer count towards realized savings." confirmLabel="Remove" variant="ghost">
                              <Icon name="trash" size={14} />
                              <span className="sr-only">Remove</span>
                            </ConfirmSubmit>
                          </ActionForm>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Card title="How opportunities are found" className="mt-6" bodyClassName="text-[13.5px] text-muted">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-fg">Unused licenses</strong> — per-seat plans with purchased seats nobody is assigned to. Estimate = unassigned seats × (price ÷
            purchased seats), monthly equivalent. Confidence is high with named seat assignments, medium with a reported count, low when nothing is recorded.
          </li>
          <li>
            <strong className="text-fg">Underutilized licenses</strong> — flat-priced plans (or per-seat plans without a price) below {UNDERUTILIZED_BELOW}% seat
            utilization. No amount: the price doesn&apos;t scale with seats.
          </li>
          <li>
            <strong className="text-fg">Potential overlap</strong> — two or more active tools in a category where one usually does the job (team chat, video
            meetings, project management, docs, design, CRM, support, analytics, finance, HR, file storage, office tools). The estimate is the cheaper tool&apos;s
            cost, only when both are priced in the same currency. Always for human review — never a confirmed duplicate.
          </li>
          <li>
            <strong className="text-fg">High-cost subscriptions</strong> — one subscription worth at least {Math.round(EXPENSIVE_SHARE * 100)}% of the monthly cost in its
            currency, when there are at least {EXPENSIVE_MIN_SUBSCRIPTIONS} priced subscriptions in that currency. No saving is assumed.
          </li>
          <li>
            <strong className="text-fg">Annual billing</strong> — monthly plans with an annual price recorded on the subscription: the estimate is 12 × the monthly
            price minus that annual price. Without a recorded annual price, your {ANNUAL_PROMPT_TOP} largest monthly plans per currency get a prompt to check once they&apos;ve run {ANNUAL_PROMPT_AFTER_DAYS}+ days, with no amount.
          </li>
          <li>
            <strong className="text-fg">Alternative software</strong> — open-source products listed in the Saver Option catalog for the same job. No price comparison
            is made: self-hosting has its own costs.
          </li>
          <li>
            <strong className="text-fg">Renewal reviews</strong> — quarterly, yearly and other non-monthly plans renewing (or with a cancellation deadline) within{" "}
            {RENEWAL_REVIEW_DAYS} days, with no renewal decision recorded.
          </li>
          <li>
            <strong className="text-fg">Saver Option deals</strong> — live listings on{" "}
            <Link href="/business/software-deals" className="text-accent-ink underline underline-offset-2">
              /deals
            </Link>{" "}
            for software you use or are evaluating — discounts, credits, startup programs, lifetime licences and free plans, at most {DEALS_PER_SOFTWARE} per tool (student offers and trials are left out). Whether you qualify depends on the listing&apos;s eligibility, so no amount is estimated.
          </li>
        </ol>
        <p className="mt-3">
          Potential savings are estimates, not guarantees. A saving only becomes realized when someone confirms it here with the amount (and, ideally, evidence such as
          the new invoice).
        </p>
      </Card>
    </>
  );
}

function OpportunityCard({
  o,
  ctx,
  subscription,
  softwareName,
  logo,
  realized,
  currencyOptions,
}: {
  o: Opportunity;
  ctx: { workspaceId: string; today: string; fmt: string; pref: string; canManage: boolean };
  subscription?: { id: string; softwareName: string; planName: string | null; currency: string };
  softwareName?: string;
  logo?: { name: string; src: string | null };
  /** A confirmed realized saving exists for this opportunity. */
  realized?: boolean;
  currencyOptions: { value: string; label: string }[];
}) {
  const estimate = o.estMonthlyMinor !== null && o.currency ? potentialSavings([{ ...o, status: "open" }]) : null;
  const statusForm = (status: OpportunityStatus, label: string, variant: "primary" | "secondary" | "ghost" = "secondary") => (
    <ActionForm action={setOpportunityStatusAction} workspaceId={ctx.workspaceId} className="inline">
      <input type="hidden" name="id" value={o.id} />
      <input type="hidden" name="status" value={status} />
      <Submit size="sm" variant={variant} pendingLabel="Saving…">
        {label}
      </Submit>
    </ActionForm>
  );
  // A realized saving is recorded in the currency the estimate was made in (as billed), not the display currency.
  const billedEst = o.original ? (o.original.values.estMonthlyMinor ?? null) : o.estMonthlyMinor;
  const billedCurrency = o.original?.currency ?? o.currency;
  const defaultCurrency = billedCurrency ?? subscription?.currency ?? ctx.pref;
  return (
    <li id={o.id} className="biz-card scroll-mt-24 px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          {logo ? (
            <SoftwareLogo name={logo.name} src={logo.src} size={44} className="mt-0.5" />
          ) : (
            <span aria-hidden="true" className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-accent-soft text-accent-ink">
              <Icon name="piggy" size={20} />
            </span>
          )}
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <Pill tone="outline">{opportunityTypeLabels[o.type]}</Pill>
              <Pill tone={confidenceTone[o.confidence]}>{confidenceLabels[o.confidence]}</Pill>
              <StatusPill status={o.status} label={opportunityStatusLabels[o.status]} />
              {realized && <Pill tone="success">Realized</Pill>}
            </div>
            <h2 className="text-[15px] font-semibold text-fg">{o.title}</h2>
            <p className="mt-1 text-[12.5px] text-faint">
              {softwareName && o.softwareId && (
                <>
                  <Link href={`/business/software/${o.softwareId}`} className="hover:underline">
                    {softwareName}
                  </Link>
                  {subscription && " · "}
                </>
              )}
              {subscription && (
                <Link href={`/business/subscriptions/${subscription.id}`} className="hover:underline">
                  {subscription.planName ? `${subscription.planName} subscription` : "Subscription"}
                </Link>
              )}
              {(softwareName || subscription) && " · "}
              Last detected {formatIsoDate(o.lastDetectedAt.toISOString().slice(0, 10), ctx.fmt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {estimate ? (
            <>
              <p className="tabular text-[17px] font-semibold text-heading">
                <Money totals={estimate.annual} /> <span className="text-[12.5px] font-normal text-faint">/yr</span>
              </p>
              <p className="tabular text-[12px] text-faint">
                ≈ <Money totals={estimate.monthly} className="!inline" /> /mo estimated
              </p>
            </>
          ) : (
            <p className="max-w-48 text-[12.5px] text-faint">No estimate — needs a manual comparison</p>
          )}
        </div>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">{o.explanation}</p>
      {o.evidence.length > 0 && (
        <dl className="mt-3 grid gap-x-6 gap-y-1.5 rounded-lg bg-subtle px-3 py-2.5 text-[12.5px] sm:grid-cols-2">
          {o.evidence.map((e, i) => (
            <div key={i} className="flex justify-between gap-3">
              <dt className="text-faint">{e.label}</dt>
              <dd className="tabular text-right text-fg">{e.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-3 flex gap-2 text-[13.5px] text-fg">
        <Icon name="arrow-right" size={15} className="mt-0.5 text-accent-ink" />
        <span>
          <span className="font-medium">Recommended:</span> {o.recommendedAction}
        </span>
      </p>
      {o.decision && (
        <p className="mt-2 rounded-lg border border-line px-3 py-2 text-[13px] text-muted">
          <span className="font-medium text-fg">Decision recorded:</span> {o.decision}
          {o.reviewedAt && <span className="text-faint"> · {formatIsoDate(o.reviewedAt.toISOString().slice(0, 10), ctx.fmt)}</span>}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {o.dealSlug && (
          <LinkButton href={`/business/software-deals/${o.dealSlug}`} icon="tag">
            View deal
          </LinkButton>
        )}
        {subscription && <LinkButton href={`/business/subscriptions/${subscription.id}`}>Open subscription</LinkButton>}
        {ctx.canManage && (
          <>
            {o.status === "open" && statusForm("reviewed", "Mark as reviewed")}
            {(o.status === "open" || o.status === "reviewed") && (
              <ActionForm action={setOpportunityStatusAction} workspaceId={ctx.workspaceId} className="inline">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value="dismissed" />
                <ConfirmSubmit title="Dismiss this opportunity?" body="It stays dismissed even when the rules find it again. You can reopen it from the Dismissed tab." confirmLabel="Dismiss" danger={false}>
                  Dismiss
                </ConfirmSubmit>
              </ActionForm>
            )}
            {(o.status === "reviewed" || o.status === "dismissed" || o.status === "actioned") && statusForm("open", "Reopen", "ghost")}
          </>
        )}
      </div>

      {ctx.canManage && o.status !== "resolved" && (
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <details className="rounded-lg border border-line px-3 py-2">
            <summary className="cursor-pointer select-none text-[13px] font-medium text-fg">Record a decision</summary>
            <ActionForm action={setOpportunityStatusAction} workspaceId={ctx.workspaceId} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={o.id} />
              <input type="hidden" name="status" value="actioned" />
              <TextAreaField label="Decision" name="decision" rows={2} maxLength={1000} placeholder="e.g. Reduced the plan by 3 seats at the next renewal" required />
              <Submit size="sm" pendingLabel="Saving…">
                Save decision
              </Submit>
            </ActionForm>
          </details>
          <details className="rounded-lg border border-line px-3 py-2">
            <summary className="cursor-pointer select-none text-[13px] font-medium text-fg">Record a realized saving</summary>
            <ActionForm action={recordRealizedSavingAction} workspaceId={ctx.workspaceId} className="mt-3 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="opportunityId" value={o.id} />
              {o.subscriptionId && <input type="hidden" name="subscriptionId" value={o.subscriptionId} />}
              <TextField
                label="Amount saved"
                name="amount"
                inputMode="decimal"
                required
                defaultValue={billedEst !== null && billedCurrency ? minorToInput(billedEst, billedCurrency) : ""}
                hint={o.estMonthlyMinor !== null ? "Prefilled with the monthly estimate — enter what actually changed." : "Enter the amount from the new invoice or quote."}
              />
              <SelectField label="Currency" name="currency" defaultValue={defaultCurrency} options={currencyOptions} />
              <SelectField
                label="Recurrence"
                name="recurrence"
                defaultValue="monthly"
                options={[
                  { value: "monthly", label: "Per month" },
                  { value: "yearly", label: "Per year" },
                  { value: "one_time", label: "One-time" },
                ]}
              />
              <TextField label="Confirmed on" name="confirmedOn" type="date" defaultValue={ctx.today} max={ctx.today} required />
              <TextField label="What changed" name="description" required maxLength={500} defaultValue={o.title.slice(0, 500)} className="sm:col-span-2" />
              <TextAreaField label="Evidence" name="evidence" optional rows={2} maxLength={1000} placeholder="e.g. New invoice #1234 shows 7 seats instead of 10" className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <Submit size="sm" pendingLabel="Saving…">
                  Confirm saving
                </Submit>
              </div>
            </ActionForm>
          </details>
        </div>
      )}
    </li>
  );
}
