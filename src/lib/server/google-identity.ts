/**
 * Google sign-in on our own domain (Google Identity Services). Google's account chooser then names
 * saveroption.com — and Saver Option with its logo once the brand is verified — instead of the
 * Supabase project's address. Google hands the page an ID token, which /auth/google passes to
 * Supabase (signInWithIdToken); accounts and sessions stay in Supabase.
 *
 * Switched on by the web OAuth client's ID (NEXT_PUBLIC_GOOGLE_CLIENT_ID, or GOOGLE_CLIENT_ID); the
 * same client must be listed in Supabase's Google provider, and the site added to its Authorized
 * JavaScript origins. Without it, the button keeps the redirect flow through Supabase.
 */
export interface GoogleIdentityConfig {
  clientId: string;
  scriptSrc: string;
}

const CLIENT_ID = /^[\w.-]{6,200}\.apps\.googleusercontent\.com$/;
const GSI = "https://accounts.google.com/gsi/client";

export function googleIdentity(): GoogleIdentityConfig | null {
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();
  if (!CLIENT_ID.test(clientId)) return null;
  // Tests point the script at a local stand-in; nothing but a local address is accepted for that.
  const override = process.env.GOOGLE_GSI_SCRIPT_URL?.trim();
  const scriptSrc = override && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(override) ? override : GSI;
  return { clientId, scriptSrc };
}
