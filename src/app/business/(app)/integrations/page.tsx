import Link from "next/link";
import type { ReactNode } from "react";
import { Card, IconTile, LinkButton, PageHeader, Pill, type KpiTone } from "@/components/business/ui";
import type { IconProps } from "@/components/ui/icon";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { googleSignInEnabled } from "@/lib/server/supabase";

export const metadata = { title: "Integrations" };

type Status = "available" | "active" | "built_in" | "not_configured" | "off" | "planned";
const statusPill: Record<Status, { label: string; tone: "success" | "accent" | "warn" | "neutral" | "outline" }> = {
  available: { label: "Available", tone: "success" },
  active: { label: "Active", tone: "success" },
  built_in: { label: "Built in", tone: "accent" },
  not_configured: { label: "Not configured", tone: "warn" },
  off: { label: "Not switched on", tone: "warn" },
  planned: { label: "Planned — not available yet", tone: "outline" },
};

const AI_CLIENTS = ["Claude", "ChatGPT", "Gemini", "Grok"];

export default async function IntegrationsPage() {
  const ctx = await requireBizContext("/business/integrations");
  const google = await googleSignInEnabled();
  const canImport = can(ctx.role, "records.manage");

  return (
    <>
      <PageHeader
        title="Integrations"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Integrations" }]}
        description="What Saver Option Business connects to today, and what isn't available yet. Nothing here reads your bank, cards or vendor accounts — the workspace holds what your team records."
      />

      <h2 className="mb-3 text-[15px] font-semibold text-fg">Available</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Integration
          icon="download"
          tone="blue"
          title="CSV import"
          status="available"
          action={canImport ? <LinkButton href="/business/subscriptions/import">Import a CSV</LinkButton> : <span className="text-[12.5px] text-faint">Owners, admins and finance can import.</span>}
        >
          Bring in subscriptions from a spreadsheet or an export from your finance tools: map the columns, preview every row with its problems, and confirm
          before anything is saved. Exports to CSV are on Subscriptions and Reports.
        </Integration>

        <Integration icon="sparkles" tone="violet" title="AI clients (MCP)" status="available" action={<LinkButton href="/business/settings/mcp">Connections</LinkButton>}>
          <p>
            One remote MCP server lets AI assistants read your workspace (and, with your permission, add or update subscriptions) through the same permission checks as
            this app. You approve each connection and can revoke it at any time.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Client compatibility">
            {AI_CLIENTS.map((c) => (
              <li key={c}>
                <Pill tone="neutral">
                  {c} · not yet tested
                </Pill>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-faint">A client is listed as supported only after a connection has been tested with it.</p>
        </Integration>

        <Integration icon="tag" tone="orange" title="Saver Option Deals" status="built_in" action={<LinkButton href="/business/deals">Deals for your stack</LinkButton>}>
          Live listings from the Saver Option deals catalog matched to the software you record, used by the Spend Detective&apos;s deal findings. Terms and prices are
          shown only as each listing states them.
        </Integration>

        <Integration icon="lock" tone="green" title="Google sign-in" status={google ? "active" : "off"}>
          {google
            ? "Members sign in with Google. Saver Option receives only name, email address and profile picture — no Gmail, Drive or Calendar access."
            : "Sign-in with Google isn't switched on for this site yet, so new members can't sign in. It needs the Google provider enabled in the authentication settings."}
        </Integration>

        <Integration
          icon="mail"
          tone="amber"
          title="Email reminders"
          status="not_configured"
          action={<LinkButton href="/business/settings/notifications">Reminder settings</LinkButton>}
        >
          No email provider is configured, so no reminder or invitation emails are sent. Renewal reminders appear as in-app notifications for every member, on the
          days you choose.
        </Integration>
      </div>

      <h2 className="mb-3 mt-8 text-[15px] font-semibold text-fg">Planned</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Integration icon="file" tone="blue" title="Accounting & expense tools" status="planned">
          Importing software expenses directly from accounting or expense software. Until then, export a CSV from those tools and use CSV import.
        </Integration>
        <Integration icon="credit-card" tone="pink" title="Card & bank feeds" status="planned">
          Detecting subscriptions from card or bank transactions. Not available: Saver Option doesn&apos;t connect to financial accounts.
        </Integration>
        <Integration icon="users" tone="violet" title="SSO & usage data" status="planned">
          Seat usage from single sign-on or vendor admin APIs. Without it, seats count as used when they&apos;re assigned or reported, and usage is never assumed.
        </Integration>
      </div>

      <p className="mt-8 text-[12.5px] text-faint">
        Questions about how data is handled? See{" "}
        <Link href="/business/settings/security" className="underline underline-offset-2 hover:text-fg">
          Security
        </Link>{" "}
        and the{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
          privacy policy
        </Link>
        .
      </p>
    </>
  );
}

function Integration({ icon, tone, title, status, action, children }: { icon: IconProps["name"]; tone: KpiTone; title: string; status: Status; action?: ReactNode; children: ReactNode }) {
  const pill = statusPill[status];
  return (
    <Card className={status === "planned" ? "border-dashed" : undefined} bodyClassName="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <IconTile icon={icon} tone={tone} size={36} className={status === "planned" ? "opacity-60 grayscale" : undefined} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold text-fg">{title}</h3>
            <Pill tone={pill.tone}>{pill.label}</Pill>
          </div>
          <div className="mt-1.5 text-[13px] leading-relaxed text-muted">{children}</div>
        </div>
      </div>
      {action && <div className="mt-4 flex justify-end pt-1 sm:mt-auto">{action}</div>}
    </Card>
  );
}
