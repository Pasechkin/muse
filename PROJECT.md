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

**Обновлено:** 21 февраля 2026

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
- ⏳ Переверстать оставшиеся 12 страниц (см. [Ожидают переверстки](#ожидают-переверстки))
- ⏳ Подготовить сборку для продакшена
- ⏳ Подготовить материалы для интеграции

### Проверки качества
- ⏳ **Контент** — сверка текстов/SEO/alt/title с muse.ooo (ничего не терять!)
- ⏳ **Визуал** — контраст, читаемость, соответствие оригиналу
- ⏳ **Функционал** — скрипты, видео, интерактив
- ⏳ **Калькуляторы** — верстка страниц с калькуляторами

**Аудиты:** `docs/AUDIT/` → Task-1.md, Task-234.md, Task-COMPLETE.md

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