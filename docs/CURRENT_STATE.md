# Current State

Last updated after product review closed Phase 1 for the current MVP catalog and activated Phase 3 Discovery/SEO.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

The core journey has a deliberate visual hierarchy across mobile and desktop, with stronger spacing, typography, component rhythm, and emphasis on decision actions.

## Latest Completed Initiative

**Phase 1 Source Verification — Coverage Batch B** — merged in PR #85.

Key outcomes:

- All seven records that were pending after Batch A were manually reviewed against current official provider pages.
- Five records moved to `partially_verified`; two remain `pending` because the exact recorded offering could not be confirmed from a current official source.
- `deep-learning-specialization-deeplearningai` had the inferred 120-hour total removed, source-backed prerequisites aligned, and English verified as the primary taught language. The provider separately lists additional language availability, which is not represented by the current single `language` field.
- `introduction-to-cloud-computing-ibm` gained verified stable-field coverage for title/provider, level, English, certificate, workload, and learning topics; its specific prerequisites remain unverified.
- `introduction-project-management-edx-adelaidex` was updated to the current canonical edX URL, current title/description, certificate availability, and source-backed prerequisites.
- `google-advanced-data-analytics-google` was corrected from intermediate to advanced and its prerequisites were aligned to the current official page.
- `ibm-ai-engineering-ibm` gained verified stable-field coverage and source-backed Python, Jupyter Notebook, and mathematics prerequisites.
- `introduction-cyber-security-nyux-edx` remains pending because the recorded edX page is unavailable and no current official page clearly represents the exact same NYUx offering.
- `data-analytics-essentials-cisco` remains pending because the recorded Coursera listing is unavailable and Cisco's current instructor-led offering is insufficient to establish that it is the same listing.
- Price, rating, and review count remain unknown/null and unverified for the batch.
- Source URL mismatches remain at 0.

Earlier completed initiatives, including Batch A, Course Card Metadata Deduplication, Decision-focused Visual Polish, and Mobile Selection and Discovery UX, remain in place.

## Phase Status

- **Phase 0 — MVP:** complete for the current MVP scope. Future Phase 0 work is limited to concrete defects/regressions unless product review explicitly reopens scope.
- **Phase 1 — Real Data:** complete for the current 19-course curated MVP catalog. Data verification becomes ongoing maintenance rather than a blocking execution phase.
- **Phase 2 — Monetization:** gated / not started. It activates only when a real auditable affiliate/referral program exists and does not block Phase 3.
- **Phase 3 — Discovery and SEO:** active.
- **Phase 4 — Recommendation:** later, gated behind explicit criteria and trustworthy signals.
- **Phase 5 — Robust Product:** only if traction justifies the additional architecture.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 17 courses are currently `partially_verified`.
- 2 courses remain `pending` with explicit source blockers rather than unreviewed status.
- Source URL mismatches: 0 after Batch B.
- Most pricing, ratings, and review counts remain unknown or unverified by design; some duration values also remain unknown where providers expose only workload estimates.
- The current normalized `language` field represents the primary taught language when that is clearly supported by an official source. Additional dubbing/subtitle/language availability is provenance context rather than a second meaning for the same field.
- `report:data-quality` remains part of normal validation.
- Official provider pages remain the final source users should verify before enrollment.

See `docs/MVP_READINESS.md` and `docs/catalog-phase-1.md` for deeper data-quality details.

## Current Product Constraints

Not implemented:

- Affiliate/referral monetization.
- External advertising.
- Paid placement.
- Ranking or recommendation engine.
- User accounts.
- Database-backed catalog.
- Scraping or provider APIs.
- External analytics vendor for outbound tracking.

These are intentional roadmap constraints, not missing requirements to fill opportunistically.

## Next Approved Product Initiative

### Phase 3 Discovery/SEO — Indexable Surface Foundation (Batch A)

Purpose: make the site's search-facing surface reflect the most useful canonical decision pages before creating any new SEO content volume.

Current repository review found that the sitemap prioritizes the homepage, `/compare`, and the generated SEO route set, while canonical skill pages and course-detail decision pages are not represented there. The generated SEO system also creates multiple intent variants per skill from shared course lists and highly repetitive template copy. This first Phase 3 batch should correct that foundation before any keyword or page expansion.

Approved scope:

- Update sitemap generation so it includes the homepage plus canonical skill pages and canonical course-detail pages backed by the current normalized catalog.
- Remove `/compare` from the sitemap; it is a functional comparison surface rather than a durable organic discovery landing page.
- Remove the current generated template SEO routes from the sitemap for now.
- Keep those generated routes accessible, but mark them `noindex, follow` until a later explicitly approved initiative gives each indexable route sufficiently distinct user value and intent-specific content.
- Preserve clear self-referencing canonical metadata on indexable skill/course pages and avoid conflicting canonical/indexing signals.
- Where existing prominent internal SEO links point primarily to the generated template routes, prefer canonical skill pages instead; do not redesign navigation broadly.
- Do not add new SEO page types, new generated routes, keyword-scaled content, provider claims, catalog records, dependencies, analytics vendors, scraping, monetization, ranking, recommendation, or unrelated UI changes.
- Do not delete legacy generated routes or introduce redirect migrations in this batch unless required to prevent a broken route; route consolidation can be evaluated later with evidence.

Success means the sitemap and indexing directives point search engines toward useful canonical product decision surfaces, while generic generated variants stop being actively promoted for indexing. The goal is a safer, clearer discovery foundation, not more URLs.

Implementation must use one dedicated branch and PR, run the full required validation sequence, run `generate:seo` only if actual SEO generation inputs are changed, and must not be merged by the coding agent.

## After Phase 3 Batch A

Return to product review. Do not automatically create more SEO pages. Review the resulting indexable surface and then choose a small number of skill/intent pages to strengthen only where the catalog has enough depth to provide differentiated, people-first decision value.

## Parallel Ongoing Work

Phase 1 data quality remains an ongoing maintenance concern even though the planned verification phase is complete for the current MVP catalog. Future verification should remain small, explicit, source-backed, and auditable. Monetization remains gated behind a real program and disclosure design, and recommendation remains gated behind trustworthy signals and explicit criteria.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
