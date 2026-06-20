# Feature Specification: Online Order Page

**Feature Branch**: `007-order-page` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec `order/index.html` (the online-ordering iframe wrapper) and fix two confirmed defects.

> Behavior-anchored spec (Constitution Principle II) with TWO documented deviations (FR-002, FR-003) per the
> bug-fix policy. Both are clear defects; the corrected behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor orders online (Priority: P1)

A visitor opens the order page and sees the Clover online-ordering storefront filling the screen, ready to use.

**Why this priority**: This is the page's entire purpose and a direct revenue path.

**Acceptance Scenarios**:

1. **Given** the order page loads, **When** it renders, **Then** the ordering iframe fills the full browser
   viewport (no tiny embedded box, no border).

### Edge Cases

- **Legacy defect**: the iframe had no sizing, so it rendered at the intrinsic default (~300×150px), making the
  storefront nearly unusable. Corrected (FR-002).
- The external storefront content is served by Clover; this page only embeds and sizes it.

## Requirements *(mandatory)*

- **FR-001**: The order page MUST embed the Clover online-ordering storefront for Pablo's Havana Café.
- **FR-002** *(fix)*: The ordering iframe MUST fill the full browser viewport (width and height 100%, no border,
  no body margin), instead of the legacy unsized ~300×150px box.
- **FR-003** *(fix)*: The page MUST have a meaningful document title ("Order Online | Pablo's Havana Cafe")
  instead of the placeholder "Document".

## Success Criteria *(mandatory)*

- **SC-001**: The iframe's rendered height equals the viewport height (verified: 730px iframe == 730px viewport;
  legacy default would be ~150px) and its width is 100% of the viewport.
- **SC-002**: The document title is the meaningful order-online title (not "Document").

## Assumptions

- Verification measures the iframe element's box vs the viewport (the external Clover content need not load in
  the test harness). Out of scope: the storefront's own content/behavior (Clover-hosted).
