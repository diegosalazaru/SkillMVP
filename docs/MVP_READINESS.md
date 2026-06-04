# MVP Readiness

## Current State

- Skills Compare is an English UI for finding skills, reviewing relevant online courses, comparing two options, and opening the original provider page.
- The normalized catalog currently contains 19 curated courses.
- Generated SEO pages, sitemap support, and internal SEO links are present.
- Provider CTA copy and external-link disclosure copy are centralized.
- Provider URLs are direct official provider URLs only.
- Outbound tracking is local-only and does not send data to an external analytics vendor.
- Source metadata exists for normalized courses in `data/normalized/course-source-metadata.json`.
- A data quality report is available with `corepack pnpm report:data-quality`.

## Trust and Data Quality Reality

- Source metadata is currently marked `pending` until manual verification is completed.
- Prices, ratings, review counts, and some durations are mostly unverified or unknown.
- Unknown data must remain null, unknown, pending, or explicitly unverified.
- Certificate information is present where the catalog currently has it, but provider terms may change.
- Users should verify pricing, duration, certificate terms, enrollment details, and availability on the provider page before deciding.

## What Works

- Users can search for a skill and land on skill-specific course pages.
- Skill pages show available courses from the normalized catalog.
- Course cards expose core decision facts: platform, level, duration, price, certificate, and rating when available.
- Course detail pages expose summary, provider CTA, compare action, learning content, and key facts.
- Compare supports two-course comparison with outbound provider CTAs.
- The compare page is readable on mobile and desktop.
- Canonical and Open Graph metadata foundations are present for core pages.
- Data validation runs with `corepack pnpm validate:data`.
- Production build runs with `corepack pnpm build`.

## What Is Not Implemented

- No affiliate program is implemented.
- No affiliate links or fake affiliate links are present.
- No ads are implemented beyond existing placeholder behavior.
- No verified rankings or recommendation algorithm exists.
- No outcome, employment, partnership, or provider endorsement claims should be made.
- No user accounts, cookies, database, scraping, external APIs, or new analytics vendors are implemented.

## Validation Workflow

Run these before opening or updating a PR:

- `corepack pnpm validate:data`
- `corepack pnpm report:data-quality`
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm build`

Do not run `corepack pnpm generate:seo` unless catalog or SEO generation inputs change. Do not run `corepack pnpm lint` until ESLint is configured, because `next lint` currently prompts for setup.

## Near-Term Priorities

1. Manually verify source metadata fields against provider pages.
2. Expand catalog coverage with a small, reviewable set per skill.
3. Replace unverified course bullets with source-backed content where available.
4. Add freshness display only after `lastVerifiedAt` is populated.
5. Define ranking criteria before making any ranking-style claims.
6. Add monetized links only when a real and auditable affiliate or referral program exists.
