"use client";

import { generateSavingsReportAction } from "@/app/business/actions/reports";
import { ActionForm, Submit } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";

export function GenerateReportForm({ workspaceId }: { workspaceId: string }) {
  return (
    <ActionForm action={generateSavingsReportAction} workspaceId={workspaceId}>
      <Submit size="sm" pendingLabel="Generating…">
        <Icon name="file" size={14} /> Generate savings report
      </Submit>
    </ActionForm>
  );
}

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[13px] font-medium text-fg hover:bg-subtle print:hidden">
      <Icon name="download" size={14} /> Print or save as PDF
    </button>
  );
}
