/**
 * frames.js — общий модуль каталога багетных рам Muse
 *
 * Используется в:
 *   - calc.js       (основной калькулятор)
 *   - reproduction-search.js (модальный калькулятор репродукций)
 *
 * Экспорт: window.MUSE_FRAMES
 *
 * ⚠️  Текущие pricePerM = демо-значения (1200/1800), НЕ реальные цены.
 *     На продакшене (Bitrix) массив заменяется серверными данными через cfg.frames.
 */
(function () {
  'use strict';

  /* ========== КАТАЛОГ РАМ ========== */

  var DEFAULT_FRAMES = [
    { id: 'NONE',       name: 'Без багета',        cat: 'STUDIO',  color: 'transparent', width: 0,  style: 'flat',              pricePerM: null, imageUrl: null, available: true },
    { id: 'ST_BLACK_M', name: 'Черный мат',         cat: 'STUDIO',  color: '#1a1a1a',     width: 12, style: 'flat',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_WHITE_M', name: 'Белый мат',          cat: 'STUDIO',  color: '#ffffff',      width: 12, style: 'flat',  border: '#e2e8f0', pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_GREY',    name: 'Серый графит',       cat: 'STUDIO',  color: '#475569',     width: 12, style: 'flat',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_SILVER_S',name: 'Серебро сатин',      cat: 'STUDIO',  color: '#cbd5e1',     width: 10, style: 'metallic',          pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_GOLD_S',  name: 'Золото сатин',       cat: 'STUDIO',  color: '#eab308',     width: 10, style: 'metallic',          pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_BLUE_DP', name: 'Синий дип',          cat: 'STUDIO',  color: '#1e3a8a',     width: 15, style: 'flat',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_RED_BR',  name: 'Красный кирпич',    cat: 'STUDIO',  color: '#991b1b',     width: 15, style: 'flat',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_BEIGE',   name: 'Бежевый',            cat: 'STUDIO',  color: '#f5f5dc',      width: 12, style: 'flat',  border: '#d6d3d1', pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_ALU_BLK', name: 'Алюм. черный',       cat: 'STUDIO',  color: '#000',         width: 5,  style: 'metallic',          pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_ALU_SIL', name: 'Алюм. серебро',      cat: 'STUDIO',  color: '#94a3b8',     width: 5,  style: 'metallic',          pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_ALU_GLD', name: 'Алюм. золото',       cat: 'STUDIO',  color: '#ca8a04',     width: 5,  style: 'metallic',          pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_WENGE',   name: 'Венге',               cat: 'STUDIO',  color: '#3f2e26',     width: 14, style: 'wood',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_OAK_L',   name: 'Светлый дуб',        cat: 'STUDIO',  color: '#d4a373',     width: 14, style: 'wood',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'ST_WALNUT',  name: 'Орех',                cat: 'STUDIO',  color: '#5D4037',     width: 14, style: 'wood',              pricePerM: 1200, imageUrl: null, available: true },
    { id: 'CL_GOLD_ORN',name: 'Золото узор',        cat: 'CLASSIC', color: '#d4af37',     width: 40, style: 'ornate_gold',       pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_SILV_ORN',name: 'Серебро узор',       cat: 'CLASSIC', color: '#c0c0c0',     width: 40, style: 'ornate_silver',     pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_MAHOGANY',name: 'Махагон',             cat: 'CLASSIC', color: '#4a0404',     width: 35, style: 'wood_gloss',        pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_VINT_WHT',name: 'Винтаж белый',       cat: 'CLASSIC', color: '#f0f0f0',     width: 30, style: 'shabby',            pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_BRONZE',  name: 'Бронза антик',       cat: 'CLASSIC', color: '#cd7f32',     width: 35, style: 'metallic',          pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_BLK_GLD', name: 'Черный с золотом',   cat: 'CLASSIC', color: '#1a1a1a',     width: 45, style: 'ornate_gold_inner', pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_ITALY_WD',name: 'Итал. орех',         cat: 'CLASSIC', color: '#654321',     width: 50, style: 'wood_carved',       pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_PROVANCE',name: 'Прованс',             cat: 'CLASSIC', color: '#e5e7eb',     width: 25, style: 'shabby',            pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_GOLD_LG', name: 'Золото широкое',     cat: 'CLASSIC', color: '#ffd700',     width: 60, style: 'ornate_gold',       pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_SILV_LG', name: 'Серебро широкое',    cat: 'CLASSIC', color: '#e2e8f0',     width: 60, style: 'ornate_silver',     pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_CHERRY',  name: 'Вишня',               cat: 'CLASSIC', color: '#722F37',     width: 30, style: 'wood',              pricePerM: 1800, imageUrl: null, available: true },
    { id: 'CL_PINE',    name: 'Сосна лак',           cat: 'CLASSIC', color: '#E3C08D',     width: 25, style: 'wood',              pricePerM: 1800, imageUrl: null, available: true }
  ];

  /* ========== УТИЛИТЫ ========== */

  /**
   * buildFrameMap — создаёт хэш-таблицу { id → frame } из массива рам.
   * @param {Array} frames
   * @returns {Object}
   */
  function buildFrameMap(frames) {
    var map = {};
    for (var i = 0; i < frames.length; i++) {
      map[frames[i].id] = frames[i];
    }
    return map;
  }

  /**
   * getFramePrice — стоимость рамы по периметру.
   *
   * Формула: Math.ceil(perimeter_m × effectivePricePerM)
   *   perimeter_m = (w + h) × 2 / 100
   *
   * @param {Object} frame          — объект рамы из каталога
   * @param {number} w              — ширина холста, см
   * @param {number} h              — высота холста, см
   * @param {number} fallbackPerM   — fallback цена за п.м. (по умолчанию 1200)
   * @param {number} classicMult    — множитель CLASSIC (по умолчанию 1.5)
   * @returns {number}
   */
  function getFramePrice(frame, w, h, fallbackPerM, classicMult) {
    if (!frame || frame.id === 'NONE') return 0;
    fallbackPerM = fallbackPerM || 1200;
    classicMult  = classicMult  || 1.5;

    var perimeter = (w + h) * 2 / 100; // метры
    var ppm = (typeof frame.pricePerM === 'number')
      ? frame.pricePerM
      : fallbackPerM * (frame.cat === 'CLASSIC' ? classicMult : 1);

    return Math.ceil(perimeter * ppm);
  }

  /**
   * getFramePreviewCSS — возвращает объект стилей для CSS-рендера рамы на превью.
   *
   * @param {Object} frame — объект рамы
   * @returns {Object} { border, outline, borderImage, borderColor, boxShadow }
   */
  function getFramePreviewCSS(frame) {
    if (!frame || frame.id === 'NONE') {
      return {
        border: 'none',
        outline: 'none',
        borderImage: 'none',
        borderColor: '',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      };
    }

    var bw = Math.max(4, Math.min(frame.width, 20)); // clamp для превью (4–20px)
    var result = {
      border: bw + 'px solid ' + frame.color,
      outline: frame.border ? '1px solid ' + frame.border : 'none',
      borderImage: 'none',
      borderColor: '',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
    };

    if (frame.style === 'ornate_gold') {
      result.borderImage = 'linear-gradient(135deg, #d4af37, #f5e5a0, #c5972c, #f5e5a0, #d4af37) 1';
      result.borderColor = '#d4af37';
    } else if (frame.style === 'ornate_silver') {
      result.borderImage = 'linear-gradient(135deg, #c0c0c0, #f0f0f0, #a0a0a0, #f0f0f0, #c0c0c0) 1';
      result.borderColor = '#c0c0c0';
    } else if (frame.style === 'ornate_gold_inner') {
      result.borderImage = 'linear-gradient(135deg, #1a1a1a, #333, #1a1a1a) 1';
      result.borderColor = '#1a1a1a';
      result.outline = '2px solid #d4af37';
    }

    return result;
  }

  /**
   * fmtPrice — форматирование числа с пробелами-разделителями.
   * @param {number} n
   * @returns {string}
   */
  function fmtPrice(n) {
    var s = String(Math.round(n));
    var result = '';
    for (var i = s.length - 1, c = 0; i >= 0; i--, c++) {
      if (c > 0 && c % 3 === 0) result = ' ' + result;
      result = s[i] + result;
    }
    return result;
  }

  /* ========== ЭКСПОРТ ========== */

  window.MUSE_FRAMES = {
    DEFAULT_FRAMES:     DEFAULT_FRAMES,
    buildFrameMap:      buildFrameMap,
    getFramePrice:      getFramePrice,
    getFramePreviewCSS: getFramePreviewCSS,
    fmtPrice:           fmtPrice
  };

})();
