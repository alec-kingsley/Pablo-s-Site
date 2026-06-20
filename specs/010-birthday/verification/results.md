# Verification Results: Birthday Easter Egg

Method: headless Chromium (Claude Preview MCP) + `verification/harness.html`, which stubs `Date` to Jan 17 2026
and calls `birthday()` per language against the real `script.js`. `bday.js` checked at runtime + source level.

## Splash i18n (FR-004, SC-001/SC-002)

| lang | splash (first 40 chars) | empty? | class |
|---|---|---|---|
| 0 en | "Wish our boss, Pablo Taura, a happy birt…" | no | "" |
| 1 es | "Deséale a nuestro jefe, Pablo Taura, un …" | no | "" |
| 2 ang | "Wýsc úrum hláforde, Pablo Taura, glædne …" | **no** (was EMPTY) ✅ | "" |
| 3 tlh | "pinma'daq qoslij dativjaj yijaz!" | no | **kli** ✅ |

All four languages: `#canvas` created ✅, `#mainImg` swapped to `birthday.webp` ✅, no throw.

## Confetti size (FR-005, SC-003)

- Runtime: 50 `new Confetti()` → all have finite `size` and `speed` (`badCount: 0`).
- Source: `bday.js` now uses `this.size = size < 15 ? 15 : size` (fix present; old `if (size<15) this.size=15`
  gone). The wide-viewport path (size ≥15) now always assigns a finite size — previously `undefined` → NaN
  speed. (Headless viewport width was pinned to 1, so the wide path is proven at the source level + the
  always-finite construction invariant.)

## Result

PASS. All four languages show a birthday splash (Old-English no longer blank), Klingon keeps its font, canvas +
hero swap work, and confetti always has a finite size. Owner TODO: confirm the drafted Old-English string.
