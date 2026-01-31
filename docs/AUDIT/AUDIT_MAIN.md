# Аудит: три страниц — холст и портреты

**Цель:** сократить отчёт до трёх конкретных страниц и подробно зафиксировать, что именно проверялось и какие результаты получены.

**Страницы, проверенные 31.01.2026:**
- `src/html/foto-na-kholste-sankt-peterburg.html`
- `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`
- `src/html/pechat-na-kholste-sankt-peterburg.html`

---

## Краткий процесс проверки
1) Открыл файлы из `src/html/` в редакторе и проверил их содержимое (head / main / faq / tail).  
2) Проверил наличия критических подключений (css/output.css, nav.js, tailwindplus-elements.js) и порядок скриптов (внизу страницы, `nav.js` с `defer`).  
3) Извлёк и валидацию JSON‑LD FAQ (синтаксис и совпадение с видимым #faq).  
4) Проверил изображения (width/height, decoding/loading, LCP preload).  
5) Быстрая проверка доступности: `<details>/<summary>` для FAQ, наличие Back to Top, aria-label / sr-only для иконок.

---

## Что именно проверялось (чек‑лист)
- Структура: `lang`, `meta charset`/`viewport`, `title`, `meta name="description"`, `link rel="canonical` (если production), `meta name="robots"` (dev: `noindex, nofollow`). **Дополнительно:** указывайте в отчёте **группу страницы** (info / стиль / объект / главная / блог).
- CSS и критический путь: `css/output.css` подключён; критический CSS содержит **только** `:root` + `body`; в `:root` есть `--secondary`; в `body` цвет задан через `var(--body)`. **Запрещённые в критическом CSS классы:** `.sr-only`, `.page-navigator`, `.carousel-scroll`, `.video-cover` и др. — они не должны попадать в критический inline.
- JS и интерактив: порядок скриптов — **если на странице есть `el-*`** → сначала `tailwindplus-elements.js` (type="module", **без defer**), затем `nav.js` (с `defer`). Скрипты внизу страницы перед `</body>`. Нет page-specific inline‑JS для типовых блоков (video cover, carousel, before/after); если есть legacy inline — отмечаем как замечание.
- FAQ: JSON‑LD (`@type: FAQPage`) присутствует и совпадает с видимой секцией `#faq` (каждый `Question` имеет `acceptedAnswer.text`). Проверять: валидный JSON, `@context` присутствует.
- Изображения: все `img` имеют `width`/`height`; по умолчанию `decoding="async"` и `loading="lazy"`; для LCP — **без** `loading="lazy``, с `fetchpriority="high` и/или `link rel="preload"`.
- Доступность (детально):
  - Page Navigator — каждая ссылка должна содержать `sr-only` текст (или атрибут `aria-label`);
  - Icon‑only кнопки — обязательно `sr-only` или `aria-label`;
  - Before/After: `input[type="range"]` должен иметь `aria-label`;
  - Video play‑кнопки должны иметь `aria-label`;
  - Текстовые ссылки — визуально различимые (underline).
- SVG: только inline (`<svg>...</svg>`), нет `<img src="*.svg">`.

**Отчёты:** сохранять индивидуальные файлы в `docs/audits/` по шаблону `YYYY-MM-DD__<group>__<page>.md`. В `AUDIT_MAIN.md` фиксируем только сводку и системные замечания.

---

## Результаты по страницам (резюме)

### `src/html/foto-na-kholste-sankt-peterburg.html` — ✅ OK
- CSS: `css/output.css` подключён; критический CSS корректен.
- JS: `js/nav.js` подключён (defer); `tailwindplus-elements.js` подключён (type="module").
- FAQ: JSON‑LD `FAQPage` присутствует, структура валидна и совпадает с `#faq`.
- Изображения: width/height + decoding/loading корректны.
- Доступность: FAQ использует `<details>/<summary>`, Back to Top присутствует.

### `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` — ✅ OK (с замечанием)
- CSS/JS: как у других — корректно подключено.
- FAQ: JSON‑LD присутствует и валиден.  
- Замечание: в одном ответе JSON‑LD содержит телефон **+7-812-408-18-69** — при желании его можно удалить из JSON‑LD (оставить в видимом контенте), чтобы не показывался в расширённом сниппете.
- Доступность и изображения — соответствуют правилам.

### `src/html/pechat-na-kholste-sankt-peterburg.html` — ✅ OK
- CSS/JS: корректно подключены.
- FAQ: JSON‑LD присутствует и соответствует видимому содержанию.
- Изображения: LCP предзагружен (`link rel="preload"`), остальные изображения имеют атрибуты width/height и loading/decoding корректно.

---

## Детальная проверка — подтверждённые пункты
Ниже перечислено, что было проверено и подтверждено в ходе детального аудита по каждой странице:

- Общее:
  - Все страницы относятся к группе: **main** (услуги/представление сервисов). Указано в отчёте для ясности.
  - Критический inline CSS во всех трёх файлах содержит только `:root` и `body` (переменные и базовые свойства) — запрещённые классы (`.sr-only`, `.page-navigator`, `.carousel-scroll`, `.video-cover`) в критическом inline не обнаружены.
  - Порядок скриптов корректен: `tailwindplus-elements.js` (type="module") подключается перед `nav.js` (defer) внизу страницы.
  - Не найдено нежелательного inline‑JS (onclick / dialog.showModal) для типовых блоков на проверяемых страницах.

- `src/html/foto-na-kholste-sankt-peterburg.html`:
  - `el-tab-group` / `el-tab-list` используются → `tailwindplus-elements.js` необходим.
  - Картинки имеют `width`/`height`, `decoding="async"`, `loading="lazy"`; видимых проблем с LCP нет.
  - FAQ JSON‑LD присутствует и совпадает с секцией `#faq`.
  - Доступность подтверждена: Page Navigator использует `sr-only` в ссылках.

- `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`:
  - Используются `el-popover` и `carousel-scroll` → `tailwindplus-elements.js` и скрипты карусели уместны.
  - Изображения имеют размеры и lazy/decoding корректно.
  - FAQ JSON‑LD валиден; **замечание:** в одном `acceptedAnswer.text` содержится телефон **+7-812-408-18-69** (телефон также показан в видимом тексте). При желании можно удалить телефон из JSON‑LD, оставив его в видимом контенте.
  - Формы калькулятора имеют `label` с `sr-only` (корректная доступность).
  - Back to Top присутствует; video play‑кнопка имеет `aria-label`.

- `src/html/pechat-na-kholste-sankt-peterburg.html`:
  - `carousel-scroll` используется — карусель работает через общие скрипты.
  - LCP изображение предзагружено (`link rel="preload" as="image" fetchpriority="high`) — корректно.
  - FAQ JSON‑LD есть и соответствует видимому содержимому.
  - Доступность Page Navigator и sr-only метки присутствуют.

## Рекомендованные действия (коротко)
1. Оставить `tailwindplus-elements.js` подключённым (он нужен из‑за `el-*` компонентов). (приоритет: средний)
2. Если не хотите видеть телефон в расширённых сниппетах Google — убрать телефон из JSON‑LD в `portret-...` (оставить в видимом контенте). (приоритет: низкий)
3. Обязательно прогнать каждую из трёх страниц через **Google Rich Results Test** / Search Console для окончательной проверки структурированных данных и получить Google‑специфичные предупреждения/ошибки. (приоритет: высокий)

---

## Замечания и рекомендации (приоритеты)
1. tailwindplus-elements.js подключён на всех трёх страницах — **рекомендация:** проверить, действительно ли он нужен (в некоторых случаях он остаётся из шаблона); не удалять без теста, так как может требоваться в хедере/меню. (приоритет: средний)
2. Телефон в JSON‑LD (портретная страница) — опционно удалить, если не хотите его видеть в расширённых сниппетах Google. (приоритет: низкий)
3. Прогнать официально в Google Rich Results Test / Search Console (URL 검사) для окончательной валидации структурированных данных. Это даст Google‑специфичные предупреждения/ошибки (приоритет: высокий)

---

**Дата проверки:** 31.01.2026

**Кто проверял:** внутренний аудит (скрипт/ручная проверка файлов в репозитории)

---

*Файл сокращён и предназначен только для отчёта по трём указанным страницам. Для общих правил и шаблонов используйте исходный AUDIT‑шаблон.*

**Табы (el-tab-group):**
- Исправлен модификатор: `aria-selected:` → `aria-[selected=true]:`
- Неактивный таб: `text-gray-400`
- Активный таб: `text-dark`, `font-semibold`, `border-primary` (синяя линия снизу)

**Доступность:**
- Добавлены атрибуты `title` на iframe карт (`title="Карта: Москва"`, `title="Карта: Санкт-Петербург"`)
- Добавлена кнопка «Наверх» (Back to Top)

#### faq.html — FAQ

**Доступность:**
- Добавлена кнопка «Наверх» (Back to Top)

#### Общие изменения в системных файлах

**src/input.css:**
- Добавлен компонент `.video-modal` и связанные стили

**src/html/js/nav.js:**
- Добавлена секция 3: Video Modal handler
- Обрабатывает клики на `.video-modal`, `.video-card[data-video]`
- Навигация между видео, переключение mute, закрытие по Escape

---

### Технические детали

**Правильный синтаксис для el-tab-group:**
- `in-aria-selected:` — для дочерних элементов (когда родитель имеет aria-selected)
- `aria-[selected=true]:` — для самого элемента с атрибутом (кнопки табов)

**Picture pattern для Hero (мобильная оптимизация):**
```html
<picture>
  <source media="(min-width: 1024px)" srcset="image.webp">
  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" ...>
</picture>
```
На мобильных загружается прозрачный 1x1 пиксель, фон секции `bg-black`.

---

### 31.01.2026 — Аудит страниц: `foto-na-kholste`, `portret-na-zakaz-po-foto-na-kholste`, `pechat-na-kholste`

Проверено: полный чек‑лист по разделу «Структура / CSS / JS / Изображения / Доступность / FAQ» (см. раздел 2).

#### Общая сводка
- Дата: **31.01.2026**
- Страницы:
  - `src/html/foto-na-kholste-sankt-peterburg.html` — **✅ OK**
  - `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` — **✅ OK**
  - `src/html/pechat-na-kholste-sankt-peterburg.html` — **✅ OK**

#### Что проверялось (кратко)
- **A. Структура:** `lang="ru"`, `meta charset`/`viewport`, `title` и `meta description` — присутствуют. `link rel="canonical"` присутствует. `meta name="robots"` — `noindex, nofollow` (в dev). Контейнеры не вложены внутри друг друга.
- **B. CSS:** `css/output.css` подключён, критический CSS содержит только `:root` и `body`, в `:root` есть `--secondary`, в `body` цвет задан через `var(--body)`.
- **C. JS:** `js/nav.js` подключён с `defer`. `js/tailwindplus-elements.js` присутствует на всех трёх страницах (вызов type="module"). Обратите внимание: на страницах FAQ используется `<details>/<summary>`, а не `el-*` компоненты — рекомендуется проверить необходимость включения `tailwindplus-elements.js` (не удалять без проверки, может использоваться в других компонентах хедера/футера).
- **D. FAQ / микроразметка:** во всех трёх файлах есть `JSON-LD` с `"@type":"FAQPage"` — данные валидны и соответствуют видимому содержимому `#faq`.
- **E. Изображения:** у изображений присутствуют `width`/`height`, `decoding="async"` и `loading="lazy"` по умолчанию; у `pechat` есть `link rel="preload"` для LCP (правильно настроено).
- **F. Доступность:** FAQ реализован через `<details>/<summary>` (доступно), есть кнопка Back to Top; iframe в контактах ранее поправлены (см. общий лог).

#### Замечания и рекомендации
- `tailwindplus-elements.js` подключён, хотя на страницах нет явного использования `el-*` — **рекомендация:** проверить, нужен ли скрипт для хедера/меню; при подтверждении его можно оставить, иначе удалить (с согласованием).
- В `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` в одном из ответов FAQ фигурирует телефон **+7-812-408-18-69** — если вы не хотите, чтобы контакт отображался в расширённых сниппетах, стоит удалить телефон из JSON‑LD (оставить в видимом контенте).
- Для уверенности рекомендую прогнать страницы через **Google Rich Results Test** (проверит предупреждения/ошибки структурированных данных).

#### Решение
- Принять как **✅ OK** после проверки необходимости `tailwindplus-elements.js` и (опционально) удаления телефона из JSON‑LD.

---
