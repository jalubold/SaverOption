import { NextResponse, type NextRequest } from "next/server";
import { businessReady } from "@/lib/server/business/context";
import { parseAuthRequest, serverUrls } from "@/lib/server/mcp/oauth";
import { encodePending, PENDING_COOKIE, pendingCookieOptions } from "@/lib/server/mcp/pending";

/**
 * OAuth authorization endpoint for MCP clients. Validates the request, then
 * hands over to the consent page (signing in with Google first if needed).
 */
export async function GET(req: NextRequest) {
  const urls = serverUrls(req.url);
  const consent = new URL("/business/oauth/consent", urls.origin);
  if (!businessReady()) {
    consent.searchParams.set("error", "unavailable");
    return NextResponse.redirect(consent, 303);
  }
  const parsed = await parseAuthRequest(req.nextUrl.searchParams, urls);
  if (!parsed.ok) {
    if (parsed.redirect) return NextResponse.redirect(parsed.redirect, 303);
    consent.searchParams.set("error", "request");
    return NextResponse.redirect(consent, 303);
  }
  const res = NextResponse.redirect(consent, 303);
  res.cookies.set(PENDING_COOKIE, encodePending(parsed.req), pendingCookieOptions);
  return res;
}
