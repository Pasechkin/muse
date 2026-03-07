"""Mass update: promo-section → sale-banner on ALL remaining pages."""
import re, glob, os

# All remaining files with promo-section (found via grep)
targets = [
    'src/html/index.html',
    'src/html/portret-na-zakaz-po-foto-na-kholste-sankt-peterburg.html',
    'src/html/pechat-na-kholste-sankt-peterburg.html',
    'src/html/portret-na-zakaz/object/muzhskoy-portret.html',
    'src/html/portret-na-zakaz/object/zhenskiy-portret.html',
    'src/html/portret-na-zakaz/object/detskiy-portret.html',
    'src/html/portret-na-zakaz/object/parnyy-portret.html',
    'src/html/portret-na-zakaz/object/semeynyy-portret.html',
    'src/html/pechat/reproduktsiya.html',
    'src/html/pechat/modulnaya-kartina.html',
    'src/html/pechat/fotokollazh-na-kholste.html',
    'src/html/pechat/foto-v-ramke.html',
    'src/html/pechat/foto-na-kholste-sankt-peterburg.html',
]

new_banner = """        <!-- Акция -->
        <section class="sale-banner">
            <p class="sale-banner-text">
                <strong>Скидка 20%</strong> с 6 по 7 марта
            </p>
        </section>"""

# Less-indented version for pages with 4-space indent (index, pechat-na-kholste, portret-na-zakaz-po-foto)
new_banner_4 = """    <!-- Акция -->
    <section class="sale-banner">
        <p class="sale-banner-text">
            <strong>Скидка 20%</strong> с 6 по 7 марта
        </p>
    </section>"""

# Generic pattern matching any promo-section block (various comments and indents)
pattern = re.compile(
    r'(\s*)(?:<!--[^>]*-->)\s*\n'       # any HTML comment
    r'\s*<(?:section|div) class="promo-section[^"]*">\s*\n'
    r'\s*<div class="container">\s*\n'
    r'\s*<div class="flex items-center justify-center">\s*\n'
    r'\s*<p class="text-lead[^"]*">.*?</p>\s*\n'
    r'\s*</div>\s*\n'
    r'\s*</div>\s*\n'
    r'\s*</(?:section|div)>',
    re.DOTALL
)

count = 0

for fp in targets:
    if not os.path.exists(fp):
        print(f'  MISSING: {fp}')
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    def replacer(m):
        indent = m.group(1)
        # Determine indent level
        if len(indent.replace('\n', '')) <= 4:
            return new_banner_4
        return new_banner

    content, n = pattern.subn(replacer, content)

    # Also remove ↗ arrows
    content = content.replace(' ↗</a>', '</a>')

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  Updated: {fp} ({n} banners)')
        count += n
    else:
        print(f'  No match: {fp}')

print(f'\nTotal: {count} banners replaced')
