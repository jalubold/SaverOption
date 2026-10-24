// Unit tests for CSV subscription import parsing and conversion. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import {
  autoMap,
  cleanMapping,
  convertRow,
  CsvError,
  dateOrderFor,
  detectDelimiter,
  duplicateKey,
  IMPORT_FIELDS,
  parseAmountCell,
  parseBillingCell,
  parseBoolCell,
  parseCategoryCell,
  parseCsv,
  parseDateCell,
  parseIntCell,
  parsePricingModelCell,
  parseStatusCell,
  templateCsv,
  type ImportOptions,
} from "./csv-import.ts";

const opts: ImportOptions = { dateOrder: "iso", decimal: "dot", defaultCurrency: "USD", defaultInterval: "" };

test("parses BOM, CRLF, quotes, escaped quotes and embedded line breaks", () => {
  const text = '﻿Software,Price,Notes\r\nFigma,"1,299.50","Design, ""team"" plan"\r\n"Slack","8","line one\r\nline two"\r\n\r\n';
  const p = parseCsv(text);
  assert.equal(p.delimiter, ",");
  assert.deepEqual(p.headers, ["Software", "Price", "Notes"]);
  assert.deepEqual(p.rows, [
    ["Figma", "1,299.50", 'Design, "team" plan'],
    ["Slack", "8", "line one\r\nline two"],
  ]);
  assert.deepEqual(p.lines, [2, 3]);
});

test("detects semicolon and tab delimiters, pads short rows and trims long ones", () => {
  assert.equal(detectDelimiter("a;b;c\n1;2;3"), ";");
  assert.equal(detectDelimiter("a\tb\tc\n1\t2\t3"), "\t");
  assert.equal(detectDelimiter('"a,b";c;d'), ";");
  const p = parseCsv("Software;Price;Plan\nNotion;10\nZoom;15;Pro;extra\n");
  assert.deepEqual(p.rows, [
    ["Notion", "10", ""],
    ["Zoom", "15", "Pro"],
  ]);
});

test("rejects empty, binary, unterminated and oversized files", () => {
  assert.throws(() => parseCsv(""), CsvError);
  assert.throws(() => parseCsv("   \n  "), CsvError);
  assert.throws(() => parseCsv("PK\u0003\u0004\u0000\u0000binary"), /doesn't look like a CSV/);
  assert.throws(() => parseCsv('Software\n"Figma'), /never closed/);
  const big = "Software\n" + Array.from({ length: 6 }, (_, i) => `Tool ${i}`).join("\n");
  assert.throws(() => parseCsv(big, { maxRows: 5 }), /more than 5 rows/);
  assert.equal(parseCsv(big, { maxRows: 6 }).rows.length, 6);
});

test("auto-maps common header spellings and infers the period from a price header", () => {
  const { mapping, defaultInterval } = autoMap(["Tool", "Monthly cost", "Licenses", "Team", "Next billing date", "Owner email", "Currency", "Random"]);
  assert.equal(mapping.software, 0);
  assert.equal(mapping.price, 1);
  assert.equal(mapping.seats, 2);
  assert.equal(mapping.department, 3);
  assert.equal(mapping.nextRenewal, 4);
  assert.equal(mapping.owner, 5);
  assert.equal(mapping.currency, 6);
  assert.equal(defaultInterval, "monthly");
  assert.equal(Object.values(mapping).includes(7), false);

  const t = autoMap(["Software", "Vendor", "Amount", "Billing cycle", "Renewal date", "Seats", "Department"]);
  assert.equal(t.mapping.vendor, 1);
  assert.equal(t.mapping.billing, 3);
  assert.equal(t.defaultInterval, "");
});

test("the template's headers map back to every field", () => {
  const headers = templateCsv().replace(/^﻿/, "").trim().split(",");
  const { mapping } = autoMap(headers);
  for (const f of IMPORT_FIELDS) assert.equal(mapping[f.key], headers.indexOf(f.header), f.key);
});

test("cleanMapping drops out-of-range and reused columns (the earlier field in the list keeps a reused column)", () => {
  assert.deepEqual(cleanMapping({ software: "0", price: 1, plan: 1, seats: 9, vendor: "x" }, 3), { software: 0, plan: 1 });
  assert.deepEqual(cleanMapping({ software: 0, price: "2", currency: "-1" }, 3), { software: 0, price: 2 });
});

test("dates: ISO always, day/month order from the file option, written months, times dropped", () => {
  assert.deepEqual(parseDateCell("2026-11-01", "dmy"), { ok: true, value: "2026-11-01" });
  assert.deepEqual(parseDateCell("2026/1/5", "iso"), { ok: true, value: "2026-01-05" });
  assert.deepEqual(parseDateCell("2026-11-01 00:00:00", "iso"), { ok: true, value: "2026-11-01" });
  assert.deepEqual(parseDateCell("03/04/2026", "dmy"), { ok: true, value: "2026-04-03" });
  assert.deepEqual(parseDateCell("03/04/2026", "mdy"), { ok: true, value: "2026-03-04" });
  assert.deepEqual(parseDateCell("3.4.26", "dmy"), { ok: true, value: "2026-04-03" });
  assert.deepEqual(parseDateCell("1 Nov 2026", "iso"), { ok: true, value: "2026-11-01" });
  assert.deepEqual(parseDateCell("Nov 1, 2026", "iso"), { ok: true, value: "2026-11-01" });
  assert.deepEqual(parseDateCell("", "iso"), { ok: true, value: null });
  assert.equal(parseDateCell("03/04/2026", "iso").ok, false);
  assert.equal(parseDateCell("31/02/2026", "dmy").ok, false);
  assert.equal(parseDateCell("2026-13-01", "iso").ok, false);
  assert.equal(parseDateCell("next week", "iso").ok, false);
});

test("amounts: symbols dropped, codes captured, separators by option, negatives refused", () => {
  assert.deepEqual(parseAmountCell("$1,299.50", "dot"), { ok: true, value: { amount: "1299.50", currency: null } });
  assert.deepEqual(parseAmountCell("EUR 49", "dot"), { ok: true, value: { amount: "49", currency: "EUR" } });
  assert.deepEqual(parseAmountCell("49,00 €", "comma"), { ok: true, value: { amount: "49.00", currency: null } });
  assert.deepEqual(parseAmountCell("1.299,50", "comma"), { ok: true, value: { amount: "1299.50", currency: null } });
  assert.deepEqual(parseAmountCell("1,299", "dot"), { ok: true, value: { amount: "1299", currency: null } });
  assert.deepEqual(parseAmountCell("", "dot"), { ok: true, value: { amount: null, currency: null } });
  assert.equal(parseAmountCell("-20", "dot").ok, false);
  assert.equal(parseAmountCell("(20.00)", "dot").ok, false);
  assert.equal(parseAmountCell("49,99", "dot").ok, false, "a decimal comma in a dot file is flagged, not misread");
  assert.equal(parseAmountCell("49.99", "comma").ok, false);
  assert.equal(parseAmountCell("free", "dot").ok, false);
});

test("billing intervals in words and numbers", () => {
  const v = (s: string) => {
    const r = parseBillingCell(s);
    assert.ok(r.ok, s);
    return r.value;
  };
  assert.equal(v("Monthly")!.interval, "monthly");
  assert.equal(v("per month")!.interval, "monthly");
  assert.equal(v("/mo")!.interval, "monthly");
  assert.equal(v("Quarterly")!.interval, "quarterly");
  assert.equal(v("3 months")!.interval, "quarterly");
  assert.equal(v("Annual")!.interval, "yearly");
  assert.equal(v("annually")!.interval, "yearly");
  assert.equal(v("12 months")!.interval, "yearly");
  assert.equal(v("yr")!.interval, "yearly");
  assert.deepEqual(v("every 6 months"), { interval: "custom", customCount: 6, customUnit: "month" });
  assert.deepEqual(v("Semi-annually"), { interval: "custom", customCount: 6, customUnit: "month" });
  assert.deepEqual(v("2 weeks"), { interval: "custom", customCount: 2, customUnit: "week" });
  assert.deepEqual(v("every 2 years"), { interval: "custom", customCount: 2, customUnit: "year" });
  assert.equal(v(""), null);
  assert.equal(parseBillingCell("lifetime").ok, false);
  assert.equal(parseBillingCell("every 500 days").ok, false);
  assert.equal(parseBillingCell("sometimes").ok, false);
});

test("status, yes/no, pricing model, seats and category words", () => {
  assert.deepEqual(parseStatusCell("Canceled"), { ok: true, value: "cancelled" });
  assert.deepEqual(parseStatusCell("Free trial"), { ok: true, value: "trial" });
  assert.deepEqual(parseStatusCell(""), { ok: true, value: null });
  assert.equal(parseStatusCell("maybe").ok, false);
  assert.deepEqual(parseBoolCell("Yes"), { ok: true, value: true });
  assert.deepEqual(parseBoolCell("manual"), { ok: true, value: false });
  assert.deepEqual(parseBoolCell("unknown"), { ok: true, value: null });
  assert.equal(parseBoolCell("perhaps").ok, false);
  assert.deepEqual(parsePricingModelCell("Per user"), { ok: true, value: "per_seat" });
  assert.deepEqual(parsePricingModelCell("flat fee"), { ok: true, value: "flat" });
  assert.deepEqual(parseIntCell("1,200", "dot"), { ok: true, value: "1200" });
  assert.deepEqual(parseIntCell("1.200", "comma"), { ok: true, value: "1200" });
  assert.equal(parseIntCell("12.5", "dot").ok, false);
  assert.equal(parseCategoryCell("Design"), "design");
  assert.equal(parseCategoryCell("Team chat"), "communication");
  assert.equal(parseCategoryCell("cloud_hosting"), "cloud_hosting");
  assert.equal(parseCategoryCell("CRM"), "crm_sales");
  assert.equal(parseCategoryCell("Accounting software"), "finance_accounting");
  assert.equal(parseCategoryCell("Snacks"), null);
});

test("convertRow builds the form's field names and keeps unknown prices unknown", () => {
  const headers = ["Software", "Plan", "Price", "Currency", "Billing interval", "Purchased seats", "Next renewal date", "Auto-renew", "Status", "Department", "Owner"];
  const { mapping } = autoMap(headers);
  const r = convertRow(["Figma", "Professional", "$144", "", "Yearly", "12", "2026-11-01", "no", "Active", "Design", "maya@example.com"], mapping, opts);
  assert.deepEqual(r.messages, []);
  assert.equal(r.softwareName, "Figma");
  assert.equal(r.departmentRef, "Design");
  assert.equal(r.ownerRef, "maya@example.com");
  assert.deepEqual(r.fields, {
    price: "144",
    currency: "USD",
    billingInterval: "yearly",
    purchasedSeats: "12",
    nextRenewalDate: "2026-11-01",
    autoRenew: "false",
    status: "active",
    planName: "Professional",
  });

  const unknown = convertRow(["Notion", "", "", "EUR", "Monthly", "", "", "", "", "", ""], mapping, opts);
  assert.equal(unknown.fields.price, undefined, "a blank price stays unknown, never zero");
  assert.equal(unknown.fields.currency, "EUR");
});

test("convertRow: missing interval with a price is an error unless a default is chosen", () => {
  const { mapping } = autoMap(["Software", "Price"]);
  const r = convertRow(["Zoom", "15"], mapping, opts);
  assert.equal(r.messages.some((m) => m.level === "error" && /Billing interval is missing/.test(m.text)), true);
  const d = convertRow(["Zoom", "15"], mapping, { ...opts, defaultInterval: "monthly" });
  assert.deepEqual(d.messages, []);
  assert.equal(d.fields.billingInterval, "monthly");
  const none = convertRow(["Zoom", ""], mapping, opts);
  assert.equal(none.fields.billingInterval, "monthly");
  assert.equal(none.messages[0].level, "warning");
});

test("convertRow reports unreadable cells and a missing name", () => {
  const { mapping } = autoMap(["Software", "Price", "Billing interval", "Start date", "Currency"]);
  const r = convertRow(["", "-5", "sometimes", "31/31/2026", "USD"], mapping, opts);
  const texts = r.messages.map((m) => m.text).join(" | ");
  assert.match(texts, /Software name is missing/);
  assert.match(texts, /Price per billing period: .*negative/);
  assert.match(texts, /Billing interval: /);
  assert.match(texts, /Start date: /);
  const clash = convertRow(["Figma", "EUR 10", "Monthly", "", "USD"], mapping, opts);
  assert.match(clash.messages[0].text, /says EUR but the currency column says USD/);
});

test("duplicate keys ignore case, punctuation and company suffixes", () => {
  const a = duplicateKey({ softwareName: "Notion Labs, Inc.", planName: "Plus", billingInterval: "monthly", customIntervalCount: null, customIntervalUnit: null, currency: "USD" });
  const b = duplicateKey({ softwareName: "notion", planName: "plus", billingInterval: "monthly", customIntervalCount: null, customIntervalUnit: null, currency: "USD" });
  const c = duplicateKey({ softwareName: "notion", planName: "plus", billingInterval: "yearly", customIntervalCount: null, customIntervalUnit: null, currency: "USD" });
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("date order follows a numeric workspace date format, otherwise ISO", () => {
  assert.equal(dateOrderFor("dd/MM/yyyy"), "dmy");
  assert.equal(dateOrderFor("MM/dd/yyyy"), "mdy");
  assert.equal(dateOrderFor("MMM d, yyyy"), "iso");
  assert.equal(dateOrderFor("yyyy-MM-dd"), "iso");
});
