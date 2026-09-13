# Canonical Skill UX Hierarchy — Issue #133

Reviewed and implemented on 2026-09-12 from `origin/main` commit `69b9959e5552e01ab93027eb9300073c2e3c2b04`.

## Scope

This is a bounded Phase 0 usability correction on the five canonical skill pages with manifest-approved decision guides. It does not change catalog records, the decision-grade manifest, pricing, metadata, canonicals, sitemap generation, generated-route robots behavior, source-blocked publication boundaries, outbound-provider analytics, or Vercel Analytics.

The retained pre-list hierarchy is:

`skill context -> compact comparison-ready pairs -> filters/course discovery -> detailed Compare`

Each pair now presents the two course/platform identities, explicit non-ranking and source-backed context, one highest-priority factual difference label, explicit known data-gap labels (or the provider-term caveat when none are present), and one pair-specific internal CTA to the exact stable Compare URL. Full values, detailed criteria, pricing evidence, verification guidance, and provider actions remain on Compare.

## Before/after displacement

Measurements use the document-top position of `#course-discovery-filters` in CSS pixels. Viewport ratios divide that position by the required viewport height. Data Analysis and Cloud Computing are the representative largest guides, with three approved pairs each.

| Page | Viewport | Before filter top | Before viewports | After filter top | After viewports | Guardrail |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Data Analysis | 1440 × 1000 | 3,387 px | 3.386 | 926 px | 0.926 | Pass (`<= 1.5`) |
| Cloud Computing | 1440 × 1000 | 3,511 px | 3.511 | 927 px | 0.927 | Pass (`<= 1.5`) |
| Data Analysis | 390 × 844 | 6,700 px | 7.938 | 1,512 px | 1.791 | Pass (`<= 2`) |
| Cloud Computing | 390 × 844 | 6,465 px | 7.660 | 1,560 px | 1.848 | Pass (`<= 2`) |

The decision-guide block itself changed from 2,932–3,056 px to 472 px on desktop and from 6,069–6,304 px to 1,116–1,164 px on mobile for these pages. Total document height fell from 6,263–6,423 px to 3,803–3,839 px on desktop and from 11,896–12,280 px to 6,990–7,092 px on mobile without removing the catalog or Compare evidence.

## Five-page acceptance matrix

| Canonical page | Pairs | Desktop filter top | Mobile filter top | CTA height | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| `/skills/ai` | 1 | 867 px / 0.867 vh | 859 px / 1.018 vh | 44 px | Pass |
| `/skills/cybersecurity` | 1 | 907 px / 0.907 vh | 889 px / 1.054 vh | 44 px | Pass |
| `/skills/data-analysis` | 3 | 926 px / 0.926 vh | 1,512 px / 1.791 vh | 44 px | Pass |
| `/skills/cloud-computing` | 3 | 927 px / 0.927 vh | 1,560 px / 1.848 vh | 44 px | Pass |
| `/skills/project-management` | 2 | 927 px / 0.927 vh | 1,205 px / 1.428 vh | 44 px | Pass |

At both required viewports, all ten manifest pairs appeared once in deterministic order with the exact `/compare?ids=<left>,<right>` URL. Pair-specific accessible names disambiguate the repeated visible CTA label. DOM/task focus order is header navigation, manifest-ordered Compare CTAs, then the four discovery filters; the CTA focus indicator is visible. Each page has one H1 followed by H2/H3 structure without skipped levels. No horizontal overflow, obscured guide content, Next.js overlay, hydration warning, or application console error was observed in a fresh browser session.

## Selection regression

The Data Analysis course-card journey was exercised through visible controls at both 1440 × 1000 and 390 × 844:

1. Selected Google Data Analytics and IBM Data Analyst.
2. Opened a fresh tab in the same browser profile and confirmed the visible returning-selection state with both selections restored.
3. Attempted a third selection and confirmed the `You can only compare 2 courses.` notice while the original two selections remained selected.
4. Used `Compare courses` and reached the exact preserved route `/compare?ids=google-data-analytics-google,ibm-data-analyst-ibm` with the expected comparison heading.
5. Returned to discovery, used `Clear selection`, and confirmed the Compare bar was removed.

The Compare destination had no horizontal overflow at either viewport, and the fresh functional session produced no application warnings or errors.

## Automated regression

`check:selective-seo` now also protects the compact pre-list hierarchy: guide-before-filter order, the stable filter measurement anchor, a three-column layout for three-pair desktop guides, exactly one internal Link per pair card, pair-specific accessible CTA names, the 44 px minimum CTA target, and absence of the former detailed `dl`/subsection/detail-link hierarchy. Existing checks continue to protect the five eligible skills, all ten manifest pairs and exact URLs, metadata/canonicals, the 30-URL sitemap, and all 20 generated routes as `noindex, follow`.
