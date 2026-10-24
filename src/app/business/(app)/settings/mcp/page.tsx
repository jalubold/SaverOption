import Link from "next/link";
import { CopyField } from "@/components/business/copy-field";
import { DisconnectForm } from "@/components/business/mcp-forms";
import { Card, EmptyState, InlineNote, PageHeader, Pill, TableWrap } from "@/components/business/ui";
import { formatIsoDate } from "@/lib/business/calc";
import { mcpClients, statusLabels } from "@/lib/business/mcp-clients";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { listConnections } from "@/lib/server/mcp/connections";
import { urlsFromHeaders } from "@/lib/server/mcp/pending";
import { toolsFor } from "@/lib/server/mcp/tools";
import { SCOPE_READ, SCOPE_WRITE } from "@/lib/server/mcp/oauth";

export const metadata = { title: "AI clients (MCP)" };

const day = (d: Date | null, fmt: string) => (d ? formatIsoDate(d.toISOString().slice(0, 10), fmt) : "—");

export default async function McpSettingsPage() {
  const ctx = await requireBizContext("/business/settings/mcp", { billing: "open" });
  const urls = await urlsFromHeaders();
  const connections = await listConnections(ctx);
  const fmt = ctx.workspace.dateFormat;
  const readTools = toolsFor([SCOPE_READ]);
  const writeTools = toolsFor([SCOPE_READ, SCOPE_WRITE]).filter((t) => t.write);
  const all = can(ctx.role, "members.manage");

  return (
    <>
      <PageHeader
        title="AI clients (MCP)"
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "AI clients (MCP)" }]}
        description="Connect an AI assistant that supports remote MCP servers to this workspace, so you can ask about spending, renewals and savings in plain language. Each connection is one person's, for one workspace, with the access they chose."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title="Server URL" description="Add this as a custom connector / remote MCP server in your AI client. It asks you to sign in with Google and choose a workspace and access level.">
          <CopyField value={urls.mcp} label="MCP server URL" />
          <ul className="mt-4 space-y-1.5 text-[13px] text-muted">
            <li>Transport: Streamable HTTP. Sign-in: OAuth 2.1 with PKCE (dynamic client registration).</li>
            <li>Access: read only, or read and change subscription records — every change is previewed and needs your confirmation.</li>
            <li>It can&apos;t cancel, renew or buy subscriptions, move money, or reach other workspaces.</li>
          </ul>
          <p className="mt-4 text-[13px]">
            <Link href="/business/docs/mcp" className="font-semibold text-accent-ink hover:underline">
              How it works and what each tool does →
            </Link>
            <span className="mx-2 text-faint">·</span>
            <Link href="/business/mcp#ask" className="font-semibold text-accent-ink hover:underline">
              Example questions →
            </Link>
          </p>
        </Card>
        <Card title="Client compatibility" description="Only clients marked Verified have been tested end to end with this server.">
          <ul className="divide-y divide-line">
            {mcpClients.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="min-w-0">
                  <Link href={`/business/docs/mcp/${c.id}`} className="text-[13.5px] font-medium text-fg hover:underline">
                    {c.name}
                  </Link>
                  <span className="block text-[12px] text-faint">{c.lastVerified ? `Last verified ${formatIsoDate(c.lastVerified, fmt)}` : "Never tested with this server"}</span>
                </span>
                <Pill tone={c.status === "verified" ? "success" : c.status === "partial" ? "accent" : "outline"}>{statusLabels[c.status]}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-5" title={all ? "Connections to this workspace" : "Your connections"} description={all ? "Everyone's AI client connections to this workspace. Disconnecting one ends its access immediately." : "AI clients you connected to this workspace. Owners and admins can see and disconnect everyone's."}>
        {connections.length === 0 ? (
          <EmptyState icon="sparkles" title="No AI clients connected">
            Add the server URL in an AI client that supports remote MCP servers; after you sign in and approve, the connection appears here.
          </EmptyState>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>App</th>
                  {all && <th>Connected by</th>}
                  <th>Access</th>
                  <th>Connected</th>
                  <th>Last used</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {connections.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="font-medium">{c.clientName ?? "Unnamed app"}</span>
                      <span className="block text-[11.5px] text-faint">Name as registered by the app</span>
                    </td>
                    {all && <td className="whitespace-nowrap">{c.userId === ctx.user.id ? "You" : c.userLabel}</td>}
                    <td>
                      <Pill tone={c.canWrite ? "warn" : "neutral"}>{c.canWrite ? "Read and change" : "Read only"}</Pill>
                    </td>
                    <td className="whitespace-nowrap">{day(c.createdAt, fmt)}</td>
                    <td className="whitespace-nowrap">{day(c.lastUsedAt, fmt)}</td>
                    <td className="text-right">
                      {(c.userId === ctx.user.id || all) && <DisconnectForm workspaceId={ctx.workspace.id} grantId={c.id} clientName={c.clientName ?? "this app"} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title="Read tools" description="Available on every connection, within your role.">
          <ul className="space-y-2">
            {readTools.map((t) => (
              <li key={t.name} className="text-[13px]">
                <code className="text-[12.5px] font-semibold text-fg">{t.name}</code>
                <span className="block text-muted">{t.title}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Change tools" description="Only on connections approved with “Read and change”, and only for Owner, Admin or Finance (members: records they own).">
          <ul className="space-y-2">
            {writeTools.map((t) => (
              <li key={t.name} className="text-[13px]">
                <code className="text-[12.5px] font-semibold text-fg">{t.name}</code>
                <span className="block text-muted">{t.title} — previews first, saves only with confirm</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <InlineNote>
              What the AI client receives is processed by that client under its own terms. Saver Option sends only what a tool returns — never the whole workspace.
            </InlineNote>
          </div>
        </Card>
      </div>
    </>
  );
}
