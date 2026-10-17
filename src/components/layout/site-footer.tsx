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
      links: categories.map((c) => ({ label: c.name, href: `/categories/${c.slug}` })),
    },
    {
      title: "Company",
      links: [
        { label: `About ${siteConfig.name}`, href: "/about" },
        { label: "How we make money", href: "/disclosure" },
        { label: "Submit or correct a deal", href: `mailto:${siteConfig.contactEmail}?subject=Deal%20submission` },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-bg">
      <Container className="pt-14">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {columns.map((col, i) => (
            <nav key={col.title} aria-label={col.title} className={i > 0 ? "md:pl-10" : "md:pr-10"}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">{col.title}</h2>
              <ul className={col.links.length > 6 ? "mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1" : "mt-4 space-y-2.5"}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href} className="text-[15px] text-muted hover:text-fg">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[15px] text-muted hover:text-fg">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>
      <div className="mt-14 border-t border-line">
        <Container className="space-y-1.5 py-7 text-center text-[13px] leading-relaxed text-faint">
          <p>
            © {year} {siteConfig.name}. Offers are set by their providers and can change at any time. Always confirm the
            terms on the provider&apos;s site.
          </p>
          <p>
            Paid placements are labelled.{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-muted">
              How we make money
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
