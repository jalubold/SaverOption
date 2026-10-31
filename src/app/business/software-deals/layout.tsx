import type { ReactNode } from "react";
import { BusinessPublicHeader } from "@/components/business/public-header";

/**
 * The deals catalog inside Saver Option Business's navigation: the same pages as /deals
 * (see src/lib/deals-paths.ts), for visitors who come from Business. The header sits in
 * the layout so it stays put while a list or a deal loads.
 */
export default function BusinessDealsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BusinessPublicHeader />
      {children}
    </>
  );
}
