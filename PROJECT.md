# Проект Muse — Переверстка на Tailwind CSS

> **Для ИИ-агента:** Перед созданием новой страницы прочитай [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md)

## О проекте

Переверстать сайт **www.muse.ooo** с Bootstrap 3 (тема Stack) на Tailwind CSS.

**Стек:** HTML5, Tailwind CSS v4, Vanilla JS — без фреймворков.

**Ключевые требования:**
- Сохранить визуальный стиль оригинала
- Деплой: GitHub → Vercel
- Интеграцию будет делать программист отдельно

---

## Прогресс

**Обновлено:** 9 марта 2026

| Категория | Готово | Всего |
|-----------|--------|-------|
| Главные страницы | 4 | 4 |
| Стили портретов | 18 | 18 |
| Объекты портретов | 5 | 5 |
| Блог | 20 | 20 |
| Info | 9 | 9 |
| Прочие страницы | 2 | 14 |
| **Итого** | **59** | **70** |

**☸️ Осталось:** 12 страниц → [Ожидают переверстки](#ожидают-переверстки)

### Что сделано

- ✅ Типографика v2 — семантические классы (`heading-*`, `text-lead`, `text-body`, `text-small`)
- ✅ Цветовая палитра → [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md#colors)
- ✅ Дизайн-система v2 — Tailwind v4 + `@layer components` → [компоненты](docs/DESIGN_SYSTEM.md#components)
- ✅ Навигация — унифицированы header/footer/page-navigator → [подробнее](docs/DES IGN_SYSTEM.md#header)
- ✅ DRY — повторяющиеся стили вынесены в `input.css`
- ✅ Скрипты — `js/nav.js` → [подробнее](docs/DESIGN_SYSTEM.md#скрипты-navjs)
- ✅ V7 O-hierarchy — масштабирование эталона `portret-maslom.html` на 17 стилей и 5 объектов
- ✅ CTA-кнопки — унифицированы на 22 страницах (`btn-primary` + `&rarr;`)
- ✅ Sale-banner — тёмный вариант (`bg-ah-975`) на style-portraits
- ✅ Характеристики — slider max-width 442px, тени, табы
- ✅ Описание — float-обтекание (`desc-media`) на 13 из 18 стилей (остальные 5 без медиа)
- ✅ Видео-замена (MP4 вместо YouTube iframe) на 6 страницах

### Эталоны

| Группа | Эталонный файл |
|--------|----------------|
| Главные | [index.html](src/html/index.html) |
| Стили портретов | [portret-maslom.html](src/html/portret-na-zakaz/style/portret-maslom.html) |
| Объекты портретов | [muzhskoy-portret.html](src/html/portret-na-zakaz/object/muzhskoy-portret.html) |
| Блог | [kollazh-i-fotokollazh.html](src/html/blog/kollazh-i-fotokollazh.html) |
| Info | [kontakty.html](src/html/info/kontakty.html) |

---

## Структура проекта

```
tailwind-project/
├── src/
│   ├── input.css           # Исходный CSS (редактировать здесь)
│   ├── css/output.css      # Результат сборки
│   └── html/               # HTML страницы
│       ├── css/output.css  # Копия для Live Server
│       └── js/nav.js       # Скрипты UI
├── docs/                   # Документация
└── package.json
```

---

## Техническая часть

### CSS
- **Tailwind v4** — локальная сборка (без CDN)
- **Редактировать:** `src/input.css` (через `@theme` и `@layer`)
- **Не редактировать:** `output.css` (генерируется автоматически)
- **Critical CSS:** не используем, кроме исключений (info-страницы)

Скрипты сборки описаны в package.json в разделе scripts: npm run build:once запускает PostCSS и собирает output.css, а npm run copy-css копирует output.css и page-info.css в папку src/html/css/ для предпросмотра.

### Скрипты
- **Основной:** `src/html/js/nav.js`
- **Поиск репродукций:** `src/html/js/reproduction-search.js` — мультимузейный поиск (5 API), IIFE, ES5, [подробнее](#мультимузейный-поиск-репродукций)
- **Inline:** только для уникальной логики страницы
- **Legacy:** при обновлении удалять `el-*` fallback-скрипты

### Предпросмотр
- **Использовать:** Live Server из папки `src/html/`
- **URL:** `http://127.0.0.1:5501/имя-страницы.html`
- **Не использовать:** альтернативные сервера (могут быть неверные стили)

---

## Деплой

**Быстрый способ:** запустить `БЫСТРЫЙ_ДЕПЛОЙ.ps1`

**Команды:**
```bash
npm run build:once   # Сборка CSS
npm run copy-css     # Копия для Live Server
```

**Production:** ветка `main` → Vercel (автодеплой)

> **⚠️ Vercel — временный стенд** для тестирования статических страниц. Production-сайт будет на Bitrix-сервере muse.ooo после интеграции. На Vercel нет серверной логики: заказы не отправляются, фото не загружаются, каталог рамок — демо.

**Ссылки:**
- Vercel (тестовый): 
- Оригинал (production): https://muse.ooo

### Защита от индексации
Все страницы закрыты (`robots.txt` + `<meta name="robots">`).
Убрать защиту только после https://muse-liard-one.vercel.app/переноса на production.

---

## Следующие шаги

### Приоритетные задачи
- ✅ Калькулятор для страницы фото на холсте `foto-na-kholste-sankt-peterburg.html`
- ✅ Калькулятор для страницы портрет маслом `portret-maslom.html`
- ⏳ **Тиражирование калькуляторов** → см. [План CALC: тиражирование](#план-calc-тиражирование-на-портретные-страницы)
- ⏳ **Info (9 стр.) — визуальная проверка и доработка** (не завершено после amber-миграции)
- ⏳ Переверстать оставшиеся 12 страниц (см. [Ожидают переверстки](#ожидают-переверстки))
- ⏳ Подготовить сборку для продакшена
- ⏳ Подготовить материалы для интеграции

### Phase 2: визуальная проверка ✅
- ✅ Все 18 style + 5 object страниц проверены (9 марта 2026)
- ✅ beauty-art — ОК
- ✅ drim-art — ОК (float-обтекание работает)
- ✅ portret-iz-slov — добавлен `desc-media--right`, фон `bg-ah-25`
- ✅ fotomozaika — фон `bg-ah-25`, подписи по левому краю
- ✅ fantasy-art, graffiti, granzh, love-is, low-poly, pop-art — ОК
- ✅ portret-akvarelyu, portret-flower-art, portret-karandashom — ОК
- ✅ portret-komiks, portret-maslom, portret-v-obraze — ОК
- ✅ sharzh-po-foto, wpap-portret — ОК
- ✅ detskiy, muzhskoy, parnyy, semeynyy, zhenskiy portret — ОК

### Проверки качества
- ⏳ **Контент** — сверка текстов/SEO/alt/title с muse.ooo (ничего не терять!)
- ⏳ **Визуал** — контраст, читаемость, соответствие оригиналу
- ⏳ **Функционал** — скрипты, видео, интерактив
- ⏳ **Калькуляторы** — верстка страниц с калькуляторами

**Аудиты:** `docs/AUDIT/` → Task-1.md, Task-234.md, Task-COMPLETE.md

---

## План: v7 иерархия O → Variant 3

> **Обновлено:** 9 марта 2026
> **Статус:** ✅ V7 O-hierarchy масштабирована на все 18 стилей и 5 объектов. Unlayered CSS-блок `.style-portraits` в `input.css`.

### Контекст

На странице `src/html/portret-na-zakaz/style/portret-maslom-v7.html` уже есть два режима сравнения:

- `База` — точная копия production-страницы `portret-maslom.html`
- `O-иерархия` — первая попытка перенести визуальные принципы шаблона O

Промежуточный вывод по аудиту:

- проблема не в самом шаблоне O;
- проблема в способе переноса: O строит иерархию через стабильные примитивы (`Heading`, `Subheading`, `Text`, `Section`), а не через локальные секционные переопределения;
- поэтому текущий preview с `O-иерархией` ощущается как набор частных CSS-исключений, а не как цельная система.

### Цель Variant 3

Сделать третий режим preview, который:

- сохраняет семантику Muse (`heading-*`, `text-*`, CTA, текущие секции);
- не копирует визуальный язык O напрямую;
- усиливает логику страницы через роли контента, а не через массовое приглушение текста;
- лучше подходит для функциональной продуктовой страницы с калькулятором, шагами, характеристиками, преимуществами и описанием.

### Основные идеи Variant 3

- Hero должен чётко делиться на 4 слоя: breadcrumb, headline, lead, price/CTA.
- Секционные заголовки должны вести себя одинаково по всей странице, а не меняться от блока к блоку.
- Функциональные секции (`Как заказать`, `Характеристики`, `Преимущества`) должны читаться как структурированные блоки, а не как типографический эксперимент.
- Для body-текста приоритетом остаётся читаемость; тональный контраст используется аккуратно, без уводa основного текста в слишком слабые значения.
- Мета-слой должен быть отделён от основного текста через роль, а не только через уменьшение размера.

### План реализации

1. Оставить `portret-maslom.html` без изменений и продолжать тестировать только на `portret-maslom-v7.html`.
2. Добавить на `v7` третий переключатель `Variant 3` рядом с `База` и `O-иерархия`.
3. Реализовать для `Variant 3` более системный preview:
4. Уточнить иерархию hero без смены дизайн-языка Muse.
5. Унифицировать поведение `heading-section` и `heading-card` в контентных секциях.
6. Добавить более явную структурность шагам и карточкам преимуществ, чтобы страница читалась по блокам, а не только по шрифтовым настройкам.
7. После визуального сравнения решить, какие наблюдения достойны переноса в `src/input.css`, а какие должны остаться локальным экспериментом.

### Критерии успеха

- `Variant 3` визуально логичнее текущей `O-иерархии`.
- Страница остаётся узнаваемо Muse, без ощущения второй дизайн-системы.
- Улучшается читаемость длинных текстов и функциональных блоков.
- Решения можно описать как repeatable rules, а не как случайные исключения по `id` секций.

### Правильная интерпретация O для Muse

#### Что переносить из O

- Переносить не стиль O, а его дисциплину ролей: hero heading, section heading, lead, body, meta.
- Сначала определять роль контента, а уже потом подбирать для неё класс Muse.
- Использовать семантические классы Muse (`.heading-hero`, `.heading-section`, `.heading-subsection`, `.heading-card`, `.text-lead`, `.text-body`, `.text-small`), а не копировать ad hoc utility-stack из O.
- Строить контраст текста через ink-систему Muse: основной текст, поддерживающий текст, meta-слой.
- Сохранять разделение display-headings и sans-body, потому что именно на нём держится большая часть иерархии O.
- Переносить микротипографику выборочно: tighter tracking для крупных заголовков, controlled wrap, ограничения ширины абзацев.
- На тёмных поверхностях строить иерархию через инверсию основного и вторичного текста, а не через массовое использование акцентного amber.

#### Что считать ошибочной интерпретацией

- Копировать палитру O или делать страницу визуально похожей на SaaS-template вместо Muse.
- Подменять семантические классы Muse локальными наборами утилит только ради сходства с O.
- Делать перенос через множество частных CSS-исключений по `id` секций вместо общих repeatable rules.
- Пытаться решить иерархию только приглушением текста, не выстраивая порядок ролей внутри секции.
- Переносить в Muse готовые визуальные паттерны O без учёта того, что страницы Muse более функциональные и содержательно плотные.

---

## Ресурсы

- **Оригинал (production):** https://muse.ooo
- **Vercel (тестовый стенд):** https://muse-liard-one.vercel.app/
- **Документация:** `docs/`
- **Интеграция:** [docs/INTEGRATION_BITRIX.md](docs/INTEGRATION_BITRIX.md)

---

## Готовые страницы (57)

### Главные (4) ✅
`index.html`, `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`, `pechat-na-kholste-sankt-peterburg.html`, `foto-na-kholste-sankt-peterburg.html`

### Стили портретов (18) ✅
Все файлы в `src/html/portret-na-zakaz/style/`

### Объекты портретов (5) ✅
Все файлы в `src/html/portret-na-zakaz/object/`

### Блог (20) ✅
Все файлы в `src/html/blog/`

### Info (9) ✅
`faq.html`, `kontakty.html`, `info.html`, `avtorstvo.html`, `guarantee.html`, `partnerstvo.html`, `oferta.html`, `politika-konfidentsialnosti-sayta.html`, `dostavka.html`

### Печать (3)
`foto-v-ramke.html` (с калькулятором, в работе)
`fotokollazh-na-kholste.html` (с калькулятором + конструктор коллажей через iframe → `konstruktor-kollazha.html`)
`modulnaya-kartina.html` ⚠️ Каркас готов, см. [TODO](#modulnaya-kartina--todo)

---

## modulnaya-kartina — TODO

Страница `src/html/pechat/modulnaya-kartina.html` — каркас создан 21 февраля 2026.

**Готово:**
- ✅ `<head>`, meta, JSON-LD Product, noindex
- ✅ Page Navigator (4 якоря) + Back-to-Top
- ✅ Hero (Ken Burns, placeholder-изображение, breadcrumbs, H1, lead, кнопка «Заказать»)
- ✅ Секция «Печать на холсте» (3 карточки, без кнопок)
- ✅ Секция «Включено» (чеклист 11 пунктов, 2 фото продукта)
- ✅ Секция «Ваш выбор» (8 карточек, accordion обработки фото)
- ✅ Секция «Как заказать» (3 feature-карточки + 4 шага процесса)
- ✅ Секция «Цена» (только заголовок)
- ✅ Секция «Отзывы» (только заголовок)
- ✅ Секция «Блог» (4 статьи)
- ✅ CTA-секция (из эталона foto-na-kholste)

**Осталось:**
- ⏳ Подобрать и заменить hero-фоновое изображение (сейчас placeholder)
- ⏳ Заменить SVG-заглушки на реальные иконки в «Ваш выбор» и «Как заказать» (11 штук)
- ⏳ Подключить модульный калькулятор в секцию «Цена»
- ⏳ Интегрировать виджет отзывов
- ⏳ Header / Footer (не включены, ожидают общего подключения)

---

## Hero H1 — TODO: подстрочник и размер шрифта

> **Добавлено:** 10 марта 2026

### Задача
На **8 каталожных/информационных страницах** нужно добавить подстрочник под H1 в hero-секции — по аналогии с эталоном `portret-maslom.html`:

```html
<h1 class="heading-hero mb-4">Портрет <em ...>маслом</em></h1>
<p class="text-xs tracking-wider mt-2 mb-4 text-ink-on-dark">Изысканный, благородный, живописный</p>
```

### Вопрос по размеру H1
Сейчас на этих 8 страницах H1 использует **крупный** размер `#hero .heading-hero` — `clamp(3.35rem, 7vw, 5.25rem)` (54→84px), как на портретных. Ранее был `clamp(2.25rem, 5vw, 3.5rem)` (36→56px). Решение: **вернуться к вопросу** — возможно, каталожные страницы лучше смотрятся с прежним сдержанным размером, а крупный оставить только для `.style-portraits`.

### Страницы для доработки

| Страница | Файл | Акцентное слово |
|----------|------|-----------------|
| Печать фото на холсте СПб | `pechat/foto-na-kholste-sankt-peterburg.html` | *фото на холсте* |
| Фото в рамке | `pechat/foto-v-ramke.html` | *Фото* |
| Фотоколлаж на холсте | `pechat/fotokollazh-na-kholste.html` | *Фотоколлаж* |
| Модульная картина | `pechat/modulnaya-kartina.html` | *Модульная* |
| Репродукция | `pechat/reproduktsiya.html` | *Репродукция* |
| Портрет на заказ СПб | `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | *Портрет* |
| Печать на холсте СПб | `pechat-na-kholste-sankt-peterburg.html` | *Печать на холсте* |
| Главная | `index.html` | *искусства* |

### Что нужно сделать
1. Написать подстрочник для каждой страницы (`text-xs tracking-wider text-ink-on-dark`)
2. Решить вопрос с размером H1: `#hero .heading-hero` или вернуть базовый `heading-hero`
3. Задокументировать в DESIGN_SYSTEM.md

---

## Ожидают переверстки (11)

| Страница | URL | Приоритет |
|----------|-----|-----------|
| Портреты Москва | `/portret-na-zakaz-po-foto-na-kholste-moskva/` | Средний |
| Печать Москва | `/pechat-na-kholste-moskva/` | Средний |
| Оплата | `/info/oplata/` | Средний |
| ~~Форма заказа~~ | `/order/` | ✅ Быстрый заказ (`order.html`) — без хедера/футера, с загрузчиком |
| ~~Спасибо за заказ~~ | `/spasibo/` | ✅ `spasibo.html` — без хедера/футера, редирект после заказа |
| Страница заказчика | `/personal/orders/...` | Средний |
| Подарочный сертификат | `/pechat/podarochnyy-sertifikat/` | Средний |
| ~~Страница 404~~ | `/404/` | ✅ `404.html` — тёмная секция, без хедера/футера |
| Страница художника | `/personal/forart/...` | Средний |
| ~~Модульная картина~~ | `/pechat/modulnaya-kartina/` | ⚠️ Каркас готов, доработки ниже |
| Фото в рамке | `/pechat/foto-v-ramke/` | ⚠️ В работе (`foto-v-ramke.html`), с калькулятором |
| Фотоколлаж в рамке | `/pechat/fotokollazh-v-ramke/` | С калькулятором |
| ~~Репродукция~~ | `/pechat/reproduktsiya/` | ✅ `reproduktsiya.html` — с поиском Wikidata SPARQL, калькулятором |

---

## Мультимузейный поиск репродукций

> **Обновлено:** 26 февраля 2026
> **Файл:** `src/html/js/reproduction-search.js` (~1523 строки, IIFE, ES5)

### Что подключено

5 источников работают **параллельно** через `Promise.allSettled()`. Если один упал — остальные показывают результаты.

| Источник | API | Ключ | CORS | Статус |
|----------|-----|------|------|--------|
| **Met Museum** | `collectionapi.metmuseum.org` (2-step: IDs → details) | Не нужен | ✅ | ✅ Работает |
| **Art Institute of Chicago** | `api.artic.edu` (IIIF images, `/full/843,/`, `is_public_domain=true`) | Не нужен | ✅ | ✅ Работает |
| **Cleveland Museum of Art** | `openaccess-api.clevelandart.org` (прямые URL) | Не нужен | ✅ | ✅ Работает |
| **Rijksmuseum** | `data.rijksmuseum.nl/search/collection` (2-step: IDs → DC details) | Не нужен | ✅ | ✅ Работает |
| **Wikidata SPARQL** | `query.wikidata.org/sparql` (рус. поиск, P18 images) | Не нужен | ✅ | ⚠️ Нестабильный (8с таймаут) |

### Архитектура

- **Параллельная загрузка:** `metSearch()` → `Promise.allSettled([metLoadBatch, aicSearch, cleveSearch, rijksSearch, wikiSearch])`
- **Round-robin перемешивание** (`interleave()`) — карточки из разных музеев чередуются
- **Дедупликация** (`dedup()`) — по `painting.id` (с prefix `met-`, `aic-`, `cleve-`, `rijks-`, `wiki/entity/Q...`)
- **Кэширование** — `_cache{}` с TTL 5 мин
- **Таймаут** — 8 сек на каждый запрос (`AbortController`)
- **Бейджи источников** — на каждой карточке: «Met Museum», «Art Institute», «Cleveland Museum», «Rijksmuseum», «Wikidata»
- **Retry-логика** — 3 автоматических повтора + кнопка «Повторить» (с fix: z-20 на error-container, pointer-events на overlay)
- **referrerpolicy** — `no-referrer` только для Wikidata CDN; остальные API проверяют Referer (без него 403)

### Словарь перевода рус → англ

~40 популярных запросов автоматически переводятся: «Ван Гог» → «Van Gogh», «Моне» → «Monet» и т.д.
- Met/AIC/Cleveland/Rijks получают **английский** перевод
- Wikidata SPARQL получает **русский** оригинал (поддерживает `mwapi:language "ru"`)

### Что осталось сделать

- ⏳ **Расширить словарь перевода** — добавлять новые термины в `TRANSLATE_MAP` по мере обнаружения популярных русских запросов
- ⏳ **Browser-тестирование** — проверить поиск, «Показать ещё», модал, retry, sticky bar на мобильных
- ⏳ **Wikidata стабильность** — если endpoint продолжит падать, рассмотреть снижение таймаута до 5 сек или отключение по умолчанию
- ⏳ **AIC rate limit** — 60 запросов/мин; при быстрых кликах «Показать ещё» может превысить лимит. Рассмотреть throttle
- ⏳ **Cleveland dimensions** — API возвращает `dimensions` строкой, показывается в модале. Проверить формат

### Планы развития (зафиксировано 26.02.2026)

#### 1. Облако тегов — популярные запросы

Под поисковой строкой вывести кликабельные теги для быстрого поиска:
- **Популярные авторы:** Моне, Ван Гог, Рембрандт, Климт, Айвазовский, Шишкин, Дали, Ренуар, Дега, Вермеер
- **Популярные картины:** «Звёздная ночь», «Девятый вал», «Девушка с жемчужной серёжкой», «Поцелуй», «Кувшинки»
- Реализация: массив `POPULAR_TAGS` в JS → рендерить `<button>` под `<input>` → по клику подставлять текст в поле и запускать поиск
- Стиль: `inline-flex gap-2 flex-wrap`, маленькие pill-кнопки `bg-gray-100 hover:bg-primary hover:text-white rounded-full px-3 py-1 text-xs`

#### 2. Отказ от ответственности (disclaimer)

Нужен блок-предупреждение для защиты от нежелательного контента в поисковых результатах:
- **Текст:** «Поиск осуществляется по базам данных музеев мира. Результаты формируются автоматически и могут содержать изображения, не соответствующие ожиданиям. Студия Muse не несёт ответственности за содержание поисковой выдачи. Если вы не нашли нужную картину — отправьте нам ссылку или название, и мы подготовим расчёт.»
- **Где показывать:** статичный текст под облаком тегов, мелким шрифтом (`text-xs text-gray-400`)
- **Вариант:** показывать при первом поиске (не до)

#### 3. Ссылка на первоисточник в модальном окне

В модальном окне (`openModal`) добавить кликабельную ссылку на оригинальную страницу картины в музее:
- **Met Museum:** `https://www.metmuseum.org/art/collection/search/{id}` (id без prefix `met-`)
- **Art Institute of Chicago:** `https://www.artic.edu/artworks/{id}` (id без prefix `aic-`)
- **Cleveland Museum:** `https://www.clevelandart.org/art/{id}` (id без prefix `cleve-`)
- **Rijksmuseum:** `https://www.rijksmuseum.nl/nl/collectie/{objectNumber}` (нужно сохранять objectNumber при поиске)
- **Wikidata:** `https://www.wikidata.org/wiki/{entityId}` (id = `wiki/entity/Q...` → извлечь Q-ID)
- Реализация: добавить поле `sourceUrl` в объект `painting` при формировании в каждом провайдере → показать ссылку `<a target="_blank">` рядом с названием/художником в модале
- Стиль: «Источник: Met Museum ↗» — мелкая ссылка с иконкой external link

#### 4. Словарь перевода `TRANSLATE_MAP` — как расширять

**Текущее состояние:** ~42 записи (авторы + несколько картин). Только exact match по `toLowerCase()`.

**Как добавлять новые термины:**
1. Открыть `src/html/js/reproduction-search.js`, найти `var TRANSLATE_MAP = {`
2. Добавить строку формата: `'запрос на русском': 'English translation',`
3. Ключ — всегда lowercase, без лишних пробелов
4. Для картин включать автора в перевод: `'звёздная ночь': 'Starry Night Van Gogh'`

**Возможные улучшения:**
- ⏳ Вынести словарь в отдельный файл `translate-map.js` для удобства редактирования не-программистом
- ⏳ Fuzzy-matching: `'моне' → Monet` работает, но `'монет' → ?` нет. Рассмотреть Levenshtein distance или prefix-match
- ⏳ Автодополнение (autocomplete) в поисковой строке из ключей `TRANSLATE_MAP`
- ⏳ Аналитика: логировать запросы, по которым нет перевода → пополнять словарь

#### 5. Подключение дополнительных музеев по API — анализ

**Текущие 5 API работают стабильно.** Стоит ли подключать ещё?

| Музей | API | Ключ | Плюсы | Минусы | Рекомендация |
|-------|-----|------|-------|--------|-------------|
| **Национальная галерея (Лондон)** | Нет публичного API | — | Огромная коллекция живописи | Нет API, только web-скрапинг | ❌ Не подключать |
| **Лувр** | Нет REST API (только collections.louvre.fr) | — | Мона Лиза и т.д. | Нет CORS, нет открытого API | ❌ Не подключать |
| **Getty Museum** | Есть OpenContent API | Не нужен | Хорошее качество изображений | Ограниченная коллекция живописи | ⏳ Возможно |
| **Europeana** | `api.europeana.eu` | Нужен (бесплатный) | Агрегатор 3000+ коллекций | Разнородные данные, много НЕ картин | ⏳ Возможно, но с фильтрами |
| **Smithsonian** | `api.si.edu` | Нужен (бесплатный) | Широкая коллекция | Мало живописи, больше артефакты | ❌ Не приоритетно |
| **Harvard Art Museums** | `api.harvardartmuseums.org` | Нужен (бесплатный) | Хороший API, IIIF | Небольшая коллекция живописи | ⏳ Возможно |

**Вывод:** 5 текущих источников дают широкое покрытие. Если расширять — лучший кандидат **Europeana** (агрегатор) или **Harvard** (качественный API). Но сначала стоит довести до ума текущие фичи (облако тегов, disclaimer, ссылки на источник).

### UI-компоненты (ожидают)
- ✅ Куки-баннер (демо на `index.html`, localStorage `muse_cookie_accepted`)
- ✅ «Это ваш город?» (демо на `index.html`, «Изменить» → city-dialog, localStorage `muse_city_confirmed`)
- ✅ Виджет мессенджеров (демо на `index.html`, ссылки — заглушки до интеграции)
- ✅ Обратный звонок — модальное окно `#callback-dialog` (демо на `index.html`)
  - Кнопка-триггер: `data-open-dialog="callback-dialog"` (в CTA-секции и где угодно)
  - Mobile: bottom-sheet (выезжает снизу, свайп вниз для закрытия)
  - Desktop: центрированный `<dialog>` с `max-w-md`
  - Форма: имя, телефон (маска RU), время звонка

---

## Редизайн V7 «Amber Harmonized» — план миграции

> **Решения (зафиксировано):** Amber на весь сайт · Шрифты self-hosted woff2 · Весь CSS в input.css · Синяя тема полностью заменяется

### Фаза 0 — CSS-фундамент

| # | Задача | Файлы |
|---|--------|-------|
| 1 | Скачать woff2 Playfair Display (400/400i/700/700i) + PT Sans (400/400i/700/700i) → `src/html/fonts/` | fonts/ |
| 2 | Добавить `@font-face` в input.css, прописать `--font-display: 'Playfair Display'`, `--font-sans: 'PT Sans'` в `@theme` | input.css |
| 3 | Заменить цветовые токены в `@theme`: `--color-primary` → `#140B01`, `--color-primary-hover` → `#281601`, `--color-primary-light` → `#FEF1E1`, `--color-primary-text` → `#8B4C04`, `--color-dark` → `#140B01`, `--color-body` → `#281601`, `--color-secondary` → `#FDE5C8` | input.css |
| 4 | Добавить палитру ah-25…ah-975 + ink-систему (`text-ink`, `text-ink-soft`, `text-ink-muted`, `text-ink-label`, `text-ink-on-dark`, `text-ink-muted-on-dark`) в `@theme` | input.css |
| 5 | Перенести ~650 строк утилит из v7 inline `<style>` в `@layer components` / `@utility` (без `[data-theme="amber"]` префикса): eyebrow, step-number-giant, desc-media, info-dot, lightbox-select-btn, calc amber overrides, tab-gallery, step-animate keyframes | input.css |
| 6 | Обновить семантические классы заголовков — добавить `font-display` (Playfair Display) | input.css |
| 7 | `npm run build:once` — проверить компиляцию | output.css |
| 8 | Обновить `docs/DESIGN_SYSTEM.md` — цвета, типографика, ink-система | DESIGN_SYSTEM.md |


### Фаза 1 — Эталонная страница `portret-maslom.html` ✅ (6 марта 2026)

| # | Задача | Статус |
|---|--------|--------|
| 9 | Удалить inline `<style>` (627 строк) и Google Fonts `<link>` из portret-maslom-v7.html → сохранить как новый portret-maslom.html | ✅ |
| 10 | Классы amber уже в v7-разметке: `bg-ah-975`, `bg-ah-25`, `text-ink-*`, `border-ah-*`. Серые утилиты в calc-секции → CSS-переопределения в input.css | ✅ |
| 11 | Убрать `data-theme="amber"` с `<body>`, добавить `bg-ah-100` | ✅ |
| 12 | Калькулятор: CalcInit type `portrait`, prices.js, frames.js, IntersectionObserver — без изменений | ✅ |
| 13 | Все 10 секций: Hero, Примеры, Калькулятор, Как заказать, Характеристики, Преимущества, Отзывы, Описание, CTA, Footer — проверены | ✅ |

**Результат:** 1163 строки (было 936 + 1779 v7). CSS 188 KB. Header/Footer/Dialogs встроены.

### Фаза 1.5 — Фиксы и унификация перед раскаткой

> **Цель:** Исправить визуальные баги, унифицировать компоненты и подготовить структуру.
> Все решения приняты в обсуждении 6 марта 2026.

| # | Задача | Где | Статус |
|---|--------|-----|--------|
| 1.5a | **Исправить цвет текста на тёмных фонах.** Nav-ссылки, город, гамбургер, mobile-menu: `text-ah-200` → `text-white`, `hover:text-ah-25`. Footer: ссылки `text-white/70 hover:text-white`, копирайт `text-white/40`. Focus-ring логотипа: `ring-primary` → `ring-ah-600` | portret-maslom.html | ✅ |
| 1.5b | **Унифицировать кнопки.** Все 13 типов кнопок → `border-radius: 0.5rem` (8px). Активный таб wrap-btn: `bg: ah-50` (amber). calc-checkbox checked: явный `ah-950`. Calc inputs: `outline-primary` → `outline-ah-600` | input.css | ✅ |
| 1.5c | **Добавить antialiased + scroll-padding.** `html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-padding-top: 5.5rem; }` | input.css (@layer base) | ✅ |
| 1.5d | **Извлечь header/footer, восстановить заглушки.** Сохранить amber header+dialogs → `draft/header-amber.html`, footer → `draft/footer-amber.html`. Заменить в portret-maslom и 17 style-страницах на комментарии-заглушки. Убрать back-to-top | portret-maslom.html, draft/ | ✅ |
| 1.5e | **Обновить index.html на amber header/footer.** `bg-dark` → `bg-ah-975`, `text-gray-300` → `text-white`, `text-gray-400` → `text-white/70`, `ring-primary` → `ring-ah-600`. Обновить city/callback/mobile-menu диалоги | index.html | ✅ |
| 1.5f | **Унифицировать иконки преимуществ.** Удалить crossfade у первой иконки (убрать вторую SVG). Все 6: `group-hover:scale-110` (убрать `scale-[3]`). CSS `.icon-advantage`: 30px (1.875rem), цвет ah-950. Контейнер: 3.625rem circle, bg-ah-50 | portret-maslom.html, input.css | ✅ |
| 1.5g | **Аудит дизайн-системы vs Oatmeal.** Добавлены ah-300/400/500 в @theme. DESIGN_SYSTEM.md: обновлены header, mobile-menu, city-dialog, footer, CTA на amber. ~50 `text-gray-*` в контентных секциях (формы, таблицы, хлебные крошки, блог) — остаются до Phase 2–3 | input.css, DESIGN_SYSTEM.md | ✅ |
| 1.5h | **Создать ТЗ на редизайн иконок (ICON_SPEC.md).** Grid 30×30px viewBox, stroke 2px, round linecap/linejoin. Line-art outline monostroke. Список иконок на редизайн | docs/ICON_SPEC.md | ✅ |
| 1.5i | **Сборка + проверка.** `npm run build:once` + `npm run copy-css`. CSS 189 KB, ошибок нет. ah-300/400/500 в output ✔ | — | ✅ |

**Принятые решения:**
- Навигация на тёмном фоне: `text-white` (как логотип/телефон/CTA), hover → `text-ah-25`
- Header/Footer: только на index.html; style-страницы — заглушки
- Активный таб калькулятора: amber (`ah-50`), не белый
- Радиус кнопок: 0.5rem (8px) единый
- Иконки: 30px, ah-950, без crossfade, hover=scale-110
- Порядок: последовательный (фиксы → структура → унификация → аудит → Phase 2)

### Фаза 2 — Раскатка на 17 остальных style-страниц ✅ (7 марта 2026)

| # | Задача | Статус |
|---|--------|--------|
| 14 | Массовая замена классов по шаблону portret-maslom.html во всех 17 файлах `src/html/portret-na-zakaz/style/*.html` | ✅ |
| 15 | Точечная проверка 2–3 страниц (portret-akvarelyu, portret-karandashom, portret-pop-art) | ✅ |

### Фаза 3 — Остальные группы страниц ✅ (7 марта 2026)

Amber-миграция: 595 замен в 45 файлах (blog 20, info 9, pechat 7, main 4, misc 5).

| # | Задача | Страницы | Статус |
|---|--------|----------|--------|
| 16 | Главные страницы (index, portret-na-zakaz, pechat-na-kholste, pechat/foto-na-kholste) | 4 стр. | ✅ |
| 17 | Блог (20 стр.), Info (9 стр.) | 29 стр. | ✅ |
| 18 | Печать — pechat/*.html (foto-v-ramke, fotokollazh, modulnaya, reproduktsiya, modular-painting) + misc (404, calc, order, spasibo) | 9 стр. | ✅ |

### Фаза 4 — JS и анимации ✅ (7 марта 2026)

| # | Задача | Файлы | Статус |
|---|--------|-------|--------|
| 19 | Поддержка `data-tabs` в nav.js (tab-switching для Характеристики) | nav.js | ✅ Уже было |
| 20 | Step-animate: IntersectionObserver для «Как заказать» — `.step-animate` → `.is-visible` при скролле | nav.js, input.css | ✅ Добавлен |
| 21 | Video-cover и lightbox-select-btn — совместимость | nav.js | ✅ Уже было |

### Фаза 5 — Очистка и валидация

| # | Задача |
|---|--------|
| ~~22~~ | ~~Удалить portret-maslom-v7.html~~ — **Решение изменено (7 марта 2026):** v7 = полигон O-иерархии, НЕ удалять. См. Шаг 8 |
| 23 | Проверить focus-visible кольца (ring-color: ah-600 вместо тёмного ah-950) |
| 24 | Проверить контрастность: page-navigator, cookie-баннер, city-dialog, messenger-widget |
| 25 | `npm run build:once` + `npm run copy-css` финальная сборка |
| 26 | Lighthouse-проверка эталонной страницы (Accessibility ≥ 95) |

### Риски и заметки

- **focus-visible:** `--color-primary` теперь `#140B01` (почти чёрный) — кольца фокуса могут быть невидимы на тёмном фоне → использовать `ah-600` (#D97706) для ring-color
- **Баннеры:** Куки, город, мессенджер — стилизованы под синюю тему, нужна проверка на amber
- **Page Navigator:** Белые точки на тёплом фоне — проверить контраст
- **Промо-текст:** «Скидка 20% с 3 по 4 января» захардкожен в v7 — убрать или параметризировать
- **Табы Характеристики:** `data-tabs`/`data-tab-list`/`data-tab-panels` — убедиться что nav.js поддерживает
  - Отправка: заглушка → показ success-экрана → автозакрытие через 3 с
  - **При интеграции:** заменить заглушку на `fetch` к Bitrix API
- Виджет отзывов

---

## Черновики

Файлы в `src/html/_drafts/` — тесты и эксперименты, не учитываются в статистике.

---

## CALC — принятые решения и реестр

> **Полная техническая документация:** [docs/CALCULATOR.md](docs/CALCULATOR.md)
> — API, формулы, конфиг цен, каталог рамок, загрузчик, варианты архитектуры, требования к серверной части.

### Принятое решение по архитектуре (13 февраля 2026)

**Принято: File-Based (Вариант A).** Серверная часть — позже, при необходимости.

- Источник истины по DOM калькулятора — `src/html/calc.html`
- Масштабирование — один runtime `calc.js` + page-config через `prices.js`
- Цены и формулы — в локальных JS-файлах, без серверных зависимостей
- Отправка заказа — заглушка (задача интеграции с Битрикс)

**При интеграции с Bitrix → Вариант B (Hybrid-light).** Подробности, сравнение всех 4 вариантов и критерии перехода → [CALCULATOR.md, раздел 9](docs/CALCULATOR.md#9-архитектура-варианты-и-приоритеты).

### ⚠️ Багетные рамы — только демо

Текущие 27 CSS-рам в `DEFAULT_FRAMES` — это **демо-заглушка для разработки**. Они НЕ соответствуют реальному каталогу muse.ooo:
- На оригинале ~40 рам с реальными фото и индивидуальными ценами (от 1 575 до 4 612 р.)
- У нас — CSS-бордеры с условными цветами и 2 уровня цен (1 200 / 1 800 р/м)

**Решение на продакшене:** лучше не показывать рамы вообще, чем показывать несуществующие с неверными ценами. При интеграции программист подключит реальный каталог с сервера (фото, индивидуальные цены, наличие). Подробности → [CALCULATOR.md, раздел 6](docs/CALCULATOR.md#6-каталог-багетных-рам).

### Статус пилотных страниц (Batch 1) — обновлено 17 февраля 2026

| Страница | Тип | Статус | CalcInit |
|----------|-----|--------|----------|
| `src/html/calc.html` | demo/эталон | ✅ Готов | `CalcInit({ type: 'canvas' })` |
| `src/html/foto-na-kholste-sankt-peterburg.html` | canvas | ✅ Работает | `CalcInit({ type: 'canvas' })` |
| `src/html/portret-na-zakaz/style/portret-maslom.html` | portrait | ✅ Работает | `CalcInit({ type: 'portrait' })` |

---

### Реестр подключений CALC (23 страницы `portret-na-zakaz`)

Статусы:
- `placeholder` — в секции `#calc` стоит заглушка, runtime не подключён.
- `pilot-ready` — страница выбрана как кандидат на раннюю интеграцию после пилота.
- `integrated` — калькулятор подключён и работает по целевому стандарту.

| Страница | Тип | Текущий статус | Следующий шаг | Приоритет |
|---|---|---|---|---|
| `src/html/portret-na-zakaz/style/portret-maslom.html` | style | `integrated` | ✅ Калькулятор работает: `CalcInit({ type: 'portrait', prices: MUSE_PRICES.portrait, tooltips })` | Высокий |
| `src/html/portret-na-zakaz/style/portret-akvarelyu.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Высокий |
| `src/html/portret-na-zakaz/style/portret-karandashom.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/sharzh-po-foto.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/portret-v-obraze.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/portret-komiks.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/portret-iz-slov.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/portret-flower-art.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/fantasy-art-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/low-poly-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/graffiti-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/beauty-art-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/granzh-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/wpap-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/pop-art-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/drim-art-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/style/fotomozaika.html` | style | `placeholder` | Подключить общий calc-блок + отдельный page-config (особые параметры) | Средний |
| `src/html/portret-na-zakaz/style/love-is-portret.html` | style | `placeholder` | Подключить общий calc-блок + page-config стиля | Средний |
| `src/html/portret-na-zakaz/object/muzhskoy-portret.html` | object | `placeholder` | Подключить общий calc-блок + page-config объекта | Средний |
| `src/html/portret-na-zakaz/object/zhenskiy-portret.html` | object | `placeholder` | Подключить общий calc-блок + page-config объекта | Средний |
| `src/html/portret-na-zakaz/object/detskiy-portret.html` | object | `placeholder` | Подключить общий calc-блок + page-config объекта | Средний |
| `src/html/portret-na-zakaz/object/parnyy-portret.html` | object | `placeholder` | Подключить общий calc-блок + page-config объекта | Средний |
| `src/html/portret-na-zakaz/object/semeynyy-portret.html` | object | `placeholder` | Подключить общий calc-блок + page-config объекта | Средний |

Порядок rollout по батчам:
- **Batch 1 (пилот):** `foto-na-kholste-sankt-peterburg.html` + `portret-maslom.html`
- **Batch 2:** 5 style-страниц
- **Batch 3:** 5 style-страниц
- **Batch 4:** оставшиеся style + 5 object-страниц

---

## План CALC: тиражирование на портретные страницы

> **Техническая документация:** [docs/CALCULATOR.md](docs/CALCULATOR.md)
> Фазы 1–4 (синхронизация эталона, цены, оптимизация, доработки) — ✅ завершены.

### Следующий шаг — тиражирование (бывшая Фаза 5)

**Цель:** подключить калькулятор на 22 страницах с заглушками.

**Порядок:**
- **Batch 2:** 5 популярных стилей (`karandash`, `sharzh`, `v-obraze`, `pop-art`, `drim-art`)
- **Batch 3:** 12 оставшихся стилей + `pechat-na-kholste-sankt-peterburg.html`
- **Batch 4:** 5 объектов (`muzhskoy`, `zhenskiy`, `detskiy`, `parnyy`, `semeynyy`)

**Для каждой страницы:**
1. Скопировать секцию `#calc` + `<dialog>`-и из обновлённого `calc.html`
2. Заменить заглушку «Будет загружен из Bitrix»
3. Добавить `CalcInit({ type: 'portrait', prices: MUSE_PRICES.portrait, tooltips: SHARED_TOOLTIPS })`
4. Скорректировать пути к JS

### Не входит в план (задачи интеграции с Битрикс)

- Реальная отправка формы заказа (сейчас `console.log` + `alert`)
- Серверный API для цен
- Серверная валидация цен

---

## Текущий план работ (9 марта 2026)

> **Контекст:** Шаги 1–7 завершены. Эталон `portret-maslom.html` чист, 18 style-страниц и 5 object-страниц обновлены. V7 O-hierarchy масштабирована через unlayered CSS-блок `.style-portraits` в `input.css`. CTA-кнопки, sale-banner, характеристики, desc-media — всё унифицировано. `portret-maslom-v7.html` = **полигон O-иерархии** (точная копия продакшна + inline `<style>` с proposal CSS для O-иерархии + панель переключения «База / O-иерархия»).

### Приоритет и порядок

| Шаг | Задача | Зависимости | Статус |
|-----|--------|-------------|--------|
| **1** | **Глобализация CSS:** перенести компоненты из inline `<style>` v7 в `input.css` | — | ✅ |
|   | 1.1 `step-number-giant` → `@layer components` | — | ✅ |
|   | 1.2 `info-dot` → `@layer components` | — | ✅ |
|   | 1.3 `sale-banner` (универсальный, отвязан от calc) → `@layer components` | — | ✅ |
|   | 1.4 `desc-media` (флоат-блок описания) → `@layer components` | — | ✅ |
|   | 1.5 `eyebrow` (метка-бейдж над заголовком) → `@utility` | — | ✅ |
|   | 1.6 Правила тёмных поверхностей (`:where(.bg-ah-975, .bg-ah-950)`) — уже в `input.css` | — | ✅ |
|   | 1.7 Кнопки на тёмном фоне (CTA ghost buttons) + `btn-inverse` без обводки, hover lift | — | ✅ |
|   | 1.8 `npm run build:once` + `npm run copy-css` — 158 KB, ок | 1.1–1.7 | ✅ |
| **2** | **Обновить эталон:** аудит v7 inline CSS vs input.css → все ~85 `[data-theme="amber"]` правил уже перенесены (без префикса). Обновлён `.calc-accent` (ah-950/ah-50). Эталон чист: нет `<style>`, нет `data-theme`, нет Google Fonts. Build 163KB. | Шаг 1 | ✅ |
| **3** | **Тёмные секции:** унифицированы до `ah-975` (ah-950 убран из фоновых правил). Текст на тёмных поверхностях — `text-white`. | Шаг 2 | ✅ |
| **4** | **Доделать секцию Описание:** текст, before/after slider — без изменений, ready. Видео-карточка заменена (см. шаг 5). | Шаг 2 | ✅ |
| **5** | **Видео в Описании:** YouTube заменён на self-hosted видео (`video-card` + `video-modal`). 2 видео: mp4 + webm. CSS модалки мигрирован в `input.css`. JS (`nav.js`) уже поддерживает. Build 167 KB. | Шаг 4 | ✅ |
| **6** | **CTA готов:** Кнопки поменяны (Заказать первая), `btn-inverse` без обводки + hover lift | Шаг 2 | ✅ |
| **7** | **Масштабирование на 17 страниц:** обновить Как заказать, Акцию, Характеристики, CTA по эталону. CTA-кнопки выровнены ✅ (4 файла: drim-art, fantasy-art, graffiti, fotomozaika — убрано `w-full md:w-auto text-center`). Остальные секции — ok | Шаги 1–6 | ✅ |
| **8** | **O-иерархия на v7 (полигон).** v7 = точная копия продакшна + inline `<style>` с proposal CSS + тоггл-панель. 8.0 ✅, 8.1 ✅ (все 9 секций). Осталось: 8.2 визуальное сравнение, 8.3 решение. Подробности — [AI_O_HIERARCHY_ADAPTATION.md](docs/AI_O_HIERARCHY_ADAPTATION.md) | Шаги 1–6 | ⏳ |

#### Шаг 8 — детальный план

> **Источник:** шаблон `draft/O/` (Tailwind Plus Oatmeal). Аудит 7 марта 2026 выявил, что O использует **4 тона** на светлом фоне: olive-950 (headings), olive-700 (body), olive-600 (fineprint), olive-500 (de-emphasized UI). Между 950 и 700 — пустота. Мусные ink-soft (ah-900) и ink-label (ah-800) — расширения, не заимствования.

**8.0. Подготовка** ✅
- Откат ink-изменений на `portret-maslom.html` (5× text-ink-soft → text-ink, 1× text-ink-label → text-ah-800, DEMO-комментарий удалён)
- Добавлен раздел аудита в `docs/AI_O_HIERARCHY_ADAPTATION.md` (6 расхождений)

**8.1. Proposal CSS для всех 9 секций** ✅
v7 **пересоздан из продакшна** (7 марта 2026). Ранее v7 имел собственную стилизацию (~1300 inline CSS, Google Fonts, data-theme, расширенный header) — «База» не соответствовала продакшну, сравнение было некорректным. Теперь v7 = точная копия `portret-maslom.html` + 3 добавки:
1. Inline `<style>` с proposal CSS (~200 строк, все правила под `body[data-hierarchy-preview="proposal"]`)
2. Панель переключения «База / O-иерархия» (HTML)
3. JS тоггла (localStorage + URL ?hierarchy=proposal)

Proposal покрывает все 9 секций:
- **Глобально**: .heading-section tracking -0.025em + text-pretty; .heading-hero text-balance
- **Hero**: clamp sizing, tracking -0.04em, max-width 8ch, em → warm overlay
- **Как заказать**: heading-card → sans/600/clamp, body ah-700, badge ah-700, step-number ah-200
- **Характеристики**: check-list-item ah-700 + lh 1.75, footnote ah-500
- **Преимущества**: heading-card ah-900 + max-width, body ah-950
- **Отзывы**: eyebrow treatment
- **Описание**: body ah-700 + lh 1.75, meta ah-500
- **Примеры** (dark): heading tracking -0.03em
- **CTA** (dark): heading tracking + balance, em → ah-500

**8.2. Визуальное сравнение** ⭕
Открыть v7 в Live Server, переключать «База / O-иерархия» и оценить. URL: `?hierarchy=proposal`.
Вопросы для оценки: читаемость body при ah-700, heading-card serif vs sans, meta при ah-500.

**8.3. Решение о масштабировании** ⭕
Принять/отклонить каждое ink-присвоение. Если одобрено → перенести на эталон → масштабировать на 17 style-страниц. Если нет → зафиксировать причины.

### Принятые решения

- Иерархия O — **не блокер и не первый шаг**. Ink-классы уже определены в `input.css`. Иерархия — это тюнинг, который делается после стабилизации компонентов.
- Inline `<style>` из v7 — **главный блокер масштабирования**. Пока стили внутри одной страницы, тиражировать невозможно.
- Header/Footer — в v7 встроены полностью и работают. В эталоне — заглушки (по плану Phase 1.5d). Проблем с тёмным фоном нет, но после глобализации нужна перепроверка.
- `portret-maslom-v7.html` — **полигон O-иерархии** (решение 7 марта 2026). Пересоздан из продакшна: точная копия portret-maslom.html + proposal CSS (все 9 секций) + панель «База / O-иерархия». «База» теперь = продакшн. НЕ удалять.