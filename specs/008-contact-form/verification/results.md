# Verification Results: Contact Form

Method: headless Chromium (Claude Preview MCP) on real `index.html` (loads `form.js`); `$.ajax` stubbed to
exercise the success popup path without a network POST.

## Palindrome helper reusable (FR-005, SC-003)

| call | input | result | `typeof p` after |
|---|---|---|---|
| 1 | "xracecarx" | "racecar" | function |
| 2 | "abccba!!" | "abccba" | function |

→ Repeatable; the helper no longer clobbers its own binding.

## i18n fallbacks (FR-003/FR-004, SC-001/SC-002)

| case | lang | popup | result |
|---|---|---|---|
| empty form | 3 (Klingon) | "Error" / "Name, Email, Subject, Message must be filled out" | validation now RUNS (was skipped) ✅ |
| invalid email | 3 (Klingon) | "Error" / "Invalid e-mail address" | English fallback (was "undefined") ✅ |
| success response | 3 (Klingon) | title "Thank you for contacting us." | English fallback (was "undefined") ✅ |
| success response | 0 (English) | title "Thank you for contacting us." | unchanged ✅ |
| empty form | 2 (Old English) | "Náma, Ymb, Gewrit wesan gewriten scealt" | OE labels preserved ✅ |

## Mail routing (FR-006, unchanged)

`if (lang < 2) mailUrl = ownerMail; else mailUrl = devMail;` — preserved per owner decision; the stale
"change when released" comment replaced with an explicit description of the intentional split.

## Result

PASS. Klingon/Old-English popups are now always readable (English fallback), Klingon validation runs, the
palindrome easter egg is reusable, and English/Spanish behavior is unchanged. Flagged owner TODO: real
Old-English/Klingon strings + Klingon field labels.
