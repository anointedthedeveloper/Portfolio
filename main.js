/* ============================================
   PORTFOLIO — main.js
   Handles: dark mode, mobile menu, scroll reveal,
            project filtering, active nav links
   ============================================ */

(function () {
  'use strict';

  /* ---- Dark / Light mode ---- */
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('theme-toggle');
  const themeIcon  = document.getElementById('theme-icon');

  function applyTheme(dark) {
    html.classList.toggle('dark', dark);
    if (themeIcon) {
      themeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
    }
  }

  // Default: light mode; respect saved preference
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (!saved && prefersDark));

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = html.classList.contains('dark');
      applyTheme(!isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }

  /* ---- Mobile menu ---- */
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = open ? 'close' : 'menu';
    });
  }

  /* ---- Active nav link ---- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Project filter tabs ---- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const cat = tab.dataset.filter;

        projectCards.forEach(function (card) {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- Sticky navbar shadow on scroll ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(0,0,0,0.08)'
        : 'none';
    }, { passive: true });
  }

  /* ---- Contact form (preventDefault + basic feedback) ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Message sent!';
        btn.disabled = true;
        btn.style.background = '#22c55e';
        setTimeout(function () {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

})();
