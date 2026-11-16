import { createServerClient } from "@supabase/ssr";
import { isAutomatedAgent } from "@/lib/bot-guard";
import { clientKey, overLimit } from "@/lib/rate-limit";
import { cookieOptionsFor, supabasePublicConfig } from "@/lib/supabase-config";
import { NextResponse, type NextRequest } from "next/server";
import { DIMENSIONS } from "@/lib/web-analytics";

/**
 * Keeps Supabase sessions fresh on the pages that use accounts: an expired
 * access token is refreshed here, where cookies can be written, before the page
 * renders. Every other route skips this entirely.
 *
 * It also redirects /stats links with a range or filter (shared before those moved) to
 * /stats/view, so plain /stats can be prerendered, and keeps bots and scrapers off the
 * filtered stats (see guardStats).
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/stats/view" || path === "/api/stats/breakdown") return guardStats(request, path !== "/stats/view");
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

/**
 * The filtered stats (/stats/view) and their breakdown API are rendered on every request and each
 * new filter combination calls the Vercel Analytics API, so a crawler walking the filter links
 * (they're nofollow and disallowed in robots.txt, which bad bots ignore) costs real CPU. Here:
 *  - automation that says so (crawlers, headless browsers, scraping libraries) goes to the
 *    prerendered /stats (the API answers 403), without rendering anything;
 *  - browsers also say where a request comes from (Sec-Fetch-Site, which page scripts can't
 *    change). A filter clicked on the site, a client-side navigation and a reload are
 *    "same-origin". A crawler opening URLs one by one, the pattern that got through looking like
 *    ordinary browsers with one view per IP, arrives as "none" (opened directly) or "cross-site".
 *    Those get a small page with a "Show these stats" link instead of the render: one click for a
 *    person with a shared link (the click is same-origin), nothing rendered and nothing counted in
 *    the traffic figures for a crawler (the small page loads no analytics);
 *  - requests without the header (very old browsers, HTTP libraries posing as a browser) share a
 *    tiny hourly budget, then get the same small page;
 *  - same-origin: each visitor (a hash of the IP, never the IP) gets 60 per 10 minutes and the
 *    whole site 100 per hour (the filter links don't prefetch, so only real clicks count);
 *  - the breakdown API is only fetched by the stats page itself, so a request that says it comes
 *    from elsewhere gets 403.
 * Counts live in Redis, or in each instance's memory without it. Nothing here is cached (no-store).
 */
const STATS_LIMITS = {
  page: { perVisitor: 60, total: 100 },
  noHeader: { perVisitor: 5, total: 10 },
  api: { perVisitor: 120, total: 600 },
};
const NO_STORE = { "Cache-Control": "no-store" };

function toStatsOverview(request: NextRequest): NextResponse {
  const to = request.nextUrl.clone();
  to.pathname = "/stats";
  to.search = "";
  return NextResponse.redirect(to, { status: 307, headers: NO_STORE });
}

async function guardStats(request: NextRequest, api: boolean): Promise<NextResponse> {
  const forbidden = () => NextResponse.json({ ok: false, reason: "Not available to automated clients" }, { status: 403, headers: NO_STORE });
  if (isAutomatedAgent(request.headers.get("user-agent"))) return api ? forbidden() : toStatsOverview(request);

  const site = request.headers.get("sec-fetch-site");
  if (api && site && site !== "same-origin") return forbidden();
  const visitor = clientKey(request.headers.get("x-forwarded-for"), request.headers.get("x-real-ip"));

  if (!api && site && site !== "same-origin") return openStatsPage(request);
  if (!api && !site) {
    const [visitorOver, totalOver] = await Promise.all([
      overLimit(`stats-noheader:${visitor}`, STATS_LIMITS.noHeader.perVisitor, 600),
      overLimit("stats-noheader:all", STATS_LIMITS.noHeader.total, 3600),
    ]);
    return visitorOver || totalOver ? openStatsPage(request) : NextResponse.next();
  }

  const limits = api ? STATS_LIMITS.api : STATS_LIMITS.page;
  const kind = api ? "stats-api" : "stats-view";
  const [visitorOver, totalOver] = await Promise.all([overLimit(`${kind}:${visitor}`, limits.perVisitor, 600), overLimit(`${kind}:all`, limits.total, 3600)]);
  if (!visitorOver && !totalOver) return NextResponse.next();
  const headers = { ...NO_STORE, "Retry-After": totalOver ? "1800" : "300" };
  if (api) return NextResponse.json({ ok: false, reason: "Too many requests" }, { status: 429, headers });
  return new NextResponse(TOO_MANY_STATS, { status: 429, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}

/** HTML-escapes text for an attribute or element (the URL below comes from the request). */
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * What a direct open of a filtered stats URL gets: a small page (no rendering, no analytics) whose
 * link opens the same view. Clicking it is a same-origin navigation, so a person gets the stats.
 */
function openStatsPage(request: NextRequest): NextResponse {
  const href = escapeHtml(request.nextUrl.pathname + request.nextUrl.search);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Traffic stats · Saver Option</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0e12;color:#f7f7f7;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}main{max-width:28rem;padding:2rem;text-align:center}p{color:#a1a1aa}.btn{display:inline-block;margin-top:.5rem;padding:.7rem 1.4rem;border-radius:999px;background:#7c3aec;color:#fff;text-decoration:none;font-weight:600}a{color:#b99cff}</style></head><body><main><h1>Traffic stats</h1><p>This link opens a filtered view of Saver Option&apos;s live traffic.</p><p><a class="btn" href="${href}" rel="nofollow">Show these stats</a></p><p><a href="/stats">Or see the overview</a></p></main></body></html>`;
  return new NextResponse(html, { status: 200, headers: { ...NO_STORE, "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" } });
}

const TOO_MANY_STATS = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Too many requests · Saver Option</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0e12;color:#f7f7f7;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}main{max-width:28rem;padding:2rem;text-align:center}p{color:#a1a1aa}a{color:#b99cff}</style></head><body><main><h1>Too many requests</h1><p>The filtered traffic stats are busy right now. Please try again in a few minutes.</p><p><a href="/stats">See the traffic stats overview</a></p></main></body></html>`;

const STATS_PARAMS = ["range", ...Object.values(DIMENSIONS).map((d) => d.param)];
// Kept as a second check: the matcher below already leaves these paths out.
const PUBLIC_BUSINESS = /^\/business(?:\/mcp|\/download(?:\/mac)?|\/docs(?:\/[^/]+)*|\/software-deals(?:\/[^/]+)?)?\/?$/;

export const config = {
  matcher: [
    "/stats",
    // Rendered on every request; guarded against bots and scrapers (guardStats).
    "/stats/view",
    "/api/stats/breakdown",
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
