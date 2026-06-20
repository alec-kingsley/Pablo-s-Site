# Feature Specification: Contact Form

**Feature Branch**: `008-contact-form` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the homepage contact form (`form.js` + the `contactUs` form on the four homepages) and
fix confirmed defects per the owner decisions (English fallback for i18n gaps; keep+document mail split).

> Behavior-anchored spec (Constitution Principle II) with documented deviations per the bug-fix policy. The
> corrected behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor submits the contact form (Priority: P1)

A visitor fills Name/Email/Subject/Message and submits. Empty fields or an invalid email produce a localized
error popup; a valid submission posts to the mail endpoint and shows a thank-you popup.

**Acceptance Scenarios**:

1. **Given** any required field is empty, **When** the visitor submits, **Then** an error popup lists the empty
   field name(s) in the active language and the submission is blocked.
2. **Given** an invalid email, **When** the visitor submits, **Then** an "invalid email" error popup shows and
   the submission is blocked.
3. **Given** a valid submission, **When** the endpoint returns success, **Then** a thank-you popup shows.

### User Story 2 - The form behaves in every language (Priority: P1)

The error/thank-you messages and field-name lists appear in the active language; where a translation is missing
(Old English / Klingon) the message falls back to English rather than showing blank or "undefined".

**Acceptance Scenarios**:

1. **Given** the Klingon homepage (lang 3), **When** the visitor submits an empty form, **Then** the error popup
   lists the (English-fallback) field names and the submission is blocked — *previously validation was skipped
   for Klingon* (FR-004).
2. **Given** the Klingon or Old-English page, **When** any popup shows, **Then** it shows readable English text
   where no translation exists — *never blank or "undefined"* (FR-003).

### User Story 3 - "program" easter egg (Priority: P3)

Entering Name="program" turns the form into a tiny runner; with Email="palindrome" it pops up the longest
palindromic substring of the Message. This works repeatedly within a session.

**Acceptance Scenarios**:

1. **Given** the palindrome easter egg, **When** it is used more than once, **Then** it keeps working —
   *previously the helper clobbered its own function after the first use* (FR-005).

### Edge Cases

- Missing-language messages fall back to English (`msg[lang] || msg[0]`).
- Klingon field-name labels do not exist yet → English field names are used as a fallback (flagged TODO).

## Requirements *(mandatory)*

- **FR-001**: The form MUST validate required fields and email format before submitting, blocking on failure
  with a localized error popup.
- **FR-002**: A valid submission MUST post to the configured endpoint and show a thank-you popup on success and
  an error popup on failure.
- **FR-003** *(fix)*: All popups MUST display readable text in every language; missing Old-English/Klingon
  strings MUST fall back to English (never blank or the literal "undefined").
- **FR-004** *(fix)*: Empty-field validation MUST run for **all** languages including Klingon (lang 3) —
  previously the Klingon branch was missing, skipping validation entirely.
- **FR-005** *(fix)*: The palindrome helper MUST be reusable within a session — previously it overwrote its own
  function binding on first call.
- **FR-006** *(documented, unchanged)*: Mail routing is an intentional split (owner decision): English/Spanish
  → owner inbox; Old-English/Klingon → dev endpoint. No behavior change; the stale "change when released"
  comment is replaced with an explicit description.

### Key Entities *(include if data involved)*

- **Form fields**: Name, Email, Subject, Message (read by control name from `contactUs`).
- **Localized message set** (`msg`): per-language strings for errors and thank-you; English is the fallback.
- **Popup**: `#popUp` (title/desc + Close), created by the shared `popUpGen`.

## Success Criteria *(mandatory)*

- **SC-001**: For Klingon (lang 3): empty-form submit shows an error popup with field names (validation runs);
  invalid email shows English "Invalid e-mail address"; a success response shows English "Thank you for
  contacting us." — all readable, none "undefined" (verified).
- **SC-002**: Old-English (lang 2) keeps its own field labels (e.g. "Náma, Ymb, Gewrit …") and falls back to
  English only where no Old-English string exists.
- **SC-003**: The palindrome helper returns correct results on repeated calls (`p` stays a function).
- **SC-004**: English/Spanish behavior is unchanged from legacy.

## Assumptions / Flags

- **Owner TODO**: provide real Old-English and Klingon strings for the form messages and Klingon field labels;
  currently English fallback is used (flagged, not invented).
- The actual mail POST is Google-Apps-Script-hosted; verification stubs the AJAX layer to exercise the
  success/error popup paths. Out of scope: the endpoints' server behavior.
