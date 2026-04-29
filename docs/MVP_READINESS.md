# MVP Readiness

## What Works

- Users can search for a skill and land on skill-specific course pages.
- Skill pages show available courses from the normalized catalog.
- Course cards expose core decision facts: platform, level, duration, price, certificate, and rating when available.
- Course detail pages expose summary, CTA, compare action, known learning content, and key facts.
- Compare supports two-course comparison with outbound CTAs.
- Normalized course data is validated with `corepack pnpm validate:data`.
- Production build is validated with `corepack pnpm build`.
- Outbound click tracking is local-only and does not send data externally.

## What Is Missing

- Catalog coverage is very small.
- Prices, ratings, and review counts are mostly unverified.
- No verified ranking or recommendation logic exists.
- No affiliate program is implemented.
- No external analytics provider is connected.
- No sitemap or Open Graph layer exists yet.
- Course freshness and source verification are limited.

## Phase 1 Progress

- ✅ Added a per-course source metadata file scaffold at `data/normalized/course-source-metadata.json`.
- Current entries are intentionally marked `pending` until manual verification is completed.

## Current Limitations

- Skills Compare should not claim a course is best without real ranking criteria.
- Unknown data must remain pending, unknown, null, or empty.
- The app is useful for early comparison, not exhaustive discovery.
- Content bullets are conservative and should be replaced with verified source-backed content over time.

## Next 10 PRs

1. Add verified source metadata for each normalized course.
2. Expand catalog with a small manually reviewed set per skill.
3. Add sitemap and canonical metadata.
4. Add Open Graph metadata for home, skill, and course pages.
5. Add a lightweight data quality report script.
6. Add compare persistence that does not require cookies.
7. Improve mobile compare layout.
8. Add course freshness display when `lastUpdatedAt` is verified.
9. Add provider/platform explanation pages.
10. Replace local outbound tracking with an approved analytics destination when ready.
