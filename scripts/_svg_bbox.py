import re, sys

def parse_svg_bbox(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    paths = re.findall(r'd="([^"]+)"', content)
    all_x, all_y = [], []
    for d in paths:
        tokens = re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|[-+]?\d*\.?\d+', d)
        cx, cy = 0, 0
        i = 0
        cmd = 'M'
        while i < len(tokens):
            if tokens[i].isalpha():
                cmd = tokens[i]
                i += 1
                continue
            try:
                if cmd in ('M', 'L', 'T'):
                    cx, cy = float(tokens[i]), float(tokens[i+1])
                    all_x.append(cx); all_y.append(cy); i += 2
                elif cmd in ('m', 'l', 't'):
                    cx += float(tokens[i]); cy += float(tokens[i+1])
                    all_x.append(cx); all_y.append(cy); i += 2
                elif cmd == 'H':
                    cx = float(tokens[i]); all_x.append(cx); all_y.append(cy); i += 1
                elif cmd == 'h':
                    cx += float(tokens[i]); all_x.append(cx); all_y.append(cy); i += 1
                elif cmd == 'V':
                    cy = float(tokens[i]); all_x.append(cx); all_y.append(cy); i += 1
                elif cmd == 'v':
                    cy += float(tokens[i]); all_x.append(cx); all_y.append(cy); i += 1
                elif cmd == 'C':
                    for j in range(0, 6, 2):
                        all_x.append(float(tokens[i+j])); all_y.append(float(tokens[i+j+1]))
                    cx, cy = float(tokens[i+4]), float(tokens[i+5]); i += 6
                elif cmd == 'c':
                    for j in range(0, 6, 2):
                        all_x.append(cx+float(tokens[i+j])); all_y.append(cy+float(tokens[i+j+1]))
                    cx += float(tokens[i+4]); cy += float(tokens[i+5]); i += 6
                elif cmd == 'Q':
                    all_x.append(float(tokens[i])); all_y.append(float(tokens[i+1]))
                    cx, cy = float(tokens[i+2]), float(tokens[i+3])
                    all_x.append(cx); all_y.append(cy); i += 4
                elif cmd == 'q':
                    all_x.append(cx+float(tokens[i])); all_y.append(cy+float(tokens[i+1]))
                    cx += float(tokens[i+2]); cy += float(tokens[i+3])
                    all_x.append(cx); all_y.append(cy); i += 4
                elif cmd == 'S':
                    all_x.append(float(tokens[i])); all_y.append(float(tokens[i+1]))
                    cx, cy = float(tokens[i+2]), float(tokens[i+3])
                    all_x.append(cx); all_y.append(cy); i += 4
                elif cmd == 's':
                    all_x.append(cx+float(tokens[i])); all_y.append(cy+float(tokens[i+1]))
                    cx += float(tokens[i+2]); cy += float(tokens[i+3])
                    all_x.append(cx); all_y.append(cy); i += 4
                elif cmd == 'A':
                    cx, cy = float(tokens[i+5]), float(tokens[i+6])
                    all_x.append(cx); all_y.append(cy); i += 7
                elif cmd == 'a':
                    cx += float(tokens[i+5]); cy += float(tokens[i+6])
                    all_x.append(cx); all_y.append(cy); i += 7
                elif cmd in ('Z', 'z'):
                    pass
                else:
                    i += 1
            except (IndexError, ValueError):
                i += 1
    
    if all_x and all_y:
        return min(all_x), min(all_y), max(all_x), max(all_y)
    return None

for name, path in [
    ('SVG-01', r'C:\Users\Анна\Documents\Muse-tailwind\tailwind-project\draft\girl-with-pearl-earring-01.svg'),
    ('SVG-02', r'C:\Users\Анна\Documents\Muse-tailwind\tailwind-project\draft\girl-with-pearl-earring-02.svg'),
]:
    result = parse_svg_bbox(path)
    if result:
        mnx, mny, mxx, mxy = result
        w, h = mxx - mnx, mxy - mny
        pad = max(w, h) * 0.03
        side = max(w, h) + 2 * pad
        sq_x = mnx - pad - (side - w - 2*pad) / 2
        sq_y = mny - pad - (side - h - 2*pad) / 2
        print(f'{name}:')
        print(f'  Bbox: x=[{mnx:.0f}..{mxx:.0f}] y=[{mny:.0f}..{mxy:.0f}]  ({w:.0f}x{h:.0f})')
        print(f'  Square viewBox: {sq_x:.0f} {sq_y:.0f} {side:.0f} {side:.0f}')
