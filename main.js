/* Portfolio runtime: theme, navigation, GitHub data, project showcase, contact form.
   No dependencies. Data lives in data.js. */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  var root = document.documentElement;
  var ICONS = 'assets/icons.svg';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reducedMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="' + ICONS + '#i-' + name + '"/></svg>';
  }
  function store(method, key, val) {
    try { return method === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* ---------- Theme (initial value is set by the inline script in <head>) ---------- */
  var themeBtn = $('.theme-toggle');
  function syncThemeBtn() {
    if (!themeBtn) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  syncThemeBtn();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('set', 'theme', next);
    syncThemeBtn();
  });

  /* ---------- Header + mobile menu ---------- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 6); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menuBtn = $('.menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $$('a, button', menu).forEach(function (el) { el.tabIndex = open ? 0 : -1; });
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (menuBtn && menu) {
    setMenu(false);
    menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 52.01rem)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Scroll reveal ---------- */
  var io = null;
  if ('IntersectionObserver' in window && !reducedMotion) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  }
  function observe(scope) {
    $$('.reveal:not(.is-in)', scope).forEach(function (el, i) {
      if (!io) { el.classList.add('is-in'); return; }
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 4);
      io.observe(el);
    });
  }

  /* ---------- Small helpers ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var years = new Date().getFullYear() - D.careerStartYear;
  $$('[data-project-count]').forEach(function (el) { el.textContent = D.projects.length; });
  $$('[data-years]').forEach(function (el) { el.textContent = years + '+'; });

  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    if (s < 86400 * 30) return Math.round(s / 86400) + 'd ago';
    if (s < 86400 * 365) return Math.round(s / (86400 * 30)) + 'mo ago';
    return Math.round(s / (86400 * 365)) + 'y ago';
  }
  var nf = new Intl.NumberFormat('en');

  /* ---------- GitHub data (public API, no token, cached in localStorage) ---------- */
  var GH = { key: 'gh-cache-v1', ttl: 6 * 3600 * 1000, api: 'https://api.github.com' };

  function ghFetch(path) {
    return fetch(GH.api + path, { headers: { Accept: 'application/vnd.github+json' } }).then(function (r) {
      if (!r.ok) throw new Error('GitHub API ' + r.status);
      return r.json();
    });
  }
  function fetchGitHub() {
    return ghFetch('/users/' + D.githubUser).then(function (u) {
      var pages = Math.max(1, Math.ceil(u.public_repos / 100)), reqs = [];
      for (var p = 1; p <= Math.min(pages, 5); p++) {
        reqs.push(ghFetch('/users/' + D.githubUser + '/repos?per_page=100&sort=pushed&page=' + p));
      }
      return Promise.all(reqs).then(function (chunks) {
        var repos = [].concat.apply([], chunks).map(function (r) {
          return { name: r.name, description: r.description, language: r.language, stars: r.stargazers_count,
                   forks: r.forks_count, fork: r.fork, pushed: r.pushed_at, url: r.html_url };
        });
        return { ts: Date.now(), user: { repos: u.public_repos, followers: u.followers, following: u.following }, repos: repos };
      });
    });
  }
  function loadGitHub() {
    var cached = null;
    try { cached = JSON.parse(store('get', GH.key)); } catch (e) {}
    if (cached && Date.now() - cached.ts < GH.ttl) return Promise.resolve({ state: 'cache', data: cached });
    return fetchGitHub().then(function (d) {
      store('set', GH.key, JSON.stringify(d));
      return { state: 'live', data: d };
    }).catch(function () {
      return cached ? { state: 'stale', data: cached } : { state: 'none', data: null };
    });
  }
  var ghPromise = loadGitHub();

  function countUp(el, to) {
    if (reducedMotion || !window.requestAnimationFrame) { el.textContent = nf.format(to); return; }
    var t0 = null, dur = 900;
    (function step(ts) {
      t0 = t0 || ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = nf.format(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function setStat(name, value) {
    $$('[data-stat="' + name + '"]').forEach(function (el) {
      el.classList.remove('is-loading');
      if (typeof value === 'number') countUp(el, value); else el.textContent = value;
    });
  }
  function hideTile(name) {
    $$('[data-tile="' + name + '"]').forEach(function (el) { el.hidden = true; });
    var grid = $('.metrics');
    if (grid) grid.style.setProperty('--cols', $$('.metric', grid).filter(function (m) { return !m.hidden; }).length);
  }

  ghPromise.then(function (res) {
    var d = res.data, note = $('[data-gh-note]');
    if (d) {
      setStat('repos', d.user.repos);
      setStat('followers', d.user.followers);
      var complete = d.repos.length >= d.user.repos;
      if (complete) {
        var stars = d.repos.reduce(function (n, r) { return n + (r.fork ? 0 : r.stars); }, 0);
        setStat('stars', stars);
      } else { hideTile('stars'); }
      if (note) note.textContent = (res.state === 'stale'
        ? 'GitHub is rate-limiting requests right now; showing figures cached ' + ago(new Date(d.ts).toISOString()) + '.'
        : 'Live from the public GitHub API, cached up to 6 hours.') + ' Stars count original (non-fork) repositories.';
    } else {
      setStat('repos', D.snapshot.public_repos);
      setStat('followers', D.snapshot.followers);
      hideTile('stars');
      if (note) note.textContent = 'Live GitHub data is unavailable, so these are figures from my profile on ' + D.snapshot.date + '.';
    }
    renderActivity(res);
  });

  /* ---------- Project cards ---------- */
  var byName = {};
  function indexRepos(data) {
    byName = {};
    if (data) data.repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
  }
  function artHtml(a) {
    var rows = a.lines.map(function (l) {
      if (l.length === 2) return '<p class="t-' + l[0] + '">' + esc(l[1]) + '</p>';
      return '<p><span class="t-' + l[0] + '">' + esc(l[1]) + '</span>' + esc(l[2]) + '</p>';
    }).join('');
    return '<div class="pcard__art" aria-hidden="true">' + rows + '<span class="pcard__art-label">' + esc(a.label) + '</span></div>';
  }
  function mediaHtml(p, eager) {
    var inner;
    if (p.image) {
      var b = 'assets/projects/' + p.image;
      inner = '<img src="' + b + '-1200.webp" srcset="' + b + '-640.webp 640w, ' + b + '-1200.webp 1200w" ' +
        'sizes="(min-width: 52rem) ' + (p.spot ? '640px' : '420px') + ', 100vw" width="1200" height="675" ' +
        'alt="' + esc(p.alt) + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
    } else if (p.art) {
      inner = artHtml(p.art);
    } else { return ''; }
    return '<div class="pcard__media">' + inner + '<span class="pcard__kind">' + esc(p.kind) + '</span></div>';
  }
  function metaHtml(p) {
    var r = p.repo && byName[p.repo.toLowerCase()];
    if (!r) return '';
    var h = '<span title="' + r.stars + ' GitHub stars">' + icon('star') + r.stars + '</span>';
    if (r.forks) h += '<span title="' + r.forks + ' forks">' + icon('fork') + r.forks + '</span>';
    return h;
  }
  function cardHtml(p, eager) {
    var media = mediaHtml(p, eager);
    var repoUrl = p.repo ? 'https://github.com/' + D.githubUser + '/' + p.repo : '';
    return '<article class="pcard' + (p.spot ? ' pcard--spot' : '') + '" data-id="' + p.id + '">' + media +
      '<div class="pcard__body">' +
      (media ? '' : '<p class="eyebrow">' + esc(p.kind) + '</p>') +
      '<div class="pcard__top"><h3 class="pcard__title">' + esc(p.name) + '</h3><div class="pcard__meta" data-meta>' + metaHtml(p) + '</div></div>' +
      '<p class="pcard__desc">' + esc(p.summary) + '</p>' +
      (p.why ? '<p class="pcard__why">' + esc(p.why) + '</p>' : '') +
      '<div class="chips">' + p.stack.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>' +
      '<div class="pcard__foot"><div class="pcard__links">' +
      (repoUrl ? '<a class="pcard__link" href="' + repoUrl + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(p.name) + ' source code on GitHub">' + icon('github') + 'Source</a>' : '') +
      (p.extra || []).map(function (x) { return '<a class="pcard__link" href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + icon('up-right') + esc(x.label) + '</a>'; }).join('') +
      (p.live ? '<a class="pcard__link" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(p.name) + ': ' + esc(p.liveLabel) + '">' + icon('up-right') + esc(p.liveLabel) + '</a>' : '') +
      '</div></div></div></article>';
  }
  function refreshMeta() {
    $$('.pcard').forEach(function (card) {
      var p = D.projects.filter(function (x) { return x.id === card.getAttribute('data-id'); })[0];
      var m = $('[data-meta]', card);
      if (p && m) m.innerHTML = metaHtml(p);
    });
  }

  function readyImages(scope) {
    $$('.pcard__media img', scope).forEach(function (img) {
      var done = function () { img.classList.add('is-loaded'); img.parentNode.classList.add('is-ready'); };
      if (img.complete && img.naturalWidth) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
    });
  }

  var homeList = $('[data-projects="home"]');
  if (homeList) {
    homeList.innerHTML = D.projects.filter(function (p) { return p.home; }).map(function (p, i) {
      return cardHtml(p, i === 0).replace('<article class="pcard', '<article class="reveal pcard');
    }).join('');
    readyImages(homeList); observe(homeList);
  }

  var clientList = $('[data-projects="client"]');
  if (clientList) {
    clientList.innerHTML = D.projects.filter(function (p) { return p.cat === 'client'; }).map(function (p) {
      return cardHtml(p, false).replace('<article class="pcard', '<article class="reveal pcard');
    }).join('');
    readyImages(clientList); observe(clientList);
  }

  var list = $('[data-projects="all"]');
  if (list) {
    var state = { cat: 'all', q: '', sort: 'curated' };
    var filtersEl = $('[data-filters]'), countEl = $('[data-count]'), emptyEl = $('[data-empty]');
    var searchEl = $('[data-search]'), sortEl = $('[data-sort]');
    var hash = location.hash.replace('#', '');
    if (D.categories.some(function (c) { return c.id === hash; })) state.cat = hash;

    var counts = {};
    D.projects.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    filtersEl.innerHTML = [{ id: 'all', label: 'All' }].concat(D.categories).map(function (c) {
      var n = c.id === 'all' ? D.projects.length : (counts[c.id] || 0);
      return n ? '<button type="button" class="filter" data-cat="' + c.id + '" aria-pressed="' + (c.id === state.cat) + '">' + esc(c.label) + '<small>' + n + '</small></button>' : '';
    }).join('');

    var render = function () {
      var q = state.q.trim().toLowerCase();
      var items = D.projects.map(function (p, i) { return { p: p, i: i, r: p.repo ? byName[p.repo.toLowerCase()] : null }; }).filter(function (x) {
        if (state.cat !== 'all' && x.p.cat !== state.cat) return false;
        if (!q) return true;
        return (x.p.name + ' ' + x.p.kind + ' ' + x.p.summary + ' ' + x.p.stack.join(' ')).toLowerCase().indexOf(q) > -1;
      });
      if (state.sort === 'stars') items.sort(function (a, b) { return (b.r ? b.r.stars : -1) - (a.r ? a.r.stars : -1) || a.i - b.i; });
      if (state.sort === 'recent') items.sort(function (a, b) { return (b.r ? Date.parse(b.r.pushed) : 0) - (a.r ? Date.parse(a.r.pushed) : 0) || a.i - b.i; });
      var first = true;
      list.innerHTML = items.map(function (x) {
        var p = x.p;
        var spot = p.spot && state.cat === 'all' && !q && state.sort === 'curated';
        var html = cardHtml(spot ? p : Object.assign({}, p, { spot: false }), first && spot);
        first = false;
        return html;
      }).join('');
      readyImages(list);
      emptyEl.hidden = items.length > 0;
      countEl.textContent = items.length + (items.length === 1 ? ' project' : ' projects') + (state.cat !== 'all' || q ? ' match' + (items.length === 1 ? 'es' : '') : '');
    };

    filtersEl.addEventListener('click', function (e) {
      var b = e.target.closest('.filter'); if (!b) return;
      state.cat = b.getAttribute('data-cat');
      $$('.filter', filtersEl).forEach(function (f) { f.setAttribute('aria-pressed', f === b ? 'true' : 'false'); });
      render();
    });
    searchEl.addEventListener('input', function () { state.q = searchEl.value; render(); });
    sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });
    $('[data-reset]').addEventListener('click', function () {
      state = { cat: 'all', q: '', sort: 'curated' };
      searchEl.value = ''; sortEl.value = 'curated';
      $$('.filter', filtersEl).forEach(function (f) { f.setAttribute('aria-pressed', f.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
      render();
    });
    render();
    ghPromise.then(function (res) {
      indexRepos(res.data);
      if (res.data) {
        $$('option[data-needs-gh]', sortEl).forEach(function (o) { o.disabled = false; });
      }
      if (state.sort !== 'curated') render(); else refreshMeta();
    });
  } else {
    ghPromise.then(function (res) { indexRepos(res.data); refreshMeta(); });
  }

  /* ---------- Recent activity (public repos only) ---------- */
  function renderActivity(res) {
    var ul = $('[data-activity]'); if (!ul) return;
    var d = res.data;
    if (!d) {
      ul.innerHTML = '<li class="status-line">' + icon('alert') + '<span>Live activity is unavailable right now. See everything on ' +
        '<a class="link" href="https://github.com/' + D.githubUser + '" target="_blank" rel="noopener noreferrer">GitHub</a>.</span></li>';
      return;
    }
    var recent = d.repos.filter(function (r) { return !r.fork; })
      .sort(function (a, b) { return Date.parse(b.pushed) - Date.parse(a.pushed); }).slice(0, 6);
    ul.innerHTML = recent.map(function (r) {
      return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="activity__name">' + esc(r.name) + '</span>' +
        '<span class="activity__when">' + ago(r.pushed) + '</span>' +
        '<span class="activity__desc">' + esc(r.description || 'No description') + '</span>' +
        '<span class="activity__lang">' + esc(r.language || '') + '</span></a></li>';
    }).join('');
  }

  /* ---------- Contact form (composes an email; nothing is sent to a server) ---------- */
  var form = $('#contact-form');
  if (form) {
    var TO = form.getAttribute('data-to');
    var status = $('[data-form-status]', form);
    var rules = {
      name: function (v) { return v.trim().length < 2 ? 'Please enter your name.' : ''; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
      message: function (v) { return v.trim().length < 10 ? 'Please write at least a sentence (10 characters).' : ''; }
    };
    var check = function (name) {
      var el = form.elements[name], msg = rules[name](el.value), err = $('#err-' + name);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      err.textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach(function (n) {
      form.elements[n].addEventListener('blur', function () { check(n); });
      form.elements[n].addEventListener('input', function () { if (form.elements[n].getAttribute('aria-invalid') === 'true') check(n); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = Object.keys(rules).filter(function (n) { return !check(n); });
      if (bad.length) { form.elements[bad[0]].focus(); status.textContent = ''; return; }
      var f = form.elements;
      var body = f.message.value.trim() + '\n\n— ' + f.name.value.trim() + ' (' + f.email.value.trim() + ')' +
        (f.type.value ? '\nEngagement: ' + f.type.options[f.type.selectedIndex].text : '');
      var subject = f.subject.value.trim() || 'Portfolio enquiry from ' + f.name.value.trim();
      status.textContent = 'Opening your email app… if nothing opens, write to ' + TO + ' directly.';
      window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- Motion details ---------- */
  var bar = $('.progress');
  if (bar) {
    var tick = false;
    var upd = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; tick = false;
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  var loader = $('.loader');
  if (loader) {
    var t0 = performance.now();
    var hide = function () {
      var wait = Math.max(0, 1050 - (performance.now() - t0));
      setTimeout(function () { loader.classList.add('is-done'); root.classList.remove('loading'); }, wait);
    };
    if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
    try { sessionStorage.setItem('seen', '1'); } catch (e) {}
  }

  var term = $('.term');
  if (term && !reducedMotion) {
    var lines = $$('.t-line', term), at = 350;
    lines.forEach(function (l) {
      l.style.setProperty('--d', at + 'ms');
      var cmd = $('.t-cmd', l);
      if (cmd) { var n = cmd.textContent.length; cmd.style.setProperty('--n', n); cmd.style.setProperty('--d', (at + 120) + 'ms'); cmd.style.setProperty('--t', (n * 38) + 'ms'); at += n * 38 + 260; }
      else at += 110;
    });
    term.classList.add('term--live');
  }

  if (window.matchMedia && matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.pcard'); if (!c) return;
      var b = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - b.left) + 'px'); c.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }, { passive: true });
  }

  observe(document);
})();
