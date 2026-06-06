# MVP Readiness

## Current State

- Skills Compare is an English UI for finding skills, reviewing relevant online courses, comparing two options, and opening the original provider page.
- The normalized catalog currently contains 19 curated courses.
- Generated SEO pages, sitemap support, and internal SEO links are present.
- Provider CTA copy and external-link disclosure copy are centralized.
- Provider URLs are direct official provider URLs only.
- Outbound tracking is local-only and does not send data to an external analytics vendor.
- Source metadata exists for normalized courses in `data/normalized/course-source-metadata.json`, with seven priority courses now marked `partially_verified`.
- A data quality report is available with `corepack pnpm report:data-quality` and includes verification-status counts, verified-field coverage, fully pending courses, partially verified courses, and unknown field counts.

## Trust and Data Quality Reality

- Most source metadata is still marked `pending` until manual verification is completed.
- Priority verification has started using official Coursera provider pages only.
- Source verification remains a separate, conservative data-quality task.
- The partially verified priority courses are Google Data Analytics, Google Cybersecurity, Google Project Management, AI For Everyone, AWS Cloud Technical Essentials, Google Cloud Fundamentals: Core Infrastructure, and IBM Data Analyst.
- Verified fields include stable catalog facts such as title, platform/source URL, level, language, certificate visibility, workload/duration signals, learning topics, and prerequisites where clearly shown.
- Prices, ratings, review counts, and some durations are mostly unverified or unknown.
- Monthly workload estimates are not converted into exact `durationHours`; those values remain null where an exact total is not clearly shown.
- Unknown data must remain null, unknown, pending, or explicitly unverified.
- Certificate information is present where the catalog currently has it, but provider terms may change.
- Users should verify pricing, duration, certificate terms, enrollment details, and availability on the provider page before deciding.

## What Works

- Users can search for a skill and land on skill-specific course pages.
- Skill pages show available courses from the normalized catalog.
- Course cards expose core decision facts: platform, level, duration, price, certificate, and rating when available.
- Course detail pages are decision-support pages with fit framing, pending-data impact, verify-before-enrolling checks, provider CTA, compare action, learning content, and key facts.
- Compare supports two-course comparison with deterministic decision summary, fit cards, row-level interpretation, missing-data risks, compact course details, checklist, and outbound provider CTAs.
- The compare page uses stacked criterion cards on mobile instead of relying on a cramped side-by-side table.
- Canonical and Open Graph metadata foundations are present for core pages.
- Data validation runs with `corepack pnpm validate:data`.
- Production build runs with `corepack pnpm build`.

## What Is Not Implemented

- No affiliate program is implemented.
- No affiliate links or fake affiliate links are present.
- No ads are implemented beyond existing placeholder behavior.
- No verified rankings or recommendation algorithm exists.
- No "best course" recommendation engine exists; comparison copy must stay tied to explicit, factual criteria.
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

1. Continue manually verifying source metadata fields against provider pages.
2. Expand catalog coverage with a small, reviewable set per skill.
3. Continue replacing generic course descriptions and bullets only when official provider pages clearly support the replacement.
4. Add freshness display only after there is enough `lastVerifiedAt` coverage to avoid implying full-catalog verification.
5. Define explicit ranking criteria before making any ranking-style claims.
6. Add monetized links only when a real and auditable affiliate or referral program exists.
