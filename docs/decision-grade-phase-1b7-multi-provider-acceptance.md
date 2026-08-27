# Phase 1B.7 Multi-provider Acceptance and Cross-platform Project Management

Reviewed on 2026-08-27. This initiative combines cumulative product acceptance of the five previously approved pairs with one bounded AdelaideX migration. Only current public official provider evidence was used for new course claims.

## Cumulative product acceptance

The five incumbent pairs were reviewed in the actual comparison UI on desktop and mobile. The data-quality gate result and the product-usefulness judgment are distinct:

| Pair | Data-quality gate | Product acceptance finding |
| --- | --- | --- |
| AI For Everyone vs Deep Learning Specialization | Pricing PASS + 5/7 | PASS. A user can distinguish a short beginner course from an intermediate five-course Specialization, compare one-time and monthly commitments, workload, prerequisites, credential, and learning focus. Tools and practical work remain visibly insufficient rather than being treated as matches. |
| Google Cybersecurity vs IBM Cybersecurity Analyst | Pricing PASS + 5/7 | PASS. The UI makes workload, credential context, pricing paths, learning focus, named tools, and practical work useful before provider exit. IBM starting-point and cost-model context remain explicit insufficiencies. |
| Google Data Analytics vs Google Advanced Data Analytics | Pricing PASS + 7/7 | PASS. The beginner-versus-advanced starting point, shared workload, tools, curriculum, practical work, credential, and monthly commitments form a clear progression decision. |
| AWS Cloud Technical Essentials vs IBM Introduction to Cloud Computing | Pricing PASS + 7/7 | PASS. A user can distinguish AWS-specific technical depth from a broader cloud introduction, including workload, starting point, tools, labs/projects, credential, and subscription scope. |
| Google Project Management vs UCI Project Management Principles and Practices | Pricing PASS + 6/7 | PASS. The Professional Certificate versus Specialization format, six-month versus four-week workload, learning focus, practical artifacts, and payment paths are decision-useful. UCI tools/technologies remains visibly insufficient. |

Green validators alone were not treated as acceptance evidence. Each rendered comparison was inspected for decision summary, source-backed snapshot, pricing evidence, criteria statuses, detailed content, uncertainty, final verification, and provider actions.

## AdelaideX official evidence

Current official source: [AdelaideX: Introduction to Project Management on edX](https://www.edx.org/learn/project-management/university-of-adelaide-introduction-to-project-management), observed 2026-08-27 on the public course page.

- Offering / credential: one AdelaideX course with an AdelaideX school-verified course certificate on the paid Premium track.
- Workload: six weeks at 2–3 hours per week; `durationHours` remains null because the range is not an exact total.
- Starting point: introductory, with no prerequisites or prior experience required.
- Learning topics: project characteristics and initiation; planning, scope, schedule, and cost; risk; teams, communication, and leadership; progress, feedback, and lessons learned.
- Tools / technologies: insufficient. The current official page names project-management concepts and activities but no software or technology.
- Practical work: the current syllabus applies project characteristics to the learner's own project in the opening module.
- Cost model: time-limited audit access is separate from a paid Premium track with unlimited access, graded assessments, and a certificate.
- Volatile rating and review signals remain unknown in the catalog even though the live page displayed them during review.

## Pricing hard gate and readiness result

AdelaideX pricing: **PASS**.

- Payment model / cadence: one-time / one-time.
- Exact source and normalized amount: `$149 USD` / `$149 USD`.
- Scope: Premium certificate track for the actual Introduction to Project Management course, including unlimited access, graded assessments, and a certificate.
- Action and evidence URL: the same public official edX course page linked above.
- Observed: 2026-08-27.
- Market / access context: public provider page; the page states USD and no market restriction.
- Conditions: taxes, eligibility, and course-run availability may vary; the separate audit path is time-limited.
- Excluded: the temporary `ACTION2026` promotion was not used as the canonical baseline.

Google Project Management vs AdelaideX: pricing **PASS** + **6/7 PASS**. Offering/credential, workload, starting point, learning topics, practical work, and cost-model context are source-backed for both. Tools/technologies is explicitly insufficient because edX names no software or technology.

The manifest now contains exactly 11 migrated courses and six approved readiness pairs. The five prior pairs and all prior approved IDs are preserved, and manifest/migration alignment remains exact.

## Provider-neutrality audit

The edX course was checked on the Project Management skill page, its course detail page, and the Google-versus-AdelaideX comparison.

- Pricing presentation correctly distinguishes Google's monthly program/platform subscriptions from edX's one-time Premium certificate track.
- Credential wording distinguishes a Professional Certificate from a school-verified course certificate.
- Provider actions remain neutral (`Open provider page`, `Open verified pricing path`, and comparison provider actions).
- Workload, source/provenance links, decision summary, comparison rows, course cards, and detail facts render without Coursera-specific assumptions.
- One concrete defect was fixed: the final comparison checklist now asks users to confirm subscription or renewal terms only when they apply, so a one-time edX path is not described as renewing.
- No schema expansion or redesign was required.

## Runtime acceptance evidence

- Desktop: all six pairs checked at 1440 × 1000. Every decision section and provider action rendered; no horizontal overflow, off-screen controls, or browser console errors were found.
- Mobile: all six pairs checked at 390 × 844. Long titles wrapped, stacked sections remained readable, all provider actions remained available, and no horizontal overflow, off-screen controls, or browser console errors were found.
- The AdelaideX course card and detail page were checked on both desktop and mobile. Platform, one-time price, duration, certificate context, verified pricing action, and provider action all rendered correctly.
- Inline provenance links remain compact text links; primary decision and provider controls retain their existing touch-target sizing.

## Product-review conclusion

The product appears ready for independent ChatGPT/product review to consider resuming selective, people-first Phase 3 SEO work. This is an acceptance recommendation, not a release decision: this PR does not unpause SEO, add routes, or create content volume.
