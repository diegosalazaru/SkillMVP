# MVP Readiness

## Current State

- Skills Compare is an English-first product for finding skills, reviewing relevant online courses, comparing two options, and opening the original provider page.
- Phase 0 is complete for the current MVP scope.
- Phase 1 is complete for the current 19-course curated MVP catalog and now continues as data-quality maintenance rather than a blocking execution phase.
- Phase 2 monetization is gated until a real auditable affiliate/referral program exists and does not block Phase 3.
- Phase 3 Discovery and SEO is active.
- The normalized catalog contains 19 curated courses.
- 17 courses are `partially_verified`; 2 remain `pending` because the exact recorded offering could not be confirmed from a current official source.
- Source URL mismatches are 0 after Phase 1 Source Verification — Coverage Batch B.
- Generated SEO pages, sitemap support, and internal SEO links are present as an initial foundation, but the current generated SEO surface is not treated as automatically index-worthy.
- Provider CTA copy and external-link disclosure copy are centralized.
- Provider URLs are direct official provider URLs only.
- Outbound tracking is local-only and does not send data to an external analytics vendor.
- A data quality report is available with `corepack pnpm report:data-quality` and includes verification-status counts, verified-field coverage, fully pending courses, partially verified courses, and unknown field counts.
- Mobile Selection and Discovery UX is merged: compare selection persists for up to 24 hours, returning selections are surfaced, and the compare bar is available globally outside the compare page.
- Decision-focused visual polish is merged across the core Search -> Compare -> Decide journey.

## Trust and Data Quality Reality

- Phase 1 manual verification reviewed the full 19-course curated catalog at least at the record level.
- Verification remains conservative and can be partial when a current official page does not support a field.
- Stable fields such as title, platform/source URL, level, primary taught language, certificate visibility, workload/duration signals, learning topics, and prerequisites are marked verified only when clearly supported.
- Prices, ratings, review counts, and some durations remain unverified or unknown by design.
- Monthly or weekly workload estimates are not converted into invented exact `durationHours`; those values remain null unless the official source provides a sufficiently exact total.
- The normalized `language` field represents the primary taught language when clearly supported. Additional dubbing, subtitle, translation, or language availability remains provenance context unless a future explicit schema initiative expands the model.
- `introduction-cyber-security-nyux-edx` remains pending because the recorded edX page is unavailable and no current official page clearly represents the exact same NYUx offering.
- `data-analytics-essentials-cisco` remains pending because the recorded Coursera listing is unavailable and Cisco's current instructor-led offering does not establish that it is the same listing.
- Unknown data must remain null, unknown, pending, or explicitly unverified.
- Users should verify final pricing, duration, certificate terms, enrollment details, and availability on the provider page before deciding.

## What Works

- Users can search for a skill and land on skill-specific course pages.
- Skill pages show available courses from the normalized catalog.
- Course cards expose core decision facts and prioritize compare selection over outbound provider clicks.
- Course detail pages are decision-support pages with fit framing, verify-before-enrolling checks, provider CTA, compare action, learning content, and key facts.
- Compare supports two-course comparison with deterministic decision summary, verification risks, fit context, deep comparison details, checklist, and outbound provider CTAs.
- The compare page uses mobile-friendly stacked content instead of relying on a cramped desktop table.
- Compare selection persists across navigation and recent visits for up to 24 hours, with an explicit returning-selection state and clear action.
- Canonical and Open Graph metadata foundations are present for core pages.
- Data validation runs with `corepack pnpm validate:data`.
- Production build runs with `corepack pnpm build`.

## What Is Not Implemented

- No affiliate program is implemented.
- No affiliate links or fake affiliate links are present.
- No external ads are implemented beyond reserved placeholder behavior.
- No verified rankings or recommendation algorithm exists.
- No "best course" recommendation engine exists; comparison copy must stay tied to explicit, factual criteria.
- No outcome, employment, partnership, or provider endorsement claims should be made.
- No user accounts, cookies, database, scraping, external APIs, or new analytics vendors are implemented.

## Phase 3 Foundation Reality

Repository review before the first Phase 3 batch found:

- Canonical skill pages already generate page metadata and self-referencing canonical URLs.
- Canonical course detail pages already generate page metadata and self-referencing canonical URLs.
- The current sitemap includes the homepage, `/compare`, and every generated SEO page, but does not currently include the canonical skill/course decision surfaces.
- The generated SEO system creates several intent variants per configured skill from shared course lists and mostly reusable template intros/FAQ copy.

The first Phase 3 initiative therefore focuses on indexable-surface quality rather than generating more pages.

## Validation Workflow

Run these before opening or updating a normal product PR:

- `corepack pnpm validate:data`
- `corepack pnpm report:data-quality`
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm build`

Use the documented repository-local TypeScript fallback only when the normal pnpm command fails solely because Windows cannot resolve the local `tsc` executable. Run `corepack pnpm generate:seo` only when SEO generation inputs actually change. Do not initialize ESLint configuration just to run lint; `next lint` may currently prompt for setup.

## Active Near-Term Initiative

**Phase 3 Discovery/SEO — Indexable Surface Foundation (Batch A)** is approved in `docs/CURRENT_STATE.md`.

The implementation should make the sitemap and indexing directives favor useful canonical skill/course decision pages, stop actively promoting the generic generated SEO variants for indexing, and avoid adding any new SEO page volume.

After this batch, return to product review before strengthening or creating any additional skill/intent pages. Phase 2 monetization remains gated until a real program exists and is not a prerequisite for this work.
