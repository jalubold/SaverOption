"use client";

import { startTransition, useActionState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/** Shared form controls for the advertiser, auth and admin pages. */

/**
 * Server action form state without React's automatic form reset, so a
 * validation error never wipes what the user typed.
 */
export function useFormAction<S>(action: (prev: Awaited<S>, form: FormData) => Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => dispatch(form));
  };
  return { state, pending, onSubmit };
}

export function inputClass(error?: string | boolean, extra?: string) {
  return cn(
    "mt-1.5 h-11 w-full rounded-[10px] border bg-bg px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
    error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-line-strong focus:border-accent focus:ring-accent/20",
    extra,
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-danger">
      <Icon name="alert" size={13} className="mt-px" /> {children}
    </p>
  );
}

export function FormField({
  label,
  name,
  error,
  hint,
  optional,
  className,
  ...input
}: ComponentProps<"input"> & { label: string; name: string; error?: string; hint?: ReactNode; optional?: boolean }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13px] font-medium text-fg">
        {label} {optional && <span className="font-normal text-faint">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass(error)}
        {...input}
      />
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pending,
  pendingLabel,
  variant = "primary",
  size = "lg",
  className,
  ...props
}: ComponentProps<"button"> & { pending: boolean; pendingLabel: string; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg" }) {
  return (
    <button type="submit" disabled={pending || props.disabled} aria-busy={pending} className={buttonClass(variant, size, cn(pending ? "disabled:opacity-80" : "disabled:cursor-not-allowed disabled:opacity-40", className))} {...props}>
      {pending ? (
        <>
          <span aria-hidden="true" className={cn("size-4 animate-spin rounded-full border-2", variant === "primary" ? "border-white/40 border-t-white" : "border-line-strong border-t-fg")} />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm text-fg",
        tone === "error" ? "border-danger/40 bg-danger/10" : "border-accent/40 bg-accent-soft",
      )}
    >
      <Icon name={tone === "error" ? "alert" : "check"} size={15} className={cn("mt-0.5 shrink-0", tone === "error" ? "text-danger" : "text-accent-ink")} />
      <span>{children}</span>
    </p>
  );
}
