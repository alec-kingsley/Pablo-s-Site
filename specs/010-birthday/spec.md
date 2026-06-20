# Feature Specification: Birthday Easter Egg

**Feature Branch**: `010-birthday` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the date-gated birthday easter egg (`script.js` `birthday()` + `bday.js` confetti) and
fix two confirmed defects.

> Behavior-anchored spec (Constitution Principle II) with two documented deviations (FR-004, FR-005) per the
> bug-fix policy. Corrected behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors see a birthday celebration on Pablo's birthday (Priority: P2)

On January 17 (Pablo Taura's birthday), any homepage shows a full-screen confetti animation, a rotated splash
message wishing Pablo a happy birthday in the active language, and the hero image swapped to a birthday image.

**Acceptance Scenarios**:

1. **Given** the date is Jan 17, **When** a homepage loads, **Then** a confetti canvas appears, a non-empty
   birthday splash message shows in the active language, and the hero image is the birthday image.
2. **Given** any other date, **When** a homepage loads, **Then** no birthday effects appear (graceful
   degradation).

### User Story 2 - The birthday message is shown in every language (Priority: P2)

The splash message appears in the active language on all four homepages (English, Spanish, Old English,
Klingon), with the Klingon variant using the Klingon font.

**Acceptance Scenarios**:

1. **Given** the Old-English homepage (lang 2), **When** the birthday fires, **Then** the splash shows an
   Old-English message — *previously lang 2 had no branch and rendered an empty styled box* (FR-004).
2. **Given** the Klingon homepage (lang 3), **When** the birthday fires, **Then** the splash uses the Klingon
   font (class `kli`).

### Edge Cases

- **Wide viewports**: confetti pieces always have a finite size and speed — *previously sizes ≥15px were left
  undefined (NaN speed), so some pieces didn't move/draw on wide screens* (FR-005).
- Date gate is `getMonth()==0 && getDate()==17`; off-date loads do nothing.

## Requirements *(mandatory)*

- **FR-001**: On Jan 17, the birthday MUST create a confetti canvas, a splash message, and swap the hero image.
- **FR-002**: The splash MUST use the active language's message; Klingon MUST use the Klingon font class.
- **FR-003**: On any other date, the birthday MUST NOT fire.
- **FR-004** *(fix)*: The splash MUST be non-empty for **all four** languages including Old English (lang 2),
  which previously had no message branch.
- **FR-005** *(fix)*: Every confetti piece MUST have a finite size and speed on all viewport widths (the size is
  now always assigned, min 15px).

### Key Entities *(include if data involved)*

- **Splash message**: per-language birthday greeting (en/es/ang/tlh).
- **Confetti**: animated pieces with position, rotation, color (Cuban-flag palette), size (≥15px), and speed.

## Success Criteria *(mandatory)*

- **SC-001**: On Jan 17, for each of the four languages, the splash message is non-empty (verified: en/es/ang/tlh
  all render text; lang 2 = "Wýsc úrum hláforde, Pablo Taura, glædne gebyrddæg tódæg!").
- **SC-002**: Klingon splash carries the `kli` class; the canvas and birthday hero image appear for all
  languages.
- **SC-003**: Confetti pieces always have finite numeric size/speed (no NaN), verified by construction; the
  fixed source uses `this.size = size < 15 ? 15 : size`.
- **SC-004**: Off-date loads create no birthday effects.

## Assumptions / Flags

- **Owner TODO (translation review)**: the Old-English splash string is a drafted rendering, flagged in-code for
  the owner/translator (Alec) to confirm — per the i18n decision (provide content + flag rather than leave
  blank). Gloss recorded inline in `script.js`.
- Verification stubs `Date` to Jan 17 and calls `birthday()` per language; the confetti animation itself
  (requestAnimationFrame) is not asserted, only the synchronous DOM effects and the Confetti size invariant.
