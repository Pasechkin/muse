"""Аудит: ищу оставшиеся inline-цвета внутри breadcrumb-блоков."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "html"
suspect = [
    'text-primary-text', 'text-ah-600', 'text-ah-975',
    'text-ink-muted-on-dark', 'text-ink-on-dark', 'link-on-dark-plain',
    'hover:underline', 'hover:text-ah-600',
    'text-ink-muted', 'text-ink-soft', 'text-body',
]
pattern = re.compile(
    r'(<nav\b[^>]*(?:Breadcrumb|Хлебные крошки)[^>]*>)(.*?)(</nav>)',
    re.DOTALL
)
found = 0
for f in sorted(ROOT.rglob("*.html")):
    text = f.read_text("utf-8")
    for m in pattern.finditer(text):
        block = m.group(2)
        hits = [s for s in suspect if s in block]
        if hits:
            line = text[:m.start()].count("\n") + 1
            found += 1
            print(f"  {f.relative_to(ROOT)}:{line} -> {', '.join(hits)}")
print(f"\nНайдено: {found} файлов с остатками")
