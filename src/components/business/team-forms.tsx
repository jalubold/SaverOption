"use client";

import { useState } from "react";
import { changeRoleAction, createPersonAction, inviteMemberAction, removeMemberAction, revokeInvitationAction, updatePersonAction } from "@/app/business/actions/team";
import { ActionForm, ConfirmSubmit, SelectField, Submit, TextField } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";

type Option = { value: string; label: string };

/** Copies a link to the clipboard (falls back to selecting the text). */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg border border-line bg-subtle px-2.5 py-1.5 text-[12.5px] text-fg">{url}</code>
      <button
        type="button"
        className={buttonClass("secondary", "sm")}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy the sign-in link", url);
          }
        }}
      >
        <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

export function InviteForm({ workspaceId, roles }: { workspaceId: string; roles: Option[] }) {
  return (
    <ActionForm action={inviteMemberAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
      <TextField label="Email address" name="email" type="email" required maxLength={254} placeholder="colleague@company.com" />
      <SelectField label="Role" name="role" defaultValue={roles.find((r) => r.value === "member")?.value ?? roles[0]?.value} options={roles} />
      <Submit size="md" pendingLabel="Adding…">
        Give access
      </Submit>
    </ActionForm>
  );
}

export function RoleSelectForm({ workspaceId, membershipId, role, options }: { workspaceId: string; membershipId: string; role: string; options: Option[] }) {
  return (
    <ActionForm action={changeRoleAction} workspaceId={workspaceId} className="flex items-center gap-1.5" showMessages>
      <input type="hidden" name="membershipId" value={membershipId} />
      <label className="sr-only" htmlFor={`role-${membershipId}`}>
        Role
      </label>
      <select id={`role-${membershipId}`} name="role" defaultValue={role} className="biz-select">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Submit size="sm" variant="secondary" pendingLabel="Saving…">
        Save
      </Submit>
    </ActionForm>
  );
}

export function RemoveMemberButton({ workspaceId, membershipId, name, self }: { workspaceId: string; membershipId: string; name: string; self: boolean }) {
  return (
    <ActionForm action={removeMemberAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="membershipId" value={membershipId} />
      <ConfirmSubmit
        title={self ? "Leave this workspace?" : `Remove ${name}?`}
        body={
          self
            ? "You'll lose access straight away. An owner or admin can give you access again."
            : "They lose access to this workspace. Their directory entry, seats and the records they own stay as they are."
        }
        confirmLabel={self ? "Leave workspace" : "Remove access"}
      >
        {self ? "Leave workspace" : "Remove"}
      </ConfirmSubmit>
    </ActionForm>
  );
}

export function RevokeInvitationButton({ workspaceId, invitationId, email }: { workspaceId: string; invitationId: string; email: string }) {
  return (
    <ActionForm action={revokeInvitationAction} workspaceId={workspaceId} className="inline">
      <input type="hidden" name="invitationId" value={invitationId} />
      <ConfirmSubmit title={`Revoke access for ${email}?`} body="They won't be able to join with this address unless you add it again." confirmLabel="Revoke">
        Revoke
      </ConfirmSubmit>
    </ActionForm>
  );
}

export function AddPersonForm({ workspaceId, departments }: { workspaceId: string; departments: Option[] }) {
  return (
    <ActionForm action={createPersonAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <TextField label="Name" name="name" required maxLength={120} />
      <TextField label="Email" name="email" type="email" optional maxLength={254} />
      <TextField label="Job title" name="title" optional maxLength={80} />
      <SelectField label="Department" name="departmentId" optional placeholder="No department" options={departments} />
      <div className="sm:col-span-2 lg:col-span-4">
        <Submit size="sm" pendingLabel="Adding…">
          Add person
        </Submit>
      </div>
    </ActionForm>
  );
}

export function EditPersonForm({
  workspaceId,
  person,
  departments,
  activeSeats,
}: {
  workspaceId: string;
  person: { id: string; name: string; email: string | null; title: string | null; departmentId: string | null; status: "active" | "inactive" };
  departments: Option[];
  activeSeats: number;
}) {
  const [status, setStatus] = useState(person.status);
  return (
    <ActionForm action={updatePersonAction} workspaceId={workspaceId} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={person.id} />
      <TextField label="Name" name="name" required maxLength={120} defaultValue={person.name} />
      <TextField label="Email" name="email" type="email" optional maxLength={254} defaultValue={person.email ?? ""} />
      <TextField label="Job title" name="title" optional maxLength={80} defaultValue={person.title ?? ""} />
      <SelectField label="Department" name="departmentId" optional placeholder="No department" defaultValue={person.departmentId ?? ""} options={departments} />
      <SelectField
        label="Status"
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive (left the company)" },
        ]}
      />
      {status === "inactive" && person.status === "active" && activeSeats > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-[13px] sm:col-span-2">
          <Icon name="alert" size={15} className="mt-0.5 text-warn" />
          Saving releases {person.name}&apos;s {activeSeats} active seat{activeSeats === 1 ? "" : "s"}, so they can go to someone else.
        </p>
      )}
      <div className="flex gap-2 sm:col-span-2">
        <Submit size="sm" pendingLabel="Saving…">
          Save changes
        </Submit>
        <a href="/business/team#people" className={buttonClass("ghost", "sm")}>
          Cancel
        </a>
      </div>
    </ActionForm>
  );
}
