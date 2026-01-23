#!/usr/bin/env python3
"""replace_svg_with_icons.py

Batch-replace inline SVG icons in product pages with external icon files.
- Creates `.bak` backups before writing.
- Supports --dry-run (no changes) and --apply (write changes).
- Scans files under src/html/portret-na-zakaz/style/*.html

Usage:
    python scripts/replace_svg_with_icons.py --dry-run
    python scripts/replace_svg_with_icons.py --apply

Notes:
- Configure `ICON_MAP` to control which icon (by filename number) will be used for card index 1..N.
- The script attempts to match the icon wrapper div (class contains `w-16 h-16`) and replaces its inner content.
"""

from pathlib import Path
import re
import argparse
import shutil
import sys

ICON_MAP = [27, 26, 1, 25, 5, 6]  # icons for cards 1..6 (can be expanded)
ICON_HTML_TEMPLATE = ('<div class="w-16 h-16 mb-4 flex items-center justify-start">\n'
                      '                            <img src="../../../icons/icon-{icon}.svg" alt="{alt}" class="w-10 h-10" '
                      'style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) '
                      'brightness(94%) contrast(89%);">\n'
                      '                        </div>')

ROOT = Path(__file__).resolve().parents[1]
TARGET_GLOB = 'src/html/portret-na-zakaz/style/*.html'

ICON_DIV_RE = re.compile(r'(<div[^>]*class="[^"]*w-16 h-16[^"]*">)(.*?)(</div>)', re.S)
P_TEXT_RE = re.compile(r'<p[^>]*class="text-lg"[^>]*>(.*?)</p>', re.S)


def process_file(path: Path, dry_run: bool = True):
    text = path.read_text(encoding='utf-8')
    changed = False
    edits = []

    # find all icon wrapper divs
    matches = list(ICON_DIV_RE.finditer(text))
    if not matches:
        return changed, edits

    for idx, m in enumerate(matches):
        whole = m.group(0)
        inner = m.group(2)
        # skip if already an <img>
        if '<img' in inner:
            continue

        # find following <p class="text-lg"> after match end to use as alt text
        after = text[m.end():m.end()+300]
        p = P_TEXT_RE.search(after)
        alt = ''
        if p:
            alt_raw = p.group(1).strip()
            # take first sentence or up to 50 chars
            alt = re.sub(r'<[^>]+>', '', alt_raw)  # strip tags
            if len(alt) > 60:
                alt = alt[:57].rstrip() + '...'
        else:
            alt = 'Иконка'

        icon = ICON_MAP[idx] if idx < len(ICON_MAP) else ICON_MAP[-1]
        new_div = ICON_HTML_TEMPLATE.format(icon=icon, alt=alt.replace('"', ''))

        edits.append((m.start(), m.end(), whole, new_div))

    if not edits:
        return changed, edits

    # apply edits from end to start to keep indices stable
    new_text = text
    for start, end, old, new in reversed(edits):
        new_text = new_text[:start] + new + new_text[end:]
        changed = True

    if changed and not dry_run:
        bak = path.with_suffix(path.suffix + '.bak')
        shutil.copyfile(path, bak)
        path.write_text(new_text, encoding='utf-8')

    return changed, edits


def main():
    parser = argparse.ArgumentParser(description='Replace inline SVG icons with external icons')
    parser.add_argument('--apply', action='store_true', help='Apply changes (writes files, creates .bak).')
    parser.add_argument('--glob', default=TARGET_GLOB, help='Glob for target files')
    args = parser.parse_args()

    files = list((ROOT / args.glob).parent.glob((ROOT / args.glob).name))
    if not files:
        print('No target files found for glob:', args.glob)
        sys.exit(1)

    any_changed = False
    for f in files:
        changed, edits = process_file(f, dry_run=not args.apply)
        if changed:
            any_changed = True
            print(f"[{'DRY' if not args.apply else 'APPLY'}] {f}: {len(edits)} icon(s) replaced")
            for i, e in enumerate(edits, 1):
                old_preview = re.sub(r'\s+', ' ', e[2].strip())[:120]
                print(f"  {i}. preview: {old_preview}...")
        else:
            print(f"{f}: no change")

    if any_changed and not args.apply:
        print('\nDry-run mode: run with --apply to write changes and create .bak files')


if __name__ == '__main__':
    main()
