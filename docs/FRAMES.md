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
| 4 | CSS-бордер вместо текстурного рендера | Приемлемо для демо |
| 5 | 27 рам вместо ~40 на оригинале | Достаточно для демо |
| 6 | Нет сортировки/фильтрации в UI | Низкий приоритет |
