# Tasks: Navigation & Homepage Bootstrap (verify-only)

**Feature**: `004-nav-bootstrap` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

> Verify-only: all behaviors correct, no bug/dead code. No `script.js` change.

- [X] T001 Inspect `openFunc`/`switchDisp`/`buttonPopupGen`/`scrollFunction`; check the two suspicious spots
  (border-radius `"0"` vs `"0px"`; global `onscroll` needing nav elements). Both proved safe → no refactor.
- [X] T002 [US2] Verify `switchDisp` toggles `#mobileNav` (unset→block→none) on the real homepage (SC-002).
- [X] T003 [US3] Verify `buttonPopupGen` toggles `#buttonPopup` (none↔block) and `#orderButton` corner radius
  stays in sync over 3 activations: open→`0px` squared, closed→`16px` rounded (SC-003, FR-004).
- [X] T004 [US4] Verify `scrollFunction` both branches: scrolled→navbar `10px 0 0` + logo 90px; top→`22px 0 8px`
  + logo 100px; no throw (SC-004, FR-005).
- [X] T005 [US1] Cross-page scroll-safety: confirm `#navbar/#left/#right/#navIcon` exist and `scrollFunction`
  does not throw on the menu page too (FR-006). Bootstrap dispatch (carousel + hours) confirmed on load (SC-001).
- [X] T006 Record results in `verification/results.md`; commit + merge to sdd.

## Total: 6 tasks (verify-only; no code change — SC-004)
