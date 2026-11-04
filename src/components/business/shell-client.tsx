"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { startNavigation } from "@/components/business/nav-progress";
import { BottomSheet } from "@/components/business/sheet";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

export interface NavItem {
  label: string;
  href: string;
  icon: IconProps["name"];
  /** Extra words Quick jump matches on. */
  keywords?: string;
  /** A shorter label for the section tabs on phones ("Licenses" for "Licenses & seats"). */
  short?: string;
}

/** One of the sidebar's four places; its pages show as tabs at the top of each of them. */
export interface NavSection {
  id: string;
  label: string;
  icon: IconProps["name"];
  /** Its pages, the first one being where the sidebar item goes. */
  items: NavItem[];
}

/** Forms (add, edit, import) take the whole screen, with their own buttons at the bottom, as a pushed screen does. */
const FORM_ROUTE = /^\/business\/(subscriptions|software)\/(new|import|[^/]+\/edit)\/?$/;

/** The entry whose href is the longest prefix of the current path. */
function longestMatch<T extends { href: string }>(path: string, items: T[]): T | null {
  let best: T | null = null;
  for (const it of items) {
    if ((path === it.href || path.startsWith(`${it.href}/`)) && (!best || it.href.length > best.href.length)) best = it;
  }
  return best;
}

/** The nav item whose href is the longest prefix of the current path. */
function activeHref(path: string, items: NavItem[]): string | null {
  return longestMatch(path, items)?.href ?? null;
}

/** The section a path belongs to, and which of its pages it is (Plan & billing is under Settings, a subscription under Subscriptions). */
function sectionFor(path: string, sections: NavSection[]): { section: NavSection; href: string } | null {
  const hit = longestMatch(
    path,
    sections.flatMap((section) => section.items.map((it) => ({ href: it.href, section }))),
  );
  return hit && { section: hit.section, href: hit.href };
}

/**
 * The item just clicked, marked current straight away until its page arrives. It's forgotten as soon
 * as the path changes, so coming back later to the page it was clicked on doesn't bring the old click
 * back (Workspace → Settings → Overview → Workspace would otherwise mark Settings over the Team page).
 */
function usePending<T>(path: string): [T | null, (value: T) => void] {
  const [pending, setPending] = useState<{ value: T; from: string } | null>(null);
  const [seen, setSeen] = useState(path);
  if (path !== seen) {
    setSeen(path);
    if (pending) setPending(null);
  }
  return [pending && pending.from === path ? pending.value : null, (value: T) => setPending({ value, from: path })];
}

/** Pages are fetched in full once the pointer or focus reaches their link, so most clicks open them at once. */
function useWarm() {
  // (Not when links scroll into view: that would render every page of the app on each visit.)
  const [warmed, setWarmed] = useState<ReadonlySet<string>>(() => new Set());
  const warm = (href: string) => setWarmed((s) => (s.has(href) ? s : new Set(s).add(href)));
  return { warmed, warm };
}

/**
 * The sidebar's four places: Overview, Manage, Insights and Workspace. Each goes to its first page;
 * the others are the tabs at the top of the page (SectionTabs), so the list never grows.
 */
export function SidebarNav({ sections, collapsed }: { sections: NavSection[]; collapsed?: boolean }) {
  const path = usePathname() ?? "";
  const [pendingId, markPending] = usePending<string>(path);
  const active = pendingId ?? sectionFor(path, sections)?.section.id ?? null;
  const { warmed, warm } = useWarm();
  return (
    <nav aria-label="Business app">
      <ul className="flex flex-col gap-0.5">
        {sections.map((s) => {
          const on = s.id === active;
          const href = s.items[0].href;
          return (
            <li key={s.id} data-nav-section={s.id}>
              <Link
                href={href}
                prefetch={warmed.has(href)}
                onMouseEnter={() => warm(href)}
                onFocus={() => warm(href)}
                onTouchStart={() => warm(href)}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && href !== path) markPending(s.id);
                }}
                aria-current={on ? "page" : undefined}
                title={collapsed ? s.label : undefined}
                className={cn(
                  "relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] font-medium transition-colors",
                  on ? "bg-[var(--mac-select)] text-fg" : "text-muted hover:bg-[var(--mac-fill)] hover:text-fg",
                  collapsed && "lg:h-9 lg:justify-center lg:px-0",
                )}
              >
                {/* Grey icons; the current place in full ink on a soft highlight. */}
                <Icon name={s.icon} size={17} className={on ? "text-fg" : "text-[var(--mac-icon)]"} />
                <span className={cn("truncate", collapsed && "lg:sr-only")}>{s.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The pages of the current section, as tabs under the title bar (Subscriptions, Renewals, Software,
 * Licenses & seats in Manage). Not on Overview, which is one page, nor on forms, which stay focused.
 * On phones the row scrolls sideways, with the current tab brought into view.
 */
export function SectionTabs({ sections }: { sections: NavSection[] }) {
  const path = usePathname() ?? "";
  const [pendingHref, markPending] = usePending<string>(path);
  const { warmed, warm } = useWarm();
  const list = useRef<HTMLUListElement>(null);
  const hit = sectionFor(path, sections);
  const current = pendingHref ?? hit?.href ?? null;
  useEffect(() => {
    const ul = list.current;
    const li = ul?.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement;
    if (!ul || !li || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollLeft = Math.max(0, li.offsetLeft - (ul.clientWidth - li.offsetWidth) / 2);
  }, [current]);
  if (!hit || hit.section.items.length < 2 || FORM_ROUTE.test(path)) return null;
  const { section } = hit;
  return (
    <nav aria-label={`${section.label} pages`} className="border-b border-[var(--mac-hairline)] bg-[var(--mac-toolbar)] backdrop-blur-xl backdrop-saturate-150" data-section-tabs={section.id}>
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ul ref={list} className="no-scrollbar -mx-2 flex overflow-x-auto">
          {section.items.map((it) => {
            const on = it.href === current;
            return (
              <li key={it.href} className="shrink-0">
                <Link
                  href={it.href}
                  prefetch={warmed.has(it.href)}
                  onMouseEnter={() => warm(it.href)}
                  onFocus={() => warm(it.href)}
                  onTouchStart={() => warm(it.href)}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && it.href !== path) markPending(it.href);
                  }}
                  aria-current={on ? "page" : undefined}
                  className={cn("group relative flex h-10 items-center px-1 text-[13px] font-medium transition-colors", on ? "text-fg" : "text-muted hover:text-fg")}
                  data-section-tab={it.href}
                >
                  <span className="flex h-7 items-center gap-2 rounded-md px-2 transition-colors group-hover:bg-[var(--mac-fill)]">
                    <Icon name={it.icon} size={15} className={cn("max-sm:hidden", on ? "text-accent-ink" : "text-faint group-hover:text-muted")} />
                    {it.short ? (
                      <>
                        <span className="sm:hidden">{it.short}</span>
                        <span className="max-sm:hidden">{it.label}</span>
                      </>
                    ) : (
                      it.label
                    )}
                  </span>
                  {on && <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-accent" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

const COLLAPSE_KEY = "so-biz-sidebar";

/** Desktop sidebar that can collapse to icons (remembered per browser), and a drawer on small screens. */
/** How long the sidebar takes to slide between full and the rail (Apple's ease-out curve). */
const SLIDE_MS = 280;

export function SidebarFrame({ sidebar, collapsedSidebar, children }: { sidebar: ReactNode; collapsedSidebar: ReactNode; children: ReactNode }) {
  // The width (collapsed) and what's inside (rail) move separately, as a Mac sidebar slides: collapsing,
  // the full list stays put and is clipped as the edge slides in, then the rail fades in; expanding, the
  // full list is there at once and revealed as the edge slides out.
  const [collapsed, setCollapsed] = useState(false);
  const [rail, setRail] = useState(false);
  const [animate, setAnimate] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const settle = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      // Storage can be unavailable (private mode); the sidebar just starts expanded.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved preference once, after hydration
    setCollapsed(saved);
    setRail(saved);
    // Slide only on a click, not while the saved width is first applied.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timer.current);
      window.clearTimeout(settle.current);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const toggle = () => {
    const next = !collapsed;
    try {
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
    } catch {}
    window.clearTimeout(timer.current);
    window.clearTimeout(settle.current);
    setCollapsed(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRail(next);
      return;
    }
    // The page is laid out once, at its final width, for the length of the slide: only its position
    // moves with the edge, so charts and tables aren't measured and redrawn on every frame.
    const main = document.getElementById("main");
    if (main) {
      main.style.width = `${Math.min(1280, document.documentElement.clientWidth - (next ? 68 : 248))}px`;
      settle.current = window.setTimeout(() => {
        main.style.width = "";
      }, SLIDE_MS + 40);
    }
    // Expanding shows the full list at once (revealed by the edge); collapsing brings the rail in
    // while the edge is still moving, so the two motions overlap instead of following each other.
    if (!next) setRail(false);
    else timer.current = window.setTimeout(() => setRail(true), Math.round(SLIDE_MS * 0.55));
  };
  return (
    <SidebarToggleContext.Provider value={{ collapsed, toggle }}>
    <div className="biz-shell flex min-h-dvh">
      {/* A Mac source list: light grey, a hairline edge, the selection a rounded grey highlight. */}
      {/* overflow-x: clip, not hidden: it clips the sliding edge without becoming a scroll box, so the aside stays sticky. */}
      <div
        className={cn(
          "hidden shrink-0 overflow-x-clip border-r border-[var(--mac-hairline)] bg-[var(--mac-sidebar)] lg:block",
          animate && "transition-[width] duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        <aside className={cn("sticky top-0 flex h-dvh flex-col", rail ? "w-[68px]" : "w-[248px]")}>
          {/* In the Mac app: the window buttons sit here, and the strip drags the window. */}
          <div aria-hidden="true" data-tauri-drag-region className="hidden h-14 shrink-0 desktop-app:block" />
          {/* Hide the sidebar, at its top right as in Finder and Notes (in the Mac app, beside the window
              buttons). Hidden, its twin sits at the start of the toolbar (SidebarExpandButton). */}
          {!collapsed && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Collapse sidebar"
              title="Hide sidebar"
              className="absolute right-3 top-[14px] z-10 flex size-7 items-center justify-center rounded-md text-muted hover:bg-[var(--mac-fill)] hover:text-fg"
            >
              <Icon name="panel-left" size={16} />
            </button>
          )}
          <div key={rail ? "rail" : "full"} className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 [&>*]:shrink-0", animate && "animate-[so-fade_200ms_ease-out] motion-reduce:animate-none")}>
            {rail ? collapsedSidebar : sidebar}
          </div>
        </aside>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,300px)] flex-col overflow-y-auto border-r border-[var(--mac-hairline)] bg-[var(--mac-sidebar)] px-3 pb-6 desktop-app:pt-14 [&>*]:shrink-0">{sidebar}</aside>
        </div>
      )}
      {/* Clipped sideways (without becoming a scroll box), for the moment the page is wider than its column mid-slide. */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <MobileMenuButtonContext.Provider value={() => setOpen(true)}>{children}</MobileMenuButtonContext.Provider>
      </div>
    </div>
    </SidebarToggleContext.Provider>
  );
}

const SidebarToggleContext = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });

/** Show the sidebar again: at the start of the toolbar while it's collapsed, as macOS apps do. */
export function SidebarExpandButton() {
  const { collapsed, toggle } = useContext(SidebarToggleContext);
  if (!collapsed) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Expand sidebar"
      title="Show sidebar"
      className="hidden size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-[var(--mac-fill)] hover:text-fg lg:inline-flex"
    >
      <Icon name="panel-left" size={17} />
    </button>
  );
}

const MobileMenuButtonContext = createContext<() => void>(() => {});

export function MobileMenuButton() {
  const open = useContext(MobileMenuButtonContext);
  return (
    <button type="button" onClick={open} className="hidden size-9 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg desktop-app:inline-flex desktop-app:lg:hidden">
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
    if (it.href !== path) startNavigation();
    router.push(it.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => show(true)}
        className="hidden h-8 shrink-0 items-center gap-2 rounded-md border border-line bg-[var(--mac-control)] px-2.5 text-[12.5px] text-faint hover:border-line-strong hover:text-muted md:inline-flex"
        aria-keyshortcuts="Control+K Meta+K"
        data-quick-jump
      >
        <Icon name="arrow-up-right" size={14} />
        Jump to…
        <kbd className="rounded bg-surface px-1 text-[11px] text-faint shadow-[0_0.5px_1px_rgb(0_0_0/0.12)]">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={() => show(true)}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-fg md:hidden desktop-app:hidden"
        aria-label="Search and go to"
        data-mobile-search
      >
        <Icon name="search" size={19} />
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] max-sm:p-0" role="dialog" aria-modal="true" aria-label="Quick jump">
            <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45 max-sm:hidden" onClick={() => setOpen(false)} />
            <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] max-sm:h-dvh max-sm:max-w-none max-sm:rounded-none max-sm:border-0 max-sm:pt-[env(safe-area-inset-top)] max-sm:animate-[sheet-up_.22s_cubic-bezier(.2,.8,.2,1)]">
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
                  className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint max-sm:h-14 max-sm:text-[16px]"
                />
                <kbd className="rounded border border-line bg-subtle px-1.5 text-[11px] text-faint max-sm:hidden">Esc</kbd>
                <button type="button" onClick={() => setOpen(false)} className="shrink-0 px-1 text-[15px] font-medium text-accent-ink sm:hidden">
                  Cancel
                </button>
              </div>
              <ul id="quick-jump-results" role="listbox" aria-label="Pages and actions" className="max-h-[min(60vh,420px)] overflow-y-auto p-1.5 max-sm:max-h-none max-sm:flex-1 max-sm:pb-[max(12px,env(safe-area-inset-bottom))]">
                {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-faint">Nothing matches.</li>}
                {results.map((it, i) => (
                  <li key={`${it.group}-${it.href}`} id={`qj-${i}`} role="option" aria-selected={i === sel}>
                    <button
                      type="button"
                      onMouseMove={() => setSel(i)}
                      onClick={() => go(it)}
                      className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] max-sm:py-3 max-sm:text-[15px]", i === sel ? "bg-accent-soft text-fg" : "text-muted")}
                    >
                      <Icon name={it.icon} size={16} className={i === sel ? "text-accent-ink" : "text-faint"} />
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span className="shrink-0 text-[11.5px] text-faint">{it.group}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line px-3.5 py-2 text-[11.5px] text-faint max-sm:hidden">↑↓ to move · Enter to open · ⌘K / Ctrl+K anywhere</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/* ——— Phones and tablets: a tab bar at the bottom, a More sheet, and a title bar ——— */

export interface TabItem {
  label: string;
  href: string;
  icon: IconProps["name"];
  /** The raised button in the middle (Add software). */
  primary?: boolean;
  /** Other pages this tab stands for (Manage is current on Renewals too). */
  paths?: string[];
}

const MoreSheetContext = createContext<() => void>(() => {});

/**
 * What a phone app has at the bottom: a tab for each of the four places. The profile picture in the
 * title bar opens the sheet with the account, the workspace, the other pages and sign out. From the
 * laptop size up (and in the Mac app) the sidebar does this job, so none of it shows there.
 */
export function MobileNav({ tabs, morePaths, more, children }: { tabs: TabItem[]; morePaths: string[]; more: ReactNode; children: ReactNode }) {
  const path = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(path);
  const [pendingHref, markPending] = usePending<string>(path);
  const { warmed, warm } = useWarm();
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }
  const close = useCallback(() => setOpen(false), []);
  // Each path belongs to the tab with the longest matching href (or path); pages under none of them
  // (notifications, billing, help) leave every tab unmarked.
  const routes = [...tabs.flatMap((t) => [t.href, ...(t.paths ?? [])].map((href) => ({ href, tab: t.href as string | null }))), ...morePaths.map((href) => ({ href, tab: null }))];
  const match = longestMatch(path, routes);
  const current = pendingHref ?? (match ? (match.tab ?? match.href) : null);
  const form = FORM_ROUTE.test(path);
  return (
    <MoreSheetContext.Provider value={() => setOpen(true)}>
      {children}
      {form && <span hidden data-no-tabbar />}
      <nav aria-label="Tabs" hidden={form} className="tab-bar fixed inset-x-0 bottom-0 z-40 select-none border-t border-line bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 lg:hidden desktop-app:hidden" data-tab-bar>
        <ul className="mx-auto grid h-[60px] max-w-xl grid-cols-4 px-1">
          {tabs.map((t) => {
            const on = !open && t.href === current;
            return (
              <li key={t.href} className="flex">
                <Link
                  href={t.href}
                  prefetch={warmed.has(t.href)}
                  onTouchStart={() => warm(t.href)}
                  onMouseEnter={() => warm(t.href)}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && t.href !== path) markPending(t.href);
                  }}
                  aria-current={on ? "page" : undefined}
                  aria-label={t.primary ? t.label : undefined}
                  className={cn("tab-item flex flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium tracking-tight", on ? "text-accent-ink" : "text-faint")}
                  data-tab={t.href}
                >
                  {t.primary ? (
                    <span className="flex size-[42px] items-center justify-center rounded-[14px] bg-accent text-accent-fg shadow-[0_10px_22px_-10px_var(--accent)]">
                      <Icon name={t.icon} size={22} />
                    </span>
                  ) : (
                    <>
                      <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200", on && "bg-accent-soft")}>
                        <Icon name={t.icon} size={20} />
                      </span>
                      <span className="max-w-full truncate px-0.5">{t.label}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <BottomSheet open={open} onClose={close} title="More" data-more-sheet>
        <div
          onClickCapture={(e) => {
            // A link to the page that's already open doesn't change the path: close here too.
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
          onSubmitCapture={() => setTimeout(() => setOpen(false), 0)}
        >
          {more}
        </div>
      </BottomSheet>
    </MoreSheetContext.Provider>
  );
}

/** The profile picture in the title bar on phones and tablets: opens the More sheet (account, pages, sign out). */
export function MobileAccountButton({ children, label }: { children: ReactNode; label: string }) {
  const open = useContext(MoreSheetContext);
  return (
    <button type="button" onClick={open} aria-label={label} className="flex size-9 items-center justify-center rounded-full lg:hidden desktop-app:hidden" data-mobile-account>
      {children}
    </button>
  );
}

/**
 * The left of the title bar on phones: the workspace at the top of a page, and the page's own
 * name once its big heading has scrolled away, the way phone apps do it.
 */
export function MobileTitle({ workspace, titles }: { workspace: string; titles: { href: string; label: string }[] }) {
  const path = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);
  const href = activeHref(path, titles.map((t) => ({ ...t, icon: "grid" as const })));
  const title = titles.find((t) => t.href === href)?.label ?? null;
  const showTitle = scrolled && title !== null;
  return (
    <div className="relative h-9 min-w-0 flex-1 md:hidden desktop-app:hidden" data-mobile-title>
      <Link
        href="/business/dashboard"
        className={cn("absolute inset-0 flex items-center gap-2 transition-all duration-200", showTitle ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100")}
        aria-hidden={showTitle || undefined}
        tabIndex={showTitle ? -1 : undefined}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(160deg,var(--accent),color-mix(in_oklab,var(--accent)_60%,#000))] text-[13px] font-semibold text-white">{workspace.slice(0, 1).toUpperCase()}</span>
        <span className="min-w-0 truncate text-[16px] font-semibold tracking-tight text-fg">{workspace}</span>
      </Link>
      <p aria-hidden={!showTitle || undefined} className={cn("absolute inset-0 flex items-center truncate text-[16px] font-semibold tracking-tight text-fg transition-all duration-200", showTitle ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0")}>
        {title}
      </p>
    </div>
  );
}
