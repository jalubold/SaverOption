import { OAuthError } from "@/lib/server/mcp/oauth";

/** Shared response helpers for the MCP and OAuth endpoints (bearer-token APIs, so CORS can be open). */

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Protocol-Version, Mcp-Session-Id",
  "Access-Control-Max-Age": "600",
};

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...corsHeaders, ...headers },
  });
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function oauthError(err: unknown): Response {
  if (err instanceof OAuthError) {
    const headers: Record<string, string> = err.status === 401 ? { "WWW-Authenticate": `Basic realm="saveroption", error="${err.error}"` } : {};
    return json({ error: err.error, error_description: err.description }, err.status, headers);
  }
  console.error("[oauth] unexpected error:", err instanceof Error ? err.message : err);
  return json({ error: "server_error", error_description: "Something went wrong. Try again." }, 500);
}

/** OAuth endpoints accept form bodies (RFC 6749 §4.1.3); a JSON body is tolerated for lenient clients. */
export async function readForm(req: Request): Promise<URLSearchParams> {
  const type = req.headers.get("content-type") ?? "";
  const text = (await req.text()).slice(0, 20_000);
  if (type.includes("application/json")) {
    try {
      const obj = JSON.parse(text) as Record<string, unknown>;
      return new URLSearchParams(Object.entries(obj).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
    } catch {
      throw new OAuthError("invalid_request", "The request body isn't valid JSON.");
    }
  }
  return new URLSearchParams(text);
}
