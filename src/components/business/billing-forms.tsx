"use client";

import { cancelSubscriptionAction, openBillingPortalAction, startCheckoutAction } from "@/app/business/actions/billing";
import type { PlanId, PlanInterval } from "@/lib/business/billing";
import { ActionForm, CheckboxField, ConfirmSubmit, Submit } from "@/components/business/forms";

/** Creates the Creem checkout on the server and opens it. */
export function CheckoutForm({ workspaceId, plan, interval, label }: { workspaceId: string; plan: PlanId; interval: PlanInterval; label: string }) {
  return (
    <ActionForm action={startCheckoutAction} workspaceId={workspaceId}>
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="interval" value={interval} />
      <Submit pendingLabel="Opening checkout…" size="lg" className="w-full sm:w-auto">
        {label}
      </Submit>
    </ActionForm>
  );
}

export function PortalForm({ workspaceId, label = "Manage billing" }: { workspaceId: string; label?: string }) {
  return (
    <ActionForm action={openBillingPortalAction} workspaceId={workspaceId}>
      <Submit pendingLabel="Opening…" variant="secondary" size="sm">
        {label}
      </Submit>
    </ActionForm>
  );
}

export function CancelForm({ workspaceId, endsOn }: { workspaceId: string; endsOn: string | null }) {
  return (
    <ActionForm action={cancelSubscriptionAction} workspaceId={workspaceId} className="grid gap-3">
      <CheckboxField
        name="confirm"
        value="yes"
        label="Cancel at the end of the paid period"
        hint={`You keep access until ${endsOn ?? "the end of the current period"}; nothing more is charged after that. Your data is kept.`}
      />
      <div>
        <ConfirmSubmit
          title="Cancel the subscription?"
          body={`The plan stays active until ${endsOn ?? "the end of the current period"}, then the workspace's premium features stop. You can subscribe again later.`}
          confirmLabel="Cancel subscription"
        >
          Cancel subscription
        </ConfirmSubmit>
      </div>
    </ActionForm>
  );
}
