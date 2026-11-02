/**
 * Google sign-in on our own domain, behind our own button. A click opens Google's account chooser
 * in a popup (Google Identity Services' code client), which then names saveroption.com — and
 * Saver Option with its logo once the brand is verified — instead of the Supabase project's address.
 * Google hands the page a one-time code; /auth/google swaps it for an ID token at Google with the
 * client secret and passes that to Supabase (signInWithIdToken). Accounts and sessions stay in Supabase.
 *
 * Switched on by the web OAuth client's ID (NEXT_PUBLIC_GOOGLE_CLIENT_ID, or GOOGLE_CLIENT_ID) together
 * with its secret (GOOGLE_CLIENT_SECRET, server-only). The same client must be listed in Supabase's
 * Google provider, and the site added to its Authorized JavaScript origins. Without both, the button
 * keeps the redirect flow through Supabase.
 */
export interface GoogleIdentityConfig {
  clientId: string;
  scriptSrc: string;
}

const CLIENT_ID = /^[\w.-]{6,200}\.apps\.googleusercontent\.com$/;
const GSI = "https://accounts.google.com/gsi/client";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;

function clientId(): string | null {
  const id = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();
  return CLIENT_ID.test(id) ? id : null;
}

function clientSecret(): string | null {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return secret && secret.length >= 8 && secret.length <= 200 ? secret : null;
}

/** What the page needs to open Google's popup — never the secret. Null when the popup flow is off. */
export function googleIdentity(): GoogleIdentityConfig | null {
  const id = clientId();
  if (!id || !clientSecret()) return null;
  // Tests point the script at a local stand-in; nothing but a local address is accepted for that.
  const override = process.env.GOOGLE_GSI_SCRIPT_URL?.trim();
  return { clientId: id, scriptSrc: override && LOCAL.test(override) ? override : GSI };
}

/**
 * Swaps the popup's one-time code for Google's ID token (redirect_uri "postmessage" is how Google
 * names the popup flow). Returns null when Google refuses the code or the flow isn't configured.
 */
export async function exchangeGoogleCode(code: string): Promise<string | null> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return null;
  const override = process.env.GOOGLE_TOKEN_URL?.trim();
  const url = override && LOCAL.test(override) ? override : TOKEN_URL;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: "postmessage", grant_type: "authorization_code" }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[auth] google code exchange failed:", res.status);
      return null;
    }
    const body = (await res.json()) as { id_token?: unknown };
    return typeof body.id_token === "string" && body.id_token.length < 8192 ? body.id_token : null;
  } catch (err) {
    console.error("[auth] google code exchange error:", err instanceof Error ? err.name : "unknown");
    return null;
  }
}
