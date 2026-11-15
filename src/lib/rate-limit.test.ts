// Unit tests for the request limits (Upstash calls are stubbed). Run: npm test
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { clientKey, overLimit } from "./rate-limit.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

function fakeRedis() {
  const counts = new Map<string, number>();
  const seen: string[] = [];
  globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
    const commands = JSON.parse(String(init?.body)) as (string | number)[][];
    const out = commands.map(([cmd, key]) => {
      if (cmd === "INCR") {
        seen.push(String(key));
        const n = (counts.get(String(key)) ?? 0) + 1;
        counts.set(String(key), n);
        return { result: n };
      }
      return { result: 1 };
    });
    return new Response(JSON.stringify(out), { status: 200 });
  }) as typeof fetch;
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
  return seen;
}

test("allows up to the limit in a window, then limits; a new window starts over", async () => {
  fakeRedis();
  const t = Date.UTC(2026, 10, 15, 10, 0, 5);
  for (let i = 0; i < 3; i++) assert.equal(await overLimit("k", 3, 600, t), false);
  assert.equal(await overLimit("k", 3, 600, t), true);
  assert.equal(await overLimit("k", 3, 600, t + 600_000), false);
});

test("separate keys have separate counters", async () => {
  const seen = fakeRedis();
  await overLimit("stats:view:a", 1, 600);
  assert.equal(await overLimit("stats:view:b", 1, 600), false);
  assert.ok(seen.every((k) => k.startsWith("rl:stats:view:")));
});

test("fails open: no Redis configured, or Redis unreachable", async () => {
  assert.equal(await overLimit("k", 0, 600), false);
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
  globalThis.fetch = (async () => {
    throw new Error("down");
  }) as typeof fetch;
  assert.equal(await overLimit("k", 0, 600), false);
});

test("the client key is a short hash, never the IP itself", () => {
  const k = clientKey("203.0.113.7, 10.0.0.1", null);
  assert.match(k, /^[0-9a-f]{16}$/);
  assert.ok(!k.includes("203"));
  assert.equal(k, clientKey("203.0.113.7", null));
  assert.notEqual(k, clientKey("203.0.113.8", null));
  assert.equal(clientKey(null, "198.51.100.2"), clientKey("198.51.100.2", null));
});
