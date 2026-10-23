import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps Supabase sessions fresh on the pages that use accounts: an expired
 * access token is refreshed here, where cookies can be written, before the page
 * renders. Every other route skips this entirely.
 */
export async function proxy(request: NextRequest) {
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
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/claim", "/login", "/signup", "/promote/:path*", "/business/:path*"],
};
