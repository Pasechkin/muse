# Инструкция по переверстке страниц портретов "по объектам"

> **Эталон:** `tailwind-project/src/html/portret-na-zakaz/object/detskiy-portret.html`  
> **Расположение:** `tailwind-project/src/html/portret-na-zakaz/object/`

Этот документ описывает процесс переверстки 5 страниц портретов "по объектам" с Bootstrap 3 + Bitrix на Tailwind CSS.

---

## Содержание

1. [Список страниц для переверстки](#1-список-страниц-для-переверстки)
2. [Структура страницы](#2-структура-страницы)
3. [Элементы `<head>`](#3-элементы-head)
4. [Критический CSS](#4-критический-css)
5. [JSON-LD структурированные данные](#5-json-ld-структурированные-данные)
6. [Секции: детали реализации](#6-секции-детали-реализации)
7. [Правила работы с контентом](#7-правила-работы-с-контентом)
8. [Что заменять в каждой странице](#8-что-заменять-в-каждой-странице)

---

## 1. Список страниц для переверстки

| # | Объект | Slug | Файл | Статус |
|---|--------|------|------|--------|
| 1 | Детский | `detskiy-portret` | `detskiy-portret.html` | ✅ Эталон |
| 2 | Женский | `zhenskiy-portret` | `zhenskiy-portret.html` | ⏳ |
| 3 | Мужской | `muzhskoy-portret` | `muzhskoy-portret.html` | ⏳ |
| 4 | Парный | `parnyy-portret` | `parnyy-portret.html` | ⏳ |
| 5 | Семейный | `semeynyy-portret` | `semeynyy-portret.html` | ⏳ |

---

## 2. Структура страницы

### 2.1 Отличия от страниц стилей

| Аспект | Страницы стилей (18 шт.) | Страницы объектов (5 шт.) |
|--------|--------------------------|---------------------------|
| Секций | 11 | 8 |
| Hero | 2 колонки (текст + изображение) | Текст на фоновом изображении |
| Карусель стилей | Нет | Есть (13 стилей) |
| Характеристики | Есть | **Нет** |
| Описание | Есть | **Нет** |
| Преимущества | Есть | **Нет** |
| Как заказать | Есть | **Нет** |

### 2.2 Секции страницы (порядок сверху вниз)

| # | Секция | ID | Фон | Примечание |
|---|--------|-----|-----|------------|
| 1 | **Header** | — | `bg-dark` | Типовой |
| 2 | **Page Navigator** | `#page-navigator` | — | Боковая навигация (только desktop) |
| 3 | **Hero** | — | Фоновое изображение с Ken Burns | H1, хлебные крошки, описание, кнопка |
| 4 | **Promo Banner** | — | `bg-primary` | Текст акции (региональный) |
| 5 | **Выберите свой стиль** | `#stili-portretov` | `bg-dark` | Карусель из 13 стилей |
| 6 | **Портфолио** | `#primery-portretov` | `bg-dark` | Галерея из Bitrix (заглушка) |
| 7 | **Цена** | `#calc` | белый | Калькулятор из Bitrix (заглушка) |
| 8 | **Отзывы** | `#review` | `bg-secondary` | Заглушка + модалка авторизации |
| 9 | **CTA** | — | `bg-dark` | Призыв к действию |
| 10 | **Footer** | — | `bg-dark` | Типовой |

### 2.3 Цвета фонов

```
bg-dark      = #222222 (чёрный)
bg-primary   = #4A90E2 (голубой)
bg-secondary = #F8F8F8 (светло-серый)
белый        = #FFFFFF
```

---

## 3. Элементы `<head>`

### 3.1 Базовая структура

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Название объекта] по фото на холсте — заказать в Muse</title>
    <meta name="description" content="[Описание из оригинала]">
    
    <!-- Закрыто от индексации во время разработки -->
    <meta name="robots" content="noindex, nofollow">
    
    <!-- JSON-LD структурированные данные -->
    <script type="application/ld+json">/* Product */</script>
    <script type="application/ld+json">/* BreadcrumbList */</script>
    
    <!-- Критический CSS -->
    <style>/* см. раздел 4 */</style>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                container: { center: true, padding: '1rem', screens: { '2xl': '1170px' } },
                extend: {
                    colors: {
                        primary: '#4a90e2',
                        'primary-hover': '#4382cb',
                        dark: '#222222',
                        body: '#444444',
                        secondary: '#f8f8f8'
                    }
                }
            }
        }
    </script>
    
    <!-- Tailwind Plus Elements -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
    
    <!-- Некритические стили -->
    <style>/* Page Navigator, Carousel, Ken Burns и т.д. */</style>
</head>
```

### 3.2 Что вставляет пользователь

**Пользователь вставляет сам:**
- Header
- Footer
- SVG-иконки
- Секцию CTA
- Контент внутри `<dialog></dialog>` в секции Отзывы

ИИ должен:
- Для Header: использовать комментарий `<!-- Header (вставьте из эталона) -->`
- Для Footer: использовать комментарий `<!-- Footer (вставьте из эталона) -->`
- Для SVG-иконок: использовать заглушки или комментарии
- Для CTA: использовать комментарий `<!-- CTA секция (вставьте из эталона) -->`
- Для модального окна отзыва: оставить пустой `<dialog>` с комментарием

Не пытаться генерировать мобильное меню или сложные SVG-иконки самостоятельно.

---

## 4. Критический CSS

Критический CSS **идентичен** страницам стилей. Копируй из эталона `detskiy-portret.html`.

Включает:
- CSS переменные для цветов
- Body стили
- Контейнер
- Header стили
- Хлебные крошки
- H1 стили
- Базовые утилиты
- Screen reader only

**Некритические стили (после Tailwind CDN):**
- Page Navigator
- Carousel
- Video Cover
- Ken Burns Effect
- Премиальные улучшения (hover-эффекты)
- Timeline divider
- Characteristics list

---

## 5. JSON-LD структурированные данные

### 5.1 Product

```json
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "[Название объекта]",
    "description": "[Описание из meta description]",
    "image": "https://muse.ooo/upload/img/[hero-image].webp",
    "brand": {
        "@type": "Brand",
        "name": "Muse"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://muse.ooo/portret-na-zakaz/[slug]/",
        "priceCurrency": "RUB",
        "price": "4311.00",
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
        "reviewCount": "[количество отзывов из оригинала]"
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
            "name": "[Название объекта]",
            "item": "https://muse.ooo/portret-na-zakaz/[slug]/"
        }
    ]
}
```

---

## 6. Секции: детали реализации

### 6.1 Hero Section

**Особенность:** Фоновое изображение с Ken Burns эффектом (в отличие от страниц стилей).

```html
<section class="relative h-[70vh] overflow-hidden flex items-center">
    <!-- Background Image + Ken Burns Animation -->
    <div class="absolute inset-0 z-0 bg-black">
        <picture>
            <!-- На мобильных — прозрачный пиксель -->
            <source 
                media="(max-width: 1023px)" 
                srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            >
            <!-- На десктопе — полное изображение -->
            <source 
                media="(min-width: 1024px)" 
                srcset="https://muse.ooo/upload/img/[hero-image].webp"
            >
            <img 
                src="https://muse.ooo/upload/img/[hero-image].webp" 
                alt="[alt из оригинала]"
                title="[title из оригинала]"
                class="w-full h-full object-cover ken-burns-img"
                width="1000"
                height="702"
                fetchpriority="high"
            >
        </picture>
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <div class="container h-full flex items-center relative z-10 text-white">
        <div class="max-w-3xl">
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
                    <li class="text-gray-300">[Название объекта]</li>
                </ol>
            </nav>
            
            <h1 class="text-4xl lg:text-6xl font-light mb-6">[Название объекта]</h1>
            <p class="text-xl lg:text-2xl font-light mb-8 text-gray-200">
                [Описание из оригинала]
            </p>
            
            <a href="https://muse.ooo/order/" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg btn-premium">
                Заказать
            </a>
        </div>
    </div>
</section>
```

### 6.2 Promo Banner

```html
<section class="bg-primary text-white py-6">
    <div class="container">
        <div class="flex items-center justify-center">
            <p class="text-xl">Скидка 20% с [даты из Bitrix]</p>
        </div>
    </div>
</section>
```

### 6.3 Секция "Выберите свой стиль"

**Ключевая особенность:** Карусель с 13 стилями, изображения специфичны для объекта (детские/женские/мужские работы).

**Важно:**
- Заголовок "Выберите свой стиль" — **НЕ ссылка** (просто текст)
- Текст под заголовком — размер `text-base lg:text-lg`
- В карточках стилей **НЕТ** ссылки "Цена" — только название стиля

```html
<section class="bg-dark py-16 lg:py-20" id="stili-portretov">
    <div class="container mb-8">
        <div class="text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-white mb-4">Выберите свой стиль</h2>
            <p class="text-base lg:text-lg text-gray-300 mb-8">
                Чтобы рассчитать стоимость, узнать о характеристиках и сроках исполнения, 
                пожалуйста перейдите на подробную страницу стиля по ссылке «Цена». 
                Перейти на страницу стиля можно и из раздела «Портфолио» кликнув по 
                понравившемуся портрету. Он откроется в большом размере, и ссылка 
                «Цена» там тоже будет.
            </p>
        </div>
    </div>

    <div class="carousel-scroll pb-4">
        <div class="flex gap-0 px-4 min-w-max">
            <!-- Карточка стиля (повторить для каждого из 13 стилей) -->
            <div class="text-center flex-shrink-0 snap-center w-[223px]">
                <a href="https://muse.ooo/portret-na-zakaz/[style-slug]/#calc">
                    <img 
                        title="[Название стиля]" 
                        height="[высота]" 
                        width="223" 
                        alt="[alt из оригинала]" 
                        class="rounded" 
                        src="https://muse.ooo/upload/img/[image].webp" 
                        decoding="async" 
                        loading="lazy"
                    >
                    <p class="mt-2 text-white">[Название стиля]</p>
                </a>
            </div>
            <!-- ... ещё 12 карточек ... -->
        </div>
    </div>
</section>
```

**Стили в карусели (порядок из оригинала):**

1. Акварель
2. Маслом
3. Карандаш
4. В образе
5. Комикс
6. Из слов
7. Фотомозаика
8. Фэнтези
9. Flower Art
10. Гранж
11. WPAP
12. Поп-арт
13. Дрим-арт

### 6.4 Секция "Портфолио"

```html
<section class="bg-dark py-16 lg:py-20" id="primery-portretov">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-white text-center mb-8">Портфолио</h2>
        <p class="text-center text-gray-300 mb-8">Портреты по фото</p>
        
        <!-- Галерея из Bitrix будет здесь -->
        <div class="text-center text-gray-400 py-12 border-2 border-dashed border-gray-600 rounded-lg">
            <p class="text-lg mb-2">Галерея примеров</p>
            <p class="text-sm">Будет загружена из Bitrix</p>
        </div>
        
        <div class="text-center mt-8">
            <a href="https://muse.ooo/portret-na-zakaz/portret-po-foto/" class="inline-block px-6 py-2 text-white hover:bg-white hover:text-dark rounded uppercase transition-colors">
                смотреть все примеры работ
            </a>
        </div>
    </div>
</section>
```

### 6.5 Секция "Цена"

```html
<section class="py-16 lg:py-20" id="calc">
    <div class="container">
        <h2 class="text-3xl lg:text-4xl font-light text-dark text-center mb-8">Цена</h2>
        <div class="text-center text-body">
            <p><!-- Здесь будет калькулятор Bitrix --></p>
            <p class="text-sm text-gray-500 mt-4">Калькулятор будет добавлен при интеграции с Bitrix</p>
        </div>
    </div>
</section>
```

### 6.6 Секция "Отзывы"

Структура идентична страницам стилей. Включает:
- Заглушка для отзывов из Bitrix
- Кнопка "Оставить отзыв"
- Модальное окно с авторизацией через соцсети

**Важно:** Контент внутри `<dialog></dialog>` (модальное окно авторизации) **вставляет пользователь**. ИИ должен оставить комментарий-заглушку:

```html
<!-- Модальное окно для отзыва (вставит пользователь) -->
<dialog id="review-modal">
    <!-- Контент модального окна вставит пользователь -->
</dialog>
```

### 6.7 CTA Section

```html
<section class="bg-dark py-24 md:py-32">
    <div class="container xl:flex xl:items-center xl:justify-between">
        <h2 class="text-2xl font-light tracking-tight text-white">
            Создай своё произведение искусства
        </h2>
        <div class="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0">
            <a href="https://muse.ooo/order/" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors w-full md:w-auto text-center btn-premium">
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
- Изображения в карусели стилей — **ТОЛЬКО** из оригинала (специфичные для объекта)
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
    <!-- БЕЗ loading="lazy" и decoding="async" -->
>
```

---

## 8. Что заменять в каждой странице

### Таблица замен

| Элемент | Где найти в оригинале |
|---------|----------------------|
| `<title>` | `$APPLICATION->SetPageProperty("title", ...)` |
| `<meta description>` | `$APPLICATION->SetPageProperty("description", ...)` |
| H1 | `<h1 itemprop=name>...</h1>` |
| Описание под H1 | `<p class=lead itemprop=description>...</p>` |
| Hero изображение | `<img ... src="/upload/img/..."` в секции header |
| Hero alt/title | Атрибуты `alt` и `title` Hero изображения |
| Изображения в карусели | Секция `.carousel min-width` |
| Количество отзывов | Посчитать на оригинальной странице |

### Данные для каждой страницы

#### Детский портрет (эталон ✅)
- **Slug:** `detskiy-portret`
- **Title:** `Детский портрет по фото на холсте — заказать в Muse`
- **Description:** `Художник нарисует для Вас детский портрет и напечатает его на холсте. Посмотрите примеры, выберите стиль и пришлите фото.`
- **Hero image:** `oil-1404-5-1000-702.webp`
- **Отзывов:** 3

#### Женский портрет
- **Slug:** `zhenskiy-portret`
- **Title:** `[взять из оригинала]`
- **Description:** `[взять из оригинала]`
- **Hero image:** `[взять из оригинала]`
- **Изображения в карусели:** `[взять из оригинала — женские работы]`

#### Мужской портрет
- **Slug:** `muzhskoy-portret`
- **Title:** `[взять из оригинала]`
- **Description:** `[взять из оригинала]`
- **Hero image:** `[взять из оригинала]`
- **Изображения в карусели:** `[взять из оригинала — мужские работы]`

#### Парный портрет
- **Slug:** `parnyy-portret`
- **Title:** `[взять из оригинала]`
- **Description:** `[взять из оригинала]`
- **Hero image:** `[взять из оригинала]`
- **Изображения в карусели:** `[взять из оригинала — парные работы]`

#### Семейный портрет
- **Slug:** `semeynyy-portret`
- **Title:** `[взять из оригинала]`
- **Description:** `[взять из оригинала]`
- **Hero image:** `[взять из оригинала]`
- **Изображения в карусели:** `[взять из оригинала — семейные работы]`

---

## Чек-лист перед завершением

- [ ] `<title>` и `<meta description>` из оригинала
- [ ] Хлебные крошки с правильными ссылками
- [ ] JSON-LD Product с актуальными данными
- [ ] JSON-LD BreadcrumbList
- [ ] Hero изображение из оригинала
- [ ] Все 13 изображений в карусели из оригинала (специфичные для объекта)
- [ ] Все alt/title из оригинала
- [ ] Модальное окно отзывов работает
- [ ] Page Navigator на десктопе
- [ ] Back to Top кнопка
- [ ] Карусель прокручивается мышью/тачем
