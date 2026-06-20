# Implementation Plan: Portable Path Resolution (`pathFix`)

**Branch**: `006-path-resolution` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Document and verify the `pathFix` utility. It prepends one `/..` per directory segment of the current page to a
root-absolute path; the resulting `/../…/X` string resolves (browser-clamped) to the site-root path `/X` at any
depth. Non-`/` inputs are returned unchanged with an error log. Verified correct at two depths — **verify-only**,
no code change (Constitution Principle II).

## Technical Context

**Language/Version**: Vanilla JS. Zero build.
**Primary Dependencies**: `window.location.pathname` (depth source). Pure function otherwise.
**Testing**: Headless Chromium (Claude Preview MCP) on real `index.html` and `menu/`: call `pathFix` and resolve
the result via the URL API to confirm it lands on the site-root path; check the non-`/` branch. No unit-test
framework.
**Project Type**: Static multi-page site.
**Constraints**: Verify-only; no behavior change.

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build | ✅ | No change/tooling. |
| II. Behavior-Anchored | ✅ | Verify-only; current behavior is the oracle. |
| III. Data-Driven | ✅ (n/a) | Pure path util. |
| IV. Multilingual Parity | ✅ (n/a) | Language-independent. |
| V. Portable Paths & DOM Contract | ✅ | This util **is** the Principle V mechanism; its contract is now documented. |

**Gate: PASS.**

## Approach

No code edit. Verified `pathFix('/images/x')` resolves to `/images/x` from the homepage (one `/..`) and `menu/`
(two `/..`), and that `pathFix('relative/x')` returns the input unchanged with an error log. Flagged the inline
duplicate of this logic in the menu `addImg` for a future consolidation decision (not changed here).

## Complexity Tracking

> No violations. Intentionally empty.
