# Phase 1B.6 Decision-Grade Rollout — Batch 2

Reviewed on 2026-08-27. This batch migrates exactly two additional courses: the approved Project Management comparison pair. Official provider/platform pages are the only evidence used.

## Google Project Management Professional Certificate

- Official evidence: [certificate page](https://www.coursera.org/professional-certificates/google-project-management) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: seven-course professional certificate; beginner level with no degree or prior experience required; 6 months at 10 hours/week; entry-level project management practices, documentation, planning, budgeting, stakeholder communication, Agile, and Scrum; Google Sheets, Microsoft Excel, Google Docs, Microsoft Word, Google Slides, Microsoft PowerPoint, Asana, and Google Gemini; hundreds of practice-based assessments and hands-on activities plus capstone deliverables; monthly subscription context.
- Pricing: `$49 USD/month` for certificate access in the United States and Canada after an initial 7-day trial. The page says other markets may be lower. The alternative `$59 USD/month` path buys Coursera Plus catalog access and includes this certificate.
- Exclusions: the pace-dependent under-`$300` completion estimate and the temporary `$35 USD/month` Coursera Plus promotion for eligible new subscribers through September 23, 2026 are not canonical commitments.
- Workload conflict: the page summary says 6 months at 10 hours/week, while the pricing FAQ says less than 6 months at under 10 hours/week. The summary cadence is stored and both statements remain recorded in source metadata.
- Duration handling: `durationHours` is null because the provider says the program includes over 140 hours of instruction rather than stating an exact total, and no total is inferred from cadence.

## Project Management Principles and Practices Specialization

- Official evidence: [Specialization page](https://www.coursera.org/specializations/project-management) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: four-course University of California, Irvine Specialization with a shareable certificate; beginner level with no prior experience required; 4 weeks at 10 hours/week; project scope, work breakdown structure, planning, scheduling, budgeting, resource allocation, risk, change, communication, and procurement; projects and assignments that produce project-management artifacts; monthly subscription context.
- Tools/technologies: insufficient. The official listing names methods, activities, and deliverables but no software or technology, so the field remains empty and unverified.
- Pricing: `$59 USD/month` buys Coursera Plus catalog access, and the Specialization page's inclusion link resolves to Coursera Plus.
- Exclusions: exact direct Specialization pricing is not public. The generic `$49–$79/month` range for individual Coursera courses and programs is not offering-specific, and the temporary `$35 USD/month` Coursera Plus promotion for eligible new subscribers through September 23, 2026 is not the canonical commitment.
- Workload conflict: the page summary says 4 weeks at 10 hours/week, while the four listed course estimates total 19 hours. Both statements remain recorded in source metadata.
- Duration handling: `durationHours` remains null rather than choosing between the conflicting signals or multiplying cadence into a synthetic exact total.

## Gate result

- Google Project Management Professional Certificate vs Project Management Principles and Practices Specialization: pricing **PASS** + **6/7 PASS**.

The seven dimensions are offering/credential, workload, starting point, learning topics, tools/technologies, practical work, and cost model. Tools/technologies is explicitly insufficient for the pair because the UCI listing does not name any. This result is an internal data-quality gate, not a ranking or recommendation. The remaining catalog is not approved for automatic migration; `data/decision-grade-manifest.json` is the explicit allowlist and pair list.
