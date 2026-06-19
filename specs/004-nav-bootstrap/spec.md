# Feature Specification: Navigation & Homepage Bootstrap

**Feature Branch**: `004-nav-bootstrap`

**Created**: 2026-06-19

**Status**: Draft

**Input**: Reverse-spec the homepage bootstrap (`openFunc`) and the shared navigation interactions
(`switchDisp`, `buttonPopupGen`, `scrollFunction`) in `script.js`.

> **Specification intent**: Behavior-anchored current-state spec (Constitution Principle II). All four behaviors
> were verified empirically and found correct — no bug, no dead code — so this is a **verify-only** feature; no
> code change. The current behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage initializes on load (Priority: P1)

When the homepage loads, it bootstraps the page: sets the active language, initializes the photo carousel, and
runs the hours/open-status routine.

**Why this priority**: Without bootstrap the page shows none of its dynamic content.

**Independent Test**: Load the homepage and confirm the carousel and hours/open-status are populated (their own
specs cover the details; here we confirm the bootstrap dispatches them).

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** bootstrap runs, **Then** the active language is set, the carousel
   shows its initial state, and the hours row + open-status are updated.

---

### User Story 2 - Visitor toggles the mobile navigation menu (Priority: P1)

On a narrow screen, tapping the mobile menu control shows the navigation links; tapping again hides them.

**Independent Test**: Invoke the mobile-nav toggle and confirm the mobile nav container shows, then hides, on
alternate activations.

**Acceptance Scenarios**:

1. **Given** the mobile nav is hidden, **When** the toggle is activated, **Then** it becomes visible; **When**
   activated again, **Then** it hides.

---

### User Story 3 - Visitor opens the "Order Online" popup (Priority: P2)

Clicking "Order Online" reveals a popup of ordering links; clicking again hides it. While the popup is open the
button's bottom corners are squared to visually connect with the popup; when closed they are rounded again.

**Independent Test**: Activate the order button repeatedly and confirm the popup visibility and the button's
corner rounding stay in sync (open → squared, closed → rounded).

**Acceptance Scenarios**:

1. **Given** the popup is hidden and the button rounded, **When** the order button is clicked, **Then** the
   popup shows and the button's corners square off; **When** clicked again, **Then** the popup hides and the
   corners round again.

---

### User Story 4 - Navbar shrinks as the visitor scrolls (Priority: P2)

When the page is scrolled down past a small threshold, the navbar tightens its padding and the logo shrinks;
scrolling back to the top restores the full padding and logo size.

**Independent Test**: Scroll past the threshold and confirm the navbar padding and logo shrink; scroll back to
the top and confirm they restore.

**Acceptance Scenarios**:

1. **Given** the page is at the top, **When** scrolled past the threshold, **Then** the navbar padding tightens
   and the logo shrinks; **When** scrolled back to the top, **Then** both restore.

---

### Edge Cases

- **First toggle from default state**: the mobile-nav and order-popup toggles open on first activation
  regardless of their initial CSS-driven display (the inline display starts unset, so the first activation
  always opens). Current behavior, preserved.
- **Corner rounding relies on value normalization**: setting the button corner radius to `0` reads back as
  `0px`, which the toggle compares against — so the open/closed corner state stays in sync across repeated
  clicks. (Verified current behavior; documented so a future edit doesn't break the comparison.)
- **Shared nav across pages**: the navbar/logo elements the scroll handler needs exist on the homepage **and**
  inner pages (e.g. the menu page), so scrolling does not error on any page that loads the shared script.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On homepage load, the bootstrap MUST set the active language, initialize the carousel, and run the
  hours/open-status routine (delegating to those subsystems).
- **FR-002**: The mobile-navigation toggle MUST show the mobile nav when hidden and hide it when shown.
- **FR-003**: The order-online toggle MUST show the ordering popup when hidden and hide it when shown.
- **FR-004**: While the ordering popup is open the order button's corners MUST be squared; while closed they MUST
  be rounded — the corner state staying in sync with popup visibility across repeated activations.
- **FR-005**: On scroll past the threshold the navbar padding MUST tighten and the logo MUST shrink; at the top
  both MUST restore to full size.
- **FR-006**: The scroll handler MUST NOT throw on any page that loads the shared script (the elements it
  references exist on the homepage and inner pages).

### Key Entities *(include if data involved)*

- **Bootstrap entry**: the homepage load routine that sequences language → carousel → hours/open-status.
- **Mobile nav**: a container toggled visible/hidden by the mobile menu control.
- **Order popup**: a links container toggled visible/hidden, paired with the order button's corner rounding.
- **Navbar/logo**: elements resized between a "full" (top) and "compact" (scrolled) state by the scroll handler.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Loading the homepage initializes carousel + hours/open-status with no error (bootstrap dispatches).
- **SC-002**: The mobile-nav and order-popup toggles each alternate visible/hidden on successive activations.
- **SC-003**: The order button's corner rounding stays in sync with the popup (open → squared, closed → rounded)
  across at least three activations.
- **SC-004**: Scrolling past the threshold compacts the navbar/logo and returns to full at the top, with no
  scroll error on the homepage or the menu page. Behavior unchanged from legacy (verify-only; no code change).

## Assumptions

- The navbar/logo/mobile-nav/order-popup markup is present on the pages that use these behaviors (verified on the
  homepage and menu page).
- **Out of scope**: the carousel, hours/open-status, and language switching are separate subsystems — the
  bootstrap only dispatches them; their behavior is specified elsewhere. Seasonal features and easter eggs are
  also separate.
