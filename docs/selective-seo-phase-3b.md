# Phase 3B — Selective Decision-led SEO Reactivation

## Scope and architecture decision

Issue #111 reactivates acquisition work only on the five canonical skill pages that have at least one accepted readiness pair:

- `/skills/ai`
- `/skills/cybersecurity`
- `/skills/data-analysis`
- `/skills/cloud-computing`
- `/skills/project-management`

The implementation uses `data/decision-grade-manifest.json` as the sole pair allowlist and preserves its ordering. A reusable comparison model resolves each pair against the normalized catalog, reuses the existing decision-readiness and comparison-row logic, and returns only the serializable fields used by the skill UI. A reusable pair card renders course/platform identity, canonical course-detail links, the highest-priority factual differences, explicit insufficiencies, and the exact internal Compare URL.

This architecture was selected because it creates one acquisition-to-decision path instead of five hand-authored page variants, adds no runtime content generation or provider branches, and keeps the full evidence on Compare.

## Comparison entry points

The following links are surfaced in deterministic manifest order:

1. AI For Everyone vs Deep Learning Specialization
2. Google Cybersecurity Professional Certificate vs IBM Cybersecurity Analyst Professional Certificate
3. Google Data Analytics Professional Certificate vs Google Advanced Data Analytics Professional Certificate
4. AWS Cloud Technical Essentials vs Introduction to Cloud Computing
5. Google Project Management Professional Certificate vs Project Management Principles and Practices Specialization
6. Google Project Management Professional Certificate vs AdelaideX: Introduction to Project Management

The Project Management guide preserves the visible difference between Coursera and edX. It renders the verified Google `$49/month` commitment separately from AdelaideX's `$149 total` Premium certificate path; it does not flatten subscription and one-time economics into the same claim.

## SEO and indexing boundaries

- Target titles and descriptions now express stable course-comparison intent and known data gaps without publishing volatile exact prices in metadata.
- All five canonical skill pages retain their existing canonical URLs and default indexability.
- The sitemap remains exactly 28 URLs: homepage, eight canonical skills, and 19 canonical course details.
- `/compare` and all generated templates remain outside the sitemap.
- All 20 generated templates remain accessible with `noindex, follow`.
- No synthetic `lastModified`, duplicate canonical route, new pair route, or new page type was added.
- `corepack pnpm generate:seo` was not run because no generation input changed.

## Product acceptance

All five target skill pages were reviewed in the live Next.js UI at both required sizes.

| Canonical skill | 1440 × 1000 | 390 × 844 | Approved pair links | Notes |
| --- | --- | --- | ---: | --- |
| AI | Pass | Pass | 1 | Verified pricing and offering/workload differences; tools and practical-work uncertainty explicit |
| Cybersecurity | Pass | Pass | 1 | Starting-point and cost-model uncertainty explicit |
| Data Analysis | Pass | Pass | 1 | Fully source-backed displayed criteria; provider-change caveat remains |
| Cloud Computing | Pass | Pass | 1 | Fully source-backed displayed criteria; provider-change caveat remains |
| Project Management | Pass | Pass | 2 | Both same-platform and Coursera-vs-edX paths visible; monthly vs one-time commitments remain distinct |

Across the matrix:

- page intent, pair identity, platforms, and Compare actions were understandable without explanation;
- exact pair URLs and canonical course-detail links were correct;
- mobile Compare targets rendered at 48 px high;
- no horizontal overflow, Next.js error overlay, browser console error, ranking/recommendation language, or unsupported claim appeared.

All six detailed Compare URLs were also regressed at both sizes. Each rendered the decision summary, course snapshot, verified pricing, criteria, final verification section, and two provider actions without overflow or errors. The normal card-selection flow reached Compare with the selected pair, and the 24-hour selection state restored visibly on return.

## Growth-efficiency and future monetization review

1. **Reusable versus skill-specific:** pair resolution, ordering, factual row selection, uncertainty rendering, metadata pattern, and UI are shared. Skill-specific output comes only from approved manifest membership and verified catalog facts.
2. **Marginal work for a sixth eligible skill:** after a separately approved data migration and readiness pair, the canonical skill page gains the guide automatically. Expected recurring work is source verification, the existing manifest/catalog update, and normal acceptance—not a new page or component variant.
3. **Affiliate readiness:** this work makes later activation easier by adding no outbound link or CTA resolution. Skill acquisition funnels to internal Compare; provider URLs, disclosure copy, outbound contexts, and future affiliate resolution remain centralized in the existing provider-action layer.
4. **Future pair landing pages:** the pair model and pair card are independent of the skill wrapper, so a separately approved canonical pair surface could reuse decision logic rather than duplicate it. No pair route is created in this initiative.
5. **Recurring maintenance burden:** no new service, dependency, provider branch, analytics system, or hand-authored per-skill copy was introduced. Maintenance remains bounded to existing source/catalog/manifest review plus the focused SEO-boundary check.

## Sequencing update

Issue #112 supersedes the original default-next-provider note. After independent review of Phase 3B, Pluralsight Cloud/Cybersecurity is the default next provider batch only if current official pricing and entitlement evidence satisfies the existing hard gate. LinkedIn Learning remains the provider-neutral fallback. Commission must not influence visible ordering or factual presentation.
