# Skills Compare Agent Instructions

This file is the entry point for coding agents working on Skills Compare.

## Mission

Build a trustworthy decision product for people choosing online courses by skill. The core journey is:

**Search -> Compare -> Decide**

Optimize for user understanding, decision quality, low maintenance, and validated product learning. Do not optimize for feature count or technical novelty.

## Mandatory Context Read Order

Before implementing product or code changes, read:

1. `docs/PRODUCT_CONTEXT.md`
2. `docs/ROADMAP.md`
3. `docs/CURRENT_STATE.md`
4. `docs/PRODUCT_DECISIONS.md`
5. `docs/ENGINEERING_RULES.md`
6. Relevant domain docs such as `docs/MVP_READINESS.md`, `docs/catalog-phase-1.md`, `docs/core-interaction-model.md`, and `docs/external-links-and-future-monetization.md`

If documents conflict, prefer the files earlier in this list and flag the conflict in the PR.

## Product Guardrails

- Never invent course facts, prices, ratings, review counts, outcomes, rankings, partnerships, or verification claims.
- Unknown or unverified facts must remain explicitly unknown, pending, or absent.
- Do not add affiliate links, referral links, ads, paid placement, or monetization tracking until the roadmap explicitly moves to Phase 2.
- Do not add ranking or recommendation claims until explicit criteria and real signals exist.
- Do not add employment, salary, provider endorsement, or outcome promises.
- The product UI is English-first unless a task explicitly changes language strategy.
- Compare remains the primary decision action on skill pages; course details are secondary; opening the provider is tertiary.
- Prefer simple, maintainable UX and architecture over broad frameworks or speculative infrastructure.

## Execution Boundary

Coding agents are execution agents, not autonomous product owners.

They may decide implementation details inside an approved task, but must not independently change product scope, roadmap phase, monetization strategy, data truth standards, ranking policy, or core interaction priorities.

If a requested implementation would cross one of those boundaries, stop and report the product decision required.

## Mandatory Publishing Preflight

For local or cloud coding agents that use Git, before implementation:

1. Confirm the repository and remote are `diegosalazaru/SkillMVP`.
2. Fetch the real latest `origin/main`.
3. Create or reset the task branch from `origin/main`.
4. Verify the merge base is the real latest `origin/main`.
5. Push the empty task branch to origin before modifying files.

If fetch, checkout, authentication, permissions, proxy, history, or the initial push fails, **stop before implementation**. Do not create local-only work that cannot be published.

GitHub CLI (`gh`) is optional. It is not a publishing-preflight requirement and must not be installed merely to execute an approved task. Standard `git` authentication and the configured `origin` remote are sufficient for fetch, branch creation, and push. If the branch can be pushed but a local agent cannot open a PR because `gh` is unavailable, continue the implementation, push the completed branch, report that PR creation was unavailable locally, and leave PR creation to the connected GitHub workflow or product owner.

## PR Lifecycle and Merge Authority

### Coding-agent execution

- Coding agents must leave task PRs as draft by default.
- `Do not merge` is absolute for the coding agent executing the task.
- Coding agents must not mark a draft PR ready, merge, squash-merge, rebase-merge, enable auto-merge, or invoke an equivalent merge action unless their task explicitly delegates that specific action.
- Green CI, Vercel, or local validation is necessary evidence, never implicit merge authority for the coding agent.
- Finishing implementation means pushing the branch, opening or updating the draft PR, reporting validation results and blockers, and then stopping.

### Independent ChatGPT review

After independent product/code review, ChatGPT may autonomously mark a specific draft PR ready and merge it when all of the following are true:

- Scope matches the approved initiative.
- No material product, data-truth, security, build, history, or UX blocker remains.
- Required repository validation and checks are green, or any non-applicable check is explicitly understood.
- The merge is a normal, non-destructive repository operation.

ChatGPT does not need a separate product-owner message such as `Merge PR #X` for a routine reviewed merge. A coding-agent task instruction `Do not merge` applies to the coding agent executing that task; it does not prevent an independent ChatGPT reviewer from later marking the PR ready and merging it after acceptance.

ChatGPT must ask the product owner before merging when review exposes a material product tradeoff, meaningful scope expansion, unresolved decision-changing uncertainty, security or credential risk, a destructive or history-rewriting action, an infrastructure or system-policy change, or a realistic risk of data or work loss.

## Validation Before PR Completion

Run the validations defined in `docs/ENGINEERING_RULES.md`. At minimum for normal product changes:

```bash
corepack pnpm validate:data
corepack pnpm report:data-quality
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

If the pnpm TypeScript launcher fails on Windows only because the shell cannot resolve `tsc`, use the narrow repository-local fallback documented in `docs/ENGINEERING_RULES.md`; do not install or change dependencies to work around that launcher issue.

Do not initialize ESLint configuration just to make `lint` run. Do not regenerate SEO output unless the task changes catalog or SEO generation inputs.

## PR Discipline

- Keep each PR tied to one approved initiative.
- Avoid unrelated refactors.
- Report changed-file count and validation results.
- Do not merge when checks fail or material product questions remain.
- Update durable documentation when a decision, roadmap phase, or current-state assumption materially changes.
