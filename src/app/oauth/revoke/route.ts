import { businessReady } from "@/lib/server/business/context";
import { corsHeaders, oauthError, preflight, readForm } from "@/lib/server/mcp/http";
import { authenticateClient, OAuthError, revokeToken } from "@/lib/server/mcp/oauth";

/** RFC 7009 revocation: revoking an access or refresh token ends the whole connection. */
export async function POST(req: Request) {
  try {
    if (!businessReady()) throw new OAuthError("temporarily_unavailable", "Saver Option Business isn't available right now.", 503);
    const form = await readForm(req);
    const client = await authenticateClient(form, req.headers.get("authorization"));
    const value = form.get("token");
    if (!value) throw new OAuthError("invalid_request", "token is required.");
    await revokeToken(client, value);
    return new Response(null, { status: 200, headers: { "Cache-Control": "no-store", ...corsHeaders } });
  } catch (err) {
    return oauthError(err);
  }
}

export const OPTIONS = preflight;
