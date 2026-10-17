import { siteConfig } from "@/config/site";

/** Site-wide notice shown while the catalog contains sample data. */
export function DemoBanner() {
  if (!siteConfig.demoMode) return null;
  return (
    <div className="promo-bar">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-medium leading-5 sm:px-6">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#f2545b]" />
        <span>
          <strong className="font-semibold">Preview build.</strong> Every listing here is fictional sample content, not a
          live offer.
        </span>
      </p>
    </div>
  );
}
