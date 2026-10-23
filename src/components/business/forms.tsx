"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import type { FormState } from "@/lib/business/form";
import { FieldError, FormMessage, inputClass, SubmitButton, useFormAction } from "@/components/ui/form";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * Client form plumbing for the business app. Every form posts to a server
 * action with the current workspace id; the server re-validates everything.
 * Field errors come back from the action and show next to their inputs, and
 * nothing the user typed is cleared when there's an error.
 */

type Action = (prev: FormState, form: FormData) => Promise<FormState>;

const Ctx = createContext<{ state: FormState; pending: boolean }>({ state: {}, pending: false });

export function useBizForm() {
  return useContext(Ctx);
}

export function ActionForm({
  action,
  workspaceId,
  children,
  className,
  id,
  showMessages = true,
  onDone,
}: {
  action: Action;
  workspaceId: string;
  children: ReactNode;
  className?: string;
  id?: string;
  showMessages?: boolean;
  onDone?: (state: FormState) => void;
}) {
  const { state, pending, onSubmit } = useFormAction<FormState>(action, {});
  const router = useRouter();
  const handled = useRef<FormState | null>(null);
  useEffect(() => {
    if (handled.current === state) return;
    handled.current = state;
    if (state.ok && state.redirectTo) router.push(state.redirectTo);
    if (state.ok || state.error) onDone?.(state);
  }, [state, router, onDone]);
  return (
    <Ctx.Provider value={{ state, pending }}>
      <form id={id} onSubmit={onSubmit} className={className} noValidate>
        <input type="hidden" name="workspaceId" value={workspaceId} />
        {children}
        {showMessages && <FormMessages />}
      </form>
    </Ctx.Provider>
  );
}

export function FormMessages() {
  const { state } = useBizForm();
  if (state.error) return <div className="mt-3"><FormMessage tone="error">{state.error}</FormMessage></div>;
  if (state.ok && state.message) return <div className="mt-3"><FormMessage tone="success">{state.message}</FormMessage></div>;
  return null;
}

function useFieldError(name: string): string | undefined {
  return useBizForm().state.fieldErrors?.[name];
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-medium text-fg">
      {children} {optional && <span className="font-normal text-faint">(optional)</span>}
    </label>
  );
}

export function TextField({
  label,
  name,
  hint,
  optional,
  className,
  ...input
}: ComponentProps<"input"> & { label: string; name: string; hint?: ReactNode; optional?: boolean }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error || hint ? `${id}-d` : undefined} className={inputClass(error, "h-10 text-[14px]")} {...input} />
      {error ? <FieldError id={`${id}-d`}>{error}</FieldError> : hint ? <p id={`${id}-d`} className="mt-1 text-[12px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  name,
  hint,
  optional,
  className,
  options,
  placeholder,
  ...select
}: ComponentProps<"select"> & { label: string; name: string; hint?: ReactNode; optional?: boolean; options: { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <select id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error || hint ? `${id}-d` : undefined} className={inputClass(error, "h-10 text-[14px]")} {...select}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <FieldError id={`${id}-d`}>{error}</FieldError> : hint ? <p id={`${id}-d`} className="mt-1 text-[12px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function TextAreaField({ label, name, hint, optional, className, ...area }: ComponentProps<"textarea"> & { label: string; name: string; hint?: ReactNode; optional?: boolean }) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-d` : undefined}
        className={inputClass(error, "h-auto py-2 text-[14px] leading-relaxed")}
        {...area}
      />
      {error ? <FieldError id={`${id}-d`}>{error}</FieldError> : hint ? <p id={`${id}-d`} className="mt-1 text-[12px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function CheckboxField({ label, name, hint, className, ...input }: ComponentProps<"input"> & { label: string; name: string; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <input id={id} name={name} type="checkbox" className="mt-0.5 size-4 accent-[var(--accent)]" {...input} />
      <div>
        <label htmlFor={id} className="text-[13.5px] font-medium text-fg">
          {label}
        </label>
        {hint && <p className="text-[12px] text-faint">{hint}</p>}
      </div>
    </div>
  );
}

export function Submit({ children, pendingLabel = "Saving…", variant = "primary", size = "md", className, name, value }: { children: ReactNode; pendingLabel?: string; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg"; className?: string; name?: string; value?: string }) {
  const { pending } = useBizForm();
  return (
    <SubmitButton pending={pending} pendingLabel={pendingLabel} variant={variant} size={size} className={className} name={name} value={value}>
      {children}
    </SubmitButton>
  );
}

/**
 * A button that asks for confirmation in a dialog, then submits its form.
 * Use for archiving, removing and other changes that are hard to undo.
 */
export function ConfirmSubmit({
  children,
  title,
  body,
  confirmLabel,
  variant = "secondary",
  size = "sm",
  danger = true,
  className,
  name,
  value,
}: {
  children: ReactNode;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  danger?: boolean;
  className?: string;
  name?: string;
  value?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const { pending } = useBizForm();
  const titleId = useId();
  return (
    <>
      <button ref={btn} type="button" disabled={pending} className={buttonClass(variant, size, className)} onClick={() => ref.current?.showModal()}>
        {children}
      </button>
      <dialog ref={ref} aria-labelledby={titleId} className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-line bg-surface p-0 text-fg shadow-xl backdrop:bg-black/40">
        <div className="p-5">
          <h2 id={titleId} className="text-[16px] font-semibold">
            {title}
          </h2>
          <div className="mt-2 text-[13.5px] text-muted">{body}</div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className={buttonClass("secondary", "sm")} onClick={() => ref.current?.close()}>
              Cancel
            </button>
            <button
              type="button"
              className={buttonClass("primary", "sm", danger ? "!bg-none !bg-danger" : undefined)}
              onClick={() => {
                ref.current?.close();
                const form = btn.current?.form;
                if (!form) return;
                if (name) {
                  const hidden = document.createElement("input");
                  hidden.type = "hidden";
                  hidden.name = name;
                  hidden.value = value ?? "";
                  form.appendChild(hidden);
                  form.requestSubmit();
                  hidden.remove();
                } else form.requestSubmit();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Stable random key for create forms, so a resubmitted form can't create a duplicate. */
export function useIdempotencyKey(): string {
  const [key] = useState(() => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  });
  return key;
}
