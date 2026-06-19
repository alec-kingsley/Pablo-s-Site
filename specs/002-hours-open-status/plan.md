# Implementation Plan: Hours & Open-Status Indicator

**Branch**: `002-hours-open-status` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Correct and verify the homepage hours/open-status routine (`daySelect` + `untilClose` in `script.js`). The only
intentional behavior change is the documented bug fix (FR-005): `script.js` looks up the Thursday–Saturday row
as `"thurs-sat"`, but every homepage variant (`index.html`, `es/`, `ang/`, `tlh/`) declares it `id="thur-sat"`,
so Thu–Sat threw a `TypeError` and aborted both the underline and the open-status update. Fix = one character in
one file (`"thurs-sat"` → `"thur-sat"`); no CSS or other code references either id, and this single change fixes
all four language homepages. A small dead-variable cleanup (`let min` in `untilClose`, never read) is included.

Because legacy **crashes** on the Thu–Sat path, legacy cannot be the oracle there. The oracle is the spec's
intended truth table, asserted directly across all 7 days × representative hours × 4 languages, with the hard
requirement of **zero JS errors on every day** (SC-001). The Sun–Wed paths (which legacy handled) must remain
unchanged.

## Technical Context

**Language/Version**: Vanilla JS (ES5/ES6 as present), HTML5. Zero build.
**Primary Dependencies**: shared `lang` global; homepage hours markup (`#sun-wed`, `#thur-sat`, `#isOpen`).
**Testing**: Headless Chromium (Claude Preview MCP) + Python `http.server`; a harness that stubs `Date` and the
minimal DOM, calls `daySelect()` directly, and asserts the row underline, `#isOpen` text, and no-throw, for a
day×hour×language matrix. No unit-test framework (zero-build constitution).
**Target Platform**: Evergreen browsers; static GitHub Pages / Replit.
**Project Type**: Static multi-page site (repo root).
**Constraints**: Only FR-005 + dead-var cleanup change behavior/observable code; Sun–Wed behavior byte-stable.

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build Static Delivery | ✅ | No tooling added; harness is dev-only. |
| II. Behavior-Anchored Specification | ✅ | Current-state spec with ONE explicit, documented deviation (FR-005) per the bug-fix policy; corrected behavior is the oracle. |
| III. Data-Driven Content | ✅ (n/a) | No external sheet; hours are static markup. |
| IV. Multilingual Parity | ✅ | Open label verified in all 4 languages; the fix repairs the indicator for non-English homepages too. |
| V. Portable Paths & DOM Contract | ✅ | Fix *aligns* the JS↔markup id contract (`#thur-sat`); documented in the contract artifact. |

**Gate: PASS.** No violations → Complexity Tracking empty.

## Project Structure

```text
specs/002-hours-open-status/
├── plan.md · spec.md · tasks.md · checklists/requirements.md
└── verification/
    ├── harness.html        # stubs Date + minimal homepage DOM; loads script.js; calls daySelect()
    └── results.md          # recorded truth-table matrix (day × hour × lang) + no-throw per day

script.js                   # FR-005 fix (thurs-sat → thur-sat) + remove unused `min`
index.html, es/, ang/, tlh/ # unchanged (already correct id="thur-sat")
```

**Structure Decision**: Single-project static site. The fix touches only `script.js`. The four homepage HTML
variants already have the correct id and are not modified.

## Approach

1. **Harness first**: stub `Date` to a controlled (non-seasonal) date so `birthday()`/`halloween()` never fire,
   provide `#navIcon` (so `script.js`'s top-level `easterEgg()` doesn't throw), `#sun-wed`, `#thur-sat`,
   `#isOpen`, load `script.js`, set `lang`, call `daySelect()` inside try/catch, and report
   `{underlined, isOpenText, threw}`.
2. **Capture legacy** on the Sun–Wed paths (oracle for the unchanged half) and **record that legacy throws on
   Thu–Sat** (documents the bug).
3. **Apply the fix** (`"thurs-sat"` → `"thur-sat"`) and remove the unused `min`.
4. **Verify** the full matrix against the spec truth table: correct row underlined, correct `#isOpen` per
   language, and **no throw on any of the 7 days** (SC-001). Sun–Wed results identical to legacy (SC-004).

## Complexity Tracking

> No constitution violations. Section intentionally empty.
