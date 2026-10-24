import { headers } from "next/headers";
import { serverUrls, type AuthRequest, type ServerUrls } from "@/lib/server/mcp/oauth";

/**
 * The authorization request waiting for the person's decision. It's kept in a
 * short-lived, HttpOnly cookie scoped to /business/oauth while they sign in,
 * and re-validated against the client's registration before anything is issued.
 */
export const PENDING_COOKIE = "so_oauth_req";
export const PENDING_MAX_AGE = 10 * 60;

export function encodePending(req: AuthRequest): string {
  return Buffer.from(JSON.stringify(req)).toString("base64url");
}

/** Back to the parameter names parseAuthRequest reads. */
export function decodePending(raw: string | undefined): Record<string, string | null> | null {
  if (!raw || raw.length > 4000) return null;
  try {
    const r = JSON.parse(Buffer.from(raw, "base64url").toString()) as Partial<AuthRequest>;
    if (typeof r.clientId !== "string" || typeof r.redirectUri !== "string" || typeof r.codeChallenge !== "string" || !Array.isArray(r.scopes)) return null;
    return {
      client_id: r.clientId,
      redirect_uri: r.redirectUri,
      state: typeof r.state === "string" ? r.state : null,
      response_type: "code",
      code_challenge: r.codeChallenge,
      code_challenge_method: "S256",
      scope: r.scopes.filter((s): s is string => typeof s === "string").join(" "),
      resource: typeof r.resource === "string" ? r.resource : null,
    };
  } catch {
    return null;
  }
}

export const pendingCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/business/oauth",
  maxAge: PENDING_MAX_AGE,
};

/** Server URLs for the current request inside pages and server actions. */
export async function urlsFromHeaders(): Promise<ServerUrls> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.saveroption.com";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return serverUrls(`${proto}://${host}/`);
}
