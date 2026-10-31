"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The deals site's header and footer. Saver Option Business (/business) brings
 * its own: a product header on its public pages (which keep the site footer,
 * the deals catalog at /business/software-deals included) and the app shell
 * inside the signed-in app.
 */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const path = usePathname() ?? "/";
  const business = path === "/business" || path.startsWith("/business/");
  const businessPublic =
    ["/business", "/business/mcp", "/business/download", "/business/login", "/business/signup"].includes(path) ||
    path === "/business/software-deals" ||
    path.startsWith("/business/software-deals/");
  const dark = ["/business", "/business/mcp", "/business/download"].includes(path);
  // The business app shell renders its own <main>.
  if (business && !businessPublic) return <>{children}</>;
  return (
    <>
      {!business && header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {/* The Business landing, MCP and download pages are dark from top to bottom, footer included. */}
      {dark ? <div className="theme-dark">{footer}</div> : footer}
    </>
  );
}
