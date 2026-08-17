# Current State

Last updated after Phase 1 Source Verification — Coverage Batch A merged on 2026-08-17.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

The core journey has a deliberate visual hierarchy across mobile and desktop, with stronger spacing, typography, component rhythm, and emphasis on decision actions.

## Latest Completed Initiative

**Phase 1 Source Verification — Coverage Batch A** — merged in PR #82.

Key outcomes:

- Five previously pending catalog records were manually checked against their existing official Coursera provider pages.
- All five are now `partially_verified` with source-backed field coverage and 2026-08-17 verification dates.
- `machine-learning-stanford-university` was corrected to the current course title **Supervised Machine Learning: Regression and Classification**, with current provider attribution and unsupported exact duration removed.
- `ibm-data-science-ibm` and `meta-front-end-developer-meta` received current Professional Certificate titles, source-backed prerequisites, and removal of derived exact-hour duration values.
- `ibm-cybersecurity-analyst-ibm` gained verified title, level, certificate, English language, workload signal, and learning-topic coverage while unsupported prerequisites remain unverified.
- `project-management-principles-practices-umci` gained verified English primary taught language, source-backed prerequisites, workload, certificate, level, and learning-topic coverage.
- Price, rating, and review count remain unknown and unverified for the batch.
- No source URL mismatches were introduced.

The small **Course Card Metadata Deduplication** follow-up was also completed in PR #81, removing the repeated platform label while preserving the platform eyebrow and course-level signal.

The earlier **Decision-focused Visual Polish** and **Mobile Selection and Discovery UX** initiatives remain in place.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- 12 courses are currently `partially_verified`.
- 7 courses remain `pending`.
- Source URL mismatches: 0 after Batch A.
- Most pricing, ratings, review counts, and some duration values remain unknown or unverified.
- `report:data-quality` remains part of normal validation.
- Official provider pages remain the final source users should verify before enrollment.

See `docs/MVP_READINESS.md` and `docs/catalog-phase-1.md` for deeper data-quality details.

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

### Phase 1 Source Verification — Coverage Batch B

Purpose: complete a manual source review of the seven catalog records that remain `pending`, increasing trustworthy comparison coverage without expanding the catalog or inventing precision.

Review exactly these records against their official provider pages already recorded in source metadata:

1. `deep-learning-specialization-deeplearningai` — AI — Coursera
2. `introduction-cyber-security-nyux-edx` — Cybersecurity — edX
3. `introduction-to-cloud-computing-ibm` — Cloud Computing — Coursera
4. `introduction-project-management-edx-adelaidex` — Project Management — edX
5. `google-advanced-data-analytics-google` — Data Analysis — Coursera
6. `data-analytics-essentials-cisco` — Data Analysis — Coursera
7. `ibm-ai-engineering-ibm` — AI — Coursera

For each record, attempt to verify these stable fields when the current official page clearly supports them:

- current title and provider/platform attribution
- canonical official source URL
- level
- primary taught language
- certificate availability
- workload or duration signal
- learning topics / syllabus coverage
- prerequisites or recommended experience

Verification rules:

- Use official provider pages only.
- Review all seven records, but do not force a record to `partially_verified` if the official page is unavailable or does not support enough fields.
- If an official URL redirects, has moved, or is no longer available, use a current canonical official provider page only when it clearly represents the same offering; otherwise keep the uncertainty documented.
- Correct normalized catalog fields only when the current official source clearly contradicts the existing value.
- Workload statements may be recorded as source evidence without converting months/weeks at a weekly pace into invented exact `durationHours` values.
- Exact duration hours may remain or be added only when the official source itself provides a sufficiently exact hour total.
- Do not add or infer price, rating, or review-count values. These remain unknown/null and unverified in this batch.
- Do not infer certificate, language, prerequisites, level, or availability from generic platform behavior.
- Unknown or unsupported facts remain null, unknown, pending, or unverified as appropriate.
- No scraping, provider API, new dependency, catalog expansion, SEO expansion, ranking, recommendation, monetization, or unrelated UI work.
- Keep the change small and auditable in the existing normalized catalog/source metadata files.

Success means all seven pending records have been manually reviewed and their provenance/status accurately reflects what the official sources support. The target is better trust coverage, not a forced zero-pending metric.

After implementation, run the full required repository validation sequence, using the documented narrow Windows TypeScript launcher fallback only if the normal pnpm launcher hits that exact executable-resolution issue.

The implementation must use one dedicated branch and PR and must not be merged by the coding agent.

## After Batch B

Do not automatically start another product implementation initiative. After Batch B is reviewed and merged, update this file with the resulting verification coverage and return to product review before approving SEO expansion, another data initiative, monetization, recommendation, infrastructure, catalog expansion, or further visual work.

## Parallel Ongoing Work

Phase 1 data verification remains the active roadmap area. SEO expansion follows only after the core experience remains stable and the catalog is sufficiently trustworthy. Monetization remains gated behind a real program and disclosure design.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
