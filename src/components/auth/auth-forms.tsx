"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  requestResetAction,
  resendConfirmationAction,
  signInAction,
  signInWithGoogleAction,
  signUpAction,
  updatePasswordAction,
  type AuthState,
} from "@/app/auth/actions";
import { FormField, FormMessage, SubmitButton, useFormAction } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";

function track(name: string) {
  fetch("/api/funnel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }), keepalive: true }).catch(() => {});
}

function withNext(path: string, next: string) {
  return next === "/dashboard" ? path : `${path}?next=${encodeURIComponent(next)}`;
}

function CheckEmail({ email, next, notice, error, reason }: { email: string; next: string; notice?: string; error?: string; reason: "confirm" | "reset" }) {
  const { state, pending, onSubmit } = useFormAction<AuthState>(resendConfirmationAction, null);
  return (
    <div>
      <span className="icon-tile size-11">
        <Icon name="mail" size={20} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-fg">Check your email</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {reason === "confirm" ? (
          <>
            We sent a confirmation link to <strong className="text-fg [overflow-wrap:anywhere]">{email}</strong>. Open it to activate your account
            {next === "/claim" ? " — your paid listing will be added to it automatically." : "."}
          </>
        ) : (
          <>
            If an account exists for <strong className="text-fg [overflow-wrap:anywhere]">{email}</strong>, we sent a link to reset your password. It
            expires in an hour.
          </>
        )}
      </p>
      <div className="mt-4 space-y-3">
        <FormMessage tone="error">{state?.error ?? error}</FormMessage>
        <FormMessage tone="success">{state?.notice ?? notice}</FormMessage>
      </div>
      {reason === "confirm" && (
        <form onSubmit={onSubmit} className="mt-5">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />
          <p className="text-[13px] text-faint">Nothing after a few minutes? Check spam, or</p>
          <SubmitButton pending={pending} variant="secondary" size="md" pendingLabel="Sending…" className="mt-2 w-full">
            Resend confirmation email
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

export function SignupForm({ next, email }: { next: string; email: string }) {
  const { state, pending, onSubmit } = useFormAction<AuthState>(signUpAction, null);
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      track("account_signup_started");
    }
  }, []);

  if (state?.checkEmail) return <CheckEmail email={state.checkEmail} next={next} reason="confirm" />;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormField label="Email" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={email} required error={state?.fieldErrors?.email} />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        required
        error={state?.fieldErrors?.password}
        hint="At least 8 characters."
      />
      <FormMessage tone="error">
        {state?.error}
        {state?.error?.includes("Log in") && (
          <>
            {" "}
            <Link href={withNext("/login", next)} className="font-medium text-accent-ink underline underline-offset-2">
              Log in
            </Link>
          </>
        )}
      </FormMessage>
      <SubmitButton pending={pending} pendingLabel="Creating account…" className="w-full">
        Create Account <Icon name="arrow-right" size={16} />
      </SubmitButton>
      <p className="text-center text-xs text-faint">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

export function LoginForm({ next, email }: { next: string; email: string }) {
  const { state, pending, onSubmit } = useFormAction<AuthState>(signInAction, null);
  if (state?.unconfirmed)
    return <CheckEmail email={state.unconfirmed} next={next} reason="confirm" error="Confirm your email address before logging in." />;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormField label="Email" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={email} required error={state?.fieldErrors?.email} />
      <div>
        <FormField label="Password" name="password" type="password" autoComplete="current-password" required error={state?.fieldErrors?.password} />
        <Link href="/reset-password" className="mt-1.5 inline-block text-[13px] font-medium text-accent-ink underline-offset-2 hover:underline">
          Forgot password?
        </Link>
      </div>
      <FormMessage tone="error">{state?.error}</FormMessage>
      <SubmitButton pending={pending} pendingLabel="Logging in…" className="w-full">
        Log in <Icon name="arrow-right" size={16} />
      </SubmitButton>
    </form>
  );
}

export function ResetRequestForm() {
  const { state, pending, onSubmit } = useFormAction<AuthState>(requestResetAction, null);
  if (state?.checkEmail) return <CheckEmail email={state.checkEmail} next="/update-password" reason="reset" />;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormField label="Email" name="email" type="email" inputMode="email" autoComplete="email" required error={state?.fieldErrors?.email} />
      <FormMessage tone="error">{state?.error}</FormMessage>
      <SubmitButton pending={pending} pendingLabel="Sending…" className="w-full">
        Send reset link
      </SubmitButton>
    </form>
  );
}

export function UpdatePasswordForm() {
  const { state, pending, onSubmit } = useFormAction<AuthState>(updatePasswordAction, null);
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        required
        error={state?.fieldErrors?.password}
        hint="At least 8 characters."
      />
      <FormField label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required />
      <FormMessage tone="error">{state?.error}</FormMessage>
      <SubmitButton pending={pending} pendingLabel="Saving…" className="w-full">
        Update password
      </SubmitButton>
    </form>
  );
}

/** The only sign-in method once Google is enabled in Supabase: new and returning users use the same button. */
export function GoogleButton({ next, label = "Continue with Google" }: { next: string; label?: string }) {
  return (
    <form action={signInWithGoogleAction}>
      <input type="hidden" name="next" value={next} />
      <GoogleSubmit label={label} />
    </form>
  );
}

function GoogleSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f8f9fa] disabled:opacity-80"
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#1f1f1f]" />
          Opening Google…
        </>
      ) : (
        <>
          <GoogleLogo />
          {label}
        </>
      )}
    </button>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
