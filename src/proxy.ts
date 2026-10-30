import { createServerClient } from "@supabase/ssr";
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
  // The public Business pages (landing, AI & MCP, download, docs) are prerendered and need no session:
  // skipping the Supabase round trip keeps navigating to them instant.
  if (PUBLIC_BUSINESS.test(request.nextUrl.pathname)) return NextResponse.next();
  // Business pages read the requested path to send signed-out visitors back after sign-in.
  if (request.nextUrl.pathname.startsWith("/business")) {
    request.headers.set("x-so-path", (request.nextUrl.pathname + request.nextUrl.search).slice(0, 300));
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
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
const PUBLIC_BUSINESS = /^\/business(?:\/mcp|\/download(?:\/mac)?|\/docs(?:\/[^/]+)*)?\/?$/;

export const config = {
  matcher: ["/stats", "/dashboard/:path*", "/admin/:path*", "/claim", "/login", "/signup", "/promote/:path*", "/business/:path*"],
};
