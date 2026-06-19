# Menu Render Verification (dev-only)

This directory is **development tooling, not part of the deployed site**. GitHub Pages serves the repo root;
nothing here is linked from any production page. See [../quickstart.md](../quickstart.md) for how to run it.

Contents:
- `fixtures/menu_live.csv` — frozen copy of the live Google Sheets CSV, for deterministic runs.
- `harness.html` — loads PapaParse + the real `menuBuilder.js`, points it at the local fixture, renders, and
  exposes `window.serializeMenu()` returning the normalized menu DOM. Language via `?lang=0|1|2|3`.
- `snapshots/legacy/` — golden oracle captured from the **unmodified** builder (the source of truth).
- `snapshots/current/` — captured from the refactored builder; must match `legacy/` exactly (empty diff).

Pass condition: `legacy/lang-N.html` == `current/lang-N.html` for N = 0,1,2,3 (Spec SC-002).
