"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { NAV_COOKIE } from "@/lib/business/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: IconProps["name"];
  /** Extra words Quick jump matches on. */
  keywords?: string;
}

export interface NavGroup {
  id: string;
  /** Null for the ungrouped items at the top. */
  label: string | null;
  items: NavItem[];
  /** Starts folded until someone opens it (or one of its pages is open). */
  defaultClosed?: boolean;
}

/** The nav item whose href is the longest prefix of the current path. */
function activeHref(path: string, items: NavItem[]): string | null {
  let best: string | null = null;
  for (const it of items) {
    if ((path === it.href || path.startsWith(`${it.href}/`)) && (!best || it.href.length > best.length)) best = it.href;
  }
  return best;
}


/** Folded / unfolded groups, remembered per browser. */
function useGroupState(groups: NavGroup[], saved: Record<string, boolean>) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ ...Object.fromEntries(groups.map((g) => [g.id, !g.defaultClosed])), ...saved }));
  const toggle = (id: string) =>
    setOpen((o) => {
      const next = { ...o, [id]: !o[id] };
      const value = Object.entries(next)
        .map(([k, v]) => `${k}:${v ? 1 : 0}`)
        .join(".");
      document.cookie = `${NAV_COOKIE}=${value}; path=/business; max-age=31536000; samesite=lax`;
      return next;
    });
  return { open, toggle };
}

export function SidebarNav({ groups, collapsed, savedOpen = {} }: { groups: NavGroup[]; collapsed?: boolean; savedOpen?: Record<string, boolean> }) {
  const path = usePathname() ?? "";
  const active = activeHref(path, groups.flatMap((g) => g.items));
  const { open, toggle } = useGroupState(groups, savedOpen);
  return (
    <nav aria-label="Business app" className={cn("flex flex-col", collapsed ? "gap-3" : "gap-4")}>
      {groups.map((g, gi) => {
        const hasActive = g.items.some((it) => it.href === active);
        // The rail (collapsed sidebar) always shows every icon; a group holding the current page never folds.
        const shown = collapsed || !g.label || open[g.id] !== false || hasActive;
        const listId = `nav-${g.id}`;
        return (
          <div key={g.id} data-nav-group={g.id}>
            {g.label &&
              (collapsed ? (
                gi > 0 && <span aria-hidden="true" className="mx-auto mb-2 hidden h-px w-6 bg-line lg:block" />
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={shown}
                  aria-controls={listId}
                  disabled={hasActive}
                  className="group/nav mb-1 flex w-full items-center justify-between rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint hover:text-muted disabled:cursor-default disabled:hover:text-faint"
                >
                  {g.label}
                  {!hasActive && <Icon name={shown ? "chevron-down" : "chevron-right"} size={13} />}
                </button>
              ))}
            {
              <ul id={listId} hidden={!shown} className={cn("flex-col gap-0.5", shown ? "flex" : "hidden")}>
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
            }
          </div>
        );
      })}
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
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 [&>*]:shrink-0">{collapsed ? collapsedSidebar : sidebar}</div>
          <button type="button" onClick={toggle} className="m-3 mt-0 flex h-8 items-center justify-center gap-2 rounded-lg text-[12.5px] text-faint hover:bg-subtle hover:text-fg" aria-pressed={collapsed}>
            <Icon name="panel-left" size={15} />
            <span className={collapsed ? "sr-only" : undefined}>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </aside>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="theme-dark absolute inset-y-0 left-0 flex w-[min(86vw,300px)] flex-col overflow-y-auto border-r border-line bg-bg px-3 pb-6 [&>*]:shrink-0">{sidebar}</aside>
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

export interface QuickAction extends NavItem {
  group: string;
}

/**
 * Quick jump (⌘K / Ctrl+K, or the button in the header): type to go to any
 * page or common action; Enter with no match searches the workspace's records.
 */
export function QuickJump({ items }: { items: QuickAction[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  // Each opening starts fresh.
  const show = useCallback((next: boolean) => {
    if (next) {
      setQ("");
      setSel(0);
    }
    setOpen(next);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQ("");
            setSel(0);
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = words.length ? items.filter((it) => words.every((w) => `${it.label} ${it.group} ${it.keywords ?? ""}`.toLowerCase().includes(w))) : items;
  const search = q.trim() ? { label: `Search records for “${q.trim()}”`, href: `/business/search?q=${encodeURIComponent(q.trim())}`, icon: "search" as const, group: "Search" } : null;
  const results: QuickAction[] = [...matches, ...(search ? [search] : [])];
  const go = (it: QuickAction | undefined) => {
    if (!it) return;
    setOpen(false);
    router.push(it.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => show(true)}
        className="hidden h-9 shrink-0 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-[12.5px] text-faint hover:border-line-strong hover:text-muted md:inline-flex"
        aria-keyshortcuts="Control+K Meta+K"
        data-quick-jump
      >
        <Icon name="arrow-up-right" size={14} />
        Jump to…
        <kbd className="rounded border border-line bg-subtle px-1 font-sans text-[11px] text-faint">⌘K</kbd>
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Quick jump">
            <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]">
              <div className="flex items-center gap-2 border-b border-line px-3.5">
                <Icon name="search" size={16} className="text-faint" />
                <input
                  ref={input}
                  autoFocus
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSel(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                    else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSel((i) => Math.min(results.length - 1, i + 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSel((i) => Math.max(0, i - 1));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      go(results[sel]);
                    }
                  }}
                  placeholder="Go to a page, or search records…"
                  aria-label="Go to a page, or search records"
                  aria-controls="quick-jump-results"
                  aria-activedescendant={results[sel] ? `qj-${sel}` : undefined}
                  role="combobox"
                  aria-expanded="true"
                  className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
                />
                <kbd className="rounded border border-line bg-subtle px-1.5 text-[11px] text-faint">Esc</kbd>
              </div>
              <ul id="quick-jump-results" role="listbox" aria-label="Pages and actions" className="max-h-[min(60vh,420px)] overflow-y-auto p-1.5">
                {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-faint">Nothing matches.</li>}
                {results.map((it, i) => (
                  <li key={`${it.group}-${it.href}`} id={`qj-${i}`} role="option" aria-selected={i === sel}>
                    <button
                      type="button"
                      onMouseMove={() => setSel(i)}
                      onClick={() => go(it)}
                      className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px]", i === sel ? "bg-accent-soft text-fg" : "text-muted")}
                    >
                      <Icon name={it.icon} size={16} className={i === sel ? "text-accent-ink" : "text-faint"} />
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span className="shrink-0 text-[11.5px] text-faint">{it.group}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line px-3.5 py-2 text-[11.5px] text-faint">↑↓ to move · Enter to open · ⌘K / Ctrl+K anywhere</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
