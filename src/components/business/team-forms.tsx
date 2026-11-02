"use client";

import { useState } from "react";
import { changeRoleAction, createPersonAction, inviteMemberAction, removeMemberAction, revokeInvitationAction, updatePersonAction } from "@/app/business/actions/team";
import { ActionForm, ConfirmSubmit, SelectField, Submit, TextField } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";

type Option = { value: string; label: string };

/**
 * Shown on Team right after giving access (and from "Share invite"): the person's own invite
 * link and a ready-to-send message, with one-click ways to send it. Saver Option doesn't email
 * anyone; the inviter sends it from their own email, WhatsApp, Slack or Teams.
 */
export function InviteSharePanel({ email, role, workspace, url, message }: { email: string; role: string; workspace: string; url: string; message: string }) {
  const [copied, setCopied] = useState<"message" | "link" | null>(null);
  const copy = async (what: "message" | "link") => {
    const text = what === "message" ? message : url;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt(what === "message" ? "Copy the invite message" : "Copy the invite link", text);
    }
  };
  const subject = `Join ${workspace} on Saver Option Business`;
  return (
    <section id="invite" className="scroll-mt-24 rounded-2xl border border-accent/30 bg-accent-soft/50 p-4 sm:p-5" data-invite-share>
      <p className="flex items-center gap-2 text-[15px] font-semibold text-fg">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" size={14} />
        </span>
        Access added for {email} · {role}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">Now send them their invite — Saver Option doesn&apos;t email it. It takes a few seconds:</p>
      <ol className="mt-4 space-y-4">
        <li className="flex gap-3">
          <StepNumber n={1} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-fg">Copy the invite</p>
            <div className="mt-2 whitespace-pre-line rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-fg" data-invite-message>
              {message}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => copy("message")} className={buttonClass("primary", "sm")} data-copy-invite>
                <Icon name={copied === "message" ? "check" : "copy"} size={14} /> {copied === "message" ? "Copied" : "Copy message"}
              </button>
              <button type="button" onClick={() => copy("link")} className={buttonClass("secondary", "sm")}>
                <Icon name={copied === "link" ? "check" : "link"} size={14} /> {copied === "link" ? "Copied" : "Copy link only"}
              </button>
            </div>
          </div>
        </li>
        <li className="flex gap-3">
          <StepNumber n={2} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-fg">Send it to {email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`} className={buttonClass("secondary", "sm")}>
                <Icon name="mail" size={14} /> Email from my account
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                <Icon name="external" size={14} /> WhatsApp
              </a>
            </div>
            <p className="mt-1.5 text-[12.5px] text-faint">Or paste it in Slack, Teams or any chat.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <StepNumber n={3} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-fg">They sign in with Google as {email}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
              The link shows them which account to use, then they choose <strong className="font-medium text-fg">Join</strong>. They&apos;ll appear under Members.
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}

function StepNumber({ n }: { n: number }) {
  return <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-[12px] font-semibold text-accent-ink">{n}</span>;
}

export function InviteForm({ workspaceId, roles, after }: { workspaceId: string; roles: Option[]; after?: "onboarding" }) {
  return (
    <ActionForm
      action={inviteMemberAction}
      workspaceId={workspaceId}
      id="invite-form"
      // The share panel above confirms it; the form is cleared for the next person.
      onDone={(state) => state.ok && (document.getElementById("invite-form") as HTMLFormElement | null)?.reset()}
      className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end"
    >
      {after && <input type="hidden" name="after" value={after} />}
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
