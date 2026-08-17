# Current State

Last updated after Phase 1 Source Verification — Coverage Batch B merged in PR #85.

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

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 17 courses are currently `partially_verified`.
- 2 courses remain `pending`.
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

No new product implementation initiative is currently approved.

The approved Phase 1 Source Verification — Coverage Batch B initiative is complete. Coding agents must not automatically begin another verification batch, SEO expansion, monetization, recommendation, infrastructure, catalog expansion, language-schema expansion, or visual initiative.

The next initiative must be chosen through product review and recorded here before implementation begins.

## Product Review Focus

Phase 1 now has high verification coverage across the curated catalog: 17 of 19 records are partially verified and the remaining two have explicit source blockers rather than unreviewed status.

Before approving more implementation work, product review should decide whether the highest-value next move is:

- resolving or replacing the two blocked pending records,
- moving to Phase 3 discovery/SEO work on the now-better-trusted catalog,
- preparing a real Phase 2 monetization path only if an actual affiliate/referral program is available,
- or another narrowly defined user-decision improvement supported by observed product needs.

Do not treat zero pending records as a goal by itself.

## Parallel Ongoing Work

Phase 1 data quality remains an active product concern even though the planned Batch A and Batch B verification passes are complete. Future verification should remain small, explicit, source-backed, and auditable. Monetization remains gated behind a real program and disclosure design, and recommendation remains gated behind trustworthy signals and explicit criteria.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
