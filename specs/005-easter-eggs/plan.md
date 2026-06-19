# Implementation Plan: Logo Easter-Egg Splash Text

**Branch**: `005-easter-eggs` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Document and verify the logo double-click splash-text easter egg (`easterEgg`/`randomSplash`/`randSplash`), and
fix one confirmed bug: the Halloween-themed splash messages were gated on **September** (`getMonth() == 8`) while
the site's Halloween decorations fire in **October** (`getMonth() == 9` in `halloween()`), so the spooky
messages (which read "this month only") appeared a month before the decorations and never alongside them. Fix =
one digit (`8` → `9`); no other behavior changes. The everyday rotation is unchanged.

## Technical Context

**Language/Version**: Vanilla JS. Zero build.
**Primary Dependencies**: shared nav logo element (`#navIcon`); `randSplash` global; `alert`.
**Testing**: Headless Chromium (Claude Preview MCP) on real `index.html`: call `randomSplash()` with the date
stubbed to Sept/Oct/Nov and assert the seasonal set; assert the everyday set is a 12-item no-repeat permutation.
(The double-click handler itself uses a blocking `alert`, so it is not auto-triggered; the rotation function is
verified directly.)
**Project Type**: Static multi-page site.
**Constraints**: Only FR-004 changes behavior (one digit); everyday rotation byte-stable.

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build | ✅ | One-digit source change; no tooling. |
| II. Behavior-Anchored | ✅ | Current-state spec, ONE documented deviation (FR-004); corrected behavior is the oracle for the seasonal branch. |
| III. Data-Driven | ✅ (n/a) | Splash messages are inline content, not sheet-driven. |
| IV. Multilingual Parity | ⚠ noted | The splash messages are English-only in all languages (legacy behavior). Out of scope to translate here; recorded as an existing gap, not introduced by this feature. |
| V. Portable Paths & DOM Contract | ✅ | Uses the shared `#navIcon` logo; no path/id changes. |

**Gate: PASS** (the Principle IV note is a pre-existing, out-of-scope observation, not a new violation).

## Approach

1. Verify the everyday rotation (12 unique messages, permutation) and confirm the legacy month mismatch
   (Halloween messages in September, not October).
2. Apply the one-digit fix (`8`→`9`).
3. Verify post-fix: October includes Halloween messages (16), September/November do not (12).

Note: `popUpGen` (defined in `script.js`, duplicated in `surveyBuilder.js`, used by `form.js`) is deferred to
the form/popup subsystem — not part of this easter egg.

## Complexity Tracking

> No violations. Intentionally empty.
