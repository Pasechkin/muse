# Комплексный аудит всех страниц сайта Muse
## Всего - 4 основные, 9 info, 20 blog, 5 portret-na-zakaz - объекты, 18 ortret-na-zakaz - стили



**Дата создания:** 2026-02-06  
**Всего страниц:** 57
---

## Основные страницы (4 файла)

### index.html
**Просмотр на Vercel:** https://muse-liard-one.vercel.app/
**Оригинальная страница:**
https://muse.ooo/
Есть скрипт плавной отрисовки на ПК видео первого экрана
Замечания:
⚠️ Отсутствует structured data
### portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html 
**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg/
Замечания: 
Есть скрипт плавной отрисовки на ПК видео первого экрана - нужен
### pechat-na-kholste-sankt-peterburg.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/pechat-na-kholste-sankt-peterburg.html
**Оригинальная страница:**
https://muse.ooo/pechat-na-kholste-sankt-peterburg/
Замечания:
### foto-na-kholste-sankt-peterburg.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/foto-na-kholste-sankt-peterburg.html
**Оригинальная страница:**
https://muse.ooo/pechat-na-kholste-sankt-peterburg/foto-na-kholste-sankt-peterburg/
Замечания: Разобрать со слайдером с Гагриным.
- (HIGH) Видео: `<video>` использован с `preload="none"` (OK), но отсутствуют `<track>` с субтитрами или ссылка на транскрипт; добавить captions/track или текстовую транскрипцию для A11Y/SEO.
- (LOW) Некоторые внешние ссылки с `target="_blank"` содержат `rel="nofollow noopener"`, но повсеместно рекомендую указывать `rel="noopener noreferrer"` для предотвращения window.opener‑уязвимости;





---



## Страницы info (9 файлов)

### info/info.html
**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/info.html
**Оригинальная страница:**
https://muse.ooo/info/

Замечания:Критический CSS содержит дополнительные стили так нужно.
### info/kontakty.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/kontakty.html
**Оригинальная страница:**
https://muse.ooo/info/kontakty/

Замечания:
| Structured Data | ContactPage JSON-LD | Отсутствует | ⚠️ Отсутствует |
---
### info/faq.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/faq.html
**Оригинальная страница:**
https://muse.ooo/info/faq/
⚠️ Замечания: Требуется проверка количества вопросов и микроразметки
### info/oferta.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/oferta.html
**Оригинальная страница:**
https://muse.ooo/info/oferta/
Замечания:Нужно обновит текст
### info/politika_konfidentsialnosti_sayta.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/politika_konfidentsialnosti_sayta.html
**Оригинальная страница:**
https://muse.ooo/info/politika_konfidentsialnosti_sayta/
Замечания: Нижнее подчеркиваение в URL
### info/partnerstvo.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/partnerstvo.html
**Оригинальная страница:**
https://muse.ooo/info/partnerstvo/
Замечания:
### info/guarantee.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/guarantee.html

**Оригинальная страница:**
https://muse.ooo/info/guarantee/
Замечания: Перечитать
### info/avtorstvo.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/avtorstvo.html
**Оригинальная страница:**
https://muse.ooo/info/avtorstvo/
Замечания:
### info/dostavka.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/info/dostavka.html
**Оригинальная страница:**
https://muse.ooo/info/dostavka/
Замечания: Это заготовка

#### Задание 2: Постраничное сравнение контента
| Элемент | Оригинал | Текущее | Статус |
|---------|----------|---------|--------|
| H1 | "Доставка" | "Доставка" | ✅ Совпадает |
| Контент | Динамический контент через Bitrix компонент | Статический текст | ⚠️ Отличается (в оригинале динамический контент) |


## Страницы блога (20 файлов). Внимание! У всех страниц не понятно с хлебными крошками

### blog/pechat-na-kholste-i-fotobumage-lomond.html- 

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/pechat-na-kholste-i-fotobumage-lomond.html
**Оригинальная страница:**
https://muse.ooo/blog/pechat-na-kholste-i-fotobumage-lomond/
Замечания:  
- часть img без width/height (размеры не подтверждены)
- LCP-изображение без fetchpriority="high"
- Изображение в секции "Похожие статьи": отсутствуют width/height атрибуты
### blog/portret-dlya-pokoleniy.html
**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/portret-dlya-pokoleniy.html
**Оригинальная страница:**
https://muse.ooo/blog/portret-dlya-pokoleniy/
Замечания:
- Ссылки в секции "Похожие статьи" | Абсолютные URL (https://muse.ooo/blog/...) | Относительные (pechat-na-kholste-i-fotobumage-lomond.html) | ❌ Не совпадает |
- ⚠️ Изображение в секции "Похожие статьи": отсутствуют width/height атрибуты
### blog/kompozitsiya-v-fotografii-ot-stiva-makkari.html
**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/kompozitsiya-v-fotografii-ot-stiva-makkari.html
**Оригинальная страница:**
https://muse.ooo/blog/kompozitsiya-v-fotografii-ot-stiva-makkari/
Замечания:
9 изображений используют `height="auto"` вместо числового значения (строки 105, 117, 129, 141, 153, 165, 177, 189, 201)
### blog/paspartu.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/paspartu.html
**Оригинальная страница:**
https://muse.ooo/blog/paspartu/
Замечания:
-5 изображений используют `height="auto"` вместо числового значения (строки 89, 103, 117, 138, 150)
### blog/stil-pop-art-v-interere.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/stil-pop-art-v-interere.html
**Оригинальная страница:**
https://muse.ooo/blog/stil-pop-art-v-interere/
Замечания:
7 изображений используют `height="auto"` вместо числового значения (строки 95, 109, 123, 137, 151, 165, 179)
### blog/fotobumaga-dlya-khudozhestvennoy-pechati.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/fotobumaga-dlya-khudozhestvennoy-pechati.html
**Оригинальная страница:**
https://muse.ooo/blog/fotobumaga-dlya-khudozhestvennoy-pechati/
Замечания:
img без width/height
### blog/rukovodstvo-po-pechati-na-kholste.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/rukovodstvo-po-pechati-na-kholste.html
**Оригинальная страница:**
https://muse.ooo/blog/rukovodstvo-po-pechati-na-kholste/
Замечания:
img без width/height
### blog/preimushchestva-pechati-foto-na-kholste.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/preimushchestva-pechati-foto-na-kholste.html
**Оригинальная страница:**
https://muse.ooo/blog/preimushchestva-pechati-foto-na-kholste/
Замечания:
img без width/height
### blog/kollazh-i-fotokollazh.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/kollazh-i-fotokollazh.html
**Оригинальная страница:**
https://muse.ooo/blog/kollazh-i-fotokollazh/
Замечания:
img без width/height
### blog/modulnaya-kartina.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/modulnaya-kartina.html
**Оригинальная страница:**
https://muse.ooo/blog/modulnaya-kartina/
Замечания:
img без width/height
### blog/modulnaya-kartina-syuzhet-razmer-tsvet.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/modulnaya-kartina-syuzhet-razmer-tsvet.html
**Оригинальная страница:**
https://muse.ooo/blog/modulnaya-kartina-syuzhet-razmer-tsvet/
Замечания:
img без width/height
### blog/postery-i-plakaty-dlya-interera.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/postery-i-plakaty-dlya-interera.html
**Оригинальная страница:**
https://muse.ooo/blog/postery-i-plakaty-dlya-interera/
Замечания:
img без width/height
### blog/oformlenie-sten-fotografiyami.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/oformlenie-sten-fotografiyami.html
**Оригинальная страница:**
https://muse.ooo/blog/oformlenie-sten-fotografiyami/
Замечания:
img без width/height
### blog/ramka-dlya-foto-i-kartin.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/ramka-dlya-foto-i-kartin.html
**Оригинальная страница:**
https://muse.ooo/blog/ramka-dlya-foto-i-kartin/
Замечания:
img без width/height
### blog/pechat-na-kholste-foto-i-reproduktsiy.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/pechat-na-kholste-foto-i-reproduktsiy.html
**Оригинальная страница:**
https://muse.ooo/blog/pechat-na-kholste-foto-i-reproduktsiy/
Замечания:
img без width/height
### blog/vybor-razmera-foto-i-reproduktsiy.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/vybor-razmera-foto-i-reproduktsiy.html
**Оригинальная страница:**
https://muse.ooo/blog/pechat-na-kholste-foto-i-reproduktsiy/
Замечания:
img без width/height
### blog/sekret-garmonii-tsveta.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/sekret-garmonii-tsveta.html
**Оригинальная страница:**
https://muse.ooo/blog/sekret-garmonii-tsveta/
Замечания:
img без width/height
### blog/pechat-foto-i-reproduktsiy-na-fotobumage.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/pechat-foto-i-reproduktsiy-na-fotobumage.html
**Оригинальная страница:**
https://muse.ooo/blog/pechat-foto-i-reproduktsiy-na-fotobumage/
Замечания:
img без width/height
### blog/blog.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/blog.html
**Оригинальная страница:**
https://muse.ooo/blog/
Замечания:
img без width/height
### blog/blog-page-2.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/blog/blog-page-2.html
**Оригинальная страница:**
https://muse.ooo/blog/page-2
Замечания:
img без width/height


## Страницы portret-na-zakaz (объекты 5 файлов)

### portret-na-zakaz/object/detskiy-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/object/detskiy-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/detskiy-portret/
Замечания:
### portret-na-zakaz/object/muzhskoy-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/object/muzhskoy-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/muzhskoy-portret/
Замечания:
### portret-na-zakaz/object/parnyy-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/object/parnyy-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/parnyy-portret/
Замечания:
### portret-na-zakaz/object/semeynyy-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/object/semeynyy-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/semeynyy-portret/
Замечания:
### portret-na-zakaz/object/zhenskiy-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/object/zhenskiy-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/zhenskiy-portret/
Замечания:












## Страницы portret-na-zakaz (стили 18 файлов)

### portret-na-zakaz/style/portret-iz-slo1v.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-iz-slov.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-iz-slov/
- **Уточнение:** Дополнительный `<style>` блок содержит стили для Drift (`.detail`, `.drift-zoom-pane`), так нужно. У первого изображения нет srcset/нарезки для маленьких экранов.

### portret-na-zakaz/style/portret-karandashom.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-karandashom.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-karandashom/

- 🔴 **Проблема:** Плейсхолдеры видео: `src="[URL_82x62.webp]"`, `src="[URL_458x258.webp]"`, `alt="[ТЕКСТ: Описание видео]"`, `title="[ТЕКСТ: Заголовок видео]"`
- Замечания: 🔴 У первого изображения нет srcset/нарезки для маленьких экранов.

---
### portret-na-zakaz/style/fotomozaika.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/fotomozaika.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/fotomozaika/

- **Уточнение:** Дополнительный `<style>` блок содержит стили для Drift (`.detail`, `.drift-zoom-pane`) нужен
есть inline JS (`onload`) для Drift CSS/JS. Drift на странице нужен
Статус: ⚠️
Проблемы:
- D: есть `img` с `.jpg` (YouTube thumbnail) — по правилам должен быть webp или inline SVG.
- Замечания: 🔴 У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/beauty-art-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/beauty-art-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/beauty-art-portret/
Замечания: Первое (Hero) изображение НЕ имеет srcset/нарезки для маленьких экранов;
### portret-na-zakaz/style/drim-art-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/drim-art-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/drim-art-portret/
Замечания: Первое (Hero) изображение НЕ имеет srcset/нарезки для маленьких экранов
### portret-na-zakaz/style/fantasy-art-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/fantasy-art-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/fantasy-art-portret/
Замечания: Первое (Hero) изображение НЕ имеет srcset/нарезки для маленьких экранов
### portret-na-zakaz/style/graffiti-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/graffiti-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/graffiti-portret/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/granzh-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/granzh-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/granzh-portret/
Замечания: Первое (Hero) изображение НЕ имеет srcset/нарезки для маленьких экранов
### portret-na-zakaz/style/love-is-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/love-is-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/love-is-portret/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/low-poly-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/low-poly-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/low-poly-portret/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/pop-art-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/pop-art-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/pop-art-portret/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/portret-akvarelyu.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-akvarelyu.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-akvarelyu/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/portret-flower-art.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-flower-art/
Замечания:У первого изображения нет srcset/нарезки для маленьких экранов.
### portret-na-zakaz/style/portret-komiks.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-komiks.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-komiks/
Замечания:
### portret-na-zakaz/style/portret-maslom.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-maslom.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-maslom/
Замечания:
### portret-na-zakaz/style/portret-v-obraze.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/portret-v-obraze.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/portret-v-obraze/
Замечания:
### portret-na-zakaz/style/sharzh-po-foto.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/sharzh-po-foto.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/sharzh-po-foto/
Замечания:
### portret-na-zakaz/style/wpap-portret.html

**Просмотр на Vercel:** https://muse-liard-one.vercel.app/portret-na-zakaz/style/wpap-portret.html
**Оригинальная страница:**
https://muse.ooo/portret-na-zakaz/wpap-portret/
Замечания:







**Проблемы:**
- 🔴 **12 страниц содержат плейсхолдеры видео:** portret-karandashom, fantasy-art-portret, portret-komiks, portret-v-obraze, portret-flower-art, portret-akvarelyu, pop-art-portret, wpap-portret, low-poly-portret, love-is-portret, granzh-portret, fotomozaika

---






## Итоговая сводка всех проблем
### Критические проблемы (🔴):
4. **blog/portret-dlya-pokoleniy.html:**
   - Относительные ссылки в секции "Похожие статьи" вместо абсолютных URL
5. **blog/kompozitsiya-v-fotografii-ot-stiva-makkari.html:**
   - 9 изображений с `height="auto"`
8. **12 страниц portret-na-zakaz:**
   - Плейсхолдеры видео вместо реальных URL и текстов
### Предупреждения (⚠️):

1. **index.html:** Отсутствует JSON-LD (Organization, LocalBusiness, WebPage)
3. **info/kontakty.html:** отсутствует ContactPage JSON-LD
5. **info/dostavka.html:** контент статический, в оригинале динамический через Bitrix


---
**Всего проверено:** 57 страниц  
**Статус ✅ (без проблем):** 38 страниц  
**Статус ⚠️ (требует внимания):** 0 страниц  
**Статус 🔴 (критические проблемы):** 19 страниц
