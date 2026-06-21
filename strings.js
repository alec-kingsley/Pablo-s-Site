/*
 * strings.js — centralized i18n string table for the shared nav chrome (the dedup-of-text graft
 * from REWRITE-ARCHITECTURE.md). Rows are keyed by language index: 0=en, 1=es, 2=ang, 3=tlh.
 *
 * This is a CLASSIC script (no module). It must load BEFORE components/navbar.js (which reads
 * window.PHC_STRINGS). Only the *visible label/title text* lives here — per-page link targets and
 * per-language image assets stay in navbar.js, because those vary by page, not just by language.
 *
 * Why centralize the text: today the four navbars are hand-duplicated, so a missing translation is a
 * silent per-file omission. With one table, every language column is visible side-by-side and a gap
 * is obvious. The `mobileToggleTitle` row is exactly such a gap that got fixed here (ang/tlh were
 * left as the English "Mobile Nav" in the legacy markup — see DRIFT notes in navbar.js).
 */
(function (root) {
  // Each entry: [en, es, ang, tlh]. Index with the lang number.
  var S = {
    home:    ["Home",      "Inicio",         "Heofod",   "juh"],       // home / nav title
    aboutUs: ["About Us",  "Quienes Somos",  "Ymb Us",   "mah bop"],   // about-us link label
    menu:    ["Menu",      "Menú",           "Fódalíste", "hidjolev"],  // menu link label
    events:  ["Events",    "Eventos",        "Gerǽdu",   "qaStaHvIS"],  // events label (en events page only)

    // Hamburger toggle tooltip/title. es localized it in legacy markup ("navegación móvil");
    // ang + tlh were left untranslated ("Mobile Nav") — FIXED here (drift item #4).
    mobileToggleTitle: ["Mobile Nav", "Navegación móvil", "Færende Webloca", "ngeHwI' De'wI'"]
  };

  // alt text for the language-switch (translate) icon, keyed by lang. The translate icon on a
  // language's page points AWAY from that language, so the alt describes the destination language
  // exactly as the legacy per-page markup did.
  var TRANS_ALT = {
    toEs:  "English to Spanish",  // shown on en pages (switch en -> es)
    toEn0: "Español a ingles",    // shown on es pages (switch es -> en)
    toEn2: "Modern English",      // shown on ang pages (switch ang -> en)
    toEn3: "English"              // shown on tlh pages (switch tlh -> en)
  };

  root.PHC_STRINGS = { S: S, TRANS_ALT: TRANS_ALT };
})(window);
