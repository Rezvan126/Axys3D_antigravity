/* ============================================================
   AXYS3D — Main JavaScript
   Mobile Navigation Controller.
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile Navigation ─────────────────────────────────── */
  var menuBtn     = document.querySelector('.menu-button');
  var mobilePanel = document.getElementById('mobile-navigation');

  if (menuBtn && mobilePanel) {
    function toggleMenu(open) {
      var isOpen = open !== undefined ? open : mobilePanel.getAttribute('data-open') !== 'true';
      mobilePanel.setAttribute('data-open', String(isOpen));
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? 'Close' : 'Menu';
    }

    menuBtn.addEventListener('click', function () {
      toggleMenu();
    });

    var mobileLinks = mobilePanel.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobilePanel.getAttribute('data-open') === 'true') {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
  }
})();
