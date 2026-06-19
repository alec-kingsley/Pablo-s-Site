# Verification Results: Logo Easter-Egg Splash Text

Method: headless Chromium (Claude Preview MCP) on real `index.html`. `randomSplash()` called with `Date` stubbed
to specific months; everyday rotation checked for uniqueness/permutation.

## Everyday rotation (SC-001)

- `randomSplash()` for June (non-seasonal): **12 messages, all unique** (a no-repeat permutation of the base
  list). `easterEgg`, `randomSplash` defined; `randSplash` is the global rotation buffer.

## Legacy month mismatch (before fix)

| month | set size | Halloween present? |
|---|---|---|
| September (8) | 16 | **yes** ← legacy showed spooky splashes in September |
| October (9) | 12 | **no** ← but decorations are in October |
| June (5) | 12 | no |

→ Confirms the bug: spooky messages appeared in September, a month before (and never with) the October
decorations, despite reading "this month only".

## After fix (`getMonth() == 8` → `== 9`) (SC-002)

| month | set size | Halloween present? | expected |
|---|---|---|---|
| September (8) | 12 | no | ✅ |
| October (9) | 16 | **yes** | ✅ |
| November (10) | 12 | no | ✅ |

→ Halloween splash messages now appear in October, aligned with the Halloween decorations. Everyday rotation
unchanged (SC-003).

## Deferred / flagged

- `popUpGen` (in `script.js`, duplicated in `surveyBuilder.js`, used by `form.js`) deferred to the form/popup
  subsystem — not part of this easter egg.
- The base set contains a placeholder-looking message ("Add a description about this category"); preserved as
  current behavior (flagged, possibly intentional meta-humor).
