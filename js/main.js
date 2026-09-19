(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme() {
    try {
      return localStorage.getItem('terminal-theme');
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    var isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    toggle.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
  }

  applyTheme(savedTheme() || root.dataset.theme || (media.matches ? 'dark' : 'light'));

  toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('terminal-theme', next);
    } catch (error) {
      void error;
    }
    applyTheme(next);
  });

  function onMediaChange(event) {
    if (!savedTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  }

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onMediaChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onMediaChange);
  }
})();
