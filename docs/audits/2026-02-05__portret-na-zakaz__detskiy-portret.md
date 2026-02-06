---
status: "✅"
page: "Детский портрет"
path: "src/html/portret-na-zakaz/object/detskiy-portret.html"
date: 2026-02-05
auditor: GitHub Copilot
---

# Аудит: Детский портрет — src/html/portret-na-zakaz/object/detskiy-portret.html

Короткий вывод: страница соответствует требованиям Task‑1; hero mobile placeholder ЯВНО преднамерен.

## A. Структура
- [x] lang, charset, viewport
- [x] title/description/canonical

## B. CSS
- [x] Критический CSS ограничен

## C. Скрипты
- [x] Скрипты внизу, `nav.js` с defer

## D. Изображения
- [x] Все изображения с width/height
- [x] Hero desktop preload; mobile: 1×1 data URI — intentional

## E. Доступность
- [x] aria/sr-only у ключевых элементов

### Результат
- Статус: ✅
- Найденные проблемы: отсутствуют
- Примечание: mobile placeholder — преднамеренно; рекомендовано добавить запись в release notes при переключении поведения.

Отчёт составлен по чек-листу `docs/AUDIT/Task-1.md`.


## Дополнение 2026-02-06
Статус: ✅
Проблемы: устранены (content-auto/hero decoding/el-*).
