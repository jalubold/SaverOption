import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, supabaseServer } from "@/lib/server/supabase";

/** POST only, so a link or prefetch can't sign anyone out. */
export async function POST(request: NextRequest) {
  if (authConfigured()) await (await supabaseServer()).auth.signOut();
  return NextResponse.redirect(new URL("/", request.nextUrl.origin), 303);
}
