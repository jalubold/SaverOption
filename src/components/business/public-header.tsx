import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";

/** Header for the public Saver Option Business pages (landing, sign-in). */
export function BusinessPublicHeader({ signedIn }: { signedIn: boolean }) {
  return (
    // Inline background: .theme-dark sets an opaque one outside the utility layers.
    <header className="theme-dark sticky top-0 z-40 border-b border-line backdrop-blur-md" style={{ backgroundColor: "color-mix(in oklab, var(--bg) 82%, transparent)" }}>
      <Container className="flex h-16 items-center gap-6">
        <Link href="/business" className="flex shrink-0 items-center gap-2.5" aria-label="Saver Option Business home">
          <BrandMark className="drop-shadow-[0_4px_14px_color-mix(in_oklab,var(--accent)_55%,transparent)]" />
          <span className="whitespace-nowrap text-[16px] font-semibold tracking-tight text-fg">
            Saver Option <span className="text-accent-ink">Business</span>
          </span>
        </Link>
        <nav aria-label="Business" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link href="/business#features" className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                Features
              </Link>
            </li>
            <li>
              <Link href="/business#how-it-works" className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/business#faq" className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/business/docs" className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                Docs
              </Link>
            </li>
            <li>
              <Link href="/deals" className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg">
                Software deals
              </Link>
            </li>
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {signedIn ? (
            <Link href="/business/dashboard" className={buttonClass("primary", "sm")}>
              Open dashboard <Icon name="arrow-right" size={13} />
            </Link>
          ) : (
            <>
              <Link href="/business/login" className={buttonClass("ghost", "sm", "hidden sm:inline-flex")}>
                Sign in
              </Link>
              <Link href="/business/signup" className={buttonClass("primary", "sm")}>
                Get started
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
