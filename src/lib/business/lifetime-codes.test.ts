// Unit tests for reading and normalizing lifetime (AppSumo) codes. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { codeHint, MAX_CODES_PER_IMPORT, normalizeCode, parseCodeList } from "./lifetime-codes.ts";

test("normalizeCode trims, unquotes and upper-cases; rejects anything AppSumo wouldn't accept", () => {
  assert.equal(normalizeCode("  sob-we9b-8pdd-5h7d "), "SOB-WE9B-8PDD-5H7D");
  assert.equal(normalizeCode('"SOB-AAAA-BBBB-CCCC"'), "SOB-AAAA-BBBB-CCCC");
  assert.equal(normalizeCode("abc_123"), "ABC_123");
  assert.equal(normalizeCode("ab"), null);
  assert.equal(normalizeCode("SOB WE9B"), null);
  assert.equal(normalizeCode("SOB-WE9B;drop"), null);
  assert.equal(normalizeCode("x".repeat(201)), null);
  assert.equal(normalizeCode(""), null);
  assert.equal(normalizeCode(null), null);
  assert.equal(codeHint("SOB-WE9B-8PDD-5H7D"), "5H7D");
});

test("parseCodeList reads plain lists and CSVs, with or without a header", () => {
  const plain = parseCodeList("SOB-AAAA-AAAA-AAAA\nSOB-BBBB-BBBB-BBBB\r\n\nsob-aaaa-aaaa-aaaa\nnot a code\n");
  assert.deepEqual(plain.codes, ["SOB-AAAA-AAAA-AAAA", "SOB-BBBB-BBBB-BBBB"]);
  assert.equal(plain.duplicates, 1);
  assert.equal(plain.invalid, 1);
  assert.equal(plain.header, false);

  const csv = parseCodeList("﻿code,plan\n\"SOB-CCCC-CCCC-CCCC\",1\nSOB-DDDD-DDDD-DDDD;x\n");
  assert.deepEqual(csv.codes, ["SOB-CCCC-CCCC-CCCC", "SOB-DDDD-DDDD-DDDD"]);
  assert.equal(csv.header, true);
  assert.equal(csv.invalid, 0);

  // "CODE" is only a header on the first line; later it's an ordinary (valid) code.
  assert.deepEqual(parseCodeList("SOB-EEEE\ncode").codes, ["SOB-EEEE", "CODE"]);
});

test("parseCodeList stops at the import limit", () => {
  const many = Array.from({ length: MAX_CODES_PER_IMPORT + 5 }, (_, i) => `SOB-${String(i).padStart(8, "0")}`).join("\n");
  const r = parseCodeList(many);
  assert.equal(r.codes.length, MAX_CODES_PER_IMPORT);
  assert.equal(r.truncated, true);
});
