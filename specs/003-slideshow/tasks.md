# Tasks: Homepage Image Slideshow (verify-only)

**Feature**: `003-slideshow` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

> Verify-only: the carousel code is already correct (no bug, no dead code). No `script.js` change. Tasks confirm
> the implementation matches the spec on the real homepage.

- [X] T001 Inspect `setSlide`/`addSlides`/`loopSlide` + the slideshow markup; confirm `.demo` and `.column`
  counts match (6) and there is no dead code or console noise → no refactor warranted.
- [X] T002 [US1] Verify initial state on real `index.html`: middle=first photo, left=last, right=second,
  caption=first photo's alt, thumbnail 0 active (SC-001).
- [X] T003 [US2] Verify next/prev move by one with wraparound at both ends (prev-from-first→last,
  next-from-last→first) (SC-002).
- [X] T004 [US3] Verify thumbnail jumps (setSlide(n)→n-th photo) and the single-active-thumbnail invariant
  (exactly one active throughout) (SC-003, FR-005).
- [X] T005 Record results in `verification/results.md`; confirm zero console errors; commit + merge to sdd.

## Total: 5 tasks (verify-only; no code change — SC-004)
