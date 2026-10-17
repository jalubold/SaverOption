import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ExpiryText, OfferBadges, SponsoredLabel, VerificationText } from "@/components/offers/offer-meta";
import { OfferGrid } from "@/components/offers/offer-card";
import { ProductLogo } from "@/components/offers/product-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { Badge, buttonClass, Container, Notice, SectionHeading } from "@/components/ui/primitives";
import { getAllOfferSlugs, getOfferBySlug, getRelatedOffers } from "@/lib/catalog";
import { formatDate, formatMoney, headlineValue, summarizePrice } from "@/lib/format";
import { offerSourceLabels, offerTypeLabels } from "@/lib/labels";
import { destinationUrl, hostname, outboundHref, outboundRel } from "@/lib/outbound";
import { breadcrumbJsonLd, offerJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllOfferSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/deals/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return {};
  return pageMetadata({
    title: `${offer.title}${offer.isExpired ? " (ended)" : ""}`,
    description: offer.summary,
    path: `/deals/${offer.slug}`,
  });
}

export default async function DealPage(props: PageProps<"/deals/[slug]">) {
  const { slug } = await props.params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const related = await getRelatedOffers(offer, 3);
  const value = headlineValue(offer);
  const price = summarizePrice(offer.pricing);
  const destination = destinationUrl(offer);
  // Show the domain people will recognise — the offer page — even when the click goes via an affiliate URL.
  const destinationHost = hostname(destination.kind === "affiliate" ? offer.links.officialUrl : destination.url);
  const primaryCategory = offer.categoryList[0];
  const paragraphs = offer.description.split(/\n\s*\n/);

  const crumbs = [
    { name: "Deals", path: "/deals" },
    ...(primaryCategory ? [{ name: primaryCategory.name, path: `/categories/${primaryCategory.slug}` }] : []),
    { name: offer.product.name, path: `/deals/${offer.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, ...crumbs])} />
      <JsonLd data={offerJsonLd(offer)} />

      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
            <li>
              <Link href="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-muted">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-fg">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      <Container className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        {/* ── Main column ─────────────────────────────────────────── */}
        <article className="min-w-0">
          {offer.isExpired && (
            <Notice tone="warn" title="This offer has ended" className="mb-6">
              It ended on {formatDate(offer.expiresAt!)}. We keep the page so you know it&apos;s no longer available —
              see related offers below.
            </Notice>
          )}
          {offer.verification.status === "demo" && (
            <Notice title="Sample listing" className="mb-6">
              This product and offer are fictional demo content. Nothing here is a real promotion.
            </Notice>
          )}

          <SponsoredLabel offer={offer} className="mb-3" />
          <header>
            <div className="flex items-center gap-3">
              <ProductLogo product={offer.product} size="lg" />
              <div>
                <Link
                  href={`/products/${offer.product.slug}`}
                  className="text-[15px] font-semibold text-fg hover:text-accent-ink"
                >
                  {offer.product.name}
                </Link>
                <p className="text-sm text-muted">by {offer.provider.name}</p>
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-[2.125rem]">{offer.title}</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-muted">{offer.summary}</p>
            <div className="mt-5">
              <OfferBadges offer={offer} showSource />
            </div>

            {/* Small screens: surface the value and CTA before the long-form content. */}
            {!offer.isExpired && (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 lg:hidden">
                <div className="min-w-0 text-sm">
                  {value && <p className="font-semibold text-accent-ink">{value}</p>}
                  <ExpiryText offer={offer} className="mt-0.5 text-xs" />
                </div>
                <a href={outboundHref(offer)} rel={outboundRel(offer)} target="_blank" className={buttonClass("primary", "md", "shrink-0")}>
                  View deal <Icon name="external" size={14} />
                  <span className="sr-only">on {destinationHost} (opens in a new tab)</span>
                </a>
              </div>
            )}
          </header>

          <div className="mt-10 space-y-10">
            <DetailSection title="About this offer">
              <div className="prose-body">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </DetailSection>

            {offer.eligibility.length > 0 && (
              <DetailSection title="Who's eligible">
                <ul className="space-y-2">
                  {offer.eligibility.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] text-muted">
                      <Icon name="check" size={18} className="mt-0.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {offer.redemption.length > 0 && (
              <DetailSection title="How to redeem">
                <ol className="space-y-3">
                  {offer.redemption.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[15px] text-muted">
                      <span className="tabular inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-fg">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </DetailSection>
            )}

            {offer.terms.length > 0 && (
              <DetailSection title="Terms and restrictions">
                <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-muted marker:text-faint">
                  {offer.terms.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-faint">
                  Terms are summarised from the provider&apos;s page and may change. The provider&apos;s terms always
                  take precedence.
                </p>
              </DetailSection>
            )}

            <DetailSection title={`About ${offer.product.name}`}>
              <p className="text-[15px] leading-relaxed text-muted">{offer.product.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {offer.product.tags.map((tag) => (
                  <Link key={tag} href={`/deals?q=${encodeURIComponent(tag)}`}>
                    <Badge tone="neutral" className="hover:text-fg">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
              {offer.product.openSource && (
                <p className="mt-4 text-sm text-muted">
                  Open source under the {offer.product.openSource.license} license.{" "}
                  <a href={offer.product.openSource.repoUrl} rel="nofollow noopener" target="_blank" className="font-medium text-accent-ink hover:underline">
                    View source
                  </a>
                </p>
              )}
              <Link
                href={`/products/${offer.product.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline underline-offset-4"
              >
                All {offer.product.name} offers <Icon name="arrow-right" size={14} />
              </Link>
            </DetailSection>
          </div>
        </article>

        {/* ── Offer summary sidebar ───────────────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Offer summary">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{offerTypeLabels[offer.type]}</p>
            {value && <p className="mt-2 text-2xl font-semibold tracking-tight text-accent-ink">{value}</p>}

            {price && (
              <dl className="mt-4 space-y-1.5 text-sm">
                {price.current && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Offer price</dt>
                    <dd className="tabular font-medium text-fg">{price.current}</dd>
                  </div>
                )}
                {(price.was || price.note) && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Regular price</dt>
                    <dd className="tabular text-muted">{price.was ? <s>{price.was}</s> : price.note?.replace(/^Normally /, "")}</dd>
                  </div>
                )}
              </dl>
            )}
            {offer.pricing?.creditValue && (
              <p className="mt-3 text-sm text-muted">
                Credit value: <span className="tabular font-medium text-fg">{formatMoney(offer.pricing.creditValue, offer.pricing.currency)}</span>
              </p>
            )}

            <div className="mt-4 text-sm">
              {offer.expiresAt ? (
                <ExpiryText offer={offer} />
              ) : (
                <span className="inline-flex items-center gap-1 text-muted">
                  <Icon name="clock" size={13} /> No end date announced
                </span>
              )}
            </div>

            {offer.isExpired ? (
              <a href={offer.product.website} rel="nofollow noopener" target="_blank" className={buttonClass("secondary", "lg", "mt-6 w-full")}>
                Visit {offer.product.name}
                <Icon name="external" size={15} />
              </a>
            ) : (
              <a href={outboundHref(offer)} rel={outboundRel(offer)} target="_blank" className={buttonClass("primary", "lg", "mt-6 w-full")}>
                View deal on {destinationHost}
                <Icon name="external" size={15} />
              </a>
            )}
            <p className="mt-2.5 text-center text-xs text-faint">
              Opens {offer.isExpired ? hostname(offer.product.website) : destinationHost} in a new tab.
            </p>

            <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-faint">Source</dt>
                <dd className="mt-1">
                  <span className="font-medium text-fg">
                    {offerSourceLabels[offer.source].label}
                    {offer.sourceName && ` · ${offer.sourceName}`}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{offerSourceLabels[offer.source].description}</span>
                  <a href={offer.links.officialUrl} rel="nofollow noopener" target="_blank" className="mt-1 inline-block break-all text-[13px] text-accent-ink hover:underline">
                    {hostname(offer.links.officialUrl)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-faint">Verification</dt>
                <dd className="mt-1">
                  <VerificationText offer={offer} long />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-faint">Last updated</dt>
                <dd className="mt-1 text-muted">
                  <time dateTime={offer.updatedAt}>{formatDate(offer.updatedAt)}</time>
                </dd>
              </div>
            </dl>

            {(destination.kind === "affiliate" || offer.isSponsored || offer.placement?.exclusive) && (
              <div className="mt-5 space-y-2 rounded-lg bg-subtle p-3 text-[13px] leading-snug text-muted">
                {destination.kind === "affiliate" && (
                  <p>
                    <strong className="font-medium text-fg">Affiliate link.</strong> {siteConfig.name} may earn a commission
                    if you buy through this link, at no extra cost to you.
                  </p>
                )}
                {offer.isSponsored && (
                  <p>
                    <strong className="font-medium text-fg">Sponsored.</strong> {offer.placement?.sponsored?.sponsor} paid for
                    this placement. It doesn&apos;t affect how we describe or verify the offer.
                  </p>
                )}
                {offer.placement?.exclusive && (
                  <p>
                    <strong className="font-medium text-fg">Exclusive.</strong> Arranged with the provider for{" "}
                    {siteConfig.name} readers.
                  </p>
                )}
                <Link href="/disclosure" className="inline-block font-medium text-accent-ink hover:underline">
                  How we make money
                </Link>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-faint">
            Something wrong with this offer?{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`Correction: ${offer.title}`)}`}
              className="underline underline-offset-2 hover:text-muted"
            >
              Report it
            </a>
          </p>
        </aside>
      </Container>

      {related.length > 0 && (
        <Container className="mt-20">
          <section aria-labelledby="related-heading">
            <SectionHeading id="related-heading" title="Related offers" href={primaryCategory ? `/categories/${primaryCategory.slug}` : "/deals"} linkLabel={primaryCategory ? `More ${primaryCategory.name.toLowerCase()}` : "All deals"} />
            <OfferGrid offers={related} />
          </section>
        </Container>
      )}
    </>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
