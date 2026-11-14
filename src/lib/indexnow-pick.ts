import { createHash } from "node:crypto";

/**
 * Which URLs to tell IndexNow about after a deployment: only the ones that are new or changed
 * since the last submission, decided per URL. Kept free of the database so it can be unit-tested.
 */

export interface IndexNowCandidate {
  url: string;
  /** When the page last changed (YYYY-MM-DD), if known. */
  lastModified?: string;
}

/** A short fingerprint of a URL as submitted: the URL and the date it last changed. */
export function indexNowKey(u: IndexNowCandidate): string {
  return createHash("sha1").update(`${u.url}|${u.lastModified ?? ""}`).digest("hex").slice(0, 12);
}

/**
 * - `sent`: the fingerprints stored after the last successful submission. A URL goes out when its
 *   fingerprint isn't there: it's new, or its lastModified moved. List pages (/deals, categories,
 *   collections…) carry the newest date of their deals, so they go out exactly when a deal in them
 *   changes, not on every deployment.
 * - Without stored fingerprints yet (the first deployment with this logic), the previous rule
 *   decides once: everything changed on or after the last submission's date (`lastDate`), or
 *   everything when nothing was ever submitted.
 */
export function pickIndexNowUrls(all: IndexNowCandidate[], { sent, lastDate }: { sent: Set<string> | null; lastDate?: string }): string[] {
  const changed = sent
    ? all.filter((u) => !sent.has(indexNowKey(u)))
    : all.filter((u) => !lastDate || (u.lastModified !== undefined && u.lastModified >= lastDate));
  return changed.map((u) => u.url);
}

/** How the fingerprints are stored (one settings value). */
export function serializeSent(all: IndexNowCandidate[]): string {
  return [...new Set(all.map(indexNowKey))].sort().join(" ");
}

export function parseSent(value: string | null | undefined): Set<string> | null {
  return value ? new Set(value.split(" ").filter(Boolean)) : null;
}
