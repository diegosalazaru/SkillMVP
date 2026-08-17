# Engineering Rules

These rules define how implementation work should be executed and published.

## Repository and Branch Safety

Canonical repository: `diegosalazaru/SkillMVP`.

Before implementation, local or cloud coding agents using Git must:

1. Confirm `origin` points to the canonical repository.
2. `git fetch origin main`.
3. Create or reset the task branch from `origin/main`.
4. Verify the merge base against `origin/main`.
5. Push the empty task branch before modifying files.

If any fetch, authentication, checkout, permissions, proxy, history, or push step fails, stop before implementation.

Do not reuse unrelated-history commits, synthetic-root history, stale workspaces, or unpublished local-only work.

## Scope Discipline

- One approved initiative per PR.
- No opportunistic refactors unless required for the task.
- Do not add dependencies without explicit approval.
- Do not change deployment configuration or build tooling unless the task requires it.
- Do not add external APIs, scraping, cookies, external analytics, or new services without explicit approval.
- Prefer small changes that can be reviewed and reversed easily.

## Required Validation

For normal product/code PRs, run:

```bash
corepack pnpm validate:data
corepack pnpm report:data-quality
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

Rules:

- Data changes must pass validation.
- Build must pass before merge.
- `report:data-quality` must not show unexplained regressions caused by the PR.
- Do not initialize ESLint configuration just to make lint run. The repository currently has no finalized ESLint setup and `next lint` may prompt interactively.
- Do not run `generate:seo` unless catalog or SEO generation inputs changed.
- If the same validation fails twice for the same underlying reason, stop and document the blocker rather than improvising broad fixes.

## Data Engineering Rules

- Normalized course data must conform to the existing schema.
- Do not invent exact values.
- Unknown values remain null, unknown, empty, pending, or explicitly unverified as appropriate to the schema.
- Source metadata and verification status must correspond to actual source review.
- Keep data changes small and auditable.
- Provider URLs should remain direct official URLs unless Phase 2 explicitly introduces a verified affiliate/referral relationship.

## Frontend Rules

- Preserve the Search -> Compare -> Decide hierarchy.
- Treat mobile as a first-class target.
- Maintain accessible semantics for buttons, links, forms, and stateful controls.
- Avoid layout regressions from long titles and unknown values.
- Do not add visible MVP/debug language to the production UI.
- Current production UI language is English-first.

## Architecture Rules

- Use existing patterns before introducing new abstractions.
- Avoid broad design-system work when a small component change solves the problem.
- Avoid speculative backend infrastructure.
- Avoid new packages for functionality already supported by the stack.
- Keep operational cost and maintenance low.

## PR Completion Checklist

Before declaring a PR ready:

- Branch is based on current `main` history.
- Scope matches the approved initiative.
- No unrelated files are changed.
- Validation results are reported.
- Product guardrails remain intact.
- Documentation is updated if a durable decision or roadmap state changed.
- GitHub checks are green or any missing check is explicitly explained.

Do not merge if there is a known material product, data-truth, build, or history problem.
