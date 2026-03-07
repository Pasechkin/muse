"""
Step 7 — Как заказать: batch update 17 style pages.
Replaces old circle-step layout with giant-number layout (étalon portret-maslom.html).
"""
import os, re

STYLE_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 
    'src', 'html', 'portret-na-zakaz', 'style'
)
STYLE_DIR = os.path.normpath(STYLE_DIR)
print(f'DIR: {STYLE_DIR}')
print(f'Exists: {os.path.isdir(STYLE_DIR)}')
EXCLUDE = {'portret-maslom.html', 'portret-maslom-v7.html'}

# ─── helpers ──────────────────────────────────────────────────
def reindent(text, target_indent):
    """Strip common leading whitespace, then re-indent to *target_indent*."""
    lines = text.split('\n')
    non_empty = [l for l in lines if l.strip()]
    if not non_empty:
        return text
    min_indent = min(len(l) - len(l.lstrip()) for l in non_empty)
    result = []
    for line in lines:
        stripped = line.lstrip()
        if stripped:
            extra = (len(line) - len(line.lstrip())) - min_indent
            result.append(target_indent + ' ' * extra + stripped)
        else:
            result.append('')
    return '\n'.join(result)

# ─── extractors ───────────────────────────────────────────────
SECTION_RE = re.compile(
    r'[ \t]*<!-- Как заказать -->\s*<section[^>]*id="kak-zakazat"[^>]*>.*?</section>',
    re.DOTALL,
)

CANVAS_RE = re.compile(
    r'(<div class="canvas-3d[^"]*"[^>]*>\s*<img\b[^>]*>\s*</div>)',
    re.DOTALL,
)

CAPTION_RE = re.compile(r'^\s*(<p\b[^>]*>.*?</p>)', re.DOTALL)

STEP_RE = re.compile(
    r'<!-- Шаг (\d+).*?-->\s*'
    r'<div class="flex gap-4">\s*'
    r'<div class="shrink-0 w-12 h-12[^"]*">\s*'
    r'<span[^>]*>\d+</span>\s*'
    r'</div>\s*'
    r'<div>\s*'
    r'(.*?)'
    r'\s*</div>\s*'
    r'</div>',
    re.DOTALL,
)

# ─── builders ─────────────────────────────────────────────────
INFO_DOT = (
    '                                <!-- Бейдж -->\n'
    '                                <div class="mt-4 inline-flex items-center gap-2 text-sm text-ah-800">\n'
    '                                    <div class="info-dot"></div>\n'
    '                                    Консультация и эскиз — бесплатно\n'
    '                                </div>'
)

def build_step(num, body):
    # text-body → text-ink
    body = body.replace('class="text-body"', 'class="text-ink"')
    # mt-3 paragraphs → add text-ink
    body = re.sub(r'class="mt-3"', 'class="text-ink mt-3"', body)
    body_new = reindent(body, ' ' * 32)

    badge = ''
    if num == '2':
        badge = '\n' + INFO_DOT

    return (
        f'                        <!-- Шаг {num} -->\n'
        f'                        <div class="relative step-animate">\n'
        f'                            <div class="absolute left-0 sm:left-0 lg:left-2 -top-4 sm:-top-6 lg:-top-8 font-extralight step-number-giant leading-none select-none pointer-events-none">\n'
        f'                                {num}\n'
        f'                            </div>\n'
        f'                            <div class="relative pl-4 sm:pl-8 lg:pl-20 pt-2 sm:pt-4">\n'
        f'{body_new}{badge}\n'
        f'                            </div>\n'
        f'                        </div>'
    )


def build_section(canvas_html, caption_html, steps):
    canvas_block = reindent(canvas_html, ' ' * 28)
    caption_block = ''
    if caption_html:
        caption_block = '\n' + reindent(caption_html, ' ' * 28)

    step_blocks = '\n\n'.join(build_step(s['num'], s['body']) for s in steps)

    return (
        '        <!-- Как заказать -->\n'
        '        <section class="py-16 lg:py-20 content-auto bg-ah-25" id="kak-zakazat">\n'
        '            <div class="container mb-12 md:mb-16">\n'
        '                <div class="text-center">\n'
        '                    <h2 class="heading-section">Как заказать</h2>\n'
        '                </div>\n'
        '            </div>\n'
        '\n'
        '            <div class="container">\n'
        '                <div class="grid lg:grid-cols-12 gap-8 lg:gap-16">\n'
        '\n'
        '                    <!-- Левая колонка — картинка (sticky на десктопе) -->\n'
        '                    <div class="lg:col-span-5 order-2 lg:order-1">\n'
        '                        <div class="lg:sticky lg:top-24">\n'
        f'{canvas_block}{caption_block}\n'
        '                        </div>\n'
        '                    </div>\n'
        '\n'
        '                    <!-- Правая колонка — шаги -->\n'
        '                    <div class="lg:col-span-7 order-1 lg:order-2 space-y-12 sm:space-y-16 lg:space-y-20">\n'
        '\n'
        f'{step_blocks}\n'
        '\n'
        '                    </div>\n'
        '                </div>\n'
        '            </div>\n'
        '        </section>'
    )


# ─── main ─────────────────────────────────────────────────────
def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    m = SECTION_RE.search(html)
    if not m:
        return False

    old_section = m.group(0)

    # Already updated?
    if 'step-number-giant' in old_section:
        return None  # skip

    # 1. Extract canvas-3d block
    cm = CANVAS_RE.search(old_section)
    if not cm:
        return False
    canvas_html = cm.group(1)

    # 2. Optional caption <p> right after canvas
    after_canvas = old_section[cm.end():]
    cap_m = CAPTION_RE.match(after_canvas)
    caption_html = cap_m.group(1).strip() if cap_m else None

    # 3. Extract steps
    steps = [{'num': sm.group(1), 'body': sm.group(2)} for sm in STEP_RE.finditer(old_section)]
    if not steps:
        return False

    # 4. Build replacement
    new_section = build_section(canvas_html, caption_html, steps)

    html = html[:m.start()] + new_section + '\n' + html[m.end():]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    return True


# ─── run ──────────────────────────────────────────────────────
updated = 0
skipped = 0
errors = []

for fname in sorted(os.listdir(STYLE_DIR)):
    if not fname.endswith('.html') or fname in EXCLUDE:
        continue
    fpath = os.path.join(STYLE_DIR, fname)
    result = process_file(fpath)
    if result is True:
        updated += 1
        print(f'  ✓ {fname}')
    elif result is None:
        skipped += 1
        print(f'  — {fname} (уже обновлён)')
    else:
        errors.append(fname)
        print(f'  ✗ {fname} — секция или шаги не найдены')

print(f'\nОбновлено: {updated}  |  Пропущено: {skipped}  |  Ошибки: {len(errors)}')
if errors:
    print('Файлы с ошибками:', ', '.join(errors))
