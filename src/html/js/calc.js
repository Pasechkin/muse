/**
 * Muse Calculator Component v1.0
 * Конфигурируемый калькулятор для печати на холсте и портретов.
 *
 * Использование:
 *   <script src="js/calc.js"></script>
 *   <script>
 *     CalcInit({
 *       type: 'canvas',
 *       prices: { ... },
 *       frames: [ ... ]
 *     });
 *   </script>
 */
(function () {
  'use strict';

  /* ========== DEFAULT DATA ========== */

  var DEFAULT_FRAMES = [
    { id: 'NONE', name: 'Без багета', cat: 'STUDIO', color: 'transparent', width: 0, style: 'flat' },
    { id: 'ST_BLACK_M', name: 'Черный мат', cat: 'STUDIO', color: '#1a1a1a', width: 12, style: 'flat' },
    { id: 'ST_WHITE_M', name: 'Белый мат', cat: 'STUDIO', color: '#ffffff', width: 12, style: 'flat', border: '#e2e8f0' },
    { id: 'ST_GREY', name: 'Серый графит', cat: 'STUDIO', color: '#475569', width: 12, style: 'flat' },
    { id: 'ST_SILVER_S', name: 'Серебро сатин', cat: 'STUDIO', color: '#cbd5e1', width: 10, style: 'metallic' },
    { id: 'ST_GOLD_S', name: 'Золото сатин', cat: 'STUDIO', color: '#eab308', width: 10, style: 'metallic' },
    { id: 'ST_BLUE_DP', name: 'Синий дип', cat: 'STUDIO', color: '#1e3a8a', width: 15, style: 'flat' },
    { id: 'ST_RED_BR', name: 'Красный кирпич', cat: 'STUDIO', color: '#991b1b', width: 15, style: 'flat' },
    { id: 'ST_BEIGE', name: 'Бежевый', cat: 'STUDIO', color: '#f5f5dc', width: 12, style: 'flat', border: '#d6d3d1' },
    { id: 'ST_ALU_BLK', name: 'Алюм. черный', cat: 'STUDIO', color: '#000', width: 5, style: 'metallic' },
    { id: 'ST_ALU_SIL', name: 'Алюм. серебро', cat: 'STUDIO', color: '#94a3b8', width: 5, style: 'metallic' },
    { id: 'ST_ALU_GLD', name: 'Алюм. золото', cat: 'STUDIO', color: '#ca8a04', width: 5, style: 'metallic' },
    { id: 'ST_WENGE', name: 'Венге', cat: 'STUDIO', color: '#3f2e26', width: 14, style: 'wood' },
    { id: 'ST_OAK_L', name: 'Светлый дуб', cat: 'STUDIO', color: '#d4a373', width: 14, style: 'wood' },
    { id: 'ST_WALNUT', name: 'Орех', cat: 'STUDIO', color: '#5D4037', width: 14, style: 'wood' },
    { id: 'CL_GOLD_ORN', name: 'Золото узор', cat: 'CLASSIC', color: '#d4af37', width: 40, style: 'ornate_gold' },
    { id: 'CL_SILV_ORN', name: 'Серебро узор', cat: 'CLASSIC', color: '#c0c0c0', width: 40, style: 'ornate_silver' },
    { id: 'CL_MAHOGANY', name: 'Махагон', cat: 'CLASSIC', color: '#4a0404', width: 35, style: 'wood_gloss' },
    { id: 'CL_VINT_WHT', name: 'Винтаж белый', cat: 'CLASSIC', color: '#f0f0f0', width: 30, style: 'shabby' },
    { id: 'CL_BRONZE', name: 'Бронза антик', cat: 'CLASSIC', color: '#cd7f32', width: 35, style: 'metallic' },
    { id: 'CL_BLK_GLD', name: 'Черный с золотом', cat: 'CLASSIC', color: '#1a1a1a', width: 45, style: 'ornate_gold_inner' },
    { id: 'CL_ITALY_WD', name: 'Итал. орех', cat: 'CLASSIC', color: '#654321', width: 50, style: 'wood_carved' },
    { id: 'CL_PROVANCE', name: 'Прованс', cat: 'CLASSIC', color: '#e5e7eb', width: 25, style: 'shabby' },
    { id: 'CL_GOLD_LG', name: 'Золото широкое', cat: 'CLASSIC', color: '#ffd700', width: 60, style: 'ornate_gold' },
    { id: 'CL_SILV_LG', name: 'Серебро широкое', cat: 'CLASSIC', color: '#e2e8f0', width: 60, style: 'ornate_silver' },
    { id: 'CL_CHERRY', name: 'Вишня', cat: 'CLASSIC', color: '#722F37', width: 30, style: 'wood' },
    { id: 'CL_PINE', name: 'Сосна лак', cat: 'CLASSIC', color: '#E3C08D', width: 25, style: 'wood' }
  ];

  var DEFAULT_INTERIORS = [
    { id: 'GIRL', name: 'Интерьер', url: 'https://muse.ooo/upload/imgsite/canvas-628-398.webp', top: '18%', right: '18%', origin: 'top right' }
  ];

  var DEFAULT_SIZE_PRESETS = {
    PORTRAIT: [
      { w: 20, h: 30 },
      { w: 30, h: 40 },
      { w: 30, h: 45 },
      { w: 40, h: 50 },
      { w: 40, h: 60 },
      { w: 50, h: 70 },
      { w: 50, h: 75 },
      { w: 60, h: 80 },
      { w: 60, h: 90 },
      { w: 90, h: 120 }
    ],
    LANDSCAPE: [
      { w: 30, h: 20 },
      { w: 40, h: 30 },
      { w: 45, h: 30 },
      { w: 50, h: 40 },
      { w: 60, h: 40 },
      { w: 70, h: 50 },
      { w: 75, h: 50 },
      { w: 80, h: 60 },
      { w: 90, h: 60 },
      { w: 120, h: 90 }
    ],
    SQUARE: [{ w: 30, h: 30 }, { w: 40, h: 40 }, { w: 50, h: 50 }, { w: 60, h: 60 }, { w: 70, h: 70 }]
  };

  /**
   * MINIMAL_FALLBACK — минимальный набор, чтобы калькулятор не упал без prices.js.
   * Реальные цены должны приходить через cfg.prices из prices.js (MUSE_PRICES).
   * Значения здесь — только чтобы формулы не делили на NaN/undefined.
   */
  var MINIMAL_FALLBACK = {
    printSqCoeff: 0, printPStrCoeff: 0, printPBaseCoeff: 0, printConst: 0,
    stretcherStandard: 1, stretcherGallery: 1, stretcherRoll: 1,
    varnishCoeff: 0,
    giftWrapTiers: [],
    giftWrapOversizeLabel: '',
    framePerM: 0, frameClassicMult: 1,
    faceFirst: 0, faceExtra: 0,
    digitalFaceFirst: 0, digitalFaceExtra: 0,
    gelCoeff: 0, acrylicCoeff: 0, oilCoeff: 0, oilFaceExtra: 0, potalCoeff: 0
  };

  /** Сливает MINIMAL_FALLBACK с переданным cfg.prices (поключево, не «всё или ничего»). */
  function mergePrices(override) {
    var result = {};
    var k;
    for (k in MINIMAL_FALLBACK) {
      if (MINIMAL_FALLBACK.hasOwnProperty(k)) result[k] = MINIMAL_FALLBACK[k];
    }
    if (override) {
      for (k in override) {
        if (override.hasOwnProperty(k)) result[k] = override[k];
      }
    }
    return result;
  }

  /* ========== PUBLIC API ========== */

  window.CalcInit = function (cfg) {
    cfg = cfg || {};

    /* --- Normalize config once --- */
    cfg.type       = cfg.type || 'canvas';
    cfg.tooltips   = cfg.tooltips || null;
    cfg.prices     = cfg.prices || null;
    cfg.frames     = cfg.frames || null;
    cfg.interiors  = cfg.interiors || null;
    cfg.sizePresets = cfg.sizePresets || null;

    /* --- Data (overridable via config) --- */
    var FRAMES_DB    = cfg.frames      || DEFAULT_FRAMES;
    var INTERIORS_DB = cfg.interiors   || DEFAULT_INTERIORS;
    var SIZE_PRESETS  = cfg.sizePresets || DEFAULT_SIZE_PRESETS;
    var PRICES = mergePrices(cfg.prices);

    /* --- Warn if prices.js was not loaded (all zeros from fallback) --- */
    if (!cfg.prices) {
      console.warn('[CalcInit] cfg.prices is empty — prices.js not loaded? Using MINIMAL_FALLBACK (prices will be 0).');
    }

    /* --- Internal state --- */
    var STATE = {
      w: 20, h: 30, wrap: 'STANDARD', varnish: true, gift: false,
      image: null, frame: 'NONE', orientation: 'PORTRAIT',
      interior: 'GIRL', processing: 0, customSizeMode: false,
      images: [],
      /* Portrait options */
      faces: 1, gel: false, acrylic: false, oil: false, potal: false, digitalMockup: false
    };

    var isPortrait = cfg.type === 'portrait';

    var uploaderInstance = null;

    var tempFrameState = 'NONE';
    var getEl = function (id) { return document.getElementById(id); };

    /* --- Debounce helper --- */
    var _resizeTimer = null;
    function debounceResize(fn, delay) {
      if (_resizeTimer) clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(fn, delay);
    }

    /* --- Debounce helper for dimension input (task 3.1) --- */
    var _dimInputTimer = null;
    function debounceDimInput(fn) {
      if (_dimInputTimer) clearTimeout(_dimInputTimer);
      _dimInputTimer = setTimeout(fn, 200);
    }

    /* --- Lightweight preview update (instant response, no recalc) --- */
    function updatePreviewSize(els) {
      if (!els) els = _cachedEls;
      if (!els) return;
      if (els.canvas) {
        var factorW = 7.5 / 20;
        var factorH = 17.5 / 30;
        els.canvas.style.width = (STATE.w * factorW) + '%';
        els.canvas.style.height = (STATE.h * factorH) + '%';
      }
      if (els.lblW) els.lblW.textContent = STATE.w;
      if (els.lblH) els.lblH.textContent = STATE.h;
    }

    /* --- Frame catalog cache (task 3.3) --- */
    var _frameCatalogRendered = false;
    var _frameNodeCache = {};       /* frameId → { priceSpan, previewBox } */
    var _cachedFrameOptions = null; /* Array of .frame-option elements */
    var _cachedFramePreviews = null; /* Array of .frame-image-preview elements */

    /* --- Cached DOM refs (populated once in initMain, reused everywhere) --- */
    var _cachedEls = null;

    function isMobileViewport() {
      return window.matchMedia('(max-width: 1023px)').matches;
    }

    function getCurrentSizePresetList() {
      return SIZE_PRESETS[STATE.orientation] || SIZE_PRESETS['PORTRAIT'];
    }

    function isCurrentSizePreset(presetList) {
      return presetList.some(function (preset) {
        return preset.w === STATE.w && preset.h === STATE.h;
      });
    }

    function setCustomSizeInputsVisibility(show) {
      var sizeInputsRow = getEl('size-inputs-row');
      if (!sizeInputsRow) return;
      if (isMobileViewport() || isPortrait) {
        /* Mobile or portrait-desktop: toggle via hidden/flex */
        sizeInputsRow.classList.remove('lg:flex');
        sizeInputsRow.classList.toggle('hidden', !show);
        sizeInputsRow.classList.toggle('flex', !!show);
      } else {
        sizeInputsRow.classList.remove('flex');
        sizeInputsRow.classList.remove('hidden');
        sizeInputsRow.classList.add('lg:flex');
      }
    }

    /* ---------- Hint dialog (tooltips) ---------- */

    var hintDialog = null;

    function initHintSystem() {
      if (!cfg.tooltips) return;
      hintDialog = document.createElement('dialog');
      hintDialog.className = 'calc-hint-dialog';
      hintDialog.innerHTML =
        '<h3 class="text-base font-bold text-body mb-3" id="calc-hint-title"></h3>' +
        '<div class="text-sm text-body leading-relaxed whitespace-pre-line" id="calc-hint-text"></div>' +
        '<div class="mt-4 text-right">' +
          '<button type="button" class="text-sm font-bold text-primary hover:underline cursor-pointer" id="calc-hint-close">Понятно</button>' +
        '</div>';
      document.body.appendChild(hintDialog);

      hintDialog.querySelector('#calc-hint-close').addEventListener('click', function () {
        hintDialog.close();
      });
      hintDialog.addEventListener('click', function (e) {
        if (e.target === hintDialog) hintDialog.close();
      });
    }

    var HINT_TITLES = {
      faces: 'Количество лиц',
      gel: 'Покрытие гелем',
      acrylic: 'Прорисовка акрилом',
      oil: 'Прорисовка маслом',
      potal: 'Покрытие поталью',
      digitalMockup: 'Цифровой макет',
      varnish: 'Покрытие лаком',
      gift: 'Подарочная упаковка'
    };

    function showHint(key) {
      if (!hintDialog || !cfg.tooltips || !cfg.tooltips[key]) return;
      var tip = cfg.tooltips[key];
      var title = typeof tip === 'string' ? (HINT_TITLES[key] || '') : (tip.title || '');
      var text  = typeof tip === 'string' ? tip : (tip.text || '');
      hintDialog.querySelector('#calc-hint-title').textContent = title;
      hintDialog.querySelector('#calc-hint-text').textContent = text;
      hintDialog.showModal();
    }

    function createHintBtn(key) {
      if (!cfg.tooltips || !cfg.tooltips[key]) return null;
      var tip = cfg.tooltips[key];
      var label = typeof tip === 'string' ? (HINT_TITLES[key] || 'Подсказка') : (tip.title || 'Подсказка');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calc-hint-btn';
      btn.textContent = '?';
      btn.setAttribute('aria-label', label);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        showHint(key);
      });
      return btn;
    }

    /* ---------- Enhance static varnish/gift for non-portrait pages ---------- */

    function enhanceStaticVarnishGift() {
      if (!cfg.tooltips) return;
      ['varnish', 'gift'].forEach(function (key) {
        var priceEl = getEl('price-' + key);
        if (!priceEl) return;
        var titleDiv = priceEl.closest('.section-title');
        if (!titleDiv) return;
        var container = titleDiv.parentNode;
        var toggleId = 'toggle-' + key;
        var chk = getEl(toggleId);
        if (!chk) return;

        /* Build single-line row: [ ✓ ] Label [?]   price */
        var row = document.createElement('div');
        row.className = 'flex items-center gap-3';

        /* Reuse existing checkbox group */
        var chkGroup = chk.closest('.group');
        var chkWrap = document.createElement('div');
        chkWrap.className = 'flex h-6 shrink-0 items-center';
        chkWrap.appendChild(chkGroup);
        row.appendChild(chkWrap);

        /* Label + hint button */
        var labelWrap = document.createElement('div');
        labelWrap.className = 'flex items-center gap-1 min-w-0 flex-1';
        var lbl = document.createElement('label');
        lbl.htmlFor = toggleId;
        lbl.className = 'text-sm font-medium text-body cursor-pointer truncate';
        lbl.textContent = HINT_TITLES[key];
        labelWrap.appendChild(lbl);
        var hintBtn = createHintBtn(key);
        if (hintBtn) labelWrap.appendChild(hintBtn);
        row.appendChild(labelWrap);

        /* Move price badge */
        priceEl.className = 'text-sm font-bold text-slate-500 normal-case whitespace-nowrap shrink-0';
        row.appendChild(priceEl);

        /* Replace container content */
        container.innerHTML = '';
        container.appendChild(row);
      });
    }

    /* ---------- Portrait sections generator ---------- */

    var portraitEls = {};

    function buildPortraitSections() {
      if (!isPortrait) return;

      var panel = document.querySelector('.calc-panel .p-4');
      if (!panel) panel = document.querySelector('.calc-panel > div');
      if (!panel) return;

      /* Hide processing section — portraits don't use it */
      var processingSelect = getEl('processing-select');
      if (processingSelect) {
        var procSection = processingSelect.closest('section');
        if (procSection) procSection.style.display = 'none';
        STATE.processing = 0;
      }

      /* Desktop: hide bare size inputs, show presets + "Свой размер" like mobile */
      var sizeInputsRow = getEl('size-inputs-row');
      if (sizeInputsRow) sizeInputsRow.classList.add('hidden');
      var extraCarousel = getEl('size-extra-carousel');
      if (extraCarousel) extraCarousel.style.display = 'none';
      var presetsGrid = getEl('size-presets-grid');
      if (presetsGrid) {
        presetsGrid.classList.remove('lg:hidden');
        presetsGrid.classList.add('flex');
      }

      /* ---------- Rewrite varnish + gift into inline rows ---------- */

      var varnishGiftSection = getEl('varnish-gift-section');
      if (!varnishGiftSection) {
        var tv = getEl('toggle-varnish');
        if (tv) varnishGiftSection = tv.closest('section.space-y-6');
      }

      var varnishSection = null;
      var giftSection = null;

      if (varnishGiftSection) {
        varnishSection = makeInlineCheckboxSection(
          'varnish', 'Покрытие лаком', 'varnish', 'price-varnish', STATE.varnish
        );
        giftSection = makeInlineCheckboxSection(
          'gift', 'Подарочная упаковка', 'gift', 'price-gift', STATE.gift
        );
        varnishGiftSection.remove();
      }

      /* Locate static sections */
      var sizeSection = getEl('size-section');
      var wrapSection = null;
      var frameSection = null;
      var allSections = panel.querySelectorAll(':scope > section');
      allSections.forEach(function (sec) {
        if (sec.querySelector('.wrap-btn')) wrapSection = sec;
        if (sec.querySelector('#frame-section')) frameSection = sec;
      });

      /* Helper: create compact inline checkbox row
       * [ ✓ ] Label [?]                      price badge
       * Options: { accentBadge: 'text' } — adds a small accent badge after label
       */
      function makeInlineCheckboxSection(id, label, hintKey, badgeId, checked, opts) {
        var sec = document.createElement('section');
        sec.id = id + '-section';
        sec.setAttribute('data-portrait-option', id);

        var row = document.createElement('div');
        row.className = 'flex items-center gap-3';

        /* Checkbox */
        var chkWrap = document.createElement('div');
        chkWrap.className = 'flex h-6 shrink-0 items-center';
        var grp = document.createElement('div');
        grp.className = 'group grid size-4 grid-cols-1';
        var chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.id = 'toggle-' + id;
        chk.name = id;
        chk.checked = !!checked;
        chk.className = 'calc-checkbox col-start-1 row-start-1 forced-colors:appearance-auto';
        grp.appendChild(chk);
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 14 14');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('class', 'pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M3 8L6 11L11 3.5');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('class', 'opacity-0 group-has-checked:opacity-100');
        svg.appendChild(path);
        grp.appendChild(svg);
        chkWrap.appendChild(grp);
        row.appendChild(chkWrap);

        /* Label + hint btn + optional accent badge */
        var labelWrap = document.createElement('div');
        labelWrap.className = 'flex items-center gap-1 min-w-0 flex-1';
        var lbl = document.createElement('label');
        lbl.htmlFor = 'toggle-' + id;
        lbl.className = 'text-sm font-medium text-body cursor-pointer truncate';
        lbl.textContent = label;
        labelWrap.appendChild(lbl);
        if (opts && opts.accentBadge) {
          var accent = document.createElement('span');
          accent.className = 'calc-accent ml-1 shrink-0';
          accent.textContent = opts.accentBadge;
          labelWrap.appendChild(accent);
        }
        var hintBtn = createHintBtn(hintKey);
        if (hintBtn) labelWrap.appendChild(hintBtn);
        row.appendChild(labelWrap);

        /* Price badge */
        var badge = document.createElement('span');
        badge.className = 'text-sm font-bold text-slate-500 normal-case whitespace-nowrap shrink-0';
        badge.id = badgeId;
        badge.textContent = '0 р.';
        row.appendChild(badge);

        sec.appendChild(row);
        return { section: sec, checkbox: chk, badge: badge };
      }

      /* 1. Size section stays in place */

      /* 2. Количество лиц — select dropdown */
      var facesSec = document.createElement('section');
      facesSec.id = 'portrait-faces-section';
      facesSec.setAttribute('data-portrait-option', 'faces');

      var facesTitleDiv = document.createElement('div');
      facesTitleDiv.className = 'section-title';
      var facesTitleLeft = document.createElement('span');
      facesTitleLeft.className = 'flex items-center gap-1';
      facesTitleLeft.textContent = 'Количество лиц';
      var facesHint = createHintBtn('faces');
      if (facesHint) facesTitleLeft.appendChild(facesHint);
      facesTitleDiv.appendChild(facesTitleLeft);
      var facesBadge = document.createElement('span');
      facesBadge.className = 'text-sm font-bold text-slate-500 normal-case';
      facesBadge.id = 'badge-faces';
      facesBadge.textContent = 'включено';
      facesTitleDiv.appendChild(facesBadge);
      facesSec.appendChild(facesTitleDiv);

      var facesGridWrap = document.createElement('div');
      facesGridWrap.className = 'grid grid-cols-1';
      var facesSelect = document.createElement('select');
      facesSelect.id = 'portrait-faces';
      facesSelect.setAttribute('aria-label', 'Количество лиц');
      facesSelect.className = 'col-start-1 row-start-1 w-full appearance-none bg-white border border-slate-200 text-body py-3 pl-4 pr-8 rounded-lg text-sm font-medium focus-visible:border-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary';
      for (var i = 1; i <= 10; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        facesSelect.appendChild(opt);
      }
      facesGridWrap.appendChild(facesSelect);
      var chevronSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevronSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      chevronSvg.setAttribute('width', '24');
      chevronSvg.setAttribute('height', '24');
      chevronSvg.setAttribute('viewBox', '0 0 24 24');
      chevronSvg.setAttribute('fill', 'none');
      chevronSvg.setAttribute('stroke', 'currentColor');
      chevronSvg.setAttribute('stroke-width', '2');
      chevronSvg.setAttribute('stroke-linecap', 'round');
      chevronSvg.setAttribute('stroke-linejoin', 'round');
      chevronSvg.setAttribute('class', 'pointer-events-none col-start-1 row-start-1 mr-2 w-5 h-5 self-center justify-self-end text-slate-500');
      var chevPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      chevPath.setAttribute('d', 'm6 9 6 6 6-6');
      chevronSvg.appendChild(chevPath);
      facesGridWrap.appendChild(chevronSvg);
      facesSec.appendChild(facesGridWrap);

      /* Create portrait-specific inline checkbox sections */
      var gelData = makeInlineCheckboxSection('gel', 'Покрытие гелем', 'gel', 'price-gel', false);
      var acrylicData = makeInlineCheckboxSection('acrylic', 'Прорисовка акрилом', 'acrylic', 'price-acrylic', false);
      var oilData = makeInlineCheckboxSection('oil', 'Прорисовка маслом', 'oil', 'price-oil', false, { accentBadge: 'Популярное' });
      var potalData = makeInlineCheckboxSection('potal', 'Покрытие поталью', 'potal', 'price-potal', false);
      var mockupData = makeInlineCheckboxSection('digitalMockup', 'Цифровой макет', 'digitalMockup', 'price-digital-mockup', false);

      /* Group: "Покрытие и обработка" — лак, гель, акрил, масло, поталь */
      var coverageGroup = document.createElement('section');
      coverageGroup.id = 'coverage-group-section';
      var coverageTitle = document.createElement('div');
      coverageTitle.className = 'section-title';
      coverageTitle.textContent = 'Покрытие и обработка';
      coverageGroup.appendChild(coverageTitle);
      var coverageList = document.createElement('div');
      coverageList.className = 'space-y-2';
      if (varnishSection) coverageList.appendChild(varnishSection.section);
      coverageList.appendChild(gelData.section);
      coverageList.appendChild(acrylicData.section);
      coverageList.appendChild(oilData.section);
      coverageList.appendChild(potalData.section);
      coverageGroup.appendChild(coverageList);

      /* Divider + mockup wrapper (visual separation from physical options) */
      var mockupWrapper = document.createElement('div');
      var mockupDivider = document.createElement('div');
      mockupDivider.className = 'h-px bg-slate-200 mb-4';
      mockupWrapper.appendChild(mockupDivider);
      var mockupNote = document.createElement('p');
      mockupNote.className = 'text-xs font-bold uppercase tracking-widest text-slate-500 mb-3';
      mockupNote.textContent = 'Без изготовления картины';
      mockupWrapper.appendChild(mockupNote);
      mockupWrapper.appendChild(mockupData.section);

      /*
       * Target order:
       *  1) Размер               — sizeSection
       *  2) Подрамник и печать    — wrapSection
       *  3) Количество лиц       — facesSec
       *  4) Покрытие и обработка  — coverageGroup (лак, гель, акрил, масло, поталь)
       *  5) Багетная рама         — frameSection
       *  6) Подарочная упак.      — giftSection (rebuilt inline)
       *  7) Цифровой макет        — mockupWrapper (with divider)
       */

      function detach(el) { if (el && el.parentNode) el.parentNode.removeChild(el); return el; }
      detach(sizeSection);
      detach(wrapSection);
      detach(frameSection);

      var sectionsToOrder = [
        sizeSection,
        wrapSection,
        facesSec,
        coverageGroup,
        frameSection,
        giftSection ? giftSection.section : null,
        mockupWrapper
      ];

      var firstChild = panel.firstElementChild;
      sectionsToOrder.forEach(function (sec) {
        if (sec) panel.insertBefore(sec, firstChild);
      });

      /* Bind varnish/gift checkboxes */
      if (varnishSection) {
        varnishSection.checkbox.addEventListener('change', function () {
          STATE.varnish = varnishSection.checkbox.checked;
          enforceCompatibility('varnish');
          updateUI(null);
        });
      }
      if (giftSection) {
        giftSection.checkbox.addEventListener('change', function () {
          STATE.gift = giftSection.checkbox.checked;
          updateUI(null);
        });
      }

      /* Store references */
      portraitEls = {
        facesSelect: facesSelect,
        badgeFaces: facesBadge,
        gelCheckbox: gelData.checkbox,
        gelSection: gelData.section,
        badgeGel: gelData.badge,
        acrylicCheckbox: acrylicData.checkbox,
        acrylicSection: acrylicData.section,
        badgeAcrylic: acrylicData.badge,
        oilCheckbox: oilData.checkbox,
        oilSection: oilData.section,
        badgeOil: oilData.badge,
        potalCheckbox: potalData.checkbox,
        potalSection: potalData.section,
        badgePotal: potalData.badge,
        mockupCheckbox: mockupData.checkbox,
        mockupSection: mockupData.section,
        badgeMockup: mockupData.badge,
        varnishSection: varnishSection ? varnishSection.section : null,
        giftSection: giftSection ? giftSection.section : null,
        mockupWrapper: mockupWrapper,
        coverageGroup: coverageGroup
      };

      /* Event listeners */
      facesSelect.addEventListener('change', function () {
        STATE.faces = parseInt(facesSelect.value) || 1;
        updateUI(null);
      });

      var portraitCheckboxHandler = function (stateKey, el) {
        el.addEventListener('change', function () {
          STATE[stateKey] = el.checked;
          enforceCompatibility(stateKey);
          updateUI(null);
        });
      };

      portraitCheckboxHandler('gel', gelData.checkbox);
      portraitCheckboxHandler('acrylic', acrylicData.checkbox);
      portraitCheckboxHandler('oil', oilData.checkbox);
      portraitCheckboxHandler('potal', potalData.checkbox);

      mockupData.checkbox.addEventListener('change', function () {
        STATE.digitalMockup = mockupData.checkbox.checked;
        toggleDigitalMockupMode();
        updateUI(null);
      });
    }

    /* ---------- Compatibility engine ---------- */

    /*
     * Compatibility matrix (true = can coexist):
     *                 varnish   gel   acrylic   oil   potal
     * varnish           —       ✗       ✓       ✗      ✓
     * gel               ✗       —       ✓       ✗      ✓
     * acrylic           ✓       ✓       —       ✗      ✓
     * oil               ✗       ✗       ✗       —      ✓
     * potal             ✓       ✓       ✓       ✓      —
     *
     * When option X is turned ON, incompatible options are force-unchecked.
     */
    function enforceCompatibility(changed) {
      if (!isPortrait) return;

      var incompatible = {
        varnish:  ['gel', 'oil'],
        gel:      ['varnish', 'oil'],
        acrylic:  ['oil'],
        oil:      ['varnish', 'gel', 'acrylic'],
        potal:    []
      };

      var toDisable = incompatible[changed] || [];
      toDisable.forEach(function (key) {
        STATE[key] = false;
        var chk = getEl('toggle-' + key);
        if (chk) chk.checked = false;
      });
    }

    /* Digital mockup: disable physical production options */
    function toggleDigitalMockupMode() {
      if (!isPortrait) return;

      /* Sections to disable: wrap, varnish, gel, acrylic, oil, potal, frame, gift */
      var disableIds = [
        'varnish-section', 'gift-section',
        'gel-section', 'acrylic-section', 'oil-section', 'potal-section',
        'coverage-group-section'
      ];

      var allSections = document.querySelectorAll('.calc-panel section');
      allSections.forEach(function (sec) {
        if (sec.id === 'portrait-faces-section') return;
        if (sec.id === 'size-section') return;
        if (sec.getAttribute('data-portrait-option') === 'digitalMockup') return;

        /* Skip sections not in the disableable list — let wrap and frame also disable */
        var isWrap = !!sec.querySelector('.wrap-btn');
        var isFrame = !!sec.querySelector('#frame-section');
        var inList = disableIds.indexOf(sec.id) !== -1;

        if (isWrap || isFrame || inList) {
          if (STATE.digitalMockup) {
            sec.classList.add('calc-section-disabled');
          } else {
            sec.classList.remove('calc-section-disabled');
          }
        }
      });

      /* Reset physical state when enabling digital mockup */
      if (STATE.digitalMockup) {
        STATE.gel = false;
        STATE.acrylic = false;
        STATE.oil = false;
        STATE.potal = false;
        STATE.varnish = false;
        STATE.gift = false;
        STATE.frame = 'NONE';
        STATE.wrap = 'STANDARD';
        if (portraitEls.gelCheckbox) portraitEls.gelCheckbox.checked = false;
        if (portraitEls.acrylicCheckbox) portraitEls.acrylicCheckbox.checked = false;
        if (portraitEls.oilCheckbox) portraitEls.oilCheckbox.checked = false;
        if (portraitEls.potalCheckbox) portraitEls.potalCheckbox.checked = false;
        var toggleVarnish = getEl('toggle-varnish');
        if (toggleVarnish) toggleVarnish.checked = false;
        var toggleGift = getEl('toggle-gift');
        if (toggleGift) toggleGift.checked = false;
      }
    }

    /* ---------- Order form ---------- */

    function initOrderForm() {
      var handleOrder = function (e) {
        e.preventDefault();
        var nameInp = getEl('client-name');
        var phoneInp = getEl('client-phone');
        var isValid = true;

        if (!nameInp.value.trim()) { nameInp.classList.add('error'); isValid = false; }
        else { nameInp.classList.remove('error'); }

        if (!phoneInp.value.trim() || phoneInp.value.length < 16) { phoneInp.classList.add('error'); isValid = false; }
        else { phoneInp.classList.remove('error'); }

        if (!isValid) {
          document.getElementById('order-form-container').scrollIntoView({ behavior: 'smooth' });
          return;
        }

        var orderData = {
          client: {
            name: nameInp.value,
            phone: phoneInp.value,
            email: getEl('client-email').value,
            link: getEl('client-link').value,
            comment: getEl('client-comment').value
          },
          product: {
            width: STATE.w, height: STATE.h, wrap: STATE.wrap,
            frame: STATE.frame, varnish: STATE.varnish, gift: STATE.gift,
            interior: STATE.interior, processing: STATE.processing,
            faces: isPortrait ? STATE.faces : undefined,
            gel: isPortrait ? STATE.gel : undefined,
            acrylic: isPortrait ? STATE.acrylic : undefined,
            oil: isPortrait ? STATE.oil : undefined,
            potal: isPortrait ? STATE.potal : undefined,
            digitalMockup: isPortrait ? STATE.digitalMockup : undefined
          },
          totalPrice: getEl('total-price').textContent
        };

        console.log('Заказ отправлен:', orderData);
        alert('Спасибо! Ваш заказ оформлен. Мы свяжемся с вами в ближайшее время.');
      };

      var btnSubmit = getEl('btn-submit-order');
      if (btnSubmit) btnSubmit.addEventListener('click', handleOrder);

      var btnSticky = getEl('btn-sticky-order');
      if (btnSticky) {
        btnSticky.addEventListener('click', function () {
          document.getElementById('order-form-container').scrollIntoView({ behavior: 'smooth' });
        });
      }
    }

    /* ---------- Frame catalog ---------- */

    function getFramePrice(frame) {
      var perimeter = (STATE.w + STATE.h) * 2 / 100;
      var multiplier = (frame.cat === 'CLASSIC') ? 1.5 : 1;
      return frame.id === 'NONE' ? 0 : Math.ceil(perimeter * PRICES.framePerM * multiplier);
    }

    function renderFrameCatalog() {
      var studioContainer = getEl('frames-grid-studio');
      var classicContainer = getEl('frames-grid-classic');
      if (!studioContainer || !classicContainer) return;

      /* Task 3.3: after first render, only update prices + aspect ratio */
      if (_frameCatalogRendered) {
        updateFramePricesOnly();
        updateModalPreviews();
        return;
      }

      studioContainer.innerHTML = '';
      classicContainer.innerHTML = '';

      var aspectRatioStyle = (STATE.w && STATE.h) ? 'aspect-ratio: ' + STATE.w + '/' + STATE.h : 'aspect-ratio: 1/1';

      FRAMES_DB.forEach(function (frame) {
        var el = document.createElement('div');
        el.className = 'frame-option group relative cursor-pointer flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:bg-secondary transition';
        el.dataset.id = frame.id;

        var borderStyle = (frame.width > 0 ? '8px' : '0') + ' solid ' + frame.color;
        var styleCSS = '';
        if (frame.id === 'NONE') {
          styleCSS = 'background-color: #f1f5f9; border: 1px dashed #cbd5e1;';
          borderStyle = 'none';
        }

        var noFrameIcon = frame.id === 'NONE'
          ? '<div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">' +
              '<div class="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-[2px]">' +
                '<svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>' +
              '</div>' +
            '</div>'
          : '';

        var priceText = frame.id === 'NONE' ? 'Без багета' : getFramePrice(frame).toLocaleString() + ' р.';

        el.innerHTML =
          '<div class="relative w-full rounded-lg shadow-sm overflow-hidden bg-white frame-preview-box" style="' + aspectRatioStyle + '">' +
            '<div class="w-full h-full box-border relative z-10" style="border: ' + borderStyle + '; ' + styleCSS + ' transition: border 0.2s;">' +
              '<div class="w-full h-full bg-cover bg-center frame-image-preview" style="background-color: #f1f5f9;"></div>' +
            '</div>' +
            noFrameIcon +
          '</div>' +
          '<span class="text-xs font-bold text-body text-center leading-tight group-hover:text-primary transition">' + priceText + '</span>';

        /* Task 3.3: cache references for incremental updates */
        _frameNodeCache[frame.id] = {
          priceSpan: el.querySelector('span'),
          previewBox: el.querySelector('.frame-preview-box')
        };

        el.addEventListener('click', function (e) {
          if (tempFrameState === frame.id && STATE.image) {
            openLightbox(frame.id);
          } else {
            handleFrameClickInModal(frame.id);
          }
        });

        if (frame.cat === 'STUDIO' || frame.id === 'NONE') {
          studioContainer.appendChild(el);
        } else {
          classicContainer.appendChild(el);
        }
      });

      /* Task 3.2: cache frame element lists after first render */
      _cachedFrameOptions = Array.prototype.slice.call(studioContainer.querySelectorAll('.frame-option'))
        .concat(Array.prototype.slice.call(classicContainer.querySelectorAll('.frame-option')));
      _cachedFramePreviews = Array.prototype.slice.call(studioContainer.querySelectorAll('.frame-image-preview'))
        .concat(Array.prototype.slice.call(classicContainer.querySelectorAll('.frame-image-preview')));

      _frameCatalogRendered = true;
      updateModalPreviews();
    }

    /** Task 3.3: update only price text + aspect ratio in existing frame elements */
    function updateFramePricesOnly() {
      var aspectRatio = (STATE.w && STATE.h) ? STATE.w + '/' + STATE.h : '1/1';
      FRAMES_DB.forEach(function (frame) {
        var cached = _frameNodeCache[frame.id];
        if (!cached) return;
        var priceText = frame.id === 'NONE' ? 'Без багета' : getFramePrice(frame).toLocaleString() + ' р.';
        if (cached.priceSpan) cached.priceSpan.textContent = priceText;
        if (cached.previewBox) cached.previewBox.style.aspectRatio = aspectRatio;
      });
    }

    /* ---------- Main init ---------- */

    function initMain() {
      var els = {
        inpW: getEl('inp-w'),
        inpH: getEl('inp-h'),
        lblW: getEl('lbl-w'),
        lblH: getEl('lbl-h'),
        canvas: getEl('preview-canvas'),
        priceTotal: getEl('total-price'),
        priceVarnish: getEl('price-varnish'),
        priceGift: getEl('price-gift'),
        priceFrame: getEl('price-frame'),
        selectedFrameText: getEl('selected-frame-text'),
        stickyTotal: getEl('sticky-total-price'),
        wrapBtns: document.querySelectorAll('.wrap-btn'),
        frameSection: getEl('frame-section'),
        frameModal: getEl('frame-modal'),
        closeFrameModal: getEl('close-frame-modal'),
        cancelFrame: getEl('cancel-frame-selection'),
        applyFrame: getEl('apply-frame-selection'),
        modalUploadBtn: getEl('modal-upload-btn'),
        processingSelect: getEl('processing-select'),
        toggleVarnish: getEl('toggle-varnish'),
        toggleGift: getEl('toggle-gift'),
        badgeWrap: getEl('badge-wrap'),
        badgeProcessing: getEl('badge-processing'),
        roomBg: document.querySelector('.room-bg')  /* task 3.2 */
      };

      /* Populate cache so updateUI(null) reuses these refs */
      _cachedEls = els;

      if (els.toggleVarnish) els.toggleVarnish.checked = STATE.varnish;
      if (els.toggleGift) els.toggleGift.checked = STATE.gift;

      var onDimChange = function () {
        STATE.w = Math.max(20, Math.min(200, parseInt(els.inpW.value) || 0));
        STATE.h = Math.max(20, Math.min(200, parseInt(els.inpH.value) || 0));
        if (isMobileViewport()) STATE.customSizeMode = true;
        /* Task 3.1: instant lightweight preview (canvas size + labels) */
        updatePreviewSize(els);
        /* Task 3.1: debounced heavy operations (frame catalog + full recalc) */
        debounceDimInput(function () {
          renderFrameCatalog();
          updateUI(els);
        });
      };

      if (els.inpW) els.inpW.addEventListener('input', onDimChange);
      if (els.inpH) els.inpH.addEventListener('input', onDimChange);

      if (els.inpW) {
        els.inpW.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (els.inpH) els.inpH.focus();
          }
        });
      }

      if (els.inpH) {
        els.inpH.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            els.inpH.blur();
          }
        });
      }

      window.addEventListener('resize', function () {
        debounceResize(function () {
          renderSizePresets();
          if (!isMobileViewport() && !isPortrait) {
            setCustomSizeInputsVisibility(true);
          }
        }, 150);
      });

      var extraTrack = getEl('size-extra-presets-track');

      if (extraTrack) {
        extraTrack.addEventListener('wheel', function (e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            extraTrack.scrollBy({ left: e.deltaY, behavior: 'smooth' });
          }
        }, { passive: false });
      }

      els.wrapBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          STATE.wrap = btn.dataset.val;
          updateUI(els);
        });
      });

      if (els.toggleVarnish) {
        els.toggleVarnish.addEventListener('change', function (e) {
          STATE.varnish = e.target.checked;
          updateUI(els);
        });
      }

      if (els.toggleGift) {
        els.toggleGift.addEventListener('change', function (e) {
          STATE.gift = e.target.checked;
          updateUI(els);
        });
      }

      if (els.processingSelect) {
        /* Populate options from PRICES config */
        if (PRICES.processingOptions && PRICES.processingOptions.length) {
          els.processingSelect.innerHTML = '';
          for (var pi = 0; pi < PRICES.processingOptions.length; pi++) {
            var po = PRICES.processingOptions[pi];
            var opt = document.createElement('option');
            opt.value = po.value;
            opt.textContent = po.value > 0
              ? po.label + ' (+' + po.value.toLocaleString() + ' р.)'
              : po.label;
            els.processingSelect.appendChild(opt);
          }
        }
        els.processingSelect.addEventListener('change', function (e) {
          STATE.processing = parseInt(e.target.value);
          updateUI(els);
        });
      }

      /* --- MuseUploader integration --- */
      if (typeof MuseUploader === 'function') {
        uploaderInstance = MuseUploader({
          maxFiles: cfg.maxFiles || 20,
          dropZoneSelector: '#uploader-zone',
          thumbnailsSelector: '#uploader-thumbnails',
          fileInputSelector: '#file-upload',
          alertSelector: '#uploader-alert',
          uploadBtnSelector: '#btn-upload-empty',
          statusSelector: '#uploader-status',
          enableDragDrop: true,
          onImagesChange: function (imgs) {
            STATE.images = imgs;
          },
          onActiveImageChange: function (img) {
            if (img) {
              STATE.image = img.dataUrl;
              var ratio = img.width / img.height;
              var newOrientation = 'SQUARE';
              if (ratio > 1.05) newOrientation = 'LANDSCAPE';
              else if (ratio < 0.95) newOrientation = 'PORTRAIT';

              // Swap dimensions if orientation changed
              if (newOrientation !== STATE.orientation) {
                var currentIsLandscape = STATE.w > STATE.h;
                var currentIsPortrait = STATE.h > STATE.w;
                if (newOrientation === 'LANDSCAPE' && currentIsPortrait) {
                  var tmp = STATE.w; STATE.w = STATE.h; STATE.h = tmp;
                } else if (newOrientation === 'PORTRAIT' && currentIsLandscape) {
                  var tmp2 = STATE.w; STATE.w = STATE.h; STATE.h = tmp2;
                } else if (newOrientation === 'SQUARE' && STATE.w !== STATE.h) {
                  var val = Math.max(STATE.w, STATE.h); STATE.w = val; STATE.h = val;
                }
                STATE.orientation = newOrientation;
                getEl('inp-w').value = STATE.w;
                getEl('inp-h').value = STATE.h;
                renderSizePresets();
                renderFrameCatalog();
              }
            } else {
              STATE.image = null;
            }
            updateUI(els);
          }
        });
      }

      if (els.canvas) {
        els.canvas.addEventListener('click', function () {
          if (STATE.image) openLightbox(STATE.frame);
          else if (uploaderInstance) uploaderInstance.openFilePicker();
        });
      }

      if (els.frameSection && els.frameModal) {
        els.frameSection.addEventListener('click', function () {
          els.frameModal.showModal();
          tempFrameState = STATE.frame;
          highlightSelectedFrameInModal(tempFrameState);
          updateModalPreviews();
        });

        var closeModal = function () {
          els.frameModal.close();
          tempFrameState = STATE.frame;
        };

        if (els.closeFrameModal) {
          els.closeFrameModal.addEventListener('click', function (e) {
            e.stopPropagation();
            closeModal();
          });
        }
        if (els.cancelFrame) els.cancelFrame.addEventListener('click', closeModal);

        /* Закрытие по клику на backdrop (за пределами контента) */
        els.frameModal.addEventListener('click', function (e) {
          if (e.target === els.frameModal) closeModal();
        });

        /* Нативное закрытие по Escape — сброс выбора рамки */
        els.frameModal.addEventListener('cancel', function () {
          tempFrameState = STATE.frame;
        });

        if (els.modalUploadBtn) {
          els.modalUploadBtn.addEventListener('click', function () {
            if (uploaderInstance) uploaderInstance.openFilePicker();
          });
        }

        if (els.applyFrame) {
          els.applyFrame.addEventListener('click', function () {
            STATE.frame = tempFrameState;
            updateUI(els);
            closeModal();
          });
        }
      }

      updateUI(els);
    }

    /* ---------- Size presets ---------- */

    function renderSizePresets() {
      var container = getEl('size-presets-grid');
      if (!container) return;
      container.innerHTML = '';
      var currentPresets = getCurrentSizePresetList();
      var hasPresetMatch = isCurrentSizePreset(currentPresets);

      currentPresets.forEach(function (preset) {
        var btn = document.createElement('button');
        var isActive = !STATE.customSizeMode && preset.w === STATE.w && preset.h === STATE.h;
        btn.className = 'size-btn' + (isActive ? ' is-active' : '');
        btn.textContent = preset.w + '×' + preset.h;
        btn.onclick = function () {
          STATE.w = preset.w;
          STATE.h = preset.h;
          STATE.customSizeMode = false;
          getEl('inp-w').value = STATE.w;
          getEl('inp-h').value = STATE.h;
          setCustomSizeInputsVisibility(false);
          renderFrameCatalog();
          updateUI(null);
          renderSizePresets();
        };
        container.appendChild(btn);
      });

      if (isMobileViewport() || isPortrait) {
        /* Mobile viewport OR portrait page (any viewport):  
           show preset buttons + 'Свой размер', hide inputs until tapped */
        var customBtn = document.createElement('button');
        customBtn.type = 'button';
        var customActive = STATE.customSizeMode || !hasPresetMatch;
        customBtn.className = 'size-btn' + (customActive ? ' is-active' : '');
        customBtn.textContent = 'Свой размер';
        customBtn.onclick = function () {
          STATE.customSizeMode = true;
          setCustomSizeInputsVisibility(true);
          renderSizePresets();
          // Скроллим так, чтобы поля ввода оказались видны под sticky-превью
          setTimeout(function () {
            var row = document.getElementById('size-inputs-row');
            if (!row || !isMobileViewport()) return;
            var preview = document.getElementById('calc-preview-column');
            var previewH = preview ? preview.offsetHeight : 0;
            var rowTop = row.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: Math.max(0, rowTop - previewH - 8), behavior: 'smooth' });
          }, 80);
        };
        container.appendChild(customBtn);
        setCustomSizeInputsVisibility(STATE.customSizeMode || !hasPresetMatch);
      } else {
        STATE.customSizeMode = false;
        setCustomSizeInputsVisibility(true);
        renderDesktopSizeScroller();
      }
    }

    function renderDesktopSizeScroller() {
      var track = getEl('size-extra-presets-track');
      if (!track) return;
      track.innerHTML = '';

      var currentPresets = SIZE_PRESETS[STATE.orientation] || SIZE_PRESETS['PORTRAIT'];

      currentPresets.forEach(function (preset) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var isActive = preset.w === STATE.w && preset.h === STATE.h;
        btn.className = 'size-btn' + (isActive ? ' is-active' : '');
        btn.textContent = preset.w + '×' + preset.h;
        btn.onclick = function () {
          STATE.w = preset.w;
          STATE.h = preset.h;
          getEl('inp-w').value = STATE.w;
          getEl('inp-h').value = STATE.h;
          renderFrameCatalog();
          updateUI(null);
          renderSizePresets();
        };
        track.appendChild(btn);
      });
    }

    /* ---------- Lightbox ---------- */

    function initLightbox() {
      var lightbox = getEl('lightbox');
      var closeBtn = getEl('lightbox-close');
      var closeAction = function () {
        if (lightbox && lightbox.open) lightbox.close();
      };
      if (closeBtn) {
        closeBtn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeAction();
        };
      }
      if (lightbox) {
        lightbox.onclick = function (e) {
          if (e.target === lightbox) closeAction();
        };
      }
    }

    function openLightbox(frameIdToPreview) {
      var lightbox = getEl('lightbox');
      var content = getEl('lightbox-content');
      if (!lightbox || !content || !STATE.image) return;
      content.innerHTML = '';

      var vpW = window.innerWidth * 0.94;
      var vpH = window.innerHeight * 0.94;
      var ratio = STATE.w / STATE.h;

      var f = FRAMES_DB.find(function (x) { return x.id === frameIdToPreview; }) || FRAMES_DB[0];

      /* First pass: fit image to viewport, then scale frame proportionally */
      var imgW, imgH;
      if (vpW / ratio <= vpH) { imgW = vpW; imgH = vpW / ratio; }
      else { imgH = vpH; imgW = vpH * ratio; }

      /* Scale frame border proportionally to image size */
      var borderPx = 0;
      if (frameIdToPreview !== 'NONE') {
        var sf = Math.max(1, imgW / (STATE.w * 4));
        borderPx = f.width * sf;
      }

      /* Shrink image so image + frame fits in viewport */
      var totalW = imgW + borderPx * 2;
      var totalH = imgH + borderPx * 2;
      if (totalW > vpW || totalH > vpH) {
        var scale = Math.min(vpW / totalW, vpH / totalH);
        imgW = imgW * scale;
        imgH = imgH * scale;
        borderPx = borderPx * scale;
      }

      /* Frame cost for label */
      var frameCost = 0;
      if (frameIdToPreview !== 'NONE') {
        frameCost = getFramePrice(f);
      }

      /* Wrapper: relative positioning for price overlay on desktop */
      var wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.position = 'relative';
      if (window.innerWidth < 1024) {
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '1rem';
      }

      var div = document.createElement('div');
      div.style.boxSizing = 'content-box';
      div.style.width = Math.round(imgW) + 'px';
      div.style.height = Math.round(imgH) + 'px';
      div.style.backgroundClip = 'padding-box';
      div.style.backgroundOrigin = 'padding-box';
      div.style.backgroundImage = 'url(' + STATE.image + ')';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'center';
      div.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
      div.style.flexShrink = '0';

      if (frameIdToPreview !== 'NONE') {
        div.style.border = Math.round(borderPx) + 'px solid ' + f.color;
        if (f.border) div.style.outline = Math.max(1, Math.round(borderPx / f.width)) + 'px solid ' + f.border;
        if (f.style === 'ornate_gold') {
          div.style.borderImage = 'linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7) 1';
          div.style.borderColor = '#d4af37';
        }
      } else if (STATE.wrap === 'NO_FRAME') {
        div.style.boxShadow = 'none';
      }

      wrapper.appendChild(div);

      /* Price label */
      if (frameIdToPreview !== 'NONE') {
        var priceLabel = document.createElement('div');
        priceLabel.className = 'text-2xl font-bold text-primary';
        priceLabel.style.whiteSpace = 'nowrap';
        priceLabel.textContent = '\u0411\u0430\u0433\u0435\u0442\u043d\u0430\u044f \u0440\u0430\u043c\u0430: ' + frameCost.toLocaleString() + ' \u0440.';

        if (window.innerWidth >= 1024) {
          /* Desktop: position absolutely to top-left of image */
          priceLabel.style.position = 'absolute';
          priceLabel.style.left = '0';
          priceLabel.style.top = '0';
          priceLabel.style.transform = 'translateX(calc(-100% - 1.5rem))';
        } else {
          /* Mobile: below image */
          priceLabel.style.textAlign = 'center';
          wrapper.appendChild(priceLabel);
        }

        if (window.innerWidth >= 1024) wrapper.appendChild(priceLabel);
      }

      content.appendChild(wrapper);
      if (!lightbox.open) lightbox.showModal();
      requestAnimationFrame(function () {
        content.classList.add('lightbox-enter-active');
      });
    }

    /* ---------- Frame selection in modal ---------- */

    function handleFrameClickInModal(frameId) {
      tempFrameState = frameId;
      highlightSelectedFrameInModal(frameId);
      if (!STATE.image && uploaderInstance) { uploaderInstance.openFilePicker(); }
    }

    function highlightSelectedFrameInModal(id) {
      var allOptions = _cachedFrameOptions || document.querySelectorAll('.frame-option');
      allOptions.forEach(function (opt) {
        if (opt.dataset.id === id) {
          opt.classList.add('border-primary', 'bg-primary-light');
          opt.classList.remove('border-transparent');
        } else {
          opt.classList.remove('border-primary', 'bg-primary-light');
          opt.classList.add('border-transparent');
        }
      });
    }

    function updateModalPreviews() {
      var previews = _cachedFramePreviews || document.querySelectorAll('.frame-image-preview');
      var cta = getEl('frame-upload-cta');
      if (STATE.image) {
        if (cta) cta.style.display = 'none';
        previews.forEach(function (div) {
          div.style.backgroundImage = 'url(' + STATE.image + ')';
          div.style.backgroundColor = 'transparent';
        });
      } else {
        if (cta) cta.style.display = 'block';
        previews.forEach(function (div) {
          div.style.backgroundImage = 'none';
          div.style.backgroundColor = '#f1f5f9';
        });
      }
    }

    /* ---------- Price calculation ---------- */

    function calculate() {

      /* ── Universal formula (cm², cm) — same for canvas & portrait ── */
      var sq = STATE.w * STATE.h;
      var perim = (STATE.w + STATE.h) * 2;

      /* Face cost (portrait only; for canvas faces=1, faceCost=0) */
      var faceCost = 0;
      if (isPortrait) {
        if (STATE.digitalMockup) {
          faceCost = PRICES.digitalFaceFirst
            + Math.max(0, STATE.faces - 1) * PRICES.digitalFaceExtra;
        } else {
          faceCost = PRICES.faceFirst
            + Math.max(0, STATE.faces - 1) * PRICES.faceExtra;
        }
      }

      /* Digital mockup: only faces + processing, no physical output */
      if (isPortrait && STATE.digitalMockup) {
        var mockupTotal = Math.ceil(faceCost + STATE.processing);
        return {
          total: mockupTotal, wrapCost: 0,
          processingCost: STATE.processing, varnishCost: 0, giftCost: 0,
          frameCost: 0, faceCost: Math.ceil(faceCost),
          gelCost: 0, acrylicCost: 0, oilCost: 0, potalCost: 0,
          digitalMockupCost: Math.ceil(faceCost), giftLabel: null
        };
      }

      /* Print + stretcher: 0.29·S + 0.04·P·strPrice + 0.76·P + const */
      var strPrice = PRICES.stretcherStandard;
      if (STATE.wrap === 'GALLERY') strPrice = PRICES.stretcherGallery;
      else if (STATE.wrap === 'NO_FRAME') strPrice = PRICES.stretcherRoll;

      var printCost = PRICES.printSqCoeff * sq
        + PRICES.printPStrCoeff * perim * strPrice
        + PRICES.printPBaseCoeff * perim
        + PRICES.printConst;

      /* Coatings — always compute potential cost; include in total only when active */
      var varnishRaw  = sq * PRICES.varnishCoeff;
      var gelRaw      = sq * PRICES.gelCoeff;
      var acrylicRaw  = sq * PRICES.acrylicCoeff;
      var oilRaw      = sq * PRICES.oilCoeff
        + Math.max(0, (STATE.faces || 1) - 1) * PRICES.oilFaceExtra;
      var potalRaw    = sq * PRICES.potalCoeff;

      var varnishCost = STATE.varnish ? varnishRaw : 0;
      var gelCost     = STATE.gel     ? gelRaw     : 0;
      var acrylicCost = STATE.acrylic ? acrylicRaw : 0;
      var oilCost     = STATE.oil     ? oilRaw     : 0;
      var potalCost   = STATE.potal   ? potalRaw   : 0;

      /* Gift wrap — always compute potential; include only when active */
      var giftRaw = 0;
      var giftLabelRaw = null;
      if (PRICES.giftWrapTiers) {
        var minDim = Math.min(STATE.w, STATE.h);
        var maxDim = Math.max(STATE.w, STATE.h);
        for (var gi = 0; gi < PRICES.giftWrapTiers.length; gi++) {
          var tier = PRICES.giftWrapTiers[gi];
          if (minDim <= tier.maxW && maxDim <= tier.maxH) {
            giftRaw = tier.price;
            break;
          }
        }
        if (giftRaw === 0) giftLabelRaw = PRICES.giftWrapOversizeLabel || null;
      }
      var giftCost  = STATE.gift ? giftRaw : 0;
      var giftLabel = STATE.gift ? giftLabelRaw : null;

      /* Frame (perimeter in metres) */
      var perimM = perim / 100;
      var fPerM = PRICES.framePerM;
      var fClassicMult = PRICES.frameClassicMult;
      var curFrame = FRAMES_DB.find(function (f) { return f.id === STATE.frame; }) || FRAMES_DB[0];
      var fMult = curFrame.cat === 'CLASSIC' ? fClassicMult : 1;
      var frameCost = (STATE.frame !== 'NONE') ? perimM * fPerM * fMult : 0;

      var total = Math.ceil(printCost + faceCost + varnishCost + gelCost
        + acrylicCost + oilCost + potalCost + giftCost + frameCost + STATE.processing);

      return {
        total: total,
        wrapCost: Math.ceil(printCost),
        processingCost: STATE.processing,
        varnishCost: Math.ceil(varnishCost),
        giftCost: Math.ceil(giftCost),
        frameCost: Math.ceil(frameCost),
        faceCost: Math.ceil(faceCost),
        gelCost: Math.ceil(gelCost),
        acrylicCost: Math.ceil(acrylicCost),
        oilCost: Math.ceil(oilCost),
        potalCost: Math.ceil(potalCost),
        digitalMockupCost: 0,
        giftLabel: giftLabel,
        /* Potential costs (shown gray when option is off) */
        varnishPotential: Math.ceil(varnishRaw),
        giftPotential: Math.ceil(giftRaw),
        giftLabelPotential: giftLabelRaw,
        gelPotential: Math.ceil(gelRaw),
        acrylicPotential: Math.ceil(acrylicRaw),
        oilPotential: Math.ceil(oilRaw),
        potalPotential: Math.ceil(potalRaw)
      };
    }

    /* ---------- UI update ---------- */

    function updateUI(els) {
      if (!els) {
        if (!_cachedEls) {
          _cachedEls = {
            inpW: getEl('inp-w'), inpH: getEl('inp-h'),
            lblW: getEl('lbl-w'), lblH: getEl('lbl-h'),
            canvas: getEl('preview-canvas'),
            priceTotal: getEl('total-price'),
            priceVarnish: getEl('price-varnish'),
            priceGift: getEl('price-gift'), priceFrame: getEl('price-frame'),
            selectedFrameText: getEl('selected-frame-text'),
            stickyTotal: getEl('sticky-total-price'),
            wrapBtns: document.querySelectorAll('.wrap-btn'),
            processingSelect: getEl('processing-select'),
            badgeWrap: getEl('badge-wrap'),
            badgeProcessing: getEl('badge-processing'),
            roomBg: document.querySelector('.room-bg')  /* task 3.2 */
          };
        }
        els = _cachedEls;
      }

      /* Interior background */
      var roomData = INTERIORS_DB.find(function (r) { return r.id === STATE.interior; }) || INTERIORS_DB[0];
      var roomBg = els.roomBg || document.querySelector('.room-bg');  /* task 3.2: use cached ref */
      if (roomBg) roomBg.style.backgroundImage = "url('" + roomData.url + "')";

      if (els.canvas) {
        els.canvas.style.top = roomData.top;
        els.canvas.style.right = roomData.right;
        els.canvas.style.transformOrigin = roomData.origin;
        els.canvas.style.translate = roomData.translate || '0 0';
        if (STATE.wrap === 'GALLERY') els.canvas.classList.add('gallery-3d');
        else els.canvas.classList.remove('gallery-3d');
      }

      /* Prices */
      var costs = calculate();
      if (els.priceTotal) els.priceTotal.textContent = costs.total.toLocaleString();
      if (els.stickyTotal) els.stickyTotal.textContent = costs.total.toLocaleString() + ' р.';

      /* priceSize removed — combined into badge-wrap */

      if (els.priceVarnish) {
        var vShow = costs.varnishCost > 0 ? costs.varnishCost : costs.varnishPotential;
        els.priceVarnish.textContent = vShow > 0 ? vShow.toLocaleString() + ' р.' : '0 р.';
        els.priceVarnish.className = 'calc-badge' + (costs.varnishCost > 0 ? ' is-active' : '');
      }
      if (els.priceGift) {
        if (costs.giftLabel) {
          els.priceGift.textContent = costs.giftLabel;
          els.priceGift.className = 'calc-badge is-warning';
        } else if (costs.giftLabelPotential && costs.giftCost === 0) {
          els.priceGift.textContent = costs.giftLabelPotential;
          els.priceGift.className = 'calc-badge';
        } else {
          var gShow = costs.giftCost > 0 ? costs.giftCost : costs.giftPotential;
          els.priceGift.textContent = gShow > 0 ? gShow.toLocaleString() + ' р.' : '0 р.';
          els.priceGift.className = 'calc-badge' + (costs.giftCost > 0 ? ' is-active' : '');
        }
      }
      if (els.priceFrame) {
        els.priceFrame.textContent = costs.frameCost > 0 ? costs.frameCost + ' р.' : '0 р.';
        els.priceFrame.className = 'calc-badge' + (costs.frameCost > 0 ? ' is-active' : '');
      }

      /* Wrap badge: combined print + stretcher + gallery surcharge */
      if (els.badgeWrap) {
        els.badgeWrap.textContent = costs.wrapCost > 0
          ? costs.wrapCost.toLocaleString() + ' р.'
          : '0 р.';
        els.badgeWrap.className = 'calc-badge' + (costs.wrapCost > 0 ? ' is-active' : '');
      }

      /* Processing badge */
      if (els.badgeProcessing) {
        els.badgeProcessing.textContent = costs.processingCost > 0
          ? costs.processingCost.toLocaleString() + ' р.'
          : '0 р.';
        els.badgeProcessing.className = 'calc-badge' + (costs.processingCost > 0 ? ' is-active' : '');
      }

      /* Portrait badges */
      if (isPortrait && portraitEls) {
        if (portraitEls.badgeFaces) {
          portraitEls.badgeFaces.textContent = costs.faceCost > 0
            ? costs.faceCost.toLocaleString() + ' р.'
            : 'включено';
          portraitEls.badgeFaces.className = 'calc-badge' + (costs.faceCost > 0 ? ' is-active' : '');
        }
        if (portraitEls.badgeGel) {
          var gelShow = costs.gelCost > 0 ? costs.gelCost : costs.gelPotential;
          portraitEls.badgeGel.textContent = gelShow > 0 ? gelShow.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeGel.className = 'calc-badge' + (costs.gelCost > 0 ? ' is-active' : '');
        }
        if (portraitEls.badgeAcrylic) {
          var acrShow = costs.acrylicCost > 0 ? costs.acrylicCost : costs.acrylicPotential;
          portraitEls.badgeAcrylic.textContent = acrShow > 0 ? acrShow.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeAcrylic.className = 'calc-badge' + (costs.acrylicCost > 0 ? ' is-active' : '');
        }
        if (portraitEls.badgeOil) {
          var oilShow = costs.oilCost > 0 ? costs.oilCost : costs.oilPotential;
          portraitEls.badgeOil.textContent = oilShow > 0 ? oilShow.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeOil.className = 'calc-badge' + (costs.oilCost > 0 ? ' is-active' : '');
        }
        if (portraitEls.badgePotal) {
          var potShow = costs.potalCost > 0 ? costs.potalCost : costs.potalPotential;
          portraitEls.badgePotal.textContent = potShow > 0 ? potShow.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgePotal.className = 'calc-badge' + (costs.potalCost > 0 ? ' is-active' : '');
        }
        if (portraitEls.badgeMockup) {
          portraitEls.badgeMockup.textContent = costs.digitalMockupCost > 0
            ? costs.digitalMockupCost.toLocaleString() + ' р.'
            : '0 р.';
          portraitEls.badgeMockup.className = 'calc-badge' + (costs.digitalMockupCost > 0 ? ' is-active' : '');
        }
      }

      /* Cache current frame lookup (used for text + canvas preview) */
      var _curFrame = FRAMES_DB.find(function (x) { return x.id === STATE.frame; }) || FRAMES_DB[0];

      if (els.selectedFrameText) {
        els.selectedFrameText.textContent = _curFrame ? _curFrame.name : 'Без багета';
      }

      /* Wrap buttons */
      els.wrapBtns.forEach(function (btn) {
        if (btn.dataset.val === STATE.wrap) {
          btn.className = 'wrap-btn is-active';
          btn.setAttribute('aria-checked', 'true');
        } else {
          btn.className = 'wrap-btn';
          btn.setAttribute('aria-checked', 'false');
        }
      });

      /* Size labels */
      if (els.lblW) els.lblW.textContent = STATE.w;
      if (els.lblH) els.lblH.textContent = STATE.h;

      /* Canvas preview */
      if (els.canvas) {
        var factorW = 7.5 / 20;
        var factorH = 17.5 / 30;
        var wPct = STATE.w * factorW;
        var hPct = STATE.h * factorH;
        els.canvas.style.width = wPct + '%';
        els.canvas.style.height = hPct + '%';

        if (STATE.image) els.canvas.classList.add('has-image');
        else els.canvas.classList.remove('has-image');

        var fr = _curFrame;
        if (STATE.frame !== 'NONE') {
          els.canvas.style.border = fr.width + 'px solid ' + fr.color;
          els.canvas.style.backgroundClip = 'padding-box';
          els.canvas.style.backgroundOrigin = 'padding-box';
          if (fr.border) els.canvas.style.outline = '1px solid ' + fr.border;
          else els.canvas.style.outline = 'none';
          if (fr.style === 'ornate_gold') {
            els.canvas.style.borderImage = 'linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7) 1';
            els.canvas.style.borderColor = '#d4af37';
          } else {
            els.canvas.style.borderImage = 'none';
          }
        } else {
          els.canvas.style.border = 'none';
          els.canvas.style.outline = 'none';
          els.canvas.style.borderImage = 'none';
          if (STATE.wrap === 'NO_FRAME') els.canvas.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.1)';
        }

        if (STATE.image) {
          els.canvas.style.backgroundImage = 'url(' + STATE.image + ')';
          els.canvas.style.backgroundSize = 'cover';
          els.canvas.style.backgroundPosition = 'center';
        } else {
          els.canvas.style.backgroundImage = 'none';
          els.canvas.style.backgroundColor = '#fff';
        }
      }

      updateModalPreviews();
    }

    /* ========== BOOTSTRAP ========== */

    if (isPortrait) {
      initHintSystem();
      buildPortraitSections();
    } else if (cfg.tooltips) {
      initHintSystem();
      enhanceStaticVarnishGift();
    }
    renderFrameCatalog();
    initMain();
    initLightbox();
    renderSizePresets();
    initOrderForm();
  };
})();
