# Tasks: Hours & Open-Status Indicator

**Feature**: `002-hours-open-status` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

> Oracle note: legacy CRASHES on Thu–Sat, so the oracle is the spec truth table (asserted directly), not a
> legacy diff. Legacy is the oracle only for the Sun–Wed paths (must stay unchanged).

## Phase 1: Harness (build before editing script.js)

- [X] T001 Create `specs/002-hours-open-status/verification/harness.html`: stub `window.Date` to a fixed
  `?y&mo&d&h` (non-seasonal), provide `#navIcon` + `#sun-wed` + `#thur-sat` + `#isOpen` (default "Closed"),
  load `/script.js`, set `lang` from `?lang=N`, call `daySelect()` in try/catch, and expose
  `window.probe()` → `{ underlined, isOpenText, threw, err }`.
- [X] T002 Sanity-check the harness against the **legacy** script: a Sun–Wed in-hours case underlines `#sun-wed`
  and sets `#isOpen` to the open label; a Thu–Sat case reports `threw:true` (documents the legacy bug).

## Phase 2: Capture legacy baseline (Sun–Wed oracle)

- [X] T003 With legacy `script.js`, record `probe()` for the Sun–Wed matrix (days 0–3 × an open hour + a closed
  hour × lang 0) and the Thu–Sat `threw:true` evidence → `verification/results.md`.

## Phase 3: Apply the fix [US1][US2][US3]

- [X] T004 [US1] In `script.js` `daySelect`, change `getElementById("thurs-sat")` → `getElementById("thur-sat")`
  (FR-005). One character; matches all 4 homepage variants.
- [X] T005 In `script.js` `untilClose`, remove the unused `let min = d.getMinutes();` (dead variable).

## Phase 4: Verify corrected behavior [US1][US2][US3]

- [X] T006 [US1] Run the matrix days 0–6 × {open hour, closed hour}: assert correct row underlined and **no
  throw on any day** (SC-001). Confirm Sun–Wed results equal the legacy baseline (SC-004).
- [X] T007 [US3] Run an open-hours case for lang 0/1/2/3: assert `#isOpen` = Open/Abierto/Openede/poSmoHta'
  respectively (SC-003).
- [X] T008 [US2] Confirm open/closed boundaries: open at hr 11 and at the closing hour (20 Sun–Wed / 21 Thu–Sat),
  closed at hr 10 and hr 22 (SC-002). Record all in `verification/results.md`.

## Phase 5: Live smoke + commit

- [X] T009 [US1][US2] Load the real `index.html` in headless Chromium (real `Date`, today) and confirm: no
  console error, the correct row for today is underlined, indicator correct for now. (Today is a Friday per the
  session date 2026-06-19 → exercises the FIXED Thu–Sat path live.)
- [X] T010 Final commit: `refactor(002): fix Thu-Sat hours crash (thur-sat id) + drop dead var — verified all 7 days`.

## Dependencies

Phase 1 → 2 (legacy oracle) → 3 (fix) → 4 (verify) → 5 (smoke+commit). T004 must not precede T003 (legacy
baseline). T005 is independent cleanup, bundled with T004.

## Total: 10 tasks
