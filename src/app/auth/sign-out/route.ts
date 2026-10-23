import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";

/** POST only, so a link or prefetch can't sign anyone out. */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  // "Sign out everywhere" ends every session for the account, not just this browser's.
  const scope = form?.get("scope") === "global" ? "global" : "local";
  if (authConfigured()) await (await supabaseServer()).auth.signOut({ scope });
  const to = form?.get("next") === "/business" ? "/business?signed_out=1" : "/";
  return NextResponse.redirect(new URL(to, request.nextUrl.origin), 303);
}
