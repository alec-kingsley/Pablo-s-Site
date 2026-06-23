/*
 * <phc-contact-form lang="N"> — the homepage contact form as a zero-build, light-DOM custom element.
 *
 * Rewrite component (see REWRITE-ARCHITECTURE.md, Phase 5). Replaces the hand-duplicated
 * `<div id="form">...</div>` block on the 4 homepages (en / es / ang / tlh), collapsing it to ONE
 * source of structure and pulling visible TEXT from strings.js. A one-line edit here propagates to
 * every homepage on plain file save (no build).
 *
 * ATTRIBUTES
 *   lang="N"  required. Language index: 0=en, 1=es, 2=ang, 3=tlh. Selects the string column and,
 *             for lang 3 (tlh) only, appends the `kli` font class to the heading + every form control.
 *
 * SPEC-008 IS LOAD-BEARING. form.js binds behavior to this exact markup with NO build step, so the
 * emitted DOM must be byte-exact or validation/submission breaks silently:
 *   - `<div id="form">` wrapper; inside, a heading `<div>` (contactHeading; lang 3 = `<div class="kli">`).
 *   - `<form name="contactUs" class="contact1-form" autocomplete="on" onsubmit="false">`
 *       form.js reads document.forms['contactUs']; querySelector hooks on .contact1-form (with an
 *       `if (contactForm)` guard); the literal onsubmit="false" is preserved VERBATIM (not "return false").
 *   - three text inputs in order — name="Name" id="name", name="Email" id="email",
 *       name="Subject" id="subject" — read by form.js by name/id, kept EXACT.
 *   - `<textarea name="Message" class="question">`.
 *   - `<br>` then `<button class="submit" type="submit">` (sendButton).
 *   For lang 3 ONLY: the three inputs become class="text kli", the textarea class="question kli",
 *   the button class="submit kli", and the heading div class="kli". Lang 0/1/2 carry NO kli.
 *
 * TIMING: classic script (no module), loaded in <head> AFTER strings.js (which navbar.js also needs).
 * customElements.define() runs before the parser reaches <phc-contact-form>, so the element upgrades
 * SYNCHRONOUSLY in connectedCallback. This component emits MARKUP ONLY — it never touches form.js
 * behavior, nor the lang<2 ownerMail / lang>=2 devMail routing.
 *
 * BYTE-PARITY: lang 0 (the English homepage, index.html) does NOT load strings.js, so window.PHC_STRINGS
 * may be undefined there. The lang-0 path is a byte-literal that NEVER reads PHC_STRINGS — see
 * render0(). Only lang 1/2/3 read strings.js, and that access is guarded so it cannot throw.
 *
 * tlh placeholders have NO trailing "..." (poflij, not poflij...) — preserved from the strings.js keys.
 */
(function (root) {
  var STR = (root.PHC_STRINGS && root.PHC_STRINGS.S) || {};

  // tlh (lang 3) carries the `kli` font class on the heading + every form control; no other lang does.
  function kli(lang) { return lang === "3" ? "kli" : ""; }

  // t(key, lang) — visible text from the i18n table; falls back to the key if the row is missing.
  function t(key, lang) {
    var row = STR[key];
    return row ? row[+lang] : key;
  }

  /* ---- BYTE-PINNED English homepage (lang 0) — never touches window.PHC_STRINGS ----------------- */
  function render0() {
    return '' +
      '<div id="form">' +
        '<div>Contact Us</div>' +
        '<form name="contactUs" class="contact1-form" autocomplete="on" onsubmit="false">' +
          '<input type="text" name="Name" id="name" class="text" placeholder="Name...">' +
          '<input type="text" name="Email" id="email" class="text" placeholder="E-Mail...">' +
          '<input type="text" name="Subject" id="subject" class="text" placeholder="Subject...">' +
          '<textarea name="Message" class="question" placeholder="Message..."></textarea>' +
          '<br>' +
          '<button class="submit" type="submit">Send</button>' +
        '</form>' +
      '</div>';
  }

  /* ---- generic renderer for lang 1/2/3 (reads strings.js) ------------------------------------- */
  function renderGeneric(lang) {
    var k = kli(lang);                              // "kli" for tlh, "" otherwise
    var sp = k ? (" " + k) : "";                    // class suffix for form controls
    var headCls = k ? (' class="' + k + '"') : '';  // heading div class

    return '' +
      '<div id="form">' +
        '<div' + headCls + '>' + t("contactHeading", lang) + '</div>' +
        '<form name="contactUs" class="contact1-form" autocomplete="on" onsubmit="false">' +
          '<input type="text" name="Name" id="name" class="text' + sp + '" placeholder="' + t("phName", lang) + '">' +
          '<input type="text" name="Email" id="email" class="text' + sp + '" placeholder="' + t("phEmail", lang) + '">' +
          '<input type="text" name="Subject" id="subject" class="text' + sp + '" placeholder="' + t("phSubject", lang) + '">' +
          '<textarea name="Message" class="question' + sp + '" placeholder="' + t("phMessage", lang) + '"></textarea>' +
          '<br>' +
          '<button class="submit' + sp + '" type="submit">' + t("sendButton", lang) + '</button>' +
        '</form>' +
      '</div>';
  }

  function render(lang) {
    if (lang === "0") return render0();
    return renderGeneric(lang);
  }

  class PhcContactForm extends HTMLElement {
    connectedCallback() {
      var lang = this.getAttribute("lang") || "0";
      this.innerHTML = render(lang);
    }
  }

  if (!customElements.get("phc-contact-form")) customElements.define("phc-contact-form", PhcContactForm);
})(window);
