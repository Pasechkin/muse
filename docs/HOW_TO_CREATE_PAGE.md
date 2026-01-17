# Как создать новую страницу

Инструкция для работы с ИИ-агентом в Cursor при создании/редактировании страниц проекта Muse.

---

## Быстрый старт

### Шаг 1: Выбор режима

| Режим | Когда использовать |
|-------|-------------------|
| **Ask (Plan)** | В начале — для обсуждения структуры |
| **Agent** | После согласования плана — для выполнения |

**Рекомендация:** Начните с **Ask**, согласуйте план, затем переключитесь на **Agent**.

### Шаг 2: Первое сообщение

Скопируйте шаблон, замените `[...]` на свои данные:

```
Прежде чем начать работу, ознакомься с документацией:
- @tailwind-project/AI_INSTRUCTIONS.md — правила работы
- @tailwind-project/docs/DESIGN_SYSTEM.md — компоненты и стили

Задача: [ОПИСАНИЕ ЗАДАЧИ]

Эталон: @tailwind-project/src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html

Источник контента: [URL оригинальной страницы на muse.ooo]

Важно:
- Контент (тексты, alt, title, meta) брать ТОЛЬКО с оригинала
- НЕ менять и НЕ сокращать контент без согласования
- Header и Footer вставлю сам
```

---

## Типы задач

### 1. Создание новой страницы

```
Прежде чем начать работу, ознакомься с документацией:
- @tailwind-project/AI_INSTRUCTIONS.md
- @tailwind-project/docs/DESIGN_SYSTEM.md

Создай новую страницу [НАЗВАНИЕ].

Эталон: @tailwind-project/src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html

Источник контента: https://muse.ooo/[путь]/

Важно:
- Структуру и критический CSS бери из эталона
- Контент ТОЛЬКО с оригинала muse.ooo
- Header и Footer оставь как комментарии — вставлю сам
```

### 2. Рефакторинг на чистый Tailwind CSS

Для существующих страниц используй инструкцию `PURE_TAILWIND_GUIDE.md`:

```
Следуй инструкции @tailwind-project/docs/PURE_TAILWIND_GUIDE.md

Переверстай страницу [ИМЯ_ФАЙЛА] на 100% чистый Tailwind CSS.

Страница: @tailwind-project/src/html/[путь к файлу]

СТРОГО следуй инструкции:
1. Заменить container на inline Tailwind классы
2. Video Cover → data-video-cover + Tailwind классы
3. Удалить избыточный критический CSS
4. Подключить js/nav.js
5. Добавить inline-скрипты (Video Cover, Carousel)
6. Добавить HTML кнопки "Наверх"

НЕ ТРОГАТЬ: Header, Footer, контент, изображения.
```

### 3. Приведение к дизайн-системе

```
Приведи страницу в соответствие с @tailwind-project/docs/DESIGN_SYSTEM.md

Страница: @tailwind-project/src/html/[путь к файлу]

Проверь:
- H1: text-4xl lg:text-6xl font-light
- H2: text-3xl lg:text-4xl font-light
- Breadcrumbs: чистый Tailwind (text-sm text-gray-400)
- Кнопки: inline-block px-6 py-2 bg-primary...
- Отступы секций: py-16 lg:py-24

НЕ ТРОГАТЬ контент (тексты, изображения, ссылки).
```

---

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `AI_INSTRUCTIONS.md` | Правила для ИИ-агента |
| `docs/DESIGN_SYSTEM.md` | Цвета, типографика, все компоненты |
| `docs/PURE_TAILWIND_GUIDE.md` | Инструкция по рефакторингу |
| `docs/PAGES_LIST.md` | Статус всех страниц |
| `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | Эталонная страница |

---

## Проверка после завершения

### Автоматическая проверка

```
Проверь страницу по чек-листу из AI_INSTRUCTIONS.md:
- Контент совпадает с оригиналом
- Изображения имеют все атрибуты (width, height, alt, loading)
- Кнопка "Наверх" присутствует
- Inline-скрипты добавлены (если нужны)
```

### Валидация HTML

```
Проверь страницу через W3C Validator:
https://validator.w3.org/nu/?doc=https://muse-liard-one.vercel.app/[путь]
```

---

## После завершения работы

1. ✅ Обновить `docs/PAGES_LIST.md` (статус страницы)
2. ✅ Запустить `БЫСТРЫЙ_ДЕПЛОЙ.bat` для публикации
3. ✅ Проверить на Vercel
4. ✅ При необходимости обновить `docs/DESIGN_SYSTEM.md`

---

## Частые ошибки

❌ **Не писать:**
- "Сделай страницу" (слишком общо)
- "Возьми контент откуда-нибудь" (непонятно откуда)

✅ **Писать:**
- Конкретный URL источника контента
- Ссылку на эталон или инструкцию
- Что НЕ трогать (Header, Footer, контент)

---

## Структура проекта

```
tailwind-project/
├── AI_INSTRUCTIONS.md          # Правила для ИИ
├── docs/
│   ├── DESIGN_SYSTEM.md        # Компоненты и стили
│   ├── HOW_TO_CREATE_PAGE.md   # Эта инструкция
│   ├── PAGES_LIST.md           # Статус страниц
│   ├── PURE_TAILWIND_GUIDE.md  # Рефакторинг на Tailwind
│   └── INTEGRATION_BITRIX.md   # Подготовка к Bitrix
└── src/html/
    ├── js/nav.js               # Page Navigator + Back to Top
    ├── index.html              # Главная
    ├── blog/                   # Статьи блога
    ├── info/                   # Информационные страницы
    └── portret-na-zakaz/       # Страницы портретов
        ├── style/              # 18 стилей
        └── object/             # 5 объектов
```

---

*Последнее обновление: 17 января 2026*
