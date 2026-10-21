"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  requestResetAction,
  resendConfirmationAction,
  signInAction,
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
