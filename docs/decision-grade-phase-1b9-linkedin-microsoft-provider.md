# Phase 1B.9 LinkedIn Learning + Microsoft Learn Provider Batch

Reviewed on 2026-09-09. Issue #122 evaluated exactly four learning-path candidates: two LinkedIn Learning paths and two Microsoft Learn paths. Three candidates cleared the unchanged actionable-pricing and 5/7 Decision Data Contract gates. LinkedIn's Project Management path is intentionally omitted at 4/7; no substitute was added. No provider-specific page, component branch, schema expansion, ranking, affiliate behavior, analytics, route type, or ingestion infrastructure was introduced.

## Current official access and credential evidence

LinkedIn sources:

- [Premium Career](https://premium.linkedin.com/careers/career) includes access to more than 25,000 LinkedIn Learning courses and publishes estimated prices starting at `US$39.99/month/license` or `US$239.88/year/license`. LinkedIn says estimates may exclude taxes or promotions, may vary by device, and the pricing action shows the actual amount.
- [LinkedIn Learning Certificates of Completion FAQ](https://www.linkedin.com/help/learning/answer/a598944/learning-certificates-of-completion-faqs?lang=en) says active subscriptions providing LinkedIn Learning access can issue Certificates of Completion for eligible courses and learning paths, most paths are eligible, and these certificates are not accredited degrees or software certifications.

Microsoft sources:

- [Microsoft Learn FAQ](https://learn.microsoft.com/en-us/training/support/faq) states Learn training is free, available to anyone interested in Microsoft products, and consumable without a profile. It describes learning-path completion achievements/trophies separately from credentials assessed through exams.
- Azure resource usage, certification exams, and instructor-led Learning Partner offerings are separate products. They are not attached to either free learning-path price.

Primary taught language remains unknown for all three accepted paths. English/localized page copy and lists of available translations do not establish the primary taught language.

## Independent candidate gates

### LinkedIn A — Project Management — BLOCKED

`Getting Started as a Project Manager` remains available at its [exact current path](https://www.linkedin.com/learning/paths/getting-started-as-a-project-manager), which shows 8 courses / 11 hours, path-completion badge context, managing projects on time/budget/scope, essential project-management skills, and stakeholder communication.

- Source-backed for both sides against `google-project-management-google`: offering/credential, workload, learning topics, cost model.
- Insufficient on the exact LinkedIn path: learner level/prerequisites, named tools/technologies, and attributable projects/labs/practical work.
- Result: pricing **PASS** + **4/7 BLOCKED**.

The path is absent from the catalog, source-metadata records, manifest, readiness pairs, generated SEO data, sitemap, and product surfaces. “Getting Started” was not treated as a prerequisite statement; instructor bios and generic component-course participation were not used to manufacture another dimension.

### LinkedIn B — Data Analysis — PASS

The exact [Become a Data Analyst path](https://www.linkedin.com/learning/paths/become-a-data-analyst) currently shows 12 courses / 41 hours, technical data-analyst skills, high-demand analysis tools, and communication/teamwork/problem-solving. Its current component list directly names Microsoft Excel data analysis, SQL, Power BI, Tableau, R, and Python training.

- Source-backed for both sides against `google-data-analytics-google`: offering/credential, workload, learning topics, tools/technologies, cost model.
- Insufficient on the exact LinkedIn path: learner level/prerequisites and attributable projects/labs/practical work.
- Result: pricing **PASS** + **5/7 PASS**.

Both Premium Career amounts are stored as provider-neutral `platform_subscription` options with `qualifier: "starting_at"`. Their scope describes Premium Career access including LinkedIn Learning, not a course purchase. Exact-price Same/Different status must therefore remain `Insufficient data`, while the independently verified cost-model row remains comparable.

The exact path guarantees a completion badge. LinkedIn's help establishes that most eligible paths may also issue a non-accredited Certificate of Completion under active access, but does not establish this exact path's certificate eligibility. The catalog therefore keeps the certificate boolean unknown and presents the qualified path-completion credential context explicitly.

### Microsoft C — Cloud Computing — PASS

The exact [Introduction to Cloud Infrastructure: Describe Azure architecture and services path](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/) currently shows a Beginner learning path, 5 modules, 2 hours 48 minutes, Azure, and the prerequisite `Basic familiarity with IT terms and concepts`. Modules cover architecture, compute, networking, storage, identity, access, and security.

- Source-backed for both sides against `aws-cloud-technical-essentials-aws`: offering/credential, workload, starting point, learning topics, tools/technologies, cost model.
- Insufficient for the exact selected Microsoft path: attributable projects/labs/practical work. The page assigns hands-on exercises to the broader series and guided projects to a separate fourth path.
- Result: pricing **PASS** + **6/7 PASS**.

The comparison distinguishes a short free Azure-focused path from a longer AWS-authored Coursera course with named AWS services, labs, an application build, and capstone. It does not imply vendor neutrality or equivalent certification.

### Microsoft D — Data Analysis — PASS

The exact [Get started with Microsoft data analytics path](https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/) currently shows an Intermediate learning path, 4 modules, 1 hour 28 minutes, prerequisites `None`, Product Power BI, and Role Data Analyst. Modules cover the analytics process/roles/tasks, Power BI reporting, Microsoft Fabric, and Copilot in Power BI.

- Source-backed for both sides against `google-data-analytics-google`: offering/credential, workload, starting point, learning topics, tools/technologies, cost model.
- Insufficient for the exact selected Microsoft path: attributable projects/labs/practical work.
- Result: pricing **PASS** + **6/7 PASS**.

The comparison frames a short free Microsoft-focused path against a broad career-oriented Professional Certificate. The path can help prepare for a Microsoft certification, but the free learning-path achievement is not the certification or its exam.

Both Microsoft options use `model: "free"`, exact zero amounts, `cadence: "other"`, and provider-published USD basis. Neither uses `free_audit`, attaches exam pricing, nor folds optional Azure-resource economics into training access.

## Migration, provider neutrality, and indexing

- Catalog: 23 courses; approved decision-grade set: 15 courses.
- Readiness manifest: ten pairs; all seven incumbent pairs and IDs are preserved.
- Manifest/migration alignment remains exact.
- LinkedIn requires only one shared platform mapping; Microsoft Learn already used the same normalized platform adapter. Both use `offeringType: other` plus explicit learning-path credential and description text. No provider-specific UI branch or schema expansion was needed.
- Compare defers its browser-only last-skill lookup until after hydration, keeping the server and initial client render identical while preserving the existing return action.
- Data Analysis and Cloud Computing canonical guides gain the three pairs automatically from the manifest. Project Management retains its two incumbent pairs.
- Catalog inputs changed, so the existing 20 generated SEO templates are regenerated and remain `noindex, follow`. The sitemap grows only by the three accepted canonical course-detail URLs, to 32 URLs total. Compare remains outside the sitemap and no pair route is added.

Because at least one LinkedIn candidate and both Microsoft candidates are accepted through shared provider-neutral structures, this batch is strong evidence under issue #117 that provider semantics are mature enough to authorize the first separately scoped Stage B/C ingestion pilot. This PR does not implement or scaffold bulk ingestion.

## Product acceptance and validation

Required browser acceptance exposed a Compare hydration mismatch when a returning user already had a last-skill value in browser storage. The bounded fix defers that browser-only read until after hydration so server and initial client markup match; it does not change selection persistence, routing, comparison logic, or decision hierarchy.

Desktop (1440 × 1000) and mobile (390 × 844) acceptance covered:

- changed Data Analysis and Cloud Computing canonical skill pages, including all three manifest-driven new pair links;
- all three new course-detail pages;
- all three new Compare URLs;
- the Google Data Analytics vs Google Advanced Data Analytics and AWS Cloud Technical Essentials vs IBM Introduction to Cloud Computing incumbent comparisons at both sizes;
- Project Management's unchanged three-course/two-pair surface and the absence of the blocked LinkedIn path.

Every page loaded meaningful content with its expected H1, facts, links, and decision hierarchy. LinkedIn showed `Starting at $39.99/month` and `Starting at $239.88/year`; its Verified pricing row remained `Insufficient data`. Microsoft showed `Free — Microsoft Learn training access for this learning path`; free-vs-paid Verified pricing and cost-model rows were factual `Different` results. Credential rows kept path badges/achievements distinct from accreditation and exam-based certification. No horizontal overflow, overflowing element, Next.js error overlay, or browser console error appeared.

Validation:

- `corepack pnpm generate:seo`: pass; exactly 20 generated pages, 0 skipped.
- `corepack pnpm validate:data`: pass; 23 courses and all ten pricing/readiness gates validated.
- `corepack pnpm report:data-quality`: pass; 21 partially verified, 2 pending, 0 source mismatches, and exact 15-course manifest alignment.
- `corepack pnpm check:pricing-contract`: pass; exact, starting-at, free, invalid-zero, and Compare regressions.
- `corepack pnpm check:selective-seo`: pass; five canonical skills, ten manifest pairs, 20 gated generated routes, and 32 sitemap URLs.
- `corepack pnpm exec tsc --noEmit`: the documented Windows launcher-resolution failure occurred before TypeScript ran; `node node_modules/typescript/bin/tsc --noEmit` passed.
- `corepack pnpm build`: pass; 31 static/dynamic pages generated successfully.
- `git diff --check`: pass.
