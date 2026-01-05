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
  <div class="container mx-auto px-4">
    <h2 class="h2 text-white">Заголовок секции</h2>
  </div>
</section>
```

