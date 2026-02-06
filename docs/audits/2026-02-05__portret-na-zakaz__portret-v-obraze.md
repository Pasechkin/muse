---
title: "Аудит — Портрет в образе (portret-v-obraze)"
date: 2026-02-05
source: src/html/portret-na-zakaz/style/portret-v-obraze.html
auditor: GitHub Copilot
---

**A. Базовая проверка**
- **Title:** Понятный и релевантный — OK.
- **Meta description:** Присутствует — OK.
- **Meta robots:** `noindex, nofollow` — страница закрыта от индексации (разработка). ACTION: убрать перед публикацией.
- **Canonical:** есть — OK.
- **lang:** `ru` в корне — OK.
- **CSS:** `:root` критический CSS inline (малый объем) + подключение `../../css/output.css` — архитектура соблюдена.

**B. Производительность / LCP**
- **Preload LCP:** `<link rel="preload" as="image" ... fetchpriority="high">` есть — положительно для LCP.
- **Hero image:** `width/height`, `loading="eager"`, `decoding="async"`, `fetchpriority="high"` — настроено для быстрого LКP.
- **Рекомендация:** добавить responsive `srcset`/`sizes` и варианты WebP/AVIF для разных плотностей, либо убедиться, что предзагружаемый файл — именно тот, который браузер отдаёт как LCP.
- **Скрипты:** `nav.js` загружается с `defer` — OK. Все Bitrix-виджеты — placeholder'ы (динамика) — ACTION: лениво инициализировать их через IntersectionObserver.

**C. Доступность (A11y)**
- **ARIA / навигация:** `aria-label` у кнопок, `sr-only` у ссылок — положительно.
- **Клавиатурная доступность:** модальные/слайдеры используют кнопки — проверить фокус-менеджмент для back-to-top и видео-контрола.
- **Контраст:** текст на `.bg-dark` и `text-gray-300` может иметь недостаточный контраст на некоторых экранах — ACTION: проверить WCAG contrast.

**D. SEO / Structured Data**
- **JSON-LD Product:** присутствует с `offers` и `aggregateRating` — хорошо. Проверить актуальность `price` и сроков (`priceValidUntil`).
- **BreadcrumbList:** присутствует — OK.
- **SEO note:** убрать `noindex` перед выкатом; проверить микроданные на валидность через валидатор Google.

**E. Код / UX замечания**
- **Галерея / Калькулятор / Отзывы:** заглушки Bitrix — ACTION: lazy-load виджеты и уменьшить раннюю загрузку CSS/JS связанных модулей.
- **Видео:** data-атрибуты для ленивой вставки iframe — хорошо; убедиться, что при клике iframe добавляется динамически (preload none).
- **Изображения миниатюр:** имеют `loading="lazy"` и размеры — OK.
- **Back-to-top:** изначально скрыт и имеет `aria-label` — проверить доступность (tab-focus, visible focus state).

**Приоритетные действия (кратко)**
1. Убрать `meta name="robots" content="noindex, nofollow"` перед публикацией.
2. Добавить responsive `srcset`/`sizes` и/или AVIF/WebP варианты для LCP-изображения; убедиться, что `preload` указывает на реальный LCP-файл.
3. Лениво инициализировать Bitrix-виджеты (gallery, calculator, reviews) через IntersectionObserver или отдельный chunk.
4. Проверить контраст текста на `bg-dark` в зоне hero и секций — привести к WCAG AA.
5. Прогнать JSON-LD через валидатор, подтвердить корректность `price` и `availability`.

**Комментарии**
- Страница в целом соответствует чеклисту Task-1 (A..E): критический CSS, оптимизация LCP, JSON-LD и семантическая разметка присутствуют. Большая часть улучшений — тактические (responsive images, lazy-loading виджетов, контроль contrast).

Конец аудита.

---
Примечание по Bitrix: Bitrix/виджеты (галерея, калькулятор, отзывы) в документе указаны как placeholder'ы. На текущем этапе интеграция виджетов не выполняется — рекомендации по интеграции отложены и помечены как N/A до момента, когда начнётся этап интеграции.
