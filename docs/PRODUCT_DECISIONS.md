# Product Decisions

This document records product decisions that execution agents should treat as settled unless a task explicitly reopens them.

## Core Journey

The primary journey is **Search -> Compare -> Decide**.

A feature is higher priority when it reduces friction in that journey.

## Skill Page Action Hierarchy

1. **Compare** is the primary action.
2. **View details** is secondary.
3. **Open provider** is tertiary until the user has enough context to make an outbound decision.

Do not invert this hierarchy to optimize outbound clicks prematurely.

## Compare Model

- The active product comparison limit is two courses.
- A third selection should not silently replace an existing selection.
- Persist compare selection for up to 24 hours.
- Returning selection should be visible to the user and easy to clear.
- Selections from another skill should not create confusing dead ends; surface a clear action to clear and start again.

## Decision Support

Comparison should prioritize:

1. Decision summary.
2. Important differences and factual criteria.
3. Verification risks and unknown data.
4. Provider actions when the user is ready to verify final details.
5. Deeper course detail and fit context.

Do not manufacture a winner when the available evidence does not justify one.

## Data Truth

- Unknown is preferable to invented precision.
- Provider details can change; final price, duration, certificate terms, availability, and enrollment conditions should be verified on the provider page.
- Verification labels must reflect actual source work.
- Do not convert workload estimates into exact total duration without evidence.
- Do not infer ratings, review counts, employment outcomes, or provider endorsements.

## Language

The product UI is **English-first** in the current phase.

Do not introduce mixed-language UI incidentally. Localization can be considered as an explicit future initiative.

For course catalog data, the current normalized `language` field means the **primary taught language**, not every language in which the provider may offer dubbing, subtitles, translations, or other presentation options.

- Mark `language` verified only when the current official provider source clearly supports the primary taught language, for example with an explicit `Taught in English` statement.
- Additional available languages, AI dubbing, subtitles, or translated presentation options should be documented in source metadata/provenance when useful, but they do not change the meaning of the current single `language` field.
- Do not overload `language` with a list of every available presentation language.
- Do not expand the runtime schema solely for an isolated multi-language case. If repeated user/product need emerges, consider a separate initiative for fields such as `availableLanguages`, audio languages, or subtitle languages.

## Mobile UX

Mobile is a first-class product surface, not a compressed desktop layout.

- Primary actions need comfortable touch targets.
- Long course titles must not break layout.
- Persistent compare UI must not obscure important page content.
- Filters and course options should appear before secondary educational context on skill pages.

## Visual Direction

Visual polish should feel clear, restrained, and premium through hierarchy, whitespace, typography, and component consistency.

Do not copy another company's interface, branding, proprietary assets, or distinctive trade dress. Avoid visual novelty that reduces decision clarity.

## SEO

SEO exists to bring qualified users into useful decision experiences.

- Avoid thin pages created only for keyword coverage.
- Do not generate unsupported claims for search traffic.
- Preserve canonical metadata and internal linking foundations.
- Regenerate SEO output only when relevant inputs change.

## Monetization

Monetization is Phase 2, not a current implementation target.

When it begins:

- Only real, auditable affiliate/referral programs may be used.
- Disclosure must be clear.
- Official provider URLs should remain available as fallback.
- No paid ranking or fake discounts.
- Monetization must not weaken data honesty or comparison neutrality.

See `docs/external-links-and-future-monetization.md` for detailed rules.

## Recommendation and Ranking

Recommendation is a later phase and must be based on explicit criteria and real signals.

Until then:

- No "best course" engine.
- No opaque scores.
- No ranking claims that imply evidence the product does not have.

## Architecture

Prefer the simplest implementation that supports the current product phase.

Do not add a database, admin panel, pipeline platform, account system, or broad dependency layer merely because it may be useful later.
