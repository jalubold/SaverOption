import { headers } from "next/headers";
import { ECB_CURRENCIES, currencyForCountry } from "@/lib/business/region";
import { validTimeZone } from "@/lib/server/business/workspace";

export interface RegionDefaults {
  currency?: string;
  timeZone?: string;
  /** The country's name, to say where the suggestion came from ("Indonesia"). */
  countryName?: string;
}

/**
 * Defaults for a new workspace from where the visitor is: the country and time zone Vercel derives
 * from the request's IP (x-vercel-ip-country, x-vercel-ip-timezone). Nothing is stored; the form
 * is only pre-filled, and without these headers (local development) the browser's settings are used.
 */
export async function regionDefaults(): Promise<RegionDefaults> {
  const h = await headers();
  const country = (h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? "").toUpperCase() || null;
  const tz = h.get("x-vercel-ip-timezone");
  const out: RegionDefaults = {};
  if (tz && validTimeZone(tz)) out.timeZone = tz;
  if (country && /^[A-Z]{2}$/.test(country) && country !== "XX") {
    const currency = currencyForCountry(country, new Set(ECB_CURRENCIES));
    if (currency) out.currency = currency;
    try {
      out.countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(country) ?? undefined;
    } catch {}
  }
  return out;
}
