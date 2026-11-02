import { createHash } from "node:crypto";
import { getSettings, saveSettings } from "@/lib/server/settings";
import { db, dbConfigured } from "@/lib/server/db";

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
 *
 * If a popup sign-in can't be finished on our side (Google refuses the code — a wrong secret, a client
 * that doesn't allow this site — or Supabase refuses the token), the popup is switched off for that ID
 * and secret, so nobody chooses their account twice (popup, then the redirect). /admin/setup shows why
 * and can switch it back on; changing the secret (or the ID) in Vercel does too.
 */
export interface GoogleIdentityConfig {
  clientId: string;
  scriptSrc: string;
}

const CLIENT_ID = /^[\w.-]{6,200}\.apps\.googleusercontent\.com$/;
const GSI = "https://accounts.google.com/gsi/client";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;
const OFF_KEY = "google_popup_off";
const LAST_KEY = "google_popup_last_error";

function clientId(): string | null {
  const id = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();
  return CLIENT_ID.test(id) ? id : null;
}

function clientSecret(): string | null {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return secret && secret.length >= 8 && secret.length <= 200 ? secret : null;
}

/** Names this ID and secret pair without revealing the secret (a short one-way hash). */
function fingerprint(id: string, secret: string): string {
  return createHash("sha256").update(`${id}:${secret}`).digest("hex").slice(0, 16);
}

type OffNote = { fp: string; reason: string; at: string };

async function offNote(): Promise<OffNote | null> {
  if (!dbConfigured()) return null;
  try {
    const raw = (await getSettings()).get(OFF_KEY);
    const note = raw ? (JSON.parse(raw) as Partial<OffNote>) : null;
    return note && typeof note.fp === "string" && typeof note.reason === "string" && typeof note.at === "string" ? (note as OffNote) : null;
  } catch {
    return null;
  }
}

/** What the page needs to open Google's popup — never the secret. Null when the popup flow is off. */
export async function googleIdentity(): Promise<GoogleIdentityConfig | null> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return null;
  const off = await offNote();
  if (off?.fp === fingerprint(id, secret)) return null;
  // Tests point the script at a local stand-in; nothing but a local address is accepted for that.
  const override = process.env.GOOGLE_GSI_SCRIPT_URL?.trim();
  return { clientId: id, scriptSrc: override && LOCAL.test(override) ? override : GSI };
}

/**
 * Whether the popup may be offered right now, read straight from the database (pages built ahead or
 * cached would otherwise keep offering it for a while after it was switched off).
 */
export async function googlePopupAvailable(): Promise<boolean> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return false;
  if (!dbConfigured()) return true;
  try {
    const rows = await db()<{ value: string }[]>`select value from app_settings where key = ${OFF_KEY}`;
    const note = rows[0] ? (JSON.parse(rows[0].value) as Partial<OffNote>) : null;
    return note?.fp !== fingerprint(id, secret);
  } catch {
    return true;
  }
}

/** For /admin/setup: whether the popup is set up, why it was switched off if it was, and the last failure. */
export async function googlePopupStatus(): Promise<{ configured: boolean; refused: { reason: string; at: string } | null; last: { reason: string; at: string } | null }> {
  const id = clientId();
  const secret = clientSecret();
  let last: { reason: string; at: string } | null = null;
  try {
    const raw = (await getSettings()).get(LAST_KEY);
    const note = raw ? (JSON.parse(raw) as { reason?: unknown; at?: unknown }) : null;
    if (note && typeof note.reason === "string" && typeof note.at === "string") last = { reason: note.reason, at: note.at };
  } catch {}
  if (!id || !secret) return { configured: false, refused: null, last };
  const off = await offNote();
  return { configured: true, refused: off && off.fp === fingerprint(id, secret) ? { reason: off.reason, at: off.at } : null, last };
}

/** Remembers why the last popup sign-in couldn't be finished (shown on /admin/setup). */
export async function recordGooglePopupFailure(reason: string): Promise<void> {
  if (dbConfigured()) await saveSettings({ [LAST_KEY]: JSON.stringify({ reason: reason.slice(0, 160), at: new Date().toISOString() }) }).catch(() => {});
}

/** Turns the popup off for the current ID and secret (a popup sign-in couldn't be finished), with the reason. */
export async function switchGooglePopupOff(reason: string): Promise<void> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret || !dbConfigured()) return;
  await saveSettings({ [OFF_KEY]: JSON.stringify({ fp: fingerprint(id, secret), reason: reason.slice(0, 120), at: new Date().toISOString() }) }).catch(() => {});
}

/** Switches the popup back on (from /admin/setup). */
export async function switchGooglePopupOn(): Promise<void> {
  if (dbConfigured()) await saveSettings({ [OFF_KEY]: null });
}

/**
 * Swaps the popup's one-time code for Google's ID token (redirect_uri "postmessage" is how Google
 * names the popup flow). `transient` marks failures that say nothing about the setup: Google
 * unreachable or erroring, or a made-up code ("Malformed auth code", which anyone can send). Any other
 * refusal — invalid_client, invalid_grant for a real code, and so on — means the popup isn't working.
 */
export async function exchangeGoogleCode(code: string): Promise<{ token: string } | { reason: string; transient: boolean }> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return { reason: "not configured", transient: true };
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
    const body = (await res.json().catch(() => ({}))) as { id_token?: unknown; error?: unknown; error_description?: unknown };
    if (!res.ok) {
      const code = typeof body.error === "string" ? body.error.slice(0, 40) : `http_${res.status}`;
      const desc = typeof body.error_description === "string" ? ` (${body.error_description.slice(0, 80)})` : "";
      console.error("[auth] google code exchange failed:", res.status, code + desc);
      const madeUp = code === "invalid_grant" && /malformed/i.test(desc);
      return { reason: `Google: ${code}${desc}`, transient: res.status >= 500 || madeUp };
    }
    if (typeof body.id_token === "string" && body.id_token.length < 8192) return { token: body.id_token };
    return { reason: "Google: no ID token in the answer", transient: false };
  } catch (err) {
    console.error("[auth] google code exchange error:", err instanceof Error ? err.name : "unknown");
    return { reason: "Google unreachable", transient: true };
  }
}
