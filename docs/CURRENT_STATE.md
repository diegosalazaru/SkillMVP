# Current State

Last updated after the Mobile Selection and Discovery UX merge on 2026-08-17.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

## Latest Completed Initiative

**Mobile Selection and Discovery UX** — merged in PR #76.

Key outcomes:

- Compare selection persists with a versioned timestamp and 24-hour expiry.
- Returning selections are surfaced rather than silently restored.
- Compare selection is available globally through a persistent mobile-friendly compare bar.
- Skill pages prioritize filters and course discovery before secondary explanatory content.
- Course cards make Compare the primary action, Details secondary, and Provider tertiary.
- Compare pages surface decision summary, provider actions, verification risk, comparison details, fit context, and final checks in a clearer order.
- Course detail pages reduce duplicated warnings and improve mobile actions.
- Search, filters, blog pages, and SEO course lists received mobile usability improvements.

## Catalog and Trust State

- The normalized catalog contains 19 curated courses.
- Source metadata and verification status exist.
- Seven priority courses are currently marked `partially_verified`.
- Most pricing, ratings, review counts, and some duration values remain unknown or unverified.
- `report:data-quality` is available and should remain part of normal validation.
- Official provider pages remain the final source users should verify before enrollment.

See `docs/MVP_READINESS.md` and `docs/catalog-phase-1.md` for deeper data-quality details.

## Current Product Constraints

Not implemented:

- Affiliate/referral monetization.
- External advertising.
- Paid placement.
- Ranking or recommendation engine.
- User accounts.
- Database-backed catalog.
- Scraping or provider APIs.
- External analytics vendor for outbound tracking.

These are intentional roadmap constraints, not missing requirements to fill opportunistically.

## Next Approved Product Initiative

**Decision-focused Visual Polish.**

Objective: make the core experience feel more coherent, premium, and deliberate without changing product scope.

Direction:

- Stronger whitespace and hierarchy.
- More consistent typography and component rhythm.
- Cleaner visual emphasis on the primary decision action.
- Mobile and desktop polish together.
- Inspiration may come from high-quality product interfaces, including Apple's use of whitespace and hierarchy, but no visual copying or brand imitation.
- Avoid introducing a broad design system or new dependency unless a concrete need justifies it.

## Parallel Ongoing Work

Phase 1 data verification should continue in small, auditable batches. SEO expansion follows after the core experience remains stable. Monetization remains gated behind a real program and disclosure design.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
