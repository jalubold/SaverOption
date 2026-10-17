# Saver Option: software deals & savings discovery

A discovery site for software deals, free credits, startup perks, student discounts, lifetime deals and open-source alternatives. Users find offers here and redeem them on the provider's site. It is not a marketplace.

> **Demo content.** Every product and offer in `src/content/` is fictional, uses the reserved `.example` domain, and is marked `verification.status: "demo"`. While `siteConfig.demoMode` is `true`, a site-wide banner says so and the site is `noindex`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (typechecks)
npm run lint
```

Node 20+ required. Copy `.env.example` to `.env.local` to set the site URL, brand overrides and newsletter provider.

## Stack

- **Next.js 16** (App Router, React Server Components) with TypeScript
- **Tailwind CSS v4**, using design tokens defined as CSS variables in `src/app/globals.css`
- **Geist** for UI text (self-hosted through the `geist` package) and **Instrument Serif** for editorial display headings (`next/font/google`)
- No database yet. Content is typed TypeScript, read through a single data-access module.

## Rebranding

The working brand is **Saver Option**. Everything brand-related lives in **`src/config/site.ts`**, so it can still change in one place:

| Setting | Where it's used |
|---|---|
| `name`, `tagline`, `description` | Header, footer, page titles, metadata, Open Graph image, JSON-LD, policy pages |
| `logo` | `{ kind: "mark" }` (built-in mark tinted with the accent) or `{ kind: "image", src, width, height }` |
| `theme.accent` / `accentDeep` / `accentOnDark` / `accentContrast` | Injected as CSS variables on `<html>`. Button gradients, links, focus rings, the "How it works" panel, favicon and OG image follow them. |
| `contactEmail` | Corrections and submissions links |
| `demoMode` | Demo banner and `noindex` |

`NEXT_PUBLIC_BRAND_NAME` and `NEXT_PUBLIC_BRAND_TAGLINE` override the name and tagline without editing code. No component hardcodes a brand string.

## Design system

The visual direction follows jiro.build: a dark, search-first catalog (header, page heroes, deal grids) above light editorial sections with large Instrument Serif headings and a muted italic phrase.

- **Two token scopes.** Light tokens sit on `:root`. Wrapping any element in `.theme-dark` re-skins every component inside it, because components only read tokens (`bg-surface`, `text-fg`, `border-line`…). The same `OfferCard` renders on dark listing pages and in light "Related offers".
- **Component classes** in `globals.css`: `.btn-primary` (glossy accent gradient), `.btn-secondary`, `.seg`/`.seg-item` (pill tabs with an accent ring), `.eyebrow` (uppercase chip), `.display` (serif headings, `<em>` becomes the muted italic), `.hero-glow` and `.promo-bar`.
- The look is a fixed design rather than following the OS light/dark setting.

## Project structure

```
src/
  config/site.ts           brand + navigation
  content/                 demo catalog (categories, providers, products, offers)
  lib/
    types.ts               content model
    catalog.ts             ALL data access (query, search, facets, related, popular)
    search.ts              weighted keyword search
    format.ts              money/date/expiry formatting, price summaries
    outbound.ts            /go/ links, rel attributes, destination choice
    engagement.ts          click recording + popularity source (stub)
    newsletter.ts          newsletter provider adapter
    seo.ts                 metadata + JSON-LD helpers
  components/              ui/, layout/, offers/, search/, categories/, newsletter/, seo/
  app/
    page.tsx               homepage
    deals/(search)/        /deals: search, filters, sort, pagination
    deals/[slug]/          offer detail
    categories/, products/[slug]/, about/, disclosure/
    go/[slug]/route.ts     outbound redirect
    api/newsletter/        signup endpoint
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.tsx
```

## Content model

`Provider 1─* Product 1─* Offer *─* Category`. See `src/lib/types.ts`. Key fields on an offer:

- `type`: discount, lifetime, free-credits, free-trial, free-plan, student, startup or open-source.
- `categories`: many-to-many. Categories are data in `src/content/categories.ts`, so you can add, rename or reorder them freely.
- `source`: `official` (the provider), `partner` (arranged with this site) or `third-party` (a reseller or marketplace). Shown on cards and detail pages.
- `pricing`: every field is optional. `savingsLabel` should repeat the provider's own wording. `regularPeriod` handles comparisons like "$69 once vs. $19/month", which never get a strikethrough.
- `expiresAt`: only set when the provider states an end date. Expired offers drop out of listings automatically, keep their detail page with an "ended" notice, and redirect `/go/` to that page. Pages revalidate hourly.
- `verification`: `verified` (an editor checked it on `checkedAt`), `unverified` or `demo`. Only `verified` offers get Product/Offer JSON-LD.
- `links`: `officialUrl` (always shown as the source), plus optional `redeemUrl` and `affiliateUrl`.
- `placement`: `featured` and `featuredRank` (editorial, unpaid), `sponsored` (paid, with optional date window) and `exclusive`.
- `status`: `draft`, `published` or `archived`. Only `published` offers ever leave `catalog.ts`.

**Editorial rules the UI depends on:** never enter a price, discount, credit amount or end date that the source doesn't state. Leave the field empty and the UI omits it.

## Monetisation, kept honest

| Revenue stream | How it's supported |
|---|---|
| Affiliate commissions | Set `links.affiliateUrl` only when an agreement exists. `/go/[slug]` uses it automatically, the link gets `rel="sponsored nofollow"`, and the detail page shows an affiliate disclosure. |
| Sponsored listings | `placement.sponsored`: a dashed-outline card labelled "Sponsored · Paid placement by X". At most one per listing page, leading the grid and only when it matches the current filters. Never in Editor's picks. |
| Featured placements | `placement.featured` / `featuredRank` drive "Editor's picks". These are unpaid by policy (see `/disclosure`). |
| Exclusive deals | `placement.exclusive` + `source: "partner"` → "Exclusive" badge and a disclosure note. |
| Newsletter sponsorships | Newsletter adapter in `lib/newsletter.ts`. The policy is stated on `/disclosure`. |

**Popular deals** only render when `lib/engagement.ts` returns real click data for at least 3 offers. Until then the section is hidden. `recordOutboundClick` in `/go/[slug]` is the hook for collecting that data.

## Search

`/deals` is a plain GET form, so it works without JavaScript. With JS, filters apply instantly. You can search by keyword (weighted, prefix-matched, all terms required), filter by category, type and free/paid, and sort by relevance, newest or ending soon. Facet counts reflect the other active filters. Results paginate at 24 per page. Filtered and paginated URLs are `noindex`. The in-memory search handles a few thousand offers. Beyond that, reimplement `queryOffers` with Postgres full-text search or a hosted index; pages won't need to change.

## Newsletter

The form posts to `/api/newsletter`. With no provider configured, development logs the email and returns success, while production returns a clear "not open yet" message. Set `NEWSLETTER_PROVIDER=buttondown` and `BUTTONDOWN_API_KEY` to connect Buttondown, or add another case in `lib/newsletter.ts`. Check the provider's current API docs when you connect it.

## Going live checklist

1. Replace `src/content/offers.ts` and `products.ts` with real, verified offers. Set `verification.status: "verified"` and `checkedAt` only after checking each one.
2. Set `demoMode: false` in `site.ts`. This removes the banner and enables indexing, `robots.txt` rules and the sitemap reference.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain, and set the final brand name, logo, accent and contact email.
4. Connect a newsletter provider.
5. Connect click storage in `lib/engagement.ts` to enable "Popular".

## Next step: admin and persistent storage (proposed, not built)

The admin interface needs a database and authentication, so it was left out of this iteration on purpose. Recommended lightweight path:

- **Postgres** (managed, e.g. Neon or Supabase) with **Drizzle ORM**. Tables mirror `src/lib/types.ts` one-to-one. Add an `outbound_clicks` table for engagement.
- Reimplement **`src/lib/catalog.ts`** against the database. Its async function signatures already match, so pages don't change.
- A protected **`/admin`** area, built with Server Actions and a single-admin or small-team auth (e.g. Auth.js with email magic links), to add and edit products and offers, assign categories, update pricing, mark offers verified (stamping `checkedAt`), set expiry dates, manage featured and sponsored placement windows and affiliate URLs, and archive offers.
- Use on-demand revalidation (`revalidatePath`) after edits instead of hourly ISR.

If non-technical editors will manage content, a headless CMS (e.g. Payload or Sanity) is a reasonable alternative. The same `catalog.ts` boundary applies either way.
