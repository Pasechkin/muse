---
status: "✅"
page: "Мужской портрет"
path: "src/html/portret-na-zakaz/object/muzhskoy-portret.html"
date: 2026-02-05
auditor: GitHub Copilot
---

# Аудит: Мужской портрет — src/html/portret-na-zakaz/object/muzhskoy-portret.html

Короткий вывод: Task‑1 выполнен; hero использует десктоп-предзагрузку и mobile placeholder — intentional.

## A. Структура страницы
- [x] lang, charset, viewport
- [x] title & description
- [x] canonical

## B. CSS
- [x] Критический CSS минимален

## C. Скрипты
- [x] `nav.js` defer, скрипты внизу

## D. Изображения
- [x] width/height указаны
- [x] Hero: desktop preload, mobile uses 1×1 data URI to avoid loading large image — intentional

## E. A11y
- [x] Контролы имеют aria / sr-only

### Результат
- Статус: ✅
- Найденные проблемы: отсутствуют
- Замечания: mobile placeholder — преднамеренно; при принятии решения можно добавить LQIP или responsive srcset.

Отчёт составлен по чек-листу `docs/AUDIT/Task-1.md`.


## Дополнение 2026-02-06
Статус: ✅
Проблемы: устранены (content-auto/hero decoding/el-*).
