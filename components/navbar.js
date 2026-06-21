/*
 * <phc-navbar lang="N" page="KEY"> — shared nav chrome as a zero-build, light-DOM custom element.
 *
 * Rewrite component (see REWRITE-ARCHITECTURE.md). Replaces the ~20-line #navbar + #mobileBar block
 * that is hand-duplicated across 14 pages (4 homepages + 4 English inner pages + 6 localized
 * subpages) — collapsing it to ONE source of structure, and pulling visible TEXT from strings.js
 * (the i18n-table graft). A one-line edit here propagates to every page on plain file save.
 *
 * ATTRIBUTES
 *   lang="N"   required. Language index: 0=en, 1=es, 2=ang, 3=tlh. Selects the string column and
 *              the translate-icon asset/alt.
 *   page="KEY" required (except the English homepage, which defaults to "home"). Selects the
 *              per-page link set + paths. Valid keys: home, menu, about, events.
 *
 * Why (lang, page) and not lang alone: the real drift is per-PAGE (link targets, which item is the
 * current page, the events page's reordered nav), not merely per-language. So CONFIG is keyed
 * [page][lang]; text comes from strings.js, paths/assets live here.
 *
 * TIMING: this is a CLASSIC script loaded in <head> BEFORE script.js (and AFTER strings.js), so
 * customElements.define() runs before the parser reaches <phc-navbar>, the element upgrades
 * SYNCHRONOUSLY (renders #navIcon etc.), and script.js's synchronous easterEgg() (script.js:13)
 * finds #navIcon. Behavior functions (switchDisp, scrollFunction, easterEgg) stay global on window.
 *
 * BYTE-PARITY: lang 0 / page "home" emits the English-homepage nav byte-for-byte as it shipped
 * (verified oracle). Do not regress that path — see render0Home().
 *
 * DRIFT FIXES applied here (documented in REWRITE-ARCHITECTURE.md "Cross-language nav drift"):
 *   1. Desktop logo onclick standardized to switchDisp() on EVERY variant EXCEPT lang0/home (kept
 *      bare for byte-parity). Legacy had it on es/tlh homepages + most inner pages but NOT on
 *      en menu / en events / ang & en homepages — now consistent.
 *   2. tlh homepage desktop translate link: legacy `id="trtansIcon" class="dropdown"` (typo + wrong
 *      class) -> emitted as the correct `class="transIcon"` like every other translate link.
 *   3. es homepage mobile translate path: legacy `../../` (desktop used `../`) -> emitted as `../`.
 *   4. Hamburger toggle title: ang/tlh were left English ("Mobile Nav") -> now localized via
 *      strings.js mobileToggleTitle column.
 *   Also dropped the duplicate `class="dropdown"` attribute legacy markup put on mobile translate
 *   links (an invalid second class= that the browser ignored) — DOM is unchanged, source is clean.
 */
(function (root) {
  var STR = (root.PHC_STRINGS && root.PHC_STRINGS.S) || {};
  var TALT = (root.PHC_STRINGS && root.PHC_STRINGS.TRANS_ALT) || {};

  // Per-language translate-icon asset + alt-key. The icon switches AWAY from the page's language.
  var TRANS_ASSET = {
    "0": { img: "EngToEsp.webp", altKey: "toEs"  }, // en -> es
    "1": { img: "EspToEng.webp", altKey: "toEn0" }, // es -> en
    "2": { img: "Niwenglisc.webp", altKey: "toEn2" }, // ang -> en
    "3": { img: "DiviHol.webp",  altKey: "toEn3" }  // tlh -> en
  };

  // tlh links carry the `kli` font class; every other language uses no extra link class.
  function kli(lang) { return lang === "3" ? "kli" : ""; }

  // t(key, lang) — visible label from the i18n table.
  function t(key, lang) {
    var row = STR[key];
    return row ? row[+lang] : key;
  }

  /* ---- generic builders (used by every page EXCEPT the byte-pinned lang0/home) ---------------- */

  function aTag(href, label, cls, extra) {
    var c = cls ? (' class="' + cls + '"') : '';
    var e = extra ? (' ' + extra) : '';
    return '<a href="' + href + '"' + c + e + '>' + label + '</a>';
  }

  // translate icon link. imgPrefix is the relative dir to images/ from THIS page; alt comes from
  // the i18n table (TRANS_ALT) keyed by the asset's altKey.
  function transLink(lang, href, imgPrefix) {
    var a = TRANS_ASSET[lang];
    return '<a href="' + href + '" class="transIcon"><img src="' + imgPrefix + 'images/' +
      a.img + '" alt="' + TALT[a.altKey] + '"></a>';
  }

  /*
   * CONFIG[page][lang] = {
   *   imgPrefix : relative path to the served root's images/ dir (e.g. "../", "../../"),
   *   trans     : { desktop: href, mobile: href },   // language-switch targets for this page
   *   left      : [ [href, labelKey|literal, isLiteral?], ... ],   // desktop #left links
   *   right     : [ ... same shape ],                              // desktop #right links (Menu/etc)
   *   title     : [ href, labelKey ],                              // #navtitle (mobile current page)
   *   mobileNav : [ ... ],                                         // #mobileNav dropdown links
   * }
   * Labels are i18n keys resolved through strings.js unless the 3rd tuple element is true (literal).
   */
  var CONFIG = {
    /* ===== HOMEPAGES ===== */
    home: {
      // lang 0 is rendered by the byte-pinned render0Home(); kept here for completeness/paths.
      "0": { imgPrefix: "./", trans: { desktop: "./es", mobile: "./es" },
             left: [["#", "home"], ["./about_us/", "aboutUs"]],
             right: [["menu", "menu"]],
             title: ["#", "home"],
             mobileNav: [["./menu/", "menu"], ["./about_us/", "aboutUs"]] },
      "1": { imgPrefix: "../", trans: { desktop: "../", mobile: "../" },
             left: [["#", "home"], ["./quienes_somos/", "aboutUs"]],
             right: [["menu", "menu"]],
             title: ["#", "home"],
             mobileNav: [["./menu/", "menu"], ["./quienes_somos/", "aboutUs"]] },
      "2": { imgPrefix: "../", trans: { desktop: "../", mobile: "../" },
             left: [["#", "home"], ["./ymb_us/", "aboutUs"]],
             right: [["./fodaliste", "menu"]],
             title: ["#", "home"],
             mobileNav: [["./fodaliste/", "menu"], ["./ymb_us/", "aboutUs"]] },
      // tlh homepage: the legacy translate link uses ../../ for BOTH href and image (the logo uses
      // ../). That overshoots root, but it is OUTSIDE the documented drift scope (which only covers
      // the id/class typo), so it is preserved exactly. transImgPrefix pins the icon's image path.
      "3": { imgPrefix: "../", transImgPrefix: "../../",
             trans: { desktop: "../../", mobile: "../../" },
             left: [["#", "home"], ["./mah_bop/", "aboutUs"]],
             right: [["./hidjolev", "menu"]],
             title: ["#", "home"],
             mobileNav: [["./hidjolev/", "menu"], ["./mah_bop/", "aboutUs"]] }
    },

    /* ===== MENU PAGES ===== (current page = Menu) */
    menu: {
      "0": { imgPrefix: "../", trans: { desktop: "../es/menu", mobile: "../es/menu" },
             left: [["../", "home"], ["../about_us/", "aboutUs"]],
             right: [["#", "menu"]],
             title: ["#", "menu"],
             mobileNav: [["../", "home"], ["../about_us/", "aboutUs"]] },
      "1": { imgPrefix: "../../", trans: { desktop: "../../menu", mobile: "../../menu" },
             left: [["../", "home"], ["../quienes_somos/", "aboutUs"]],
             right: [["#", "menu"]],
             title: ["#", "menu"],
             mobileNav: [["../", "home"], ["../quienes_somos", "aboutUs"]] },
      "2": { imgPrefix: "../../", trans: { desktop: "../../menu", mobile: "../../menu" },
             left: [["../", "home"], ["../ymb_us/", "aboutUs"]],
             right: [["#", "menu"]],
             title: ["#", "menu"],
             mobileNav: [["../", "home"], ["../ymb_us/", "aboutUs"]] },
      "3": { imgPrefix: "../../", trans: { desktop: "../../menu", mobile: "../../menu" },
             left: [["../", "home"], ["../mah_bop/", "aboutUs"]],
             right: [["#", "menu"]],
             title: ["#", "menu"],
             mobileNav: [["../", "home"], ["../mah_bop", "aboutUs"]] }
    },

    /* ===== ABOUT-US PAGES ===== (current page = About Us) */
    about: {
      "0": { imgPrefix: "../", trans: { desktop: "../es/quienes_somos/", mobile: "../es/quienes_somos/" },
             left: [["../", "home"], ["#", "aboutUs"]],
             right: [["../menu", "menu"]],
             title: ["#", "aboutUs"],
             mobileNav: [["../", "home"], ["../menu/", "menu"]] },
      "1": { imgPrefix: "../../", trans: { desktop: "../../about_us/", mobile: "../../about_us/" },
             left: [["../", "home"], ["#", "aboutUs"]],
             right: [["../menu", "menu"]],
             title: ["#", "aboutUs"],
             mobileNav: [["../", "home"], ["../menu/", "menu"]] },
      "2": { imgPrefix: "../../", trans: { desktop: "../../about_us/", mobile: "../../about_us/" },
             left: [["../", "home"], ["#", "aboutUs"]],
             right: [["../fodaliste", "menu"]],
             title: ["#", "aboutUs"],
             mobileNav: [["../", "home"], ["../menu/", "menu"]] },
      "3": { imgPrefix: "../../", trans: { desktop: "../../about_us/", mobile: "../../about_us/" },
             left: [["../", "home"], ["#", "aboutUs"]],
             right: [["../hidjolev", "menu"]],
             title: ["#", "aboutUs"],
             mobileNav: [["../", "home"], ["../hidjolev/", "menu"]] }
    },

    /* ===== EVENTS PAGE ===== (English only; translate icon sits FIRST in #left, About+Events in #right) */
    events: {
      "0": { imgPrefix: "../", trans: { desktopFirst: "../es/eventos", mobile: "../es/menu" },
             leftLead: ["../es/eventos"],
             left: [["../", "home"], ["../menu/", "menu"]],
             right: [["../about_us/", "aboutUs"], ["#", "events", false, true]],
             title: ["#", "events"],
             mobileNav: [["../", "home"], ["../menu", "menu"], ["../about_us/", "aboutUs"]] }
    }
  };

  /* ---- BYTE-PINNED English homepage (verified oracle — do not alter output) -------------------- */
  function render0Home() {
    return '' +
      '<div id="navbar">' +
        '<nav id="left">' +
          '<a href="#">Home</a>' +
          '<a href="./about_us/">About Us</a>' +
        '</nav>' +
        '<img src="images/icon.webp" id="navIcon" alt="Logo for Pablo\'s Havana Cafe">' +
        '<nav id="right">' +
          '<a href="menu" target="_self">Menu</a>' +
          '<a href="./es" class="transIcon"><img src="./images/EngToEsp.webp" alt="English to Spanish"></a>' +
        '</nav>' +
      '</div>' +
      '<div id="mobileBar">' +
        '<img src="./images/icon.webp" id="navIconMobile" onclick="switchDisp()" alt="Logo for Pablo\'s Havana Cafe">' +
        '<a href="#" id="navtitle">Home</a>' +
        '<div id="mobileNav">' +
          '<a href="./menu/" class="dropdown">Menu</a>' +
          '<a href="./about_us/" class="dropdown">About Us</a>' +
        '</div>' +
        '<a href="javascript:void(0);" class="icon" onclick="switchDisp()" title="Mobile Nav">' +
          '<i class="fa fa-bars"></i>' +
        '</a>' +
        '<a href="./es" class="transIcon"><img src="./images/EngToEsp.webp" alt="English to Spanish"></a>' +
      '</div>';
  }

  /* ---- generic renderer for every other (page, lang) ------------------------------------------ */
  function label(tuple, lang) {
    // tuple = [href, key|literal, isLiteral?]
    return tuple[2] ? tuple[1] : t(tuple[1], lang);
  }

  function navLinks(rows, lang, cls) {
    var k = kli(lang);
    var klass = [cls, k].filter(Boolean).join(" ");
    return rows.map(function (r) {
      return aTag(r[0], label(r, lang), klass || null, null);
    }).join("");
  }

  function rightLinks(rows, lang) {
    // target="_self" marks the current-section link. By default it's the first right link
    // (Menu/Fódalíste/hidjolev). A row may override by setting its 4th tuple element to true
    // (the events page puts _self on the "Events" link, which is last).
    var k = kli(lang);
    var explicit = rows.some(function (r) { return r[3]; });
    return rows.map(function (r, i) {
      var isSelf = explicit ? !!r[3] : (i === 0);
      var extra = isSelf ? 'target="_self"' : null;
      return aTag(r[0], label(r, lang), k || null, extra);
    }).join("");
  }

  function renderGeneric(cfg, lang) {
    var k = kli(lang);
    var titleCls = k ? (' class="' + k + '"') : '';
    var iconPrefix = cfg.imgPrefix;
    var transImgPrefix = cfg.transImgPrefix || cfg.imgPrefix; // usually same as logo prefix

    // events page: translate link leads the #left nav, then Home/Menu; About+Events on the right.
    var leftLead = "";
    if (cfg.leftLead) {
      leftLead = transLink(lang, cfg.trans.desktopFirst, transImgPrefix);
    }

    var desktopTransHref = cfg.trans.desktop;
    var desktopTransInRight = !cfg.leftLead; // normal layout = translate in #right

    var rightInner = rightLinks(cfg.right, lang);
    if (desktopTransInRight) {
      rightInner += transLink(lang, desktopTransHref, transImgPrefix);
    }

    var navbar =
      '<div id="navbar">' +
        '<nav id="left">' + leftLead + navLinks(cfg.left, lang, null) + '</nav>' +
        '<img src="' + iconPrefix + 'images/icon.webp" id="navIcon" onclick="switchDisp()" alt="Logo for Pablo\'s Havana Cafe">' +
        '<nav id="right">' + rightInner + '</nav>' +
      '</div>';

    var titleHref = cfg.title[0];
    var titleLabel = t(cfg.title[1], lang);
    var mobileTransHref = cfg.trans.mobile;

    var mobileBar =
      '<div id="mobileBar">' +
        '<img src="' + iconPrefix + 'images/icon.webp" id="navIconMobile" onclick="switchDisp()" alt="Logo for Pablo\'s Havana Cafe">' +
        '<a href="' + titleHref + '" id="navtitle"' + titleCls + '>' + titleLabel + '</a>' +
        '<div id="mobileNav">' + navLinks(cfg.mobileNav, lang, "dropdown") + '</div>' +
        '<a href="javascript:void(0);" class="icon" onclick="switchDisp()" title="' + t("mobileToggleTitle", lang) + '">' +
          '<i class="fa fa-bars"></i>' +
        '</a>' +
        transLink(lang, mobileTransHref, transImgPrefix) +
      '</div>';

    return navbar + mobileBar;
  }

  function render(lang, page) {
    if (lang === "0" && page === "home") return render0Home();
    var byPage = CONFIG[page] || CONFIG.home;
    var cfg = byPage[lang] || byPage["0"] || CONFIG.home["0"];
    return renderGeneric(cfg, lang);
  }

  class PhcNavbar extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute("lang") || "0";
      var page = this.getAttribute("page") || "home";
      this.innerHTML = render(lang, page);
    }
  }

  if (!customElements.get("phc-navbar")) customElements.define("phc-navbar", PhcNavbar);
})(window);
