import Link from "next/link";
import { DeleteWorkspaceForm, ResetDemoForm } from "@/components/business/settings-forms";
import { RemoveMemberButton } from "@/components/business/team-forms";
import { Card, DefinitionList, InlineNote, LinkButton, PageHeader, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { formatIsoDate } from "@/lib/business/calc";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { displayName, requireBizContext } from "@/lib/server/business/context";
import { getMembers } from "@/lib/server/business/data";

export const metadata = { title: "Settings" };

const sections = [
  { href: "/business/settings/billing", label: "Plan & billing", icon: "credit-card", body: "Your plan, the free trial, payments and invoices (handled by Creem)." },
  { href: "/business/settings/company", label: "Company", icon: "building", body: "Name, logo, industry, size and contact details." },
  { href: "/business/settings/departments", label: "Departments", icon: "users", body: "Create, rename and archive departments; assign people." },
  { href: "/business/settings/notifications", label: "Notifications", icon: "bell", body: "Renewal reminder windows and in-app notifications." },
  { href: "/business/settings/preferences", label: "Preferences", icon: "gear", body: "Default currency, time zone, fiscal year and date format." },
  { href: "/business/settings/security", label: "Security", icon: "shield", body: "Sign-in, sessions, how workspace data is protected, and the audit log." },
  { href: "/business/settings/mcp", label: "AI clients (MCP)", icon: "sparkles", body: "Connections from AI assistants to this workspace; revoke any of them." },
] as const;

export default async function SettingsPage() {
  const ctx = await requireBizContext("/business/settings", { billing: "open" });
  const ws = ctx.workspace;
  const me = (await getMembers(ws.id)).find((m) => m.userId === ctx.user.id);
  const name = displayName(ctx.user);

  return (
    <>
      <PageHeader title="Settings" description="Your account and this workspace." crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Settings" }]} />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Your account">
          <div className="flex items-center gap-3">
            {ctx.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- Google profile photo
              <img src={ctx.user.avatarUrl} alt="" width={48} height={48} referrerPolicy="no-referrer" className="size-12 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-[15px] font-semibold text-accent-ink">
                {name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold">{name}</p>
              <p className="truncate text-[13px] text-muted">{ctx.user.email}</p>
              <p className="mt-0.5 text-[12px] text-faint">
                Role in {ws.name}: <Pill tone="neutral">{roleLabels[ctx.role]}</Pill>
              </p>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-muted">
            You sign in with Google. Saver Option only receives your name, email address and profile picture — it has no access to Gmail, Drive or Calendar, and
            doesn&apos;t keep Google access tokens.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <form action="/auth/sign-out" method="post">
              <input type="hidden" name="next" value="/business" />
              <button type="submit" className={buttonClass("secondary", "sm")}>
                <Icon name="log-out" size={14} /> Sign out
              </button>
            </form>
            <form action="/auth/sign-out" method="post">
              <input type="hidden" name="next" value="/business" />
              <input type="hidden" name="scope" value="global" />
              <button type="submit" className={buttonClass("ghost", "sm")}>
                Sign out everywhere
              </button>
            </form>
          </div>
          <p className="mt-2 text-[12px] text-faint">“Sign out everywhere” ends your sessions on every device and browser, not just this one.</p>
        </Card>

        <Card title="Workspace" action={<Pill tone={ws.isDemo ? "warn" : "neutral"}>{ws.isDemo ? "Demo" : "Workspace"}</Pill>}>
          <DefinitionList
            items={[
              { label: "Name", value: ws.name },
              { label: "Created", value: formatIsoDate(ws.createdAt.toISOString().slice(0, 10), ws.dateFormat) },
              { label: "Default currency", value: ws.defaultCurrency },
              { label: "Time zone", value: ws.timeZone.replace(/_/g, " ") },
            ]}
          />
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {sections.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-subtle">
                  <Icon name={s.icon} size={16} className="text-faint" />
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium">{s.label}</span>
                    <span className="block text-[12.5px] text-muted">{s.body}</span>
                  </span>
                  <Icon name="chevron-right" size={14} className="ml-auto text-faint" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {can(ctx.role, "data.export") && (
        <Card title="Export your data" className="mt-5" action={<LinkButton href="/business/settings/export" icon="download">Download JSON</LinkButton>}>
          <p className="text-[13.5px] text-muted">
            A JSON file with everything in this workspace: settings, departments, the people directory, vendors, software, subscriptions with their cost
            history, payments, renewal outcomes, seat assignments, savings opportunities, confirmed savings and the latest 1,000 activity log entries. Only
            this workspace is included. For spreadsheets, use the CSV exports on the Subscriptions and Reports pages.
          </p>
        </Card>
      )}

      {ws.isDemo && (ctx.role === "owner" || ctx.role === "admin") && (
        <Card title="Demo workspace" className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-[13.5px] text-muted">
              Northwind Studio is a fictional company with sample prices, kept apart from your real workspaces. Resetting puts back the original sample data.
            </p>
            <ResetDemoForm workspaceId={ws.id} />
          </div>
        </Card>
      )}

      <Card title="Danger zone" className="mt-5 border-danger/30">
        {ctx.role === "owner" ? (
          <div className="space-y-3">
            <InlineNote tone="warn" title="Deleting is permanent">
              It removes {ws.name} and everything in it — subscriptions, people, payments, savings and the activity log — for every member. Export your data first
              if you might need it.
            </InlineNote>
            <DeleteWorkspaceForm workspaceId={ws.id} name={ws.name} />
          </div>
        ) : me ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13.5px] text-muted">Leave {ws.name}. You&apos;ll lose access until an owner or admin gives it back.</p>
            <RemoveMemberButton workspaceId={ws.id} membershipId={me.id} name="you" self />
          </div>
        ) : null}
      </Card>
    </>
  );
}
