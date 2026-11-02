import Link from "next/link";
import { PromoteTrigger } from "@/components/promote/promote-modal";
import { mainNav } from "@/config/site";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderSearch } from "@/components/search/header-search";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { campaignShown, getCampaign } from "@/lib/catalog";

export function SiteHeader() {
  // Through November the Black Friday page leads the menu.
  const bf = getCampaign("black-friday");
  const items = bf && campaignShown(bf) ? [{ label: "Black Friday", href: "/black-friday" }, ...mainNav] : [...mainNav];
  return (
    <header className="theme-dark sticky top-0 z-40 border-b border-line bg-bg">
      <Container className="flex h-16 items-center gap-6 xl:gap-8">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    item.href === "/black-friday"
                      ? "whitespace-nowrap rounded-md bg-[linear-gradient(90deg,#f2545b,#ffb547)] bg-clip-text px-2.5 py-1.5 text-sm font-semibold text-transparent transition-opacity hover:opacity-80"
                      : "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium text-fg/90 transition-colors hover:bg-subtle hover:text-fg"
                  }
                  data-nav-black-friday={item.href === "/black-friday" || undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <HeaderSearch />
          <PromoteTrigger className={buttonClass("primary", "sm", "hidden whitespace-nowrap sm:inline-flex")}>
            Promote your SaaS
            <Icon name="arrow-up-right" size={13} />
          </PromoteTrigger>
          <MobileNav items={items} />
        </div>
      </Container>
    </header>
  );
}
