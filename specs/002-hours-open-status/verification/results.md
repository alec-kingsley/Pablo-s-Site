# Verification Results: Hours & Open-Status

Method: headless Chromium (Claude Preview MCP) + `harness.html`, which stubs `Date`, provides the homepage
hours DOM, loads the real `script.js`, and runs `daySelect()` under try/catch. Dates use June 2026
(non-seasonal, so birthday/Halloween never fire). Weekday map: Jun7=Sun(0), Jun1=Mon(1) … Jun6=Sat(6).

## Legacy baseline (script.js BEFORE fix)

| Case | underlined | #isOpen | threw |
|---|---|---|---|
| Wed (gd3) 15h | sun-wed | Open | no |
| Thu (gd4) 15h | **none** | **Closed** | **yes — `TypeError: Cannot read properties of null (reading 'style')`** |

→ Confirms the bug: Thu–Sat crash, no underline, indicator stuck "Closed" even when open. Sun–Wed worked.

## Corrected (script.js AFTER fix: `thur-sat`, dead `min` removed)

**All 7 days @ 15h (open), lang 0** — every day `threw:false`, correct row, "Open":

| day | Sun | Mon | Tue | Wed | Thu | Fri | Sat |
|---|---|---|---|---|---|---|---|
| underlined | sun-wed | sun-wed | sun-wed | sun-wed | thur-sat | thur-sat | thur-sat |
| no throw | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Boundaries** (open iff in window): Sun–Wed 11–20, Thu–Sat 11–21.

| group | h10 | h11 | closing h (20/21) | h after (21/22) |
|---|---|---|---|---|
| Sun–Wed (Wed) | Closed | Open | Open (20) | Closed (21) |
| Thu–Sat (Thu) | Closed | Open | Open (21) | Closed (22) |

**Languages** (Wed 15h, open): lang0 "Open", lang1 "Abierto", lang2 "Openede", lang3 "poSmoHta'". ✅

**Matrix result: PASS** (0 failures). SC-001 (no throw any day), SC-002 (boundaries), SC-003 (languages),
SC-004 (Sun–Wed unchanged vs legacy baseline) all satisfied.

## Live smoke test (real index.html, real clock)

Today = Friday 2026-06-19, 14h (a Thu–Sat day — the previously-broken path). Result: `thur-sat` underlined,
`sun-wed` not, indicator "Open", **zero console errors**. The fix is correct on the live homepage where legacy
would have crashed.
