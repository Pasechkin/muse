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

window.MUSE_PRICES = {

  /* ───── Печать на холсте (canvas) ───── */
  canvas: {
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

    /* Обработка фото */
    processingOptions: [0, 300, 900],

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
  },

  /* ───── Портрет ───── */
  portrait: {

    /* Количество лиц */
    faceFirst:       1920,   // первое лицо
    faceExtra:        960,   // каждое следующее

    /* Цифровой макет (без печати): другие цены на лица */
    digitalFaceFirst: 3600,
    digitalFaceExtra: 1200,
    digitalMockupFixed:  0,  // доп. сбор сверх лиц — нет

    /* Печать + подрамник: 0.29·S + 0.04·P·price + 0.76·P + 1998.48 */
    printSqCoeff:     0.29,
    printPStrCoeff:   0.04,
    printPBaseCoeff:  0.76,
    printConst:    1998.48,
    stretcherStandard:  32,  // цена подрамника в формуле
    stretcherGallery:   68,
    stretcherRoll:      32,  // рулон = та же цена, что стандартный

    /* Покрытия — коэффициент × S (см²) */
    varnishCoeff:   0.10,    // лак
    gelCoeff:       0.375,   // гель
    acrylicCoeff:   1.05,    // акрил
    oilCoeff:       2,       // масло: S × 2
    oilFaceExtra:   2400,    // масло: + (лица − 1) × 2400
    potalCoeff:     0.30,    // поталь

    /* Обработка фото */
    processingOptions: [0, 499, 999],  // базовая / оптимальная / премиальная

    /* Подарочная упаковка — по размеру */
    giftWrapTiers: [
      { maxW: 50,  maxH:  70, price:  650 },
      { maxW: 60,  maxH:  90, price:  750 },
      { maxW: 90,  maxH: 120, price: 1200 }
    ],
    giftWrapOversizeLabel: 'по согласованию',

    /* Багет (пока те же ставки, что canvas) */
    framePerM:           1200,
    frameClassicMult:     1.5,

    /* Рулон — без скидки (формула даёт ту же цену) */
    noFrameDiscount:      1.0
  }
};
