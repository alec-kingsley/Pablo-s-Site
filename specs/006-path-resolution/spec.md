# Feature Specification: Portable Path Resolution (`pathFix`)

**Feature Branch**: `006-path-resolution`

**Created**: 2026-06-19

**Status**: Draft

**Input**: Reverse-spec the `pathFix` utility in `script.js` — the shared helper that rewrites root-absolute
asset/link references so they work from any page depth (Constitution Principle V).

> **Specification intent**: Behavior-anchored current-state spec (Constitution Principle II). `pathFix` works
> correctly — no bug, no dead code — so this is a **verify-only** feature; no code change. Current behavior is
> the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assets load correctly regardless of page depth (Priority: P1)

Code that needs a site asset by its root-absolute path (e.g. an image or script under the site root) passes that
path through `pathFix`, which returns a reference that resolves to the correct site-root location no matter how
deeply nested the current page is.

**Why this priority**: The same files are served from multiple directory depths (home, `menu/`, language
variants) and via different hosts; without depth-correct resolution, assets referenced from inner pages would
break.

**Independent Test**: Call `pathFix('/images/x')` from pages at different depths and confirm each returned
reference resolves to the same site-root path `/images/x`.

**Acceptance Scenarios**:

1. **Given** a root-absolute path beginning with `/`, **When** `pathFix` is called from any page, **Then** it
   returns a reference that resolves to that path relative to the site root.
2. **Given** the page is nested one directory deeper, **When** `pathFix` is called, **Then** the returned
   reference still resolves to the same site-root path.

---

### User Story 2 - Misuse is surfaced, not silently mangled (Priority: P3)

If `pathFix` is called with a path that does not start with `/`, it leaves the path unchanged and logs an error
to the console (a developer signal that the contract was violated).

**Independent Test**: Call `pathFix('relative/x')` and confirm it returns the input unchanged and logs an error.

**Acceptance Scenarios**:

1. **Given** a path not starting with `/`, **When** `pathFix` is called, **Then** the input is returned
   unchanged and an error is logged.

### Edge Cases

- **Depth scaling**: `pathFix` prepends one `/..` per path segment of the current page beyond the first; the
  resulting `/../…/X` string is resolved by the browser back to the site-root path `/X` (leading `/..` is
  clamped to root). On the production root-domain deployment every depth therefore resolves to the same
  `/X`.
- **Non-root input**: returns the input verbatim and logs an error; it does not throw.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Given a path beginning with `/`, `pathFix` MUST return a reference that resolves to that path
  relative to the site root, correct for the current page's directory depth.
- **FR-002**: `pathFix` MUST scale with page depth (one `/..` prefix per directory level beyond the site root).
- **FR-003**: Given a path not beginning with `/`, `pathFix` MUST return the input unchanged and log an error;
  it MUST NOT throw.

### Key Entities *(include if data involved)*

- **Root-absolute path**: an input like `/images/x.webp` or `/bday.js` to be made depth-portable.
- **Page depth**: the number of directory segments in the current page's path, which determines how many `/..`
  prefixes are applied.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pathFix('/images/x')` resolves to `/images/x` from both the homepage (depth → one `/..`) and a
  nested page like `menu/` (depth → two `/..`).
- **SC-002**: `pathFix('relative/x')` returns `'relative/x'` unchanged (error logged, no throw).
- **SC-003**: Behavior is unchanged from legacy (verify-only; no code change).

## Assumptions

- The site is deployed at a domain root (GitHub Pages custom domain), so resolved root-absolute references are
  correct. The `/..` mechanism additionally targets nested/imported hosting (e.g. Replit). This is recorded as
  current behavior, not changed.
- **Consumers**: `pathFix` is used by the seasonal features (birthday/Halloween) for assets and injected
  scripts. The menu image renderer (`addImg`) contains its **own inline** copy of the same depth logic rather
  than calling `pathFix` — noted as existing duplication, addressed (if at all) when the seasonal/menu specs are
  revisited, not here.
- **Out of scope**: the seasonal features that call `pathFix` are a separate subsystem; this spec covers only
  the utility's contract.
