/* ============================================================
   AXYS3D — Main JavaScript
   Mobile Navigation + Official Splash Animation Controller.
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile Navigation ─────────────────────────────────── */
  var menuBtn    = document.querySelector('.menu-button');
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

  /* ── Official Splash Animation (homepage only) ─────────── */
  var splash = document.querySelector('.splash-screen');
  if (splash) {
    // Only show once per browser session — skip on reload/back-nav.
    if (sessionStorage.getItem('axys-splash-shown')) {
      splash.classList.add('is-hidden');
    } else {
      sessionStorage.setItem('axys-splash-shown', '1');
      var vid = splash.querySelector('video');
      var dismiss = function () {
        splash.classList.add('is-hidden');
      };
      // Fallback: dismiss after 3.5 s if video never fires 'ended'.
      var fallback = window.setTimeout(dismiss, 3500);
      if (vid) {
        vid.addEventListener('ended', function () {
          window.clearTimeout(fallback);
          dismiss();
        }, { once: true });
      }
    }
  }

})();
