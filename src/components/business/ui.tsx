import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { formatMoney, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/** Shared building blocks for the Saver Option Business app pages. */

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({ title, description, crumbs, actions }: { title: ReactNode; description?: ReactNode; crumbs?: Crumb[]; actions?: ReactNode }) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-faint">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <Icon name="chevron-right" size={12} />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-fg hover:underline underline-offset-2">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-muted">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-heading">{title}</h1>
          {description && <div className="mt-1 max-w-3xl text-[14px] text-muted">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  id,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("biz-card", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-[14.5px] font-semibold text-fg">{title}</h2>}
            {description && <p className="mt-0.5 text-[12.5px] text-faint">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("px-4 py-4 sm:px-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export type KpiTone = "violet" | "blue" | "green" | "orange" | "amber" | "pink";
const kpiTiles: Record<KpiTone, [string, string]> = {
  violet: ["#8b5cf6", "#5b21b6"],
  blue: ["#3b8bf0", "#1d4fc4"],
  green: ["#22b07d", "#047857"],
  orange: ["#f47b3f", "#c2410c"],
  amber: ["#f2ae1c", "#b45309"],
  pink: ["#e6639b", "#be185d"],
};

/** A coloured glossy tile behind an icon (the brand's icon-tile, recoloured). */
export function IconTile({ icon, tone = "violet", size = 32, className }: { icon: IconProps["name"]; tone?: KpiTone; size?: number; className?: string }) {
  const [from, to] = kpiTiles[tone];
  return (
    <span aria-hidden="true" className={cn("icon-tile shrink-0", className)} style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), "--tile-from": from, "--tile-to": to } as CSSProperties}>
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </span>
  );
}

export function Kpi({ label, value, sub, href, icon, tone, chart }: { label: string; value: ReactNode; sub?: ReactNode; href?: string; icon?: IconProps["name"]; tone?: KpiTone; chart?: ReactNode }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12.5px] font-medium text-muted">{label}</p>
        {icon && (tone ? <IconTile icon={icon} tone={tone} size={30} /> : <Icon name={icon} size={15} className="text-faint" />)}
      </div>
      <div className={cn("tabular text-[1.45rem] font-semibold leading-tight tracking-tight text-heading", tone ? "mt-0.5" : "mt-1.5")}>{value}</div>
      {sub && <div className="mt-1 text-[12px] text-faint">{sub}</div>}
      {chart && <div className="mt-3">{chart}</div>}
    </>
  );
  return href ? (
    <Link href={href} className="biz-card biz-card-lift block px-4 py-3.5">
      {body}
    </Link>
  ) : (
    <div className="biz-card px-4 py-3.5">{body}</div>
  );
}

/** Per-currency amounts, one per line (never summed across currencies). */
export function Money({ totals, preferred, compact, empty = "—", className }: { totals: CurrencyTotals; preferred?: string; compact?: boolean; empty?: string; className?: string }) {
  const list = totalsList(totals, preferred);
  if (list.length === 0) return <span className={className}>{empty}</span>;
  return (
    <span className={cn("inline-flex flex-col", className)}>
      {list.map((t) => (
        <span key={t.currency} className="tabular whitespace-nowrap">
          {formatMoney(t.amount, t.currency, { compact, whole: compact })}
        </span>
      ))}
    </span>
  );
}

export function EmptyState({ icon = "box", title, children, action }: { icon?: IconProps["name"]; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-subtle text-faint">
        <Icon name={icon} size={20} />
      </span>
      <p className="mt-3 text-[15px] font-semibold text-fg">{title}</p>
      {children && <div className="mt-1 max-w-md text-[13.5px] text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

type Tone = "neutral" | "accent" | "success" | "warn" | "danger" | "outline";
const tones: Record<Tone, string> = {
  neutral: "bg-subtle text-muted",
  accent: "bg-accent-soft text-accent-ink",
  success: "bg-success/12 text-[color-mix(in_oklab,var(--success)_75%,black)]",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger/10 text-danger",
  outline: "border border-line-strong text-muted",
};

export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11.5px] font-medium leading-4", tones[tone], className)}>{children}</span>;
}

const statusTone: Record<string, Tone> = {
  active: "success",
  trial: "accent",
  paused: "neutral",
  cancelled: "outline",
  expired: "outline",
  evaluating: "accent",
  deprecated: "warn",
  archived: "outline",
  open: "accent",
  reviewed: "neutral",
  dismissed: "outline",
  actioned: "success",
  resolved: "outline",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <Pill tone={statusTone[status] ?? "neutral"}>{label}</Pill>;
}

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("-mx-4 overflow-x-auto sm:-mx-5", className)}>{children}</div>;
}

export function Tabs({ items }: { items: { label: string; href: string; active: boolean; count?: number }[] }) {
  return (
    <nav aria-label="Views" className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.active ? "page" : undefined}
          className={cn(
            "-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-[13.5px] font-medium transition-colors",
            t.active ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 rounded bg-subtle px-1.5 text-[11.5px] text-faint">{t.count}</span>}
        </Link>
      ))}
    </nav>
  );
}

export function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: (page: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-3 text-[13px] text-muted">
      <span>
        Page {page} of {pageCount}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={buttonClass("secondary", "sm")}>
            <Icon name="chevron-left" size={14} /> Previous
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link href={href(page + 1)} className={buttonClass("secondary", "sm")}>
            Next <Icon name="chevron-right" size={14} />
          </Link>
        ) : null}
      </span>
    </nav>
  );
}

export function DefinitionList({ items, className }: { items: { label: string; value: ReactNode; hint?: string }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-[12px] text-faint">{it.label}</dt>
          <dd className="mt-0.5 break-words text-[14px] text-fg">{it.value ?? "—"}</dd>
          {it.hint && <p className="mt-0.5 text-[11.5px] text-faint">{it.hint}</p>}
        </div>
      ))}
    </dl>
  );
}

/** A labelled notice inside the app (setup requirements, explanations). */
export function InlineNote({ tone = "info", title, children }: { tone?: "info" | "warn"; title?: string; children: ReactNode }) {
  return (
    <div className={cn("flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px]", tone === "warn" ? "border-warn/30 bg-warn-soft" : "border-line bg-subtle")}>
      <Icon name={tone === "warn" ? "alert" : "info"} size={16} className={cn("mt-0.5", tone === "warn" ? "text-warn" : "text-faint")} />
      <div className="min-w-0 text-muted">
        {title && <p className="font-medium text-fg">{title}</p>}
        <div className={title ? "mt-0.5" : undefined}>{children}</div>
      </div>
    </div>
  );
}

export function LinkButton({ href, children, variant = "secondary", size = "sm", icon, className }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md"; icon?: IconProps["name"]; className?: string }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </Link>
  );
}

/** Horizontal meter for utilization and shares (0–100). */
export function Meter({ value, label, tone = "accent" }: { value: number | null; label?: string; tone?: "accent" | "warn" }) {
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <span className="flex min-w-24 items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-label={label}>
        <span className={cn("block h-full rounded-full", tone === "warn" ? "bg-warn" : "bg-accent")} style={{ width: `${v}%` }} />
      </span>
      <span className="tabular w-10 text-right text-[12px] text-muted">{value === null ? "—" : `${Math.round(v)}%`}</span>
    </span>
  );
}
