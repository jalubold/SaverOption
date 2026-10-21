"use server";

import { redirect } from "next/navigation";
import { readClaimCookie } from "@/lib/server/claim";
import { claimDestination } from "@/lib/server/claim-flow";
import { dbConfigured } from "@/lib/server/db";
import { readFunnelSession } from "@/lib/server/funnel-session";
import { requestOrigin } from "@/lib/server/origin";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, getUser, supabaseServer } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { safeNext } from "@/lib/safe-next";

/**
 * Accounts on Supabase Auth. Sign-in is with Google; email + password remains
 * only as a fallback while the Google provider isn't switched on in Supabase.
 * Provider redirects and email links come back through /auth/callback.
 */

export type AuthState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  /** Sign-up done; the user has to confirm their email before logging in. */
  checkEmail?: string;
  /** Login refused because the email isn't confirmed yet. */
  unconfirmed?: string;
  notice?: string;
} | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readCredentials(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(form.get("password") ?? "");
  const fieldErrors: NonNullable<AuthState>["fieldErrors"] = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  return { email, password, fieldErrors };
}

function passwordProblem(password: string): string | undefined {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password.length > 72) return "Use 72 characters or fewer.";
  return undefined;
}

async function callbackUrl(next: string) {
  return `${await requestOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;
}

/** Where to go after signing in. `/claim` is resolved here, since a client-side redirect can't follow a route handler. */
async function afterAuth(next: string, user: { id: string; email?: string; email_confirmed_at?: string | null } | null): Promise<string> {
  if (next !== "/claim" || !user?.email || !dbConfigured()) return next === "/claim" ? "/dashboard" : next;
  return claimDestination({ id: user.id, email: user.email.toLowerCase(), emailConfirmed: Boolean(user.email_confirmed_at) });
}

const unavailable: AuthState = { error: "Accounts aren't available right now. Please try again later." };

/** Starts Google sign-in (new and returning users alike) and comes back to `next`. */
export async function signInWithGoogleAction(form: FormData): Promise<void> {
  if (!authConfigured()) redirect("/login?error=unavailable");
  const next = safeNext(form.get("next"));
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl(next), queryParams: { prompt: "select_account" } },
  });
  if (error || !data.url) {
    console.error("[auth] google start failed:", error?.code ?? error?.status ?? "no url");
    redirect("/login?error=google");
  }
  if (dbConfigured()) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      await recordFunnelEvent("account_signup_started", { submissionId: claim && !claim.user_id ? claim.id : null, sessionId: await readFunnelSession() });
    } catch {}
  }
  redirect(data.url);
}

export async function signUpAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!authConfigured()) return unavailable;
  const next = safeNext(form.get("next"));
  const { email, password, fieldErrors } = readCredentials(form);
  const pw = passwordProblem(password);
  if (pw) fieldErrors!.password = pw;
  if (Object.keys(fieldErrors!).length) return { fieldErrors };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: await callbackUrl(next) } });
  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") return { error: "An account with this email already exists. Log in instead." };
    if (error.code === "weak_password") return { fieldErrors: { password: "Choose a stronger password (mix letters, numbers and symbols)." } };
    if (error.status === 429) return { error: "Too many attempts. Wait a minute and try again." };
    console.error("[auth] signup failed:", error.code ?? error.status);
    return { error: "We couldn't create your account. Please try again." };
  }
  // With email confirmation on, Supabase answers an existing address with a user that has no identities.
  if (data.user && data.user.identities?.length === 0) return { error: "An account with this email already exists. Log in instead." };

  if (dbConfigured()) {
    try {
      const claim = await getSubmissionByClaim(await readClaimCookie());
      await recordFunnelEvent("account_created", { submissionId: claim?.id, sessionId: await readFunnelSession() });
    } catch (err) {
      console.error("[auth] funnel event failed:", err instanceof Error ? err.message : err);
    }
  }
  if (data.session) redirect(await afterAuth(next, data.user));
  return { checkEmail: email };
}

export async function signInAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!authConfigured()) return unavailable;
  const next = safeNext(form.get("next"));
  const { email, password, fieldErrors } = readCredentials(form);
  if (!password) fieldErrors!.password = "Enter your password.";
  if (Object.keys(fieldErrors!).length) return { fieldErrors };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") return { unconfirmed: email };
    if (error.status === 429) return { error: "Too many attempts. Wait a minute and try again." };
    if (error.code !== "invalid_credentials") console.error("[auth] login failed:", error.code ?? error.status);
    return { error: "Incorrect email or password." };
  }
  redirect(await afterAuth(next, data.user));
}

export async function resendConfirmationAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!authConfigured()) return unavailable;
  const next = safeNext(form.get("next"));
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: await callbackUrl(next) } });
  if (error?.status === 429) return { checkEmail: email, error: "Please wait a minute before asking for another email." };
  return { checkEmail: email, notice: "If that account still needs confirming, a new link is on its way." };
}

export async function requestResetAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!authConfigured()) return unavailable;
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { fieldErrors: { email: "Enter a valid email address." } };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: await callbackUrl("/update-password") });
  if (error?.status === 429) return { error: "Please wait a minute before asking for another email." };
  // Same answer whether or not the account exists.
  return { checkEmail: email };
}

export async function updatePasswordAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  if (!authConfigured()) return unavailable;
  if (!(await getUser())) return { error: "Your reset link has expired. Request a new one." };
  const password = String(form.get("password") ?? "");
  const pw = passwordProblem(password);
  if (pw) return { fieldErrors: { password: pw } };
  if (password !== String(form.get("confirm") ?? "")) return { fieldErrors: { password: "The passwords don't match." } };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") return { fieldErrors: { password: "Choose a password you haven't used before." } };
    if (error.code === "weak_password") return { fieldErrors: { password: "Choose a stronger password." } };
    return { error: "We couldn't update your password. Please try again." };
  }
  redirect("/dashboard?password=updated");
}
