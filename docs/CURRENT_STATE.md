# Current State

Last updated after implementing the bounded Phase 1B.8 Pluralsight provider batch for independent product review.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

Recent product review exposed an important distinction: source-trusted catalog data is not automatically decision-useful data. The product must not only avoid inventing facts; it must preserve enough structured provider-backed information to help a user actually choose between courses.

## Latest Completed Initiatives

### Phase 1B.8 — Pluralsight Provider Batch — Issue #116

Key outcomes:

- Exactly one current Pluralsight course is added: AWS Foundations: Getting Started with the AWS Cloud Essentials. It passes the actionable-pricing hard gate and 5/7 decision dimensions; primary taught language, prerequisites, and course-specific practical work remain unverified.
- Introduction to Information Security is blocked and intentionally omitted because its official course page appears active while the current official author page labels it `RETIRED`; no substitute Cybersecurity course was added.
- Current USD checkout commitments are modeled as platform subscriptions: Cloud+ at `$35/month` or `$294/year`, and Complete at `$55/month` or `$468/year`. The conflicting individual-pricing surface and market localization remain explicit provenance conditions.
- The normalized catalog now contains 20 courses; 12 are decision-grade across seven approved pairs with exact manifest/migration alignment.
- Pluralsight required only one shared platform mapping. Course cards, details, Compare, centralized outbound behavior, and canonical skill guides remain provider-neutral; Cloud Computing automatically surfaces two pairs while Cybersecurity retains its incumbent pair.
- Official-source, gate, provider-neutrality, SEO/indexing, and desktop/mobile acceptance evidence is recorded in `docs/decision-grade-phase-1b8-pluralsight-provider.md`.

### Phase 3B — Selective Decision-led SEO Reactivation — Issue #111

Key outcomes:

- The five canonical skills with accepted decision-grade pairs (`ai`, `cybersecurity`, `data-analysis`, `cloud-computing`, and `project-management`) now expose crawlable, people-first decision guides without creating new routes or scaled SEO volume.
- One deterministic manifest-driven model preserves readiness-pair order, maps verified catalog facts through the existing decision-support layer, and supplies reusable pair cards. Project Management and Cloud Computing therefore surface their additional approved pairs automatically.
- Each pair links to the exact stable Compare URL and both canonical course-detail pages. The skill acquisition surface does not add outbound provider behavior, affiliate links, rankings, or provider-specific branches.
- Target metadata reflects stable course-comparison intent without volatile prices. The sitemap remains limited to the homepage, eight canonical skills, and the current 20 course-detail pages; all 20 generated SEO templates remain `noindex, follow` and outside the sitemap.
- A focused regression check covers target-skill/pair mapping, canonical metadata, generated-route robots directives, sitemap boundaries, and non-target exclusion.
- Issue #116 completed issue #112's bounded Pluralsight Cloud/Cybersecurity evaluation: Cloud cleared the existing hard gate and Cybersecurity was blocked by conflicting official availability evidence. No further provider batch is authorized, and commission does not influence visible presentation.

### Phase 1B.7 — Multi-provider Acceptance + Cross-platform Project Management — Issue #108

Key outcomes:

- All five incumbent readiness pairs pass cumulative desktop/mobile product acceptance in the actual comparison UI; the durable review explicitly distinguishes data-gate success from decision usefulness.
- The current public edX page establishes a `$149 USD` one-time Premium certificate path for AdelaideX: Introduction to Project Management; the temporary promotion is excluded.
- Google Project Management vs AdelaideX passes pricing plus 6/7 source-backed dimensions. Tools/technologies remains explicitly insufficient because edX names no software or technology.
- The decision-grade manifest now contains exactly 11 courses and six approved pairs with exact migration alignment and clean regression across every prior pair.
- Provider-neutral pricing, credential, CTA, workload, provenance, summary, card, and detail presentation work across Coursera and edX. The final checklist now makes subscription/renewal verification conditional when applicable.
- The product appears ready for independent review to consider resuming selective Phase 3 SEO work; SEO remains paused and no new SEO surface was added.

### Phase 1B.6 — Decision-Grade Rollout Batch 2 — Issue #106

Key outcomes:

- Exactly two additional courses are migrated: Google Project Management Professional Certificate and Project Management Principles and Practices Specialization.
- The Project Management pair passes the actionable-pricing hard gate and 6/7 source-backed decision dimensions; tools/technologies remains explicitly insufficient because the UCI listing names no software or technology.
- Google has a direct `$49 USD/month` U.S./Canada certificate path plus a verified Coursera Plus alternative; UCI has a verified `$59 USD/month` Coursera Plus path.
- The manifest now limits the approved decision-grade set to ten courses and five approved pairs while preserving exact manifest/migration alignment.
- Provider workload conflicts, pricing exclusions, and the pair result are recorded in `docs/decision-grade-phase-1b6-batch-2.md`.

### Phase 1B.5 — Decision-Grade Rollout Batch 1 — Issue #101

Key outcomes:

- Exactly four additional courses are migrated: Google Data Analytics, Google Advanced Data Analytics, AWS Cloud Technical Essentials, and IBM Introduction to Cloud Computing.
- Both new same-skill pairs pass the actionable-pricing hard gate and all 7/7 source-backed decision dimensions.
- Provider-native cadence replaces synthetic exact totals for Google Data Analytics and AWS Cloud Technical Essentials.
- An explicit manifest now limits the approved decision-grade set to eight courses and the readiness gates to four approved pairs; unrelated catalog records still fail validation if migrated accidentally.
- Official-source evidence, conflicts, pricing exclusions, and pair results are recorded in `docs/decision-grade-phase-1b5-batch-1.md`.

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
- **Phase 1A — Source Trust:** complete for the original 19-course curated MVP catalog; the one Phase 1B.8 addition has a current official-source record.
- **Phase 1B — Decision-Grade Data:** Phase 1B.1 through Phase 1B.8 are implemented; 12 courses across seven approved pairs are decision-grade, and independent product review must approve any later batch.
- **Phase 2 — Monetization:** gated / not started. It activates only when a real auditable affiliate/referral program exists and does not block Phase 3.
- **Phase 3 — Discovery and SEO:** active. The indexable-surface foundation and selective Phase 3B decision guides on five canonical skills are implemented; generated SEO templates remain gated pending stronger product/search evidence.
- **Phase 4 — Recommendation:** later, gated behind explicit criteria and trustworthy signals.
- **Phase 5 — Robust Product:** only if traction justifies the additional architecture.

## Catalog and Trust State

- The normalized catalog contains 20 curated courses.
- 18 courses are currently `partially_verified`.
- 2 courses remain `pending` with explicit source blockers rather than unreviewed status.
- Source URL mismatches: 0 after the completed verification batches.
- Pricing remains unknown or unverified for the 8 non-migrated courses; the 12 approved decision-grade records now have actionable source-backed USD pricing paths. Most ratings and review counts remain unknown by design.
- The 12 approved decision-grade records preserve provider-described workloads, including exact video-course durations and longer schedules, without inferring completion totals.
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

## Phase 1B.5 Batch 1 Result

- Google Data Analytics vs Google Advanced Data Analytics: **7/7 pass** plus pricing **pass**.
- AWS Cloud Technical Essentials vs Introduction to Cloud Computing: **7/7 pass** plus pricing **pass**.
- The original two pilot pairs retain their prior pricing and 5/7 results.

## Phase 1B.6 Batch 2 Result

- Google Project Management Professional Certificate vs Project Management Principles and Practices Specialization: **6/7 pass** plus pricing **pass**.
- Tools/technologies is explicitly insufficient for the pair because the UCI listing names no software or technology.
- The original four approved pairs retain their prior pricing and readiness results.

## Phase 1B.6 Acceptance Resolution

Phase 1B.7 completed the required cumulative review. All five incumbent comparisons let a user understand the material learning tradeoffs, current economic commitments, and remaining uncertainty without first opening both provider pages. This acceptance does not authorize automatic migration of the remaining 8 courses or automatically resume SEO expansion.

## Phase 1B.7 Result

- All five incumbent pairs pass cumulative desktop/mobile product acceptance.
- Google Project Management vs AdelaideX: **6/7 pass** plus pricing **pass**; tools/technologies is explicitly insufficient.
- The approved decision-grade set is 11 courses across six pairs, including the first Coursera-versus-edX pair.
- Phase 3B uses this accepted decision-grade evidence only on the five corresponding canonical skill pages; it does not authorize additional catalog migration or scaled SEO routes.

## Parallel Ongoing Work

Phase 1A source quality remains an ongoing maintenance concern, but verification should be driven by concrete decision-value needs rather than by a goal of maximizing verified-field counts. Phase 3B is bounded to existing canonical skill hubs; additional indexable volume still requires product and search evidence. Phase 1B.8 completes the currently authorized provider batch, so any later provider or course requires a new explicit product decision. Monetization remains gated behind a real program and disclosure design, and recommendation remains gated behind trustworthy signals and explicit criteria.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
