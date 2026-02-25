/**
 * reproduction-search.js
 * Мультимузейный поиск репродукций (Met Museum, AIC, Cleveland, Rijksmuseum, Wikidata)
 * Модальный калькулятор с каталогом рам из frames.js
 */
(function () {
  'use strict';

  /* ── Константы ─────────────────────────────── */
  var BATCH = 8; /* результатов на один источник за раз */

  /* Rijksmuseum API-ключ (бесплатный, публичный, для учёта) */
  /* ЗАМЕНИТЕ НА СВОЙ: зарегистрируйтесь на data.rijksmuseum.nl */
  /* Rijksmuseum: новый API data.rijksmuseum.nl — ключ не нужен */

  /* Названия источников для бейджей */
  var SOURCE_LABELS = {
    met:   'Met Museum',
    aic:   'Art Institute',
    cleve: 'Cleveland Museum',
    rijks: 'Rijksmuseum',
    wiki:  'Wikidata'
  };

  /* Словарь перевода русских запросов → английские (для Met/AIC/Cleveland/Rijks) */
  var TRANSLATE_MAP = {
    'винсент ван гог':    'Vincent van Gogh',
    'ван гог':            'Van Gogh',
    'клод моне':          'Claude Monet',
    'моне':               'Monet',
    'рембрандт':          'Rembrandt',
    'боттичелли':         'Botticelli',
    'девятый вал':        'Aivazovsky ninth wave',
    'поцелуй климт':      'Gustav Klimt kiss',
    'климт':              'Gustav Klimt',
    'леонардо да винчи':  'Leonardo da Vinci',
    'да винчи':           'Leonardo da Vinci',
    'рафаэль':            'Raphael',
    'караваджо':          'Caravaggio',
    'вермеер':            'Vermeer',
    'дега':               'Degas',
    'ренуар':             'Renoir',
    'сезанн':             'Cezanne',
    'пикассо':            'Picasso',
    'дали':               'Salvador Dali',
    'мунк':               'Edvard Munch',
    'шишкин':             'Shishkin',
    'айвазовский':        'Aivazovsky',
    'левитан':            'Levitan',
    'репин':              'Repin',
    'брюллов':            'Bryullov',
    'кандинский':         'Kandinsky',
    'малевич':            'Malevich',
    'врубель':            'Vrubel',
    'тициан':             'Titian',
    'рубенс':             'Rubens',
    'гоген':              'Gauguin',
    'мане':               'Manet',
    'тёрнер':             'Turner',
    'констебль':          'Constable',
    'эль греко':          'El Greco',
    'веласкес':           'Velazquez',
    'гойя':               'Goya',
    'курбе':              'Courbet',
    'вермеер':            'Vermeer',
    'босх':               'Hieronymus Bosch',
    'микеланджело':       'Michelangelo',
    'матисс':             'Matisse'
  };

  /** Перевести русский запрос в английский (для Met/AIC/Cleveland/Rijks) */
  function translateTerm(term) {
    var low = term.toLowerCase().trim();
    if (TRANSLATE_MAP[low]) return TRANSLATE_MAP[low];
    /* Если кириллица есть, но нет в словаре — возвращаем как есть */
    return term;
  }

  var POPULAR_TAGS = [
    'Винсент Ван Гог',
    'Девятый вал',
    'Клод Моне',
    'Поцелуй Климт',
    'Рембрандт',
    'Боттичелли'
  ];

  /* Размеры (длинная сторона) */
  var LONG_SIDES = [
    { id: 's',  label: '40 см',  value: 40 },
    { id: 'm',  label: '60 см',  value: 60 },
    { id: 'l',  label: '80 см',  value: 80 },
    { id: 'xl', label: '100 см', value: 100 }
  ];

  /* Покрытие лаком — boolean (on/off), как в foto-na-kholste */

  /* Ценовые коэффициенты — динамически из prices.js с fallback */
  function P(key, fallback) {
    var mp = window.MUSE_PRICES;
    return (mp && mp.canvas && typeof mp.canvas[key] === 'number') ? mp.canvas[key] : fallback;
  }

  /* Подрамники: id → { label, priceKey, fallback } */
  var STRETCHER_TYPES = [
    { id: 'STANDARD', label: 'Стандартный', priceKey: 'stretcherStandard', fallback: 32 },
    { id: 'GALLERY',  label: 'Толстый',      priceKey: 'stretcherGallery',  fallback: 68 },
    { id: 'NO_FRAME', label: 'Рулон',        priceKey: 'stretcherRoll',     fallback: 32 }
  ];

  /* Кэш запросов (TTL 5 мин) */
  var CACHE_TTL = 5 * 60 * 1000;
  var _cache = {};

  /* ── Состояние поиска ──────────────────────── */
  var searchTerm = '';
  var results    = [];
  var isSearching   = false;
  var isLoadingMore = false;
  var hasSearched   = false;
  var columnCount   = 3;
  var _cardIndex    = 0;

  /* Per-provider state */
  var _met   = { ids: [], offset: 0, hasMore: true };
  var _aic   = { page: 1, hasMore: true };
  var _cleve = { page: 0, hasMore: true };
  var _rijks = { buffer: [], nextUrl: '', hasMore: true, ok: true };
  var _wiki  = { offset: 0, hasMore: true };
  var searchTermEn = ''; /* английский вариант запроса для внешних API */

  /* ── Состояние модала ──────────────────────── */
  var currentPainting    = null;
  var currentLongSide    = 60; // текущая длинная сторона (число)
  var currentSize        = LONG_SIDES[1]; // для обр. совместимости
  var currentStretcher   = STRETCHER_TYPES[0]; // Стандартный
  var currentFrame       = null;
  var currentVarnish     = true; // boolean on/off, как в foto-na-kholste
  var currentAspectRatio = null;
  var isOrdered          = false;
  var FRAMES_DB          = [];
  var _frameMap          = {};

  /* ── Утилиты ───────────────────────────────── */
  function getEl(id) { return document.getElementById(id); }

  function escapeForSparql(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function fmtPrice(n) {
    if (window.MUSE_FRAMES && window.MUSE_FRAMES.fmtPrice) return window.MUSE_FRAMES.fmtPrice(n);
    var s = String(Math.round(n));
    var r = '';
    for (var i = s.length - 1, c = 0; i >= 0; i--, c++) {
      if (c > 0 && c % 3 === 0) r = ' ' + r;
      r = s[i] + r;
    }
    return r;
  }

  /* ── Инициализация каталога рам ────────────── */
  function initFramesCatalog() {
    var MF = window.MUSE_FRAMES;
    if (MF && MF.DEFAULT_FRAMES) {
      FRAMES_DB = MF.DEFAULT_FRAMES.filter(function (f) { return f.available !== false; });
      _frameMap = MF.buildFrameMap ? MF.buildFrameMap(FRAMES_DB) : {};
    }
    currentFrame = _frameMap['NONE'] || FRAMES_DB[0] || { id: 'NONE', name: 'Без багета', pricePerM: null, width: 0, color: 'transparent', style: 'flat' };
  }

  /* ── Вычисление цен ────────────────────────── */

  /** Цена печати + подрамник (с учётом выбранного подрамника) */
  function calcCanvasPrice(w, h) {
    var S = w * h;
    var perim = (w + h) * 2;
    var stretcherPrice = P(currentStretcher.priceKey, currentStretcher.fallback);
    return Math.ceil(
      P('printSqCoeff', 0.29) * S +
      P('printPStrCoeff', 0.04) * perim * stretcherPrice +
      P('printPBaseCoeff', 0.76) * perim +
      P('printConst', 1998.48)
    );
  }

  /** Цена лака: S × коэфф */
  function calcVarnishPrice(w, h) {
    return Math.ceil(w * h * P('varnishCoeff', 0.10));
  }

  /** Цена рамы по периметру */
  function calcFramePrice(frame, w, h) {
    var fpm = P('framePerM', 1200);
    var fcm = P('frameClassicMult', 1.5);
    if (window.MUSE_FRAMES && window.MUSE_FRAMES.getFramePrice) {
      return window.MUSE_FRAMES.getFramePrice(frame, w, h, fpm, fcm);
    }
    if (!frame || frame.id === 'NONE') return 0;
    var perimeter = (w + h) * 2 / 100;
    var ppm = (typeof frame.pricePerM === 'number') ? frame.pricePerM : fpm * (frame.cat === 'CLASSIC' ? fcm : 1);
    return Math.ceil(perimeter * ppm);
  }

  /** Получить w и h из longSide + aspectRatio */
  function getDimensions(longSide) {
    if (!currentAspectRatio) return { w: longSide, h: longSide };
    var w, h;
    if (currentAspectRatio >= 1) {
      w = longSide;
      h = Math.round(longSide / currentAspectRatio);
    } else {
      h = longSide;
      w = Math.round(longSide * currentAspectRatio);
    }
    return { w: w, h: h };
  }

  /** Общая сумма */
  function calcTotal() {
    var dim = getDimensions(currentLongSide);
    var canvas  = calcCanvasPrice(dim.w, dim.h);
    var frame   = calcFramePrice(currentFrame, dim.w, dim.h);
    var varnish = currentVarnish ? calcVarnishPrice(dim.w, dim.h) : 0;
    return { canvas: canvas, frame: frame, varnish: varnish, total: canvas + frame + varnish, w: dim.w, h: dim.h, stretcher: currentStretcher.label };
  }

  /* ── Адаптивные колонки ────────────────────── */
  function updateColumns() {
    var w = window.innerWidth;
    if (w >= 1280)     columnCount = 4;
    else if (w >= 1024) columnCount = 3;
    else if (w >= 640)  columnCount = 2;
    else                columnCount = 1;
  }

  /** Адаптивная ширина thumbnail: 400px для ≥2 колонок, 600px для 1 колонки */
  function getThumbWidth() {
    return columnCount <= 1 ? 600 : 400;
  }

  /** Есть ли ещё результаты хотя бы в одном источнике? */
  function anyHasMore() {
    return _met.hasMore || _aic.hasMore || _cleve.hasMore || (_rijks.ok && _rijks.hasMore) || _wiki.hasMore;
  }

  /* ══════════════════════════════════════════════ */
  /*         ПРОВАЙДЕРЫ МУЗЕЙНЫХ API               */
  /* ══════════════════════════════════════════════ */

  /** Утилита: fetch с таймаутом */
  function fetchWithTimeout(url, opts, ms) {
    if (typeof AbortController !== 'undefined') {
      var ctrl = new AbortController();
      opts = opts || {};
      opts.signal = ctrl.signal;
      var timer = setTimeout(function () { ctrl.abort(); }, ms);
      return fetch(url, opts).then(function (r) { clearTimeout(timer); return r; })
        .catch(function (e) { clearTimeout(timer); throw e; });
    }
    return fetch(url, opts);
  }

  /* ─── Met Museum ─────────────────────────────── */

  /** Шаг 1: поиск → массив objectIDs (кэшируется) */
  function metSearch(term) {
    var ck = 'met|' + term;
    if (_cache[ck] && (Date.now() - _cache[ck].ts < CACHE_TTL)) {
      _met.ids = _cache[ck].data;
      _met.offset = 0;
      _met.hasMore = _met.ids.length > 0;
      return Promise.resolve();
    }
    var url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&medium=Paintings&q='
      + encodeURIComponent(term);
    return fetchWithTimeout(url, {}, 8000)
      .then(function (r) { return r.ok ? r.json() : { objectIDs: null }; })
      .then(function (d) {
        _met.ids = (d.objectIDs || []).slice(0, 200); /* ограничиваем */
        _met.offset = 0;
        _met.hasMore = _met.ids.length > 0;
        _cache[ck] = { data: _met.ids, ts: Date.now() };
      })
      .catch(function () { _met.ids = []; _met.hasMore = false; });
  }

  /** Шаг 2: загрузить следующий batch деталей */
  function metLoadBatch(count) {
    var slice = _met.ids.slice(_met.offset, _met.offset + count);
    if (slice.length === 0) { _met.hasMore = false; return Promise.resolve([]); }
    _met.offset += slice.length;
    if (_met.offset >= _met.ids.length) _met.hasMore = false;

    var promises = slice.map(function (id) {
      return fetchWithTimeout(
        'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + id, {}, 6000
      )
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    });
    return Promise.all(promises).then(function (items) {
      var out = [];
      for (var i = 0; i < items.length; i++) {
        var o = items[i];
        if (!o || !o.primaryImageSmall) continue;
        out.push({
          id:         'met-' + o.objectID,
          title:      o.title || 'Untitled',
          artist:     o.artistDisplayName || 'Unknown artist',
          imageUrl:   o.primaryImageSmall,
          source:     'met',
          dimensions: o.dimensions || ''
        });
      }
      return out;
    });
  }

  /* ─── Art Institute of Chicago ──────────────── */

  function aicSearch(term, count) {
    var ck = 'aic|' + term + '|' + _aic.page;
    if (_cache[ck] && (Date.now() - _cache[ck].ts < CACHE_TTL)) {
      return Promise.resolve(_cache[ck].data);
    }
    var url = 'https://api.artic.edu/api/v1/artworks/search?q='
      + encodeURIComponent(term)
      + '&query%5Bbool%5D%5Bmust%5D%5B%5D%5Bterm%5D%5Bartwork_type_id%5D=1'
      + '&query%5Bbool%5D%5Bmust%5D%5B%5D%5Bterm%5D%5Bis_public_domain%5D=true'
      + '&fields=id,title,artist_display,image_id,dimensions,date_display'
      + '&limit=' + count + '&page=' + _aic.page;
    return fetchWithTimeout(url, {}, 8000)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.data) { _aic.hasMore = false; return []; }
        var pag = d.pagination || {};
        if (_aic.page >= (pag.total_pages || 1)) _aic.hasMore = false;
        _aic.page++;
        var iiif = (d.config && d.config.iiif_url) || 'https://www.artic.edu/iiif/2';
        var out = [];
        for (var i = 0; i < d.data.length; i++) {
          var a = d.data[i];
          if (!a.image_id) continue;
          out.push({
            id:         'aic-' + a.id,
            title:      a.title || 'Untitled',
            artist:     a.artist_display || 'Unknown artist',
            imageUrl:   iiif + '/' + a.image_id + '/full/843,/0/default.jpg',
            source:     'aic',
            dimensions: a.dimensions || ''
          });
        }
        _cache[ck] = { data: out, ts: Date.now() };
        return out;
      })
      .catch(function () { _aic.hasMore = false; return []; });
  }

  /* ─── Rijksmuseum (новый API data.rijksmuseum.nl, без ключа) ── */

  /**
   * Получаем Dublin Core детали одного объекта.
   * Возвращает {id, title, artist, imageUrl, source, dimensions} или null.
   */
  function rijksFetchDetail(numId) {
    return fetchWithTimeout(
      'https://data.rijksmuseum.nl/' + numId + '?_profile=dc', {}, 8000
    )
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (dc) {
      var imgUrl = '';
      if (dc.relation && dc.relation['@id']) {
        imgUrl = dc.relation['@id']
          .replace('/full/max/', '/full/600,/')
          .replace('/full/!800,800/', '/full/600,/');
      }
      if (!imgUrl) return null;
      var artist = '';
      if (dc.creator) {
        artist = dc.creator.title || dc.creator['@id'] || '';
      }
      return {
        id:         'rijks-' + numId,
        title:      dc.title || 'Untitled',
        artist:     artist || 'Unknown artist',
        imageUrl:   imgUrl,
        source:     'rijks',
        dimensions: ''
      };
    })
    .catch(function () { return null; });
  }

  function rijksSearch(term, count) {
    if (!_rijks.ok) return Promise.resolve([]);

    /* Если в буфере есть ранее загруженные ID — берём оттуда */
    if (_rijks.buffer.length > 0) {
      var batch = _rijks.buffer.splice(0, count);
      return Promise.allSettled(
        batch.map(function (numId) { return rijksFetchDetail(numId); })
      ).then(function (res) {
        var out = [];
        for (var i = 0; i < res.length; i++) {
          if (res[i].status === 'fulfilled' && res[i].value) out.push(res[i].value);
        }
        return out;
      });
    }

    /* Иначе — делаем поисковый запрос */
    var url = _rijks.nextUrl
      || ('https://data.rijksmuseum.nl/search/collection'
        + '?type=painting&imageAvailable=true'
        + '&description=' + encodeURIComponent(term));

    return fetchWithTimeout(url, {}, 8000)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (data) {
        var items = data.orderedItems || [];
        /* Пагинация: next.id содержит полный URL следующей страницы */
        if (data.next && data.next.id) {
          _rijks.nextUrl = data.next.id;
        } else {
          _rijks.nextUrl = '';
          if (items.length === 0) _rijks.hasMore = false;
        }
        /* Извлекаем числовые ID из https://id.rijksmuseum.nl/{num} */
        var allIds = [];
        for (var i = 0; i < items.length; i++) {
          var m = items[i].id.match(/(\d+)$/);
          if (m) allIds.push(m[1]);
        }
        /* Берём count, остальные — в буфер */
        var batchIds = allIds.splice(0, count);
        _rijks.buffer = allIds;
        if (batchIds.length === 0 && !_rijks.nextUrl) {
          _rijks.hasMore = false;
          return [];
        }
        /* Загружаем DC-детали параллельно */
        return Promise.allSettled(
          batchIds.map(function (numId) { return rijksFetchDetail(numId); })
        ).then(function (res) {
          var out = [];
          for (var j = 0; j < res.length; j++) {
            if (res[j].status === 'fulfilled' && res[j].value) out.push(res[j].value);
          }
          return out;
        });
      })
      .catch(function () {
        _rijks.ok = false;
        _rijks.hasMore = false;
        return [];
      });
  }

  /* ─── Cleveland Museum of Art ──────────────── */

  function cleveSearch(term, count) {
    var ck = 'cleve|' + term + '|' + _cleve.page;
    if (_cache[ck] && (Date.now() - _cache[ck].ts < CACHE_TTL)) {
      return Promise.resolve(_cache[ck].data);
    }
    var url = 'https://openaccess-api.clevelandart.org/api/artworks/?q='
      + encodeURIComponent(term)
      + '&limit=' + count + '&skip=' + (_cleve.page * count)
      + '&has_image=1&type=Painting';
    return fetchWithTimeout(url, {}, 8000)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.data) { _cleve.hasMore = false; return []; }
        if (d.data.length < count) _cleve.hasMore = false;
        _cleve.page++;
        var out = [];
        for (var i = 0; i < d.data.length; i++) {
          var a = d.data[i];
          if (!a.images || !a.images.web || !a.images.web.url) continue;
          out.push({
            id:         'cleve-' + a.id,
            title:      a.title || 'Untitled',
            artist:     (a.creators && a.creators[0] && a.creators[0].description) || 'Unknown artist',
            imageUrl:   a.images.web.url,
            source:     'cleve',
            dimensions: a.dimensions || ''
          });
        }
        _cache[ck] = { data: out, ts: Date.now() };
        return out;
      })
      .catch(function () { _cleve.hasMore = false; return []; });
  }

  /* ─── Wikidata SPARQL ──────────────────────── */

  function wikiSearch(term, count) {
    var safe = escapeForSparql(term);
    var wikiOffset = _wiki.offset;
    var ck = 'wiki|' + term + '|' + wikiOffset;
    if (_cache[ck] && (Date.now() - _cache[ck].ts < CACHE_TTL)) {
      return Promise.resolve(_cache[ck].data);
    }
    var query =
      'SELECT DISTINCT ?item ?itemLabel ?image ?creatorLabel WHERE {' +
      '  { SERVICE wikibase:mwapi {' +
      '      bd:serviceParam wikibase:endpoint "www.wikidata.org";' +
      '                      wikibase:api "EntitySearch";' +
      '                      mwapi:search "' + safe + '";' +
      '                      mwapi:language "ru".' +
      '      ?item wikibase:apiOutputItem mwapi:item.' +
      '    }' +
      '    ?item wdt:P31 wd:Q3305213.' +
      '    ?item wdt:P18 ?image.' +
      '    OPTIONAL { ?item wdt:P170 ?creator. }' +
      '  } UNION {' +
      '    SERVICE wikibase:mwapi {' +
      '      bd:serviceParam wikibase:endpoint "www.wikidata.org";' +
      '                      wikibase:api "EntitySearch";' +
      '                      mwapi:search "' + safe + '";' +
      '                      mwapi:language "ru".' +
      '      ?creator wikibase:apiOutputItem mwapi:item.' +
      '    }' +
      '    ?item wdt:P170 ?creator.' +
      '    ?item wdt:P31 wd:Q3305213.' +
      '    ?item wdt:P18 ?image.' +
      '  }' +
      '  SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en". }' +
      '} LIMIT ' + count + ' OFFSET ' + wikiOffset;

    var url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query) + '&format=json';
    var thumbW = getThumbWidth();

    return fetchWithTimeout(url, { headers: { 'Accept': 'application/sparql-results+json' } }, 8000)
      .then(function (res) {
        if (res.status === 429) throw new Error('429');
        if (!res.ok) throw new Error('Wikidata: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var bindings = data.results.bindings;
        var paintings = [];
        var seenIds = {};
        for (var i = 0; i < bindings.length; i++) {
          var b = bindings[i];
          var id = b.item.value;
          if (seenIds[id]) continue;
          seenIds[id] = true;
          var imageUrl = b.image.value.replace('http://', 'https://');
          if (imageUrl.indexOf('Special:FilePath') !== -1) imageUrl += '?width=' + thumbW;
          paintings.push({
            id:         id,
            title:      (b.itemLabel && b.itemLabel.value) || '\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0438\u043d\u0430',
            artist:     (b.creatorLabel && b.creatorLabel.value) || '\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0430\u0432\u0442\u043e\u0440',
            imageUrl:   imageUrl,
            source:     'wiki',
            dimensions: ''
          });
        }
        if (bindings.length < count) _wiki.hasMore = false;
        _wiki.offset += count;
        _cache[ck] = { data: paintings, ts: Date.now() };
        return paintings;
      })
      .catch(function () { _wiki.hasMore = false; return []; });
  }

  /* ─── Общие утилиты провайдеров ────────────── */

  /** Round-robin перемешивание массивов */
  function interleave(arrays) {
    var out = [];
    var maxLen = 0;
    for (var a = 0; a < arrays.length; a++) {
      if (arrays[a].length > maxLen) maxLen = arrays[a].length;
    }
    for (var i = 0; i < maxLen; i++) {
      for (var j = 0; j < arrays.length; j++) {
        if (i < arrays[j].length) out.push(arrays[j][i]);
      }
    }
    return out;
  }

  /** Дедупликация по painting.id */
  function dedup(paintings, existing) {
    var seen = {};
    for (var k = 0; k < existing.length; k++) seen[existing[k].id] = true;
    var out = [];
    for (var i = 0; i < paintings.length; i++) {
      if (!seen[paintings[i].id]) {
        seen[paintings[i].id] = true;
        out.push(paintings[i]);
      }
    }
    return out;
  }

  /* ── Управление UI-состоянием ──────────────── */
  function updateUIState() {
    var searchBtn = getEl('search-btn');
    var input     = getEl('search-input');
    if (searchBtn) searchBtn.disabled = isSearching || !input.value.trim();

    var btnText = getEl('search-btn-text');
    var spinner = getEl('search-spinner');
    if (btnText) btnText.classList.toggle('hidden', isSearching);
    if (spinner) spinner.classList.toggle('hidden', !isSearching);

    /* Популярные теги скрываем после первого поиска */
    var tags = getEl('popular-tags');
    if (tags && hasSearched) tags.classList.add('hidden');

    /* Кнопка «Показать ещё» */
    var lmContainer = getEl('load-more-container');
    if (lmContainer) {
      if (results.length > 0 && anyHasMore()) {
        lmContainer.classList.remove('hidden');
        lmContainer.classList.add('flex');
        var lmBtn  = getEl('load-more-btn');
        var lmText = getEl('load-more-text');
        var lmSpin = getEl('load-more-spinner');
        if (lmBtn)  lmBtn.disabled = isLoadingMore;
        if (lmText) lmText.textContent = isLoadingMore ? 'Загрузка…' : 'Показать ещё';
        if (lmSpin) lmSpin.classList.toggle('hidden', !isLoadingMore);
      } else {
        lmContainer.classList.add('hidden');
        lmContainer.classList.remove('flex');
      }
    }

    /* Пустое состояние */
    var emptyState = getEl('empty-state');
    var errText    = getEl('error-text');
    if (emptyState) {
      var showEmpty = !isSearching && hasSearched && results.length === 0 && (!errText || errText.textContent === '');
      emptyState.classList.toggle('hidden', !showEmpty);
    }
  }

  function showError(msg) {
    var errText = getEl('error-text');
    var errBox  = getEl('error-message');
    var empty   = getEl('empty-state');
    var grid    = getEl('grid-container');

    if (errText) errText.textContent = msg;
    if (errBox)  { errBox.classList.remove('hidden'); errBox.classList.add('flex'); }
    if (empty)   empty.classList.add('hidden');
    if (grid)    grid.innerHTML = '';
  }

  /* ── Создание карточки ─────────────────────── */
  function createCardElement(painting) {
    var idx = _cardIndex++;
    /* Первые N карточек (первый экран) грузятся eagerly, остальные — lazy */
    var eagleThreshold = columnCount * 2;
    var lazyAttr = (idx >= eagleThreshold) ? ' loading="lazy"' : '';
    /* Wikidata CDN требует no-referrer; AIC/Met/Cleveland проверяют Referer — без него 403 */
    var refPolicy = (painting.source === 'wiki') ? ' referrerpolicy="no-referrer"' : '';

    var div = document.createElement('div');
    div.className = 'group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 mb-5 md:mb-6 opacity-0 translate-y-4';
    div.setAttribute('data-painting-id', painting.id);

    var sourceLabel = SOURCE_LABELS[painting.source] || '';

    div.innerHTML =
      '<div class="w-full min-h-60 overflow-hidden bg-gray-100 relative flex items-center justify-center">' +
        (sourceLabel ? '<span class="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm">' + sourceLabel + '</span>' : '') +
        '<div class="absolute inset-0 flex items-center justify-center loader-container">' +
          '<svg class="w-8 h-8 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' +
        '</div>' +
        '<div class="relative z-20 py-16 text-center text-gray-400 hidden flex-col items-center gap-2 error-container">' +
          '<span class="text-sm font-medium">\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438</span>' +
          '<p class="error-info text-xs text-gray-500 mt-1 px-3 line-clamp-2"></p>' +
          '<button type="button" class="retry-btn text-xs text-primary font-medium underline hover:text-primary-hover">\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c</button>' +
        '</div>' +
        '<img src="' + painting.imageUrl + '" alt="' + painting.title.replace(/"/g, '&quot;') + '" class="w-full h-auto block transition-all duration-700 group-hover:scale-105 opacity-0" decoding="async"' + lazyAttr + refPolicy + ' />' +
      '</div>' +
      '<div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 hover-overlay">' +
        '<h3 class="text-white text-lg font-bold leading-tight mb-1">' + painting.title + '</h3>' +
        '<p class="text-white/80 text-sm mb-2">' + painting.artist + '</p>' +
        '<span class="inline-flex items-center gap-1 text-white/90 text-xs font-bold uppercase tracking-wide">' +
          '<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>' +
          '\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u2192' +
        '</span>' +
      '</div>';

    var img    = div.querySelector('img');
    var loader = div.querySelector('.loader-container');
    var errC   = div.querySelector('.error-container');
    var retryBtn = div.querySelector('.retry-btn');
    var errorInfo = div.querySelector('.error-info');
    var _retryCount = 0;
    var _origSrc = painting.imageUrl;

    /* AIC IIIF: каскад рекомендованных размеров (843 → 600 → 400 → 200) */
    var _aicSizes = ['843,', '600,', '400,', '200,'];

    img.onload = function () {
      loader.classList.add('hidden');
      errC.classList.add('hidden');
      errC.classList.remove('flex');
      img.classList.replace('opacity-0', 'opacity-100');
      /* Восстанавливаем hover-overlay если был скрыт при ошибке */
      if (hoverOverlay) {
        hoverOverlay.classList.remove('hidden');
        hoverOverlay.style.pointerEvents = '';
      }
    };
    var hoverOverlay = div.querySelector('.hover-overlay');
    img.onerror = function () {
      _retryCount++;

      /* AIC: каскадный fallback по рекомендованным IIIF размерам */
      if (painting.source === 'aic' && _retryCount <= _aicSizes.length) {
        var sizeIdx = _retryCount; /* 1→[1]=600, 2→[2]=400, 3→[3]=200 */
        if (sizeIdx < _aicSizes.length) {
          var newUrl = _origSrc.replace(/\/full\/\d+,\//, '/full/' + _aicSizes[sizeIdx] + '/');
          setTimeout(function () { img.src = newUrl; }, 800);
          return;
        }
      }

      if (_retryCount === 1 && painting.source === 'wiki' && img.src.indexOf('?width=') !== -1) {
        /* Попытка 1 (только Wikidata): убираем ?width= (полноразмерное) */
        img.src = img.src.split('?')[0];
      } else if (_retryCount <= 3) {
        /* Попытки 2-3: повторяем с задержкой 1.5 сек */
        setTimeout(function () {
          var sep = _origSrc.indexOf('?') !== -1 ? '&' : '?';
          img.src = _origSrc + sep + 'retry=' + _retryCount;
        }, 1500);
      } else {
        /* Все попытки исчерпаны — показываем ошибку + кнопку */
        loader.classList.add('hidden');
        errC.classList.remove('hidden');
        errC.classList.add('flex');
        /* Показываем название и художника в зоне ошибки */
        if (errorInfo) {
          errorInfo.textContent = painting.title + ' — ' + painting.artist;
        }
        /* Полностью скрываем hover-overlay чтобы не перекрывал кнопку «Повторить» */
        if (hoverOverlay) {
          hoverOverlay.classList.add('hidden');
          hoverOverlay.style.pointerEvents = 'none';
        }
      }
    };

    /* Кнопка «Повторить» */
    if (retryBtn) {
      retryBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _retryCount = 0;
        errC.classList.add('hidden');
        errC.classList.remove('flex');
        loader.classList.remove('hidden');
        img.classList.replace('opacity-100', 'opacity-0');
        /* Восстанавливаем hover-overlay */
        if (hoverOverlay) {
          hoverOverlay.classList.remove('hidden');
          hoverOverlay.style.pointerEvents = '';
        }
        img.src = _origSrc;
      });
    }

    /* Клик по карточке → модал (не открывать если видна ошибка) */
    div.addEventListener('click', function () {
      if (!errC.classList.contains('hidden')) return;
      openModal(painting);
    });

    /* Плавное появление */
    requestAnimationFrame(function () {
      setTimeout(function () { div.classList.remove('opacity-0', 'translate-y-4'); }, 50);
    });

    return div;
  }

  /** Найти самую короткую колонку (shortest-column masonry) */
  function getShortestColumn(columns) {
    var minH = Infinity;
    var minIdx = 0;
    for (var i = 0; i < columns.length; i++) {
      var h = columns[i].offsetHeight;
      if (h < minH) { minH = h; minIdx = i; }
    }
    return minIdx;
  }

  /* ── Рендер / дополнение сетки ─────────────── */
  function renderGrid() {
    var grid = getEl('grid-container');
    if (!grid) return;
    grid.innerHTML = '';
    _cardIndex = 0;
    var errMsg = getEl('error-message');
    if (errMsg) { errMsg.classList.add('hidden'); errMsg.classList.remove('flex'); }

    var columns = [];
    for (var c = 0; c < columnCount; c++) {
      var col = document.createElement('div');
      col.className = 'flex flex-col flex-1';
      grid.appendChild(col);
      columns.push(col);
    }

    /* При первом рендере height неизвестен → round-robin для первой строки,
       затем shortest-column. Это даёт наилучшие результаты. */
    for (var i = 0; i < results.length; i++) {
      var colIdx;
      if (i < columnCount) {
        /* Первая строка: round-robin (все колонки по 0 высоте) */
        colIdx = i;
      } else {
        colIdx = getShortestColumn(columns);
      }
      columns[colIdx].appendChild(createCardElement(results[i]));
    }
  }

  /** Пересобрать сетку из существующих DOM-нод (без пересоздания) */
  function redistributeGrid() {
    var grid = getEl('grid-container');
    if (!grid) return;

    /* Собираем все карточки из текущих колонок */
    var cards = [];
    var oldCols = grid.children;
    for (var c = 0; c < oldCols.length; c++) {
      while (oldCols[c].firstChild) {
        cards.push(oldCols[c].removeChild(oldCols[c].firstChild));
      }
    }

    /* Создаём новые колонки */
    grid.innerHTML = '';
    var columns = [];
    for (var i = 0; i < columnCount; i++) {
      var col = document.createElement('div');
      col.className = 'flex flex-col flex-1';
      grid.appendChild(col);
      columns.push(col);
    }

    /* Распределяем: первая строка round-robin, далее shortest-column */
    for (var j = 0; j < cards.length; j++) {
      var colIdx;
      if (j < columnCount) {
        colIdx = j;
      } else {
        colIdx = getShortestColumn(columns);
      }
      columns[colIdx].appendChild(cards[j]);
    }
  }

  function appendGrid(newPaintings) {
    var grid = getEl('grid-container');
    if (!grid) return;
    var columns = Array.prototype.slice.call(grid.children);

    for (var i = 0; i < newPaintings.length; i++) {
      var colIdx = getShortestColumn(columns);
      columns[colIdx].appendChild(createCardElement(newPaintings[i]));
    }
  }

  /* ── Обработчики поиска ────────────────────── */
  function resetProviders() {
    _met   = { ids: [], offset: 0, hasMore: true };
    _aic   = { page: 1, hasMore: true };
    _cleve = { page: 0, hasMore: true };
    _rijks = { buffer: [], nextUrl: '', hasMore: true, ok: true }; /* даём шанс каждый новый поиск */
    _wiki  = { offset: 0, hasMore: true };
  }

  function handleSearch(term) {
    searchTerm  = term;
    searchTermEn = translateTerm(term);
    isSearching = true;
    hasSearched = true;
    results = [];
    resetProviders();
    updateUIState();

    /* Шаг 1: Met search (получает все ID), остальные стартуют сразу */
    var metReady = metSearch(searchTermEn);

    /* Шаг 2: параллельно загружаем первый batch из каждого */
    metReady.then(function () {
      return Promise.allSettled([
        metLoadBatch(BATCH),
        aicSearch(searchTermEn, BATCH),
        cleveSearch(searchTermEn, BATCH),
        rijksSearch(searchTermEn, BATCH),
        wikiSearch(term, BATCH) /* Wikidata получает русский запрос */
      ]);
    })
    .then(function (settled) {
      var arrays = [];
      for (var i = 0; i < settled.length; i++) {
        if (settled[i].status === 'fulfilled' && settled[i].value) {
          arrays.push(settled[i].value);
        }
      }
      var merged = dedup(interleave(arrays), []);
      results = merged;
      _cardIndex = 0;
      renderGrid();

      if (results.length === 0) {
        showError('');  /* покажет empty-state через updateUIState */
      }
    })
    .catch(function () {
      showError('\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u043f\u043e\u0438\u0441\u043a\u0435. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u0437\u0430\u043f\u0440\u043e\u0441.');
    })
    .then(function () {
      isSearching = false;
      updateUIState();
    });
  }

  function handleLoadMore() {
    if (isLoadingMore || !anyHasMore()) return;
    isLoadingMore = true;
    updateUIState();

    Promise.allSettled([
      _met.hasMore  ? metLoadBatch(BATCH)                : Promise.resolve([]),
      _aic.hasMore  ? aicSearch(searchTermEn, BATCH)     : Promise.resolve([]),
      _cleve.hasMore ? cleveSearch(searchTermEn, BATCH)  : Promise.resolve([]),
      (_rijks.ok && _rijks.hasMore) ? rijksSearch(searchTermEn, BATCH) : Promise.resolve([]),
      _wiki.hasMore ? wikiSearch(searchTerm, BATCH)      : Promise.resolve([])
    ])
    .then(function (settled) {
      var arrays = [];
      for (var i = 0; i < settled.length; i++) {
        if (settled[i].status === 'fulfilled' && settled[i].value) {
          arrays.push(settled[i].value);
        }
      }
      var merged = dedup(interleave(arrays), results);
      results = results.concat(merged);
      appendGrid(merged);
    })
    .catch(function (err) { console.error(err); })
    .then(function () {
      isLoadingMore = false;
      updateUIState();
    });
  }

  /* ============================================================ */
  /*              МОДАЛЬНЫЙ КАЛЬКУЛЯТОР                            */
  /* ============================================================ */

  /** Запрос размеров оригинала из Wikidata (лёгкий, по одному item) */
  function fetchOriginalSize(painting) {
    var origSizeEl = getEl('modal-original-size');
    if (!origSizeEl) return;
    origSizeEl.textContent = '';
    origSizeEl.classList.add('hidden');

    /* Извлекаем QID из URI вида http://www.wikidata.org/entity/Q12345 */
    var qid = painting.id.split('/').pop();
    var q = 'SELECT ?w ?h WHERE {' +
      ' OPTIONAL { wd:' + qid + ' wdt:P2049 ?w. }' +
      ' OPTIONAL { wd:' + qid + ' wdt:P2048 ?h. }' +
      '} LIMIT 1';
    var url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(q) + '&format=json';

    fetch(url, { headers: { 'Accept': 'application/sparql-results+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        var b = data.results.bindings[0];
        if (!b) return;
        var w = b.w ? parseFloat(b.w.value) : null;
        var h = b.h ? parseFloat(b.h.value) : null;
        /* Показываем только если модал всё ещё для этой картины */
        if (currentPainting !== painting) return;
        if (w && h) {
          var ow = Math.round(w * 10) / 10;
          var oh = Math.round(h * 10) / 10;
          origSizeEl.textContent = '\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b: ' + ow + ' \u00d7 ' + oh + ' \u0441\u043c';
          origSizeEl.classList.remove('hidden');
        }
      })
      .catch(function () { /* молча игнорируем */ });
  }

  /** Открыть модал */
  function openModal(painting) {
    currentPainting    = painting;
    currentLongSide    = 60;
    currentSize        = LONG_SIDES[1];
    currentStretcher   = STRETCHER_TYPES[0];
    currentFrame       = _frameMap['NONE'] || FRAMES_DB[0];
    currentVarnish     = true;
    currentAspectRatio = null;
    isOrdered          = false;

    getEl('modal-title').textContent  = painting.title;
    getEl('modal-artist').textContent = painting.artist;

    /* Размер оригинала */
    var origSizeEl = getEl('modal-original-size');
    if (origSizeEl) {
      origSizeEl.textContent = '';
      origSizeEl.classList.add('hidden');
      if (painting.dimensions) {
        /* Met / AIC — dimensions уже есть строкой */
        origSizeEl.textContent = '\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b: ' + painting.dimensions;
        origSizeEl.classList.remove('hidden');
      } else if (painting.source === 'wiki') {
        /* Wikidata — отдельный лёгкий SPARQL */
        fetchOriginalSize(painting);
      }
    }

    var img = getEl('modal-image');
    /* Сброс aspect-ratio до загрузки нового изображения */
    img.style.aspectRatio = '';
    img.src = painting.imageUrl;
    img.alt = painting.title + ' \u2014 ' + painting.artist;

    updateFrameStyle();
    renderCalculatorOptions();

    var dialog = getEl('repro-modal');
    if (dialog && dialog.showModal) dialog.showModal();
  }

  /** Закрыть модал */
  function closeModal() {
    var dialog = getEl('repro-modal');
    if (dialog && dialog.close) dialog.close();
    setTimeout(function () {
      var img = getEl('modal-image');
      if (img) img.src = '';
    }, 300);
  }

  /** Обновить стили рамы на превью */
  function updateFrameStyle() {
    var frameEl = getEl('modal-frame');
    if (!frameEl) return;

    var MF = window.MUSE_FRAMES;
    if (MF && MF.getFramePreviewCSS) {
      var css = MF.getFramePreviewCSS(currentFrame);
      frameEl.style.border      = css.border;
      frameEl.style.outline     = css.outline;
      frameEl.style.borderImage = css.borderImage;
      if (css.borderColor) frameEl.style.borderColor = css.borderColor;
      frameEl.style.boxShadow   = css.boxShadow;
    } else {
      if (!currentFrame || currentFrame.id === 'NONE') {
        frameEl.style.cssText = 'border:none;box-shadow:0 20px 25px -5px rgba(0,0,0,0.2);';
      } else {
        var bw = Math.max(4, Math.min(currentFrame.width, 20));
        frameEl.style.cssText = 'border:' + bw + 'px solid ' + currentFrame.color + ';box-shadow:0 20px 25px -5px rgba(0,0,0,0.3);';
      }
    }

    /* Overlay лака */
    var glossy = getEl('modal-glossy');
    var matte  = getEl('modal-matte');
    if (glossy) glossy.classList.toggle('hidden', !currentVarnish);
    if (matte)  matte.classList.add('hidden');
  }

  /** Создать миниатюру рамы для каталога */
  function createFrameOption(frame, w, h) {
    var isSelected = (currentFrame && currentFrame.id === frame.id);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center '
      + (isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300');

    var previewH = 48;
    var ar = (w && h) ? (w / h) : 1;
    var previewW = Math.round(previewH * ar);

    var previewCSS = '';
    if (frame.id === 'NONE') {
      previewCSS = 'background-color:#f1f5f9;border:1px dashed #cbd5e1;';
    } else {
      var bpx = Math.max(2, Math.min(Math.round(frame.width / 5), 8));
      previewCSS = 'background-color:#f1f5f9;border:' + bpx + 'px solid ' + frame.color + ';';
      if (frame.style === 'ornate_gold') {
        previewCSS += 'border-image:linear-gradient(135deg,#d4af37,#f5e5a0,#c5972c,#f5e5a0,#d4af37) 1;border-color:#d4af37;';
      } else if (frame.style === 'ornate_silver') {
        previewCSS += 'border-image:linear-gradient(135deg,#c0c0c0,#f0f0f0,#a0a0a0,#f0f0f0,#c0c0c0) 1;border-color:#c0c0c0;';
      } else if (frame.style === 'ornate_gold_inner') {
        previewCSS += 'border-image:linear-gradient(135deg,#1a1a1a,#333,#1a1a1a) 1;outline:1px solid #d4af37;';
      }
      if (frame.border) {
        previewCSS += 'outline:1px solid ' + frame.border + ';';
      }
    }

    var priceVal = calcFramePrice(frame, w, h);
    var priceLabel = frame.id === 'NONE' ? '' : (fmtPrice(priceVal) + ' \u0440.');

    btn.innerHTML =
      '<div style="width:' + previewW + 'px;height:' + previewH + 'px;' + previewCSS + '" class="rounded-sm shrink-0"></div>' +
      '<span class="text-[10px] leading-tight font-medium text-body truncate w-full">' + frame.name + '</span>' +
      (priceLabel ? '<span class="text-[10px] text-gray-400">' + priceLabel + '</span>' : '');

    btn.addEventListener('click', function () {
      currentFrame = frame;
      updateFrameStyle();
      renderCalculatorOptions();
    });

    return btn;
  }

  /** Отрисовка всех кнопок калькулятора */
  function renderCalculatorOptions() {
    var prices = calcTotal();

    /* ─── Размеры: кнопки-пресеты ─── */
    var sizesC = getEl('sizes-container');
    if (sizesC) {
      sizesC.innerHTML = '';
      LONG_SIDES.forEach(function (s) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var isSelected = (currentLongSide === s.value);
        btn.className = 'p-3 rounded-xl border text-left transition-all '
          + (isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300');

        var dim = getDimensions(s.value);
        var dimText = currentAspectRatio
          ? (dim.w + ' \u00d7 ' + dim.h + ' \u0441\u043c')
          : ('\u0414\u043b\u0438\u043d\u043d\u0430\u044f \u0441\u0442\u043e\u0440\u043e\u043d\u0430: ' + s.value + ' \u0441\u043c');

        var sizePrice = calcCanvasPrice(dim.w, dim.h);

        btn.innerHTML =
          '<div class="font-medium text-dark text-sm">' + dimText + '</div>' +
          '<div class="text-xs text-gray-400">' + fmtPrice(sizePrice) + ' \u0440.</div>';

        btn.addEventListener('click', function () {
          currentLongSide = s.value;
          currentSize = s;
          renderCalculatorOptions();
        });
        sizesC.appendChild(btn);
      });
    }

    /* ─── Размеры: слайдер ─── */
    var slider = getEl('repro-size-slider');
    var sizeDisplay = getEl('repro-size-display');
    if (slider) {
      slider.value = currentLongSide;
      var dim = getDimensions(currentLongSide);
      if (sizeDisplay) {
        var dimText = currentAspectRatio
          ? (dim.w + ' \u00d7 ' + dim.h + ' \u0441\u043c')
          : (currentLongSide + ' \u0441\u043c');
        var sliderPrice = calcCanvasPrice(dim.w, dim.h);
        sizeDisplay.textContent = dimText + ' \u2014 ' + fmtPrice(sliderPrice) + ' \u0440.';
      }
    }

    /* ─── Подрамник ─── */
    var wrapBtns = document.querySelectorAll('.wrap-btn');
    wrapBtns.forEach(function (btn) {
      if (btn.dataset.val === currentStretcher.id) {
        btn.className = 'wrap-btn is-active';
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.className = 'wrap-btn';
        btn.setAttribute('aria-checked', 'false');
      }
    });
    var wrapBadge = getEl('modal-price-wrap');
    if (wrapBadge) {
      wrapBadge.textContent = fmtPrice(prices.canvas) + ' \u0440.';
      wrapBadge.className = 'calc-badge' + (prices.canvas > 0 ? ' is-active' : '');
    }

    /* ─── Рамы ─── */
    var studioC  = getEl('modal-frames-studio');
    var classicC = getEl('modal-frames-classic');
    if (studioC) {
      studioC.innerHTML = '';
      FRAMES_DB.forEach(function (f) {
        if (f.cat === 'STUDIO') studioC.appendChild(createFrameOption(f, prices.w, prices.h));
      });
    }
    if (classicC) {
      classicC.innerHTML = '';
      FRAMES_DB.forEach(function (f) {
        if (f.cat === 'CLASSIC') classicC.appendChild(createFrameOption(f, prices.w, prices.h));
      });
    }

    /* Badge цены рамы */
    var frameBadge = getEl('modal-price-frame');
    if (frameBadge) {
      frameBadge.textContent = prices.frame > 0 ? (fmtPrice(prices.frame) + ' \u0440.') : '0 \u0440.';
      frameBadge.className = 'calc-badge' + (prices.frame > 0 ? ' is-active' : '');
    }

    /* ─── Лак ─── */
    var varnishCheckbox = getEl('toggle-repro-varnish');
    if (varnishCheckbox) {
      varnishCheckbox.checked = currentVarnish;
    }

    /* Badge цены лака */
    var varnishBadge = getEl('modal-price-varnish');
    if (varnishBadge) {
      var varnishPotential = calcVarnishPrice(prices.w, prices.h);
      var vShow = prices.varnish > 0 ? prices.varnish : varnishPotential;
      varnishBadge.textContent = vShow > 0 ? (fmtPrice(vShow) + ' \u0440.') : '0 \u0440.';
      varnishBadge.className = 'calc-badge' + (prices.varnish > 0 ? ' is-active' : '');
    }

    /* ─── Итого ─── */
    var totalEl = getEl('modal-total-price');
    if (totalEl) totalEl.textContent = fmtPrice(prices.total) + ' \u0440.';

    /* ─── Sticky bar (мобильный) ─── */
    var stickyPrice = getEl('sticky-repro-price');
    if (stickyPrice) stickyPrice.textContent = fmtPrice(prices.total) + ' \u0440.';

    /* ─── Кнопка заказа ─── */
    var orderBtn  = getEl('repro-order-btn');
    var orderText = getEl('repro-order-text');
    if (orderBtn && orderText) {
      if (isOrdered) {
        orderBtn.className = 'hidden lg:block w-full py-4 rounded-xl text-base font-bold transition-all bg-green-600 text-white active:scale-[0.98]';
        orderText.textContent = '\u0417\u0430\u043a\u0430\u0437 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d \u2713';
      } else {
        orderBtn.className = 'hidden lg:block w-full btn-header-cta py-4 active:scale-[0.98] text-base';
        orderText.textContent = '\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c';
      }
    }
  }

  /** Обработка заказа */
  function handleOrder() {
    if (isOrdered) return;

    var name  = getEl('repro-name');
    var phone = getEl('repro-phone');
    if (!name || !name.value.trim()) { name.focus(); return; }
    if (!phone || !phone.value.trim()) { phone.focus(); return; }

    var dim = getDimensions(currentLongSide);
    var prices = calcTotal();

    var orderData = {
      painting: currentPainting ? currentPainting.title : '',
      artist:   currentPainting ? currentPainting.artist : '',
      imageUrl: currentPainting ? currentPainting.imageUrl : '',
      source:   currentPainting ? (SOURCE_LABELS[currentPainting.source] || '') : '',
      size:     dim.w + '\u00d7' + dim.h + ' \u0441\u043c',
      stretcher: currentStretcher ? currentStretcher.label : '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0439',
      frame:    currentFrame ? currentFrame.name : '\u0411\u0435\u0437 \u0431\u0430\u0433\u0435\u0442\u0430',
      varnish:  currentVarnish ? 'Лак включён' : 'Без лака',
      total:    prices.total,
      name:     name.value.trim(),
      phone:    phone.value.trim(),
      email:    (getEl('repro-email') && getEl('repro-email').value.trim()) || '',
      comment:  (getEl('repro-comment') && getEl('repro-comment').value.trim()) || ''
    };

    var subject = encodeURIComponent('\u0417\u0430\u043a\u0430\u0437 \u0440\u0435\u043f\u0440\u043e\u0434\u0443\u043a\u0446\u0438\u0438 \u2014 ' + orderData.painting);
    var body = encodeURIComponent(
      '\u041a\u0430\u0440\u0442\u0438\u043d\u0430: ' + orderData.painting + '\n' +
      '\u0425\u0443\u0434\u043e\u0436\u043d\u0438\u043a: ' + orderData.artist + '\n' +
      '\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a: ' + orderData.source + '\n' +
      '\u0420\u0430\u0437\u043c\u0435\u0440: ' + orderData.size + '\n' +
      '\u041f\u043e\u0434\u0440\u0430\u043c\u043d\u0438\u043a: ' + orderData.stretcher + '\n' +
      '\u0411\u0430\u0433\u0435\u0442: ' + orderData.frame + '\n' +
      '\u041f\u043e\u043a\u0440\u044b\u0442\u0438\u0435: ' + orderData.varnish + '\n' +
      '\u0418\u0442\u043e\u0433\u043e: ' + fmtPrice(orderData.total) + ' \u0440.\n\n' +
      '\u0418\u043c\u044f: ' + orderData.name + '\n' +
      '\u0422\u0435\u043b\u0435\u0444\u043e\u043d: ' + orderData.phone + '\n' +
      'Email: ' + orderData.email + '\n' +
      '\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439: ' + orderData.comment + '\n\n' +
      '\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435: ' + orderData.imageUrl
    );

    window.open('mailto:hello@muse.ooo?subject=' + subject + '&body=' + body, '_blank');

    isOrdered = true;
    renderCalculatorOptions();

    setTimeout(function () {
      closeModal();
      isOrdered = false;
      if (name) name.value = '';
      if (phone) phone.value = '';
      var email   = getEl('repro-email');
      var comment = getEl('repro-comment');
      if (email) email.value = '';
      if (comment) comment.value = '';
    }, 2500);
  }

  /* ── Инициализация ─────────────────────────── */
  function init() {
    initFramesCatalog();
    updateColumns();

    window.addEventListener('resize', function () {
      var prevCols = columnCount;
      updateColumns();
      if (prevCols !== columnCount && results.length > 0) redistributeGrid();
    });

    /* Популярные теги */
    var tagsContainer = getEl('popular-tags');
    if (tagsContainer) {
      POPULAR_TAGS.forEach(function (term) {
        var btn = document.createElement('button');
        btn.className = 'px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary-text transition-colors shadow-sm';
        btn.textContent = term;
        btn.addEventListener('click', function () {
          getEl('search-input').value = term;
          handleSearch(term);
        });
        tagsContainer.appendChild(btn);
      });
    }

    /* Форма поиска */
    var form = getEl('search-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = getEl('search-input').value.trim();
        if (val) handleSearch(val);
      });
    }

    /* Кнопка «Показать ещё» */
    var lmBtn = getEl('load-more-btn');
    if (lmBtn) lmBtn.addEventListener('click', handleLoadMore);

    /* ── Модальные обработчики ── */

    var closeBtn = getEl('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var dialog = getEl('repro-modal');
    if (dialog) {
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) closeModal();
      });
      dialog.addEventListener('cancel', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    /* Получение пропорций картинки при загрузке + фиксация aspect-ratio для CLS */
    var modalImg = getEl('modal-image');
    if (modalImg) {
      modalImg.addEventListener('load', function (e) {
        var target = e.target;
        if (target.naturalHeight > 0) {
          currentAspectRatio = target.naturalWidth / target.naturalHeight;
          /* Фиксируем aspect-ratio чтобы устранить layout shift */
          target.style.aspectRatio = target.naturalWidth + ' / ' + target.naturalHeight;
          renderCalculatorOptions();
        }
      });
    }

    /* Кнопка заказа */
    var orderBtn = getEl('repro-order-btn');
    if (orderBtn) orderBtn.addEventListener('click', handleOrder);

    /* ── Подрамник: обработчики кнопок ── */
    var wrapBtns = document.querySelectorAll('.wrap-btn');
    wrapBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-val');
        for (var i = 0; i < STRETCHER_TYPES.length; i++) {
          if (STRETCHER_TYPES[i].id === val) {
            currentStretcher = STRETCHER_TYPES[i];
            break;
          }
        }
        renderCalculatorOptions();
      });
    });

    /* ── Лак: checkbox toggle ── */
    var varnishToggle = getEl('toggle-repro-varnish');
    if (varnishToggle) {
      varnishToggle.addEventListener('change', function (e) {
        currentVarnish = e.target.checked;
        updateFrameStyle();
        renderCalculatorOptions();
      });
    }

    /* ── Слайдер размера ── */
    var sizeSlider = getEl('repro-size-slider');
    if (sizeSlider) {
      sizeSlider.oninput = function () {
        var val = parseInt(sizeSlider.value, 10);
        var dim = getDimensions(val);
        var display = getEl('repro-size-display');
        if (display) {
          var txt = currentAspectRatio
            ? (dim.w + ' \u00d7 ' + dim.h + ' \u0441\u043c')
            : (val + ' \u0441\u043c');
          var price = calcCanvasPrice(dim.w, dim.h);
          display.textContent = txt + ' \u2014 ' + fmtPrice(price) + ' \u0440.';
        }
        /* Подсветка пресет-кнопок при совпадении */
        var btns = document.querySelectorAll('#sizes-container button');
        btns.forEach(function (btn, i) {
          var isMatch = (LONG_SIDES[i] && LONG_SIDES[i].value === val);
          btn.className = 'p-3 rounded-xl border text-left transition-all '
            + (isMatch ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300');
        });
      };
      sizeSlider.onchange = function () {
        currentLongSide = parseInt(sizeSlider.value, 10);
        /* Найти совпадающий пресет или сбросить */
        var match = null;
        for (var i = 0; i < LONG_SIDES.length; i++) {
          if (LONG_SIDES[i].value === currentLongSide) { match = LONG_SIDES[i]; break; }
        }
        currentSize = match;
        renderCalculatorOptions();
      };
    }

    /* ── Sticky bar: умная кнопка (скролл к форме / оформить заказ) ── */
    var btnStickyOrder = getEl('btn-sticky-repro-order');
    var _formVisible = false;

    if (btnStickyOrder) {
      btnStickyOrder.addEventListener('click', function () {
        if (_formVisible) {
          /* Форма видна → оформляем заказ */
          handleOrder();
        } else {
          /* Форма не видна → скроллим к ней */
          var orderForm = getEl('repro-order-form');
          if (orderForm) orderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var nameInput = getEl('repro-name');
          if (nameInput && !nameInput.value.trim()) {
            setTimeout(function () { nameInput.focus(); }, 400);
          }
        }
      });
    }

    /* Запуск поиска через URL-параметр */
    var params    = new URLSearchParams(window.location.search);
    var urlSearch = params.get('q');
    if (urlSearch) {
      getEl('search-input').value = urlSearch;
      handleSearch(urlSearch);
    }

    /* ── Клавиатура на мобильном: прокрутка поля в зону видимости ── */
    var formInputs = document.querySelectorAll('#repro-order-form input, #repro-order-form textarea');
    formInputs.forEach(function (input) {
      input.addEventListener('focus', function () {
        var el = this;
        setTimeout(function () {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });

    /* ── Sticky bar: «отлипает» когда форма видна ── */
    var orderFormEl = document.getElementById('repro-order-form');
    var stickyBarEl = getEl('repro-sticky-bar');
    var formWrapEl  = orderFormEl ? orderFormEl.closest('.pb-20') : null;
    if (orderFormEl && stickyBarEl) {
      var scrollRoot = document.querySelector('.custom-scrollbar');
      var stickyObserver = new IntersectionObserver(function (entries) {
        _formVisible = entries[0].isIntersecting;
        if (_formVisible) {
          stickyBarEl.classList.add('is-docked');
          if (formWrapEl) formWrapEl.style.paddingBottom = '0';
        } else {
          stickyBarEl.classList.remove('is-docked');
          if (formWrapEl) formWrapEl.style.paddingBottom = '';
        }
      }, { root: scrollRoot || null, threshold: 0.1 });
      stickyObserver.observe(orderFormEl);
    }
  }

  /* ── Старт ─────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
