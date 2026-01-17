# Аудит страницы контактов (kontakty.html)

## 📋 Общая информация

**Файл:** `tailwind-project/src/html/info/kontakty.html`  
**Дата проверки:** 2024  
**Статус:** Требуются исправления

---

## ❌ Нарушения дизайн-системы

### 1. Кастомный CSS вместо чистого Tailwind

#### Проблема: Дублирование `.container`
**Строки 29-38:**
```css
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
```

**Решение:** Удалить этот CSS, т.к. контейнер уже настроен в Tailwind config (строки 92-98).

---

#### Проблема: Кастомные стили для `.breadcrumbs`
**Строки 48-50:**
```css
.breadcrumbs { font-size: 0.875rem; color: #9ca3af; }
.breadcrumbs a { color: #9ca3af; text-decoration: none; }
.breadcrumbs a:hover { text-decoration: underline; }
```

**Решение:** Использовать классы Tailwind из дизайн-системы:
```html
<nav class="text-sm text-gray-400 mb-4" aria-label="Хлебные крошки">
```

**Текущий код (строка 221):**
```html
<nav class="breadcrumbs mb-4" aria-label="Хлебные крошки">
```

**Должно быть:**
```html
<nav class="text-sm text-gray-400 mb-4" aria-label="Хлебные крошки">
```

И убрать класс `breadcrumbs` из HTML.

---

#### Проблема: Кастомный `.sr-only`
**Строки 53-63:**
```css
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
```

**Решение:** Использовать встроенный класс Tailwind `sr-only` (уже доступен в Tailwind CDN).

**Текущий код (строки 154, 181):**
```html
<span class="sr-only">Открыть меню</span>
```

Это уже правильно, но нужно удалить кастомный CSS.

---

#### Проблема: Кастомные стили для табов
**Строки 65-84:**
```css
.tab-btn {
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}
.tab-btn.active {
    border-bottom-color: var(--primary);
    color: var(--dark);
}
.tab-content {
    display: none;
    animation: fadeIn 0.3s ease-in-out;
}
.tab-content.active {
    display: block;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

**Решение:** Перевести на чистый Tailwind (см. раздел "Новый компонент: Tabs" ниже).

---

### 2. Несоответствие типографики

#### Проблема: H1 использует неправильные классы
**Строка 231:**
```html
<h1 class="text-4xl lg:text-5xl text-dark">Контакты</h1>
```

**По дизайн-системе должно быть:**
```html
<h1 class="text-4xl lg:text-6xl font-light text-dark">Контакты</h1>
```

**Проблемы:**
- Отсутствует `font-light` (обязательно для H1)
- Размер на десктопе должен быть `lg:text-6xl`, а не `lg:text-5xl`

---

### 3. Несоответствие отступов секций

#### Проблема: Hero секция использует неправильные отступы
**Строка 217:**
```html
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
```

**По дизайн-системе должно быть:**
```html
<section class="pt-8 pb-8 lg:pt-12 lg:pb-12 bg-secondary">
```

✅ Это правильно для Hero секции с breadcrumbs.

---

#### Проблема: Основная секция использует правильные отступы
**Строка 236:**
```html
<section class="py-12 lg:py-16 bg-white">
```

**По дизайн-системе должно быть:**
```html
<section class="py-16 lg:py-24 bg-white">
```

**Проблемы:**
- Мобильные: `py-12` (48px) вместо `py-16` (64px)
- Десктоп: `lg:py-16` (64px) вместо `lg:py-24` (96px)

---

### 4. Использование CSS переменных в inline стилях

#### Проблема: CSS переменные определены, но не используются в Tailwind
**Строки 15-21:**
```css
:root {
    --primary: #4A90E2;
    --primary-hover: #609DE6;
    --dark: #252525;
    --body: #666666;
    --secondary: #FAFAFA;
}
```

Эти переменные определены, но в кастомном CSS для табов используется `var(--primary)` и `var(--dark)`, что не соответствует подходу чистого Tailwind.

---

## ✅ Что сделано правильно

1. ✅ Использование `container` класса из Tailwind config
2. ✅ Правильные цвета из палитры (primary, dark, body, secondary)
3. ✅ Правильная структура Header и Footer
4. ✅ Правильное использование breadcrumbs (только нужно убрать кастомный CSS)
5. ✅ Правильная адаптивность (responsive классы)

---

## 🆕 Новый компонент: Tabs (Табы)

Табы используются на странице контактов, но отсутствуют в дизайн-системе. **Рекомендуется добавить в дизайн-систему.**

### Текущая реализация (с кастомным CSS)

**HTML (строки 239-252):**
```html
<div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
    <button 
        class="tab-btn active px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none" 
        data-tab="moscow"
    >
        Москва
    </button>
    <button 
        class="tab-btn px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none" 
        data-tab="spb"
    >
        Санкт-Петербург
    </button>
</div>

<div id="moscow" class="tab-content active">
    <!-- Контент -->
</div>
<div id="spb" class="tab-content">
    <!-- Контент -->
</div>
```

**CSS (строки 65-84):**
```css
.tab-btn {
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}
.tab-btn.active {
    border-bottom-color: var(--primary);
    color: var(--dark);
}
.tab-content {
    display: none;
    animation: fadeIn 0.3s ease-in-out;
}
.tab-content.active {
    display: block;
}
```

### Предлагаемая реализация на чистом Tailwind

**HTML:**
```html
<!-- Навигация табов -->
<div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors active:border-primary active:text-dark" 
        data-tab="moscow"
    >
        Москва
    </button>
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors active:border-primary active:text-dark" 
        data-tab="spb"
    >
        Санкт-Петербург
    </button>
</div>

<!-- Контент табов -->
<div id="moscow" class="tab-content block">
    <!-- Контент -->
</div>
<div id="spb" class="tab-content hidden">
    <!-- Контент -->
</div>
```

**JavaScript (минимальный, без изменений):**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убрать active у всех кнопок
            tabBtns.forEach(b => {
                b.classList.remove('border-primary', 'text-dark');
                b.classList.add('border-transparent');
            });
            // Добавить active к кликнутой кнопке
            btn.classList.add('border-primary', 'text-dark');
            btn.classList.remove('border-transparent');

            // Скрыть весь контент
            tabContents.forEach(content => content.classList.add('hidden'));
            tabContents.forEach(content => content.classList.remove('block'));
            
            // Показать целевой контент
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('block');
            }
        });
    });
});
```

**Проблема с текущим подходом:** Использование класса `active` требует кастомного CSS. В чистом Tailwind нужно использовать условные классы через JavaScript.

**Альтернативное решение (рекомендуется):**
Использовать data-атрибуты и CSS селекторы:

**HTML:**
```html
<div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors data-[active=true]:border-primary data-[active=true]:text-dark" 
        data-tab="moscow"
        data-active="true"
    >
        Москва
    </button>
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors data-[active=true]:border-primary data-[active=true]:text-dark" 
        data-tab="spb"
        data-active="false"
    >
        Санкт-Петербург
    </button>
</div>

<div id="moscow" class="tab-content block">
    <!-- Контент -->
</div>
<div id="spb" class="tab-content hidden">
    <!-- Контент -->
</div>
```

**JavaScript:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убрать active у всех
            tabBtns.forEach(b => b.setAttribute('data-active', 'false'));
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('block');
            });
            
            // Добавить active к кликнутой
            btn.setAttribute('data-active', 'true');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('block');
            }
        });
    });
});
```

**Минимальный CSS (если нужна анимация):**
```css
.tab-content {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

---

## 📝 Рекомендации для дизайн-системы

### Добавить компонент "Tabs"

**Раздел:** Интерактивные компоненты

**Описание:** Табы для переключения между разделами контента (например, Москва/Санкт-Петербург на странице контактов).

**Характеристики:**
- Навигация: горизонтальная полоса с кнопками
- Активная вкладка: синяя нижняя граница (`border-primary`)
- Контент: показывается/скрывается через классы `block`/`hidden`
- Анимация: опциональная fade-in анимация

**Пример использования:**
```html
<!-- Навигация -->
<div class="flex border-b border-gray-200 mb-8 overflow-x-auto">
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors data-[active=true]:border-primary data-[active=true]:text-dark" 
        data-tab="tab1"
        data-active="true"
    >
        Вкладка 1
    </button>
    <button 
        class="px-6 py-3 text-lg font-medium text-body hover:text-dark focus:outline-none border-b-2 border-transparent transition-colors data-[active=true]:border-primary data-[active=true]:text-dark" 
        data-tab="tab2"
        data-active="false"
    >
        Вкладка 2
    </button>
</div>

<!-- Контент -->
<div id="tab1" class="block">
    Контент вкладки 1
</div>
<div id="tab2" class="hidden">
    Контент вкладки 2
</div>
```

---

## 🔧 Список исправлений

### Критичные (обязательно исправить)

1. ✅ Удалить кастомный CSS для `.container` (строки 29-38)
2. ✅ Удалить кастомный CSS для `.breadcrumbs` (строки 48-50) и использовать Tailwind классы
3. ✅ Удалить кастомный CSS для `.sr-only` (строки 53-63)
4. ✅ Исправить H1: добавить `font-light` и изменить размер на `lg:text-6xl`
5. ✅ Исправить отступы секции: `py-12 lg:py-16` → `py-16 lg:py-24`
6. ✅ Перевести табы на чистый Tailwind (удалить кастомный CSS, использовать data-атрибуты)

### Рекомендуемые (улучшения)

7. Добавить компонент "Tabs" в дизайн-систему
8. Рассмотреть возможность использования `<details>` для мобильной версии табов (аккордеон)

---

## 📊 Итоговая оценка

| Критерий | Оценка | Комментарий |
|----------|--------|-------------|
| Соответствие дизайн-системе | ⚠️ 60% | Есть нарушения в типографике и отступах |
| Чистый Tailwind CSS | ❌ 40% | Много кастомного CSS, который можно заменить |
| Новые компоненты | ✅ 100% | Табы — хороший кандидат для дизайн-системы |
| Адаптивность | ✅ 100% | Правильно реализована |
| Доступность | ✅ 90% | Хорошо, но можно улучшить aria-атрибуты для табов |

**Общая оценка:** ⚠️ Требуются исправления перед использованием в продакшене.
