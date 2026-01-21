# Инструкция: Переверстка на 100% чистый Tailwind CSS

## Область применения

Эта инструкция для страниц:
- `portret-na-zakaz/style/` — 18 страниц стилей ✅ переверстаны
- `portret-na-zakaz/object/` — 5 страниц объектов (см. дополнения ниже)

---

## Что заменить на Tailwind

### 1. Container

**Найти:**
```html
<div class="container">
```

**Заменить на:**
```html
<div class="mx-auto px-4 max-w-[1170px]">
```

На странице около 15-20 вхождений.

---

### 2. Video Cover

**Найти:**
```html
<div class="video-cover ...">
    <img ... >
    <div class="video-play-icon ...">
    <iframe class="hidden" ...>
</div>
```

**Заменить на:**
```html
<div class="group relative aspect-video rounded-lg overflow-hidden shadow-lg" data-video-cover>
    <!-- Обложка -->
    <img 
        src="..." 
        alt="..."
        class="w-full h-full object-cover group-[.video-playing]:hidden"
        loading="lazy"
    >
    
    <!-- Кнопка Play -->
    <div class="absolute inset-0 flex items-center justify-center z-10 cursor-pointer 
                bg-black/20 hover:bg-black/30 transition-colors
                group-[.video-playing]:hidden" data-play-btn>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg">
            <path d="M8 5v14l11-7z"/>
        </svg>
    </div>
    
    <!-- Видео (YouTube iframe) -->
    <iframe 
        class="absolute inset-0 w-full h-full hidden group-[.video-playing]:block"
        loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        data-src="https://www.youtube.com/embed/..."
        title="..."
    ></iframe>
</div>
```

**ВАЖНО — aspect-ratio зависит от ориентации видео:**
- Горизонтальное (YouTube стандарт) → `aspect-video` (16:9)
- Вертикальное (TikTok/Reels) → `aspect-[360/648]` или `aspect-[9/16]`

**Добавить inline скрипт перед `</body>`:**
```html
<script>
// Video Cover
document.querySelectorAll('[data-video-cover]').forEach(function(cover) {
    const playBtn = cover.querySelector('[data-play-btn]');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            cover.classList.add('video-playing');
            const iframe = cover.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src + '&autoplay=1';
            }
        });
    }
});
</script>
```

---

### 3. Breadcrumbs

**Найти:**
```html
<nav class="breadcrumbs mb-4" aria-label="Breadcrumb">
    <ol class="...">
        <li><a href="...">Главная</a><span>/</span></li>
        ...
    </ol>
</nav>
```

**Заменить на:**
```html
<nav class="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
    <ol class="flex list-none p-0">
        <li class="flex items-center">
            <a href="..." class="hover:underline">Главная</a>
            <span class="mx-2">/</span>
        </li>
        <li class="flex items-center">
            <a href="..." class="hover:underline">Портрет на заказ</a>
            <span class="mx-2">/</span>
        </li>
        <li class="text-gray-300">Название стиля</li>
    </ol>
</nav>
```

---

### 4. Timeline Divider (секция "Как заказать")

**Найти:**
```html
<div class="... timeline-divider"></div>
```

**Заменить на:**
```html
<div class="absolute left-6 top-12 bottom-12 border-l-2 border-dashed border-primary/30"></div>
```

---

### 5. Characteristics List (секция "Характеристики")

**Найти:**
```html
<ul class="space-y-2 characteristics-list">
    <li class="flex items-start gap-3 py-2">
```

**Заменить на:**
```html
<ul class="space-y-1">
    <li class="flex items-start gap-3 py-1.5 odd:bg-primary/5 odd:rounded odd:px-3 odd:-mx-3">
```

**ВАЖНО:** Класс `odd:bg-primary/5 odd:rounded odd:px-3 odd:-mx-3` должен быть на **КАЖДОМ** `<li>` в списке!

Это создаёт чередование фона: голубой → белый → голубой → белый...

---

### 6. Premium Button

**Найти:**
```html
<a class="... btn-premium">
```

**Заменить на:**
```html
<a class="... transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
```

---

### 7. Динамические даты

**Найти:**
```html
<span id="order-date"></span>
<span id="delivery-date"></span>
```

**Заменить на статические:**
```html
<span>3 января</span>
<span>6 января</span>
```

---

### 8. Before/After Slider (ba-card) — упрощение CSS

**Было ~70 строк CSS.** Упрощаем до минимума.

**CSS оставить только:**
```css
/* Before/After Slider */
.ba-card { --pos: 50%; }
.ba-card .after-image { clip-path: inset(0 0 0 var(--pos)); }
.ba-card .ba-divider { left: var(--pos); }
.ba-card .ba-handle { left: var(--pos); }
```

**HTML с Tailwind классами:**
```html
<div class="ba-card relative w-full aspect-[378/265] overflow-hidden rounded-xl shadow-2xl">
    <img class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none before-image" src="..." alt="До">
    <img class="after-image absolute inset-0 w-full h-full object-cover pointer-events-none select-none" src="..." alt="После">
    <input type="range" class="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full m-0 z-20" min="0" max="100" value="50">
    <div class="ba-divider absolute top-0 bottom-0 w-[3px] bg-white -translate-x-1/2 pointer-events-none z-10"></div>
    <div class="ba-handle absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[70px] pointer-events-none z-[15]">
        <span class="absolute top-1/2 -translate-y-1/2 left-2.5 text-2xl font-bold text-white drop-shadow-lg">‹</span>
        <span class="absolute top-1/2 -translate-y-1/2 right-2.5 text-2xl font-bold text-white drop-shadow-lg">›</span>
    </div>
</div>
```

**ВАЖНО:**
- `w-full` — ОБЯЗАТЕЛЬНО! Без него слайдер не отображается (нулевая ширина)
- `aspect-[WIDTH/HEIGHT]` — подставить реальные размеры картинок:
  - Горизонтальные → `aspect-[378/265]` или `aspect-[653/434]`
  - Вертикальные → `aspect-[360/517]`
  - Квадратные → `aspect-square` или `aspect-[378/378]` + **добавить `max-w-[400px]`** (иначе слайдер будет огромным!)

**Удалить из CSS:**
- Все `.ba-card img`, `.ba-card .ba-range`, `.ba-card .ba-divider` (кроме `left: var(--pos)`)
- `.ba-card .ba-handle` стили (кроме `left: var(--pos)`)
- `.ba-card .ba-arrow` — заменены на inline стрелки
- Комментарии "ИЗМЕНЕНИЕ:" — убрать

---

### 9. Back to Top — ОБЯЗАТЕЛЬНО добавить HTML

**БЕЗ ЭТОГО ЭЛЕМЕНТА `nav.js` НЕ РАБОТАЕТ ПОЛНОСТЬЮ!**

**Добавить перед `<header>`:**
```html
<!-- Back to Top Button -->
<a href="#" id="back-to-top" 
   class="hidden md:flex fixed bottom-5 right-5 w-12 h-12 items-center justify-center 
          rounded-full bg-white text-dark hover:bg-dark hover:text-white 
          border border-gray-300 hover:border-dark transition-colors 
          z-50 opacity-0 pointer-events-none" 
   aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</a>
```

Кнопка работает автоматически через `nav.js` — появляется при скролле вниз.

---

## Что НЕ трогать (CSS компоненты)

Эти компоненты оставить в `<style>` (нет дублирования с Tailwind):

| Компонент | Причина |
|-----------|---------|
| `.page-navigator` | Сложные анимации, `data-title` tooltip, `::before`, hover scale |
| `.ba-card` (4 строки) | CSS переменная `--pos`, `clip-path` |
| `.canvas-3d` | 3D эффект с `box-shadow` и `--depth` |
| `.carousel-scroll` | Скрытие скроллбара, snap |

---

## НИЧЕГО БОЛЬШЕ НЕ МЕНЯТЬ

Кроме указанных выше пунктов, **НЕ трогать**:

- Контент (тексты, изображения, ссылки, alt-тексты)
- Структуру HTML (порядок секций, вложенность элементов)
- Существующие Tailwind классы в HTML
- Header и Footer
- Модальные окна (`<dialog>`, `<el-dialog>`)
- Structured Data (JSON-LD скрипты в `<head>`)
- Meta-теги в `<head>`
- Tailwind Plus Elements (`<el-tab-group>`, `<el-dialog-panel>` и т.д.)
- Preload ссылки
- CDN подключения (Tailwind, Tailwind Plus Elements)

---

## Удалить из критического CSS

После замены удалить из первого `<style>` блока:

- `.container` и все media queries для него
- `.breadcrumbs`, `.breadcrumbs a`, `.breadcrumbs a:hover`
- `.flex-shrink-0`, `.relative`, `.overflow-hidden`, `.inline-block`
- `.flex`, `.items-center`, `.text-white`, `.bg-primary`
- `.rounded`, `.uppercase`, `.transition-colors`
- `.description-grid`, `.video-column`, `.text-column`
- `h1` стили — использовать `text-4xl lg:text-6xl font-light`
- `.text-xl` — использовать Tailwind класс

Удалить из второго `<style>` блока:

- `.video-cover`, `.video-play-icon`, `.video-playing`
- `.btn-premium`
- `.timeline-divider`
- `.characteristics-list`

---

## Минимальный критический CSS

Оставить только:

```css
/* CSS переменные */
:root {
    --primary: #4A90E2;
    --primary-hover: #609DE6;
    --dark: #252525;
    --body: #666666;
}

/* Body */
body { 
    background-color: #fff; 
    color: #666; 
    overflow-x: hidden; 
}

/* SR-only (accessibility) */
.sr-only { 
    position: absolute; 
    width: 1px; height: 1px; 
    padding: 0; margin: -1px; 
    overflow: hidden; 
    clip: rect(0,0,0,0); 
    border: 0; 
}
```

Плюс компоненты которые оставляем:

**Page Navigator** (с hover scale эффектом):
```css
.page-navigator { position: fixed; top: 50%; transform: translateY(-50%); right: 1.85714286em; z-index: 9999; }
.page-navigator ul { display: inline-block; padding: 0.92857143em; background: rgba(0, 0, 0, 0.4); border-radius: 1.85714286em; }
.page-navigator ul:hover { background: rgba(0, 0, 0, 0.6); }
.page-navigator ul li { list-style: none; }
.page-navigator ul li:not(:last-child) { margin-bottom: 1.85714286em; }
@media (max-width: 1023px) { .page-navigator { display: none !important; } }
.page-navigator li a { width: 8px; height: 8px; background: #fff; border-radius: 50%; transition: all 0.3s ease; display: block; position: relative; opacity: 0.5; }
.page-navigator li a:hover, .page-navigator li a.inner-link--active { opacity: 1; }
.page-navigator li a[data-title]:before { content: attr(data-title); position: absolute; right: 12px; top: -14px; background: #222; color: #fff; border-radius: 6px; padding: 4px 8px; display: inline-block; white-space: nowrap; font-size: 12px; opacity: 0; transition: all 0.2s ease; }
.page-navigator li a[data-title]:hover:before { opacity: 1; }
.page-navigator li a:hover { transform: scale(1.5); }
```

**ba-card** (только 4 строки):
```css
.ba-card { --pos: 50%; }
.ba-card .after-image { clip-path: inset(0 0 0 var(--pos)); }
.ba-card .ba-divider { left: var(--pos); }
.ba-card .ba-handle { left: var(--pos); }
```

**canvas-3d:**
```css
.canvas-3d { --depth: 30px; position: relative; box-shadow: var(--depth) var(--depth) 50px rgba(0,0,0,0.4); transition: transform 0.3s ease; }
.canvas-3d:hover { transform: translate(-5px, -5px); }
```

**carousel-scroll:**
```css
.carousel-scroll { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
.carousel-scroll::-webkit-scrollbar { display: none; }
```

---

## Подключение скриптов

Перед `</body>`:

```html
<!-- Navigation Scripts -->
<script src="../../js/nav.js"></script>

<!-- Video Cover -->
<script>
document.querySelectorAll('[data-video-cover]').forEach(function(cover) {
    const playBtn = cover.querySelector('[data-play-btn]');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            cover.classList.add('video-playing');
            const iframe = cover.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                iframe.src = iframe.dataset.src + '&autoplay=1';
            }
        });
    }
});
</script>

<!-- Carousel Scroll (drag + wheel + защита от случайного клика) -->
<script>
document.querySelectorAll('.carousel-scroll').forEach(function(carousel) {
    // Прокрутка колесиком мыши
    carousel.addEventListener('wheel', function(e) {
        if (window.innerWidth < 1024) return;
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            e.preventDefault();
            carousel.scrollBy({ left: e.deltaY * 0.6, behavior: 'auto' });
        }
    }, { passive: false });
    
    // Drag-to-scroll с защитой от случайного клика
    var isDown = false, startX, startScrollLeft, hasMoved = false, clickBlocked = false;
    var DRAG_THRESHOLD = 5;
    carousel.style.cursor = 'grab';
    
    carousel.addEventListener('mousedown', function(e) {
        if (window.innerWidth < 1024) return;
        isDown = true;
        hasMoved = false;
        clickBlocked = false;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDown || window.innerWidth < 1024) return;
        e.preventDefault();
        var moveDistance = Math.abs(e.pageX - startX);
        if (moveDistance > DRAG_THRESHOLD) {
            hasMoved = true;
            clickBlocked = true;
        }
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX) * 1.2;
    });
    
    // Блокировка клика после перетаскивания
    carousel.addEventListener('click', function(e) {
        if (clickBlocked && window.innerWidth >= 1024) {
            e.preventDefault();
            e.stopPropagation();
            clickBlocked = false;
        }
    }, true);
    
    carousel.addEventListener('mouseup', function() {
        isDown = false;
        carousel.style.cursor = 'grab';
        if (hasMoved) {
            clickBlocked = true;
            setTimeout(function() { clickBlocked = false; }, 100);
        }
    });
    
    carousel.addEventListener('mouseleave', function() {
        if (isDown) {
            isDown = false;
            hasMoved = false;
            carousel.style.cursor = 'grab';
        }
    });
});
</script>
</body>
```

**Путь к nav.js для страниц стилей:** `../../js/nav.js`

(страницы в `portret-na-zakaz/style/` и `object/` → выход на 2 уровня вверх → `js/nav.js`)

---

## Дополнения для страниц object/

Страницы `portret-na-zakaz/object/` (5 шт) имеют БОЛЬШЕ кастомного CSS. Дополнительно к основным правилам:

### Удалить из критического CSS:

**Базовые утилиты (дублируют Tailwind):**
```css
/* УДАЛИТЬ: */
.flex-shrink-0 { ... }
.relative { ... }
.overflow-hidden { ... }
.inline-block { ... }
.flex { ... }
.items-center { ... }
.text-white { ... }
.bg-primary { ... }
.rounded { ... }
.uppercase { ... }
.transition-colors { ... }
```

**Стили компонентов:**
```css
/* УДАЛИТЬ: */
.breadcrumbs { ... }
.breadcrumbs a { ... }
.breadcrumbs a:hover { ... }
h1 { ... }
.text-xl { ... }
header.bg-dark { ... }
header.sticky { ... }
header nav { ... }
```

### Оставить в CSS:

```css
/* ОСТАВИТЬ: */
:root { --primary: ...; }     /* CSS переменные */
body { ... }                   /* Базовые стили body */
.sr-only { ... }              /* Accessibility */
.page-navigator { ... }       /* Навигация */
.carousel-scroll { ... }      /* Карусель */
.canvas-3d { ... }            /* 3D эффект */

/* Ken Burns (анимация для hero) */
@keyframes kenburns { ... }
.ken-burns-img { ... }
```

### Video Cover — СТАРЫЙ формат

На object/ страницах video-cover использует **class**, а не **data-атрибут**:

**Найти:**
```html
<div class="video-cover aspect-video ...">
```

**Заменить на:**
```html
<div class="group relative aspect-video rounded-lg overflow-hidden shadow-lg" data-video-cover>
```

И применить ту же структуру что в секции "2. Video Cover".

### Carousel с видео

На object/ страницах есть carousel с 6-7 видео примерами. Каждое видео — это video-cover.
Все video-cover в carousel заменить по тому же принципу.

---

## Проверка после переверстки

**Обязательные элементы:**
- [ ] Back to Top — кнопка есть в HTML и появляется при скролле
- [ ] Before/After слайдер — отображается и работает (линия двигается)
- [ ] Video Cover — правильная ориентация (горизонтальное/вертикальное)
- [ ] Характеристики — чередование фона (голубой/белый)

**Адаптивность:**
- [ ] Desktop (1920px, 1440px, 1170px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

**Функционал:**
- [ ] Hover-эффекты на кнопках
- [ ] Video Cover — клик запускает видео
- [ ] Page Navigator — подсветка активной секции

---

**Последнее обновление:** 17 января 2026 (v5 — добавлена защита от случайного клика в Carousel)
