---
status: "✅"
page: "Парный портрет"
path: "src/html/portret-na-zakaz/object/parnyy-portret.html"
date: 2026-02-05
auditor: GitHub Copilot
---

# Аудит: Парный портрет — src/html/portret-na-zakaz/object/parnyy-portret.html

Короткий вывод: страница соблюдает Task‑1; hero на мобильных intentionally not loaded.

## A. Структура страницы
- [x] lang, charset, viewport
- [x] title, meta description, canonical

## B. CSS и критический путь
- [x] Критический CSS ограничен
- [x] CSS подключён через `css/output.css`

## C. Скрипты
- [x] Скрипты внизу, `nav.js` defer

## D. Изображения
- [x] Все изображения имеют размеры
- [x] Hero задаётся для десктопа в `<picture>`; мобильный источник — прозрачный 1×1 пиксель (intentional)

## E. Доступность
- [x] Элементы управления доступны (sr-only / aria)

### Результат
- Статус: ✅
- Найденные проблемы: отсутствуют
- Примечание: мобильный placeholder — преднамеренно; рекомендуется добавить srcset при принятии решения изменить поведение.

Отчёт составлен по чек-листу `docs/AUDIT/Task-1.md`.


## Дополнение 2026-02-06
Статус: ✅
Проблемы: устранены (content-auto/hero decoding/el-*).
