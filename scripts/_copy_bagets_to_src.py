"""Copy baguette images from draft/Багет/ to src/html/img/bagets/{id}/."""
import json, os, shutil

with open('draft/baget-data.js', 'r', encoding='utf-8') as f:
    text = f.read()
start = text.index('[')
end = text.rindex(']') + 1
data = json.loads(text[start:end])

dst_base = os.path.join('src', 'html', 'img', 'bagets')
os.makedirs(dst_base, exist_ok=True)

copied = 0
errors = []
for b in data:
    bid = b['id']
    dst_dir = os.path.join(dst_base, bid)
    os.makedirs(dst_dir, exist_ok=True)

    strip_src = os.path.join('draft', b['stripUrl'])
    corner_src = os.path.join('draft', b['cornerUrl'])

    strip_ext = os.path.splitext(b['stripUrl'])[1]
    corner_ext = os.path.splitext(b['cornerUrl'])[1]

    for src, name, ext in [(strip_src, '1', strip_ext), (corner_src, '2', corner_ext)]:
        dst = os.path.join(dst_dir, name + ext)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            copied += 1
        else:
            errors.append(f'MISSING: {src}')

print(f'Copied {copied} files into {dst_base}/')
print(f'Folders: {len(data)}')
if errors:
    for e in errors:
        print(e)
else:
    print('No errors.')
