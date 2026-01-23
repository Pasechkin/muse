import re
from pathlib import Path

base = Path('src/html/portret-na-zakaz/style')
files = list(base.glob('*.html'))
if not files:
    print('No files found in', base)
    raise SystemExit(1)

changes = []
for f in files:
    text = f.read_text(encoding='utf-8')
    out = []
    changed = False
    lines = text.splitlines(True)
    for i, line in enumerate(lines):
        # only touch div wrapper lines; skip nav and CTA-like xl:flex rows
        if 'mx-auto px-4 max-w-[1170px]' in line and '<nav' not in line and 'xl:flex' not in line:
            new_line = line.replace('mx-auto px-4 max-w-[1170px]', 'container')
            if new_line != line:
                lines[i] = new_line
                changed = True
                out.append((i+1, line.strip(), new_line.strip()))
    if changed:
        # backup original file
        bak = f.parent / (f.name + '.precontainerbackup')
        bak.write_text(text, encoding='utf-8')
        f.write_text(''.join(lines), encoding='utf-8')
        changes.append((f, out, bak))

print('Files changed:', len(changes))
for f, out, bak in changes:
    print('-', f)
    print('  backup:', bak)
    for ln, old, new in out:
        print(f'   line {ln}:')
        print('     -', old)
        print('     +', new)
