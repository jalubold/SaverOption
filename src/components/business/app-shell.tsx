import Link from "next/link";
import type { ReactNode } from "react";
import { createDemoAction, switchWorkspaceAction } from "@/app/business/actions/workspace";
import type { BillingNotice, TrialBadge } from "@/lib/business/billing";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { assistantConfigured } from "@/lib/server/business/assistant";
import { displayName, type BizContext } from "@/lib/server/business/context";
import { BrandMark } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { DesktopMenuLinks, NavProgress } from "@/components/business/nav-progress";
import { MobileAccountButton, MobileMenuButton, MobileNav, MobileTitle, Popover, QuickJump, SectionTabs, SidebarFrame, SidebarNav, type NavSection, type QuickAction, type TabItem } from "@/components/business/shell-client";

/**
 * The sidebar has four places: the overview, the records people manage, what they tell them, and the
 * workspace. Each place's pages are the tabs at the top of its pages (SectionTabs), so the sidebar stays
 * at four, collapsed or not. Departments and the in-app assistant (when it's configured) are in
 * Settings or Quick jump.
 */
const sections: NavSection[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "home",
    items: [{ label: "Overview", href: "/business/dashboard", icon: "home", keywords: "dashboard home" }],
  },
  {
    id: "manage",
    label: "Manage",
    icon: "layers",
    items: [
      { label: "Subscriptions", href: "/business/subscriptions", icon: "layers", keywords: "plans billing" },
      { label: "Renewals", href: "/business/renewals", icon: "calendar", keywords: "upcoming deadlines calendar" },
      { label: "Software", href: "/business/software", icon: "box", keywords: "inventory tools apps" },
      { label: "Licenses & seats", short: "Licenses", href: "/business/licenses", icon: "key", keywords: "seats utilization users" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: "trending-up",
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
    icon: "building",
    items: [
      { label: "Team", href: "/business/team", icon: "users", keywords: "members invite people roles" },
      { label: "AI clients (MCP)", short: "AI clients", href: "/business/settings/mcp", icon: "code", keywords: "mcp claude chatgpt gemini grok connect ai" },
      { label: "Integrations", href: "/business/integrations", icon: "link", keywords: "csv import connect" },
      { label: "Settings", href: "/business/settings", icon: "gear", keywords: "company preferences notifications security billing" },
    ],
  },
];
const sectionPages = sections.flatMap((s) => s.items);

/** Reached from Settings rather than a tab; listed in Quick jump. */
const morePages: QuickAction[] = [{ label: "Departments", href: "/business/settings/departments", icon: "building", group: "Workspace", keywords: "teams org" }];
const assistantPage: QuickAction = { label: "AI Assistant", href: "/business/assistant", icon: "sparkles", group: "AI", keywords: "chat claude ask ai" };

/** Every page of the four places plus common actions, for Quick jump. */
function quickActions(ctx: BizContext): QuickAction[] {
  const pages = [...sections.flatMap((s) => s.items.map((it) => ({ ...it, group: s.label }))), ...morePages, ...(assistantConfigured() ? [assistantPage] : [])];
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
    { label: "Download for Mac", href: "/business/download", icon: "laptop", group: "Help", keywords: "desktop app macos install dock" },
  ];
  return [...pages, ...actions];
}

/**
 * The tab bar on phones and tablets: the same places as the sidebar, with Add software in the middle
 * for those who can add (Workspace is then in More). A tab is current on every page of its place.
 */
function mobileTabs(ctx: BizContext): TabItem[] {
  const [overview, manage, insights, workspace] = sections.map((s): TabItem => ({ label: s.label, href: s.items[0].href, icon: s.icon, paths: s.items.slice(1).map((it) => it.href) }));
  return can(ctx.role, "records.manage")
    ? [overview, manage, { label: "Add software", href: "/business/subscriptions/new", icon: "plus", primary: true }, insights]
    : [overview, manage, insights, workspace];
}

/** Names for the title bar on phones (the longest matching path wins). */
const pageTitles: { href: string; label: string }[] = [
  ...sectionPages.map(({ href, label }) => ({ href, label })),
  ...morePages.map(({ href, label }) => ({ href, label })),
  { href: "/business/subscriptions/new", label: "Add software" },
  { href: "/business/subscriptions/import", label: "Import" },
  { href: "/business/settings/billing", label: "Plan & billing" },
  { href: "/business/settings/notifications", label: "Notification settings" },
  { href: "/business/notifications", label: "Notifications" },
  { href: "/business/search", label: "Search" },
  { href: "/business/assistant", label: "AI Assistant" },
];

const tileTone: Record<string, string> = {
  "/business/software": "bg-[#e9f2ff] text-[#2563eb]",
  "/business/licenses": "bg-[#fff4e0] text-[#c2410c]",
  "/business/analytics": "bg-[#eaf7ef] text-[#15803d]",
  "/business/savings": "bg-[#fdeef4] text-[#be185d]",
  "/business/reports": "bg-[#eef0ff] text-[#4f46e5]",
  "/business/deals": "bg-[#fff1e6] text-[#ea580c]",
  "/business/team": "bg-[#e8f8f8] text-[#0f766e]",
  "/business/settings/mcp": "bg-[#f3ecff] text-[#7c3aed]",
  "/business/integrations": "bg-[#e9f2ff] text-[#2563eb]",
  "/business/settings": "bg-[#f1f1f4] text-[#52525b]",
};

/** The More sheet on phones and tablets: who's signed in, the workspace, the places not in the tab bar, and sign out. */
function MoreSheet({ ctx, plan, unread, tabs }: { ctx: BizContext; plan: ShellPlan; unread: number; tabs: TabItem[] }) {
  const name = displayName(ctx.user);
  const inTabs = new Set(tabs.map((t) => t.href));
  const pages = [...sections.filter((s) => !inTabs.has(s.items[0].href)).flatMap((s) => s.items), ...(assistantConfigured() ? [assistantPage] : [])];
  const row = "flex min-h-12 w-full items-center gap-3 px-3.5 text-left text-[15px] text-fg active:bg-subtle";
  return (
    <div className="space-y-4 pb-1">
      <div className="flex items-center gap-3 rounded-2xl bg-subtle/70 p-3">
        <Avatar name={name} src={ctx.user.avatarUrl} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{name}</p>
          <p className="truncate text-[12.5px] text-faint">{ctx.user.email}</p>
        </div>
        <Link href="/business/settings" className="inline-flex h-8 shrink-0 items-center rounded-full border border-line bg-surface px-3 text-[12.5px] font-medium text-fg">
          Account
        </Link>
      </div>

      <details className="group overflow-hidden rounded-2xl border border-line" data-more-workspace>
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3.5 py-2 [&::-webkit-details-marker]:hidden">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-subtle text-[14px] font-semibold text-fg">{ctx.workspace.name.slice(0, 1).toUpperCase()}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold">{ctx.workspace.name}</span>
            <span className="block text-[12.5px] text-faint">{roleLabels[ctx.role]}</span>
          </span>
          <span className="text-[13px] font-medium text-accent-ink">Switch</span>
          <Icon name="chevron-down" size={15} className="text-faint transition-transform group-open:rotate-180" />
        </summary>
        <ul className="border-t border-line">
          {ctx.memberships.map((m) => (
            <li key={m.workspaceId} className="border-b border-line last:border-b-0">
              <form action={switchWorkspaceAction}>
                <input type="hidden" name="workspaceId" value={m.workspaceId} />
                <button type="submit" className={row}>
                  <span className="min-w-0 flex-1 truncate">{m.name}</span>
                  {m.isDemo && <span className="pill pill-warn px-1.5 py-0 text-[10.5px]">Demo</span>}
                  {m.workspaceId === ctx.workspace.id && <Icon name="check" size={16} className="text-accent-ink" />}
                </button>
              </form>
            </li>
          ))}
          <li>
            <Link href="/business/onboarding?new=1" className={cn(row, "text-muted")}>
              <Icon name="plus" size={16} /> Create a workspace
            </Link>
          </li>
          {!ctx.memberships.some((m) => m.isDemo) && (
            <li className="border-t border-line">
              <form action={createDemoAction}>
                <button type="submit" className={cn(row, "text-muted")}>
                  <Icon name="sparkles" size={16} /> Open a demo workspace
                </button>
              </form>
            </li>
          )}
        </ul>
      </details>

      {pages.length > 0 && (
      <nav aria-label="More pages">
        <ul className={cn("grid gap-2", pages.length % 4 === 0 ? "grid-cols-4" : "grid-cols-3")} data-more-pages>
          {pages.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="tile flex h-[86px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-1 text-center active:bg-subtle">
                <span className={cn("flex size-9 items-center justify-center rounded-xl", tileTone[it.href] ?? "bg-accent-soft text-accent-ink")}>
                  <Icon name={it.icon} size={18} />
                </span>
                <span className="line-clamp-2 text-[12px] font-medium leading-tight text-fg">{it.short ?? it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      )}

      {plan.trial && <TrialCard trial={plan.trial} upgrade={plan.upgrade} />}

      <ul className="overflow-hidden rounded-2xl border border-line [&>li+li]:border-t [&>li+li]:border-line">
        <li>
          <Link href="/business/notifications" className={row}>
            <Icon name="bell" size={17} className="text-muted" />
            <span className="flex-1">Notifications</span>
            {unread > 0 && <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-semibold leading-5 text-accent-fg">{unread > 99 ? "99+" : unread}</span>}
            <Icon name="chevron-right" size={15} className="text-faint" />
          </Link>
        </li>
        <li>
          <Link href="/business/settings/billing" className={row}>
            <Icon name="credit-card" size={17} className="text-muted" />
            <span className="flex-1">Plan &amp; billing</span>
            <Icon name="chevron-right" size={15} className="text-faint" />
          </Link>
        </li>
        <li>
          <Link href="/business/docs" className={row}>
            <Icon name="info" size={17} className="text-muted" />
            <span className="flex-1">Help &amp; docs</span>
            <Icon name="chevron-right" size={15} className="text-faint" />
          </Link>
        </li>
        <li>
          <Link href="/business/software-deals" className={row}>
            <Icon name="tag" size={17} className="text-muted" />
            <span className="flex-1">Saver Option deals</span>
            <Icon name="chevron-right" size={15} className="text-faint" />
          </Link>
        </li>
      </ul>

      <form action="/auth/sign-out" method="post">
        <input type="hidden" name="next" value="/business" />
        <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line text-[15px] font-medium text-danger active:bg-subtle">
          <Icon name="log-out" size={16} /> Sign out
        </button>
      </form>
    </div>
  );
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
  const trigger = (
    <span className={cn("flex w-full items-center gap-2.5 rounded-lg bg-white/70 px-2 py-1.5 text-left shadow-[0_0.5px_1px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.06] hover:bg-white", collapsed && "justify-center bg-transparent px-0 shadow-none ring-0 hover:bg-black/[0.05]")}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(160deg,var(--accent),color-mix(in_oklab,var(--accent)_60%,#000))] text-[12px] font-semibold text-white">{ctx.workspace.name.slice(0, 1).toUpperCase()}</span>
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] leading-5 font-semibold text-fg">{ctx.workspace.name}</span>
            <span className="block text-[11.5px] leading-[17px] text-faint">{roleLabels[ctx.role]}</span>
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
                {m.isDemo && <span className="pill pill-warn px-1.5 py-0 text-[10.5px]">Demo</span>}
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
        {!ctx.memberships.some((m) => m.isDemo) && (
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
      <Link href="/business/settings/billing#plans" className="mb-2 flex h-9 items-center justify-center rounded-md text-accent hover:bg-black/[0.05]" title={`Free trial · ${trial.left} left`}>
        <Icon name="calendar" size={16} />
        <span className="sr-only">Free trial, {trial.left} left</span>
      </Link>
    );
  }
  return (
    <div className="mb-2 rounded-[10px] bg-white/70 px-3 py-2.5 shadow-[0_0.5px_1px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06]" data-trial-card>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[12.5px] font-semibold text-fg">Free trial</p>
        <p className="text-[11.5px] text-faint">{trial.left} left</p>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/[0.08]" role="progressbar" aria-label="Free trial used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(trial.used * 100)}>
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
      <SidebarNav sections={sections} collapsed={collapsed} />
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
    <div className={cn("flex items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-[12.5px] text-fg sm:flex-wrap sm:px-6", noticeTone[notice.tone])} data-billing-notice={notice.tone}>
      <span className="min-w-0">
        <Icon name={notice.tone === "accent" ? "calendar" : "alert"} size={13} className={cn("mr-1.5 inline", notice.tone === "danger" ? "text-danger" : notice.tone === "warn" ? "text-warn" : "text-accent-ink")} />
        <strong className="font-semibold">{notice.title}.</strong> <span className="max-sm:hidden">{notice.body}</span>
      </span>
      {notice.cta && (
        <Link href="/business/settings/billing" className="ml-auto shrink-0 font-semibold text-accent-ink underline underline-offset-2 max-sm:no-underline">
          {notice.cta} →
        </Link>
      )}
    </div>
  );
}

export function AppShell({ ctx, unread, notice, plan, children }: { ctx: BizContext; unread: number; notice: BillingNotice | null; plan: ShellPlan; children: ReactNode }) {
  const name = displayName(ctx.user);
  const tabs = mobileTabs(ctx);
  const morePaths = [...sectionPages.map((it) => it.href), ...pageTitles.map((t) => t.href), "/business/docs"];
  return (
    <SidebarFrame sidebar={<Sidebar ctx={ctx} plan={plan} />} collapsedSidebar={<Sidebar ctx={ctx} plan={plan} collapsed />}>
      <MobileNav tabs={tabs} morePaths={morePaths} more={<MoreSheet ctx={ctx} plan={plan} unread={unread} tabs={tabs} />}>
      {/* data-tauri-drag-region: in the Mac app, the bar's empty space drags the window; on narrow windows it starts after the window buttons. */}
      <header data-tauri-drag-region className="sticky top-0 z-30 flex h-14 items-center gap-1.5 border-b border-black/[0.08] bg-white/80 px-3 backdrop-blur-xl backdrop-saturate-150 sm:gap-2 sm:px-5 desktop-app:max-lg:pl-[84px]">
        <MobileMenuButton />
        <MobileTitle workspace={ctx.workspace.name} titles={pageTitles} />
        <form action="/business/search" method="get" role="search" className="relative hidden min-w-0 max-w-md flex-1 md:block desktop-app:block">
          <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <label htmlFor="biz-search" className="sr-only">
            Search software, subscriptions, vendors and people
          </label>
          <input
            id="biz-search"
            name="q"
            type="search"
            placeholder="Search software, vendors, people…"
            className="h-8 w-full rounded-lg border-0 bg-black/[0.05] pl-9 pr-3 text-[13px] outline-none placeholder:text-faint focus:bg-white focus:ring-4 focus:ring-accent/20"
          />
        </form>
        <QuickJump items={quickActions(ctx)} />
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          {plan.upgrade && (
            <Link href="/business/settings/billing#plans" className={buttonClass("primary", "sm", "mr-1 hidden sm:inline-flex")} data-upgrade-button>
              <Icon name="sparkles" size={14} />
              {plan.upgrade}
            </Link>
          )}
          <Link href="/business/notifications" className="relative inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-fg lg:rounded-lg" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
            <Icon name="bell" size={18} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] font-semibold leading-4 text-accent-fg">{unread > 99 ? "99+" : unread}</span>
            )}
          </Link>
          <MobileAccountButton label="Account and more">
            <Avatar name={name} src={ctx.user.avatarUrl} size={30} />
          </MobileAccountButton>
          <Popover
            label="Account menu"
            align="right"
            className="hidden w-auto lg:block desktop-app:block"
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
              <Link href="/business/software-deals" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-fg">
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
      <NavProgress />
      <DesktopMenuLinks />
      <SectionTabs sections={sections} />
      <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-[calc(4rem+var(--tabbar,0px))] pt-5 sm:px-6 sm:pt-6 lg:px-8">
        {children}
      </main>
      </MobileNav>
    </SidebarFrame>
  );
}
