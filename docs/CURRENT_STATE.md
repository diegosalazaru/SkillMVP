# Current State

Last updated after merging the Phase 3 Indexable Surface Foundation and Phase 1B.1 Comparison Integrity Fix, and after approving the Phase 1B.2 Decision Data Contract v2 pilot.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

Recent product review exposed an important distinction: source-trusted catalog data is not automatically decision-useful data. The product must not only avoid inventing facts; it must preserve enough structured provider-backed information to help a user actually choose between courses.

## Latest Completed Initiatives

### Phase 1B.1 — Comparison Integrity Fix — PR #93

Key outcomes:

- Comparison statuses now use structured values plus per-field verification metadata rather than display-string inference.
- Unknown, unavailable, pending, or unverified criteria produce `Insufficient data` instead of confident `Same` or `Different` claims.
- Runtime mapping preserves nullable certificate state, mixed/unknown learner levels, exact duration values when they exist, normalized review counts, and verification metadata.
- Repetitive uncertainty warnings are grouped by criterion.
- Rating/review absence is de-emphasized when neither course has usable social-proof data.
- The two product-review comparisons were used as acceptance tests.

### Phase 3 Discovery/SEO — Indexable Surface Foundation — PR #92

Key outcomes:

- Sitemap now promotes the homepage, 8 canonical skill pages, and 19 canonical course-detail pages.
- `/compare` and the 20 generated template SEO routes are no longer promoted in the sitemap.
- Generated SEO routes remain accessible but emit `noindex, follow`.
- Prominent homepage SEO links now point to canonical skill pages.
- Synthetic sitemap `lastModified` values were removed rather than publishing misleading freshness signals.
- No new SEO routes or content volume were added.

Earlier completed initiatives, including Phase 1 Source Verification Batches A/B, Course Card Metadata Deduplication, Decision-focused Visual Polish, and Mobile Selection and Discovery UX, remain in place.

## Phase Status

- **Phase 0 — MVP:** complete for the current MVP scope.
- **Phase 1A — Source Trust:** complete for the current 19-course curated MVP catalog; ongoing maintenance only.
- **Phase 1B — Decision-Grade Data:** active corrective work. Phase 1B.1 is complete; Phase 1B.2 is the next approved initiative.
- **Phase 2 — Monetization:** gated / not started. It activates only when a real auditable affiliate/referral program exists and does not block Phase 3.
- **Phase 3 — Discovery and SEO:** active, with the indexable-surface foundation complete. Further content/traffic expansion is paused until the Phase 1B.2 pilot proves that core comparisons provide meaningful decision value.
- **Phase 4 — Recommendation:** later, gated behind explicit criteria and trustworthy signals.
- **Phase 5 — Robust Product:** only if traction justifies the additional architecture.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 17 courses are currently `partially_verified`.
- 2 courses remain `pending` with explicit source blockers rather than unreviewed status.
- Source URL mismatches: 0 after the completed verification batches.
- Most pricing, ratings, and review counts remain unknown or unverified by design.
- Some exact total duration values remain unknown even where the provider exposes useful workload schedules such as months/weeks plus hours per week. Phase 1B.2 exists specifically to preserve those useful signals without inventing exact totals.
- The current normalized `language` field represents the primary taught language when clearly supported by an official source. Additional dubbing/subtitle/language availability remains provenance context unless a later explicit schema initiative changes that model.
- `report:data-quality` remains part of normal validation.
- Official provider pages remain the final source for volatile enrollment terms, but Skills Compare should perform the basic comparison work rather than merely redirecting users to two provider pages.

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

### Phase 1B.2 — Decision Data Contract v2 + pilot — Issue #94

Purpose: evolve the smallest structured data contract needed to preserve provider-backed signals that materially help a user choose, then validate that contract before migrating the rest of the catalog.

Pilot scope is exactly four courses and two comparisons:

1. AI For Everyone vs Deep Learning Specialization.
2. Google Cybersecurity Professional Certificate vs IBM Cybersecurity Analyst Professional Certificate.

The approved contract should support, where official sources actually expose the information:

- offering/program type,
- workload/time commitment without invented exact totals,
- prerequisites/starting point,
- learning topics,
- tools/technologies,
- practical work/projects/labs,
- credential context,
- known cost-model context.

The internal decision-readiness gate is defined in issue #94. A pilot comparison should have source-backed useful information for both courses in at least 5 of 7 core decision dimensions. This is a product-quality gate, not a visible ranking or score.

If the official sources cannot support the gate without inference, the implementation must report the blocker rather than weakening the standard or inventing data.

Implementation must stay limited to the four pilot courses, use official provider pages for new facts, preserve provenance and verification semantics, use one dedicated branch and PR, run the full required validation sequence, and must not be merged by the coding agent.

## After Phase 1B.2

Return to product review. Do not automatically migrate all 19 courses and do not resume SEO content expansion automatically.

First judge whether the two pilot comparisons materially reduce the need for a user to open both provider pages merely to understand basic differences. If the pilot succeeds, decide the smallest auditable migration sequence for the remaining catalog. If it fails, revise the decision-data model before scaling it.

## Parallel Ongoing Work

Phase 1A source quality remains an ongoing maintenance concern, but verification should be driven by concrete decision-value needs rather than by a goal of maximizing verified-field counts. Phase 3 technical SEO foundation is in place, but additional indexable content waits for decision-quality review. Monetization remains gated behind a real program and disclosure design, and recommendation remains gated behind trustworthy signals and explicit criteria.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
