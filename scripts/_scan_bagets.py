"""Scan draft/Багет/ and generate draft/baget-data.js"""
import os, json, re

base = os.path.join(os.path.dirname(__file__), '..', 'draft', 'Багет')
base = os.path.normpath(base)
entries = []

for group_name in sorted(os.listdir(base)):
    group_path = os.path.join(base, group_name)
    if not os.path.isdir(group_path):
        continue

    for item in sorted(os.listdir(group_path)):
        item_path = os.path.join(group_path, item)
        if not os.path.isdir(item_path):
            continue

        # Direct baguette folder (has 1.jpeg or 1.png)?
        ext = None
        if os.path.exists(os.path.join(item_path, '1.jpeg')):
            ext = 'jpeg'
        elif os.path.exists(os.path.join(item_path, '1.png')):
            ext = 'png'

        if ext:
            parts = item.rsplit('-', 1)
            article = parts[0]
            price = int(parts[1]) if len(parts) > 1 else 0
            width_mm = int(re.match(r'(\d+)', item).group(1)) if re.match(r'(\d+)', item) else 0
            rel = 'Багет/' + group_name + '/' + item
            entries.append({
                'id': article,
                'group': group_name,
                'subgroup': None,
                'widthMm': width_mm,
                'pricePerM': price,
                'stripUrl': rel + '/1.' + ext,
                'cornerUrl': rel + '/2.' + ext
            })
        else:
            # Subgroup folder
            subgroup_name = item
            for baget in sorted(os.listdir(item_path)):
                baget_path = os.path.join(item_path, baget)
                if not os.path.isdir(baget_path):
                    continue
                ext = None
                if os.path.exists(os.path.join(baget_path, '1.jpeg')):
                    ext = 'jpeg'
                elif os.path.exists(os.path.join(baget_path, '1.png')):
                    ext = 'png'
                if not ext:
                    continue
                parts = baget.rsplit('-', 1)
                article = parts[0]
                price = int(parts[1]) if len(parts) > 1 else 0
                width_mm = int(re.match(r'(\d+)', baget).group(1)) if re.match(r'(\d+)', baget) else 0
                rel = 'Багет/' + group_name + '/' + subgroup_name + '/' + baget
                entries.append({
                    'id': article,
                    'group': group_name,
                    'subgroup': subgroup_name,
                    'widthMm': width_mm,
                    'pricePerM': price,
                    'stripUrl': rel + '/1.' + ext,
                    'cornerUrl': rel + '/2.' + ext
                })

entries.sort(key=lambda e: (e['group'], e['subgroup'] or '', e['id']))

# Write JS file
out_path = os.path.join(os.path.dirname(__file__), '..', 'draft', 'baget-data.js')
out_path = os.path.normpath(out_path)

lines = ['// Auto-generated from draft/Багет/ folder structure', 
         '// 1.jpeg = strip (полоска), 2.jpeg = corner (уголок)',
         '// Price formula: 0.18 * (width_cm + height_cm) * pricePerM',
         'var REAL_BAGETS = ']
lines.append(json.dumps(entries, ensure_ascii=False, indent=2) + ';')

with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Generated {len(entries)} baguettes -> {out_path}')
for e in entries:
    sg = e['subgroup'] or '-'
    print(f"  {e['group']:15s} {sg:30s} {e['id']:15s} {e['widthMm']:>3d} мм  {e['pricePerM']:>4d} р/м")
