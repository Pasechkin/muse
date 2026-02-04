#!/usr/bin/env python3
"""Замена старых миниатюр play на ui-control--sm стиль."""
import re
from pathlib import Path

SRC_DIR = Path(__file__).parent.parent / "src" / "html"

# Паттерн: старая миниатюра с bg-black/30 и svg w-6 h-6
OLD_PATTERN = re.compile(
    r'<span class="absolute inset-0 flex items-center justify-center bg-black/30">\s*'
    r'<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>\s*'
    r'</span>',
    re.DOTALL
)

NEW_THUMBNAIL = '''<span class="ui-control ui-control--sm absolute inset-0 m-auto">
                                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                            </span>'''

def main():
    updated_files = 0
    total_replacements = 0
    
    for html_file in SRC_DIR.rglob("*.html"):
        content = html_file.read_text(encoding="utf-8")
        if 'bg-black/30' in content and 'w-6 h-6' in content:
            new_content, count = OLD_PATTERN.subn(NEW_THUMBNAIL, content)
            if count > 0:
                html_file.write_text(new_content, encoding="utf-8")
                print(f"✓ {html_file.relative_to(SRC_DIR)}: {count} замен")
                updated_files += 1
                total_replacements += count
    
    print(f"\nОбновлено файлов: {updated_files}")
    print(f"Всего замен: {total_replacements}")

if __name__ == "__main__":
    main()
