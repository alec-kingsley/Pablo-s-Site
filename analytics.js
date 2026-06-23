/*
 * Google Tag Manager + Google Analytics (gtag.js), externalized from the inline blocks that were
 * hand-duplicated across 16 pages (rewrite dedup — see REWRITE-ARCHITECTURE.md). Loaded as a classic
 * <script src="/analytics.js"> at the same spot the inline block used to sit. The GTM <noscript>
 * iframe cannot be externalized (it must run when JS is disabled) and stays inline on each page.
 */

// Google Tag Manager
(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-5F3SN9X');

// Google Analytics gtag.js loader (was a <script async src> tag)
(function () {
  var g = document.createElement('script');
  g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=G-BFC5PZHYJS';
  document.head.appendChild(g);
})();

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-BFC5PZHYJS');
