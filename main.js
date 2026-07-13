/* ============================================
   PORTFOLIO — main.js
   ============================================ */
(function () {
  'use strict';

  /* ------------------------------------------
     1. THEME — default LIGHT, user can toggle
     ------------------------------------------ */
  var html      = document.documentElement;
  var themeBtn  = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    if (themeIcon) {
      themeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
    }
  }

  /* Always start light unless user explicitly saved dark */
  var saved = localStorage.getItem('theme');
  applyTheme(saved === 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = html.classList.contains('dark');
      applyTheme(!isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }

  /* ------------------------------------------
     2. NAVBAR — scrolled shadow + active link
     ------------------------------------------ */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 8) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  var currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------
     3. MOBILE MENU
     ------------------------------------------ */
  var menuBtn    = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      var icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = open ? 'close' : 'menu';
    });
    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        var icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      }
    });
  }

  /* ------------------------------------------
     4. SCROLL REVEAL
     ------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ------------------------------------------
     5. PROJECT FILTER TABS
     ------------------------------------------ */
  var filterTabs   = document.querySelectorAll('.filter-tab');
  var projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.dataset.filter;
        projectCards.forEach(function (card) {
          var show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ------------------------------------------
     6. ANIMATED STAT COUNTERS
     ------------------------------------------ */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target || el.textContent);
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var val = target * ease;
      el.textContent = (val >= 10 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObs.observe(c); });
  }

  /* ------------------------------------------
     7. CONTACT FORM — feedback
     ------------------------------------------ */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      if (!btn) return;
      var original = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Message sent!';
      btn.disabled = true;
      btn.style.background = '#22c55e';
      setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled  = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    });
  }

  /* ------------------------------------------
     8. SMOOTH ANCHOR SCROLLING
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
