# Implementation Plan: Menu Rendering Subsystem

**Branch**: `001-menu-rendering` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-menu-rendering/spec.md`

## Summary

Reconcile `menuBuilder.js` with its current-state specification through a **behavior-preserving
refactor**: the code is rewritten to express the spec's data contract and render rules clearly, while
producing **byte-identical rendered DOM** to the legacy version for all four languages. The legacy render
is the oracle. Correctness is proven, not assumed: a deterministic verification harness renders the builder
against a frozen local copy of the live CSV, serializes the resulting DOM for `lang` 0/1/2/3, captures a
**golden snapshot from the legacy code first**, and then diffs every refactored build against it. The
refactor ships only if the diff is empty.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES5/ES6 as already present in the repo), HTML5, CSS3

**Primary Dependencies**: PapaParse 5.1.0 (CSV parsing, currently loaded via CDN — unchanged this feature);
jQuery 3.2.1 (present on page, not required by the menu render path); shared globals `lang`, `setMenu`,
`pathFix` from `script.js`

**Storage**: External Google Sheets published CSV export (read-only at page load). A frozen copy is vendored
under the feature's fixtures for deterministic verification only — production keeps using the live URL.

**Testing**: Deterministic DOM-snapshot parity harness — Python `http.server` for static serving + a headless
browser (Claude Preview MCP, Chromium) to render and serialize the DOM. No unit-test framework is introduced
(consistent with the zero-build constitution); the harness is plain HTML + JS + a diff step.

**Target Platform**: Modern evergreen browsers; served as static files from GitHub Pages and Replit import.

**Project Type**: Static multi-page website (single project, repository root).

**Performance Goals**: No regression. Menu renders on a single pass over the CSV rows; the refactor must not
add passes or change asymptotic behavior.

**Constraints**: Zero build step. No new runtime dependency. Output DOM (tags, attributes, classes, ids, text,
order) must equal legacy exactly. No change to the CDN-vs-vendored PapaParse situation (deferred per spec).

**Scale/Scope**: One source file (`menuBuilder.js`, ~180 lines) and its rendered output on one page
(`menu/index.html`). Live CSV currently ~104 rows, 3 menu tabs, 4 languages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Zero-Build Static Delivery | ✅ PASS | No build/bundler/package manager introduced. Harness uses Python's stdlib http.server + a headless browser; it is a dev/verification tool, not a shipped runtime dependency. |
| II. Behavior-Anchored Specification | ✅ PASS | This is the canonical case: legacy render captured as a golden oracle *before* editing; refactor accepted only on empty diff. Zero behavior change is the gate. |
| III. Data-Driven Content via External Sheets | ✅ PASS | Render stays sheet-driven; the documented column/sentinel contract is preserved and is restated as a contract artifact. |
| IV. Multilingual Parity | ✅ PASS | All four languages verified independently (one snapshot per `lang`). The suffix-lookup refactor makes parity structural rather than copy-pasted. |
| V. Portable Paths & DOM Contract | ✅ PASS | Every id/class/structure preserved and enumerated in the contract; `pathFix`-equivalent absolute-path handling for images preserved. |

**Initial gate: PASS.** No violations → Complexity Tracking left empty.

**Post-Design re-check (after Phase 1): PASS.** The design adds only a verification harness and equivalent-code
substitutions; it removes no behavior and introduces no new abstraction that needs justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-menu-rendering/
├── plan.md              # This file
├── research.md          # Phase 0 — refactor equivalences + verification methodology
├── data-model.md        # Phase 1 — row/entity model and render-state machine
├── quickstart.md        # Phase 1 — how to run the parity harness
├── contracts/
│   └── menu-render-contract.md   # CSV→DOM contract: columns, sentinels, emitted DOM shape
└── checklists/
    └── requirements.md  # Spec quality checklist (from /speckit-specify)
```

### Source Code (repository root)

```text
menuBuilder.js                 # Target of the behavior-preserving refactor
menu/index.html                # Consumer page (unchanged; provides #loadMenu, #menuButtons, #loading)
script.js                      # Provides shared globals lang, setMenu, pathFix (unchanged)

specs/001-menu-rendering/verification/      # Dev-only parity harness (not linked from the live site)
├── fixtures/
│   └── menu_live.csv           # Frozen copy of the live CSV for deterministic runs
├── harness.html                # Loads PapaParse + menuBuilder under test against the fixture; serializes DOM
├── capture.js                  # Headless-browser driver: render lang 0..3, write snapshots
├── snapshots/
│   ├── legacy/lang-{0..3}.html # Golden oracle captured from legacy menuBuilder.js BEFORE any edit
│   └── current/lang-{0..3}.html# Captured from the refactored build for diffing
└── README.md                   # Pointer to quickstart.md
```

**Structure Decision**: Single-project static site. The refactor touches exactly one runtime file
(`menuBuilder.js`). All verification scaffolding lives under the feature's `specs/.../verification/` directory
so it never affects the deployed site (GitHub Pages serves the repo root; the harness is opt-in and
dev-only). `menu/index.html`, `script.js`, and styling are **not** modified.

## Approach

### Phase A — Establish the oracle (must happen before any code edit)
1. Freeze the live CSV into `verification/fixtures/menu_live.csv`.
2. Build `harness.html`: includes PapaParse + a tiny `setMenu`/`pathFix`-equivalent shim (or the real
   `script.js`), parses the **local fixture** (no network), runs the builder, and exposes a function that
   returns the serialized, normalized innerHTML of the menu container.
3. With the **unmodified legacy `menuBuilder.js`**, render for `lang` 0/1/2/3 and save
   `snapshots/legacy/lang-N.html`. This is the immutable oracle.

### Phase B — Behavior-preserving refactor (only the four safe changes)
1. **Language-suffix lookup**: replace the four repeated `if (lang==0/1/2/3)` blocks (in `showInfo` and in the
   colon-continuation loop) with `const SUFFIX = ['_en','_es','_ang','_tlh'][lang]` and `row['name'+SUFFIX]`,
   etc. Continuation **detection** stays on `name_en` (preserves the documented quirk).
2. **`kli` class helper**: extract `function kli(base){ return lang==3 ? base+' kli' : base }` and use it
   wherever `if (lang==3) setAttribute('class', base+' kli')` appears — emitting the identical class string.
3. **Remove `console.log(data)`** debug line.
4. **Properly scope** the leaked `Name/nameDesc/cat/catDesc` (declare with `let`); behavior unchanged because
   they are reassigned every row before use.

No other edits. DOM element creation order, tag names, attribute order, class names, ids, text assignment, the
first-row skip (`row` starts at 1), hidden/empty skip, multi-price composition, loading-indicator removal, and
`setMenu(0)` default all remain exactly as-is.

### Phase C — Prove equivalence
1. Render the refactored build for `lang` 0/1/2/3 → `snapshots/current/lang-N.html`.
2. Diff `current` vs `legacy` per language. **Empty diff is the pass condition** (SC-002).
3. Also load the real `menu/index.html` against the live sheet in the headless browser as a final smoke check
   (default Food tab shown, tabs switch, no console errors).

If any diff is non-empty, the refactor is wrong — revert the offending change and re-derive equivalence. The
oracle is never edited to match the refactor.

## Complexity Tracking

> No constitution violations. Section intentionally empty.
