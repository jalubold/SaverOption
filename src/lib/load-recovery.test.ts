// Unit tests for recovering from pages whose code couldn't be downloaded. Run: npm test
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { isLoadError, recoverWithFullLoad, rememberNavigation } from "./load-recovery.ts";

type Nav = { assigned: string | null; reloaded: number };
let nav: Nav;
const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  nav = { assigned: null, reloaded: 0 };
  Object.assign(globalThis, {
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
    location: {
      pathname: "/",
      search: "",
      hash: "",
      assign: (href: string) => void (nav.assigned = href),
      reload: () => void nav.reloaded++,
    },
  });
});

test("recognizes the errors browsers and the bundler give for code that couldn't be downloaded", () => {
  assert.equal(isLoadError(Object.assign(new Error("Failed to load chunk /_next/static/chunks/a.js from module 1"), { name: "ChunkLoadError" })), true);
  assert.equal(isLoadError(new TypeError("Failed to fetch dynamically imported module: https://x/_next/a.js")), true);
  assert.equal(isLoadError(new TypeError("Importing a module script failed.")), true);
  assert.equal(isLoadError(new Error("Loading chunk 123 failed.")), true);
  assert.equal(isLoadError(new TypeError("Cannot read properties of undefined (reading 'x')")), false);
  assert.equal(isLoadError(null), false);
});

test("opens the link that was just followed with a full page load", () => {
  rememberNavigation("/business/dashboard");
  assert.equal(recoverWithFullLoad(), true);
  assert.equal(nav.assigned, "/business/dashboard");
});

test("without a recent link, reloads the current page", () => {
  store.set("so-last-nav", JSON.stringify({ href: "/business/dashboard", at: Date.now() - 60_000 }));
  assert.equal(recoverWithFullLoad(), true);
  assert.equal(nav.assigned, null);
  assert.equal(nav.reloaded, 1);
});

test("tries once per page per minute, so an error a reload doesn't fix shows its screen instead of looping", () => {
  rememberNavigation("/business/dashboard");
  assert.equal(recoverWithFullLoad(), true);
  rememberNavigation("/business/dashboard");
  assert.equal(recoverWithFullLoad(), false);
  assert.equal(nav.assigned, "/business/dashboard");
  rememberNavigation("/business/renewals");
  assert.equal(recoverWithFullLoad(), true, "another page can still recover");
  assert.equal(nav.assigned, "/business/renewals");
});

test("storage being unavailable doesn't throw", () => {
  Object.assign(globalThis, { sessionStorage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} } });
  rememberNavigation("/x");
  assert.equal(recoverWithFullLoad(), false);
});
