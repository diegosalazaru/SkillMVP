# Current State

Last updated after the Decision-focused Visual Polish merge on 2026-08-17.

## Product State

Skills Compare is an advanced MVP with the core Search -> Compare -> Decide journey implemented.

The current UI is English-first. The product supports skill discovery, curated course listings, course details, selection of up to two courses, persistent compare selection, side-by-side decision support, and outbound links to official provider pages.

The core journey now has a more deliberate visual hierarchy across mobile and desktop, with stronger spacing, typography, component rhythm, and emphasis on decision actions.

## Latest Completed Initiative

**Decision-focused Visual Polish** — merged in PR #78.

Key outcomes:

- Home/search hierarchy is stronger and the Search -> Compare -> Decide flow is more explicit.
- Shared layout, spacing, typography, and visual rhythm are more consistent.
- Skill pages, filters, and course cards have clearer decision hierarchy.
- Compare remains the primary action on course cards and is more visually prominent.
- The persistent compare bar has stronger contrast and clearer action emphasis.
- Compare pages give greater visual weight to the deterministic decision summary and comparison criteria.
- Course detail pages have clearer hierarchy between provider actions, compare actions, decision support, and factual details.
- Mobile and desktop browser checks passed without overflow, overlays, or console errors during the initiative.
- No dependencies, catalog data, SEO scope, monetization, ranking, recommendation, or provider-strategy changes were introduced.

The prior **Mobile Selection and Discovery UX** initiative remains in place, including versioned 24-hour compare persistence, returning-selection messaging, global compare selection, mobile usability improvements, and clearer decision-page ordering.

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

No new product implementation initiative is currently approved.

Coding agents must not start another visual, SEO, data, monetization, recommendation, infrastructure, or catalog-expansion initiative based only on prior roadmap ideas. The next initiative must be explicitly approved after product review and then recorded here before implementation begins.

## Parallel Ongoing Work

Phase 1 data verification may continue only in small, explicitly approved and auditable batches. SEO expansion follows after the core experience remains stable. Monetization remains gated behind a real program and disclosure design.

## Operational Note

The canonical repository is `diegosalazaru/SkillMVP`. Local coding work should use a repository outside OneDrive-protected folders to avoid filesystem placeholder and controlled-folder issues encountered previously.
