# Current State

Last updated after Phase 1 Source Verification — Coverage Batch A merged on 2026-08-17.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

The core journey has a deliberate visual hierarchy across mobile and desktop, with stronger spacing, typography, component rhythm, and emphasis on decision actions.

## Latest Completed Initiative

**Phase 1 Source Verification — Coverage Batch A** — merged in PR #82.

Key outcomes:

- Five previously pending catalog records were manually checked against their existing official Coursera provider pages.
- All five are now `partially_verified` with source-backed field coverage and 2026-08-17 verification dates.
- `machine-learning-stanford-university` was corrected to the current course title **Supervised Machine Learning: Regression and Classification**, with current provider attribution and unsupported exact duration removed.
- `ibm-data-science-ibm` and `meta-front-end-developer-meta` received current Professional Certificate titles, source-backed prerequisites, and removal of derived exact-hour duration values.
- `ibm-cybersecurity-analyst-ibm` gained verified title, level, certificate, English language, workload signal, and learning-topic coverage while unsupported prerequisites remain unverified.
- `project-management-principles-practices-umci` gained verified English primary taught language, source-backed prerequisites, workload, certificate, level, and learning-topic coverage.
- Price, rating, and review count remain unknown and unverified for the batch.
- No source URL mismatches were introduced.

The small **Course Card Metadata Deduplication** follow-up was also completed in PR #81, removing the repeated platform label while preserving the platform eyebrow and course-level signal.

The earlier **Decision-focused Visual Polish** and **Mobile Selection and Discovery UX** initiatives remain in place.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 12 courses are currently `partially_verified`.
- 7 courses remain `pending`.
- Source URL mismatches: 0 after Batch A.
- Most pricing, ratings, review counts, and some duration values remain unknown or unverified.
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

The approved Course Card Metadata Deduplication and Phase 1 Source Verification — Coverage Batch A sequence is complete. Coding agents must not automatically begin another verification batch, SEO expansion, monetization, recommendation, infrastructure, catalog expansion, or visual initiative.

The next initiative must be chosen through product review and recorded here before implementation begins.

## Parallel Ongoing Work

Phase 1 data verification remains the active roadmap area, but additional batches must be small, explicitly approved, and auditable. SEO expansion follows only after the core experience remains stable. Monetization remains gated behind a real program and disclosure design.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
