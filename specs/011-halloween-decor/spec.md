# Feature Specification: Halloween Decoration

**Feature Branch**: `011-halloween-decor` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the date-gated Halloween decoration (`script.js` `halloween()`) and remove the dead
`halloween.js` per the owner decision.

> Behavior-anchored spec (Constitution Principle II) with one documented deviation (FR-003: remove dead code)
> per the owner decision. Observable behavior (the logo swap) is unchanged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors see a Halloween logo in October (Priority: P3)

During October, the homepage nav logo (desktop and mobile) becomes a pumpkin logo. No other visible change.

**Acceptance Scenarios**:

1. **Given** the date is in October, **When** a homepage loads, **Then** both the desktop and mobile nav logos
   are the pumpkin logo.
2. **Given** any other month, **When** a homepage loads, **Then** the logos remain the normal logo.

### Edge Cases

- The Halloween decoration is the logo swap only; the previously-appended `halloween.js` was entirely dead code
  (it only logged to the console and defined never-called theming functions) and is removed (FR-003).
- The logo swap is language-independent (fires the same on all four homepages).

## Requirements *(mandatory)*

- **FR-001**: In October, `halloween()` MUST set both the desktop (`#navIcon`) and mobile (`#navIconMobile`) nav
  logos to the pumpkin logo via depth-portable paths.
- **FR-002**: The decoration MUST run only in October (`getMonth()==9`), via the homepage bootstrap.
- **FR-003** *(fix)*: The dead `halloween.js` MUST NOT be loaded — the `appendChild` of `halloween.js` and the
  unused `path`/`page`/`body` locals are removed; the dead `halloween.js` file is deleted. The only live effect
  (the pumpkin logo swap) is preserved.

## Success Criteria *(mandatory)*

- **SC-001**: In October, both nav logos become `HalloweenLogo.png` (verified).
- **SC-002**: `halloween()` appends **no** `halloween.js` script (verified: script count unchanged; no
  `halloween.js` in the DOM) and does not throw.
- **SC-003**: The pumpkin logo swap behavior is unchanged from legacy (only dead code removed).

## Assumptions / Flags

- **Owner TODO (asset cleanup)**: `images/HalloweenBackground.png` (~28 MB) was referenced only by the
  (now-deleted) commented-out theming code in `halloween.js`, so it is now fully unreferenced. Flagged for
  separate deletion to reclaim repo space (not deleted here, per the decision to handle assets separately).
- Verification stubs the nav/hours DOM and calls `halloween()` directly; the October date gate itself is the
  same `getMonth()==9` check covered by the hours/bootstrap specs.
