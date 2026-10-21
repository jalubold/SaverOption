import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/** Anonymous random id tying funnel steps from one browser together. Not linked to a person. */
export const FUNNEL_COOKIE = "so_fid";

export async function readFunnelSession(): Promise<string | null> {
  const v = (await cookies()).get(FUNNEL_COOKIE)?.value;
  return v && /^[A-Za-z0-9_-]{16,32}$/.test(v) ? v : null;
}

/** Returns the session id, creating it if needed. Only in server actions and route handlers. */
export async function ensureFunnelSession(): Promise<string> {
  const existing = await readFunnelSession();
  if (existing) return existing;
  const id = randomBytes(12).toString("base64url");
  (await cookies()).set(FUNNEL_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  return id;
}
