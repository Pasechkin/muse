"""Step 7b: Update Преимущества section on 17 style pages to match étalon."""
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

# ── Heading mapping (most specific first) ──
HEADING_MAP = [
    ('сходства', '100% сходство'),
    ('цифровом виде', '100% сходство'),
    ('Печатаем оригинальными', 'Служит 50+ лет'),
    ('50-ти лет', 'Служит 50+ лет'),
    ('ответственно', 'Точно в срок'),
    ('выгодную цену', 'Выгодная цена'),
    ('гарантию', 'Гарантия качества'),
    # fotomozaika specials
    ('вручную', 'Ручная работа'),
    ('повторно печатать', 'Универсальный макет'),
    ('в срок', 'Точно в срок'),
    ('при получении', 'Оплата при получении'),
    ('Гарантия', 'Гарантия'),
]

def get_heading(text):
    """Determine card heading from its text content."""
    for keyword, heading in HEADING_MAP:
        if keyword in text:
            return heading
    # Card 1 fallback: extract number + noun
    m = re.match(r'(\d+)\s+(\S+)', text.strip())
    if m:
        return f'{m.group(1)}+ {m.group(2)}'
    return None

ICON_CLASSES = (
    'w-[3.625rem] h-[3.625rem] rounded-full bg-ah-50 text-ah-950 '
    'flex items-center justify-center mb-4 shrink-0 '
    'transition-all duration-300 group-hover:bg-ah-100 group-hover:scale-110'
)

# Regex: match each advantage-card block (comment before card is NOT captured)
card_re = re.compile(
    r'<div class="advantage-card">\s*'
    r'<div class="advantage-card__icon">\s*'
    r'(<svg\b[^>]*>.*?</svg>)\s*'
    r'</div>\s*'
    r'<p class="advantage-card__text">(.*?)</p>\s*'
    r'</div>',
    re.DOTALL,
)

def replace_card(m):
    svg = m.group(1).strip()
    text = m.group(2).strip()

    # Replace SVG class
    svg = svg.replace(
        'class="icon-advantage"',
        'class="w-[1.875rem] h-[1.875rem] fill-current"',
    )

    heading = get_heading(text)
    h3 = (
        f'                        <h3 class="heading-card mb-2">{heading}</h3>\n'
        if heading
        else ''
    )

    return (
        f'<div class="p-6 flex flex-col items-start group">\n'
        f'                        <div class="{ICON_CLASSES}">\n'
        f'                            {svg}\n'
        f'                        </div>\n'
        f'{h3}'
        f'                        <p class="text-ink">{text}</p>\n'
        f'                    </div>'
    )


updated = 0
for page in pages:
    path = os.path.join(STYLE_DIR, page)
    with open(path, 'r', encoding='utf-8') as fh:
        html = fh.read()
    orig = html

    # ── Section class ──
    html = html.replace(
        'class="advantages-section content-auto"',
        'class="py-16 lg:py-20 content-auto bg-ah-25"',
    )

    # ── Heading: class ──
    html = html.replace(
        'class="advantages-title">',
        'class="heading-section text-center text-balance">',
    )

    # ── Heading container margin ──
    html = html.replace(
        'class="container mb-12">',
        'class="container mb-12 md:mb-16">',
    )

    # ── Grid class ──
    html = html.replace(
        'class="advantages-grid">',
        'class="grid md:grid-cols-3 gap-4">',
    )

    # ── Process each card ──
    html = card_re.sub(replace_card, html)

    if html != orig:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(html)
        updated += 1
        print(f'  ✓ {page}')
    else:
        print(f'  - {page} (без изменений)')

print(f'\nГотово: {updated}/{len(pages)} обновлено')
