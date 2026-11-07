"use client";

import { redeemCodeAction } from "@/app/business/actions/lifetime";
import { ActionForm, SelectField, Submit, TextField } from "@/components/business/forms";

/** The code and the workspace it goes to; the server re-checks both. */
export function RedeemForm({ workspaces, initialWorkspace, initialCode }: { workspaces: { value: string; label: string }[]; initialWorkspace: string; initialCode: string }) {
  return (
    <ActionForm action={redeemCodeAction} workspaceId={initialWorkspace} className="grid gap-4">
      <TextField
        label="Your code"
        name="code"
        defaultValue={initialCode}
        required
        maxLength={200}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder="e.g. SOB-XXXX-XXXX-XXXX"
        className="[&_input]:font-mono"
        hint="Copy it from your AppSumo account. Each code works once."
        autoFocus={!initialCode}
      />
      {workspaces.length > 1 ? (
        <SelectField label="Apply it to" name="target" defaultValue={initialWorkspace} options={workspaces} />
      ) : (
        <input type="hidden" name="target" value={initialWorkspace} />
      )}
      <div>
        <Submit pendingLabel="Redeeming…" size="lg" className="w-full sm:w-auto">
          Redeem code
        </Submit>
      </div>
    </ActionForm>
  );
}
