import { json, preflight } from "@/lib/server/mcp/http";
import { authorizationServerMetadata, serverUrls } from "@/lib/server/mcp/oauth";

/** RFC 8414 authorization server metadata for MCP clients. */
export function GET(req: Request) {
  return json(authorizationServerMetadata(serverUrls(req.url)), 200, { "Cache-Control": "public, max-age=300" });
}

export const OPTIONS = preflight;
