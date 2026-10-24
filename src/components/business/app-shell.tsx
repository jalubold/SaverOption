import Link from "next/link";
import type { ReactNode } from "react";
import { createDemoAction, switchWorkspaceAction } from "@/app/business/actions/workspace";
import type { BillingNotice, TrialBadge } from "@/lib/business/billing";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { displayName, type BizContext } from "@/lib/server/business/context";
import { BrandMark } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { MobileMenuButton, Popover, QuickJump, SidebarFrame, SidebarNav, type NavGroup, type QuickAction } from "@/components/business/shell-client";

/**
 * The sidebar: a flat list, most-used first, with plain section labels —
 * Overview and the assistant, then the records people manage, what they tell
 * them, and the workspace. Departments and Integrations live under Settings
 * (and in Quick jump), so the list stays short.
 */
const groups: NavGroup[] = [
  {
    id: "home",
    label: null,
    items: [
      { label: "Overview", href: "/business/dashboard", icon: "home", keywords: "dashboard home" },
      { label: "AI Assistant", href: "/business/assistant", icon: "sparkles", keywords: "chat claude ask ai" },
    ],
  },
  {
    id: "manage",
    label: "Manage",
    items: [
      { label: "Subscriptions", href: "/business/subscriptions", icon: "layers", keywords: "plans billing" },
      { label: "Renewals", href: "/business/renewals", icon: "calendar", keywords: "upcoming deadlines calendar" },
      { label: "Software", href: "/business/software", icon: "box", keywords: "inventory tools apps" },
      { label: "Licenses & seats", href: "/business/licenses", icon: "key", keywords: "seats utilization users" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { label: "Analytics", href: "/business/analytics", icon: "trending-up", keywords: "spend charts vendors categories" },
      { label: "Savings", href: "/business/savings", icon: "piggy", keywords: "opportunities save money" },
      { label: "Reports", href: "/business/reports", icon: "chart", keywords: "export csv" },
      { label: "Deals", href: "/business/deals", icon: "tag", keywords: "discounts offers stack" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { label: "Team", href: "/business/team", icon: "users", keywords: "members invite people roles" },
      { label: "AI clients (MCP)", href: "/business/settings/mcp", icon: "code", keywords: "mcp claude chatgpt gemini grok connect ai" },
      { label: "Settings", href: "/business/settings", icon: "gear", keywords: "company preferences notifications security" },
    ],
  },
];

/** Reached from Settings rather than the sidebar; listed in Quick jump. */
const morePages: QuickAction[] = [
  { label: "Departments", href: "/business/settings/departments", icon: "building", group: "Workspace", keywords: "teams org" },
  { label: "Integrations", href: "/business/integrations", icon: "link", group: "Workspace", keywords: "csv import connect" },
];

/** Pages from the sidebar plus common actions, for Quick jump. */
function quickActions(ctx: BizContext): QuickAction[] {
  const pages = [...groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.label ?? "Overview" }))), ...morePages];
  const actions: QuickAction[] = [
    ...(can(ctx.role, "records.manage")
      ? [
          { label: "Add software", href: "/business/subscriptions/new", icon: "plus" as const, group: "Action", keywords: "new subscription create" },
          { label: "Import subscriptions from CSV", href: "/business/subscriptions/import", icon: "download" as const, group: "Action", keywords: "upload spreadsheet" },
        ]
      : []),
    { label: "Plan & billing", href: "/business/settings/billing", icon: "credit-card", group: "Settings", keywords: "upgrade subscribe trial pro business invoice" },
    { label: "Notifications", href: "/business/notifications", icon: "bell", group: "Account", keywords: "reminders alerts" },
    { label: "Help & docs", href: "/business/docs", icon: "info", group: "Help", keywords: "documentation guide support" },
  ];
  return [...pages, ...actions];
}

function Avatar({ name, src, size = 28 }: { name: string; src: string | null; size?: number }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- Google profile photo; no image optimisation needed
    <img src={src} alt="" width={size} height={size} referrerPolicy="no-referrer" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-ink" style={{ width: size, height: size }}>
      {initials || "?"}
    </span>
  );
}

function WorkspaceSwitcher({ ctx, collapsed }: { ctx: BizContext; collapsed?: boolean }) {
  const hasDemo = ctx.memberships.some((m) => m.isDemo);
  const trigger = (
    <span className={cn("flex w-full items-center gap-2.5 rounded-lg border border-line px-2 py-2 text-left hover:bg-subtle", collapsed && "justify-center border-0 px-0")}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-subtle text-[12px] font-semibold text-fg">{ctx.workspace.name.slice(0, 1).toUpperCase()}</span>
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-fg">{ctx.workspace.name}</span>
            <span className="block text-[11.5px] text-faint">{roleLabels[ctx.role]}</span>
          </span>
          <Icon name="chevron-down" size={14} className="text-faint" />
        </>
      )}
    </span>
  );
  return (
    <Popover label="Switch workspace" trigger={trigger}>
      <p className="px-2 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">Workspaces</p>
      <ul>
        {ctx.memberships.map((m) => (
          <li key={m.workspaceId}>
            <form action={switchWorkspaceAction}>
              <input type="hidden" name="workspaceId" value={m.workspaceId} />
              <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-subtle">
                <span className="min-w-0 flex-1 truncate">{m.name}</span>
                {m.isDemo && <span className="rounded bg-warn-soft px-1 text-[10.5px] font-medium text-warn">Demo</span>}
                {m.workspaceId === ctx.workspace.id && <Icon name="check" size={14} className="text-accent-ink" />}
              </button>
            </form>
          </li>
        ))}
      </ul>
      <div className="mt-1 border-t border-line pt-1">
        <Link href="/business/onboarding?new=1" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-fg">
          <Icon name="plus" size={14} /> Create a workspace
        </Link>
        {!hasDemo && (
          <form action={createDemoAction}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-muted hover:bg-subtle hover:text-fg">
              <Icon name="sparkles" size={14} /> Open a demo workspace
            </button>
          </form>
        )}
      </div>
    </Popover>
  );
}

/** What the shell shows about the plan: an Upgrade button (owners and admins) and the trial card. */
export interface ShellPlan {
  /** Label of the header button, or null when there's nothing to buy (or the person can't). */
  upgrade: string | null;
  trial: TrialBadge | null;
}

function TrialCard({ trial, upgrade, collapsed }: { trial: TrialBadge; upgrade: string | null; collapsed?: boolean }) {
  if (collapsed) {
    return (
      <Link href="/business/settings/billing#plans" className="mb-2 flex h-9 items-center justify-center rounded-lg text-accent-ink hover:bg-subtle" title={`Free trial · ${trial.left} left`}>
        <Icon name="calendar" size={16} />
        <span className="sr-only">Free trial, {trial.left} left</span>
      </Link>
    );
  }
  return (
    <div className="mb-2 rounded-xl border border-line bg-subtle/60 px-3 py-2.5" data-trial-card>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[12.5px] font-semibold text-fg">Free trial</p>
        <p className="text-[11.5px] text-faint">{trial.left} left</p>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Free trial used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(trial.used * 100)}>
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, Math.round(trial.used * 100))}%` }} />
      </div>
      {upgrade ? (
        <Link href="/business/settings/billing#plans" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent-ink hover:underline underline-offset-2">
          {upgrade} now <Icon name="arrow-right" size={12} />
        </Link>
      ) : (
        <p className="mt-1.5 text-[11.5px] text-faint">An owner or admin can upgrade any time.</p>
      )}
    </div>
  );
}

function Sidebar({ ctx, plan, collapsed }: { ctx: BizContext; plan: ShellPlan; collapsed?: boolean }) {
  return (
    <>
      <Link href="/business/dashboard" className={cn("flex h-14 shrink-0 items-center gap-2 px-1.5", collapsed && "justify-center px-0")} aria-label="Saver Option Business overview">
        <BrandMark size={26} />
        {!collapsed && (
          <span className="text-[14px] font-semibold tracking-tight text-fg">
            Saver Option <span className="text-accent-ink">Business</span>
          </span>
        )}
      </Link>
      <div className="mb-3">
        <WorkspaceSwitcher ctx={ctx} collapsed={collapsed} />
      </div>
      {can(ctx.role, "records.manage") && (
        <Link href="/business/subscriptions/new" className={buttonClass("primary", "sm", cn("mb-5 w-full", collapsed && "px-0"))} title={collapsed ? "Add software" : undefined}>
          <Icon name="plus" size={15} />
          <span className={collapsed ? "sr-only" : undefined}>Add software</span>
        </Link>
      )}
      <SidebarNav groups={groups} collapsed={collapsed} />
      <div className="mt-auto pt-4">
        {plan.trial && <TrialCard trial={plan.trial} upgrade={plan.upgrade} collapsed={collapsed} />}
      </div>
    </>
  );
}

const noticeTone: Record<BillingNotice["tone"], string> = {
  accent: "border-accent/25 bg-accent-soft",
  warn: "border-warn/30 bg-warn-soft",
  danger: "border-danger/30 bg-danger/10",
};

function BillingStrip({ notice }: { notice: BillingNotice }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-[12.5px] text-fg sm:px-6", noticeTone[notice.tone])} data-billing-notice={notice.tone}>
      <span className="min-w-0">
        <Icon name={notice.tone === "accent" ? "calendar" : "alert"} size={13} className={cn("mr-1.5 inline", notice.tone === "danger" ? "text-danger" : notice.tone === "warn" ? "text-warn" : "text-accent-ink")} />
        <strong className="font-semibold">{notice.title}.</strong> {notice.body}
      </span>
      {notice.cta && (
        <Link href="/business/settings/billing" className="ml-auto shrink-0 font-semibold text-accent-ink underline underline-offset-2">
          {notice.cta} →
        </Link>
      )}
    </div>
  );
}

export function AppShell({ ctx, unread, notice, plan, children }: { ctx: BizContext; unread: number; notice: BillingNotice | null; plan: ShellPlan; children: ReactNode }) {
  const name = displayName(ctx.user);
  return (
    <SidebarFrame sidebar={<Sidebar ctx={ctx} plan={plan} />} collapsedSidebar={<Sidebar ctx={ctx} plan={plan} collapsed />}>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg/95 px-3 backdrop-blur sm:px-5">
        <MobileMenuButton />
        <form action="/business/search" method="get" role="search" className="relative min-w-0 max-w-md flex-1">
          <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <label htmlFor="biz-search" className="sr-only">
            Search software, subscriptions, vendors and people
          </label>
          <input
            id="biz-search"
            name="q"
            type="search"
            placeholder="Search software, vendors, people…"
            className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-[13.5px] outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </form>
        <QuickJump items={quickActions(ctx)} />
        <div className="ml-auto flex items-center gap-1">
          {plan.upgrade && (
            <Link href="/business/settings/billing#plans" className={buttonClass("primary", "sm", "mr-1 hidden sm:inline-flex")} data-upgrade-button>
              <Icon name="sparkles" size={14} />
              {plan.upgrade}
            </Link>
          )}
          <Link href="/business/notifications" className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
            <Icon name="bell" size={18} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] font-semibold leading-4 text-accent-fg">{unread > 99 ? "99+" : unread}</span>
            )}
          </Link>
          <Popover
            label="Account menu"
            align="right"
            className="w-auto"
            trigger={
              <span className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-subtle">
                <Avatar name={name} src={ctx.user.avatarUrl} />
                <span className="hidden max-w-36 truncate text-[13px] font-medium text-fg sm:block">{name}</span>
                <Icon name="chevron-down" size={13} className="hidden text-faint sm:block" />
              </span>
            }
          >
            <div className="flex items-center gap-2.5 px-2 py-2">
              <Avatar name={name} src={ctx.user.avatarUrl} size={34} />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold">{name}</p>
                <p className="truncate text-[12px] text-faint">{ctx.user.email}</p>
              </div>
            </div>
            <div className="border-t border-line pt-1">
              <Link href="/business/settings" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-fg">
                <Icon name="user" size={14} /> Account settings
              </Link>
              <Link href="/business/settings/billing" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-fg">
                <Icon name="credit-card" size={14} /> Plan &amp; billing
              </Link>
              <Link href="/deals" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-fg">
                <Icon name="tag" size={14} /> Saver Option deals
              </Link>
              <form action="/auth/sign-out" method="post">
                <input type="hidden" name="next" value="/business" />
                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-muted hover:bg-subtle hover:text-fg">
                  <Icon name="log-out" size={14} /> Sign out
                </button>
              </form>
            </div>
          </Popover>
        </div>
      </header>
      {notice && <BillingStrip notice={notice} />}
      {ctx.workspace.isDemo && (
        <div className="border-b border-warn/30 bg-warn-soft px-4 py-2 text-[12.5px] text-fg sm:px-6">
          <Icon name="info" size={13} className="mr-1.5 inline text-warn" />
          <strong className="font-semibold">Demo workspace.</strong> Northwind Studio is a fictional company with sample prices — not real customer data or vendor quotes. Reset it any time in{" "}
          <Link href="/business/settings" className="underline underline-offset-2">
            Settings
          </Link>
          .
        </div>
      )}
      <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </SidebarFrame>
  );
}
