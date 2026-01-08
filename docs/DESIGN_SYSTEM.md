# Дизайн-система Muse

Полное описание дизайн-системы проекта Muse, основанной на теме Stack.

---

## ⚠️ Правила работы с контентом

**ВАЖНО:** Текст от себя не добавлять!

- Весь контент брать ТОЛЬКО с оригинального сайта muse.ooo
- Если текст неизвестен — использовать плейсхолдер: `[ТЕКСТ: описание]`
- Новый текст предлагать на согласование, а не вставлять сразу
- В примерах документации использовать реальный текст с сайта или явные плейсхолдеры

---

## Содержание

1. [Цвета](#цвета)
2. [Типографика](#типографика)
3. [Отступы и размеры](#отступы-и-размеры)
4. [Компоненты](#компоненты)
5. [Примеры использования](#примеры-использования)

---

## Цвета

### Палитра цветов

#### Основные цвета бренда

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div>
    <div style="width: 100px; height: 100px; background: #4a90e2; border: 1px solid #ddd;"></div>
    <p><strong>Primary</strong><br>#4a90e2</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #609de6; border: 1px solid #ddd;"></div>
    <p><strong>Primary Hover</strong><br>#609de6</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #3483de; border: 1px solid #ddd;"></div>
    <p><strong>Primary Active</strong><br>#3483de</p>
  </div>
</div>

#### Нейтральные цвета

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div>
    <div style="width: 100px; height: 100px; background: #252525; border: 1px solid #ddd;"></div>
    <p><strong>Dark</strong><br>#252525</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #666666; border: 1px solid #ddd;"></div>
    <p><strong>Body Text</strong><br>#666666</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #fafafa; border: 1px solid #ddd;"></div>
    <p><strong>Secondary</strong><br>#fafafa</p>
  </div>
  <div>
    <div style="width: 100px; height: 100px; background: #ffffff; border: 1px solid #ddd;"></div>
    <p><strong>White</strong><br>#ffffff</p>
  </div>
</div>

### Использование цветов

#### Фоны

```html
<!-- Основной синий фон -->
<div class="bg-primary text-white">...</div>

<!-- Темный фон -->
<div class="bg-dark text-white">...</div>

<!-- Светлый фон -->
<div class="bg-secondary">...</div>

<!-- Белый фон -->
<div class="bg-white">...</div>
```

#### Текст

```html
<!-- Основной текст -->
<p class="text-body">Основной текст</p>

<!-- Темный текст (заголовки) -->
<h2 class="text-dark">Заголовок</h2>

<!-- Белый текст (на темном фоне) -->
<div class="bg-dark">
  <p class="text-white">Белый текст</p>
</div>

<!-- Серый текст (второстепенный) -->
<p class="text-gray-400">Второстепенный текст</p>
```

---

## Типографика

### Шкала размеров

| Элемент | Desktop | Mobile | Line Height | Использование |
|---------|---------|--------|-------------|---------------|
| **H1** | 44px (3.14em) | 33px (2.36em) | 1.32em | Главный заголовок страницы |
| **H2** | 33px (2.36em) | 25px (1.79em) | 1.36em | Заголовок секции |
| **H3** | 25px (1.79em) | 19px (1.36em) | 1.5em | Подзаголовок |
| **H4** | 19px (1.36em) | 19px (1.36em) | 1.37em | Малый заголовок |
| **H5** | 14px (1em) | 14px (1em) | 1.86em | Очень малый заголовок |
| **H6** | 12px (0.86em) | 12px (0.86em) | 2.17em | Минимальный заголовок |
| **Lead** | 19px (1.36em) | 19px (1.36em) | 1.68em | Вводный текст |
| **Body** | 14px (1em) | 13px (0.81em) | 1.86em | Основной текст |
| **Small** | 12px (0.86em) | 12px (0.86em) | 1.86em | Мелкий текст |

### Примеры (чистый Tailwind)

```html
<!-- Главный заголовок (Hero) -->
<p class="text-4xl lg:text-5xl font-light text-white">Создай своё произведение искусства</p>
<h1 class="text-xl text-white/90">Картины по фото: портреты маслом и печать на холсте</h1>

<!-- Заголовок секции (H2) -->
<h2 class="text-3xl lg:text-4xl font-light text-dark">Преимущества</h2>

<!-- Вводный текст (lead) -->
<p class="text-xl">Картины по фото: портреты маслом и печать на холсте</p>

<!-- Основной текст -->
<p class="text-body">[ТЕКСТ: описание секции с сайта muse.ooo]</p>

<!-- Мелкий текст -->
<span class="text-sm text-gray-400">Дополнительная информация</span>
```

### Насыщенность шрифта

- **Light (300)** - для заголовков
- **Normal (400)** - для основного текста
- **Semibold (600)** - для акцентов
- **Bold (700)** - для важных элементов

```html
<p class="font-light">Легкий текст</p>
<p class="font-normal">Обычный текст</p>
<p class="font-semibold">Полужирный текст</p>
<p class="font-bold">Жирный текст</p>
```

---

## Отступы и размеры

### Система отступов

Базовый отступ: **4px** (0.25rem)

| Название | Значение | Размер | Использование |
|----------|----------|--------|---------------|
| XS | 0.5rem | 8px | Минимальные отступы |
| SM | 1rem | 16px | Малые отступы |
| MD | 1.5rem | 24px | Средние отступы |
| LG | 2rem | 32px | Большие отступы |
| XL | 3rem | 48px | Очень большие отступы |
| 2XL | 4rem | 64px | Максимальные отступы |

### Контейнер

Контейнер настроен через Tailwind конфигурацию:

- **Максимальная ширина**: 1170px
- **Padding**: 1rem (16px) по горизонтали
- **Центрирование**: автоматическое

```html
<!-- Правильно: просто container -->
<div class="container">...</div>

<!-- Неправильно: избыточные классы (mx-auto и px-4 уже включены в container) -->
<div class="container mx-auto px-4">...</div>
```

**Tailwind конфигурация контейнера:**
```javascript
tailwind.config = {
    theme: {
        container: {
            center: true,      // mx-auto встроен
            padding: '1rem',   // px-4 встроен
            screens: {
                '2xl': '1170px' // max-width на больших экранах
            }
        }
    }
}
```

### Вертикальные отступы секций

Стандартные отступы для секций:

| Тип секции | Мобильные | Десктоп (lg:) | Tailwind классы |
|------------|-----------|---------------|-----------------|
| **Основные секции** | 64px | 96px | `py-16 lg:py-24` |
| **Промо-баннер** | 24px | 24px | `py-6` |
| **CTA секция** | 96px | 128px | `py-24 md:py-32` |
| **Footer** | 32px | 48px | `py-8 lg:py-12` |

```html
<!-- Основная секция контента -->
<section class="bg-secondary py-16 lg:py-24">
    <div class="container">...</div>
</section>

<!-- Промо-баннер -->
<section class="bg-primary py-6">
    <div class="container">...</div>
</section>
```

### Использование в Tailwind

```html
<!-- Padding -->
<div class="p-4">Padding 16px</div>
<div class="px-4 py-8">Padding X: 16px, Y: 32px</div>

<!-- Margin -->
<div class="mb-8">Margin bottom 32px</div>
<div class="mt-16">Margin top 64px</div>

<!-- Gap (для flex/grid) -->
<div class="flex gap-4">Gap 16px</div>
```

### Радиусы скругления

- **SM**: 4px - для мелких элементов
- **MD**: 6px - стандарт для кнопок и карточек
- **LG**: 8px - для больших элементов
- **Full**: 9999px - для круглых элементов

```html
<div class="rounded-md">Скругление 6px</div>
<div class="rounded-lg">Скругление 8px</div>
<div class="rounded-full">Круглый элемент</div>
```

---

## Компоненты

> **Важно:** Используйте чистый Tailwind CSS. Избегайте кастомных классов (btn, boxed, feature, h2, lead и т.д.).

### Кнопки

#### Варианты кнопок (чистый Tailwind)

```html
<!-- Primary кнопка (основная) -->
<a href="#" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors">
    Заказать
</a>

<!-- Dark кнопка (на светлом фоне) -->
<a href="#" class="inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors">
    Обратный звонок
</a>

<!-- Большая кнопка (для Hero) -->
<a href="#" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg">
    Заказать
</a>
```

**Характеристики:**
- Padding: `py-2 px-6` (стандарт) или `py-3 px-8` (большая)
- Border radius: `rounded` (6px)
- Transition: `transition-colors`
- Hover эффект: `hover:bg-primary-hover` или `hover:bg-gray-700`

#### Кнопка "Наверх" (Back to Top)

Фиксированная круглая кнопка в правом нижнем углу. Появляется при прокрутке страницы вниз (на 300px). Скрыта на мобильных устройствах.

```html
<a href="#" id="back-to-top" class="hidden md:flex fixed bottom-5 right-5 w-12 h-12 items-center justify-center rounded-full bg-white text-dark hover:bg-dark hover:text-white border border-gray-300 hover:border-dark transition-colors z-50 opacity-0 pointer-events-none" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</a>
```

**Характеристики:**
- Размер: `w-12 h-12` (48×48px)
- Позиция: `fixed bottom-5 right-5`
- Фон: `bg-white` → `hover:bg-dark`
- Цвет иконки: `text-dark` → `hover:text-white`
- Рамка: `border border-gray-300` → `hover:border-dark`
- Форма: `rounded-full`
- Скрыта по умолчанию: `opacity-0 pointer-events-none`
- Показывать при скролле через JS, добавляя `opacity-100` и убирая `pointer-events-none`
- Видимость: `hidden md:flex` (скрыта на мобильных)
- Доступность: `aria-label="Наверх"`

### Карточки

#### Feature Card (карточка преимущества)

```html
<div class="flex flex-col p-6 border border-gray-200 rounded bg-white">
    <div class="mb-6 flex size-10 items-center justify-start">
        <!-- Иконка SVG с class="text-primary" -->
        <svg class="text-primary">...</svg>
    </div>
    <span class="text-xl text-dark">Собственное производство</span>
</div>
```

**Характеристики:**
- Padding: `p-6` (24px)
- Border: `border border-gray-200`
- Border radius: `rounded`
- Фон: `bg-white`

#### Product Card (карточка товара)

```html
<div class="group">
    <a href="#" class="block">
        <img src="..." alt="..." class="w-full h-auto rounded-t" loading="lazy">
        <div class="p-4 bg-dark rounded-b">
            <span class="text-lg font-medium text-white block mb-2">Название товара</span>
            <p class="text-primary">Подробнее</p>
        </div>
    </a>
</div>
```

### Секции

#### Hero секция (с видео)

```html
<section class="relative h-[65vh] lg:h-screen overflow-hidden bg-dark">
    <video class="absolute inset-0 w-full h-full object-cover hidden lg:block" 
           autoplay loop muted playsinline preload="none" 
           title="Описание видео">
        <source src="..." media="(min-width: 1024px)" type="video/webm">
        <source src="..." media="(min-width: 1024px)" type="video/mp4">
    </video>
    <div class="absolute inset-0 bg-dark opacity-20"></div>
    <div class="container h-full flex items-center relative z-10">
        <div class="max-w-2xl">
            <p class="text-4xl lg:text-5xl font-light text-white mb-4">Заголовок</p>
            <h1 class="text-xl text-white/90 mb-8">Подзаголовок</h1>
            <a href="#" class="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors text-lg">
                Кнопка
            </a>
        </div>
    </div>
</section>
```

**Характеристики:**
- Высота: `h-[65vh]` на мобильных, `lg:h-screen` на десктопе
- Видео скрыто на мобильных (`hidden lg:block`)
- Подложка: `bg-dark opacity-20`
- Видео атрибуты: `preload="none"`, `title`, `media` для условной загрузки

#### Секция преимуществ

```html
<section class="bg-secondary py-16 lg:py-24">
    <div class="container">
        <div class="mx-auto max-w-2xl mb-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-dark">Преимущества</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Карточки преимуществ -->
        </div>
    </div>
</section>
```

#### CTA секция

```html
<section class="bg-secondary py-24 md:py-32">
    <div class="container xl:flex xl:items-center xl:justify-between">
        <h2 class="text-2xl font-light tracking-tight text-dark">
            Создай своё произведение искусства
        </h2>
        <div class="mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0">
            <a href="#" class="inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Заказать
            </a>
            <a href="#" class="inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors w-full md:w-auto text-center">
                Обратный звонок
            </a>
        </div>
    </div>
</section>
```

#### Промо-баннер

```html
<section class="bg-primary text-white py-6">
    <div class="container">
        <div class="flex items-center justify-center">
            <p class="text-xl">Скидка 20% с 3 по 4 января</p>
        </div>
    </div>
</section>
```

---

## Примеры использования

### Полная страница (чистый Tailwind)

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заголовок страницы</title>
    
    <!-- Критический CSS -->
    <style>
        :root { --primary: #4A90E2; --dark: #252525; }
        .container { width: 100%; margin: 0 auto; padding: 0 1rem; }
        @media (min-width: 1170px) { .container { max-width: 1170px; } }
    </style>
    
    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                container: { center: true, padding: '1rem', screens: { '2xl': '1170px' } },
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
</head>
<body class="bg-white overflow-x-hidden">
    <!-- Header -->
    <header class="bg-dark sticky top-0 z-50">
        <nav class="container flex items-center justify-between gap-x-4 py-5">...</nav>
    </header>
    
    <!-- Hero -->
    <section class="relative h-[65vh] lg:h-screen overflow-hidden bg-dark">...</section>
    
    <!-- Промо-баннер -->
    <section class="bg-primary text-white py-6">
        <div class="container">...</div>
    </section>
    
    <!-- Контент -->
    <main>
        <section class="bg-secondary py-16 lg:py-24">
            <div class="container">...</div>
        </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-dark text-white py-8 lg:py-12">
        <div class="container">...</div>
    </footer>
</body>
</html>
```

---

## Контрольный список для создания страницы

### Общие требования
- [ ] Использовать только чистый Tailwind CSS (без кастомных классов типа btn, boxed, h2, lead)
- [ ] Контейнер: только `class="container"` (без mx-auto px-4)
- [ ] Правильные цвета из палитры (primary, dark, secondary, body)

### Типографика
- [ ] Заголовки: `text-3xl lg:text-4xl font-light` для H2
- [ ] Lead текст: `text-xl`
- [ ] Обычный текст: базовый без дополнительных классов

### Отступы
- [ ] Секции: `py-16 lg:py-24` (стандарт)
- [ ] Промо-баннер: `py-6`
- [ ] CTA: `py-24 md:py-32`
- [ ] Footer: `py-8 lg:py-12`

### Кнопки
- [ ] Primary: `inline-block px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded uppercase transition-colors`
- [ ] Dark: `inline-block px-6 py-2 bg-dark hover:bg-gray-700 text-white rounded uppercase transition-colors`

### Изображения
- [ ] Атрибуты: `width`, `height`, `alt`, `title`
- [ ] Для ленивой загрузки: `loading="lazy"` и `decoding="async"`
- [ ] Формат: предпочтительно `.webp`

### Видео
- [ ] Атрибуты: `preload="none"`, `playsinline`, `title`
- [ ] Атрибут `media` для условной загрузки на десктопе

### Адаптивность
- [ ] Проверить на мобильных устройствах
- [ ] Использовать брейкпоинты: `sm:`, `md:`, `lg:`, `xl:`

---

## Дополнительные ресурсы

- [Файл токенов](../src/design-system/tokens.css)
- [Типографика](../src/design-system/typography.css)
- [Каталог компонентов](./COMPONENTS.md)




