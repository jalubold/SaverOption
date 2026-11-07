/**
 * Lifetime (AppSumo) codes — parsing and normalizing only, with no I/O, so the
 * rules can be tested on their own. The server (src/lib/server/business/lifetime.ts)
 * hashes the normalized code and does the database work.
 *
 * Codes are compared case-insensitively and without spaces: "sob-we9b 8pdd-5h7d"
 * and "SOB-WE9B8PDD-5H7D" are not the same code, but "  sob-we9b-8pdd-5h7d "
 * and "SOB-WE9B-8PDD-5H7D" are. AppSumo accepts 3–200 letters, digits, "-" and "_".
 */

const CODE = /^[A-Z0-9_-]{3,200}$/;

/** Most codes one import or deactivation accepts (AppSumo uploads hold up to 10,000). */
export const MAX_CODES_PER_IMPORT = 20_000;

/** The code as stored and compared: trimmed, unquoted, upper-case. Null when it can't be a code. */
export function normalizeCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const v = input
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim()
    .toUpperCase();
  return CODE.test(v) ? v : null;
}

/** The last four characters, kept in plain text so support can tell codes apart. */
export function codeHint(code: string): string {
  return code.slice(-4);
}

export interface ParsedCodes {
  codes: string[];
  /** Lines that weren't a valid code. */
  invalid: number;
  /** Codes that appeared more than once in the list (counted once). */
  duplicates: number;
  /** Whether the first line was a header ("code" / "codes") and skipped. */
  header: boolean;
  /** More than MAX_CODES_PER_IMPORT codes were given; only the first ones are kept. */
  truncated: boolean;
}

/**
 * Reads a pasted list or CSV: one code per line, the first column when a line
 * has several, an optional "code" header, blank lines ignored.
 */
export function parseCodeList(text: string): ParsedCodes {
  const seen = new Set<string>();
  const codes: string[] = [];
  let invalid = 0;
  let duplicates = 0;
  let header = false;
  let truncated = false;
  const lines = text.replace(/^﻿/, "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const cell = lines[i].split(/[,;\t]/)[0]?.trim() ?? "";
    if (!cell) continue;
    if (codes.length === 0 && invalid === 0 && !header && /^["']?codes?["']?$/i.test(cell)) {
      header = true;
      continue;
    }
    const code = normalizeCode(cell);
    if (!code) {
      invalid++;
      continue;
    }
    if (seen.has(code)) {
      duplicates++;
      continue;
    }
    if (codes.length >= MAX_CODES_PER_IMPORT) {
      truncated = true;
      break;
    }
    seen.add(code);
    codes.push(code);
  }
  return { codes, invalid, duplicates, header, truncated };
}
