# Source-cycle implementation — Issue #135

This document separates historical execution, corrected implementation state, and external blockers after the independent review of PR #137. Nothing here records a production rollout or establishes source permission.

## Source evaluation and permission state

| Source | Access observed | Current status |
| --- | --- | --- |
| edX | Catalog endpoint returned HTTP 401 and no approved credentials were available | Externally blocked by credentials and reuse terms |
| Coursera | An endpoint was reachable, but use requires developer-program authorization that was not available | Externally blocked; no agreement accepted or application submitted |
| Microsoft Learn | Current catalog integration requires onboarding and an Entra identity | Externally blocked; no obsolete endpoint used |
| OpenLearn | Its RSS reuse path was documented, but the runtime received HTTP 403 from Cloudflare | Externally blocked; no access control bypass attempted |
| MIT Learn / MIT OpenCourseWare | Anonymous HTTP access was observed in the historical pilot | Permission unresolved; live access disabled by default |

The historical HTTP 200 response is evidence of technical reachability only. It is not evidence of permission. MIT Learn's Terms of Service restrict bulk downloading and redistribution unless a specific Offering permits it, and say Offering-specific terms govern when different. OCW separately publishes CC BY-NC-SA terms for OCW materials, including attribution, noncommercial, and ShareAlike conditions, while also noting public-domain and legal exceptions. Those texts do not by themselves establish that the MIT Learn API response, the exact factual listing fields retained here, and Skills Compare's intended use are permitted.

Relevant official references:

- MIT Learn Terms of Service: `https://learn.mit.edu/terms`
- MIT OCW Privacy and Terms of Use: `https://ocw.mit.edu/pages/privacy-and-terms-of-use/`

Three permission questions remain deliberately separate:

1. permission to retrieve and retain MIT Learn listing metadata through this endpoint;
2. permission to reuse OCW course content or media, which this connector does not claim or implement;
3. compatibility with any future commercial or monetized use.

The agent did not accept terms, contact MIT, request permission, or make another live/bulk request while resolving the review.

## Corrected implementation

The implementation now provides an offline, isolated source-cycle harness:

1. A bounded snapshot envelope is parsed once; each result is then parsed independently.
2. Valid positive provider IDs become source identities. Missing or malformed IDs remain `null`, receive an internal quarantine key only, and can never be published.
3. Malformed records retain a source-record digest, raw ID when present, normalization issues, and quarantine reasons while valid neighbors continue.
4. Availability is current only with explicit resource publication and at least one explicit published run. Missing run evidence is unknown.
5. The shared deterministic validator and versioned digest-bound policy decide publish versus quarantine.
6. Stable source tuples are unique in staging and accepted metadata. Course facts updated by the source are distinguished from observation/decision refreshes.
7. Every execution has a UUID-bearing `runId` and actual timestamps. Candidates, per-record decisions, receipts, and reports are immutable under `runs/<runId>/`; the latest 25 runs are retained. `latest.json` is only a pointer.
8. The workspace and every destination are canonicalized before any write. Outputs outside the isolated workspace, protected production files, destination collisions, and symlink/junction aliases are rejected. Atomic temporary and backup companions pass through the same boundary, pre-existing links are rejected, and temporary files are created exclusively. Export paths may not traverse links or share file identity with immutable runs, accepted copies, state, locks, snapshots, or production files. Protected hashes are checked after all permitted writes.

The current CLI defaults to no source mode. Offline evaluation requires `--input-snapshot`. Live access requires both `--live` and an external authorization gate:

```bash
corepack pnpm run:authorized-ingestion -- --input-snapshot path/to/permitted-snapshot.json --limit 20 --workspace data/staging/issue-135-mit-ocw
```

`SKILLMVP_MIT_LEARN_LIVE_ACCESS_AUTHORIZED=1` must not be set until a supported permission basis is recorded. There is no schedule or production target.

## Withdrawal scope is incomplete

The connector remains limited to the bounded `offset=0` page and always marks that observation as incomplete. Omissions therefore never count toward withdrawal. The pure state helper and accepted-metadata withdrawal operation are tested with two healthy complete observations, and outages cannot advance the counter, but the MIT connector cannot currently produce that evidence.

Issue #135 is therefore not a complete operational discovery-to-withdrawal lifecycle. Before activation, it needs one of the following under established source permission:

- bounded per-ID refresh of every accepted record, including explicit unavailable/not-found evidence; or
- authorized complete-snapshot coverage with documented pagination and anomaly limits.

Adding a schedule alone does not close this gap.

## Historical pilot evidence and limits

Two isolated executions occurred on 2026-09-21 before the independent permission review. Their aggregate reports recorded 50 discovered/normalized/valid records, zero quarantine, 50 isolated inserts on the first run, and 50 unchanged records on the second run. Production catalog, source metadata, decision-grade manifest, and SEO files remained unchanged.

The reports do not contain the 50 full per-record decisions and should not be treated as portable proof of the audit trail or as proof of authorization. They are retained as historical execution summaries with an explicit permission caveat. No new live data was fetched to reconstruct missing evidence.

## Offline acceptance evidence

`corepack pnpm check:authorized-ingestion` is now a mandatory CI step and runs without provider access. It verifies:

- protected report-output rejection before any write, including byte-identical disposable production fixtures;
- output collision and canonical symlink/junction rejection;
- rejection of pre-existing temporary/backup links with exclusive temporary creation and byte-identical protected targets;
- rejection of linked export roots and hard-linked historical audits while every prior audit remains byte-identical;
- per-record quarantine for absent IDs, malformed `topics`, malformed/missing `runs`, and mixed valid/invalid responses;
- staging and accepted source-tuple uniqueness;
- immutable evidence for two changed runs on the same day and a later refresh;
- preservation of first discovery time and separation of changed facts from refreshed evidence;
- live access disabled by default;
- bounded retry behavior, source-wide anomaly pauses, and outage-safe withdrawal state.

## Remaining blockers

- External: establish a supported permission basis for MIT Learn listing-metadata retrieval/retention, or select another authorized source.
- Functional: implement bounded per-ID or complete-snapshot withdrawal coverage.
- Operational: independent review, explicit production activation, monitoring, and scheduling remain future work after both blockers above are resolved.
- Product boundaries: decision-grade comparison, SEO indexability, content/media reuse, and monetization remain separate and inactive.
