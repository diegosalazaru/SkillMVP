# Catalog Phase 1: Curated course foundation

## Purpose
Phase 1 defines a practical, traceable catalog foundation so Skills Compare can help users make real decisions before scaling SEO, affiliate links, or ads.

## Why curated and normalized data comes first
- Users need reliable comparisons (price model, level, duration, certificate), not volume.
- SEO pages should only be generated from real catalog coverage.
- Affiliate monetization requires trustworthy data and disclosure discipline.
- Unknown or volatile provider data must stay unknown until verified.

## Required course fields
Each normalized course record must include:
- `id` (stable unique identifier)
- `title`
- `platform`
- `provider`
- `url` (canonical destination)
- `skillTags` (at least one)
- `level`
- `priceModel` (`free`, `paid_once`, `subscription`, or `unknown`)
- `language`
- `certificate` (boolean when known, otherwise null/unknown pattern supported by schema)
- provenance fields from current schema (for example `source`, `sourceUrl`, or mapped equivalents)

## Optional course fields
Optional data can be present when verified:
- `durationText`
- `priceAmount` and `currency`
- `ratingValue`
- `reviewCount`
- `shortDescription`
- `whatYouLearnBullets`
- `prerequisitesBullets`
- freshness metadata (last verified timestamps)

## Source fields and provenance
- Every externally sourced record must be traceable to a provider/source URL.
- Provenance should identify the ingestion or curation source.
- If provenance cannot be confirmed, the record should not be published as verified catalog data.
- Per-course source metadata lives in `data/normalized/course-source-metadata.json`.
- Source metadata should stay separate from the runtime course schema until there is a product need to display it.
- Verification can be partial. Stable fields such as title, platform, source URL, level, language, duration signals, certificate visibility, syllabus topics, and prerequisites can be marked verified while volatile fields such as price, rating, and review count remain unknown/null.
- Seven priority courses currently have partial verification from official Coursera provider pages: Google Data Analytics, Google Cybersecurity, Google Project Management, AI For Everyone, AWS Cloud Technical Essentials, Google Cloud Fundamentals: Core Infrastructure, and IBM Data Analyst.
- Workload statements such as months at a weekly pace can be verified in source metadata without converting them into an exact `durationHours` value.

## Data quality rules
- Do not invent course data.
- Missing price/rating/reviews must remain null/unknown (never fabricated placeholders).
- Keep skill tags and level consistent with observable provider content.
- Treat pricing, certificate terms, and availability as volatile.
- Use explicit unverified wording where needed.
- Unknown price, rating, review count, duration, and certificate terms are expected during phase 1 and should be surfaced as decision risk, not hidden.

## Allowed source types
- Official provider course pages
- Provider APIs or exports already approved in repository workflows
- Manually curated entries with verifiable external links

## Prohibited practices
- No fake prices
- No fake ratings or review counts
- No fake affiliate URLs
- No scraping introduced in this phase
- No unverifiable claims of "best" ranking
- No ranking or recommendation claims unless explicit criteria are defined and displayed

## Update workflow
1. Add or update source data in repository-managed source files.
2. Normalize via existing scripts.
3. Regenerate derived artifacts (catalog/SEO pages) from real catalog data.
4. Run validation and build checks.
5. Submit small, reviewable PR with provenance notes.

## Validation workflow
Run:
- `pnpm validate:data`
- `pnpm report:data-quality`
- `pnpm generate:seo` (when SEO templates/catalog changes)
- `pnpm build`

Validation failures should be fixed at data/source level; do not bypass checks to make CI pass.
The data quality report is allowed to show unknown prices, ratings, review counts, durations, and certificate values. Unknown data is expected until manual verification is complete.
The data quality report should fail only for structural mismatches such as missing source metadata, orphaned metadata, source URL mismatches, or duplicate metadata records.

## Future affiliate fields (out of scope for Phase 1)
These are planned but not implemented in this phase:
- `affiliateUrl`
- `affiliateNetwork`
- `affiliateDisclosureRequired`
- `commissionType`

When affiliate fields are introduced later:
- They must be real and auditable.
- Disclosure must be explicit in UX and content.
- Non-affiliate fallback destination URLs must remain available.
