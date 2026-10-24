import { json, preflight } from "@/lib/server/mcp/http";
import { protectedResourceMetadata, serverUrls } from "@/lib/server/mcp/oauth";

/** RFC 9728 protected resource metadata for the MCP endpoint (also served at …/mcp). */
export function GET(req: Request) {
  return json(protectedResourceMetadata(serverUrls(req.url)), 200, { "Cache-Control": "public, max-age=300" });
}

export const OPTIONS = preflight;
