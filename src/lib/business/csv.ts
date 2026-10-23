/**
 * CSV for exports. Cells that a spreadsheet would run as a formula (starting
 * with = + - @, tab or carriage return) are prefixed with an apostrophe, so an
 * exported file can't execute anything someone typed into a record.
 */

export type Cell = string | number | boolean | null | undefined;

export function csvCell(v: Cell): string {
  if (v === null || v === undefined) return "";
  let s = typeof v === "number" ? (Number.isFinite(v) ? String(v) : "") : String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: Cell[][]): string {
  // BOM so Excel opens UTF-8 (names with accents, € and ¥) correctly.
  return "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** Minor units → a plain decimal number for spreadsheets (no symbols, no thousands separators). */
export function csvAmount(minor: number | null, digits: number): string {
  if (minor === null) return "";
  return digits === 0 ? String(Math.round(minor)) : (Math.round(minor) / 10 ** digits).toFixed(digits);
}
