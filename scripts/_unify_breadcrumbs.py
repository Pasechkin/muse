"""
Скрипт для унификации хлебных крошек.
1. Светлые страницы: меняет nav class на "breadcrumbs mb-4",
   убирает inline-цвета с ссылок и span/li внутри хлебных крошек.
2. Тёмные страницы: убирает лишние inline-цвета
   (text-ink-muted-on-dark, text-ink-on-dark, link-on-dark-plain).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "html"

# ── Утилита: безопасная замена в файле ──
def patch(path: Path, old: str, new: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        return False
    text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")
    return True

# ── Утилита: regex-замена внутри блока <nav...breadcrumb...>...</nav> ──
def clean_breadcrumb_block(path: Path, replacements: list[tuple[str, str]]):
    """replacements = [(regex_pattern, replacement_string), ...]"""
    text = path.read_text(encoding="utf-8")
    # Находим все блоки хлебных крошек
    pattern = re.compile(
        r'(<nav\b[^>]*(?:Breadcrumb|Хлебные крошки)[^>]*>)(.*?)(</nav>)',
        re.DOTALL
    )
    def replace_in_block(m):
        nav_open = m.group(1)
        body = m.group(2)
        nav_close = m.group(3)
        for regex, repl in replacements:
            body = re.sub(regex, repl, body)
        return nav_open + body + nav_close

    new_text = pattern.sub(replace_in_block, text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


# ═══════════════════════════════════════
# Шаг 1: Светлые страницы — nav class
# ═══════════════════════════════════════
print("=== Шаг 1: Nav class на светлых страницах ===")
count = 0
for html in ROOT.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    # Паттерн: <nav class="text-ink-muted mb-4" или "text-ink-soft mb-4"
    new_text = re.sub(
        r'<nav\s+class="text-ink-(?:muted|soft)\s+mb-4"',
        '<nav class="breadcrumbs mb-4"',
        text
    )
    if new_text != text:
        html.write_text(new_text, encoding="utf-8")
        count += 1
        print(f"  nav class → breadcrumbs: {html.relative_to(ROOT)}")
print(f"  Итого: {count} файлов\n")


# ═══════════════════════════════════════
# Шаг 2: Светлые страницы — inline-цвета
# ═══════════════════════════════════════
print("=== Шаг 2: Inline-цвета на светлых страницах ===")
# Цвета, которые нужно убрать из ссылок и элементов внутри хлебных крошек
light_replacements = [
    # Ссылки: убираем text-primary-text hover:text-ah-600 transition-colors
    (r'\s*class="text-primary-text hover:text-ah-600 transition-colors"', ''),
    # Ссылки: убираем hover:underline
    (r'\s*class="hover:underline"', ''),
    # li с текущей страницей: class="text-ah-975 truncate" → class="truncate"
    (r'class="text-ah-975 truncate"', 'class="truncate"'),
    # li с текущей страницей: class="text-ah-975" → убираем class
    (r'\s*class="text-ah-975"', ''),
    # Разделители li: class="text-ink-muted" → убираем class
    (r'(<li)\s+class="text-ink-muted"(>)', r'\1\2'),
    # Текущая li: class="text-ink-muted" → убираем
    (r'(<li)\s+class="text-ink-muted"(>)', r'\1\2'),
]

count = 0
for html in ROOT.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    # Только файлы на светлых фонах (bg-ah-25 или bg-ah-50 содержащие breadcrumbs)
    if 'breadcrumbs mb-4' in text and ('bg-ah-50' in text or 'bg-ah-25' in text):
        # Проверяем, что внутри breadcrumbs есть inline-цвета
        if any(s in text for s in ['text-primary-text', 'text-ah-975', 'text-ink-muted', 'hover:underline']):
            if clean_breadcrumb_block(html, light_replacements):
                count += 1
                print(f"  очистка inline: {html.relative_to(ROOT)}")
print(f"  Итого: {count} файлов\n")


# ═══════════════════════════════════════
# Шаг 3: Тёмные страницы — inline-цвета
# ═══════════════════════════════════════
print("=== Шаг 3: Inline-цвета на тёмных страницах ===")
dark_replacements = [
    # Ссылки: text-ink-muted-on-dark hover:text-ink-on-dark transition-colors
    (r'\s*class="text-ink-muted-on-dark hover:text-ink-on-dark transition-colors"', ''),
    # Ссылки: link-on-dark-plain
    (r'\s*class="link-on-dark-plain"', ''),
    # Разделители li: class="text-ink-muted-on-dark"
    (r'(<li)\s+class="text-ink-muted-on-dark"', r'\1'),
    # Текущая страница li: class="text-ink-on-dark"
    (r'(<li)\s+class="text-ink-on-dark"', r'\1'),
    # Разделители span: "mx-2 text-ink-muted-on-dark" → "mx-2"
    (r'class="mx-2 text-ink-muted-on-dark"', 'class="mx-2"'),
    # Текущая li: class="text-ink-muted-on-dark" (pechat subpages)
    (r'(<li)\s+class="text-ink-muted-on-dark"', r'\1'),
]

count = 0
for html in ROOT.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    if 'breadcrumbs mb-4' in text and 'bg-ah-975' in text:
        if any(s in text for s in ['text-ink-muted-on-dark', 'text-ink-on-dark', 'link-on-dark-plain']):
            # Проверяем что эти классы именно в breadcrumb блоке
            if clean_breadcrumb_block(html, dark_replacements):
                count += 1
                print(f"  очистка inline: {html.relative_to(ROOT)}")
print(f"  Итого: {count} файлов\n")

print("Готово!")
