from pathlib import Path
import re

root = Path('src/html')
ignore_dirs = ['archive_legacy', 'backup_legacy']
pattern = 'mx-auto px-4 max-w-[1170px]'
changed_files = []

for f in root.rglob('*.html'):
    if any(part in f.parts for part in ignore_dirs):
        continue
    text = f.read_text(encoding='utf-8')
    if pattern not in text:
        continue
    lines = text.splitlines(True)
    out = []
    changed = False
    in_header = False
    in_footer = False
    for i, line in enumerate(lines):
        # Track whether we're inside header/footer blocks
        if '<header' in line:
            in_header = True
        if '</header>' in line:
            in_header = False
        if '<footer' in line:
            in_footer = True
        if '</footer>' in line:
            in_footer = False

        # Skip header/nav/footer and CTA rows
        if pattern in line and not in_header and not in_footer and '<nav' not in line and 'xl:flex' not in line:
            new_line = line.replace(pattern, 'container')
            if new_line != line:
                lines[i] = new_line
                changed = True
                out.append((i+1, line.strip(), new_line.strip()))
    if changed:
        bak = f.parent / (f.name + '.precontainerbackup')
        bak.write_text(text, encoding='utf-8')
        f.write_text(''.join(lines), encoding='utf-8')
        changed_files.append((f, out, bak))

print('Files changed:', len(changed_files))
for f, out, bak in changed_files:
    print('-', f)
    print('  backup:', bak)
    for ln, old, new in out:
        print(f'   line {ln}:')
        print('     -', old)
        print('     +', new)
