/**
 * Where Supabase Auth lives and which cookie holds the session. Shared by the proxy and the
 * server helpers so both read and write the same cookie.
 *
 * The cookie name normally comes from the Supabase URL (`sb-<project-ref>-auth-token`). When the
 * URL moves to a custom domain (auth.saveroption.com, so Google's account chooser shows our name),
 * that default would change and sign everyone out. To keep sessions, the name stays on the
 * project's: from SUPABASE_AUTH_COOKIE_NAME when set, otherwise from the project ref inside the
 * anon key. Nothing changes while the URL is still *.supabase.co.
 */
export interface SupabasePublicConfig {
  url: string;
  key: string;
  /** Set only when the session cookie must keep a name the URL wouldn't give it. */
  cookieName?: string;
}

export function supabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const cookieName = authCookieName(url, key);
  return cookieName ? { url, key, cookieName } : { url, key };
}

/** For createServerClient: pins the cookie name only when there is one to pin. */
export function cookieOptionsFor(cfg: SupabasePublicConfig): { cookieOptions?: { name: string } } {
  return cfg.cookieName ? { cookieOptions: { name: cfg.cookieName } } : {};
}

const NAME = /^[A-Za-z0-9_-]{1,100}$/;

function authCookieName(url: string, key: string): string | undefined {
  const explicit = process.env.SUPABASE_AUTH_COOKIE_NAME?.trim();
  if (explicit && NAME.test(explicit)) return explicit;
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return undefined;
  }
  // The default already is the project's cookie; local and test servers keep theirs too.
  if (host.endsWith(".supabase.co") || host.endsWith(".supabase.in") || host === "localhost" || /^[\d.]+$/.test(host) || host.includes(":")) return undefined;
  const ref = projectRefFromKey(key);
  return ref ? `sb-${ref}-auth-token` : undefined;
}

/** The legacy anon key is a JWT whose payload names the project (`ref`). Newer keys don't. */
function projectRefFromKey(key: string): string | undefined {
  const parts = key.split(".");
  if (parts.length !== 3) return undefined;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4))) as { ref?: unknown };
    return typeof json.ref === "string" && /^[a-z0-9]{10,40}$/.test(json.ref) ? json.ref : undefined;
  } catch {
    return undefined;
  }
}
