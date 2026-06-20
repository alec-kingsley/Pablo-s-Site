<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification of a concrete constitution, replacing the
unfilled template. MAJOR baseline established.

Modified principles:
  [PRINCIPLE_1] → I. Zero-Build Static Delivery
  [PRINCIPLE_2] → II. Behavior-Anchored Specification (NON-NEGOTIABLE)
  [PRINCIPLE_3] → III. Data-Driven Content via External Sheets
  [PRINCIPLE_4] → IV. Multilingual Parity
  [PRINCIPLE_5] → V. Portable Paths & the DOM Contract

Added sections:
  - Technology Constraints
  - Development Workflow & Quality Gates
  - Governance

Removed sections: none (all template placeholders resolved)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md   — reviewed; Constitution Check gate is generic, compatible
  ✅ .specify/templates/spec-template.md   — reviewed; no mandatory-section conflict
  ✅ .specify/templates/tasks-template.md  — reviewed; task categories compatible (no build/test infra assumed)

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original site published 2021-09-28 per changelog.md, but this
    constitution is adopted today. Ratification recorded as today's adoption date; update if the
    team wants to backdate to first publication.
-->

# Pablo's Havana Café Site Constitution

The official website for Pablo's Havana Café (https://www.pabloshavanacafe.com).
A multi-page, framework-free static site whose content is driven by external
spreadsheets and rendered client-side.

## Core Principles

### I. Zero-Build Static Delivery

The site MUST run as authored, with no build step, bundler, transpiler, or package
manager. Every file deployed is a file a browser loads directly. Third-party
dependencies (jQuery, Papa Parse, Font Awesome) are vendored into the repository and
included via plain `<script>`/`<link>` tags — never fetched through npm or a CDN-only
path that a build would resolve.

Rationale: The site is hosted on GitHub Pages (`CNAME` → pabloshavanacafe.com) and is
imported into Replit as-is. Both expect to serve the working tree verbatim. A build
step would break the "edit a file, it ships" contract that keeps this maintainable by
non-specialists. Any proposal to add tooling MUST justify itself against this principle
in its plan's Complexity Tracking.

### II. Behavior-Anchored Specification (NON-NEGOTIABLE)

The current observable runtime behavior is the source of truth. Before any refactor,
the existing behavior MUST be captured in a durable spec under `specs/`. Refactors MUST
preserve that documented behavior exactly; any intended behavior change MUST appear as
an explicit, reviewed edit to the spec — not as an incidental side effect of a code
change. "Reverse-specifying" untracked runtime logic into specs is itself valid,
first-class work.

Rationale: This project's near-term goal is to convert an organically grown codebase
into durable specifications. Without anchoring refactors to recorded behavior, silent
regressions in a site with no automated test suite are nearly undetectable. The spec is
the regression guard.

### III. Data-Driven Content via External Sheets

User-facing content collections (menu, events, surveys, and similar) MUST be sourced at
runtime from their published Google Sheets CSV endpoints, parsed client-side with Papa
Parse, and rendered into the DOM by the corresponding `*Builder.js`. The CSV column
contract (e.g. `price`, `name_en`, `nameDesc_en`, `cat_en`, `hidden`, and the sentinel
`price` values `menu`/`note`/`image`) MUST be documented in the relevant spec. Content
that a non-developer is expected to edit MUST NOT be hardcoded into HTML or JS.

Rationale: Café staff update the menu and events through spreadsheets, not code. The
sheet schema is a real interface; treating it as undocumented incidental detail is how
it silently drifts and breaks the builders.

### IV. Multilingual Parity

The site supports four languages selected by the integer `lang`: 0 English, 1 Spanish,
2 Anglo-Saxon (`ang`), 3 Klingon (`tlh`). Every new user-facing string MUST provide all
four variants — in code via the `[en, es, ang, tlh]` array convention, in sheets via
the `_en`/`_es`/`_ang`/`_tlh` column suffixes. Where a translation genuinely cannot be
provided, the spec MUST state the explicit fallback (typically English) rather than
leaving a silent gap.

Rationale: The novelty languages are part of the site's identity and its easter-egg
sub-apps (`/ang`, `/tlh`). Adding single-language content silently degrades the
experience and breaks the symmetry the builders assume.

### V. Portable Paths & the DOM Contract

Root-absolute asset/link references (`/images/...`, `/bday.js`, etc.) MUST be resolved
through `pathFix()` so pages work at any directory depth and under Replit's import.
JavaScript's dependence on specific element IDs and class names (e.g. `navIcon`,
`isOpen`, `loadMenu`, `menuButtons`, `demo`/`column` slides, `category`/`menuItems`) is
a real contract between markup and script: these identifiers MUST be documented in the
owning spec and MUST NOT be renamed or removed without updating both sides together.

Rationale: The same files are served from multiple roots, so hardcoded absolute paths
break silently off the homepage. The HTML↔JS coupling is implicit today; making it an
explicit, specified contract is what allows safe refactoring under Principle II.

## Technology Constraints

- **Stack**: HTML5, CSS3, vanilla JavaScript (ES5/ES6 mix as already present), jQuery
  3.2.1, Papa Parse for CSV. No frameworks, no TypeScript build, no CSS preprocessor
  output committed.
- **Hosting**: GitHub Pages via custom domain (`CNAME`); must remain Replit-importable
  (`.replit`, `replit.nix` preserved).
- **Dependencies**: vendored in-repo; upgrades are deliberate, spec-noted changes, not
  silent swaps.
- **No backend**: all dynamic behavior is client-side; persistence and content live in
  external Google Sheets and static assets.
- **Browser support**: modern evergreen browsers; progressive/seasonal features
  (birthday, Halloween) MUST degrade gracefully when their trigger conditions are absent.

## Development Workflow & Quality Gates

- Feature work flows through the Spec Kit cycle: `specify → plan → tasks → implement`,
  with review gates between phases.
- Each feature gets its own branch (created by the `before_specify` git hook). Tooling
  and specs are merged to `main` deliberately, never automatically.
- Because there is no automated test suite, the verification gate is **manual behavioral
  verification in a browser** against the spec's acceptance criteria, across at least the
  affected language(s) and both desktop and mobile layouts.
- Every plan MUST include a Constitution Check confirming compliance with Principles I–V,
  and MUST record any justified deviation in Complexity Tracking.

## Governance

This constitution supersedes ad-hoc conventions when they conflict. Amendments require a
documented change to this file with a version bump and an updated Sync Impact Report, and
must be reflected in dependent Spec Kit templates where relevant.

Versioning follows semantic rules:
- **MAJOR**: removal or backward-incompatible redefinition of a principle or governance rule.
- **MINOR**: a new principle/section or materially expanded guidance.
- **PATCH**: clarifications, wording, or non-semantic refinements.

Compliance is reviewed at each plan's Constitution Check and before merge to `main`.
Runtime development guidance for agents lives in `CLAUDE.md` (managed Spec Kit section).

**Version**: 1.0.0 | **Ratified**: 2026-06-19 | **Last Amended**: 2026-06-19
