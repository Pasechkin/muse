# Дизайн-система Muse

Полное описание дизайн-системы проекта Muse, основанной на теме Stack.

---

## ⚠️ Правила работы с контентом

**ВАЖНО:** Текст от себя не добавлять!

- Весь контент брать ТОЛЬКО с оригинального сайта muse.ooo
- Если текст/URL/alt/title неизвестны — допускается ставить маркер (плейсхолдер) вида `[ТЕКСТ: описание]` / `[URL_...]`.
- Новый текст предлагать на согласование, а не вставлять сразу
- В примерах документации использовать реальный текст с сайта или явные плейсхолдеры

Важно про плейсхолдеры в страницах:
- В некоторых текущих HTML-страницах проекта плейсхолдеры уже присутствуют — **это допустимо**, их не нужно "лечить" автоматически.
- **Нельзя** заменять плейсхолдеры на выдуманные значения.
- Новые плейсхолдеры в HTML добавлять только по согласованию (или если в оригинале действительно нет данных и нужно явно пометить незаполненное место).

---

## Рефакторинг (единый источник)

Короткие правила перевёрстки и рефакторинга. Этот раздел — единый источник вместо отдельного гайда.

**Не менять и не трогать:**
- Контент, тексты, alt/title, meta‑теги, JSON‑LD, порядок секций и вложенность.
- Header/Footer, `<dialog>` и Tailwind Plus Elements.
- Подключения скриптов и preload.

**Контейнер:** использовать класс `container` (макс. ширина 1170px, padding 16px).

**Запрещено:** `.container` внутри `.container`.

Если нужен фон/граница/подложка на всю ширину — секция остаётся full-width, а контент внутри одним `.container`.

**Критический CSS (минимум):**
- переменные `:root` и базовые `body`, `.sr-only`;
- при наличии компонента добавить его критические классы: `.page-navigator`, `.ba-card`, `.canvas-3d`, `.carousel-scroll`.
- для каждой страницы проверять обоснованность критического CSS: оставлять только то, что действительно нужно до загрузки основного CSS.

**Интерактивные блоки:**
- Video Cover — `data-video-cover` + `data-video-src` (JS в `js/nav.js`, без inline);
- Carousel Scroll — CSS + общий `js/nav.js` (без обязательного inline JS);
- Back to Top — обязательная кнопка перед `<header>`.

**Слайдер “До/После”:** использовать `ba-card` + 4 строки CSS.

**JavaScript (архитектура):**

**Общий скрипт** — `src/html/js/nav.js` (подключается на страницах по умолчанию).

**Что конкретно содержит `nav.js`:**
- `window.BxPopup(...)` — глобальный helper для inline-совместимости.
- Маска телефона (RU) для `input[type="tel"]` (`+7 (___) ___-__-__`).
- Page Navigator: плавный скролл, подсветка активной секции, desktop-only видимость.
- Back to Top: логика показа/скрытия и плавный скролл по клику (`#back-to-top`).
- Video Cover: ленивое создание `iframe` по клику на `[data-video-cover] [data-play-btn]`.
- Доступность `<dialog>`: фокус, `Escape`, aria-атрибуты, keyboard controls.
- Carousel Scroll: wheel-scroll (desktop), drag-to-scroll, кнопки prev/next, ARIA и `sr-only` подсказка, авто-добавление кнопок при отсутствии.
- Before/After: синхронизация `input[type=range]` с CSS-переменной `--pos` (`.ba-card/.before-after-slider`).

**Page-specific JS** (скрипты только для отдельных страниц):
- Допускается, если логика не переиспользуется и относится к уникальному блоку страницы.
- Inline-скрипт должен быть коротким, без глобальных переменных, и начинаться с guard-проверки селектора.
- Если логика повторяется на 2+ страницах — переносим в `nav.js` и фиксируем HTML-хук (класс/`data-*`).

---

## Tailwind Plus Elements — где используем

- **Mobile Menu:** `el-dialog` (см. раздел “Mobile Menu”).
- **Tabs:** `el-tab-group` (галерея характеристик).
- **Accordion:** `el-disclosure` (UI-аккордеоны). Для публичного FAQ (SEO) — приоритет у нативного `<details>` (см. “FAQ Accordion”).

Подключение: локальный файл `src/html/js/tailwindplus-elements.js`.

**Канон (порядок подключения скриптов):**

Ставим скрипты перед `</body>`.

Если используются `el-*`, подключаем Tailwind Plus Elements как модуль **перед** нашим общим `nav.js`:

```html
<!-- Tailwind Plus Elements (если используются el-*) -->
<script type="module" src="js/tailwindplus-elements.js"></script>

<!-- Общий скрипт проекта -->
<script src="js/nav.js"></script>
```

**Важно:** это вендорный (минифицированный) файл из `@tailwindplus/elements`.
- Не редактировать и не рефакторить.
- Подключать как ES-модуль:

```html
<script type="module" src="js/tailwindplus-elements.js"></script>
```

**Разделение ответственности:**
- `tailwindplus-elements.js` — web components `el-*` (диалоги, табы, disclosure и их доступность/полифиллы).
- `nav.js` — наш общий JS (навигация, карусели, video cover, маски, а11y-обвязка и т.д.).

**Что включено в Tailwind Plus Elements (для этой версии):**
- Introduction
- Autocomplete → `el-autocomplete`
- Command palette → `el-command-palette`
- Copy button → `el-copyable`
- Dialog → `el-dialog`
- Disclosure → `el-disclosure`
- Dropdown menu → `el-dropdown` + `el-menu`
- Popover → `el-popover`
- Select → `el-select`
- Tabs → `el-tab-group`

Смысл: если нужен типовой интерактивный элемент из списка выше — **не пишем новый JS “с нуля”**, а используем соответствующий `el-*` и подключаем `tailwindplus-elements.js`.

**Decision flow (как выбирать, где делать логику):**

1) **Есть подходящий компонент в Tailwind Plus Elements?** → используем `el-*` (без нового JS).
2) **Нет в Plus, но поведение повторится на 2+ страницах?** → добавляем в общий `nav.js` и фиксируем HTML-хук (класс/`data-*`).
3) **Уникально для одной страницы/одного блока?** → допустим короткий page-specific inline JS с guard-проверками.

**Правило (чтобы не плодить лишний JS):**
- Перед написанием нового JavaScript для типовых UI-компонентов сначала проверяем Tailwind Plus Elements (в их документации есть перечень готовых компонентов).
- Для типовых задач (диалоги/модалки, табы, UI-аккордеоны) используем `el-dialog`, `el-tab-group`, `el-disclosure` вместо самописной логики.
- Для публичных SEO-блоков FAQ — используем нативный `<details>` (см. “FAQ Accordion”), без JS.
- Новый JS пишем только если поведение не покрывается Plus или это бизнес‑специфичная логика; при этом вендорный файл не правим — делаем обвязку/инициализацию в нашем коде.

## Содержание

1. [Цвета](#цвета)
2. [Типографика](#типографика)
3. [Отступы и размеры](#отступы-и-размеры)
4. [Доступность (Accessibility)](#доступность-accessibility)
5. [Компоненты](#компоненты)
6. [Интерактивные компоненты](#интерактивные-компоненты)
7. [Визуальные эффекты](#визуальные-эффекты)
8. [Grid системы](#grid-системы)
9. [Header и Mobile Menu](#header-и-mobile-menu)
10. [Компоненты блога](#компоненты-блога)
11. [Примеры использования](#примеры-использования)
12. [Контрольный список](#контрольный-список-для-создания-страницы)

---

## Цвета

### Палитра цветов

#### Основные цвета бренда

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div>
    <div style="width: 100px; height: 100px; background: #4a90e2; border: 1px solid #ddd;"></div>
    <p><strong>Primary</strong><br>#4a90e2</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #609de6; border: 1px solid #ddd;"></div>
    <p><strong>Primary Hover</strong><br>#609de6</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #3483de; border: 1px solid #ddd;"></div>
    <p><strong>Primary Active</strong><br>#3483de</p>
  </div>
</div>

#### Нейтральные цвета

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div>
    <div style="width: 100px; height: 100px; background: #252525; border: 1px solid #ddd;"></div>
    <p><strong>Dark</strong><br>#252525</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #666666; border: 1px solid #ddd;"></div>
    <p><strong>Body Text</strong><br>#666666</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #fafafa; border: 1px solid #ddd;"></div>
    <p><strong>Secondary</strong><br>#fafafa</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #ffffff; border: 1px solid #ddd;"></div>
    <p><strong>White</strong><br>#ffffff</p>
  </div>
</div>

### Использование цветов

#### Фоны

```html
<!-- Основной синий фон -->
<div class="bg-primary text-white">...</div>

<!-- Темный фон -->
<div class="bg-dark text-white">...</div>

<!-- Светлый фон -->
<div class="bg-secondary">...</div>

<!-- Белый фон -->
<div class="bg-white">...</div>
```

#### Текст

```html
<!-- Основной текст -->
<p class="text-body">Основной текст</p>

<!-- Темный текст (заголовки) -->
<h2 class="text-dark">Заголовок</h2>

<!-- Белый текст (на темном фоне) -->
<div class="bg-dark">
  <p class="text-white">Белый текст</p>
</div>

<!-- Серый текст (второстепенный) -->
<p class="text-gray-600">Второстепенный текст</p>
```

**Контраст (A11y):** на белом фоне избегаем `text-gray-400` для обычного текста.
- Для мелкого/второстепенного текста на белом фоне — ориентируемся на `text-gray-600`.
- `text-gray-500` допустим для крупных подписей/второстепенных элементов, но проверяем в DevTools (Lighthouse/Axe).

---

## Типографика

### Шрифт

Используем **только системные шрифты устройства/операционной системы** (system font stack).

**Мы НЕ подключаем веб‑шрифты:** не используем Google Fonts, не добавляем файлы шрифтов (`.woff/.woff2`), не пишем `@font-face`, не делаем preload шрифтов.

**Фактический стек (см. `src/input.css`, `--font-sans`):**
`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`.

### Шкала размеров

| Элемент | Desktop | Mobile | Line Height | Использование |
|---------|---------|--------|-------------|---------------|
| **H1** | 44px (3.14em) | 33px (2.36em) | 1.32em | Главный заголовок страницы |
| **H2** | 33px (2.36em) | 25px (1.79em) | 1.36em | Заголовок секции |
| **H3** | 25px (1.79em) | 19px (1.36em) | 1.5em | Подзаголовок |
| **H4** | 19px (1.36em) | 19px (1.36em) | 1.37em | Малый заголовок |
| **H5** | 14px (1em) | 14px (1em) | 1.86em | Очень малый заголовок |
| **H6** | 12px (0.86em) | 12px (0.86em) | 2.17em | Минимальный заголовок |
| **Lead** | 19px (1.36em) | 19px (1.36em) | 1.68em | Вводный текст |
| **Body** | 14px (1em) | 13px (0.81em) | 1.86em | Основной текст |
| **Small** | 12px (0.86em) | 12px (0.86em) | 1.86em | Мелкий текст |

### Таблица заголовков (какие классы использовать)

| Элемент | Tailwind классы | Размер | Когда использовать |
|---------|-----------------|--------|-------------------|
| **H1** | `text-4xl lg:text-6xl font-light` | 36/60px | Заголовок страницы (1 на страницу) |
| **H2** | `text-3xl lg:text-4xl font-light` | 30/36px | Заголовок секции |
| **H3** | `text-2xl font-light` | 24px | Подзаголовок в секции |
| **H4** | `text-xl font-medium` | 20px | Заголовок карточки/блока |
| **H5** | `text-lg font-medium` | 18px | Мелкий заголовок |
| **H6** | `text-base font-medium` | 16px | Подпись, метка |

### Примеры заголовков (чистый Tailwind)

```html
<!-- H1 — Заголовок страницы (только 1 на страницу) -->
<h1 class="text-4xl lg:text-6xl font-light text-white">Портрет по фото на холсте</h1>

<!-- H2 — Заголовок секции -->
<h2 class="text-3xl lg:text-4xl font-light text-dark">Преимущества</h2>

<!-- H3 — Подзаголовок в секции -->
<h3 class="text-2xl font-light text-dark">Как мы работаем</h3>

<!-- H4 — Заголовок карточки или блока -->
<h4 class="text-xl font-medium text-dark">Собственное производство</h4>

<!-- H5 — Мелкий заголовок -->
<h5 class="text-lg font-medium text-dark">Материалы</h5>

<!-- H6 — Подпись, метка -->
<h6 class="text-base font-medium text-gray-500">Примечание</h6>
```

### Текст и параграфы

| Элемент | Tailwind классы | Отступы | Когда использовать |
|---------|-----------------|---------|-------------------|
| Обычный параграф | без класса или `text-body` | `mb-4` | Основной текст |
| Вводный текст (lead) | `text-xl` | `mb-6` | Первый абзац после заголовка |
| Мелкий текст | `text-sm text-gray-500` | по ситуации | Подписи, примечания |
| Группа параграфов | `space-y-4` на контейнере | автоматически | Несколько абзацев подряд |

```html
<!-- Вводный текст (lead) — первый абзац после заголовка -->
<p class="text-xl mb-6">Картины по фото: портреты маслом и печать на холсте</p>

<!-- Обычный параграф -->
<p class="mb-4">Текст абзаца здесь...</p>

<!-- Группа параграфов с автоматическими отступами -->
<div class="space-y-4">
    <p>Первый абзац...</p>
    <p>Второй абзац...</p>
    <p>Третий абзац...</p>
</div>

<!-- Мелкий текст / примечание -->
<p class="text-sm text-gray-500">Дополнительная информация</p>
```

### Списки

| Тип списка | Tailwind классы | Когда использовать |
|------------|-----------------|-------------------|
| Маркированный | `list-disc list-inside space-y-2` | Перечисление без порядка |
| Нумерованный | `list-decimal list-inside space-y-2` | Пошаговые инструкции |
| Без маркеров | `space-y-2` | Меню, навигация |
| С галочками | Кастомный с SVG | Преимущества, характеристики |

```html
<!-- Маркированный список -->
<ul class="list-disc list-inside space-y-2 text-body">
    <li>Первый пункт</li>
    <li>Второй пункт</li>
    <li>Третий пункт</li>
</ul>

<!-- Нумерованный список -->
<ol class="list-decimal list-inside space-y-2 text-body">
    <li>Шаг первый</li>
    <li>Шаг второй</li>
    <li>Шаг третий</li>
</ol>

<!-- Список с галочками (для характеристик) -->
<ul class="space-y-3">
    <li class="flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>Текст характеристики</span>
    </li>
</ul>
```

### Ссылки в тексте

| Тип ссылки | Tailwind классы | Когда использовать |
|------------|-----------------|-------------------|
| В тексте | `text-primary underline hover:no-underline` | Ссылки внутри абзацев |
| Навигационная | `text-primary hover:text-primary-hover` | Меню, навигация |
| На тёмном фоне | `text-white hover:text-primary` | Footer, тёмные секции |

```html
<!-- Ссылка в тексте (обязательно с подчёркиванием для доступности) -->
<p>
    Подробнее в разделе 
    <a href="/info/dostavka/" class="text-primary underline hover:no-underline">Доставка ↗</a>
</p>

<!-- Ссылка внутри страницы (стрелка вверх) -->
<a href="#calc" class="text-primary underline hover:no-underline">Цена ↑</a>

<!-- Ссылка на тёмном фоне -->
<a href="/" class="text-white hover:text-primary transition-colors">Главная</a>
```

**Кавычки в тексте ссылок:** в текстовых ссылках **не используем** «…». Кавычки ухудшают читаемость и выглядят как цитата, а не как ссылка.

**Стрелки для ссылок:**
- `↑` — ссылка вверх по странице
- `↓` — ссылка вниз по странице  
- `↗` — внешняя ссылка или другая страница

**Правило ссылок:** внутренние ссылки — без `target`, внешние — `target="_blank"` + `rel="noopener noreferrer"`.

### Насыщенность шрифта

- **Light (300)** - для заголовков
- **Normal (400)** - для основного текста
- **Semibold (600)** - для акцентов
- **Bold (700)** - для важных элементов

```html
<p class="font-light">Легкий текст</p>
<p class="font-normal">Обычный текст</p>
<p class="font-semibold">Полужирный текст</p>
<p class="font-bold">Жирный текст</p>
```

---

## Отступы и размеры

### Система отступов

Базовый отступ: **4px** (0.25rem)

| Название | Значение | Размер | Использование |
|----------|----------|--------|---------------|
| XS | 0.5rem | 8px | Минимальные отступы |
| SM | 1rem | 16px | Малые отступы |
| MD | 1.5rem | 24px | Средние отступы |
| LG | 2rem | 32px | Большие отступы |
| XL | 3rem | 48px | Очень большие отступы |
| 2XL | 4rem | 64px | Максимальные отступы |

### Контейнер

Контейнер задан в `src/input.css` (Tailwind v4, без `tailwind.config.js`):

- **Максимальная ширина**: 1170px
- **Padding**: 1rem (16px) по горизонтали
- **Центрирование**: автоматическое

```html
<!-- Правильно: просто container -->
<div class="container">...</div>

<!-- Неправильно: избыточные классы (mx-auto и px-4 уже включены в container) -->
<div class="container mx-auto px-4">...</div>
```

```css
@layer utilities {
    .container {
        margin-inline: auto;
        padding-inline: 1rem;
        max-width: 1170px;
    }
}
```

**Правило:** в секции допускается только один `container`, без двойных обёрток.
**Исключения:** полноширинные секции с фоном — Header, Footer, CTA, Промо‑баннер (Акция), Карусели. Там `container` используется только для контента.

### Вертикальные отступы секций

Стандартные отступы для секций:

| Тип секции | Мобильные | Десктоп (lg:) | Tailwind классы |
|------------|-----------|---------------|-----------------|
| **Основные секции** | 64px | 96px | `py-16 lg:py-24` |
| **Секция стилей (объекты)** | 64px | 80px | `py-16 lg:py-20` |
| **Промо-баннер** | 24px | 24px | `py-6` |
| **CTA секция** | 96px | 128px | `py-24 md:py-32` |
| **Footer** | 32px | 48px | `py-8 lg:py-12` |

```html
<!-- Основная секция контента -->
<section class="bg-secondary py-16 lg:py-24">
    <div class="container">...</div>
</section>

<!-- Промо-баннер -->
<section class="bg-primary py-6">
    <div class="container">...</div>
</section>
```

### Использование в Tailwind

```html
<!-- Padding -->
<div class="p-4">Padding 16px</div>
<div class="px-4 py-8">Padding X: 16px, Y: 32px</div>

<!-- Margin -->
<div class="mb-8">Margin bottom 32px</div>
<div class="mt-16">Margin top 64px</div>

<!-- Gap (для flex/grid) -->
<div class="flex gap-4">Gap 16px</div>
```

### Радиусы скругления

- **SM**: 4px - для мелких элементов
- **MD**: 6px - стандарт для кнопок и карточек
- **LG**: 8px - для больших элементов
- **Full**: 9999px - для круглых элементов

```html
<div class="rounded-md">Скругление 6px</div>
<div class="rounded-lg">Скругление 8px</div>
<div class="rounded-full">Круглый элемент</div>
```

---

## Доступность (Accessibility)

### Основные правила

| Требование | Правило |
|------------|---------|
| **Контраст текста** | Минимум 4.5:1 для обычного текста (WCAG AA) |
| **Фокусные состояния** | Видимый `focus:ring` или `focus:outline` для интерактивных элементов |
| **Скрытый текст** | `sr-only` для визуально скрытого, но доступного screen readers |
| **aria-label** | Обязателен для элементов без видимого текста |

### sr-only (screen reader only)

**Обязателен** для элементов, которые визуально представлены иконками/точками, но должны быть доступны для screen readers.

```html
<!-- Page Navigator — sr-only ОБЯЗАТЕЛЕН (точки без текста) -->
<nav class="page-navigator">
    <ul>
        <li><a href="#section" class="inner-link" data-title="Название">
            <span class="sr-only">Название</span>
        </a></li>
    </ul>
</nav>

<!-- Кнопка с иконкой -->
<button>
    <svg>...</svg>
    <span class="sr-only">Закрыть</span>
</button>
```

**CSS класс `sr-only`** (уже есть в критическом CSS):
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

### aria-label

**Обязателен** для интерактивных элементов без видимого текстового содержимого:

```html
<!-- Before/After slider -->
<input type="range" min="0" max="100" value="50" 
       aria-label="Сравнить изображения до и после">

<!-- Кнопка воспроизведения видео -->
<button data-play-btn aria-label="Воспроизвести видео">
    <svg>...</svg>
</button>
```

### Контраст цветов

| Цвет | На белом фоне | Статус |
|------|---------------|--------|
| `--color-primary: #4A90E2` | 3.29:1 | ⚠️ Недостаточно для текста |
| `text-gray-600` | 4.5:1+ | ✅ OK для мелкого текста |
| `text-gray-500` | ~3.9:1 | ⚠️ Только для крупного текста |
| `text-dark (#252525)` | 12.6:1 | ✅ OK |

**Рекомендация:** для основного текста на белом фоне использовать `text-dark` или `text-body (#666666)`.

### Изображения

| Тип | Требование |
|-----|------------|
| Контентные | `alt` с описанием (с оригинала muse.ooo) |
| Декоративные | `alt=""` (пустой) |
| LCP (первый экран) | Без `loading="lazy"`, с `fetchpriority="high"` |

```html
<!-- LCP-изображение первого экрана -->
<img src="hero.webp" 
     alt="Портрет маслом на холсте" 
     width="600" height="400"
     fetchpriority="high"
     decoding="async">

<!-- Обычное изображение -->
<img src="example.webp" 
     alt="Пример портрета" 
     width="300" height="200"
     loading="lazy" 
     decoding="async">

<!-- Декоративное изображение -->
<img src="decoration.svg" alt="" aria-hidden="true">
```

### Ссылки

Текстовые ссылки **обязательно** с подчёркиванием для различимости:

```html
<a href="/info/" class="text-primary underline hover:no-underline">
    Подробнее ↗
</a>
```

---

## Компоненты

> **Важно:** Используйте компонентный подход Tailwind v4 — семантические классы в `@layer components` + утилиты. Это снижает дублирование и ускоряет смену дизайна.

### Зачем нужен компонентный подход

- **Быстрая смена дизайна:** правки в токенах (`@theme`) и компонентах, без переписывания десятков HTML‑страниц.
- **DRY и консистентность:** единые `btn-*`, `card`, `section-title`, `cta`, `step`, `check-list` вместо повторения длинных наборов утилит.
- **Масштабирование:** изменения в одном месте автоматически применяются ко всем production страницам.
- **Контроль визуального языка:** типографика, отступы и состояния закреплены в компонентах.

### Кнопки

#### Варианты кнопок (чистый Tailwind)

```html
<!-- Primary кнопка (основная) -->
<a href="#" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors">
    Заказать
</a>

<!-- Dark кнопка (на светлом фоне) -->
<a href="#" class="inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors">
    Обратный звонок
</a>

<!-- Большая кнопка (для Hero) -->
<a href="#" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg">
    Заказать
</a>
```

**Характеристики:**
- Padding: `py-2 px-6` (стандарт) или `py-3 px-8` (большая)
- Border radius: `rounded` (6px)
- Transition: `transition-colors`
- Hover эффект: `hover:bg-primary-hover` или `hover:bg-gray-700`

#### Состояния кнопок

```html
<!-- Disabled -->
<button class="btn-primary opacity-50 pointer-events-none" disabled>
        [ТЕКСТ: Кнопка недоступна]
</button>

<!-- Loading (пример с иконкой/спиннером) -->
<button class="btn-primary inline-flex items-center gap-2" aria-busy="true" aria-live="polite">
        <svg class="size-4 animate-spin" aria-hidden="true"><!-- spinner --></svg>
        <span>[ТЕКСТ: Отправка]</span>
</button>
```

**Рекомендации:**
- `disabled`: снижать прозрачность и отключать события.
- `loading`: добавлять `aria-busy="true"` и сохранять ширину кнопки.

#### Ссылки (inline)

```html
<a href="#" class="text-primary underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
        [ТЕКСТ: Ссылка в тексте]
</a>
```

**Состояния:**
- `hover`: убираем underline.
- `visited/active`: по необходимости, без изменения цветовой схемы бренда.

---

### Фокус‑стили и доступность (единый стандарт)

Используем `focus-visible` для клавиатуры и сохраняем нейтральный вид при клике мышью.

```html
<button class="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
        [ТЕКСТ: Кнопка]
</button>

<!-- На тёмном фоне -->
<a href="#" class="text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark">
        [ТЕКСТ: Ссылка]
</a>
```

---

### Формы

Базовые стили для полей и состояния ошибок. Текст форм — только с оригинала, иначе использовать плейсхолдеры.

**Правило:** у каждого поля есть `label`, `name` и корректный `type`.

**UI‑референс (зафиксировано):** Tailwind Plus UI Blocks → Application UI → Forms → Form layouts:
https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts

Примечание: используем как визуальный ориентир (сетка/отступы/состояния). Код из Tailwind Plus не копировать 1:1 без необходимости — адаптировать под правила проекта (контент 1:1 с muse.ooo, скрипты/маски по стандарту проекта).

**Отправка (текущее состояние проекта):** формы могут быть сверстаны, но не обязаны отправлять данные. Не добавлять фейковые `action`/JS‑отправку без отдельного согласования.

**Телефон (маска):** для полей телефона используем `type="tel"` (и по возможности `autocomplete="tel"`, `inputmode="tel"`). Маска применяется общим скриптом `src/html/js/nav.js` и форматирует ввод как `+7 (___) ___-__-__`.

**E-mail / Имя / Фамилия (без масок):**
- E-mail: `type="email"` + нативная валидация браузера.
- Имя/Фамилия: `type="text"` (по возможности `autocomplete="given-name"` / `autocomplete="family-name"`).
- Не подключать сторонние библиотеки масок/валидации без отдельного согласования.

```html
<label class="block text-sm font-medium text-dark mb-1" for="name">[ТЕКСТ: Имя]</label>
<input id="name" name="name" type="text" class="w-full rounded-md border border-gray-300 px-4 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2" placeholder="[ТЕКСТ: Плейсхолдер]" />

<!-- Helper -->
<p class="text-sm text-gray-500 mt-1">[ТЕКСТ: Подсказка]</p>

<!-- Error -->
<input class="w-full rounded-md border border-red-500 px-4 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2" aria-invalid="true" />
<p class="text-sm text-red-600 mt-1">[ТЕКСТ: Текст ошибки]</p>
```

**Checkbox/Radio (пример):**

```html
<label class="flex items-center gap-3 text-body">
        <input type="checkbox" class="size-4 rounded border-gray-300 text-primary focus-visible:ring-2 focus-visible:ring-primary/40" />
        <span>[ТЕКСТ: Согласие]</span>
</label>
```

---

### Таблицы данных

```html
<div class="overflow-x-auto">
    <table class="min-w-full text-left text-sm text-body">
        <thead class="text-dark">
            <tr class="border-b border-gray-200">
                <th class="py-3 pr-6 font-medium">[ТЕКСТ: Колонка]</th>
                <th class="py-3 pr-6 font-medium">[ТЕКСТ: Колонка]</th>
            </tr>
        </thead>
        <tbody>
            <tr class="border-b border-gray-100">
                <td class="py-3 pr-6">[ТЕКСТ: Значение]</td>
                <td class="py-3 pr-6">[ТЕКСТ: Значение]</td>
            </tr>
        </tbody>
    </table>
</div>
```

---

### Alert / Notice

```html
<div class="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        [ТЕКСТ: Информационное сообщение]
</div>

<div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        [ТЕКСТ: Ошибка]
</div>
```

---

### Modal / Dialog

Используем Tailwind Plus Elements (`<el-dialog>` + `<dialog>`). Сохраняем структуру и доступность.

```html
<el-dialog>
    <dialog id="dialog-example" class="backdrop:bg-black/40">
        <el-dialog-panel class="bg-white rounded-lg p-6">
            <h3 class="text-xl font-medium text-dark mb-2">[ТЕКСТ: Заголовок]</h3>
            <p class="text-body">[ТЕКСТ: Текст модального окна]</p>
            <div class="mt-6 flex justify-end gap-3">
                <button type="button" command="close" commandfor="dialog-example" class="btn-inverse">[ТЕКСТ: Закрыть]</button>
                <button type="button" class="btn-primary">[ТЕКСТ: Подтвердить]</button>
            </div>
        </el-dialog-panel>
    </dialog>
</el-dialog>
```

### Секция «Отзывы» и модальное окно OAuth

**Эталон:** [portret-maslom.html](../src/html/portret-na-zakaz/style/portret-maslom.html) — полная реализация с `el-dialog` и Invoker Commands API.

**На остальных страницах** секция «Отзывы» упрощена до заглушки — Bitrix-программист добавит реализацию при интеграции.

#### Кнопка открытия (Invoker Commands):
```html
<button type="button" command="show-modal" commandfor="review-modal" class="btn-primary btn-lg">
    Оставить отзыв
</button>
```

#### Модальное окно:
```html
<el-dialog>
    <dialog id="review-modal" class="m-auto p-0 border-none bg-transparent backdrop:bg-black/60">
        <el-dialog-panel>
            <div class="bg-dark text-white rounded-lg shadow-2xl max-w-md w-full p-6">
                <!-- Заголовок, OAuth-кнопки, подпись -->
            </div>
        </el-dialog-panel>
    </dialog>
</el-dialog>
```

#### Кнопка закрытия (Invoker Commands):
```html
<button type="button" command="close" commandfor="review-modal" aria-label="Закрыть окно">
    <svg>...</svg>
</button>
```

**Примечание:** OAuth URL в шаблоне — плейсхолдеры. Актуальные URL генерирует Bitrix. См. [INTEGRATION_BITRIX.md](INTEGRATION_BITRIX.md).

---

### Компонентные классы (Tailwind v4)

Единые классы для DRY‑разметки. Реализация в `@layer components`.

#### Кнопки: `btn-primary`, `btn-inverse`, `btn-lg`

```html
<a href="#" class="btn-primary">[ТЕКСТ: Заказать]</a>
<a href="#" class="btn-inverse">[ТЕКСТ: Обратный звонок]</a>
<a href="#" class="btn-primary btn-lg">[ТЕКСТ: Заказать]</a>
```

**Назначение:** заменить длинные цепочки утилит в HTML и централизовать hover/размеры.

#### Шаги процесса: `step-container`, `process-step`

```html
<div class="step-container">
    <div class="step-line"></div>

    <div class="process-step flex gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
            <span class="text-xl font-bold text-primary">1</span>
        </div>
        <div>
            <h3 class="text-xl font-medium text-dark mb-2">[ТЕКСТ: Заголовок шага]</h3>
            <p class="text-body">[ТЕКСТ: Описание шага]</p>
        </div>
    </div>
    <!-- ... другие шаги -->
</div>
```

**Назначение:** единая вертикальная линия + отступы/структура шагов.

#### Характеристики: `check-list`

```html
<ul class="check-list">
    <li class="check-list-item"><span>[ТЕКСТ: характеристика]</span></li>
    <li class="check-list-item"><span>[ТЕКСТ: характеристика]</span></li>
    <!-- ... -->
</ul>
```

**Назначение:** единый маркер/отступы для списков характеристик.

#### Преимущества: `advantages-section`, `advantages-grid`, `advantage-card`

```html
<section class="advantages-section">
    <div class="container mb-12">
        <h2 class="advantages-title">[ТЕКСТ: Преимущества]</h2>
    </div>
    <div class="container">
        <div class="advantages-grid">
            <div class="advantage-card">
                <div class="advantage-card__icon">
                    <svg class="icon-advantage" aria-hidden="true"><!-- иконка --></svg>
                </div>
                <p class="advantage-card__text">[ТЕКСТ: описание преимущества]</p>
            </div>
            <!-- ... другие карточки -->
        </div>
    </div>
</section>
```

**Назначение:** единый визуальный блок преимуществ с иконками и сеткой.

#### CTA секция: `cta-section`, `cta-container`

```html
<section class="cta-section">
    <div class="cta-container">
        <h2 class="cta-title">[ТЕКСТ: заголовок CTA]</h2>
        <div class="cta-actions">
            <a href="#" class="btn-primary">[ТЕКСТ: Заказать]</a>
            <a href="#" class="btn-inverse">[ТЕКСТ: Обратный звонок]</a>
        </div>
    </div>
</section>
```

**Назначение:** унификация CTA‑блоков на ключевых страницах.

#### Лого‑облако: `logo-cloud`, `logo-cloud__list`, `logo-cloud__item`

```html
<section class="logo-cloud">
    <div class="container mb-8 text-center">
        <h3 class="text-3xl lg:text-4xl font-light text-dark">[ТЕКСТ: Нам доверяют]</h3>
    </div>
    <div class="logo-cloud__list">
        <div class="logo-cloud__item">
            <img src="logo.webp" alt="[ТЕКСТ: Компания]" width="73" height="50" loading="lazy" decoding="async">
        </div>
        <!-- ... другие логотипы -->
    </div>
</section>
```

**Назначение:** единый блок логотипов (сеткой или в карусели через `carousel-scroll`).

#### Наборы иконок (без привязки к секции)

Иконки не привязываются к конкретной секции: это общий каталог, а использование фиксируется на странице.

1) **Галерея** — набор из [src/icons/gallery-optimized.html](src/icons/gallery-optimized.html) (используется в галереях/превью).
2) **Нестандартные** — кастомные SVG‑иконки для маркетинговых блоков (например, «Преимущества», «Варианты для заказа», «Почему нам можно доверять»).
3) **UI‑иконки** — служебные (соцсети, навигация, стрелки, кнопки, видео и т.п.). Сюда же входят иконки провайдеров в модальном окне отзыва (OAuth): Яндекс, Mail.Ru, VK, Google, Одноклассники (логотипы провайдеров, не из футера).

**Правило:** если появляется новый SVG‑набор, добавлять его в этот список и отмечать страницы‑источники.

**Навигационные иконки (текущая стратегия): только Inline SVG.**

Правила:
- Используем inline `<svg>` прямо в HTML (спрайта и сборки спрайта сейчас нет).
- Для цвета — `fill="currentColor"` (или `stroke="currentColor"`) + управление цветом через классы Tailwind (`text-dark`, `text-primary`, и т.д.).
- Сохраняем `viewBox`; не полагаемся на жёсткие `width/height` в атрибутах — размер задаём классами (`w-5 h-5`, `size-5`, и т.п.).
- Удаляем мусорные атрибуты из SVG (например, inline-стили, лишние `id`, `data-*`), если это не ломает отображение.

#### Кнопка "Наверх" (Back to Top)

Фиксированная круглая кнопка в правом нижнем углу. Появляется при прокрутке страницы вниз (на 300px). Скрыта на мобильных устройствах.

```html
<a href="#" id="back-to-top" class="hidden md:flex fixed bottom-5 right-5 w-12 h-12 items-center justify-center rounded-full bg-white text-dark hover:bg-dark hover:text-white border border-gray-300 hover:border-dark transition-colors z-50 opacity-0 pointer-events-none" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</a>
```

**Характеристики:**
- Размер: `w-12 h-12` (48×48px)
- Позиция: `fixed bottom-5 right-5`
- Фон: `bg-white` → `hover:bg-dark`
- Цвет иконки: `text-dark` → `hover:text-white`
- Рамка: `border border-gray-300` → `hover:border-dark`
- Форма: `rounded-full`
- Скрыта по умолчанию: `opacity-0 pointer-events-none`
- Показывать при скролле через JS, добавляя `opacity-100` и убирая `pointer-events-none`
- Видимость: `hidden md:flex` (скрыта на мобильных)
- Доступность: `aria-label="Наверх"`

#### Модальное окно отзыва (OAuth)

Единый шаблон модального окна авторизации для отзывов. Должно открываться по центру экрана, с кликом по фону для закрытия.

```html
<dialog id="review-modal" class="p-0 bg-transparent border-none outline-none backdrop:bg-black/60 m-auto overflow-visible">
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onclick="if(event.target === this) this.closest('dialog').close()">
        <div class="bg-dark text-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            <!-- контент модалки (заголовок, текст, OAuth‑кнопки) 1:1 с оригинала -->
        </div>
    </div>
</dialog>
```

**Иконки провайдеров:** использовать inline SVG логотипы Яндекс/Mail.Ru/VK/Google/Одноклассники в кнопках авторизации. Они не связаны с иконками футера.

### Карточки

#### Feature Card (карточка преимущества)

```html
<div class="flex flex-col p-6 border border-gray-200 rounded bg-white">
    <div class="mb-6 flex size-10 items-center justify-start">
        <!-- Иконка SVG с class="text-primary" -->
        <svg class="text-primary">...</svg>
    </div>
    <span class="text-xl text-dark">Собственное производство</span>
</div>
```

**Характеристики:**
- Padding: `p-6` (24px)
- Border: `border border-gray-200`
- Border radius: `rounded`
- Фон: `bg-white`

#### Product Card (карточка товара)

```html
<div class="group">
    <a href="#" class="block">
        <img src="..." alt="..." class="w-full h-auto rounded-t" loading="lazy">
        <div class="p-4 bg-dark rounded-b">
            <span class="text-lg font-medium text-white block mb-2">Название товара</span>
            <p class="text-primary">Подробнее</p>
        </div>
    </a>
</div>
```

### Секции

#### Hero секция (с видео)

```html
<section class="relative h-[65vh] lg:h-screen overflow-hidden bg-dark">
    <video class="absolute inset-0 w-full h-full object-cover hidden lg:block" 
           autoplay loop muted playsinline preload="none" 
           title="Описание видео">
        <source src="..." media="(min-width: 1024px)" type="video/webm">
        <source src="..." media="(min-width: 1024px)" type="video/mp4">
    </video>
    <div class="absolute inset-0 bg-dark opacity-20"></div>
    <div class="container h-full flex items-center relative z-10">
        <div class="max-w-2xl">
            <p class="text-4xl lg:text-6xl font-light text-white mb-4">Заголовок</p>
            <h1 class="text-xl text-white/90 mb-8">Подзаголовок</h1>
            <a href="#" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg">
                Кнопка
            </a>
        </div>
    </div>
</section>
```

**Характеристики:**
- Высота: `h-[65vh]` на мобильных, `lg:h-screen` на десктопе
- Видео скрыто на мобильных (`hidden lg:block`)
- Подложка: `bg-dark opacity-20`
- Видео атрибуты: `preload="none"`, `title`, `media` для условной загрузки

#### Секция преимуществ

```html
<section class="bg-secondary py-16 lg:py-24">
    <div class="container">
        <div class="mx-auto max-w-2xl mb-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-dark">Преимущества</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Карточки преимуществ -->
        </div>
    </div>
</section>
```

#### CTA секция

```html
<section class="bg-secondary py-24 md:py-32">
    <div class="container xl:flex xl:items-center xl:justify-between">
        <h2 class="text-2xl font-light tracking-tight text-dark">
            Создай своё произведение искусства
        </h2>
        <div class="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0">
            <a href="#" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Заказать
            </a>
            <a href="#" class="inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Обратный звонок
            </a>
        </div>
    </div>
</section>
```

#### Промо-баннер

```html
<section class="bg-primary text-white py-6">
    <div class="container">
        <div class="flex items-center justify-center">
            <p class="text-xl">Скидка 20% с 3 по 4 января</p>
        </div>
    </div>
</section>
```

#### Breadcrumbs (хлебные крошки)

Навигационная цепочка, показывающая путь до текущей страницы. Размещается в Hero-секции над заголовком.

```html
<nav class="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
    <ol class="flex list-none p-0">
        <li class="flex items-center">
            <a href="/" class="hover:underline">Главная</a>
            <span class="mx-2">/</span>
        </li>
        <li class="flex items-center">
            <a href="/portret-na-zakaz/" class="hover:underline">Портрет на заказ</a>
            <span class="mx-2">/</span>
        </li>
        <li class="text-gray-500">Название страницы</li>
    </ol>
</nav>
```

**Характеристики:**
- Размер: `text-sm` (14px)
- Цвет ссылок: `text-gray-600` → hover: `underline`
- Цвет текущей страницы: `text-gray-500`
- Разделитель: `/` с отступами `mx-2`

#### Page Header (серый фон + крошки + H1)

Базовый заголовок страницы с хлебными крошками на сером фоне. Используется на страницах FAQ, блогов и информационных разделов.

```html
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
    <div class="container">
        <nav class="text-sm text-gray-600 mb-4" aria-label="Хлебные крошки">
            <ol class="flex items-center space-x-2">
                <li><a href="/" class="hover:text-primary transition-colors">Главная</a></li>
                <li>/</li>
                <li><a href="/info/" class="hover:text-primary transition-colors">О нас</a></li>
                <li>/</li>
                <li class="text-dark">Вопросы и ответы</li>
            </ol>
        </nav>

        <h1 class="text-4xl lg:text-6xl font-light text-dark">Вопросы и ответы</h1>
    </div>
</section>
```

**Характеристики:**
- Фон секции: `bg-secondary`
- Отступы: `pt-8 pb-8 lg:pt-12 lg:pb-12`
- Заголовок H1: `text-4xl lg:text-6xl font-light text-dark`
- Крошки: `text-gray-600` + `/` как разделитель

#### Характеристики (список с чередованием фона)

Список характеристик товара/услуги с чередующимся голубым фоном.

```html
<ul class="space-y-1">
    <li class="flex items-start gap-3 py-1.5 odd:bg-primary/5 odd:rounded odd:px-3 odd:-mx-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Название:</strong> Значение</span>
    </li>
    <li class="flex items-start gap-3 py-1.5 odd:bg-primary/5 odd:rounded odd:px-3 odd:-mx-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Название:</strong> Значение</span>
    </li>
</ul>
```

**ВАЖНО:** Класс `odd:bg-primary/5 odd:rounded odd:px-3 odd:-mx-3` должен быть на **КАЖДОМ** `<li>`. Tailwind автоматически применит фон к нечётным элементам (1, 3, 5...).

**Результат:** голубой → белый → голубой → белый...

#### Таблица (цены, характеристики)

Таблица с чередующимся голубым фоном строк для лучшей читаемости.

```html
<div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="border-b border-gray-200">
                <th class="py-2 pr-4 font-medium whitespace-nowrap">Размеры, см</th>
                <th class="py-2 pr-4 font-medium whitespace-nowrap">Одно лицо</th>
                <th class="py-2 font-medium whitespace-nowrap">Два лица</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr class="odd:bg-primary/5">
                <td class="py-2 pr-4">30×40</td>
                <td class="py-2 pr-4">4 693 ₽</td>
                <td class="py-2">5 653 ₽</td>
            </tr>
            <tr class="odd:bg-primary/5">
                <td class="py-2 pr-4">40×60</td>
                <td class="py-2 pr-4">5 293 ₽</td>
                <td class="py-2">6 253 ₽</td>
            </tr>
            <tr class="odd:bg-primary/5">
                <td class="py-2 pr-4">90×120</td>
                <td class="py-2 pr-4">9 060 ₽</td>
                <td class="py-2">10 020 ₽</td>
            </tr>
        </tbody>
    </table>
</div>
```

**Особенности:**
- `overflow-x-auto` — горизонтальный скролл на мобильных
- `odd:bg-primary/5` — чередующийся голубой фон (1, 3, 5... строки)
- `border-b border-gray-200` — линия только под заголовками
- `whitespace-nowrap` на `<th>` — заголовки не переносятся
- `py-2` на всех `<td>` — равномерные вертикальные отступы

---

## Интерактивные компоненты

Компоненты, требующие CSS и/или JavaScript. Начиная с версии Tailwind v4, основные эффекты вынесены в глобальные утилиты в `input.css`.

### Слайдер "До/После" (ba-card)

Используется для сравнения оригинала фото и готового портрета.

**HTML:**
```html
<div class="ba-card relative w-full aspect-[378/265] overflow-hidden rounded-xl shadow-2xl" style="--pos: 50%;">
    <!-- Изображение "До" (фоновое) -->
    <img class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
         src="img/before.jpg" alt="Оригинал">
    
    <!-- Изображение "После" (обрезаемое) -->
    <img class="after-image absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
         src="img/after.jpg" alt="Результат">
    
    <!-- Контроллер (ползунок) -->
    <input type="range" min="0" max="100" value="50" 
           aria-label="Сравнить изображения до и после"
           class="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full m-0 z-20" 
           oninput="this.parentNode.style.setProperty('--pos', this.value + '%')">
    
    <!-- Визуальный разделитель -->
    <div class="ba-divider absolute top-0 bottom-0 w-[3px] bg-white -translate-x-1/2 pointer-events-none z-10"></div>
    
    <!-- Ручка (Handle) -->
    <div class="ba-handle absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[70px] pointer-events-none z-[15]">
        <span class="absolute top-1/2 -translate-y-1/2 -left-4 text-2xl font-bold text-white drop-shadow-xl select-none">‹</span>
        <span class="absolute top-1/2 -translate-y-1/2 -right-4 text-2xl font-bold text-white drop-shadow-xl select-none">›</span>
    </div>
</div>
```

### 3D Эффект Холста (.canvas-3d)

Создает эффект объема и глубины для изображений картин.

**HTML:**
```html
<div class="canvas-3d" style="--depth: 25px;">
    <img src="img/portrait.jpg" alt="Портрет на холсте">
</div>
```

**Настройки:**
- `--depth`: Глубина "подрамника" (по умолчанию 20px).

---

## Визуальные эффекты

**HTML:**
```html
<div class="group relative aspect-video rounded-lg overflow-hidden shadow-lg"
     data-video-cover
     data-video-src="https://www.youtube.com/embed/VIDEO_ID?rel=0&amp;showinfo=0"
     data-video-title="[ТЕКСТ: заголовок видео]">
    <!-- Обложка -->
    <img src="cover.jpg" alt="[ТЕКСТ: описание обложки]"
         class="w-full h-full object-cover group-[.video-playing]:hidden" loading="lazy" decoding="async">

    <!-- Кнопка Play -->
    <button type="button"
            class="absolute inset-0 flex items-center justify-center z-10 cursor-pointer
                   bg-black/20 hover:bg-black/30 transition-colors
                   group-[.video-playing]:hidden"
            data-play-btn aria-label="Смотреть видео">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg">
            <path d="M8 5v14l11-7z"/>
        </svg>
    </button>
</div>
```

**Aspect Ratio:**
- Горизонтальное видео (YouTube): `aspect-video` (16:9)
- Вертикальное видео (TikTok/Reels): `aspect-[360/648]` (9:16)

**JavaScript:** реализовано в общем `js/nav.js` (inline-скрипт не добавлять). `nav.js` по клику добавит класс `video-playing` и создаст `iframe` лениво на основе `data-video-src`.

### Carousel Scroll

Горизонтальная карусель с drag-прокруткой на десктопе.

**CSS (обязательно):**
```css
.carousel-scroll {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
}
.carousel-scroll::-webkit-scrollbar { display: none; }
```

**HTML:**
```html
<div class="carousel-scroll pb-4">
    <div class="flex gap-4 px-4" style="min-width: max-content;">
        <!-- Элементы карусели -->
        <div class="flex-shrink-0 w-[223px] snap-center">...</div>
        <div class="flex-shrink-0 w-[223px] snap-center">...</div>
    </div>
</div>
```

**JavaScript:** реализовано в общем `js/nav.js` (inline-скрипт не добавлять). Хуки: `.carousel-scroll` и (опционально) кнопки `.js-carousel-prev/.js-carousel-next`.

### Page Navigator

Боковая навигация по секциям страницы (только на десктопе).

**CSS (обязательно):**
```css
.page-navigator { position: fixed; top: 50%; transform: translateY(-50%); right: 1.85714286em; z-index: 9999; }
.page-navigator ul { display: inline-block; padding: 0.92857143em; background: rgba(0, 0, 0, 0.4); border-radius: 1.85714286em; }
.page-navigator ul:hover { background: rgba(0, 0, 0, 0.6); }
.page-navigator ul li { list-style: none; }
.page-navigator ul li:not(:last-child) { margin-bottom: 1.85714286em; }
@media (max-width: 1023px) { .page-navigator { display: none !important; } }
.page-navigator li a { width: 8px; height: 8px; background: #fff; border-radius: 50%; transition: all 0.3s ease; display: block; position: relative; opacity: 0.5; }
.page-navigator li a:hover, .page-navigator li a.inner-link--active { opacity: 1; }
.page-navigator li a[data-title]:before { content: attr(data-title); position: absolute; right: 12px; top: -14px; background: #222; color: #fff; border-radius: 6px; padding: 4px 8px; display: inline-block; white-space: nowrap; font-size: 12px; opacity: 0; transition: all 0.2s ease; }
.page-navigator li a[data-title]:hover:before { opacity: 1; }
.page-navigator li a:hover { transform: scale(1.5); }
```

**HTML:**
```html
<nav class="page-navigator" aria-label="Навигация по странице">
    <ul>
        <li><a href="#hero" data-title="Главная" class="inner-link"><span class="sr-only">Главная</span></a></li>
        <li><a href="#description" data-title="Описание" class="inner-link"><span class="sr-only">Описание</span></a></li>
        <li><a href="#examples" data-title="Примеры" class="inner-link"><span class="sr-only">Примеры</span></a></li>
        <li><a href="#order" data-title="Заказать" class="inner-link"><span class="sr-only">Заказать</span></a></li>
    </ul>
</nav>
```

**Доступность:** Каждая ссылка **обязательно** должна содержать `<span class="sr-only">` с названием секции для screen readers, т.к. визуально ссылки отображаются только как точки.

JavaScript для подсветки активной секции находится в `js/nav.js`.

---

## Визуальные эффекты

### Canvas 3D

3D эффект для изображений с тенью и hover-анимацией.

**CSS:**
```css
.canvas-3d {
    --depth: 30px;
    position: relative;
    box-shadow: var(--depth) var(--depth) 50px rgba(0,0,0,0.4);
    transition: transform 0.3s ease;
}
.canvas-3d:hover {
    transform: translate(-5px, -5px);
}
```

**HTML:**
```html
<div class="canvas-3d rounded-lg overflow-hidden">
    <img src="image.jpg" alt="..." class="w-full h-auto">
</div>
```

### Ken Burns Effect

Медленная анимация масштабирования для Hero-изображений.

**CSS:**
```css
@keyframes kenburns {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
}
.ken-burns-img {
    animation: kenburns 20s ease-out forwards;
}
```

**HTML:**
```html
<img src="hero.jpg" alt="..." class="w-full h-full object-cover ken-burns-img">
```

### Видео — общие рекомендации

Видео не является типовым компонентом — каждый случай индивидуален. Общие правила:

1. **Всегда:** `preload="none"` — не загружать до показа
2. **Автовоспроизведение:** `muted loop playsinline` — обязательно `muted` для автоплея
3. **Фоновое видео (Hero):** скрывать на мобильных — `hidden lg:block`
4. **Poster:** всегда указывать картинку-заглушку

**Форматы:** WebM (приоритет), MP4 (fallback)

**Hero фоновое видео:**
```html
<video class="absolute inset-0 w-full h-full object-cover hidden lg:block" 
       autoplay loop muted playsinline preload="none">
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
</video>
```

**Контентное видео (в секции):**
```html
<video class="w-full h-full object-cover" 
       autoplay loop muted playsinline preload="none"
       poster="poster.webp">
    <source src="video.webm" type="video/webm">
</video>
```

**Примечание:** `preload="none"` уже обеспечивает отложенную загрузку — браузер сам решает когда грузить.

### Hover эффекты

Стандартные паттерны для интерактивных элементов.

```html
<!-- Подъём при наведении (кнопки, карточки) -->
<a class="... transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
    Кнопка
</a>

<!-- Масштабирование (изображения) -->
<div class="overflow-hidden">
    <img class="transition-transform hover:scale-105" src="...">
</div>

<!-- Изменение прозрачности -->
<a class="opacity-70 hover:opacity-100 transition-opacity">Ссылка</a>
```

---

### FAQ Accordion (аккордеон вопросов-ответов)

Нативный HTML аккордеон без JavaScript, использует `<details>` и `<summary>`.

**Приоритет:** для публичных страниц с FAQ (SEO) используем этот вариант (без JS). `el-disclosure` оставляем для UI-аккордеонов/сложных интерфейсов.

```html
<div class="space-y-0 divide-y divide-gray-200">
    <!-- Вопрос 1 (открыт по умолчанию) -->
    <details class="group" open>
        <summary class="flex items-center justify-between gap-4 py-4 cursor-pointer text-lg font-medium text-dark hover:opacity-80 transition-opacity list-none [&::-webkit-details-marker]:hidden">
            <span>Какие бывают размеры?</span>
            <svg class="size-5 flex-shrink-0 text-dark transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
        </summary>
        <div class="pb-4 text-body">
            <p>Ответ на вопрос...</p>
        </div>
    </details>
    
    <!-- Вопрос 2 -->
    <details class="group">
        <summary class="flex items-center justify-between gap-4 py-4 cursor-pointer text-lg font-medium text-dark hover:opacity-80 transition-opacity list-none [&::-webkit-details-marker]:hidden">
            <span>Сколько стоит?</span>
            <svg class="size-5 flex-shrink-0 text-dark transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
        </summary>
        <div class="pb-4 text-body">
            <p>Ответ на вопрос...</p>
        </div>
    </details>
</div>
```

**Ключевые классы:**
- `group` — для связи с дочерними элементами
- `group-open:rotate-180` — поворот стрелки при открытии
- `[&::-webkit-details-marker]:hidden` — скрывает стандартный маркер браузера
- `divide-y divide-gray-200` — разделители между вопросами
- `open` — атрибут для открытия по умолчанию

**Schema.org разметка (для SEO):**
```html
<div itemscope itemtype="http://schema.org/FAQPage">
    <details itemprop="mainEntity" itemscope itemtype="http://schema.org/Question">
        <summary>
            <span itemprop="name">Вопрос?</span>
        </summary>
        <div itemprop="acceptedAnswer" itemscope itemtype="http://schema.org/Answer">
            <div itemprop="text">Ответ...</div>
        </div>
    </details>
</div>
```

**Преимущества:**
- ✅ Без JavaScript — работает нативно
- ✅ Доступность — работает с клавиатурой
- ✅ SEO — поддерживает Schema.org

---

### Tabs (вкладки)

**Статус:** fallback/legacy. По умолчанию используем `el-tab-group` (см. следующий раздел). Этот вариант применять только если `el-tab-group` временно недоступен/нестабилен на конкретной странице.

Переключение между контентом с подчеркиванием активной вкладки.

```html
<!-- Tabs Navigation -->
<div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
    <button 
        class="px-6 py-3 text-lg font-medium text-dark hover:text-dark focus:outline-none border-b-2 border-primary transition-colors" 
        data-tab="moscow"
    >
        Москва
    </button>
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors" 
        data-tab="spb"
    >
        Санкт-Петербург
    </button>
</div>

<!-- Tab Content -->
<div id="moscow" class="tab-content block">
    <p>Контент для Москвы...</p>
</div>
<div id="spb" class="tab-content hidden">
    <p>Контент для Санкт-Петербурга...</p>
</div>
```

**CSS (критический):**
```css
.tab-content { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

**JavaScript (inline перед `</body>`):**
```javascript
(() => {
    const buttons = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('.tab-content');
    if (!buttons.length || !panels.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => {
                b.classList.remove('border-primary', 'text-dark');
                b.classList.add('border-transparent');
            });
            panels.forEach((panel) => {
                panel.classList.add('hidden');
                panel.classList.remove('block');
            });

            btn.classList.remove('border-transparent');
            btn.classList.add('border-primary', 'text-dark');

            const target = document.getElementById(btn.dataset.tab);
            if (target) {
                target.classList.remove('hidden');
                target.classList.add('block');
            }
        });
    });
})();
```

**Ключевые классы:**
- `border-b-2 border-primary` — подчеркивание активной вкладки
- `border-transparent` — неактивная вкладка
- `overflow-x-auto` — горизонтальная прокрутка на мобильных
- `hidden` / `block` — переключение видимости контента

---

### Tabs (Tailwind Plus Elements) — галерея характеристик

Переключение изображений через `el-tab-group` с миниатюрами (используется в секции характеристик).

```html
<el-tab-group class="flex flex-col-reverse">
    <!-- Миниатюры -->
    <div class="mx-auto mt-4 w-full max-w-md">
        <el-tab-list class="grid grid-cols-4 gap-3">
            <button class="relative flex h-16 cursor-pointer items-center justify-center rounded bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-hidden">
                <span class="sr-only">[ТЕКСТ: описание миниатюры]</span>
                <span class="absolute inset-0 overflow-hidden rounded">
                    <img src="[URL_82x62.webp]" alt="[ТЕКСТ: alt миниатюры]" title="[ТЕКСТ: title миниатюры]" width="82" height="62" class="size-full object-cover" loading="lazy" decoding="async" />
                </span>
                <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded ring-2 ring-transparent ring-offset-2 in-aria-selected:ring-primary"></span>
            </button>
            <!-- ... другие миниатюры -->
        </el-tab-list>
    </div>

    <!-- Большие изображения -->
    <el-tab-panels>
        <div>
            <img src="[URL_458x258.webp]" alt="[ТЕКСТ: alt изображения]" title="[ТЕКСТ: title изображения]" width="458" height="258" class="w-full rounded-lg object-cover" loading="lazy" decoding="async" />
        </div>
        <div hidden>
            <img src="[URL_458x258.webp]" alt="[ТЕКСТ: alt изображения]" title="[ТЕКСТ: title изображения]" width="458" height="258" class="w-full rounded-lg object-cover" loading="lazy" decoding="async" />
        </div>
        <!-- Видео-вкладка (опционально) -->
        <div hidden data-video-panel>
              <div class="video-cover group relative aspect-video rounded-lg"
                 data-video-cover
                 data-video-src="https://www.youtube.com/embed/VIDEO_ID?rel=0&amp;showinfo=0"
                 data-video-title="[ТЕКСТ: заголовок видео]">
                <img src="[URL_458x258.webp]" alt="[ТЕКСТ: обложка видео]" width="458" height="258" class="w-full h-full object-cover rounded-lg group-[.video-playing]:hidden" loading="lazy" decoding="async" />
                <button type="button" class="video-play-icon cursor-pointer group-[.video-playing]:hidden" data-play-btn aria-label="Смотреть видео">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>
        </div>
    </el-tab-panels>
</el-tab-group>
```

**Ключевые детали:**
- `in-aria-selected:ring-primary` — подсветка активной миниатюры.
- Видео-вкладка добавляется через `data-video-panel` и стандартный `Video Cover`.

---

### Timeline/Steps (шаги процесса)

Вертикальная линия с пронумерованными шагами.

```html
<div class="relative">
    <!-- Пунктирная линия между шагами -->
    <div class="absolute left-6 top-12 bottom-12 w-0 border-l-[3px] border-dashed border-primary/30"></div>
    <div class="space-y-8 relative">
        <!-- Шаг 1 -->
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-dark flex items-center justify-center relative z-10">
                <span class="text-xl font-bold text-white">1</span>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-white mb-2">Заголовок шага</h3>
                <p class="text-gray-300">Описание шага...</p>
            </div>
        </div>
        <!-- Шаг 2 -->
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-dark flex items-center justify-center relative z-10">
                <span class="text-xl font-bold text-white">2</span>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-white mb-2">Заголовок шага</h3>
                <p class="text-gray-300">Описание шага...</p>
            </div>
        </div>
    </div>
</div>
```

**Особенности:**
- Линия: `border-l-[3px] border-dashed border-primary/30`
- Круг с номером: `w-12 h-12 rounded-full border-2 border-primary`
- `z-10` на кругах чтобы перекрывать линию

---

### Video Modal (модальное окно с видео)

Полноэкранное модальное окно для просмотра видео с навигацией.

**CSS (в `<style>`):**
```css
.video-modal { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.95); display: none; align-items: center; justify-content: center; }
.video-modal.active { display: flex; }
.video-modal-content { position: relative; max-width: 400px; width: 100%; max-height: 90vh; }
.video-modal video { width: 100%; max-height: 80vh; border-radius: 8px; }
.video-modal-close, .video-modal-mute, .video-modal-prev, .video-modal-next { position: absolute; background: rgba(255,255,255,0.2); border: none; color: white; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 10; }
.video-modal-close:hover, .video-modal-mute:hover, .video-modal-prev:hover, .video-modal-next:hover { background: rgba(255,255,255,0.3); }
.video-modal-close { top: 10px; right: 10px; }
.video-modal-mute { top: 10px; left: 10px; }
.video-modal-prev { top: 50%; left: -60px; transform: translateY(-50%); }
.video-modal-next { top: 50%; right: -60px; transform: translateY(-50%); }
@media (max-width: 600px) { .video-modal-prev { left: 10px; top: auto; bottom: 80px; } .video-modal-next { right: 10px; top: auto; bottom: 80px; } }
```

**HTML:**
```html
<!-- Триггеры (карточки видео в карусели) -->
<div class="video-card cursor-pointer relative overflow-hidden" data-video="https://example.com/video.webm">
    <img src="poster.jpg" alt="..." class="w-[223px] h-[396px] object-cover">
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
        <p class="text-sm text-white/90 mb-2">Описание видео</p>
        <div class="flex items-center gap-2 text-white/80 text-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>0:43</span>
        </div>
    </div>
</div>

<!-- Модальное окно -->
<div class="video-modal">
    <div class="video-modal-content">
        <video controls></video>
        <button class="video-modal-close">×</button>
        <button class="video-modal-mute">🔊</button>
        <button class="video-modal-prev">‹</button>
        <button class="video-modal-next">›</button>
    </div>
</div>
```

**JavaScript (inline перед `</body>`):**
```javascript
(function() {
    const modal = document.querySelector('.video-modal');
    if (!modal) return;
    
    const video = modal.querySelector('video');
    const closeBtn = modal.querySelector('.video-modal-close');
    const muteBtn = modal.querySelector('.video-modal-mute');
    const prevBtn = modal.querySelector('.video-modal-prev');
    const nextBtn = modal.querySelector('.video-modal-next');
    
    // Ищем карточки с data-video
    const videoCards = Array.from(document.querySelectorAll('.video-card[data-video]'));
    let currentIndex = 0;
    
    function openModal(index) {
        currentIndex = index;
        const trigger = videoCards[index];
        if (trigger && video) {
            video.src = trigger.dataset.video;
            video.muted = false;
            modal.classList.add('active');
            video.play();
        }
    }
    
    function closeModal() {
        modal.classList.remove('active');
        if (video) { video.pause(); video.src = ''; }
    }
    
    videoCards.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(index);
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (muteBtn) muteBtn.addEventListener('click', () => { 
        if (video) {
            video.muted = !video.muted;
            muteBtn.querySelector('.mute-icon')?.classList.toggle('hidden', !video.muted);
            muteBtn.querySelector('.unmute-icon')?.classList.toggle('hidden', video.muted);
        }
    });
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentIndex > 0) openModal(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentIndex < videoCards.length - 1) openModal(currentIndex + 1); });
    
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
})();
```

---

### Typed.js (эффект печатающегося текста)

Анимация печатающегося текста с мигающим курсором.

**CSS (в критическом CSS):**
```css
.typed-cursor { display: inline-block; width: 3px; background-color: var(--primary); animation: blink 1s infinite; margin-left: 2px; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
```

**HTML:**
```html
<h1 class="text-4xl lg:text-6xl font-light text-white mb-4">
    Печатаем <span id="typed-text" class="text-primary"></span><span class="typed-cursor">&nbsp;</span>
    <br class="hidden sm:block">на холсте и пишем портреты по фото
</h1>
```

**JavaScript (inline перед `</body>`):**
```html
<!-- Typed.js CDN -->
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        new Typed('#typed-text', {
            strings: ['фото', 'картины', 'репродукции', 'портреты'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }
});
</script>
```

**Особенности:**
- Библиотека: [Typed.js](https://github.com/mattboldt/typed.js/)
- CDN: `https://cdn.jsdelivr.net/npm/typed.js@2.0.12`
- Курсор стилизуется через CSS, не через библиотеку

---

## Grid системы

### Сетки для галерей

```html
<!-- 2 колонки -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">...</div>

<!-- 3 колонки -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>

<!-- 4 колонки -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">...</div>
```

### Aspect Ratio

Фиксированные пропорции для изображений и видео.

```html
<!-- Видео 16:9 -->
<div class="aspect-video">...</div>

<!-- Квадрат -->
<div class="aspect-square">...</div>

<!-- Кастомные пропорции -->
<div class="aspect-[4/3]">...</div>
<div class="aspect-[378/265]">...</div>
<div class="aspect-[360/648]">...</div>
```

---

## Header и Mobile Menu

### Header (шапка сайта)

```html
<header class="bg-dark sticky top-0 z-50">
    <nav class="container flex items-center justify-between gap-x-4 py-5">
        <!-- Logo -->
        <div class="flex-shrink-0">
            <a href="/" class="-m-1.5 p-1.5 flex items-center">
                <svg class="h-7 w-auto">...</svg>
            </a>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden xl:flex xl:items-center xl:gap-x-6">
            <a href="/pechat/" class="text-gray-400 hover:text-white transition-colors uppercase">Печать</a>
            <a href="/portret-na-zakaz/" class="text-gray-400 hover:text-white transition-colors uppercase">Портреты</a>
            <a href="/info/dostavka/" class="text-gray-400 hover:text-white transition-colors uppercase">Доставка</a>
            <a href="tel:88007076921" class="text-gray-400 hover:text-white transition-colors">8-800-707-69-21</a>
            <a href="/order/" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors">
                Заказать
            </a>
        </div>
        
        <!-- Mobile Menu Button -->
        <div class="xl:hidden">
            <button type="button" class="text-gray-400 hover:text-white p-2" aria-label="Меню">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                </svg>
            </button>
        </div>
    </nav>
</header>
```

**Характеристики:**
- Фон: `bg-dark` (#252525)
- Позиция: `sticky top-0 z-50`
- Ссылки: `text-gray-400 hover:text-white transition-colors uppercase`
- Desktop меню: `hidden xl:flex`
- Mobile кнопка: `xl:hidden`

### Mobile Menu

Использует Tailwind Plus Elements (`<el-dialog>`):

```html
<el-dialog id="mobile-menu" class="xl:hidden">
    <div class="fixed inset-0 z-50">
        <el-dialog-overlay class="fixed inset-0 bg-black/50"></el-dialog-overlay>
        <el-dialog-panel class="fixed inset-y-0 right-0 w-full max-w-sm bg-dark p-6">
            <!-- Close button -->
            <button type="button" data-el-dialog-close class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            
            <!-- Menu links -->
            <nav class="mt-8 space-y-4">
                <a href="/pechat/" class="block text-gray-400 hover:text-white text-lg">Печать</a>
                <a href="/portret-na-zakaz/" class="block text-gray-400 hover:text-white text-lg">Портреты</a>
                <a href="/info/dostavka/" class="block text-gray-400 hover:text-white text-lg">Доставка</a>
            </nav>
        </el-dialog-panel>
    </div>
</el-dialog>
```

---

## Компоненты блога

Специфичные компоненты для страниц блога. Блог имеет особенности: узкая колонка контента для лучшей читаемости текста.

### Общие настройки блога

| Параметр | Значение | Описание |
|----------|----------|----------|
| **Фон body** | `#fff` (белый) | Как на основных страницах |
| **Ширина контента** | `max-w-4xl` (896px) | Узкая колонка для читаемости |
| **Container** | 1170px | Стандартный |

### Структура страницы блога (ОБЯЗАТЕЛЬНО)

```html
<body class="bg-white text-body antialiased">
    <!-- Header -->
    
    <main class="py-12 bg-white">
        <div class="container max-w-4xl mx-auto px-4">
            <!-- Breadcrumbs -->
            <!-- Article Header -->
            <!-- Article Content -->
            <!-- Подпись автора -->
        </div>
    </main>
    
    <!-- Footer -->
</body>
```

**ВАЖНО:** Контейнер должен быть ОДИН элемент с классами `container max-w-4xl mx-auto px-4`. НЕ вкладывать `max-w-4xl` внутрь отдельного `container`.

### Серый hero для статей (как FAQ)

```html
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
    <div class="container max-w-4xl mx-auto px-4">
        <nav class="text-sm text-gray-600 mb-4" aria-label="Хлебные крошки">
            <ol class="flex items-center space-x-2">
                <li><a href="/" class="hover:text-primary transition-colors">Главная</a></li>
                <li class="text-gray-500">/</li>
                <li><a href="/blog/" class="hover:text-primary transition-colors">Блог</a></li>
                <li class="text-gray-500">/</li>
                <li class="text-body truncate">Заголовок статьи</li>
            </ol>
        </nav>

        <h1 class="text-4xl lg:text-6xl font-light text-dark leading-tight">Заголовок статьи</h1>
    </div>
</section>
```

### H1 заголовок статьи

```html
<h1 class="text-4xl lg:text-6xl font-light text-dark mb-6 leading-tight">
    Заголовок статьи
</h1>
```

### H2 в контенте статьи

```html
<h2 id="section-id" class="text-2xl font-light text-dark mt-10 mb-4">
    Подзаголовок секции
</h2>
```

### Дата публикации

```html
<div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
    <time datetime="2024-01-15">15 января 2024 года</time>
    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
    <span class="uppercase tracking-wide text-primary font-medium">Категория</span>
</div>
```

### Изображение с подписью (figure + figcaption)

```html
<figure class="my-8">
    <img 
        src="image.webp" 
        alt="Описание изображения" 
        class="max-w-full mx-auto h-auto rounded-lg shadow-sm"
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
    >
    <figcaption class="text-center text-sm text-gray-500 mt-2">
        Подпись к изображению
    </figcaption>
</figure>
```

**Производительность изображений (важно):**
- **Рендер/декодирование:** по умолчанию ставим `decoding="async"` (чтобы декодирование не блокировало основной поток).
- **Ленивая загрузка:** по умолчанию ставим `loading="lazy"`.
- **Первый экран / LCP:** для главного изображения первого экрана **не ставим** `loading="lazy"`. Как правило:
  - `loading="eager"` (или просто убрать `loading`);
  - при необходимости добавить `fetchpriority="high"` (только для реального LCP-изображения).
- **Preload первого экрана:** `rel="preload" as="image"` добавляем **только после проверки необходимости** (Lighthouse/DevTools → LCP/Waterfall). Если `fetchpriority="high"` решает проблему — preload не нужен.
- **CLS:** всегда задаём `width`/`height` (или фиксируем размер контейнера через `aspect-*`), чтобы не было скачков.
- **`background-image` (фон):** используем только для **декоративных** фонов. Контентные/SEO-важные изображения и LCP первого экрана — делаем через `<img>`/`<picture>`.
- **`srcset`/`sizes`:** пока **на рассмотрении** (не обязательное правило) — добавим, когда утвердим стратегию и пайплайн генерации размеров.

### Цитата (blockquote)

```html
<blockquote class="border-l-4 border-primary pl-4 py-2 italic text-gray-700 bg-gray-50 rounded-r">
    Текст цитаты. Можно использовать для выделения важных мыслей или цитат из интервью.
</blockquote>
```

### Оглавление статьи (TOC)

```html
<nav class="bg-gray-50 rounded-lg p-6 mb-8">
    <h2 class="text-xl font-medium text-dark mb-4 mt-0">Содержание</h2>
    <ol class="list-decimal list-inside space-y-2 text-body">
        <li><a href="#section-1" class="text-primary hover:underline">Первая секция</a></li>
        <li><a href="#section-2" class="text-primary hover:underline">Вторая секция</a></li>
        <li><a href="#section-3" class="text-primary hover:underline">Третья секция</a></li>
    </ol>
</nav>
```

### Back to Top (обязателен)

Кнопка размещается **перед** `<header>`.

```html
<a href="#" id="back-to-top" class="hidden md:flex fixed bottom-5 right-5 w-12 h-12 items-center justify-center rounded-full bg-white text-dark hover:bg-dark hover:text-white border border-gray-300 hover:border-dark transition-colors z-50 opacity-0 pointer-events-none" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
</a>
```

### Карточка статьи (Article Card)

Для списка статей на странице блога.

```html
<article class="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
    <a href="/blog/article/" class="block h-48 overflow-hidden">
        <img src="cover.webp" alt="Заголовок" 
             class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
             loading="lazy">
    </a>
    <div class="p-6 flex flex-col flex-grow">
        <div class="text-sm text-gray-400 mb-2">15.01.2024</div>
        <h3 class="text-xl font-medium text-dark mb-3 group-hover:text-primary transition-colors">
            <a href="/blog/article/">Заголовок статьи</a>
        </h3>
        <p class="text-body text-sm mb-4 flex-grow">
            Краткое описание статьи для превью...
        </p>
        <a href="/blog/article/" class="text-primary text-sm font-medium hover:underline inline-flex items-center mt-auto">
            Подробнее →
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        </a>
    </div>
</article>
```

### Промо-баннер внутри статьи

```html
<div class="my-12">
    <div class="bg-primary text-white py-8 px-6 rounded-lg text-center shadow-lg">
        <p class="text-xs uppercase tracking-widest opacity-80 mb-2">Акция</p>
        <p class="text-2xl font-light mb-4">Скидка 20% c 15 по 16 января</p>
        <a href="/order/" class="inline-block px-6 py-2 bg-white text-primary hover:bg-gray-100 rounded uppercase transition-colors font-medium">
            Заказать
        </a>
    </div>
</div>
```

### Контент статьи (wrapper)

```html
<article class="space-y-6 text-body">
    <p>Параграф текста...</p>
    <p>Ещё параграф...</p>
    <!-- Используйте space-y-6 для автоматических отступов между элементами -->
</article>
```

### Breadcrumbs для блога

```html
<nav class="text-sm text-gray-600 mb-4" aria-label="Хлебные крошки">
    <ol class="flex items-center space-x-2">
        <li><a href="/" class="hover:text-primary transition-colors">Главная</a></li>
        <li class="text-gray-500">/</li>
        <li><a href="/blog/" class="hover:text-primary transition-colors">Блог</a></li>
        <li class="text-gray-500">/</li>
        <li class="text-body truncate">Название статьи</li>
    </ol>
</nav>
```

### Подпись автора

Размещается в конце статьи перед секцией "Похожие статьи".

```html
<div class="flex items-center justify-end gap-3 mt-8">
    <span class="text-gray-500">Автор:</span>
    <a href="https://muse.ooo/info/" 
       class="flex items-center gap-2 text-primary hover:underline"
       title="О студии Muse и авторе">
        <img src="https://muse.ooo/upload/imgsite/anna-60-2.webp" 
                             alt="Фото автора Анны" 
                             class="w-10 h-10 rounded-full object-cover"
                             width="40" 
                             height="40"
                             loading="lazy"
                             decoding="async">
        <span>Анна</span>
    </a>
</div>
```

### Hero для страницы-списка

Используется на страницах каталога статей (blog.html, blog-page-2.html).

```html
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
    <div class="container">
        <!-- Breadcrumbs -->
        <nav class="text-sm text-gray-600 mb-4" aria-label="Хлебные крошки">
            <ol class="flex items-center space-x-2">
                <li><a href="/" class="hover:text-primary transition-colors">Главная</a></li>
                <li>/</li>
                <li class="text-dark">Блог</li>
            </ol>
        </nav>
        
        <h1 class="text-4xl lg:text-6xl font-light text-dark">Блог</h1>
    </div>
</section>
```

### Pagination (пагинация)

```html
<nav class="flex items-center justify-between border-t border-gray-200 mt-12 pt-4">
    <!-- Предыдущая -->
    <div class="flex flex-1">
        <a href="/blog/" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" class="mr-2 w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clip-rule="evenodd"/>
            </svg>
            Новые статьи
        </a>
    </div>
    
    <!-- Номера страниц (скрыты на мобильных) -->
    <div class="hidden md:flex gap-2">
        <a href="/blog/" class="px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors">1</a>
        <span class="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">2</span>
        <a href="/blog/page-3/" class="px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors">3</a>
    </div>
    
    <!-- Следующая -->
    <div class="flex flex-1 justify-end">
        <a href="/blog/page-3/" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            Старые статьи
            <svg viewBox="0 0 20 20" fill="currentColor" class="ml-2 w-5 h-5">
                <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd"/>
            </svg>
        </a>
    </div>
</nav>
```

**Текущая страница:** `text-primary border-b-2 border-primary`

### Обрезка текста (line-clamp)

Для анонсов статей в карточках — ограничение до 3 строк.

```html
<p class="text-body text-sm mb-4 line-clamp-3">
    Длинный текст анонса статьи, который будет обрезан после третьей строки...
</p>
```

### Похожие статьи

```html
<section class="mt-12 pt-8 border-t border-gray-200">
    <h2 class="text-2xl font-light text-dark mb-8">Похожие статьи</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Article Cards -->
    </div>
</section>
```

---

## Компоненты главной страницы

Специфичные компоненты для главной страницы (index.html).

### Hero секция с видео

```html
<section class="relative h-[65vh] lg:h-screen overflow-hidden bg-dark">
    <!-- Видео фон (только десктоп) -->
    <video class="absolute inset-0 w-full h-full object-cover hidden lg:block" 
           autoplay loop muted playsinline preload="none">
        <source src="video.webm" type="video/webm">
        <source src="video.mp4" type="video/mp4">
    </video>
    <!-- Затемнение -->
    <div class="absolute inset-0 bg-dark/20"></div>
    <!-- Контент -->
    <div class="container h-full flex items-center relative z-10">
        <div class="max-w-2xl">
            <h1 class="text-4xl lg:text-5xl font-light text-white mb-4">
                Главный заголовок страницы
            </h1>
            <p class="text-xl text-white/90 mb-8">
                Подзаголовок или описание
            </p>
            <a href="/order/" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Заказать
            </a>
        </div>
    </div>
</section>
```

### Блок акции (промо-полоса)

```html
<div class="bg-primary text-white py-6">
    <div class="container">
        <div class="flex items-center justify-center">
            <p class="text-xl">Скидка 20% с 3 по 4 января</p>
        </div>
    </div>
</div>
```

### Секция Преимущества

```html
<section class="bg-secondary py-16 lg:py-24">
    <div class="container">
        <div class="mx-auto max-w-2xl mb-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-dark">Преимущества</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <!-- Карточка преимущества -->
            <div class="flex flex-col p-6 border border-gray-200 rounded bg-white">
                <div class="mb-6 flex size-10 items-center justify-start">
                    <svg class="text-primary w-8 h-8"><!-- иконка --></svg>
                </div>
                <span class="text-xl text-dark">Название преимущества</span>
            </div>
            <!-- ... другие карточки -->
        </div>
    </div>
</section>
```

### Карусель изображений (портреты/продукты)

```html
<section class="bg-dark py-16">
    <div class="container mb-8">
        <div class="text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-white">
                <a href="/category/" class="text-white hover:text-white/80 transition-colors">Заголовок секции</a>
            </h2>
        </div>
    </div>
    
    <div class="carousel-scroll pb-4">
        <div class="flex gap-0 px-4 min-w-max">
            <!-- Элемент карусели -->
            <div class="text-center flex-shrink-0 snap-center w-[223px]">
                <a href="/item/">
                    <img src="image.webp" alt="Описание" 
                         class="rounded" width="223" height="297"
                         loading="lazy" decoding="async">
                    <p class="mt-2 text-white">Название</p>
                </a>
            </div>
            <!-- ... другие элементы -->
        </div>
    </div>
</section>
```

### Карточки продуктов (grid)

```html
<section class="bg-dark py-16">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-white text-center mb-12">Заголовок</h2>
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Карточка продукта -->
            <div class="group">
                <a href="/product/" class="block">
                    <img src="image.webp" alt="Продукт" 
                         class="w-full h-auto rounded-t group-hover:opacity-80 transition-opacity"
                         width="330" height="330" loading="lazy">
                    <div class="p-4 bg-dark rounded-b">
                        <h3 class="text-lg font-medium text-white">Название продукта</h3>
                    </div>
                </a>
            </div>
            <!-- ... другие карточки -->
        </div>
    </div>
</section>
```

### Секция отзыва

```html
<section class="bg-white px-6 py-24 md:py-32 xl:px-8">
    <div class="mx-auto max-w-2xl text-center mb-10">
        <h2 class="text-3xl lg:text-4xl font-light text-dark">Отзыв, которым гордимся</h2>
    </div>
    <figure class="mx-auto max-w-2xl">
        <!-- Звёзды рейтинга -->
        <div class="flex gap-x-1 text-primary justify-center mb-10">
            <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"/>
            </svg>
            <!-- ... ещё 4 звезды -->
        </div>
        <blockquote class="text-xl italic tracking-tight text-gray-900 md:text-2xl">
            <p>"Текст отзыва..."</p>
        </blockquote>
        <figcaption class="mt-10 flex items-center justify-center gap-x-6">
            <div class="text-sm">
                <div class="font-semibold text-gray-900">ИМЯ АВТОРА</div>
                <div class="mt-0.5 text-gray-600">Дата</div>
            </div>
        </figcaption>
    </figure>
</section>
```

### Карусель логотипов

```html
<section class="py-16 bg-secondary">
    <div class="container mb-8 text-center">
        <h3 class="text-3xl lg:text-4xl font-light text-dark">Нам доверяют</h3>
    </div>
    <div class="carousel-scroll py-8">
        <div class="flex gap-8 items-center min-w-max mx-auto w-fit">
            <div class="flex-shrink-0 snap-center w-[73px] h-[50px] flex items-center justify-center">
                <img src="logo.webp" alt="Компания" 
                     class="h-full w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                     width="73" height="50" loading="lazy">
            </div>
            <!-- ... другие логотипы -->
        </div>
    </div>
</section>
```

### CTA секция (призыв к действию)

```html
<section class="bg-secondary py-24 md:py-32">
    <div class="container xl:flex xl:items-center xl:justify-between">
        <h2 class="text-2xl font-light tracking-tight text-dark">
            Призыв к действию
        </h2>
        <div class="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0">
            <a href="/order/" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg w-full md:w-auto text-center">
                Заказать
            </a>
            <a href="#callback" class="inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Обратный звонок
            </a>
        </div>
    </div>
</section>
```

### Footer (полный)

```html
<footer class="bg-dark text-white py-8 lg:py-12">
    <div class="container">
        <!-- Верхняя часть: навигация -->
        <div class="mb-8 pb-8 border-b border-gray-700">
            <div class="relative">
                <div class="flex flex-col">
                    <!-- Основные ссылки -->
                    <nav class="flex flex-col lg:flex-row flex-wrap gap-4 lg:gap-6">
                        <a href="/about/" class="text-sm text-white font-semibold hover:text-white transition-colors uppercase tracking-wide">О нас</a>
                        <!-- ... другие ссылки -->
                    </nav>
                    <!-- Вторичные ссылки -->
                    <nav class="flex flex-col lg:flex-row flex-wrap gap-4 lg:gap-6 mt-6">
                        <a href="/faq/" class="text-sm text-gray-300 hover:text-white transition-colors uppercase tracking-wide">FAQ</a>
                        <!-- ... другие ссылки -->
                    </nav>
                </div>
                <!-- Соцсети (десктоп) -->
                <div class="hidden lg:flex gap-3 items-center absolute top-0 right-0">
                    <a href="#" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors">
                        <svg class="w-5 h-5 fill-white"><!-- иконка --></svg>
                    </a>
                </div>
            </div>
        </div>
        <!-- Нижняя часть: контакты -->
        <div class="space-y-3 text-sm text-gray-300">
            <div class="flex flex-wrap gap-4">
                <span>ИНН 000000000000</span>
                <span>ОГРНИП 000000000000000</span>
            </div>
            <nav class="flex flex-wrap gap-4">
                <a href="/sitemap/" class="hover:text-white transition-colors">Карта сайта</a>
                <a href="/privacy/" class="hover:text-white transition-colors">Политика конфиденциальности</a>
            </nav>
            <div class="pt-2">
                <span>&copy; 2015-2026 Company</span>
            </div>
        </div>
    </div>
</footer>
```

### Кнопка с премиум-эффектом

Вместо кастомного `.btn-premium` используйте Tailwind классы:

```html
<a href="/order/" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg">
    Заказать
</a>
```

**Эффект:** при наведении кнопка поднимается на 2px и появляется тень.

---

## Примеры использования

### Полная страница (чистый Tailwind)

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заголовок страницы</title>
    
    <!-- Критический CSS -->
    <style>
        :root { --primary: #4A90E2; --dark: #252525; }
        .container { width: 100%; margin: 0 auto; padding: 0 1rem; }
        @media (min-width: 1170px) { .container { max-width: 1170px; } }
    </style>

    <!-- Tailwind Plus Elements (если используются el-*) -->
    <script type="module" src="js/tailwindplus-elements.js"></script>

    <!-- Основной CSS (собранный Tailwind v4) -->
    <link rel="stylesheet" href="css/output.css">
</head>
<body class="bg-white overflow-x-hidden">
    <!-- Header -->
    <header class="bg-dark sticky top-0 z-50">
        <nav class="container flex items-center justify-between gap-x-4 py-5">...</nav>
    </header>
    
    <!-- Hero -->
    <section class="relative h-[65vh] lg:h-screen overflow-hidden bg-dark">...</section>
    
    <!-- Промо-баннер -->
    <section class="bg-primary text-white py-6">
        <div class="container">...</div>
    </section>
    
    <!-- Контент -->
    <main>
        <section class="bg-secondary py-16 lg:py-24">
            <div class="container">...</div>
        </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-dark text-white py-8 lg:py-12">
        <div class="container">...</div>
    </footer>
</body>
</html>
```

---

## Контрольный список для создания страницы

### Общие требования
- [ ] Допускаются компонентные классы из `input.css` (например, `btn-*`)
- [ ] Контейнер: использовать `container` без двойных обёрток
- [ ] Правильные цвета из палитры (primary, dark, secondary, body)
- [ ] Проверить скрипты, стили и критический путь на странице

### Типографика
- [ ] H1: `text-4xl lg:text-6xl font-light` (1 на страницу)
- [ ] H2: `text-3xl lg:text-4xl font-light`
- [ ] Lead текст: `text-xl`
- [ ] Обычный текст: базовый без дополнительных классов
- [ ] Проверить читаемость текста и контраста

### Отступы секций
- [ ] Основные секции: `py-16 lg:py-24`
- [ ] Промо-баннер: `py-6`
- [ ] CTA: `py-24 md:py-32`
- [ ] Footer: `py-8 lg:py-12`

### Кнопки
- [ ] Разрешены `btn-*` из компонентов или эквивалентные inline‑классы по дизайн‑системе

### Навигация
- [ ] Breadcrumbs: `text-sm text-gray-400` с разделителем `/`
- [ ] Page Navigator: CSS в критическом блоке + `js/nav.js`
- [ ] Back to Top: HTML элемент с `id="back-to-top"` + `js/nav.js`

### Интерактивные компоненты
- [ ] Before/After (ba-card): минимальный CSS (4 строки) + HTML с Tailwind
- [ ] Video Cover: `data-video-cover` + `data-video-src` + `js/nav.js` (без inline)
- [ ] Carousel Scroll: CSS + общий `js/nav.js`
- [ ] Характеристики: `odd:bg-primary/5` на каждом `<li>`
- [ ] Калькуляторы: предусмотреть вёрстку и подключение скрипта по задаче

### Изображения
- [ ] Атрибуты: `width`, `height`, `alt`, `title`
- [ ] Декодирование (по умолчанию): `decoding="async"`
- [ ] Для ленивой загрузки (по умолчанию): `loading="lazy"`
- [ ] Первый экран / LCP: **не** `loading="lazy"` (обычно `loading="eager"` и при необходимости `fetchpriority="high"`)
- [ ] Preload первого экрана: добавлять только после проверки необходимости (Lighthouse/DevTools)
- [ ] Формат: предпочтительно `.webp`
- [ ] Aspect Ratio: `aspect-video`, `aspect-square`, `aspect-[W/H]`

### Видео
- [ ] Video Cover: `aspect-video` (горизонтальное) или `aspect-[360/648]` (вертикальное)
- [ ] Video Cover: источник видео задаётся в `data-video-src` (iframe создаёт `js/nav.js` по клику)
- [ ] Способ загрузки и удобство просмотра согласуются для каждого видео

### Визуальные эффекты
- [ ] Canvas 3D: CSS с `--depth` и hover transform
- [ ] Ken Burns: CSS `@keyframes` для hero-изображений
- [ ] Hover эффекты: `hover:-translate-y-0.5`, `hover:scale-105`

### Адаптивность
- [ ] Проверить на мобильных устройствах
- [ ] Использовать брейкпоинты: `sm:`, `md:`, `lg:`, `xl:`
- [ ] Page Navigator скрыт на мобильных (`max-width: 1023px`)
- [ ] Back to Top скрыт на мобильных (`hidden md:flex`)

---

## Дополнительные ресурсы

- [Исходные стили Tailwind (tokens/utilities)](../src/input.css)
- [Правила проекта](../AI_INSTRUCTIONS.md)
- [Текущий прогресс и эталоны страниц](../PROJECT.md)
- [Как создать новую страницу](./HOW_TO_CREATE_PAGE.md)
