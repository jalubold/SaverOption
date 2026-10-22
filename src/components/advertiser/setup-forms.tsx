"use client";

import { useActionState } from "react";
import { connectLemonSqueezyAction, type ConnectState } from "@/app/admin/setup/actions";
import { FormMessage, SubmitButton } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";

export function ConnectLemonSqueezy({ connected, disabled }: { connected: boolean; disabled: boolean }) {
  const [state, action, pending] = useActionState<ConnectState>(connectLemonSqueezyAction, null);
  return (
    <form action={action} className="space-y-3">
      <SubmitButton pending={pending} pendingLabel="Connecting…" size="md" disabled={disabled}>
        <Icon name="refresh" size={15} /> {connected ? "Re-check and reconnect" : "Connect Lemon Squeezy automatically"}
      </SubmitButton>
      {state?.ok === false && <FormMessage tone="error">{state.error}</FormMessage>}
      {state?.ok === false && state.details && (
        <div className="rounded-lg border border-line bg-subtle px-3 py-2.5 text-[13px]">
          <p className="font-medium text-fg">What we found in Lemon Squeezy</p>
          <ul className="mt-1.5 space-y-1 text-muted">
            {state.details.map((d) => (
              <li key={d} className="[overflow-wrap:anywhere]">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
      {state?.ok && (
        <FormMessage tone="success">
          Connected to {state.store.name}. Subscription plans matched ({Object.values(state.variants).map((v) => v.name).join(", ")}) and webhook{" "}
          {state.webhook.created ? "created" : "updated"}
          {state.webhook.testMode ? " (test mode)" : ""}.
          {state.coreEventsOnly ? " Lemon Squeezy refused some event types, so only the essential ones were registered." : ""}
        </FormMessage>
      )}
    </form>
  );
}
