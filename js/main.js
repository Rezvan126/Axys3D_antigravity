/* ============================================================
   AXYS3D — Main JavaScript
   Mobile navigation toggle + Work page filter logic.
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile Navigation ─────────────────────────────────── */
  const menuBtn = document.querySelector('.menu-button');
  const mobilePanel = document.getElementById('mobile-navigation');

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobilePanel.getAttribute('data-open') === 'true';
      mobilePanel.setAttribute('data-open', String(!isOpen));
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      menuBtn.textContent = isOpen ? 'Menu' : 'Close';
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobilePanel.getAttribute('data-open') === 'true') {
        mobilePanel.setAttribute('data-open', 'false');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
        menuBtn.focus();
      }
    });
  }

  /* ── Work Page Filters ─────────────────────────────────── */
  const filterContainer = document.getElementById('technical-filters');
  if (!filterContainer) return;

  const selects = filterContainer.querySelectorAll('select');
  const projectCards = document.querySelectorAll('.project-card');
  const resultsCount = document.querySelector('.work-results-bar p');
  const clearBtn = document.querySelector('.work-results-bar .text-button');

  function getFilterValues() {
    const values = {};
    selects.forEach(function (sel) {
      const label = sel.closest('label');
      const name = label ? label.querySelector('span').textContent.trim().toLowerCase() : '';
      values[name] = sel.value;
    });
    return values;
  }

  function applyFilters() {
    const filters = getFilterValues();
    let visible = 0;

    projectCards.forEach(function (card) {
      const tags = card.querySelector('.project-card-tags');
      const tagTexts = tags
        ? Array.from(tags.querySelectorAll('span')).map(function (s) { return s.textContent.trim(); })
        : [];
      const eyebrow = card.querySelector('.eyebrow');
      const eyebrowText = eyebrow ? eyebrow.textContent.trim() : '';
      const badge = card.querySelector('.badge');
      const badgeText = badge ? badge.textContent.trim().toLowerCase() : '';

      let show = true;

      // Service filter
      if (filters['service'] && !tagTexts.includes(filters['service'])) {
        show = false;
      }

      // Project stage filter
      if (filters['project stage'] && !eyebrowText.includes(filters['project stage'])) {
        show = false;
      }

      // Sector filter
      if (filters['sector'] && !eyebrowText.includes(filters['sector'])) {
        show = false;
      }

      // Delivery type filter
      if (filters['delivery type'] && !tagTexts.includes(filters['delivery type'])) {
        show = false;
      }

      // Publication status filter
      if (filters['public / nda-safe status']) {
        const val = filters['public / nda-safe status'];
        if (val === 'demonstration' && !badgeText.includes('demonstration')) show = false;
        if (val === 'anonymous' && !badgeText.includes('anonymous')) show = false;
        if (val === 'approved-public' && !badgeText.includes('approved')) show = false;
      }

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (resultsCount) {
      resultsCount.innerHTML = '<strong>' + visible + '</strong> case ' + (visible === 1 ? 'study' : 'studies');
    }

    if (clearBtn) {
      const anyActive = Array.from(selects).some(function (s) { return s.value !== ''; });
      clearBtn.disabled = !anyActive;
    }
  }

  selects.forEach(function (sel) {
    sel.addEventListener('change', applyFilters);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      selects.forEach(function (sel) { sel.value = ''; });
      applyFilters();
    });
  }
})();
