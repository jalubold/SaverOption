/**
 * Server-side form parsing for the business app: every field is read, trimmed,
 * length-checked and type-checked here before anything reaches the database.
 * Errors are collected per field so a form can show them all at once.
 */
import { isCurrencyCode, isIsoDate, parseMoney } from "./calc.ts";

export type FieldErrors = Record<string, string>;

export interface FormState {
  ok?: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
  message?: string;
  /** Where the client should go next (validated by the server action). */
  redirectTo?: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: unknown): v is string {
  return typeof v === "string" && UUID.test(v);
}

/** Card-number-like strings (12+ digits) never get stored in a payment method label. */
const CARD_LIKE = /\d[\d -]{10,}\d/;

export class FormReader {
  readonly errors: FieldErrors = {};
  constructor(private readonly form: FormData) {}

  private raw(name: string): string {
    const v = this.form.get(name);
    return typeof v === "string" ? v.replace(/\u0000/g, "").trim() : "";
  }

  has(name: string): boolean {
    return this.form.has(name);
  }

  fail(name: string, message: string): void {
    if (!this.errors[name]) this.errors[name] = message;
  }

  get ok(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  /** Text; empty → null (or an error when required). */
  text(name: string, opts: { label: string; max: number; min?: number; required?: boolean; multiline?: boolean }): string | null {
    let v = this.raw(name);
    if (!opts.multiline) v = v.replace(/\s+/g, " ");
    if (!v) {
      if (opts.required) this.fail(name, `${opts.label} is required.`);
      return null;
    }
    if (v.length > opts.max) this.fail(name, `${opts.label} can be at most ${opts.max} characters.`);
    if (opts.min && v.length < opts.min) this.fail(name, `${opts.label} must be at least ${opts.min} characters.`);
    return v;
  }

  requiredText(name: string, opts: { label: string; max: number; min?: number }): string {
    return this.text(name, { ...opts, required: true }) ?? "";
  }

  url(name: string, opts: { label: string; httpsOnly?: boolean }): string | null {
    const v = this.text(name, { label: opts.label, max: 300 });
    if (!v) return null;
    const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    try {
      const u = new URL(withScheme);
      if (!["http:", "https:"].includes(u.protocol) || !u.hostname.includes(".")) throw new Error();
      if (opts.httpsOnly && u.protocol !== "https:") {
        this.fail(name, `${opts.label} must start with https://.`);
        return null;
      }
      return u.toString();
    } catch {
      this.fail(name, `${opts.label} must be a web address.`);
      return null;
    }
  }

  email(name: string, opts: { label: string; required?: boolean }): string | null {
    const v = this.text(name, { label: opts.label, max: 254, required: opts.required });
    if (!v) return null;
    const e = v.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      this.fail(name, `${opts.label} must be an email address.`);
      return null;
    }
    return e;
  }

  int(name: string, opts: { label: string; min: number; max: number; required?: boolean }): number | null {
    const v = this.raw(name).replace(/,/g, "");
    if (!v) {
      if (opts.required) this.fail(name, `${opts.label} is required.`);
      return null;
    }
    if (!/^\d+$/.test(v)) {
      this.fail(name, `${opts.label} must be a whole number.`);
      return null;
    }
    const n = Number(v);
    if (n < opts.min || n > opts.max) {
      this.fail(name, `${opts.label} must be between ${opts.min} and ${opts.max.toLocaleString("en-US")}.`);
      return null;
    }
    return n;
  }

  money(name: string, currency: string, opts: { label: string; required?: boolean }): number | null {
    const v = this.raw(name);
    if (!v) {
      if (opts.required) this.fail(name, `${opts.label} is required.`);
      return null;
    }
    const minor = parseMoney(v, currency);
    if (minor === null || Number.isNaN(minor)) {
      this.fail(name, `${opts.label} must be an amount like 49 or 1,299.50.`);
      return null;
    }
    return minor;
  }

  date(name: string, opts: { label: string; required?: boolean }): string | null {
    const v = this.raw(name);
    if (!v) {
      if (opts.required) this.fail(name, `${opts.label} is required.`);
      return null;
    }
    if (!isIsoDate(v) || v < "1990-01-01" || v > "2100-12-31") {
      this.fail(name, `${opts.label} must be a valid date.`);
      return null;
    }
    return v;
  }

  oneOf<T extends string>(name: string, values: readonly T[], opts: { label: string; fallback?: T }): T {
    const v = this.raw(name);
    if ((values as readonly string[]).includes(v)) return v as T;
    if (!v && opts.fallback) return opts.fallback;
    this.fail(name, `Choose a ${opts.label.toLowerCase()}.`);
    return opts.fallback ?? values[0];
  }

  optionalOneOf<T extends string>(name: string, values: readonly T[], opts: { label: string }): T | null {
    const v = this.raw(name);
    if (!v) return null;
    if ((values as readonly string[]).includes(v)) return v as T;
    this.fail(name, `Choose a ${opts.label.toLowerCase()}.`);
    return null;
  }

  bool(name: string): boolean {
    const v = this.raw(name);
    return v === "on" || v === "true" || v === "1" || v === "yes";
  }

  /** An optional id of a related record (validated against the workspace by the caller). */
  id(name: string, opts: { label: string; required?: boolean }): string | null {
    const v = this.raw(name);
    if (!v) {
      if (opts.required) this.fail(name, `Choose ${opts.label.toLowerCase()}.`);
      return null;
    }
    if (!isUuid(v)) {
      this.fail(name, `Choose ${opts.label.toLowerCase()}.`);
      return null;
    }
    return v.toLowerCase();
  }

  ids(name: string): string[] {
    return [...new Set(this.form.getAll(name).filter(isUuid).map((v) => v.toLowerCase()))];
  }

  currency(name: string, fallback: string): string {
    const v = this.raw(name).toUpperCase() || fallback;
    if (!isCurrencyCode(v)) {
      this.fail(name, "Choose a valid currency code (e.g. USD).");
      return fallback;
    }
    return v;
  }

  /** Reminder windows like "30, 14, 7" → [30, 14, 7]. */
  dayList(name: string, opts: { label: string }): number[] | null {
    const v = this.raw(name);
    if (!v) return null;
    const parts = v.split(/[\s,]+/).filter(Boolean);
    const nums = parts.map(Number);
    if (nums.some((n) => !Number.isInteger(n) || n < 1 || n > 365) || nums.length > 6) {
      this.fail(name, `${opts.label} must be up to 6 whole numbers between 1 and 365, e.g. 30, 14, 7.`);
      return null;
    }
    return [...new Set(nums)].sort((a, b) => b - a);
  }

  paymentMethod(name: string): string | null {
    const v = this.text(name, { label: "Payment method", max: 60 });
    if (v && CARD_LIKE.test(v)) {
      this.fail(name, "Don't enter a card number — a label like “Company Visa ••4242” is enough.");
      return null;
    }
    return v;
  }

  idempotencyKey(name = "idempotencyKey"): string | null {
    const v = this.raw(name);
    return /^[A-Za-z0-9_-]{16,64}$/.test(v) ? v : null;
  }
}

export function stateFromErrors(r: FormReader, error = "Check the highlighted fields."): FormState {
  return { error, fieldErrors: r.errors };
}
