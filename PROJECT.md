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
- ✅ Навигация — унифицированы header/footer/page-navigator → [подробнее](docs/DESIGN_SYSTEM.md#header)
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
1. ⏳ Переверстать оставшиеся 14 страниц (см. [Ожидают переверстки](#ожидают-переверстки))
2. ⏳ Подготовить сборку для продакшена
3. ⏳ Подготовить материалы для интеграции

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

---

## Черновики

Файлы в `src/html/_drafts/` — тесты и эксперименты, не учитываются в статистике.


