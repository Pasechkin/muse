from pathlib import Path
import re

ROOT = Path(r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project")
SRC = ROOT / "src" / "html" / "portret-na-zakaz" / "style"

ICON_MAP = [27,26,1,25,5,6]  # default mapping for card positions 1..6
DEFAULT_STYLE = 'filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);'

html_files = sorted(SRC.glob('*.html'))
modified = []

card_section_re = re.compile(r'(<!-- Преимущества[\s\S]*?id="preimushchestva"[\s\S]*?<div class="mx-auto[\s\S]*?">)([\s\S]*?)(</section>)', re.I)
card_block_re = re.compile(r'(<div class="bg-white rounded-lg p-6 text-left text-dark">)([\s\S]*?)(</div>\s*)', re.I)
icon_wrapper_re = re.compile(r'(<div class="w-16 h-16 mb-4 flex items-center justify-start">)([\s\S]*?)(</div>)', re.I)
img_re = re.compile(r'<img\s+[^>]*src=["\']([^"\']+)["\'][^>]*>', re.I)
p_text_re = re.compile(r'<p\s+class=["\']text-lg["\']>([\s\S]*?)</p>', re.I)

for f in html_files:
    text = f.read_text(encoding='utf-8')
    original = text
    changed = False

    # find the preimushchestva section
    match_sec = card_section_re.search(text)
    if not match_sec:
        continue

    sec_content = match_sec.group(2)
    # find all card blocks within that section
    changed_flag = [False]
    def repl_card(m):
        block = m.group(0)
        inner = m.group(2)
        # find icon wrapper
        im = icon_wrapper_re.search(inner)
        if not im:
            return block
        wrapper = im.group(0)
        # find <img> in wrapper
        img_m = img_re.search(wrapper)
        if img_m:
            img_tag = img_m.group(0)
        else:
            # no img: try to pick icon by card index (count position)
            # determine card index by counting previous blocks
            # count how many card blocks before this one in the section
            pre_blocks = card_block_re.findall(sec_content[:m.start()])
            idx = len(pre_blocks)
            icon_num = ICON_MAP[idx] if idx < len(ICON_MAP) else ICON_MAP[-1]
            # try to extract alt from corresponding <p class="text-lg"> inside block
            p_m = p_text_re.search(inner)
            alt = p_m.group(1).strip() if p_m else ''
            alt = re.sub(r"\s+", " ", alt)
            if len(alt) > 80:
                alt = alt[:77] + '...'
            img_tag = f'<img src="../../../icons/icon-{icon_num}.svg" alt="{alt}" class="w-10 h-10" style="{DEFAULT_STYLE}">'

        # build normalized wrapper (keep img_tag as-is)
        # ensure img_tag is single-line and proper indentation
        img_tag_single = img_tag.strip()
        new_wrapper = '                        <div class="w-16 h-16 mb-4 flex items-center justify-start">\n                            ' + img_tag_single + '\n                        </div>'

        # replace wrapper in block
        new_inner = inner[:im.start()] + new_wrapper + inner[im.end():]
        changed_flag[0] = True
        return m.group(1) + new_inner + m.group(3)

    new_sec = card_block_re.sub(repl_card, sec_content)
    if changed_flag[0]:
        # replace section content
        new_text = text[:match_sec.start(2)] + new_sec + text[match_sec.end(2):]
        # backup
        bak = f.with_suffix(f.suffix + '.bak')
        if not bak.exists():
            bak.write_text(original, encoding='utf-8')
        f.write_text(new_text, encoding='utf-8')
        modified.append(f)

# report
if modified:
    print('Modified files:')
    for m in modified:
        print('  -', m)
else:
    print('No changes needed')
