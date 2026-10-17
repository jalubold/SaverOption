import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

// ─── Badge ──────────────────────────────────────────────────────────────────

type BadgeTone = "neutral" | "accent" | "warn" | "outline" | "sponsor";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-subtle text-muted",
  accent: "bg-accent-soft text-accent-ink",
  warn: "bg-warn-soft text-warn",
  outline: "border border-line-strong text-muted",
  sponsor: "border border-dashed border-line-strong text-muted uppercase tracking-wide text-[10px]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ─── Button ─────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-ink shadow-sm",
  secondary: "border border-line-strong bg-surface text-fg hover:bg-subtle",
  ghost: "text-muted hover:text-fg hover:bg-subtle",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

// ─── Section heading ────────────────────────────────────────────────────────

export function SectionHeading({
  id,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  id?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted sm:text-[15px]">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent-ink hover:underline underline-offset-4"
        >
          {linkLabel}
          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// ─── Notice ─────────────────────────────────────────────────────────────────

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warn";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "warn" ? "status" : undefined}
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm",
        tone === "warn" ? "border-warn/30 bg-warn-soft text-fg" : "border-line bg-subtle text-muted",
        className,
      )}
    >
      <Icon
        name={tone === "warn" ? "alert" : "info"}
        size={18}
        className={cn("mt-0.5 shrink-0", tone === "warn" ? "text-warn" : "text-faint")}
      />
      <div>
        {title && <p className="font-medium text-fg">{title}</p>}
        <div className={title ? "mt-0.5" : undefined}>{children}</div>
      </div>
    </div>
  );
}
