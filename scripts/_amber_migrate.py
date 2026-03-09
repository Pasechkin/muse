"""Batch migrate old blue-theme classes to Amber V7 across HTML files."""
import sys
import os

# Ordered replacements (order matters — more specific patterns first)
REPLACEMENTS = [
    # Buttons
    ('bg-primary hover:bg-primary-hover', 'bg-ah-950 hover:bg-ah-900'),
    # Hover combos (must come before individual hover)
    ('hover:border-primary hover:text-primary', 'hover:border-ah-600 hover:text-ah-600'),
    ('hover:border-primary', 'hover:border-ah-600'),
    ('hover:bg-primary-hover', 'hover:bg-ah-900'),
    ('hover:text-primary', 'hover:text-ah-600'),
    # Focus
    ('focus:ring-primary/50', 'focus:ring-ah-600/50'),
    ('focus:ring-primary', 'focus:ring-ah-600'),
    # Aria / selected
    ('in-aria-selected:border-primary', 'in-aria-selected:border-ah-600'),
    ('aria-[selected=true]:border-primary', 'aria-[selected=true]:border-ah-600'),
    # Group hover
    ('group-hover:text-primary', 'group-hover:text-ah-600'),
    # Border
    ('border-primary bg-dark', 'border-ah-600 bg-ah-975'),
    ('border-primary', 'border-ah-600'),
    # Background
    ('odd:bg-primary/5', 'odd:bg-ah-50'),
    ('bg-primary-light', 'bg-ah-50'),
    ('bg-primary', 'bg-ah-950'),
    ('bg-dark', 'bg-ah-975'),
    # Text (careful: text-primary-text must NOT be touched)
    # We handle text-primary separately to avoid matching text-primary-text
]

# text-primary requires special handling
TEXT_PRIMARY_PATTERN = None  # Will be handled with word-boundary logic

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    total_changes = 0

    for old, new in REPLACEMENTS:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            total_changes += count
            print(f'  {old} -> {new} ({count}x)')

    # Handle text-primary separately (avoid text-primary-text, text-primary-hover)
    import re
    # Match text-primary that is NOT followed by - (which would make it text-primary-text etc)
    pattern = r'text-primary(?![-])'
    matches = list(re.finditer(pattern, content))
    if matches:
        content = re.sub(pattern, 'text-ah-950', content)
        print(f'  text-primary -> text-ah-950 ({len(matches)}x) [regex]')
        total_changes += len(matches)

    # text-dark -> text-body
    count = content.count('text-dark')
    if count > 0:
        content = content.replace('text-dark', 'text-body')
        total_changes += count
        print(f'  text-dark -> text-body ({count}x)')

    # ring-primary (standalone)
    count = content.count('ring-primary')
    if count > 0:
        content = content.replace('ring-primary', 'ring-ah-600')
        total_changes += count
        print(f'  ring-primary -> ring-ah-600 ({count}x)')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  -> {total_changes} changes saved')
    else:
        print(f'  -> No changes needed')

    return total_changes


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python _amber_migrate.py <file_or_glob> ...')
        sys.exit(1)

    import glob
    total = 0
    for arg in sys.argv[1:]:
        files = glob.glob(arg, recursive=True)
        if not files:
            print(f'No files match: {arg}')
            continue
        for f in sorted(files):
            print(f'\n=== {f} ===')
            total += migrate_file(f)

    print(f'\n=== TOTAL: {total} changes across all files ===')
