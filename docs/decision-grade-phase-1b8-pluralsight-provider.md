# Phase 1B.8 Pluralsight Provider Batch

Reviewed on 2026-08-28. Issue #116 is limited to two current Pluralsight courses, one Cloud Computing pair, and one Cybersecurity pair. Current public official Pluralsight sources were used; affiliate links, rankings, new route types, analytics, dependencies, and infrastructure remain out of scope.

## Official evidence and pricing conflict

Course and entitlement sources:

- [AWS Foundations: Getting Started with the AWS Cloud Essentials](https://www.pluralsight.com/courses/aws-foundations-getting-started-aws-cloud-essentials): AWS-authored beginner video course, 1 hour 6 minutes, included in the Cloud library, covering AWS Cloud architecture and Compute, Storage, Database, Networking, and Security categories.
- [Introduction to Information Security](https://www.pluralsight.com/courses/information-security-introduction): beginner video course, 2 hours 53 minutes, included in the Security library, covering governance, risk, compliance, asset protection, controls, auditing, monitoring, testing, incidents, continuity, and operations.
- [Certificate of completion](https://help.pluralsight.com/hc/en-us/articles/24418760491924-Certificate-of-completion): a learner who completes 100% of a video course can generate a Pluralsight certificate of completion. This is not presented as a professional certification or Professional Certificate.
- [Individual plans](https://www.pluralsight.com/individuals/pricing): specialty plans include the matching domain library, and Complete includes every specialty plan's content.
- [Public transactional checkout](https://www.pluralsight.com/commerce/browse): the current USD surface showed Cloud+ and Security+ at `$35/month` or `$294/year`, and Complete at `$55/month` or `$468/year`.

The individual-pricing page exposed materially different figures from the public transactional checkout. The conflict is preserved in provenance. Per issue #116, the current public transaction surface supplies the canonical non-promotional USD commitments; promotional or strikethrough figures are excluded. The checkout localizes amounts and currency by market—live review from Spain showed EUR—so every stored USD path identifies the United States reference market and requires final checkout verification.

## Independent gate results

### Cloud candidate

`aws-foundations-cloud-essentials-pluralsight`: pricing **PASS**.

- Offering / credential: source-backed course plus Pluralsight video-course completion certificate.
- Workload: source-backed 1 hour 6 minutes.
- Starting point: insufficient. The page says Beginner but does not state prerequisites.
- Learning topics: source-backed AWS Cloud architecture and five service categories.
- Tools / technologies: source-backed only for the explicitly named AWS Cloud platform; no individual AWS services are invented.
- Practical work: insufficient. No course-specific lab, project, or applied activity is stated.
- Cost model: source-backed Cloud+ or Complete platform subscription; no course purchase price or completion total is inferred.

`aws-cloud-technical-essentials-aws` vs this course: pricing **PASS** + **5/7 PASS**. The comparison is useful because it distinguishes a two-week Coursera course with named AWS services, labs, and a capstone from a 1-hour-6-minute Pluralsight overview delivered through a different platform subscription.

### Cybersecurity candidate

`introduction-information-security-pluralsight`: pricing **PASS**.

- Offering / credential: source-backed course plus Pluralsight video-course completion certificate.
- Workload: source-backed 2 hours 53 minutes.
- Starting point: source-backed beginner guidance for learners new to cybersecurity or interested in getting started.
- Learning topics: source-backed information-security program, control, risk, audit, incident, continuity, and operations topics.
- Tools / technologies: insufficient. No named tools are stated.
- Practical work: insufficient. No course-specific lab, project, or applied activity is stated.
- Cost model: source-backed Security+ or Complete platform subscription; no course purchase price or completion total is inferred.

`google-cybersecurity-google` vs this course: pricing **PASS** + **5/7 PASS**. The UI factually distinguishes a broader six-month Professional Certificate with named tools and practical work from a 2-hour-53-minute introductory course; it does not imply equivalence or rank either option.

## Migration and provider neutrality

- Catalog: 21 courses.
- Approved decision-grade set: 13 courses.
- Readiness manifest: eight pairs; all six incumbent pairs and IDs are preserved.
- Manifest/migration alignment remains exact.
- The only runtime provider adaptation is the shared catalog mapping for the existing `Pluralsight` platform value. No provider-specific page, component branch, or schema expansion was required.
- Existing centralized provider/pricing actions and disclosure copy are reused with direct official URLs. No affiliate parameter or commission-based ordering is present.
- Course cards, course details, skill guides, snapshots, detailed pricing, criteria, and provider actions correctly render platform subscription cadence/scope, AWS-authored-versus-Pluralsight-delivered wording, course-completion certificate context, offering-size differences, and explicit unknown tools/practical-work behavior.

## Phase 3B and indexing regression

The manifest-driven canonical guides automatically add the new pair to both `/skills/cloud-computing` and `/skills/cybersecurity`; each now surfaces two pairs with exact Compare URLs. No hand-authored Pluralsight SEO copy or new route exists.

The existing generated data was refreshed because the catalog input changed, but it remains exactly 20 routes with `noindex, follow`. The sitemap remains limited to the homepage, eight canonical skills, and 21 canonical course details (30 URLs total). `/compare` remains outside the sitemap, and metadata contains no volatile Pluralsight price.

## Product acceptance

- Desktop (1440 × 1000): both changed canonical skill pages, both Pluralsight course details, and both new comparisons passed with correct links, facts, pricing paths, insufficiencies, and provider actions.
- Mobile (390 × 844): the same surfaces passed; titles and long pricing scopes wrap, skill-guide Compare actions remain 48 px high, and no horizontal overflow or error overlay appeared.
- All six incumbent comparisons plus both new comparisons passed the full decision hierarchy at both sizes: deterministic summary, snapshot, verified pricing, criteria, detailed content, final verification, and two provider actions.
- Browser console errors: none.

## Validation

- `corepack pnpm validate:data`: pass; 21 courses and all eight pair gates validated.
- `corepack pnpm report:data-quality`: pass; 19 partially verified, 2 pending, 0 source mismatches, and exact 13-course manifest alignment.
- `corepack pnpm check:selective-seo`: pass; five canonical skills, eight manifest pairs, 20 gated generated routes, and 30 sitemap URLs.
- `corepack pnpm exec tsc --noEmit`: the known Windows launcher-resolution failure occurred before TypeScript ran; `node node_modules/typescript/bin/tsc --noEmit` passed.
- `corepack pnpm build`: pass.
- `git diff --check`: pass.
