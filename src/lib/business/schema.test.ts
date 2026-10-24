import { test } from "node:test";
import assert from "node:assert/strict";
import { validateArgs, type ObjectSchema } from "./schema.ts";

const schema: ObjectSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 10 },
    kind: { type: "string", enum: ["a", "b"] },
    id: { type: "string", format: "uuid" },
    on: { type: "string", format: "date" },
    limit: { type: "integer", minimum: 1, maximum: 50 },
    flag: { type: "boolean" },
    tags: { type: "array", items: { type: "string", maxLength: 3 }, maxItems: 2 },
  },
};

test("accepts valid input and drops nulls", () => {
  const r = validateArgs(schema, { name: "Figma", kind: "a", limit: 5, flag: false, tags: ["x"], on: "2026-02-28", id: "2f1b6a4e-1c2d-4e5f-8a9b-0c1d2e3f4a5b" });
  assert.equal(r.ok, true);
  const ok = validateArgs(schema, { name: "Figma", kind: null, limit: 5 });
  assert.deepEqual(ok, { ok: true, value: { name: "Figma", limit: 5 } });
});

test("reports each problem", () => {
  const r = validateArgs(schema, { kind: "c", limit: 0.5, id: "nope", on: "2026-02-30", tags: ["toolong", "a", "b"], flag: "yes" });
  assert.equal(r.ok, false);
  if (r.ok) return;
  const text = r.errors.join(" | ");
  for (const part of ["name is required", "kind must be one of", "limit must be a whole number", "limit must be at least 1", "id must be an ID", "on must be a date", "tags must have at most 2", "tags[0] must be at most 3", "flag must be true or false"]) {
    assert.ok(text.includes(part), `missing "${part}" in ${text}`);
  }
});

test("rejects unknown fields and non-objects", () => {
  assert.equal(validateArgs(schema, { name: "x", sql: "drop table" }).ok, false);
  assert.equal(validateArgs(schema, "name=x").ok, false);
  assert.equal(validateArgs(schema, [1]).ok, false);
});

test("missing arguments are an empty object", () => {
  const r = validateArgs({ type: "object", properties: {}, additionalProperties: false }, undefined);
  assert.deepEqual(r, { ok: true, value: {} });
});
