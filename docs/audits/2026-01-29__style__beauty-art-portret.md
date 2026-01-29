# Технический аудит страницы — соответствие правилам проекта

- Страница: `src/html/portret-na-zakaz/style/beauty-art-portret.html`
- Группа: style
- Эталон группы: `src/html/portret-na-zakaz/style/portret-maslom.html`
- Дата: 2026-01-29
- Версия аудита: v1.1

## Итог

- Статус: ⚠️ есть замечания
- Резюме (1–3 строки):
	- Найдены 2 системных точки риска: несовпадение canonical vs JSON-LD url, а также legacy-интерактив через inline `onclick` (OAuth + открытие `<dialog>`).
	- Есть отклонение от канона по подключению CSS (путь указывает на `src/css/output.css`, а не на `src/html/css/output.css`).

## Проверка по чек‑листу

### A. Структура страницы

- [x] `lang="ru"`, `meta charset`/`viewport` присутствуют.
- [x] Есть `title` и `meta name="description"`.
- [x] Есть `link rel="canonical"`.
- [!] `canonical` и URL в JSON‑LD расходятся:
	- canonical: `https://muse.ooo/portret-na-zakaz/style/beauty-art-portret/`
	- JSON‑LD `offers.url`: `https://muse.ooo/portret-na-zakaz/beauty-art-portret/`
- [x] `meta robots noindex, nofollow` присутствует (как временная защита до production).
- [~] Вложенные `.container` в проверенных блоках не обнаружены (точечно); при дальнейшей правке страницы держать правило под контролем.

### B. CSS и критический путь

- [x] Критический CSS минимальный (переменные + базовые стили + `.sr-only`).
- [!] Подключение основного CSS не по канону проекта: `href="../../../css/output.css"` ведёт в `src/css/output.css`, а канон для Live Server — `src/html/css/output.css`.

### C. Иконки / SVG

- [x] SVG используются inline.
- [!] В отчётах аудита не предлагать SVG‑спрайты/внешние SVG‑файлы как “оптимизацию по умолчанию”: текущий канон проекта — inline SVG.
- [~] Если вес HTML реально станет проблемой, рекомендация для страницы: оптимизировать сами inline SVG (упростить, прогнать через SVGO/скрипты проекта), а не менять подход.

### D. JS и интерактив

- [~] Порядок загрузки в целом рабочий, но есть отклонение от канона размещения:
	- `tailwindplus-elements.js` подключён в `<head>` (type="module"); по канону проекта предпочтительно держать подключение перед `</body>`.
- [x] `nav.js` подключён в конце страницы.
- [!] Если на странице обнаружен page-specific fallback для `el-tab-group` (например `ensureTabsFallback`) — по текущему решению проекта это **код-кандидат на удаление** (полагаемся на поддержку модулей и `tailwindplus-elements.js`).
- [!] На странице есть legacy inline‑интерактив:
	- `onclick="document.getElementById('review-modal').showModal()"`
	- OAuth авторизация через `onclick="BxPopup('https://...authorize?...client_id=...')"`
	Это допустимо как legacy (поддерживается `window.BxPopup` из `nav.js`), но при развитии проекта лучше постепенно переносить в централизованный JS.
- [!] `<dialog id="review-modal">` используется напрямую. Нужно подтвердить поддержку `HTMLDialogElement` (особенно Safari/мобильные), либо обеспечить fallback (через `el-dialog`/полифилл/альтернативное модальное решение).

### E. Ссылки и типографика

- [x] Общие правила ссылок визуально соблюдены (на уровне страницы).
- [x] Светло‑серый текст (`text-gray-300`) используется на тёмном фоне в модалке — читаемо; для текста на белом фоне по-прежнему избегать слишком светлого серого.

### F. Изображения и производительность

- [x] Hero изображение: `loading="eager"`, `decoding="async"`, `fetchpriority="high"`.
- [~] Есть preload hero: `<link rel="preload" as="image" ... fetchpriority="high">`.
	Рекомендация: перепроверить необходимость preload (DevTools/Lighthouse). Во многих случаях достаточно только `fetchpriority="high"`.

## Найденные проблемы (таблица)

| Severity | Что не так | Где (локализация) | Рекомендация (страница) | Рекомендация (документация) |
|---------|------------|-------------------|--------------------------|-----------------------------|
| ⚠️ | Несовпадение canonical и JSON‑LD url | `<head>`: `link[rel=canonical]` vs JSON‑LD `offers.url` | Привести к одному каноническому URL (и в canonical, и в JSON‑LD) | Уточнить в гайдлайне аудита: canonical и JSON‑LD должны совпадать |
| ⚠️ | Основной CSS подключён не из `src/html/css/output.css` | `<head>`: `link rel="stylesheet" href="../../../css/output.css"` | Перевести на путь до `src/html/css/output.css` (канон Live Server) | Явно закрепить в чек-листе аудита типичную ошибку путей |
| ⚠️ | Legacy inline `onclick` (OAuth + open `<dialog>`) | Блок «Отзывы» и кнопки OAuth | По возможности переносить в `nav.js`/централизованный код; не добавлять новый inline‑JS | Добавить в аудит-инструкцию трактовку “legacy inline onclick допустим, но отмечать” |
| ⚠️ | Риск несовместимости `<dialog>` | `<dialog id="review-modal">` + `showModal()` | Подтвердить браузерную поддержку или добавить fallback | Уточнить, что “a11y-обёртка в nav.js” ≠ “полифилл `<dialog>`” |
| ⚠️ | OAuth URLs и state/check_key в статическом HTML | inline `onclick="BxPopup('https://...')"` | Проверить, что параметры актуальны/безопасны для публикации статикой (redirect_uri, state, check_key) | Добавить пункт аудита “секреты/токены в HTML не допускаются” (client_id сам по себе не секрет) |

## Рекомендации к документации (без внесения правок)

- [ ] docs/AUDIT_PAGE_COMPLIANCE.md — добавить явное правило: не рекомендовать SVG‑спрайты/внешние SVG, т.к. канон проекта — inline SVG.
- [ ] docs/AUDIT_PAGE_COMPLIANCE.md — уточнить трактовку inline‑JS: legacy inline `onclick` встречается, но новый inline‑JS не добавлять; в аудите отмечать и предлагать перенос.
- [ ] docs/AUDIT_PAGE_COMPLIANCE.md — уточнить, что “поддержка `<dialog>` в nav.js” не заменяет проверку совместимости/полифилла.