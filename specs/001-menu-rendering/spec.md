# Feature Specification: Menu Rendering Subsystem

**Feature Branch**: `001-menu-rendering`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Menu rendering subsystem: reverse-specify the existing runtime behavior of menuBuilder.js... Capture the current observable behavior exactly (no new features)... This is a documentation-of-current-state spec, not a redesign."

> **Specification intent**: This is a **behavior-anchored, current-state specification** (per Constitution
> Principle II). It documents what the menu page does **today** so future refactors can preserve it exactly.
> It introduces **no new behavior**. Anything that reads like a bug or quirk is recorded as current behavior,
> not endorsed as desired — changes to it must come as explicit, reviewed edits to this spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer views the current menu (Priority: P1)

A café customer opens the menu page. Within a moment, a loading indicator is replaced by the restaurant's
menu: one or more selectable menu tabs (e.g. Food, Drink, Dessert), each showing categories with descriptions,
items with descriptions and prices, occasional notes, and occasional photos. The first menu tab is shown
selected by default.

**Why this priority**: This is the entire purpose of the page — without it the customer sees nothing but a
"Loading..." message. It is the minimum viable behavior.

**Independent Test**: Load the menu page with a reachable source sheet and confirm the loading indicator
disappears and the first menu's categories, items, and prices render correctly.

**Acceptance Scenarios**:

1. **Given** the source sheet is reachable and contains at least one menu, **When** the page finishes loading,
   **Then** the "Loading..." indicator is removed and the first menu tab's content is displayed.
2. **Given** multiple menu tabs exist (Food, Drink, Dessert), **When** the page finishes loading, **Then** the
   first menu tab is shown and the others are hidden until selected.
3. **Given** an item row has a name, description, and price, **When** that item renders, **Then** the name,
   description, and price each appear in the item's row.
4. **Given** a category row precedes its items, **When** the menu renders, **Then** the category title and its
   description appear above the items that follow it.

---

### User Story 2 - Customer switches between menu tabs (Priority: P2)

The customer taps a different menu tab (e.g. from Food to Drink). The selected tab's content is shown, the
others are hidden, and the active tab is visually highlighted.

**Why this priority**: A multi-menu restaurant needs tab switching for the menu to be usable, but a single
default menu already delivers core value (covered by P1).

**Independent Test**: With at least two menus present, click each tab and confirm only that tab's content is
visible and its button is highlighted.

**Acceptance Scenarios**:

1. **Given** menus Food and Drink exist and Food is shown, **When** the customer selects Drink, **Then** Drink's
   content becomes visible, Food's content is hidden, and the Drink tab is highlighted.

---

### User Story 3 - Customer views the menu in a selected language (Priority: P2)

The menu's text (item names, descriptions, category titles and descriptions, notes) is shown in the language
indicated by the current language setting: English, Spanish, Anglo-Saxon, or Klingon. Prices are shared across
languages. When the language is Klingon, the relevant text is additionally styled with the Klingon font.

**Why this priority**: Multilingual parity is a defining feature of the site (Constitution Principle IV), but a
single-language render already demonstrates the core menu (covered by P1).

**Independent Test**: For each language setting, load the menu and confirm the language-appropriate columns are
used for every text field, and that Klingon additionally applies the Klingon styling class.

**Acceptance Scenarios**:

1. **Given** the language is Spanish, **When** the menu renders, **Then** every item/category/note text comes
   from the Spanish columns while prices are unchanged.
2. **Given** the language is Klingon, **When** the menu renders, **Then** text comes from the Klingon columns
   and the Klingon styling class is applied to those text elements.

---

### User Story 4 - Staff maintain the menu through the source sheet (Priority: P3)

A non-developer staff member edits the published source spreadsheet to add, remove, reprice, hide, annotate, or
illustrate menu content. On the next page load the changes are reflected, with no code change required.

**Why this priority**: This is the maintenance workflow that makes the data-driven design valuable
(Constitution Principle III), but it is observed through the same render the customer sees (P1).

**Independent Test**: Make a representative edit to each row type in the sheet (item, category, menu, note,
image, hidden, multi-price) and confirm the rendered menu reflects each edit on reload.

**Acceptance Scenarios**:

1. **Given** a row's `hidden` column is set to `yes`, **When** the menu renders, **Then** that row contributes
   nothing to the output.
2. **Given** a row uses the multi-price continuation syntax, **When** the item renders, **Then** the combined
   size/price string appears as a single item price.

---

### Edge Cases

- **First data row is skipped**: Parsing begins at the second data row; the first data row of the sheet never
  renders. (Current behavior — the first row is treated as a reserved/instructions row.)
- **Empty rows**: A row whose selected-language name and category are both empty is skipped.
- **Hidden rows**: A row with `hidden` = `yes` is skipped before any element is created.
- **Source unreachable / parse fails**: The "Loading..." indicator remains and no menu content appears.
  (Current behavior — there is no explicit error message or retry.)
- **No menus defined**: If no `menu` row exists, no menu tab is created, the default-selection step does not run,
  and the "Loading..." indicator is **not** removed (it is only removed when a menu tab is created).
- **Multi-price continuation across the last row**: Continuation rows are only consumed while a following row
  exists; a continuation that would run past the end of the data is not read.
- **Continuation detection uses the English name column** regardless of the active language: the leading-colon
  marker is detected on the English column, while the displayed size label is read from the active language's
  column.
- **Re-removal of the loading indicator**: The loading indicator removal occurs each time a menu tab is created;
  removals after the first have no additional effect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST retrieve menu content at page load from the published source spreadsheet exported
  as comma-separated values, parsing it with a header row so each data row is addressed by named columns.
- **FR-002**: The system MUST begin processing at the second data row, skipping the first data row entirely.
- **FR-003**: The system MUST select all displayed text for each row from the column set matching the active
  language: English, Spanish, Anglo-Saxon, or Klingon (prices excepted, which are language-independent).
- **FR-004**: The system MUST skip any row whose `hidden` column equals `yes`, and any row whose active-language
  name and active-language category are both empty.
- **FR-005**: The system MUST treat the `price` column value `menu` as an instruction to create a new selectable
  menu tab named by the row's active-language name, and MUST make that tab's content the active target for
  subsequent categories and items.
- **FR-006**: The system MUST treat a non-empty active-language category value as an instruction to create a
  category heading (title + description) within the most recently created menu tab.
- **FR-007**: The system MUST treat the `price` column value `note` as an instruction to render a note (a
  title + description block) within the current menu tab, distinct from a priced item.
- **FR-008**: The system MUST treat the `price` column value `image` as an instruction to render an image whose
  source is the row's name and whose caption/alt text is the row's description; root-absolute image sources MUST
  be resolved to work from the page's directory depth.
- **FR-009**: The system MUST render any row with a numeric/textual price that is not one of the sentinel values
  (`menu`, `note`, `image`) as a menu item showing name, description, and price within the current category.
- **FR-010**: The system MUST support multi-price items: when an item row has an empty price and is followed by
  one or more continuation rows whose name begins with a colon (`:`), the system MUST combine the continuation
  rows' size labels (name after the colon) and prices into a single composed price string for that item.
- **FR-011**: The system MUST visually present exactly one menu tab's content at a time: the selected tab's
  content is shown and highlighted; all other tabs' content is hidden and shown un-highlighted.
- **FR-012**: After processing all rows, if at least one menu tab was created, the system MUST select and display
  the first menu tab by default.
- **FR-013**: The system MUST remove the "Loading..." indicator once menu content begins to display.
- **FR-014**: When the active language is Klingon, the system MUST apply the Klingon styling class to the text
  elements it creates (menu tab buttons, category titles/descriptions, item names/descriptions, prices, notes,
  and image captions).
- **FR-015**: The system MUST default the active language to English when the menu page is loaded directly.

### Key Entities *(include if feature involves data)*

- **Source row**: One row of the published spreadsheet. Key columns: `price` (numeric value, empty, or one of the
  sentinels `menu`/`note`/`image`); per-language name columns (`name_en`, `name_es`, `name_ang`, `name_tlh`);
  per-language item-description columns (`nameDesc_*`); per-language category columns (`cat_*`); per-language
  category-description columns (`catDesc_*`); `hidden` (`yes` to omit the row).
- **Menu tab**: A selectable top-level grouping (e.g. Food, Drink, Dessert) created by a `price = menu` row;
  contains categories, items, notes, and images. Exactly one is shown at a time.
- **Category**: A titled, described grouping within a menu tab; subsequent items attach to the most recent
  category.
- **Item**: A named, described, priced entry within a category; may carry a composed multi-size price.
- **Note**: A titled, described informational block within a menu tab (not priced).
- **Image**: A pictured entry with a caption within a menu tab, sourced by path with description as alt text.
- **Active language**: An integer selection — 0 English, 1 Spanish, 2 Anglo-Saxon, 3 Klingon — that determines
  which language columns are read and whether Klingon styling is applied.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A customer loading the menu page with a reachable source sees menu content replace the loading
  indicator on first load, with no manual action required.
- **SC-002**: For a given source sheet, the rendered output is identical before and after any refactor of the
  rendering logic — same menu tabs, categories, items, prices, notes, images, order, and default selection
  (this is the regression bar for Constitution Principle II).
- **SC-003**: Every visible text field renders in the active language for all four languages, with prices
  identical across languages, verified by loading the page once per language.
- **SC-004**: 100% of rows marked hidden, and the reserved first data row, contribute zero visible output.
- **SC-005**: A staff member can add, hide, reprice, annotate (note), illustrate (image), and multi-size-price a
  menu entry entirely through the source sheet, with the change appearing on the next page load and no code
  edit required.

## Assumptions

- **Direct-load language default**: When the menu page is opened directly, the active language is English. Other
  languages are reachable through the same render path when the active language is set to a different value by
  the surrounding page context. (Current behavior: the menu page sets English on script load.)
- **External parsing dependency**: CSV parsing relies on the Papa Parse library, which the menu page currently
  loads from a third-party CDN (PapaParse 5.1.0) rather than from a vendored copy. This is noted as the current
  observed state; it is in tension with Constitution Principle I (vendored dependencies) and is flagged for a
  future, separate decision — it is **out of scope** for this current-state spec.
- **Source availability**: The published spreadsheet export is publicly reachable without authentication at page
  load time; offline/failed-fetch handling beyond "indicator stays visible" is not currently implemented.
- **Trusted source content**: Item/category/note/image text from the sheet is inserted as HTML; the sheet is
  treated as trusted, staff-controlled content. (Recorded as current behavior; security hardening is out of
  scope here.)
- **Scope boundary**: This spec covers only the menu page's data fetch and DOM construction (the behavior in
  `menuBuilder.js` plus the `setMenu` tab-switching it depends on). Navbar, order popup, slideshow, seasonal
  features, and other site behavior are out of scope and will be specified separately.

## Dependencies

- The active-language value and the tab-selection behavior (`setMenu`) are provided by the shared site script
  loaded alongside the menu builder; the menu render depends on both being present.
- A reachable published spreadsheet CSV export is required for any content to appear.
