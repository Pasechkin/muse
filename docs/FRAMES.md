# FRAMES.md — Система багетных рам (frames.js)

> **Дата:** июль 2025
> **Файл:** `src/html/js/frames.js` (~160 строк)
> **Экспорт:** `window.MUSE_FRAMES`
> **Связанные разделы:** [CALCULATOR.md §6](CALCULATOR.md#6-каталог-багетных-рам), [CALCULATOR.md §15.3](CALCULATOR.md#153-каталог-рамок)

---

## 1. Назначение

`frames.js` — единый модуль каталога багетных рам, подключаемый **до** `calc.js` / `modular-calc.js` / `reproduction-search.js`. Содержит:

- Массив из **27 демо-рам** (`DEFAULT_FRAMES`)
- Ценовые константы (`PRICE_STUDIO`, `PRICE_CLASSIC`)
- Утилиты: расчёт цены, CSS-превью, хэш-таблица, форматирование чисел

⚠️ **Статус — ДЕМО-ЗАГЛУШКА.** Текущие данные предназначены только для разработки. На продакшене каталог должен приходить с сервера (см. [Roadmap](#7-roadmap)).

---

## 2. Подключение (порядок скриптов)

```html
<script src="js/nav.js" defer></script>
<script src="js/uploader.js" defer></script>
<script src="js/prices.js" defer></script>
<script src="js/frames.js" defer></script>        <!-- ← ДО calc.js -->
<script src="js/calc.js?v=3" defer></script>
```

`calc.js` при инициализации читает `window.MUSE_FRAMES.DEFAULT_FRAMES`. Если `frames.js` не загружен — ошибка.

---

## 3. Структура данных

### 3.1. Ценовые константы

| Константа | Значение | Описание |
|-----------|----------|----------|
| `PRICE_STUDIO` | 1 200 р/м | Демо-цена STUDIO (flat, metallic, wood) |
| `PRICE_CLASSIC` | 1 800 р/м | Демо-цена CLASSIC (ornate, carved, shabby) |

### 3.2. Поля объекта рамы

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | Уникальный ID (`ST_BLACK_M`, `CL_GOLD_ORN` и т.д.) |
| `name` | `string` | Отображаемое имя («Черный мат», «Золото узор») |
| `cat` | `string` | Категория: `STUDIO` или `CLASSIC` |
| `color` | `string` | HEX-цвет для CSS-превью |
| `width` | `number` | Ширина профиля рамы (px для визуализатора) |
| `style` | `string` | Визуальный стиль (см. [§3.3](#33-стили-рам)) |
| `border` | `string?` | Опционально — цвет внешнего контура (outline) |
| `pricePerM` | `number\|null` | Цена за погонный метр (руб.). `null` = «Без багета» |
| `imageUrl` | `null` | Зарезервировано для фото рамы. Сейчас всегда `null` |
| `available` | `boolean` | Флаг наличия. Сейчас всегда `true` |

### 3.3. Стили рам

| Стиль | CSS-рендер | Категория |
|-------|------------|-----------|
| `flat` | `border: Npx solid <color>` | STUDIO |
| `metallic` | `border: Npx solid <color>` | STUDIO / CLASSIC |
| `wood` | `border: Npx solid <color>` | STUDIO / CLASSIC |
| `ornate_gold` | `border-image: linear-gradient(135deg, gold…)` | CLASSIC |
| `ornate_silver` | `border-image: linear-gradient(135deg, silver…)` | CLASSIC |
| `ornate_gold_inner` | `border-image: dark gradient` + `outline: 2px solid gold` | CLASSIC |
| `wood_gloss` | `border: Npx solid <color>` | CLASSIC |
| `wood_carved` | `border: Npx solid <color>` | CLASSIC |
| `shabby` | `border: Npx solid <color>` | CLASSIC |

---

## 4. Каталог: 27 рам

### STUDIO (15 шт.)

| ID | Название | Цвет | Ширина | Стиль |
|----|----------|------|--------|-------|
| `NONE` | Без багета | transparent | 0 | flat |
| `ST_BLACK_M` | Черный мат | `#1a1a1a` | 12 | flat |
| `ST_WHITE_M` | Белый мат | `#ffffff` | 12 | flat |
| `ST_GREY` | Серый графит | `#475569` | 12 | flat |
| `ST_SILVER_S` | Серебро сатин | `#cbd5e1` | 10 | metallic |
| `ST_GOLD_S` | Золото сатин | `#eab308` | 10 | metallic |
| `ST_BLUE_DP` | Синий дип | `#1e3a8a` | 15 | flat |
| `ST_RED_BR` | Красный кирпич | `#991b1b` | 15 | flat |
| `ST_BEIGE` | Бежевый | `#f5f5dc` | 12 | flat |
| `ST_ALU_BLK` | Алюм. черный | `#000` | 5 | metallic |
| `ST_ALU_SIL` | Алюм. серебро | `#94a3b8` | 5 | metallic |
| `ST_ALU_GLD` | Алюм. золото | `#ca8a04` | 5 | metallic |
| `ST_WENGE` | Венге | `#3f2e26` | 14 | wood |
| `ST_OAK_L` | Светлый дуб | `#d4a373` | 14 | wood |
| `ST_WALNUT` | Орех | `#5D4037` | 14 | wood |

### CLASSIC (12 шт.)

| ID | Название | Цвет | Ширина | Стиль |
|----|----------|------|--------|-------|
| `CL_GOLD_ORN` | Золото узор | `#d4af37` | 40 | ornate_gold |
| `CL_SILV_ORN` | Серебро узор | `#c0c0c0` | 40 | ornate_silver |
| `CL_MAHOGANY` | Махагон | `#4a0404` | 35 | wood_gloss |
| `CL_VINT_WHT` | Винтаж белый | `#f0f0f0` | 30 | shabby |
| `CL_BRONZE` | Бронза антик | `#cd7f32` | 35 | metallic |
| `CL_BLK_GLD` | Черный с золотом | `#1a1a1a` | 45 | ornate_gold_inner |
| `CL_ITALY_WD` | Итал. орех | `#654321` | 50 | wood_carved |
| `CL_PROVANCE` | Прованс | `#e5e7eb` | 25 | shabby |
| `CL_GOLD_LG` | Золото широкое | `#ffd700` | 60 | ornate_gold |
| `CL_SILV_LG` | Серебро широкое | `#e2e8f0` | 60 | ornate_silver |
| `CL_CHERRY` | Вишня | `#722F37` | 30 | wood |
| `CL_PINE` | Сосна лак | `#E3C08D` | 25 | wood |

---

## 5. Экспортируемые функции (`window.MUSE_FRAMES`)

| Функция | Сигнатура | Описание |
|---------|-----------|----------|
| `buildFrameMap(frames)` | `Array → Object` | Хэш-таблица `{ id → frame }` для быстрого поиска |
| `getFramePrice(frame, w, h, fallbackPerM?, classicMult?)` | `→ number` | Цена рамы по периметру. Формула: `Math.ceil((w+h)*2/100 × ppm)`. Fallback 1200, classicMult 1.5 |
| `getFramePreviewCSS(frame)` | `→ Object` | CSS-стили для превью: `{ border, outline, borderImage, borderColor, boxShadow }` |
| `fmtPrice(n)` | `→ string` | Число → строка с пробелами-разделителями (`12450` → `"12 450"`) |
| `DEFAULT_FRAMES` | `Array` | Массив 27 демо-рам |

### Формула цены (подробно)

```
perimeter_m = (width_cm + height_cm) × 2 / 100
effectivePPM = frame.pricePerM ?? fallbackPerM × (cat === 'CLASSIC' ? classicMult : 1)
frameCost    = Math.ceil(perimeter_m × effectivePPM)
```

### CSS-превью (алгоритм `getFramePreviewCSS`)

1. `frame.id === 'NONE'` → `border: none`, тень без рамки
2. Ширина clamped: `Math.max(4, Math.min(frame.width, 20))` px — чтобы демо выглядело адекватно
3. `style === 'ornate_gold'` → `border-image: linear-gradient(135deg, #d4af37, #f5e5a0, #c5972c, #f5e5a0, #d4af37) 1`
4. `style === 'ornate_silver'` → `border-image: linear-gradient(135deg, #c0c0c0, #f0f0f0, #a0a0a0, #f0f0f0, #c0c0c0) 1`
5. `style === 'ornate_gold_inner'` → тёмный gradient + `outline: 2px solid #d4af37`
6. Остальные → `border: Npx solid <color>`

---

## 6. UX-процесс выбора рамы (в calc.js)

1. Пользователь видит секцию `#frame-section` с кнопкой «Выбрать багет»
2. Клик → открывается `<dialog id="frame-modal">`
3. В модалке — 2 вкладки: **STUDIO** (`#frames-grid-studio`) и **CLASSIC** (`#frames-grid-classic`)
4. Каждая рама отрисована как цветной квадрат (CSS-рендер) + название + цена
5. Пользователь выбирает раму → модалка закрывается
6. На превью холста (`canvas-preview`) отрисовывается CSS-бордер выбранной рамы
7. Цена рамы добавляется к итоговой стоимости

### DOM-элементы (генерируются `buildFrameSections()` в calc.js)

| ID | Роль |
|----|------|
| `frame-section` | Родительская секция |
| `frame-modal` | `<dialog>` каталога |
| `frames-grid-studio` | Grid контейнер STUDIO |
| `frames-grid-classic` | Grid контейнер CLASSIC |

---

## 7. Roadmap

### 7.1. Ближайшее (при интеграции с Bitrix)

| # | Задача | Описание |
|---|--------|----------|
| 1 | **Реальные фото** | Заполнить `imageUrl` реальными фото рам (`/upload/bagets/*.jpeg`) |
| 2 | **Индивидуальные цены** | Каждая рама получает свой `pricePerM` (от ~1 575 до ~4 612 р/м) |
| 3 | **Управление наличием** | `available: false` → рама скрывается из каталога без деплоя |
| 4 | **API endpoint** | `GET /api/frames.json` — контракт в [CALCULATOR.md §15.3](CALCULATOR.md#153-каталог-рамок) |
| 5 | **Fallback** | Если API недоступен → `DEFAULT_FRAMES` как fallback |

### 7.2. Целевая архитектура

```
[Bitrix Admin] → POST /api/frames → [БД]
                                        ↓
[calc.js] ← fetch('/api/frames.json') ← [PHP endpoint]
                ↓ (fallback)
          DEFAULT_FRAMES (frames.js)
```

### 7.3. Целевая структура записи (с сервера)

```javascript
{
  id: 1,                                    // ID из БД Bitrix
  name: '981-01',                           // Артикул
  cat: 'STUDIO',                            // Категория (для группировки в UI)
  pricePerM: 3294,                          // Индивидуальная цена (руб/м)
  imageUrl: '/upload/bagets/516f.jpeg',     // Фото
  available: true                           // На складе
}
```

### 7.4. Что НЕ менять

- `frames.js` остаётся как **fallback-модуль** даже после подключения API
- Формула расчёта (`периметр × pricePerM`) не меняется — просто `pricePerM` станет индивидуальным
- CSS-превью сохраняется как fallback, если `imageUrl === null`

---

## 8. Известные ограничения

| # | Ограничение | Статус |
|---|-------------|--------|
| 1 | `imageUrl` всегда `null` — нет реальных фото | Ждёт интеграции |
| 2 | `pricePerM` — 2 уровня (1200/1800) вместо индивидуальных | Ждёт интеграции |
| 3 | `available` всегда `true` — нельзя скрыть раму | Ждёт интеграции |
| 4 | ~~CSS-бордер вместо текстурного рендера~~ | **Решено** — см. §9 |
| 5 | 27 рам вместо ~40 на оригинале | Достаточно для демо |
| 6 | Нет сортировки/фильтрации в UI | Низкий приоритет |

---

## 9. Рендеринг настоящих багетных текстур (Подход B — DOM-композиция)

> **Дата решения:** июль 2025
> **Статус:** ✅ Демо готово — ожидает интеграции в калькулятор
> **Тестовая страница:** `draft/baget-test.html`

### 9.1. Суть решения

Вместо CSS-бордеров рама вокруг фотографии собирается в **браузере** из настоящих JPEG-текстур багета:

- **Полоска** (`1.jpeg`) — вертикальный фрагмент профиля, повторяемый вдоль стороны
- **Уголок** (`2.jpeg`) — угловое соединение (под 45°)

Сервер только хранит картинки. Никакого серверного рендеринга не требуется.

### 9.2. Сравнение подходов (протестированы все три)

| Подход | Описание | Вердикт |
|--------|----------|---------|
| **A — border-image** | CSS `border-image` + `border-image-slice` | Работает, но сложно управлять углами |
| **B — DOM-композиция** ✅ | 8 `<div>` (4 стороны + 4 угла) с `background` и `transform` | **Выбран** — прост, нативен, легко интегрируется |
| **C — Canvas** | `<canvas>` + `drawImage()` + `createPattern()` | Работает, но избыточная сложность |

Все три визуально идентичны. Выбран B за простоту поддержки.

### 9.3. Архитектура DOM-рендера (Подход B)

```
┌──────────────────────────────────────┐
│            frame-wrapper             │  position: relative
│  ┌─────┬────────────────────┬─────┐  │
│  │ TL  │       TOP          │ TR  │  │  corner / strip-x
│  ├─────┼────────────────────┼─────┤  │
│  │     │                    │     │  │
│  │ L   │    <img> photo     │  R  │  │  strip-y / content
│  │     │                    │     │  │
│  ├─────┼────────────────────┼─────┤  │
│  │ BL  │      BOTTOM        │ BR  │  │  corner / strip-x
│  └─────┴────────────────────┴─────┘  │
└──────────────────────────────────────┘
```

**8 элементов:**
- 4 стороны (`<div>`) — `background: url(strip) repeat-x/y`, размер и трансформация
- 4 угла (`<div>` с `<img>`) — масштабирование через `transform: scale()`

### 9.4. Геометрия полоски (1.jpeg)

Исходная картинка — **левая** вертикальная сторона рамы:
- Правый край = **внутренний** (к картине)
- Левый край = **внешний**

| Сторона | Трансформация | Повтор |
|---------|---------------|--------|
| Left | as-is | `repeat-y` |
| Right | `scaleX(-1)` | `repeat-y` |
| Top | поворот **+90° CW** | `repeat-x` |
| Bottom | поворот **−90° CCW** | `repeat-x` |

> ⚠️ Направление поворота критично: при +90° CW внутренний край (правый в оригинале) оказывается внизу — к картине. При -90° CCW — вверху, тоже к картине.

### 9.5. Геометрия уголка (2.jpeg)

Исходный уголок — **верхний левый** (top-left):

| Угол | Трансформация |
|------|---------------|
| TL (top-left) | as-is |
| TR (top-right) | `scaleX(-1)` |
| BL (bottom-left) | `scaleY(-1)` |
| BR (bottom-right) | `scale(-1, -1)` |

### 9.6. Ширина рамы в пикселях

Реальная ширина профиля каждого багета хранится в поле `widthMm`. Для экранного отображения:

```
frameW_px = widthMm × 0.8
```

Коэффициент 0.8 подобран эмпирически для баланса между реалистичностью и удобством превью.

### 9.7. Исходные данные — 39 реальных багетов

Изображения хранятся в `draft/Багет/` (3 подпапки):

| Группа | Ширина профиля | Цена | Кол-во |
|--------|----------------|------|--------|
| **плоский** | 22 мм | 70 р/м | 5 шт. |
| **студийный** | 25 мм | 205 р/м | 8 шт. |
| **классический** | 33–60 мм | 115–195 р/м | 26 шт. |

**Именование папок:** `ШиринаММ-серия-цвет-ЦенаЗаМетр`
Примеры: `22-19-1-70`, `33-24-1-115`, `25-981-01-205`, `60-35-10-158`

**Структура данных** (автогенерируется `scripts/_scan_bagets.py` → `draft/baget-data.js`):

```javascript
{
  id: "33-24-1",           // артикул (имя папки без последнего числа)
  group: "классический",   // плоский | студийный | классический
  subgroup: "классический-25",
  widthMm: 33,             // ширина профиля в мм (первое число)
  pricePerM: 115,          // цена за погонный метр
  stripUrl: "Багет/классический/.../1.jpeg",
  cornerUrl: "Багет/классический/.../2.jpeg"
}
```

### 9.8. Формула цены (обновлённая)

```
Цена_рамы = 0.18 × (ширина_см + высота_см) × цена_за_метр
```

> Коэффициент `0.18` = `2 / 100 × 9` (периметр в метрах × наценка). Совпадает с ценами на muse.ooo.

### 9.9. Файлы

| Файл | Назначение |
|------|------------|
| `draft/baget-test.html` | Тест-страница с 3 подходами, каталогом, превью и ценами |
| `draft/baget-data.js` | Автогенерируемый JS-массив багетов (39 записей) |
| `scripts/_scan_bagets.py` | Python-скрипт: сканирует `draft/Багет/`, генерирует `baget-data.js` |
| `draft/Багет/` | Исходные JPEG: `1.jpeg` (полоска) + `2.jpeg` (уголок) в каждой подпапке |

### 9.10. План интеграции в калькулятор

| # | Шаг | Описание |
|---|-----|----------|
| 1 | Скопировать картинки | `draft/Багет/` → `src/html/img/bagets/` (с плоской структурой или по группам) |
| 2 | Обновить `frames.js` | Заменить `DEFAULT_FRAMES` на реальный массив с `widthMm`, `stripUrl`, `cornerUrl` |
| 3 | Добавить DOM-рендер | Новая функция `renderFrameDOM(container, frame, photoW, photoH)` вместо CSS-бордера |
| 4 | Обновить `calc.html` | Заменить CSS-превью в `#frame-modal` на мини-текстурный рендер |
| 5 | Обновить `calc.js` | Вызов DOM-рендера при выборе рамы + в финальном превью |
| 6 | Чекбокс «Отзеркалить» | Опциональная UX-фича — переключить направление полоски |
| 7 | Fallback | Если `stripUrl` не загрузился — показать CSS-бордер по `color` |

> **Правило:** правки калькулятора — сначала в `calc.html` (источник истины), потом распространять на продуктовые страницы.
