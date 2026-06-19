# Feature Specification: Homepage Image Slideshow

**Feature Branch**: `003-slideshow`

**Created**: 2026-06-19

**Status**: Draft

**Input**: Reverse-spec the homepage 3-up image carousel (`setSlide`, `addSlides`, `loopSlide` in `script.js`).

> **Specification intent**: Behavior-anchored current-state spec (Constitution Principle II). The carousel code
> is clean — no bug and no dead code surfaced — so this feature **documents and verifies** the existing
> behavior; no code change is required (a valid Principle II outcome). The current render is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor sees a featured-photo carousel on load (Priority: P1)

On the homepage, a three-up image strip shows the previous, current, and next food photos with a caption under
the current (middle) one. On load it starts on the first photo, with the last photo to its left and the second
to its right (wraparound).

**Why this priority**: The carousel is the homepage's primary visual showcase of the food.

**Independent Test**: Load the homepage and confirm the middle image is the first photo, left is the last,
right is the second, and the caption matches the middle image's description.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** the carousel initializes, **Then** the middle slide shows the first
   photo, the left slide shows the last photo, the right slide shows the second photo, and the caption equals
   the middle photo's alt text.

---

### User Story 2 - Visitor navigates next/previous with wraparound (Priority: P1)

Clicking the next (›) or previous (‹) control advances or rewinds the carousel by one, wrapping around at the
ends. The middle slide, its neighbors, and the caption update accordingly.

**Why this priority**: Browsing the photos is the carousel's core interaction.

**Independent Test**: From the initial state, click next and confirm the middle advances to the second photo;
from the first photo click previous and confirm the middle wraps to the last photo.

**Acceptance Scenarios**:

1. **Given** the middle shows photo *k*, **When** next is clicked, **Then** the middle shows photo *k+1* (wrapping
   to the first after the last), with left/right neighbors and caption updated.
2. **Given** the middle shows the first photo, **When** previous is clicked, **Then** the middle wraps to the
   last photo.

---

### User Story 3 - Visitor jumps to a photo from the thumbnail strip (Priority: P2)

Clicking a thumbnail in the photo strip sets the carousel to that photo (1-based position), updating the three
slides and caption, and marking that thumbnail active.

**Why this priority**: Direct selection is a convenience on top of next/prev (P1) browsing.

**Independent Test**: Click the 3rd thumbnail and confirm the middle slide shows the 3rd photo and that
thumbnail is marked active.

**Acceptance Scenarios**:

1. **Given** the thumbnail strip, **When** the visitor clicks the *n*-th thumbnail, **Then** the middle slide
   shows the *n*-th photo and that thumbnail receives the active marker (the previously active one loses it).

---

### Edge Cases

- **Wraparound at both ends**: position before the first wraps to the last; position after the last wraps to the
  first. Indexing is 1-based at the interaction layer (thumbnail *n* → photo *n*).
- **Single active thumbnail**: exactly one thumbnail carries the active marker at a time; switching moves it.
- **Thumbnail count = slide count**: the thumbnail strip and the underlying photo set are the same collection
  (6 today); the carousel relies on these counts matching.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On homepage load, the carousel MUST initialize to the first photo as the middle slide, with the
  last photo as the left slide and the second photo as the right slide (wraparound neighbors).
- **FR-002**: The caption MUST always show the description (alt text) of the current middle photo.
- **FR-003**: The next control MUST advance the carousel by one photo and the previous control MUST rewind by
  one, each wrapping around at the ends.
- **FR-004**: Selecting a thumbnail MUST set the carousel to that thumbnail's 1-based photo position.
- **FR-005**: Exactly one thumbnail MUST carry the active marker at any time, moving to the currently-selected
  photo.
- **FR-006**: The carousel MUST wrap correctly: the neighbor before the first photo is the last photo, and the
  neighbor after the last photo is the first photo.

### Key Entities *(include if feature involves data)*

- **Photo set**: the ordered list of food images (and their alt-text captions) shown in the carousel; today 6
  photos, sourced as static homepage markup.
- **Carousel position**: the index of the current middle photo; drives the left (position−1) and right
  (position+1) neighbors with wraparound.
- **Thumbnail**: a clickable image in the strip mapped 1:1 to a photo; carries the active marker when selected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On load, the three slides and caption match the documented initial state (middle=first, left=last,
  right=second, caption=first photo's alt) for the current 6-photo set.
- **SC-002**: Next and previous each move the carousel by exactly one with correct wraparound at both ends.
- **SC-003**: Selecting any thumbnail *n* shows the *n*-th photo as the middle slide and marks that thumbnail
  active, with exactly one active thumbnail at all times.
- **SC-004**: Behavior is unchanged from legacy (this feature documents and verifies; no code change).

## Assumptions

- The photo set is static homepage markup (not sheet-driven); count and order come from the page.
- The carousel relies on the thumbnail collection and the photo collection having equal counts (true today: 6).
  This is recorded as a contract, not changed.
- **Out of scope**: the navigation bar, hours/open-status, language bootstrap, and seasonal features are
  separate subsystems; this spec covers only the image carousel (`setSlide`/`addSlides`/`loopSlide`).
