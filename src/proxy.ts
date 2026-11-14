import { createServerClient } from "@supabase/ssr";
import { cookieOptionsFor, supabasePublicConfig } from "@/lib/supabase-config";
import { NextResponse, type NextRequest } from "next/server";
import { DIMENSIONS } from "@/lib/web-analytics";

/**
 * Keeps Supabase sessions fresh on the pages that use accounts: an expired
 * access token is refreshed here, where cookies can be written, before the page
 * renders. Every other route skips this entirely.
 *
 * It also redirects /stats links with a range or filter (shared before those moved) to
 * /stats/view, so plain /stats can be prerendered.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/stats") {
    if (!STATS_PARAMS.some((p) => request.nextUrl.searchParams.has(p))) return NextResponse.next();
    const to = request.nextUrl.clone();
    to.pathname = "/stats/view";
    return NextResponse.redirect(to, 308);
  }
  // The public Business pages (landing, AI & MCP, download, docs, software deals) are prerendered and need no session:
  // skipping the Supabase round trip keeps navigating to them instant.
  if (PUBLIC_BUSINESS.test(request.nextUrl.pathname)) return NextResponse.next();
  // Business pages read the requested path to send signed-out visitors back after sign-in.
  if (request.nextUrl.pathname.startsWith("/business")) {
    request.headers.set("x-so-path", (request.nextUrl.pathname + request.nextUrl.search).slice(0, 300));
  }
  const cfg = supabasePublicConfig();
  if (!cfg) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(cfg.url, cfg.key, {
    ...cookieOptionsFor(cfg),
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
        for (const [k, v] of Object.entries(headers ?? {})) response.headers.set(k, v);
      },
    },
  });
  // Refresh only: getSession reads the cookie and calls Supabase just when the access token is
  // about to expire (writing the new one back above). Pages verify the user with getUser, so a
  // second Auth round trip here on every navigation and prefetch isn't needed.
  await supabase.auth.getSession();
  return response;
}

const STATS_PARAMS = ["range", ...Object.values(DIMENSIONS).map((d) => d.param)];
// Kept as a second check: the matcher below already leaves these paths out.
const PUBLIC_BUSINESS = /^\/business(?:\/mcp|\/download(?:\/mac)?|\/docs(?:\/[^/]+)*|\/software-deals(?:\/[^/]+)?)?\/?$/;

export const config = {
  matcher: [
    "/stats",
    "/dashboard/:path*",
    "/admin/:path*",
    "/claim",
    "/login",
    "/signup",
    "/promote/:path*",
    // Every Business page except the public ones (the landing page /business itself, AI & MCP,
    // download, docs and the software deals with their share images). Those are cached pages that
    // need no session, and leaving them out of the matcher means the proxy function doesn't run
    // before each of them at all. The lookahead stops at a segment boundary ("/", the ".rsc" of a
    // client navigation, or the end), so the signed-in /business/software pages still go through it.
    "/business/((?!mcp(?:/|\\.|$)|download(?:/|\\.|$)|docs(?:/|\\.|$)|software-deals(?:/|\\.|$)).*)",
  ],
};
