/*
 * core.js — a shared, zero-build "PHC" namespace of PURE (no-DOM) logic, deduplicated out of
 * script.js and menuBuilder.js. See REWRITE-ARCHITECTURE.md (builder dedup slice).
 *
 * CLASSIC ON PURPOSE. Do NOT add `export` or load this as type="module". The classic glue
 * (script.js, menuBuilder.js) reads window.PHC.* SYNCHRONOUSLY; turning this into a module would
 * defer/reorder it and break those reads, and modules don't interoperate with the site's inline
 * on*= handler model. Load it as a plain <script src="/core.js"> BEFORE script.js / menuBuilder.js
 * on every page that uses them.
 *
 * It declares nothing global except the frozen window.PHC. In particular it NEVER declares or
 * reads the `lang` global — lang is always passed in as a parameter.
 */
(function (root) {
  root.PHC = Object.freeze({
    // pathFix(link, pathname): rewrite a root-absolute "/x" link to the correct relative depth for
    // `pathname`. Verbatim logic from the original script.js pathFix (and menuBuilder.addImg's copy);
    // the only change is that pathname is passed in rather than read from window.location.
    pathFix: function (link, pathname) {
      if (link.charAt(0) == "/") {
        const homeDist = pathname.split("/").length;
        for (let i = 1; i < homeDist; i++) link = "/.." + link;
      } else console.log("Error: Link must start with /");
      return link;
    },

    // Per-language CSV column suffix: 0=en, 1=es, 2=ang, 3=tlh. Deep-frozen (the outer
    // Object.freeze doesn't freeze nested arrays) so the exposed data is truly immutable.
    LANG_SUFFIX: Object.freeze(["_en", "_es", "_ang", "_tlh"]),

    // kli(base, lang): returns `base`, or "base kli" when the active language is Klingon (lang 3).
    kli: function (base, lang) {
      return lang == 3 ? base + " kli" : base;
    }
  });
})(window);
