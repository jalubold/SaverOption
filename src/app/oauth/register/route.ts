import { businessReady } from "@/lib/server/business/context";
import { json, oauthError, preflight } from "@/lib/server/mcp/http";
import { OAuthError, registerClient } from "@/lib/server/mcp/oauth";
import { clientIp, rateLimit } from "@/lib/server/mcp/rate-limit";

/** RFC 7591 dynamic client registration for MCP clients (Claude, ChatGPT and others register themselves). */
export async function POST(req: Request) {
  try {
    if (!businessReady()) throw new OAuthError("temporarily_unavailable", "Saver Option Business isn't available right now.", 503);
    const limit = await rateLimit(`oauth-register:${clientIp(req.headers)}`, 20, 3600);
    if (!limit.ok) return json({ error: "temporarily_unavailable", error_description: "Too many registrations. Try again later." }, 429, { "Retry-After": String(limit.retryAfter) });
    let body: unknown;
    try {
      body = JSON.parse((await req.text()).slice(0, 20_000));
    } catch {
      throw new OAuthError("invalid_client_metadata", "The registration request must be JSON.");
    }
    return json(await registerClient(body), 201);
  } catch (err) {
    return oauthError(err);
  }
}

export const OPTIONS = preflight;
