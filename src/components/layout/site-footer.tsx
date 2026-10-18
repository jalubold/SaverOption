import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/primitives";
import { getCategories } from "@/lib/catalog";

export async function SiteFooter() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Browse",
      links: [
        { label: "All deals", href: "/deals" },
        { label: "Newest", href: "/deals?sort=newest" },
        { label: "Ending soon", href: "/deals?sort=ending-soon" },
        { label: "Free offers", href: "/deals?price=free" },
        { label: "All categories", href: "/categories" },
      ],
    },
    {
      title: "Categories",
      links: categories.slice(0, 6).map((c) => ({ label: c.name, href: `/categories/${c.slug}` })),
    },
    {
      title: "About",
      links: [
        { label: `About ${siteConfig.name}`, href: "/about" },
        { label: "Partnerships", href: "/partnerships" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Terms of use", href: "/terms" },
        { label: "Submit or correct a deal", href: `mailto:${siteConfig.contactEmail}?subject=Deal%20submission` },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-bg">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-0 lg:divide-x lg:divide-line">
        <div className="max-w-xs sm:col-span-3 lg:col-span-1 lg:pr-10">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="lg:px-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">{col.title}</h2>
            <ul className="mt-3 space-y-0.5 lg:mt-4 lg:space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("mailto:") ? (
                    <a href={link.href} className="inline-block py-1.5 text-sm text-muted hover:text-fg lg:py-0">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="inline-block py-1.5 text-sm text-muted hover:text-fg lg:py-0">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs leading-relaxed text-faint sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Offers are set by their providers and can change at any time. Always confirm the
            terms on the provider&apos;s site.
          </p>
          <p className="shrink-0">
            Paid placements are labelled.{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-muted">
              Disclosure
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
