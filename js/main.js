(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
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
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    themeToggle.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
  }

  applyTheme(savedTheme() || root.dataset.theme || (media.matches ? 'dark' : 'light'));

  themeToggle.addEventListener('click', function () {
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

  var search = document.querySelector('.search');
  var searchToggle = document.getElementById('search-toggle');
  var searchInput = document.getElementById('search-input');
  var searchClear = document.getElementById('search-clear');
  var emptyMessage = document.getElementById('search-empty');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function cardSearchText(card) {
    var title = card.querySelector('.card__title');
    var index = card.querySelector('.card__index');
    return normalize((title ? title.textContent : '') + ' ' + (index ? index.textContent : ''));
  }

  function filterCards() {
    var query = normalize(searchInput.value.trim());
    var visible = 0;

    cards.forEach(function (card) {
      var matches = !query || cardSearchText(card).indexOf(query) !== -1;
      card.hidden = !matches;
      if (matches) {
        visible += 1;
      }
    });

    searchClear.hidden = !searchInput.value;

    if (query && visible === 0) {
      emptyMessage.textContent = '// sin resultados: "' + searchInput.value.trim() + '"';
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
    }
  }

  function openSearch() {
    search.classList.add('search--open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }

  function closeSearch() {
    search.classList.remove('search--open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    filterCards();
  }

  searchToggle.addEventListener('click', function () {
    if (search.classList.contains('search--open')) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  searchInput.addEventListener('input', filterCards);

  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSearch();
      searchToggle.focus();
    }
  });

  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    filterCards();
    searchInput.focus();
  });

  document.addEventListener('click', function (event) {
    if (search.classList.contains('search--open') && !search.contains(event.target)) {
      closeSearch();
    }
  });
})();
