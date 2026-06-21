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
