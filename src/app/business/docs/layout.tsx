import Link from "next/link";
import type { ReactNode } from "react";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { DocsNav } from "@/components/business/docs/docs-nav";
import { docNav } from "@/components/business/docs/nav-items";
import { Container } from "@/components/ui/primitives";
import { docGroups } from "@/content/business-docs";

/** Saver Option Business documentation: public, static pages with a shared side navigation. */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BusinessPublicHeader />
      <main id="main" className="flex-1 bg-bg">
        <Container className="grid gap-6 py-8 sm:py-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
          <aside className="min-w-0">
            <DocsNav items={docNav} groups={docGroups} />
          </aside>
          <div className="min-w-0 max-w-3xl">{children}</div>
        </Container>
      </main>
      <footer className="border-t border-line bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-6 text-[13px] text-faint">
          <span>Saver Option Business documentation</span>
          <span className="flex flex-wrap gap-4">
            <Link href="/business" className="hover:text-fg">
              Saver Option Business
            </Link>
            <Link href="/business/download" className="hover:text-fg">
              Download for Mac
            </Link>
            <Link href="/business/software-deals" className="hover:text-fg">
              Software deals
            </Link>
            <Link href="/privacy" className="hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-fg">
              Terms
            </Link>
            <Link href="/disclosure" className="hover:text-fg">
              Disclosure
            </Link>
          </span>
        </Container>
      </footer>
    </>
  );
}
