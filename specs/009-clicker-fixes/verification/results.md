# Verification Results: Clicker Game Fixes

Method: headless Chromium (Claude Preview MCP) on real `/clicker/`; the in-memory `data` array is overridden to
exercise each function deterministically.

## FR-003 — leaderboard sort (SC-003)

Input `data` cubanoCt: `[5, 100, -3, "abc", 42]`. After `sortPlayers()`:

`B:100 → E:42 → A:5 → D:abc(=0) → C:-3` — strict descending; non-numeric treated as 0; negative ranked last. ✅
(Legacy `max=0` + `maxIdx=0` mis-ranked non-positive/malformed scores.)

## FR-002 — login does not destroy passwords (SC-001)

`accName='User'`, two accounts with passwords `p1`/`k1`. After `loadAcc(0)`:

| check | result |
|---|---|
| passwords after load | `["p1","k1"]` — both preserved ✅ (legacy deleted ALL) |
| `accName` | "Pablo" (logged in) |
| first load threw | no |
| second load blocked | yes (`accName != "User"`) |

## FR-001 — reserved-name guard (SC-002)

`loginForm` name input = "User" → `createAccAttempt()` sets `#loginErr` = **"Error: Username unavailable"**. ✅
(Legacy compared the DOM node to the string, so the guard never fired.)

## Result

PASS — all three fixes behave per spec; the rest of the game is untouched (SC-004).
