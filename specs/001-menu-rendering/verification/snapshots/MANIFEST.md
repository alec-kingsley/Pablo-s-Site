# Snapshot Oracle Manifest

## Method

Snapshots are captured by rendering the builder against `fixtures/menu_live.csv` in real headless Chromium
(Claude Preview MCP) via `../harness.html?lang=N`, then serializing the normalized `#loadMenu` innerHTML.

Because no Node/file-write is available from the browser, the **durable oracle is a SHA-256 hash + length per
language** (`legacy/manifest.json`). The **authoritative post-refactor equality check** is twofold and both
must hold:

1. **Exact in-browser string comparison** — the legacy serialization is held in `localStorage['legacy_lang_N']`;
   after the refactor the new serialization is compared to it with `===` (any single-character difference is
   caught), returning the first differing index on failure.
2. **SHA-256 re-hash** — the refactored render's hash must equal `legacy/manifest.json` for every language.

SHA-256 equality is byte-for-byte equality; together with the exact string compare this proves identical DOM
(Spec SC-002) more strongly than a textual line-diff would.

`decode_and_verify.py` is an optional helper: if a `<target>/_b64.json` is captured from the browser
(`btoa` of each language's serialization), it decodes them to `lang-N.html` and hash-checks against the
manifest. Not required for the proof.

## Legacy oracle (captured BEFORE any edit to menuBuilder.js)

| lang | name | length | sha256 | structural check |
|---|---|---|---|---|
| 0 | en  | 9723 | `09b63ca2…4e593c` | 3 menu tabs (Food/Drink/Dessert); `kli` ABSENT; default tab = Food (`#d92332`) |
| 1 | es  | 9198 | `3f7ba2ab…e838dc0` | 3 tabs (Comida/Bebidas/Postres); `kli` ABSENT |
| 2 | ang | 8045 | `cbc1bc5b…be57b6f` | 3 tabs (Fóda/Drincas/Gabotan); `kli` ABSENT |
| 3 | tlh | 3141 | `188f342a…266f4d0` | 3 tabs (suj/zuz/su'gar suj); `kli` PRESENT (32 occurrences) |

Render produced **zero console errors**. Multi-price composition confirmed (e.g. "Traditional $11",
"Single $2 Double $3", "12oz $3 16oz $4"); images path-resolved; first instructions row skipped; default
`setMenu(0)` applied (Food shown, others hidden).

## Parity result (refactored vs legacy)

| lang | legacy sha256 | refactored sha256 | exact `===` | result |
|---|---|---|---|---|
| 0 en  | `09b63ca2…4e593c` | `09b63ca2…4e593c` | yes | ✅ |
| 1 es  | `3f7ba2ab…e838dc0` | `3f7ba2ab…e838dc0` | yes | ✅ |
| 2 ang | `cbc1bc5b…be57b6f` | `cbc1bc5b…be57b6f` | yes | ✅ |
| 3 tlh | `188f342a…266f4d0` | `188f342a…266f4d0` | yes | ✅ |

All four languages **byte-identical** (exact string equality + SHA-256 match), `firstDiff = -1`. **SC-002 PASS.**

## Live-site smoke test (real `menu/index.html`, live sheet, refactored build)

`refactoredLoaded = true` (kli + LANG_SUFFIX present). 3 tabs (Food/Drink/Dessert); "Loading..." removed;
default Food shown (`display:block`, button `#d92332`), others hidden; `setMenu(1)`→Drink, `setMenu(2)`→Dessert
switch correctly with highlight colors `#d92332`/`#2a438c`; **zero console errors**. US1/US2 confirmed in
production path.
