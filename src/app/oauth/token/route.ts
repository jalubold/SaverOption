import { businessReady } from "@/lib/server/business/context";
import { json, oauthError, preflight, readForm } from "@/lib/server/mcp/http";
import { authenticateClient, exchangeCode, OAuthError, refreshTokens, serverUrls } from "@/lib/server/mcp/oauth";
import { clientIp, rateLimit } from "@/lib/server/mcp/rate-limit";

/** Token endpoint: authorization_code (with PKCE) and rotating refresh_token grants. */
export async function POST(req: Request) {
  try {
    if (!businessReady()) throw new OAuthError("temporarily_unavailable", "Saver Option Business isn't available right now.", 503);
    const limit = await rateLimit(`oauth-token:${clientIp(req.headers)}`, 60, 60);
    if (!limit.ok) return json({ error: "temporarily_unavailable", error_description: "Too many requests. Try again shortly." }, 429, { "Retry-After": String(limit.retryAfter) });
    const form = await readForm(req);
    const client = await authenticateClient(form, req.headers.get("authorization"));
    const grant = form.get("grant_type");
    const urls = serverUrls(req.url);
    if (grant === "authorization_code") return json(await exchangeCode(client, form, urls), 200, { Pragma: "no-cache" });
    if (grant === "refresh_token") return json(await refreshTokens(client, form), 200, { Pragma: "no-cache" });
    throw new OAuthError("unsupported_grant_type", "Only authorization_code and refresh_token are supported.");
  } catch (err) {
    return oauthError(err);
  }
}

export const OPTIONS = preflight;
