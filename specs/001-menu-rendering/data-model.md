# Phase 1 Data Model: Menu Rendering

## Source row (CSV record, `header: true`)

| Column | Consumed? | Meaning |
|---|---|---|
| `price` | ✅ | Numeric price, empty, or sentinel `menu` / `note` / `image`. Drives the row's role. |
| `price_ghdd` | ❌ | Grubhub/Doordash price. Present in sheet, never read by the render. |
| `hidden` | ✅ | `yes` → row skipped entirely. |
| `cat_en` / `cat_es` / `cat_ang` / `cat_tlh` | ✅ | Category title in each language. Non-empty → new category. |
| `catDesc_en/_es/_ang/_tlh` | ✅ | Category description in each language. |
| `name_en/_es/_ang/_tlh` | ✅ | Item/menu/note/image-link name in each language. `name_en` also drives `:`-continuation detection. |
| `nameDesc_en/_es/_ang/_tlh` | ✅ | Item/note/image description (alt text for images) in each language. |

**Active language** `lang`: `0=en, 1=es, 2=ang, 3=tlh`. Selects the column suffix; `price`/`price_ghdd` are
language-independent. When `lang==3`, text-bearing elements additionally receive the `kli` class.

## Row roles (decision order, per row, after skip checks)

```
skip if hidden == "yes"
skip if (name[lang] == "" AND cat[lang] == "")
if price == "menu"   -> create menu tab named name[lang]; becomes current tab
if cat[lang] != ""   -> create category(title=cat[lang], desc=catDesc[lang]) in current tab
if price != "":
    if price == "note"  -> addNote(name[lang], nameDesc[lang]); next row
    if price == "image" -> addImg(name[lang] as src, nameDesc[lang] as alt); next row
    else if price != "menu" -> itemCreate(name[lang], nameDesc[lang], price)
else if name[lang] != "":   # empty price + has name => multi-price parent
    while next row's name_en starts with ":":
        advance; compose price += " " + name[lang].substr(1) + " " + nextRow.price
    price = price.substr(1)
    itemCreate(name[lang], nameDesc[lang], price)
```

> A single row can both open a category **and** create an item (category check and price check are independent
> branches in the same iteration). This is current behavior and must be preserved.

## Entities emitted to the DOM

| Entity | Trigger | DOM produced (classes/ids preserved exactly) |
|---|---|---|
| Menu tab | `price == "menu"` | `<div class="category">` appended to `#loadMenu`; `<li><button class="menuName[ kli]" onclick="setMenu(i)">name</button>` appended to `#menuButtons`; removes `#loading` |
| Category | `cat[lang] != ""` | `.titleHolder > (.menuTitle[ kli], .menuDesc[ kli])` then `.menuItems` appended to the **last** `.category` |
| Item | priced, non-sentinel | `.itemHolder > (.menuItem[ kli], .itemDesc[ kli], .price[ kli])` appended to the **last** `.menuItems` |
| Note | `price == "note"` | `.noteTitle[ kli]`, `.noteDesc[ kli]` appended to the **last** `.category` |
| Image | `price == "image"` | `.itemHolder.photo > (img[src=pathFixed link][alt=desc], p[.kli?])` appended to the **last** `.menuItems` |

## Render lifecycle / state

- **Trigger**: `DOMContentLoaded` → `init()` → PapaParse download+parse → `showInfo(results)`.
- **Iteration state**: `row` (starts at **1**, skipping the instructions row), `menuCt` (count of menu tabs,
  used both as the `setMenu` argument and the highlight index).
- **Target resolution**: categories/items/notes/images always attach to the **last** element of the relevant
  class (`category` / `menuItems`) — i.e. the most recently created container. Order in the CSV defines nesting.
- **Termination**: after the loop, if `menuCt > 0` call `setMenu(0)` to show+highlight the first tab.

## Invariants the refactor must hold (verification targets)

1. Same number and order of menu tabs, categories, items, notes, images for each `lang`.
2. Identical class strings (including the ` kli` suffix exactly when `lang==3`).
3. Identical text content (names, descriptions, composed multi-prices) per language.
4. Identical image `src` (after absolute-path resolution) and `alt`.
5. First data row never rendered; `hidden==yes` and empty rows never rendered.
6. `setMenu(0)` invoked iff at least one menu tab exists; `#loading` removed iff at least one tab created.
