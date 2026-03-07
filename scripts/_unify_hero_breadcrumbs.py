"""
Унификация хлебных крошек и подстрочника на первом экране.
Эталон: portret-maslom.html

Изменения:
1. <nav> breadcrumb: text-small text-ink-muted-on-dark → text-xs text-white/60
2. <ol>: добавить [&_a]:text-white/60 [&_a:hover]:text-white/90 [&_a]:transition-colors
3. Последний <li>: text-ink-muted-on-dark → text-white/80
4. Подстрочник: text-small mt-2 mb-4 text-ink-muted-on-dark → text-xs tracking-wider mt-2 mb-4 text-ink-on-dark
"""
import os, glob, re

base = r"C:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\portret-na-zakaz"

# Собираем все style-страницы кроме эталонов
style_pages = glob.glob(os.path.join(base, "style", "*.html"))
style_pages = [f for f in style_pages if "portret-maslom" not in os.path.basename(f)]

# Object-страницы
object_pages = glob.glob(os.path.join(base, "object", "*.html"))

all_pages = sorted(style_pages + object_pages)
changed = 0

for filepath in all_pages:
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    original = html

    # 1) Nav breadcrumb: размер + цвет
    html = html.replace(
        'class="text-small text-ink-muted-on-dark mb-4" aria-label="Breadcrumb"',
        'class="text-xs text-white/60 mb-4" aria-label="Breadcrumb"',
    )

    # 2) Ol: добавить hover-стили на ссылки
    html = html.replace(
        '<ol class="flex list-none p-0">',
        '<ol class="flex list-none p-0 [&_a]:text-white/60 [&_a:hover]:text-white/90 [&_a]:transition-colors">',
    )

    # 3) Последний li (текущая страница): цвет
    html = html.replace(
        '<li class="text-ink-muted-on-dark">',
        '<li class="text-white/80">',
    )

    # 4) Подстрочник (есть только на 16 style-страницах)
    html = html.replace(
        'class="text-small mt-2 mb-4 text-ink-muted-on-dark"',
        'class="text-xs tracking-wider mt-2 mb-4 text-ink-on-dark"',
    )

    if html != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        changed += 1
        print(f"  ✅ {os.path.basename(filepath)}")
    else:
        print(f"  ⏭️  {os.path.basename(filepath)} — без изменений")

print(f"\nИтого обновлено: {changed}/{len(all_pages)}")
