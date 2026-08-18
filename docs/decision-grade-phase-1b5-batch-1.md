# Phase 1B.5 Decision-Grade Rollout — Batch 1

Reviewed on 2026-08-18. This batch migrates exactly four additional courses: the approved Data Analysis and Cloud Computing comparison pairs. Official provider/platform pages are the only evidence used.

## Data Analysis pair

### Google Data Analytics Professional Certificate

- Official evidence: [certificate page](https://www.coursera.org/professional-certificates/google-data-analytics) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: professional certificate; beginner level with no degree or prior experience required; 6 months at 10 hours/week; data cleaning, analysis, visualization, and communication; presentations, spreadsheets, SQL, Tableau, and Python; practice-based assessments, hands-on labs/projects, and a shareable case study; monthly subscription context.
- Pricing: `$49 USD/month` for certificate access in the United States and Canada after an initial 7-day trial. The page says other markets may be lower. The alternative `$59 USD/month` path buys Coursera Plus catalog access and includes this certificate.
- Exclusions and conflict: the pace-dependent under-`$300` completion estimate is not stored as a total. The current program curriculum and FAQ identify Python and say R is not covered, while a separate tools panel lists Ggplot2 and Rmarkdown; the migrated tools follow the directly applicable curriculum/FAQ, and the conflict remains recorded in source metadata. The temporary Coursera Plus discount is not the canonical commitment.
- Duration handling: `durationHours` is null because “over 180 hours” is not an exact total and the provider publishes cadence separately.

### Google Advanced Data Analytics Professional Certificate

- Official evidence: [certificate page](https://www.coursera.org/professional-certificates/google-advanced-data-analytics) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: professional certificate; advanced level for Google Data Analytics graduates or learners with equivalent foundational analytics experience; 6 months at 10 hours/week; statistics, experimental design, regression, predictive modeling, machine learning, and stakeholder communication; Jupyter Notebook, Kaggle, Python, and Tableau; practice-based assessments, hands-on labs/projects, and a shareable capstone; monthly subscription context.
- Pricing: `$49 USD/month` for certificate access in the United States and Canada after an initial 7-day trial. The page says other markets may be lower. The alternative `$59 USD/month` path buys Coursera Plus catalog access and includes this certificate.
- Exclusions: the pace-dependent under-`$300` completion estimate and the temporary Coursera Plus discount are not canonical commitments.
- Duration handling: `durationHours` remains null because “over 200 hours” is not an exact total and the provider publishes cadence separately.

## Cloud Computing pair

### AWS Cloud Technical Essentials

- Official evidence: [course page](https://www.coursera.org/learn/aws-cloud-technical-essentials) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: single AWS-authored course with a shareable course certificate; 2 weeks at 10 hours/week; no prior cloud or AWS knowledge required, while the provider says the course is designed for a technical background and recommends AWS Cloud Practitioner Essentials first for learners new to cloud or coming from business; AWS compute, storage, database, networking, security, monitoring, and optimization services; four hands-on labs, a step-by-step application build, and a capstone.
- Pricing: `$59 USD/month` buys Coursera Plus catalog access, and the course page’s inclusion link resolves to Coursera Plus.
- Exclusions: exact direct certificate pricing is not public. The temporary Coursera Plus discount is not the canonical commitment. A possible free trial or full-course/no-certificate path is conditional and is preserved only as cost-model context.
- Duration handling: `durationHours` changed from 20 to null because multiplying 2 weeks by 10 hours/week would create a synthetic total.

### Introduction to Cloud Computing

- Official evidence: [course page](https://www.coursera.org/learn/introduction-to-cloud) and [Coursera Plus plan](https://www.coursera.org/courseraplus).
- Decision facts: single IBM-authored course with a shareable course certificate; beginner-friendly starting point for school, business, or career-change learners; 1 week at 10 hours/week; broad cloud characteristics, service/deployment models, infrastructure, storage, security, monitoring, and emerging practices; Docker; labs/quizzes and a final serverless deployment project.
- Pricing: `$59 USD/month` buys Coursera Plus catalog access, and the course page’s inclusion link resolves to Coursera Plus.
- Exclusions: exact direct certificate pricing is not public. The temporary Coursera Plus discount is not the canonical commitment. A possible free trial or full-course/no-certificate path is conditional and is preserved only as cost-model context.

## Gate result

- Google Data Analytics vs Google Advanced Data Analytics: pricing **PASS** + **7/7 PASS**.
- AWS Cloud Technical Essentials vs Introduction to Cloud Computing: pricing **PASS** + **7/7 PASS**.

The seven dimensions are offering/credential, workload, starting point, learning topics, tools/technologies, practical work, and cost model. These results are internal data-quality gates, not rankings or recommendations. The remaining catalog is not approved for automatic migration; `data/decision-grade-manifest.json` is the explicit allowlist and pair list.
