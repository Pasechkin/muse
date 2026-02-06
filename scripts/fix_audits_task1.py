import os
import re

files = [
    "src/html/foto-na-kholste-sankt-peterburg.html",
    "src/html/index.html",
    "src/html/info/info.html",
    "src/html/portret-na-zakaz/style/beauty-art-portret.html",
    "src/html/portret-na-zakaz/object/detskiy-portret.html",
    "src/html/portret-na-zakaz/style/drim-art-portret.html",
    "src/html/portret-na-zakaz/style/fantasy-art-portret.html",
    "src/html/portret-na-zakaz/style/fotomozaika.html",
    "src/html/portret-na-zakaz/style/graffiti-portret.html",
    "src/html/portret-na-zakaz/style/granzh-portret.html",
    "src/html/portret-na-zakaz/style/love-is-portret.html",
    "src/html/portret-na-zakaz/style/low-poly-portret.html",
    "src/html/portret-na-zakaz/object/muzhskoy-portret.html",
    "src/html/portret-na-zakaz/object/parnyy-portret.html",
    "src/html/portret-na-zakaz/style/pop-art-portret.html",
    "src/html/portret-na-zakaz/style/portret-akvarelyu.html",
    "src/html/portret-na-zakaz/style/portret-flower-art.html",
    "src/html/portret-na-zakaz/style/portret-iz-slov.html",
    "src/html/portret-na-zakaz/style/portret-karandashom.html",
    "src/html/portret-na-zakaz/style/portret-komiks.html",
    "src/html/portret-na-zakaz/style/portret-maslom.html",
    "src/html/portret-na-zakaz/style/portret-v-obraze.html",
    "src/html/portret-na-zakaz/object/semeynyy-portret.html",
    "src/html/portret-na-zakaz/style/sharzh-po-foto.html",
    "src/html/portret-na-zakaz/style/wpap-portret.html",
    "src/html/portret-na-zakaz/object/zhenskiy-portret.html"
]

base_path = "c:/Users/Анна/Documents/Muse-tailwind/tailwind-project"

def ensure_attr(tag, attr_name, attr_value):
    pattern = rf'\s{attr_name}="[^"]*"'
    if re.search(pattern, tag):
        return re.sub(pattern, f' {attr_name}="{attr_value}"', tag)
    return tag.replace('<img', f'<img {attr_name}="{attr_value}"', 1)


def normalize_hero_section(html):
    hero_match = re.search(r'(<section[^>]*\bid="hero"[^>]*>)(.*?)(</section>)', html, re.DOTALL)
    if not hero_match:
        return html

    hero_open, hero_body, hero_close = hero_match.groups()

    # Remove content-auto from hero class list if present.
    hero_open = re.sub(r'(\bclass="[^"]*)\bcontent-auto\b\s*', r'\1', hero_open)

    img_match = re.search(r'<img\b[^>]*>', hero_body)
    if not img_match:
        return html[:hero_match.start()] + hero_open + hero_body + hero_close + html[hero_match.end():]

    img_tag = img_match.group(0)
    new_img_tag = img_tag

    # LCP image: ensure eager + fetchpriority high, remove lazy.
    new_img_tag = re.sub(r'\sloading="lazy"', '', new_img_tag)
    new_img_tag = re.sub(r'\sloading="eager"', '', new_img_tag)
    new_img_tag = ensure_attr(new_img_tag, 'loading', 'eager')
    new_img_tag = ensure_attr(new_img_tag, 'fetchpriority', 'high')
    new_img_tag = ensure_attr(new_img_tag, 'decoding', 'async')

    hero_body = hero_body.replace(img_tag, new_img_tag, 1)

    return html[:hero_match.start()] + hero_open + hero_body + hero_close + html[hero_match.end():]


def add_video_play_labels(html):
    def repl(match):
        return match.group(1) + ' aria-label="Воспроизвести видео">'

    return re.sub(
        r'(<button\b(?![^>]*\baria-label=)[^>]*\bdata-play-btn\b[^>]*)>',
        repl,
        html
    )


def strip_content_auto_for_class(html, class_name):
    def repl(match):
        class_value = match.group(1)
        classes = class_value.split()
        if class_name not in classes or "content-auto" not in classes:
            return match.group(0)

        classes = [c for c in classes if c != "content-auto"]
        return match.group(0).replace(class_value, " ".join(classes))

    return re.sub(r'<[^>]*\bclass="([^"]+)"[^>]*>', repl, html)


def ensure_content_auto_for_class(html, class_name):
    def repl(match):
        class_value = match.group(1)
        classes = class_value.split()
        if class_name not in classes or "content-auto" in classes:
            return match.group(0)

        classes.append("content-auto")
        return match.group(0).replace(class_value, " ".join(classes))

    return re.sub(r'<[^>]*\bclass="([^"]+)"[^>]*>', repl, html)


def fix_file(file_rel_path):
    full_path = os.path.join(base_path, file_rel_path.replace("/", os.sep))
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        return
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Fix nav.js defer
    if 'js/nav.js' in content and 'defer' not in content:
        content = content.replace('src="../../js/nav.js"', 'src="../../js/nav.js" defer')
        content = content.replace('src="../js/nav.js"', 'src="../js/nav.js" defer')
        content = content.replace('src="js/nav.js"', 'src="js/nav.js" defer')

    # 2. Hero LCP and content-auto
    content = normalize_hero_section(content)

    # 3. Video play buttons: ensure aria-label
    content = add_video_play_labels(content)

    # 4. content-auto: do not use on promo sections
    content = strip_content_auto_for_class(content, "promo-section")

    # 5. content-auto: ensure on CTA sections (per request)
    content = ensure_content_auto_for_class(content, "cta-section")

    if content != original_content:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {file_rel_path}")
    else:
        print(f"No changes: {file_rel_path}")

for f in files:
    fix_file(f)
