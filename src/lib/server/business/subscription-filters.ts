import { daysBetween, isIsoDate, monthlyEquivalent } from "@/lib/business/calc";
import {
  BILLING_INTERVALS,
  SOFTWARE_CATEGORIES,
  SUBSCRIPTION_STATUSES,
  type BillingInterval,
  type SoftwareCategory,
  type SubscriptionStatus,
} from "@/lib/business/constants";
import { isUuid } from "@/lib/business/form";
import type { Subscription } from "@/lib/server/business/data";

/**
 * Filters for the subscription list and its CSV export, parsed and validated
 * from the query string in one place so both always show the same rows.
 * Unknown or malformed values are ignored rather than trusted.
 */

export const RENEWAL_WINDOWS = ["next30", "next90", "overdue", "none"] as const;
export type RenewalWindow = (typeof RENEWAL_WINDOWS)[number];
export const SORTS = ["name", "cost", "renewal", "newest"] as const;
export type SubscriptionSort = (typeof SORTS)[number];

export interface SubscriptionFilters {
  q: string;
  vendor: string | null;
  category: SoftwareCategory | null;
  /** A status, or "archived" for the archive view; null = every non-archived subscription. */
  status: SubscriptionStatus | "archived" | null;
  interval: BillingInterval | null;
  /** A department id, or "none" for subscriptions without one. */
  department: string | null;
  /** A person id, or "none" for subscriptions without an owner. */
  owner: string | null;
  renewal: RenewalWindow | null;
  currency: string | null;
  /** An exact payment-method label, or "none". */
  payment: string | null;
  sort: SubscriptionSort;
  page: number;
}

type Params = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string => (typeof v === "string" ? v.trim() : Array.isArray(v) ? (v[0] ?? "").trim() : "");
const pick = <T extends string>(v: string, list: readonly T[]): T | null => ((list as readonly string[]).includes(v) ? (v as T) : null);
const idOrNone = (v: string): string | null => (v === "none" ? "none" : isUuid(v) ? v.toLowerCase() : null);

export function parseSubscriptionFilters(sp: Params): SubscriptionFilters {
  const currency = one(sp.currency).toUpperCase();
  const page = Number(one(sp.page));
  const payment = one(sp.payment);
  return {
    q: one(sp.q).slice(0, 100),
    vendor: idOrNone(one(sp.vendor)),
    category: pick(one(sp.category), SOFTWARE_CATEGORIES),
    status: one(sp.status) === "archived" ? "archived" : pick(one(sp.status), SUBSCRIPTION_STATUSES),
    interval: pick(one(sp.interval), BILLING_INTERVALS),
    department: idOrNone(one(sp.department)),
    owner: idOrNone(one(sp.owner)),
    renewal: pick(one(sp.renewal), RENEWAL_WINDOWS),
    currency: /^[A-Z]{3}$/.test(currency) ? currency : null,
    payment: payment ? payment.slice(0, 60) : null,
    sort: pick(one(sp.sort), SORTS) ?? "name",
    page: Number.isInteger(page) && page > 0 && page < 10_000 ? page : 1,
  };
}

/** True when anything narrows the default view (so an empty result means "no matches", not "no data"). */
export function hasActiveFilters(f: SubscriptionFilters): boolean {
  return Boolean(f.q || f.vendor || f.category || f.status || f.interval || f.department || f.owner || f.renewal || f.currency || f.payment);
}

export function applySubscriptionFilters(subs: Subscription[], f: SubscriptionFilters, today: string): Subscription[] {
  const q = f.q.toLowerCase();
  const rows = subs.filter((s) => {
    if (f.status === "archived" ? !s.archived : s.archived) return false;
    if (f.status && f.status !== "archived" && s.status !== f.status) return false;
    if (q && ![s.softwareName, s.planName, s.vendorName].some((v) => v?.toLowerCase().includes(q))) return false;
    if (f.vendor && (f.vendor === "none" ? s.vendorId !== null : s.vendorId !== f.vendor)) return false;
    if (f.category && s.category !== f.category) return false;
    if (f.interval && s.billingInterval !== f.interval) return false;
    if (f.department && (f.department === "none" ? s.departmentId !== null : s.departmentId !== f.department)) return false;
    if (f.owner && (f.owner === "none" ? s.ownerPersonId !== null : s.ownerPersonId !== f.owner)) return false;
    if (f.currency && s.currency !== f.currency) return false;
    if (f.payment && (f.payment === "none" ? s.paymentMethod !== null : s.paymentMethod !== f.payment)) return false;
    if (f.renewal) {
      const d = s.nextRenewalDate && isIsoDate(s.nextRenewalDate) ? daysBetween(today, s.nextRenewalDate) : null;
      if (f.renewal === "none" && d !== null) return false;
      if (f.renewal === "overdue" && !(d !== null && d < 0)) return false;
      if (f.renewal === "next30" && !(d !== null && d >= 0 && d <= 30)) return false;
      if (f.renewal === "next90" && !(d !== null && d >= 0 && d <= 90)) return false;
    }
    return true;
  });
  const byName = (a: Subscription, b: Subscription) => a.softwareName.localeCompare(b.softwareName) || (a.planName ?? "").localeCompare(b.planName ?? "");
  return rows.sort((a, b) => {
    if (f.sort === "cost") {
      const ma = monthlyEquivalent(a);
      const mb = monthlyEquivalent(b);
      if (ma === null || mb === null) return ma === mb ? byName(a, b) : ma === null ? 1 : -1;
      return mb - ma || byName(a, b);
    }
    if (f.sort === "renewal") {
      if (!a.nextRenewalDate || !b.nextRenewalDate) return a.nextRenewalDate === b.nextRenewalDate ? byName(a, b) : a.nextRenewalDate ? -1 : 1;
      return a.nextRenewalDate.localeCompare(b.nextRenewalDate) || byName(a, b);
    }
    if (f.sort === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
    return byName(a, b);
  });
}

/** The query string for these filters, with optional overrides (e.g. a page number). Defaults are left out. */
export function filtersQuery(f: SubscriptionFilters, overrides: Partial<Record<keyof SubscriptionFilters, string | number | null>> = {}): string {
  const values: Record<string, string | number | null> = {
    q: f.q || null,
    vendor: f.vendor,
    category: f.category,
    status: f.status,
    interval: f.interval,
    department: f.department,
    owner: f.owner,
    renewal: f.renewal,
    currency: f.currency,
    payment: f.payment,
    sort: f.sort === "name" ? null : f.sort,
    page: f.page === 1 ? null : f.page,
    ...overrides,
  };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) if (v !== null && v !== "" && !(k === "page" && v === 1)) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}
