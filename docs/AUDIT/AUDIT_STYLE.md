# Аудит страниц раздела «Стили» — эталон портрет маслом

Цель: быстро и одинаково проверять, что страницы раздела «Стили» соответствуют канонам проекта. Эталон группы: [src/html/portret-na-zakaz/style/portret-maslom.html](../../src/html/portret-na-zakaz/style/portret-maslom.html).

Основные правила: [docs/DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md), [AI_INSTRUCTIONS.md](../../AI_INSTRUCTIONS.md), [PROJECT.md](../../PROJECT.md).

Важно: в этом аудите НЕ проверяем совпадение контента с muse.ooo. Проверяем только техническое соответствие и структуру.

---

## 0) Входные данные

Перед началом укажи (в отчёте аудита):
- Путь к странице (например: src/html/portret-na-zakaz/style/brand-portrait.html)
- Группа страницы: стили
- Эталон группы: [src/html/portret-na-zakaz/style/portret-maslom.html](../../src/html/portret-na-zakaz/style/portret-maslom.html)

---

## 1) Как запускать аудит (workflow)

1. Открой страницу через Live Server из src/html/...
2. Открой DevTools:
   - Elements (структура, атрибуты)
   - Console (ошибки JS)
   - Network (особенно изображения первого экрана)
   - Lighthouse (Performance + Accessibility) — при необходимости
3. Сверь страницу с документацией:
   - Каноны и компоненты: [docs/DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)
   - Запрещено/разрешено: [AI_INSTRUCTIONS.md](../../AI_INSTRUCTIONS.md)
4. Зафиксируй результат:
   - Заполни отчёт в docs/AUDIT/
   - В [PROJECT.md](../../PROJECT.md) записывай только системные проблемы (влияет на 10+ страниц)

Важно: во время аудита не вносить правки в документацию. Если документация неоднозначна/устарела — записать это как рекомендацию в отчёте.

---

## 2) Что именно проверять (чек‑лист)

### A. Структура страницы

Подробные правила: [docs/DESIGN_SYSTEM.md → Шаблон страницы](../DESIGN_SYSTEM.md#шаблон-страницы-html5)

- lang="ru", корректные meta charset/viewport
- Есть title и meta name="description" (проверяем наличие, не содержимое)
- Есть link rel="canonical" Если canonical неизвестен — спросить и проставить.
- Meta robots noindex, nofollow (пока проект не на production)
- Нет вложенных .container внутри .container

### B. CSS и критический путь

Подробные правила: [AI_INSTRUCTIONS.md → Критический CSS](../../AI_INSTRUCTIONS.md#критический-css)

- Основной CSS подключён как ../../css/output.css
- Критический CSS содержит только :root и body
- В критическом CSS нет .sr-only, .page-navigator и прочих непервичных стилей
- Нет пустых <style> с комментариями-заглушками (удалить)
- При необходимости предложить корректировку критического пути (если видишь лишние стили или отсутствует нужный минимум)

### C. JS и интерактив

Подробные правила: [AI_INSTRUCTIONS.md → Tailwind Plus Elements](../../AI_INSTRUCTIONS.md#tailwind-plus-elements-вендорный-скрипт)

- Скрипты подключены внизу, перед </body>
- Порядок скриптов: tailwindplus-elements.js (если есть el-*) → nav.js (defer)
- Нет inline‑JS для типовых блоков (video cover, before/after, carousel)
- Нет page‑specific fallback для el‑компонентов

### D. Структура блоков раздела «Стили»

Сверяем наличие и каноничную структуру блоков по эталону:
- Hero: секция с h1, кнопкой, LCP‑изображением
- Примеры (Bitrix‑заглушка)
- Цена (Bitrix‑калькулятор‑заглушка)
- Как заказать: step-container, process-step
- Характеристики: check-list и el-tab-group
- Преимущества: advantages-* и карточки
- Отзывы: секция и кнопка открытия отзыва
- Описание: блок вариативный. Возможны страницы:
   - без описания
   - с описанием без видео
   - с описанием без блока до/после
   - с описанием с видео и/или до/после
- Для страниц «портрет из слов» и «фотомозаика» — фиксируем drift
- CTA: cta-section и cta-container

### E. Иконки / SVG

- Только inline svg, нет img с .svg

### F. Изображения

Подробные правила: [docs/DESIGN_SYSTEM.md → Изображения](../DESIGN_SYSTEM.md#изображения)

- У всех img есть width/height
- По умолчанию: decoding="async", loading="lazy"
- Для LCP: без loading="lazy", с fetchpriority="high"
- Формат webp
- background-image только для декоративных фонов

### G. Доступность

Подробные правила: [docs/DESIGN_SYSTEM.md → Доступность](../DESIGN_SYSTEM.md#доступность-accessibility)

- Page Navigator: sr-only в каждой ссылке
- Icon‑only кнопки: sr-only или aria-label
- Before/After: aria-label на input[type="range"]
- Видео: aria-label на кнопке play
- Ссылки в тексте: underline

---

## Исключения из аудита

Эти элементы не проверяем в рамках стилей:
- Header и Footer
- OAuth‑модальное окно
- Калькулятор в секции Цена (это заглушка)

---

## 3) Как оформлять результат (формат отчёта)

Отчёты по стилям фиксируем в этом же файле ниже.

### Что писать в отчёте

- Страница: src/html/.../page.html
- Статус: ✅ ок / ⚠️ есть замечания / 🔴 критично
- Замечания:
  - [ ] кратко что не так
  - [ ] где именно
- Решение:
  - кратко что сделать

Если замечание системное (влияет на 10+ страниц) — записать в [PROJECT.md](../../PROJECT.md) как отдельную задачу.

---

## 4) Правила точности

- Не менять output.css (генерат). Менять только src/input.css
- Не править tailwindplus-elements.js (вендор)

---

## 5) Сводная таблица аудитов (статус страниц)

### Стили портретов (18 страниц)

| Страница | Файл | Canonical | Статус | Замечания |
|---|---|---|---|---|
| Портрет маслом | [src/html/portret-na-zakaz/style/portret-maslom.html](../../src/html/portret-na-zakaz/style/portret-maslom.html) | https://muse.ooo/portret-na-zakaz/portret-maslom/ | ✅ | |
| Портрет карандашом | [src/html/portret-na-zakaz/style/portret-karandashom.html](../../src/html/portret-na-zakaz/style/portret-karandashom.html) | https://muse.ooo/portret-na-zakaz/portret-karandashom/ | ✅ | |
| Портрет акварелью | [src/html/portret-na-zakaz/style/portret-akvarelyu.html](../../src/html/portret-na-zakaz/style/portret-akvarelyu.html) | https://muse.ooo/portret-na-zakaz/portret-akvarelyu/ | ✅ | |
| Портрет комикс | [src/html/portret-na-zakaz/style/portret-komiks.html](../../src/html/portret-na-zakaz/style/portret-komiks.html) | https://muse.ooo/portret-na-zakaz/portret-komiks/ | ✅ | |
| Портрет из слов | [src/html/portret-na-zakaz/style/portret-iz-slov.html](../../src/html/portret-na-zakaz/style/portret-iz-slov.html) | https://muse.ooo/portret-na-zakaz/portret-iz-slov/ | ⚠️ | drift |
| Портрет Flower Art | [src/html/portret-na-zakaz/style/portret-flower-art.html](../../src/html/portret-na-zakaz/style/portret-flower-art.html) | https://muse.ooo/portret-na-zakaz/portret-flower-art/ | ✅ | |
| Портрет в образе | [src/html/portret-na-zakaz/style/portret-v-obraze.html](../../src/html/portret-na-zakaz/style/portret-v-obraze.html) | https://muse.ooo/portret-na-zakaz/portret-v-obraze/ | ✅ | |
| Pop Art портрет | [src/html/portret-na-zakaz/style/pop-art-portret.html](../../src/html/portret-na-zakaz/style/pop-art-portret.html) | https://muse.ooo/portret-na-zakaz/pop-art-portret/ | ✅ | |
| Граффити портрет | [src/html/portret-na-zakaz/style/graffiti-portret.html](../../src/html/portret-na-zakaz/style/graffiti-portret.html) | https://muse.ooo/portret-na-zakaz/graffiti-portret/ | ✅ | |
| Гранж портрет | [src/html/portret-na-zakaz/style/granzh-portret.html](../../src/html/portret-na-zakaz/style/granzh-portret.html) | https://muse.ooo/portret-na-zakaz/granzh-portret/ | ✅ | |
| Beauty Art портрет | [src/html/portret-na-zakaz/style/beauty-art-portret.html](../../src/html/portret-na-zakaz/style/beauty-art-portret.html) | https://muse.ooo/portret-na-zakaz/beauty-art-portret/ | ✅ | |
| Dream Art портрет | [src/html/portret-na-zakaz/style/drim-art-portret.html](../../src/html/portret-na-zakaz/style/drim-art-portret.html) | https://muse.ooo/portret-na-zakaz/drim-art-portret/ | ✅ | |
| Fantasy Art портрет | [src/html/portret-na-zakaz/style/fantasy-art-portret.html](../../src/html/portret-na-zakaz/style/fantasy-art-portret.html) | https://muse.ooo/portret-na-zakaz/fantasy-art-portret/ | ✅ | |
| Фотомозаика | [src/html/portret-na-zakaz/style/fotomozaika.html](../../src/html/portret-na-zakaz/style/fotomozaika.html) | https://muse.ooo/portret-na-zakaz/fotomozaika/ | ⚠️ | drift |
| Love Is портрет | [src/html/portret-na-zakaz/style/love-is-portret.html](../../src/html/portret-na-zakaz/style/love-is-portret.html) | https://muse.ooo/portret-na-zakaz/love-is-portret/ | ✅ | |
| Low Poly портрет | [src/html/portret-na-zakaz/style/low-poly-portret.html](../../src/html/portret-na-zakaz/style/low-poly-portret.html) | https://muse.ooo/portret-na-zakaz/low-poly-portret/ | ✅ | |
| Шарж по фото | [src/html/portret-na-zakaz/style/sharzh-po-foto.html](../../src/html/portret-na-zakaz/style/sharzh-po-foto.html) | https://muse.ooo/portret-na-zakaz/sharzh-po-foto/ | ✅ | |
| WPAP портрет | [src/html/portret-na-zakaz/style/wpap-portret.html](../../src/html/portret-na-zakaz/style/wpap-portret.html) | https://muse.ooo/portret-na-zakaz/wpap-portret/ | ✅ | |

---

Легенда:
- CSS — неверный путь к CSS (нужен ../../css/output.css)
- ONINPUT — inline oninput в before/after, убрать (логика в nav.js)
- HEAD-SCRIPT — tailwindplus-elements.js в <head>, перенести вниз
- DUPLICATE-SCRIPT — tailwindplus-elements.js подключён дважды
- drift — зафиксированное отличие (портрет из слов / фотомозаика)

Общие замечания (все страницы):
- Canonical добавили
Дата 30.01.26



