/**
 * MUSE — Конструктор модульных картин
 * Визуальное проектирование макета + расчёт цены по модулям
 *
 * Зависимости: prices.js (MUSE_PRICES.canvas)
 * Инициализация: ModularCalcInit() — вызывается автоматически при загрузке
 *
 * Формула расчёта (за каждый модуль отдельно):
 *   printCostᵢ = coeff[0]·Sᵢ + coeff[1]·Pᵢ·strPrice + coeff[2]·Pᵢ + coeff[3]
 *   totalPrint  = Σ printCostᵢ
 *   + лак (по суммарной площади)
 *   + обработка фото (фиксированная)
 *   + подарочная упаковка (по max-модулю)
 */
;(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
   *  CONSTANTS
   * ═══════════════════════════════════════════════════════════ */
  var SCALE = 4;       // px per cm for canvas rendering
  var GAP_CM = 3;      // gap between modules (cm)
  var MIN_MODULE = 15; // min module side (cm)
  var MAX_MODULE_W = 150;
  var MAX_MODULE_H = 100;

  /* Format price with thousands separator: 1234 → "1 234" */
  function fmtPrice(n) {
    var s = String(Math.ceil(n));
    var result = '';
    for (var i = s.length - 1, c = 0; i >= 0; i--, c++) {
      if (c > 0 && c % 3 === 0) result = ' ' + result;
      result = s[i] + result;
    }
    return result;
  }

  /* ═══════════════════════════════════════════════════════════
   *  PRICES (read from MUSE_PRICES.canvas — loaded by prices.js)
   * ═══════════════════════════════════════════════════════════ */
  var P = (window.MUSE_PRICES && window.MUSE_PRICES.canvas) || {
    printSqCoeff: 0.29, printPStrCoeff: 0.04, printPBaseCoeff: 0.76,
    printConst: 1998.48, stretcherGallery: 68, varnishCoeff: 0.10,
    processingOptions: [
      { value: 0, label: 'Базовая' },
      { value: 499, label: 'Оптимальная' },
      { value: 999, label: 'Премиальная' }
    ],
    giftWrapTiers: [
      { maxW: 50, maxH: 70, price: 650 },
      { maxW: 60, maxH: 90, price: 750 },
      { maxW: 90, maxH: 120, price: 1200 }
    ],
    giftWrapOversizeLabel: 'по согласованию'
  };

  /* ═══════════════════════════════════════════════════════════
   *  TOOLTIPS (hint buttons «?» — unified with foto-na-kholste)
   * ═══════════════════════════════════════════════════════════ */
  var Tooltips = (window.MUSE_TOOLTIPS && window.MUSE_TOOLTIPS.canvas) || null;
  var hintDialog = null;

  var HINT_TITLES = {
    varnish: 'Покрытие лаком',
    gift: 'Подарочная упаковка'
  };

  function initHintSystem() {
    if (!Tooltips) return;
    hintDialog = document.createElement('dialog');
    hintDialog.className = 'calc-hint-dialog';
    hintDialog.innerHTML =
      '<h3 class="text-base font-bold text-body mb-3" id="mc-hint-title"></h3>' +
      '<div class="text-sm text-body leading-relaxed whitespace-pre-line" id="mc-hint-text"></div>' +
      '<div class="mt-4 text-right">' +
        '<button type="button" class="text-sm font-bold text-primary hover:underline cursor-pointer" id="mc-hint-close">Понятно</button>' +
      '</div>';
    document.body.appendChild(hintDialog);
    hintDialog.querySelector('#mc-hint-close').addEventListener('click', function () { hintDialog.close(); });
    hintDialog.addEventListener('click', function (e) { if (e.target === hintDialog) hintDialog.close(); });
  }

  function showHint(key) {
    if (!hintDialog || !Tooltips || !Tooltips[key]) return;
    var tip = Tooltips[key];
    var title = typeof tip === 'string' ? (HINT_TITLES[key] || '') : (tip.title || '');
    var text  = typeof tip === 'string' ? tip : (tip.text || '');
    hintDialog.querySelector('#mc-hint-title').textContent = title;
    hintDialog.querySelector('#mc-hint-text').textContent = text;
    hintDialog.showModal();
  }

  function hintBtnHtml(key) {
    if (!Tooltips || !Tooltips[key]) return '';
    var label = HINT_TITLES[key] || 'Подсказка';
    return '<button type="button" class="calc-hint-btn" aria-label="' + label + '" data-hint="' + key + '">?</button>';
  }

  /* ═══════════════════════════════════════════════════════════
   *  ICONS (inline SVG)
   * ═══════════════════════════════════════════════════════════ */
  var Icons = {
    Upload: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    Photo: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    Format: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
    Layout: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    Options: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    ZoomIn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    ZoomOut: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    Center: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    X: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
  };

  /* ═══════════════════════════════════════════════════════════
   *  STATE
   * ═══════════════════════════════════════════════════════════ */
  var State = {
    modules: [],
    uploadedImages: [],
    previewImage: null,
    activeTab: 'format',
    interactionMode: 'layout',
    imgSize: { w: 0, h: 0 },
    imageZoom: 1,
    imagePan: { x: 0, y: 0 },
    viewParams: { x: 0, y: 0, scale: 1 },
    totals: { fullWidth: 0, fullHeight: 0, minTop: 0, maxBottom: 0, minLeft: 0, price: 0 },
    filterCount: 3,
    isDragOver: false,
    domCache: new Map(),
    // calculator options
    varnish: true,
    processing: 0,
    gift: false,
    // mobile layout mode: 'sheet' (A) or 'split' (B)
    mobileLayout: 'sheet'
  };

  var Gesture = {
    mode: 'idle', startX: 0, startY: 0,
    startPan: { x: 0, y: 0 }, startZoom: 1, startDist: 0,
    moduleId: null, resizeType: null, initialModules: [], rafId: null
  };

  /* ═══════════════════════════════════════════════════════════
   *  PRESETS
   * ═══════════════════════════════════════════════════════════ */
  function generatePresets() {
    var all = [];
    var id = 1;
    function add(count, modules, cols) {
      all.push({
        name: 'Вариант ' + (id++), count: count, cols: cols || count,
        modules: modules.map(function (m) { return { width: m.w, height: m.h, offsetTop: m.ot }; })
      });
    }
    // 2 Modules
    add(2, [{w:50,h:80,ot:0},{w:50,h:80,ot:0}]);
    add(2, [{w:50,h:80,ot:10},{w:50,h:80,ot:0}]);
    add(2, [{w:50,h:80,ot:0},{w:50,h:80,ot:10}]);
    add(2, [{w:35,h:80,ot:0},{w:65,h:80,ot:0}]);
    add(2, [{w:65,h:80,ot:0},{w:35,h:80,ot:0}]);
    add(2, [{w:40,h:60,ot:20},{w:40,h:80,ot:0}]);
    add(2, [{w:40,h:80,ot:0},{w:40,h:60,ot:20}]);
    add(2, [{w:40,h:80,ot:0},{w:40,h:80,ot:20}]);
    add(2, [{w:45,h:45,ot:0},{w:45,h:45,ot:0}]);
    // 3 Modules
    add(3, [{w:33,h:80,ot:0},{w:33,h:80,ot:0},{w:33,h:80,ot:0}]);
    add(3, [{w:33,h:80,ot:0},{w:33,h:80,ot:10},{w:33,h:80,ot:20}]);
    add(3, [{w:33,h:80,ot:20},{w:33,h:80,ot:10},{w:33,h:80,ot:0}]);
    add(3, [{w:33,h:60,ot:10},{w:33,h:80,ot:0},{w:33,h:60,ot:10}]);
    add(3, [{w:33,h:80,ot:0},{w:33,h:60,ot:10},{w:33,h:80,ot:0}]);
    add(3, [{w:25,h:60,ot:10},{w:50,h:80,ot:0},{w:25,h:60,ot:10}]);
    add(3, [{w:40,h:80,ot:0},{w:20,h:60,ot:10},{w:40,h:80,ot:0}]);
    add(3, [{w:50,h:80,ot:0},{w:25,h:60,ot:10},{w:25,h:40,ot:20}]);
    add(3, [{w:25,h:40,ot:20},{w:25,h:60,ot:10},{w:50,h:80,ot:0}]);
    add(3, [{w:30,h:80,ot:0},{w:30,h:80,ot:15},{w:30,h:80,ot:0}]);
    add(3, [{w:30,h:80,ot:15},{w:30,h:80,ot:0},{w:30,h:80,ot:15}]);
    add(3, [{w:40,h:50,ot:15},{w:40,h:80,ot:0},{w:20,h:50,ot:15}]);
    add(3, [{w:33,h:33,ot:0},{w:33,h:33,ot:0},{w:33,h:33,ot:0}]);
    add(3, [{w:33,h:40,ot:20},{w:33,h:80,ot:0},{w:33,h:40,ot:20}]);
    add(3, [{w:20,h:80,ot:0},{w:60,h:80,ot:0},{w:20,h:80,ot:0}]);
    add(3, [{w:33,h:80,ot:0},{w:33,h:70,ot:5},{w:33,h:60,ot:10}]);
    add(3, [{w:33,h:60,ot:10},{w:33,h:70,ot:5},{w:33,h:80,ot:0}]);
    // 4 Modules
    add(4, [{w:22,h:80,ot:0},{w:28,h:80,ot:0},{w:28,h:80,ot:0},{w:22,h:80,ot:0}]);
    add(4, [{w:48,h:48,ot:0},{w:48,h:48,ot:0},{w:48,h:48,ot:51},{w:48,h:48,ot:51}], 2);
    add(4, [{w:20,h:60,ot:20},{w:30,h:80,ot:0},{w:30,h:80,ot:0},{w:20,h:60,ot:20}]);
    add(4, [{w:30,h:80,ot:0},{w:20,h:60,ot:10},{w:20,h:60,ot:10},{w:30,h:80,ot:0}]);
    add(4, [{w:22,h:50,ot:30},{w:28,h:70,ot:10},{w:28,h:80,ot:0},{w:22,h:60,ot:20}]);
    add(4, [{w:25,h:80,ot:0},{w:25,h:80,ot:10},{w:25,h:80,ot:20},{w:25,h:80,ot:30}]);
    add(4, [{w:25,h:80,ot:30},{w:25,h:80,ot:20},{w:25,h:80,ot:10},{w:25,h:80,ot:0}]);
    add(4, [{w:20,h:60,ot:10},{w:30,h:80,ot:0},{w:30,h:80,ot:0},{w:20,h:60,ot:10}]);
    add(4, [{w:30,h:80,ot:0},{w:20,h:60,ot:10},{w:20,h:60,ot:10},{w:30,h:80,ot:0}]);
    add(4, [{w:40,h:80,ot:0},{w:20,h:60,ot:10},{w:20,h:60,ot:10},{w:20,h:40,ot:20}]);
    add(4, [{w:22,h:60,ot:10},{w:28,h:80,ot:0},{w:28,h:80,ot:20},{w:22,h:60,ot:30}]);
    add(4, [{w:22,h:80,ot:0},{w:28,h:80,ot:20},{w:28,h:80,ot:0},{w:22,h:80,ot:20}]);
    add(4, [{w:22,h:80,ot:20},{w:28,h:80,ot:0},{w:28,h:80,ot:20},{w:22,h:80,ot:0}]);
    add(4, [{w:20,h:50,ot:15},{w:30,h:80,ot:0},{w:30,h:80,ot:0},{w:20,h:50,ot:15}]);
    add(4, [{w:15,h:80,ot:0},{w:35,h:80,ot:0},{w:35,h:80,ot:0},{w:15,h:80,ot:0}]);
    add(4, [{w:35,h:80,ot:0},{w:15,h:80,ot:0},{w:15,h:80,ot:0},{w:35,h:80,ot:0}]);
    add(4, [{w:25,h:25,ot:0},{w:25,h:25,ot:0},{w:25,h:25,ot:0},{w:25,h:25,ot:0}]);
    // 5+ Modules
    add(5, [{w:19,h:80,ot:0},{w:19,h:80,ot:0},{w:19,h:80,ot:0},{w:19,h:80,ot:0},{w:19,h:80,ot:0}]);
    add(5, [{w:15,h:60,ot:15},{w:15,h:75,ot:7.5},{w:40,h:90,ot:0},{w:15,h:75,ot:7.5},{w:15,h:60,ot:15}]);
    add(5, [{w:18,h:80,ot:20},{w:18,h:80,ot:10},{w:18,h:80,ot:0},{w:18,h:80,ot:10},{w:18,h:80,ot:20}]);
    add(5, [{w:18,h:80,ot:0},{w:18,h:80,ot:10},{w:18,h:80,ot:20},{w:18,h:80,ot:10},{w:18,h:80,ot:0}]);
    add(5, [{w:18,h:80,ot:0},{w:18,h:80,ot:10},{w:18,h:80,ot:20},{w:18,h:80,ot:30},{w:18,h:80,ot:40}]);
    add(5, [{w:20,h:60,ot:10},{w:20,h:80,ot:0},{w:20,h:40,ot:20},{w:20,h:80,ot:0},{w:20,h:60,ot:10}]);
    add(5, [{w:32,h:32,ot:0},{w:32,h:32,ot:0},{w:32,h:32,ot:0},{w:48,h:48,ot:35},{w:48,h:48,ot:35}], 3);
    add(5, [{w:48,h:48,ot:0},{w:48,h:48,ot:0},{w:32,h:32,ot:51},{w:32,h:32,ot:51},{w:32,h:32,ot:51}], 2);
    add(5, [{w:20,h:40,ot:20},{w:20,h:60,ot:10},{w:20,h:80,ot:0},{w:20,h:60,ot:10},{w:20,h:40,ot:20}]);
    add(6, [{w:15,h:80,ot:0},{w:15,h:80,ot:0},{w:15,h:80,ot:0},{w:15,h:80,ot:0},{w:15,h:80,ot:0},{w:15,h:80,ot:0}]);
    add(6, [{w:32,h:45,ot:0},{w:32,h:45,ot:0},{w:32,h:45,ot:0},{w:32,h:45,ot:48},{w:32,h:45,ot:48},{w:32,h:45,ot:48}], 3);
    add(6, [{w:48,h:32,ot:0},{w:48,h:32,ot:0},{w:48,h:32,ot:35},{w:48,h:32,ot:35},{w:48,h:32,ot:70},{w:48,h:32,ot:70}], 2);
    add(6, [{w:15,h:60,ot:10},{w:15,h:80,ot:0},{w:15,h:60,ot:10},{w:15,h:60,ot:10},{w:15,h:80,ot:0},{w:15,h:60,ot:10}]);
    add(7, [{w:13,h:50,ot:15},{w:13,h:60,ot:10},{w:13,h:70,ot:5},{w:13,h:80,ot:0},{w:13,h:70,ot:5},{w:13,h:60,ot:10},{w:13,h:50,ot:15}]);
    add(8, [{w:23,h:35,ot:0},{w:23,h:35,ot:0},{w:23,h:35,ot:0},{w:23,h:35,ot:0},{w:23,h:35,ot:38},{w:23,h:35,ot:38},{w:23,h:35,ot:38},{w:23,h:35,ot:38}], 4);
    add(8, [{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0},{w:11,h:80,ot:0}]);
    add(10, [{w:19,h:35,ot:0},{w:19,h:35,ot:0},{w:19,h:35,ot:0},{w:19,h:35,ot:0},{w:19,h:35,ot:0},{w:19,h:35,ot:38},{w:19,h:35,ot:38},{w:19,h:35,ot:38},{w:19,h:35,ot:38},{w:19,h:35,ot:38}], 5);
    add(12, [{w:30,h:20,ot:0},{w:30,h:20,ot:0},{w:30,h:20,ot:0},{w:30,h:20,ot:23},{w:30,h:20,ot:23},{w:30,h:20,ot:23},{w:30,h:20,ot:46},{w:30,h:20,ot:46},{w:30,h:20,ot:46},{w:30,h:20,ot:69},{w:30,h:20,ot:69},{w:30,h:20,ot:69}], 3);
    add(14, [{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:0},{w:13,h:35,ot:38},{w:13,h:35,ot:38},{w:13,h:35,ot:38},{w:13,h:35,ot:38},{w:13,h:35,ot:38},{w:13,h:35,ot:38},{w:13,h:35,ot:38}], 7);
    add(16, [{w:23,h:23,ot:0},{w:23,h:23,ot:0},{w:23,h:23,ot:0},{w:23,h:23,ot:0},{w:23,h:23,ot:26},{w:23,h:23,ot:26},{w:23,h:23,ot:26},{w:23,h:23,ot:26},{w:23,h:23,ot:52},{w:23,h:23,ot:52},{w:23,h:23,ot:52},{w:23,h:23,ot:52},{w:23,h:23,ot:78},{w:23,h:23,ot:78},{w:23,h:23,ot:78},{w:23,h:23,ot:78}], 4);
    return all;
  }

  var PRESETS = generatePresets();
  var MODULE_COUNTS = [];
  (function () {
    var s = {};
    PRESETS.forEach(function (p) { s[p.count] = true; });
    MODULE_COUNTS = Object.keys(s).map(Number).sort(function (a, b) { return a - b; });
  })();

  var FORMAT_PRESETS = [
    { rw: 1, rh: 1, label: '1:1', targetW: 100, targetH: 100 },
    { rw: 2, rh: 3, label: '2:3', targetW: 80, targetH: 120 },
    { rw: 3, rh: 2, label: '3:2', targetW: 120, targetH: 80 },
    { rw: 3, rh: 4, label: '3:4', targetW: 90, targetH: 120 },
    { rw: 4, rh: 3, label: '4:3', targetW: 120, targetH: 90 },
    { rw: 16, rh: 9, label: '16:9', targetW: 160, targetH: 90 },
    { rw: 9, rh: 16, label: '9:16', targetW: 90, targetH: 160 },
    { rw: 2, rh: 1, label: '2:1', targetW: 150, targetH: 75 },
    { rw: 1, rh: 2, label: '1:2', targetW: 75, targetH: 150 },
    { rw: 3, rh: 1, label: '3:1', targetW: 150, targetH: 50 },
    { rw: 1, rh: 3, label: '1:3', targetW: 50, targetH: 150 },
    { rw: 5, rh: 4, label: '5:4', targetW: 100, targetH: 80 },
    { rw: 4, rh: 5, label: '4:5', targetW: 80, targetH: 100 }
  ];

  /* ═══════════════════════════════════════════════════════════
   *  LAYOUT LOGIC
   * ═══════════════════════════════════════════════════════════ */
  function applyLayout(preset) {
    var itemsPerRow = preset.cols || preset.count;
    var currentX = 0;
    var temp = preset.modules.map(function (m, i) {
      if (i > 0 && i % itemsPerRow === 0) currentX = 0;
      var ol = currentX;
      currentX += m.width + GAP_CM;
      return { width: m.width, height: m.height, offsetTop: m.offsetTop || 0, offsetLeft: ol, id: Date.now() + i + Math.random() };
    });
    var minL = Infinity, minT = Infinity;
    temp.forEach(function (m) { minL = Math.min(minL, m.offsetLeft); minT = Math.min(minT, m.offsetTop); });
    return temp.map(function (m) { return { width: m.width, height: m.height, offsetTop: m.offsetTop - minT, offsetLeft: m.offsetLeft - minL, id: m.id }; });
  }

  /* ═══════════════════════════════════════════════════════════
   *  PRICE CALCULATION — per-module formula from prices.js
   * ═══════════════════════════════════════════════════════════ */
  function calculateModulePrintCost(w, h) {
    var sq = w * h;
    var perim = (w + h) * 2;
    // Модульные картины — всегда галерейная натяжка
    var strPrice = P.stretcherGallery;
    return P.printSqCoeff * sq
      + P.printPStrCoeff * perim * strPrice
      + P.printPBaseCoeff * perim
      + P.printConst;
  }

  function calculateTotals() {
    var minTop = Infinity, maxBottom = -Infinity, maxRight = 0, minLeft = Infinity;
    var totalPrint = 0;
    var totalArea = 0;

    State.modules.forEach(function (m) {
      minTop = Math.min(minTop, m.offsetTop);
      minLeft = Math.min(minLeft, m.offsetLeft);
      maxBottom = Math.max(maxBottom, m.offsetTop + m.height);
      maxRight = Math.max(maxRight, m.offsetLeft + m.width);
      totalPrint += calculateModulePrintCost(m.width, m.height);
      totalArea += m.width * m.height;
    });
    if (minTop === Infinity) { minTop = 0; maxBottom = 0; maxRight = 0; minLeft = 0; }

    // Varnish: total area × coefficient
    var varnishCost = State.varnish ? totalArea * P.varnishCoeff : 0;

    // Processing: fixed amount from selected option
    var processingCost = State.processing || 0;

    // Gift wrap: by largest module dimensions
    var giftCost = 0;
    var giftLabel = null;
    if (State.gift && P.giftWrapTiers) {
      // Find the largest module
      var maxModW = 0, maxModH = 0;
      State.modules.forEach(function (m) {
        maxModW = Math.max(maxModW, m.width);
        maxModH = Math.max(maxModH, m.height);
      });
      var minDim = Math.min(maxModW, maxModH);
      var maxDim = Math.max(maxModW, maxModH);
      for (var i = 0; i < P.giftWrapTiers.length; i++) {
        var tier = P.giftWrapTiers[i];
        if (minDim <= tier.maxW && maxDim <= tier.maxH) {
          giftCost = tier.price;
          break;
        }
      }
      // Multiply by number of modules (each needs wrapping)
      giftCost = giftCost * State.modules.length;
      if (giftCost === 0) giftLabel = P.giftWrapOversizeLabel || null;
    }

    var total = Math.ceil(totalPrint + varnishCost + processingCost + giftCost);

    State.totals = {
      fullWidth: maxRight - minLeft,
      fullHeight: maxBottom - minTop,
      minTop: minTop,
      maxBottom: maxBottom,
      minLeft: minLeft,
      price: total,
      printCost: Math.ceil(totalPrint),
      varnishCost: Math.ceil(varnishCost),
      processingCost: processingCost,
      giftCost: giftCost,
      giftLabel: giftLabel,
      totalArea: totalArea,
      moduleCount: State.modules.length
    };

    var sizeEl = document.getElementById('mc-size-label');
    if (sizeEl) sizeEl.textContent = Math.round(State.totals.fullWidth) + ' × ' + Math.round(State.totals.fullHeight) + ' см';

    updateStickyBar();
  }

  /* ═══════════════════════════════════════════════════════════
   *  VIEW TRANSFORMS
   * ═══════════════════════════════════════════════════════════ */
  function fitView() {
    var ws = document.getElementById('mc-workspace');
    if (!ws) return;
    var cw = ws.clientWidth, ch = ws.clientHeight;
    var contentW = State.totals.fullWidth * SCALE;
    var contentH = State.totals.fullHeight * SCALE;
    if (!contentW || !contentH) return;
    var padding = 60;
    var scale = Math.min((cw - padding) / contentW, (ch - padding) / contentH, 1.2);
    var bbCX = (State.totals.minLeft + State.totals.fullWidth / 2) * SCALE;
    var bbCY = (State.totals.minTop + State.totals.fullHeight / 2) * SCALE;
    State.viewParams = { scale: scale, x: (cw / 2) - (bbCX * scale), y: (ch / 2) - (bbCY * scale) };
    updateCanvasTransform();
  }

  function updateCanvasTransform() {
    var el = document.getElementById('mc-canvas-root');
    if (el) el.style.transform = 'translate3d(' + State.viewParams.x + 'px, ' + State.viewParams.y + 'px, 0) scale(' + State.viewParams.scale + ')';
    updateLabelScales();
  }

  /** Keep module size labels readable at any zoom by applying inverse scale */
  function updateLabelScales() {
    var s = State.viewParams.scale || 1;
    var inv = Math.min(1 / s, 3); // cap so labels don't get huge
    State.domCache.forEach(function (dom) {
      if (dom.label) dom.label.style.transform = 'scale(' + inv + ')';
    });
  }

  /* ═══════════════════════════════════════════════════════════
   *  MODULE RENDERING
   * ═══════════════════════════════════════════════════════════ */
  function updateModuleBackground(m, dom) {
    if (!State.previewImage || !dom) return;
    var compW = State.totals.fullWidth * SCALE;
    var compH = State.totals.fullHeight * SCALE;
    var imgRatio = State.imgSize.w / State.imgSize.h || 1;
    var bgW, bgH;
    if (imgRatio > (compW / compH)) { bgH = compH; bgW = bgH * imgRatio; }
    else { bgW = compW; bgH = bgW / imgRatio; }
    var zW = bgW * State.imageZoom, zH = bgH * State.imageZoom;
    var cx = (State.totals.minLeft + State.totals.fullWidth / 2) * SCALE;
    var cy = (State.totals.minTop + State.totals.fullHeight / 2) * SCALE;
    var imgX = cx - (zW / 2) + (State.imagePan.x * SCALE);
    var imgY = cy - (zH / 2) + (State.imagePan.y * SCALE);
    dom.bg.style.backgroundPosition = (imgX - m.offsetLeft * SCALE) + 'px ' + (imgY - m.offsetTop * SCALE) + 'px';
    dom.bg.style.backgroundSize = zW + 'px ' + zH + 'px';
    if (!dom.lastState || !dom.lastState.hasImage) {
      dom.bg.style.backgroundImage = 'url(' + State.previewImage + ')';
    }
    dom.lastState = Object.assign(dom.lastState || {}, { hasImage: true });
  }

  function updateAllBackgrounds() {
    if (!State.previewImage) return;
    State.modules.forEach(function (m) {
      var dom = State.domCache.get(m.id);
      if (dom) updateModuleBackground(m, dom);
    });
  }

  function updateModuleGeometry(m) {
    var dom = State.domCache.get(m.id);
    if (!dom) return;
    var last = dom.lastState || {};
    var x = m.offsetLeft * SCALE, y = m.offsetTop * SCALE;
    var w = m.width * SCALE, h = m.height * SCALE;
    if (last.x !== x || last.y !== y) {
      dom.el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      last.x = x; last.y = y;
    }
    if (last.w !== w || last.h !== h) {
      dom.el.style.width = w + 'px'; dom.el.style.height = h + 'px';
      dom.label.textContent = Math.round(m.width) + '×' + Math.round(m.height);
      last.w = w; last.h = h;
    }
    dom.lastState = last;
    if (State.previewImage) updateModuleBackground(m, dom);
  }

  function renderModules() {
    var canvas = document.getElementById('mc-canvas-root');
    if (!canvas) return;
    canvas.innerHTML = '';
    State.domCache.clear();
    State.modules.forEach(function (m) {
      var el = document.createElement('div');
      el.dataset.moduleId = m.id;
      el.className = 'absolute bg-white shadow-xl group mc-hw-accel mc-module-item mc-module-touch' + (State.interactionMode === 'layout' ? ' cursor-move' : '');
      el.setAttribute('draggable', 'false');
      var x = m.offsetLeft * SCALE, y = m.offsetTop * SCALE, w = m.width * SCALE, h = m.height * SCALE;
      el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      el.style.width = w + 'px'; el.style.height = h + 'px';

      var bg = document.createElement('div');
      bg.className = 'absolute inset-0 bg-no-repeat pointer-events-none bg-gray-100 transition-colors duration-200';
      el.appendChild(bg);

      if (State.interactionMode === 'layout') {
        var border = document.createElement('div');
        border.className = 'absolute inset-0 border-2 border-transparent group-hover:border-primary/40 transition-colors pointer-events-none';
        el.appendChild(border);
        [
          { t: 'e', c: 'top-0 bottom-0 right-[-10px] w-5 cursor-ew-resize' },
          { t: 'w', c: 'top-0 bottom-0 left-[-10px] w-5 cursor-ew-resize' },
          { t: 's', c: 'left-0 right-0 bottom-[-10px] h-5 cursor-ns-resize' },
          { t: 'n', c: 'left-0 right-0 top-[-10px] h-5 cursor-ns-resize' }
        ].forEach(function (p) {
          var handle = document.createElement('div');
          handle.dataset.resizeType = p.t;
          handle.className = 'absolute z-10 ' + p.c;
          el.appendChild(handle);
        });
      }

      var label = document.createElement('div');
      label.className = 'absolute bottom-0 right-0 bg-black/60 text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm pointer-events-none z-20 leading-tight origin-bottom-right';
      label.textContent = Math.round(m.width) + '×' + Math.round(m.height);
      el.appendChild(label);

      canvas.appendChild(el);
      State.domCache.set(m.id, { el: el, bg: bg, label: label, lastState: { x: x, y: y, w: w, h: h } });
    });
    updateAllBackgrounds();
  }

  /* ═══════════════════════════════════════════════════════════
   *  GESTURES
   * ═══════════════════════════════════════════════════════════ */
  function getTouchDist(t1, t2) { return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY); }

  function handleStart(clientX, clientY, target, isTouch, touches) {
    if (target.id === 'mc-workspace' || target.id === 'mc-canvas-root') return;
    Gesture.startX = clientX; Gesture.startY = clientY;
    if (isTouch && touches && touches.length === 2) {
      Gesture.mode = 'pinch'; Gesture.startDist = getTouchDist(touches[0], touches[1]); Gesture.startZoom = State.imageZoom;
      return;
    }
    var moduleEl = target.closest('[data-module-id]');
    if (moduleEl) {
      Gesture.mode = 'drag'; Gesture.moduleId = parseFloat(moduleEl.dataset.moduleId);
      Gesture.resizeType = target.dataset.resizeType || null;
      if (State.interactionMode === 'layout') { Gesture.initialModules = JSON.parse(JSON.stringify(State.modules)); }
      else { Gesture.startPan = { x: State.imagePan.x, y: State.imagePan.y }; }
    } else { Gesture.mode = 'idle'; }
  }

  function handleMove(clientX, clientY, isTouch, touches) {
    if (isTouch && touches && touches.length === 2) {
      if (Gesture.mode !== 'pinch') { Gesture.mode = 'pinch'; Gesture.startDist = getTouchDist(touches[0], touches[1]); Gesture.startZoom = State.imageZoom; }
      var nd = getTouchDist(touches[0], touches[1]);
      if (Gesture.startDist > 0) {
        State.imageZoom = Math.max(0.1, Math.min(5, Gesture.startZoom * (nd / Gesture.startDist)));
        if (!Gesture.rafId) Gesture.rafId = requestAnimationFrame(function () { updateAllBackgrounds(); Gesture.rafId = null; });
      }
      return true;
    }
    if (Gesture.mode === 'drag') {
      var dx = clientX - Gesture.startX, dy = clientY - Gesture.startY;
      var mdx = dx / (SCALE * State.viewParams.scale), mdy = dy / (SCALE * State.viewParams.scale);
      if (State.interactionMode === 'image' && State.previewImage) {
        var z = State.imageZoom;
        State.imagePan.x = Gesture.startPan.x + (dx / (SCALE * State.viewParams.scale * z));
        State.imagePan.y = Gesture.startPan.y + (dy / (SCALE * State.viewParams.scale * z));
        if (!Gesture.rafId) Gesture.rafId = requestAnimationFrame(function () { updateAllBackgrounds(); Gesture.rafId = null; });
      } else if (State.interactionMode === 'layout' && Gesture.moduleId) {
        var initMod = null;
        Gesture.initialModules.forEach(function (m) { if (m.id === Gesture.moduleId) initMod = m; });
        if (!initMod) return true;
        State.modules = Gesture.initialModules.map(function (m) {
          if (m.id !== Gesture.moduleId) return m;
          var ch = {};
          if (Gesture.resizeType) {
            switch (Gesture.resizeType) {
              case 'e': ch = { width: clampW(m.width + mdx) }; break;
              case 'w': var nw = clampW(m.width - mdx); ch = { width: nw, offsetLeft: m.offsetLeft + (m.width - nw) }; break;
              case 's': ch = { height: clampH(m.height + mdy) }; break;
              case 'n': var nh = clampH(m.height - mdy); ch = { height: nh, offsetTop: m.offsetTop + (m.height - nh) }; break;
            }
          } else { ch = { offsetLeft: m.offsetLeft + mdx, offsetTop: m.offsetTop + mdy }; }
          return Object.assign({}, m, ch);
        });
        if (!Gesture.rafId) {
          Gesture.rafId = requestAnimationFrame(function () {
            var am = null; State.modules.forEach(function (m) { if (m.id === Gesture.moduleId) am = m; });
            if (am) updateModuleGeometry(am);
            Gesture.rafId = null;
          });
        }
      }
      return true;
    }
    return false;
  }

  function clampW(v) { return Math.max(MIN_MODULE, Math.min(MAX_MODULE_W, v)); }
  function clampH(v) { return Math.max(MIN_MODULE, Math.min(MAX_MODULE_H, v)); }

  function handleEnd() {
    if (Gesture.mode === 'drag' && State.interactionMode === 'layout') {
      calculateTotals(); updateAllBackgrounds();
      if (State.activeTab === 'order') renderSidebar();
    }
    Gesture.mode = 'idle';
  }

  /* ═══════════════════════════════════════════════════════════
   *  SIDEBAR RENDERING
   * ═══════════════════════════════════════════════════════════ */
  function renderSidebar() {
    var container = document.getElementById('mc-sidebar-content');
    if (!container) return;
    container.innerHTML = '';

    if (State.activeTab === 'layout') {
      container.innerHTML =
        '<div class="space-y-2 py-3">' +
          '<div class="space-y-1">' +
            '<div class="px-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">Количество модулей</div>' +
            '<div class="flex overflow-x-auto gap-1.5 px-4 pb-1 snap-x thin-scrollbar-x" id="mc-count-filters"></div>' +
          '</div>' +
          '<div class="px-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">Схема расположения</div>' +
          '<div class="flex overflow-x-auto gap-2 px-4 pb-2 snap-x thin-scrollbar-x lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible" id="mc-preset-list"></div>' +
        '</div>';

      var filterCont = document.getElementById('mc-count-filters');
      MODULE_COUNTS.forEach(function (c) {
        var btn = document.createElement('button');
        var isActive = State.filterCount === c;
        btn.className = 'flex-none w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ' +
          (isActive ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-600');
        btn.textContent = c;
        btn.onclick = function () { State.filterCount = c; renderSidebar(); };
        filterCont.appendChild(btn);
      });
      var presetCont = document.getElementById('mc-preset-list');
      PRESETS.filter(function (p) { return p.count === State.filterCount; }).forEach(function (p) {
        var btn = document.createElement('button');
        btn.className = 'snap-start flex-none w-24 lg:w-full h-24 border border-gray-200 rounded-xl p-1.5 hover:border-primary text-gray-500 hover:text-primary transition-all flex flex-col items-center bg-secondary/50';
        var layout = applyLayout(p);
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        layout.forEach(function (m) { minX = Math.min(minX, m.offsetLeft); minY = Math.min(minY, m.offsetTop); maxX = Math.max(maxX, m.offsetLeft + m.width); maxY = Math.max(maxY, m.offsetTop + m.height); });
        var w = maxX - minX, h = maxY - minY;
        var svgInner = layout.map(function (m) { return '<rect x="' + m.offsetLeft + '" y="' + m.offsetTop + '" width="' + m.width + '" height="' + m.height + '" fill="currentColor" opacity="0.8" rx="2" />'; }).join('');
        btn.innerHTML = '<div class="flex-1 w-full flex items-center justify-center min-h-0"><svg viewBox="' + minX + ' ' + minY + ' ' + w + ' ' + h + '" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="pointer-events-none p-2">' + svgInner + '</svg></div><div class="flex-none h-6 flex items-center justify-center w-full border-t border-gray-100 mt-1"><span class="text-[9px] font-bold uppercase text-gray-500">' + p.name + '</span></div>';
        btn.onclick = function () { State.modules = applyLayout(p); calculateTotals(); fitView(); renderModules(); };
        presetCont.appendChild(btn);
      });

    } else if (State.activeTab === 'format') {
      var fw = Math.round(State.totals.fullWidth);
      var fh = Math.round(State.totals.fullHeight);
      var ratio = (State.totals.fullHeight && State.totals.fullWidth) ? State.totals.fullHeight / State.totals.fullWidth : 1;
      container.innerHTML =
        '<div class="py-3 space-y-3">' +
          '<div class="flex overflow-x-auto gap-2 px-4 pb-1 snap-x snap-mandatory thin-scrollbar-x lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible" id="mc-format-list"></div>' +
          '<div class="border-t border-gray-200 mx-4"></div>' +
          '<div class="bg-secondary mx-4 p-3 rounded-2xl space-y-2">' +
            '<div class="flex items-center justify-between">' +
              '<span class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Размер</span>' +
              '<span id="mc-size-display" class="text-sm font-bold text-body">' + fw + ' × ' + fh + ' см</span>' +
            '</div>' +
            '<input type="range" id="mc-size-slider" min="60" max="200" step="1" value="' + fw + '" class="w-full accent-primary cursor-pointer">' +
            '<div class="flex justify-between text-[9px] text-gray-400 font-medium"><span>60 см</span><span>200 см</span></div>' +
          '</div>' +
        '</div>';
      var flist = document.getElementById('mc-format-list');
      FORMAT_PRESETS.forEach(function (p) {
        var btn = document.createElement('button');
        btn.className = 'snap-start flex-none w-20 h-20 lg:w-full lg:h-28 border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-colors flex flex-col items-center justify-center gap-1';
        btn.innerHTML = '<div class="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center"><div class="border-2 border-current rounded-sm opacity-60" style="aspect-ratio:' + p.rw + '/' + p.rh + '; width:' + (p.rw >= p.rh ? '100%' : 'auto') + '; height:' + (p.rh > p.rw ? '100%' : 'auto') + '"></div></div><span class="text-[10px] font-bold">' + p.label + '</span>';
        btn.onclick = function () { handleResize(p.targetW, p.targetH); };
        flist.appendChild(btn);
      });

      // Proportional range slider
      var slider = document.getElementById('mc-size-slider');
      var sizeDisp = document.getElementById('mc-size-display');
      if (slider) {
        var updateSliderDisplay = function () {
          var w = parseInt(slider.value, 10);
          var curRatio = (State.totals.fullHeight && State.totals.fullWidth) ? State.totals.fullHeight / State.totals.fullWidth : ratio;
          var h = Math.round(w * curRatio);
          if (sizeDisp) sizeDisp.textContent = w + ' \u00d7 ' + h + ' \u0441\u043c';
        };
        slider.oninput = function () { updateSliderDisplay(); };
        slider.onchange = function () {
          var w = parseInt(slider.value, 10);
          var curRatio = (State.totals.fullHeight && State.totals.fullWidth) ? State.totals.fullHeight / State.totals.fullWidth : ratio;
          var h = Math.round(w * curRatio);
          handleResize(w, h);
        };
      }

    } else if (State.activeTab === 'order') {

      // Build processing options
      var procOpts = '';
      if (P.processingOptions) {
        P.processingOptions.forEach(function (opt) {
          var sel = (State.processing === opt.value) ? ' selected' : '';
          procOpts += '<option value="' + opt.value + '"' + sel + '>' + opt.label + (opt.value ? ' (+' + opt.value + ' ₽)' : '') + '</option>';
        });
      }

      /* Varnish price */
      var varnishVal = Math.ceil(State.totals.totalArea * P.varnishCoeff);
      var varnishText = varnishVal > 0 ? fmtPrice(varnishVal) + ' р.' : '0 р.';

      /* Processing price */
      var procVal = State.processing || 0;
      var procText = procVal > 0 ? fmtPrice(procVal) + ' р.' : '0 р.';

      /* Gift price */
      var giftText = '0 р.';
      if (State.totals.giftLabel) {
        giftText = State.totals.giftLabel;
      } else if (State.totals.giftCost > 0) {
        giftText = fmtPrice(State.totals.giftCost) + ' р.';
      } else if (State.gift) {
        /* Calculate potential gift cost for display */
        var potGift = 0;
        if (P.giftWrapTiers) {
          var mxW = 0, mxH = 0;
          State.modules.forEach(function (m) { mxW = Math.max(mxW, m.width); mxH = Math.max(mxH, m.height); });
          var mnD = Math.min(mxW, mxH), mxD = Math.max(mxW, mxH);
          for (var gi = 0; gi < P.giftWrapTiers.length; gi++) {
            var gt = P.giftWrapTiers[gi];
            if (mnD <= gt.maxW && mxD <= gt.maxH) { potGift = gt.price * State.modules.length; break; }
          }
        }
        giftText = potGift > 0 ? fmtPrice(potGift) + ' р.' : '0 р.';
      }

      container.innerHTML =
        '<div class="px-4 py-3 space-y-4">' +
          /* Options — unified with foto-na-kholste */
          '<div class="space-y-4">' +
            /* Varnish — single row: [✓] label [?] price */
            '<div class="flex items-center gap-3">' +
              '<div class="flex h-6 shrink-0 items-center">' +
                '<div class="group grid size-4 grid-cols-1">' +
                  '<input id="mc-toggle-varnish" type="checkbox" name="varnish"' + (State.varnish ? ' checked' : '') + ' aria-label="Покрытие лаком" class="calc-checkbox col-start-1 row-start-1 forced-colors:appearance-auto">' +
                  '<svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"><path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100"></path></svg>' +
                '</div>' +
              '</div>' +
              '<div class="flex items-center gap-1 min-w-0 flex-1">' +
                '<label for="mc-toggle-varnish" class="text-sm font-medium text-body cursor-pointer truncate">Покрытие лаком</label>' +
                hintBtnHtml('varnish') +
              '</div>' +
              '<span class="calc-badge whitespace-nowrap shrink-0' + (State.varnish ? ' is-active' : '') + '" id="mc-varnish-price">' + varnishText + '</span>' +
            '</div>' +
            /* Processing */
            '<section>' +
              '<div class="section-title"><span>Обработка фото</span><span id="mc-proc-price" class="calc-badge' + (procVal > 0 ? ' is-active' : '') + '">' + procText + '</span></div>' +
              '<div class="grid grid-cols-1">' +
                '<select id="mc-select-processing" aria-label="Обработка фото" class="col-start-1 row-start-1 w-full appearance-none bg-white border border-gray-200 text-body py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus-visible:border-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary">' + procOpts + '</select>' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none col-start-1 row-start-1 mr-2 w-5 h-5 self-center justify-self-end text-gray-500"><path d="m6 9 6 6 6-6"/></svg>' +
              '</div>' +
            '</section>' +
            /* Gift wrap — single row: [✓] label [?] price */
            '<div class="flex items-center gap-3">' +
              '<div class="flex h-6 shrink-0 items-center">' +
                '<div class="group grid size-4 grid-cols-1">' +
                  '<input id="mc-toggle-gift" type="checkbox" name="gift"' + (State.gift ? ' checked' : '') + ' aria-label="Подарочная упаковка" class="calc-checkbox col-start-1 row-start-1 forced-colors:appearance-auto">' +
                  '<svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"><path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100"></path></svg>' +
                '</div>' +
              '</div>' +
              '<div class="flex items-center gap-1 min-w-0 flex-1">' +
                '<label for="mc-toggle-gift" class="text-sm font-medium text-body cursor-pointer truncate">Подарочная упаковка</label>' +
                hintBtnHtml('gift') +
              '</div>' +
              '<span class="calc-badge whitespace-nowrap shrink-0' + (State.gift && State.totals.giftCost > 0 ? ' is-active' : '') + (State.totals.giftLabel ? ' is-warning' : '') + '" id="mc-gift-price">' + giftText + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      // Varnish checkbox
      var varnishToggle = document.getElementById('mc-toggle-varnish');
      if (varnishToggle) {
        varnishToggle.onchange = function () {
          State.varnish = varnishToggle.checked;
          calculateTotals();
          renderSidebar();
        };
      }

      // Processing select
      var procSelect = document.getElementById('mc-select-processing');
      if (procSelect) {
        procSelect.onchange = function () {
          State.processing = parseFloat(procSelect.value) || 0;
          calculateTotals();
          renderSidebar();
        };
      }

      // Gift checkbox
      var giftToggle = document.getElementById('mc-toggle-gift');
      if (giftToggle) {
        giftToggle.onchange = function () {
          State.gift = giftToggle.checked;
          calculateTotals();
          renderSidebar();
        };
      }

      // Hint buttons (tooltips)
      var hintBtns = container.querySelectorAll('.calc-hint-btn[data-hint]');
      for (var hi = 0; hi < hintBtns.length; hi++) {
        (function (btn) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            showHint(btn.getAttribute('data-hint'));
          });
        })(hintBtns[hi]);
      }

    }
  }

  function renderTabs() {
    var bars = [
      document.getElementById('mc-tab-bar'),
      document.getElementById('mc-tab-bar-desktop')
    ];
    var tabs = [
      { id: 'format', label: 'Формат', icon: Icons.Format },
      { id: 'layout', label: 'Макет', icon: Icons.Layout },
      { id: 'order', label: 'Опции', icon: Icons.Options }
    ];
    bars.forEach(function (bar) {
      if (!bar) return;
      bar.innerHTML = '';
      tabs.forEach(function (tab) {
        var btn = document.createElement('button');
        btn.className = 'flex-1 py-3 lg:py-4 flex flex-col items-center justify-center gap-1.5 transition-colors ' +
          (State.activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700');
        btn.innerHTML = tab.icon + '<span class="text-[10px] font-black uppercase tracking-wider">' + tab.label + '</span>';
        btn.onclick = function () {
          State.activeTab = tab.id;
          renderSidebar();
          renderTabs();
        };
        bar.appendChild(btn);
      });
    });
  }

  function renderToolbar() {
    var btnL = document.getElementById('mc-btn-mode-layout');
    var btnI = document.getElementById('mc-btn-mode-image');
    var ctrl = document.getElementById('mc-img-controls');
    if (!btnL || !btnI || !ctrl) return;
    var active = 'px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all bg-white text-primary shadow-sm ring-1 ring-black/5';
    var inactive = 'px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-50';
    btnL.className = State.interactionMode === 'layout' ? active : inactive;
    btnI.className = State.interactionMode === 'image' ? active : inactive;
    ctrl.style.display = State.previewImage ? 'flex' : 'none';
    document.getElementById('mc-btn-zoom-out').innerHTML = Icons.ZoomOut;
    document.getElementById('mc-btn-center').innerHTML = Icons.Center;
    document.getElementById('mc-btn-zoom-in').innerHTML = Icons.ZoomIn;
    var ws = document.getElementById('mc-workspace');
    if (ws) {
      ws.style.touchAction = (State.interactionMode === 'image' && State.previewImage) ? 'none' : 'pan-y';
      ws.style.cursor = (State.interactionMode === 'image' && State.previewImage) ? 'move' : 'default';
    }
  }

  function updateStickyBar() {
    var bars = [
      document.getElementById('mc-sticky-bar'),
      document.getElementById('mc-sticky-bar-desktop')
    ];
    bars.forEach(function (bar) {
      if (!bar) return;
      var priceEl = bar.querySelector('.mc-sticky-price');
      if (priceEl) priceEl.textContent = fmtPrice(State.totals.price || 0) + ' р.';
    });
  }

  function renderUI() { renderModules(); renderSidebar(); renderTabs(); renderToolbar(); }

  /* ═══════════════════════════════════════════════════════════
   *  RESIZE
   * ═══════════════════════════════════════════════════════════ */
  function handleResize(targetW, targetH) {
    if (!State.totals.fullWidth || !State.totals.fullHeight) return;
    var sx = targetW / State.totals.fullWidth;
    var sy = targetH / State.totals.fullHeight;
    State.modules = State.modules.map(function (m) {
      return Object.assign({}, m, {
        width: clampW(m.width * sx), height: clampH(m.height * sy),
        offsetLeft: m.offsetLeft * sx, offsetTop: m.offsetTop * sy
      });
    });
    calculateTotals(); fitView(); renderModules();
    if (State.activeTab === 'order' || State.activeTab === 'format') renderSidebar();
  }

  /* ═══════════════════════════════════════════════════════════
   *  FILE UPLOAD — handled by MuseUploader (uploader.js)
   * ═══════════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════════
   *  INIT (called automatically)
   * ═══════════════════════════════════════════════════════════ */
  function init() {
    var root = document.getElementById('mc-calc-root');
    if (!root) return;

    // Mobile layout mode
    State.mobileLayout = root.getAttribute('data-mobile-layout') || 'split';

    // Bind workspace gestures
    var ws = document.getElementById('mc-workspace');
    if (ws) {
      ws.onmousedown = function (e) { if (e.button === 0) handleStart(e.clientX, e.clientY, e.target, false); };
      ws.ontouchstart = function (e) { handleStart(e.touches[0].clientX, e.touches[0].clientY, e.target, true, e.touches); };
      ws.ontouchmove = function (e) { if (Gesture.mode !== 'idle' && handleMove(e.touches[0].clientX, e.touches[0].clientY, true, e.touches)) { if (e.cancelable) e.preventDefault(); } };
      ws.ontouchend = function (e) { if (e.touches.length === 0) handleEnd(); };
      ws.onwheel = function (e) {
        if (State.interactionMode === 'image' && State.previewImage) {
          e.stopPropagation(); e.preventDefault();
          var delta = e.deltaY > 0 ? 0.95 : 1.05;
          State.imageZoom = Math.max(0.1, Math.min(5, State.imageZoom * delta));
          updateAllBackgrounds();
        }
      };
    }
    window.addEventListener('mousemove', function (e) { if (Gesture.mode !== 'idle' && handleMove(e.clientX, e.clientY, false)) e.preventDefault(); });
    window.addEventListener('mouseup', handleEnd);

    // Toolbar buttons
    var btnL = document.getElementById('mc-btn-mode-layout');
    var btnI = document.getElementById('mc-btn-mode-image');
    if (btnL) btnL.onclick = function () { State.interactionMode = 'layout'; renderUI(); };
    if (btnI) btnI.onclick = function () { State.interactionMode = 'image'; renderUI(); };

    var btnZI = document.getElementById('mc-btn-zoom-in');
    var btnZO = document.getElementById('mc-btn-zoom-out');
    var btnC = document.getElementById('mc-btn-center');
    if (btnZI) btnZI.onclick = function () { State.imageZoom *= 1.1; updateAllBackgrounds(); };
    if (btnZO) btnZO.onclick = function () { State.imageZoom *= 0.9; updateAllBackgrounds(); };
    if (btnC) btnC.onclick = function () { State.imagePan = { x: 0, y: 0 }; State.imageZoom = 1; updateAllBackgrounds(); };

    // MuseUploader integration (replaces manual file input + drag&drop)
    if (window.MuseUploader) {
      window._mcUploader = MuseUploader({
        maxFiles: 20,
        dropZoneSelector: '#mc-uploader-zone',
        thumbnailsSelector: '#mc-uploader-thumbs',
        fileInputSelector: '#mc-file-input',
        alertSelector: '#mc-uploader-alert',
        uploadBtnSelector: '#mc-btn-upload',
        statusSelector: '#mc-uploader-status',
        onActiveImageChange: function (img) {
          if (img) {
            State.previewImage = img.previewUrl || img.dataUrl;
            State.imgSize = { w: img.width, h: img.height };
            State.interactionMode = 'layout';
            renderToolbar();
            // Toolbar may change height (img controls shown) → re-center
            requestAnimationFrame(function () { fitView(); renderModules(); });
          } else {
            State.previewImage = null;
            renderModules();
            renderToolbar();
          }
        },
        onImagesChange: function (imgs) {
          State.uploadedImages = imgs;
          if (imgs.length === 0) {
            State.previewImage = null;
            renderModules();
            renderToolbar();
          }
        }
      });
    }

    // Also allow drag&drop onto workspace → forward to uploader
    if (ws && window._mcUploader) {
      ws.ondragover = function (e) { e.preventDefault(); };
      ws.ondrop = function (e) {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          window._mcUploader.addFiles(e.dataTransfer.files);
        }
      };
    }

    // Sticky bar → scroll to order form (mobile only, desktop has no button)
    var stickyBtn = document.getElementById('mc-sticky-btn');
    if (stickyBtn) stickyBtn.onclick = function () {
      var form = document.getElementById('mc-order-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Order form submit handler
    var submitBtn = document.getElementById('mc-btn-submit-order');
    if (submitBtn) {
      submitBtn.onclick = function () {
        var nameEl = document.getElementById('mc-client-name');
        var phoneEl = document.getElementById('mc-client-phone');
        if (nameEl && !nameEl.value.trim()) { nameEl.classList.add('error'); nameEl.focus(); return; }
        if (phoneEl && !phoneEl.value.trim()) { phoneEl.classList.add('error'); phoneEl.focus(); return; }
        var data = {
          modules: State.modules.map(function (m) { return { w: Math.round(m.width), h: Math.round(m.height) }; }),
          totalSize: Math.round(State.totals.fullWidth) + '×' + Math.round(State.totals.fullHeight),
          options: { varnish: State.varnish, processing: State.processing, gift: State.gift },
          price: State.totals.price,
          client: {
            name: nameEl ? nameEl.value.trim() : '',
            phone: phoneEl ? phoneEl.value.trim() : '',
            email: (document.getElementById('mc-client-email') || {}).value || '',
            link: (document.getElementById('mc-client-link') || {}).value || '',
            comment: (document.getElementById('mc-client-comment') || {}).value || ''
          }
        };
        console.log('[Muse Modular] Order data:', data);
        alert('Заказ принят! Итого: ' + State.totals.price.toLocaleString('ru-RU') + ' ₽\nМы свяжемся с вами для подтверждения.');
      };
    }

    // Clear validation on input
    ['mc-client-name', 'mc-client-phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('error'); });
    });

    // ResizeObserver for stable fitView (replaces window.resize)
    if (ws && typeof ResizeObserver !== 'undefined') {
      var roTimer = null;
      new ResizeObserver(function () {
        if (roTimer) clearTimeout(roTimer);
        roTimer = setTimeout(function () { fitView(); }, 80);
      }).observe(ws);
    } else {
      window.addEventListener('resize', fitView);
    }

    // Init hint/tooltip system
    initHintSystem();

    // Start with 3-module preset, default width 140 cm
    var defaultPreset = PRESETS.filter(function (p) { return p.count === 3; })[0] || PRESETS[0];
    State.modules = applyLayout(defaultPreset);
    calculateTotals();
    // Scale to default ~140 cm width (2/3 of standard sofa)
    if (State.totals.fullWidth > 0) {
      var defRatio = 140 / State.totals.fullWidth;
      State.modules = State.modules.map(function (m) {
        return Object.assign({}, m, {
          width: clampW(m.width * defRatio), height: clampH(m.height * defRatio),
          offsetLeft: m.offsetLeft * defRatio, offsetTop: m.offsetTop * defRatio
        });
      });
      calculateTotals();
    }
    renderUI();
    setTimeout(function () { fitView(); renderModules(); }, 100);
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
