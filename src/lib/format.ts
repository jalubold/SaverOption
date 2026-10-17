import { siteConfig } from "@/config/site";
import type { BillingPeriod, ISODate, OfferPricing, OfferView } from "@/lib/types";

const DAY_MS = 86_400_000;

export function formatMoney(amount: number, currency = siteConfig.defaultCurrency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const periodSuffix: Record<BillingPeriod, string> = {
  month: "/mo",
  year: "/yr",
  "one-time": " one-time",
};

export function formatPeriodPrice(amount: number, currency: string, period?: BillingPeriod): string {
  return formatMoney(amount, currency) + (period ? periodSuffix[period] : "");
}

/** Parses "YYYY-MM-DD" (or a full ISO string) as a UTC date. */
export function parseDate(value: ISODate): Date {
  return new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
}

export function formatDate(value: ISODate): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseDate(value));
}

/**
 * Calendar days (UTC) from today until `value`.
 * 0 = ends today, negative = already ended.
 */
export function daysUntil(value: ISODate, now = new Date()): number {
  const d = parseDate(value);
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target - today) / DAY_MS);
}

export function expiryLabel(offer: Pick<OfferView, "expiresAt" | "isExpired" | "daysLeft">): string | null {
  if (!offer.expiresAt) return null;
  if (offer.isExpired) return `Ended ${formatDate(offer.expiresAt)}`;
  if (offer.daysLeft === 0) return "Ends today";
  if (offer.daysLeft === 1) return "Ends tomorrow";
  if (offer.daysLeft !== undefined && offer.daysLeft <= 14) return `Ends in ${offer.daysLeft} days`;
  return `Ends ${formatDate(offer.expiresAt)}`;
}

export interface PriceSummary {
  /** Main figure, e.g. "$180/yr" or "Free". */
  current?: string;
  /** Struck-through regular price — only when periods are comparable. */
  was?: string;
  /** Context when periods differ, e.g. "Normally $19/mo". */
  note?: string;
}

export function summarizePrice(pricing?: OfferPricing): PriceSummary | null {
  if (!pricing) return null;
  const { currency, regularPrice, dealPrice, period } = pricing;
  const regularPeriod = pricing.regularPeriod ?? period;
  if (dealPrice === undefined) return null;

  const current = dealPrice === 0 ? "Free" : formatPeriodPrice(dealPrice, currency, period);
  if (regularPrice === undefined) return { current };

  const regular = formatPeriodPrice(regularPrice, currency, regularPeriod);
  if (regularPeriod === period && dealPrice !== 0 && regularPrice > dealPrice) {
    return { current, was: regular };
  }
  return { current, note: `Normally ${regular}` };
}

const periodMonths: Partial<Record<BillingPeriod, number>> = { month: 1, year: 12 };

/** "Then $300/yr" — the price after the offer period, when stated. */
export function renewalLabel(pricing?: OfferPricing): string | null {
  if (pricing?.renewalPrice === undefined) return null;
  const period = pricing.renewalPeriod ?? pricing.regularPeriod ?? pricing.period;
  const after = pricing.durationMonths ? ` after ${pricing.durationMonths} months` : "";
  return `Then ${formatPeriodPrice(pricing.renewalPrice, pricing.currency, period)}${after}`;
}

/**
 * Money saved over the offer period, computed only from stated figures:
 * regular and offer price on the same monthly/yearly basis plus a known duration.
 */
export function estimatedSavings(pricing?: OfferPricing): string | null {
  if (!pricing || pricing.regularPrice === undefined || pricing.dealPrice === undefined || !pricing.durationMonths) return null;
  const period = pricing.period;
  const regularPeriod = pricing.regularPeriod ?? period;
  const months = period && periodMonths[period];
  if (!months || regularPeriod !== period) return null;
  const saved = ((pricing.regularPrice - pricing.dealPrice) / months) * pricing.durationMonths;
  if (saved <= 0) return null;
  return `Save ${formatMoney(Math.round(saved * 100) / 100, pricing.currency)} over ${pricing.durationMonths} months`;
}

/** The single most important fact about an offer, used as the card headline value. */
export function headlineValue(offer: OfferView): string | null {
  const p = offer.pricing;
  if (p?.savingsLabel) return p.savingsLabel;
  if (p?.creditValue) return `${formatMoney(p.creditValue, p.currency)} credit`;
  if (p?.dealPrice === 0) return "Free";
  return null;
}
