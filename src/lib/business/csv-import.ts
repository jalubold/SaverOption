/**
 * CSV import of subscriptions: parsing, column mapping and per-cell
 * conversion into the same field values the subscription form posts. Pure
 * module (no database, no app aliases) so it runs in Node tests and in the
 * browser. The server then validates each row with the app's own form rules.
 */
import { isIsoDate, normalizeName } from "./calc.ts";
import { categoryLabels, SOFTWARE_CATEGORIES, type BillingInterval, type IntervalUnit, type SoftwareCategory, type SubscriptionStatus } from "./constants.ts";

export const IMPORT_MAX_BYTES = 1_000_000;
export const IMPORT_MAX_ROWS = 2000;

// ─── Fields ─────────────────────────────────────────────────────────────────

export interface ImportFieldDef {
  key: ImportField;
  label: string;
  /** Header in the downloadable template. */
  header: string;
  required?: boolean;
  format: string;
  example: string;
  /** Normalised header spellings that map to this field automatically. */
  synonyms: string[];
}

export type ImportField =
  | "software"
  | "vendor"
  | "category"
  | "website"
  | "plan"
  | "price"
  | "currency"
  | "billing"
  | "pricingModel"
  | "seats"
  | "seatsInUse"
  | "startDate"
  | "nextRenewal"
  | "cancellationDeadline"
  | "contractEnd"
  | "autoRenew"
  | "status"
  | "department"
  | "owner"
  | "paymentMethod"
  | "purpose"
  | "notes";

export const IMPORT_FIELDS: ImportFieldDef[] = [
  {
    key: "software",
    label: "Software name",
    header: "Software",
    required: true,
    format: "Text, up to 80 characters. Matched to your inventory by name; new names are added to it.",
    example: "Figma",
    synonyms: ["software", "softwarename", "tool", "toolname", "product", "productname", "app", "application", "service", "name", "subscription", "subscriptionname", "vendorproduct", "saas"],
  },
  { key: "vendor", label: "Vendor", header: "Vendor", format: "Company that sells it.", example: "Figma, Inc.", synonyms: ["vendor", "vendorname", "supplier", "provider", "company", "merchant", "payee"] },
  {
    key: "category",
    label: "Category",
    header: "Category",
    format: `One of the app's categories, e.g. ${categoryLabels.design}, ${categoryLabels.communication}, ${categoryLabels.cloud_hosting}. Anything else becomes “Other”.`,
    example: "Design",
    synonyms: ["category", "type", "softwarecategory", "tooltype", "function"],
  },
  { key: "website", label: "Website", header: "Website", format: "Web address.", example: "figma.com", synonyms: ["website", "url", "site", "homepage", "web", "link", "vendorwebsite"] },
  { key: "plan", label: "Plan", header: "Plan", format: "Plan or edition name.", example: "Professional", synonyms: ["plan", "planname", "tier", "edition", "package", "license", "licensetype", "subscriptiontype"] },
  {
    key: "price",
    label: "Price per billing period",
    header: "Price",
    format: "What one billing period costs in total, e.g. 1,299.50. Currency symbols are ignored. Leave blank if unknown — it's never treated as zero.",
    example: "144.00",
    synonyms: [
      "price", "amount", "cost", "total", "totalcost", "fee", "charge", "billingamount", "priceperperiod", "subscriptioncost", "monthlycost", "annualcost",
      "yearlycost", "monthlyprice", "annualprice", "yearlyprice", "monthlyamount", "annualamount", "spend", "contractvalue",
    ],
  },
  { key: "currency", label: "Currency", header: "Currency", format: "Three-letter code. Blank uses the file's default currency.", example: "USD", synonyms: ["currency", "currencycode", "ccy", "cur"] },
  {
    key: "billing",
    label: "Billing interval",
    header: "Billing interval",
    format: "Monthly, Quarterly, Yearly (or Annual), or “every 6 months”, “every 2 weeks”…",
    example: "Monthly",
    synonyms: ["billinginterval", "billing", "billingcycle", "billingfrequency", "billingperiod", "frequency", "interval", "cycle", "period", "term", "paymentfrequency", "renewalfrequency", "recurrence"],
  },
  {
    key: "pricingModel",
    label: "Pricing model",
    header: "Pricing model",
    format: "“Per seat” when the price covers the purchased seats; otherwise flat.",
    example: "Per seat",
    synonyms: ["pricingmodel", "pricing", "pricingtype", "billingmodel", "chargetype"],
  },
  { key: "seats", label: "Purchased seats", header: "Purchased seats", format: "Whole number.", example: "12", synonyms: ["purchasedseats", "seats", "licenses", "licences", "seatcount", "numberofseats", "users", "quantity", "qty", "totalseats", "licensecount", "seatspurchased"] },
  { key: "seatsInUse", label: "Seats in use", header: "Seats in use", format: "Whole number, at most the purchased seats.", example: "9", synonyms: ["seatsinuse", "usedseats", "assignedseats", "activeusers", "activeseats", "seatsused", "seatsassigned", "inuse"] },
  { key: "startDate", label: "Start date", header: "Start date", format: "Date in the file's date format.", example: "2025-11-01", synonyms: ["startdate", "start", "started", "since", "subscribedon", "purchasedate", "begindate", "contractstart"] },
  {
    key: "nextRenewal",
    label: "Next renewal date",
    header: "Next renewal date",
    format: "Date in the file's date format.",
    example: "2026-11-01",
    synonyms: ["nextrenewaldate", "nextrenewal", "renewaldate", "renewal", "renews", "renewson", "nextbillingdate", "nextbilling", "nextpayment", "nextpaymentdate", "nextcharge", "billingdate", "duedate"],
  },
  { key: "cancellationDeadline", label: "Cancellation deadline", header: "Cancellation deadline", format: "Date, on or before the renewal date.", example: "2026-10-01", synonyms: ["cancellationdeadline", "cancelby", "noticedate", "noticedeadline", "cancellationdate", "optoutdate"] },
  { key: "contractEnd", label: "Contract end date", header: "Contract end date", format: "Date.", example: "2027-10-31", synonyms: ["contractenddate", "contractend", "enddate", "expirydate", "expirationdate", "expires", "termend"] },
  { key: "autoRenew", label: "Auto-renew", header: "Auto-renew", format: "Yes or No. Blank keeps the app default (renews automatically).", example: "Yes", synonyms: ["autorenew", "autorenewal", "autorenews", "renewstype", "renewaltype", "automaticrenewal", "recurring"] },
  { key: "status", label: "Status", header: "Status", format: "Active, Trial, Paused, Cancelled or Expired. Blank means active.", example: "Active", synonyms: ["status", "state", "subscriptionstatus"] },
  {
    key: "department",
    label: "Department",
    header: "Department",
    format: "Name of an existing department (matched without case). Unknown names are left blank.",
    example: "Design",
    synonyms: ["department", "dept", "team", "costcenter", "costcentre", "businessunit", "division", "group"],
  },
  {
    key: "owner",
    label: "Owner",
    header: "Owner",
    format: "Name or email of someone in your team directory. Unknown people are left blank.",
    example: "maya@example.com",
    synonyms: ["owner", "owneremail", "ownername", "contact", "responsible", "manager", "admin", "accountowner", "budgetowner", "requester"],
  },
  { key: "paymentMethod", label: "Payment method", header: "Payment method", format: "A short label, never a card number.", example: "Company Visa ••4242", synonyms: ["paymentmethod", "payment", "card", "paidwith", "billingmethod", "paymenttype"] },
  { key: "purpose", label: "Business purpose", header: "Business purpose", format: "What the team uses it for (new software only).", example: "Product design", synonyms: ["businesspurpose", "purpose", "usecase", "description", "usedfor"] },
  { key: "notes", label: "Notes", header: "Notes", format: "Free text.", example: "", synonyms: ["notes", "note", "comments", "comment", "remarks", "memo"] },
];

export const IMPORT_FIELD_KEYS = IMPORT_FIELDS.map((f) => f.key);

/** Field → zero-based column index in the file. */
export type ColumnMapping = Partial<Record<ImportField, number>>;

export type DateOrder = "iso" | "dmy" | "mdy";
export type DecimalSeparator = "dot" | "comma";

export interface ImportOptions {
  dateOrder: DateOrder;
  decimal: DecimalSeparator;
  /** Used when a row has no currency. */
  defaultCurrency: string;
  /** Used when a row has no billing interval; "" requires one per row. */
  defaultInterval: "" | "monthly" | "quarterly" | "yearly";
}

export function templateCsv(): string {
  return "﻿" + IMPORT_FIELDS.map((f) => f.header).join(",") + "\r\n";
}

// ─── Parsing ────────────────────────────────────────────────────────────────

export interface ParsedCsv {
  delimiter: "," | ";" | "\t";
  headers: string[];
  /** Data rows (header excluded), each padded or trimmed to the header length. */
  rows: string[][];
  /** 1-based line number in the file where each data row starts. */
  lines: number[];
}

export class CsvError extends Error {}

/** Looks like text (no NUL bytes or other binary control characters). */
export function looksLikeText(text: string): boolean {
  if (text.includes("\u0000")) return false;
  const sample = text.slice(0, 4000);
  const controls = sample.match(/[\u0001-\u0008\u000e-\u001f]/g)?.length ?? 0;
  return controls <= Math.max(2, sample.length / 200);
}

/** The delimiter used in the header line: comma, semicolon or tab (outside quotes). */
export function detectDelimiter(text: string): "," | ";" | "\t" {
  const counts = { ",": 0, ";": 0, "\t": 0 };
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') quoted = !quoted;
    else if (!quoted && (ch === "\n" || ch === "\r")) break;
    else if (!quoted && ch in counts) counts[ch as keyof typeof counts]++;
  }
  if (counts[";"] > counts[","] && counts[";"] >= counts["\t"]) return ";";
  if (counts["\t"] > counts[","] && counts["\t"] > counts[";"]) return "\t";
  return ",";
}

/**
 * RFC 4180 CSV with the usual spreadsheet variations: a UTF-8 BOM, CRLF or LF
 * line ends, quoted fields with "" escapes and embedded line breaks, and comma,
 * semicolon or tab delimiters. Blank lines are skipped.
 */
export function parseCsv(input: string, opts: { maxRows?: number } = {}): ParsedCsv {
  const text = input.replace(/^﻿/, "");
  if (!text.trim()) throw new CsvError("The file is empty.");
  if (!looksLikeText(text)) throw new CsvError("This doesn't look like a CSV file. Export your spreadsheet as CSV (comma-separated values) and try again.");
  const delimiter = detectDelimiter(text);
  const records: { cells: string[]; line: number }[] = [];
  let cells: string[] = [];
  let cell = "";
  let quoted = false;
  let line = 1;
  let startLine = 1;
  let afterQuote = false;
  const maxRecords = (opts.maxRows ?? IMPORT_MAX_ROWS) + 1;
  const endRecord = () => {
    cells.push(cell);
    if (cells.some((c) => c.trim() !== "")) records.push({ cells, line: startLine });
    cells = [];
    cell = "";
    afterQuote = false;
    if (records.length > maxRecords) throw new CsvError(`The file has more than ${(maxRecords - 1).toLocaleString("en-US")} rows. Split it into smaller files.`);
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        if (ch === "\n") line++;
        cell += ch;
      }
      continue;
    }
    if (ch === '"' && cell.trim() === "" && !afterQuote) {
      quoted = true;
      cell = "";
    } else if (ch === delimiter) {
      cells.push(cell);
      cell = "";
      afterQuote = false;
    } else if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      endRecord();
      line++;
      startLine = line;
    } else if (!afterQuote) {
      cell += ch;
    }
    // Characters right after a closing quote (other than a delimiter or line end) are dropped.
  }
  if (quoted) throw new CsvError(`A quoted value starting on line ${startLine} is never closed. Check for a stray quote mark.`);
  if (cell !== "" || cells.length) endRecord();
  if (records.length === 0) throw new CsvError("The file is empty.");

  const headers = records[0].cells.map((h) => h.trim());
  if (headers.every((h) => !h)) throw new CsvError("The first row should hold the column names.");
  const width = headers.length;
  const rows = records.slice(1).map((r) => {
    const c = r.cells.map((v) => v.trim());
    return c.length >= width ? c.slice(0, width) : [...c, ...Array(width - c.length).fill("")];
  });
  return { delimiter, headers, rows, lines: records.slice(1).map((r) => r.line) };
}

// ─── Column mapping ─────────────────────────────────────────────────────────

export function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

/** Maps headers to fields by known spellings; each field and each column is used at most once. */
export function autoMap(headers: string[]): { mapping: ColumnMapping; defaultInterval: ImportOptions["defaultInterval"] } {
  const mapping: ColumnMapping = {};
  const used = new Set<number>();
  const norm = headers.map(normalizeHeader);
  // Exact synonyms first, then headers that start with a synonym ("Software name (internal)").
  for (const pass of ["exact", "prefix"] as const) {
    for (const f of IMPORT_FIELDS) {
      if (mapping[f.key] !== undefined) continue;
      const idx = norm.findIndex((h, i) => !used.has(i) && h !== "" && (pass === "exact" ? f.synonyms.includes(h) : f.synonyms.some((s) => s.length >= 4 && h.startsWith(s))));
      if (idx !== -1) {
        mapping[f.key] = idx;
        used.add(idx);
      }
    }
  }
  // A price column named "Monthly cost" or "Annual cost" says what period it covers.
  let defaultInterval: ImportOptions["defaultInterval"] = "";
  if (mapping.price !== undefined && mapping.billing === undefined) {
    const h = norm[mapping.price];
    if (/month/.test(h)) defaultInterval = "monthly";
    else if (/annual|year/.test(h)) defaultInterval = "yearly";
    else if (/quarter/.test(h)) defaultInterval = "quarterly";
  }
  return { mapping, defaultInterval };
}

/** Drops mappings to columns that don't exist and duplicate uses of one column. */
export function cleanMapping(input: Record<string, unknown>, columnCount: number): ColumnMapping {
  const out: ColumnMapping = {};
  const used = new Set<number>();
  for (const key of IMPORT_FIELD_KEYS) {
    const v = input[key];
    const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : NaN;
    if (Number.isInteger(n) && n >= 0 && n < columnCount && !used.has(n)) {
      out[key] = n;
      used.add(n);
    }
  }
  return out;
}

// ─── Cell conversion ────────────────────────────────────────────────────────

type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = <T>(error: string): Result<T> => ({ ok: false, error });

const pad = (n: number) => String(n).padStart(2, "0");

/** A date cell → ISO yyyy-mm-dd. ISO dates are always accepted; otherwise the file's day/month order decides. */
export function parseDateCell(raw: string, order: DateOrder): Result<string | null> {
  let v = raw.trim();
  if (!v) return ok(null);
  // Spreadsheet exports often add a time ("2026-01-31 00:00:00", "2026-01-31T00:00:00Z").
  v = v.replace(/[T ]\d{1,2}:\d{2}(:\d{2}(\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2}|[AP]M)?$/i, "").trim();
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(v);
  if (m) {
    const iso = `${m[1]}-${pad(Number(m[2]))}-${pad(Number(m[3]))}`;
    return isIsoDate(iso) ? ok(iso) : fail(`“${raw}” isn't a valid date.`);
  }
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/.exec(v);
  if (m) {
    if (order === "iso") return fail(`“${raw}” isn't in the YYYY-MM-DD format chosen for this file. Pick DD/MM/YYYY or MM/DD/YYYY under file options if your file uses those.`);
    const [a, b] = [Number(m[1]), Number(m[2])];
    const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    const [day, month] = order === "dmy" ? [a, b] : [b, a];
    const iso = `${year}-${pad(month)}-${pad(day)}`;
    return isIsoDate(iso) ? ok(iso) : fail(`“${raw}” isn't a valid ${order === "dmy" ? "DD/MM/YYYY" : "MM/DD/YYYY"} date.`);
  }
  // "1 Nov 2026", "Nov 1, 2026"
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  m = /^(\d{1,2})\s+([a-z]{3})[a-z]*\.?,?\s+(\d{4})$/i.exec(v) ?? null;
  let parts: [number, number, number] | null = null;
  if (m) parts = [Number(m[3]), months.indexOf(m[2].toLowerCase()) + 1, Number(m[1])];
  else {
    const n = /^([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(v);
    if (n) parts = [Number(n[3]), months.indexOf(n[1].toLowerCase()) + 1, Number(n[2])];
  }
  if (parts && parts[1] > 0) {
    const iso = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
    if (isIsoDate(iso)) return ok(iso);
  }
  return fail(`“${raw}” isn't a date the import understands. Use YYYY-MM-DD or the format chosen under file options.`);
}

/**
 * An amount cell → a plain "1234.56" string for the app's money parser, plus a
 * currency code when the cell spells one out ("EUR 49", "49 USD"). Currency
 * symbols are dropped; a symbol never decides the currency.
 */
export function parseAmountCell(raw: string, decimal: DecimalSeparator): Result<{ amount: string | null; currency: string | null }> {
  let v = raw.trim();
  if (!v) return ok({ amount: null, currency: null });
  let currency: string | null = null;
  const code = /(^|[^A-Za-z])([A-Z]{3})([^A-Za-z]|$)/.exec(v);
  if (code) {
    currency = code[2];
    v = v.replace(code[2], " ");
  }
  if (/^\(.*\)$/.test(v.trim()) || /-\s*\d|\d\s*-$/.test(v)) return fail(`“${raw}” is negative. Enter what the subscription costs as a positive amount.`);
  v = v.replace(/[^\d.,]/g, "");
  if (!v || !/\d/.test(v)) return fail(`“${raw}” isn't an amount.`);
  // A lone separator followed by one or two digits is a decimal mark; if it's the other one, the file option is wrong.
  if (decimal === "comma" && !v.includes(",") && /\.\d{1,2}$/.test(v)) return fail(`“${raw}” uses a dot for decimals, but this file is set to decimal commas. Change the decimal separator under file options.`);
  if (decimal === "dot" && !v.includes(".") && /,\d{1,2}$/.test(v)) return fail(`“${raw}” uses a comma for decimals, but this file is set to decimal dots. Change the decimal separator under file options.`);
  if (decimal === "comma") v = v.replace(/\./g, "").replace(",", ".");
  else v = v.replace(/,/g, "");
  if ((v.match(/\./g)?.length ?? 0) > 1) return fail(`“${raw}” isn't an amount. Check the decimal separator under file options.`);
  return ok({ amount: v, currency });
}

export interface BillingValue {
  interval: BillingInterval;
  customCount: number | null;
  customUnit: IntervalUnit | null;
}

const UNIT_WORDS: Record<string, IntervalUnit> = { day: "day", days: "day", week: "week", weeks: "week", month: "month", months: "month", mo: "month", mos: "month", year: "year", years: "year", yr: "year", yrs: "year" };

function fromCount(n: number, unit: IntervalUnit): BillingValue {
  if (unit === "month" && n === 1) return { interval: "monthly", customCount: null, customUnit: null };
  if (unit === "month" && n === 3) return { interval: "quarterly", customCount: null, customUnit: null };
  if ((unit === "month" && n === 12) || (unit === "year" && n === 1)) return { interval: "yearly", customCount: null, customUnit: null };
  return { interval: "custom", customCount: n, customUnit: unit };
}

/** "Monthly", "per year", "Annual", "every 6 months", "2 weeks", "/mo" → a billing interval. */
export function parseBillingCell(raw: string): Result<BillingValue | null> {
  const v = raw.trim().toLowerCase().replace(/[._]/g, " ").replace(/\s+/g, " ");
  if (!v) return ok(null);
  const simple: Record<string, BillingValue> = {};
  for (const w of ["monthly", "month", "mo", "per month", "/mo", "/month", "a month", "each month", "every month", "mthly", "mensual", "bulanan"]) simple[w] = fromCount(1, "month");
  for (const w of ["quarterly", "quarter", "per quarter", "/qtr", "/quarter", "qtr", "every quarter", "q"]) simple[w] = fromCount(3, "month");
  for (const w of ["yearly", "year", "annual", "annually", "per year", "/yr", "/year", "yr", "a year", "each year", "every year", "per annum", "pa", "tahunan", "anual"]) simple[w] = fromCount(1, "year");
  for (const w of ["semiannual", "semi annual", "semi-annual", "semiannually", "semi annually", "semi-annually", "half yearly", "half-yearly", "biannually"]) simple[w] = fromCount(6, "month");
  for (const w of ["weekly", "week", "per week", "/wk", "/week"]) simple[w] = fromCount(1, "week");
  for (const w of ["biweekly", "bi-weekly", "fortnightly"]) simple[w] = fromCount(2, "week");
  for (const w of ["daily", "per day", "/day"]) simple[w] = fromCount(1, "day");
  if (simple[v]) return ok(simple[v]);
  const m = /^(?:every|each|per)?\s*(\d{1,3})\s*-?\s*(days?|weeks?|months?|mos?|years?|yrs?)(?:ly)?$/.exec(v);
  if (m) {
    const n = Number(m[1]);
    if (n < 1 || n > 120) return fail(`“${raw}” is outside the supported range (1 to 120).`);
    return ok(fromCount(n, UNIT_WORDS[m[2]]));
  }
  if (/one[ -]?time|lifetime|perpetual|once/.test(v)) return fail(`“${raw}” isn't a recurring billing interval. Lifetime and one-off purchases aren't subscriptions.`);
  return fail(`“${raw}” isn't a billing interval the import understands. Use Monthly, Quarterly, Yearly or “every N months”.`);
}

export function parseStatusCell(raw: string): Result<SubscriptionStatus | null> {
  const v = raw.trim().toLowerCase();
  if (!v) return ok(null);
  const map: Record<string, SubscriptionStatus> = {
    active: "active", live: "active", current: "active", paid: "active", "in use": "active", enabled: "active", aktif: "active",
    trial: "trial", trialing: "trial", trialling: "trial", "free trial": "trial", "in trial": "trial",
    paused: "paused", "on hold": "paused", suspended: "paused",
    cancelled: "cancelled", canceled: "cancelled", cancel: "cancelled", terminated: "cancelled",
    expired: "expired", ended: "expired", inactive: "expired", lapsed: "expired",
  };
  return map[v] ? ok(map[v]) : fail(`“${raw}” isn't a status the import understands. Use Active, Trial, Paused, Cancelled or Expired.`);
}

export function parseBoolCell(raw: string): Result<boolean | null> {
  const v = raw.trim().toLowerCase();
  if (!v || v === "unknown" || v === "?" || v === "n/a") return ok(null);
  if (["yes", "y", "true", "1", "on", "auto", "automatic", "automatically", "auto-renew", "autorenew", "ya"].includes(v)) return ok(true);
  if (["no", "n", "false", "0", "off", "manual", "manually", "tidak"].includes(v)) return ok(false);
  return fail(`“${raw}” should be Yes or No.`);
}

export function parsePricingModelCell(raw: string): Result<"flat" | "per_seat" | null> {
  const v = raw.trim().toLowerCase().replace(/[_-]/g, " ");
  if (!v) return ok(null);
  if (/^(per )?(seat|user|license|licence|member|head)s?$|per (seat|user|license|licence)|seat based|user based/.test(v)) return ok("per_seat");
  if (/^(flat|fixed|total|flat rate|flat fee|fixed price|usage|usage based)$/.test(v)) return ok("flat");
  return fail(`“${raw}” should be “Per seat” or “Flat”.`);
}

const CATEGORY_WORDS: [RegExp, SoftwareCategory][] = [
  [/chat|messag|slack|communicat/, "communication"],
  [/video|meeting|conferenc|webinar/, "video_meetings"],
  [/project|task|issue|kanban|\bpm\b/, "project_management"],
  [/doc|wiki|knowledge|notes?\b/, "documentation"],
  [/design|creative|prototyp|graphic/, "design"],
  [/develop|engineer|code|devops|\bci\b|monitor|observab/, "development"],
  [/cloud|hosting|infra|server|database|\bcdn\b/, "cloud_hosting"],
  [/\bai\b|\bllm\b|artificial|machine learning|gpt/, "ai"],
  [/crm|sales/, "crm_sales"],
  [/market|email|seo|social|advertis|newsletter/, "marketing"],
  [/support|help ?desk|ticket|customer service|success/, "customer_support"],
  [/analytic|\bbi\b|business intelligence|report|data/, "analytics"],
  [/financ|account|invoice|payroll|expense|billing|payment|tax/, "finance_accounting"],
  [/\bhr\b|people|recruit|hiring|human resources|talent/, "hr_people"],
  [/secur|identity|password|\bsso\b|vpn|compliance/, "security"],
  [/storage|file|backup|drive|sharing/, "storage"],
  [/office|productiv|suite|calendar|workspace|email client/, "productivity"],
];

/** Free-text category → one of the app's categories (null when nothing matches). */
export function parseCategoryCell(raw: string): SoftwareCategory | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  const key = v.replace(/[^a-z]+/g, "_").replace(/^_|_$/g, "");
  if ((SOFTWARE_CATEGORIES as readonly string[]).includes(key)) return key as SoftwareCategory;
  for (const c of SOFTWARE_CATEGORIES) if (normalizeName(categoryLabels[c]) === normalizeName(v)) return c;
  for (const [re, c] of CATEGORY_WORDS) if (re.test(v)) return c;
  return null;
}

/** Whole numbers with thousands separators in either style ("1,200", "1.200", "1 200"). */
export function parseIntCell(raw: string, decimal: DecimalSeparator): Result<string | null> {
  const v = raw.trim();
  if (!v) return ok(null);
  const cleaned = v.replace(/\s/g, "").replace(decimal === "comma" ? /\./g : /,/g, "");
  if (!/^\d+$/.test(cleaned)) return fail(`“${raw}” must be a whole number.`);
  return ok(cleaned);
}

// ─── Row → form fields ──────────────────────────────────────────────────────

export interface RowMessage {
  level: "error" | "warning";
  text: string;
}

export interface ConvertedRow {
  softwareName: string;
  vendor: string;
  website: string;
  category: SoftwareCategory | null;
  categoryRaw: string;
  purpose: string;
  departmentRef: string;
  ownerRef: string;
  /** Subscription form fields with the names the app's form uses. */
  fields: Record<string, string>;
  messages: RowMessage[];
}

const cellOf = (row: string[], mapping: ColumnMapping, field: ImportField) => {
  const i = mapping[field];
  return i === undefined ? "" : (row[i] ?? "").trim();
};

/**
 * Converts one CSV row into the subscription form's field values. Cell-level
 * problems (unreadable dates, amounts, intervals) become row errors here; the
 * server then runs the app's form validation on the result.
 */
export function convertRow(row: string[], mapping: ColumnMapping, options: ImportOptions): ConvertedRow {
  const messages: RowMessage[] = [];
  const err = (field: ImportField, text: string) => messages.push({ level: "error", text: `${IMPORT_FIELDS.find((f) => f.key === field)!.label}: ${text}` });
  const cell = (f: ImportField) => cellOf(row, mapping, f);
  const fields: Record<string, string> = {};

  const softwareName = cell("software").replace(/\s+/g, " ");
  if (!softwareName) messages.push({ level: "error", text: "Software name is missing." });

  // Price and currency
  const amount = parseAmountCell(cell("price"), options.decimal);
  let currency = cell("currency").toUpperCase();
  if (!amount.ok) err("price", amount.error);
  else {
    if (amount.value.amount !== null) fields.price = amount.value.amount;
    if (amount.value.currency) {
      if (currency && currency !== amount.value.currency) err("currency", `the price says ${amount.value.currency} but the currency column says ${currency}.`);
      currency ||= amount.value.currency;
    }
  }
  fields.currency = currency || options.defaultCurrency;

  // Billing interval
  const billing = parseBillingCell(cell("billing"));
  if (!billing.ok) err("billing", billing.error);
  else if (billing.value) {
    fields.billingInterval = billing.value.interval;
    if (billing.value.interval === "custom") {
      fields.customIntervalCount = String(billing.value.customCount);
      fields.customIntervalUnit = billing.value.customUnit!;
    }
  } else if (options.defaultInterval) {
    fields.billingInterval = options.defaultInterval;
  } else if (fields.price !== undefined) {
    messages.push({ level: "error", text: "Billing interval is missing, so the price can't be turned into a monthly cost. Add the column or choose a default interval under file options." });
  } else {
    fields.billingInterval = "monthly";
    messages.push({ level: "warning", text: "No billing interval or price — saved as monthly with an unknown price. Edit it later." });
  }

  const model = parsePricingModelCell(cell("pricingModel"));
  if (!model.ok) err("pricingModel", model.error);
  else if (model.value) fields.pricingModel = model.value;

  const decimal = options.decimal;
  for (const [f, name] of [
    ["seats", "purchasedSeats"],
    ["seatsInUse", "reportedAssignedSeats"],
  ] as const) {
    const n = parseIntCell(cell(f), decimal);
    if (!n.ok) err(f, n.error);
    else if (n.value !== null) fields[name] = n.value;
  }

  for (const [f, name] of [
    ["startDate", "startDate"],
    ["nextRenewal", "nextRenewalDate"],
    ["cancellationDeadline", "cancellationDeadline"],
    ["contractEnd", "contractEndDate"],
  ] as const) {
    const d = parseDateCell(cell(f), options.dateOrder);
    if (!d.ok) err(f, d.error);
    else if (d.value) fields[name] = d.value;
  }

  const auto = parseBoolCell(cell("autoRenew"));
  if (!auto.ok) err("autoRenew", auto.error);
  else if (auto.value !== null) fields.autoRenew = auto.value ? "true" : "false";

  const status = parseStatusCell(cell("status"));
  if (!status.ok) err("status", status.error);
  else if (status.value) fields.status = status.value;

  const plan = cell("plan");
  if (plan) fields.planName = plan;
  const payment = cell("paymentMethod");
  if (payment) fields.paymentMethod = payment;
  const notes = cell("notes");
  if (notes) fields.notes = notes;

  const categoryRaw = cell("category");
  const category = parseCategoryCell(categoryRaw);
  if (categoryRaw && !category) messages.push({ level: "warning", text: `Category “${categoryRaw}” isn't one of the app's categories — new software is filed under Other.` });

  return {
    softwareName,
    vendor: cell("vendor"),
    website: cell("website"),
    category,
    categoryRaw,
    purpose: cell("purpose"),
    departmentRef: cell("department"),
    ownerRef: cell("owner"),
    fields,
    messages,
  };
}

/** Key for spotting the same subscription twice: software + plan + interval + currency. */
export function duplicateKey(k: { softwareName: string; planName: string | null; billingInterval: string; customIntervalCount: number | null; customIntervalUnit: string | null; currency: string }): string {
  const interval = k.billingInterval === "custom" ? `custom:${k.customIntervalCount}:${k.customIntervalUnit}` : k.billingInterval;
  return [normalizeName(k.softwareName), normalizeName(k.planName ?? ""), interval, k.currency].join("|");
}

/** A numeric display date format implies the day/month order of the team's files. */
export function dateOrderFor(dateFormat: string): DateOrder {
  if (dateFormat === "dd/MM/yyyy") return "dmy";
  if (dateFormat === "MM/dd/yyyy") return "mdy";
  // Written-out months don't say how the team types numeric dates, so ambiguous ones are refused, not guessed.
  return "iso";
}
