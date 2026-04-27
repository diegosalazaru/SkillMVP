# AGENTS.md

## Project context

Skills Compare helps users search for a skill, view online courses, compare them, and decide what to learn.

Current product principles:
- Product-first decisions.
- Do not invent course data. Unknown or unverified data must remain `unknown`, `null`, or explicitly mock/placeholder.
- Prefer automation over manual work, but do not over-engineer before there is traction.
- Keep PRs small, reviewable, and scoped.
- UX clarity is more important than feature breadth.
- Data validation must pass before merging data or ingestion changes.

## Technical context

- Framework: Next.js 14 App Router.
- Package manager: pnpm.
- Data validation command: `pnpm validate:data`.
- edX ingestion command: `pnpm ingest:edx`.
- Normalized course output: `data/normalized/courses.json`.
- Course schema lives under `src/lib/schema/course`.

## Required behavior for coding agents

Before proposing or changing code:
1. Identify whether the change affects product UX, data quality, CI/infra, or docs only.
2. Prefer the smallest safe diff.
3. Do not mix unrelated changes in one PR.
4. Do not add new dependencies unless the value is clear and maintenance cost is low.
5. Do not change UI, rankings, monetization, or SEO behavior as part of infra-only PRs.
6. Do not bypass validation just to make CI green.

## Validation expectations

For data or ingestion changes, run or preserve:
- `pnpm validate:data`
- relevant ingestion smoke checks when available

For UI/runtime changes, preserve or run:
- `pnpm build`
- any available lint/type checks

## PR risk policy

Safe/low-risk PRs:
- docs-only changes
- PR templates and repo metadata
- CI metadata that does not expand permissions or secrets usage
- non-runtime scripts/tooling

Product-review PRs:
- `app/**`
- `src/**`
- `components/**`
- user-facing data transforms
- ranking/recommendation logic
- SEO, tracking, monetization, pricing display, or affiliate logic

High-risk PRs:
- workflow permission expansion
- secret handling
- auth/payment logic, if introduced later
- schema changes that could invalidate existing catalog data

## Output style for agent PRs

Every PR should include:
- Summary
- Files changed by category
- Validation run or expected checks
- Risk level: safe / product-review / high-risk
- Follow-ups, if any
