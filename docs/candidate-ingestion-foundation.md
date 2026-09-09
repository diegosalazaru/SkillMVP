# Candidate ingestion foundation

Issue #124 adds a provider-neutral, file-based publication boundary for bounded batches of 10–50 course candidates. It does not add discovery credentials, crawling, a database, an admin interface, or automatic decision-grade approval.

## Safety model

The workflow is deliberately split:

1. `ingest:candidates` converts one curated JSON input into staging only.
2. `validate:candidates` deterministically assigns `review_ready` or `quarantined` and records machine-readable exception codes.
3. `report:candidates` reports factual batch counts and can include a promotion receipt.
4. `review:candidates` records explicit human review for named review-ready IDs.
5. `promote:candidates` accepts explicit human-reviewed candidate IDs and updates the accepted catalog plus source metadata together.

No ingest, validation, review, or reporting command can target `data/normalized/courses.json`, `data/normalized/course-source-metadata.json`, or `data/decision-grade-manifest.json`. The three legacy commands that previously normalized or built accepted data are disabled with migration guidance.

Promotion never changes `data/decision-grade-manifest.json`. A promoted course is source-ready only; decision-grade pair approval remains a separate product decision and workflow.

## Candidate envelope

Each staged record carries:

- stable `candidateId` and proposed canonical `proposedCourseId`;
- provider and platform identity;
- canonical official source URL plus discovered/observed dates;
- a normalized course payload that passes `CourseSchema`;
- field-level evidence for title, platform, source identity, availability, and pricing;
- exact, provider-qualified `starting_at`, or genuine `free` pricing evidence using the current pricing contract;
- current-offering evidence;
- source metadata proposed for publication, including an explicit `publicationStatus: "published"` decision;
- deterministic exception codes, optional human context, a `candidate`, `review_ready`, or `quarantined` disposition, and a separate nullable human-review record.

Pricing evidence stays in the envelope and is preserved in promoted source metadata. New source-ready candidates must not include the decision-grade-only course fields; this prevents a valid `Course` parse from silently entering the approved decision-grade set.

## Deterministic quarantine

Validation supports these codes:

- `missing_source`
- `availability_conflict`
- `duplicate_identity`
- `source_identity_conflict`
- `missing_required_evidence`
- `pricing_unactionable`
- `pricing_conflict`
- `entitlement_unclear`
- `stale_commercial_evidence`
- `unsupported_offering`
- `normalization_conflict`

Commercial evidence older than 180 days relative to `--as-of` is quarantined. Invalid zero paid/subscription prices are rejected by the shared pricing schema. Genuine free access must use the distinct `free` semantic; `starting_at` evidence remains qualified and cannot populate an exact scalar course price.

New candidates without an explicit publication decision are quarantined; `source_blocked` candidates remain unsupported and cannot become review-ready. The accepted-metadata reader continues to tolerate the two audited historical `lastVerifiedAt: null` blockers, while candidate input still requires a current non-null verification date.

## Commands

```bash
corepack pnpm ingest:candidates -- --input path/to/batch.json --output data/staging/candidates.json
corepack pnpm validate:candidates -- --staging data/staging/candidates.json --as-of YYYY-MM-DD
corepack pnpm report:candidates -- --staging data/staging/candidates.json
corepack pnpm review:candidates -- --staging data/staging/candidates.json --ids candidate-a,candidate-b --reviewed-at YYYY-MM-DD --note "Reviewed official source and pricing evidence" --as-of YYYY-MM-DD
corepack pnpm promote:candidates -- --staging data/staging/candidates.json --ids candidate-a,candidate-b --receipt data/staging/promotion-receipt.json --as-of YYYY-MM-DD
corepack pnpm report:candidates -- --staging data/staging/candidates.json --promotion-receipt data/staging/promotion-receipt.json --as-of YYYY-MM-DD
```

The input batch must contain 1–50 candidates and an explicit `batchId` and `receivedAt`. Staging files are ignored by Git so operator batches do not become accepted data through a normal commit.

Promotion requires the persisted candidate to have already been validated as `review_ready` and to carry the explicit human-review record, revalidates it at promotion time, rejects ID/source collisions before writes, appends new records in deterministic ID order, and uses temporary files plus rollback to replace catalog and source metadata as one operation. Human review stores a SHA-256 digest of the reviewed candidate content; a later semantic edit or quarantine clears that approval. Re-promoting an equivalent accepted record reports zero accepted semantic changes and does not rewrite either accepted file.

## Bounded pilot evidence

`corepack pnpm check:ingestion-foundation` materializes a provider-neutral 10-record fixture in a temporary test area. It covers exact paid, qualified starting-at, and genuine-free candidates; missing source; availability conflict; invalid zero paid pricing; duplicate identity; unsupported offering; missing evidence; explicit publication decisions; partial promotion; idempotent import/promotion; source collision; and unchanged accepted files after invalid promotion. Promotion runs against temporary copies of the real 23-record catalog and source metadata, including both historical null verification dates. The fixture is synthetic and never enters production catalog data.
