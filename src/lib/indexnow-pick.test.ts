// Unit tests for choosing which URLs IndexNow is told about. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { indexNowKey, parseSent, pickIndexNowUrls, serializeSent, type IndexNowCandidate } from "./indexnow-pick.ts";

const site: IndexNowCandidate[] = [
  { url: "https://x.test/", lastModified: "2026-11-10" },
  { url: "https://x.test/deals", lastModified: "2026-11-10" },
  { url: "https://x.test/categories/ai-tools", lastModified: "2026-11-02" },
  { url: "https://x.test/deals/a", lastModified: "2026-11-10" },
  { url: "https://x.test/deals/b", lastModified: "2026-10-20" },
  { url: "https://x.test/about" },
];

test("nothing changed since the last submission: nothing is sent (not even list pages)", () => {
  const sent = parseSent(serializeSent(site));
  assert.deepEqual(pickIndexNowUrls(site, { sent, lastDate: "2026-11-10" }), []);
});

test("a deal that changed goes out with the list pages whose date moved, and nothing else", () => {
  const sent = parseSent(serializeSent(site));
  const next = site.map((u) =>
    u.url.endsWith("/deals/b") || u.url.endsWith("/categories/ai-tools") || u.url === "https://x.test/" || u.url.endsWith("/deals")
      ? { ...u, lastModified: "2026-11-14" }
      : u,
  );
  assert.deepEqual(pickIndexNowUrls(next, { sent, lastDate: "2026-11-10" }), [
    "https://x.test/",
    "https://x.test/deals",
    "https://x.test/categories/ai-tools",
    "https://x.test/deals/b",
  ]);
});

test("a new deal goes out even when its date is older than the last submission", () => {
  const sent = parseSent(serializeSent(site));
  const next = [...site, { url: "https://x.test/deals/new", lastModified: "2026-10-01" }];
  assert.deepEqual(pickIndexNowUrls(next, { sent, lastDate: "2026-11-10" }), ["https://x.test/deals/new"]);
});

test("a second deployment the same day doesn't send the same changes again", () => {
  // The old rule (lastModified >= the last submission's date) resent today's changes on every deployment.
  const sent = parseSent(serializeSent(site));
  assert.deepEqual(pickIndexNowUrls(site, { sent, lastDate: "2026-11-10" }), []);
});

test("first run with this logic: the previous date rule decides once; never submitted sends everything", () => {
  assert.deepEqual(pickIndexNowUrls(site, { sent: null, lastDate: "2026-11-10" }), ["https://x.test/", "https://x.test/deals", "https://x.test/deals/a"]);
  assert.equal(pickIndexNowUrls(site, { sent: null }).length, site.length);
});

test("fingerprints are short, stable and change with the date", () => {
  const k = indexNowKey(site[3]);
  assert.match(k, /^[0-9a-f]{12}$/);
  assert.equal(k, indexNowKey({ ...site[3] }));
  assert.notEqual(k, indexNowKey({ ...site[3], lastModified: "2026-11-11" }));
  assert.equal(parseSent(""), null);
  assert.equal(parseSent(serializeSent(site))?.size, site.length);
});
