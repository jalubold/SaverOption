/**
 * A sensible default currency for a country (ISO 3166-1 alpha-2), used to pre-fill a new
 * workspace. Only currencies the app can convert (they have an ECB reference rate, or are the
 * euro) are suggested; anything else falls back to US dollars. People can always change it.
 */
const BY_COUNTRY: Record<string, string> = {
  US: "USD", PR: "USD", EC: "USD", SV: "USD", PA: "USD",
  CA: "CAD", MX: "MXN", BR: "BRL",
  GB: "GBP", IM: "GBP", JE: "GBP", GG: "GBP",
  CH: "CHF", LI: "CHF", NO: "NOK", SE: "SEK", DK: "DKK", FO: "DKK", GL: "DKK", IS: "ISK",
  PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", TR: "TRY", IL: "ILS",
  ZA: "ZAR", IN: "INR", ID: "IDR", SG: "SGD", MY: "MYR", TH: "THB", PH: "PHP",
  JP: "JPY", KR: "KRW", CN: "CNY", HK: "HKD", AU: "AUD", NZ: "NZD",
  AE: "AED", SA: "SAR", VN: "VND", TW: "TWD", PK: "PKR", BD: "BDT", NG: "NGN", EG: "EGP", KE: "KES",
  AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", UA: "UAH",
};
const EURO = ["AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "AD", "MC", "SM", "VA", "ME", "XK"];

export function currencyForCountry(country: string | null | undefined, convertible: ReadonlySet<string>): string | null {
  if (!country || !/^[A-Z]{2}$/.test(country)) return null;
  const code = EURO.includes(country) ? "EUR" : BY_COUNTRY[country];
  if (!code) return null;
  return code === "EUR" || convertible.has(code) ? code : "USD";
}

/** The currencies with an ECB reference rate (besides the euro). */
export const ECB_CURRENCIES = ["USD", "JPY", "CZK", "DKK", "GBP", "HUF", "PLN", "RON", "SEK", "CHF", "ISK", "NOK", "TRY", "AUD", "BRL", "CAD", "CNY", "HKD", "IDR", "ILS", "INR", "KRW", "MXN", "MYR", "NZD", "PHP", "SGD", "THB", "ZAR"];
