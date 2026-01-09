# Интеграция в 1С-Битрикс

Документация для программиста по интеграции статических HTML страниц в 1С-Битрикс.

## Содержание

1. [Структура проекта](#структура-проекта)
2. [Компоненты](#компоненты)
3. [Шаблоны](#шаблоны)
4. [Интеграция компонентов](#интеграция-компонентов)
5. [Рекомендации](#рекомендации)

---

## Структура проекта

### Текущая структура

```
tailwind-project/
├── src/
│   ├── design-system/          # Дизайн-система
│   │   ├── tokens.css          # CSS переменные
│   │   └── typography.css      # Типографика
│   ├── components/             # Переиспользуемые компоненты
│   │   ├── header/
│   │   ├── footer/
│   │   ├── buttons/
│   │   ├── cards/
│   │   └── sections/
│   ├── templates/              # Шаблоны страниц
│   │   ├── base.html
│   │   ├── category.html
│   │   ├── product.html
│   │   └── info.html
│   ├── html/                   # Готовые HTML страницы
│   └── input.css               # Главный CSS файл
└── docs/                       # Документация
```

### Структура для Битрикса

Рекомендуемая структура в Битриксе:

```
local/
├── templates/
│   └── muse/                    # Шаблон сайта
│       ├── header.php          # Шапка сайта
│       ├── footer.php          # Футер сайта
│       ├── components/         # Компоненты
│       │   ├── buttons/
│       │   ├── cards/
│       │   └── sections/
│       └── styles.css          # Скомпилированный CSS
└── modules/
    └── muse/                    # Кастомный модуль (если нужен)
```

---

## Компоненты

### Структура компонентов

Все компоненты находятся в `src/components/` и готовы к интеграции.

### Header (Шапка сайта)

**Файл:** `src/components/header/header.html`

**Интеграция в Битрикс:**

1. Создайте `local/templates/muse/header.php`
2. Скопируйте HTML из `header.html`
3. Замените статические ссылки на функции Битрикса:

```php
<?php
// Вместо статических ссылок
<a href="https://muse.ooo/pechat/">

// Используйте
<a href="<?=SITE_DIR?>pechat/">
```

4. Добавьте подключение CSS:

```php
<?php
use Bitrix\Main\Page\Asset;
Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . '/styles.css');
?>
```

### Footer (Футер)

**Файл:** `src/components/footer/footer.html`

**Интеграция:** Аналогично Header

### Кнопки

**Файл:** `src/components/buttons/button.html`

**Использование:** Можно создать PHP-функцию для генерации кнопок:

```php
function renderButton($text, $link, $variant = 'primary') {
    $class = $variant === 'primary' ? 'btn btn--primary' : 'btn bg-dark';
    return "<a href=\"{$link}\" class=\"{$class} type--uppercase\">
        <span class=\"btn__text\">{$text}</span>
    </a>";
}
```

### Карточки

**Файлы:** `src/components/cards/*.html`

**Интеграция:** Создайте компоненты Битрикса или PHP-функции для генерации карточек:

```php
function renderProductCard($product) {
    return "
    <div class=\"feature feature-1\">
        <a href=\"{$product['LINK']}\" class=\"block\">
            <img src=\"{$product['IMAGE']}\" alt=\"{$product['NAME']}\" class=\"w-full h-auto rounded-t\">
            <div class=\"boxed feature__body bg-dark rounded-b\">
                <span class=\"h4 text-white block mb-2\">{$product['NAME']}</span>
                <p class=\"text-primary\">Подробнее</p>
            </div>
        </a>
    </div>
    ";
}
```

---

## Шаблоны

### Базовый шаблон

**Файл:** `src/templates/base.html`

**Интеграция в Битрикс:**

Создайте `local/templates/muse/template.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<main class="main-container">
    <?php $APPLICATION->IncludeComponent(
        "bitrix:main.include",
        "",
        Array(
            "AREA_FILE_SHOW" => "file",
            "PATH" => SITE_DIR."include/content.php"
        )
    );?>
</main>

<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
?>
```

### Шаблон категории

**Файл:** `src/templates/category.html`

**Использование:** Для страниц разделов каталога

**Интеграция:**

1. Создайте шаблон раздела каталога
2. Используйте компонент `bitrix:catalog.section`
3. Примените стили из шаблона

### Шаблон товара

**Файл:** `src/templates/product.html`

**Использование:** Для страниц элементов каталога

**Интеграция:**

1. Создайте шаблон элемента каталога
2. Используйте компонент `bitrix:catalog.element`
3. Примените стили из шаблона

---

## Интеграция компонентов

### CSS

1. **Скомпилируйте CSS:**
   - Используйте Tailwind CLI для компиляции `input.css`
   - Или используйте готовый `output.css`

2. **Подключите в шаблоне:**
```php
<?php
use Bitrix\Main\Page\Asset;
Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . '/styles.css');
?>
```

3. **Минификация (опционально):**
   - Минифицируйте CSS для продакшена
   - Используйте `Asset::getInstance()->addCss()` с параметром минификации

### JavaScript

1. **Мобильное меню:**
   - Скрипт `@tailwindplus/elements` уже настроен на ленивую загрузку
   - Оставьте как есть или перенесите в отдельный файл

2. **Карусели:**
   - JavaScript для каруселей уже встроен в CSS
   - Дополнительных скриптов не требуется

### Изображения

1. **Пути к изображениям:**
   - Замените абсолютные пути на относительные или используйте функции Битрикса
   - Используйте `CFile::GetPath()` для изображений из инфоблоков

2. **Оптимизация:**
   - Используйте WebP формат
   - Применяйте `loading="lazy"` для изображений ниже первого экрана

---

## Рекомендации

### 1. Используйте компоненты Битрикса

Где возможно, используйте стандартные компоненты Битрикса:
- `bitrix:menu` для навигации
- `bitrix:catalog.section` для категорий
- `bitrix:catalog.element` для товаров

### 2. Сохраните структуру компонентов

Сохраните структуру папок `components/` для удобства поддержки:
```
local/templates/muse/components/
├── buttons/
├── cards/
└── sections/
```

### 3. Используйте CSS переменные

Все цвета и размеры определены в `design-system/tokens.css` через CSS переменные. Используйте их для консистентности.

### 4. Адаптивность

Все компоненты уже адаптивны. Убедитесь, что в Битриксе:
- Viewport meta тег настроен правильно
- Медиа-запросы работают корректно

### 5. Производительность

- Минифицируйте CSS для продакшена
- Используйте кеширование
- Оптимизируйте изображения
- Используйте lazy loading для изображений

### 6. SEO

- Используйте правильные заголовки (h1, h2, h3)
- Заполняйте meta-теги через Битрикс
- Используйте семантическую разметку

---

## Примеры интеграции

### Пример 1: Header с меню Битрикса

```php
<?php
// local/templates/muse/header.php
?>
<header class="bg-dark sticky top-0 z-50">
    <nav aria-label="Основная навигация" class="mx-auto flex max-w-7xl items-center justify-between gap-x-4 py-5 px-4 lg:px-8">
        <!-- Логотип -->
        <div class="flex-shrink-0">
            <a href="<?=SITE_DIR?>" class="-m-1.5 p-1.5 flex items-center">
                <!-- SVG логотипа -->
            </a>
        </div>
        
        <!-- Меню через компонент Битрикса -->
        <?php $APPLICATION->IncludeComponent(
            "bitrix:menu",
            "top",
            Array(
                "ROOT_MENU_TYPE" => "top",
                "MAX_LEVEL" => "1",
                "CHILD_MENU_TYPE" => "left",
                "USE_EXT" => "N",
                "MENU_CACHE_TYPE" => "N",
                "MENU_CACHE_TIME" => "3600",
                "MENU_CACHE_USE_GROUPS" => "Y",
                "MENU_CACHE_GET_VAR" => ""
            )
        );?>
    </nav>
</header>
```

### Пример 2: Карточка товара из каталога

```php
<?php
// В шаблоне элемента каталога
$arResult = $arResult['ELEMENT']; // Данные элемента
?>
<div class="feature feature-1">
    <a href="<?=$arResult['DETAIL_PAGE_URL']?>" class="block">
        <img 
            src="<?=CFile::GetPath($arResult['PREVIEW_PICTURE'])?>" 
            alt="<?=$arResult['NAME']?>" 
            class="w-full h-auto rounded-t"
        >
        <div class="boxed feature__body bg-dark rounded-b">
            <span class="h4 text-white block mb-2"><?=$arResult['NAME']?></span>
            <p class="text-primary">Подробнее</p>
        </div>
    </a>
</div>
```

---

## Вопросы и поддержка

При возникновении вопросов:
1. Обратитесь к документации компонентов в `docs/COMPONENTS.md`
2. Проверьте примеры в `src/html/`
3. Изучите дизайн-систему в `docs/DESIGN_SYSTEM.md`

---

## Чеклист интеграции

- [ ] CSS скомпилирован и подключен
- [ ] Header интегрирован с меню Битрикса
- [ ] Footer интегрирован
- [ ] Компоненты адаптированы под данные Битрикса
- [ ] Изображения загружаются из инфоблоков
- [ ] Адаптивность проверена
- [ ] Производительность оптимизирована
- [ ] SEO настройки применены










