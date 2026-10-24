import { currencyDigits } from "@/lib/business/calc";
import { fxRate, type FxNote, type FxRates, type OriginalMoney } from "@/lib/business/fx";
import type { BizContext } from "@/lib/server/business/context";
import { getSubscriptions, type Subscription } from "@/lib/server/business/data";
import { getFxRates } from "@/lib/server/business/fx";

export type { FxNote, OriginalMoney };

/**
 * Shows money in the workspace's default currency (Settings → Workspace).
 * Amounts in other currencies are converted at the ECB daily reference rate
 * for display only — records, forms, exports and MCP tool results keep the
 * currency each subscription is billed in. A currency the ECB doesn't publish
 * (or every currency, when the rates can't be fetched) stays as it is.
 */

export class DisplayCurrency {
  private readonly used = new Map<string, number>();
  constructor(
    readonly to: string,
    readonly fx: FxRates | null,
  ) {}

  /** Minor units of `from` in the display currency, or null when there's no rate. */
  convert(amount: number, from: string): number | null {
    if (from === this.to) return amount;
    const rate = this.fx ? fxRate(this.fx, from, this.to) : null;
    if (rate === null) return null;
    this.used.set(from, rate);
    return Math.round((amount / 10 ** currencyDigits(from)) * rate * 10 ** currencyDigits(this.to));
  }

  canConvert(from: string | null): boolean {
    return from === null || from === this.to || (this.fx !== null && fxRate(this.fx, from, this.to) !== null);
  }

  /**
   * A copy of `row` with the minor-unit `fields` converted and `currency` set to
   * the display currency, keeping the originals in `original`. Rows already in
   * the display currency, without a currency, or without a rate come back as is.
   */
  row<T extends { currency: string | null; original?: OriginalMoney }>(row: T, fields: readonly (keyof T & string)[]): T {
    const from = row.currency;
    if (from === null || from === this.to || !this.canConvert(from)) return row;
    const out = { ...row, currency: this.to, original: { currency: from, values: {} as Record<string, number | null> } };
    for (const f of fields) {
      const v = row[f] as unknown as number | null;
      out.original.values[f] = v;
      (out as Record<string, unknown>)[f] = v === null || v === undefined ? v : this.convert(v, from);
    }
    if (fields.length === 0) this.convert(0, from);
    return out;
  }

  rows<T extends { currency: string | null; original?: OriginalMoney }>(rows: T[], fields: readonly (keyof T & string)[]): T[] {
    return rows.map((r) => this.row(r, fields));
  }

  /** The rates used so far, for a note beside converted figures; null when nothing was converted. */
  note(): FxNote | null {
    if (!this.fx || this.used.size === 0) return null;
    return { to: this.to, date: this.fx.date, rates: [...this.used.entries()].map(([currency, rate]) => ({ currency, rate })).sort((a, b) => a.currency.localeCompare(b.currency)) };
  }
}

/** The display currency for this workspace; rates are fetched only when some amount isn't in it already. */
export async function displayCurrency(ctx: BizContext, currencies: Iterable<string | null>): Promise<DisplayCurrency> {
  const to = ctx.workspace.defaultCurrency;
  let foreign = false;
  for (const c of currencies) if (c && c !== to) foreign = true;
  return new DisplayCurrency(to, foreign ? await getFxRates() : null);
}

/** The subscription money fields shown in the app. */
export const SUB_MONEY = ["priceMinor", "annualPriceOptionMinor"] as const;

/** The display currency for a workspace, from the currencies its subscriptions are billed in. */
export async function workspaceDisplay(ctx: BizContext): Promise<DisplayCurrency> {
  return displayCurrency(ctx, (await getSubscriptions(ctx.workspace.id)).map((s) => s.currency));
}

/** A converted subscription back in the currency it's billed in (for "includes €… converted" notes). */
export function asBilled<T extends Subscription>(s: T): T {
  if (!s.original) return s;
  return { ...s, currency: s.original.currency, priceMinor: s.original.values.priceMinor ?? null, annualPriceOptionMinor: s.original.values.annualPriceOptionMinor ?? null, original: undefined };
}
