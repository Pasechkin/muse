"""Step 7a: Update CTA + Характеристики sections on 17 style pages to match étalon."""
import os
import re

STYLE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "src", "html", "portret-na-zakaz", "style",
)
EXCLUDE = {"portret-maslom.html", "portret-maslom-v7.html"}

pages = sorted(
    f for f in os.listdir(STYLE_DIR)
    if f.endswith(".html") and f not in EXCLUDE
)
print(f"Обработка {len(pages)} страниц…\n")

updated = 0
for page in pages:
    path = os.path.join(STYLE_DIR, page)
    with open(path, "r", encoding="utf-8") as fh:
        html = fh.read()
    orig = html

    # ──── CTA ────
    html = html.replace(
        'class="cta-section">',
        'class="cta-section content-auto">')
    html = html.replace(
        'class="cta-title">',
        'class="heading-section text-white">')
    html = html.replace(
        'Создай своё произведение искусства',
        'Создай своё произведение <em class="italic text-ah-600">искусства</em>')

    # ──── Характеристики: section & heading ────
    html = html.replace(
        'content-auto" id="harakteristiki"',
        'bg-ah-25" id="harakteristiki"')
    html = html.replace(
        'mb-12">Характеристики',
        'mb-12 md:mb-16">Характеристики')

    # ──── Характеристики: checklist classes ────
    html = html.replace(
        'class="check-list">',
        'class="check-list marker-ah-600 space-y-4">')
    html = html.replace(
        'class="check-list-item">',
        'class="check-list-item text-ink flex items-start gap-3">')

    # ──── Характеристики: tab buttons h-20 (actual visible) ────
    html = html.replace(
        'h-20 cursor-pointer items-center justify-center rounded bg-white text-small font-medium text-ink hover:bg-gray-50',
        'h-20 cursor-pointer items-center justify-center rounded-xl bg-ah-50 text-sm font-medium text-ah-950 hover:bg-ah-75')

    # ──── Характеристики: tab buttons h-16 (comment template) ────
    html = html.replace(
        'h-16 cursor-pointer items-center justify-center rounded bg-white text-small font-medium text-ink hover:bg-gray-50',
        'h-16 cursor-pointer items-center justify-center rounded bg-white text-small font-medium text-ah-950 hover:bg-ah-50')

    # ──── Global: focus ring colour ────
    html = html.replace('focus:ring-primary/50', 'focus:ring-ah-600/50')

    # ──── Tab image span: overflow-hidden rounded → rounded-xl ────
    html = html.replace(
        'absolute inset-0 overflow-hidden rounded">',
        'absolute inset-0 overflow-hidden rounded-xl">')

    # ──── Ring span: rounded + ring-primary → rounded-xl + ring-ah-600 ────
    html = html.replace(
        'pointer-events-none absolute inset-0 rounded ring-2 ring-transparent ring-offset-2 in-aria-selected:ring-primary',
        'pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent ring-offset-2 in-aria-selected:ring-ah-600')

    # ──── Характеристики: remove old info div ────
    html = re.sub(
        r'\n\s*<div class="mt-8 p-4 bg-secondary rounded-lg border border-gray-200">'
        r'\s*<p class="text-small">[\s\S]*?</p>\s*</div>',
        '',
        html,
        count=1,
    )

    # ──── Характеристики: insert new info <p> before container/section close ────
    OLD_END = '            </div>\n        </section>\n\n        <!-- Преимущества -->'
    NEW_END = (
        '\n                <p class="mt-10 text-xs text-ink leading-[1.6]">\n'
        '                    Выше приведен список стандартных характеристик работ и материалов.'
        ' Вы всегда можете: посчитав в калькуляторе выше; прочитав описание по клику'
        ' на знак вопроса там же; спросив в коммуникаторе или позвонив'
        ' — подобрать именно то, что нужно Вам.\n'
        '                </p>\n'
        '            </div>\n        </section>\n\n        <!-- Преимущества -->'
    )
    html = html.replace(OLD_END, NEW_END, 1)

    if html != orig:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
        updated += 1
        print(f"  ✓ {page}")
    else:
        print(f"  - {page} (без изменений)")

print(f"\nГотово: {updated}/{len(pages)} обновлено")
