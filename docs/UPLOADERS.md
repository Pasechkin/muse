# Загрузчики изображений

> **Обновлено:** 24 февраля 2026

Документация описывает все реализации загрузчиков изображений в проекте: архитектуру, API, HTML-разметку, различия между страницами и требования к интеграции с 1С-Битрикс.

---

## Содержание

1. [Обзор архитектуры](#1-обзор-архитектуры)
2. [Файлы загрузчика](#2-файлы-загрузчика)
3. [Универсальный загрузчик `MuseUploader`](#3-универсальный-загрузчик-museuploader)
4. [Группа A: Стандартный калькулятор (calc.js)](#4-группа-a-стандартный-калькулятор-calcjs)
5. [Группа B: Модульная картина (modular-calc.js)](#5-группа-b-модульная-картина-modular-calcjs)
6. [Группа C: Конструктор коллажей (автономный)](#6-группа-c-конструктор-коллажей-автономный)
7. [Мост: конструктор → калькулятор](#7-мост-конструктор--калькулятор)
8. [Сводная таблица страниц](#8-сводная-таблица-страниц)
9. [Требования к серверной части](#9-требования-к-серверной-части)
10. [Рекомендации по интеграции с Bitrix](#10-рекомендации-по-интеграции-с-bitrix)

---

## 1. Обзор архитектуры

В проекте существуют **три различные реализации** загрузки изображений:

| Группа | Инициализация | Страницы | Загрузчик |
|--------|---------------|----------|-----------|
| **A** — Стандартный калькулятор | `CalcInit()` внутри `calc.js` | 6 страниц | `MuseUploader` из `uploader.js` |
| **A-standalone** — Быстрый заказ | Inline-скрипт (без `calc.js`) | 1 страница | `MuseUploader` из `uploader.js` |
| **B** — Модульная картина | `modular-calc.js` | 1 страница | `MuseUploader` из `uploader.js` (с `mc-` префиксами) |
| **C** — Конструктор коллажей | Inline-скрипт | 1 страница | Собственная реализация (без `uploader.js`) |

Все загрузчики работают **полностью на клиенте**: файлы читаются в память браузера через `FileReader` / `URL.createObjectURL()` и **не отправляются на сервер**. Отправка на сервер — задача интеграции с Битрикс.

### Общие принципы

- **Ресайз на клиенте:** оригиналы ресайзятся через `<canvas>` → превью ≤1000 px, миниатюры ≤120 px (JPEG quality 0.85)
- **Валидация:** MIME-тип + расширение + размер файла (до 10 МБ)
- **Лимит файлов:** до 20 файлов на страницу (настраивается)
- **Форматы:** JPEG, PNG, GIF, WebP
- **Drag & drop:** поддерживается на зоне загрузки (группы A и B)
- **Accessibility:** ARIA-атрибуты, `aria-live` для screen reader, keyboard navigation
- **Двойное подтверждение удаления:** первый клик «взводит», второй удаляет (группы A и B)

---

## 2. Файлы загрузчика

| Файл | Размер | Назначение |
|------|--------|------------|
| `src/html/js/uploader.js` | ~679 строк | Универсальный загрузчик `MuseUploader` (используется группами A и B) |
| `src/html/js/calc.js` | ~1700 строк | Калькулятор — создаёт `MuseUploader` внутри `CalcInit()` |
| `src/html/js/modular-calc.js` | ~1000 строк | Калькулятор модульных картин — создаёт `MuseUploader` с `mc-` селекторами |
| `src/html/pechat/konstruktor-kollazha.html` | ~9700 строк | Конструктор коллажей — содержит собственный inline-загрузчик |

### Порядок подключения скриптов (группа A)

```html
<!-- ОБЯЗАТЕЛЬНО: сначала prices.js, потом calc.js, потом uploader.js -->
<script defer src="js/prices.js"></script>
<script defer src="js/calc.js"></script>
<script defer src="js/uploader.js"></script>
```

### Порядок подключения скриптов (группа B)

```html
<script defer src="../js/prices.js"></script>
<script defer src="../js/modular-calc.js"></script>
<script defer src="../js/uploader.js"></script>
```

### Подключение скриптов (группа C)

Конструктор коллажей — автономная страница. Вся логика загрузки встроена в inline `<script>` внутри HTML. Внешний `uploader.js` **не подключается**.

---

## 3. Универсальный загрузчик `MuseUploader`

> Подробная документация API: [CALCULATOR.md, раздел 7](CALCULATOR.md#7-загрузчик-изображений-uploaderjs)

### Конфигурация

```javascript
var uploader = MuseUploader({
  maxFiles: 20,                          // Максимум файлов
  maxSizeMB: 10,                         // Максимум размер 1 файла (МБ)
  acceptTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  dropZoneSelector: '#uploader-zone',    // Зона drag-drop
  thumbnailsSelector: '#uploader-thumbnails',
  fileInputSelector: '#file-upload',     // <input type="file">
  alertSelector: '#uploader-alert',      // Контейнер для уведомлений
  uploadBtnSelector: '#btn-upload-empty',// Кнопка «Загрузить фото»
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
| `addFiles(fileList)` | Добавить файлы программно |
| `removeImage(id)` | Удалить фото по ID |
| `getImages()` | Получить массив всех фото (копия) |
| `getActiveImage()` | Получить текущее активное фото |
| `setActiveImage(id)` | Установить активное фото по ID |
| `clear()` | Удалить все фото |
| `destroy()` | Уничтожить экземпляр, снять обработчики |
| `openFilePicker()` | Открыть системный диалог выбора файла |
| `getCount()` | Количество загруженных фото |
| `showAlert(msg, type)` | Показать уведомление (`'error'` / `'warning'` / `'success'`) |
| `hideAlert()` | Скрыть уведомление |

### Объект изображения

```javascript
{
  id: 'img_1708..._1',       // Уникальный ID (строка)
  objectUrl: 'blob:...',      // Blob-URL оригинала
  previewUrl: 'data:...',     // Ресайзенная копия ≤1000px
  thumbUrl: 'data:...',       // Ресайзенная копия ≤120px
  dataUrl: 'data:...',        // = previewUrl (обратная совместимость с calc.js)
  name: 'photo.jpg',          // Имя файла
  size: 1234567,              // Размер в байтах
  type: 'image/jpeg',         // MIME-тип
  width: 4000,                // Оригинальная ширина (px)
  height: 3000                // Оригинальная высота (px)
}
```

### Экземпляры-глобалы

| Группа | Глобальная переменная | Создаётся в |
|--------|-----------------------|-------------|
| A | `window.__museUploader` | `calc.js` (внутри `CalcInit`) |
| A-standalone | `window.__orderUploader` | `order.html` (inline-скрипт) |
| B | `window._mcUploader` | `modular-calc.js` |
| C | — | Нет глобального экземпляра (кастомная реализация) |

---

## 4. Группа A: Стандартный калькулятор (calc.js)

### Страницы

| Страница | Файл | CalcInit type | Путь к JS |
|----------|------|---------------|-----------|
| Эталон/демо | `src/html/calc.html` | URL-based (`?type=canvas`) | `js/` |
| Портрет маслом | `src/html/portret-na-zakaz/style/portret-maslom.html` | `'portrait'` | `../../js/` |
| Портреты СПб (главная) | `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | через `calc.js` | `js/` |
| Фото на холсте СПб | `src/html/pechat/foto-na-kholste-sankt-peterburg.html` | `'canvas'` | `../js/` |
| Фото в рамке | `src/html/pechat/foto-v-ramke.html` | `'frame'` | `../js/` |
| Фотоколлаж на холсте | `src/html/pechat/fotokollazh-na-kholste.html` | `'canvas'` | `../js/` |

### HTML-разметка загрузчика (единый шаблон)

Все страницы группы A используют **идентичную** HTML-разметку:

```html
<div id="uploader-zone" class="uploader-zone mb-2 lg:mb-4">
    <div class="w-full max-w-sm mx-auto lg:max-w-none">
        <input type="file" id="file-upload" class="hidden"
               accept="image/jpeg,image/png,image/gif,image/webp" multiple>
        <button id="btn-upload-empty"
                class="w-full bg-primary hover:bg-primary-hover text-white font-bold
                       py-3 rounded-lg text-sm uppercase tracking-wide transition-all
                       active:scale-[0.98] flex items-center justify-center gap-2">
            <span>Загрузить фото</span>
        </button>
        <div id="uploader-thumbnails" class="uploader-thumbnails thin-scrollbar-x"
             role="listbox" aria-label="Загруженные фотографии"></div>
        <div id="uploader-alert" class="uploader-alert"
             role="status" aria-live="polite"></div>
        <div id="uploader-status" class="sr-only"
             role="status" aria-live="polite" aria-atomic="true"></div>
    </div>
</div>
```

**Источник истины:** `src/html/calc.html` — изменения вносить сначала туда, затем тиражировать.

### Инициализация (внутри calc.js)

`MuseUploader` **не вызывается напрямую** в HTML-файлах. Его создаёт `CalcInit()` из `calc.js`:

```javascript
// calc.js, ~строка 1604
uploaderInstance = MuseUploader({
    maxFiles: cfg.maxFiles || 20,
    dropZoneSelector: '#uploader-zone',
    thumbnailsSelector: '#uploader-thumbnails',
    fileInputSelector: '#file-upload',
    alertSelector: '#uploader-alert',
    uploadBtnSelector: '#btn-upload-empty',
    statusSelector: '#uploader-status',
    enableDragDrop: true,
    onImagesChange: function (imgs) { STATE.images = imgs; },
    onActiveImageChange: function (img) { /* обновление превью холста */ }
});
window.__museUploader = uploaderInstance;
```

### Обязательные ID элементов

| ID | Тег | Назначение |
|----|-----|------------|
| `uploader-zone` | `<div>` | Зона drag-drop загрузки |
| `file-upload` | `<input type="file">` | Скрытый input для выбора файлов |
| `btn-upload-empty` | `<button>` | Кнопка «Загрузить фото» |
| `uploader-thumbnails` | `<div>` | Полоса миниатюр загруженных фото |
| `uploader-alert` | `<div>` | Контейнер уведомлений |
| `uploader-status` | `<div>` | Screen reader (sr-only, aria-live) |

### Standalone-использование: Быстрый заказ (order.html)

Страница `src/html/order/order.html` использует **ту же HTML-разметку** группы A (те же ID элементов), но **без калькулятора** — `calc.js` и `prices.js` не подключены.

`MuseUploader` инициализируется напрямую в inline-скрипте:

```javascript
// order.html — standalone-инициализация
window.__orderUploader = MuseUploader({
    dropZone:    '#uploader-zone',
    fileInput:   '#file-upload',
    thumbList:   '#uploader-thumbnails',
    alertBox:    '#uploader-alert',
    statusBox:   '#uploader-status',
    emptyBtn:    '#btn-upload-empty'
});
```

**Отличия от страниц с калькулятором:**

| Параметр | Группа A (калькулятор) | order.html (standalone) |
|----------|----------------------|-------------------------|
| Инициализация | Через `CalcInit()` в `calc.js` | Прямой вызов `MuseUploader()` в inline-скрипте |
| Глобальная переменная | `window.__museUploader` | `window.__orderUploader` |
| Калькулятор | `calc.js` + `prices.js` | **Нет** |
| Форма заказа | Внутри `calc.js` (submit) | Собственный `<form>` с inline-обработчиком |
| Скрипты | `nav.js`, `uploader.js`, `prices.js`, `calc.js` | `nav.js`, `uploader.js` |
| Хедер/футер | Есть | **Нет** (минимальная страница) |

**Подключение скриптов:**

```html
<script src="../js/nav.js" defer></script>
<script src="../js/uploader.js" defer></script>
<!-- calc.js и prices.js НЕ подключены -->
```

Форма собирает данные (`name`, `phone`, `email`, `link`, `comment`) и изображения из `__orderUploader.getImages()` для отправки на сервер. Серверная отправка — TODO (заглушка `console.log` + `alert`).

---

## 5. Группа B: Модульная картина (modular-calc.js)

> **Загрузчик тот же самый** — `MuseUploader` из `uploader.js`. Отличия от группы A чисто конфигурационные: другие ID элементов (`mc-` префикс), другой движок-родитель (`modular-calc.js`) и другая глобальная переменная (`_mcUploader`). Сам компонент загрузки, валидация, drag-drop, ресайз — идентичны.

### Страница

| Страница | Файл |
|----------|------|
| Модульная картина | `src/html/pechat/modulnaya-kartina.html` |

### Отличия от группы A (только конфигурация)

1. **Все ID имеют префикс `mc-`** — чтобы не конфликтовать с обычным калькулятором
2. Другой JS-движок: `modular-calc.js` вместо `calc.js`
3. Экземпляр хранится в `window._mcUploader` (не `window.__museUploader`)
4. Незначительные отличия в HTML: `<span>` вместо `<div>` для статуса, другие utility-классы на зоне

### HTML-разметка загрузчика

```html
<div id="mc-uploader-zone" class="uploader-zone flex-none px-3 pt-3 lg:px-4 lg:pt-4">
    <div class="w-full max-w-sm mx-auto lg:max-w-none">
        <input type="file" id="mc-file-input" class="hidden"
               accept="image/jpeg,image/png,image/gif,image/webp" multiple>
        <button type="button" id="mc-btn-upload"
                class="w-full bg-primary hover:bg-primary-hover text-white font-bold
                       py-3 rounded-lg text-sm uppercase tracking-wide transition-all
                       active:scale-[0.98] flex items-center justify-center gap-2">
            <span>Загрузить фото</span>
        </button>
        <div id="mc-uploader-thumbs" class="uploader-thumbnails thin-scrollbar-x"
             role="listbox" aria-label="Загруженные фотографии"></div>
        <div id="mc-uploader-alert" class="uploader-alert"
             role="status" aria-live="polite"></div>
        <span id="mc-uploader-status" class="sr-only"
              role="status" aria-live="polite" aria-atomic="true"></span>
    </div>
</div>
```

### Маппинг ID: группа A → группа B

| Группа A (стандартный) | Группа B (модульная) |
|------------------------|----------------------|
| `#uploader-zone` | `#mc-uploader-zone` |
| `#file-upload` | `#mc-file-input` |
| `#btn-upload-empty` | `#mc-btn-upload` |
| `#uploader-thumbnails` | `#mc-uploader-thumbs` |
| `#uploader-alert` | `#mc-uploader-alert` |
| `#uploader-status` | `#mc-uploader-status` |

### Инициализация (внутри modular-calc.js)

```javascript
// modular-calc.js, ~строка 977
window._mcUploader = MuseUploader({
    maxFiles: 20,
    dropZoneSelector: '#mc-uploader-zone',
    thumbnailsSelector: '#mc-uploader-thumbs',
    fileInputSelector: '#mc-file-input',
    alertSelector: '#mc-uploader-alert',
    uploadBtnSelector: '#mc-btn-upload',
    statusSelector: '#mc-uploader-status',
    onActiveImageChange: function (img) { /* preview + fitView */ },
    onImagesChange: function (imgs) { /* State.uploadedImages = imgs */ }
});
```

---

## 6. Группа C: Конструктор коллажей (автономный)

### Страница

| Страница | Файл |
|----------|------|
| Конструктор коллажей | `src/html/pechat/konstruktor-kollazha.html` |

### Ключевые отличия

- **Не использует `uploader.js`** — скрипт не подключён
- **Не использует `MuseUploader`** — полностью автономная inline-реализация
- **Нет drag-and-drop** на зону загрузки (drag-and-drop есть только для ячеек коллажа)
- **Нет двойного подтверждения** удаления
- **Нет ресайза** через canvas (используется оригинал)
- **Нет batch-обработки** — все файлы обрабатываются последовательно
- **Нет ARIA/accessibility** обёрток (базовая реализация)

### HTML-разметка

```html
<div id="upload-container">
    <button class="btn btn-secondary" id="upload-btn">
        <span class="upload-plus">+</span>
    </button>
    <div class="tab-inner">
        <div id="upload-label">Загрузить фото</div>
        <input accept="image/*" id="file-input" multiple
               style="display: none;" type="file"/>
    </div>
</div>
```

### Inline JS логика (упрощённая схема)

```javascript
// Глобальный массив
let uploadedImages = [];

// Клик по кнопке → открыть диалог
document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

// Обработка выбранных файлов
document.getElementById('file-input').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);

    // Проверка лимита (20 файлов)
    if (uploadedImages.length + files.length > 20) {
        alert('Нельзя загрузить более 20 изображений за раз');
        return;
    }

    files.forEach(file => {
        // Валидация типа: jpeg, jpg, png, webp
        // Валидация размера: 10 МБ
        // Чтение через FileReader → dataUrl
        // Создание imgObj { id, src, name, ... }
        // Добавление миниатюры с кнопкой удаления
        uploadedImages.push(imgObj);
    });
});
```

### Отличия ID элементов от групп A/B

| Элемент | Группа A | Группа B | Группа C |
|---------|----------|----------|----------|
| file input | `#file-upload` | `#mc-file-input` | `#file-input` |
| Кнопка загрузки | `#btn-upload-empty` | `#mc-btn-upload` | `#upload-btn` |
| Зона загрузки | `#uploader-zone` | `#mc-uploader-zone` | `#upload-container` |
| Миниатюры | `#uploader-thumbnails` | `#mc-uploader-thumbs` | (генерируются динамически) |
| Уведомления | `#uploader-alert` | `#mc-uploader-alert` | `alert()` |
| Screen reader | `#uploader-status` | `#mc-uploader-status` | — |

---

## 7. Мост: конструктор → калькулятор

Страница `fotokollazh-na-kholste.html` уникальна — на ней конструктор коллажей встроен через `<iframe>`, а калькулятор работает на основной странице. При экспорте готового коллажа изображение передаётся из iframe в калькулятор.

### Механизм

```javascript
// fotokollazh-na-kholste.html, ~строки 1040–1085
// При экспорте коллажа из iframe:

// 1. Попытка через публичный API MuseUploader
if (window.__museUploader && typeof window.__museUploader.addFiles === 'function') {
    window.__museUploader.addFiles([file]);
}

// 2. Фоллбэк: ручная инъекция через DataTransfer
else {
    var dt = new DataTransfer();
    dt.items.add(file);
    var input = document.getElementById('file-upload');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

// 3. Установка размеров для калькулятора
if (window.__museCalcSetSize) {
    window.__museCalcSetSize(width, height);
}
```

### Поток данных

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  Конструктор коллажей    │         │  Калькулятор             │
│  (iframe)                │         │  (основная страница)     │
│                          │         │                          │
│  uploadedImages[] ──────►│ экспорт │──► __museUploader.addFiles│
│  (свой массив)           │         │    или DataTransfer →    │
│                          │─────────│    #file-upload           │
│  Свой inline‑загрузчик   │  File   │                          │
│  (группа C)              │ object  │  MuseUploader (группа A) │
└──────────────────────────┘         └──────────────────────────┘
```

**Важно для интеграции:** мост работает через `window` объекты (`__museUploader`, `__museCalcSetSize`). При оборачивании в Битрикс-компонент эти глобальные переменные должны оставаться доступны.

---

## 8. Сводная таблица страниц

| Страница | Файл | Группа | uploader.js | Движок | CalcInit type | Глобальная переменная |
|----------|------|--------|-------------|--------|---------------|----------------------|
| Эталон | `calc.html` | A | Да | `calc.js` | URL-based | `__museUploader` |
| Портрет маслом | `portret-maslom.html` | A | Да | `calc.js` | `portrait` | `__museUploader` |
| Портреты СПб | `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | A | Да | `calc.js` | из calc.js | `__museUploader` |
| Фото на холсте | `foto-na-kholste-sankt-peterburg.html` | A | Да | `calc.js` | `canvas` | `__museUploader` |
| Фото в рамке | `foto-v-ramke.html` | A | Да | `calc.js` | `frame` | `__museUploader` |
| Фотоколлаж на холсте | `fotokollazh-na-kholste.html` | A | Да | `calc.js` | `canvas` | `__museUploader` |
| Модульная картина | `modulnaya-kartina.html` | B | Да | `modular-calc.js` | — | `_mcUploader` |
| Конструктор коллажей | `konstruktor-kollazha.html` | C | **Нет** | inline | — | — |
| **Быстрый заказ** | `order/order.html` | A-standalone | Да | inline | — | `__orderUploader` |

### Будущие страницы

При тиражировании калькулятора на оставшиеся 22 портретные страницы (см. [PROJECT.md → Реестр подключений CALC](../PROJECT.md)) они будут использовать **группу A** с идентичной разметкой.

---

## 9. Требования к серверной части

> Подробный контракт API: [CALCULATOR.md, раздел 10](CALCULATOR.md#10-требования-к-серверной-части)

### Endpoint для загрузки фото

```
POST /api/upload
Content-Type: multipart/form-data

file: <binary>

→ 200 OK  { "id": "upload-uuid", "url": "/uploads/preview/..." }
→ 413 File Too Large
→ 415 Unsupported Media Type
```

### Ограничения

| Параметр | Значение |
|----------|----------|
| Максимум файлов на заказ | 20 |
| Максимум размер файла | 10 МБ |
| Форматы | JPEG, PNG, GIF, WebP |

### Текущее поведение (заглушка)

Сейчас фото хранятся **только в памяти браузера** (blob-URL / data-URL). При отправке формы заказа собираются ID загруженных фото из массива `images`, но реальная отправка — `console.log` + `alert`.

### Что нужно для production

1. **Endpoint `/api/upload`** — приём файлов (multipart/form-data)
2. **Включение ID загруженных фото** в тело заказа (`POST /api/order`, поле `photos`)
3. **Серверная валидация** формата и размера
4. **Хранение** загруженных файлов (файловая система / S3 / etc.)

---

## 10. Рекомендации по интеграции с Bitrix

### Группы A и B: минимальные правки

Для страниц с `MuseUploader` интеграция прозрачна:

1. **Не менять HTML-разметку** загрузчика — используются стандартные ID
2. **Не менять `uploader.js`** — компонент автономен
3. **Добавить серверную отправку** в callback `onImagesChange` или в момент submit формы заказа:
   - Перехватить submit в `calc.js` / `modular-calc.js`
   - Перед `POST /api/order` — загрузить каждый файл через `POST /api/upload`
   - Собрать массив серверных ID
   - Включить их в тело заказа

**Пример адаптации (концепт):**

```javascript
// В calc.js, в обработчике отправки заказа:
async function submitOrder(orderData) {
    // 1. Загрузить фото на сервер
    var photos = uploaderInstance.getImages();
    var photoIds = [];
    for (var i = 0; i < photos.length; i++) {
        // В photos[i].objectUrl хранится blob-URL оригинала
        var blob = await fetch(photos[i].objectUrl).then(r => r.blob());
        var formData = new FormData();
        formData.append('file', blob, photos[i].name);

        var resp = await fetch('/api/upload', { method: 'POST', body: formData });
        var result = await resp.json();
        photoIds.push(result.id);
    }

    // 2. Отправить заказ с ID фото
    orderData.photos = photoIds;
    await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
}
```

### Группа C: конструктор коллажей

Конструктор коллажей загружает фото **для создания коллажа** (компоновки в ячейки), а не для отправки на сервер напрямую. Итоговое изображение передаётся через мост в калькулятор (группа A) на странице `fotokollazh-na-kholste.html`.

**Рекомендация:** при интеграции загрузку из конструктора не менять. Серверная отправка происходит через калькулятор (т.е. через группу A), когда пользователь оформляет заказ.

### Глобальные переменные — не ломать

При оборачивании HTML в Битрикс-компоненты сохранить доступность:

| Переменная | Используется в |
|------------|----------------|
| `window.__museUploader` | Мост конструктор→калькулятор (`fotokollazh-na-kholste`) |
| `window.__museCalcSetSize` | Установка размеров из конструктора |
| `window._mcUploader` | Модульная картина |
| `window.__orderUploader` | Страница быстрого заказа (`order.html`) |

### Порядок подключения скриптов — не менять

```
prices.js → calc.js (или modular-calc.js) → uploader.js
```

Все скрипты подключены с `defer` — порядок исполнения гарантирован браузером по порядку в DOM.

### Стили загрузчика

CSS-классы загрузчика (`.uploader-zone`, `.uploader-thumbnails`, `.uploader-thumb-wrap`, `.uploader-thumb`, `.uploader-thumb-remove`, `.uploader-alert`, `.uploader-add-btn`, `.uploader-drag-active` и др.) определены в `src/input.css` и включаются через `output.css`. Отдельного CSS-файла для загрузчика нет.

---

## Приложение А: совместимость с браузерами

| Браузер | Минимальная версия |
|---------|--------------------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 11+ |
| Edge | 79+ |
| iOS Safari | 11+ |
| Android Chrome | 60+ |

---

## Приложение Б: чек-лист тестирования загрузчика

- [ ] Клик по кнопке открывает диалог выбора файлов
- [ ] Можно выбрать несколько файлов одновременно
- [ ] Drag & drop файлов работает (группы A и B)
- [ ] Загруженные изображения отображаются как миниатюры
- [ ] Кнопка удаления работает корректно (двойное подтверждение в группах A/B)
- [ ] Валидация типов файлов — отклоняет не-изображения
- [ ] Валидация размера файлов — отклоняет >10 МБ
- [ ] Лимит 20 файлов — показывает предупреждение при превышении
- [ ] Повторная загрузка того же файла возможна (input сбрасывается)
- [ ] Мост конструктор→калькулятор передаёт экспортированный коллаж (страница `fotokollazh-na-kholste`)
