# Дизайн-система Muse

Полное описание дизайн-системы проекта Muse, основанной на теме Stack.

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

### Примеры

```html
<!-- Главный заголовок -->
<h1>Создай своё произведение искусства</h1>

<!-- Заголовок секции -->
<h2 class="h2">Преимущества</h2>

<!-- Вводный текст -->
<p class="lead">Картины по фото: портреты маслом и печать на холсте</p>

<!-- Основной текст -->
<p>Мы предлагаем высококачественную печать на холсте для ваших любимых снимков.</p>

<!-- Мелкий текст -->
<small>Дополнительная информация</small>
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

### Кнопки

#### Варианты кнопок

```html
<!-- Primary кнопка (основная) -->
<a href="#" class="btn btn--primary type--uppercase">
  <span class="btn__text">Заказать</span>
</a>

<!-- Dark кнопка (на светлом фоне) -->
<a href="#" class="btn bg-dark type--uppercase">
  <span class="btn__text">Обратный звонок</span>
</a>
```

**Характеристики:**
- Padding: 6.5px вертикально, 26px горизонтально
- Border radius: 6px
- Transition: 300ms
- Hover эффект: изменение цвета фона

### Карточки

#### Feature Card (карточка преимущества)

```html
<div class="flex flex-col boxed boxed--border bg-white">
  <div class="mb-6 flex size-10 items-center justify-start">
    <!-- Иконка -->
    <svg>...</svg>
  </div>
  <span class="lead text-dark">Собственное производство</span>
</div>
```

**Характеристики:**
- Padding: 26px (desktop), 17px (mobile)
- Border: 1px solid #ececec
- Border radius: 6px (верхние углы для изображения)
- Margin bottom: 30px (desktop), 15px (mobile)

#### Product Card (карточка товара)

```html
<div class="feature feature-1">
  <a href="#" class="block">
    <img src="..." class="w-full h-auto rounded-t">
    <div class="boxed feature__body bg-dark rounded-b">
      <span class="h4 text-white block mb-2">Название товара</span>
      <p class="text-primary">Подробнее</p>
    </div>
  </a>
</div>
```

### Секции

#### Hero секция (с видео)

```html
<section class="relative h-[65vh] md:h-screen overflow-hidden bg-dark">
  <video class="absolute inset-0 w-full h-full object-cover hidden md:block" autoplay loop muted playsinline>
    <source src="..." type="video/webm">
  </video>
  <div class="absolute inset-0 bg-dark opacity-20"></div>
  <div class="container mx-auto px-4 h-full flex items-center relative z-10">
    <div class="max-w-2xl">
      <p class="h1 text-white mb-4">Заголовок</p>
      <h1 class="lead text-white mb-8">Подзаголовок</h1>
      <a href="#" class="btn btn--primary type--uppercase">
        <span class="btn__text">Кнопка</span>
      </a>
    </div>
  </div>
</section>
```

**Характеристики:**
- Высота: 65vh на мобильных, 100vh на десктопе
- Видео скрыто на мобильных
- Подложка: темный фон с opacity 20%

#### Секция преимуществ

```html
<section class="bg-secondary py-16 md:py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl mb-12 text-center">
      <h2 class="h2 text-dark">Преимущества</h2>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Карточки преимуществ -->
    </div>
  </div>
</section>
```

#### CTA секция

```html
<section class="bg-secondary py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:justify-between lg:px-8">
    <h2 class="max-w-2xl h4 font-normal tracking-tight text-gray-900">
      Создай своё произведение искусства
    </h2>
    <div class="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
      <a href="#" class="btn btn--primary type--uppercase">Заказать</a>
      <a href="#" class="btn bg-dark type--uppercase">Обратный звонок</a>
    </div>
  </div>
</section>
```

#### Промо-баннер

```html
<section class="bg-primary text-white py-6">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-center">
      <p class="lead">Скидка 20% с 3 по 4 января</p>
    </div>
  </div>
</section>
```

---

## Примеры использования

### Полная страница

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Заголовок страницы</title>
  <link rel="stylesheet" href="css/output.css">
</head>
<body class="bg-white">
  <!-- Header -->
  <header class="bg-dark sticky top-0 z-50">...</header>
  
  <!-- Hero -->
  <section class="relative h-[65vh] md:h-screen...">...</section>
  
  <!-- Промо-баннер -->
  <section class="bg-primary text-white py-6">...</section>
  
  <!-- Контент -->
  <main>
    <section class="bg-secondary py-16 md:py-24">...</section>
  </main>
  
  <!-- Footer -->
  <footer class="bg-dark text-white py-8 md:py-12">...</footer>
</body>
</html>
```

---

## Контрольный список для создания страницы

- [ ] Использовать правильные цвета из палитры
- [ ] Применить правильную типографику (h1-h6, lead, body)
- [ ] Использовать систему отступов (p-4, py-16, gap-8)
- [ ] Проверить адаптивность на мобильных
- [ ] Использовать готовые компоненты (кнопки, карточки)
- [ ] Проверить контрастность текста на фонах
- [ ] Убедиться в правильности радиусов скругления

---

## Дополнительные ресурсы

- [Файл токенов](../src/design-system/tokens.css)
- [Типографика](../src/design-system/typography.css)
- [Каталог компонентов](./COMPONENTS.md)




