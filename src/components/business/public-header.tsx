import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { PublicMobileMenu } from "@/components/business/public-menu";
import { HideInDesktopApp, SignedInSwitch } from "@/components/business/session-hint";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";

// `wide`: shown in the inline nav only from that breakpoint (landing-page sections, so the
// header fits next to the full name); the menu button lists every link on narrower screens.
const links: { href: string; label: string; wide?: string }[] = [
  { href: "/business#features", label: "Features" },
  { href: "/business/mcp", label: "AI & MCP" },
  { href: "/business#how-it-works", label: "How it works", wide: "hidden 2xl:block" },
  { href: "/business#pricing", label: "Pricing" },
  { href: "/business#faq", label: "FAQ", wide: "hidden xl:block" },
  { href: "/business/docs", label: "Docs" },
  // ?start=1: on a Mac the file starts downloading as the page (with the install steps) opens.
  { href: "/business/download?start=1", label: "Download" },
  { href: "/deals", label: "Software deals" },
];

/**
 * Header for the public Saver Option Business pages (landing, sign-in, docs).
 * Without `signedIn` (prerendered pages), the browser's sign-in hint picks the buttons.
 */
export function BusinessPublicHeader({ signedIn }: { signedIn?: boolean }) {
  const dashboard = (
    <Link href="/business/dashboard" className={buttonClass("primary", "sm")}>
      <span className="hidden min-[380px]:inline">Open dashboard</span>
      <span className="min-[380px]:hidden">Dashboard</span> <Icon name="arrow-right" size={13} />
    </Link>
  );
  const signIn = (
    <>
      <Link href="/business/login" className={buttonClass("ghost", "sm", "hidden lg:inline-flex")}>
        Sign in
      </Link>
      <Link href="/business/signup" className={buttonClass("primary", "sm")}>
        Get started
      </Link>
    </>
  );
  return (
    // Inline background: .theme-dark sets an opaque one outside the utility layers.
    <header data-tauri-drag-region className="theme-dark sticky top-0 z-40 border-b border-line backdrop-blur-md" style={{ backgroundColor: "color-mix(in oklab, var(--bg) 82%, transparent)" }}>
      <Container data-tauri-drag-region className="flex h-16 items-center gap-6 desktop-app:max-xl:pl-[84px]">
        <Link href="/business" className="flex min-w-0 shrink items-center gap-2.5" aria-label="Saver Option Business home">
          <BrandMark className="shrink-0 drop-shadow-[0_4px_14px_color-mix(in_oklab,var(--accent)_55%,transparent)]" />
          {/* Stacked on phones so the name never has to be cut off. */}
          <span className="flex min-w-0 flex-col whitespace-nowrap font-semibold leading-tight tracking-tight text-fg sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="truncate text-[15px] sm:text-[16px]">Saver Option</span>
            <span className="text-[10.5px] uppercase tracking-[0.14em] text-accent-ink sm:text-[16px] sm:normal-case sm:tracking-tight">Business</span>
          </span>
        </Link>
        <nav aria-label="Business" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {links.map((l) => {
              const item = (
                <li key={l.href} className={l.wide}>
                  <Link href={l.href} className="whitespace-nowrap rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              );
              // No point offering the Mac app inside the Mac app.
              return l.href.startsWith("/business/download") ? <HideInDesktopApp key={l.href}>{item}</HideInDesktopApp> : item;
            })}
          </ul>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {signedIn === undefined ? <SignedInSwitch signedIn={dashboard} signedOut={signIn} /> : signedIn ? dashboard : signIn}
          <PublicMobileMenu links={links} signedIn={signedIn} />
        </div>
      </Container>
    </header>
  );
}
