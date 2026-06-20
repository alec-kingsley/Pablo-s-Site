/*
 * <phc-navbar lang="N"> — shared homepage nav chrome as a zero-build, light-DOM custom element.
 *
 * Rewrite-spike component (see REWRITE-ARCHITECTURE.md). Replaces the ~20-line #navbar + #mobileBar block
 * that is hand-duplicated across the four language homepages (index.html, es/, ang/, tlh/) — collapsing it to
 * ONE source of structure AND text, keyed by language from the NAV table below (the i18n-table graft).
 *
 * IMPORTANT (timing): this is a CLASSIC script loaded in <head> BEFORE script.js, so customElements.define()
 * runs before the parser reaches <phc-navbar>, the element upgrades SYNCHRONOUSLY (renders #navIcon etc.), and
 * script.js's synchronous easterEgg() (script.js:13) finds #navIcon. No change to script.js's bootstrap needed.
 * Behavior functions (switchDisp, scrollFunction, easterEgg) stay global on window and act on the rendered DOM.
 */
(function () {
  // i18n + per-page link config, keyed by lang (0=en,1=es,2=ang,3=tlh). Spike: lang 0 fully specified.
  var NAV = {
    "0": {
      navIconSrc: "images/icon.webp",        // note: #navbar logo uses no leading ./ in the legacy markup
      mobileIconSrc: "./images/icon.webp",
      left: [["#", "Home"], ["./about_us/", "About Us"]],
      menu: ["menu", "Menu"],                // right-nav Menu link (carries target="_self")
      trans: { href: "./es", img: "./images/EngToEsp.webp", alt: "English to Spanish" },
      navtitle: ["#", "Home"],
      mobileNav: [["./menu/", "Menu"], ["./about_us/", "About Us"]],
      mobileToggleTitle: "Mobile Nav"
    }
    // 1 (es), 2 (ang), 3 (tlh) slot in here for the full rollout.
  };

  function links(rows, cls) {
    var c = cls ? (' class="' + cls + '"') : '';
    return rows.map(function (r) { return '<a href="' + r[0] + '"' + c + '>' + r[1] + '</a>'; }).join('');
  }

  function transLink(t) {
    return '<a href="' + t.href + '" class="transIcon"><img src="' + t.img + '" alt="' + t.alt + '"></a>';
  }

  function render(cfg) {
    return '' +
      '<div id="navbar">' +
        '<nav id="left">' + links(cfg.left, null) + '</nav>' +
        '<img src="' + cfg.navIconSrc + '" id="navIcon" alt="Logo for Pablo\'s Havana Cafe">' +
        '<nav id="right">' +
          '<a href="' + cfg.menu[0] + '" target="_self">' + cfg.menu[1] + '</a>' +
          transLink(cfg.trans) +
        '</nav>' +
      '</div>' +
      '<div id="mobileBar">' +
        '<img src="' + cfg.mobileIconSrc + '" id="navIconMobile" onclick="switchDisp()" alt="Logo for Pablo\'s Havana Cafe">' +
        '<a href="' + cfg.navtitle[0] + '" id="navtitle">' + cfg.navtitle[1] + '</a>' +
        '<div id="mobileNav">' + links(cfg.mobileNav, "dropdown") + '</div>' +
        '<a href="javascript:void(0);" class="icon" onclick="switchDisp()" title="' + cfg.mobileToggleTitle + '">' +
          '<i class="fa fa-bars"></i>' +
        '</a>' +
        transLink(cfg.trans) +
      '</div>';
  }

  class PhcNavbar extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute("lang") || "0";
      var cfg = NAV[lang] || NAV["0"];
      this.innerHTML = render(cfg);
    }
  }

  if (!customElements.get("phc-navbar")) customElements.define("phc-navbar", PhcNavbar);
})();
