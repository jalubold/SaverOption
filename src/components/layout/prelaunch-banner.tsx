import { siteConfig } from "@/config/site";
import { getCatalogStats } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

/** Site-wide notice shown before launch. */
export async function PrelaunchBanner() {
  if (!siteConfig.prelaunch) return null;
  const { lastChecked } = await getCatalogStats();
  return (
    <div className="promo-bar">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-medium leading-5 sm:px-6">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#f2545b]" />
        <span>
          <strong className="font-semibold">Pre-launch preview.</strong>{" "}
          {lastChecked ? `Offers were checked against official pages on ${formatDate(lastChecked)}.` : "Offers are being checked."}{" "}
          Always confirm the terms on the provider&apos;s site.
        </span>
      </p>
    </div>
  );
}
