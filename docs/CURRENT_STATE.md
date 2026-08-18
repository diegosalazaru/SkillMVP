# Current State

Last updated after implementing the Phase 1B.4 comparison-hierarchy pilot for product review.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

Recent product review exposed an important distinction: source-trusted catalog data is not automatically decision-useful data. The product must not only avoid inventing facts; it must preserve enough structured provider-backed information to help a user actually choose between courses.

## Latest Completed Initiatives

### Phase 1B.4 — Compare Decision Hierarchy — Issue #99

Key outcomes:

- Compare now follows the intended decision flow: decision summary, at-a-glance course snapshot, detailed pricing evidence, criteria, curriculum detail, then final verification and provider actions.
- The snapshot consolidates verified offering, starting point, pricing, workload, credential, learning-focus, practical-work, prerequisite, and fit signals without adding catalog fields or recommendation claims.
- The standalone compare-page fit section was removed, while unknown or unverified values remain explicitly uncertain for mixed pilot/non-pilot comparisons.
- Desktop and mobile checks cover both approved pilot pairs and a mixed pilot/non-pilot regression comparison without horizontal overflow or browser errors.

### Phase 1B.3 — Pricing as Core Decision Data — Issue #97

Key outcomes:

- The normalized contract supports multiple structured pricing paths with USD display, payment model, cadence, scope, provenance, observation date, and regional/access context.
- Migration remains limited to the same four approved pilot courses; the remaining 15 catalog records are unchanged.
- Both required comparisons pass a new pricing hard gate while retaining the unchanged 5/7 Phase 1B.2 dimension gate.
- Compare surfaces current payable commitments before provider links and distinguishes course/program pricing from broader platform-subscription alternatives.
- Pricing evidence and intentional exclusions are recorded in `docs/pricing-phase-1b3-pilot.md`.

### Phase 1B.2 — Decision Data Contract v2 pilot — Issue #94

Key outcomes:

- The normalized contract now preserves offering type, provider-described workload, tools/technologies, practical work, credential context, and cost-model context without display-string parsing.
- Migration is limited to exactly four approved pilot courses; the remaining 15 catalog records are unchanged.
- Provenance metadata carries explicit per-field verification for every new dimension.
- Both required comparisons pass the internal 5/7 decision-readiness gate without inferred totals or unsupported facts.
- Desktop and mobile acceptance checks confirm that the seven dimensions, their differences, and their insufficiencies remain readable without horizontal overflow.
- Exact prices, volatile ratings/review counts, IBM prerequisite details, IBM cost context, and AI For Everyone tools/practical work remain unknown or unverified where the official source does not support them.

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
- **Phase 1B — Decision-Grade Data:** Phase 1B.1 through Phase 1B.4 are implemented for the four-course pilot; product review must decide whether and how to migrate later batches.
- **Phase 2 — Monetization:** gated / not started. It activates only when a real auditable affiliate/referral program exists and does not block Phase 3.
- **Phase 3 — Discovery and SEO:** active, with the indexable-surface foundation complete. Further content/traffic expansion is paused until product review of the Phase 1B.4 pilot confirms that core comparisons provide meaningful decision value.
- **Phase 4 — Recommendation:** later, gated behind explicit criteria and trustworthy signals.
- **Phase 5 — Robust Product:** only if traction justifies the additional architecture.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 17 courses are currently `partially_verified`.
- 2 courses remain `pending` with explicit source blockers rather than unreviewed status.
- Source URL mismatches: 0 after the completed verification batches.
- Pricing remains unknown or unverified for the 15 non-pilot courses; the four pilot records now have actionable source-backed USD pricing paths. Most ratings and review counts remain unknown by design.
- The four Phase 1B.2 pilot records preserve provider-described workload schedules such as months plus hours per week while exact `durationHours` remains null unless the source explicitly states a total.
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

## Phase 1B.3 Pilot Result

Pilot scope is exactly four courses and two comparisons:

1. AI For Everyone vs Deep Learning Specialization.
2. Google Cybersecurity Professional Certificate vs IBM Cybersecurity Analyst Professional Certificate.

- AI For Everyone vs Deep Learning Specialization: **5/7 pass**. Source-backed for both: offering/credential type, workload, starting point, learning topics, and cost-model context. Insufficient for both: tools/technologies and practical work.
- Google Cybersecurity vs IBM Cybersecurity Analyst: **5/7 pass**. Source-backed for both: offering/credential type, workload, learning topics, tools/technologies, and practical work. Insufficient for both: starting point and cost-model context.
- Pricing hard gate: **pass for both pairs**. Each pilot course has at least one actionable payable path displayed in USD; the 5/7 dimension gate was not weakened.

The gate is internal product-quality validation, not a visible ranking or course score.

## After Phase 1B.4

Return to product review. Do not automatically migrate all 19 courses and do not resume SEO content expansion automatically.

First judge whether the two pilot comparisons let a user understand both the learning tradeoffs and current economic commitments without opening both provider pages. If the pilot succeeds, decide the smallest auditable migration sequence for the remaining catalog. If it fails, revise the decision-data or pricing model before scaling it.

## Parallel Ongoing Work

Phase 1A source quality remains an ongoing maintenance concern, but verification should be driven by concrete decision-value needs rather than by a goal of maximizing verified-field counts. Phase 3 technical SEO foundation is in place, but additional indexable content waits for decision-quality review. Monetization remains gated behind a real program and disclosure design, and recommendation remains gated behind trustworthy signals and explicit criteria.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
