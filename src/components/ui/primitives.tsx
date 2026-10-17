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

type BadgeTone = "neutral" | "accent" | "warn" | "outline";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-subtle text-muted",
  accent: "bg-accent-soft text-accent-ink",
  warn: "bg-warn-soft text-warn",
  outline: "border border-line-strong text-muted",
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

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-[13px]",
  md: "h-10 rounded-[10px] px-4 text-sm",
  lg: "h-12 rounded-[14px] px-5 text-[15px]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn("btn", `btn-${variant}`, buttonSizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

// ─── Headings ───────────────────────────────────────────────────────────────

/**
 * Serif display heading for editorial sections. Pass an <em> inside `title`
 * for the muted italic phrase, e.g. <>Browse by <em>category</em>.</>
 */
export function SectionHeading({
  id,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
}: {
  id?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  const link = href && (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent-ink hover:underline underline-offset-4"
    >
      {linkLabel}
      <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );

  if (align === "center") {
    return (
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="display text-[2.5rem] sm:text-[3.5rem]">
          {title}
        </h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>}
        {link && <div className="mt-4">{link}</div>}
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 id={id} className="display text-[2.25rem] sm:text-[3rem]">
          {title}
        </h2>
        {description && <p className="mt-2 text-[15px] text-muted">{description}</p>}
      </div>
      {link}
    </div>
  );
}

/** Uppercase chip above a hero heading. Use <strong> for the figures. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

/** Filled green check used for trust points. */
export function CheckDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-success text-white", className)}
    >
      <Icon name="check" size={12} strokeWidth={3} />
    </span>
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
        className={cn("mt-0.5", tone === "warn" ? "text-warn" : "text-faint")}
      />
      <div>
        {title && <p className="font-medium text-fg">{title}</p>}
        <div className={title ? "mt-0.5" : undefined}>{children}</div>
      </div>
    </div>
  );
}
