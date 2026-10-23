/**
 * Savings rules: explainable findings from a workspace's own subscription and
 * seat data, plus matching listings from the Saver Option catalog.
 *
 * Every estimate comes from prices the team entered. When there's nothing to
 * base an amount on (no per-seat price, no annual quote, no verified price for
 * an alternative), the finding has no estimate and asks for a manual check —
 * nothing here invents vendor prices or discounts. Potential overlap is
 * flagged for review, never presented as confirmed redundancy.
 *
 * Pure module, so Node tests run it directly.
 */
import { categoryLabels, OVERLAP_PRONE_CATEGORIES, type Confidence, type OpportunityType, type RenewalDecision, type SoftwareCategory } from "./constants.ts";
import { daysBetween, formatIsoDate, formatMoney, intervalLabel, isLive, isRecurring, monthlyEquivalent, monthsPerPeriod, percent, seatSummary, type SubscriptionCalc } from "./calc.ts";

export interface SavingsSubscription extends SubscriptionCalc {
  softwareId: string;
  softwareName: string;
  category: SoftwareCategory;
  planName: string | null;
  startDate: string | null;
  createdOn: string;
  renewalDecision: RenewalDecision;
  annualPriceOptionMinor: number | null;
}

export interface SavingsSoftware {
  id: string;
  name: string;
  category: SoftwareCategory;
  status: "active" | "evaluating" | "deprecated" | "archived";
}

/** Live Saver Option listings for a software record's matching catalog product. */
export interface CatalogDeal {
  softwareId: string;
  slug: string;
  title: string;
  summary: string;
  typeLabel: string;
  /** Shown as-is from the listing: "Verified on Oct 23, 2026" or "Unverified". */
  verification: string;
  eligibility: string | null;
}

/** Open-source products in the catalog that cover the same job as a software record. */
export interface CatalogAlternative {
  softwareId: string;
  productName: string;
  productSlug: string;
  tagline: string;
  license: string | null;
  sharedTag: string;
}

export interface SavingsInput {
  today: string;
  dateFormat?: string;
  subscriptions: SavingsSubscription[];
  software: SavingsSoftware[];
  deals: CatalogDeal[];
  alternatives: CatalogAlternative[];
}

export interface Finding {
  ruleKey: string;
  type: OpportunityType;
  subscriptionId: string | null;
  softwareId: string | null;
  title: string;
  explanation: string;
  evidence: { label: string; value: string }[];
  estMonthlyMinor: number | null;
  currency: string | null;
  confidence: Confidence;
  recommendedAction: string;
  dealSlug: string | null;
}

/** Utilization below this share of purchased seats counts as underutilized (flat-priced plans). */
export const UNDERUTILIZED_BELOW = 60;
/** A subscription is "high-cost" from this share of its currency's monthly total… */
export const EXPENSIVE_SHARE = 0.2;
/** …when the workspace has at least this many priced subscriptions in that currency. */
export const EXPENSIVE_MIN_SUBSCRIPTIONS = 3;
/** Renewals within this many days get a review prompt (non-monthly plans). */
export const RENEWAL_REVIEW_DAYS = 45;
/** Monthly plans running this long are worth asking about annual pricing… */
export const ANNUAL_PROMPT_AFTER_DAYS = 90;
/** …for the largest few monthly plans per currency (an estimate needs a recorded annual price). */
export const ANNUAL_PROMPT_TOP = 5;
/** At most this many Saver Option deals are suggested per software record. */
export const DEALS_PER_SOFTWARE = 1;

const round = (n: number) => Math.round(n);

export function findSavings(input: SavingsInput): Finding[] {
  const { today } = input;
  const fmtDate = (d: string) => formatIsoDate(d, input.dateFormat);
  const findings: Finding[] = [];
  const softwareById = new Map(input.software.map((s) => [s.id, s]));
  const recurring = input.subscriptions.filter(isRecurring);

  // 1–2. Unused and underutilized seats.
  for (const s of recurring) {
    const seats = seatSummary(s);
    if (!seats.purchased) continue;
    const label = `${s.softwareName}${s.planName ? ` (${s.planName})` : ""}`;
    if (seats.unusedMonthly !== null && seats.available && seats.available > 0) {
      const tracked = seats.assignedSource === "none" ? "No seats have been assigned or reported" : seats.assignedSource === "named" ? `${seats.named} seats are assigned to named people` : `${seats.reported} seats are reported in use`;
      findings.push({
        ruleKey: `unused_licenses:${s.id}`,
        type: "unused_licenses",
        subscriptionId: s.id,
        softwareId: s.softwareId,
        title: `${seats.available} unused ${seats.available === 1 ? "seat" : "seats"} on ${label}`,
        explanation: `${tracked} out of ${seats.purchased} purchased. With per-seat pricing, each unassigned seat costs ${formatMoney(round(seats.costPerSeatMonthly!), s.currency)} a month.`,
        evidence: [
          { label: "Purchased seats", value: String(seats.purchased) },
          { label: "Seats in use", value: `${seats.assigned} (${seats.assignedSource === "named" ? "named assignments" : seats.assignedSource === "reported" ? "reported count" : "none recorded"})` },
          { label: "Cost per seat", value: `${formatMoney(round(seats.costPerSeatMonthly!), s.currency)} / month` },
        ],
        estMonthlyMinor: round(seats.unusedMonthly),
        currency: s.currency,
        confidence: seats.assignedSource === "named" ? "high" : seats.assignedSource === "reported" ? "medium" : "low",
        recommendedAction:
          seats.assignedSource === "none"
            ? "Record who uses this tool, then remove seats nobody needs at the next billing change."
            : `Reduce the plan by ${seats.available} ${seats.available === 1 ? "seat" : "seats"}, or reassign them before buying more.`,
        dealSlug: null,
      });
    } else if (seats.utilization !== null && seats.assignedSource !== "none" && seats.utilization < UNDERUTILIZED_BELOW) {
      findings.push({
        ruleKey: `underutilized_licenses:${s.id}`,
        type: "underutilized_licenses",
        subscriptionId: s.id,
        softwareId: s.softwareId,
        title: `${label} is ${percent(seats.utilization)} utilized`,
        explanation: `${seats.assigned} of ${seats.purchased} seats are in use. The price isn't per seat${s.pricingModel === "per_seat" ? " or isn't known" : ""}, so there's no amount to estimate — a smaller plan or tier may cost less.`,
        evidence: [
          { label: "Purchased seats", value: String(seats.purchased) },
          { label: "Seats in use", value: String(seats.assigned) },
          { label: "Utilization", value: percent(seats.utilization) },
        ],
        estMonthlyMinor: null,
        currency: null,
        confidence: "medium",
        recommendedAction: "Compare the vendor's smaller plans against the seats you actually use.",
        dealSlug: null,
      });
    }
  }

  // 3. Potential overlap: several active tools in a category where one usually does the job.
  const byCategory = new Map<SoftwareCategory, SavingsSubscription[]>();
  for (const s of recurring) {
    const sw = softwareById.get(s.softwareId);
    if (!sw || sw.status === "archived" || !OVERLAP_PRONE_CATEGORIES.has(s.category)) continue;
    byCategory.set(s.category, [...(byCategory.get(s.category) ?? []), s]);
  }
  for (const [category, subs] of byCategory) {
    const tools = [...new Map(subs.map((s) => [s.softwareId, s.softwareName])).entries()].sort((a, b) => a[0].localeCompare(b[0]));
    if (tools.length < 2) continue;
    // The cheapest priced subscription is the one consolidation would most plausibly remove.
    const priced = subs.filter((s) => monthlyEquivalent(s) !== null).sort((a, b) => monthlyEquivalent(a)! - monthlyEquivalent(b)!);
    const target = priced[0] ?? subs[0];
    const sameCurrency = priced.every((s) => s.currency === target.currency);
    const est = priced.length >= 2 && sameCurrency ? monthlyEquivalent(target) : null;
    const names = tools.map(([, n]) => n);
    findings.push({
      ruleKey: `overlapping_software:${category}:${tools.map(([id]) => id).join(",")}`,
      type: "overlapping_software",
      subscriptionId: target.id,
      softwareId: target.softwareId,
      title: `Potential overlap in ${categoryLabels[category]}: ${listNames(names)}`,
      explanation: `${tools.length} active tools are tracked as ${categoryLabels[category]}, where teams often need only one. This is a potential overlap for someone to review, not a confirmed duplicate — the tools may serve different teams or needs.`,
      evidence: priced.map((s) => ({ label: s.softwareName, value: `${formatMoney(round(monthlyEquivalent(s)!), s.currency)} / month` })),
      estMonthlyMinor: est === null ? null : round(est),
      currency: est === null ? null : target.currency,
      confidence: "low",
      recommendedAction:
        est === null
          ? "Check with each tool's owner whether one tool could cover both uses."
          : `Check with each tool's owner whether one tool could cover both uses. Consolidating off ${target.softwareName} would save about ${formatMoney(round(est), target.currency)} a month.`,
      dealSlug: null,
    });
  }

  // 4. High-cost subscriptions: a large share of the workspace's recurring cost.
  const pricedByCurrency = new Map<string, SavingsSubscription[]>();
  for (const s of recurring) if (monthlyEquivalent(s) !== null) pricedByCurrency.set(s.currency, [...(pricedByCurrency.get(s.currency) ?? []), s]);
  for (const [currency, subs] of pricedByCurrency) {
    if (subs.length < EXPENSIVE_MIN_SUBSCRIPTIONS) continue;
    const total = subs.reduce((t, s) => t + monthlyEquivalent(s)!, 0);
    if (total <= 0) continue;
    for (const s of subs) {
      const m = monthlyEquivalent(s)!;
      const share = m / total;
      if (share < EXPENSIVE_SHARE) continue;
      findings.push({
        ruleKey: `expensive_subscription:${s.id}`,
        type: "expensive_subscription",
        subscriptionId: s.id,
        softwareId: s.softwareId,
        title: `${s.softwareName} is ${percent(share * 100)} of your ${currency} software cost`,
        explanation: `At ${formatMoney(round(m), currency)} a month, it's one of the largest line items. Large subscriptions are usually where plan reviews and negotiation pay off most; no saving is assumed.`,
        evidence: [
          { label: "Monthly equivalent", value: formatMoney(round(m), currency) },
          { label: `Share of ${currency} recurring cost`, value: percent(share * 100) },
          ...(s.nextRenewalDate ? [{ label: "Next renewal", value: fmtDate(s.nextRenewalDate) }] : []),
        ],
        estMonthlyMinor: null,
        currency: null,
        confidence: "low",
        recommendedAction: "Review the plan tier and usage, and ask the vendor for better terms before the next renewal.",
        dealSlug: null,
      });
    }
  }

  // 5. Annual billing alternative for monthly plans. Without a recorded annual price, only
  // the largest monthly plans in each currency get a prompt to check.
  const promptable = new Set<string>();
  for (const [, subs] of pricedByCurrency) {
    subs
      .filter((s) => s.billingInterval === "monthly" && s.annualPriceOptionMinor === null && (s.priceMinor ?? 0) > 0)
      .sort((a, b) => b.priceMinor! - a.priceMinor!)
      .slice(0, ANNUAL_PROMPT_TOP)
      .forEach((s) => promptable.add(s.id));
  }
  for (const s of recurring) {
    if (s.billingInterval !== "monthly" || s.priceMinor === null || s.priceMinor === 0) continue;
    const yearOfMonthly = s.priceMinor * 12;
    if (s.annualPriceOptionMinor !== null) {
      if (s.annualPriceOptionMinor >= yearOfMonthly) continue;
      const saving = (yearOfMonthly - s.annualPriceOptionMinor) / 12;
      findings.push({
        ruleKey: `annual_billing:${s.id}`,
        type: "annual_billing",
        subscriptionId: s.id,
        softwareId: s.softwareId,
        title: `Annual billing for ${s.softwareName} would save ${formatMoney(round(saving * 12), s.currency)} a year`,
        explanation: `You pay ${formatMoney(s.priceMinor, s.currency)} a month (${formatMoney(yearOfMonthly, s.currency)} a year). The annual price recorded for this plan is ${formatMoney(s.annualPriceOptionMinor, s.currency)}.`,
        evidence: [
          { label: "12 × monthly price", value: formatMoney(yearOfMonthly, s.currency) },
          { label: "Recorded annual price", value: formatMoney(s.annualPriceOptionMinor, s.currency) },
        ],
        estMonthlyMinor: round(saving),
        currency: s.currency,
        confidence: "high",
        recommendedAction: "Switch to annual billing if you expect to keep the tool for the year.",
        dealSlug: null,
      });
    } else {
      const since = s.startDate ?? s.createdOn;
      if (!promptable.has(s.id) || daysBetween(since, today) < ANNUAL_PROMPT_AFTER_DAYS) continue;
      findings.push({
        ruleKey: `annual_billing:${s.id}`,
        type: "annual_billing",
        subscriptionId: s.id,
        softwareId: s.softwareId,
        title: `Check annual pricing for ${s.softwareName}`,
        explanation: `It's one of your largest monthly plans and has been billed monthly since ${fmtDate(since)}. Many vendors charge less for annual billing, but no annual price is recorded, so there's no estimate.`,
        evidence: [{ label: "Current price", value: `${formatMoney(s.priceMinor, s.currency)} / month` }],
        estMonthlyMinor: null,
        currency: null,
        confidence: "low",
        recommendedAction: "Look up the vendor's annual price and add it to the subscription to compare.",
        dealSlug: null,
      });
    }
  }

  // 6. Open-source alternatives listed in the Saver Option catalog.
  const pricedSoftware = new Set(recurring.filter((s) => (s.priceMinor ?? 0) > 0).map((s) => s.softwareId));
  for (const a of input.alternatives) {
    if (!pricedSoftware.has(a.softwareId)) continue;
    const sw = softwareById.get(a.softwareId);
    if (!sw) continue;
    const sub = recurring.find((s) => s.softwareId === a.softwareId);
    findings.push({
      ruleKey: `software_alternative:${a.softwareId}:${a.productSlug}`,
      type: "software_alternative",
      subscriptionId: sub?.id ?? null,
      softwareId: a.softwareId,
      title: `${a.productName} is an open-source alternative to ${sw.name}`,
      explanation: `Listed on Saver Option under "${a.sharedTag}": ${a.tagline} There's no verified price comparison — self-hosting has its own running costs, so compare before switching.`,
      evidence: [
        { label: "Alternative", value: a.productName },
        ...(a.license ? [{ label: "License", value: a.license }] : []),
      ],
      estMonthlyMinor: null,
      currency: null,
      confidence: "low",
      recommendedAction: `Compare ${a.productName}'s features and hosting costs with what you pay for ${sw.name}.`,
      dealSlug: null,
    });
  }

  // 7. Renewals coming up with no decision yet (longer commitments only).
  for (const s of input.subscriptions) {
    if (!isLive(s) || !s.nextRenewalDate || s.renewalDecision !== "undecided") continue;
    const months = monthsPerPeriod(s);
    if (!months || months < 3) continue;
    const days = daysBetween(today, s.nextRenewalDate);
    const deadlineDays = s.cancellationDeadline ? daysBetween(today, s.cancellationDeadline) : null;
    const soon = (days >= 0 && days <= RENEWAL_REVIEW_DAYS) || (deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= RENEWAL_REVIEW_DAYS);
    if (!soon) continue;
    const by = s.cancellationDeadline && deadlineDays !== null && deadlineDays >= 0 ? s.cancellationDeadline : s.nextRenewalDate;
    findings.push({
      ruleKey: `renewal_review:${s.id}:${s.nextRenewalDate}`,
      type: "renewal_review",
      subscriptionId: s.id,
      softwareId: s.softwareId,
      title: `Decide on the ${s.softwareName} renewal by ${fmtDate(by)}`,
      explanation: `The ${intervalLabel(s).toLowerCase()} plan renews on ${fmtDate(s.nextRenewalDate)}${s.autoRenew === false ? "" : " and auto-renews"}${s.priceMinor !== null ? ` for ${formatMoney(s.priceMinor, s.currency)}` : ""}. No renewal decision is recorded yet.`,
      evidence: [
        { label: "Renewal date", value: fmtDate(s.nextRenewalDate) },
        ...(s.cancellationDeadline ? [{ label: "Cancellation deadline", value: fmtDate(s.cancellationDeadline) }] : []),
        ...(s.priceMinor !== null ? [{ label: "Expected amount", value: formatMoney(s.priceMinor, s.currency) }] : []),
      ],
      estMonthlyMinor: null,
      currency: null,
      confidence: "medium",
      recommendedAction: "Check usage and seats, then record whether to renew, renegotiate or cancel.",
      dealSlug: null,
    });
  }

  // 8. Saver Option listings for software the team uses.
  const liveSoftware = new Set(input.subscriptions.filter(isLive).map((s) => s.softwareId));
  const perSoftware = new Map<string, number>();
  for (const d of input.deals) {
    const sw = softwareById.get(d.softwareId);
    if (!sw || sw.status === "archived" || !(liveSoftware.has(d.softwareId) || sw.status === "evaluating")) continue;
    const n = perSoftware.get(d.softwareId) ?? 0;
    if (n >= DEALS_PER_SOFTWARE) continue;
    perSoftware.set(d.softwareId, n + 1);
    const sub = input.subscriptions.find((s) => s.softwareId === d.softwareId && isLive(s));
    findings.push({
      ruleKey: `marketplace_deal:${d.softwareId}:${d.slug}`,
      type: "marketplace_deal",
      subscriptionId: sub?.id ?? null,
      softwareId: d.softwareId,
      title: `Saver Option deal for ${sw.name}: ${d.title}`,
      explanation: `${d.summary} Check the eligibility and terms on the listing; savings depend on whether your company qualifies.`,
      evidence: [
        { label: "Offer type", value: d.typeLabel },
        { label: "Listing status", value: d.verification },
        ...(d.eligibility ? [{ label: "Eligibility", value: d.eligibility }] : []),
      ],
      estMonthlyMinor: null,
      currency: null,
      confidence: "low",
      recommendedAction: "Open the listing and check whether your company qualifies.",
      dealSlug: d.slug,
    });
  }

  return findings;
}

function listNames(names: string[]): string {
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
