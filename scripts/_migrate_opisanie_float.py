#!/usr/bin/env python3
"""
Migrate Description (Описание) sections from grid/flex to float-based layout.
Uses desc-media desc-media--left (video) and desc-media--right (before/after).
Text flows around floated media elements.

v2 — fixed indentation and nested figure issues.
"""
import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(SCRIPT_DIR, "..", "src", "html", "portret-na-zakaz", "style")
SKIP = {"portret-maslom.html", "portret-maslom-v7.html", "beauty-art-portret.html"}


def get_col(html, pos):
    """Get column number (0-based) of position `pos` in html."""
    last_nl = html.rfind('\n', 0, pos)
    return pos - last_nl - 1 if last_nl >= 0 else pos


def get_indent(html, pos):
    """Get the indent string at position `pos` (whitespace from line start to pos)."""
    last_nl = html.rfind('\n', 0, pos)
    start = last_nl + 1 if last_nl >= 0 else 0
    return html[start:pos]


def find_matching_close(html, open_pos, tag):
    """Find matching closing tag, handling nesting. Returns end position (after </tag>)."""
    depth = 1
    pos = open_pos
    open_pat = re.compile(rf'<{tag}[\s>/]', re.IGNORECASE)
    close_pat = re.compile(rf'</{tag}\s*>', re.IGNORECASE)
    while depth > 0 and pos < len(html):
        o = open_pat.search(html, pos)
        c = close_pat.search(html, pos)
        if c is None:
            return -1
        if o and o.start() < c.start():
            depth += 1
            pos = o.end()
        else:
            depth -= 1
            if depth == 0:
                return c.end()
            pos = c.end()
    return -1


def reindent(html_block, target_indent, orig_col):
    """
    Re-indent an extracted HTML block.
    
    html_block: extracted HTML where first line lacks original leading whitespace
                but subsequent lines keep their original file indentation.
    target_indent: desired indentation string for the root element.
    orig_col: the original column (0-based) of the root element in the source.
    """
    lines = html_block.split('\n')
    if not lines:
        return html_block

    result = []
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        if not stripped:
            result.append('')
            continue
        if i == 0:
            result.append(target_indent + stripped)
        else:
            current_col = len(line) - len(stripped)
            relative = max(0, current_col - orig_col)
            result.append(target_indent + ' ' * relative + stripped)

    return '\n'.join(result)


def extract_section(html):
    """Extract description section. Returns (start, end, section_html, orig_indent)."""
    m = re.search(r'<section[^>]*id="opisanie"[^>]*>', html)
    if not m:
        return None, None, None, None
    start = m.start()
    end = find_matching_close(html, m.end(), 'section')
    if end == -1:
        return None, None, None, None
    orig_indent = get_indent(html, start)
    return start, end, html[start:end], orig_indent


def extract_video(section_html):
    """Extract video container and caption.
    Returns (video_html, caption_text, orig_col) or (None, None, 0).
    """
    m = re.search(r'<div[^>]*data-video-cover[^>]*>', section_html)
    if not m:
        m = re.search(r'<div[^>]*class="video-card[^"]*"[^>]*>', section_html)
    if not m:
        return None, None, 0

    video_start = m.start()
    orig_col = get_col(section_html, video_start)
    video_end = find_matching_close(section_html, m.end(), 'div')
    if video_end == -1:
        return None, None, 0

    video_html = section_html[video_start:video_end]

    # Check for hidden video-card sibling
    extra = ""
    search_pos = video_end
    hidden_m = re.search(r'<div[^>]*class="video-card hidden"[^>]*>.*?</div>',
                         section_html[search_pos:], re.DOTALL)
    if hidden_m:
        extra = "\n" + " " * orig_col + hidden_m.group(0)
        search_pos += hidden_m.end()

    # Find caption
    after = section_html[search_pos:]
    caption = _find_caption(after)

    return video_html + extra, caption, orig_col


def extract_ba(section_html):
    """Extract before-after slider and caption.
    Returns (ba_html, caption_text, orig_col) or (None, None, 0).
    The returned ba_html always uses <div> for the slider.
    """
    for tag in ('figure', 'div'):
        m = re.search(
            rf'<{tag}[^>]*class="[^"]*before-after-slider[^"]*"[^>]*>',
            section_html
        )
        if m:
            ba_start = m.start()
            orig_col = get_col(section_html, ba_start)
            ba_end = find_matching_close(section_html, m.end(), tag)
            if ba_end == -1:
                continue
            ba_html = section_html[ba_start:ba_end]

            # Convert <figure> to <div> to avoid nested figures
            if tag == 'figure':
                ba_html = re.sub(r'^<figure\b', '<div', ba_html)
                ba_html = re.sub(r'</figure>\s*$', '</div>', ba_html)

            after = section_html[ba_end:]
            caption = _find_caption(after)

            return ba_html, caption, orig_col

    return None, None, 0


def _find_caption(after_html):
    """Find a short caption <p> or <h3> in the text following a media element."""
    cap_m = re.search(r'<(p|h3)[^>]*>(.*?)</\1>', after_html, re.DOTALL)
    if not cap_m:
        return None
    raw = re.sub(r'<[^>]+>', '', cap_m.group(2)).strip()
    if len(raw) < 150:
        return raw
    return None


def extract_text_elements(section_html, video_html, ba_html):
    """Extract text paragraphs/blockquotes/h3 not inside media and not captions."""
    clean = section_html
    if video_html:
        clean = clean.replace(video_html, '<!-- REMOVED -->')
    if ba_html:
        clean = clean.replace(ba_html, '<!-- REMOVED -->')

    elements = []
    for m in re.finditer(r'<(p|blockquote|h3)(\s[^>]*)?>(.+?)</\1>', clean, re.DOTALL):
        tag = m.group(1)
        attrs = m.group(2) or ''
        content = m.group(3)
        full = m.group(0)

        # Skip headings
        if 'heading-section' in full or 'heading-hero' in full:
            continue

        # Skip captions
        plain = re.sub(r'<[^>]+>', '', content).strip()
        if 'text-center' in attrs and len(plain) < 150:
            continue
        if plain.startswith(('Короткое видео', 'Видео.')):
            continue

        # For <p>, normalize classes
        if tag == 'p':
            new_attrs = attrs
            new_attrs = re.sub(r'\bbreak-inside-avoid\b', '', new_attrs)
            new_attrs = re.sub(r'\bflex-1\b', '', new_attrs)
            new_attrs = re.sub(r'\bmb-4\b', 'mb-5', new_attrs)
            if 'mb-' not in new_attrs:
                if 'class="' in new_attrs:
                    new_attrs = new_attrs.replace('class="', 'class="mb-5 ')
                else:
                    new_attrs = ' class="mb-5"' + new_attrs
            # Clean up multiple spaces
            new_attrs = re.sub(r'class="\s+', 'class="', new_attrs)
            new_attrs = re.sub(r'\s{2,}', ' ', new_attrs)
            new_attrs = re.sub(r'\s+"', '"', new_attrs)
            new_attrs = re.sub(r'class="\s*"', '', new_attrs)
            rebuilt = f'<p{new_attrs}>{content}</p>'
        else:
            rebuilt = full

        elements.append(rebuilt)

    return elements


def build_new_section(filename, orig_indent, video_html, video_caption, video_col,
                      ba_html, ba_caption, ba_col, text_elements):
    """Build the new Description section with float layout."""
    I = orig_indent
    I2 = I + '    '
    I3 = I2 + '    '
    I4 = I3 + '    '
    I5 = I4 + '    '

    if filename == 'fotomozaika.html':
        section_cls = 'bg-ah-975 py-16 lg:py-20 content-auto'
        h2_cls = 'heading-section lg:heading-hero font-light text-center mb-12 md:mb-16'
    else:
        section_cls = 'py-16 lg:py-20 content-auto bg-ah-25'
        h2_cls = 'heading-section text-center mb-12 md:mb-16'

    lines = []
    lines.append(f'{I}<section class="{section_cls}" id="opisanie">')
    lines.append(f'{I2}<div class="container">')
    lines.append(f'{I3}<h2 class="{h2_cls}">Описание</h2>')
    lines.append(f'')
    lines.append(f'{I3}<!-- Текст с медиа, обтекание через float -->')
    lines.append(f'{I3}<div class="text-ink leading-relaxed font-sans">')

    if video_html:
        lines.append(f'')
        lines.append(f'{I4}<!-- Видео — на мобильном во всю ширину, на md+ float-left -->')
        lines.append(f'{I4}<figure class="desc-media desc-media--left">')
        lines.append(reindent(video_html, I5, video_col))
        if video_caption:
            lines.append(f'{I5}<figcaption class="mt-2 text-small text-ink">{video_caption}</figcaption>')
        lines.append(f'{I4}</figure>')

    if ba_html:
        lines.append(f'')
        lines.append(f'{I4}<!-- До/После — на мобильном во всю ширину, на md+ float-right -->')
        lines.append(f'{I4}<figure class="desc-media desc-media--right">')
        lines.append(reindent(ba_html, I5, ba_col))
        cap = ba_caption or 'Потяните за ползунок — сравните «До» и «После»'
        lines.append(f'{I5}<figcaption class="mt-2 text-small text-ink">{cap}</figcaption>')
        lines.append(f'{I4}</figure>')

    lines.append(f'')
    for el in text_elements:
        el_clean = ' '.join(el.split())  # collapse whitespace for single-line
        # If element is short enough, single line
        if len(el_clean) < 200 and '\n' not in el.strip():
            lines.append(f'{I4}{el_clean}')
        else:
            # Multi-line: simple indent
            el_lines = el.strip().split('\n')
            for j, el_line in enumerate(el_lines):
                s = el_line.strip()
                if s:
                    if j == 0:
                        lines.append(f'{I4}{s}')
                    else:
                        lines.append(f'{I4}    {s}')
        lines.append(f'')

    while lines and lines[-1].strip() == '':
        lines.pop()

    lines.append(f'{I3}</div>')
    lines.append(f'{I2}</div>')
    lines.append(f'{I}</section>')

    return '\n'.join(lines)


def process_file(filepath, filename):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    sec_start, sec_end, section_html, orig_indent = extract_section(html)
    if section_html is None:
        return False, "section not found"

    video_html, video_caption, video_col = extract_video(section_html)
    ba_html, ba_caption, ba_col = extract_ba(section_html)
    text_elements = extract_text_elements(section_html, video_html, ba_html)

    if not text_elements:
        return False, "no text elements found"

    new_section = build_new_section(
        filename, orig_indent,
        video_html, video_caption, video_col,
        ba_html, ba_caption, ba_col,
        text_elements
    )

    # Strip trailing indent from prefix to avoid doubling
    prefix = html[:sec_start].rstrip(' \t')
    if prefix and not prefix.endswith('\n'):
        prefix += '\n'

    new_html = prefix + new_section + html[sec_end:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)

    media = []
    if video_html:
        media.append("video")
    if ba_html:
        media.append("BA")
    return True, f"{'+'.join(media) or 'text only'}, {len(text_elements)} text blocks"


def main():
    files = sorted(f for f in os.listdir(BASE) if f.endswith('.html') and f not in SKIP)
    ok = fail = 0
    for filename in files:
        filepath = os.path.join(BASE, filename)
        success, info = process_file(filepath, filename)
        status = "OK" if success else "SKIP"
        print(f"  {status:4s} {filename}: {info}")
        if success:
            ok += 1
        else:
            fail += 1
    print(f"\nDone: {ok} updated, {fail} skipped")


if __name__ == '__main__':
    main()
