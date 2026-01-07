# Каталог компонентов Muse

Полный каталог всех переиспользуемых компонентов проекта с примерами использования.

## Содержание

1. [Кнопки](#кнопки)
2. [Карточки](#карточки)
3. [Секции](#секции)
4. [Header и Footer](#header-и-footer)

---

## Кнопки

### Button (Кнопка)

**Расположение:** `src/components/buttons/button.html`

**Варианты:**
- Primary (основная) - синяя кнопка
- Dark (темная) - темная кнопка на светлом фоне
- Full width (полная ширина)
- Small (маленькая)

**Пример использования:**

```html
<!-- Primary кнопка -->
<a href="https://muse.ooo/order/" class="btn btn--primary type--uppercase">
  <span class="btn__text">Заказать</span>
</a>

<!-- Dark кнопка -->
<a href="#callback" class="btn bg-dark type--uppercase">
  <span class="btn__text">Обратный звонок</span>
</a>
```

**Характеристики:**
- Padding: 6.5px вертикально, 26px горизонтально
- Border radius: 6px
- Transition: 300ms
- Hover эффект: изменение цвета фона

**Документация:** См. `src/components/buttons/button.html`

---

## Карточки

### Feature Card (Карточка преимущества)

**Расположение:** `src/components/cards/feature-card.html`

**Использование:** Для отображения преимуществ, особенностей, услуг

**Пример:**

```html
<div class="flex flex-col boxed boxed--border bg-white">
  <dt class="text-base/7 font-normal text-dark">
    <div class="mb-6 flex size-10 items-center justify-start">
      <!-- SVG иконка -->
      <svg height="32" viewBox="0 0 32 32" width="32" class="text-primary">
        <path d="..." fill="currentColor"></path>
      </svg>
    </div>
    <span class="lead text-dark">Название преимущества</span>
  </dt>
</div>
```

**Характеристики:**
- Padding: 26px (desktop), 17px (mobile)
- Border: 1px solid #ececec
- Иконка: 32x32px, цвет primary

**Документация:** См. `src/components/cards/feature-card.html`

---

### Product Card (Карточка товара)

**Расположение:** `src/components/cards/product-card.html`

**Использование:** Для отображения товаров, услуг, продуктов

**Пример:**

```html
<div class="feature feature-1">
  <a href="/link/" class="block">
    <img 
      alt="Описание" 
      title="Название" 
      loading="lazy" 
      src="image.webp" 
      width="330" 
      height="330" 
      class="w-full h-auto rounded-t"
    >
    <div class="boxed feature__body bg-dark rounded-b">
      <span class="h4 text-white block mb-2">Название товара</span>
      <p class="text-primary">Подробнее</p>
    </div>
  </a>
</div>
```

**Характеристики:**
- Изображение: скругление только сверху
- Размер изображения: рекомендуется 330x330px
- Body: темный фон, скругление снизу

**Документация:** См. `src/components/cards/product-card.html`

---

### Blog Card (Карточка статьи)

**Расположение:** `src/components/cards/blog-card.html`

**Использование:** Для отображения статей блога

**Пример:**

```html
<article class="feature feature-1">
  <a href="/blog/article/" class="block">
    <img src="image.webp" alt="..." class="w-full h-auto rounded-t">
    <div class="boxed feature__body bg-white rounded-b">
      <h3 class="h4 text-dark block mb-2">Заголовок статьи</h3>
      <p class="text-body mb-2">Краткое описание...</p>
      <p class="text-primary text-sm">Читать далее</p>
    </div>
  </a>
</article>
```

**Документация:** См. `src/components/cards/blog-card.html`

---

## Секции

### Hero Video (Hero с видео)

**Расположение:** `src/components/sections/hero-video.html`

**Использование:** Главная секция страницы с видео на фоне

**Пример:**

```html
<section class="relative h-[65vh] md:h-screen overflow-hidden bg-dark">
  <video class="absolute inset-0 w-full h-full object-cover hidden md:block" autoplay loop muted playsinline>
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
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

**Документация:** См. `src/components/sections/hero-video.html`

---

### Hero Image (Hero с изображением)

**Расположение:** `src/components/sections/hero-image.html`

**Использование:** Главная секция страницы с изображением на фоне

**Документация:** См. `src/components/sections/hero-image.html`

---

### Promo Banner (Промо-баннер)

**Расположение:** `src/components/sections/promo-banner.html`

**Использование:** Для акций, скидок, важных объявлений

**Пример:**

```html
<section class="bg-primary text-white py-6">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-center">
      <p class="lead">Скидка 20% с 3 по 4 января</p>
    </div>
  </div>
</section>
```

**Характеристики:**
- Padding: py-6 (24px) - соответствует высоте меню
- Фон: обычно primary (синий)

**Документация:** См. `src/components/sections/promo-banner.html`

---

### Advantages (Секция преимуществ)

**Расположение:** `src/components/sections/advantages.html`

**Использование:** Для отображения списка преимуществ

**Пример:**

```html
<section class="bg-secondary py-16 md:py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl mb-12 text-center">
      <h2 class="h2 text-dark">Преимущества</h2>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        <!-- Используйте feature-card.html для каждого преимущества -->
      </dl>
    </div>
  </div>
</section>
```

**Документация:** См. `src/components/sections/advantages.html`

---

### Carousel (Карусель)

**Расположение:** `src/components/sections/carousel.html`

**Использование:** Для горизонтальной прокрутки товаров, портретов

**Пример:**

```html
<section class="bg-dark py-16">
  <div class="container mx-auto px-4 mb-8">
    <div class="text-center">
      <h2 class="text-white">
        <a href="/link/" class="text-white hover:text-primary">Заголовок</a>
      </h2>
    </div>
  </div>
  <div class="carousel-scroll pb-4">
    <div class="flex gap-4 px-4" style="min-width: max-content;">
      <!-- Элементы карусели -->
    </div>
  </div>
</section>
```

**Характеристики:**
- Прокрутка: touch на мобильных, wheel + drag на десктопе
- Элементы: фиксированная ширина 223px

**Документация:** См. `src/components/sections/carousel.html`

---

### CTA (Call to Action)

**Расположение:** `src/components/sections/cta.html`

**Использование:** Призыв к действию в конце страницы

**Пример:**

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

**Документация:** См. `src/components/sections/cta.html`

---

## Header и Footer

### Header (Шапка сайта)

**Расположение:** `src/components/header/header.html`

**Использование:** Вставляется в начало body каждой страницы

**Характеристики:**
- Sticky позиционирование
- Десктопное и мобильное меню
- Логотип, навигация, поиск, телефон, кнопка заказа

**Документация:** См. `src/components/header/header.html`

---

### Footer (Футер сайта)

**Расположение:** `src/components/footer/footer.html`

**Использование:** Вставляется перед закрывающим `</body>`

**Характеристики:**
- Навигационные ссылки
- Соцсети (WhatsApp, VK)
- Контакты и реквизиты
- Юридические ссылки

**Документация:** См. `src/components/footer/footer.html`

---

## Как использовать компоненты

### Шаг 1: Выберите компонент

Найдите нужный компонент в каталоге выше или в папке `src/components/`.

### Шаг 2: Откройте файл компонента

Откройте файл компонента (например, `src/components/buttons/button.html`).

### Шаг 3: Скопируйте нужный вариант

В каждом файле компонента есть несколько вариантов. Выберите подходящий и скопируйте его.

### Шаг 4: Вставьте в вашу страницу

Вставьте скопированный код в нужное место вашей HTML страницы.

### Шаг 5: Настройте параметры

Замените:
- Тексты
- Ссылки
- Изображения
- Другие параметры

### Шаг 6: Проверьте результат

Откройте страницу в браузере и проверьте:
- Внешний вид
- Адаптивность на мобильных
- Работоспособность ссылок

---

## Рекомендации

1. **Всегда используйте готовые компоненты** вместо создания новых с нуля
2. **Следуйте структуре** компонентов при создании похожих элементов
3. **Проверяйте адаптивность** на мобильных устройствах
4. **Используйте правильные классы** из дизайн-системы
5. **Оптимизируйте изображения** (WebP формат, loading="lazy")

---

## Дополнительные ресурсы

- [Дизайн-система](./DESIGN_SYSTEM.md) - цвета, типографика, отступы
- [Шаблоны страниц](./TEMPLATES.md) - готовые шаблоны для разных типов страниц
- [Инструкция по созданию страниц](./HOW_TO_CREATE_PAGE.md) - пошаговое руководство




