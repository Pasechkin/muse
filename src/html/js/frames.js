/**
 * frames.js — модуль каталога багетных рам Muse
 *
 * 39 реальных багетов (плоский / студийный / классический)
 * + DOM-рендер текстурных рам (Подход B)
 *
 * Используется в:
 *   - calc.js       (основной калькулятор)
 *   - reproduction-search.js (модальный калькулятор репродукций)
 *
 * Экспорт: window.MUSE_FRAMES
 */
(function () {
  'use strict';

  /* ========== КАТАЛОГ РАМ (39 реальных + «Без багета») ========== */

  var DEFAULT_FRAMES = [
    { id: 'NONE', name: 'Без багета', cat: 'STUDIO', group: 'none', widthMm: 0, width: 0, pricePerM: null, stripUrl: null, cornerUrl: null, imageUrl: null, color: 'transparent', available: true },
    /* ── Плоский (5 шт., 22 мм, 70 р/м) ── */
    { id: '22-19-1', name: '22-19-1', cat: 'FLAT', group: 'плоский', widthMm: 22, width: 18, pricePerM: 70, stripUrl: 'img/bagets/22-19-1/1.webp', cornerUrl: 'img/bagets/22-19-1/2.webp', imageUrl: 'img/bagets/22-19-1/2.webp', color: '#C4A87C', available: true },
    { id: '22-19-2', name: '22-19-2', cat: 'FLAT', group: 'плоский', widthMm: 22, width: 18, pricePerM: 70, stripUrl: 'img/bagets/22-19-2/1.webp', cornerUrl: 'img/bagets/22-19-2/2.webp', imageUrl: 'img/bagets/22-19-2/2.webp', color: '#C4A87C', available: true },
    { id: '22-19-3', name: '22-19-3', cat: 'FLAT', group: 'плоский', widthMm: 22, width: 18, pricePerM: 70, stripUrl: 'img/bagets/22-19-3/1.webp', cornerUrl: 'img/bagets/22-19-3/2.webp', imageUrl: 'img/bagets/22-19-3/2.webp', color: '#C4A87C', available: true },
    { id: '22-19-4', name: '22-19-4', cat: 'FLAT', group: 'плоский', widthMm: 22, width: 18, pricePerM: 70, stripUrl: 'img/bagets/22-19-4/1.webp', cornerUrl: 'img/bagets/22-19-4/2.webp', imageUrl: 'img/bagets/22-19-4/2.webp', color: '#C4A87C', available: true },
    { id: '22-19-5', name: '22-19-5', cat: 'FLAT', group: 'плоский', widthMm: 22, width: 18, pricePerM: 70, stripUrl: 'img/bagets/22-19-5/1.webp', cornerUrl: 'img/bagets/22-19-5/2.webp', imageUrl: 'img/bagets/22-19-5/2.webp', color: '#C4A87C', available: true },
    /* ── Студийный (8 шт., 25 мм, 205 р/м) ── */
    { id: '25-981-01', name: '25-981-01', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-01/1.webp', cornerUrl: 'img/bagets/25-981-01/2.webp', imageUrl: 'img/bagets/25-981-01/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-02', name: '25-981-02', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-02/1.webp', cornerUrl: 'img/bagets/25-981-02/2.webp', imageUrl: 'img/bagets/25-981-02/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-07', name: '25-981-07', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-07/1.webp', cornerUrl: 'img/bagets/25-981-07/2.webp', imageUrl: 'img/bagets/25-981-07/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-08', name: '25-981-08', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-08/1.webp', cornerUrl: 'img/bagets/25-981-08/2.webp', imageUrl: 'img/bagets/25-981-08/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-09', name: '25-981-09', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-09/1.webp', cornerUrl: 'img/bagets/25-981-09/2.webp', imageUrl: 'img/bagets/25-981-09/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-10', name: '25-981-10', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-10/1.webp', cornerUrl: 'img/bagets/25-981-10/2.webp', imageUrl: 'img/bagets/25-981-10/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-11', name: '25-981-11', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-11/1.webp', cornerUrl: 'img/bagets/25-981-11/2.webp', imageUrl: 'img/bagets/25-981-11/2.webp', color: '#4A4A4A', available: true },
    { id: '25-981-12', name: '25-981-12', cat: 'STUDIO', group: 'студийный', widthMm: 25, width: 20, pricePerM: 205, stripUrl: 'img/bagets/25-981-12/1.webp', cornerUrl: 'img/bagets/25-981-12/2.webp', imageUrl: 'img/bagets/25-981-12/2.webp', color: '#4A4A4A', available: true },
    /* ── Классический (26 шт., 33–60 мм, 115–195 р/м) ── */
    { id: '33-24-1', name: '33-24-1', cat: 'CLASSIC', group: 'классический', widthMm: 33, width: 26, pricePerM: 115, stripUrl: 'img/bagets/33-24-1/1.webp', cornerUrl: 'img/bagets/33-24-1/2.webp', imageUrl: 'img/bagets/33-24-1/2.webp', color: '#8B7355', available: true },
    { id: '33-24-2', name: '33-24-2', cat: 'CLASSIC', group: 'классический', widthMm: 33, width: 26, pricePerM: 115, stripUrl: 'img/bagets/33-24-2/1.webp', cornerUrl: 'img/bagets/33-24-2/2.webp', imageUrl: 'img/bagets/33-24-2/2.webp', color: '#8B7355', available: true },
    { id: '33-24-3', name: '33-24-3', cat: 'CLASSIC', group: 'классический', widthMm: 33, width: 26, pricePerM: 115, stripUrl: 'img/bagets/33-24-3/1.webp', cornerUrl: 'img/bagets/33-24-3/2.webp', imageUrl: 'img/bagets/33-24-3/2.webp', color: '#8B7355', available: true },
    { id: '33-24-4', name: '33-24-4', cat: 'CLASSIC', group: 'классический', widthMm: 33, width: 26, pricePerM: 115, stripUrl: 'img/bagets/33-24-4/1.webp', cornerUrl: 'img/bagets/33-24-4/2.webp', imageUrl: 'img/bagets/33-24-4/2.webp', color: '#8B7355', available: true },
    { id: '33-24-5', name: '33-24-5', cat: 'CLASSIC', group: 'классический', widthMm: 33, width: 26, pricePerM: 115, stripUrl: 'img/bagets/33-24-5/1.webp', cornerUrl: 'img/bagets/33-24-5/2.webp', imageUrl: 'img/bagets/33-24-5/2.webp', color: '#8B7355', available: true },
    { id: '39-22-1', name: '39-22-1', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-1/1.webp', cornerUrl: 'img/bagets/39-22-1/2.webp', imageUrl: 'img/bagets/39-22-1/2.webp', color: '#8B7355', available: true },
    { id: '39-22-10', name: '39-22-10', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-10/1.webp', cornerUrl: 'img/bagets/39-22-10/2.webp', imageUrl: 'img/bagets/39-22-10/2.webp', color: '#8B7355', available: true },
    { id: '39-22-15', name: '39-22-15', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-15/1.webp', cornerUrl: 'img/bagets/39-22-15/2.webp', imageUrl: 'img/bagets/39-22-15/2.webp', color: '#8B7355', available: true },
    { id: '39-22-16', name: '39-22-16', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-16/1.webp', cornerUrl: 'img/bagets/39-22-16/2.webp', imageUrl: 'img/bagets/39-22-16/2.webp', color: '#8B7355', available: true },
    { id: '39-22-2', name: '39-22-2', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-2/1.webp', cornerUrl: 'img/bagets/39-22-2/2.webp', imageUrl: 'img/bagets/39-22-2/2.webp', color: '#8B7355', available: true },
    { id: '39-22-4', name: '39-22-4', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 135, stripUrl: 'img/bagets/39-22-4/1.webp', cornerUrl: 'img/bagets/39-22-4/2.webp', imageUrl: 'img/bagets/39-22-4/2.webp', color: '#8B7355', available: true },
    { id: '39-22-6', name: '39-22-6', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 140, stripUrl: 'img/bagets/39-22-6/1.webp', cornerUrl: 'img/bagets/39-22-6/2.webp', imageUrl: 'img/bagets/39-22-6/2.webp', color: '#8B7355', available: true },
    { id: '39-22-7', name: '39-22-7', cat: 'CLASSIC', group: 'классический', widthMm: 39, width: 31, pricePerM: 140, stripUrl: 'img/bagets/39-22-7/1.webp', cornerUrl: 'img/bagets/39-22-7/2.webp', imageUrl: 'img/bagets/39-22-7/2.webp', color: '#8B7355', available: true },
    { id: '44-21-1', name: '44-21-1', cat: 'CLASSIC', group: 'классический', widthMm: 44, width: 35, pricePerM: 138, stripUrl: 'img/bagets/44-21-1/1.webp', cornerUrl: 'img/bagets/44-21-1/2.webp', imageUrl: 'img/bagets/44-21-1/2.webp', color: '#8B7355', available: true },
    { id: '44-21-2', name: '44-21-2', cat: 'CLASSIC', group: 'классический', widthMm: 44, width: 35, pricePerM: 138, stripUrl: 'img/bagets/44-21-2/1.webp', cornerUrl: 'img/bagets/44-21-2/2.webp', imageUrl: 'img/bagets/44-21-2/2.webp', color: '#8B7355', available: true },
    { id: '44-21-3', name: '44-21-3', cat: 'CLASSIC', group: 'классический', widthMm: 44, width: 35, pricePerM: 138, stripUrl: 'img/bagets/44-21-3/1.webp', cornerUrl: 'img/bagets/44-21-3/2.webp', imageUrl: 'img/bagets/44-21-3/2.webp', color: '#8B7355', available: true },
    { id: '44-21-4', name: '44-21-4', cat: 'CLASSIC', group: 'классический', widthMm: 44, width: 35, pricePerM: 138, stripUrl: 'img/bagets/44-21-4/1.webp', cornerUrl: 'img/bagets/44-21-4/2.webp', imageUrl: 'img/bagets/44-21-4/2.webp', color: '#8B7355', available: true },
    { id: '45-35-1', name: '45-35-1', cat: 'CLASSIC', group: 'классический', widthMm: 45, width: 36, pricePerM: 158, stripUrl: 'img/bagets/45-35-1/1.webp', cornerUrl: 'img/bagets/45-35-1/2.webp', imageUrl: 'img/bagets/45-35-1/2.webp', color: '#8B7355', available: true },
    { id: '45-35-2', name: '45-35-2', cat: 'CLASSIC', group: 'классический', widthMm: 45, width: 36, pricePerM: 158, stripUrl: 'img/bagets/45-35-2/1.webp', cornerUrl: 'img/bagets/45-35-2/2.webp', imageUrl: 'img/bagets/45-35-2/2.webp', color: '#8B7355', available: true },
    { id: '45-35-6', name: '45-35-6', cat: 'CLASSIC', group: 'классический', widthMm: 45, width: 36, pricePerM: 158, stripUrl: 'img/bagets/45-35-6/1.webp', cornerUrl: 'img/bagets/45-35-6/2.webp', imageUrl: 'img/bagets/45-35-6/2.webp', color: '#8B7355', available: true },
    { id: '47-26-1', name: '47-26-1', cat: 'CLASSIC', group: 'классический', widthMm: 47, width: 38, pricePerM: 165, stripUrl: 'img/bagets/47-26-1/1.webp', cornerUrl: 'img/bagets/47-26-1/2.webp', imageUrl: 'img/bagets/47-26-1/2.webp', color: '#8B7355', available: true },
    { id: '47-26-2', name: '47-26-2', cat: 'CLASSIC', group: 'классический', widthMm: 47, width: 38, pricePerM: 165, stripUrl: 'img/bagets/47-26-2/1.webp', cornerUrl: 'img/bagets/47-26-2/2.webp', imageUrl: 'img/bagets/47-26-2/2.webp', color: '#8B7355', available: true },
    { id: '47-26-3', name: '47-26-3', cat: 'CLASSIC', group: 'классический', widthMm: 47, width: 38, pricePerM: 165, stripUrl: 'img/bagets/47-26-3/1.webp', cornerUrl: 'img/bagets/47-26-3/2.webp', imageUrl: 'img/bagets/47-26-3/2.webp', color: '#8B7355', available: true },
    { id: '47-26-30', name: '47-26-30', cat: 'CLASSIC', group: 'классический', widthMm: 47, width: 38, pricePerM: 158, stripUrl: 'img/bagets/47-26-30/1.webp', cornerUrl: 'img/bagets/47-26-30/2.webp', imageUrl: 'img/bagets/47-26-30/2.webp', color: '#8B7355', available: true },
    { id: '50-26-1', name: '50-26-1', cat: 'CLASSIC', group: 'классический', widthMm: 50, width: 40, pricePerM: 195, stripUrl: 'img/bagets/50-26-1/1.webp', cornerUrl: 'img/bagets/50-26-1/2.webp', imageUrl: 'img/bagets/50-26-1/2.webp', color: '#8B7355', available: true },
    { id: '60-35-10', name: '60-35-10', cat: 'CLASSIC', group: 'классический', widthMm: 60, width: 48, pricePerM: 158, stripUrl: 'img/bagets/60-35-10/1.webp', cornerUrl: 'img/bagets/60-35-10/2.webp', imageUrl: 'img/bagets/60-35-10/2.webp', color: '#8B7355', available: true }
  ];

  /* ========== УТИЛИТЫ ========== */

  function buildFrameMap(frames) {
    var map = {};
    for (var i = 0; i < frames.length; i++) {
      map[frames[i].id] = frames[i];
    }
    return map;
  }

  /**
   * getFramePrice — стоимость рамы.
   * Формула: Math.round(0.18 × (w + h) × pricePerM)
   */
  function getFramePrice(frame, w, h) {
    if (!frame || frame.id === 'NONE' || typeof frame.pricePerM !== 'number') return 0;
    return Math.round(0.18 * (w + h) * frame.pricePerM);
  }

  /**
   * getFramePreviewCSS — CSS-стили для превью рамы (backward compat).
   * Используется в reproduction-search.js и как fallback.
   */
  function getFramePreviewCSS(frame) {
    if (!frame || frame.id === 'NONE') {
      return { border: 'none', outline: 'none', borderImage: 'none', borderColor: '', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' };
    }
    var bw = Math.max(4, Math.min(frame.width || 12, 20));
    return {
      border: bw + 'px solid ' + (frame.color || '#8B7355'),
      outline: 'none',
      borderImage: 'none',
      borderColor: '',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
    };
  }

  function fmtPrice(n) {
    var s = String(Math.round(n));
    var result = '';
    for (var i = s.length - 1, c = 0; i >= 0; i--, c++) {
      if (c > 0 && c % 3 === 0) result = ' ' + result;
      result = s[i] + result;
    }
    return result;
  }

  /* ========== STRIP ROTATION & DOM RENDER (Подход B) ========== */

  var _stripCache = {};
  var _objectUrls = [];

  /** Offscreen canvas with img rotated/flipped — async via toBlob + ObjectURL */
  function _makeRotated(img, angleDeg, flipX, cb) {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var sw = img.naturalWidth, sh = img.naturalHeight;
    if (angleDeg === -90 || angleDeg === 90) {
      c.width = sh; c.height = sw;
    } else {
      c.width = sw; c.height = sh;
    }
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    if (flipX) ctx.scale(-1, 1);
    ctx.rotate(angleDeg * Math.PI / 180);
    ctx.drawImage(img, -sw / 2, -sh / 2);
    ctx.restore();
    c.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      _objectUrls.push(url);
      cb(url);
    }, 'image/jpeg', 0.85);
  }

  /**
   * getStrips — загружает полоску, создаёт 4 повёрнутых ObjectURL (с кешем).
   * @param {Object} frame
   * @param {Function} cb — callback(strips | null)
   */
  function getStrips(frame, cb) {
    if (!frame || !frame.stripUrl) { cb(null); return; }
    if (_stripCache[frame.id]) { cb(_stripCache[frame.id]); return; }
    var img = new Image();
    img.onload = function () {
      var done = 0;
      var strips = {};
      function onPart(key, url) {
        strips[key] = url;
        if (++done === 4) {
          _stripCache[frame.id] = strips;
          cb(strips);
        }
      }
      _makeRotated(img, 90,  false, function (u) { onPart('topUrl', u); });
      _makeRotated(img, -90, false, function (u) { onPart('bottomUrl', u); });
      _makeRotated(img, 0,   false, function (u) { onPart('leftUrl', u); });
      _makeRotated(img, 0,   true,  function (u) { onPart('rightUrl', u); });
    };
    img.onerror = function () { cb(null); };
    img.src = frame.stripUrl;
  }

  /**
   * renderFrameDOM — отрисовка текстурной рамы (подход B: DOM-композиция).
   * Строит внутри container: фото + 4 стороны (tiled strip) + 4 угла (corner img).
   */
  function renderFrameDOM(container, frame, strips, photoUrl, photoW, photoH, fw) {
    if (!fw) fw = Math.max(4, Math.round((frame.widthMm || 20) * 0.8));
    container.innerHTML = '';
    /* Reset ALL inline styles to avoid leftover border/width from previous call */
    container.style.cssText = 'position:relative;overflow:hidden;'
      + 'width:' + (photoW + fw * 2) + 'px;'
      + 'height:' + (photoH + fw * 2) + 'px;'
      + 'flex-shrink:0;'
      + 'box-shadow:0 8px 30px rgba(0,0,0,0.15);';

    /* Photo */
    var photo = document.createElement('div');
    photo.style.cssText = 'position:absolute;z-index:0;left:' + fw + 'px;top:' + fw + 'px;'
      + 'width:' + photoW + 'px;height:' + photoH + 'px;'
      + 'background:url("' + photoUrl + '") center/cover;';
    container.appendChild(photo);

    if (!strips) {
      /* Fallback: solid CSS border */
      container.style.cssText = 'position:relative;overflow:hidden;'
        + 'box-sizing:content-box;'
        + 'width:' + photoW + 'px;'
        + 'height:' + photoH + 'px;'
        + 'border:' + fw + 'px solid ' + (frame.color || '#8B7355') + ';'
        + 'flex-shrink:0;'
        + 'box-shadow:0 8px 30px rgba(0,0,0,0.15);';
      photo.style.left = '0'; photo.style.top = '0';
      return;
    }

    /* 4 Sides */
    var sides = [
      'position:absolute;z-index:1;top:0;left:' + fw + 'px;width:' + photoW + 'px;height:' + fw + 'px;background:url(' + strips.topUrl + ') repeat-x left top;background-size:auto ' + fw + 'px;',
      'position:absolute;z-index:1;bottom:0;left:' + fw + 'px;width:' + photoW + 'px;height:' + fw + 'px;background:url(' + strips.bottomUrl + ') repeat-x left top;background-size:auto ' + fw + 'px;',
      'position:absolute;z-index:1;top:' + fw + 'px;left:0;width:' + fw + 'px;height:' + photoH + 'px;background:url(' + strips.leftUrl + ') repeat-y left top;background-size:' + fw + 'px auto;',
      'position:absolute;z-index:1;top:' + fw + 'px;right:0;width:' + fw + 'px;height:' + photoH + 'px;background:url(' + strips.rightUrl + ') repeat-y left top;background-size:' + fw + 'px auto;'
    ];
    sides.forEach(function (css) {
      var d = document.createElement('div');
      d.style.cssText = css;
      container.appendChild(d);
    });

    /* 4 Corners */
    var corners = [
      { top: '0', left: '0', transform: 'none' },
      { top: '0', right: '0', transform: 'scaleX(-1)' },
      { bottom: '0', left: '0', transform: 'scaleY(-1)' },
      { bottom: '0', right: '0', transform: 'scale(-1,-1)' }
    ];
    corners.forEach(function (c) {
      var d = document.createElement('div');
      d.style.position = 'absolute';
      d.style.width = fw + 'px';
      d.style.height = fw + 'px';
      d.style.zIndex = '3';
      d.style.overflow = 'hidden';
      if (c.top !== undefined) d.style.top = c.top;
      if (c.bottom !== undefined) d.style.bottom = c.bottom;
      if (c.left !== undefined) d.style.left = c.left;
      if (c.right !== undefined) d.style.right = c.right;
      d.style.transform = c.transform;
      var img = document.createElement('img');
      img.src = frame.cornerUrl;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.cssText = 'width:100%;height:100%;display:block;';
      d.appendChild(img);
      container.appendChild(d);
    });
  }

  /* ========== ЭКСПОРТ ========== */

  /** Revoke all created ObjectURLs (call on modal close) */
  function revokeAll() {
    _objectUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    _objectUrls.length = 0;
    _stripCache = {};
  }

  window.MUSE_FRAMES = {
    DEFAULT_FRAMES:     DEFAULT_FRAMES,
    buildFrameMap:      buildFrameMap,
    getFramePrice:      getFramePrice,
    getFramePreviewCSS: getFramePreviewCSS,
    fmtPrice:           fmtPrice,
    getStrips:          getStrips,
    renderFrameDOM:     renderFrameDOM,
    revokeAll:          revokeAll
  };

})();
