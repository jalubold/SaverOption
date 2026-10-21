import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Claim tokens link a submission to whoever started it — first the browser that
 * filled in the form (httpOnly cookie), and after payment the buyer's receipt
 * email (link from Lemon Squeezy). Only a sha256 hash is stored; a token works
 * once and expires.
 */

export const CLAIM_COOKIE = "so_claim";
export const CLAIM_TTL_DAYS = 7;

export function newClaimToken(): { token: string; hash: string; expiresAt: Date } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashClaimToken(token), expiresAt: new Date(Date.now() + CLAIM_TTL_DAYS * 86400_000) };
}

export function hashClaimToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function claimTokenMatches(token: string, storedHash: string | null): boolean {
  if (!storedHash || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const a = Buffer.from(hashClaimToken(token), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseClaim(value: string | undefined | null): { submissionId: string; token: string } | null {
  if (!value) return null;
  const [submissionId, token] = value.split(".");
  return submissionId && token && UUID.test(submissionId) ? { submissionId: submissionId.toLowerCase(), token } : null;
}

export async function readClaimCookie() {
  return parseClaim((await cookies()).get(CLAIM_COOKIE)?.value);
}

/** Only callable from server actions and route handlers (where cookies are writable). */
export async function writeClaimCookie(submissionId: string, token: string) {
  (await cookies()).set(CLAIM_COOKIE, `${submissionId}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CLAIM_TTL_DAYS * 86400,
  });
}

export async function clearClaimCookie() {
  (await cookies()).delete(CLAIM_COOKIE);
}
