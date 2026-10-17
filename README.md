# Saver Option: software deals & savings discovery

A discovery site for software deals, free credits, startup perks, student discounts, lifetime deals and open-source alternatives. Users find offers here and redeem them on the provider's site. It is not a marketplace.

> **Real offers, pre-launch.** `src/content/` holds real offers researched from the providers' own sites. Offers whose live page was checked are `verified` with a `checkedAt` date; offers known only from search extracts of the provider's site are published as `unverified` and labelled "Not yet verified". Supporting quotes are kept in `verification.evidence`. While `siteConfig.prelaunch` is `true`, a banner shows the check date and the site is `noindex`.

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
| `prelaunch` | Pre-launch banner (with the latest check date) and `noindex` |

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
  content/                 catalog data (categories, providers, products, offers)
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
- `pricing`: every field is optional. `savingsLabel` should repeat the provider's own wording. `regularPeriod` handles comparisons like "$69 once vs. $19/month", which never get a strikethrough. `durationMonths` plus `renewalPrice` produce "Then $X/yr after N months", and with comparable regular and offer prices the page computes "Save $X over N months".
- `claim`: how the offer is claimed (`automatic`, `code` with an optional public `code` shown with a copy button, `link`, `application`, `verification`).
- `requirements`: `cardRequired`, `newCustomersOnly`, `approvalRequired`, `studentVerification`. Leave a key out when the source doesn't say; known keys become condition chips and the "No credit card" filter.
- `regions`: `{ scope: "global" | "limited", note }`. Drives "Available worldwide" and its filter.
- `lifetime`: for one-time licences, `licenceCovers` and `refundPolicy`.
- `expiresAt`: only set when the provider states an end date. Expired offers drop out of listings automatically, keep their detail page with an "ended" notice, and redirect `/go/` to that page. Pages revalidate hourly.
- `verification`: `verified` (checked against the live source on `checkedAt`), `unverified` or `demo`, plus a reader-facing `method` and editor-only `evidence` quotes. Only `verified` offers get Product/Offer JSON-LD.
- `links`: `officialUrl` (always shown as the source), plus optional `redeemUrl` and `affiliateUrl`.
- `placement`: `featured` and `featuredRank` (editorial, unpaid), `sponsored` (paid, with optional date window) and `exclusive`.
- `status`: `draft`, `published` or `archived`. Only `published` offers ever leave `catalog.ts`.

**Editorial rules the UI depends on:** never enter a price, discount, credit amount or end date that the source doesn't state. Leave the field empty and the UI omits it.

## Product logos

Logos live in `public/logos/<product-slug>.svg`. A product gets its logo automatically when that file exists; otherwise it shows a coloured initials tile. Current files come from two open-source collections of official brand marks: [SVG Logos](https://github.com/gilbarbara/logos) (CC0, full colour) and [Simple Icons](https://simpleicons.org) (CC0, single colour in the brand's own hex). The licences cover the SVG files only. The logos themselves remain trademarks of their owners and are used only to identify the products, as `/terms` states. Before launch, check each brand's usage guidelines, and swap in the official press-kit files where they exist.

## Monetisation, kept honest

| Revenue stream | How it's supported |
|---|---|
| Affiliate commissions | Set `links.affiliateUrl` only when an agreement exists. `/go/[slug]` uses it automatically, the link gets `rel="sponsored nofollow"`, and the detail page shows an affiliate disclosure. |
| Sponsored listings | `placement.sponsored`: a dashed-outline card labelled "Sponsored · Paid placement by X". At most one per listing page, leading the grid and only when it matches the current filters. Never in Editor's picks. |
| Featured placements | `placement.featured` / `featuredRank` drive "Editor's picks". These are unpaid by policy (see `/disclosure`). |
| Exclusive deals | `placement.exclusive` + `source: "partner"` → "Exclusive" badge and a disclosure note. |
| Newsletter sponsorships | Newsletter adapter in `lib/newsletter.ts`. The policy is stated on `/disclosure`. |

## Visitor and click counts (real data only)

With Upstash Redis configured (`UPSTASH_REDIS_REST_URL`/`_TOKEN`, or the `KV_REST_API_*` variables set by Vercel's Upstash integration):

- **Visitors today.** `VisitBeacon` posts one beacon per page view to `/api/visit`. The server hashes (daily salt + IP + user agent), adds the hash to a per-day HyperLogLog, and skips obvious bots. No cookies are set and raw IPs are never stored. Set `VISITOR_SALT` to a long random string.
- **Deals opened today / Popular.** `/go/[slug]` counts clicks per offer and day with `after()`, so the redirect is never slowed. "Popular this month" appears once at least 3 offers have clicks in the last 30 days.
- **Display.** `/api/stats` returns figures only when they're measured and today's visitors reach `VISITORS_MIN_TO_SHOW` (default 50). Below that, the hero shows nothing rather than a tiny or invented number. Keys expire after 40 days.

Without Redis, every counter is hidden and nothing is recorded.

## Search

`/deals` is a plain GET form, so it works without JavaScript. With JS, filters apply instantly. You can search by keyword (weighted, prefix-matched, all terms required), filter by category, type, free/paid, "No credit card needed" and "Available worldwide", and sort by relevance, newest or ending soon. Facet counts reflect the other active filters. Results paginate at 24 per page. Filtered and paginated URLs are `noindex`. The in-memory search handles a few thousand offers. Beyond that, reimplement `queryOffers` with Postgres full-text search or a hosted index; pages won't need to change.

## Newsletter

The form posts to `/api/newsletter`. With no provider configured, development logs the email and returns success, while production returns a clear "not open yet" message. Set `NEWSLETTER_PROVIDER=buttondown` and `BUTTONDOWN_API_KEY` to connect Buttondown, or add another case in `lib/newsletter.ts`. Check the provider's current API docs when you connect it.

## Going live checklist

1. Re-check every offer on its live page (especially the ones marked "Not yet verified"), then update `checkedAt`. Offers change often.
2. Fill in the legal details on `/privacy` and `/terms` (operating entity, address) and have them reviewed.
3. Set `prelaunch: false` in `site.ts`. This removes the banner and enables indexing, `robots.txt` rules and the sitemap reference.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain, and set the final logo and contact email.
5. Connect a newsletter provider.
6. Add Upstash Redis (Vercel → Storage/Marketplace → Upstash) and set `VISITOR_SALT` to turn on real visitor counts and "Popular".

## Next step: admin and persistent storage (proposed, not built)

The admin interface needs a database and authentication, so it was left out of this iteration on purpose. Recommended lightweight path:

- **Postgres** (managed, e.g. Neon or Supabase) with **Drizzle ORM**. Tables mirror `src/lib/types.ts` one-to-one. Add an `outbound_clicks` table for engagement.
- Reimplement **`src/lib/catalog.ts`** against the database. Its async function signatures already match, so pages don't change.
- A protected **`/admin`** area, built with Server Actions and a single-admin or small-team auth (e.g. Auth.js with email magic links), to add and edit products and offers, assign categories, update pricing, mark offers verified (stamping `checkedAt`), set expiry dates, manage featured and sponsored placement windows and affiliate URLs, and archive offers.
- Use on-demand revalidation (`revalidatePath`) after edits instead of hourly ISR.

If non-technical editors will manage content, a headless CMS (e.g. Payload or Sanity) is a reasonable alternative. The same `catalog.ts` boundary applies either way.
