/**
 * A small, strict subset of JSON Schema for MCP tool inputs. The same objects
 * are published to clients as `inputSchema` and used to validate every call on
 * the server, so what a client is told and what the server accepts can't drift.
 *
 * Supported: object (properties, required, additionalProperties: false),
 * string (enum, minLength, maxLength, pattern, format date|uuid), integer and
 * number (minimum, maximum), boolean, array (items, minItems, maxItems).
 */

export type Schema = StringSchema | NumberSchema | BooleanSchema | ArraySchema | ObjectSchema;

interface Base {
  description?: string;
}
export interface StringSchema extends Base {
  type: "string";
  enum?: readonly string[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: "date" | "uuid";
}
export interface NumberSchema extends Base {
  type: "integer" | "number";
  minimum?: number;
  maximum?: number;
}
export interface BooleanSchema extends Base {
  type: "boolean";
}
export interface ArraySchema extends Base {
  type: "array";
  items: Schema;
  minItems?: number;
  maxItems?: number;
}
export interface ObjectSchema extends Base {
  type: "object";
  properties: Record<string, Schema>;
  required?: readonly string[];
  additionalProperties?: false;
}

export type Validation = { ok: true; value: Record<string, unknown> } | { ok: false; errors: string[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function validDate(s: string): boolean {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function check(schema: Schema, value: unknown, path: string, errors: string[]): void {
  const at = path || "input";
  switch (schema.type) {
    case "string": {
      if (typeof value !== "string") return void errors.push(`${at} must be a string.`);
      if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${at} must be at least ${schema.minLength} characters.`);
      if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${at} must be at most ${schema.maxLength} characters.`);
      if (schema.enum && !schema.enum.includes(value)) errors.push(`${at} must be one of: ${schema.enum.join(", ")}.`);
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${at} has an invalid format.`);
      if (schema.format === "uuid" && !UUID.test(value)) errors.push(`${at} must be an ID (UUID).`);
      if (schema.format === "date" && !validDate(value)) errors.push(`${at} must be a date as YYYY-MM-DD.`);
      return;
    }
    case "integer":
    case "number": {
      if (typeof value !== "number" || !Number.isFinite(value)) return void errors.push(`${at} must be a number.`);
      if (schema.type === "integer" && !Number.isInteger(value)) errors.push(`${at} must be a whole number.`);
      if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${at} must be at least ${schema.minimum}.`);
      if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${at} must be at most ${schema.maximum}.`);
      return;
    }
    case "boolean":
      if (typeof value !== "boolean") errors.push(`${at} must be true or false.`);
      return;
    case "array": {
      if (!Array.isArray(value)) return void errors.push(`${at} must be a list.`);
      if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${at} must have at least ${schema.minItems} items.`);
      if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${at} must have at most ${schema.maxItems} items.`);
      value.forEach((v, i) => check(schema.items, v, `${at}[${i}]`, errors));
      return;
    }
    case "object": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) return void errors.push(`${at} must be an object.`);
      const obj = value as Record<string, unknown>;
      for (const key of schema.required ?? []) if (obj[key] === undefined || obj[key] === null) errors.push(`${path ? `${path}.` : ""}${key} is required.`);
      for (const [key, v] of Object.entries(obj)) {
        const sub = schema.properties[key];
        if (!sub) {
          if (schema.additionalProperties === false) errors.push(`${path ? `${path}.` : ""}${key} isn't a supported field.`);
          continue;
        }
        // null means "not given" for optional fields.
        if (v === null && !(schema.required ?? []).includes(key)) continue;
        check(sub, v, path ? `${path}.${key}` : key, errors);
      }
      return;
    }
  }
}

/** Validates tool arguments against an object schema. Missing arguments are treated as {}. */
export function validateArgs(schema: ObjectSchema, value: unknown): Validation {
  const input = value === undefined || value === null ? {} : value;
  const errors: string[] = [];
  check(schema, input, "", errors);
  if (errors.length) return { ok: false, errors: errors.slice(0, 20) };
  // Drop nulls so handlers see optional fields as undefined.
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) if (v !== null) out[k] = v;
  return { ok: true, value: out };
}
