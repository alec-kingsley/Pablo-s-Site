# Capture procedure (headless browser)

No Node on this machine, so capture is driven through the Claude Preview MCP (real Chromium) against a static
Python server. Both `legacy` and `current` snapshots are produced by the **same** harness/engine, so the diff
isolates the code change.

## Steps

1. Serve repo root: `python -m http.server 8099` (run from the repository root).
2. For each `N` in `0,1,2,3`:
   - Navigate the headless browser to `http://localhost:8099/specs/001-menu-rendering/verification/harness.html?lang=N`.
   - Wait until `window.__menuRendered === true`.
   - Read `window.serializeMenu()`.
   - Write the returned string to `snapshots/<target>/lang-N.html`, where `<target>` is `legacy` (builder
     unmodified) or `current` (builder refactored).
3. Diff `legacy/lang-N.html` against `current/lang-N.html`. Empty diff for all N = PASS (SC-002).

## Invariant

The harness file, fixture, `setMenu`, `lang` handling, and normalization are identical across both captures.
Only `menuBuilder.js` differs between the `legacy` and `current` runs.
