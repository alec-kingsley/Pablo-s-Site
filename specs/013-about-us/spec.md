# Feature Specification: About Page

**Feature Branch**: `013-about-us` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the About page (`about_us/index.html` + its Spanish twin `es/quienes_somos/`) and fix a
mobile-nav parity gap.

> Behavior-anchored spec (Constitution Principle II) with one documented deviation (FR-002) per the bug-fix
> policy.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor reads the About page and navigates (Priority: P2)

A visitor opens the About page and can open the mobile navigation by tapping the mobile logo (as on the rest of
the site), as well as via the hamburger icon.

**Acceptance Scenarios**:

1. **Given** the About page on a narrow screen, **When** the visitor taps the mobile logo, **Then** the mobile
   nav toggles open/closed — *previously the EN About page's mobile logo had no handler, unlike the Spanish twin
   and the rest of the site* (FR-002).

### Edge Cases

- The hamburger icon also toggles the nav (unchanged); the fix adds the same toggle to the mobile logo for
  parity.

## Requirements *(mandatory)*

- **FR-001**: The About page MUST present the static about content and the shared navigation (desktop + mobile).
- **FR-002** *(fix)*: The mobile logo (`#navIconMobile`) MUST toggle the mobile nav on tap (add
  `onclick="switchDisp()"`), matching the desktop logo, the Spanish twin (`es/quienes_somos`), and the rest of
  the site.

## Success Criteria *(mandatory)*

- **SC-001**: Tapping the About page's mobile logo toggles the mobile nav open then closed (verified:
  ""→block→none).
- **SC-002**: Other About page behavior is unchanged.

## Assumptions / Flags

- **Flag (i18n, low priority)**: the double-click logo splash easter egg (from the shared `script.js`) shows
  English text on the Spanish About page (and all localized pages). This is a hidden easter egg, not primary
  content; left English-only and documented per the i18n decision (not fixed here).
- Verification clicks `#navIconMobile` on the live About page and asserts the mobile-nav toggle; `script.js`
  (which defines `switchDisp`) is loaded by the page.
