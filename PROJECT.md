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

**Обновлено:** 9 февраля 2026

| Категория | Готово | Всего |
|-----------|--------|-------|
| Главные страницы | 4 | 4 |
| Стили портретов | 18 | 18 |
| Объекты портретов | 5 | 5 |
| Блог | 20 | 20 |
| Info | 9 | 9 |
| Прочие страницы | 0 | 14 |
| **Итого** | **56** | **70** |

**⏳ Осталось:** 14 страниц → [Ожидают переверстки](#ожидают-переверстки)

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

**Ссылки:**
- Vercel: https://muse-liard-one.vercel.app/
- Оригинал: https://muse.ooo

### Защита от индексации
Все страницы закрыты (`robots.txt` + `<meta name="robots">`).
Убрать защиту только после переноса на production.

---

## Следующие шаги

### Приоритетные задачи
- калькулятор для страницы фото на холсте  `foto-na-kholste-sankt-peterburg.html`
. ⏳ Переверстать оставшиеся 14 страниц (см. [Ожидают переверстки](#ожидают-переверстки))
. ⏳ Подготовить сборку для продакшена
. ⏳ Подготовить материалы для интеграции

### Проверки качества
- ⏳ **Контент** — сверка текстов/SEO/alt/title с muse.ooo (ничего не терять!)
- ⏳ **Визуал** — контраст, читаемость, соответствие оригиналу
- ⏳ **Функционал** — скрипты, видео, интерактив
- ⏳ **Калькуляторы** — верстка страниц с калькуляторами

**Аудиты:** `docs/AUDIT/` → Task-1.md, Task-234.md, Task-COMPLETE.md

---

## Ресурсы

- **Оригинал:** https://muse.ooo
- **Vercel:** https://muse-liard-one.vercel.app/
- **Документация:** `docs/`
- **Интеграция:** [docs/INTEGRATION_BITRIX.md](docs/INTEGRATION_BITRIX.md)

---

## Готовые страницы (56)

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

---

## Ожидают переверстки (14)

| Страница | URL | Приоритет |
|----------|-----|-----------|
| Портреты Москва | `/portret-na-zakaz-po-foto-na-kholste-moskva/` | Средний |
| Печать Москва | `/pechat-na-kholste-moskva/` | Средний |
| Оплата | `/info/oplata/` | Средний |
| Форма заказа | `/order/` | Средний |
| Спасибо за заказ | — | Низкий |
| Страница заказчика | `/personal/orders/...` | Средний |
| Подарочный сертификат | `/pechat/podarochnyy-sertifikat/` | Средний |
| Страница 404 | `/404/` | Низкий |
| Страница художника | `/personal/forart/...` | Средний |
| Модульная картина | `/pechat/modulnaya-kartina/` | С калькулятором |
| Фотоколлаж на холсте | `/pechat/fotokollazh-na-kholste/` | С калькулятором |
| Фото в рамке | `/pechat/foto-v-ramke/` | С калькулятором |
| Фотоколлаж в рамке | `/pechat/fotokollazh-v-ramke/` | С калькулятором |
| Репродукция | `/pechat/reproduktsiya/` | С поиском |

### UI-компоненты (ожидают)
- Куки-баннер
- «Это ваш город?»
- Виджет отзывов
### Калькуляторы и конструкоры
- калькулятор для страницы фото на холсте  `foto-na-kholste-sankt-peterburg.html`
- калькултор для страниц стили портретов
- калькулятор для страниц объекты портретов
- калькулятор для странцы портрет на заказ
- калькулятор для страницы фото в рамке
- конструктор для фотоколлажа
- контрсуктор для модульных картин
---

## Черновики

Файлы в `src/html/_drafts/` — тесты и эксперименты, не учитываются в статистике.

---

## Лог работ: Калькулятор

### Сессия 1 — Создание калькулятора (февраль 2026)

**Файлы:** `js/calc.js`, секция `#calc` в `foto-na-kholste-sankt-peterburg.html`, `calc.html` (демо)

- ✅ Создан универсальный JS-компонент `CalcInit()` (~850 строк) с публичным API и конфигурацией через объект
- ✅ Визуализатор — превью картины на фоне интерьера, бейджи размеров, загрузка/замена/удаление фото
- ✅ Панель настроек — размер (ручной ввод + пресеты 4×3), печать/подрамник, обработка фото, выбор багета, лак, подарочная упаковка
- ✅ Скрытые секции-расширения для портретных страниц — кол-во лиц, гель, акрил, масло, поталь, цифровой макет (feature-флаги)
- ✅ Каталог багетов — 27 рамок (студийные + классические) в модальном окне с превью
- ✅ Расчёт цены — по площади холста, периметру, выбранным опциям
- ✅ Сохранение состояния в localStorage
- ✅ Проверка DPI загруженного фото
- ✅ Форма заказа с валидацией (имя, телефон, email, ссылка, комментарий)
- ✅ Мобильный sticky-бар с ценой и кнопкой «Заказать»
- ✅ Lightbox для просмотра превью
- ✅ Интеграция в `foto-na-kholste-sankt-peterburg.html` с конфигом `{ type: 'canvas', showProcessing: true, showUpload: true }`

### Сессия 2 — Доработка калькулятора (11 февраля 2026)

- ✅ Динамические бейджи «Печать и подрамник» — «ВКЛЮЧЕНО» для стандартного/рулона, «+N ₽» для толстого подрамника (`gallerySurchargePerM: 300`)
- ✅ Динамические бейджи «Обработка фото» — «ВКЛЮЧЕНО» для базовой, «+300 ₽» / «+900 ₽» для оптимальной/премиальной
- ✅ Замена фона визуализатора на `https://muse.ooo/upload/imgsite/canvas-628-398.webp` (628×398)
- ✅ Удаление 3 unsplash-интерьеров (Гостиная, Детская, Офис) — оставлен 1 фон
- ✅ Удаление панели выбора интерьеров из HTML (обе страницы)
- ✅ Исправления доступности по отчёту Lighthouse (score 0.75 → ~1.0):
  - `aria-label` для чекбоксов `toggle-varnish`, `toggle-gift`
  - `aria-label` для `processing-select`
  - Обёртка `<main>` в `calc.html`
- ✅ Кнопки «Заказать» переведены на класс `btn-header-cta` (существующий в `input.css`)
- ✅ Шрифт итоговой цены выровнен с заголовком «Цена» (`font-extrabold` → `font-bold`)
