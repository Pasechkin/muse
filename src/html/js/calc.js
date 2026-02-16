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

  var DEFAULT_PRICES = {
    /* Universal formula: 0.29·S + 0.04·P·strPrice + 0.76·P + 1998.48 */
    printSqCoeff: 0.29,
    printPStrCoeff: 0.04,
    printPBaseCoeff: 0.76,
    printConst: 1998.48,
    stretcherStandard: 32,
    stretcherGallery: 68,
    stretcherRoll: 32,
    varnishCoeff: 0.10,
    giftWrapTiers: [
      { maxW: 50, maxH: 70, price: 650 },
      { maxW: 60, maxH: 90, price: 750 },
      { maxW: 90, maxH: 120, price: 1200 }
    ],
    giftWrapOversizeLabel: 'по согласованию',
    framePerM: 1200,
    frameClassicMult: 1.5,
    /* Portrait-only extras */
    faceFirst: 1920,
    faceExtra: 960,
    digitalFaceFirst: 3600,
    digitalFaceExtra: 1200,
    gelCoeff: 0.375,
    acrylicCoeff: 1.05,
    oilCoeff: 2,
    oilFaceExtra: 2400,
    potalCoeff: 0.30
  };

  /* ========== PUBLIC API ========== */

  window.CalcInit = function (cfg) {
    cfg = cfg || {};

    /* --- Data (overridable via config) --- */
    var FRAMES_DB    = cfg.frames      || DEFAULT_FRAMES;
    var INTERIORS_DB = cfg.interiors   || DEFAULT_INTERIORS;
    var SIZE_PRESETS  = cfg.sizePresets || DEFAULT_SIZE_PRESETS;
    var PRICES        = cfg.prices     || DEFAULT_PRICES;

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
          accent.className = 'calc-badge ml-1 shrink-0';
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
      mockupNote.className = 'text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3';
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
          '<span class="text-[10px] font-bold text-body text-center leading-tight group-hover:text-primary transition">' + priceText + '</span>';

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

      updateModalPreviews();
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
        priceOld: getEl('old-price'),
        priceVarnish: getEl('price-varnish'),
        priceGift: getEl('price-gift'),
        priceFrame: getEl('price-frame'),
        selectedFrameText: getEl('selected-frame-text'),
        stickyTotal: getEl('sticky-total-price'),
        stickyOld: getEl('sticky-old-price'),
        discountBadge: getEl('discount-badge'),
        stickyDiscountBadge: getEl('sticky-discount-badge'),
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
        badgeProcessing: getEl('badge-processing')
      };

      if (els.toggleVarnish) els.toggleVarnish.checked = STATE.varnish;
      if (els.toggleGift) els.toggleGift.checked = STATE.gift;

      var onDimChange = function () {
        STATE.w = Math.max(20, Math.min(200, parseInt(els.inpW.value) || 0));
        STATE.h = Math.max(20, Math.min(200, parseInt(els.inpH.value) || 0));
        if (isMobileViewport()) STATE.customSizeMode = true;
        renderFrameCatalog();
        updateUI(els);
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
        renderSizePresets();
        if (!isMobileViewport() && !isPortrait) {
          setCustomSizeInputsVisibility(true);
        }
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
        btn.className = isActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-primary-light text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-secondary text-xs font-medium text-body hover:bg-slate-200 transition';
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
        customBtn.className = customActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-primary-light text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-body hover:bg-secondary transition';
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
        btn.className = isActive
          ? 'size-btn shrink-0 px-3 py-1.5 rounded border border-primary bg-primary-light text-xs font-bold text-primary transition'
          : 'size-btn shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-body hover:bg-secondary transition';
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
      var allOptions = document.querySelectorAll('.frame-option');
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
      var previews = document.querySelectorAll('.frame-image-preview');
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
          faceCost = (PRICES.digitalFaceFirst || 0)
            + Math.max(0, STATE.faces - 1) * (PRICES.digitalFaceExtra || 0);
        } else {
          faceCost = (PRICES.faceFirst || 0)
            + Math.max(0, STATE.faces - 1) * (PRICES.faceExtra || 0);
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
      var strPrice = PRICES.stretcherStandard || 32;
      if (STATE.wrap === 'GALLERY') strPrice = PRICES.stretcherGallery || 68;
      else if (STATE.wrap === 'NO_FRAME') strPrice = PRICES.stretcherRoll || 32;

      var printCost = (PRICES.printSqCoeff || 0) * sq
        + (PRICES.printPStrCoeff || 0) * perim * strPrice
        + (PRICES.printPBaseCoeff || 0) * perim
        + (PRICES.printConst || 0);

      /* Coatings (coefficient × area_cm²) */
      var varnishCost = STATE.varnish ? sq * (PRICES.varnishCoeff || 0) : 0;
      var gelCost     = STATE.gel     ? sq * (PRICES.gelCoeff || 0) : 0;
      var acrylicCost = STATE.acrylic ? sq * (PRICES.acrylicCoeff || 0) : 0;
      var oilCost     = STATE.oil     ? sq * (PRICES.oilCoeff || 0)
        + Math.max(0, (STATE.faces || 1) - 1) * (PRICES.oilFaceExtra || 0) : 0;
      var potalCost   = STATE.potal   ? sq * (PRICES.potalCoeff || 0) : 0;

      /* Gift wrap — tiered by dimensions */
      var giftCost = 0;
      var giftLabel = null;
      if (STATE.gift && PRICES.giftWrapTiers) {
        var minDim = Math.min(STATE.w, STATE.h);
        var maxDim = Math.max(STATE.w, STATE.h);
        for (var gi = 0; gi < PRICES.giftWrapTiers.length; gi++) {
          var tier = PRICES.giftWrapTiers[gi];
          if (minDim <= tier.maxW && maxDim <= tier.maxH) {
            giftCost = tier.price;
            break;
          }
        }
        if (giftCost === 0) giftLabel = PRICES.giftWrapOversizeLabel || null;
      }

      /* Frame (perimeter in metres) */
      var perimM = perim / 100;
      var fPerM = PRICES.framePerM || 1200;
      var fClassicMult = PRICES.frameClassicMult || 1.5;
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
        giftLabel: giftLabel
      };
    }

    /* ---------- UI update ---------- */

    function updateUI(els) {
      if (!els) {
        els = {
          inpW: getEl('inp-w'), inpH: getEl('inp-h'),
          lblW: getEl('lbl-w'), lblH: getEl('lbl-h'),
          canvas: getEl('preview-canvas'),
          priceTotal: getEl('total-price'), priceOld: getEl('old-price'),
          priceVarnish: getEl('price-varnish'),
          priceGift: getEl('price-gift'), priceFrame: getEl('price-frame'),
          selectedFrameText: getEl('selected-frame-text'),
          stickyTotal: getEl('sticky-total-price'),
          stickyOld: getEl('sticky-old-price'),
          discountBadge: getEl('discount-badge'),
          stickyDiscountBadge: getEl('sticky-discount-badge'),
          wrapBtns: document.querySelectorAll('.wrap-btn'),
          processingSelect: getEl('processing-select'),
          badgeWrap: getEl('badge-wrap'),
          badgeProcessing: getEl('badge-processing')
        };
      }

      /* Interior background */
      var roomData = INTERIORS_DB.find(function (r) { return r.id === STATE.interior; }) || INTERIORS_DB[0];
      var roomBg = document.querySelector('.room-bg');
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

      if (els.priceOld) {
        var fakeOldPrice = Math.round(costs.total / 0.8 / 10) * 10;
        els.priceOld.textContent = fakeOldPrice.toLocaleString();
        if (els.stickyOld) els.stickyOld.textContent = fakeOldPrice.toLocaleString() + ' р.';

        /* Discount badge */
        var discountPercent = Math.round((1 - costs.total / fakeOldPrice) * 100);
        var badgeText = '-' + discountPercent + '%';
        if (els.discountBadge) {
          els.discountBadge.textContent = badgeText;
          els.discountBadge.style.display = discountPercent > 0 ? '' : 'none';
        }
        if (els.stickyDiscountBadge) {
          els.stickyDiscountBadge.textContent = badgeText;
          els.stickyDiscountBadge.style.display = discountPercent > 0 ? '' : 'none';
        }
      }

      /* priceSize removed — combined into badge-wrap */

      if (els.priceVarnish) {
        els.priceVarnish.textContent = costs.varnishCost > 0 ? costs.varnishCost + ' р.' : '0 р.';
        els.priceVarnish.className = costs.varnishCost > 0
          ? 'text-sm font-bold text-primary normal-case'
          : 'text-sm font-bold text-slate-500 normal-case';
      }
      if (els.priceGift) {
        if (costs.giftLabel) {
          els.priceGift.textContent = costs.giftLabel;
          els.priceGift.className = 'text-sm font-bold text-amber-600 normal-case';
        } else {
          els.priceGift.textContent = costs.giftCost > 0 ? costs.giftCost.toLocaleString() + ' р.' : '0 р.';
          els.priceGift.className = costs.giftCost > 0
            ? 'text-sm font-bold text-primary normal-case'
            : 'text-sm font-bold text-slate-500 normal-case';
        }
      }
      if (els.priceFrame) {
        els.priceFrame.textContent = costs.frameCost > 0 ? costs.frameCost + ' р.' : '0 р.';
        els.priceFrame.className = costs.frameCost > 0
          ? 'text-sm font-bold text-primary normal-case'
          : 'text-sm font-bold text-slate-500 normal-case';
      }

      /* Wrap badge: combined print + stretcher + gallery surcharge */
      if (els.badgeWrap) {
        els.badgeWrap.textContent = costs.wrapCost > 0
          ? costs.wrapCost.toLocaleString() + ' р.'
          : '0 р.';
        els.badgeWrap.className = costs.wrapCost > 0
          ? 'text-sm font-bold text-primary normal-case'
          : 'text-sm font-bold text-slate-500 normal-case';
      }

      /* Processing badge */
      if (els.badgeProcessing) {
        els.badgeProcessing.textContent = costs.processingCost > 0
          ? costs.processingCost.toLocaleString() + ' р.'
          : '0 р.';
        els.badgeProcessing.className = costs.processingCost > 0
          ? 'text-sm font-bold text-primary normal-case'
          : 'text-sm font-bold text-slate-500 normal-case';
      }

      /* Portrait badges */
      if (isPortrait && portraitEls) {
        var activeCls = 'text-sm font-bold text-primary normal-case';
        var inactiveCls = 'text-sm font-bold text-slate-500 normal-case';

        if (portraitEls.badgeFaces) {
          portraitEls.badgeFaces.textContent = costs.faceCost > 0
            ? costs.faceCost.toLocaleString() + ' р.'
            : 'включено';
          portraitEls.badgeFaces.className = costs.faceCost > 0 ? activeCls : inactiveCls;
        }
        if (portraitEls.badgeGel) {
          portraitEls.badgeGel.textContent = costs.gelCost > 0 ? costs.gelCost.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeGel.className = costs.gelCost > 0 ? activeCls : inactiveCls;
        }
        if (portraitEls.badgeAcrylic) {
          portraitEls.badgeAcrylic.textContent = costs.acrylicCost > 0 ? costs.acrylicCost.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeAcrylic.className = costs.acrylicCost > 0 ? activeCls : inactiveCls;
        }
        if (portraitEls.badgeOil) {
          portraitEls.badgeOil.textContent = costs.oilCost > 0 ? costs.oilCost.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgeOil.className = costs.oilCost > 0 ? activeCls : inactiveCls;
        }
        if (portraitEls.badgePotal) {
          portraitEls.badgePotal.textContent = costs.potalCost > 0 ? costs.potalCost.toLocaleString() + ' р.' : '0 р.';
          portraitEls.badgePotal.className = costs.potalCost > 0 ? activeCls : inactiveCls;
        }
        if (portraitEls.badgeMockup) {
          portraitEls.badgeMockup.textContent = costs.digitalMockupCost > 0
            ? costs.digitalMockupCost.toLocaleString() + ' р.'
            : '0 р.';
          portraitEls.badgeMockup.className = costs.digitalMockupCost > 0 ? activeCls : inactiveCls;
        }
      }

      if (els.selectedFrameText) {
        var f = FRAMES_DB.find(function (x) { return x.id === STATE.frame; });
        els.selectedFrameText.textContent = f ? f.name : 'Без багета';
      }

      /* Wrap buttons */
      els.wrapBtns.forEach(function (btn) {
        if (btn.dataset.val === STATE.wrap) {
          btn.className = 'wrap-btn flex-1 py-2 rounded-md text-xs font-bold transition bg-white text-dark shadow-sm border border-slate-100';
        } else {
          btn.className = 'wrap-btn flex-1 py-2 rounded-md text-xs font-medium transition text-body hover:text-dark hover:bg-slate-200/50';
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

        var fr = FRAMES_DB.find(function (x) { return x.id === STATE.frame; }) || FRAMES_DB[0];
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
    }
    renderFrameCatalog();
    initMain();
    initLightbox();
    renderSizePresets();
    initOrderForm();
  };
})();
