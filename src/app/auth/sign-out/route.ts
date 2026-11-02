import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";

/** POST only, so a link or prefetch can't sign anyone out. */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  // "Sign out everywhere" ends every session for the account, not just this browser's.
  const scope = form?.get("scope") === "global" ? "global" : "local";
  if (authConfigured()) await (await supabaseServer()).auth.signOut({ scope });
  const next = form?.get("next");
  // An invite link's page offers "Sign out and switch account", so it comes back to the invite.
  const invite = typeof next === "string" && /^\/business\/invite\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(next);
  const to = next === "/business" ? "/business?signed_out=1" : invite ? (next as string) : "/";
  return NextResponse.redirect(new URL(to, request.nextUrl.origin), 303);
}
