/**
 * MUSE — единый конфиг цен для всех калькуляторов
 * Обновлено: 16 февраля 2026
 *
 * Универсальная формула (canvas + portrait):
 *   Печать+подрамник = 0.29·S + 0.04·P·stretcherPrice + 0.76·P + 1998.48
 *     где S = w×h (см²), P = (w+h)×2 (см)
 *   Лак       = S × 0.1
 *   Гель      = S × 0.375   (только portrait)
 *   Акрил     = S × 1.05    (только portrait)
 *   Масло     = S × 2 + (лица − 1) × 2400  (только portrait)
 *   Поталь    = S × 0.3     (только portrait)
 */

window.MUSE_PRICES = (function () {

  /* ───── Общие параметры (меняете здесь — применяется везде) ───── */
  var shared = {
    /* Печать + подрамник: 0.29·S + 0.04·P·price + 0.76·P + 1998.48 */
    printSqCoeff:     0.29,
    printPStrCoeff:   0.04,
    printPBaseCoeff:  0.76,
    printConst:    1998.48,
    stretcherStandard:  32,
    stretcherGallery:   68,
    stretcherRoll:      32,

    /* Покрытия */
    varnishCoeff:   0.10,    // лак: S × 0.1

    /* Подарочная упаковка — по размеру */
    giftWrapTiers: [
      { maxW: 50,  maxH:  70, price:  650 },
      { maxW: 60,  maxH:  90, price:  750 },
      { maxW: 90,  maxH: 120, price: 1200 }
    ],
    giftWrapOversizeLabel: 'по согласованию',

    /* Багет */
    framePerM:           1200,
    frameClassicMult:     1.5
  };

  /** Копирует все ключи из shared + extras в новый объект */
  function merge(extras) {
    var result = {};
    var k;
    for (k in shared) { if (shared.hasOwnProperty(k)) result[k] = shared[k]; }
    for (k in extras) { if (extras.hasOwnProperty(k)) result[k] = extras[k]; }
    return result;
  }

  return {
    /* ───── Печать на холсте ───── */
    canvas: merge({
      /* Обработка фото (только для холста) */
      processingOptions: [
        { value: 0,    label: 'Базовая' },
        { value: 300,  label: 'Оптимальная' },
        { value: 900,  label: 'Премиальная' }
      ]
    }),

    /* ───── Портрет ───── */
    portrait: merge({
      /* Количество лиц */
      faceFirst:       1920,   // первое лицо
      faceExtra:        960,   // каждое следующее

      /* Цифровой макет (без печати): другие цены на лица */
      digitalFaceFirst: 3600,
      digitalFaceExtra: 1200,

      /* Покрытия — коэффициент × S (см²) */
      gelCoeff:       0.375,   // гель
      acrylicCoeff:   1.05,    // акрил
      oilCoeff:       2,       // масло: S × 2
      oilFaceExtra:   2400,    // масло: + (лица − 1) × 2400
      potalCoeff:     0.30     // поталь
    })
  };
})();
