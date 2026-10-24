import { currencyDigits, formatMoney, totalsList, type CurrencyTotals } from "./calc.ts";

/**
 * Converting headline totals into the workspace's default currency with the
 * European Central Bank's daily euro reference rates. Records always keep their
 * own currency; a converted figure is shown with the original amounts, the
 * rate and its date beside it, and anything without an ECB rate stays
 * unconverted (the caller falls back to per-currency totals).
 */

/** The currency and amounts a record was stored with, kept when it's shown converted. */
export interface OriginalMoney {
  currency: string;
  values: Record<string, number | null>;
}

/** For a "converted at …" note: the rate date and each converted currency's rate into `to`. */
export interface FxNote {
  to: string;
  date: string;
  rates: { currency: string; rate: number }[];
}

export interface FxRates {
  /** The ECB reference date (YYYY-MM-DD). */
  date: string;
  /** Units of each currency per 1 EUR; EUR itself is 1. */
  perEur: Record<string, number>;
}

/** Parses https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml. */
export function parseEcbDaily(xml: string): FxRates | null {
  const date = /<Cube\s+time=["'](\d{4}-\d{2}-\d{2})["']/.exec(xml)?.[1];
  if (!date) return null;
  const perEur: Record<string, number> = { EUR: 1 };
  for (const m of xml.matchAll(/<Cube\s+currency=["']([A-Z]{3})["']\s+rate=["']([0-9]+(?:\.[0-9]+)?)["']/g)) {
    const rate = Number(m[2]);
    if (rate > 0 && Number.isFinite(rate)) perEur[m[1]] = rate;
  }
  return Object.keys(perEur).length >= 5 ? { date, perEur } : null;
}

/** How many `to` one `from` buys, or null without both rates. */
export function fxRate(fx: FxRates, from: string, to: string): number | null {
  const a = fx.perEur[from];
  const b = fx.perEur[to];
  return a && b ? b / a : null;
}

export interface ConvertedTotal {
  currency: string;
  /** Minor units of `currency`. */
  amount: number;
  /** The amounts that were converted, in their own currency, with the rate used. */
  converted: { currency: string; amount: number; rate: number }[];
  date: string;
}

/**
 * The totals as one amount in `to`, or null when nothing needs converting, no
 * rates are available, or a currency has no ECB rate.
 */
export function convertTotals(totals: CurrencyTotals, to: string, fx: FxRates | null): ConvertedTotal | null {
  if (!fx) return null;
  const list = totalsList(totals, to).filter((t) => t.amount !== 0);
  if (!list.some((t) => t.currency !== to)) return null;
  let amount = 0;
  const converted: ConvertedTotal["converted"] = [];
  for (const t of list) {
    if (t.currency === to) {
      amount += t.amount;
      continue;
    }
    const rate = fxRate(fx, t.currency, to);
    if (rate === null) return null;
    amount += Math.round((t.amount / 10 ** currencyDigits(t.currency)) * rate * 10 ** currencyDigits(to));
    converted.push({ currency: t.currency, amount: t.amount, rate });
  }
  return { currency: to, amount, converted, date: fx.date };
}

/** "€99.00" (or "€99.00 + £20.00"): what was converted, in its own currencies. */
export function convertedParts(c: ConvertedTotal): string {
  return c.converted.map((p) => formatMoney(p.amount, p.currency)).join(" + ");
}

/** "€1 = $1.0874": one unit of `from` in `to`. */
export function formatRate(from: string, to: string, rate: number): string {
  const one = formatMoney(10 ** currencyDigits(from), from, { whole: true });
  return `${one} = ${new Intl.NumberFormat("en-US", { style: "currency", currency: to, maximumFractionDigits: rate >= 100 ? 2 : 4 }).format(rate)}`;
}

/** "€1 = $1.0874" for each converted currency. */
export function rateText(c: ConvertedTotal): string {
  return c.converted.map((p) => formatRate(p.currency, c.currency, p.rate)).join(", ");
}
