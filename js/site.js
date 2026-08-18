/* Theme toggle — remembers the visitor's choice, defaults to their OS setting. */
(function () {
  var KEY = 'ac-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    function label() {
      var explicit = document.documentElement.getAttribute('data-theme');
      var dark = explicit
        ? explicit === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      btn.textContent = dark ? '☀' : '☾';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    label();
    btn.addEventListener('click', function () {
      var explicit = document.documentElement.getAttribute('data-theme');
      var dark = explicit
        ? explicit === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label();
    });
  });
})();

/* Publications: filter by theme, or switch to a single chronological list. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.querySelector('.filters');
    if (!bar) return;

    var blocks = Array.prototype.slice.call(document.querySelectorAll('.theme-block'));
    var buttons = Array.prototype.slice.call(bar.querySelectorAll('button'));

    /* Views that replace the themed listing entirely, rather than filtering it. */
    var overviews = {
      chrono: document.getElementById('chronological'),
      progress: document.getElementById('inprogress')
    };

    function apply(key) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.filter === key));
      });

      Object.keys(overviews).forEach(function (k) {
        if (overviews[k]) overviews[k].classList.toggle('hidden', k !== key);
      });

      var showingOverview = !!overviews[key];
      blocks.forEach(function (b) {
        b.classList.toggle('hidden',
          showingOverview || (key !== 'all' && b.dataset.theme !== key));
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.dataset.filter);
        history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '#' + b.dataset.filter);
      });
    });

    /* Deep links: research.html#climate opens straight to that theme. */
    function applyFromHash() {
      var hash = location.hash.replace('#', '');
      if (hash && buttons.some(function (b) { return b.dataset.filter === hash; })) {
        apply(hash);
      } else if (!hash) {
        apply('all');
      }
      /* An unrecognised hash is left alone — it may target a normal anchor. */
    }
    applyFromHash();

    /* Keep the filter in sync when the hash changes without a reload:
       edited in the address bar, or the back/forward buttons. */
    window.addEventListener('hashchange', applyFromHash);
  });
})();
