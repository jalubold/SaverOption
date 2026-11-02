"use client";

import Link from "next/link";
import { useState } from "react";
import { changeRoleAction, createPersonAction, inviteMemberAction, removeMemberAction, revokeInvitationAction, updatePersonAction } from "@/app/business/actions/team";
import { ActionForm, ConfirmSubmit, SelectField, Submit, TextField } from "@/components/business/forms";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

type Option = { value: string; label: string };

type StepState = "done" | "active" | "next";

/** A step's number in a circle: ticked once done, filled for the one to do now. */
function StepMarker({ n, state }: { n: number; state: StepState }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold tabular-nums",
        state === "done" && "bg-success text-white",
        state === "active" && "bg-accent text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_16%,transparent)]",
        state === "next" && "border border-accent/35 bg-surface text-accent-ink",
      )}
    >
      {state === "done" ? <Icon name="check" size={14} /> : n}
    </span>
  );
}

/**
 * How giving access works, under the form: the same three steps the share panel then walks
 * through once someone has been added.
 */
export function InviteSteps() {
  const steps: { title: string; body: string }[] = [
    { title: "Add their work email", body: "Choose what they can do, then Give access." },
    { title: "Send their invite link", body: "By email, WhatsApp or chat. Saver Option doesn't send it for you." },
    { title: "They join with Google", body: "They sign in with that same email and choose Join." },
  ];
  return (
    <div className="rounded-2xl border border-line bg-subtle/50 px-4 py-4 sm:px-5">
      <p className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-faint">How it works</p>
      <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6" aria-label="How giving access works" data-invite-steps>
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-3 sm:flex-col sm:gap-2.5">
            {/* The line to the next step: down on phones, across on wider screens. */}
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-[-16px] left-3.5 top-8 w-px bg-line-strong sm:bottom-auto sm:left-10 sm:right-[-16px] sm:top-3.5 sm:h-px sm:w-auto" />
            )}
            <StepMarker n={i + 1} state="next" />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-fg">{step.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Shown under the form right after giving access (and from "Share invite"): the same three steps,
 * now with the first one done. The person's own invite link and a ready-to-send message, with
 * one-click ways to send it. Saver Option doesn't email anyone; the inviter sends it from their
 * own email, WhatsApp, Slack or Teams.
 */
export function InviteSharePanel({
  email,
  role,
  workspace,
  url,
  message,
  doneHref,
}: {
  email: string;
  role: string;
  workspace: string;
  url: string;
  message: string;
  /** Where "Done" goes: the same page without this invite open. */
  doneHref: string;
}) {
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
  const line = <span aria-hidden="true" className="absolute bottom-0 left-3.5 top-8 w-px bg-line-strong" />;
  return (
    <section id="invite" className="so-rise scroll-mt-24 rounded-2xl border border-accent/25 bg-accent-soft/40 p-4 sm:p-5" data-invite-share>
      <ol>
        <li className="relative flex gap-3.5 pb-5">
          {line}
          <StepMarker n={1} state="done" />
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-3 gap-y-1 pt-1">
            <div className="min-w-0">
              <p className="break-words text-[14.5px] font-semibold text-fg">
                Access added for {email} · {role}
              </p>
              <p className="mt-0.5 text-[12.5px] text-muted">Their access starts when they join. To invite someone else, use the form above.</p>
            </div>
            <Link href={doneHref} scroll={false} className={buttonClass("ghost", "sm", "-mr-2 -mt-1")} data-invite-done>
              Done
            </Link>
          </div>
        </li>
        <li className="relative flex gap-3.5 pb-5">
          {line}
          <StepMarker n={2} state="active" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[14px] font-semibold text-fg">Send their invite link</p>
            <p className="mt-0.5 text-[12.5px] text-muted">Copy this message, or send it straight from your email or WhatsApp.</p>
            <div className="mt-3 whitespace-pre-line break-words rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-fg shadow-[0_1px_2px_rgb(0_0_0/0.04)]" data-invite-message>
              {message}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => copy("message")} className={buttonClass("primary", "sm")} data-copy-invite>
                <Icon name={copied === "message" ? "check" : "copy"} size={14} /> {copied === "message" ? "Copied" : "Copy message"}
              </button>
              <button type="button" onClick={() => copy("link")} className={buttonClass("secondary", "sm")}>
                <Icon name={copied === "link" ? "check" : "link"} size={14} /> {copied === "link" ? "Copied" : "Copy link only"}
              </button>
              <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-line-strong sm:block" />
              <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`} className={buttonClass("secondary", "sm")}>
                <Icon name="mail" size={14} /> Email from my account
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                <Icon name="external" size={14} /> WhatsApp
              </a>
            </div>
            <p className="mt-2 text-[12.5px] text-faint">Or paste it in Slack, Teams or any chat.</p>
          </div>
        </li>
        <li className="relative flex gap-3.5">
          <StepMarker n={3} state="next" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="break-words text-[14px] font-semibold text-fg">They join with Google as {email}</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
              The link tells them which account to use. Once they choose <strong className="font-medium text-fg">Join</strong>, they move to Members.
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
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
