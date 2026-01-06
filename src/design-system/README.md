# Дизайн-система Muse

Централизованная система дизайн-токенов для проекта Muse, основанная на теме Stack.

## Структура

- `tokens.css` - Все переменные дизайн-системы (цвета, размеры, отступы)
- `typography.css` - Типографические стили (заголовки, текст, ссылки)

## Использование

Дизайн-токены автоматически подключены через `input.css`:

```css
@import "tailwindcss";
@import "./design-system/tokens.css";
@import "./design-system/typography.css";
```

## Цвета

### Основные цвета

- **Primary** (`#4a90e2`) - Основной синий цвет бренда
  - Hover: `#609de6`
  - Active: `#3483de`
  - Dark: `#31639c`
  - Gray: `#465773`

- **Dark** (`#252525`) - Темный фон и заголовки
- **Body** (`#666666`) - Цвет основного текста
- **Secondary** (`#fafafa`) - Светлый фон
- **White** (`#ffffff`) - Белый цвет

### Использование в CSS

```css
/* Через CSS переменные */
color: var(--color-primary);
background: var(--color-bg-dark);

/* Через Tailwind классы */
<div class="bg-primary text-white">
<div class="bg-dark text-white">
```

## Типографика

### Заголовки

| Элемент | Размер (Desktop) | Размер (Mobile) | Line Height |
|---------|------------------|-----------------|-------------|
| H1      | 44px (3.14em)    | 33px (2.36em)   | 1.32em      |
| H2      | 33px (2.36em)    | 25px (1.79em)   | 1.36em      |
| H3      | 25px (1.79em)    | 19px (1.36em)   | 1.5em       |
| H4      | 19px (1.36em)    | 19px (1.36em)   | 1.37em      |
| H5      | 14px (1em)       | 14px (1em)      | 1.86em      |
| H6      | 12px (0.86em)    | 12px (0.86em)   | 2.17em      |

### Текстовые стили

- **Lead** - 19px, line-height 1.68em (для вводного текста)
- **Body** - 14px, line-height 1.86em (основной текст)
- **Small** - 12px, line-height 1.86em (мелкий текст)

### Использование

```html
<h1>Главный заголовок</h1>
<h2 class="h2">Заголовок секции</h2>
<p class="lead">Вводный текст</p>
<p>Основной текст</p>
<small>Мелкий текст</small>
```

## Отступы

Базовый отступ: `0.25rem` (4px)

Стандартные отступы:
- `--spacing-xs`: 0.5rem (8px)
- `--spacing-sm`: 1rem (16px)
- `--spacing-md`: 1.5rem (24px)
- `--spacing-lg`: 2rem (32px)
- `--spacing-xl`: 3rem (48px)
- `--spacing-2xl`: 4rem (64px)

## Система контейнеров (как в Bootstrap 3)

Контейнер `.container` имеет **фиксированную ширину** на разных размерах экрана, как в оригинальной теме Stack на Bootstrap 3:

| Размер экрана | Ширина контейнера |
|---------------|-------------------|
| < 768px (мобильные) | 100% |
| >= 768px (планшеты) | 750px |
| >= 992px (ноутбуки) | 970px |
| >= 1200px (большие мониторы) | 1170px |

**Padding:** 15px с каждой стороны (как в Bootstrap 3)

**Стандартный паттерн для секций:**
```html
<section class="bg-white py-16 md:py-24">
    <div class="container">
        <!-- Контент здесь -->
    </div>
</section>
```

**Важно:** Используйте только класс `container` без дополнительных `mx-auto` или `px-4` — они уже включены в стили контейнера.

Эта система обеспечивает единообразную ширину для всех блоков:
- Верхнее меню (header)
- Первый экран (hero)
- Изготовление
- Доставка
- Оплата
- Преимущества
- Вопросы и ответы
- Примеры

## Кнопка "Наверх"

На всех страницах для ПК (lg и выше) должна быть кнопка "Наверх" для быстрого возврата к началу страницы.

**Стандартная реализация:**
```html
<!-- Кнопка "Наверх" (для ПК) -->
<a href="#" id="back-to-top" class="hidden lg:flex fixed bottom-24 right-6 w-12 h-12 items-center justify-center rounded-full bg-gray-700 hover:bg-primary transition-colors z-50 opacity-0 pointer-events-none" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-white">
        <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</a>
```

**JavaScript для показа/скрытия кнопки:**
```javascript
(function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                backToTopButton.classList.add('opacity-100');
            } else {
                backToTopButton.classList.add('opacity-0', 'pointer-events-none');
                backToTopButton.classList.remove('opacity-100');
            }
        }
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Initial call
    }
})();
```

Кнопка появляется при прокрутке страницы вниз более чем на 300px.

## Границы и радиусы

- `--border-radius-sm`: 4px
- `--border-radius-md`: 6px (стандарт для кнопок)
- `--border-radius-lg`: 8px
- `--border-radius-full`: 9999px (круглые элементы)

## Брейкпоинты

- Mobile: до 767px
- Tablet: до 990px
- Desktop: от 1024px

## Переходы

- Fast: 150ms
- Normal: 300ms (стандарт)
- Slow: 500ms

## Примеры использования

### Кнопка

```html
<a href="#" class="btn btn--primary">
  <span class="btn__text">Заказать</span>
</a>
```

### Карточка

```html
<div class="boxed boxed--border bg-white">
  <h3 class="h4 text-dark">Заголовок</h3>
  <p class="text-body">Описание</p>
</div>
```

### Секция

```html
<section class="bg-dark py-16 md:py-24">
  <div class="container">
    <h2 class="h2 text-white">Заголовок секции</h2>
  </div>
</section>
```

## SEO и индексация

**По умолчанию все страницы закрыты от индексации поисковыми системами** во время разработки.

**Стандартный мета-тег в `<head>`:**
```html
<!-- Закрыто от индексации во время разработки -->
<meta name="robots" content="noindex, nofollow">
```

**Важно:** Перед публикацией на продакшн необходимо:
1. Удалить или закомментировать этот мета-тег
2. Или заменить на `<meta name="robots" content="index, follow">` для разрешения индексации

Это правило применяется ко всем страницам проекта по умолчанию для предотвращения индексации тестовых/разрабатываемых версий сайта.


