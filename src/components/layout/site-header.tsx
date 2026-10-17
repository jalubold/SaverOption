import Link from "next/link";
import { mainNav } from "@/config/site";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderSearch } from "@/components/search/header-search";
import { Container } from "@/components/ui/primitives";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <Container className="flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-subtle hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <HeaderSearch />
          <MobileNav items={mainNav} />
        </div>
      </Container>
    </header>
  );
}
