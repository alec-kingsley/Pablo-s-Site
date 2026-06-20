# Quickstart: Menu Render Parity Harness

Goal: prove `menuBuilder.js` renders **byte-identical** DOM before and after the refactor, for all four
languages, with zero behavior change.

## Prerequisites

- Python 3 (for `http.server`) — confirmed available (3.11).
- A headless browser render path (Claude Preview MCP / Chromium).

## One-time: freeze the fixture

The live CSV is copied to `verification/fixtures/menu_live.csv` so runs are deterministic (the live sheet may
change). Production still uses the live URL; the fixture is dev-only.

## Capture the legacy oracle (BEFORE editing menuBuilder.js)

```
# from repo root
python -m http.server 8099
# headless browser opens:
#   /specs/001-menu-rendering/verification/harness.html?lang=0  (then 1,2,3)
# each run writes verification/snapshots/legacy/lang-N.html
```

The harness loads PapaParse + the builder, parses the **local fixture**, renders into a detached container,
and returns the normalized innerHTML. Capture all four languages → `snapshots/legacy/`.

## Verify the refactor (AFTER editing)

```
# re-render the same four languages from the refactored build
#   -> verification/snapshots/current/lang-N.html
# diff:
for N in 0 1 2 3: diff snapshots/legacy/lang-N.html snapshots/current/lang-N.html
```

**PASS** = all four diffs empty. **FAIL** = any non-empty diff → the refactor changed behavior; revert the
offending change. Never edit the legacy snapshot to match.

## Final smoke test (live site)

Load the real `menu/index.html` against the live sheet in the headless browser and confirm:
- "Loading..." is replaced by menu content;
- the **Food** tab is shown by default and highlighted;
- clicking **Drink** / **Dessert** switches the visible tab;
- no JavaScript errors in the console.
