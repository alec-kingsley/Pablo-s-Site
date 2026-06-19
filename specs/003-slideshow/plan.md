# Implementation Plan: Homepage Image Slideshow

**Branch**: `003-slideshow` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Document and verify the homepage 3-up image carousel (`setSlide`/`addSlides`/`loopSlide` in `script.js`). On
inspection the code is clean — `.demo` and `.column` collections have equal counts (6), navigation/wraparound
indices are correct, there is no dead code and no console noise. Therefore this is a **verify-only** feature
(Constitution Principle II allows "implementation already satisfies the spec"): no code change is made; the
current behavior is captured as the spec and confirmed against the real homepage.

## Technical Context

**Language/Version**: Vanilla JS, HTML5. Zero build.
**Primary Dependencies**: homepage slideshow markup (`#lSlide`/`#mSlide`/`#rSlide`, `#caption`, `.demo`/`.column`).
No external sheet — photos are static markup.
**Testing**: Headless Chromium (Claude Preview MCP) directly on the real `index.html`: assert initial state,
next/prev wraparound, thumbnail jumps, and the single-active-thumbnail invariant. No unit-test framework.
**Project Type**: Static multi-page site.
**Constraints**: No behavior change (verify-only).

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build | ✅ | No tooling/changes. |
| II. Behavior-Anchored | ✅ | Verify-only; current render is the oracle, asserted on the real page. |
| III. Data-Driven | ✅ (n/a) | Photos are static markup, not sheet-driven. |
| IV. Multilingual Parity | ✅ (n/a) | Captions come from the photos' alt text; no per-language carousel logic. |
| V. Portable Paths & DOM Contract | ✅ | Documents the `#lSlide`/`#mSlide`/`#rSlide`/`#caption` + `.demo`/`.column` contract, incl. the equal-count requirement. |

**Gate: PASS.** No violations.

## Approach

No code edit. Verify on the real homepage that the documented behavior holds; record results. If a future
photo edit ever makes `.demo` and `.column` counts diverge, that would break the carousel — recorded as a
contract in the spec so it is not violated silently.

## Complexity Tracking

> No violations. Intentionally empty.
