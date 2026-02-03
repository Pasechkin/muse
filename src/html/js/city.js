document.addEventListener('DOMContentLoaded', function () {
  const dialog = document.getElementById('city-dialog');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const searchInput = document.getElementById('city-search');
  const gridRoot = document.getElementById('city-grid');
  // Options exist in multiple columns; listen on the whole dialog (or the grid if present).
  const optionsRoot = gridRoot || dialog;
  const noResults = document.getElementById('city-no-results');
  const resetBtn = dialog.querySelector('[data-city-reset]');

  const triggers = Array.from(document.querySelectorAll('[data-city-trigger]'));
  const currentLabels = Array.from(document.querySelectorAll('[data-city-current]'));
  const phoneLinks = Array.from(document.querySelectorAll('[data-city-phone]'));
  const phoneTextNodes = Array.from(document.querySelectorAll('[data-city-phone-text]'));

  const phoneMap = {
    moscow: {
      display: '+7 495 409-18-69',
      tel: '+74954091869'
    },
    spb: {
      display: '+7 812 408-18-69',
      tel: '+78124081869'
    },
    default: {
      display: '8 800 707-69-21',
      tel: '88007076921'
    }
  };

  function normalizeCityName(value) {
    const safe = (value || '').toLowerCase().replace(/ё/g, 'е');
    return safe.replace(/[^a-zа-я0-9]+/gi, ' ').trim();
  }

  function resolvePhoneForCity(name) {
    const normalized = normalizeCityName(name);
    if (normalized.startsWith('москва')) return phoneMap.moscow;
    if (normalized.startsWith('санкт петербург') || normalized === 'спб') return phoneMap.spb;
    return phoneMap.default;
  }

  function setCityPhones(name) {
    const phone = resolvePhoneForCity(name);
    phoneLinks.forEach((link) => {
      if (!(link instanceof HTMLElement)) return;
      if (link.tagName === 'A') link.setAttribute('href', `tel:${phone.tel}`);
      link.textContent = link.querySelector('[data-city-phone-text]') ? link.textContent : phone.display;
    });

    phoneTextNodes.forEach((node) => {
      node.textContent = phone.display;
    });
  }

  function closeDialogSafely() {
    try {
      dialog.close();
      return;
    } catch (e) {
      // ignore
    }

    // Fallback for environments where <dialog> behaves like a normal element.
    try {
      dialog.removeAttribute('open');
    } catch (e2) {
      // ignore
    }
    try {
      dialog.open = false;
    } catch (e3) {
      // ignore
    }
  }

  function ensureModalOverlay() {
    // Tailwind Plus Elements uses commandfor/command, but some environments can end up with a non-modal open dialog.
    // We enforce true modal so it doesn't render in-flow (e.g., "below footer").
    try {
      if (!dialog.open) {
        dialog.showModal();
        return;
      }
      if (typeof dialog.matches === 'function' && !dialog.matches(':modal')) {
        closeDialogSafely();
        dialog.showModal();
      }
    } catch (e) {
      // ignore
    }
  }

  function getAllOptions() {
    return optionsRoot ? Array.from(optionsRoot.querySelectorAll('[data-city-option]')) : [];
  }

  function hideItem(el, isHidden) {
    const li = el.closest('li');
    if (li) {
      li.classList.toggle('hidden', isHidden);
      return;
    }

    el.classList.toggle('hidden', isHidden);
  }

  function setCurrentCity(name) {
    const safeName = (name || '').trim();
    if (!safeName) return;

    currentLabels.forEach((el) => {
      el.textContent = safeName;
    });

    setCityPhones(safeName);

    try {
      localStorage.setItem('muse_city', safeName);
    } catch (e) {
      // ignore
    }
  }

  function getStoredCity() {
    try {
      return (localStorage.getItem('muse_city') || '').trim();
    } catch (e) {
      return '';
    }
  }

  function resetSearch() {
    if (searchInput) searchInput.value = '';

    const items = getAllOptions();
    items.forEach((el) => {
      hideItem(el, false);
    });

    dialog.querySelectorAll('[data-city-group]').forEach((group) => {
      group.classList.remove('hidden');
    });

    if (gridRoot) gridRoot.classList.remove('hidden');

    if (noResults) noResults.classList.add('hidden');
  }

  function applyFilter(query) {
    const q = (query || '').toLowerCase().trim();
    const items = getAllOptions();

    let visibleCount = 0;

    items.forEach((el) => {
      const name = (el.getAttribute('data-city-option') || el.textContent || '').toLowerCase();
      const match = !q || name.includes(q);
      hideItem(el, !match);
      if (match) visibleCount += 1;
    });

    dialog.querySelectorAll('[data-city-group]').forEach((group) => {
      const groupItems = Array.from(group.querySelectorAll('[data-city-option]'));
      const groupVisible = groupItems.some((el) => {
        const li = el.closest('li');
        if (li) return !li.classList.contains('hidden');
        return !el.classList.contains('hidden');
      });
      group.classList.toggle('hidden', !groupVisible);
    });

    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount !== 0);
    }

    if (gridRoot) {
      gridRoot.classList.toggle('hidden', visibleCount === 0);
    }
  }

  // Init current city
  const stored = getStoredCity();
  const initial = stored || (currentLabels[0] ? currentLabels[0].textContent.trim() : '');
  if (initial) setCurrentCity(initial);

  // Click: choose city
  if (optionsRoot) {
    optionsRoot.addEventListener('click', function (e) {
      const target = e.target instanceof Element ? e.target.closest('[data-city-option]') : null;
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();
      const name = (target.getAttribute('data-city-option') || target.textContent || '').trim();
      if (!name) return;

      setCurrentCity(name);

      // Close on next tick to avoid click-through reopening.
      window.setTimeout(function () {
        closeDialogSafely();
      }, 0);
    });
  }

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilter(searchInput.value);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      resetSearch();
      if (searchInput) {
        try {
          searchInput.focus();
        } catch (e2) {
          // ignore
        }
      }
    });
  }

  // Focus search after opening
  triggers.forEach((btn) => {
    btn.addEventListener('click', function () {
      window.setTimeout(function () {
        ensureModalOverlay();
        if (!dialog.open) return;
        if (searchInput) {
          try {
            searchInput.focus();
          } catch (e) {
            // ignore
          }
        }
      }, 0);
    });
  });

  // Reset on close
  dialog.addEventListener('close', function () {
    resetSearch();
  });

  dialog.addEventListener('cancel', function () {
    resetSearch();
  });
});
