# Feature Specification: Events Page (intentionally not-live)

**Feature Branch**: `014-events-page` | **Created**: 2026-06-19 | **Status**: Draft (documentation-only)

**Input**: Reverse-spec the events page (`events/index.html` + `eventsBuilder.js`). Per the owner decision, the
events feature is **left dead** (not wired); this spec documents the current state and the known gaps, with no
code change.

> Behavior-anchored, **documentation-only** spec (Constitution Principle II). No code is changed. This records
> the current observable state and the deferred items so they are tracked, not silently forgotten.

## Current State (observed)

- `events/index.html` loads `script.js`, jQuery, and `form.js`, but **not** `eventsBuilder.js` and **not** Papa
  Parse. The page renders the shared nav/header and an **empty `#eventList`** container — a visitor sees the
  header and no events.
- `eventsBuilder.js` exists in the repo and is a CSV/Papa-Parse-driven events renderer (analogous to the menu
  builder), but it is never loaded, so it has no effect in production.
- The EN→ES translate link points to `../es/eventos`, which does not exist (404); the mobile translate link
  points to `../es/menu`.

## Decision (owner, 2026-06-19)

**Leave the events feature dead.** Do not wire `eventsBuilder.js`. The events page remains a header-only page
with an empty event list until the owner chooses to launch it.

## Requirements *(mandatory)*

- **FR-001**: The events page MUST render the shared site navigation/header (this works today).
- **FR-002** *(documented current state)*: The events listing is NOT live — `#eventList` is intentionally empty
  because `eventsBuilder.js` is not loaded. No code change is made to enable it.

## Success Criteria *(mandatory)*

- **SC-001**: The events page shows the nav/header with an empty event list (matches current behavior).
- **SC-002**: No behavior change is introduced by this spec (documentation-only).

## Deferred / Flagged (revisit if the events feature is launched)

- **Wire the builder**: add the vendored Papa Parse + `eventsBuilder.js` to `events/index.html` (mirroring the
  menu page) to make the listing live.
- **404 translate link**: `../es/eventos` does not exist — create the Spanish events page or repoint the link.
- **Klingon (lang 3)**: `eventsBuilder.js` has no `_tlh` columns/arrays and falls through to the Old-English
  branch — add Klingon support if launched (adopt the menu builder's `LANG_SUFFIX` pattern).

## Assumptions

- This is a documentation pass: the current dead state is the recorded behavior; the above are tracked TODOs for
  a future launch decision, not changes made now.
