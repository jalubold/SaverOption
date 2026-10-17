import { NextResponse } from "next/server";
import { subscribe } from "@/lib/newsletter";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const result = await subscribe(email);
  if (result.ok) return NextResponse.json({ ok: true });

  const status = result.reason === "invalid" ? 422 : result.reason === "not-configured" ? 503 : 502;
  return NextResponse.json({ ok: false, message: result.message }, { status });
}
