/* ============================================================
   AXYS3D — Main JavaScript
   Mobile Navigation + Seamless Video Splash Background Remover.
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

  /* ── Official Splash Animation (Seamless Chroma-Key Canvas) ── */
  var splash = document.querySelector('.splash-screen');
  if (splash) {
    var vid = splash.querySelector('video');
    var canvas = splash.querySelector('canvas');
    
    var dismiss = function () {
      splash.classList.add('is-hidden');
      setTimeout(function () {
        splash.style.display = 'none';
      }, 500);
    };

    if (sessionStorage.getItem('axys-splash-shown')) {
      splash.classList.add('is-hidden');
      splash.style.display = 'none';
    } else {
      sessionStorage.setItem('axys-splash-shown', '1');

      if (vid && canvas) {
        var ctx = canvas.getContext('2d');
        var animId = null;

        var processFrame = function () {
          if (vid.paused || vid.ended) return;

          if (canvas.width !== vid.videoWidth && vid.videoWidth > 0) {
            canvas.width = vid.videoWidth;
            canvas.height = vid.videoHeight;
          }

          if (canvas.width > 0) {
            ctx.drawImage(vid, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;

            // Key out background pixels (r > 200, g > 200, b > 200) -> 100% transparent
            for (var i = 0; i < data.length; i += 4) {
              if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
                data[i + 3] = 0;
              }
            }
            ctx.putImageData(imgData, 0, 0);
          }

          animId = requestAnimationFrame(processFrame);
        };

        vid.addEventListener('play', function () {
          animId = requestAnimationFrame(processFrame);
        });

        vid.addEventListener('ended', function () {
          if (animId) cancelAnimationFrame(animId);
          dismiss();
        }, { once: true });

        // Safety fallback timer (max 2.4s)
        var fallback = setTimeout(function () {
          if (animId) cancelAnimationFrame(animId);
          dismiss();
        }, 2400);

        var playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            dismiss();
          });
        }
      } else {
        dismiss();
      }
    }
  }
})();
