# Candidate ingestion foundation

Issue #124 adds a provider-neutral, file-based publication boundary for bounded batches of 1–50 course candidates. Issue #135 reuses and extends that boundary with an isolated source connector and a reviewed machine-publication policy. MIT Learn source-use permission remains unresolved, so live access is disabled by default and the connector is not classified as authorized. It does not add crawling, a database, an admin interface, automatic decision-grade approval, or production activation.

## Safety model

The workflow is deliberately split:

1. `ingest:candidates` converts one curated JSON input into staging only.
2. `validate:candidates` deterministically assigns `review_ready` or `quarantined` and records machine-readable exception codes.
3. `report:candidates` reports factual batch counts and can include a promotion receipt.
4. `review:candidates` remains available for manual/unapproved sources and exceptions.
5. A source-specific reviewed policy can record a machine decision for a validated candidate, including actor, policy/version, digest, timestamp, outcome, and reasons.
6. `promote:candidates` accepts explicit human-reviewed IDs by default. The autonomous orchestrator can opt into valid machine decisions only while targeting isolated accepted-data copies.

No ingest, validation, review, or reporting command can target `data/normalized/courses.json`, `data/normalized/course-source-metadata.json`, or `data/decision-grade-manifest.json`. The three legacy commands that previously normalized or built accepted data are disabled with migration guidance.

Promotion never changes `data/decision-grade-manifest.json`. A promoted course is source-ready only; decision-grade pair approval remains a separate product decision and workflow.

## Candidate envelope

Each staged record carries:

- stable `candidateId` and proposed canonical `proposedCourseId`;
- stable `sourceIdentity.sourceId` and provider-native `providerCourseId`;
- provider and platform identity;
- canonical official source URL plus discovered/observed dates;
- a normalized course payload that passes `CourseSchema`;
- field-level evidence for title, platform, source identity, availability, and pricing;
- exact, provider-qualified `starting_at`, or genuine `free` pricing evidence using the current pricing contract;
- current-offering evidence;
- source metadata proposed for publication, including an explicit `publicationStatus: "published"` decision;
- deterministic exception codes, optional human context, a `candidate`, `review_ready`, or `quarantined` disposition, a separate nullable human-review record, and a separate nullable machine decision.

Pricing evidence stays in the envelope and is preserved in promoted source metadata. New source-ready candidates must not include the decision-grade-only course fields; this prevents a valid `Course` parse from silently entering the approved decision-grade set.

## Deterministic quarantine

Validation supports these codes:

- `missing_source`
- `missing_provider_identity`
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

For the issue #135 autonomous path, promotion instead accepts a valid `publish` machine decision only when the caller explicitly enables it. The decision digest covers the candidate content and is invalidated by a semantic change. Stable provider identity permits deterministic updates to the matching accepted record; an identity mismatch remains a collision. The normal `promote:candidates` CLI does not enable machine decisions, so this implementation does not silently activate automatic production publication.

## Isolated MIT Learn / OCW connector

```bash
corepack pnpm run:authorized-ingestion -- --input-snapshot path/to/permitted-snapshot.json --limit 50 --as-of YYYY-MM-DD --workspace data/staging/issue-135-mit-ocw
```

The connector can parse a bounded MIT Learn response with `platform=ocw`, `resource_type=course`, `offset=0`, and a 20–50 record limit. It uses a valid positive MIT Learn numeric resource ID as the provider identity; absent or malformed IDs are never fabricated and are quarantined. Each untrusted result is parsed separately, so malformed `topics`, `runs`, URLs, or other fields quarantine that record without aborting valid neighbors. Availability is `current` only when the resource is explicitly published and at least one well-formed run is explicitly published; absent or malformed run evidence is `unknown`.

Live access requires both `--live` and `SKILLMVP_MIT_LEARN_LIVE_ACCESS_AUTHORIZED=1`. That environment gate must not be enabled until the applicable MIT Learn/API/offering permission for the exact listing-metadata use is documented. Anonymous HTTP access is not permission. Offline snapshots may be used only when their provenance and permitted use are already established outside this command.

The run:

- retries only HTTP 429/5xx/network failures, at most three attempts with bounded backoff and a ten-second request timeout;
- uses an exclusive lock and removes stale locks after 30 minutes;
- pauses before publication when the source count is zero or falls by more than 50% from a prior healthy baseline;
- canonicalizes the workspace and every destination, rejects symlink aliases, collisions, protected production targets, and outputs outside `data/staging/<workspace>`, and rechecks protected hashes after all writes;
- writes full candidates, per-record decisions, receipts, and reports into immutable unique `runs/<runId>/` directories, retains the latest 25 runs, and keeps only `latest.json` and source state mutable;
- records every automatic decision under actor `skillmvp:source-ready-policy`, policy `source-ready-listing` version `1.1.0`, using the actual execution timestamp;
- preserves original discovery time, records each refresh observation separately, and distinguishes changed course facts (`updated`) from evidence-only refreshes (`refreshed`);
- never writes production normalized files, the decision-grade manifest, or SEO artifacts;
- records observations separately from withdrawal confirmation. A provider outage is not absence evidence, and withdrawal requires two healthy complete observations. The current bounded first-page connector never claims complete coverage, so it cannot confirm a real withdrawal; per-ID refresh or authorized complete-snapshot coverage remains unimplemented.

No schedule is installed by this PR. Scheduling alone would not complete the lifecycle: source-use permission and a bounded per-ID or complete-coverage withdrawal strategy are both required first. Listing-metadata permission, reuse of OCW course content, and later monetization compatibility are separate questions.

## Bounded pilot evidence

`corepack pnpm check:ingestion-foundation` materializes a provider-neutral 10-record fixture in a temporary test area. It covers exact paid, qualified starting-at, and genuine-free candidates; missing source; availability conflict; invalid zero paid pricing; duplicate identity; unsupported offering; missing evidence; explicit publication decisions; partial promotion; idempotent import/promotion; source collision; and unchanged accepted files after invalid promotion. Promotion runs against temporary copies of the real 23-record catalog and source metadata, including both historical null verification dates. The fixture is synthetic and never enters production catalog data.

`corepack pnpm check:authorized-ingestion` is an explicit offline CI gate. It covers digest-bound decisions; missing/malformed and duplicate provider identity; mixed valid/malformed responses; stable-identity fact updates versus evidence refreshes; immutable same-day audit history; protected-output, destination-collision, and canonical symlink rejection with byte-identical disposable production fixtures; live-default denial; retry termination; source-wide anomaly pause; outage-safe withdrawal state; and the two-observation helper threshold.

The two 2026-09-21 aggregate files document historical isolated executions and unchanged production hashes, but they predate the permission review and do not contain portable per-record audit evidence. They are not proof that source-use permission was established and are not an acceptance artifact. No further MIT request was made for this correction. Reproducible per-record behavior is now demonstrated offline through immutable run artifacts in the mandatory regression.
