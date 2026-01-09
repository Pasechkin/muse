# AI Instructions for Muse-tailwind Project

## Workflow for Page Creation
1. **AI Task:** Create an empty HTML page structure including:
    - `<head>` with meta tags (title, description, robots).
    - Critical CSS (taken from the reference page).
    - Tailwind CSS CDN and configuration (container width `2xl: 1170px`).
    - Placeholders for Header and Footer: `<!-- [HEADER_PLACEHOLDER] -->` and `<!-- [FOOTER_PLACEHOLDER] -->`.
    - Main content structure.
2. **User Task:** The user will manually insert the Header and Footer sections from the reference page into the placeholders.
3. **AI Task:** The AI will then proceed to fill in the main content and refine the page based on the original content source and reference structure.

## Content Rules
- **Source of Truth:** Content (texts, alt, title, meta) must be taken ONLY from the original `muse.ooo` page.
- **No Shortening:** Do NOT change or shorten content without explicit agreement from the user.
- **Accuracy:** All technical details, tables, and lists must be preserved exactly as in the original.
- **SEO:** Maintain all alt and title attributes for images and links.

## Styling and Components
- **Reference Page:** Use `@tailwind-project/src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html` as the etalon for structure and styling.
- **Container Width:** The standard container width is `1170px` for the `2xl` breakpoint.
- **Promo Block (Акция):** Take the promo block 1:1 from the reference page.
- **SVG Icons:** Use SVG placeholders (e.g., `<svg><text>SVG</text></svg>`) for icons. The user will replace them later.
- **Ken Burns Effect:** Apply the Ken Burns effect to hero section background images where appropriate (see `info.html` for example).
- **Product Gallery:** Use `el-tab-group` from Tailwind Plus for image galleries in product descriptions.
- **Carousels:** Use a horizontal scrollable container with `snap-center` for image carousels (e.g., Examples of work).

## Interactive Elements (JavaScript)
- **Back to Top Button:** Every page should have a "Back to Top" button that appears on scroll (desktop only).
- **Page Navigator:** A side navigation panel (Page Navigator) should be implemented to navigate between page sections. It should include:
    - Smooth scrolling to sections.
    - Highlighting the active section.
    - Showing/hiding based on screen size (hidden on mobile).
- **Video Modals/Covers:** Use a cover image with a play icon for videos. Clicking should replace the cover with the actual video player.

## Testing and Deployment
- Use `start-mobile-server.bat` for local testing.
- Use `БЫСТРЫЙ_ДЕПЛОЙ.bat` for deploying to Vercel.
- Verify the page appearance on the deployed URL after changes.

## Дополнительные уточнения

- **CTA-блок (призыв к действию)**:
  - По умолчанию используем CTA-секцию по структуре (разметка/сетка/типографика/состав элементов) с эталонной страницы.
  - Цветовую гамму CTA (фон/кнопки/акценты/текст) берём из страницы, которую перевёрстываем (из её `colors.primary/dark/secondary`).
  - Для “похожести на эталон” используем те же базовые классы структуры:
    - секция: `py-24 md:py-32`
    - контейнер: `container xl:flex xl:items-center xl:justify-between`
    - заголовок: `text-2xl font-light tracking-tight`
    - блок кнопок: `mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-x-6 xl:mt-0 xl:shrink-0`
    - кнопки: `inline-block px-6 py-2 rounded uppercase transition-colors w-full md:w-auto text-center`

- **Карусель “Примеры работ” (как в эталоне)**:
  - Делаем как в эталоне: горизонтальная прокрутка (scroll) на `scroll-snap`, **без стрелок**, **без пагинации**, **без автопрокрутки**.
  - Обязательные классы/структура:
    - контейнер прокрутки: `.carousel-scroll`
    - элементы: `.snap-center`
    - карточки в ряд (как в эталоне): `flex gap-0 px-4 min-w-max`
  - Десктоп-поведение: допускается эталонный JS для drag-scroll и прокрутки колёсиком мыши (только на ПК).
  - Контент (порядок карточек, изображения, `alt`, `title`) — строго из оригинала `muse.ooo`, без сокращений/замен без согласования.

- **Секция “Как заказать” (визуальный процесс)**:
  - Базовый визуальный паттерн берём с эталонной страницы:
    - кружки с цифрами (1/2/3...),
    - пунктирная линия, соединяющая шаги,
    - единый стиль отступов/типографики для шагов.
  - Конкретная раскладка (1 колонка или 2 колонки, наличие видео-cover и его расположение) определяется по странице, которую перевёрстываем / по оригиналу `muse.ooo` для этой страницы.
  - Цвета (фон/акценты/обводки кружков/цвет цифр/цвет пунктира/цвет ссылок) берём из страницы, которую перевёрстываем, при сохранении читабельности/контраста.
  - Тексты шагов (“Как заказать”) — **1:1 из оригинала `muse.ooo`**, без сокращений/перефразирования.
  - Для “похожести на эталон” используем те же базовые классы элементов:
    - кружок шага: `w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center`
    - пунктир: `border-l-2 border-dashed` (цвет адаптируем под тему страницы)
