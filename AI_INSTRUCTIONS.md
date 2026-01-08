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

- `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` — **ЭТАЛОН** (портреты СПб)
- `src/html/index.html` — Главная (нужно переделать на основе эталона)
- `src/html/pechat-na-kholste-sankt-peterburg.html` — Печать (нужно переделать на основе эталона)

**Важно:** Эталонная страница использует Tailwind CDN для разработки. При создании новых страниц на основе эталона используй скомпилированный CSS (`output.css`).

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

**Основа:** Все новые страницы создавай на основе эталонной страницы `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`

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
    
    <!-- Скомпилированный Tailwind CSS (для продакшена) -->
    <link rel="stylesheet" href="css/output.css">
    
    <!-- Примечание: Эталон использует CDN для разработки, но для новых страниц используй output.css -->
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
- Количество элементов (изображений, FAQ-вопросов, примеров в каруселях)

**Если нужны изменения в тексте:**
1. Сначала СПРОСИ пользователя
2. Покажи, что хочешь изменить
3. Дождись подтверждения
4. Только потом вноси изменения

**⚠️ ОБЯЗАТЕЛЬНО предупреждать пользователя:**
- Если что-то урезаешь или пропускаешь (изображения, элементы списка, секции)
- Если количество элементов в оригинале и в новой версии отличается
- Если не хватает данных для полного переноса контента

---

## Изображения

Для всех `<img>` указывать:
- Формат `.webp` (если доступен)
- `width` и `height` (реальные размеры изображения в пикселях)
- `loading="lazy"` — **НЕ добавлять** для:
  - Первый экран (hero секция)
  - Изображения, видимые сразу при загрузке (above the fold)
- `decoding="async"` (рекомендуется для всех изображений)
- `alt` (обязательно, из оригинала, НЕ сокращать!)
- `title` (если есть в оригинале — НЕ удалять!)

**Пример:**
```html
<img
  src="https://muse.ooo/upload/img/example.webp"
  width="223"
  height="297"
  alt="Полное описание из оригинала"
  title="Название"
  loading="lazy"
  decoding="async"
  class="..."
>
```

**Для первого экрана (без lazy loading):**
```html
<img
  src="https://muse.ooo/upload/img/hero.webp"
  width="1920"
  height="1080"
  alt="Описание"
  decoding="async"
  class="..."
>
```

---

## Видео

### Общие правила для всех `<video>`
- `preload="none"` — не загружать до воспроизведения (экономит трафик)
- `playsinline` — для корректного воспроизведения на iOS
- `title` — для accessibility
- **НЕ использовать:**
  - `webkit-playsinline` — устаревший атрибут (ошибка валидации)
  - `loading="lazy"` — не стандартный атрибут для video (ошибка валидации)

### Видео, скрытое на мобильных (Hero с фоновым видео)
```html
<video 
  class="... hidden lg:block" 
  autoplay loop muted playsinline 
  preload="none"
  title="Описание видео"
>
  <source src="video.webm" media="(min-width: 1024px)" type="video/webm">
  <source src="video.mp4" media="(min-width: 1024px)" type="video/mp4">
</video>
```
- `hidden lg:block` — скрыть на мобильных через CSS
- `media="(min-width: 1024px)"` — в каждом `<source>` для предотвращения загрузки на мобильных
- `preload="none"` — не загружать пока не виден

### Видео с ручным запуском (по клику на обложку)
```html
<video 
  title="Описание видео"
  preload="none"
  controls
  playsinline
  class="hidden w-full"
>
  <source src="video.webm" type="video/webm">
</video>
```
- `preload="none"` — не загружать до клика пользователя
- `controls` — показать элементы управления
- Обложка отдельным `<img>` поверх video

---

## Accessibility (доступность)

### Формы
Все поля форм должны иметь связанные `<label>`:

```html
<!-- Для select — видимый label -->
<label for="calc-style" class="text-sm font-medium text-dark">Стиль</label>
<select id="calc-style">...</select>

<!-- Для input с placeholder — скрытый label -->
<label for="calc-name" class="sr-only">Имя</label>
<input type="text" id="calc-name" placeholder="Имя*">
```

**Класс `sr-only`** (screen reader only) — скрывает визуально, но доступен для screen readers.
Этот класс уже есть в критическом CSS эталонной страницы.

### Ссылки в тексте
Ссылки должны быть различимы не только по цвету:

```html
<!-- Правильно: постоянное подчёркивание -->
<a href="..." class="text-primary underline hover:no-underline">ссылка</a>

<!-- Неправильно: подчёркивание только при наведении -->
<a href="..." class="text-primary hover:underline">ссылка</a>
```

### Иконки-ссылки
Добавлять `aria-label` для ссылок без текста:

```html
<a href="..." aria-label="WhatsApp">
    <svg>...</svg>
</a>
```

---

## SEO-элементы (обязательные)

- `<title>` — без суффиксов типа "(Tailwind Test)", точно как в оригинале
- `<meta name="description">` — полный текст из оригинала, не сокращать
- `og:image` — добавить при интеграции с Bitrix (пока не обязательно)
- `canonical` — добавить при интеграции с Bitrix (пока не обязательно)

---

## Чек-лист перед сохранением

### Обязательные элементы
- [ ] Добавлен `<meta name="robots" content="noindex, nofollow">`
- [ ] Использован `container` для контейнера (не `max-w-7xl`)
- [ ] Header и Footer взяты из компонентов
- [ ] Добавлена кнопка "Наверх"
- [ ] Используются стандартные брейкпоинты Tailwind

### Контент (сравнить с оригиналом)
- [ ] Все `alt`-атрибуты совпадают с оригиналом (не сокращены!)
- [ ] Все `title`-атрибуты совпадают с оригиналом
- [ ] Все тексты совпадают с оригиналом (FAQ, описания, заголовки)
- [ ] Количество элементов совпадает (преимуществ, FAQ-вопросов, примеров в карусели)
- [ ] Meta description полный (не урезан)

### Изображения
- [ ] Все изображения имеют `width` и `height`
- [ ] Все изображения имеют `loading="lazy"` (кроме первого экрана)
- [ ] Все изображения имеют `decoding="async"`

### Интерактивные элементы
- [ ] Карусели работают (прокрутка на ПК, свайп на мобильных)
- [ ] Видео воспроизводится (клик по обложке)
- [ ] FAQ открывается/закрывается
- [ ] Кнопка "Наверх" появляется при скролле

### Валидация HTML
- [ ] Проверена страница через [W3C Validator](https://validator.w3.org/nu/)
  - Использовать URL: `https://muse-liard-one.vercel.app/[путь-к-странице]`
  - Проверить на наличие ошибок (Errors)
  - Исправить критические ошибки (невалидные атрибуты, неправильная структура)
  - Предупреждения (Warnings) можно оставить, если они не критичны

---

## После создания страницы

1. Проверь страницу по чек-листу выше
2. Добавь путь к странице в `PROJECT.md` (раздел "Текущий статус")
3. Обнови `docs/PAGES_LIST.md` (измени статус страницы)
4. Запусти `БЫСТРЫЙ_ДЕПЛОЙ.bat` для публикации

---

## Эталонная страница

**Эталон:** `src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`

- Используй её как основу для всех новых страниц
- Эталон использует Tailwind CDN для разработки — это нормально
- При создании новой страницы на основе эталона замени CDN на `<link rel="stylesheet" href="css/output.css">`
- Сохраняй структуру, классы и подход эталона

**Полный список страниц:** см. [docs/PAGES_LIST.md](docs/PAGES_LIST.md)  
**Уроки проекта:** см. [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md)

---

## Вопросы?

Если что-то непонятно — спроси пользователя перед началом работы.

