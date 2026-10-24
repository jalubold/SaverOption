import { createHash } from "node:crypto";
import {
  annualized,
  currencyDigits,
  daysBetween,
  formatMoney,
  intervalLabel,
  isLive,
  isRecurring,
  minorToInput,
  monthlyEquivalent,
  normalizeName,
  seatSummary,
  totalsList,
  type CurrencyTotals,
} from "@/lib/business/calc";
import { BILLING_INTERVALS, categoryLabels, opportunityTypeLabels, SOFTWARE_CATEGORIES, SUBSCRIPTION_STATUSES, type OpportunityStatus } from "@/lib/business/constants";
import { findPotentialDuplicates } from "@/lib/business/duplicates";
import { FormReader } from "@/lib/business/form";
import { can } from "@/lib/business/permissions";
import { validateArgs, type ObjectSchema } from "@/lib/business/schema";
import { buildSpendModel, type Group } from "@/lib/server/business/analytics";
import { BizError, type BizContext } from "@/lib/server/business/context";
import { getCostHistory, getDepartments, getPayments, getPeople, getRealizedSavings, getSoftwareList, getSubscription, getSubscriptions, type Subscription } from "@/lib/server/business/data";
import { createSubscription, readSoftwareInput, readSubscriptionInput, updateSubscription } from "@/lib/server/business/records";
import { compareAlternatives } from "@/lib/server/business/alternatives";
import { DEAL_OFFER_TYPES, dealsForWorkspace, DealsInputError, getDealDetails, searchDeals } from "@/lib/server/business/deals";
import { getSpendingInsights } from "@/lib/server/business/insights";
import { buildSavingsReport, saveSavingsReport } from "@/lib/server/business/savings-report";
import { SCOPE_WRITE, type ServerUrls } from "@/lib/server/mcp/oauth";

/**
 * MCP tools for Saver Option Business. Each tool validates its input against
 * the schema it publishes, runs with the connection's workspace context (the
 * member's current role, re-checked on every call) and calls the same services
 * the web app uses — no tool runs raw queries supplied by a client, and none can
 * reach another workspace. Financial results say what they're based on:
 * "actual" (recorded payments), "normalized_estimate" (prices converted to a
 * monthly/annual equivalent), or "projection" (future renewals at current prices).
 */

export interface ToolContext {
  biz: BizContext;
  scopes: string[];
  grantId: string;
  urls: ServerUrls;
  /** Recorded on created subscriptions and reports: an MCP client, or the in-app assistant. */
  source?: "mcp" | "assistant";
}

export interface ToolDef {
  name: string;
  title: string;
  description: string;
  inputSchema: ObjectSchema;
  write?: boolean;
  run: (ctx: ToolContext, args: Record<string, unknown>) => Promise<unknown>;
}

/** An expected failure whose message is safe to show to the user and the model. */
export class ToolError extends Error {}

// ─── Output helpers ──────────────────────────────────────────────────────────

interface MoneyOut {
  amount: string;
  currency: string;
  display: string;
}

function money(minor: number | null | undefined, currency: string): MoneyOut | null {
  if (minor === null || minor === undefined) return null;
  const d = currencyDigits(currency);
  const m = Math.round(minor);
  return { amount: (m / 10 ** d).toFixed(d), currency, display: formatMoney(m, currency) };
}

function totals(t: CurrencyTotals, pref?: string): MoneyOut[] {
  return totalsList(t, pref).map((x) => money(x.amount, x.currency)!);
}

const BASIS = {
  normalized: "normalized_estimate: each subscription's price converted to a monthly equivalent (annualized = monthly × 12); a run-rate, not cash spent",
  actual: "actual: payments recorded in the workspace",
  projection: "projection: upcoming renewals at each subscription's current recorded price",
  potential: "estimate: potential savings computed only from the workspace's own prices and seat counts; not guaranteed and not realized",
  realized: "actual: savings someone confirmed after the expense was reduced (first-year value)",
} as const;

const statusOut: Record<OpportunityStatus, string> = { open: "new", reviewed: "reviewing", actioned: "accepted", dismissed: "dismissed", resolved: "no_longer_detected" };
const statusIn: Record<string, OpportunityStatus> = { new: "open", reviewing: "reviewed", accepted: "actioned", dismissed: "dismissed", no_longer_detected: "resolved" };

function subUrl(ctx: ToolContext, id: string) {
  return `${ctx.urls.origin}/business/subscriptions/${id}`;
}

function subView(ctx: ToolContext, s: Subscription) {
  const m = monthlyEquivalent(s);
  const a = annualized(s);
  const seats = seatSummary(s);
  return {
    id: s.id,
    software: s.softwareName,
    plan: s.planName,
    vendor: s.vendorName,
    category: categoryLabels[s.category] ?? s.category,
    department: s.departmentName,
    owner: s.ownerName,
    status: s.status,
    archived: s.archived,
    price: s.priceMinor === null ? null : { ...money(s.priceMinor, s.currency)!, per: intervalLabel(s), pricing_model: s.pricingModel },
    monthly_equivalent: m === null ? null : money(m, s.currency),
    annualized: a === null ? null : money(a, s.currency),
    next_renewal_date: s.nextRenewalDate,
    auto_renew: s.autoRenew,
    cancellation_deadline: s.cancellationDeadline,
    contract_end_date: s.contractEndDate,
    seats: seats.purchased === null ? null : { purchased: seats.purchased, in_use: seats.assigned, available: seats.available, utilization_percent: seats.utilization === null ? null : Math.round(seats.utilization) },
    source: s.source,
    last_verified_on: s.lastVerifiedOn,
    url: subUrl(ctx, s.id),
  };
}

function groupsOut(groups: Group[], currency: string | undefined, limit: number) {
  const currencies = new Set(groups.flatMap((g) => Object.keys(g.totals)));
  const out: Record<string, { name: string; monthly_equivalent: MoneyOut; share_percent: number; subscriptions: number }[]> = {};
  for (const c of currencies) {
    if (currency && c !== currency) continue;
    const rows = groups.filter((g) => (g.totals[c] ?? 0) > 0).sort((a, b) => b.totals[c]! - a.totals[c]!);
    const total = rows.reduce((t, g) => t + g.totals[c]!, 0);
    out[c] = rows.slice(0, limit).map((g) => ({ name: g.label, monthly_equivalent: money(g.totals[c]!, c)!, share_percent: total ? Math.round((g.totals[c]! / total) * 1000) / 10 : 0, subscriptions: g.count }));
  }
  return out;
}

const currencyProp = { type: "string", pattern: "^[A-Z]{3}$", description: "Limit to one ISO 4217 currency, e.g. USD. Totals are never converted between currencies." } as const;
const subscriptionId = { type: "string", format: "uuid", description: "The subscription's ID (from list_subscriptions)." } as const;
const noArgs: ObjectSchema = { type: "object", properties: {}, additionalProperties: false };

// ─── Write helpers ───────────────────────────────────────────────────────────

const writeFields = {
  plan: { type: "string", maxLength: 80, description: "Plan or edition name, e.g. Professional." },
  price: { type: "string", maxLength: 20, pattern: "^[0-9][0-9,]*(\\.[0-9]{1,3})?$", description: 'What ONE billing period costs in total, as a plain number like "50" or "1299.00". Omit if unknown — never guess.' },
  currency: currencyProp,
  billing_interval: { type: "string", enum: BILLING_INTERVALS, description: "monthly, quarterly, yearly, or custom (then give custom_interval_count and custom_interval_unit)." },
  custom_interval_count: { type: "integer", minimum: 1, maximum: 120 },
  custom_interval_unit: { type: "string", enum: ["day", "week", "month", "year"] },
  pricing_model: { type: "string", enum: ["flat", "per_seat"], description: "per_seat when the price covers seats_purchased seats." },
  seats_purchased: { type: "integer", minimum: 0, maximum: 1_000_000 },
  seats_in_use: { type: "integer", minimum: 0, maximum: 1_000_000, description: "Seats in use as reported by the user (not measured)." },
  start_date: { type: "string", format: "date" },
  next_renewal_date: { type: "string", format: "date" },
  auto_renew: { type: "boolean" },
  cancellation_deadline: { type: "string", format: "date" },
  contract_end_date: { type: "string", format: "date" },
  status: { type: "string", enum: SUBSCRIPTION_STATUSES, description: "Record status. Changing it does NOT cancel anything at the vendor." },
  department: { type: "string", maxLength: 80, description: "An existing department's name." },
  owner: { type: "string", maxLength: 120, description: "An existing person's name or email from the team directory." },
  notes: { type: "string", maxLength: 2000 },
  confirm: { type: "boolean", description: "false (default) returns a preview and saves nothing. Set true only after the user has seen the preview and agreed." },
} as const;

async function resolveRefs(biz: BizContext, args: Record<string, unknown>) {
  const out: { departmentId?: string | null; ownerPersonId?: string | null; departmentName?: string | null; ownerName?: string | null } = {};
  if (typeof args.department === "string") {
    const all = (await getDepartments(biz.workspace.id)).filter((d) => !d.archivedAt);
    const d = all.find((x) => x.name.toLowerCase() === args.department!.toString().toLowerCase());
    if (!d) throw new ToolError(`No department named "${args.department}". Existing departments: ${all.map((x) => x.name).slice(0, 25).join(", ") || "none"}.`);
    out.departmentId = d.id;
    out.departmentName = d.name;
  }
  if (typeof args.owner === "string") {
    const q = args.owner.toLowerCase();
    const p = (await getPeople(biz.workspace.id)).find((x) => x.status === "active" && (x.name.toLowerCase() === q || x.email?.toLowerCase() === q));
    if (!p) throw new ToolError(`No active person named "${args.owner}" in the team directory. Add them in Saver Option first, or leave owner out.`);
    out.ownerPersonId = p.id;
    out.ownerName = p.name;
  }
  return out;
}

/** Builds form fields from a current record plus changes, so MCP writes go through exactly the same validation as the web forms. */
function subscriptionForm(base: Subscription | null, a: Record<string, unknown>, refs: { departmentId?: string | null; ownerPersonId?: string | null }, defaultCurrency: string): FormData {
  const f = new FormData();
  const currency = (a.currency as string) ?? base?.currency ?? defaultCurrency;
  const set = (k: string, v: unknown) => {
    if (v !== null && v !== undefined && v !== "") f.set(k, String(v));
  };
  set("currency", currency);
  set("planName", a.plan ?? base?.planName);
  set("price", a.price ?? (base?.priceMinor != null ? minorToInput(base.priceMinor, currency) : null));
  set("pricingModel", a.pricing_model ?? base?.pricingModel ?? "flat");
  set("billingInterval", a.billing_interval ?? base?.billingInterval ?? "monthly");
  set("customIntervalCount", a.custom_interval_count ?? base?.customIntervalCount);
  set("customIntervalUnit", a.custom_interval_unit ?? base?.customIntervalUnit);
  set("startDate", a.start_date ?? base?.startDate);
  set("nextRenewalDate", a.next_renewal_date ?? base?.nextRenewalDate);
  f.set("autoRenew", String(a.auto_renew ?? base?.autoRenew ?? true));
  set("cancellationDeadline", a.cancellation_deadline ?? base?.cancellationDeadline);
  set("contractEndDate", a.contract_end_date ?? base?.contractEndDate);
  set("status", a.status ?? base?.status ?? "active");
  set("endedOn", base?.endedOn);
  set("purchasedSeats", a.seats_purchased ?? base?.purchasedSeats);
  set("reportedAssignedSeats", a.seats_in_use ?? base?.reportedAssignedSeats);
  set("paymentMethod", base?.paymentMethod);
  set("ownerPersonId", refs.ownerPersonId !== undefined ? refs.ownerPersonId : base?.ownerPersonId);
  set("departmentId", refs.departmentId !== undefined ? refs.departmentId : base?.departmentId);
  set("contractReference", base?.contractReference);
  set("contractNotes", base?.contractNotes);
  set("notes", a.notes ?? base?.notes);
  set("annualPriceOption", base?.annualPriceOptionMinor != null ? minorToInput(base.annualPriceOptionMinor, currency) : null);
  set("reminderDays", base?.reminderDays?.join(","));
  return f;
}

function readOrThrow<T>(f: FormData, read: (r: FormReader) => T): T {
  const r = new FormReader(f);
  const value = read(r);
  if (!r.ok) throw new ToolError(`Some values aren't valid: ${Object.values(r.errors).join(" ")}`);
  return value;
}

function requireWrite(ctx: ToolContext) {
  if (!ctx.scopes.includes(SCOPE_WRITE)) throw new ToolError("This connection is read-only. To add or change records, disconnect and connect again choosing “Read and change”.");
}

function idempotencyKey(ctx: ToolContext, name: string, args: Record<string, unknown>): string {
  const canonical = JSON.stringify(Object.keys(args).filter((k) => k !== "confirm").sort().map((k) => [k, args[k]]));
  return `mcp_${createHash("sha256").update(`${ctx.grantId}|${name}|${ctx.biz.today}|${canonical}`).digest("hex").slice(0, 48)}`;
}

function preview(interpreted: Record<string, unknown>, warnings: string[]) {
  return {
    status: "confirmation_required",
    saved: false,
    message: "Nothing has been saved. Show these details to the user; if they agree, call this tool again with the same fields and confirm: true.",
    interpreted,
    warnings,
  };
}

// ─── Tools ───────────────────────────────────────────────────────────────────

export const tools: ToolDef[] = [
  {
    name: "list_subscriptions",
    title: "List subscriptions",
    description:
      "List the workspace's software subscriptions with price, billing interval, monthly/annual equivalents, renewal date, seats, owner and department. Filter by status, category, department, vendor, billing interval, currency or a search term; sort by cost, renewal date or name. Paginated (limit/offset).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["live", "active", "trial", "paused", "cancelled", "expired", "all"], description: "live (default) = active, trial and paused." },
        search: { type: "string", maxLength: 80, description: "Matches software, plan or vendor name." },
        category: { type: "string", enum: SOFTWARE_CATEGORIES },
        department: { type: "string", maxLength: 80 },
        vendor: { type: "string", maxLength: 80 },
        billing_interval: { type: "string", enum: BILLING_INTERVALS },
        currency: currencyProp,
        include_archived: { type: "boolean" },
        sort: { type: "string", enum: ["cost", "renewal", "name"], description: "cost = highest monthly equivalent first (default)." },
        limit: { type: "integer", minimum: 1, maximum: 100 },
        offset: { type: "integer", minimum: 0, maximum: 100000 },
      },
    },
    async run(ctx, a) {
      const status = (a.status as string) ?? "live";
      const q = typeof a.search === "string" ? a.search.toLowerCase() : null;
      let subs = (await getSubscriptions(ctx.biz.workspace.id)).filter(
        (s) =>
          (a.include_archived || !s.archived) &&
          (status === "all" || (status === "live" ? isLive(s) : s.status === status)) &&
          (!a.category || s.category === a.category) &&
          (!a.department || s.departmentName?.toLowerCase() === String(a.department).toLowerCase()) &&
          (!a.vendor || (s.vendorName ?? "").toLowerCase().includes(String(a.vendor).toLowerCase())) &&
          (!a.billing_interval || s.billingInterval === a.billing_interval) &&
          (!a.currency || s.currency === a.currency) &&
          (!q || [s.softwareName, s.planName, s.vendorName].some((v) => v?.toLowerCase().includes(q))),
      );
      const sort = (a.sort as string) ?? "cost";
      subs = subs.sort((x, y) =>
        sort === "name"
          ? x.softwareName.localeCompare(y.softwareName)
          : sort === "renewal"
            ? (x.nextRenewalDate ?? "9999").localeCompare(y.nextRenewalDate ?? "9999")
            : (monthlyEquivalent(y) ?? -1) - (monthlyEquivalent(x) ?? -1),
      );
      const limit = (a.limit as number) ?? 25;
      const offset = (a.offset as number) ?? 0;
      return {
        total: subs.length,
        offset,
        limit,
        has_more: offset + limit < subs.length,
        subscriptions: subs.slice(offset, offset + limit).map((s) => subView(ctx, s)),
        basis: { monthly_equivalent: BASIS.normalized },
        note: "Amounts are in each subscription's own currency and never converted.",
      };
    },
  },
  {
    name: "get_subscription_details",
    title: "Get subscription details",
    description: "Full details of one subscription: terms, seats, renewal decision, recorded price changes, recent recorded payments and open savings opportunities for it.",
    inputSchema: { type: "object", additionalProperties: false, required: ["subscription_id"], properties: { subscription_id: subscriptionId } },
    async run(ctx, a) {
      const s = await getSubscription(ctx.biz, a.subscription_id as string);
      if (!s) throw new ToolError("No subscription with that ID in this workspace.");
      const ws = ctx.biz.workspace.id;
      const [history, payments, model] = await Promise.all([getCostHistory(ws), getPayments(ws), buildSpendModel(ctx.biz, {}, { refreshSavings: true })]);
      return {
        subscription: subView(ctx, s),
        renewal: { decision: s.renewalDecision, reviewer: s.renewalOwnerName, notes: s.renewalNotes },
        notes: s.notes,
        price_history: history
          .filter((h) => h.subscriptionId === s.id)
          .slice(0, 20)
          .map((h) => ({ effective_from: h.effectiveFrom, price: money(h.priceMinor, h.currency), billing_interval: h.billingInterval, reason: h.reason })),
        recent_payments: payments
          .filter((p) => p.subscriptionId === s.id)
          .slice(0, 12)
          .map((p) => ({ paid_on: p.paidOn, amount: money(p.amountMinor, p.currency) })),
        open_opportunities: model.opportunities
          .filter((o) => o.subscriptionId === s.id && (o.status === "open" || o.status === "reviewed"))
          .map((o) => ({ id: o.id, title: o.title, type: opportunityTypeLabels[o.type], annual_estimate: o.estMonthlyMinor !== null && o.currency ? money(o.estMonthlyMinor * 12, o.currency) : null })),
        basis: { monthly_equivalent: BASIS.normalized, recent_payments: BASIS.actual },
      };
    },
  },
  {
    name: "get_spend_summary",
    title: "Get spend summary",
    description:
      "The workspace's software spend at a glance: monthly and annualized run-rate per currency, active and trial counts, recorded payments in the last 30 and 365 days, renewals in the next 30 days, license utilization, and potential vs realized savings. Each figure states whether it's actual, an estimate or a projection.",
    inputSchema: { type: "object", additionalProperties: false, properties: { currency: currencyProp } },
    async run(ctx, a) {
      const currency = a.currency as string | undefined;
      const model = await buildSpendModel(ctx.biz, { currency: currency ?? null });
      const pref = ctx.biz.workspace.defaultCurrency;
      const payments = (await getPayments(ctx.biz.workspace.id)).filter((p) => !currency || p.currency === currency);
      const paid = (days: number) => {
        const t: CurrencyTotals = {};
        for (const p of payments) if (daysBetween(p.paidOn, ctx.biz.today) <= days && daysBetween(p.paidOn, ctx.biz.today) >= 0) t[p.currency] = (t[p.currency] ?? 0) + p.amountMinor;
        return totals(t, pref);
      };
      return {
        as_of: ctx.biz.today,
        workspace: ctx.biz.workspace.name,
        currencies: model.currencies,
        run_rate: { monthly: totals(model.summary.monthly, pref), annualized: totals(model.summary.annualized, pref), basis: BASIS.normalized },
        subscriptions: { active: model.summary.activeCount, trial: model.summary.trialCount, active_without_price: model.summary.missingPrice, live_without_renewal_date: model.summary.missingRenewalDate },
        recorded_payments: { last_30_days: paid(30), last_365_days: paid(365), basis: BASIS.actual, note: "Only payments someone recorded; empty when the team doesn't record payments." },
        renewals_next_30_days: { count: model.summary.upcomingRenewals },
        licenses: model.licenses.tracked
          ? { plans_tracking_seats: model.licenses.tracked, purchased: model.licenses.purchased, in_use: model.licenses.assigned, available: model.licenses.available, utilization_percent: model.licenses.utilization === null ? null : Math.round(model.licenses.utilization), unused_seat_cost_monthly: totals(model.licenses.unusedMonthly, pref), note: "Seats in use are assigned or reported by the team; usage isn't measured." }
          : null,
        savings: { potential_annual: totals(model.potential.annual, pref), potential_basis: BASIS.potential, opportunities_with_estimate: model.potential.counted, opportunities_without_estimate: model.potential.withoutEstimate, realized_first_year: totals(model.realized, pref), realized_basis: BASIS.realized },
        dashboard_url: `${ctx.urls.origin}/business/dashboard`,
      };
    },
  },
  {
    name: "get_upcoming_renewals",
    title: "Get upcoming renewals",
    description: "Subscriptions renewing in the next N days (default 30, max 365), with expected amount, auto-renew flag, cancellation deadline and renewal decision, plus cancellation deadlines that fall in the window. Totals are a projection at current prices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { days: { type: "integer", minimum: 1, maximum: 365 }, include_cancellation_deadlines: { type: "boolean", description: "Default true." } },
    },
    async run(ctx, a) {
      const days = (a.days as number) ?? 30;
      const subs = (await getSubscriptions(ctx.biz.workspace.id)).filter((s) => !s.archived && isLive(s));
      const inWindow = (d: string | null) => d !== null && daysBetween(ctx.biz.today, d) >= 0 && daysBetween(ctx.biz.today, d) <= days;
      const renewals = subs.filter((s) => inWindow(s.nextRenewalDate)).sort((x, y) => x.nextRenewalDate!.localeCompare(y.nextRenewalDate!));
      const t: CurrencyTotals = {};
      for (const s of renewals) if (s.priceMinor !== null) t[s.currency] = (t[s.currency] ?? 0) + s.priceMinor;
      const deadlines = a.include_cancellation_deadlines === false ? [] : subs.filter((s) => s.autoRenew && inWindow(s.cancellationDeadline)).sort((x, y) => x.cancellationDeadline!.localeCompare(y.cancellationDeadline!));
      return {
        as_of: ctx.biz.today,
        window_days: days,
        renewals: renewals.map((s) => ({
          id: s.id,
          software: s.softwareName,
          plan: s.planName,
          renews_on: s.nextRenewalDate,
          days_left: daysBetween(ctx.biz.today, s.nextRenewalDate!),
          expected_amount: money(s.priceMinor, s.currency),
          billing_interval: intervalLabel(s),
          auto_renew: s.autoRenew,
          cancellation_deadline: s.cancellationDeadline,
          decision: s.renewalDecision,
          url: subUrl(ctx, s.id),
        })),
        cancellation_deadlines: deadlines.map((s) => ({ id: s.id, software: s.softwareName, cancel_by: s.cancellationDeadline, days_left: daysBetween(ctx.biz.today, s.cancellationDeadline!), renews_on: s.nextRenewalDate, url: subUrl(ctx, s.id) })),
        expected_total: totals(t, ctx.biz.workspace.defaultCurrency),
        basis: BASIS.projection,
        without_renewal_date: subs.filter((s) => !s.nextRenewalDate).length,
      };
    },
  },
  {
    name: "get_spending_by_category",
    title: "Get spending by category",
    description: "Monthly equivalent spend per software category, per currency, with share of total and subscription counts.",
    inputSchema: { type: "object", additionalProperties: false, properties: { currency: currencyProp, limit: { type: "integer", minimum: 1, maximum: 50 } } },
    async run(ctx, a) {
      const model = await buildSpendModel(ctx.biz, {}, { refreshSavings: false });
      return { as_of: ctx.biz.today, by_currency: groupsOut(model.byCategory, a.currency as string | undefined, (a.limit as number) ?? 20), basis: BASIS.normalized };
    },
  },
  {
    name: "get_spending_by_vendor",
    title: "Get spending by vendor",
    description: "Monthly equivalent spend per vendor, per currency, with share of total and subscription counts.",
    inputSchema: { type: "object", additionalProperties: false, properties: { currency: currencyProp, limit: { type: "integer", minimum: 1, maximum: 50 } } },
    async run(ctx, a) {
      const model = await buildSpendModel(ctx.biz, {}, { refreshSavings: false });
      return { as_of: ctx.biz.today, by_currency: groupsOut(model.byVendor, a.currency as string | undefined, (a.limit as number) ?? 20), basis: BASIS.normalized };
    },
  },
  {
    name: "find_duplicate_tools",
    title: "Find duplicate or overlapping tools",
    description:
      "Potential duplicate software records (same website, very similar names, same vendor and category) and categories with several active tools that usually do the same job. These are for the user to review — never confirmed duplicates; ask the user whether the tools serve the same purpose.",
    inputSchema: noArgs,
    async run(ctx) {
      const [software, model] = await Promise.all([getSoftwareList(ctx.biz.workspace.id), buildSpendModel(ctx.biz)]);
      const pairs = findPotentialDuplicates(
        software.filter((s) => s.status !== "archived").map((s) => ({ id: s.id, name: s.name, vendorId: s.vendorId, category: s.category, website: s.website, status: s.status })),
        (c) => categoryLabels[c as keyof typeof categoryLabels] ?? c,
      );
      return {
        possible_duplicate_records: pairs.slice(0, 25).map((p) => ({ a: { id: p.a.id, name: p.a.name }, b: { id: p.b.id, name: p.b.name }, reasons: p.reasons })),
        possible_overlap: model.opportunities
          .filter((o) => o.type === "overlapping_software" && (o.status === "open" || o.status === "reviewed"))
          .map((o) => ({ id: o.id, title: o.title, explanation: o.explanation, evidence: o.evidence, url: `${ctx.urls.origin}/business/savings?focus=${o.id}#${o.id}` })),
        caution: "Similar names or categories don't prove two tools do the same job. Confirm with the people who use them before consolidating.",
      };
    },
  },
  {
    name: "get_savings_opportunities",
    title: "Get savings opportunities",
    description:
      "Savings opportunities found by Spend Detective's rules (unused per-seat licenses, underutilized plans, potential overlap, high-cost plans, annual billing, open-source alternatives, renewals to review, matching Saver Option deals), each with evidence, an estimate only where the workspace's own data supports one, confidence and the recommended action. Potential and realized savings are reported separately.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["open", "new", "reviewing", "accepted", "dismissed", "no_longer_detected", "all"], description: "open (default) = new and reviewing." },
        type: { type: "string", enum: Object.keys(opportunityTypeLabels) },
        limit: { type: "integer", minimum: 1, maximum: 50 },
      },
    },
    async run(ctx, a) {
      const model = await buildSpendModel(ctx.biz);
      const realized = await getRealizedSavings(ctx.biz.workspace.id);
      const realizedFor = new Set(realized.map((r) => r.opportunityId).filter(Boolean));
      const status = (a.status as string) ?? "open";
      const want = (s: OpportunityStatus) => (status === "all" ? true : status === "open" ? s === "open" || s === "reviewed" : s === statusIn[status]);
      const opps = model.opportunities
        .filter((o) => want(o.status) && (!a.type || o.type === a.type))
        .sort((x, y) => (y.estMonthlyMinor ?? -1) - (x.estMonthlyMinor ?? -1));
      const limit = (a.limit as number) ?? 20;
      const pref = ctx.biz.workspace.defaultCurrency;
      return {
        as_of: ctx.biz.today,
        total: opps.length,
        opportunities: opps.slice(0, limit).map((o) => ({
          id: o.id,
          title: o.title,
          type: o.type,
          type_label: opportunityTypeLabels[o.type],
          status: statusOut[o.status],
          realized: realizedFor.has(o.id),
          explanation: o.explanation,
          evidence: o.evidence,
          estimate: o.estMonthlyMinor !== null && o.currency ? { monthly: money(o.estMonthlyMinor, o.currency), annual: money(o.estMonthlyMinor * 12, o.currency), basis: BASIS.potential } : null,
          confidence: o.confidence,
          recommended_action: o.recommendedAction,
          subscription_url: o.subscriptionId ? subUrl(ctx, o.subscriptionId) : null,
          deal_url: o.dealSlug ? `${ctx.urls.origin}/deals/${o.dealSlug}` : null,
          url: `${ctx.urls.origin}/business/savings?focus=${o.id}#${o.id}`,
        })),
        potential_annual_total: { amounts: totals(model.potential.annual, pref), counted_once_per_subscription: true, basis: BASIS.potential },
        realized_first_year_total: { amounts: totals(model.realized, pref), basis: BASIS.realized },
      };
    },
  },
  {
    name: "analyze_saas_spending",
    title: "Analyze SaaS spending",
    description:
      "A structured analysis to answer “where should we start reducing our software budget?”: run-rate per currency, the largest subscriptions and their share, concentration, items needing attention (high-cost renewals soon, cancellation deadlines, unused seats, missing prices/dates), the top savings opportunities with evidence, and data-quality gaps. All figures come from the workspace's own records.",
    inputSchema: noArgs,
    async run(ctx) {
      const model = await buildSpendModel(ctx.biz);
      const pref = ctx.biz.workspace.defaultCurrency;
      const byCurrency: Record<string, unknown> = {};
      for (const c of model.currencies) {
        const subs = model.subs.filter((s) => s.currency === c && isRecurring(s) && monthlyEquivalent(s) !== null).sort((x, y) => monthlyEquivalent(y)! - monthlyEquivalent(x)!);
        const total = subs.reduce((t, s) => t + monthlyEquivalent(s)!, 0);
        const top = subs.slice(0, 5);
        byCurrency[c] = {
          monthly_run_rate: money(total, c),
          largest: top.map((s) => ({ id: s.id, software: s.softwareName, plan: s.planName, monthly_equivalent: money(monthlyEquivalent(s), c), share_percent: total ? Math.round((monthlyEquivalent(s)! / total) * 1000) / 10 : 0, url: subUrl(ctx, s.id) })),
          top_5_share_percent: total ? Math.round((top.reduce((t, s) => t + monthlyEquivalent(s)!, 0) / total) * 1000) / 10 : 0,
          priced_subscriptions: subs.length,
        };
      }
      const unverified = model.subs.filter((s) => s.source === "csv_import" && !s.lastVerifiedOn).length;
      const insights = await getSpendingInsights(ctx.biz, { model, limit: 10 });
      return {
        as_of: ctx.biz.today,
        by_currency: byCurrency,
        basis: BASIS.normalized,
        insights: insights.map((i) => ({ title: i.title, detail: i.detail, basis: i.basis, evidence: i.evidence, priority: i.priority, url: i.href ? `${ctx.urls.origin}${i.href}` : null })),
        needs_attention: model.attention.slice(0, 15).map((x) => ({ kind: x.kind, title: x.title, detail: x.detail, url: `${ctx.urls.origin}${x.href}` })),
        top_opportunities: model.opportunities
          .filter((o) => o.status === "open" || o.status === "reviewed")
          .sort((x, y) => (y.estMonthlyMinor ?? -1) - (x.estMonthlyMinor ?? -1))
          .slice(0, 8)
          .map((o) => ({ id: o.id, title: o.title, type: opportunityTypeLabels[o.type], annual_estimate: o.estMonthlyMinor !== null && o.currency ? money(o.estMonthlyMinor * 12, o.currency) : null, confidence: o.confidence, evidence: o.evidence.slice(0, 4), recommended_action: o.recommendedAction })),
        potential_annual_total: totals(model.potential.annual, pref),
        realized_first_year_total: totals(model.realized, pref),
        data_quality: {
          active_without_price: model.summary.missingPrice,
          live_without_renewal_date: model.summary.missingRenewalDate,
          imported_not_yet_reviewed: unverified,
          seat_usage_measured: false,
        },
        guidance: "State which figures are estimates. Don't call a license unused unless seats_in_use data shows it; don't present potential savings as realized.",
      };
    },
  },
  {
    name: "compare_software_alternatives",
    title: "Compare software alternatives",
    description:
      "For one of the workspace's subscriptions or software records: its current cost (normalized estimate) and alternatives from the Saver Option catalog that cover the same job, with functional notes and pricing evidence only where the catalog states them, related live deals, and a general migration checklist. Cost differences are only given when both prices are known on a comparable basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { subscription_id: subscriptionId, software_id: { type: "string", format: "uuid", description: "A software record's ID, instead of a subscription." }, limit: { type: "integer", minimum: 1, maximum: 10 } },
    },
    async run(ctx, a) {
      if (!a.subscription_id && !a.software_id) throw new ToolError("Give subscription_id or software_id (from list_subscriptions).");
      return compareAlternatives(ctx.biz, { subscriptionId: a.subscription_id as string | undefined, softwareId: a.software_id as string | undefined, limit: a.limit as number | undefined });
    },
  },
  {
    name: "search_deals",
    title: "Search Saver Option deals",
    description:
      "Search live listings in the Saver Option Deals marketplace (discounts, credits, startup programs, lifetime deals, free plans, open-source alternatives). Returns only what the listings state — discount text, price and expiry are null when the listing doesn't give them — with verification status and links to the deal page.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", maxLength: 100, description: "Product name or keywords, e.g. figma, project management." },
        category: { type: "string", maxLength: 60, pattern: "^[a-z0-9_-]+$", description: "A deals category slug, or a software category such as design or crm_sales." },
        offer_type: { type: "string", enum: DEAL_OFFER_TYPES },
        limit: { type: "integer", minimum: 1, maximum: 50 },
        offset: { type: "integer", minimum: 0, maximum: 10000 },
      },
    },
    async run(_ctx, a) {
      return searchDeals({ query: a.query as string | undefined, category: a.category as string | undefined, offerType: a.offer_type as string | undefined, limit: a.limit as number | undefined, offset: a.offset as number | undefined });
    },
  },
  {
    name: "get_deal_details",
    title: "Get deal details",
    description: "Full details of one Saver Option deal listing by ID or slug (from search_deals): terms, eligibility, how to redeem, expiry, verification method and date, and the source page.",
    inputSchema: { type: "object", additionalProperties: false, required: ["deal_id"], properties: { deal_id: { type: "string", minLength: 1, maxLength: 120, pattern: "^[A-Za-z0-9._-]+$" } } },
    async run(_ctx, a) {
      const deal = await getDealDetails(a.deal_id as string);
      if (!deal) throw new ToolError("No deal listing with that ID or slug.");
      return deal;
    },
  },
  {
    name: "get_deals_for_my_software",
    title: "Find deals for our software",
    description: "Live Saver Option listings for the tools this workspace already records (same product), tools with no listing right now, and listings for other products in the same categories (possible alternatives).",
    inputSchema: noArgs,
    async run(ctx) {
      const d = await dealsForWorkspace(ctx.biz);
      const tool = (t: (typeof d.matched)[number]["tool"]) => ({ software_id: t.softwareId, name: t.name, category: t.categoryLabel, subscription_ids: t.subscriptionIds, catalog_product: t.catalogProduct });
      return {
        for_tools_you_use: d.matched.map((m) => ({ tool: tool(m.tool), deals: m.deals })),
        no_listing: d.unmatched.map((u) => ({ tool: tool(u.tool), reason: u.reason })),
        related_by_category: d.related,
        note: "Deal terms and eligibility come from the listings; check the deal page before relying on them. Nothing is purchased or switched automatically.",
      };
    },
  },
  {
    name: "generate_savings_report",
    title: "Generate a savings report",
    description:
      "Creates and saves a dated savings report for the workspace (spend run-rate, potential savings by type with evidence, confirmed savings, renewals in the next N days, data-quality notes and method) and returns it with a link the user can open or share inside Saver Option.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { title: { type: "string", maxLength: 200 }, renewal_days: { type: "integer", minimum: 7, maximum: 365, description: "Renewal window, default 90." } },
    },
    async run(ctx, a) {
      const report = await buildSavingsReport(ctx.biz, { title: a.title as string | undefined, renewalDays: a.renewal_days as number | undefined });
      // Saving a snapshot is for roles that can export data; others still get the report.
      if (!can(ctx.biz.role, "data.export")) return { saved: false, note: "Your role can view but not save reports, so this one wasn't stored.", report };
      const id = await saveSavingsReport(ctx.biz, report, ctx.source === "assistant" ? "app" : "mcp");
      return { saved: true, report_id: id, url: `${ctx.urls.origin}/business/reports/saved/${id}`, report };
    },
  },
  {
    name: "create_subscription",
    title: "Add a subscription",
    description:
      "Adds a subscription record (creating the software in the inventory if it isn't there). Two steps: call with confirm false (default) to get the interpreted details and warnings — nothing is saved — show them to the user, then call again with the same fields and confirm true. Ask the user for missing details instead of guessing prices or dates. This only records the subscription in Saver Option; it never buys or changes anything at the vendor.",
    write: true,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["software_name"],
      properties: {
        software_name: { type: "string", minLength: 1, maxLength: 80, description: "e.g. Figma. Matched to the existing inventory by name." },
        vendor: { type: "string", maxLength: 80 },
        category: { type: "string", enum: SOFTWARE_CATEGORIES, description: "Used only when the software is new to the inventory." },
        website: { type: "string", maxLength: 300 },
        ...writeFields,
      },
    },
    async run(ctx, a) {
      requireWrite(ctx);
      if (!can(ctx.biz.role, "records.manage")) throw new ToolError("Your role can't add subscriptions. Owners, admins and finance can.");
      const ws = ctx.biz.workspace.id;
      const name = String(a.software_name).trim();
      const existing = (await getSoftwareList(ws)).find((s) => s.status !== "archived" && normalizeName(s.name) === normalizeName(name));
      const refs = await resolveRefs(ctx.biz, a);
      const input = readOrThrow(subscriptionForm(null, a, refs, ctx.biz.workspace.defaultCurrency), (r) => readSubscriptionInput(r, { currency: ctx.biz.workspace.defaultCurrency }));
      const sf = new FormData();
      sf.set("name", name);
      if (a.vendor) sf.set("vendorName", String(a.vendor));
      sf.set("category", (a.category as string) ?? "other");
      if (a.website) sf.set("website", String(a.website));
      const newSoftware = existing ? null : readOrThrow(sf, (r) => readSoftwareInput(r));
      const same = existing ? (await getSubscriptions(ws)).filter((s) => s.softwareId === existing.id && !s.archived && isLive(s)) : [];
      const m = monthlyEquivalent({ ...input, archived: false } as never);
      const warnings = [
        same.length ? `${existing!.name} already has ${same.length} live subscription(s) (${same.map((s) => [s.planName, s.priceMinor !== null ? `${formatMoney(s.priceMinor, s.currency)} ${intervalLabel(s).toLowerCase()}` : null].filter(Boolean).join(", ") || "no plan").join("; ")}). This would add another.` : null,
        input.priceMinor === null ? "No price: it won't count in spending totals until one is added." : null,
        !input.nextRenewalDate ? "No renewal date: reminders and the renewal calendar won't include it." : null,
        !existing ? `“${name}” isn't in the inventory yet; it will be added as new software (category: ${categoryLabels[newSoftware!.category]}).` : null,
      ].filter((w): w is string => Boolean(w));
      const interpreted = {
        software: existing ? { name: existing.name, existing: true, id: existing.id } : { name, existing: false, vendor: newSoftware!.vendorName, category: categoryLabels[newSoftware!.category] },
        plan: input.planName,
        price: input.priceMinor === null ? null : { ...money(input.priceMinor, input.currency)!, per: intervalLabel(input) },
        monthly_equivalent: m === null ? null : money(m, input.currency),
        pricing_model: input.pricingModel,
        status: input.status,
        start_date: input.startDate,
        next_renewal_date: input.nextRenewalDate,
        auto_renew: input.autoRenew,
        cancellation_deadline: input.cancellationDeadline,
        seats_purchased: input.purchasedSeats,
        seats_in_use: input.reportedAssignedSeats,
        department: refs.departmentName ?? null,
        owner: refs.ownerName ?? null,
        notes: input.notes,
      };
      if (a.confirm !== true) return preview(interpreted, warnings);
      const res = await createSubscription(ctx.biz, { softwareId: existing?.id ?? null, newSoftware, input, idempotencyKey: idempotencyKey(ctx, "create_subscription", a), seatPersonIds: [], source: ctx.source ?? "mcp" });
      const created = await getSubscription(ctx.biz, res.id);
      return { status: res.duplicate ? "already_created" : "created", saved: true, subscription: created ? subView(ctx, created) : { id: res.id }, url: subUrl(ctx, res.id), warnings };
    },
  },
  {
    name: "update_subscription",
    title: "Update a subscription",
    description:
      "Changes fields of an existing subscription record (price, billing, dates, seats, status, owner, department, notes). Two steps: confirm false (default) returns a before/after preview and saves nothing; call again with confirm true after the user agrees. Fields you leave out stay as they are. Changing status only updates the record — it never cancels anything at the vendor.",
    write: true,
    inputSchema: { type: "object", additionalProperties: false, required: ["subscription_id"], properties: { subscription_id: subscriptionId, ...writeFields } },
    async run(ctx, a) {
      requireWrite(ctx);
      const before = await getSubscription(ctx.biz, a.subscription_id as string);
      if (!before) throw new ToolError("No subscription with that ID in this workspace.");
      if (before.archived) throw new ToolError("This subscription is archived. Restore it in Saver Option before changing it.");
      const changes = Object.keys(a).filter((k) => k !== "subscription_id" && k !== "confirm");
      if (changes.length === 0) throw new ToolError("Give at least one field to change.");
      const refs = await resolveRefs(ctx.biz, a);
      const input = readOrThrow(subscriptionForm(before, a, refs, ctx.biz.workspace.defaultCurrency), (r) => readSubscriptionInput(r, { currency: before.currency }));
      const after = { ...before, ...input, archived: false } as Subscription;
      const b = subView(ctx, before);
      const n = subView(ctx, { ...after, departmentName: refs.departmentName ?? before.departmentName, ownerName: refs.ownerName ?? before.ownerName });
      const diff: Record<string, { before: unknown; after: unknown }> = {};
      for (const k of Object.keys(n) as (keyof typeof n)[]) {
        if (k === "url" || k === "last_verified_on" || k === "source") continue;
        if (JSON.stringify(b[k]) !== JSON.stringify(n[k])) diff[k] = { before: b[k], after: n[k] };
      }
      if (before.notes !== input.notes) diff.notes = { before: before.notes, after: input.notes };
      const warnings = [
        a.status && (a.status === "cancelled" || a.status === "expired") ? "This marks the record as ended in Saver Option only; cancel at the vendor separately if you haven't." : null,
        Object.keys(diff).length === 0 ? "These values are the same as the current record; nothing would change." : null,
      ].filter((w): w is string => Boolean(w));
      if (a.confirm !== true) return preview({ subscription: { id: before.id, software: before.softwareName, plan: before.planName }, changes: diff }, warnings);
      if (Object.keys(diff).length === 0) return { status: "unchanged", saved: false, subscription: b };
      await updateSubscription(ctx.biz, before.id, input);
      const saved = await getSubscription(ctx.biz, before.id);
      return { status: "updated", saved: true, changes: diff, subscription: saved ? subView(ctx, saved) : b, url: subUrl(ctx, before.id) };
    },
  },
];

export function toolsFor(scopes: string[]): ToolDef[] {
  return tools.filter((t) => !t.write || scopes.includes(SCOPE_WRITE));
}

/** Validates and runs one tool call; BizError and ToolError messages are returned to the client, anything else is logged and hidden. */
export async function callTool(ctx: ToolContext, name: string, rawArgs: unknown): Promise<{ ok: true; result: unknown } | { ok: false; message: string }> {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return { ok: false, message: `Unknown tool: ${name}.` };
  if (tool.write && !ctx.scopes.includes(SCOPE_WRITE)) return { ok: false, message: "This connection is read-only. To add or change records, disconnect and connect again choosing “Read and change”." };
  const v = validateArgs(tool.inputSchema, rawArgs);
  if (!v.ok) return { ok: false, message: `Invalid arguments: ${v.errors.join(" ")}` };
  try {
    return { ok: true, result: await tool.run(ctx, v.value) };
  } catch (err) {
    if (err instanceof ToolError || err instanceof BizError || err instanceof DealsInputError) return { ok: false, message: err.message };
    console.error(`[mcp] ${name} failed:`, err instanceof Error ? err.message : err);
    return { ok: false, message: "Something went wrong running this tool. Nothing was changed. Try again." };
  }
}
