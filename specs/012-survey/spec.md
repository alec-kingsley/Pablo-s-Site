# Feature Specification: Survey Feedback Form

**Feature Branch**: `012-survey` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the survey feedback flow (`surveyBuilder.js` + `survey/index.html`) and fix two
confirmed defects.

> Behavior-anchored spec (Constitution Principle II) with two documented deviations (FR-003, FR-004) per the
> bug-fix policy. Corrected behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor submits feedback (Priority: P1)

A visitor answers the rating questions and submits. A thank-you popup appears (tailored to their average
rating), they can submit, and on success they are returned to the site.

**Acceptance Scenarios**:

1. **Given** a completed survey, **When** the visitor submits and the backend accepts it, **Then** they are
   navigated back to the site.
2. **Given** the backend rejects or errors, **When** submission fails, **Then** the submit control returns to a
   clickable state so the visitor can retry — *previously it stuck on "Processing…" forever* (FR-003).

### User Story 2 - Comments form does not navigate away (Priority: P2)

The "Additional Comments" form does not perform a native page submission (which would lose the survey state);
submission is handled by the app.

**Acceptance Scenarios**:

1. **Given** the comments form, **When** a submit is triggered (e.g. Enter in the textarea), **Then** native
   submission is prevented — *previously `onsubmit="false"` was a no-op string and did not prevent it* (FR-004).

### Edge Cases

- On backend failure the submit control reads "Try again" and re-runs the submit on click.

## Requirements *(mandatory)*

- **FR-001**: The survey MUST compute the average rating and show a tailored thank-you popup (low → offer
  contact; mid → see-you-soon; high → review links).
- **FR-002**: Submitting MUST POST the responses and, on success, return the visitor to the site.
- **FR-003** *(fix)*: On a non-success response or an AJAX error, the submit control MUST be restored (to "Try
  again") so the visitor is not stuck on "Processing…" and can retry.
- **FR-004** *(fix)*: The comments form MUST prevent native submission (`onsubmit="return false"` instead of the
  no-op `onsubmit="false"`).

## Success Criteria *(mandatory)*

- **SC-001**: After an AJAX error or a non-success result, the submit control reads "Try again" (verified) — not
  "Processing…".
- **SC-002**: Triggering a submit on the comments form is prevented (verified: `dispatchEvent` returns false).
- **SC-003**: The success path (navigate back) and the rating-tailored popups are unchanged from legacy.

## Assumptions / Flags

- `surveyBuilder.js` defines its own `popUpGen` (a duplicate of the one in `script.js`); the survey page is
  standalone and does not load `script.js`. The duplication is documented, not changed here (consolidating would
  risk behavior drift across two pages).
- Verification stubs `$.ajax` to exercise the failure branches and dispatches a submit event for the comments
  form. Out of scope: the live POST endpoint behavior.
