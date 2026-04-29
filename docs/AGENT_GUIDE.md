# Agent Guide

This guide defines how coding agents should work on Skills Compare.

## Product Direction

Skills Compare is a decision engine for online courses. Users should be able to search a skill, explore relevant courses, compare options, decide what fits, and open the original course platform.

It is not a generic course catalog.

## Safe Changes Without Asking

Agents may proceed without confirmation for:

- Small UI copy improvements.
- Internal navigation improvements.
- Data display fixes that preserve existing schema semantics.
- Optional schema extensions that are backward-compatible.
- Documentation updates.
- Local-only tracking structures that do not send data externally.
- Refactors that remove duplication without changing behavior.

## Stop And Ask

Stop before:

- Adding dependencies.
- Calling external APIs or scraping.
- Changing build scripts or deployment config.
- Adding cookies, tracking providers, or backend analytics.
- Making incompatible schema changes.
- Inventing prices, ratings, review counts, rankings, or claims.
- Deleting files or making destructive git changes.

## Required Validation

Every PR should run:

```bash
corepack pnpm validate:data
corepack pnpm build
```

If validation or build fails twice for the same PR, stop and document the blocker.

## Data Policy

- Do not invent precise facts.
- Keep unknown values as `null`, `unknown`, empty arrays, or explicit pending copy.
- Safe generic bullets are acceptable only when inferred from existing title, provider, skill, level, and description.
- Do not add fake ratings, review counts, prices, rankings, or outcome claims.
- Data quality changes must pass validation before merge.

## Product Copy Rules

- Use neutral Spanish copy.
- Prefer decision clarity over feature breadth.
- Avoid visible MVP language in the product UI.
- Missing data should read as `Pendiente de validar` or `No disponible`.
- Price copy must not imply unverified amounts.
