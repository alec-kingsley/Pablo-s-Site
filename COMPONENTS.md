# Components

This site uses zero-build, light-DOM **Custom Elements** — standards-only Web Components that need no
bundler, no npm, and no build step. A custom element is just an HTML tag (e.g. `<phc-navbar>`) backed by
one JavaScript class whose `connectedCallback()` builds the existing markup. Editing that one file updates
**every page** that uses the tag. See `REWRITE-ARCHITECTURE.md` for the decision record.

## `<phc-navbar>` — the shared nav chrome

**Files:** `components/navbar.js` (structure + per-page paths) and `strings.js` (the i18n text table).

Replaces the `#navbar` + `#mobileBar` block that was hand-duplicated across 14 pages (4 homepages, 4
English inner pages, 6 localized subpages). One source of truth now; a one-line edit propagates to all of
them on a plain file save (no build).

### Attributes

| Attribute | Required | Values | Meaning |
|-----------|----------|--------|---------|
| `lang`    | yes      | `0` en, `1` es, `2` ang (Old English), `3` tlh (Klingon) | Picks the string column in `strings.js` and the translate-icon asset/alt. |
| `page`    | yes\*    | `home`, `menu`, `about`, `events` | Picks the per-page link set, current-page highlighting, and relative paths. \*Defaults to `home`. |

Example: `<phc-navbar lang="1" page="menu"></phc-navbar>` renders the Spanish menu-page navbar.

### How to wire a page

In `<head>`, load the two classic scripts **before** `script.js`, using root-absolute paths so nested
directories (`/es/`, `/ang/menu/`, …) all resolve the same way:

```html
<script src="/strings.js"></script>
<script src="/components/navbar.js"></script>
```

Then replace the page's `#navbar` + `#mobileBar` markup with a single `<phc-navbar>` tag.

### Why two classic scripts in `<head>` (timing)

`components/navbar.js` and `strings.js` are **classic scripts** (not ES modules) loaded in `<head>` so
`customElements.define()` runs before the parser reaches `<phc-navbar>`. The element therefore upgrades
**synchronously** and renders `#navIcon` before `script.js`'s synchronous `easterEgg()` (`script.js:13`)
looks it up. `strings.js` must come first because `navbar.js` reads `window.PHC_STRINGS`. All behavior
functions (`switchDisp`, `scrollFunction`, `easterEgg`) stay global on `window`; the component only emits
markup.

### Spec-pinned ids/classes (preserved)

The emitted DOM keeps every id/class the specs pin: `navbar`, `navIcon`, `navIconMobile`, `mobileBar`,
`mobileNav`, `navtitle`, the `switchDisp()` onclick handlers, the `transIcon` translate link, the
`dropdown` mobile links, and the `kli` Klingon font class on `lang="3"`. The English homepage
(`lang="0" page="home"`) is emitted byte-for-byte identical to its verified hand-written original.

### Drift fixed (vs. the legacy hand-written navs)

Editing one source let us close inconsistencies that had crept across the duplicated copies:

1. **Desktop logo `onclick`** — standardized to `switchDisp()` everywhere except the byte-pinned English
   homepage (which stays bare for parity).
2. **Klingon homepage translate link** — legacy `id="trtansIcon" class="dropdown"` (typo + wrong class)
   is now the correct `class="transIcon"`.
3. **Spanish homepage mobile translate path** — legacy `../../` (its own desktop used `../`) is now `../`.
4. **Hamburger title** — ang/tlh were left English (`"Mobile Nav"`); now localized via the
   `mobileToggleTitle` row in `strings.js`.

A page with **no** nav is intentionally left alone: `survey/index.html` and the iframe-only
`order/index.html` have no `<phc-navbar>`.

## `<phc-footer>` — the hours + social block

**Files:** `components/footer.js` (structure + per-language config) and `strings.js` (visible text).

Replaces the `#hours` block (the `Hours (…)` heading, the `#isOpen` open/closed status `<mark>`, the
`#sun-wed` / `#thur-sat` day rows, and the nested `#mediaLinks` Facebook/Instagram links) that was
hand-duplicated across the **4 homepages** (`index.html`, `es/`, `ang/`, `tlh/`). Only the homepages
carry this block — inner pages do not.

### Attributes

| Attribute | Required | Values | Meaning |
|-----------|----------|--------|---------|
| `lang`    | yes      | `0` en, `1` es, `2` ang, `3` tlh | Picks the string column, the heading tag (`h2` for en/es, `h1` for ang/tlh), the `kli` Klingon font class, and the `images/` path prefix (`./` on root, `../` on the localized homepages). |

Example: `<phc-footer lang="2"></phc-footer>` renders the Old-English hours block.

### Spec-pinned ids (preserved — `script.js` reads them)

`id="hours"`, `mark id="isOpen"`, `id="sun-wed"`, `id="thur-sat"`, `id="mediaLinks"`. `script.js`'s
`untilClose()` rewrites `#isOpen` to the localized **open** word when open; `daySelect()` underlines
the active day row. **The `#isOpen` default text is the localized _closed_ word**
(`Closed` / `Cerrado` / `Clýsde` / `sokmohta'`) — `script.js` has no `langClosed`, so the static default
*is* the closed state. The component emits the right closed word per language; emitting English for all
would introduce a real i18n bug.

## `<phc-contact-form>` — the contact form

**Files:** `components/contact-form.js` (structure) and `strings.js` (heading, placeholders, button).

Replaces the `#form` contact block hand-duplicated across the **4 homepages**.

### Attributes

| Attribute | Required | Values | Meaning |
|-----------|----------|--------|---------|
| `lang`    | yes      | `0`–`3` | Picks the string column and, for `lang="3"` (tlh) only, appends `kli` to the heading and every form control. |

### Spec-008 is load-bearing (preserved byte-exact)

`form.js` binds to this markup with no build step, so the emitted DOM keeps: `name="contactUs"`
(`document.forms['contactUs']`), `class="contact1-form"` (the `querySelector` hook + `if (contactForm)`
guard), the literal `onsubmit="false"` (**not** `return false`), the control `name`s
`Name`/`Email`/`Subject`/`Message`, and the `id`s `name`/`email`/`subject`. The component emits **markup
only** — all behavior, validation, and the `lang<2` ownerMail / `lang>=2` devMail routing stay in `form.js`.

### Timing (both components)

`footer.js` and `contact-form.js` are **classic scripts** loaded in `<head>` after `navbar.js` (and, on
the localized pages, after `strings.js`), so `customElements.define()` runs before the parser reaches the
tags and they upgrade **synchronously** — `#hours`/`#isOpen`/`#form`/`.contact1-form` all exist before
`script.js`'s `easterEgg()`/`onload openFunc()` and the end-of-body `form.js` run. The **English homepage
(`index.html`) does not load `strings.js`**; both components' `lang="0"` path is a byte-literal that never
reads `window.PHC_STRINGS` (guarded access everywhere else). Verified across all 4 languages with a
DOM-parity gate (rendered output vs. the committed originals) and a live in-browser pass (zero console
errors; `script.js`/`form.js` integration intact).

## `<phc-order-popup>` — the "Order Online" button + marketplace popup

**Files:** `components/order-popup.js` (structure + per-variant link lists) and `strings.js` (the
`orderLabel` button text).

Replaces the `#orderOnline` block (the `#orderButton` and its `#buttonPopup` link list) hand-duplicated
across **8 pages**: the 4 homepages and the 4 menu pages (`menu/`, `es/menu/`, `ang/fodaliste/`,
`tlh/hidjolev/`). Unlike the other components, the popup's **link list differs by page family, not by
language** — so it takes a second `variant` attribute.

### Attributes

| Attribute | Required | Values | Meaning |
|-----------|----------|--------|---------|
| `lang`    | yes      | `0`–`3` | Button label from the `orderLabel` row; `kli` on the tlh button. |
| `variant` | yes\*    | `home`, `menu` | Picks the link list. `home` = DoorDash + UberEats (delivery); `menu` = the single Clover storefront. Defaults to `home`. |

Example: `<phc-order-popup lang="3" variant="menu"></phc-order-popup>` renders the Klingon menu-page popup.

### Spec-pinned ids (preserved — `script.js` reads them)

`id="orderOnline"`, `id="orderButton"` (with `onclick="buttonPopupGen()"`), `id="buttonPopup"`. The global
`buttonPopupGen()` in `script.js` toggles `#buttonPopup` and the button's border-radius — **unchanged**;
the component emits markup only. The button label is per-language (`Order Online` / `Comprar Online` /
`Beodan On Líne` / `'internetdaq vun`, the last with `class="kli"`); the marketplace link labels are
proper-noun place names and are **not** translated. `lang="0"` uses byte-literal `render0Home()` /
`render0Menu()` (so `index.html`, which has no `strings.js`, still works).

### Owner-review items (preserved as-is, decide later)

- The UberEats link label reads **`Litte Grand Market`** (missing an "l") on all 4 homepages. Reproduced
  byte-exact; now a **one-line fix** in `order-popup.js` that propagates to all four.
- The dead commented-out Clover **"Powell"** `<li>` in the menu variant was **dropped** (it was an HTML
  comment / inactive link). Behavior is unchanged.

Verified across all 4 languages × both variants with the DOM-parity gate and a live in-browser pass:
`buttonPopupGen()` still toggles the popup, correct labels/links/`kli` per page, zero console errors, and no
regression to the already-shipped nav/footer/contact-form components.
