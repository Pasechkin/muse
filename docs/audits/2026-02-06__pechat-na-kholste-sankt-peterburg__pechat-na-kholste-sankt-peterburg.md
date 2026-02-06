---
status: "✅"
page: "Печать на холсте — Санкт-Петербург"
path: "src/html/pechat-na-kholste-sankt-peterburg.html"
date: 2026-02-06
auditor: GitHub Copilot
---

# Аудит: Печать на холсте — src/html/pechat-na-kholste-sankt-peterburg.html

Короткий вывод: чек-лист A–E соблюден.

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
- [x] content-auto используется только ниже первого экрана

## C. Скрипты
- [x] Скрипты внизу перед </body>
- [x] nav.js подключен с defer
- [x] Нет inline JS для типовых блоков
- [x] JS: tailwindplus-elements.js отсутствует; el-* разметки нет

## D. Изображения
- [x] Все img имеют width и height
- [x] decoding="async", loading="lazy" по умолчанию
- [x] LCP ресурс: первый экран — видео, правило LCP-изображения не применяется
- [x] Формат webp
- [x] SVG только inline

## E. Доступность
- [x] Page Navigator: sr-only в каждой ссылке
- [x] Icon-only кнопки: sr-only или aria-label
- [n/a] Before/After: input[type="range"] не найден
- [n/a] Видео кнопки: кнопки play не используются
- [x] Текстовые ссылки внутри абзацев: underline (text-primary underline hover:no-underline)

### Результат
- Статус: ✅
- Найденные проблемы: отсутствуют

Отчет составлен по чек-листу docs/AUDIT/Task-1.md.
