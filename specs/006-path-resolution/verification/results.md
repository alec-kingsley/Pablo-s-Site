# Verification Results: Portable Path Resolution (`pathFix`)

Method: headless Chromium (Claude Preview MCP) on real pages; the returned string is resolved with the URL API
against the page URL to determine where it actually points. `script.js` unchanged (verify-only).

## Depth scaling + resolution (SC-001, FR-001/FR-002)

| page | pathname | segments | `pathFix('/images/x')` | resolves to |
|---|---|---|---|---|
| homepage | `/index.html` | 2 | `/../images/x` | `/images/x` ✅ |
| menu | `/menu/` | 3 | `/../../images/x` | `/images/x` ✅ |

→ One `/..` prefix per directory segment beyond the first; the result resolves (browser clamps leading `/..` to
root) to the same site-root path at every depth. Also verified `pathFix('/bday.js')` → `/../bday.js` →
`/bday.js` from the homepage.

## Non-root input (SC-002, FR-003)

`pathFix('relative/x.js')` → returns `'relative/x.js'` unchanged; an error is logged ("Link must start with /");
no throw.

## Notes

- The menu image renderer (`addImg`) contains its own **inline copy** of this depth logic instead of calling
  `pathFix` — flagged duplication, left unchanged here.
- Verify-only outcome (Principle II): no code change (SC-003).
