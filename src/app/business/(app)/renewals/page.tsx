import Link from "next/link";
import type { ReactNode } from "react";
import { RenewalTimeline, type TimelineItem } from "@/components/business/charts";
import { RecordRenewalForm, RenewalDecisionForm } from "@/components/business/record-forms";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, EmptyState, InlineNote, LinkButton, Money, PageHeader, Pill, StatusPill, TableWrap, Tabs } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import {
  addDays,
  addMonths,
  addTo,
  daysBetween,
  formatIsoDate,
  formatMoney,
  formatMonth,
  intervalLabel,
  isIsoDate,
  isLive,
  monthEnd,
  nextPeriodDate,
  type CurrencyTotals,
} from "@/lib/business/calc";
import { renewalDecisionLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { can, canEditRecord } from "@/lib/business/permissions";
import { requireBizContext, type BizContext } from "@/lib/server/business/context";
import { getPeople, getRenewalEvents, getSubscriptions, type Subscription } from "@/lib/server/business/data";

export const metadata = { title: "Renewals" };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
const VIEWS = ["upcoming", "calendar", "attention", "history"] as const;
type View = (typeof VIEWS)[number];
const WINDOWS = [30, 60, 90, 365] as const;
const outcomeLabels = { renewed: "Renewed", renegotiated: "Renegotiated", cancelled: "Cancelled" } as const;

export default async function RenewalsPage(props: { searchParams: Promise<Search> }) {
  const q = await props.searchParams;
  const ctx = await requireBizContext("/business/renewals");
  const ws = ctx.workspace.id;
  const [subs, people, events] = await Promise.all([getSubscriptions(ws), getPeople(ws), getRenewalEvents(ws)]);
  const view: View = (VIEWS as readonly string[]).includes(one(q.view) ?? "") ? (one(q.view) as View) : "upcoming";
  const live = subs.filter((s) => isLive(s));
  const attention = attentionGroups(ctx, live);
  const attentionCount = attention.undecided.length + attention.deadlines.length + attention.overdue.length + attention.missing.length;
  const activePeople = people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }));

  return (
    <>
      <PageHeader
        title="Renewals"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Renewals" }]}
        description="Upcoming renewals, cancellation deadlines and what was decided at past renewals."
      />
      <Tabs
        items={[
          { label: "Upcoming", href: "/business/renewals", active: view === "upcoming" },
          { label: "Calendar", href: "/business/renewals?view=calendar", active: view === "calendar" },
          { label: "Requires attention", href: "/business/renewals?view=attention", active: view === "attention", count: attentionCount },
          { label: "History", href: "/business/renewals?view=history", active: view === "history", count: events.length },
        ]}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {view === "upcoming" && <Upcoming ctx={ctx} live={live} windowParam={one(q.window)} />}
          {view === "calendar" && <Calendar ctx={ctx} live={live} monthParam={one(q.month)} />}
          {view === "attention" && <Attention ctx={ctx} groups={attention} people={activePeople} />}
          {view === "history" && <History ctx={ctx} events={events} logos={new Map(subs.map((x) => [x.id, x.logoSrc]))} />}
        </div>
        <aside className="min-w-0 space-y-4">
          <Card title="Reminders">
            <div className="space-y-2.5 text-[13px] text-muted">
              <p>
                {ctx.workspace.reminderDays.length ? (
                  <>
                    In-app reminders go out <strong className="font-medium text-fg">{ctx.workspace.reminderDays.join(", ")} days</strong> before each renewal and cancellation deadline.
                  </>
                ) : (
                  <>Renewal reminders are switched off for this workspace.</>
                )}{" "}
                A subscription can set its own windows on its edit page.
              </p>
              <p>They&apos;re created when someone opens the app, and daily by a scheduled job once CRON_SECRET is configured. Each reminder is created only once.</p>
              <p>Email reminders aren&apos;t sent: no email provider is configured.</p>
              <Link href="/business/settings/notifications" className="inline-flex items-center gap-1 font-medium text-accent-ink hover:underline">
                Notification settings <Icon name="arrow-right" size={13} />
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}

// ─── Upcoming ───────────────────────────────────────────────────────────────

function Upcoming({ ctx, live, windowParam }: { ctx: BizContext; live: Subscription[]; windowParam?: string }) {
  const fmt = ctx.workspace.dateFormat;
  const win = (WINDOWS as readonly number[]).includes(Number(windowParam)) ? Number(windowParam) : 90;
  const rows = live
    .filter((s) => s.nextRenewalDate && daysBetween(ctx.today, s.nextRenewalDate) >= 0 && daysBetween(ctx.today, s.nextRenewalDate) <= win)
    .sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!));
  const expected: CurrencyTotals = {};
  let unpriced = 0;
  for (const s of rows) {
    if (s.priceMinor === null) unpriced++;
    else addTo(expected, s.currency, s.priceMinor);
  }
  const TIMELINE_DAYS = 60;
  const timeline: TimelineItem[] = [];
  for (const s of live) {
    if (s.nextRenewalDate) {
      const d = daysBetween(ctx.today, s.nextRenewalDate);
      if (d >= 0 && d <= TIMELINE_DAYS)
        timeline.push({
          id: s.id,
          name: s.softwareName,
          logo: s.logoSrc,
          date: s.nextRenewalDate,
          dateLabel: formatIsoDate(s.nextRenewalDate, fmt),
          daysLeft: d,
          amount: s.priceMinor !== null ? formatMoney(s.priceMinor, s.currency) : null,
          href: `/business/subscriptions/${s.id}`,
          kind: "renewal",
        });
    }
    if (s.autoRenew && s.cancellationDeadline) {
      const d = daysBetween(ctx.today, s.cancellationDeadline);
      if (d >= 0 && d <= TIMELINE_DAYS)
        timeline.push({
          id: s.id,
          name: s.softwareName,
          logo: s.logoSrc,
          date: s.cancellationDeadline,
          dateLabel: formatIsoDate(s.cancellationDeadline, fmt),
          daysLeft: d,
          amount: null,
          href: `/business/subscriptions/${s.id}`,
          kind: "deadline",
        });
    }
  }
  const deadlineCount = timeline.filter((t) => t.kind === "deadline").length;
  return (
    <div className="space-y-5">
      <Card
        title="Next 60 days"
        description={`${timeline.length - deadlineCount} renewal${timeline.length - deadlineCount === 1 ? "" : "s"}${deadlineCount ? ` and ${deadlineCount} cancellation deadline${deadlineCount === 1 ? "" : "s"}` : ""}, placed on their dates.`}
      >
        {timeline.length === 0 ? (
          <p className="text-[13.5px] text-muted">Nothing renews in the next 60 days.</p>
        ) : (
          <RenewalTimeline items={timeline} days={TIMELINE_DAYS} startLabel="Today" />
        )}
      </Card>
      <Card
        title={`Renewing in the next ${win === 365 ? "12 months" : `${win} days`}`}
        description="Expected amounts are each subscription's current price per billing period."
        action={
          <form method="get" action="/business/renewals" className="flex items-center gap-2">
            <label htmlFor="renewal-window" className="sr-only">
              Window
            </label>
            <select id="renewal-window" name="window" defaultValue={String(win)} className="biz-select">
              {WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w === 365 ? "Next 12 months" : `Next ${w} days`}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-secondary h-9 rounded-[9px] px-3 text-[13px]">
              Show
            </button>
          </form>
        }
      >
        {rows.length === 0 ? (
          <EmptyState icon="calendar" title="No renewals in this window">
            Renewals appear here from each subscription&apos;s next renewal date.
          </EmptyState>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-2 text-[13px] text-muted">
              <span>Expected in this window:</span>
              <Money totals={expected} preferred={ctx.workspace.defaultCurrency} className="!flex-row gap-2 font-semibold text-fg" />
              {unpriced > 0 && <span className="text-faint">· {unpriced} without a price</span>}
            </div>
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th>Renews</th>
                    <th className="num">Expected</th>
                    <th>Billing</th>
                    <th>Auto-renew</th>
                    <th>Cancel by</th>
                    <th>Contract ends</th>
                    <th>Renewal owner</th>
                    <th>Decision</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const days = daysBetween(ctx.today, s.nextRenewalDate!);
                    const deadlineDays = s.cancellationDeadline ? daysBetween(ctx.today, s.cancellationDeadline) : null;
                    return (
                      <tr key={s.id}>
                        <td className="min-w-36 sm:min-w-44">
                          <span className="flex items-center gap-2.5">
                            <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={30} />
                            <span className="min-w-0">
                              <Link href={`/business/subscriptions/${s.id}`} className="font-medium hover:underline">
                                {s.softwareName}
                              </Link>
                              {s.planName && <span className="block text-[12px] text-faint">{s.planName}</span>}
                            </span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          {formatIsoDate(s.nextRenewalDate, fmt)}
                          <span className={cn("block text-[12px]", days <= 7 ? "text-warn" : "text-faint")}>{days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`}</span>
                        </td>
                        <td className="num">{s.priceMinor !== null ? formatMoney(s.priceMinor, s.currency) : <span className="text-faint">—</span>}</td>
                        <td className="whitespace-nowrap">{intervalLabel(s)}</td>
                        <td>{s.autoRenew ? "Yes" : <Pill>Manual</Pill>}</td>
                        <td className="whitespace-nowrap">
                          {s.cancellationDeadline ? (
                            <span className={cn(deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 14 && "text-warn")}>{formatIsoDate(s.cancellationDeadline, fmt)}</span>
                          ) : (
                            <span className="text-faint">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap">{s.contractEndDate ? formatIsoDate(s.contractEndDate, fmt) : <span className="text-faint">—</span>}</td>
                        <td className="whitespace-nowrap">{s.renewalOwnerName ?? s.ownerName ?? <span className="text-faint">—</span>}</td>
                        <td>
                          <Pill tone={s.renewalDecision === "undecided" ? "outline" : s.renewalDecision === "cancel" ? "warn" : "accent"}>{renewalDecisionLabels[s.renewalDecision]}</Pill>
                        </td>
                        <td>
                          <StatusPill status={s.status} label={subscriptionStatusLabels[s.status]} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrap>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── Calendar ───────────────────────────────────────────────────────────────

interface CalEvent {
  date: string;
  kind: "renewal" | "deadline";
  projected: boolean;
  sub: Subscription;
}

/** Renewals and deadlines that fall in a month, including later auto-renewals projected from the billing interval. */
function eventsForMonth(live: Subscription[], month: string): CalEvent[] {
  const start = `${month}-01`;
  const end = monthEnd(month);
  const out: CalEvent[] = [];
  for (const s of live) {
    if (s.nextRenewalDate) {
      let d = s.nextRenewalDate;
      let projected = false;
      for (let i = 0; i < 400 && d <= end; i++) {
        if (s.contractEndDate && d > s.contractEndDate) break;
        if (d >= start) out.push({ date: d, kind: "renewal", projected, sub: s });
        if (!s.autoRenew) break;
        const next = nextPeriodDate(d, s);
        if (next <= d) break;
        d = next;
        projected = true;
      }
    }
    if (s.cancellationDeadline && s.autoRenew && s.cancellationDeadline >= start && s.cancellationDeadline <= end) out.push({ date: s.cancellationDeadline, kind: "deadline", projected: false, sub: s });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.sub.softwareName.localeCompare(b.sub.softwareName));
}

function Calendar({ ctx, live, monthParam }: { ctx: BizContext; live: Subscription[]; monthParam?: string }) {
  const fmt = ctx.workspace.dateFormat;
  const month = monthParam && /^\d{4}-\d{2}$/.test(monthParam) && isIsoDate(`${monthParam}-01`) ? monthParam : ctx.today.slice(0, 7);
  const prev = addMonths(`${month}-01`, -1).slice(0, 7);
  const next = addMonths(`${month}-01`, 1).slice(0, 7);
  const events = eventsForMonth(live, month);
  const first = `${month}-01`;
  // Monday-first grid: blank cells before the 1st.
  const weekday = (new Date(`${first}T00:00:00Z`).getUTCDay() + 6) % 7;
  const daysInMonth = Number(monthEnd(month).slice(8));
  const cells: (string | null)[] = [...Array.from({ length: weekday }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => addDays(first, i))];
  while (cells.length % 7) cells.push(null);
  const byDay = new Map<string, CalEvent[]>();
  for (const e of events) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);

  const eventLink = (e: CalEvent, compact: boolean) => (
    <Link
      key={`${e.sub.id}-${e.kind}-${e.date}`}
      href={`/business/subscriptions/${e.sub.id}`}
      title={`${e.sub.softwareName}: ${e.kind === "renewal" ? "renewal" : "cancellation deadline"}${e.projected ? " (projected)" : ""}`}
      className={cn(
        "flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-[11.5px] leading-4 hover:underline",
        e.kind === "deadline" ? "bg-warn-soft text-warn" : e.projected ? "border border-dashed border-line-strong text-muted" : "bg-accent-soft text-accent-ink",
        !compact && "px-1.5 py-1 text-[13px] leading-5",
      )}
    >
      <SoftwareLogo name={e.sub.softwareName} src={e.sub.logoSrc} size={compact ? 16 : 20} className={cn(e.projected && "opacity-70")} />
      <span className="min-w-0 truncate">
        {e.kind === "deadline" ? "Cancel by · " : ""}
        {e.sub.softwareName}
        {!compact && e.sub.priceMinor !== null && e.kind === "renewal" && <span className="text-faint"> · {formatMoney(e.sub.priceMinor, e.sub.currency)}</span>}
        {!compact && e.projected && <span className="text-faint"> · projected</span>}
      </span>
    </Link>
  );

  return (
    <Card
      title={formatMonth(month)}
      description="Next renewal dates and cancellation deadlines. Later auto-renewals are projected from the billing interval (dashed)."
      action={
        <div className="flex items-center gap-1">
          <LinkButton href={`/business/renewals?view=calendar&month=${prev}`} icon="chevron-left">
            <span className="sr-only">Previous month</span>
          </LinkButton>
          <LinkButton href="/business/renewals?view=calendar">Today</LinkButton>
          <LinkButton href={`/business/renewals?view=calendar&month=${next}`} icon="chevron-right">
            <span className="sr-only">Next month</span>
          </LinkButton>
        </div>
      }
    >
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line text-[12px]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="bg-subtle px-2 py-1.5 font-medium text-muted">
              {d}
            </div>
          ))}
          {cells.map((d, i) => (
            <div key={i} className={cn("min-h-24 bg-surface p-1.5", !d && "bg-subtle/50")}>
              {d && (
                <>
                  <span className={cn("mb-1 inline-flex size-6 items-center justify-center rounded-full text-[12px]", d === ctx.today ? "bg-accent font-semibold text-accent-fg" : "text-muted")}>
                    {Number(d.slice(8))}
                  </span>
                  <div className="space-y-1">{(byDay.get(d) ?? []).map((e) => eventLink(e, true))}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden">
        {events.length === 0 ? (
          <p className="text-[13.5px] text-muted">Nothing renews this month.</p>
        ) : (
          <ul className="divide-y divide-line">
            {[...byDay.entries()].map(([d, list]) => (
              <li key={d} className="py-2.5">
                <p className={cn("mb-1 text-[12.5px] font-medium", d === ctx.today ? "text-accent-ink" : "text-muted")}>{formatIsoDate(d, fmt)}</p>
                <div className="space-y-1">{list.map((e) => eventLink(e, false))}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {events.length > 0 && <p className="mt-3 text-[12px] text-faint">{events.length} item{events.length === 1 ? "" : "s"} this month.</p>}
    </Card>
  );
}

// ─── Requires attention ─────────────────────────────────────────────────────

interface Groups {
  undecided: Subscription[];
  deadlines: Subscription[];
  overdue: Subscription[];
  missing: Subscription[];
}

function attentionGroups(ctx: BizContext, live: Subscription[]): Groups {
  const days = (d: string) => daysBetween(ctx.today, d);
  return {
    overdue: live.filter((s) => s.nextRenewalDate && s.nextRenewalDate < ctx.today).sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!)),
    deadlines: live.filter((s) => s.autoRenew && s.cancellationDeadline && days(s.cancellationDeadline) >= 0 && days(s.cancellationDeadline) <= 14).sort((a, b) => a.cancellationDeadline!.localeCompare(b.cancellationDeadline!)),
    undecided: live.filter((s) => s.renewalDecision === "undecided" && s.nextRenewalDate && days(s.nextRenewalDate) >= 0 && days(s.nextRenewalDate) <= 30).sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!)),
    missing: live.filter((s) => !s.nextRenewalDate),
  };
}

function Attention({ ctx, groups, people }: { ctx: BizContext; groups: Groups; people: { id: string; name: string; departmentName: string | null }[] }) {
  const fmt = ctx.workspace.dateFormat;
  const ws = ctx.workspace.id;
  const canRecord = can(ctx.role, "spend.manage");
  const editable = (s: Subscription) => canEditRecord(ctx.role, { ownerPersonId: s.ownerPersonId }, ctx.personId);
  const total = groups.undecided.length + groups.deadlines.length + groups.overdue.length + groups.missing.length;
  if (total === 0) {
    return (
      <Card>
        <EmptyState icon="check" title="Nothing needs attention">
          No overdue renewals, no deadlines in the next 14 days, and every renewal in the next 30 days has a decision.
        </EmptyState>
      </Card>
    );
  }
  const decision = (s: Subscription) =>
    editable(s) ? (
      <Expand label="Record a decision">
        <RenewalDecisionForm workspaceId={ws} subscriptionId={s.id} decision={s.renewalDecision} ownerPersonId={s.renewalOwnerPersonId} notes={s.renewalNotes} people={people} />
      </Expand>
    ) : null;
  return (
    <div className="space-y-5">
      {groups.overdue.length > 0 && (
        <Card title="Renewal date has passed" description="Record what happened so the next renewal date moves on.">
          <ul className="divide-y divide-line">
            {groups.overdue.map((s) => (
              <Item key={s.id} s={s} detail={`Was due ${formatIsoDate(s.nextRenewalDate, fmt)} · ${-daysBetween(ctx.today, s.nextRenewalDate!)} days ago`}>
                {canRecord ? (
                  <Expand label="Record the outcome">
                    <RecordRenewalForm
                      workspaceId={ws}
                      subscriptionId={s.id}
                      renewalDate={s.nextRenewalDate!}
                      suggestedNext={nextPeriodDate(s.nextRenewalDate!, s)}
                      priceMinor={s.priceMinor}
                      currency={s.currency}
                      today={ctx.today}
                    />
                  </Expand>
                ) : (
                  <p className="text-[12.5px] text-faint">An owner, admin or finance member can record the outcome.</p>
                )}
              </Item>
            ))}
          </ul>
        </Card>
      )}
      {groups.deadlines.length > 0 && (
        <Card title="Cancellation deadlines in the next 14 days" description="After the deadline, the next period is charged automatically.">
          <ul className="divide-y divide-line">
            {groups.deadlines.map((s) => (
              <Item key={s.id} s={s} detail={`Cancel by ${formatIsoDate(s.cancellationDeadline, fmt)} · renews ${formatIsoDate(s.nextRenewalDate, fmt)} · ${renewalDecisionLabels[s.renewalDecision]}`}>
                {decision(s)}
              </Item>
            ))}
          </ul>
        </Card>
      )}
      {groups.undecided.length > 0 && (
        <Card title="Renewals in the next 30 days without a decision">
          <ul className="divide-y divide-line">
            {groups.undecided.map((s) => (
              <Item
                key={s.id}
                s={s}
                detail={`Renews ${formatIsoDate(s.nextRenewalDate, fmt)} · in ${daysBetween(ctx.today, s.nextRenewalDate!)} days${s.priceMinor !== null ? ` · ${formatMoney(s.priceMinor, s.currency)}` : ""}`}
              >
                {decision(s)}
              </Item>
            ))}
          </ul>
        </Card>
      )}
      {groups.missing.length > 0 && (
        <Card title="No renewal date" description="Without a date these subscriptions get no reminders and don't appear in the calendar.">
          <ul className="divide-y divide-line">
            {groups.missing.map((s) => (
              <Item key={s.id} s={s} detail={`${intervalLabel(s)}${s.startDate ? ` · started ${formatIsoDate(s.startDate, fmt)}` : ""}`}>
                {editable(s) && (
                  <LinkButton href={`/business/subscriptions/${s.id}/edit`} icon="pen">
                    Add the renewal date
                  </LinkButton>
                )}
              </Item>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Item({ s, detail, children }: { s: Subscription; detail: string; children?: ReactNode }) {
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={34} className="mt-0.5" />
          <div className="min-w-0">
            <Link href={`/business/subscriptions/${s.id}`} className="text-[14px] font-medium text-fg hover:underline">
              {s.softwareName}
              {s.planName && <span className="font-normal text-faint"> · {s.planName}</span>}
            </Link>
            <p className="text-[12.5px] text-muted">{detail}</p>
          </div>
        </div>
        <span className="text-[12.5px] text-faint">{s.renewalOwnerName ?? s.ownerName ?? "No owner"}</span>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </li>
  );
}

function Expand({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-line">
      <summary className="flex cursor-pointer select-none items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-accent-ink">
        <Icon name="chevron-right" size={13} className="transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div className="border-t border-line p-3">{children}</div>
    </details>
  );
}

// ─── History ────────────────────────────────────────────────────────────────

function History({ ctx, events, logos }: { ctx: BizContext; events: Awaited<ReturnType<typeof getRenewalEvents>>; logos: Map<string, string | null> }) {
  const fmt = ctx.workspace.dateFormat;
  return (
    <Card title="Renewal history" description="Outcomes recorded at each renewal date.">
      {events.length === 0 ? (
        <EmptyState icon="calendar" title="No renewals recorded yet">
          When a renewal date passes, record whether it was renewed, renegotiated or cancelled — from the subscription or the Requires attention tab.
        </EmptyState>
      ) : (
        <TableWrap>
          <table className="biz-table">
            <thead>
              <tr>
                <th>Renewal date</th>
                <th>Software</th>
                <th>Outcome</th>
                <th className="num">Amount</th>
                <th>Next renewal</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap">{formatIsoDate(e.renewalDate, fmt)}</td>
                  <td className="min-w-40">
                    <span className="flex items-center gap-2.5">
                      <SoftwareLogo name={e.softwareName} src={logos.get(e.subscriptionId) ?? null} size={26} />
                      <Link href={`/business/subscriptions/${e.subscriptionId}`} className="font-medium hover:underline">
                        {e.softwareName}
                      </Link>
                    </span>
                  </td>
                  <td>
                    <Pill tone={e.outcome === "cancelled" ? "outline" : e.outcome === "renegotiated" ? "accent" : "success"}>{outcomeLabels[e.outcome]}</Pill>
                  </td>
                  <td className="num">{e.amountMinor !== null ? formatMoney(e.amountMinor, e.currency) : <span className="text-faint">—</span>}</td>
                  <td className="whitespace-nowrap">{e.newRenewalDate ? formatIsoDate(e.newRenewalDate, fmt) : <span className="text-faint">—</span>}</td>
                  <td className="max-w-64 text-[12.5px] text-muted">{e.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
      <div className="mt-4">
        <InlineNote>Renewals recorded with a payment also count as recorded spend in Reports.</InlineNote>
      </div>
    </Card>
  );
}
