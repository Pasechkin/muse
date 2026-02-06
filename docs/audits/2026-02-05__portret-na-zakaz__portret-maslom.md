---
page: src/html/portret-na-zakaz/style/portret-maslom.html
date: 2026-02-05
auditor: GitHub Copilot
status: ⚠️
---


# Аудит: Портрет маслом — src/html/portret-na-zakaz/style/portret-maslom.html

Короткий вывод: большинство правил из Task-1 соблюдены. Основные замечания:
- присутствует `el-dialog`/`el-dialog-panel` (элементы `el-*`) — нарушает правило проекта (использование `el-*` без загрузки Tailwind Plus Elements запрещено);
- `meta robots="noindex, nofollow"` — в dev-режиме это ожидаемо, но нужно переключить перед публикацией.

## A. Структура страницы
- [x] `lang="ru"`, `meta charset="UTF-8"`, `meta viewport` — присутствуют.
- [x] `title` и `meta name="description"` — присутствуют и релевантны.
- [x] `link rel="canonical"` — присутствует.
- [x] `meta robots="noindex, nofollow"` — присутствует (dev-режим). Перед публикацией сменить на `index, follow`.
- [x] Нет вложенных `.container` внутри `.container` — проверено.

## B. CSS и критический путь
- [x] CSS подключён через `css/output.css` (`<link rel="stylesheet" href="../../css/output.css">`).
- [x] Критический CSS в `<head>` содержит ТОЛЬКО `:root` и `body` — да.
- [x] В критическом CSS отсутствуют `.sr-only`, `.page-navigator`, `.carousel-scroll` — да.
- [x] `content-auto` используется только на секциях ниже первого экрана (пример: `#primery`, `#calc`) — проверено.

## C. Скрипты
- [x] Скрипты подключены внизу перед `</body>` (`<script defer src="../../js/nav.js"></script>`).
- [ ] Примечание: требование про `drift` на `fotomozaika.html` и `portret-iz-slov.html` не применимо к этой странице.
- [x] `nav.js` имеет атрибут `defer`.
- [x] Нет inline JS для типовых блоков (video cover, carousel, before/after) — видео/галерея/before-after реализованы через data-атрибуты.
- [ ] JS: подключён только `js/nav.js` (defer); `tailwindplus-elements.js` отсутствует; **НО** на странице присутствует `el-dialog`/`el-dialog-panel` (элементы `el-*`) — это несоответствие правилу Task-1.

## D. Изображения и LCP
- [x] Все `img` имеют `width` и `height` — проверено (герой, галерея, before/after и пр.).
- [x] По умолчанию `decoding="async"`, `loading="lazy"` — соблюдается для большинства изображений (герой — `loading="eager"` как LCP).
- [x] LCP ресурс: на первом экране LCP — изображение (герой). Оно не лениво, имеет `fetchpriority="high"` и есть `preload` — правильно.
- [x] Формат `webp` для основных изображений — соблюдён.
- [x] SVG вставлены inline, не через `<img src="*.svg">` — да.

## E. Доступность
- [x] `page-navigator`: каждая ссылка содержит `span.sr-only` — да.
- [x] Icon-only кнопки имеют `sr-only` или `aria-label` — проверено (play, close и т.д.).
- [x] `before/after`: `input[type="range"]` имеет `aria-label` — да (`aria-label="Сравнение до и после"`).
- [x] Видео кнопки имеют `aria-label` — да.
- [x] Текстовые ссылки внутри абзацев используют `text-primary underline hover:no-underline` — да.

## Результат
 - Статус: ⚠️ (есть несоответствия; большая часть исправлена, остаются пункты 2 и 3 ниже).

## Найденные проблемы и рекомендации
- [✅] `el-dialog` / `el-dialog-panel` — заменено на нативный `<dialog>` с обработчиками `data-open-dialog` / `data-close-dialog` (см. `nav.js`). Проблема устранена.
- [⚠️] `meta name="robots" content="noindex, nofollow"` — остаётся; перед публикацией заменить на `index, follow`.
- [⚠️] OAuth-ссылки в модальном окне всё ещё содержат плейсхолдеры (`YOUR_CLIENT_ID`, `YOUR_REDIRECT_URI`) и inline `onclick` с `BxPopup(...)` — требуется перенос popup-логики в скрипт и серверная подстановка параметров.

## Шаги для исправления (рекомендуемые)
1. Перед релизом заменить `meta robots` на `index, follow` (приоритет: высокий).
2. Перенести inline `onclick` с `BxPopup` в `nav.js` или интеграционный скрипт и обеспечить, чтобы реальные OAuth `client_id`/`redirect_uri` подставлялись сервером (приоритет: высокий).
3. Повторно прогнать проверку Task-1 после внесённых правок и обновить статус на ✅.

---
 Файл отчёта составлен строго по чек‑листу Task-1.md. Не вносите изменений в исходную HTML-страницу без согласования.

---
Примечание по Bitrix: Bitrix/виджеты (галерея, калькулятор, отзывы) в документе указаны как placeholder'ы. На текущем этапе интеграция виджетов не выполняется — рекомендации по интеграции отложены и помечены как N/A до момента, когда начнётся этап интеграции.
