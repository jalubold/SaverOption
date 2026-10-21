import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn, Container } from "@/components/ui/primitives";

/** Dark frame shared by the advertiser dashboard and the admin pages. */
export function DashboardShell({
  email,
  admin,
  section,
  children,
}: {
  email: string;
  admin: boolean;
  section: "dashboard" | "admin" | "metrics" | "setup";
  children: React.ReactNode;
}) {
  const tabs = [
    { href: "/dashboard", label: "My listings", key: "dashboard" },
    ...(admin
      ? [
          { href: "/admin", label: "Review", key: "admin" },
          { href: "/admin/metrics", label: "Metrics", key: "metrics" },
          { href: "/admin/setup", label: "Setup", key: "setup" },
        ]
      : []),
  ];
  return (
    <div className="theme-dark min-h-[80vh] bg-bg text-fg">
      <div className="hero-glow border-b border-line">
        <Container className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
          <nav aria-label="Account" className="flex min-w-0 items-center gap-1">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                aria-current={section === t.key ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  section === t.key ? "bg-subtle text-fg" : "text-muted hover:text-fg",
                )}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <span className="hidden min-w-0 truncate text-[13px] text-faint sm:inline">{email}</span>
            <form action="/auth/sign-out" method="post">
              <button type="submit" className={buttonClass("secondary", "sm")}>
                <Icon name="log-out" size={14} /> Sign out
              </button>
            </form>
          </div>
        </Container>
      </div>
      <Container className="pb-20 pt-8 sm:pt-10">{children}</Container>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface px-4 py-3.5">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">{label}</p>
      <p className="tabular mt-1 text-[1.75rem] font-semibold leading-tight tracking-tight text-heading">{value}</p>
      {hint && <p className="mt-0.5 text-[12px] text-faint">{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[16px] border border-line bg-surface p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const fmtDate = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d) : "—";
