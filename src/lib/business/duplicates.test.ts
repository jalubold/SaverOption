// Unit tests for the potential-duplicate rules. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import { findPotentialDuplicates, type DuplicateCandidate } from "./duplicates.ts";

const sw = (over: Partial<DuplicateCandidate> & { id: string; name: string }): DuplicateCandidate => ({
  vendorId: null,
  category: "other",
  website: null,
  status: "active",
  ...over,
});

test("same vendor and category is a potential duplicate", () => {
  const pairs = findPotentialDuplicates([
    sw({ id: "1", name: "Teams", vendorId: "ms", category: "communication" }),
    sw({ id: "2", name: "Skype for Business", vendorId: "ms", category: "communication" }),
    sw({ id: "3", name: "Outlook", vendorId: "ms", category: "productivity" }),
  ]);
  assert.equal(pairs.length, 1);
  assert.deepEqual([pairs[0].a.id, pairs[0].b.id], ["1", "2"]);
  assert.match(pairs[0].reasons[0], /Same vendor and category/);
});

test("one name containing the other, as whole words", () => {
  const pairs = findPotentialDuplicates([sw({ id: "1", name: "Zoom" }), sw({ id: "2", name: "Zoom Workplace" }), sw({ id: "3", name: "Zoomerang" })]);
  assert.equal(pairs.length, 1);
  assert.match(pairs[0].reasons[0], /Similar names/);
});

test("very short names don't match on fragments", () => {
  assert.equal(findPotentialDuplicates([sw({ id: "1", name: "Go" }), sw({ id: "2", name: "Go Daddy" })]).length, 0);
});

test("same website host, ignoring www", () => {
  const pairs = findPotentialDuplicates([
    sw({ id: "1", name: "Atlassian Jira", website: "https://www.atlassian.com/software/jira" }),
    sw({ id: "2", name: "Confluence", website: "https://atlassian.com/software/confluence" }),
  ]);
  assert.equal(pairs.length, 1);
  assert.match(pairs[0].reasons[0], /Same website \(atlassian\.com\)/);
});

test("archived records are ignored", () => {
  assert.equal(findPotentialDuplicates([sw({ id: "1", name: "Slack" }), sw({ id: "2", name: "Slack Pro", status: "archived" })]).length, 0);
});
