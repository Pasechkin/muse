---
title: "Аудит — WPAP портрет (wpap-portret)"
date: 2026-02-05
source: src/html/portret-na-zakaz/style/wpap-portret.html
auditor: GitHub Copilot
---

**A. Базовая проверка**
- **Title:** «WPAP портрет — заказать в Muse» — релевантен и конкретен — OK.
- **Meta description:** присутствует — OK.
- **Meta robots:** `noindex, nofollow` — страница закрыта от индексации (разработка). ACTION: убрать перед публикацией.
- **Canonical:** есть — OK.
- **lang:** `ru` — OK.
- **Критический CSS:** небольшой inline `:root` — допустимо для первого рендера.

**B. Производительность / LCP**
- **Preload LCP:** есть `<link rel="preload" as="image" href="https://muse.ooo/upload/img/wpap-458-woman.webp" fetchpriority="high">` — положительно.
- **Hero image:** `width/height`, `loading="eager"`, `decoding="async"`, `fetchpriority="high"` — настроено для LCP.
- **Рекомендация:** добавить `srcset`/`sizes` и AVIF/WebP варианты для разных плотностей; проверить, что предзагружаемый URL соответствует реальному LCP в мобильном/десктопном представлении.
- **JS:** `nav.js` загружается с `defer` — OK. Bitrix-виджеты — placeholder'ы: ACTION: инициализировать лениво (IntersectionObserver/dynamic import).

**C. Доступность (A11y)**
- **ARIA / навигация:** `aria-label` у `back-to-top` и у кнопок воспроизведения — хорошо.
- **Видео:** кнопка с `data-play-btn` есть; ACTION: при внедрении iframe нужно обеспечить `aria-busy`, управлять фокусом (`iframe.tabIndex=0; iframe.focus()`), добавить `track` или текстовую транскрипцию при наличии субтитров.
- **Контраст:** проверить `text-gray-300` на фоне `.bg-dark` (WCAG AA) — ACTION.
- **Клавиатурная доступность:** проверить доступность `back-to-top` и миниатюр (focus-visible и tabindex).

**D. SEO / Structured Data**
- **JSON-LD Product:** присутствует с `offers`, `aggregateRating` и `sku` — OK. ACTION: подтвердить актуальность `price`, `priceValidUntil`, `image` URL.
- **BreadcrumbList:** присутствует — OK.
- **SEO note:** убрать `noindex` перед публикацией; прогнать JSON-LD через валидатор Structured Data.

**E. Код / UX замечания**
- **Before/After:** реализовано нативно с ползунком — good; проверить SR/labels для управления (aria-label уже есть) и touch-юзабилити.
- **Видео:** использован ленивый паттерн `data-video-cover`/`data-play-btn` — ACTIONS (конкретно):
  1) Вставлять `iframe` динамически только после клика: `iframe.src = data-video-src` (не держать `src` в DOM до клика).
  2) При вставке добавлять `iframe.setAttribute('tabindex','0')` и переводить фокус на iframe.
  3) Устанавливать `aria-busy="true"` на контейнер до загрузки, затем `false`.
  4) Не включать `autoplay` по умолчанию; если нужно — только после явного клика.
  5) Добавить `<track kind="captions">` или ссылку на транскрипт рядом с видео.
- **Изображения миниатюр:** `loading="lazy"` и размеры — OK; ACTION: добавить `decoding="async"` там, где пропущено, и `srcset` для thumbnails по возможности.
- **Placeholders Bitrix:** загружать асинхронно по видимости, уменьшить раннюю загрузку CSS/JS.

**Приоритетные действия**
1. Убрать `meta name="robots" content="noindex, nofollow"` при подготовке к публикации.
2. Добавить `srcset`/`sizes` и AVIF/WebP для LCP-изображения; синхронизировать `preload` с реальным LCP-файлом.
3. Реализовать ленивую вставку `iframe` по click (см. actions выше) и добавить субтитры/транскрипт.
4. Лениво инициализировать Bitrix-виджеты через IntersectionObserver/динамический импорт.
5. Проверить контраст и фокусные состояния (WCAG AA).

**Комментарии**
- Страница удовлетворяет требованиям Task-1 (A..E): структура, LCP-оптимизация через preload, JSON-LD и семантика на месте. Рекомендации — тактические улучшения по responsive images, lazy-loading виджетов и точной реализации видео.

Конец аудита.

---
Примечание по Bitrix: Bitrix/виджеты (галерея, калькулятор, отзывы) в документе указаны как placeholder'ы. На текущем этапе интеграция виджетов не выполняется — рекомендации по интеграции отложены и помечены как N/A до момента, когда начнётся этап интеграции.
