# Source-blocked Catalog Publication — Issue #125

Reviewed and implemented on 2026-09-09 from the issue #122 merge base.

## Publication decision

The normalized catalog remains the complete 23-record audit set. Public runtime surfaces contain 21 published courses. Publication is controlled by optional provider-neutral metadata in `data/normalized/course-source-metadata.json`:

- absent or `published`: eligible for runtime publication;
- `source_blocked`: retained for audit and full-data validation, excluded at the catalog-adapter boundary.

Publication status is separate from source verification. It is never inferred from a `pending` status, provider identity, or notes.

## Current official-source recheck

- `introduction-cyber-security-nyux-edx`: the recorded official edX destination does not expose an available exact course, and current official edX discovery does not establish an active NYUx replacement. The raw pending record remains intact; no substitute is inferred.
- `data-analytics-essentials-cisco`: the recorded Coursera destination returns 404. Cisco currently exposes a separate first-party Networking Academy course with the same title, but that does not establish identity continuity with the historical Coursera record. The raw pending record remains intact; no migration or substitute is inferred.

Both records are therefore explicitly `source_blocked`.

## Public boundary

Filtering occurs once, before normalized data enters public runtime consumers. As a result, both records are absent from skill discovery, search, selection persistence, Compare, readiness inputs, course lists, sitemap generation, and generated SEO inputs. Their direct course routes follow the existing Next.js 404 path, so no active provider CTA is rendered.

The derived public boundaries are:

- 23 normalized audit records;
- 21 published runtime courses;
- 2 source-blocked records;
- 30 sitemap URLs: one homepage, eight canonical skill pages, and 21 published course-detail pages;
- 20 generated SEO templates, still `noindex, follow`, with no source-blocked course IDs.

The 15 approved decision-grade courses and ten readiness pairs are unchanged.

## Validation contract

Normal schema/data validation and the data-quality report continue reading the complete normalized files. Reporting counts both publication states and identifies the blocked IDs. The focused `check:publication-boundary` regression verifies audit retention, exact blocker identity, runtime exclusion, deliberate 404 behavior, sitemap exclusion, readiness-pair integrity, provider-neutral filtering, and generated SEO boundaries.

Pricing-contract and selective-SEO regressions remain unchanged and mandatory. No replacement course, provider migration, ranking, affiliate behavior, dependency, route type, or broader ingestion work is part of this issue.
