from pathlib import Path
p = Path(r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\portret-na-zakaz\style\beauty-art-portret.html")
text = p.read_text(encoding='utf-8')
marker = '<img src="../../../icons/icon-27.svg"'
start = text.find(marker)
if start == -1:
    print('Marker not found')
    raise SystemExit(1)
# find end of img tag
img_end = text.find('>', start)
if img_end == -1:
    print('img end not found')
    raise SystemExit(1)
# find the next <p class="text-lg"> after img_end
p_start = text.find('\n                        <p class="text-lg">', img_end)
if p_start == -1:
    print('p start not found')
    raise SystemExit(1)
# build replacement
img_tag = text[start:img_end+1]
new_block = img_tag + '\r\n                        </div>\r\n                        '
# backup
bak = p.with_suffix(p.suffix + '.bak')
if not bak.exists():
    bak.write_text(text, encoding='utf-8')
    print('Backup created:', bak)
# replace
new_text = text[:start] + new_block + text[p_start:]
p.write_text(new_text, encoding='utf-8')
print('Normalized block in', p)
