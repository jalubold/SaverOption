"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button, cn } from "@/components/ui/primitives";

type State = { status: "idle" | "submitting" } | { status: "success" } | { status: "error"; message: string };

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const inputId = useId();
  const messageId = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    // Honeypot: real users never fill this in.
    if (data.get("company")) return setState({ status: "success" });

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && body.ok) {
        setState({ status: "success" });
        form.reset();
      } else {
        setState({ status: "error", message: body.message ?? "Something went wrong. Please try again." });
      }
    } catch {
      setState({ status: "error", message: "Network error. Check your connection and try again." });
    }
  }

  if (state.status === "success") {
    return (
      <p role="status" className={cn("flex items-center gap-2 text-sm font-medium text-accent-ink", className)}>
        <Icon name="check" size={18} />
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  const error = state.status === "error" ? state.message : null;

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row")}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          className="h-11 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3.5 text-[15px] text-fg outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <Button type="submit" size="md" className="h-11" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <p id={messageId} aria-live="polite" className={cn("mt-2 text-sm", error ? "text-danger" : "sr-only")}>
        {error}
      </p>
    </form>
  );
}
