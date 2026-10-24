import assert from "node:assert/strict";
import { test } from "node:test";
import { convertedParts, convertTotals, fxRate, parseEcbDaily, rateText } from "./fx.ts";

const ecb = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
  <gesmes:subject>Reference rates</gesmes:subject>
  <gesmes:Sender><gesmes:name>European Central Bank</gesmes:name></gesmes:Sender>
  <Cube>
    <Cube time='2026-10-23'>
      <Cube currency='USD' rate='1.0800'/>
      <Cube currency='JPY' rate='160.00'/>
      <Cube currency='GBP' rate='0.8500'/>
      <Cube currency='IDR' rate='17500.00'/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

test("parses the ECB daily file (single or double quotes)", () => {
  const fx = parseEcbDaily(ecb);
  assert.equal(fx?.date, "2026-10-23");
  assert.equal(fx?.perEur.EUR, 1);
  assert.equal(fx?.perEur.USD, 1.08);
  assert.deepEqual(parseEcbDaily(ecb.replaceAll("'", '"'))?.perEur, fx?.perEur);
  assert.equal(parseEcbDaily("<html>maintenance</html>"), null);
});

test("cross rates go through the euro", () => {
  const fx = parseEcbDaily(ecb)!;
  assert.equal(fxRate(fx, "EUR", "USD"), 1.08);
  assert.ok(Math.abs(fxRate(fx, "GBP", "USD")! - 1.08 / 0.85) < 1e-12);
  assert.equal(fxRate(fx, "USD", "XYZ"), null);
});

test("converts other currencies into the target, respecting minor units", () => {
  const fx = parseEcbDaily(ecb)!;
  const c = convertTotals({ USD: 353_078, EUR: 9_900 }, "USD", fx)!;
  assert.equal(c.amount, 353_078 + 10_692); // €99.00 × 1.08 = $106.92
  assert.deepEqual(c.converted, [{ currency: "EUR", amount: 9_900, rate: 1.08 }]);
  assert.equal(convertedParts(c), "€99.00");
  assert.equal(rateText(c), "€1 = $1.08");
  // JPY has no minor unit: ¥16,000 = €100 = $108.00
  assert.equal(convertTotals({ JPY: 16_000 }, "USD", fx)!.amount, 10_800);
  // Into a currency with a large rate: $100 → about Rp 1.6 million
  const idr = convertTotals({ USD: 10_000 }, "IDR", fx)!;
  assert.equal(idr.currency, "IDR");
  assert.ok(idr.amount > 0);
});

test("no conversion when there's nothing to convert, no rates, or a rate is missing", () => {
  const fx = parseEcbDaily(ecb)!;
  assert.equal(convertTotals({ USD: 100 }, "USD", fx), null);
  assert.equal(convertTotals({ USD: 100, EUR: 0 }, "USD", fx), null);
  assert.equal(convertTotals({ USD: 100, EUR: 100 }, "USD", null), null);
  assert.equal(convertTotals({ USD: 100, XYZ: 100 }, "USD", fx), null);
});
