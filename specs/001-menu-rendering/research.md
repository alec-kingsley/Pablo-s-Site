# Phase 0 Research: Menu Rendering Refactor

This feature has **no open `NEEDS CLARIFICATION`** — the behavior is fully observable in `menuBuilder.js` and
confirmed against the live CSV. Research here records the equivalence proofs behind each safe refactor and the
verification methodology.

## Decision 1: Language selection via suffix lookup

- **Decision**: Replace the repeated `if (lang==0){..._en} else if (lang==1){..._es}...` chains with
  `const SUFFIX = ['_en','_es','_ang','_tlh'][lang]` and access `row['name'+SUFFIX]`, `row['nameDesc'+SUFFIX]`,
  `row['cat'+SUFFIX]`, `row['catDesc'+SUFFIX]`.
- **Rationale**: `lang` is only ever 0–3 in the running system, and the suffixes map one-to-one to the existing
  branches. Property access `row['name_en']` is identical to the dot/explicit access used today. Output is
  byte-identical; the change is purely structural. This also makes Multilingual Parity (Principle IV) a
  structural guarantee instead of four hand-maintained copies.
- **Alternatives considered**: (a) Keep the if-chains — rejected, they are the spec's main readability debt and
  the source of the Klingon size-label quirk being hard to see. (b) A per-field helper function — rejected as
  unnecessary indirection; a single suffix constant is the minimal change.
- **Quirk preserved**: continuation **detection** continues to read `name_en` specifically
  (`data[row+1].name_en.charAt(0) == ':'`), independent of `SUFFIX`. The displayed size label still reads the
  active-language column. This keeps the documented Klingon blank-size-label behavior intact.

## Decision 2: `kli` Klingon class helper

- **Decision**: `function kli(base){ return lang==3 ? base + ' kli' : base }`, used as
  `el.setAttribute('class', kli('menuItem'))`.
- **Rationale**: Every site element today sets either `"menuItem"` or `"menuItem kli"` based on `lang==3`. The
  helper emits the exact same two strings. Removes ~10 duplicated conditionals with zero output change.
- **Alternatives considered**: `classList.toggle('kli', lang==3)` — rejected because it would change attribute
  construction order/representation and risk a non-identical serialized class attribute; string equality is the
  safe choice.

## Decision 3: Remove `console.log(data)`

- **Decision**: Delete the debug `console.log(data)` in `showInfo`.
- **Rationale**: Console output is not part of the rendered DOM and not part of any spec requirement; its
  removal cannot change the menu output. It is incidental debug noise.
- **Alternatives considered**: Keep it — rejected; it leaks the full menu dataset to the console on every load.

## Decision 4: Scope leaked variables

- **Decision**: Declare `Name`, `nameDesc`, `cat`, `catDesc` with `let` at the top of `showInfo` instead of the
  current `let price = Name = nameDesc = cat = catDesc = ""` (which makes all but `price` implicit globals).
- **Rationale**: Each variable is unconditionally reassigned at the top of every row iteration before being
  read, so local vs implicit-global scoping produces identical values and identical render output. Scoping them
  prevents accidental leakage onto `window` and aligns with the DOM-contract discipline (Principle V).
- **Alternatives considered**: Leave as implicit globals — rejected; it is a latent collision risk with
  `script.js` globals and offers no benefit.

## Decision 5: Deterministic verification methodology

- **Decision**: Render against a **frozen local CSV fixture** (not the live sheet) inside a headless browser,
  serialize the menu container's normalized innerHTML per language, and diff refactored output against a legacy
  golden snapshot captured first.
- **Rationale**: The live Google Sheet can change between runs, which would make a legacy-vs-refactored diff
  non-deterministic. Freezing the CSV isolates the single variable under test — the code. The headless browser
  (rather than a Node + jsdom shim) exercises the real DOM APIs the builder uses, so the render path matches
  production faithfully. Normalization (collapsing insignificant whitespace between tags) avoids false diffs
  from formatting while preserving text content and structure.
- **Alternatives considered**: (a) Node + jsdom — rejected; jsdom's HTML serialization and attribute ordering
  differ subtly from browsers and could mask or fabricate diffs. (b) Compare against the live sheet twice —
  rejected; non-deterministic. (c) Screenshot/pixel diff — rejected; too coarse and style-dependent, and it
  cannot prove structural/text equality the way DOM serialization can.
- **Normalization rules**: trim leading/trailing whitespace; collapse runs of whitespace **between** tags to a
  single newline; do not alter whitespace inside text nodes; compare per-language files with an exact string
  equality after normalization.

## Confirmed against live data (observation log)

- Header columns include an unused `price_ghdd`; the first data row is a human-instructions row → confirms the
  first-row skip is intentional.
- Sentinels present in live data: `menu` (Food/Drink/Dessert), `image` (FoodPhotos/*.webp, including a path
  containing a comma handled by CSV quoting). `note` is supported by code but unused by current data.
- Colon multi-price rows present (`:Traditional`, `:Single`, `:Double`, `:12oz`, `:16oz`) with empty-price
  parents → confirms the continuation composition path.
- Klingon cells embed `<span class="lat">...</span>` HTML and some continuation rows have empty `name_tlh`
  → confirms the blank-size-label quirk in Klingon.
