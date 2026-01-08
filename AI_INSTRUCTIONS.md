# Инструкция для ИИ-агента

**Прочитай этот файл ПЕРЕД созданием новой страницы!**

---

## Цель проекта

Переверстать сайт **muse.ooo** с Bootstrap 3 (тема Stack) на Tailwind CSS.
- Сохранить визуальный стиль оригинала
- Создать статические HTML страницы
- Использовать готовые компоненты из дизайн-системы

---

## Перед началом работы

### 1. Изучи эти файлы:

| Файл | Что содержит |
|------|--------------|
| `PROJECT.md` | Общее описание проекта |
| `docs/DESIGN_SYSTEM.md` | Цвета, шрифты, отступы |
| `docs/COMPONENTS.md` | Каталог компонентов |
| `docs/HOW_TO_CREATE_PAGE.md` | Как создать страницу |

### 2. Посмотри готовые страницы:

- `src/html/index.html` — Главная
- `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` — Портреты
- `src/html/pechat-na-kholste-sankt-peterburg.html` — Печать

---

## Технические требования

### Брейкпоинты (стандартные Tailwind)

```
sm  = 640px   (мобильные горизонтально)
md  = 768px   (планшеты)
lg  = 1024px  (ноутбуки)
xl  = 1280px  (большие мониторы)
2xl = 1536px  (очень большие)
```

### Контейнер

```html
<div class="container">...</div>
```
- Максимальная ширина: 1170px
- Padding: 15px

### Защита от индексации

**ОБЯЗАТЕЛЬНО** добавь в `<head>` каждой новой страницы:

```html
<!-- Закрыто от индексации во время разработки -->
<meta name="robots" content="noindex, nofollow">
```

---

## Структура страницы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[ЗАГОЛОВОК] - Muse</title>
    <meta name="description" content="[ОПИСАНИЕ]">
    
    <!-- Закрыто от индексации во время разработки -->
    <meta name="robots" content="noindex, nofollow">
    
    <link rel="stylesheet" href="css/output.css">
</head>
<body class="bg-white text-body">
    
    <!-- Header из src/components/header/header.html -->
    <header>...</header>
    
    <!-- Контент страницы -->
    <main>
        <!-- Секции -->
    </main>
    
    <!-- Footer из src/components/footer/footer.html -->
    <footer>...</footer>
    
    <!-- Кнопка "Наверх" из src/components/navigation/back-to-top.html -->
    
</body>
</html>
```

---

## Компоненты (копируй из src/components/)

| Компонент | Файл |
|-----------|------|
| Шапка | `header/header.html` |
| Футер | `footer/footer.html` |
| Hero с видео | `sections/hero-video.html` |
| Hero с изображением | `sections/hero-image.html` |
| Преимущества | `sections/advantages.html` |
| FAQ аккордеон | `sections/faq-accordion.html` |
| CTA блок | `sections/cta.html` |
| Промо-баннер | `sections/promo-banner.html` |
| Карусель | `sections/carousel.html` |
| Навигатор сбоку | `navigation/in-page-navigator.html` |
| Кнопка "Наверх" | `navigation/back-to-top.html` |
| Хлебные крошки | `navigation/breadcrumbs.html` |

---

## Цвета

```
primary   = #4A90E2  (синий)
dark      = #252525  (тёмный)
secondary = #FAFAFA  (светлый фон)
body      = #666666  (текст)
```

---

## ⚠️ Правила работы с контентом

**ЗАПРЕЩЕНО изменять без согласования:**
- Текстовый контент (FAQ, описания, заголовки)
- Alt-атрибуты изображений
- Title-атрибуты
- Meta description и title
- Любой SEO-контент

**Если нужны изменения в тексте:**
1. Сначала СПРОСИ пользователя
2. Покажи, что хочешь изменить
3. Дождись подтверждения
4. Только потом вноси изменения

---

## Чек-лист перед сохранением

- [ ] Добавлен `<meta name="robots" content="noindex, nofollow">`
- [ ] Использован `container` для контейнера (не `max-w-7xl`)
- [ ] Header и Footer взяты из компонентов
- [ ] Добавлена кнопка "Наверх"
- [ ] Используются стандартные брейкпоинты Tailwind

---

## После создания страницы

1. Добавь путь к странице в `PROJECT.md` (раздел "Текущий статус")
2. Запусти `БЫСТРЫЙ_ДЕПЛОЙ.bat` для публикации

---

## Вопросы?

Если что-то непонятно — спроси пользователя перед началом работы.

