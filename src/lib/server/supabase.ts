import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

/**
 * Supabase Auth (sessions in cookies) and Storage. Data queries go through
 * `db()` instead; this module only identifies the user.
 */

function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export function authConfigured(): boolean {
  return publicConfig() !== null;
}

/** Cookie-bound client for the current request (server components, actions, route handlers). */
export async function supabaseServer(): Promise<SupabaseClient> {
  const cfg = publicConfig();
  if (!cfg) throw new Error("Supabase is not configured");
  const store = await cookies();
  return createServerClient(cfg.url, cfg.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server components can't set cookies; the proxy refreshes sessions instead.
        }
      },
    },
  });
}

let googleCache: { at: number; enabled: boolean } | null = null;

/**
 * Whether the Google provider is switched on in Supabase (public /auth/v1/settings).
 * Until it is, the login pages fall back to email and password.
 */
export async function googleSignInEnabled(): Promise<boolean> {
  const cfg = publicConfig();
  if (!cfg) return false;
  if (googleCache && Date.now() - googleCache.at < 60_000) return googleCache.enabled;
  let enabled = false;
  try {
    const res = await fetch(`${cfg.url}/auth/v1/settings`, { headers: { apikey: cfg.key }, cache: "no-store", signal: AbortSignal.timeout(5_000) });
    const body = (await res.json()) as { external?: { google?: boolean } };
    enabled = res.ok && body.external?.google === true;
  } catch {
    enabled = false;
  }
  googleCache = { at: Date.now(), enabled };
  return enabled;
}

export interface SessionUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  /** From the Google profile, when the provider shares it. */
  name: string | null;
  avatarUrl: string | null;
}

function profileText(v: unknown, max: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
}

/** The signed-in user, verified with Supabase Auth (not just decoded from the cookie). */
export async function getUser(): Promise<SessionUser | null> {
  // Reading cookies marks the page as per-request, so session pages are never prerendered.
  await cookies();
  if (!authConfigured()) return null;
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email) return null;
    const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
    const avatar = profileText(meta.avatar_url ?? meta.picture, 500);
    return {
      id: data.user.id,
      email: data.user.email.toLowerCase(),
      emailConfirmed: Boolean(data.user.email_confirmed_at),
      name: profileText(meta.full_name ?? meta.name, 120),
      avatarUrl: avatar && avatar.startsWith("https://") ? avatar : null,
    };
  } catch {
    return null;
  }
}

/** Admins are listed by email in ADMIN_EMAILS (comma-separated) and must have a confirmed email. */
export function isAdmin(user: SessionUser | null): boolean {
  if (!user?.emailConfirmed) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(user.email);
}

export async function requireUser(next: string): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** Admin pages 404 for everyone else, so they don't advertise their existence. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getUser();
  if (!isAdmin(user)) notFound();
  return user!;
}

/** Service-role client for Storage uploads. Server-only; never sent to the browser. */
export function storageAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  // Legacy service-role JWT or the newer `sb_secret_…` key; both bypass RLS and stay server-side.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
