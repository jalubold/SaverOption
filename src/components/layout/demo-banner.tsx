import { siteConfig } from "@/config/site";

/** Site-wide notice shown while the catalog contains sample data. */
export function DemoBanner() {
  if (!siteConfig.demoMode) return null;
  return (
    <div className="border-b border-warn/20 bg-warn-soft">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs leading-5 text-warn sm:px-6">
        <strong className="font-semibold">Preview build.</strong> Every listing on this site is fictional sample
        content for development — none are live offers.
      </p>
    </div>
  );
}
