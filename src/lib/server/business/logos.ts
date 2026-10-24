import { normalizeName } from "@/lib/business/calc";
import { businessLogos } from "@/lib/business/logo-map";
import { catalogProduct, matchCatalogProduct } from "@/lib/server/business/catalog-match";

/**
 * The logo for a software record: a well-known tool's square mark matched by
 * name or website (public/logos/business), else its Saver Option catalog
 * product's logo, or null — the UI then shows a coloured monogram. Nothing is fetched from
 * third parties at runtime.
 */

const byName = new Map<string, string>();
const byHost: { host: string; slug: string }[] = [];
for (const l of businessLogos) {
  for (const n of l.names) byName.set(normalizeName(n), l.slug);
  for (const h of l.hosts) byHost.push({ host: h, slug: l.slug });
}
// Longer (more specific) hosts first, so atlassian.com/software/jira wins over atlassian.com.
byHost.sort((a, b) => b.host.length - a.host.length);

function hostPath(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

const cache = new Map<string, string | null>();

export function logoFor(name: string, website: string | null, catalogProductId: string | null): string | null {
  const key = `${name}|${website ?? ""}|${catalogProductId ?? ""}`;
  if (cache.has(key)) return cache.get(key)!;
  // Bundled square marks first: some catalog logos are wide wordmarks that don't read in a small tile.
  let src: string | null = null;
  const slug = byName.get(normalizeName(name));
  if (slug) src = `/logos/business/${slug}.svg`;
  if (!src) {
    const hp = hostPath(website);
    const hit = hp && byHost.find((h) => hp === h.host || hp.startsWith(`${h.host}/`) || hp.startsWith(h.host));
    if (hit) src = `/logos/business/${hit.slug}.svg`;
  }
  if (!src) src = catalogProduct(catalogProductId)?.logo?.src ?? null;
  if (!src) src = matchCatalogProduct(name, website)?.logo?.src ?? null;
  if (cache.size > 2000) cache.clear();
  cache.set(key, src);
  return src;
}
