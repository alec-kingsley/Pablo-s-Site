# Tasks: Menu Rendering Subsystem (Behavior-Preserving Refactor)

**Feature**: `001-menu-rendering` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

**Input**: plan.md, spec.md, data-model.md, contracts/menu-render-contract.md, research.md, quickstart.md

> **Hard ordering rule (from the plan): the LEGACY oracle must exist before `menuBuilder.js` is touched.**
> Phase 3 (capture legacy snapshots) is a blocking gate. No task in Phase 4 may run until Phase 3 is green.

**Tests**: No unit-test framework is introduced (zero-build constitution). The "test" is the deterministic
DOM-parity harness, which is itself a required deliverable (Phases 2–3, 5).

**Story coverage map**: The refactor is a single file serving all stories at once. Parity verification covers:
US1 (view menu) + US2 (switch tabs) + US4 (staff-via-sheet) via `lang-0`; US3 (language parity) via
`lang-1/2/3`.

---

## Phase 1: Setup (verification scaffolding)

- [X] T001 Create the verification directory tree at `specs/001-menu-rendering/verification/` with subdirs `fixtures/`, `snapshots/legacy/`, `snapshots/current/`.
- [X] T002 Freeze the live CSV into `specs/001-menu-rendering/verification/fixtures/menu_live.csv` (exact copy of the published export consumed by `menuBuilder.js`).
- [X] T003 [P] Write `specs/001-menu-rendering/verification/README.md` pointing to `quickstart.md` and stating the dev-only, not-served-in-production nature of this directory.

## Phase 2: Foundational — build the deterministic harness (BLOCKING)

**Purpose**: Tooling that renders the builder against the frozen fixture and serializes normalized DOM. Blocks
all snapshot capture.

- [X] T004 Create `specs/001-menu-rendering/verification/harness.html`: load PapaParse (same 5.1.0 source as the page), provide `lang` from `?lang=N` and a verbatim copy of `script.js`'s `setMenu`, include the real `menuBuilder.js` under test, override `sheetUrl` to the **local fixture** (not the live URL), render, and expose `window.serializeMenu()` returning the normalized innerHTML of `#loadMenu`.
- [X] T005 Implement the DOM normalization inside `harness.html` per research.md: trim, collapse whitespace **between** tags to a single newline, leave text-node whitespace untouched.
- [X] T006 [P] Document the headless capture steps in `specs/001-menu-rendering/verification/capture.md` (Claude Preview MCP: navigate `harness.html?lang=0..3`, await `__menuRendered`, read `serializeMenu()`; persist as SHA-256 manifest + in-browser `localStorage` oracle).
- [X] T007 Verify the harness loads the fixture and produces non-empty output for `lang=0` against the **current (still-legacy)** `menuBuilder.js` (sanity check: 3 tabs, loading removed, zero console errors).

## Phase 3: Capture the LEGACY oracle (HARD GATE — must be green before Phase 4)

**Purpose**: Immutable ground truth. ⚠️ `menuBuilder.js` MUST be unmodified during this phase.

- [X] T008 Confirmed `menuBuilder.js` unmodified, then captured the legacy serialization for lang 0/1/2/3 into `localStorage['legacy_lang_N']` and recorded SHA-256+length in `snapshots/legacy/manifest.json`.
- [X] T009 Sanity-checked legacy snapshots vs spec: `lang-0/1/2` = 3 menu tabs, `kli` ABSENT; `lang-3` = 3 tabs, `kli` PRESENT (32×); multi-price/images/first-row-skip confirmed; zero console errors. Recorded in `snapshots/MANIFEST.md`.
- [X] T010 Commit the legacy oracle (`fixtures/`, harness, manifests) so it is preserved before any refactor.

## Phase 4: Apply the four approved safe refactors to `menuBuilder.js` [US1][US2][US3][US4]

**Purpose**: Make the code express the spec while preserving exact output. Apply changes one at a time;
re-diff after each (Phase 5) to localize any regression.

- [X] T011 [US1] Removed the debug `console.log(data)` line from `showInfo`.
- [X] T012 [US1] Declared `Name`, `nameDesc`, `cat`, `catDesc` with `let` (replaced the implicit-global chained assignment); `price` scoped with `let` too.
- [X] T013 [US3] Introduced `const suffix = LANG_SUFFIX[lang]` (`['_en','_es','_ang','_tlh']`) and replaced the `lang==0/1/2/3` field-selection chains in `showInfo` and the colon-continuation loop with `data[row]['name'+suffix]` etc. Continuation **detection** kept on `name_en`.
- [X] T014 [US3] Added `function kli(base){ return lang==3 ? base+' kli' : base }` and applied it to menu buttons, titles, descriptions, items, prices, notes. `addImg`'s standalone `class="kli"` on `<p>` left UNCHANGED (different pattern — verified by snapshot).
- [X] T015 [US1] Re-read full refactored `menuBuilder.js`: DOM ids/classes/tags/order, first-row skip, hidden/empty skip, multi-price composition, `#loading` removal, and `setMenu(0)` default all intact.

## Phase 5: Prove equivalence (empty-diff pass condition) [US1][US2][US3][US4]

- [X] T016 Captured refactored render for lang 0/1/2/3 via the harness (cache-busted `?cb=r1`; `refactoredLoaded=true`). SHA-256 recorded in `snapshots/current/manifest.json`.
- [X] T017 Compared refactored vs legacy by EXACT in-browser string equality (`===`) AND SHA-256, per language. **PASS = all four equal.** Result: lang 0/1/2/3 all `equal:true`, `firstDiff:-1`, hashes identical to the oracle. No revert needed.
- [X] T018 Recorded the parity PASS in `snapshots/current/manifest.json` and `snapshots/MANIFEST.md` referencing SC-002.

## Phase 6: Live-site smoke test & polish

- [X] T019 [US1][US2] Loaded the REAL `menu/index.html` (live sheet) in headless Chromium with the refactored build (`refactoredLoaded=true` after cache refresh): "Loading..." replaced, **Food** shown by default & highlighted (`#d92332`), **Drink**/**Dessert** switch correctly via `setMenu`, zero console errors.
- [X] T020 Run `/speckit-analyze` to cross-check spec ⇄ plan ⇄ tasks ⇄ implementation consistency; resolve any flagged drift.
- [X] T021 Final commit of the refactor + current snapshots.

---

## Dependencies & Execution Order

```
Phase 1 (T001-T003)  →  Phase 2 (T004-T007)  →  Phase 3 GATE (T008-T010)
                                                      │  (menuBuilder.js untouched until here)
                                                      ▼
                         Phase 4 (T011-T015)  →  Phase 5 (T016-T018)  →  Phase 6 (T019-T021)
```

- **Hard gate**: T011 (first edit to `menuBuilder.js`) MUST NOT start until T010 (legacy oracle committed) is done.
- **Within Phase 4**: T011→T012→T013→T014 are sequential (same file); T015 reviews after all four.
- **Parallel [P]**: T003 (README) ∥ fixture work; T006 (capture driver) can be written while T004/T005 harness is built.
- **Re-diff loop**: T016↔T017 iterate until empty diff.

## Independent Test Criteria

- **US1 (view menu)**: `lang-0` legacy vs current diff empty AND live smoke shows Food tab rendered.
- **US2 (switch tabs)**: live smoke confirms Drink/Dessert switch visibility; `setMenu` behavior unchanged in harness shim and page.
- **US3 (language parity)**: `lang-1`, `lang-2`, `lang-3` diffs all empty (suffix-lookup + `kli` helper equivalence).
- **US4 (staff-via-sheet)**: render is driven entirely by the frozen fixture; identical output proves the sheet contract is preserved.

## MVP Scope

Phases 1–5 for `lang-0` constitute the MVP proof (US1/US2/US4). Extending the empty-diff requirement to
`lang-1/2/3` (US3) completes full multilingual parity. Phase 6 is release confidence.

## Total: 21 tasks
- Setup: 3 · Foundational (harness): 4 · Legacy oracle gate: 3 · Refactor: 5 · Parity proof: 3 · Smoke/polish: 3
