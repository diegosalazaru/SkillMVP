# Core Interaction Model

## Purpose

Define the current interaction rules for course selection and comparison so UI changes remain consistent across skill, detail, and compare pages.

## Core Objects

The user primarily interacts with:

- **Skill** — the discovery entry point.
- **Course** — the decision option.
- **Compare selection** — an ordered set of up to two course IDs.

## Selection Model

- `selectedIds` is an ordered array.
- The active product limit is two courses.
- Selecting a third course must not silently replace an existing course.
- The UI should explain the limit and provide an obvious clear/remove action.
- Selection persists in `localStorage` as a versioned object with an `updatedAt` timestamp.
- Persisted selection expires after 24 hours.
- Legacy, malformed, future-dated, or stale stored selection should be cleared instead of restored.
- A recently restored selection must be surfaced to the user as a returning selection rather than appearing silently.

## Compare Rules

- Comparison is enabled only when exactly two valid course IDs are selected.
- Compare URLs should contain at most the intended two course IDs.
- The compare page should not show the persistent compare bar because the user is already in the comparison destination.
- Changing courses should preserve a clear route back to discovery rather than trapping the user in the compare page.

## Cross-Skill Selection

A user may navigate from one skill to another with a two-course selection already stored.

When both selected courses belong to another skill:

- Do not silently discard the selection.
- Explain that two courses from another skill are selected.
- Provide a prominent clear-selection action.
- Do not allow a confusing third-course selection attempt to replace the pair.

## Empty and Limit States

- Invalid skill: show a clear message and route back to discovery.
- Valid skill with no filtered results: suggest adjusting or clearing filters.
- Compare with fewer than two valid courses: explain that two selections are required and route back to choose courses.
- Selection at limit: explain why another course cannot be added and provide clear/remove controls.

## UX Guardrails

- Compare is the primary action on course cards.
- Course details are secondary.
- Provider outbound actions are tertiary during discovery.
- Persistent compare UI must not cover meaningful page content.
- Course titles must truncate or wrap safely on narrow screens.
- Buttons and controls should remain comfortable touch targets on mobile.
- Selection state must be visible through text/state, not color alone.

## Future

Any move beyond two-course comparison, introduction of accounts/server-side persistence, or change to the 24-hour persistence model is a product decision and should not be implemented opportunistically.
