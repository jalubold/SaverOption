"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The deals site's header and footer. Saver Option Business (/business) brings
 * its own: a product header on its public pages (which keep the site footer,
 * the deals catalog at /business/software-deals included) and the app shell
 * inside the signed-in app. The home page (/) is the Business landing page too
 * (a rewrite in next.config.ts), so it gets the same chrome as /business.
 */
export function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const path = usePathname() ?? "/";
  const landing = path === "/" || path === "/business";
  const business = landing || path.startsWith("/business/");
  const businessPublic =
    landing ||
    ["/business/mcp", "/business/download", "/business/login", "/business/signup"].includes(path) ||
    path === "/business/software-deals" ||
    path.startsWith("/business/software-deals/") ||
    path.startsWith("/business/invite/");
  const dark = landing || ["/business/mcp", "/business/download"].includes(path);
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
