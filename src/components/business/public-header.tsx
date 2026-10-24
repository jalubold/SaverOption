import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { PublicMobileMenu } from "@/components/business/public-menu";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";

const links = [
  { href: "/business#features", label: "Features" },
  { href: "/business/mcp", label: "AI & MCP" },
  { href: "/business#how-it-works", label: "How it works" },
  { href: "/business#pricing", label: "Pricing" },
  { href: "/business#faq", label: "FAQ" },
  { href: "/business/docs", label: "Docs" },
  { href: "/deals", label: "Software deals" },
];

/** Header for the public Saver Option Business pages (landing, sign-in, docs). */
export function BusinessPublicHeader({ signedIn }: { signedIn: boolean }) {
  return (
    // Inline background: .theme-dark sets an opaque one outside the utility layers.
    <header className="theme-dark sticky top-0 z-40 border-b border-line backdrop-blur-md" style={{ backgroundColor: "color-mix(in oklab, var(--bg) 82%, transparent)" }}>
      <Container className="flex h-16 items-center gap-6">
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
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {signedIn ? (
            <Link href="/business/dashboard" className={buttonClass("primary", "sm")}>
              <span className="hidden min-[380px]:inline">Open dashboard</span>
              <span className="min-[380px]:hidden">Dashboard</span> <Icon name="arrow-right" size={13} />
            </Link>
          ) : (
            <>
              <Link href="/business/login" className={buttonClass("ghost", "sm", "hidden lg:inline-flex")}>
                Sign in
              </Link>
              <Link href="/business/signup" className={buttonClass("primary", "sm")}>
                Get started
              </Link>
            </>
          )}
          <PublicMobileMenu links={links} signedIn={signedIn} />
        </div>
      </Container>
    </header>
  );
}
