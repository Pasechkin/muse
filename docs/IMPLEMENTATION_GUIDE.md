# Инструкция по внедрению дизайн-системы в HTML-страницы

> **Документ для ИИ-агента.** Выполняй задачи последовательно, от Task 1 до Task 8.
> Источник правил — `docs/DESIGN_SYSTEM.md`. Источник правил по контенту — `AI_INSTRUCTIONS.md`.

---

## Общие правила

1. **Эталон → остальные.** Сначала исправь эталонную страницу группы, проверь визуально, затем распространи на остальные.
2. **Не трогай контент.** Тексты, изображения, ссылки, `<script>` — без изменений.
3. **Калькулятор.** Источник истины — `src/html/calc.html`. Изменения CSS/HTML калькулятора → сначала в `calc.html`, потом в продуктовые страницы (см. AI_INSTRUCTIONS.md).
4. **output.css запрещён.** Никогда не редактируй `src/html/css/output.css` — он генерируется.
5. **Билд после правок.** После завершения каждой Task запусти `npm run build:once && npm run copy-css` для пересборки CSS.
6. **Не добавляй** новых файлов, изображений, JS без явного запроса.

---

## Сводка нарушений

| Категория | Файлов | Оценка нарушений | Приоритет |
|-----------|--------|-------------------|-----------|
| Адаптивные отступы секций | ~45 | ~91 секций | 🔴 CRITICAL |
| Неверный брейкпоинт (`md:py-24` → `lg:`) | 1 | 4 секции | 🔴 HIGH |
| `text-gray-*` вместо ink-системы | ~30 | ~60+ мест | 🟡 HIGH |
| `dark:` классы (вне scope) | 1 | 1 файл | 🟢 LOW |

---

## Task 1 — Адаптивные отступы: Главные страницы

**Стандарт:** `py-16 lg:py-24` (64 px → 96 px на десктопе).

### Эталон: `src/html/index.html`

Найди каждый `<section` с `py-16` без `lg:py-24` и добавь `lg:py-24`.

**Паттерн замены:**
```
БЫЛО:   class="... py-16 ..."
СТАЛО:  class="... py-16 lg:py-24 ..."
```

**Исключения (НЕ ТРОГАТЬ):**
- Hero-секции с `py-12` — оставь как есть
- CTA-секции с `py-24 md:py-32` — оставь как есть
- Footer с `py-8 lg:py-12` — оставь как есть
- Промо-баннеры с `py-6` — оставь как есть
- Секции, где уже есть `lg:py-24` — пропусти

**Особый случай в index.html:**
- Если встретишь `py-24 md:py-32` — это CTA, НЕ ТРОГАЙ, не меняй `md:` на `lg:`.

### Затем обнови:

| # | Файл | Примечание |
|---|------|------------|
| 1 | `src/html/index.html` | Эталон |
| 2 | `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | ~4-5 секций без responsive |
| 3 | `src/html/pechat-na-kholste-sankt-peterburg.html` | Проверь наличие `py-16` без `lg:` |
| 4 | `src/html/spasibo.html` | Если есть `py-16` без `lg:` |
| 5 | `src/html/404.html` | Если есть `py-16` без `lg:` |

---

## Task 2 — Адаптивные отступы: Стили портретов

**Стандарт:** `py-16 lg:py-20` (64 px → 80 px на десктопе).

> ⚠️ Для страниц стилей — `lg:py-20`, НЕ `lg:py-24`.

### Эталон: `src/html/portret-na-zakaz/style/portret-maslom.html`

Найди каждый `<section` с `py-16` без `lg:py-20` и добавь `lg:py-20`.

**Паттерн замены:**
```
БЫЛО:   class="... py-16 ..."        (без lg:py-*)
СТАЛО:  class="... py-16 lg:py-20 ..."
```

Если секция уже содержит `lg:py-20` — пропусти.

### Затем обнови все 18 оставшихся:

| # | Файл |
|---|------|
| 1 | `src/html/portret-na-zakaz/style/portret-maslom.html` ← ЭТАЛОН |
| 2 | `src/html/portret-na-zakaz/style/beauty-art-portret.html` |
| 3 | `src/html/portret-na-zakaz/style/drim-art-portret.html` |
| 4 | `src/html/portret-na-zakaz/style/fantasy-art-portret.html` |
| 5 | `src/html/portret-na-zakaz/style/fotomozaika.html` |
| 6 | `src/html/portret-na-zakaz/style/graffiti-portret.html` |
| 7 | `src/html/portret-na-zakaz/style/granzh-portret.html` |
| 8 | `src/html/portret-na-zakaz/style/love-is-portret.html` |
| 9 | `src/html/portret-na-zakaz/style/low-poly-portret.html` |
| 10 | `src/html/portret-na-zakaz/style/pop-art-portret.html` |
| 11 | `src/html/portret-na-zakaz/style/portret-akvarelyu.html` |
| 12 | `src/html/portret-na-zakaz/style/portret-flower-art.html` |
| 13 | `src/html/portret-na-zakaz/style/portret-iz-slov.html` |
| 14 | `src/html/portret-na-zakaz/style/portret-karandashom.html` |
| 15 | `src/html/portret-na-zakaz/style/portret-komiks.html` |
| 16 | `src/html/portret-na-zakaz/style/portret-v-obraze.html` |
| 17 | `src/html/portret-na-zakaz/style/sharzh-po-foto.html` |
| 18 | `src/html/portret-na-zakaz/style/wpap-portret.html` |

---

## Task 3 — Исправить неверные брейкпоинты: portret-maslom-v7.html

**Файл:** `src/html/portret-na-zakaz/style/portret-maslom-v7.html`

Этот файл — продакшен-страница (v7-вариант с калькулятором). Содержит 4 секции с `md:py-24`, что противоречит стандарту.

**Паттерн замены:**
```
БЫЛО:   py-16 md:py-24
СТАЛО:  py-16 lg:py-20
```

> Почему `lg:py-20` а не `lg:py-24`? Потому что это страница стиля (Секция стилей), стандарт — `py-16 lg:py-20`.

Найди и замени все вхождения `md:py-24` → `lg:py-20` в контексте `py-16`.
Если есть `py-16 lg:py-20` — уже правильно, не трогай.

---

## Task 4 — Адаптивные отступы: Объекты

**Стандарт:** `py-16 lg:py-20` (как и стили).

### Эталон: `src/html/portret-na-zakaz/object/muzhskoy-portret.html`

### Список файлов:

| # | Файл |
|---|------|
| 1 | `src/html/portret-na-zakaz/object/muzhskoy-portret.html` ← ЭТАЛОН |
| 2 | `src/html/portret-na-zakaz/object/zhenskiy-portret.html` |
| 3 | `src/html/portret-na-zakaz/object/detskiy-portret.html` |
| 4 | `src/html/portret-na-zakaz/object/semeynyy-portret.html` |
| 5 | `src/html/portret-na-zakaz/object/parnyy-portret.html` |

Замени `py-16` (без responsive) → `py-16 lg:py-20` на всех `<section`.

---

## Task 5 — Адаптивные отступы: Блог

**Стандарт:** `py-16 lg:py-24` (по решению пользователя — приводим к стандарту основных секций).

### Эталон: `src/html/blog/kollazh-i-fotokollazh.html`

Текущие паттерны в блоге (требуют замены):

| Текущий паттерн | Замена |
|-----------------|--------|
| `py-12 bg-white` | `py-16 lg:py-24 bg-white` |
| `py-12 lg:py-16 bg-white` | `py-16 lg:py-24 bg-white` |
| `py-12` (контент-секция) | `py-16 lg:py-24` |

**Заголовочную секцию НЕ ТРОГАЙ:**
```html
<!-- ЭТО НЕ ТРОГАЙ — header blog-секции -->
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
```

### Список всех 20 файлов:

| # | Файл |
|---|------|
| 1 | `src/html/blog/kollazh-i-fotokollazh.html` ← ЭТАЛОН |
| 2 | `src/html/blog/blog.html` |
| 3 | `src/html/blog/blog-page-2.html` |
| 4 | `src/html/blog/fotobumaga-dlya-khudozhestvennoy-pechati.html` |
| 5 | `src/html/blog/kompozitsiya-v-fotografii-ot-stiva-makkari.html` |
| 6 | `src/html/blog/modulnaya-kartina.html` |
| 7 | `src/html/blog/modulnaya-kartina-syuzhet-razmer-tsvet.html` |
| 8 | `src/html/blog/oformlenie-sten-fotografiyami.html` |
| 9 | `src/html/blog/paspartu.html` |
| 10 | `src/html/blog/pechat-foto-i-reproduktsiy-na-fotobumage.html` |
| 11 | `src/html/blog/pechat-na-kholste-foto-i-reproduktsiy.html` |
| 12 | `src/html/blog/pechat-na-kholste-i-fotobumage-lomond.html` |
| 13 | `src/html/blog/portret-dlya-pokoleniy.html` |
| 14 | `src/html/blog/postery-i-plakaty-dlya-interera.html` |
| 15 | `src/html/blog/preimushchestva-pechati-foto-na-kholste.html` |
| 16 | `src/html/blog/ramka-dlya-foto-i-kartin.html` |
| 17 | `src/html/blog/rukovodstvo-po-pechati-na-kholste.html` |
| 18 | `src/html/blog/sekret-garmonii-tsveta.html` |
| 19 | `src/html/blog/stil-pop-art-v-interere.html` |
| 20 | `src/html/blog/vybor-razmera-foto-i-reproduktsiy.html` |

---

## Task 6 — Адаптивные отступы: Info-страницы

**Стандарт:** `py-16 lg:py-24`.

Большинство info-страниц уже соответствуют стандарту. Проверь каждую и исправь только те, где `py-16` без `lg:py-24`.

### Список файлов:

| # | Файл | Ожидаемый статус |
|---|------|-----------------|
| 1 | `src/html/info/kontakty.html` | ✅ Уже OK |
| 2 | `src/html/info/dostavka.html` | ✅ Уже OK |
| 3 | `src/html/info/info.html` | ⚠️ Проверить — смешанные отступы |
| 4 | `src/html/info/avtorstvo.html` | Проверить |
| 5 | `src/html/info/faq.html` | Проверить |
| 6 | `src/html/info/guarantee.html` | Проверить |
| 7 | `src/html/info/oferta.html` | Проверить |
| 8 | `src/html/info/partnerstvo.html` | Проверить |
| 9 | `src/html/info/politika_konfidentsialnosti_sayta.html` | Проверить |

**Для `info.html` внимательно:**
- Файл `info.html` имеет hero на тёмном фоне — это исключение, не трогай hero-секцию.
- Остальные секции: если `py-16 lg:py-20` → заменить на `py-16 lg:py-24`.

---

## Task 7 — Адаптивные отступы: Печать (pechat)

**Стандарт:** `py-16 lg:py-24` (продуктовые страницы = основные секции).

### Список файлов:

| # | Файл |
|---|------|
| 1 | `src/html/pechat/foto-na-kholste-sankt-peterburg.html` |
| 2 | `src/html/pechat/foto-v-ramke.html` |
| 3 | `src/html/pechat/fotokollazh-na-kholste.html` |
| 4 | `src/html/pechat/konstruktor-kollazha.html` |
| 5 | `src/html/pechat/modulnaya-kartina.html` |
| 6 | `src/html/pechat/modular-painting.html` |
| 7 | `src/html/pechat/reproduktsiya.html` |

Проверь каждый файл. Исправь `py-16` без `lg:py-24` → `py-16 lg:py-24`.
Калькуляторные секции: если содержат калькулятор — оставь spacing как есть внутри калькулятора, но секцию-обёртку исправь.

---

## Task 8 — Замена `text-gray-*` на ink-систему

### Таблица замен

| Было | Стало | Пояснение |
|------|-------|-----------|
| `text-gray-600` | `text-ink-soft` | Тёмный вторичный текст (ah-900) |
| `text-gray-500` | `text-ink-muted` | Подписи, метки, helper-текст (ah-700) |
| `text-gray-400` | `text-ink-muted` | Хлебные крошки, мета-инфо (ah-700) |
| `text-gray-300` | `text-ink-muted` | Разделители хлебных крошек (ah-700) |

**Контекст тёмного фона** (например, hero в `info.html`, breadcrumbs на `bg-dark`):

| Было | Стало | Пояснение |
|------|-------|-----------|
| `text-gray-100` | `text-ink-on-dark` | Светлый текст на тёмном фоне (ah-25) |
| `text-gray-200` | `text-ink-muted-on-dark` | Приглушённый текст на тёмном фоне (ah-200) |
| `text-gray-300` на тёмном фоне | `text-ink-muted-on-dark` | Ссылки/навигация на тёмном |

### Правила определения контекста фона

- Родитель или текущий элемент имеет `bg-dark`, `bg-ah-975`, `bg-ah-950` → используй `-on-dark` вариант.
- Родитель или текущий элемент имеет `bg-white`, `bg-secondary`, `bg-ah-25` или нет explicit bg → используй обычный вариант.

### Калькулятор (`calc.html`)

**ВНИМАНИЕ:** Источник истины — `src/html/calc.html`. Замени `text-gray-*` сначала в `calc.html`, затем скопируй изменённый калькулятор во все продуктовые страницы, которые его включают.

Файлы с калькулятором (содержат встроенную разметку из calc.html):
- `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`
- `src/html/portret-na-zakaz/style/portret-maslom-v7.html`
- `src/html/pechat/foto-na-kholste-sankt-peterburg.html`
- `src/html/pechat/foto-v-ramke.html`
- `src/html/pechat/fotokollazh-na-kholste.html`
- `src/html/pechat/konstruktor-kollazha.html`
- `src/html/pechat/modulnaya-kartina.html`
- `src/html/pechat/modular-painting.html`

**Замены в calc.html:**

```
text-gray-400 (✕ кнопка закрытия)  →  text-ink-muted
text-gray-500 (метки, helper)       →  text-ink-muted
text-gray-400 (иконка-placeholder)  →  text-ink-muted
```

### Блог-страницы (20 файлов)

Типичные замены в блогах:
```
nav class="text-sm text-gray-400"          →  nav class="text-sm text-ink-muted"
<li class="text-gray-300">/</li>           →  <li class="text-ink-muted">/</li>
class="... text-gray-400 mb-4"             →  class="... text-ink-muted mb-4"
class="text-center text-sm text-gray-500"  →  class="text-center text-sm text-ink-muted"
<span class="text-gray-500">Автор:</span>  →  <span class="text-ink-muted">Автор:</span>
class="... text-xs text-gray-400"          →  class="... text-xs text-ink-muted"
```

### Info-страницы

- Все info-страницы (кроме info.html): `text-gray-400` в breadcrumbs → `text-ink-muted`
- `info/kontakty.html`: дополнительно таб-кнопки `text-gray-400 hover:text-gray-600` → `text-ink-muted hover:text-ink-soft`

**Специально для `info/info.html`** (тёмный фон hero):
```
nav class="... text-gray-300"                →  text-ink-muted-on-dark
class="text-gray-300 hover:text-white"       →  text-ink-muted-on-dark hover:text-ink-on-dark
class="text-gray-400"  (разделитель)         →  text-ink-muted-on-dark
class="text-gray-100"  (текущая страница)    →  text-ink-on-dark
```

### Pechat-страницы

- `pechat/foto-v-ramke.html`: breadcrumbs на тёмном фоне `text-gray-200` → `text-ink-muted-on-dark`; related articles `text-gray-600` → `text-ink-soft`
- `pechat/reproduktsiya.html`: breadcrumbs `text-gray-400` → `text-ink-muted`; теги `text-gray-500` → `text-ink-muted`
- Калькуляторные элементы — синхронизируй с calc.html (Task 8, раздел «Калькулятор»)

### Прочие файлы

| Файл | Что заменить |
|------|-------------|
| `src/html/spasibo.html` | `text-gray-600` (breadcrumbs) → `text-ink-soft` |

### Файлы-исключения (НЕ ТРОГАТЬ)

| Файл | Причина |
|------|---------|
| `src/html/ex.html` | Демо-файл, не продакшен |
| `src/html/social-icons-demo.html` | Демо-файл, не продакшен |
| `src/html/colors.html` | Палитра/демо, не продакшен |

---

## Порядок выполнения (Checklist)

```
[ ] Task 1: Главные страницы → py-16 lg:py-24
    [ ] index.html (ЭТАЛОН)
    [ ] portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html
    [ ] pechat-na-kholste-sankt-peterburg.html
    [ ] spasibo.html
    [ ] 404.html

[ ] Task 2: Стили → py-16 lg:py-20
    [ ] portret-maslom.html (ЭТАЛОН)
    [ ] 18 остальных style-страниц

[ ] Task 3: Исправить брейкпоинты portret-maslom-v7.html
    [ ] md:py-24 → lg:py-20 (4 секции)

[ ] Task 4: Объекты → py-16 lg:py-20
    [ ] muzhskoy-portret.html (ЭТАЛОН)
    [ ] 4 остальных object-страницы

[ ] Task 5: Блог → py-16 lg:py-24
    [ ] kollazh-i-fotokollazh.html (ЭТАЛОН)
    [ ] 19 остальных blog-страниц

[ ] Task 6: Info → py-16 lg:py-24
    [ ] info.html (проверить)
    [ ] 8 остальных info-страниц

[ ] Task 7: Печать → py-16 lg:py-24
    [ ] 7 pechat-страниц

[ ] Task 8: text-gray-* → ink-система
    [ ] calc.html (сначала!)
    [ ] Синхронизировать калькулятор в продуктовые страницы
    [ ] 20 blog-страниц
    [ ] 9 info-страниц
    [ ] pechat-страницы
    [ ] spasibo.html
```

---

## Верификация

После выполнения каждой Task:

1. **Grep-проверка** на оставшиеся нарушения:
   ```bash
   # Секции py-16 без responsive (кроме демо-файлов)
   grep -rn "py-16" src/html/ --include="*.html" | grep -v "lg:py-" | grep -v "ex.html" | grep -v "social-icons" | grep -v "colors.html"

   # Неверные брейкпоинты
   grep -rn "md:py-24" src/html/ --include="*.html" | grep -v "py-24 md:py-32"

   # Оставшиеся text-gray-*
   grep -rn "text-gray-" src/html/ --include="*.html" | grep -v "ex.html" | grep -v "social-icons" | grep -v "colors.html"
   ```

2. **Билд CSS:**
   ```bash
   npm run build:once && npm run copy-css
   ```

3. **Визуальная проверка** эталонных страниц в браузере.

---

## Справочник ink-утилит

| Утилита | CSS-переменная | Цвет | Контраст | Назначение |
|---------|---------------|------|----------|------------|
| `text-ink` | `--color-ah-950` | #281601 | ≥16:1 | Заголовки, основной текст |
| `text-ink-soft` | `--color-ah-900` | #593102 | ≥10:1 | Подзаголовки, описания |
| `text-ink-muted` | `--color-ah-700` | #B45309 | ≥6:1 | Второстепенный текст, метки |
| `text-ink-label` | `--color-ah-800` | #8B4C04 | ≥6:1 | Подписи, метки в формах |
| `text-ink-on-dark` | `--color-ah-25` | #FFFDFA | 16:1 | Белый текст на тёмном |
| `text-ink-muted-on-dark` | `--color-ah-200` | #FDE5C8 | 15:1 | Приглушённый на тёмном |

---

*Создано: 2025-03-07. Основание: аудит HTML на соответствие обновлённой DESIGN_SYSTEM.md.*
