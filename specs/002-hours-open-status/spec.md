# Feature Specification: Hours & Open-Status Indicator

**Feature Branch**: `002-hours-open-status`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Hours and open-status indicator subsystem (homepage). Reverse-spec daySelect() and untilClose()... DOCUMENT AND FIX a confirmed legacy bug (thurs-sat vs thur-sat id mismatch) as an explicit spec deviation. No other behavior changes."

> **Specification intent**: Behavior-anchored current-state spec (Constitution Principle II) for the homepage's
> hours/open-status indicator. It documents existing behavior **and** corrects one confirmed legacy bug as an
> explicit, reviewed deviation (per the project bug-fix policy). The **corrected** behavior is the verification
> oracle — the legacy code cannot serve as the oracle for the broken Thursday–Saturday path because it throws.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor sees today's hours highlighted (Priority: P1)

A visitor opens the homepage. The hours block lists two rows — "Sunday-Wednesday: 11am-8pm" and
"Thursday-Saturday: 11am-9pm". The row covering **today** is underlined so the visitor immediately sees which
schedule applies.

**Why this priority**: Knowing today's hours is the primary purpose of the hours block; the highlight is what
makes it glanceable.

**Independent Test**: Load the homepage with the local clock set to each weekday and confirm the correct row is
underlined (Sun–Wed → first row; Thu–Sat → second row).

**Acceptance Scenarios**:

1. **Given** today is Sunday, Monday, Tuesday, or Wednesday, **When** the homepage loads, **Then** the
   "Sunday-Wednesday" row is underlined and the "Thursday-Saturday" row is not.
2. **Given** today is Thursday, Friday, or Saturday, **When** the homepage loads, **Then** the
   "Thursday-Saturday" row is underlined and the "Sunday-Wednesday" row is not. *(This path is currently broken
   in legacy — see FR-005.)*

---

### User Story 2 - Visitor sees whether the café is open right now (Priority: P1)

The hours heading shows a status indicator. When the café is currently open, the indicator reads "Open"
(localized to the active language); otherwise it reads "Closed".

**Why this priority**: "Are they open right now?" is the single most common question a restaurant visitor has.

**Independent Test**: Load the homepage at representative times for each day group and confirm the indicator
reads Open within open hours and Closed outside them, in the active language.

**Acceptance Scenarios**:

1. **Given** today is Sun–Wed and the local time is within 11:00–20:59, **When** the homepage loads, **Then**
   the indicator reads the open label for the active language.
2. **Given** today is Thu–Sat and the local time is within 11:00–21:59, **When** the homepage loads, **Then**
   the indicator reads the open label. *(Currently never reached in legacy on Thu–Sat — see FR-005.)*
3. **Given** the current time is outside the open window for today, **When** the homepage loads, **Then** the
   indicator reads "Closed".

---

### User Story 3 - Status shown in the visitor's selected language (Priority: P2)

When the café is open, the open label matches the active language: English "Open", Spanish "Abierto",
Anglo-Saxon "Openede", Klingon "poSmoHta'".

**Why this priority**: Multilingual parity is a site-wide principle (Constitution Principle IV), but the core
open/closed signal (P1) already delivers the essential value.

**Independent Test**: For each language, load the homepage during open hours and confirm the matching open
label appears.

**Acceptance Scenarios**:

1. **Given** the active language is Spanish and the café is open, **When** the homepage loads, **Then** the
   indicator reads "Abierto".

---

### Edge Cases

- **Exactly at open boundary (11:00)**: the café counts as open from hour 11 onward (minutes are not consulted).
- **Closing-hour boundary**: open through the entire closing hour — Sun–Wed open while the hour is ≤ 20 (i.e.
  until 20:59), Thu–Sat while the hour is ≤ 21 (until 21:59). *(Recorded as current behavior; this extends one
  hour past the displayed "8pm"/"9pm". Not changed by this feature — see Assumptions.)*
- **Closed state is the default**: the indicator's markup starts as "Closed"; the system only ever switches it
  to the open label when open, and never explicitly back to "Closed" within a single page load. Because each
  visit loads the page fresh, this is sufficient. (Current behavior, preserved.)
- **Thursday–Saturday legacy crash**: in the legacy code the day-row lookup targets a non-existent element on
  Thu–Sat, throwing an error that prevents both the underline and the open-status update. This is corrected by
  this feature (FR-005); it is the one intentional behavior change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On homepage load, the system MUST underline exactly the hours row corresponding to today: the
  Sunday–Wednesday row when the current day is Sunday, Monday, Tuesday, or Wednesday; the Thursday–Saturday row
  when the current day is Thursday, Friday, or Saturday.
- **FR-002**: The system MUST determine "currently open" from the local day and hour: open when the hour is in
  11–20 (inclusive) on Sunday–Wednesday, and 11–21 (inclusive) on Thursday–Saturday.
- **FR-003**: When currently open, the system MUST set the status indicator to the open label for the active
  language (English "Open", Spanish "Abierto", Anglo-Saxon "Openede", Klingon "poSmoHta'"). When not open, the
  indicator MUST remain "Closed".
- **FR-004**: The hours/open-status logic MUST run automatically on homepage load (no user action required).
- **FR-005** *(intentional fix, deviation from legacy)*: The Thursday–Saturday day-row underline and the
  open-status update MUST work without error on Thursday, Friday, and Saturday. *(Root cause: the script looks
  up the day row by an identifier that does not match the homepage markup, throwing on Thu–Sat and aborting the
  rest of the routine. The fix aligns the identifiers; no other behavior changes.)*
- **FR-006**: The system MUST NOT throw an unhandled error during the hours/open-status routine on any day of
  the week.

### Key Entities *(include if feature involves data)*

- **Day group**: Sunday–Wednesday or Thursday–Saturday — determines which hours row is highlighted and which
  open-hours window applies.
- **Open window**: per day group, the inclusive hour range during which the café is considered open
  (Sun–Wed 11–20, Thu–Sat 11–21).
- **Open label**: the localized word shown when open, indexed by active language (en/es/ang/tlh).
- **Status indicator**: the markup element whose text reflects open/closed; defaults to "Closed".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For all 7 days of the week, loading the homepage underlines the correct hours row and produces
  **no JavaScript error** (closing the legacy Thu–Sat gap — verified across every weekday).
- **SC-002**: The open/closed indicator is correct at representative in-window and out-of-window times for both
  day groups (open shown only within the defined windows).
- **SC-003**: For each of the four languages, the open label matches the expected word when open.
- **SC-004**: Aside from the Thursday–Saturday fix (FR-005), the rendered hours block and indicator behavior
  are unchanged from legacy on the paths that legacy handled correctly (Sunday–Wednesday).

## Assumptions

- **Bug-fix scope**: The only intentional behavior change is FR-005 (making Thu–Sat work). The closing-hour
  boundary extending one hour past the displayed time, and the "never reset to Closed within a load" behavior,
  are preserved as-is — they are existing behavior, not clear defects, and are out of scope for this feature.
- **Clock source**: "Now" is the visitor's local device clock (the café's timezone is assumed to match the
  visitor's, as in legacy). No timezone normalization is introduced.
- **Active language**: The homepage loads with English active (set during page bootstrap). Other languages are
  exercised through the same code path when the active language differs. Language bootstrap itself is a
  separate subsystem.
- **Out of scope**: The seasonal dispatch that shares the same entry routine (birthday on Jan 17, Halloween in
  October), the image slideshow, and the language/navigation bootstrap are separate subsystems, only
  cross-referenced here. This spec covers only the hours-row highlight and the open-status indicator.

## Dependencies

- Runs as part of the homepage load/bootstrap routine; depends on the active-language value being set before
  the open label is chosen.
- Requires the homepage hours markup (two labelled day rows and a status indicator element) to be present.
