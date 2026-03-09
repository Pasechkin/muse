#!/usr/bin/env python3
"""Fix CTA buttons on all portrait pages to match the reference (portret-maslom.html).

Two fixes:
1. «Смотреть все примеры работ» — class btn-inverse → btn-primary, lowercase → Uppercase
2. «Обратный звонок» in CTA section — add &rarr;

Usage:
    python scripts/_fix_cta_buttons.py          # dry-run
    python scripts/_fix_cta_buttons.py --apply  # apply changes
"""

import argparse
import re
from pathlib import Path

STYLE_DIR = Path("src/html/portret-na-zakaz/style")
OBJECT_DIR = Path("src/html/portret-na-zakaz/object")

SKIP_FILES = {"portret-maslom.html", "portret-maslom-v7.html"}


def collect_files():
    files = []
    for d in (STYLE_DIR, OBJECT_DIR):
        if d.exists():
            files.extend(sorted(d.glob("*.html")))
    return [f for f in files if f.name not in SKIP_FILES]


def fix_примеры_btn(html: str) -> tuple[str, list[str]]:
    """btn-inverse → btn-primary + capitalize text for the 'примеры работ' link."""
    changes = []

    # Pattern: <a href="..." class="btn-inverse"> (or inline styles for semeynyy)
    #            смотреть все примеры работ
    #          </a>
    # Also match the old semeynyy pattern with inline classes
    def replacer(m):
        tag_open = m.group(1)   # <a href="..."
        old_cls = m.group(2)    # class="..."
        text = m.group(3)       # text content
        tag_close = m.group(4)  # </a>

        new_cls = 'class="btn-primary"'
        new_text = "Смотреть все примеры работ"

        changed = []
        if old_cls != new_cls:
            changed.append(f"  class: {old_cls} → {new_cls}")
        if text.strip() != new_text:
            changed.append(f"  text: «{text.strip()}» → «{new_text}»")

        if changed:
            changes.extend(changed)
            # Preserve original indentation from the text line
            indent = re.match(r"(\s*)", text).group(1)
            return f'{tag_open} {new_cls}>\n{indent}{new_text}\n{m.group(4)}'
        return m.group(0)

    pattern = re.compile(
        r'(<a\s+href="[^"]*")\s+(class="[^"]*")>\s*\n'
        r'(\s*[Сс]мотреть все примеры работ)\s*\n'
        r'(\s*</a>)',
        re.IGNORECASE
    )
    html = pattern.sub(replacer, html)
    return html, changes


def fix_обратный_звонок(html: str) -> tuple[str, list[str]]:
    """Add &rarr; to the 'Обратный звонок' link in the CTA section."""
    changes = []

    def replacer(m):
        before = m.group(1)
        arrow = m.group(2)  # might be empty or already &rarr;
        after = m.group(3)

        if not arrow.strip():
            changes.append("  added &rarr; to «Обратный звонок»")
            return f"{before} &rarr;{after}"
        return m.group(0)

    # Only match inside cta-section context: btn-inverse + Обратный звонок
    pattern = re.compile(
        r'(class="btn-inverse">\s*\n\s*Обратный звонок)(\s*?)(\s*\n\s*</a>)'
    )
    html = pattern.sub(replacer, html)
    return html, changes


def process_file(path: Path, apply: bool) -> dict:
    html = path.read_text(encoding="utf-8")
    original = html

    html, ch1 = fix_примеры_btn(html)
    html, ch2 = fix_обратный_звонок(html)

    all_changes = ch1 + ch2
    changed = html != original

    if changed and apply:
        path.write_text(html, encoding="utf-8")

    return {"path": path, "changes": all_changes, "changed": changed}


def main():
    parser = argparse.ArgumentParser(description="Fix CTA buttons")
    parser.add_argument("--apply", action="store_true", help="Apply changes")
    args = parser.parse_args()

    files = collect_files()
    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"=== {mode} === ({len(files)} файлов)\n")

    updated = 0
    for f in files:
        result = process_file(f, args.apply)
        if result["changes"]:
            updated += 1
            status = "✅" if args.apply else "🔍"
            print(f"{status} {result['path'].name}")
            for c in result["changes"]:
                print(f"   {c}")
        else:
            print(f"— {result['path'].name} (без изменений)")

    print(f"\n{'Обновлено' if args.apply else 'Будет обновлено'}: {updated} из {len(files)}")


if __name__ == "__main__":
    main()
