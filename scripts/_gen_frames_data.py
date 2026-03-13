"""Generate frames.js data section from baget-data.js."""
import json, os

with open('draft/baget-data.js', 'r', encoding='utf-8') as f:
    text = f.read()
start = text.index('[')
end = text.rindex(']') + 1
data = json.loads(text[start:end])

group_order = {'плоский': 0, 'студийный': 1, 'классический': 2}
cat_map = {'плоский': 'FLAT', 'студийный': 'STUDIO', 'классический': 'CLASSIC'}
color_map = {'плоский': '#C4A87C', 'студийный': '#4A4A4A', 'классический': '#8B7355'}

data.sort(key=lambda x: (group_order.get(x['group'], 9), x['widthMm'], x['id']))

lines = []
for b in data:
    bid = b['id']
    grp = b['group']
    cat = cat_map[grp]
    clr = color_map[grp]
    wmm = b['widthMm']
    wpx = max(4, round(wmm * 0.8))
    ppm = b['pricePerM']

    folder = os.path.join('src', 'html', 'img', 'bagets', bid)
    files = os.listdir(folder)
    strip_file = [f for f in files if f.startswith('1.')][0]
    corner_file = [f for f in files if f.startswith('2.')][0]
    strip_url = f'img/bagets/{bid}/{strip_file}'
    corner_url = f'img/bagets/{bid}/{corner_file}'

    line = f"    {{ id: '{bid}', name: '{bid}', cat: '{cat}', group: '{grp}', widthMm: {wmm}, width: {wpx}, pricePerM: {ppm}, stripUrl: '{strip_url}', cornerUrl: '{corner_url}', imageUrl: '{corner_url}', color: '{clr}', available: true }},"
    lines.append(line)

with open('_frames_data.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print(f'Generated {len(data)} entries to _frames_data.txt')
