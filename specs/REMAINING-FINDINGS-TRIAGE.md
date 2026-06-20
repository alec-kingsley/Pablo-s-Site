# Remaining Subsystems — Findings Triage (from multi-agent analysis 2026-06-19)

Source: parallel analysis of 9 remaining subsystems (48 agents) + adversarial bug-verification. **24 confirmed
bugs** (refuted ones excluded). `csv-analyzer/` excluded per owner rule. Categorized for action.

## A. Safe autonomous fixes (clear defects, no judgment / no translation needed)

| # | Subsystem | Bug | Fix |
|---|---|---|---|
| 1 | contact-form | `p()` palindrome helper clobbers its own function binding (breaks after first use) | scope its vars locally |
| 2 | contact-form | success popup uses message as TITLE + empty desc (inconsistent w/ error popups) | consistent popup shape |
| 3 | survey | on backend error, user stuck on "Processing…" forever (button never restored) | restore button + error msg |
| 4 | survey | `onsubmit="false"` is a no-op string attribute | `return false` or remove |
| 5 | clicker | `createAccAttempt` compares a DOM node to a string → reserved-name guard never fires | use `[0].value` |
| 6 | clicker | `loadAcc` deletes passwords for ALL accounts on first login → later logins break | drop the delete loop |
| 7 | clicker | `sortPlayers` uses `max=0` sentinel; mishandles non-positive/non-numeric scores | `-Infinity` + `Number()` |
| 8 | order | iframe has no sizing → storefront renders in a ~300×150 box | full-viewport iframe CSS |
| 9 | order | placeholder `<title>` leaks to tab/SEO | real title |
| 10 | about-us (EN) | mobile logo missing `onclick="switchDisp()"` (parity gap vs ES) | add handler |
| 11 | bday.js | confetti `size` left `undefined` for large viewports → some pieces NaN | `Math.max(15,size)` |

## B. Needs your decision — product / intent

| # | Subsystem | Finding | Why it's yours |
|---|---|---|---|
| D1 | contact-form | Old-English & Klingon submissions route to a **dev endpoint**, not the owner inbox | real customer emails — where should they go? |
| D2 | events | `eventsBuilder.js` is **never loaded** on `/events` — the whole events feature is dead in production | turning on a feature may be intentional-off |
| D3 | events | dead `EN→ES` link to `../es/eventos` (no such page) → 404 | tied to D2 (events scope) |
| D4 | halloween | `halloween.js` theming is **entirely dead** (only `console.log`; references a 28 MB unused image) | revive vs delete is an intent call |
| D5 | hours | open/closed flips one hour past posted closing time | I deliberately **preserved** this in spec 002; confirm |

## C. i18n gaps — need real Old-English / Klingon strings (I can't author these authentically)

Safe interim: add an **English fallback** so nothing shows blank/"undefined"; flag the real translations for you.

| # | Subsystem | Gap |
|---|---|---|
| I1 | birthday | no Old-English (lang 2) splash → empty red box on Jan 17 (ang homepage) |
| I2 | contact-form | success/error popups blank/"undefined" for Old-English & Klingon (msg arrays only have en/es) |
| I3 | contact-form | empty-field validation skipped entirely for Klingon; email-invalid shows "undefined" for Klingon |
| I4 | events | Klingon not handled (falls through to Old-English; no `_tlh` columns) — tied to D2 |
| I5 | about-us (ES) / lang-variants | double-click splash + Halloween splash texts are English-only on localized pages |

## Owner decisions (2026-06-19)

- **D1 mail routing** → **Keep the split, document it.** Old-English/Klingon submissions continue to the dev
  endpoint by design; no code change — make the intent explicit in the spec/comment.
- **D2 events page** → **Leave it dead.** Do NOT wire eventsBuilder. Spec `/events` as intentionally not-live;
  D3 (404 translate link) and I4 (Klingon events) documented as deferred, not fixed.
- **D3/C i18n** → **English fallback now + flag.** Missing Old-English/Klingon strings fall back to English so
  nothing is blank/"undefined"; real OE/Klingon translations flagged as owner TODOs.
- **D4 halloween.js** → **Remove the dead code.** Drop the `appendChild` of halloween.js + the stray
  console.log/unused path vars; delete the dead `halloween.js`; keep the working pumpkin-logo swap. Flag the
  now-unreferenced 28 MB `images/HalloweenBackground.png` for separate deletion.
- **D5 hours off-by-one** → preserved (already documented in spec 002); unchanged.

## Status

Already done & merged to sdd: 001 menu, 002 hours, 003 slideshow, 004 nav-bootstrap, 005 easter-eggs,
006 pathFix. This triage + decisions drive the remaining subsystem branches (007+).
