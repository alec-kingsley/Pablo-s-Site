# Rewrite Spike — Architecture Decision

Source: a 9-agent judge panel (5 proposals × 3 judges + synthesis) on the `spike/rewrite` branch, 2026-06-19.
This is a **code rewrite** (modernize structure, preserve current look + behavior) — NOT a visual redesign. The
`specs/` are the acceptance criteria.

## Decision: zero-build, standards-only Web Components + shared core ES module + i18n string table

- **Build step: NONE.** Keep Constitution Principle I (Zero-Build). Two PATCH clarifications only: (1) native ES
  modules + Custom Elements v1 (light-DOM, no Shadow DOM) are permitted primitives (served verbatim by GitHub
  Pages / Replit); (2) vendor PapaParse locally — the current cdnjs CDN load on the 4 builder pages is a live
  Principle I violation this work fixes.
- **Rejected:** Astro / Preact+Vite (build-based) — they'd require a *major* amendment to Principle I and raise
  the floor (npm, node_modules, CI failure can block all deploys, breaks Replit-verbatim import) for two
  non-expert maintainers. Not justified for a 6-page site.

## Why
- Both the operational-simplicity and maintainability judges ranked zero-build 1/2/3 and build-based last; the
  engineering-quality judge independently put standards-only Web Components first.
- Dominant verified defect is **structural duplication**: ~95% chrome duplicated across 17 HTML files with
  es/ang/tlh drift; a one-line nav change = a 17-file hand-edit today.
- A `<phc-navbar lang="N">` light-DOM custom element renders the **exact same ids/classes** the specs pin
  (Principle V), so the spec-001 byte-parity harness keeps passing unedited.
- Chosen over runtime-fetched HTML partials (the raw judge favorite) because a custom element renders its
  children **synchronously in `connectedCallback`** — the clean answer to the upgrade-timing hazard — with no
  network round-trip and no first-paint reflow.

## Non-negotiable discipline (verified against the tree)
- **143 inline `on*` handlers across 17 files all call GLOBAL functions** in `script.js`, and `easterEgg()` runs
  synchronously at `script.js:13`. So: keep every behavior function on `window`, and ensure the navbar element
  is **defined before** `script.js` runs (load `components/navbar.js` as a classic script in `<head>` so the
  `<phc-navbar>` in the body upgrades synchronously before `script.js`'s `easterEgg()` looks up `#navIcon`).
- **jQuery is load-bearing** (form.js/surveyBuilder.js `.serialize()`/`$.param`/`$.ajax`, `$('#popUp')`) — trim
  page-by-page under spec 008/012 parity LATER, not in this spike.

## Spike slice + success criteria
Rebuild the homepage **navbar** as `<phc-navbar lang="N">` across `index.html`, `es/`, `ang/`, `tlh/`.
- Post-upgrade nav DOM is **byte-identical** to today's hand-written nav for all 4 languages (extend the 001
  snapshot harness to a nav-region diff; empty diff = pass).
- Every spec-mandated id/class survives (`navIcon`, `isOpen`, `switchDisp` target, nav links).
- Behavior parity in-browser, all 4 langs: mobile-nav toggle (`switchDisp`), scroll-shrink (`scrollFunction`),
  double-click splash (`easterEgg`) — zero new console errors.
- A one-line edit to `components/navbar.js` provably propagates to all four homepages (dedup win + closes
  es/ang/tlh drift), shipping by plain file save (no build).

## Graft (from the runner-up)
Centralized **i18n string table** (`strings.js`, rows keyed `[en, es, ang, tlh]`): `<phc-navbar lang="N">` pulls
its visible strings from one table, so a missing translation is one visible gap instead of a silent per-file
omission — collapses the 4 navbar copies to one source of structure AND text (strengthens Principle IV).

## Target file structure
Repo root stays the served tree (unchanged deploy). Add `/components/navbar.js` (+ later `footer.js`,
`order-popup.js`, `contact-form.js`), `/core.js` (lang model, pathFix, local `csv.js` wrapping/replacing Papa),
`/strings.js` (i18n table), `COMPONENTS.md` (1-page map of each `<phc-*>` tag → file). Keep `script.js` behavior
functions global. Vendor papaparse locally; remove the cdnjs `<script>` from the 4 builder pages. Extend the
specs/001 harness into a reusable per-language whole-page DOM-equality gate for every migrated page.

## Open questions for the owner (do not block the navbar spike; matter for later slices)
1. **Local dev**: ES modules + local-papaparse fetch require serving over http (`python -m http.server` /
   Replit preview); no more `file://` double-click. OK? (Already effectively true via Papa's CORS download.)
2. **PapaParse**: vendor it locally (1 dep, zero risk) vs. replace with a ~40-line native CSV parser (must
   reproduce the quoted-comma + `:`-continuation quirks under parity). Lean: vendor for the spike, revisit.
3. **Nested-dir imports** (`/es/`, `/ang/`, `/tlh/`): adopt an import map or per-depth relative imports for
   `/components/`? Does that play with Replit import?
4. **Scope**: spike modernizes code only; a visual redesign is a separate later effort on top. Confirm.
5. **Maintainer onboarding**: is "a custom element = an HTML tag backed by one `connectedCallback` that builds
   the existing markup" (documented in a 1-page COMPONENTS.md) an acceptable learning step? If too high, the
   runtime-partials variant is the fallback.
6. **Parity gate**: make the per-language whole-page DOM diff a hard-blocking gate for every future page
   migration (recommended) and wire it into the specs/001 harness?

## Spike result (English homepage navbar — VERIFIED)

Implemented `components/navbar.js` (a zero-build, classic-script, light-DOM `<phc-navbar lang="N">` custom
element with a per-language config table) and wired it into `index.html` (nav block → `<phc-navbar lang="0">`,
component script in `<head>` before `script.js`).

Verified in headless Chromium against the captured oracle:
- **Structural DOM parity = TRUE** — the component renders the exact same nav DOM (ids/classes/links/text,
  ignoring insignificant inter-tag whitespace) as the original hand-written markup. Every spec-pinned id present
  (`navbar`, `navIcon`, `navIconMobile`, `mobileNav`, `navtitle`, `mobileBar`).
- **Behavior parity** — `switchDisp` toggles the mobile nav (""→block→none); `scrollFunction` runs without
  throwing on the component-rendered nav; **`easterEgg` is wired** (the synchronous `easterEgg()` at
  `script.js:13` found `#navIcon`), proving the classic-script-in-`<head>` upgrade timing resolves the one real
  hazard. **Zero console errors.** Screenshot confirms the nav is visually identical.

Conclusion: the thesis holds. A zero-build light-DOM custom element collapses the duplicated nav to one source
while preserving the spec'd DOM + all behavior with no build step.

## Cross-language nav drift found (evidence for the dedup — survey of all 4 homepages' nav)

Surveying the four homepages confirmed the duplication has already DRIFTED into inconsistencies/bugs — exactly
what one source of truth fixes. Each needs an explicit keep-or-fix decision during conversion (not a silent
byte-copy of bugs):
- **Desktop logo `onclick`**: en NO, es YES, ang NO, tlh YES — inconsistent (does the desktop logo toggle the
  mobile nav or not?).
- **Klingon desktop translate link is buggy**: `id="trtansIcon"` (typo) + `class="dropdown"` instead of
  `class="transIcon"` → mis-styled / not the intended translate-icon.
- **Spanish mobile translate path**: `../../` while its own desktop link uses `../` — one is wrong.
- **Hamburger title (`aria`/tooltip)**: es localized it ("navegación móvil"); ang + tlh left it English
  ("Mobile Nav") — missing translations.
- **`kli` font classes** correctly present on tlh links (must be preserved).

Implication: converting the navbar across all four pages is NOT a mechanical copy — it requires per-item
keep-vs-normalize decisions (fixing the typo'd Klingon link is an obvious yes; standardizing the logo onclick is
an owner call). This is why the full-site conversion should run as a deliberate, reviewable effort (a parallel
workflow with each page's drift surfaced), rather than a blind transform.

## Remaining conversion scope (the "entire site")
Components: `<phc-navbar>` (en done) → es/ang/tlh + `<phc-footer>`, `<phc-order-popup>`, `<phc-contact-form>`.
Builders → ES modules (`menu`, `events`, `survey`) with local-vendored CSV (fix the CDN PapaParse). Drop jQuery
page-by-page under spec 008/012 parity. Wire all 17 pages. Per-page parity gate (extend the 001 harness). This
is a ~15-20-agent parallel job across phases (components → page wiring → builder modules → parity) — best run as
a workflow with the drift decisions reviewed.


## Nav conversion — PHASE DONE (14-agent workflow + browser parity gate)

`<phc-navbar lang="N" page="KEY">` (components/navbar.js, ~14.5 KB) now renders the nav for **13 pages**
(4 homepages + English menu/about/events + 6 localized subpages) from one source: `CONFIG[page][lang]` for
paths/structure + `strings.js` for visible text (the i18n graft). `index.html` (lang 0 / home) is **byte-pinned**
via `render0Home()` and verified byte-identical (sha `402afc84...`). `survey/` and iframe-only `order/` have no
nav and were skipped. `COMPONENTS.md` documents it for maintainers.

**Drift fixed (9 — 6 documented + 3 newly found):** tlh typo'd translate link (`trtansIcon`->`transIcon`);
tlh `mah_bop` double-class translate link; es mobile translate path `../../`->`../`; ang/`fodaliste` broken
`../sobre_nosotros`->`../ymb_us/`; es/`quienes_somos` empty logo `alt`; hamburger titles localized for ang/tlh;
standardized desktop-logo `onclick`; dropped invalid duplicate `class="dropdown"` on mobile translate links.

**Owner-review items (4):** the standardized desktop-logo `onclick`; the newly-coined ang/tlh hamburger titles
in `strings.js` (placeholder translations — replace as desired); the **preserved-but-broken** tlh-homepage
`../../` translate path (left as-is, outside the authorized fix scope — recommend fixing); the broken-link repoints.

**Browser parity gate (main loop, not the agents) caught a real bug the agent self-checks missed:** 11 of 12
wirers added `navbar.js` but forgot `strings.js`, so those pages rendered raw i18n keys ("home"/"aboutUs")
instead of translations. Fixed by inserting `/strings.js` before `/components/navbar.js` on all 11. Re-verified
in-browser: ang -> "Heofod/Ymb Us/Fódalíste"; tlh -> Klingon + `kli` classes + fixed translate link; English
menu + ang/`fodaliste` subpage correct; English homepage byte-parity intact; zero console errors across the
sample. Lesson: the per-page parity gate must stay a main-loop step.

**Next phases:** `<phc-footer>` / `<phc-order-popup>` / `<phc-contact-form>` components; builders -> ES modules
with locally-vendored CSV (drop cdnjs PapaParse); drop jQuery page-by-page under spec 008/012 parity.
