import Link from "next/link";
import type { ReactNode } from "react";
import { Card, DefinitionList, IconTile, LinkButton, PageHeader, Pill, type KpiTone } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { displayName, requireBizContext } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";

export const metadata = { title: "Security" };

const principles: { icon: IconProps["name"]; tone: KpiTone; title: string; body: ReactNode }[] = [
  {
    icon: "lock",
    tone: "violet",
    title: "Checked on the server, every time",
    body: "Each page load, form and AI-client request verifies your Google session and then your membership and role in this workspace. Hidden buttons are a convenience, not the protection.",
  },
  {
    icon: "shield",
    tone: "blue",
    title: "One workspace can't reach another",
    body: "Every query is filtered by the workspace, and the database itself links records only within the same workspace (composite foreign keys), whatever a request supplies.",
  },
  {
    icon: "key",
    tone: "green",
    title: "Tables locked to the server",
    body: "Row-level security is on with no public access, so the site's public database key can't read or change business data.",
  },
  {
    icon: "credit-card",
    tone: "orange",
    title: "No card numbers, no bank access",
    body: "A payment method is a short label such as “Company Visa ••4242”; anything that looks like a card number is refused. Saver Option doesn't connect to bank or card accounts.",
  },
  {
    icon: "user",
    tone: "pink",
    title: "Google basic profile only",
    body: "Sign-in asks Google for name, email address and profile picture — no Gmail, Drive or Calendar scopes — and doesn't keep Google access tokens.",
  },
  {
    icon: "file",
    tone: "amber",
    title: "Changes are logged",
    body: "Significant changes — records, seats, renewals, savings, members and roles — are written to the workspace's audit log with who made them.",
  },
];

async function activeConnections(workspaceId: string, userId: string): Promise<{ mine: number; workspace: number } | null> {
  try {
    const [r] = await db()`
      select count(*) filter (where user_id = ${userId})::int as mine, count(*)::int as workspace
      from biz_oauth_grants where workspace_id = ${workspaceId} and revoked_at is null`;
    return { mine: r.mine, workspace: r.workspace };
  } catch {
    return null;
  }
}

export default async function SecurityPage() {
  const ctx = await requireBizContext("/business/settings/security");
  const name = displayName(ctx.user);
  const connections = await activeConnections(ctx.workspace.id, ctx.user.id);
  const isAdmin = can(ctx.role, "members.manage");

  return (
    <>
      <PageHeader
        title="Security"
        crumbs={[
          { label: "Overview", href: "/business/dashboard" },
          { label: "Settings", href: "/business/settings" },
          { label: "Security" },
        ]}
        description="How you sign in, how to end sessions, and how this workspace's data is protected."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Your sign-in">
          <DefinitionList
            items={[
              { label: "Signed in as", value: name },
              { label: "Email", value: ctx.user.email },
              { label: "Method", value: "Google" },
              { label: `Role in ${ctx.workspace.name}`, value: <Pill tone="neutral">{roleLabels[ctx.role]}</Pill> },
            ]}
          />
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[13.5px] font-medium text-fg">Sign out of all devices</p>
            <p className="mt-0.5 text-[12.5px] text-muted">Ends your Saver Option sessions in every browser and device, including this one. AI client connections aren&apos;t affected — revoke those separately.</p>
            <form action="/auth/sign-out" method="post" className="mt-3">
              <input type="hidden" name="next" value="/business" />
              <input type="hidden" name="scope" value="global" />
              <button type="submit" className={buttonClass("secondary", "sm")}>
                <Icon name="log-out" size={14} /> Sign out of all devices
              </button>
            </form>
          </div>
        </Card>

        <Card title="AI client connections" action={<LinkButton href="/business/settings/mcp">Manage</LinkButton>}>
          {connections === null ? (
            <p className="text-[13.5px] text-muted">Connection details aren&apos;t available right now.</p>
          ) : (
            <p className="text-[13.5px] text-muted">
              <strong className="text-[1.4rem] font-semibold text-heading">{connections.mine}</strong> active connection{connections.mine === 1 ? "" : "s"} from AI clients you approved for this
              workspace{isAdmin ? ` · ${connections.workspace} across all members` : ""}.
            </p>
          )}
          <p className="mt-3 text-[12.5px] text-faint">
            Each connection acts as the person who approved it, with their role, and only in the workspace they chose. Revoking it stops every token issued for it.
          </p>
        </Card>

        <Card title="Your data">
          <ul className="space-y-2.5 text-[13.5px]">
            <li>
              <Link href="/business/reports#activity" className="flex items-center gap-2 font-medium text-fg hover:underline">
                <Icon name="file" size={15} className="text-faint" /> Audit log
              </Link>
              <span className="ml-6 block text-[12.5px] text-muted">Who changed what, and when.</span>
            </li>
            {can(ctx.role, "data.export") && (
              <li>
                <Link href="/business/settings/export" className="flex items-center gap-2 font-medium text-fg hover:underline">
                  <Icon name="download" size={15} className="text-faint" /> Export the workspace (JSON)
                </Link>
                <span className="ml-6 block text-[12.5px] text-muted">Everything in this workspace, as one file. CSV exports are on Subscriptions and Reports.</span>
              </li>
            )}
            <li>
              <Link href="/business/settings" className="flex items-center gap-2 font-medium text-fg hover:underline">
                <Icon name="trash" size={15} className="text-faint" /> Delete the workspace
              </Link>
              <span className="ml-6 block text-[12.5px] text-muted">{ctx.role === "owner" ? "In Settings → Danger zone. Deletes every record in it, permanently." : "Only the workspace owner can delete it."}</span>
            </li>
            <li>
              <Link href="/privacy" className="flex items-center gap-2 font-medium text-fg hover:underline">
                <Icon name="shield" size={15} className="text-faint" /> Privacy policy
              </Link>
            </li>
          </ul>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-[15px] font-semibold text-fg">How this workspace is protected</h2>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {principles.map((p) => (
          <li key={p.title} className="biz-card px-4 py-4">
            <IconTile icon={p.icon} tone={p.tone} size={34} />
            <h3 className="mt-3 text-[14.5px] font-semibold text-fg">{p.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
