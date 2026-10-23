"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The deals site's header and footer. Saver Option Business (/business) brings
 * its own: a product header on its public pages (which keep the site footer)
 * and the app shell inside the signed-in app.
 */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const path = usePathname() ?? "/";
  const business = path === "/business" || path.startsWith("/business/");
  const businessPublic = path === "/business" || path === "/business/login" || path === "/business/signup";
  // The business app shell renders its own <main>.
  if (business && !businessPublic) return <>{children}</>;
  return (
    <>
      {!business && header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
