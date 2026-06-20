# Implementation Plan: Navigation & Homepage Bootstrap

**Branch**: `004-nav-bootstrap` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Document and verify the homepage bootstrap (`openFunc`) and the shared nav interactions (`switchDisp`,
`buttonPopupGen`, `scrollFunction`). All four were verified empirically and are correct — including two things
that looked risky on inspection but proved fine: (a) `buttonPopupGen` sets the corner radius to `"0"` but
compares against `"0px"` — the browser normalizes `"0"`→`"0px"` on readback, so the open/closed corner state
stays in sync; (b) `scrollFunction` is wired globally via `window.onscroll`, but the `#navbar/#left/#right/#navIcon`
elements it needs exist on inner pages (verified on the menu page) as well as the homepage, so it never throws.
No bug, no dead code → **verify-only**, no code change (Constitution Principle II).

## Technical Context

**Language/Version**: Vanilla JS, HTML5. Zero build.
**Primary Dependencies**: nav markup (`#navbar`, `#left`, `#right`, `#navIcon`, `#mobileNav`, `#buttonPopup`,
`#orderButton`); shared across homepage + inner pages.
**Testing**: Headless Chromium (Claude Preview MCP) on real `index.html` (and `menu/` for the scroll-safety
cross-page check): toggle assertions + scroll state both branches. No unit-test framework.
**Project Type**: Static multi-page site.
**Constraints**: Verify-only; no behavior change.

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build | ✅ | No changes/tooling. |
| II. Behavior-Anchored | ✅ | Verify-only; current behavior is the oracle, asserted on real pages. |
| III. Data-Driven | ✅ (n/a) | No external sheet. |
| IV. Multilingual Parity | ✅ (n/a) | Nav toggles are language-independent; `openFunc` sets the language for the delegated subsystems. |
| V. Portable Paths & DOM Contract | ✅ | Documents the nav id contract and its cross-page presence (scroll safety). |

**Gate: PASS.**

## Approach

No code edit. Verified on the live pages: bootstrap dispatch (carousel + hours populate), mobile-nav toggle,
order-popup toggle with synced corner rounding (3+ activations), navbar/logo shrink on scroll and restore at
top, and no scroll error on the homepage or menu page. Documented the normalization reliance and the cross-page
id contract so future edits don't regress them.

## Complexity Tracking

> No violations. Intentionally empty.
