"use client";

import { disconnectClientAction } from "@/app/business/actions/mcp";
import { ActionForm, ConfirmSubmit } from "@/components/business/forms";

export function DisconnectForm({ workspaceId, grantId, clientName }: { workspaceId: string; grantId: string; clientName: string }) {
  return (
    <ActionForm action={disconnectClientAction} workspaceId={workspaceId}>
      <input type="hidden" name="grantId" value={grantId} />
      <ConfirmSubmit
        title={`Disconnect ${clientName}?`}
        body="Its access and refresh tokens stop working immediately. To use it again, connect again from the AI client."
        confirmLabel="Disconnect"
      >
        Disconnect
      </ConfirmSubmit>
    </ActionForm>
  );
}
