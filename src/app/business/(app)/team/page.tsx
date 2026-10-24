import Link from "next/link";
import { LogoStack } from "@/components/business/software-logo";
import { AddPersonForm, CopyLinkButton, EditPersonForm, InviteForm, RemoveMemberButton, RevokeInvitationButton, RoleSelectForm } from "@/components/business/team-forms";
import { Card, EmptyState, InlineNote, PageHeader, Pill, TableWrap } from "@/components/business/ui";
import { FormMessage } from "@/components/ui/form";
import { siteConfig } from "@/config/site";
import { formatIsoDate } from "@/lib/business/calc";
import { roleDescriptions, roleLabels, ROLES, type Role } from "@/lib/business/constants";
import { assignableRoles, can, canManageMember } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getMembers, getOpenInvitations, getPeople, getSeatAssignments, getSubscriptions } from "@/lib/server/business/data";

export const metadata = { title: "Team Members" };

const roleTone: Record<Role, "accent" | "neutral" | "outline"> = { owner: "accent", admin: "accent", finance: "neutral", member: "neutral", viewer: "outline" };

export default async function TeamPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await props.searchParams;
  const ctx = await requireBizContext("/business/team", { billing: "open" });
  const ws = ctx.workspace.id;
  const [members, invitations, people, departments, seats, subs] = await Promise.all([getMembers(ws), getOpenInvitations(ws), getPeople(ws), getDepartments(ws), getSeatAssignments(ws), getSubscriptions(ws)]);
  const fmt = ctx.workspace.dateFormat;
  const manageMembers = can(ctx.role, "members.manage");
  const manageDirectory = can(ctx.role, "directory.manage");
  const addPeople = can(ctx.role, "records.manage");
  const grantable = assignableRoles(ctx.role).map((r) => ({ value: r, label: roleLabels[r] }));
  const seatCount = new Map<string, number>();
  // The tools each person holds a seat on, for a logo row in the directory.
  const subById = new Map(subs.map((x) => [x.id, x]));
  const seatTools = new Map<string, { name: string; src: string | null }[]>();
  for (const a of seats) {
    if (a.releasedAt) continue;
    seatCount.set(a.personId, (seatCount.get(a.personId) ?? 0) + 1);
    const sub = subById.get(a.subscriptionId);
    if (sub) seatTools.set(a.personId, [...(seatTools.get(a.personId) ?? []), { name: sub.softwareName, src: sub.logoSrc }]);
  }
  const deptOptions = departments.filter((d) => !d.archivedAt).map((d) => ({ value: d.id, label: d.name }));
  const editing = typeof q.edit === "string" && manageDirectory ? people.find((p) => p.id === q.edit) : undefined;
  const signInUrl = `${siteConfig.url}/business/login`;

  return (
    <>
      <PageHeader
        title="Team Members"
        description="Who can use this workspace, and the directory of people who own software or hold seats."
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Team Members" }]}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Workspace members" description="People who sign in to this workspace, with their role." className="xl:col-span-2">
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="num">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const self = m.userId === ctx.user.id;
                  const manageable = manageMembers && !self && canManageMember(ctx.role, m.role);
                  const options = grantable.some((o) => o.value === m.role) ? grantable : [{ value: m.role, label: roleLabels[m.role] }, ...grantable];
                  return (
                    <tr key={m.id}>
                      <td>
                        <span className="font-medium">{m.name ?? m.email ?? "Unknown"}</span>
                        {self && <span className="ml-1.5 text-[12px] text-faint">(you)</span>}
                        {m.email && <span className="block text-[12.5px] text-faint">{m.email}</span>}
                      </td>
                      <td>{manageable ? <RoleSelectForm workspaceId={ws} membershipId={m.id} role={m.role} options={options} /> : <Pill tone={roleTone[m.role]}>{roleLabels[m.role]}</Pill>}</td>
                      <td className="whitespace-nowrap">{formatIsoDate(m.createdAt.toISOString().slice(0, 10), fmt)}</td>
                      <td className="num">
                        {manageable && <RemoveMemberButton workspaceId={ws} membershipId={m.id} name={m.name ?? m.email ?? "this member"} self={false} />}
                        {self && m.role !== "owner" && <RemoveMemberButton workspaceId={ws} membershipId={m.id} name="you" self />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        <Card title="Roles">
          <ul className="space-y-2.5">
            {ROLES.map((r) => (
              <li key={r}>
                <Pill tone={roleTone[r]}>{roleLabels[r]}</Pill>
                <p className="mt-1 text-[12.5px] text-muted">{roleDescriptions[r]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-faint">Roles are enforced on the server for every change, not just hidden in the interface.</p>
        </Card>
      </div>

      {manageMembers && (
        <Card title="Give access by email" description="Add a colleague's work email and the role they should have." className="mt-5">
          <div className="space-y-4">
            <InlineNote title="No email is sent">
              Saver Option doesn&apos;t have an email provider set up, so it can&apos;t send invitations. After adding someone, share the sign-in link with them
              yourself. They sign in with Google using exactly that address, then choose <strong>Join workspace</strong> on the setup page.
            </InlineNote>
            <CopyLinkButton url={signInUrl} />
            {grantable.length > 0 ? <InviteForm workspaceId={ws} roles={grantable} /> : <p className="text-[13px] text-faint">Your role can&apos;t grant access.</p>}
            {invitations.length > 0 && (
              <div>
                <h3 className="mb-2 text-[13px] font-semibold">Waiting for sign-in</h3>
                <TableWrap>
                  <table className="biz-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Added</th>
                        <th className="num">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((i) => (
                        <tr key={i.id}>
                          <td className="font-medium">{i.email}</td>
                          <td>
                            <Pill tone={roleTone[i.role]}>{roleLabels[i.role]}</Pill>
                          </td>
                          <td className="whitespace-nowrap">{formatIsoDate(i.createdAt.toISOString().slice(0, 10), fmt)}</td>
                          <td className="num">
                            <RevokeInvitationButton workspaceId={ws} invitationId={i.id} email={i.email} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card
        id="people"
        title="People directory"
        description="Everyone who owns software or holds a seat. Most of them never sign in — adding someone here doesn't give them access."
        className="mt-5"
      >
        {q.saved === "1" && (
          <div className="mb-4">
            <FormMessage tone="success">Changes saved.</FormMessage>
          </div>
        )}
        {editing && (
          <div className="mb-5 rounded-xl border border-line p-4">
            <h3 className="mb-3 text-[14px] font-semibold">Edit {editing.name}</h3>
            <EditPersonForm
              workspaceId={ws}
              person={editing}
              departments={[...deptOptions, ...(editing.departmentId && !deptOptions.some((d) => d.value === editing.departmentId) ? [{ value: editing.departmentId, label: `${editing.departmentName ?? "Archived"} (archived)` }] : [])]}
              activeSeats={seatCount.get(editing.id) ?? 0}
            />
          </div>
        )}
        {people.length === 0 ? (
          <EmptyState icon="users" title="No one in the directory yet">
            Add the people who use your company&apos;s software, so you can assign seats and owners.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th className="num">Seats</th>
                  <th>Status</th>
                  <th className="num">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="font-medium">{p.name}</span>
                      {p.userId && <Pill tone="accent" className="ml-1.5">App access</Pill>}
                      {p.email && <span className="block text-[12.5px] text-faint">{p.email}</span>}
                    </td>
                    <td>{p.title ?? <span className="text-faint">—</span>}</td>
                    <td>{p.departmentName ?? <span className="text-faint">—</span>}</td>
                    <td className="num">
                      <span className="inline-flex items-center justify-end gap-2">
                        {(seatTools.get(p.id)?.length ?? 0) > 0 && <LogoStack items={seatTools.get(p.id)!} max={4} size={22} />}
                        <span className="tabular">{seatCount.get(p.id) ?? 0}</span>
                      </span>
                    </td>
                    <td>{p.status === "active" ? <Pill tone="success">Active</Pill> : <Pill tone="outline">Inactive</Pill>}</td>
                    <td className="num">
                      {manageDirectory && (
                        <Link href={`/business/team?edit=${p.id}#people`} className="text-[13px] text-accent-ink hover:underline">
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
        {addPeople && (
          <div className="mt-5 border-t border-line pt-4">
            <h3 className="mb-3 text-[13.5px] font-semibold">Add a person</h3>
            <AddPersonForm workspaceId={ws} departments={deptOptions} />
          </div>
        )}
      </Card>
    </>
  );
}
