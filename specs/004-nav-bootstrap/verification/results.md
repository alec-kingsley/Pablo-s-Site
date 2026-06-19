# Verification Results: Navigation & Homepage Bootstrap

Method: headless Chromium (Claude Preview MCP) on the real `index.html` (and `menu/` for cross-page scroll
safety). `script.js` unchanged (verify-only).

## Element presence (homepage)

`navbar`, `left`, `right`, `navIcon`, `mobileNav`, `buttonPopup`, `orderButton` — all present. (`#right` is
written `id = "right"` with spaces in the markup, so a naive grep misses it; it exists.)

## switchDisp — mobile nav toggle (SC-002)

| activation | #mobileNav display |
|---|---|
| initial | "" (unset) |
| 1st | block |
| 2nd | none |

→ Alternates correctly; first activation always opens.

## buttonPopupGen — order popup + corner rounding (SC-003, FR-004)

| activation | #buttonPopup | #orderButton borderRadius |
|---|---|---|
| initial | none | "" |
| 1st | block (open) | 0px (squared) |
| 2nd | none (closed) | 16px (rounded) |
| 3rd | block (open) | 0px (squared) |

→ Popup visibility and corner rounding stay in sync. The code sets `"0"` but reads back `"0px"` (CSSOM
normalization), so the `== "0px"` comparison toggles correctly. No bug.

## scrollFunction — navbar/logo shrink (SC-004, FR-005)

| state | navbar padding | logo size |
|---|---|---|
| scrolled (scrollTop 200 > 80) | 10px 0px 0px | 90px |
| at top (scrollTop 0) | 22px 0px 8px | 100px |

→ Compacts when scrolled, restores at top. No throw.

## Cross-page scroll safety (FR-006)

On `menu/`: `window.onscroll` wired to `scrollFunction`; `#navbar/#left/#right/#navIcon` all present;
`scrollFunction()` after scrolling did **not** throw. The shared nav markup exists on inner pages, so the global
scroll handler is safe everywhere.

## Bootstrap (SC-001)

`openFunc(0)` on load sets `lang=0`, initializes the carousel (see 003), and runs the hours/open-status routine
(see 002) — both confirmed populated on the live homepage with zero console errors.

## Conclusion

All FRs (001–006) and SC-001–004 verified. Verify-only outcome (Principle II): no code change. Two
inspection-time risks (border-radius comparison; global scroll handler) empirically proven safe.
