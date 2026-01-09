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

## Порядок создания страницы (по этапам)

### Этап 1: Создание каркаса (ИИ)

1. **Создать пустой файл** с `<head>` (meta, title, description, критический CSS)

2. **Добавить placeholder'ы для header и footer:**
```html
<!-- ================================================== -->
<!-- HEADER: Скопируйте из эталона                      -->
<!-- Файл: portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html -->
<!-- Строки: 171-270                                    -->
<!-- ================================================== -->

<!-- ================================================== -->
<!-- КОНТЕНТ СТРАНИЦЫ: будет добавлен после вставки     -->
<!-- header и footer                                    -->
<!-- ================================================== -->

<!-- ================================================== -->
<!-- FOOTER: Скопируйте из эталона                      -->
<!-- Файл: portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html -->
<!-- Строки: 1234-1324                                  -->
<!-- ================================================== -->
```

3. **НЕ добавлять контент** на этом этапе — только каркас

### Этап 2: Вставка header и footer (пользователь)

- [ ] Вставить header из эталона (строки 171-270)
- [ ] Вставить footer из эталона (строки 1234-1324)
- [ ] Сообщить ИИ о готовности

### Этап 3: Добавление контента (ИИ)

После того как пользователь вставил header и footer:

1. **Создать `<main>`** с уникальным контентом страницы
2. **Для SVG иконок** использовать заглушки (пользователь вставит вручную):
```html
<!-- SVG: [название иконки] — вставьте иконку сюда -->
<div class="w-10 h-10 mx-auto mb-4 text-primary">
    <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <text x="12" y="16" text-anchor="middle" font-size="8">SVG</text>
    </svg>
</div>
```
3. **Блок "Акция" (Promo Banner)** — брать 1:1 из эталонной страницы без изменений
4. **Добавить JS-скрипты** (если есть уникальные для страницы)
5. **НЕ добавлять JSON-LD** на этом этапе
6. **Калькулятор и отзывы** — пропустить (не переписывать)

### Этап 4: Финальные правки (пользователь)

- [ ] Вставить SVG иконки (где есть заглушки)

### Этап 5: Проверка и тестирование

- Проверить страницу в браузере
- Исправить ошибки вёрстки
- Проверить адаптивность (мобильные, планшеты, десктоп)

### Этап 6: JSON-LD (после финализации)

**Только после утверждения контента:**
- Добавить структурированные данные Schema.org
- Проверить через [Google Rich Results Test](https://search.google.com/test/rich-results)

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

### LCP-изображение (Largest Contentful Paint)

Для **первого большого изображения** в viewport (обычно hero или первая секция) — это LCP-элемент, влияющий на Core Web Vitals:

```html
<img
  src="https://muse.ooo/upload/imgsite/image-952-535.webp"
  srcset="
    https://muse.ooo/upload/imgsite/image-400-225.webp 400w,
    https://muse.ooo/upload/imgsite/image-600-337.webp 600w,
    https://muse.ooo/upload/imgsite/image-786-442.webp 786w,
    https://muse.ooo/upload/imgsite/image-828-465.webp 828w,
    https://muse.ooo/upload/imgsite/image-952-535.webp 952w"
  sizes="(max-width: 767px) 100vw, 50vw"
  width="952"
  height="535"
  alt="Описание"
  loading="eager"
  decoding="async"
  fetchpriority="high"
  class="..."
>
```

**Атрибуты для LCP:**
- `fetchpriority="high"` — приоритет загрузки (рекомендация PageSpeed Insights)
- `loading="eager"` — без отложенной загрузки (или просто не указывать `loading`)
- `srcset` + `sizes` — адаптивные изображения для разных экранов

**Когда использовать `fetchpriority="high"`:**
- Только для 1-2 самых важных изображений (LCP)
- Hero-изображения
- Первое изображение в блоках «полэкрана»

**НЕ использовать `fetchpriority="high"` для:**
- Изображений ниже первого экрана
- Каруселей
- Галерей

**`fetchpriority="low"`** — для больших изображений ниже первого экрана (экономит ресурсы):
```html
<img
  src="..."
  srcset="..."
  sizes="..."
  loading="lazy"
  decoding="async"
  fetchpriority="low"
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

### Модальное окно для видео (карусель коротких историй)
Для карусели видео с модальным окном добавляй:
- **Свайп на мобильных** (вверх/вниз как в соцсетях)
- Клавиатурную навигацию (стрелки, Escape)
- Закрытие по клику на фон

```javascript
// Touch swipe для мобильных
let touchStartY = 0;
let touchEndY = 0;

videoModal?.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

videoModal?.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            nextVideo(); // свайп вверх → следующее
        } else {
            prevVideo(); // свайп вниз → предыдущее
        }
    }
}, { passive: true });
```

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

### Стрелки в ссылках
Добавляй стрелки для визуальной индикации направления:

**Внутри страницы (якоря)** — стрелка по направлению к блоку:
```html
<!-- Ссылка вверх страницы -->
<a href="#calc" class="text-primary underline hover:no-underline">онлайн-калькуляторе ↑</a>

<!-- Ссылка вниз страницы -->
<a href="#reviews" class="text-primary underline hover:no-underline">отзывы клиентов ↓</a>
```

**Внешние ссылки** — стрелка вбок (открывается в новой вкладке):
```html
<a href="https://muse.ooo/..." class="text-primary underline hover:no-underline">
    фото на холсте ↗
</a>
```

**Символы:**
- `↑` — вверх по странице (U+2191)
- `↓` — вниз по странице (U+2193)
- `↗` — внешняя ссылка (U+2197)

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

### Обязательные элементы (ИИ)
- [ ] Добавлен `<meta name="robots" content="noindex, nofollow">`
- [ ] Использован `container` для контейнера (не `max-w-7xl`)
- [ ] Добавлены placeholder'ы для Header и Footer (НЕ сам код!)
- [ ] Добавлены заглушки для SVG иконок
- [ ] Используются стандартные брейкпоинты Tailwind
- [ ] JSON-LD НЕ добавлен (будет на Этапе 4)

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
- [ ] LCP-изображение имеет `fetchpriority="high"` и `srcset` (если доступны нарезки)

### Интерактивные элементы
- [ ] Карусели работают (прокрутка на ПК, свайп на мобильных)
- [ ] Видео воспроизводится (клик по обложке)
- [ ] FAQ открывается/закрывается
- [ ] Кнопка "Наверх" появляется при скролле (обязательна на всех страницах!)

---

## Стандарты компонентов

### Карусели (примеры работ, стили)
- **`gap-0`** для каруселей с изображениями (примеры работ, галереи, стили)
- **БЕЗ `rounded-lg`** — изображения в каруселях без закруглений (как в эталоне)
- Карусели должны быть горизонтально прокручиваемыми
- Использовать `carousel-scroll` и `snap-center`

```html
<div class="carousel-scroll flex gap-0 px-4 min-w-max">
    <div class="flex-shrink-0 snap-center">
        <img src="..." alt="..." class=""><!-- БЕЗ rounded-lg -->
    </div>
</div>
```

### Кнопка Play для видео
Используй стандартную кнопку из эталона (SVG без круглого фона):

```html
<div class="video-play-icon absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/20 hover:bg-black/30 transition-colors">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg">
        <path d="M8 5v14l11-7z"/>
    </svg>
</div>
```

### Кнопка "Наверх"
**Обязательна на всех страницах!** Добавляй перед `<footer>`:

```html
<a href="#" id="back-to-top" class="hidden md:flex fixed bottom-5 right-5 w-12 h-12 items-center justify-center rounded-full bg-white text-dark hover:bg-dark hover:text-white border border-gray-300 hover:border-dark transition-colors z-50 opacity-0 pointer-events-none" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</a>
```

Добавь JS для показа/скрытия в блок `DOMContentLoaded`:

```javascript
const backToTopButton = document.getElementById('back-to-top');

function toggleBackToTop() {
    if (backToTopButton) {
        if (window.scrollY > 300 && window.innerWidth >= 768) {
            backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
            backToTopButton.classList.add('opacity-100');
        } else {
            backToTopButton.classList.add('opacity-0', 'pointer-events-none');
            backToTopButton.classList.remove('opacity-100');
        }
    }
}

if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', toggleBackToTop);
window.addEventListener('resize', toggleBackToTop);
```

### Секция "Преимущества"
- Заголовок карточки — по центру (`text-center`)
- Иконка — по центру (`mx-auto`)
- Текст описания — по **левому краю** (без `text-center`)

```html
<div class="bg-white rounded-lg shadow-xl p-8">
    <h3 class="text-xl font-medium text-dark mb-4 text-center">Заголовок</h3>
    <div class="w-10 h-10 mx-auto mb-4 text-primary"><!-- SVG --></div>
    <p class="text-body">Текст по левому краю...</p>
</div>
```

### Галочки в списках (на тёмном фоне)
Используй SVG для надёжного отображения белых галочек:

```html
<li class="flex items-start gap-2">
    <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
    </svg>
    <span>Текст пункта</span>
</li>
```

**Почему SVG:**
- Emoji (✔) может рендериться цветным (зелёным) на некоторых платформах
- SVG даёт 100% контроль над цветом через `text-white` / `currentColor`
- Одинаково отображается на всех устройствах

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

## Футер — единый стандарт

**Актуальный футер:** взять из `info.html` (строки 1276-1456)

Все 3 страницы проекта используют единый футер:
- `index.html`
- `portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html`
- `pechat-na-kholste-sankt-peterburg.html`
- `info.html`

### Иконки соцсетей в футере
Используются SVG из [Simple Icons](https://simpleicons.org/) для единообразия:
- WhatsApp
- VK (ВКонтакте)
- YouTube
- Pinterest  
- Telegram

```html
<div class="flex gap-4">
    <a href="https://wa.me/..." aria-label="WhatsApp" class="text-gray-400 hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><!-- Simple Icons WhatsApp --></svg>
    </a>
    <!-- Аналогично для остальных -->
</div>
```

---

## TODO: Оптимизация (на будущее)

### Изображения для оптимизации
| Изображение | Проблема | Решение |
|-------------|----------|---------|
| `pavlosk-office.webp` | 2500×1645 (281 KiB), LCP | Создать версии 1600w, 1200w, 800w на сервере |

**Когда:** при интеграции с Bitrix или переносе на продакшен

---

## Вопросы?

Если что-то непонятно — спроси пользователя перед началом работы.

