# Agent Guide

This file remains as a compatibility pointer for tools and contributors that already reference it.

The canonical agent entry point is [`/AGENTS.md`](../AGENTS.md).

Before implementing changes, agents must follow the mandatory read order in `AGENTS.md`, including:

- `docs/PRODUCT_CONTEXT.md`
- `docs/ROADMAP.md`
- `docs/CURRENT_STATE.md`
- `docs/PRODUCT_DECISIONS.md`
- `docs/ENGINEERING_RULES.md`

Key current rules:

- The product UI is English-first.
- Never invent course facts or verification claims.
- Compare is the primary decision action on skill pages.
- Do not implement monetization or ranking before the roadmap explicitly advances.
- Coding agents are execution agents; they must not independently change product scope or strategy.
- Local/cloud Git work must pass the publishing preflight before implementation.
- Normal product PRs should pass data validation, data-quality reporting, TypeScript checking, and production build before merge.

If this file conflicts with `AGENTS.md`, `AGENTS.md` is authoritative.
