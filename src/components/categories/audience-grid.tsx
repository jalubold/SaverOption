import { siteConfig } from "@/config/site";
import { CollectionGrid } from "@/components/categories/collection-tile";
import type { Audience, Product } from "@/lib/types";

/** "Saver Option for …" collection cards. */
export function AudienceGrid({ audiences }: { audiences: (Audience & { count: number; products: Product[] })[] }) {
  return (
    <CollectionGrid
      eyebrow={`${siteConfig.name} for`}
      items={audiences.map((a) => ({ ...a, href: `/for/${a.slug}` }))}
    />
  );
}
