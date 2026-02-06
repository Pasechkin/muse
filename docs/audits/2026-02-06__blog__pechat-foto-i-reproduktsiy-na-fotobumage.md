---
status: "⚠️"
page: "Печать репродукций или фотографий на бумаге"
path: "src/html/blog/pechat-foto-i-reproduktsiy-na-fotobumage.html"
date: 2026-02-06
auditor: GitHub Copilot
---

# Аудит: Печать репродукций или фотографий на бумаге — src/html/blog/pechat-foto-i-reproduktsiy-na-fotobumage.html

Короткий вывод: есть нерешенные вопросы по изображениям (width/height).

## A. Структура страницы
- [x] lang="ru", meta charset="UTF-8", meta viewport
- [x] Есть title и meta name="description"
- [x] Есть link rel="canonical"
- [x] Meta robots="noindex, nofollow" (dev-режим)
- [x] Нет вложенных .container внутри .container

## B. CSS и критический путь
- [x] CSS подключен через css/output.css
- [x] Критический CSS в <head> содержит только :root и body
- [x] В критическом CSS нет .sr-only, .page-navigator, .carousel-scroll
- [x] content-auto не используется на первом экране

## C. Скрипты
- [x] Скрипты внизу перед </body>
- [x] nav.js подключен с defer
- [x] Нет inline JS для типовых блоков
- [x] JS: tailwindplus-elements.js отсутствует; el-* разметки нет

## D. Изображения
- [ ] Все img имеют width и height
- [x] decoding="async", loading="lazy" по умолчанию
- [n/a] LCP ресурс: первый экран — текст, правило LCP-изображения не применяется
- [x] Формат webp
- [x] SVG только inline

## E. Доступность
- [n/a] Page Navigator отсутствует
- [x] Icon-only кнопки: aria-label у кнопки "Наверх"
- [n/a] Before/After: input[type="range"] не найден
- [n/a] Видео кнопки: не используются
- [x] Текстовые ссылки внутри абзацев: underline (text-primary underline hover:no-underline)

### Результат
- Статус: ⚠️
- Найденные проблемы:
  - D: часть img без width/height (размеры не подтверждены)

Отчет составлен по чек-листу docs/AUDIT/Task-1.md.

