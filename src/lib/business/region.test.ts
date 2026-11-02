// Unit tests for the default currency suggested from a visitor's country. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { ECB_CURRENCIES, currencyForCountry } from "./region.ts";

const ecb = new Set(ECB_CURRENCIES);

test("countries map to their own currency when the app can convert it", () => {
  assert.equal(currencyForCountry("ID", ecb), "IDR");
  assert.equal(currencyForCountry("US", ecb), "USD");
  assert.equal(currencyForCountry("GB", ecb), "GBP");
  assert.equal(currencyForCountry("JP", ecb), "JPY");
  assert.equal(currencyForCountry("SG", ecb), "SGD");
});

test("euro-area countries get EUR", () => {
  for (const c of ["DE", "FR", "NL", "IE", "BG", "HR"]) assert.equal(currencyForCountry(c, ecb), "EUR");
});

test("a currency without an ECB rate falls back to USD", () => {
  assert.equal(currencyForCountry("AE", ecb), "USD");
  assert.equal(currencyForCountry("VN", ecb), "USD");
});

test("unknown or malformed countries suggest nothing", () => {
  assert.equal(currencyForCountry(null, ecb), null);
  assert.equal(currencyForCountry("XX", ecb), null);
  assert.equal(currencyForCountry("id", ecb), null);
  assert.equal(currencyForCountry("ZZZ", ecb), null);
});
