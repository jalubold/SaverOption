import { businessReady } from "@/lib/server/business/context";
import { corsHeaders, json, preflight } from "@/lib/server/mcp/http";
import { handleMcpPost } from "@/lib/server/mcp/server";

/** Saver Option Business remote MCP server (Streamable HTTP). See /business/docs/mcp. */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  if (!businessReady()) return json({ jsonrpc: "2.0", id: null, error: { code: -32002, message: "Saver Option Business isn't available right now." } }, 503);
  try {
    return await handleMcpPost(req);
  } catch (err) {
    console.error("[mcp] request failed:", err instanceof Error ? err.message : err);
    return json({ jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal error. Try again." } }, 500);
  }
}

/** No server-initiated event stream is offered; clients use POST only. */
export function GET() {
  return new Response("Method not allowed. This MCP endpoint accepts POST (Streamable HTTP, JSON responses).", { status: 405, headers: { Allow: "POST, OPTIONS", ...corsHeaders } });
}

export function DELETE() {
  return new Response(null, { status: 405, headers: { Allow: "POST, OPTIONS", ...corsHeaders } });
}

export const OPTIONS = preflight;
