"use client";

import { archiveDepartmentAction, assignMembersAction, createDepartmentAction, renameDepartmentAction } from "@/app/business/actions/directory";
import { ActionForm, ConfirmSubmit, Submit, TextField } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";

export function CreateDepartmentForm({ workspaceId }: { workspaceId: string }) {
  return (
    <ActionForm action={createDepartmentAction} workspaceId={workspaceId} className="flex flex-wrap items-end gap-2">
      <TextField label="New department" name="name" required maxLength={60} placeholder="e.g. Engineering" className="min-w-56 flex-1" />
      <Submit size="md" pendingLabel="Creating…">
        <Icon name="plus" size={14} /> Create
      </Submit>
    </ActionForm>
  );
}

export function RenameDepartmentForm({ workspaceId, id, name }: { workspaceId: string; id: string; name: string }) {
  return (
    <ActionForm action={renameDepartmentAction} workspaceId={workspaceId} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={id} />
      <TextField label="Name" name="name" required maxLength={60} defaultValue={name} className="min-w-56 flex-1" />
      <Submit size="md" variant="secondary" pendingLabel="Saving…">
        Rename
      </Submit>
    </ActionForm>
  );
}

export function ArchiveDepartmentButton({ workspaceId, id, name, archived }: { workspaceId: string; id: string; name: string; archived: boolean }) {
  return (
    <ActionForm action={archiveDepartmentAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="id" value={id} />
      {archived ? (
        <>
          <input type="hidden" name="restore" value="1" />
          <Submit size="sm" variant="secondary" pendingLabel="Restoring…">
            Restore
          </Submit>
        </>
      ) : (
        <ConfirmSubmit
          title={`Archive ${name}?`}
          body="It's hidden from department pickers. People and records keep it until you move them, and its history stays in reports. You can restore it later."
          confirmLabel="Archive"
        >
          <Icon name="archive" size={14} /> Archive
        </ConfirmSubmit>
      )}
    </ActionForm>
  );
}

/** Moves the chosen people into a department (or out of every department when departmentId is empty). */
export function AssignMembersForm({
  workspaceId,
  departmentId,
  people,
  submitLabel,
}: {
  workspaceId: string;
  departmentId: string;
  people: { id: string; name: string; departmentName: string | null }[];
  submitLabel: string;
}) {
  if (people.length === 0) return <p className="text-[13px] text-faint">No one to show.</p>;
  return (
    <ActionForm action={assignMembersAction} workspaceId={workspaceId} className="space-y-3">
      <input type="hidden" name="departmentId" value={departmentId} />
      <div className="grid max-h-64 gap-1 overflow-y-auto rounded-xl border border-line p-2 sm:grid-cols-2">
        {people.map((p) => (
          <label key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-subtle">
            <input type="checkbox" name="personIds" value={p.id} className="size-4 accent-[var(--accent)]" />
            {p.name}
            <span className="text-faint">· {p.departmentName ?? "No department"}</span>
          </label>
        ))}
      </div>
      <Submit size="sm" pendingLabel="Saving…">
        {submitLabel}
      </Submit>
    </ActionForm>
  );
}
