/*
 * <phc-order-popup lang="N" variant="home|menu"> — the #orderOnline order-button + popup block as a
 * zero-build, light-DOM custom element.
 *
 * Rewrite component (see REWRITE-ARCHITECTURE.md, Phase 5). Replaces the hand-duplicated
 * <div id="orderOnline"> block on the 8 pages (4 homepages = home variant, 4 menu pages = menu
 * variant), collapsing it to ONE source of structure with the visible button LABEL pulled from
 * strings.js (the i18n-table graft). A one-line edit here propagates everywhere on a plain file save.
 *
 * ATTRIBUTES
 *   lang="N"               required. Language index: 0=en, 1=es, 2=ang, 3=tlh. Selects the string
 *                          column for the button label and the `kli` Klingon font class (lang 3 only).
 *   variant="home|menu"    required. Selects the ordering-link list. The links are language-INVARIANT
 *                          proper-noun place names (NOT translated): home = 2 links (DoorDash + UberEats),
 *                          menu = 1 link (Clover Dublin).
 *
 * TIMING: this is a CLASSIC script loaded in <head> AFTER strings.js and BEFORE script.js, so
 * customElements.define() runs before the parser reaches <phc-order-popup>, the element upgrades
 * SYNCHRONOUSLY (renders #orderOnline / #orderButton / #buttonPopup), and script.js's behavior
 * (buttonPopupGen() reading those ids) finds them. This component emits ONLY markup; script.js owns
 * all behavior — buttonPopupGen() stays in script.js and is NOT touched here.
 *
 * SPEC-PINNED ids that MUST survive exactly (buttonPopupGen reads them by id): id="orderOnline",
 * id="orderButton", id="buttonPopup".
 *
 * BYTE-PARITY: lang 0 (English) emits the legacy #orderOnline block as a byte-literal that NEVER
 * reads window.PHC_STRINGS — index.html does not load strings.js, so PHC_STRINGS is undefined there
 * (menu/index.html does load it, but a literal is still safe and keeps both lang-0 paths uniform).
 * Only lang 1/2/3 read strings.js (guarded). See render0Home() / render0Menu().
 *
 * NOTE: the home-variant UberEats label was "Litte Grand Market" in the legacy markup (a typo); this
 * component corrects it to "Little Grand Market" in one place for all 4 homepages. The legacy menu markup
 * also carried a dead, commented-out Clover "Powell" <li> — HTML-comment dead code, intentionally dropped.
 */
(function (root) {
  var STR = (root.PHC_STRINGS && root.PHC_STRINGS.S) || {};

  // t(key, lang) — visible text from the i18n table. Guarded so it cannot throw if PHC_STRINGS is
  // absent (lang 1/2/3 pages load strings.js; this is belt-and-suspenders).
  function t(key, lang) {
    var row = STR[key];
    return row ? row[+lang] : key;
  }

  /* ---- per-language config (indexed by lang number) ------------------------------------------- */
  // Only tlh (lang 3) carries the `kli` Klingon font class on the order button.
  var buttonKli = [false, false, false, true];

  // Per-variant ordering links. Language-INVARIANT proper-noun place names — NOT translated.
  var LINKS = {
    home: [
      { href: "https://www.doordash.com/store/pablo%E2%80%99s-havana-cafe-(longshore-st)-dublin-34357171", label: "Dublin North Market" },
      { href: "https://www.ubereats.com/store/pablos-havana-cafe-grandview/5SzPQJBcWTyxb8djoavyGA", label: "Little Grand Market" }
    ],
    menu: [
      { href: "https://www.clover.com/online-ordering/pablos-havana-cafe-dublin", label: "Dublin" }
    ]
  };

  function linksHtml(variant) {
    var list = LINKS[variant] || LINKS.home;
    var out = "";
    for (var i = 0; i < list.length; i++) {
      out += '<li><a href="' + list[i].href + '">' + list[i].label + '</a></li>';
    }
    return out;
  }

  /* ---- BYTE-PINNED English home variant (does NOT touch window.PHC_STRINGS) -------------------- */
  function render0Home() {
    return '' +
      '<div id="orderOnline">' +
        '<button id="orderButton" onclick="buttonPopupGen()">Order Online</button>' +
        '<div id="buttonPopup" style="display:none;">' +
          '<ul>' +
            '<li><a href="https://www.doordash.com/store/pablo%E2%80%99s-havana-cafe-(longshore-st)-dublin-34357171">Dublin North Market</a></li>' +
            '<li><a href="https://www.ubereats.com/store/pablos-havana-cafe-grandview/5SzPQJBcWTyxb8djoavyGA">Little Grand Market</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>';
  }

  /* ---- BYTE-PINNED English menu variant (does NOT touch window.PHC_STRINGS) -------------------- */
  function render0Menu() {
    return '' +
      '<div id="orderOnline">' +
        '<button id="orderButton" onclick="buttonPopupGen()">Order Online</button>' +
        '<div id="buttonPopup" style="display:none;">' +
          '<ul>' +
            '<li><a href="https://www.clover.com/online-ordering/pablos-havana-cafe-dublin">Dublin</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>';
  }

  /* ---- generic renderer for lang 1/2/3 (reads strings.js via t()) ----------------------------- */
  function renderGeneric(lang, variant) {
    var n = +lang;
    var btnCls = buttonKli[n] ? ' class="kli"' : '';

    return '' +
      '<div id="orderOnline">' +
        '<button id="orderButton" onclick="buttonPopupGen()"' + btnCls + '>' + t("orderLabel", lang) + '</button>' +
        '<div id="buttonPopup" style="display:none;">' +
          '<ul>' +
            linksHtml(variant) +
          '</ul>' +
        '</div>' +
      '</div>';
  }

  function render(lang, variant) {
    if (lang === "0") return variant === "menu" ? render0Menu() : render0Home();
    return renderGeneric(lang, variant);
  }

  class PhcOrderPopup extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute("lang") || "0";
      var variant = this.getAttribute("variant") || "home";
      this.innerHTML = render(lang, variant);
    }
  }

  if (!customElements.get("phc-order-popup")) customElements.define("phc-order-popup", PhcOrderPopup);
})(window);
