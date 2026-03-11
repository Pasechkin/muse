"""
Phase 2: Migrate .style-portraits CSS → BEM component modifiers in HTML.

Adds modifier classes to portrait page HTML files:
  - sale-banner → sale-banner sale-banner--dark
  - heading-section → heading-section heading-section--tight (or --extra-tight in #primery / .cta-section)
  - heading-card → heading-card heading-card--tight
  - Sections (kak-zakazat, harakteristiki, preimushchestva, otzyvy, opisanie) → section--dark-text
  - check-list (in #harakteristiki) → check-list check-list--spaced
  - text-ink div (in #opisanie) → text-ink text-ink--readable

Safe to run multiple times (idempotent).
"""

import re
import os
import glob

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'html')
BASE = os.path.normpath(BASE)

FILES = sorted(
    glob.glob(os.path.join(BASE, 'portret-na-zakaz', 'style', '*.html')) +
    glob.glob(os.path.join(BASE, 'portret-na-zakaz', 'object', '*.html'))
)

DARK_TEXT_IDS = {'kak-zakazat', 'harakteristiki', 'preimushchestva', 'otzyvy', 'opisanie'}
EXTRA_TIGHT_MARKERS = ['id="primery"', 'class="cta-section']


def migrate(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changed = False

    # === Pass 1: Line-by-line replacements ===
    for i in range(len(lines)):
        original_line = lines[i]

        # 1. sale-banner → sale-banner--dark
        if 'class="sale-banner"' in lines[i]:
            lines[i] = lines[i].replace('class="sale-banner"', 'class="sale-banner sale-banner--dark"')

        # 2. section--dark-text on specific section IDs
        if '<section' in lines[i]:
            for sid in DARK_TEXT_IDS:
                if f'id="{sid}"' in lines[i] and 'section--dark-text' not in lines[i]:
                    lines[i] = lines[i].replace('class="', 'class="section--dark-text ', 1)
                    break

        # 3. heading-card → heading-card--tight (all instances in class attrs)
        if 'heading-card' in lines[i] and 'heading-card--tight' not in lines[i]:
            lines[i] = re.sub(
                r'(class="[^"]*?)\bheading-card\b(?!-)',
                r'\1heading-card heading-card--tight',
                lines[i]
            )

        # 4. heading-section → heading-section--tight (default, all in class attrs)
        if ('heading-section' in lines[i]
                and 'heading-section--tight' not in lines[i]
                and 'heading-section--extra-tight' not in lines[i]):
            lines[i] = re.sub(
                r'(class="[^"]*?)\bheading-section\b(?!-)',
                r'\1heading-section heading-section--tight',
                lines[i]
            )

        if lines[i] != original_line:
            changed = True

    # === Pass 2: Override heading-section--tight → --extra-tight near #primery / .cta-section ===
    for i in range(len(lines)):
        for marker in EXTRA_TIGHT_MARKERS:
            if marker in lines[i]:
                for j in range(i, min(i + 8, len(lines))):
                    if 'heading-section--tight' in lines[j]:
                        # Replace --tight with --extra-tight (not add alongside)
                        lines[j] = lines[j].replace('heading-section--tight', 'heading-section--extra-tight')
                        changed = True
                        break

    # === Pass 3: check-list → check-list--spaced (inside #harakteristiki) ===
    for i in range(len(lines)):
        if 'id="harakteristiki"' in lines[i]:
            for j in range(i, min(i + 25, len(lines))):
                if ('<ul' in lines[j] and 'check-list' in lines[j]
                        and 'check-list-item' not in lines[j]
                        and 'check-list--' not in lines[j]):
                    lines[j] = lines[j].replace('class="check-list ', 'class="check-list check-list--spaced ')
                    changed = True
                    break
            break

    # === Pass 4: text-ink → text-ink--readable (the float-wrapper div in #opisanie) ===
    for i in range(len(lines)):
        if 'id="opisanie"' in lines[i]:
            for j in range(i, min(i + 15, len(lines))):
                if ('<div' in lines[j]
                        and 'class="text-ink' in lines[j]
                        and 'text-ink--' not in lines[j]):
                    lines[j] = lines[j].replace('class="text-ink ', 'class="text-ink text-ink--readable ')
                    changed = True
                    break
            break

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    return changed


def main():
    print(f'Migrating {len(FILES)} portrait files...\n')
    modified = 0
    for fp in FILES:
        result = migrate(fp)
        name = os.path.relpath(fp, BASE)
        status = '\u2713' if result else '\u2014'
        print(f'  {status} {name}')
        if result:
            modified += 1
    print(f'\nDone: {modified}/{len(FILES)} files modified.')


if __name__ == '__main__':
    main()
