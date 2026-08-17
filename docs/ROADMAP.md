# Roadmap

The roadmap is phase-gated. Agents must not pull work forward from a later phase unless the task explicitly changes the roadmap.

## Phase 0 — MVP

**Status: advanced / substantially complete.**

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

Remaining Phase 0 work should be limited to concrete usability defects or regressions discovered through review. Do not expand feature breadth under Phase 0.

## Phase 1 — Real Data

**Status: in progress.**

Goal: make the catalog increasingly trustworthy and consistent.

Priorities:

- Manual or semi-automated curation.
- Skill normalization.
- Consistent source metadata.
- Conservative verification status.
- More verified fields and provider coverage.
- Small, reviewable catalog expansion.

Gate to progress: data quality must improve without introducing invented precision.

Verification work should proceed in small, explicitly approved batches chosen for decision value and coverage. Official provider pages are the preferred source. Partial verification is expected when volatile or unsupported fields cannot be confirmed.

## Phase 2 — Monetization

**Status: not started.**

Goal: monetize existing decision intent without damaging trust.

Only after a real and auditable program exists:

- Affiliate/referral links.
- Required disclosures.
- Click tracking appropriate to the monetization relationship.

Do not implement speculative affiliate parameters, fake discounts, paid ranking, or placeholder monetization.

## Phase 3 — Discovery and SEO

**Status: foundation exists; expansion later.**

Goal: grow qualified organic traffic.

Potential work:

- More useful pages by skill and comparison intent.
- Evergreen decision content.
- Internal linking improvements.
- Search performance measurement.

SEO must support the product rather than create thin or misleading pages.

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

1. Maintain the project-context foundation so execution agents work from durable product rules.
2. Continue Phase 1 source verification and catalog-quality work in small, auditable batches.
3. Correct concrete usability defects discovered during review without opening another broad polish phase.
4. Expand SEO only after the core experience remains clear and stable and catalog coverage supports useful pages.
5. Consider Phase 2 monetization only when a real program and appropriate disclosures are ready.
