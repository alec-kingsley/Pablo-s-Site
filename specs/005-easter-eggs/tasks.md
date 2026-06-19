# Tasks: Logo Easter-Egg Splash Text

**Feature**: `005-easter-eggs` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

> One-digit bug fix (FR-004) + verify. Everyday rotation unchanged.

- [X] T001 Inspect `easterEgg`/`randomSplash`/`randSplash`; confirm the everyday set is a 12-item no-repeat
  permutation; confirm the legacy month mismatch (Halloween messages gated on September `== 8`, while
  decorations use October `== 9`).
- [X] T002 [US1] Verify the everyday rotation: `randomSplash()` (non-seasonal month) returns 12 unique messages
  (SC-001).
- [X] T003 [US2] Apply FR-004 fix in `script.js` `randomSplash`: `getMonth() == 8` → `== 9` (align with the
  October decorations).
- [X] T004 [US2] Verify post-fix: October → 16 messages incl. Halloween; September & November → 12, no
  Halloween (SC-002).
- [X] T005 Record results in `verification/results.md`; commit + merge to sdd.

## Total: 5 tasks (1 one-digit fix + verify)
