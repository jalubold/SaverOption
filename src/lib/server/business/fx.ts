import { parseEcbDaily, type FxRates } from "@/lib/business/fx";

/**
 * The European Central Bank's daily euro reference rates (published on
 * working days around 16:00 CET; free, no key). Cached for six hours; when the
 * file can't be fetched the last good copy is used, and with none the UI shows
 * per-currency totals instead of a converted one. FX_RATES_URL overrides the
 * source (tests point it at a local mock).
 */

const ECB_DAILY = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const TTL = 6 * 3600;

let last: { at: number; rates: FxRates } | null = null;

export async function getFxRates(): Promise<FxRates | null> {
  if (last && Date.now() - last.at < TTL * 1000) return last.rates;
  const url = process.env.FX_RATES_URL || ECB_DAILY;
  try {
    const res = await fetch(url, { next: { revalidate: TTL }, signal: AbortSignal.timeout(4000), headers: { accept: "application/xml" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rates = parseEcbDaily(await res.text());
    if (!rates) throw new Error("unrecognised file");
    if (last?.rates.date !== rates.date) console.info(JSON.stringify({ fx: "rates", source: url === ECB_DAILY ? "ecb" : "override", date: rates.date, currencies: Object.keys(rates.perEur).length }));
    last = { at: Date.now(), rates };
    return rates;
  } catch (err) {
    console.warn(`[fx] exchange rates unavailable: ${err instanceof Error ? err.message : "error"}`);
    return last?.rates ?? null;
  }
}
