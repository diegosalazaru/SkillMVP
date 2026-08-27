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

**Status: Phase 1A source trust complete; Phase 1B.7 multi-provider acceptance and the bounded AdelaideX migration are implemented and awaiting independent product review.**

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
- **Phase 1B.2 — Decision Data Contract v2 pilot** in issue #94: the structured contract and four-course migration are implemented, both required comparisons pass the internal 5/7 gate, and unsupported dimensions remain explicitly insufficient.
- **Phase 1B.3 — Pricing as Core Decision Data** in issue #97: structured multi-path pricing is implemented for the same four-course pilot, pricing is a hard gate in addition to the unchanged 5/7 gate, and the comparison surfaces exact USD commitments with provenance and regional context.
- **Phase 1B.4 — Compare Decision Hierarchy** in issue #99: the compare flow now moves from a deterministic decision summary into a source-backed course snapshot, detailed pricing evidence, criteria, curriculum detail, and final provider verification for the same four-course pilot.
- **Phase 1B.5 — Decision-Grade Rollout Batch 1** in issue #101: exactly four additional courses across Data Analysis and Cloud Computing now use the approved contract. Both new pairs pass pricing plus 7/7 source-backed dimensions, and an explicit eight-course/four-pair manifest keeps unrelated catalog records outside the migration.
- **Phase 1B.6 — Decision-Grade Rollout Batch 2** in issue #106: the Google Project Management Professional Certificate and UCI Project Management Principles and Practices Specialization now use the approved contract. The pair passes pricing plus 6/7 source-backed dimensions, with UCI tools/technologies explicitly insufficient, and the manifest now contains exactly ten courses across five pairs.
- **Phase 1B.7 — Multi-provider Acceptance + Cross-platform Project Management** in issue #108: all five incumbent pairs pass cumulative desktop/mobile product acceptance, the current public AdelaideX course page establishes a non-promotional `$149 USD` one-time Premium certificate path, and Google Project Management vs AdelaideX passes pricing plus 6/7 dimensions with edX tools/technologies explicitly insufficient. The manifest now contains exactly 11 courses across six approved pairs.

Do not migrate the remaining catalog automatically. Any later rollout requires another explicit, auditable batch decision.

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

**Status: active; indexable-surface foundation complete, content expansion paused pending independent product review of Phase 1B.7.**

Goal: grow qualified organic traffic by making useful decision surfaces discoverable and by adding genuinely differentiated content only when the catalog supports it.

Completed:

- **Indexable Surface Foundation (Batch A)** in PR #92: sitemap now promotes the homepage, canonical skill pages, and canonical course-detail pages; `/compare` and generated template SEO routes are no longer promoted in the sitemap; generated routes remain accessible with `noindex, follow`; prominent homepage SEO links target canonical skill pages.

Phase 1B.7 product acceptance indicates that selective people-first SEO work may be ready for consideration, but next SEO work must still wait for the independent product-review decision. Do not create new SEO page types, keyword-scaled content, or indexable template volume merely because the technical foundation exists.

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
2. Independently review the completed Phase 1B.7 cumulative acceptance evidence and cross-platform AdelaideX migration.
3. Do not begin catalog-wide migration or add courses to the decision-grade manifest without a new product decision.
4. Keep Phase 3 content/traffic expansion paused until independent product review accepts the Phase 1B.7 evidence.
5. If review accepts the initiative, resume only selective people-first SEO work and keep any later catalog migration small and auditable.
6. Activate Phase 2 monetization only when a real program and appropriate disclosures are ready; it is not a prerequisite for Phase 3.
