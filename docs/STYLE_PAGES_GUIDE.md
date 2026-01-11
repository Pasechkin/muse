# Инструкция по переверстке страниц стилей портретов

> **Эталон:** `tailwind-project/src/html/portret-maslom.html`  
> **Оригинал:** `portret-na-zakaz/portret-maslom/index.php` → [muse.ooo/portret-na-zakaz/portret-maslom/](https://muse.ooo/portret-na-zakaz/portret-maslom/)

Этот документ описывает процесс переверстки 18 страниц стилей портретов с Bootstrap 3 + Bitrix на Tailwind CSS.

---

## Содержание

1. [Список страниц для переверстки](#1-список-страниц-для-переверстки)
2. [Структура страницы](#2-структура-страницы)
3. [Элементы `<head>`](#3-элементы-head)
4. [Критический CSS](#4-критический-css)
5. [JSON-LD структурированные данные](#5-json-ld-структурированные-данные)
6. [Секции: детали реализации](#6-секции-детали-реализации)
7. [Правила работы с контентом](#7-правила-работы-с-контентом)
8. [JavaScript](#8-javascript)
9. [Accessibility (доступность)](#9-accessibility-доступность)
10. [Чек-лист перед завершением](#10-чек-лист-перед-завершением)
11. [Что заменять в каждом стиле](#11-что-заменять-в-каждом-стиле)

---

## 1. Список страниц для переверстки

| # | Стиль | Slug | Статус |
|---|-------|------|--------|
| 1 | Маслом | `portret-maslom` | ✅ Эталон |
| 2 | Акварель | `portret-akvarelyu` | ⏳ |
| 3 | Бьюти | `portret-byuti` | ⏳ |
| 4 | В образе | `portret-v-obraze` | ⏳ |
| 5 | Детский | `detskij-portret` | ⏳ |
| 6 | Гранж | `portret-granzh` | ⏳ |
| 7 | Граффити | `portret-graffiti` | ⏳ |
| 8 | Дрим-арт | `portret-drim-art` | ⏳ |
| 9 | Женский | `zhenskij-portret` | ⏳ |
| 10 | Из слов | `portret-iz-slov` | ⏳ |
| 11 | Карандаш | `portret-karandashom` | ⏳ |
| 12 | Комикс | `portret-komiks` | ⏳ |
| 13 | Мужской | `muzhskoj-portret` | ⏳ |
| 14 | Лоу-поли | `portret-lou-poli` | ⏳ |
| 15 | Мозаика | `portret-mozaika` | ⏳ |
| 16 | Парный | `parnyj-portret` | ⏳ |
| 17 | Поп-арт | `portret-pop-art` | ⏳ |
| 18 | Фэнтези | `portret-fentezi` | ⏳ |

> **Примечание:** Шарж, Семейный, Flower, Love is..., WPAP — это подстили или отдельные страницы, уточнить при необходимости.

---

## 2. Структура страницы

### 2.1 Секции страницы (порядок сверху вниз)

| # | Секция | ID | Фон | Примечание |
|---|--------|-----|-----|------------|
| 1 | **Hero** | — | `bg-dark` (чёрный) | H1, хлебные крошки, цена, кнопка, изображение |
| 2 | **Примеры** | `#primery` | `bg-dark` (чёрный) | Галерея из Bitrix (заглушка) |
| 3 | **Promo Banner** | — | `bg-primary` (голубой) | Текст акции |
| 4 | **Цена** | `#calc` | белый | Калькулятор из Bitrix (заглушка) |
| 5 | **Как заказать** | `#kak-zakazat` | белый | 5 шагов + изображение |
| 6 | **Характеристики** | `#harakteristiki` | белый | Слайдер + список |
| 7 | **Преимущества** | `#preimushchestva` | `bg-primary` (голубой) | 6 карточек с иконками |
| 8 | **Отзывы** | `#otzyvy` | `bg-secondary` (серый) | Заглушка + модалка |
| 9 | **Описание** | `#opisanie` | белый | Видео + До/После + текст |
| 10 | **CTA** | — | `bg-dark` (чёрный) | Призыв к действию |
| 11 | **Footer** | — | `bg-dark` (чёрный) | Меню, соцсети, контакты |

### 2.2 Цвета фонов

```
bg-dark      = #252525 (чёрный)
bg-primary   = #4A90E2 (голубой)
bg-secondary = #FAFAFA (светло-серый)
белый        = #FFFFFF
```

---

## 3. Элементы `<head>`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Название стиля] на холсте с фотографии — заказать в Muse</title>
    <meta name="description" content="[Описание из оригинала]">
    
    <!-- Закрыто от индексации во время разработки -->
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Критический CSS -->
    <style>/* см. раздел 4 */</style>
    
    <!-- Preload Hero изображения (ускоряет LCP) -->
    <link rel="preload" as="image" href="https://muse.ooo/upload/img/[hero-image].webp" fetchpriority="high">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                container: {
                    center: true,
                    padding: '1rem',
                    screens: { '2xl': '1170px' }
                },
                extend: {
                    colors: {
                        primary: '#4A90E2',
                        'primary-hover': '#609DE6',
                        dark: '#252525',
                        body: '#666666',
                        secondary: '#FAFAFA',
                    }
                }
            }
        }
    </script>
    
    <!-- Tailwind Plus Elements (для слайдеров) -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1"></script>
    
    <!-- Дополнительные стили компонентов -->
    <style>/* Page Navigator, Carousel, Video Cover, Before/After */</style>

    <!-- JSON-LD: Product -->
    <script type="application/ld+json">/* см. раздел 5 */</script>

    <!-- JSON-LD: BreadcrumbList -->
    <script type="application/ld+json">/* см. раздел 5 */</script>
</head>
```

---

## 4. Критический CSS

### 4.1 Базовые стили (обязательно)

```css
/* CSS переменные для цветов */
:root {
    --primary: #4A90E2;
    --primary-hover: #609DE6;
    --dark: #252525;
    --body: #666666;
    --secondary: #FAFAFA;
}

/* Body */
body {
    background-color: #fff;
    color: #666666;
    overflow-x: hidden;
}

/* Контейнер */
.container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}
@media (min-width: 1170px) {
    .container { max-width: 1170px; }
}

/* Header */
header.bg-dark { background-color: #252525; }
header.sticky { position: sticky; top: 0; z-index: 50; }
header nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
}

/* Хлебные крошки */
.breadcrumbs { font-size: 0.875rem; color: #9ca3af; }
.breadcrumbs a { color: #9ca3af; text-decoration: none; }
.breadcrumbs a:hover { text-decoration: underline; }

/* H1 */
h1 {
    font-size: 2.25rem;
    font-weight: 300;
    line-height: 1.2;
    margin-bottom: 1rem;
}
@media (min-width: 1024px) {
    h1 { font-size: 3rem; }
}

/* Lead текст */
.text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

/* Базовые утилиты */
.flex-shrink-0 { flex-shrink: 0; }
.relative { position: relative; }
.overflow-hidden { overflow: hidden; }
.inline-block { display: inline-block; }
.flex { display: flex; }
.items-center { align-items: center; }
.text-white { color: #fff; }
.bg-primary { background-color: #4A90E2; }
.rounded { border-radius: 0.25rem; }
.uppercase { text-transform: uppercase; }
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* Screen reader only */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Grid для секции Описание (с видео) */
@media (min-width: 1024px) {
    .description-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    .description-grid .video-column {
        grid-row: span 2;
    }
    .description-grid .text-column {
        grid-column: 2 / 4;
    }
}

/* Grid для секции Описание БЕЗ видео */
@media (min-width: 1024px) {
    .description-grid-no-video {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
}
```

### 4.2 Компоненты (добавляются по необходимости)

```css
/* Page Navigator (боковая навигация) */
.page-navigator { position: fixed; top: 50%; transform: translateY(-50%); right: 1.85714286em; z-index: 9999; }
.page-navigator ul { display: inline-block; padding: 0.92857143em; background: rgba(0, 0, 0, 0.4); border-radius: 1.85714286em; }
.page-navigator ul:hover { background: rgba(0, 0, 0, 0.6); }
.page-navigator ul li { list-style: none; }
.page-navigator ul li:not(:last-child) { margin-bottom: 1.85714286em; }
@media (max-width: 1023px) { .page-navigator { display: none !important; } }
.page-navigator li a { width: 8px; height: 8px; background: #fff; border-radius: 50%; transition: all 0.2s ease; display: block; position: relative; opacity: 0.5; }
.page-navigator li a:hover, .page-navigator li a.inner-link--active { opacity: 1; }
.page-navigator li a[data-title]:before { content: attr(data-title); position: absolute; right: 12px; top: -14px; background: #222; color: #fff; border-radius: 6px; padding: 4px 8px; display: inline-block; white-space: nowrap; font-size: 12px; opacity: 0; transition: all 0.2s ease; }
.page-navigator li a[data-title]:hover:before { opacity: 1; }

/* Carousel */
.carousel-scroll { overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
.carousel-scroll::-webkit-scrollbar { display: none; }
.snap-center { scroll-snap-align: center; }

/* Video Cover */
.video-cover { position: relative; overflow: hidden; }
.video-cover .video-play-icon { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 2; transition: all 0.3s ease; }
.video-cover video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.video-cover.video-playing > div:first-child,
.video-cover.video-playing .video-play-icon { display: none; }
.video-cover.video-playing video { display: block; position: relative; }

/* Before/After Slider */
.ba-card { position: relative; aspect-ratio: 378/265; overflow: hidden; --pos: 50%; }
.ba-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; }
.ba-card .after-image { clip-path: inset(0 0 0 var(--pos)); }
.ba-card .ba-range { position: absolute; inset: 0; opacity: 0; cursor: ew-resize; width: 100%; height: 100%; margin: 0; z-index: 20; }
.ba-card .ba-divider { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 2px; background: #ccc; transform: translateX(-1px); pointer-events: none; z-index: 10; }
.ba-card .ba-handle { position: absolute; left: var(--pos); top: 50%; transform: translate(-50%, -50%); width: 46px; height: 70px; pointer-events: none; z-index: 15; }
.ba-card .ba-arrow { position: absolute; top: 50%; transform: translateY(-50%); font-size: 18px; font-weight: bold; color: white; text-shadow: 0 0 3px rgba(0,0,0,0.7); }
.ba-card .ba-arrow.l { left: 10px; }
.ba-card .ba-arrow.r { right: 10px; }

/* Вертикальный Before/After Slider (360x517) */
.ba-card-vertical { width: 360px; max-width: 100%; aspect-ratio: 360/517; }
```

---

## 5. JSON-LD структурированные данные

### 5.1 Product

```json
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "[Название стиля]",
    "description": "[Описание из meta description]",
    "image": "https://muse.ooo/img/[image]-1000-1000.jpg",
    "brand": {
        "@type": "Brand",
        "name": "Muse"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://muse.ooo/portret-na-zakaz/[slug]/",
        "priceCurrency": "RUB",
        "price": "[минимальная цена].00",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
            "@type": "Organization",
            "name": "Muse"
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "[количество отзывов]"
    }
}
```

### 5.2 BreadcrumbList

```json
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://muse.ooo/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Портрет на заказ",
            "item": "https://muse.ooo/portret-na-zakaz/"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "[Название стиля]",
            "item": "https://muse.ooo/portret-na-zakaz/[slug]/"
        }
    ]
}
```

---

## 6. Секции: детали реализации

### 6.1 Hero Section

**Структура:**
```html
<section class="bg-dark py-12 lg:py-20">
    <div class="container">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Текстовый блок -->
            <div class="text-white">
                <nav class="breadcrumbs mb-4" aria-label="Breadcrumb">
                    <ol class="flex list-none p-0">
                        <li class="flex items-center">
                            <a href="https://muse.ooo/">Главная</a>
                            <span class="mx-2 text-gray-300">/</span>
                        </li>
                        <li class="flex items-center">
                            <a href="https://muse.ooo/portret-na-zakaz/">Портрет на заказ</a>
                            <span class="mx-2 text-gray-300">/</span>
                        </li>
                        <li class="text-gray-300">[Название стиля]</li>
                    </ol>
                </nav>
                
                <h1 class="text-4xl lg:text-6xl font-light mb-4">[Название стиля]</h1>
                <p class="text-sm mt-2 mb-4 text-gray-300">[Подзаголовок]</p>
                <p class="text-lg lg:text-xl mb-6 text-gray-200">[Описание]</p>
                <p class="text-lg lg:text-xl mb-6 text-gray-200">От [цена] руб. Под заказ.</p>
                
                <a href="https://muse.ooo/order/" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg">
                    Заказать
                </a>
            </div>
            
            <!-- Изображение -->
            <div class="relative">
                <img 
                    src="https://muse.ooo/upload/img/[image].webp"
                    alt="[alt из оригинала]"
                    title="[title из оригинала]"
                    width="[ширина]"
                    height="[высота]"
                    class="w-full max-w-md mx-auto lg:ml-auto rounded-lg shadow-2xl"
                    fetchpriority="high"
                >
            </div>
        </div>
    </div>
</section>
```

### 6.2 Секция "Примеры"

```html
<section class="bg-dark py-16 lg:py-20" id="primery">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-white text-center mb-8">Примеры</h2>
        <p class="text-center text-gray-300 mb-8">[Подзаголовок из оригинала]</p>
        
        <!-- Галерея из Bitrix будет здесь -->
        <div class="text-center text-gray-400 py-12 border-2 border-dashed border-gray-600 rounded-lg">
            <p class="text-lg mb-2">Галерея примеров</p>
            <p class="text-sm">Будет загружена из Bitrix</p>
        </div>
        
        <div class="text-center mt-8">
            <a href="https://muse.ooo/portret-na-zakaz/portret-po-foto/[filter]/" class="inline-block px-6 py-2 text-white hover:bg-white hover:text-dark rounded uppercase transition-colors">
                Смотреть все примеры работ
            </a>
        </div>
    </div>
</section>
```

### 6.3 Секция "Как заказать"

```html
<section class="py-16 lg:py-24" id="kak-zakazat">
    <div class="container mb-8">
        <div class="text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-dark">Как заказать</h2>
        </div>
    </div>
    <div class="container">
        <div class="grid gap-10 xl:grid-cols-2 xl:items-center">
            <!-- Изображение -->
            <div>
                <img 
                    src="https://muse.ooo/upload/img/[image].webp"
                    alt="[alt]"
                    title="[title]"
                    width="555"
                    height="717"
                    class="w-full max-w-[555px] mx-auto rounded-lg shadow-2xl"
                    loading="lazy"
                    decoding="async"
                >
            </div>

            <!-- Процесс -->
            <div class="relative">
                <!-- Пунктирная линия между шагами -->
                <div class="absolute left-6 top-12 bottom-12 w-0 border-l-2 border-dashed border-gray-300"></div>

                <div class="space-y-10 relative">
                    <!-- Шаг 1 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
                            <span class="text-xl font-bold text-primary">1</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-medium text-dark mb-2">Заказ</h3>
                            <p class="text-body">
                                В разделе <a class="text-primary underline hover:no-underline" href="#calc">«Цена» ↑</a> можно загрузить фото, подобрать нужный размер, рассчитать стоимость и оформить заказ.<br><br>
                                Нет времени разбираться? Нажмите любую кнопку <a href="https://muse.ooo/order/" class="text-primary underline hover:no-underline">«Заказать» ↗</a> на сайте и перешлите нам фото. Перезвоним и поможем с выбором.
                            </p>
                        </div>
                    </div>

                    <!-- Шаг 2 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
                            <span class="text-xl font-bold text-primary">2</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-medium text-dark mb-2">Цифровой портрет</h3>
                            <p class="text-body">
                                [Текст из оригинала]<br><br>
                                Срок создания цифрового портрета — <span id="order-date"></span>.
                            </p>
                        </div>
                    </div>

                    <!-- Шаг 3 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
                            <span class="text-xl font-bold text-primary">3</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-medium text-dark mb-2">Печать и оформление</h3>
                            <p class="text-body">
                                Только после Вашего окончательного подтверждения цифрового портрета картина в стиле «[Название стиля]» будет напечатана на холсте, оформлена и передана в службу доставки.
                            </p>
                        </div>
                    </div>

                    <!-- Шаг 4 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
                            <span class="text-xl font-bold text-primary">4</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-medium text-dark mb-2">Доставка</h3>
                            <p class="text-body">
                                Ориентировочная дата доставки в пункты выдачи Санкт-Петербурга — <span id="delivery-date"></span>.<br>
                                Пункты выдачи смотрите в разделе <a href="https://muse.ooo/info/dostavka/" class="text-primary underline hover:no-underline">Доставка ↗</a>. По согласованию можно вызвать курьера.
                            </p>
                        </div>
                    </div>

                    <!-- Шаг 5 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center relative z-10">
                            <span class="text-xl font-bold text-primary">5</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-medium text-dark mb-2">Оплата</h3>
                            <p class="text-body">
                                Услуги по печати и оформлению портрета на холсте оплачиваются при получении. Работа художника по созданию цифрового портрета — после подтверждения эскиза.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

### 6.4 Секция "Характеристики"

```html
<section class="py-16 lg:py-20" id="harakteristiki">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-12">Характеристики</h2>
    </div>
    <div class="container">
        <div class="grid lg:grid-cols-2 gap-12">
            <!-- Список (на ПК слева) -->
            <div class="order-2 lg:order-1">
                <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>[Текст характеристики из оригинала]</span>
                    </li>
                    <!-- ... остальные пункты ... -->
                </ul>
                
                <div class="mt-8 p-4 bg-secondary rounded-lg border border-gray-200">
                    <p class="text-body text-sm">[Текст примечания из оригинала]</p>
                </div>
            </div>
            
            <!-- Слайдер (на ПК справа, на мобильном сверху) -->
            <div class="order-1 lg:order-2">
                <el-tab-group class="flex flex-col-reverse">
                    <!-- Миниатюры -->
                    <div class="mx-auto mt-4 w-full max-w-md">
                        <el-tab-list class="grid grid-cols-3 gap-3">
                            <button class="relative flex h-20 cursor-pointer items-center justify-center rounded bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-hidden">
                                <span class="sr-only">[Название]</span>
                                <span class="absolute inset-0 overflow-hidden rounded">
                                    <img src="[url]" alt="[alt]" title="[title]" width="442" height="278" class="size-full object-cover" loading="lazy" decoding="async" />
                                </span>
                                <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded ring-2 ring-transparent ring-offset-2 in-aria-selected:ring-primary"></span>
                            </button>
                            <!-- ... остальные кнопки ... -->
                        </el-tab-list>
                    </div>
                    
                    <!-- Большие изображения -->
                    <el-tab-panels>
                        <div>
                            <img src="[url]" alt="[alt]" title="[title]" width="442" height="278" class="w-full rounded-lg object-cover" loading="lazy" decoding="async" />
                        </div>
                        <div hidden>
                            <img ... />
                        </div>
                    </el-tab-panels>
                </el-tab-group>
            </div>
        </div>
    </div>
</section>
```

### 6.5 Секция "Преимущества"

```html
<section class="bg-primary py-16 lg:py-24" id="preimushchestva">
    <div class="container mb-12">
        <h2 class="text-3xl lg:text-4xl font-light text-white text-center">Преимущества</h2>
    </div>
    <div class="container">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg p-6 text-left text-dark">
                <div class="w-16 h-16 mb-4 flex items-center justify-start">
                    <!-- SVG иконка -->
                </div>
                <p class="text-lg">[Текст из оригинала]</p>
            </div>
            <!-- ... остальные карточки ... -->
        </div>
    </div>
</section>
```

### 6.6 Секция "Отзывы" с модальным окном

```html
<section class="bg-secondary py-16 lg:py-20" id="otzyvy">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-8">Отзывы</h2>
        
        <!-- Заглушка -->
        <div class="text-center text-gray-500 py-8 mb-8">
            <p class="text-sm">Отзывы будут загружены из Bitrix</p>
        </div>
        
        <!-- Кнопка -->
        <div class="text-center">
            <button 
                type="button"
                onclick="document.getElementById('review-modal').showModal()"
                class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors"
            >
                Оставить отзыв
            </button>
        </div>
    </div>
</section>

<!-- Модальное окно -->
<dialog id="review-modal" class="p-0 rounded-lg shadow-2xl backdrop:bg-black/70 max-w-md w-full">
    <div class="p-6 bg-dark text-white rounded-lg">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-white">Представьтесь, пожалуйста</h3>
            <button 
                type="button"
                onclick="document.getElementById('review-modal').close()"
                class="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                aria-label="Закрыть окно"
            >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <p class="text-body mb-6 text-gray-300">Выберите социальную сеть для авторизации:</p>
        
        <div class="space-y-3">
            <!-- Яндекс, Mail.Ru, VK, Google, Одноклассники -->
            <!-- См. полный код в эталоне -->
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-700">
            <p class="text-xs text-gray-400 text-center">
                Авторизация необходима для подтверждения подлинности отзыва
            </p>
        </div>
    </div>
</dialog>

<script>
function BxPopup(url, width, height) {
    var left = (screen.width/2) - (width/2);
    var top = (screen.height/2) - (height/2);
    window.open(url, '', 'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}
</script>
```

### 6.7 Секция "Описание"

```html
<section class="py-16 lg:py-20" id="opisanie">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-12">Описание</h2>
  
        <div class="description-grid space-y-8 lg:space-y-0">
            
            <!-- 1. Видео (занимает 2 строки на десктопе) -->
            <div class="video-column">
                <div class="video-cover aspect-[360/648] rounded-lg overflow-hidden shadow-lg">
                    <img 
                        src="https://muse.ooo/upload/img/[preview].webp"
                        alt="[alt]"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                    >
                    <div class="video-play-icon cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <iframe 
                        class="hidden"
                        loading="lazy"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        data-src="https://www.youtube.com/embed/[VIDEO_ID]?rel=0&showinfo=0"
                        title="[title]"
                    ></iframe>
                </div>
                <p class="text-center text-gray-600 mt-4 text-sm">[Подпись под видео]</p>
            </div>
            
            <!-- 2. До/После -->
            <div>
                <div class="ba-card rounded-xl overflow-hidden shadow-2xl" id="before-after">
                    <img 
                        src="[before].webp"
                        alt="[alt]"
                        title="[title]"
                        class="before-image"
                        loading="lazy"
                        decoding="async"
                        width="378"
                        height="265"
                    >
                    <img 
                        src="[after].webp"
                        alt="[alt]"
                        title="[title]"
                        class="after-image"
                        loading="lazy"
                        decoding="async"
                        width="378"
                        height="265"
                    >
                    <div class="ba-divider"></div>
                    <div class="ba-handle">
                        <span class="ba-arrow l">‹</span>
                        <span class="ba-arrow r">›</span>
                    </div>
                    <input type="range" min="0" max="100" value="50" class="ba-range" aria-label="Сравнение до и после" oninput="this.parentNode.style.setProperty('--pos', this.value + '%')">
                </div>
                <p class="text-center text-gray-600 mt-4 text-sm">Потяните за ползунок, чтобы сравнить «До» и «После»</p>
            </div>
            
            <!-- 3. Текст -->
            <div class="text-column space-y-4 text-gray-600">
                <p>[Абзац 1 из оригинала]</p>
                <p>[Абзац 2]</p>
                <p>[Абзац 3]</p>
                <p class="italic">Muse (греч. Μούσα) — это вдохновение, это Муза</p>
            </div>
            
        </div>
    </div>
</section>
```

### 6.7.1 Секция "Описание" БЕЗ видео

**Используй этот вариант, если у стиля нет видео на оригинальной странице.**

```html
<section class="py-16 lg:py-20" id="opisanie">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-12">Описание</h2>
  
        <!-- Grid контейнер БЕЗ видео (2 колонки на десктопе) -->
        <div class="description-grid-no-video space-y-8 lg:space-y-0">
            
            <!-- 1. До/После -->
            <div>
                <div class="ba-card rounded-xl overflow-hidden shadow-2xl" id="before-after">
                    <img 
                        src="[before].webp"
                        alt="[alt]"
                        title="[title]"
                        class="before-image"
                        loading="lazy"
                        decoding="async"
                        width="378"
                        height="265"
                    >
                    <img 
                        src="[after].webp"
                        alt="[alt]"
                        title="[title]"
                        class="after-image"
                        loading="lazy"
                        decoding="async"
                        width="378"
                        height="265"
                    >
                    <div class="ba-divider"></div>
                    <div class="ba-handle">
                        <span class="ba-arrow l">‹</span>
                        <span class="ba-arrow r">›</span>
                    </div>
                    <input type="range" min="0" max="100" value="50" class="ba-range" aria-label="Сравнение до и после" oninput="this.parentNode.style.setProperty('--pos', this.value + '%')">
                </div>
                <p class="text-center text-gray-600 mt-4 text-sm">Потяните за ползунок, чтобы сравнить «До» и «После»</p>
            </div>
            
            <!-- 2. Текст -->
            <div class="space-y-4 text-gray-600">
                <p>[Абзац 1 из оригинала]</p>
                <p>[Абзац 2]</p>
                <p>[Абзац 3]</p>
                <p class="italic">Muse (греч. Μούσα) — это вдохновение, это Муза</p>
            </div>
            
        </div>
    </div>
</section>
```

**Не забудь добавить CSS в критические стили:**
```css
/* Grid для секции Описание БЕЗ видео */
@media (min-width: 1024px) {
    .description-grid-no-video {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
}
```

### 6.7.2 Секция "Описание" с ВЕРТИКАЛЬНЫМ До/После

**Используй этот вариант, если у стиля вертикальные изображения До/После (например, drim-art, graffiti).**

**Размер изображений:** 360×517 (вертикальные)

```html
<section class="py-16 lg:py-20" id="opisanie">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-12">Описание</h2>
  
        <!-- Grid: текст слева (2 колонки), вертикальное До/После справа (1 колонка) -->
        <div class="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            <!-- 1. Текст (занимает 2 колонки на десктопе) -->
            <div class="lg:col-span-2 space-y-4 text-gray-600">
                <h3 class="text-xl font-medium text-dark">[Подзаголовок из оригинала]</h3>
                <p>[Абзац 1 из оригинала]</p>
                <p>[Абзац 2]</p>
                <p>[Абзац 3]</p>
                <p>[Абзац 4]</p>
                <p class="italic">Muse (греч. Μούσα) — это вдохновение, это Муза</p>
            </div>
            
            <!-- 2. Вертикальное До/После -->
            <div class="flex flex-col items-center">
                <div class="ba-card ba-card-vertical rounded-xl overflow-hidden shadow-2xl" id="before-after">
                    <img 
                        src="[before].webp"
                        alt="[alt]"
                        title="[title]"
                        class="before-image"
                        loading="lazy"
                        decoding="async"
                        width="360"
                        height="517"
                    >
                    <img 
                        src="[after].webp"
                        alt="[alt]"
                        title="[title]"
                        class="after-image"
                        loading="lazy"
                        decoding="async"
                        width="360"
                        height="517"
                    >
                    <div class="ba-divider"></div>
                    <div class="ba-handle">
                        <span class="ba-arrow l">‹</span>
                        <span class="ba-arrow r">›</span>
                    </div>
                    <input type="range" min="0" max="100" value="50" class="ba-range" aria-label="Сравнение до и после" oninput="this.parentNode.style.setProperty('--pos', this.value + '%')">
                </div>
                <p class="text-center text-gray-600 mt-4 text-sm">Потяните за вертикальную линию, чтобы сравнить «До» и «После»</p>
            </div>
            
        </div>
    </div>
</section>
```

**Не забудь добавить CSS в критические стили:**
```css
/* Вертикальный Before/After Slider (360x517) */
.ba-card-vertical { width: 360px; max-width: 100%; aspect-ratio: 360/517; }
```

### 6.8 Секция CTA

```html
<section class="bg-dark py-24 md:py-32">
    <div class="container xl:flex xl:items-center xl:justify-between">
        <h2 class="text-2xl font-light tracking-tight text-white">
            Создай своё произведение искусства
        </h2>
        <div class="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0">
            <a href="https://muse.ooo/order/" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Заказать
            </a>
            <a href="#callback" class="inline-block px-6 py-2 bg-secondary hover:bg-white text-dark rounded uppercase transition-colors w-full md:w-auto text-center">
                Обратный звонок
            </a>
        </div>
    </div>
</section>
```

---

## 7. Правила работы с контентом

### 7.1 ⛔ КРИТИЧНО: Не менять контент!

**ЗАПРЕЩЕНО без согласования:**
- Менять тексты
- Сокращать описания
- Изменять alt/title изображений
- Менять meta description/title
- Удалять контент
- "Улучшать" или переписывать тексты

**Источник контента:**
- Все тексты — **ТОЛЬКО** с оригинальной страницы `muse.ooo`
- Все alt, title, meta — **ТОЛЬКО** из оригинала
- Если что-то отсутствует — **СПРОСИТЬ**

### 7.2 Изображения

**Обязательные атрибуты:**
```html
<img 
    src="https://muse.ooo/upload/img/[file].webp"
    alt="[из оригинала]"
    title="[из оригинала]"
    width="[число]"
    height="[число]"
    loading="lazy"
    decoding="async"
>
```

**Hero изображение (исключение):**
```html
<img 
    ...
    fetchpriority="high"
>
```
- Без `loading="lazy"`
- Без `decoding="async"`

**Preload для Hero (в `<head>`):**
```html
<link rel="preload" as="image" href="https://muse.ooo/upload/img/[hero-image].webp" fetchpriority="high">
```
- Добавляется в `<head>` после критического CSS
- `preload` — загрузить раньше
- `fetchpriority="high"` — максимальный приоритет среди ресурсов
- Ускоряет LCP (Largest Contentful Paint)

### 7.3 Ссылки

**Внутренние (на этой странице):**
```html
<a href="#calc" class="text-primary underline hover:no-underline">«Цена» ↑</a>
<!-- ↑ стрелка вверх для ссылок наверх -->
<!-- ↓ стрелка вниз для ссылок вниз -->
```

**Внешние (другие страницы сайта или внешние):**
```html
<a href="https://muse.ooo/order/" class="text-primary underline hover:no-underline">«Заказать» ↗</a>
<!-- ↗ стрелка для внешних ссылок -->
```

---

## 8. JavaScript

### 8.1 Дата заказа

```javascript
(function() {
    const orderDateEl = document.getElementById('order-date');
    if (orderDateEl) {
        const date = new Date();
        date.setDate(date.getDate() + 2); // +2 дня
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        orderDateEl.textContent = date.toLocaleDateString('ru-RU', options);
    }
})();
```

### 8.2 Page Navigator (подсветка активной секции)

```javascript
(function() {
    const nav = document.querySelector('.page-navigator');
    if (!nav || window.innerWidth < 1024) return;
    
    const links = nav.querySelectorAll('a');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        let currentActive = null;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                currentActive = section.id;
            }
        });
        
        links.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === currentActive) {
                link.classList.add('inner-link--active');
            } else {
                link.classList.remove('inner-link--active');
            }
        });
    }
    
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                updateActiveLink();
                isScrolling = false;
            });
        }
    }, { passive: true });
    
    updateActiveLink();
})();
```

---

## 9. Accessibility (доступность)

### 9.1 Form Labels

```html
<!-- Для слайдера До/После -->
<input type="range" aria-label="Сравнение до и после" ...>

<!-- Для скрытых подписей -->
<span class="sr-only">Описание для screen reader</span>
```

### 9.2 Кнопки и ссылки

```html
<!-- Кнопка закрытия модалки -->
<button aria-label="Закрыть окно">...</button>

<!-- Соцсети в футере -->
<a href="..." aria-label="WhatsApp">...</a>
```

### 9.3 Навигация

```html
<nav aria-label="Breadcrumb">
    <ol>...</ol>
</nav>
```

---

## 10. Чек-лист перед завершением

### 10.1 Структура
- [ ] Все секции на месте в правильном порядке
- [ ] Правильные фоны секций
- [ ] Header и Footer из эталона
- [ ] Page Navigator с правильными ID

### 10.2 Контент
- [ ] Все тексты соответствуют оригиналу на 100%
- [ ] `<title>` из оригинала
- [ ] `<meta description>` из оригинала
- [ ] Все alt и title изображений из оригинала
- [ ] JSON-LD с правильными данными (название, цена, количество отзывов)

### 10.3 Изображения
- [ ] Формат WebP
- [ ] width и height указаны
- [ ] loading="lazy" (кроме Hero)
- [ ] decoding="async" (кроме Hero)
- [ ] fetchpriority="high" для Hero

### 10.4 Интерактивность
- [ ] Слайдер в "Характеристики" работает
- [ ] До/После слайдер работает
- [ ] Модальное окно "Оставить отзыв" открывается/закрывается
- [ ] Page Navigator подсвечивает активную секцию

### 10.5 Accessibility
- [ ] aria-label для интерактивных элементов
- [ ] sr-only для скрытых подписей
- [ ] Ссылки имеют underline

### 10.6 Валидация
- [ ] Проверить через [W3C Validator](https://validator.w3.org/)
- [ ] Проверить через [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 11. Что заменять в каждом стиле

| Элемент | Где искать в оригинале |
|---------|------------------------|
| Название стиля | `<h1>`, `<title>` |
| Подзаголовок | Текст сразу под H1 (например, "Изысканный, благородный, живописный") |
| Описание | meta description, первый абзац под подзаголовком |
| Минимальная цена | Текст "От X руб." |
| Hero изображение | Первое большое изображение на странице |
| Изображение в "Как заказать" | Изображение справа от шагов |
| Изображения в слайдере | Карусель в "Характеристики" |
| До/После изображения | Секция "Описание" |
| Видео YouTube ID | iframe в секции "Описание" |
| Тексты характеристик | Список с галочками |
| Тексты преимуществ | 6 карточек |
| Тексты описания | Абзацы в секции "Описание" |
| Количество отзывов | Над списком отзывов |
| URL страницы | Для canonical, og:url, JSON-LD |
| SKU | В JSON-LD (если есть) |

---

## Файлы-эталоны

| Файл | Назначение |
|------|------------|
| `tailwind-project/src/html/portret-maslom.html` | **Эталон для 18 стилей портретов** |
| `tailwind-project/src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` | Эталон для общих страниц портретов |
| `tailwind-project/src/html/foto-na-kholste-sankt-peterburg.html` | Эталон для страниц печати |

---

*Последнее обновление: 11 января 2026*

