"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

export interface NavItem {
  label: string;
  href: string;
  icon: IconProps["name"];
}

/** The nav item whose href is the longest prefix of the current path. */
function activeHref(path: string, items: NavItem[]): string | null {
  let best: string | null = null;
  for (const it of items) {
    if ((path === it.href || path.startsWith(`${it.href}/`)) && (!best || it.href.length > best.length)) best = it.href;
  }
  return best;
}

export function SidebarNav({ groups, collapsed }: { groups: { label: string; items: NavItem[] }[]; collapsed?: boolean }) {
  const path = usePathname() ?? "";
  const active = activeHref(path, groups.flatMap((g) => g.items));
  return (
    <nav aria-label="Business app" className="flex flex-col gap-5">
      {groups.map((g) => (
        <div key={g.label}>
          <p className={cn("mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint", collapsed && "lg:sr-only")}>{g.label}</p>
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const on = it.href === active;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={on ? "page" : undefined}
                    title={collapsed ? it.label : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
                      on
                        ? "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_26%,transparent),color-mix(in_oklab,var(--accent)_6%,transparent))] text-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
                        : "text-muted hover:bg-subtle hover:text-fg",
                      collapsed && "lg:justify-center lg:px-0",
                    )}
                  >
                    {on && <span aria-hidden="true" className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r-full bg-accent shadow-[0_0_12px_2px_color-mix(in_oklab,var(--accent)_70%,transparent)]" />}
                    <Icon name={it.icon} size={17} className={on ? "text-accent-ink" : undefined} />
                    <span className={cn("truncate", collapsed && "lg:sr-only")}>{it.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

const COLLAPSE_KEY = "so-biz-sidebar";

/** Desktop sidebar that can collapse to icons (remembered per browser), and a drawer on small screens. */
export function SidebarFrame({ sidebar, collapsedSidebar, children }: { sidebar: ReactNode; collapsedSidebar: ReactNode; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved preference once, after hydration
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // Storage can be unavailable (private mode); the sidebar just starts expanded.
    }
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const toggle = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {}
      return !c;
    });
  };
  return (
    <div className="flex min-h-dvh">
      <div className={cn("theme-dark hidden shrink-0 border-r border-line bg-bg transition-[width] duration-150 lg:block", collapsed ? "w-[68px]" : "w-[248px]")}>
        <aside className="sticky top-0 flex h-dvh flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3">{collapsed ? collapsedSidebar : sidebar}</div>
          <button type="button" onClick={toggle} className="m-3 mt-0 flex h-8 items-center justify-center gap-2 rounded-lg text-[12.5px] text-faint hover:bg-subtle hover:text-fg" aria-pressed={collapsed}>
            <Icon name="panel-left" size={15} />
            <span className={collapsed ? "sr-only" : undefined}>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </aside>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="theme-dark absolute inset-y-0 left-0 flex w-[min(86vw,300px)] flex-col overflow-y-auto border-r border-line bg-bg px-3 pb-6">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileMenuButtonContext.Provider value={() => setOpen(true)}>{children}</MobileMenuButtonContext.Provider>
      </div>
    </div>
  );
}

const MobileMenuButtonContext = createContext<() => void>(() => {});

export function MobileMenuButton() {
  const open = useContext(MobileMenuButtonContext);
  return (
    <button type="button" onClick={open} className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg lg:hidden">
      <Icon name="menu" size={19} />
      <span className="sr-only">Open navigation</span>
    </button>
  );
}

/**
 * A small popover menu (profile, workspace switcher). The panel is portalled to
 * <body> with fixed positioning next to its trigger, so the sidebar's own
 * scrolling and width never clip it or slide it under the nav. Closes on
 * outside click, Escape, resize, and after a form inside it submits — a tick
 * later, because removing a form during its submit event cancels a native
 * (non-JavaScript) submission.
 */
export function Popover({ trigger, children, align = "left", label, className }: { trigger: ReactNode; children: ReactNode; align?: "left" | "right"; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxHeight: number; dark: boolean } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const width = Math.min(272, vw - 16);
    const left = Math.max(8, Math.min(align === "right" ? r.right - width : r.left, vw - width - 8));
    const top = r.bottom + 6;
    setPos({ top, left, width, maxHeight: Math.max(160, window.innerHeight - top - 12), dark: Boolean(el.closest(".theme-dark")) });
  }, [align]);
  useEffect(() => {
    if (!open) return;
    const inside = (t: EventTarget | null) => Boolean(t instanceof Node && (ref.current?.contains(t) || panel.current?.contains(t)));
    const onDown = (e: MouseEvent) => !inside(e.target) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => setOpen(false);
    const onScroll = (e: Event) => !inside(e.target) && place();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, place]);
  return (
    <div ref={ref} className={cn("relative", className)} onSubmitCapture={() => setTimeout(() => setOpen(false), 0)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => {
          if (!open) place();
          setOpen((v) => !v);
        }}
        className="w-full"
      >
        {trigger}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={panel}
            id={id}
            className={cn("fixed z-[70] overflow-y-auto rounded-xl border border-line bg-surface p-1.5 text-fg shadow-[0_16px_40px_-12px_rgb(0_0_0/0.45)]", pos.dark && "theme-dark")}
            style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}
