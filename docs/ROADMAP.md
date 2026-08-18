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

**Status: Phase 1A source trust complete for the current curated MVP catalog; Phase 1B decision-grade data corrective work active.**

Goal: make the catalog both trustworthy and useful enough to support real user decisions.

### Phase 1A — Source Trust

Completed for the current 19-course MVP catalog:

- Manual source review across all catalog records.
- Skill normalization and consistent source metadata.
- Conservative verification statuses.
- Stable-field verification where official provider pages support it.
- Explicit provenance blockers where an exact current offering cannot be confirmed.

Current trust result: 17 of 19 courses are `partially_verified`, 2 remain `pending` with explicit source blockers, and source URL mismatches are 0. Zero pending records is not a goal by itself.

### Phase 1B — Decision-Grade Data

Product review showed that source-trusted data is not automatically decision-useful data. The normalized model and comparison layer must preserve enough provider-backed information to help users choose without making them perform the full comparison on provider sites.

Completed:

- **Phase 1B.1 — Comparison Integrity Fix** in PR #93: unknown or unverified values no longer create confident `Same` / `Different` claims; runtime mapping now preserves nullable and verification semantics needed for trustworthy comparisons.

Active approved initiative:

- **Phase 1B.2 — Decision Data Contract v2 + pilot** in issue #94: evolve the smallest structured contract needed to preserve decision-useful provider signals, then validate it on exactly two pilot comparisons covering four courses.

Do not migrate the remaining catalog until the pilot proves that the new contract materially improves decision quality without inventing information.

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

**Status: active; indexable-surface foundation complete, content expansion paused pending the Phase 1B.2 pilot.**

Goal: grow qualified organic traffic by making useful decision surfaces discoverable and by adding genuinely differentiated content only when the catalog supports it.

Completed:

- **Indexable Surface Foundation (Batch A)** in PR #92: sitemap now promotes the homepage, canonical skill pages, and canonical course-detail pages; `/compare` and generated template SEO routes are no longer promoted in the sitemap; generated routes remain accessible with `noindex, follow`; prominent homepage SEO links target canonical skill pages.

Next SEO work must wait for product review after the Phase 1B.2 pilot. Do not create new SEO page types, keyword-scaled content, or indexable template volume merely because the technical foundation exists.

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

1. Maintain conservative Phase 1A source trust without reopening verification work for its own sake.
2. Execute issue #94, Phase 1B.2 — Decision Data Contract v2 + pilot, on exactly the four approved pilot courses.
3. Judge the pilot against the explicit decision-readiness gate before any catalog-wide migration.
4. Keep Phase 3 content/traffic expansion paused until the pilot shows that core comparison pages provide meaningful decision value.
5. If the pilot succeeds, migrate the remaining catalog only in small auditable batches and then return to selective people-first SEO work.
6. Activate Phase 2 monetization only when a real program and appropriate disclosures are ready; it is not a prerequisite for Phase 3.
