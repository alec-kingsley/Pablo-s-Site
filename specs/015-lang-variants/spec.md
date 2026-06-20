# Feature Specification: Localized Homepage Variants & Language Model

**Feature Branch**: `015-lang-variants` | **Created**: 2026-06-19 | **Status**: Draft (documentation-only)

**Input**: Reverse-spec the localized homepage variants (`es/`, `ang/`, `tlh/` + subpages) and the site-wide
four-language model. Documentation-only: confirms the variants reuse the shared runtime and records the
remaining i18n flags.

> Behavior-anchored, **documentation-only** spec (Constitution Principle II). No code change. This is the
> capstone for the language model that the per-subsystem specs (001–014) each touch.

## Current State (observed)

- The site has four homepages, one per language, each setting the active language at load:
  - `index.html` → `openFunc(0)` (English)
  - `es/index.html` → `openFunc(1)` (Spanish)
  - `ang/index.html` → `openFunc(2)` (Anglo-Saxon / Old English; `<body class="oe">`)
  - `tlh/index.html` → `openFunc(3)` (Klingon)
- All variants load the **same** shared runtime (`../script.js`, `../jquery-3.2.1.js`) and reuse the same
  functions (`openFunc` → `setSlide`, `daySelect`, etc.). The localization lives in each page's **HTML content**
  plus the `lang` integer; there is no per-language behavioral fork in the shared code beyond the documented
  `lang`-indexed strings/columns.
- Localized subpages exist (e.g. `ang/fodaliste`, `tlh/hidjolev`, `es/menu`, `es/quienes_somos`) as
  content translations of the corresponding English pages, driving the same builders with the matching `lang`.
- The language model is consistently `0=en, 1=es, 2=ang, 3=tlh`, used by the menu/events builders (column
  suffixes `_en/_es/_ang/_tlh`) and by the `lang`-indexed string arrays (e.g. open/closed labels).

## Requirements *(mandatory)*

- **FR-001**: Each localized homepage MUST set its language via `openFunc(n)` and reuse the shared runtime; no
  language variant introduces its own behavioral logic.
- **FR-002** *(documented)*: The four-language model (`0=en,1=es,2=ang,3=tlh`) is the shared contract across the
  menu builder, seasonal features, hours/open-status, and forms (each specified in its own subsystem spec).

## Success Criteria *(mandatory)*

- **SC-001**: The es/ang/tlh homepages load the shared `script.js` and bootstrap via `openFunc(1/2/3)`
  (verified by inspection).
- **SC-002**: No behavior change is introduced by this spec (documentation-only).

## Resolved during the reverse-spec effort

- **Old-English birthday splash** (was an empty box on the `ang` homepage) — fixed in
  [010-birthday](../010-birthday/spec.md).
- **Contact-form Old-English/Klingon popups** ("undefined"/blank) and **Klingon validation skipped** — fixed
  with English fallbacks + Klingon validation in [008-contact-form](../008-contact-form/spec.md).

## Deferred / Flagged (owner)

- **Easter-egg splash texts are English-only** on all localized homepages (double-click logo splash +, in
  October, the Halloween splash strings). Per the i18n decision this is acceptable for a hidden easter egg;
  documented, not changed. (Localize the splash arrays by `lang` if desired later.)
- **Hours closing-hour off-by-one** (café shows "Open" through the entire closing hour) is preserved as existing
  behavior — documented in [002-hours-open-status](../002-hours-open-status/spec.md).
- **Real Old-English / Klingon translations**: several strings currently use English fallback or drafted
  translations flagged in-code for owner/translator review (birthday OE draft; form messages). Tracked in
  [REMAINING-FINDINGS-TRIAGE.md](../REMAINING-FINDINGS-TRIAGE.md).

## Assumptions

- Documentation pass: the localized variants are confirmed to be content translations over a single shared
  runtime; their per-feature behavior is specified in the respective subsystem specs (001–014).
