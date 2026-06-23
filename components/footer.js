/*
 * <phc-footer lang="N"> — the #hours footer block as a zero-build, light-DOM custom element.
 *
 * Rewrite component (see REWRITE-ARCHITECTURE.md, Phase 5). Replaces the hand-duplicated
 * <div id="hours"> block on the 4 homepages (en/es/ang/tlh), collapsing it to ONE source of
 * structure with the visible TEXT pulled from strings.js (the i18n-table graft). A one-line edit
 * here propagates to every homepage on a plain file save.
 *
 * ATTRIBUTES
 *   lang="N"   required. Language index: 0=en, 1=es, 2=ang, 3=tlh. Selects the string column, the
 *              heading tag (h2 vs h1), the `kli` Klingon font class, and the images/ path prefix.
 *
 * TIMING: this is a CLASSIC script loaded in <head> AFTER strings.js and BEFORE script.js, so
 * customElements.define() runs before the parser reaches <phc-footer>, the element upgrades
 * SYNCHRONOUSLY (renders #hours / #isOpen / #sun-wed / #thur-sat), and script.js's behavior
 * (untilClose() reading #isOpen, daySelect() underlining #sun-wed/#thur-sat) finds them. This
 * component emits ONLY markup; script.js owns all behavior.
 *
 * SPEC-PINNED ids that MUST survive exactly (script.js reads them by id): id="hours",
 * mark id="isOpen" (untilClose sets its text on open), id="sun-wed" / id="thur-sat" (daySelect
 * underlines them), id="mediaLinks".
 *
 * The #isOpen DEFAULT text is the LOCALIZED closed word (Closed/Cerrado/Clýsde/sokmohta'), not
 * English for all: there is no langClosed in script.js, so the static default IS the closed state.
 * Emitting English for every language would introduce a real i18n bug.
 *
 * BYTE-PARITY: lang 0 (English homepage) emits the legacy #hours block as a byte-literal that NEVER
 * reads window.PHC_STRINGS — index.html does not load strings.js, so PHC_STRINGS is undefined there.
 * Only lang 1/2/3 read strings.js (guarded). See render0Home().
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
  // Heading tag: en/es use <h2>, ang/tlh use <h1>. Only tlh (lang 3) carries the `kli` font class
  // on its heading AND on its day-row <h3>s. Image src prefix is the relative dir to images/.
  var hoursHeadingTag = ["h2", "h2", "h1", "h1"];
  var hoursHeadingKli = [false, false, false, true];
  var dayRowKli       = [false, false, false, true];
  var mediaImgPrefix  = ["./", "../", "../", "../"];

  /* ---- BYTE-PINNED English homepage (does NOT touch window.PHC_STRINGS) ------------------------ */
  function render0Home() {
    return '' +
      '<div id="hours">' +
        '<h2>Hours (<mark id="isOpen">Closed</mark>)</h2>' +
        '<h3 id="sun-wed">Sunday-Wednesday: 11am-8pm</h3>' +
        '<h3 id="thur-sat">Thursday-Saturday: 11am-9pm</h3>' +
        '<div id="mediaLinks">' +
          '<a href="https://www.facebook.com/pabloshavanacafe/"><img src="./images/FacebookLogo.webp" alt="Facebook"></a>' +
          '<a href="https://www.instagram.com/pabloshavanacafe/"><img src="./images/InstagramLogo.webp" alt="Instagram"></a>' +
        '</div>' +
      '</div>';
  }

  /* ---- generic renderer for lang 1/2/3 (reads strings.js via t()) ----------------------------- */
  function renderGeneric(lang) {
    var n = +lang;
    var tag = hoursHeadingTag[n];
    var headCls = hoursHeadingKli[n] ? ' class="kli"' : '';
    var rowCls = dayRowKli[n] ? ' class="kli"' : '';
    var prefix = mediaImgPrefix[n];

    var heading =
      '<' + tag + headCls + '>' +
        t("hoursLabel", lang) + ' (<mark id="isOpen">' + t("statusClosed", lang) + '</mark>)' +
      '</' + tag + '>';

    return '' +
      '<div id="hours">' +
        heading +
        '<h3' + rowCls + ' id="sun-wed">' + t("sunWed", lang) + '</h3>' +
        '<h3' + rowCls + ' id="thur-sat">' + t("thurSat", lang) + '</h3>' +
        '<div id="mediaLinks">' +
          '<a href="https://www.facebook.com/pabloshavanacafe/"><img src="' + prefix + 'images/FacebookLogo.webp" alt="Facebook"></a>' +
          '<a href="https://www.instagram.com/pabloshavanacafe/"><img src="' + prefix + 'images/InstagramLogo.webp" alt="Instagram"></a>' +
        '</div>' +
      '</div>';
  }

  function render(lang) {
    if (lang === "0") return render0Home();
    return renderGeneric(lang);
  }

  class PhcFooter extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute("lang") || "0";
      this.innerHTML = render(lang);
    }
  }

  if (!customElements.get("phc-footer")) customElements.define("phc-footer", PhcFooter);
})(window);
