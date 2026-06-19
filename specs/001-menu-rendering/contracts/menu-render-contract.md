# Contract: Menu CSV → DOM Render

This is the externally-observable contract of the menu subsystem. It binds three parties: the **staff editor**
(who maintains the sheet), the **markup** (`menu/index.html`), and the **builder** (`menuBuilder.js`). The
refactor MUST keep every clause below true.

## 1. Input contract — the sheet

- Source: a published Google Sheets CSV export, parsed with a header row.
- **Row 0 (first data row) is reserved** for human column instructions and is never rendered.
- A row is **ignored** when `hidden == "yes"`, or when both the active-language `name` and `cat` are empty.
- `price` column vocabulary:
  - `menu` → start a new menu tab (name from `name[lang]`).
  - `note` → informational block (`name[lang]` title, `nameDesc[lang]` body).
  - `image` → image entry (`name[lang]` is the image path/link, `nameDesc[lang]` is the caption/alt).
  - empty → if `name[lang]` present, a multi-price parent consuming following `:`-prefixed rows.
  - any other value → the literal price text of an item.
- Multi-price continuation: rows whose **`name_en`** begins with `:` extend the previous empty-price item; the
  size label is `name[lang]` without the leading `:`, paired with that row's `price`.
- Language columns: `*_en`, `*_es`, `*_ang`, `*_tlh` for `cat`, `catDesc`, `name`, `nameDesc`.
- `price_ghdd` is accepted in the sheet but ignored by this render.

## 2. Markup contract — required DOM in `menu/index.html`

The builder requires these hooks to exist (ids/classes are a stable interface — Constitution Principle V):

| Selector | Role |
|---|---|
| `#loadMenu` | Container that receives each `.category` (menu tab) block. |
| `#menuButtons` | `<ul>` that receives each tab's `<li><button class="menuName">`. |
| `#loading` | "Loading..." indicator; removed once the first tab is created. |

The builder also depends on shared globals from `script.js`: `lang` (active language), `setMenu(i)` (tab
show/highlight), and absolute-path resolution equivalent to `pathFix` for image `src`.

## 3. Output contract — emitted DOM shape

Exactly one menu tab's content is visible at a time (`setMenu`): the selected `.category` is `display:block`
with its button colored `#d92332`; others are `display:none` with buttons `#2a438c`. Per-entity structure:

```
menu tab : #loadMenu > div.category
           #menuButtons > li > button.menuName[ kli]   (onclick="setMenu(N)")
category : .category > div.titleHolder > (div.menuTitle[ kli], div.menuDesc[ kli])
           .category > div.menuItems
item     : .menuItems(last) > div.itemHolder > (div.menuItem[ kli], div.itemDesc[ kli], div.price[ kli])
note     : .category(last) > (div.noteTitle[ kli], div.noteDesc[ kli])
image    : .menuItems(last) > div.itemHolder.photo > (img[src,alt], p[ kli?])
```

- The ` kli` class suffix appears **iff** `lang == 3`, on every text-bearing element listed above.
- Default selection after load: `setMenu(0)` (first tab) when at least one tab exists.

## 4. Conformance / verification

- **Oracle**: serialized DOM of the legacy build per `lang` 0–3 against the frozen fixture.
- **Pass condition**: refactored build's normalized serialized DOM equals the oracle for every language (empty
  diff). See [quickstart.md](../quickstart.md).
- Any intended change to this contract is a spec edit first (Constitution Principle II), not a code change.
