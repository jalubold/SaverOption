import Link from "next/link";
import { ExpiryText } from "@/components/offers/offer-meta";
import { ProductLogo } from "@/components/offers/product-logo";
import { headlineValue } from "@/lib/format";
import type { OfferView } from "@/lib/types";

/** Dense single-line listing for side panels and compact lists. */
export function OfferRow({ offer }: { offer: OfferView }) {
  const value = headlineValue(offer);
  return (
    <Link
      href={`/deals/${offer.slug}`}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-subtle"
    >
      <ProductLogo product={offer.product} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">
          {offer.product.name}
          {value && <span className="font-normal text-muted"> · {value}</span>}
        </p>
        <p className="mt-0.5 text-xs">
          <ExpiryText offer={offer} />
        </p>
      </div>
    </Link>
  );
}
