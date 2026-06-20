# Tasks: Portable Path Resolution (`pathFix`) — verify-only

**Feature**: `006-path-resolution` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

> Verify-only: `pathFix` is correct; no `script.js` change.

- [X] T001 Inspect `pathFix`; confirm root-absolute → `/..`-prefixed string (one per depth segment), non-`/` →
  unchanged + error log; no dead code.
- [X] T002 [US1] Verify on real `index.html` (depth → one `/..`): `pathFix('/images/x')` resolves to `/images/x`
  (SC-001).
- [X] T003 [US1] Verify on real `menu/` (depth → two `/..`): `pathFix('/images/x')` resolves to `/images/x`
  (SC-001, FR-002 depth scaling).
- [X] T004 [US2] Verify non-root input: `pathFix('relative/x')` returns input unchanged, error logged, no throw
  (SC-002, FR-003).
- [X] T005 Record results in `verification/results.md`; commit + merge to sdd.

## Total: 5 tasks (verify-only; no code change — SC-003)
