# Roadmap

The roadmap is phase-gated. Agents must not pull work forward from a later phase unless the task explicitly changes the roadmap. Phase numbers describe workstreams and gates; they do not require strict execution order when a phase is explicitly blocked by an external dependency.

## Phase 0 — MVP

**Status: complete for the current MVP scope.**

Goal: prove the core utility of Search -> Compare -> Decide.

Included:

- Skill search and routing.
- Skill course listings and filters.
- Course detail pages.
- Two-course comparison.
- Mobile selection and compare UX.
- Initial SEO/blog foundation.
- Curated normalized dataset.
- Trust and data-quality signaling.
- Decision-focused visual polish across the core journey.

Future work in this area should be limited to concrete usability defects or regressions discovered through review. Do not reopen broad Phase 0 feature expansion without an explicit product decision.

## Phase 1 — Real Data

**Status: complete for the current curated MVP catalog; ongoing maintenance only.**

Goal: make the catalog trustworthy and consistent enough to support useful comparison and discovery.

Completed for the current 19-course MVP catalog:

- Manual source review across all catalog records.
- Skill normalization and consistent source metadata.
- Conservative verification statuses.
- Stable-field verification where official provider pages support it.
- Explicit provenance blockers where an exact current offering cannot be confirmed.

Current gate result: 17 of 19 courses are `partially_verified`, 2 remain `pending` with explicit source blockers, and source URL mismatches are 0. Zero pending records is not a goal by itself.

Phase 1 remains an ongoing quality-maintenance concern. Future verification or small catalog expansion must remain source-backed, auditable, and explicitly approved when it materially improves user decision value.

## Phase 2 — Monetization

**Status: gated / not started; does not block Phase 3.**

Goal: monetize existing decision intent without damaging trust.

This phase activates only when a real and auditable affiliate or referral program exists. Until then, it remains intentionally gated while Discovery and SEO may proceed.

Only after a real program exists:

- Affiliate/referral links.
- Required disclosures.
- Click tracking appropriate to the monetization relationship.

Do not implement speculative affiliate parameters, fake discounts, paid ranking, or placeholder monetization.

## Phase 3 — Discovery and SEO

**Status: active.**

Goal: grow qualified organic traffic by making useful decision surfaces discoverable and by adding genuinely differentiated content only when the catalog supports it.

Priority order:

- Correct the indexable surface so search engines are pointed at useful canonical product pages rather than generic template volume.
- Strengthen useful pages by skill and comparison intent.
- Improve internal linking around real user journeys.
- Add evergreen decision content selectively.
- Add search-performance measurement when an appropriate real measurement path is available.

SEO must support the product rather than create thin, duplicated, mass-generated, or misleading pages.

## Phase 4 — Recommendation

**Status: later.**

Goal: provide rankings or suggestions based on real, explicit signals.

Requires:

- Defined ranking criteria.
- Sufficient trustworthy catalog data.
- Real user or behavioral signals where appropriate.
- Clear explanation of why a recommendation is made.

No artificial "best course" claims before these conditions exist.

## Phase 5 — Robust Product

**Status: only if traction justifies it.**

Potential scope:

- Database-backed catalog.
- Admin tooling.
- Data pipelines.
- More scalable operational infrastructure.

Do not build Phase 5 architecture to solve hypothetical scale.

## Immediate Sequence

1. Treat Phase 1 as completed for the current MVP catalog while maintaining conservative source-backed data quality.
2. Execute the approved Phase 3 Discovery/SEO — Indexable Surface Foundation batch before adding new SEO page types or content volume.
3. After that batch, review the actual indexable surfaces and choose a small number of skill/intent pages to strengthen based on user value and available catalog depth.
4. Correct concrete usability defects discovered during review without opening another broad polish phase.
5. Activate Phase 2 monetization only when a real program and appropriate disclosures are ready; it is not a prerequisite for Phase 3.
