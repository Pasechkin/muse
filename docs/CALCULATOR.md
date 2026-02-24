# Калькулятор — Техническая документация

> **Дата:** 24 февраля 2026
> **Аудитория:** любой разработчик (фронтенд, бэкенд, Bitrix-интеграция)
> **Связанные документы:**
> - [PROJECT.md](../PROJECT.md) — прогресс и план работ
> - [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — CSS-компоненты калькулятора
> - [INTEGRATION_BITRIX.md](INTEGRATION_BITRIX.md) — серверная интеграция

---

## Содержание

1. [Обзор системы](#1-обзор-системы)
2. [Файлы и порядок подключения](#2-файлы-и-порядок-подключения)
3. [API `CalcInit(cfg)`](#3-api-calcinitcfg)
4. [Ценообразование (`prices.js`)](#4-ценообразование-pricesjs)
5. [Как изменить цены](#5-как-изменить-цены)
6. [Каталог багетных рам](#6-каталог-багетных-рам)
7. [Загрузчик изображений (`uploader.js`)](#7-загрузчик-изображений-uploaderjs)
8. [Форма заказа](#8-форма-заказа)
9. [Модульный калькулятор (`modular-calc.js`)](#9-модульный-калькулятор-modular-calcjs)
10. [Конструктор фотоколлажей](#10-конструктор-фотоколлажей)
11. [Lazy-инициализация](#11-lazy-инициализация)
12. [Глобальные переменные и хуки](#12-глобальные-переменные-и-хуки)
13. [Реестр страниц с калькулятором](#13-реестр-страниц-с-калькулятором)
14. [Архитектура: варианты и приоритеты](#14-архитектура-варианты-и-приоритеты)
15. [Требования к серверной части](#15-требования-к-серверной-части)
16. [Удобство управления ценами](#16-удобство-управления-ценами)

---

## 1. Обзор системы

Система калькуляторов — набор клиентских JS-компонентов для расчёта стоимости продуктов Muse. Включает **4 типа** единого калькулятора (`CalcInit`), **отдельный модульный конструктор** (`modular-calc.js`) и **конструктор фотоколлажей** (iframe-интеграция). Пользователь выбирает параметры (размер, подрамник, покрытия, багет), загружает фото и получает итоговую цену.

### Из чего состоит

```
prices.js              ← Единый конфиг цен + тексты подсказок (все типы)
    ↓
calc.js                ← Движок калькулятора: 4 типа (canvas / portrait / frame / portraitStyle)
    ↑
uploader.js            ← Загрузчик изображений (drag-drop, ресайз, превью)
    ↓
DOM (HTML)             ← Разметка: секция #calc + <dialog> модалки


modular-calc.js        ← Отдельный конструктор модульных картин (IIFE, автоинит)
    ↑
prices.js              ← Использует MUSE_PRICES.canvas
    ↑
uploader.js            ← Тот же загрузчик

konstruktor-kollazha.html  ← Полноэкранный конструктор коллажей (в iframe)
    ↓ postMessage
fotokollazh-na-kholste.html ← Родительская страница с калькулятором canvas
```

### Жизненный цикл (CalcInit)

1. Страница загружается → `prices.js` создаёт глобальные `MUSE_PRICES` и `MUSE_TOOLTIPS`
2. `calc.js` загружается → регистрирует глобальную функцию `CalcInit()`
3. `IntersectionObserver` отслеживает видимость секции `#calc` → при приближении к viewport вызывает `CalcInit()` (lazy-инициализация, см. [§11](#11-lazy-инициализация))
4. `CalcInit` внутри создаёт экземпляр `MuseUploader()` для загрузки фото → сохраняет ссылку в `window.__museUploader`
5. Пользователь меняет параметры → `calculate()` пересчитывает цену → `updateUI()` обновляет DOM
6. Пользователь заполняет форму → отправка (сейчас заглушка `console.log`)

### Жизненный цикл (модульный калькулятор)

1. `modular-calc.js` загружается → автоматически вызывает `init()` при `DOMContentLoaded`
2. `init()` создаёт `MuseUploader()` → сохраняет ссылку в `window._mcUploader`
3. Пользователь выбирает формат, раскладку, переставляет модули → `calculateTotals()` пересчитывает цену
4. Заполняет форму `#mc-order-form` → отправка (заглушка)

### Шесть вариантов калькулятора

| Вариант | `type` | JS-файл | Страницы | Формула | Ключевые особенности |
|---------|--------|---------|----------|---------|---------------------|
| **Печать на холсте** | `canvas` | `calc.js` | `foto-na-kholste-*`, `pechat-na-kholste-*` | Площадь×коэфф + периметр×коэфф + опции | 3 уровня обработки фото |
| **Портрет** | `portrait` | `calc.js` | `portret-maslom`, и др. стили | То же + лица + покрытия (гель, акрил, масло, поталь) | Цифровой макет, select лиц 1–10 |
| **Фото в рамке** | `frame` | `calc.js` | `foto-v-ramke` | `framePrintCoeff × S(см²)` + паспарту + рамка | Паспарту, дефолтная рамка, фотопечать |
| **Портрет по стилю** | `portraitStyle` | `calc.js` | `portret-na-zakaz-po-foto-*` | Печать + лица (по стилю) + лак + рамка | 21 стиль рисования, `fixedFaces` |
| **Модульная картина** | — (IIFE) | `modular-calc.js` | `modulnaya-kartina` | `Σ(printCostᵢ)` для каждого модуля | 60+ пресетов, жесты, 13 форматов |
| **Фотоколлаж** | `canvas` (+ iframe) | `calc.js` + iframe | `fotokollazh-na-kholste` | Как canvas, но размер из конструктора | Конструктор в `<dialog>`, postMessage |

### Сравнение опций по типам

| Опция | `canvas` | `portrait` | `frame` | `portraitStyle` | Модульный |
|-------|----------|------------|---------|-----------------|-----------|
| Размер (ВхШ) | ✓ | ✓ | ✓ (мин. 20×30) | ✓ | ✓ (формат+раскладка) |
| Подрамник (3 типа) | ✓ | ✓ | — | ✓ | Только галерейный |
| Обработка фото | 3 уровня | — | 3 уровня | — | 3 уровня |
| Количество лиц | — | Select 1–10 | — | Select 1–10 | — |
| Выбор стиля | — | — | — | Select 21 стиль | — |
| Паспарту | — | — | ✓ (чекбокс) | — | — |
| Лак | ✓ | ✓ | — | ✓ | ✓ (по суммарной S) |
| Гель / Акрил / Масло / Поталь | — | ✓ | — | — | — |
| Цифровой макет | — | ✓ | — | — | — |
| Багет | ✓ | ✓ | ✓ (по умолч.) | ✓ | — |
| Подарочная упаковка | ✓ | ✓ | ✓ | ✓ | ✓ (× кол-во модулей) |
| Загрузка фото | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## 2. Файлы и порядок подключения

### Файлы

| Файл | Размер | Назначение |
|------|--------|------------|
| `src/html/js/prices.js` | ~220 строк | Единый конфиг цен (`MUSE_PRICES`: canvas, portrait, frame, portraitStyle) + тексты подсказок (`MUSE_TOOLTIPS`) |
| `src/html/js/calc.js` | ~2 548 строк | Движок калькулятора: UI, формулы для 4 типов, каталог рам, визуализатор |
| `src/html/js/uploader.js` | ~679 строк | Загрузчик изображений: drag-drop, валидация, ресайз |
| `src/html/js/modular-calc.js` | ~1 106 строк | Конструктор модульных картин: IIFE, пресеты, жесты, отдельная форма |
| `src/html/pechat/konstruktor-kollazha.html` | ~9 679 строк | Полноэкранный конструктор коллажей (загружается в iframe) |

### Порядок подключения в HTML

**Для CalcInit-страниц** (canvas / portrait / frame / portraitStyle):

```html
<!-- Реальный порядок на всех продуктовых страницах -->
<script defer src="js/nav.js"></script>
<script defer src="js/uploader.js"></script>
<script defer src="js/prices.js"></script>
<script defer src="js/calc.js?v=3"></script>
```

> **Важно:** `uploader.js` загружается **ДО** `calc.js`, потому что `CalcInit()` создаёт экземпляр `MuseUploader()` внутри себя. `prices.js` должен загрузиться до `calc.js`, иначе `MUSE_PRICES` будет undefined и калькулятор использует нулевой fallback (`MINIMAL_FALLBACK`).

**Для модульного калькулятора** (другой порядок):

```html
<script defer src="../js/nav.js"></script>
<script defer src="../js/prices.js"></script>
<script defer src="../js/uploader.js"></script>
<script defer src="../js/modular-calc.js"></script>
```

> `modular-calc.js` заменяет `calc.js` — используется **вместо** него, а не вместе.

### Версионирование скриптов

Большинство страниц подключают `calc.js?v=3`. Исключение — `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`, где используется `calc.js` без параметра версии. **Рекомендуется** привести к единообразию.

### Эталонный HTML

**Source of truth для разметки:** `src/html/calc.html` — автономная демо-страница.

Все изменения разметки калькулятора вносить **сначала в `calc.html`**, затем тиражировать на продуктовые страницы.

`calc.html` поддерживает выбор типа через URL-параметр: `?type=canvas`, `?type=portrait`, `?type=frame`, `?type=portraitStyle`. По умолчанию — `canvas`. Неизвестные значения игнорируются (fallback на `canvas`).

---

## 3. API `CalcInit(cfg)`

Единая точка входа — глобальная функция `CalcInit(cfg)` (определена в `calc.js`, строка 113).

### Параметры конфигурации

| Параметр | Тип | Обязателен | По умолчанию | Описание |
|----------|-----|------------|--------------|----------|
| `type` | `string` | Нет | `'canvas'` | Тип калькулятора: `'canvas'` \| `'portrait'` \| `'frame'` \| `'portraitStyle'` |
| `prices` | `object` | **Да** | `MINIMAL_FALLBACK` (всё по нулям) | Объект цен: `MUSE_PRICES.canvas` / `.portrait` / `.frame` / `.portraitStyle` |
| `tooltips` | `object` | Нет | `null` | Тексты подсказок: `MUSE_TOOLTIPS.canvas` / `.portrait` / `.frame` / `.portraitStyle` |
| `frames` | `array` | Нет | `DEFAULT_FRAMES` (27 рамок) | Массив объектов рамок для каталога багетов |
| `sizePresets` | `object` | Нет | `DEFAULT_SIZE_PRESETS` | Пресеты размеров: `{ PORTRAIT: [...], LANDSCAPE: [...], SQUARE: [...] }` |
| `interiors` | `array` | Нет | `DEFAULT_INTERIORS` | Фоны для визуализатора (сейчас 1 фон) |

### Допустимые значения `type`

| Значение | Конфиг цен | Конфиг подсказок | Build-функция | Формула |
|----------|-----------|-----------------|---------------|---------|
| `'canvas'` | `MUSE_PRICES.canvas` | `MUSE_TOOLTIPS.canvas` | Стандартная сборка секций | [§4.2](#42-формулы-canvas--portrait) |
| `'portrait'` | `MUSE_PRICES.portrait` | `MUSE_TOOLTIPS.portrait` | Стандартная + секции покрытий/лиц | [§4.2](#42-формулы-canvas--portrait) |
| `'frame'` | `MUSE_PRICES.frame` | `MUSE_TOOLTIPS.frame` | `buildFrameSections()` | [§4.4](#44-формулы-frame-фото-в-рамке) |
| `'portraitStyle'` | `MUSE_PRICES.portraitStyle` | `MUSE_TOOLTIPS.portraitStyle` | `buildPortraitStyleSections()` | [§4.3](#43-формулы-portraitstyle-портрет-по-стилю) |

Определение типов в коде (`calc.js`, строки 168–170):
```javascript
var isPortrait      = cfg.type === 'portrait';
var isFrame         = cfg.type === 'frame';
var isPortraitStyle = cfg.type === 'portraitStyle';
```

### Примеры вызова

**Фото на холсте:**
```javascript
CalcInit({
  type: 'canvas',
  prices: MUSE_PRICES.canvas,
  tooltips: MUSE_TOOLTIPS.canvas
});
```

**Портрет маслом:**
```javascript
CalcInit({
  type: 'portrait',
  prices: MUSE_PRICES.portrait,
  tooltips: MUSE_TOOLTIPS.portrait
});
```

**Фото в рамке:**
```javascript
CalcInit({
  type: 'frame',
  prices: MUSE_PRICES.frame,
  tooltips: MUSE_TOOLTIPS.frame
});
```

**Портрет по фото (выбор стиля):**
```javascript
CalcInit({
  type: 'portraitStyle',
  prices: MUSE_PRICES.portraitStyle,
  tooltips: MUSE_TOOLTIPS.portraitStyle
});
```

**Через URL-параметр (только calc.html):**
```
calc.html?type=frame
calc.html?type=portraitStyle
```

### Обязательные id элементов в HTML (DOM-контракт)

Калькулятор находит элементы по `id`. Если элемент отсутствует — секция пропускается без ошибки.

| id | Назначение | Обязателен |
|----|------------|------------|
| `calc` | Root-секция | Да |
| `calc-main-layout` | Грид layout (превью + панель) | Да |
| `uploader-zone` | Зона drag-drop загрузки | Да |
| `calc-preview-column` | Колонка превью (интерьер + холст) | Да |
| `size-section` | Секция выбора размера | Да |
| `inp-w`, `inp-h` | Поля ввода ширины / высоты | Да |
| `lbl-w`, `lbl-h` | Отображение текущих размеров на превью | Да |
| `size-presets-grid` | Контейнер пресетных кнопок | Да |
| `size-inputs-row` | Строка ручного ввода размеров | Да |
| `processing-select` | Select обработки фото (только canvas) | Для canvas |
| `toggle-varnish` | Чекбокс покрытия лаком | Да |
| `toggle-gift` | Чекбокс подарочной упаковки | Да |
| `varnish-gift-section` | Секция лака + упаковки | Да |
| `frame-section` | Секция выбора багета | Да |
| `frame-modal` | `<dialog>` модалка каталога багетов | Да |
| `frames-grid-studio` | Контейнер рамок STUDIO | Да |
| `frames-grid-classic` | Контейнер рамок CLASSIC | Да |
| `total-price` | Отображение итоговой цены | Да |
| `discount-text` | Текст скидки | Да |
| `order-form-container` | Контейнер формы заказа | Да |
| `client-name` | Поле имени | Да |
| `client-phone` | Поле телефона | Да |
| `client-email` | Поле email | Нет |
| `client-link` | Поле ссылки (на фото/ТЗ) | Нет |
| `client-comment` | Поле комментария | Нет |
| `btn-submit-order` | Кнопка отправки заказа | Да |
| `mobile-sticky-bar` | Мобильный sticky-бар | Да |
| `btn-sticky-order` | Кнопка в sticky-баре | Да |
| `lightbox` | Полноэкранный просмотр | Да |

### Атрибут `data-calc-root`

Рекомендуемый атрибут на `<section id="calc">` для внешних скриптов:

```html
<section id="calc" data-calc-root class="content-auto py-16 lg:py-20">
```

---

## 4. Ценообразование (`prices.js`)

### Архитектура конфига

```
MUSE_PRICES
├── canvas         = shared + processingOptions
├── portrait       = shared + лица + покрытия (гель, акрил, масло, поталь)
├── frame          = shared + framePrintCoeff + passepartout + defaultFrameId + processingOptions
└── portraitStyle  = shared + styles[] (21 стиль с faceFirst/faceExtra/fixedFaces)
```

```
MUSE_TOOLTIPS
├── canvas         = { varnish, gift }
├── portrait       = { faces, gel, acrylic, oil, potal, digitalMockup, varnish, gift }
├── frame          = { passepartout, gift }
└── portraitStyle  = { style, faces, varnish, gift }
```

**`shared`** — общие параметры, используемые во всех типах:
- Коэффициенты печати (площадь, периметр, константа)
- Цены подрамников (стандартный, толстый, рулон)
- Лак (коэффициент)
- Подарочная упаковка (ступенчатая по размерам)
- Багет (цена за погонный метр legacy-fallback, множитель для классических)

**`MUSE_PRICES.canvas`** добавляет:
- `processingOptions` — массив `[{ value: 0, label: 'Базовая' }, ...]`

**`MUSE_PRICES.portrait`** добавляет:
- `faceFirst`, `faceExtra` — цены за лица
- `digitalFaceFirst`, `digitalFaceExtra` — цены за лица в цифровом макете
- `gelCoeff`, `acrylicCoeff`, `oilCoeff`, `oilFaceExtra`, `potalCoeff` — покрытия

**`MUSE_PRICES.frame`** добавляет:
- `framePrintCoeff: 2.0631` — коэффициент печати на фотобумаге (0.0023 × 897)
- `passepartoutCoeff: 1` — коэффициент стоимости паспарту (S×1)
- `minWidth: 20`, `minHeight: 30` — минимальный размер
- `defaultFrameId: 'ST_BLACK_M'` — рамка, выбранная по умолчанию
- `processingOptions` — те же уровни обработки, что у canvas

**`MUSE_PRICES.portraitStyle`** добавляет:
- `faceExtra: 960` — общая стоимость дополнительного лица
- `styles: [...]` — массив из 21 стиля рисования (подробности → [§4.3](#43-формулы-portraitstyle-портрет-по-стилю))

### 4.1. Общие переменные

Все формулы — в функции `calculate()` файла `calc.js` (строка ~2019).

**Переменные:**
- `S = ширина × высота` (см²)
- `P = (ширина + высота) × 2` (см)

### 4.2. Формулы: canvas / portrait

| Позиция | Формула | Пример 30×40 см |
|---------|---------|-----------------|
| **Печать + подрамник** | `0.29·S + 0.04·P·stretcherPrice + 0.76·P + 1998.48` | ~2 632 р. (стандартный) |
| Подрамник стандартный | `stretcherPrice = 32` | — |
| Подрамник толстый | `stretcherPrice = 68` | ~2 834 р. |
| Рулон (без подрамника) | `stretcherPrice = 32` | ~2 632 р. |
| **Лак** | `S × 0.1` | 120 р. |
| **Гель** (только portrait) | `S × 0.375` | 450 р. |
| **Акрил** (только portrait) | `S × 1.05` | 1 260 р. |
| **Масло** (только portrait) | `S × 2 + (лица − 1) × 2 400` | 2 400 р. (1 лицо) |
| **Поталь** (только portrait) | `S × 0.3` | 360 р. |
| **Лицо** (первое) | `1 920 р.` | 1 920 р. |
| **Лицо** (каждое следующее) | `+960 р.` | — |
| **Лицо** (цифр. макет, первое) | `3 600 р.` | 3 600 р. |
| **Лицо** (цифр. макет, след.) | `+1 200 р.` | — |
| **Обработка** (только canvas) | Базовая: 0 / Оптимальная: 499 / Премиальная: 999 | — |
| **Упаковка** ≤50×70 | `650 р.` | 650 р. |
| **Упаковка** ≤60×90 | `750 р.` | — |
| **Упаковка** ≤90×120 | `1 200 р.` | — |
| **Упаковка** >90×120 | по согласованию | — |
| **Багет** (STUDIO) | `(P / 100) × 1 200` | ⚠️ демо — на продакшене у каждой рамы своя цена |
| **Багет** (CLASSIC) | `(P / 100) × 1 200 × 1.5` | ⚠️ демо — см. [раздел 6](#6-каталог-багетных-рам) |

**Итого:**
```
total = ceil(печать + лица + лак + гель + акрил + масло + поталь + упаковка + багет + обработка)
```

**Цифровой макет** (только portrait): при включении отменяются все физические опции (подрамник, покрытия, багет) — остаётся только стоимость лиц по цифровому тарифу.

### 4.3. Формулы: portraitStyle (портрет по стилю)

Реализовано в `calc.js`, строки 2026–2096. Функция `buildPortraitStyleSections()` (строки 692–969) строит UI.

**Ключевая особенность:** стоимость лица зависит от выбранного стиля рисования. Каждый стиль имеет собственные значения `faceFirst` и `faceExtra`.

| Позиция | Формула |
|---------|---------|
| **Лица** | `curStyle.faceFirst + max(0, faces − 1) × curStyle.faceExtra` |
| **Печать + подрамник** | `printSqCoeff × S + printPStrCoeff × P × stretcherPrice + printPBaseCoeff × P + printConst` (та же формула, что canvas) |
| **Лак** | `S × varnishCoeff` (если включён) |
| **Подарочная упаковка** | По `giftWrapTiers` (сравнение min/max dim с `maxW`/`maxH`) |
| **Багет** | `(P / 100) × framePpm` |
| **Итого** | `ceil(printCost + faceCost + varnishCost + giftCost + frameCost)` |

#### Таблица стилей (21 стиль)

Данные из `MUSE_PRICES.portraitStyle.styles[]` (`prices.js`, строки ~170–205):

| id | Название | faceFirst | faceExtra | fixedFaces | Примечание |
|----|----------|-----------|-----------|------------|------------|
| `OIL_STYLE` | Под масло | 1 920 | 960 | — | Стандартная цена |
| `WATERCOLOR` | Портрет акварелью | 1 920 | 960 | — | |
| `PENCIL` | Портрет карандашом | 1 920 | 960 | — | |
| `COSTUME` | Портрет в образе | 1 920 | 960 | — | |
| `CARICATURE` | Шарж по фото | 1 920 | 960 | — | |
| `MOSAIC` | Мозаика | 1 920 | 960 | — | |
| `MOSAIC_PRO` | Мозаика с прорисовкой | **3 840** | 960 | — | Premium: faceFirst ×2 |
| `DREAM_ART` | Дрим-арт портрет | 1 920 | 960 | — | |
| `BEAUTY_ART` | Бьюти-арт | 1 920 | 960 | — | |
| `POP_ART` | Поп-арт портрет | 1 920 | 960 | — | |
| `WPAP` | WPAP портрет | 1 920 | 960 | — | |
| `GRUNGE` | Гранж портрет | 1 920 | 960 | — | |
| `WORDS` | Из слов по фото | 1 920 | 960 | — | |
| `WORDS_PRO` | Из слов с прорисовкой | **3 840** | 960 | — | Premium: faceFirst ×2 |
| `FLOWER_ART` | Flower Art | 1 920 | 960 | — | |
| `COMICS` | Комикс | 1 920 | 960 | — | |
| `LOVEIS_PHOTO` | Love is...из фото | 2 280 | **0** | **2** | Фикс. 2 лица, select блокируется |
| `LOVEIS_DRAWN` | Рисованный Love is... | 2 880 | **0** | **2** | Фикс. 2 лица, select блокируется |
| `GRAFFITI` | Граффити | 1 920 | 960 | — | |
| `LOW_POLY` | Лоу-поли | 1 920 | 960 | — | |
| `FANTASY` | Фэнтези | 1 920 | 960 | — | |

**Особые правила:**
- Стили с `fixedFaces` (LOVEIS_*) — select количества лиц блокируется, значение принудительно устанавливается. `faceExtra: 0` означает, что дополнительные лица не добавляют стоимости.
- Стили с `faceFirst: 3840` (MOSAIC_PRO, WORDS_PRO) — premium-стили с удвоенной ценой первого лица.

#### DOM-элементы, создаваемые `buildPortraitStyleSections()`

Функция программно создаёт и вставляет следующие секции в панель калькулятора:

| Элемент | id / селектор | Описание |
|---------|--------------|----------|
| Select стиля | `#portrait-style-select` | Dropdown с 21 стилем из `PRICES.styles[]` |
| Секция стиля | `#portrait-style-section` | Обёртка select'а + бейдж |
| Select лиц | `#portrait-faces` | Dropdown 1–10 лиц |
| Секция лиц | `#portrait-faces-section` | Обёртка + бейдж |
| Секция лака | `#varnish-group-section` | Inline checkbox лака |
| Секция упаковки | (inline) | Inline checkbox подарочной упаковки |

**Порядок секций в панели:**
1. Размер → 2. Подрамник → 3. **Стиль портрета** → 4. **Количество лиц** → 5. Лак → 6. Багет → 7. Упаковка

#### Внутреннее состояние

- `STATE.style` — id текущего стиля (по умолч. `'OIL_STYLE'` или первый в массиве)
- `portraitStyleEls` — объект ссылок: `{ styleSelect, badgeStyle, facesSelect, badgeFaces, varnishSection, giftSection }`

### 4.4. Формулы: frame (фото в рамке)

Реализовано в `calc.js`, строки 2098–2161. Функция `buildFrameSections()` (строка ~973) строит UI.

**Ключевые отличия от canvas:**
- Используется `framePrintCoeff` вместо стандартной формулы площадь/периметр (фотопечать, не холст)
- Рамка выбрана **по умолчанию** (`defaultFrameId: 'ST_BLACK_M'`)
- Есть опция **паспарту**, добавляющая +10 см к периметру для расчёта стоимости рамки
- Минимальный размер: 20×30 см

| Позиция | Формула |
|---------|---------|
| **Печать на фотобумаге** | `framePrintCoeff × S` = `2.0631 × S(см²)` |
| **Паспарту** | `S × passepartoutCoeff` = `S × 1` (если включён) |
| **Обработка** | Базовая: 0 / Оптимальная: 499 / Премиальная: 999 |
| **Подарочная упаковка** | По `giftWrapTiers` |
| **Рамка** | `effPerimM × framePpm`, где `effPerim = (w + passAdd + h + passAdd) × 2`, `passAdd = 10 (если паспарту)` |
| **Итого** | `ceil(framePrintCost + passCost + frameCost + processing + giftCost)` |

**Пример 20×30 см (без паспарту):**
```
Печать = 2.0631 × 600 = 1 238 р.
Рамка  = (100 / 100) × 1 200 = 1 200 р. (ST_BLACK_M, STUDIO)
Итого  = ceil(1 238 + 1 200) = 2 438 р.
```

**С паспарту:**
```
Печать    = 2.0631 × 600 = 1 238 р.
Паспарту  = 600 × 1 = 600 р.
effPerim  = (20 + 10 + 30 + 10) × 2 = 140 см
Рамка     = (140 / 100) × 1 200 = 1 680 р.
Итого     = ceil(1 238 + 600 + 1 680) = 3 518 р.
```

#### Внутреннее состояние

- `STATE.passepartout` — `boolean`, OFF по умолчанию
- `STATE.frame` — устанавливается в `defaultFrameId` (`'ST_BLACK_M'`) при инициализации

### Матрица совместимости покрытий (portrait)

| | Лак | Гель | Акрил | Масло |
|---|---|---|---|---|
| **Лак** | — | ✗ | ✓ | ✗ |
| **Гель** | ✗ | — | ✗ | ✗ |
| **Акрил** | ✓ | ✗ | — | ✗ |
| **Масло** | ✗ | ✗ | ✗ | — |

При включении одного покрытия несовместимые автоматически отключаются в JS.

---

## 5. Как изменить цены

### Для менеджера (нетехнический процесс)

1. Составьте список изменений: что именно меняется (коэффициент печати? цена лица? стоимость упаковки?)
2. Передайте задачу разработчику
3. Разработчик вносит изменения → деплой (5–15 минут)
4. Проверьте калькулятор на 2–3 страницах: откройте, выберите размер 30×40, сравните итоговую цену с ожидаемой
5. Подтвердите корректность

### Для разработчика

**Файл:** `src/html/js/prices.js`

**Шаг 1.** Найдите нужный параметр в объекте `shared` (общие) или в `canvas`/`portrait` (специфичные).

**Шаг 2.** Измените значение.

**Шаг 3.** Поиск упоминаний цен в HTML:
```bash
grep -r "от [0-9]" src/html/
```
Цены упоминаются в SEO-текстах на страницах (`«от N р.»`), в JSON-LD, в meta description. Обновите их при необходимости.

**Шаг 4.** Проверьте в браузере:
- Откройте `calc.html` (демо-эталон)
- Выберите размер 30×40
- Сравните итог с ожидаемым
- Проверьте портретный режим (портретная страница)

**Шаг 5.** Деплой: `git commit && git push` → Vercel автодеплой.

### Примеры частых изменений

**Изменить цену стандартного подрамника:**
```javascript
// В prices.js → shared
stretcherStandard: 32,  // ← изменить это число
```

**Изменить цену первого лица:**
```javascript
// В prices.js → portrait extras
faceFirst: 1920,  // ← изменить это число
```

**Добавить новый уровень обработки фото:**
```javascript
// В prices.js → canvas extras
processingOptions: [
  { value: 0,    label: 'Базовая' },
  { value: 499,  label: 'Оптимальная' },
  { value: 999,  label: 'Премиальная' },
  { value: 1499, label: 'VIP' }           // ← добавить строку
]
```

---

## 6. Каталог багетных рам

### ⚠️ Текущий статус — ДЕМО-ЗАГЛУШКА

Текущие 27 рам в `DEFAULT_FRAMES` — это **демо для разработки**, НЕ реальный каталог. **На продакшене рамы в текущем виде показывать нельзя** — лучше скрыть секцию багета, чем отображать несуществующие рамы с неверными ценами.

### Сравнение с оригиналом (muse.ooo)

| | **Оригинал (muse.ooo)** | **Наша реализация (демо)** |
|---|---|---|
| Количество рам | ~40 | 27 |
| Визуализация | Реальные фото рам (`/upload/bagets/*.jpeg`) | CSS-бордер с цветом |
| Ценообразование | **Индивидуальная цена за каждую раму** (10+ уровней: от 1 575 до 4 612 р. при размере 20×30) | 2 уровня: STUDIO 1 200 р/м, CLASSIC 1 800 р/м |
| Наличие | Управляется с сервера (скрыть/показать из админки) | Нельзя скрыть без правки JS и деплоя |
| Превью на холсте | Текстурный рендер: углы + горизонтальные/вертикальные стороны рамы (реальные фото текстуры) | CSS border одного цвета |
| Каталог в модалке | Фото рамы + индивидуальная цена | Цветной квадрат + цена по категории |

### Что нужно для продакшена

При интеграции с Bitrix программист подключит реальный каталог рам с сервера. Каждая рама должна содержать:
- Реальное фото рамы (`imageUrl`)
- Индивидуальную цену за погонный метр (`pricePerM`)
- Флаг наличия (`available`)

Подробный контракт API → [раздел 15.3](#153-каталог-рамок).

### Текущая демо-структура (для разработки)

27 рамок захардкожены в `DEFAULT_FRAMES` в `calc.js` (строки 21–48). Делятся на 2 категории:

| Категория | Количество | Ценовой множитель | Примеры |
|-----------|------------|-------------------|---------|
| **STUDIO** | 15 | ×1 (1 200 р/м) | Черный мат, Белый мат, Алюм. серебро, Венге |
| **CLASSIC** | 12 | ×1.5 (1 800 р/м) | Золото узор, Махагон, Бронза антик, Прованс |

### Демо-структура записи рамки

```javascript
{
  id: 'ST_BLACK_M',          // Уникальный ID
  name: 'Черный мат',        // Отображаемое имя
  cat: 'STUDIO',             // Категория: 'STUDIO' или 'CLASSIC'
  color: '#1a1a1a',          // Цвет для CSS-превью (демо)
  width: 12,                 // Ширина рамки в px (для визуализатора)
  style: 'flat',             // Стиль: flat | metallic | wood | ornate_gold и др.
  border: '#e2e8f0'          // (опционально) цвет внешнего контура
}
```

### Целевая структура (после интеграции с сервером)

```javascript
{
  id: 1,                     // ID из базы данных Bitrix
  name: '981-01',            // Название/артикул рамы
  cat: 'STUDIO',             // Категория (или устаревает — у каждой рамы своя цена)
  pricePerM: 3294,           // Индивидуальная цена за погонный метр (руб.)
  imageUrl: '/upload/bagets/516f.jpeg',  // Фото рамы
  available: true,           // Есть на складе
  // CSS-поля (color, width, style) → опциональный fallback
}
```

### Демо-формула цены рамки (текущая)

```
Цена = (периметр_холста_в_метрах) × 1200 р.
Для CLASSIC: × 1.5
```

### Целевая формула (после интеграции)

```
Цена = (периметр_холста_в_метрах) × frame.pricePerM
```

Каждая рама имеет свою цену за погонный метр, категорийный множитель не нужен.

### Как рамки отображаются сейчас (демо)

- Визуализатор рисует рамку **CSS-бордером** заданного цвета и ширины
- Для стилей `ornate_gold` / `ornate_silver` используется `border-image` с CSS-градиентом
- Превью пользовательского фото отображается внутри рамки

### Как должно быть (target)

- В модалке: `<img src="imageUrl">` вместо цветного квадрата
- На превью холста: текстурный рендер как на оригинале (углы + стороны) или `border-image` с фото текстуры рамы
- Рамы с `available: false` — не показываются
- Рамы с `imageUrl: null` — CSS-fallback (текущий рендер)

---

## 7. Загрузчик изображений (`uploader.js`)

### Что делает

Клиентский JavaScript-компонент для загрузки, превью и управления фотографиями. Работает полностью в браузере — **сервер не используется** (файлы хранятся в памяти как blob-URL и data-URL).

### API `MuseUploader(config)`

```javascript
var uploader = MuseUploader({
  maxFiles: 20,                          // Максимум файлов
  maxSizeMB: 10,                         // Максимум размер 1 файла (МБ)
  acceptTypes: ['image/jpeg', ...],      // Разрешённые MIME-типы
  acceptExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  dropZoneSelector: '#uploader-zone',    // Зона drag-drop
  thumbnailsSelector: '#uploader-thumbnails',
  fileInputSelector: '#file-upload',     // <input type="file">
  alertSelector: '#uploader-alert',      // Контейнер для уведомлений
  statusSelector: '#uploader-status',    // Для screen reader (aria-live)
  enableDragDrop: true,
  batchSize: 5,                          // Файлов за один batch
  alertDuration: 4000,                   // Время показа уведомления (мс)
  onImagesChange: function(images) {},   // Callback: список фото изменился
  onActiveImageChange: function(img) {}  // Callback: активное фото изменилось
});
```

### Публичные методы

| Метод | Описание |
|-------|----------|
| `uploader.addFiles(fileList)` | Добавить файлы программно |
| `uploader.removeImage(id)` | Удалить фото по ID |
| `uploader.getImages()` | Получить массив всех фото (копия) |
| `uploader.getActiveImage()` | Получить активное фото |
| `uploader.setActiveImage(id)` | Установить активное фото |
| `uploader.clear()` | Удалить все фото |
| `uploader.destroy()` | Уничтожить экземпляр, снять обработчики |
| `uploader.openFilePicker()` | Открыть диалог выбора файла |
| `uploader.getCount()` | Количество загруженных фото |
| `uploader.showAlert(msg, type)` | Показать уведомление (`'error'` / `'warning'` / `'success'`) |
| `uploader.hideAlert()` | Скрыть уведомление |

### Объект изображения

Каждое загруженное фото — объект:

```javascript
{
  id: 'img_1708..._1',       // Уникальный ID
  objectUrl: 'blob:...',      // Blob-URL оригинала (для памяти)
  previewUrl: 'data:...',     // Ресайзенная копия ≤1000px (для превью/lightbox)
  thumbUrl: 'data:...',       // Ресайзенная копия ≤120px (для полосы миниатюр)
  dataUrl: 'data:...',        // Обратная совместимость с calc.js (= previewUrl)
  name: 'photo.jpg',          // Имя файла
  size: 1234567,              // Размер в байтах
  type: 'image/jpeg',         // MIME-тип
  width: 4000,                // Оригинальная ширина (px)
  height: 3000                // Оригинальная высота (px)
}
```

### Оптимизация на клиенте

- Загруженные фото ресайзятся через `<canvas>`: превью ≤1000 px, миниатюры ≤120 px (JPEG quality 0.85)
- Используется `URL.createObjectURL()` → blob-URL вместо `FileReader.readAsDataURL()`
- При удалении/очистке вызывается `URL.revokeObjectURL()` для освобождения памяти
- Экономия: ~4 МБ/фото → ~53 КБ превью + ~3 КБ миниатюра

### Обязательные элементы в HTML

| Селектор | Тег | Назначение |
|----------|-----|------------|
| `#uploader-zone` | `<div>` | Зона drag-drop (визуальная область) |
| `#uploader-thumbnails` | `<div>` | Полоса миниатюр загруженных фото |
| `#file-upload` | `<input type="file">` | Скрытый input для выбора файлов |
| `#uploader-alert` | `<div>` | Контейнер уведомлений об ошибках |
| `#btn-upload-empty` | `<button>` | Кнопка «Загрузить фото» |
| `#uploader-status` | `<div aria-live="polite">` | Объявления для screen reader |

### Связь с калькулятором

`CalcInit()` создаёт `MuseUploader()` внутри себя и подписывается на callbacks:

- `onImagesChange` → обновляет `STATE.images` и отображение количества
- `onActiveImageChange` → обновляет превью холста в визуализаторе (фон фото внутри рамки)

### Чего НЕ делает загрузчик

- **Не отправляет фото на сервер** — файлы хранятся только в памяти браузера
- **Не сохраняет между сессиями** — при перезагрузке страницы всё теряется
- **Не валидирует содержимое** (DPI, минимальное разрешение) — отменено

**→ Интеграционное требование:** серверный endpoint для приёма файлов → см. [раздел 15](#15-требования-к-серверной-части).

---

## 8. Форма заказа

### Текущее состояние

Форма заказа — часть калькулятора. Валидация на клиенте **работает**, отправка — **заглушка**.

### Поля формы

| Поле | id | Обязательное | Валидация |
|------|----|-------------|-----------|
| Имя | `client-name` | Да | Не пустое |
| Телефон | `client-phone` | Да | Не пустое, ≥16 символов |
| Email | `client-email` | Нет | — |
| Ссылка (на фото/ТЗ) | `client-link` | Нет | — |
| Комментарий | `client-comment` | Нет | — |

### Данные, которые собирает форма

При «отправке» формируется объект `orderData`:

```javascript
{
  client: {
    name: 'Иван',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    link: 'https://disk.yandex.ru/...',
    comment: 'Подарок на день рождения'
  },
  product: {
    width: 40,
    height: 60,
    wrap: 'STANDARD',          // STANDARD | GALLERY | NO_FRAME
    frame: 'ST_BLACK_M',       // ID рамки или 'NONE'
    varnish: true,
    gift: false,
    interior: 'GIRL',
    processing: 0,             // 0 | 499 | 999 (только canvas)
    // Только для portrait:
    faces: 2,
    gel: false,
    acrylic: false,
    oil: true,
    potal: false,
    digitalMockup: false
  },
  totalPrice: '12 450 р.'
}
```

### Текущая заглушка

```javascript
console.log('Заказ отправлен:', orderData);
alert('Спасибо! Ваш заказ оформлен.');
```

**→ Интеграционное требование:** заменить на `fetch()` к серверному endpoint → см. [раздел 15](#15-требования-к-серверной-части).

---

## 9. Модульный калькулятор (`modular-calc.js`)

### Обзор

Полностью отдельный JS-компонент (IIFE, 1 106 строк) для конструирования модульных картин. **Не использует `CalcInit()`** — имеет собственную функцию `init()`, которая вызывается автоматически при `DOMContentLoaded`.

**Страница:** `src/html/pechat/modulnaya-kartina.html`

**Зависимости:**
- `prices.js` — использует `MUSE_PRICES.canvas` (коэффициенты печати, лака, упаковки)
- `uploader.js` — создаёт экземпляр `MuseUploader()` для загрузки фото

### Архитектура

```
modular-calc.js (IIFE)
├── Константы: SCALE, GAP_CM, MIN/MAX_MODULE
├── Цены: P = MUSE_PRICES.canvas (с fallback)
├── generatePresets() → PRESETS[] (60+ раскладок)
├── FORMAT_PRESETS[] (13 форматов)
├── calculateModulePrintCost(w, h)
├── calculateTotals() → State.totals
├── Gesture system (drag, resize, pinch-to-zoom)
├── Render (workspace, sidebar, tabs)
└── init() → авто-запуск
```

### Константы

```javascript
var SCALE = 4;          // px per cm (масштаб отображения)
var GAP_CM = 3;         // зазор между модулями, см
var MIN_MODULE = 15;    // минимальная сторона модуля, см
var MAX_MODULE_W = 150; // максимальная ширина модуля
var MAX_MODULE_H = 100; // максимальная высота модуля
```

### 60+ пресетов раскладки

Функция `generatePresets()` (строки ~155–250) создаёт массив `PRESETS` с раскладками для 1–16 модулей.

Каждый пресет: `{ count, modules: [{ w, h, ot }], cols? }`
- `w`, `h` — размер модуля в см (относительные, масштабируются к выбранному формату)
- `ot` — offset top в % (вертикальный сдвиг модуля для художественного эффекта)
- `cols` — количество колонок (для grid-раскладки)

**`MODULE_COUNTS`** — доступные варианты количества модулей: `[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16]`.

### 13 форматов

`FORMAT_PRESETS` (строки 254–268):

| Формат | Размер (targetW×targetH) | Пропорции |
|--------|--------------------------|-----------|
| 1:1 | 100×100 | Квадрат |
| 2:3 | 80×120 | Вертикальный |
| 3:2 | 120×80 | Горизонтальный |
| 3:4 | 90×120 | Вертикальный |
| 4:3 | 120×90 | Горизонтальный |
| 16:9 | 160×90 | Широкий |
| 9:16 | 90×160 | Высокий |
| 2:1 | 150×75 | Панорама |
| 1:2 | 75×150 | Вертикальная панорама |
| 3:1 | 150×50 | Широкая панорама |
| 1:3 | 50×150 | Высокая панорама |
| 5:4 | 100×80 | Почти квадрат |
| 4:5 | 80×100 | Почти квадрат вертикально |

### Формулы расчёта

**Печать одного модуля** (`calculateModulePrintCost`, строка 275):
```
printCostᵢ = printSqCoeff × Sᵢ + printPStrCoeff × Pᵢ × stretcherGallery + printPBaseCoeff × Pᵢ + printConst
```

> Всегда используется **галерейная натяжка** (`stretcherGallery = 68`), т.к. модульные картины вешаются без рамы.

**Общий расчёт** (`calculateTotals`, строка 285):

| Позиция | Формула |
|---------|---------|
| **Печать** | `Σ calculateModulePrintCost(wᵢ, hᵢ)` для каждого модуля |
| **Лак** | `totalArea × varnishCoeff` (суммарная площадь всех модулей) |
| **Обработка** | Фиксированная сумма (`State.processing`) |
| **Упаковка** | По `giftWrapTiers` **× количество модулей** (каждый модуль упаковывается отдельно) |
| **Итого** | `ceil(totalPrint + varnishCost + processingCost + giftCost)` |

Результат сохраняется в `State.totals = { fullWidth, fullHeight, price, printCost, varnishCost, processingCost, giftCost, giftLabel, totalArea, moduleCount }`.

### Gesture-система

Реализована в строках ~490–560. Поддерживает:

| Режим | Действие | В каком mode |
|-------|----------|-------------|
| **drag** (image) | Панорамирование загруженного фото (`State.imagePan.x/y`) | Image mode |
| **drag** (layout) | Resize/перетаскивание модуля по краям (`'e'`/`'w'`/`'s'`/`'n'`) | Layout mode |
| **pinch** | Zoom фото (`State.imageZoom`) | Image mode (touch) |

- Использует `requestAnimationFrame` для плавности (`Gesture.rafId`)
- Зажимы: `clampW(v)` = `max(MIN_MODULE, min(MAX_MODULE_W, v))`, аналогично `clampH`

### Tabbed-сайдбар

4 вкладки в сайдбаре:
1. **Формат** — выбор соотношения сторон
2. **Раскладка** — выбор пресета модулей
3. **Опции** — лак, обработка, подарочная упаковка
4. **Заказ** — форма оформления

### DOM-контракт (обязательные id)

| id | Назначение |
|----|------------|
| `mc-workspace` | Рабочая область (привязка жестов, touch/mouse events) |
| `mc-btn-mode-layout` | Кнопка переключения в режим Layout |
| `mc-btn-mode-image` | Кнопка переключения в режим Image |
| `mc-btn-zoom-in` | Zoom in |
| `mc-btn-zoom-out` | Zoom out |
| `mc-btn-center` | Центрировать/сбросить zoom |
| `mc-uploader-zone` | Зона drag-drop загрузки |
| `mc-uploader-thumbs` | Миниатюры загруженных фото |
| `mc-file-input` | `<input type="file">` |
| `mc-uploader-alert` | Контейнер уведомлений загрузчика |
| `mc-btn-upload` | Кнопка «Загрузить фото» |
| `mc-uploader-status` | Статус загрузки (aria-live) |
| `mc-sticky-btn` | Мобильная sticky-кнопка |
| `mc-size-label` | Метка текущего размера |
| `mc-order-form` | Форма заказа |
| `mc-client-name` | Имя клиента |
| `mc-client-phone` | Телефон клиента |
| `mc-client-email` | Email |
| `mc-client-link` | Ссылка |
| `mc-client-comment` | Комментарий |
| `mc-btn-submit-order` | Кнопка отправки заказа |

### Onboarding

- При первом посещении показывается toast-подсказка
- Флаг `localStorage.getItem('mc-hint-shown')` — чтобы не показывать повторно
- Диалог `calc-hint-dialog` для развёрнутых подсказок

### Адаптивность

- Desktop: workspace + sidebar рядом
- Mobile: `data-mobile-layout="split"` / `"sheet"` — workspace наверху, sidebar внизу
- `ResizeObserver` на workspace (fallback: `window resize`)

---

## 10. Конструктор фотоколлажей

### Обзор

Конструктор фотоколлажей — полноэкранный редактор, загружаемый в `<iframe>` из отдельного HTML-файла. После того как пользователь создаёт коллаж, результат передаётся на родительскую страницу через `postMessage` и автоматически загружается в калькулятор canvas.

**Родительская страница:** `src/html/pechat/fotokollazh-na-kholste.html`
**Конструктор:** `src/html/pechat/konstruktor-kollazha.html` (~9 679 строк)

### Архитектура

```
fotokollazh-na-kholste.html (родитель)
├── <button id="open-constructor-btn">
├── <dialog id="constructor-modal">
│   └── <iframe id="constructor-iframe">
│         └── konstruktor-kollazha.html (конструктор)
├── CalcInit({ type: 'canvas' })
└── window.addEventListener('message', handler)
          ↑
          postMessage({ type: 'MUSE_COLLAGE_ORDER', dataUrl, format })
```

### DOM-элементы

| id | Тег | Назначение |
|----|-----|------------|
| `open-constructor-btn` | `<button>` | Кнопка «Открыть конструктор» |
| `constructor-modal` | `<dialog>` | Полноэкранная модалка |
| `constructor-iframe` | `<iframe>` | Контейнер конструктора коллажей |
| `close-constructor-btn` | `<button>` | Кнопка закрытия модалки |

### Ленивая загрузка iframe

`src` у iframe устанавливается **только при первом открытии** — `openConstructor()` устанавливает `iframe.src = 'konstruktor-kollazha.html'` один раз.

### PostMessage-протокол

Конструктор отправляет результат через:
```javascript
parent.postMessage({
  type: 'MUSE_COLLAGE_ORDER',
  dataUrl: 'data:image/png;base64,...',  // итоговое изображение коллажа
  format: '4:3'                          // формат коллажа (ключ из COLLAGE_FORMAT_MAP)
}, '*');
```

### COLLAGE_FORMAT_MAP

Маппинг формата коллажа → размер печати (9 форматов):

| Формат | Размер печати (ВxШ, см) |
|--------|-------------------------|
| `4:3` | 40×30 |
| `3:4` | 30×40 |
| `3:2` | 45×30 |
| `2:3` | 30×45 |
| `1:1` | 40×40 |
| `2:1` | 60×30 |
| `1:2` | 30×60 |
| `3:1` | 90×30 |
| `1:3` | 30×90 |

### Обработка полученного коллажа

При получении `MUSE_COLLAGE_ORDER` на родительской странице (строки 1021–1089):

1. `dataUrl` → `Blob` → `File('collage.png')`
2. Закрытие модалки: `closeConstructor()`
3. **Форсированная инициализация**: если `!window.__MUSE_CALC_BOOTED__` → вызывается `CalcInit({ type: 'canvas', ... })`
4. Передача файла в загрузчик: `window.__museUploader.addFiles([file])` (fallback: установка `files` на `#file-upload`)
5. Установка размера: `window.__museCalcSetSize(w, h)` через `setTimeout(200ms)`
6. Скролл к `#calc`

---

## 11. Lazy-инициализация

### Паттерн

Все страницы с калькулятором используют **IntersectionObserver** для отложенной инициализации: `CalcInit()` вызывается только когда секция `#calc` приближается к viewport.

### Стандартная реализация (calc.html, foto-na-kholste, foto-v-ramke, fotokollazh-na-kholste)

```javascript
document.addEventListener('DOMContentLoaded', function () {
  var calcRoot = document.querySelector('[data-calc-root]');
  if (!calcRoot) return;

  function startCalc() {
    if (window.__MUSE_CALC_BOOTED__) return;   // guard — один раз
    window.__MUSE_CALC_BOOTED__ = true;
    CalcInit({ type: '...', prices: MUSE_PRICES.xxx, tooltips: MUSE_TOOLTIPS.xxx });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function(e) { return e.isIntersecting; })) {
        observer.disconnect();
        if ('requestIdleCallback' in window) {
          requestIdleCallback(startCalc, { timeout: 800 });
        } else {
          setTimeout(startCalc, 0);
        }
      }
    }, { rootMargin: '300px 0px' });
    observer.observe(calcRoot);
  } else {
    startCalc();  // fallback для старых браузеров
  }
});
```

### Вариация на portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html

```javascript
var calcRoot = document.getElementById('calc');
var booted = false;
var obs = new IntersectionObserver(function(entries) {
  if (booted) return;
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      booted = true;
      obs.disconnect();
      CalcInit({ type: 'portraitStyle', ... });
      break;
    }
  }
}, { rootMargin: '200px' });
obs.observe(calcRoot);
```

**Отличия:**
- `rootMargin: '200px'` вместо `'300px 0px'`
- Локальная переменная `booted` вместо глобальной `window.__MUSE_CALC_BOOTED__`
- Нет `requestIdleCallback`

### Модульный калькулятор

`modular-calc.js` **не использует IntersectionObserver** — вызывает `init()` сразу при `DOMContentLoaded`:
```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

---

## 12. Глобальные переменные и хуки

### Глобальные объекты данных

| Переменная | Файл | Описание |
|------------|------|----------|
| `window.MUSE_PRICES` | `prices.js` | Конфиг цен: `{ canvas, portrait, frame, portraitStyle }`. Заморожен (`Object.freeze`) |
| `window.MUSE_TOOLTIPS` | `prices.js` | Тексты подсказок: `{ canvas, portrait, frame, portraitStyle }`. Заморожен |
| `window.CalcInit` | `calc.js` (строка 113) | Глобальная функция инициализации калькулятора |

### Публичные runtime-хуки

| Переменная | Файл | Когда создаётся | Описание |
|------------|------|-----------------|----------|
| `window.__MUSE_CALC_BOOTED__` | HTML-страницы | При первом вызове `startCalc()` | Флаг одноразовой инициализации. Предотвращает повторный `CalcInit()` |
| `window.__museUploader` | `calc.js` (строка 1649) | Внутри `CalcInit()` | Ссылка на экземпляр `MuseUploader`. Используется конструктором коллажей для `addFiles()` |
| `window.__museCalcSetSize(w, h)` | `calc.js` (строка 1653) | Внутри `CalcInit()` | Функция программной установки размера. Используется конструктором коллажей |
| `window._mcUploader` | `modular-calc.js` (строка ~997) | Внутри `init()` | Ссылка на экземпляр `MuseUploader` модульного калькулятора |

### Использование хуков

**Конструктор коллажей** (fotokollazh-na-kholste.html) использует:
- `__MUSE_CALC_BOOTED__` — для проверки, нужна ли форсированная инициализация
- `__museUploader.addFiles([file])` — для передачи результата коллажа в калькулятор
- `__museCalcSetSize(w, h)` — для установки размера по формату коллажа

---

## 13. Реестр страниц с калькулятором

### Продуктовые страницы

| Страница | Тип | JS-файлы | Особенности | rootMargin |
|----------|-----|----------|-------------|------------|
| `src/html/calc.html` | URL-param | prices, calc, uploader | Демо-эталон, `?type=` выбор типа | 300px |
| `src/html/pechat/foto-na-kholste-sankt-peterburg.html` | `canvas` | prices, calc, uploader | Стандартный canvas | 300px |
| `src/html/pechat/pechat-na-kholste-sankt-peterburg.html` | `canvas` | prices, calc, uploader | Стандартный canvas | 300px |
| `src/html/pechat/foto-v-ramke.html` | `frame` | prices, calc, uploader | Фотопечать + паспарту + дефолтная рамка | 300px |
| `src/html/pechat/fotokollazh-na-kholste.html` | `canvas` + iframe | prices, calc, uploader | + `<dialog>` конструктор коллажей + postMessage | 300px |
| `src/html/pechat/modulnaya-kartina.html` | — (IIFE) | prices, **modular-calc**, uploader | Полностью другой калькулятор | — (сразу) |
| `src/html/portret-na-zakaz/style/portret-maslom.html` | `portrait` | prices, calc, uploader | Покрытия (gel, acrylic, oil, potal), лица, цифровой макет | 300px |
| `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | `portraitStyle` | prices, calc, uploader | 21 стиль рисования, select стиля | 200px |

### Порядок подключения скриптов по страницам

| Страница | Порядок |
|----------|---------|
| `calc.html` | `nav → uploader → prices → calc.js?v=3` |
| `foto-na-kholste-*`, `foto-v-ramke`, `fotokollazh-*`, `portret-maslom` | `nav → uploader → prices → calc.js?v=3` |
| `portret-na-zakaz-po-foto-*` | `nav → uploader → prices → calc.js` (**без ?v=3**) |
| `modulnaya-kartina` | `nav → prices → uploader → modular-calc.js` |

---

## 14. Архитектура: варианты и приоритеты

### Назначение Vercel-стенда

Vercel — **временный тестовый стенд** для проверки статических страниц. Он не заменяет production-сервер. На Vercel нет серверной логики: заказы не отправляются, фото не загружаются, каталог рамок — демо. Production-сайт будет работать на Bitrix-сервере muse.ooo после интеграции.

### Четыре варианта архитектуры

| | **A. File-based** | **B. Hybrid-light** | **C. Hybrid-full** | **D. Полный серверный** |
|---|---|---|---|---|
| **Статус** | ✅ Текущий | 👉 Рекомендуется при интеграции | На будущее | ❌ Отклонён |
| **Что с сервера** | Ничего | Рамы (фото, цены, наличие) | Рамы + все цены | Всё, включая расчёт |
| **Что локально** | Всё | Формулы, цены печати, UI | Формулы, UI | Только UI |
| **Сложность** | Минимальная | Средняя | Выше средней | Высокая |
| **Скорость расчёта** | 1–5 мс, 0 запросов | 1–5 мс (после загрузки рам) | 1–5 мс (после загрузки цен) | 100–500 мс на каждый клик |
| **Lighthouse** | 95–100 | 95–100 | 90–95 | 70–85 |
| **Управление рамами** | Правка JS + деплой | Из админки Bitrix | Из админки Bitrix | Из админки Bitrix |
| **Управление ценами** | Правка JS + деплой | Правка JS + деплой | Из админки Bitrix | Из админки Bitrix |

### A. File-based (текущий) — для этапа разработки

Всё в JS-файлах, 0 серверных зависимостей. Калькулятор работает автономно на Vercel.

**Плюсы:** максимальная скорость, работает на любом хостинге, Lighthouse 95–100.

**Минусы:**
1. Изменение цен = правка JS + деплой (5–15 мин + разработчик)
2. Рамы — демо-заглушка (см. [раздел 6](#6-каталог-багетных-рам))
3. Заказ не отправляется (заглушка `console.log`)
4. Фото не загружаются на сервер

**Когда достаточен:** пока сайт на Vercel и интеграция с Bitrix не началась.

### B. Hybrid-light (рекомендуется при интеграции)

С сервера приходит **только каталог рам** (`/api/frames.json`): фото, индивидуальные цены, наличие. Всё остальное — локально.

**Почему именно этот вариант:**
- Основная бизнес-проблема — управление наличием рам. Рамы заканчиваются нерегулярно, менеджер должен скрывать их без разработчика.
- У каждой рамы на оригинале **своя цена** (от 1 575 до 4 612 р.) — нельзя свести к 2 категориям.
- Цены печати и покрытий меняются редко (1 раз в 1–2 месяца) — для них file-based достаточен.

**Трудозатраты:** ~2ч фронтенд + ~4ч бэкенд.

**Что сделать программисту:**
1. Серверный endpoint `GET /api/frames.json` → контракт в [разделе 15.3](#153-каталог-рамок)
2. В `calc.js`: `fetch('/api/frames.json')` → фильтр по `available` → перерисовка каталога
3. Fallback: если API недоступен → используются `DEFAULT_FRAMES`

### C. Hybrid-full (на будущее)

С сервера — **все цены + рамы**. Формулы и UI — локально.

**Когда оправдан** (2 и более условий):
- Цены меняются чаще 1 раза в месяц
- Появляются маркетинговые акции (скидки, промокоды)
- Менеджер должен сам менять цены без участия разработчика
- Количество продуктовых страниц превышает 30

### D. Полный серверный расчёт — ОТКЛОНЁН

Каждый клик → запрос к API → сервер считает цену → ответ.

**Почему отклонён:**
- +100–500 мс задержки на каждое действие пользователя
- Зависимость от доступности сервера
- Нет преимуществ по точности — клиентский расчёт с серверными данными даёт тот же результат мгновенно

### Что НЕ рекомендуется

- **React/Vue/фреймворки** — добавляют 40–50 KB JS, замедляют загрузку. Текущий `calc.js` (25 KB) работает мгновенно
- **Калькулятор как Bitrix-компонент** (серверный рендер) — привязывает к Bitrix-серверу, блокирует деплой на Vercel

### Обязательные endpoint'ы (при любом варианте кроме A)

Независимо от выбранного варианта, для production нужны минимум 2 endpoint'а:
- `POST /api/order` — приём заказа → [раздел 15.1](#151-отправка-заказа)
- `POST /api/upload` — загрузка фото → [раздел 15.2](#152-загрузка-фото)

### Оценка трудозатрат

| Компонент | Фронтенд | Бэкенд |
|-----------|----------|--------|
| **Endpoint рамок** (`GET /api/frames.json`) | ~2ч (fetch + fallback) | ~4ч (CRUD + endpoint) |
| **Endpoint заказа** (`POST /api/order`) | ~2ч (fetch вместо alert) | ~8ч (валидация, БД, уведомления) |
| **Загрузка фото** (`POST /api/upload`) | ~3ч (multipart upload) | ~6ч (приём, хранение, очистка) |
| **Endpoint цен** (`GET /api/prices.json`) | ~1ч (fetch + merge) | ~4ч (выгрузка из Bitrix) |

---

## 15. Требования к серверной части

### Минимальный контракт (для запуска в production)

Для полноценной работы калькулятора на продакшене серверная сторона должна предоставить **2 обязательных endpoint'а**:

#### 15.1. Отправка заказа

```
POST /api/order
Content-Type: application/json

{
  "client": {
    "name": "Иван",
    "phone": "+7 (999) 123-45-67",
    "email": "ivan@example.com",
    "link": "https://...",
    "comment": "..."
  },
  "product": {
    "width": 40, "height": 60,
    "wrap": "STANDARD",
    "frame": "ST_BLACK_M",
    "varnish": true, "gift": false,
    "processing": 0,
    "faces": 2, "oil": true,
    ...
  },
  "totalPrice": 12450,
  "photos": ["upload-id-1", "upload-id-2"]
}

→ 200 OK { "orderId": "12345", "message": "..." }
→ 422 Validation Error { "errors": [...] }
```

**Важно:** `totalPrice` — справочное значение, рассчитанное на клиенте. Сервер должен **пересчитать цену** по своим формулам/таблицам и использовать свою сумму для бизнес-процессов (предотвращение манипуляции через DevTools).

#### 15.2. Загрузка фото

```
POST /api/upload
Content-Type: multipart/form-data

file: <binary>

→ 200 OK { "id": "upload-uuid", "url": "/uploads/preview/..." }
→ 413 File Too Large
→ 415 Unsupported Media Type
```

Ограничения:
- Максимум 20 файлов на заказ
- Максимум 10 МБ на файл
- Форматы: JPEG, PNG, GIF, WebP

### Рекомендуемые endpoint'ы (Hybrid-light)

#### 15.3. Каталог рамок

```
GET /api/frames.json

→ 200 OK
[
  {
    "id": 1,
    "name": "981-01",
    "cat": "STUDIO",
    "pricePerM": 3294,
    "imageUrl": "/upload/bagets/516f.jpeg",
    "available": true
  },
  {
    "id": 4,
    "name": "Без багета",
    "cat": "NONE",
    "pricePerM": 0,
    "imageUrl": null,
    "available": true
  },
  ...
]
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | `number` | Да | ID рамы из БД Bitrix |
| `name` | `string` | Да | Название/артикул рамы |
| `cat` | `string` | Нет | Категория (`STUDIO` / `CLASSIC` / `NONE`). Используется для группировки в UI |
| `pricePerM` | `number` | Да | Индивидуальная цена за погонный метр (руб.). **Не категорийная, а уникальная для каждой рамы** |
| `imageUrl` | `string\|null` | Да | URL фото рамы. Если null → CSS-fallback |
| `available` | `boolean` | Да | Есть на складе. `false` → рама не показывается |

**Примечание о ценах рам:** на оригинале muse.ooo цены варьируются от 1 575 до 4 612 р. при размере 20×30 (периметр 1 м). Это значит `pricePerM` от ~1 575 до ~4 612 р/м. У каждой рамы **своя цена**, а не 2 категорийных уровня.

**Формула расчёта в калькуляторе:**
```
frameCost = (периметр_холста_м) × frame.pricePerM
```

**Fallback:** если endpoint недоступен → используются захардкоженные `DEFAULT_FRAMES` (демо-данные, все рамки показываются с условными ценами).

#### 15.4. Конфиг цен (на будущее, при переходе к Hybrid-full)

```
GET /api/prices.json

→ 200 OK
{
  "canvas": { "printSqCoeff": 0.29, ... },
  "portrait": { "faceFirst": 1920, ... }
}
```

Формат идентичен `MUSE_PRICES` из `prices.js`. Калькулятор делает `mergePrices(apiPrices, localFallback)`.

---

## 16. Удобство управления ценами

### Текущее состояние

Все ценовые параметры хранятся в одном JS-файле — `src/html/js/prices.js` (24 числовых значения + тексты подсказок). Редактировать может **только разработчик** с доступом к Git.

**Полный набор параметров (без багета):**

| Группа | Параметры | Кол-во | Формат |
|--------|-----------|--------|--------|
| Печать + подрамник | `printSqCoeff`, `printPStrCoeff`, `printPBaseCoeff`, `printConst`, `stretcherStandard`, `stretcherGallery`, `stretcherRoll` | 7 | Коэффициенты и числа |
| Покрытия | `varnishCoeff`, `gelCoeff`, `acrylicCoeff`, `oilCoeff`, `oilFaceExtra`, `potalCoeff` | 6 | Коэффициенты |
| Портрет — лица | `faceFirst`, `faceExtra`, `digitalFaceFirst`, `digitalFaceExtra` | 4 | Фикс. цены (руб.) |
| Обработка фото | `processingOptions` (3 уровня: label + value) | 3×2 | Текст + число |
| Подарочная упаковка | `giftWrapTiers` (3 tier'а), `giftWrapOversizeLabel` | 3+1 | Число + текст |

**Текущий workflow:**
1. Менеджер составляет список изменений
2. Передаёт разработчику (мессенджер / трекер)
3. Разработчик правит `prices.js`, обновляет SEO-тексты на 20+ страницах
4. `git push` → Vercel деплой (5–15 мин)
5. Менеджер проверяет

### Проблемы

| # | Проблема | Влияние |
|---|----------|--------|
| 1 | **Разработчик в цепочке** | Задержка 15–60 мин на любое изменение цены |
| 2 | **Синтаксис JS** | Пропущенная запятая ломает калькулятор на ВСЕХ страницах |
| 3 | **Коэффициенты вместо понятных цен** | Менеджер не может перевести `printSqCoeff: 0.29` в «холст 30×40 = 2 632 р.» |
| 4 | **SEO-тексты рассинхронизируются** | Цены «от X р.» на 20+ страницах требуют ручного обновления |
| 5 | **Нет валидации** | Нет защиты от отрицательных значений, нулей, строк вместо чисел |
| 6 | **Нет превью до деплоя** | Нельзя увидеть результат без локального Live Server |
| 7 | **Одна точка отказа** | Один файл `prices.js` = все страницы ломаются одновременно |
| 8 | **Нет бизнес-лога** | Только Git-коммиты, нет записи «когда и почему менялась цена» |

### Варианты решения — от простого к сложному

#### P1. Visual Editor на calc.html (рекомендуется сейчас)

HTML-форма в `<dialog>` на демо-странице `calc.html`. Менеджер вводит параметры, видит мгновенный результат в калькуляторе, нажимает «Скопировать» или «Скачать готовый prices.js».

**Возможности:**
- Все параметры в виде `<input type="number">` с русскими названиями
- Валидация: min/max, step, подсветка ошибок
- Мгновенный пересчёт калькулятора при изменении любого поля
- Справочная таблица: «при размере 30×40 цена = X р.» — автоматически
- Экспорт: «Скопировать JSON», «Скачать prices.js»
- SEO-предупреждение: список страниц с упоминанием цен

**Pipeline после экспорта:**
- **Вариант «через разработчика»:** менеджер отправляет JSON/файл → разработчик вставляет → `git push`
- **Вариант «через GitHub»:** менеджер скачивает готовый `prices.js` → загружает через GitHub Web UI → автодеплой

**Трудозатраты:** ~4–6ч фронтенд (только calc.html, не затрагивает продуктовые страницы).

**Ограничения:** pipeline «файл → деплой» остаётся. SEO-тексты обновляются вручную.

#### P2. Внешний JSON-конфиг + fetch (при интеграции)

Калькулятор загружает цены из `prices.json` (`fetch('/api/prices.json')`). Менеджер заменяет файл через CMS или файл-менеджер хостинга. Fallback на встроенные значения из `prices.js` при ошибке fetch.

**Требования:**
- Endpoint `GET /api/prices.json` — формат совпадает с `MUSE_PRICES` (см. [§15.4](#154-конфиг-цен-на-будущее-при-переходе-к-hybrid-full))
- Или статический файл на сервере (менеджер загружает через Bitrix файлменеджер)
- В `calc.js`: `fetch` → `mergePrices(apiPrices, localFallback)` → `CalcInit()`
- Кэширование: `Cache-Control: max-age=300` (5 мин)

**Трудозатраты:** ~1ч фронтенд (fetch + merge) + ~4ч бэкенд (endpoint/админка).

**Когда оправдан:** интеграция с Bitrix уже идёт; менеджер имеет доступ к файлменеджеру сервера.

#### P3. Админ-панель в Bitrix CMS (будущее)

Полноценная форма в админке Bitrix: менеджер меняет цены → сохраняет → `prices.json` обновляется автоматически → калькулятор подхватывает при следующей загрузке страницы.

**Требования:**
- Bitrix-компонент: форма редактирования всех параметров из таблицы выше
- При сохранении: генерация `prices.json` или обновление записи в инфоблоке
- Версионирование: Bitrix хранит историю изменений
- Валидация на сервере: нельзя сохранить некорректные значения
- Опционально: визуальный калькулятор-превью прямо в админке

**Трудозатраты:** ~8–12ч бэкенд (Bitrix-компонент + валидация + версионирование).

**Когда оправдан:** цены меняются чаще 1 раза в месяц; менеджер должен работать полностью автономно.

### Критерии перехода между вариантами

| Условие | P1 → P2 | P2 → P3 |
|---------|---------|--------|
| Интеграция с Bitrix началась | ✅ | — |
| Менеджер меняет цены >1 раз/мес | ✅ | — |
| Появились акции/промокоды | — | ✅ |
| Нужна история изменений с бизнес-логом | — | ✅ |
| Менеджер не должен касаться GitHub | — | ✅ |
| Более 30 продуктовых страниц | — | ✅ |



### SEO-тексты с ценами: единый источник

При **любом** варианте управления ценами (P1/P2/P3) остаётся проблема: цены «от X р.» захардкожены в HTML на 24 страницах. При изменении коэффициентов в `prices.js` все эти цены рассинхронизируются.

#### Масштаб проблемы

| Тип упоминания | Файлов | Примеры |
|----------------|--------|---------|
| `<meta name="description">` | 3 | `от 2391 р.`, `от 2451 ₽`, `от 4371 р.` |
| JSON-LD `FAQPage` | 3 | 5–11 числовых цен в structured data |
| Hero-текст (первый экран) | 3 | `от 2391 р.` |
| FAQ-таблица (11 строк × 1–3 колонки) | 3 | 30×40 → 90×120, `2 773 р.` → `7 140 р.` |
| «От X руб.» в тексте (без таблиц) | 18 | Страницы стилей портретов |
| Цены доставки/сервиса | 4 | `450 р.`, `235 р.`, `990 р.` |
| Калькулятор placeholder | 3 | `0 р.`, `890 р.` — заменяются JS |

**Итого: ~140 мест с хардкодными ценами в 24 HTML-файлах.**

#### Страницы с FAQ-таблицами цен

Только 3 страницы содержат полноценные прайс-таблицы, рассчитываемые по формуле из `prices.js`:

| Страница | FAQ-вопрос | Колонки таблицы |
|----------|-----------|-----------------|
| `foto-na-kholste-sankt-peterburg.html` | «Сколько стоит фото на холсте?» | Размер / Цена |
| `pechat-na-kholste-sankt-peterburg.html` | «Сколько стоит печать на холсте?» | Размер / В рулоне / На подрамнике |
| `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | «Сколько стоит портрет по фото на холсте?» | Размер / 1 лицо / 2 лица / 3 лица |

Все три таблицы используют набор из **11 стандартных размеров**: 30×40, 40×40, 40×50, 40×60, 50×50, 50×60, 50×70, 60×80, 60×90, 80×120, 90×120 (с минимальными вариациями: `pechat-na-kholste` заменяет 50×60 на 60×60).

#### Варианты решения

| | **S1. Ручной** | **S2. Build-скрипт** | **S3. JS-инъекция** | **S4. Серверный рендер (Bitrix)** |
|---|---|---|---|---|
| **Статус** | ✅ Текущий | Возможен сейчас | Возможен сейчас | 👉 Целевой |
| **SEO: meta, JSON-LD** | ✓ Цена в исходнике | ✓ Цена в исходнике | ✗ Невидимо без JS | ✓ Цена в исходнике |
| **SEO: текст на странице** | ✓ | ✓ | ✓ (Google рендерит JS) | ✓ |
| **Автоматизация** | Нет | Частичная (при билде) | Полная (при загрузке) | Полная |
| **Риск рассинхрона** | Высокий | Низкий | Низкий | Нулевой |
| **Зависимость от сервера** | Нет | Нет | Нет | Да (Bitrix) |

##### S1. Ручное обновление (текущий)

```bash
grep -r "от [0-9]" src/html/     # найти все упоминания цен
grep -r "₽\|р\.\|руб" src/html/  # расширенный поиск
```

При каждом изменении коэффициентов разработчик вручную пересчитывает и обновляет ~140 мест. **Проблема:** трудоёмко, высокий риск пропустить файл.

##### S2. Build-скрипт (возможен на текущем стенде)

Node.js-скрипт, который запускается при `npm run build:once`. Читает `prices.js`, вычисляет цены для стандартных размеров, подставляет в HTML.

**Подход с маркерами:**

В HTML-файлах хардкодные цены заменяются на маркеры:

- `{{PRICE_CANVAS_MIN}}` → минимальная цена canvas (20×30)
- `{{PRICE_CANVAS_30x40}}` → цена для размера 30×40
- `{{PRICE_PORTRAIT_1FACE_30x40}}` → портрет, 1 лицо, 30×40
- `{{PRICE_DELIVERY_COURIER}}` → цена курьера

Скрипт находит маркеры и заменяет на вычисленные числа.

**Плюсы:** SEO видит реальную цену в исходнике; работает на Vercel без сервера.
**Минусы:** нужен дополнительный шаг сборки; HTML-файлы содержат маркеры вместо читаемых чисел; при работе с HTML нужно помнить про маркеры.

**Трудозатраты:** ~4ч (скрипт + миграция маркеров в 24 файла).

##### S3. JS-инъекция на клиенте (возможна на текущем стенде)

Скрипт `price-inject.js` загружается на каждой странице, читает `MUSE_PRICES` и подставляет вычисленные цены в элементы с `data-price-*` атрибутами:

```html
<!-- Вместо: <span>от 2391 р.</span> -->
<span data-price-min="canvas">от … р.</span>

<!-- Вместо: <td>2 773 р.</td> -->
<td data-price-calc="canvas:30x40:standard">…</td>
```

**Плюсы:** полная автоматизация; один источник правды; работает на Vercel.
**Минусы:** meta description и JSON-LD нельзя обновить через JS (они читаются до исполнения скриптов). Для видимого контента на странице — работает, для SEO-критичных элементов — нет.

**Область применения:** FAQ-таблицы, hero-текст, «От X руб.» — всё видимое на странице. **Не подходит** для meta description и JSON-LD.

**Трудозатраты:** ~3ч (скрипт + миграция data-атрибутов).

##### S4. Серверный рендер через Bitrix (целевое решение)

Bitrix хранит ценовые параметры в инфоблоке (те же 24 числа из `prices.js`). PHP-шаблон страницы вычисляет цены серверно и подставляет во все места.

**Что делает PHP:**

1. Читает конфиг из инфоблока → получает коэффициенты
2. `calculatePrice($w, $h, $params)` — серверная копия формулы из `calc.js`
3. Подставляет `$minPrice` в meta description и JSON-LD
4. Генерирует FAQ-таблицу циклом по массиву стандартных размеров
5. Генерирует `prices.js` из того же конфига → калькулятор и статичные цены гарантированно совпадают

**Схема:**

```
Bitrix-инфоблок «Цены»
├── PHP-шаблон → meta description, JSON-LD, FAQ-таблица, hero-текст
└── PHP-генератор → prices.js → calc.js (калькулятор)
```

**Плюсы:** единый источник; SEO получает цены в HTML-исходнике; менеджер меняет цену в одном месте → обновляется везде.
**Минусы:** работает только на Bitrix-сервере, не на Vercel.

**Пример PHP-шаблона для FAQ-таблицы:**

```php
<?php
$sizes = [[30,40],[40,40],[40,50],[40,60],[50,50],[50,60],[50,70],[60,80],[60,90],[80,120],[90,120]];
foreach ($sizes as [$w, $h]):
    $price = calculatePrice($w, $h, $canvasPrices);
?>
<tr>
    <td><?= $w ?>×<?= $h ?> см</td>
    <td><?= number_format($price, 0, '', ' ') ?> р.</td>
</tr>
<?php endforeach; ?>
```

**Пример PHP для meta description:**

```php
<?php $minPrice = calculatePrice(20, 30, $canvasPrices); ?>
<meta name="description" content="...цена от <?= number_format($minPrice, 0, '', ' ') ?> р.">
```

**Трудозатраты:** ~6ч бэкенд (инфоблок + PHP-функция расчёта + генератор `prices.js` + шаблоны).

#### Рекомендуемая стратегия

| Этап | Решение | Что покрывает |
|------|---------|---------------|
| **Сейчас** (Vercel) | S1 — ручное обновление | Всё |
| **При интеграции с Bitrix** | S4 — серверный рендер | meta, JSON-LD, FAQ-таблицы, hero-тексты, `prices.js` |

**Почему не S2/S3 для промежуточного этапа:** цены меняются редко (~1 раз в 1–2 месяца), трудозатраты на build-скрипт или JS-инъекцию (~3–4ч) не окупятся до интеграции с Bitrix. Ручное обновление при текущей частоте изменений — приемлемо.

#### Контракт для Bitrix-разработчика

**Серверная функция расчёта** должна воспроизводить формулу из `calc.js`:

| Формула | Выражение |
|---------|-----------|
| Площадь | `S = w × h` |
| Периметр | `P = 2(w + h)` |
| Базовая цена (canvas) | `ceil(0.29·S + 0.04·P·32 + 0.76·P + 1998.48)` |
| Портрет, 1 лицо | `base + 1920` |
| Портрет, N лиц | `base + 1920 + (N−1) × 960` |
| Минимальная цена | `calculatePrice(20, 30, ...)` |

**Параметры инфоблока** — те же 24 числа, что в `MUSE_PRICES` (см. [§4](#4-ценообразование-pricesjs)), плюс сервисные цены:

| Параметр | Значение | Описание |
|----------|----------|----------|
| `DELIVERY_COURIER` | 450 | Курьер по СПб |
| `DELIVERY_PVZ` | 235 | Пункт выдачи |
| `PREPAYMENT` | 990 | Предоплата |

**Генерация `prices.js`:** при сохранении конфига → PHP формирует файл с `window.MUSE_PRICES = {...}` и `window.MUSE_TOOLTIPS = {...}`. Формат — идентичен текущему `prices.js`. Кэш: инвалидация при сохранении.

**Стандартные размеры для FAQ-таблиц:**

```php
$FAQ_SIZES = [[30,40],[40,40],[40,50],[40,60],[50,50],[50,60],[50,70],[60,80],[60,90],[80,120],[90,120]];
// Для pechat-na-kholste заменить 50×60 → 60×60
```
---

## Глоссарий

| Термин | Значение |
|--------|----------|
| **calc.html** | Эталонная демо-страница калькулятора (source of truth для разметки). Поддерживает `?type=` URL-параметр |
| **CalcInit** | Глобальная JS-функция — единая точка входа для инициализации калькулятора. 4 типа: `canvas`, `portrait`, `frame`, `portraitStyle` |
| **MuseUploader** | Глобальная JS-функция — загрузчик изображений |
| **MUSE_PRICES** | Глобальный объект с ценами (из `prices.js`): `{ canvas, portrait, frame, portraitStyle }`. Заморожен |
| **MUSE_TOOLTIPS** | Глобальный объект с текстами подсказок (из `prices.js`): `{ canvas, portrait, frame, portraitStyle }`. Заморожен |
| **MINIMAL_FALLBACK** | Нулевой конфиг цен в `calc.js` — используется, если `prices.js` не загружен |
| **DEFAULT_FRAMES** | Массив 27 рамок в `calc.js` — каталог багетов (демо-данные для разработки) |
| **STATE** | Внутренний объект состояния калькулятора (размер, опции, выбранная рамка, стиль и т.д.) |
| **modular-calc.js** | Отдельный JS-компонент (IIFE) — конструктор модульных картин, не использует `CalcInit()` |
| **konstruktor-kollazha.html** | Полноэкранный конструктор фотоколлажей, загружается в iframe через `<dialog>` |
| **COLLAGE_FORMAT_MAP** | Маппинг формата коллажа → размер печати (9 форматов), используется для передачи размера из конструктора в калькулятор |
| **__MUSE_CALC_BOOTED__** | Глобальный флаг (`window`), предотвращающий повторную инициализацию `CalcInit()` |
| **__museUploader** | Глобальная ссылка (`window`) на экземпляр `MuseUploader`, созданный внутри `CalcInit()` |
| **__museCalcSetSize** | Глобальная функция (`window`) для программной установки размера холста |
| **_mcUploader** | Глобальная ссылка (`window`) на экземпляр `MuseUploader` модульного калькулятора |
| **Подрамник** | Деревянная рама, на которую натягивается холст: стандартный (2 см), толстый (4 см), рулон (без подрамника) |
| **Паспарту** | Цветной картонный кант между фотографией и рамой (опция для типа `frame`) |
| **Поталь** | Имитация сусального золота/серебра для покрытия участков картины |
