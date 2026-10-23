import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";

/** Header for the public Saver Option Business pages (landing, sign-in). */
export function BusinessPublicHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="theme-dark sticky top-0 z-40 border-b border-line bg-bg">
      <Container className="flex h-16 items-center gap-6">
        <Link href="/business" className="flex items-center gap-2.5" aria-label="Saver Option Business home">
          <BrandMark />
          <span className="whitespace-nowrap text-[16px] font-semibold tracking-tight text-fg">
            Saver Option <span className="text-accent-ink">Business</span>
          </span>
        </Link>
        <nav aria-label="Business" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link href="/business#features" className="rounded-md px-2.5 py-1.5 text-fg/90 hover:bg-subtle">
                Features
              </Link>
            </li>
            <li>
              <Link href="/business#how-it-works" className="rounded-md px-2.5 py-1.5 text-fg/90 hover:bg-subtle">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/business#faq" className="rounded-md px-2.5 py-1.5 text-fg/90 hover:bg-subtle">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/deals" className="rounded-md px-2.5 py-1.5 text-fg/90 hover:bg-subtle">
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
