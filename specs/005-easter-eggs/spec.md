# Feature Specification: Logo Easter-Egg Splash Text

**Feature Branch**: `005-easter-eggs`

**Created**: 2026-06-19

**Status**: Draft

**Input**: Reverse-spec the logo double-click easter egg (`easterEgg`, `randomSplash`, the `randSplash` global) in
`script.js`. Fix a confirmed month-mismatch bug as a documented deviation.

> **Specification intent**: Behavior-anchored current-state spec (Constitution Principle II) with ONE
> intentional, documented deviation (FR-004: align the Halloween splash month with the Halloween decorations),
> per the project bug-fix policy. The corrected behavior is the oracle for the seasonal branch; the everyday
> branch is unchanged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Curious visitor double-clicks the logo (Priority: P2)

Double-clicking the site logo pops up a short, playful message ("splash text"). Repeated double-clicks show
different messages, cycling through the whole set in a random order without repeating, then reshuffling.

**Why this priority**: A delightful hidden touch — non-essential but part of the site's personality.

**Independent Test**: Confirm the rotation function returns the full set of messages as a no-repeat random
ordering, and that exhausting the set triggers a reshuffle on the next double-click.

**Acceptance Scenarios**:

1. **Given** the logo, **When** it is double-clicked, **Then** a single splash message is shown.
2. **Given** repeated double-clicks, **When** each fires, **Then** each shows a distinct message until the set is
   exhausted, after which the set reshuffles and continues.

---

### User Story 2 - Seasonal (Halloween) splash messages (Priority: P3)

During the Halloween season, the splash set additionally includes Halloween-themed messages, matching the site's
October Halloween decorations.

**Why this priority**: A seasonal flourish layered on the base easter egg.

**Independent Test**: With the date in October, the splash set includes the Halloween messages; outside October
it does not.

**Acceptance Scenarios**:

1. **Given** the date is in October, **When** the splash set is generated, **Then** it includes the Halloween
   messages (in addition to the base set). *(Previously these appeared in September — corrected, see FR-004.)*
2. **Given** the date is outside October, **When** the splash set is generated, **Then** it contains only the
   base messages.

### Edge Cases

- **Set exhaustion**: once every message has been shown, the next double-click regenerates a fresh shuffled set.
- **Random order, no repeats within a cycle**: each generated set is a permutation of the message list (no
  duplicates within a cycle).
- **Placeholder-looking message preserved**: the base set includes a "Add a description about this category"
  string that reads like leftover placeholder text. It is retained as current behavior (a flagged observation —
  not changed by this feature, since its inclusion may be intentional meta-humor).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Double-clicking the logo MUST display one splash message.
- **FR-002**: Successive double-clicks MUST cycle through the full message set in a random, no-repeat order
  within a cycle, regenerating a fresh shuffled set once the current one is exhausted.
- **FR-003**: The everyday message set MUST be the base list of playful messages.
- **FR-004** *(intentional fix, deviation from legacy)*: Halloween-themed messages MUST be added to the set
  during **October** (matching the site's October Halloween decorations). *(Root cause: the seasonal check used
  September instead of October, so the Halloween messages appeared a month before the decorations and never
  alongside them. The fix aligns the month; no other behavior changes.)*

### Key Entities *(include if data involved)*

- **Splash message set**: the ordered/shuffled list of messages; base list always, plus Halloween messages in
  October.
- **Rotation state** (`randSplash`): the remaining shuffled messages for the current cycle; popped per
  double-click, regenerated when empty.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each generated set is a no-repeat permutation of the appropriate message list (verified for a
  non-seasonal month: 12 unique messages).
- **SC-002**: In October the set includes the 4 Halloween messages (16 total); in September and November it does
  not (12 total) — closing the legacy month-mismatch.
- **SC-003**: Aside from the month fix (FR-004), behavior is unchanged from legacy (the everyday rotation is
  identical).

## Assumptions

- The splash is shown via a simple browser alert on double-click of the logo element (present on pages with the
  shared nav).
- **Out of scope / deferred**: `popUpGen` (a popup helper defined in `script.js`) is NOT part of this easter
  egg — it is used by the contact form and is **duplicated** in `surveyBuilder.js`. It will be specified with
  the form/popup subsystem (the duplication is flagged there). The October Halloween *decorations*
  (`halloween()` + `halloween.js`) and the birthday easter egg are a separate seasonal subsystem; this spec only
  covers the logo splash-text rotation.
