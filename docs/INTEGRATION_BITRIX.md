# Интеграция с Bitrix

## Общие сведения

Шаблоны подготовлены для интеграции с 1С-Битрикс. Все динамические элементы помечены комментариями или заглушками.

---

## Модальное окно отзывов (OAuth)

### Эталон
Файл: `src/html/portret-na-zakaz/style/portret-maslom.html`

На остальных страницах секция «Отзывы» упрощена до заглушки — при интеграции использовать структуру из эталона.

### BxPopup

В `src/html/js/nav.js` (строка 9) есть fallback-функция для OAuth popup:

```javascript
window.BxPopup = function(url, width, height) {
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    window.open(url, 'oauth', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
};
```

**Если Bitrix предоставляет свою реализацию `BxPopup`** — эту функцию можно удалить из `nav.js`.

### OAuth URL

В шаблоне используются плейсхолдеры:
- `YOUR_CLIENT_ID`
- `YOUR_REDIRECT_URI`

Bitrix должен генерировать актуальные URL с:
- Валидным `check_key` (сессионный токен)
- Правильным `backurl` (текущая страница)
- `code_challenge` для VK (PKCE)

### Паттерн onclick

```html
<a href="https://oauth.provider.ru/..." 
   onclick="if(typeof BxPopup==='function'){BxPopup(this.href, 680, 600); return false;}">
```

- Если `BxPopup` доступен — открывает popup
- Если нет — fallback на обычный переход по `href`

### Размеры popup по провайдерам

| Провайдер | Ширина | Высота |
|-----------|--------|--------|
| Яндекс | 680 | 600 |
| VK | 660 | 425 |
| Google | 580 | 400 |
| Mail.Ru | 580 | 400 |
| Одноклассники | 580 | 400 |

---

## Калькулятор цены

Секция `#calc` на страницах стилей содержит заглушку. Bitrix-компонент калькулятора вставляется вместо комментария:

```html
<section class="py-16 lg:py-20" id="calc">
    <div class="container">
        <h2>Цена</h2>
        <!-- Здесь будет калькулятор Bitrix -->
    </div>
</section>
```

---

## Галерея / Портфолио

Секции с `id="primery-portretov"` содержат заглушки для галерей из Bitrix.

---

## Отзывы из Bitrix

Список отзывов загружается динамически. Заглушка:

```html
<div class="text-center text-gray-500 py-8 mb-8">
    <p class="text-sm">Отзывы будут загружены из Bitrix</p>
</div>
```
