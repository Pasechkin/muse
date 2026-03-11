"""
Добавляет aria-current="page" на последний <li> в .breadcrumbs <ol>,
если этот <li> не содержит ссылки (= текущая страница) и ещё не имеет атрибута.
"""
import re, pathlib

HTML_DIR = pathlib.Path(__file__).resolve().parent.parent / "src" / "html"

# Паттерн: последний <li> в breadcrumbs (без <a> внутри, без aria-current)
# Ищем nav.breadcrumbs → внутри <ol> → последний <li>...</li> перед </ol>
BREADCRUMB_BLOCK = re.compile(
    r'(<nav\s[^>]*class="breadcrumbs[^"]*"[^>]*>.*?)(</nav>)',
    re.DOTALL
)

# Последний <li без ссылки: <li>Текст</li> или <li class="...">Текст</li>
LAST_LI_NO_LINK = re.compile(
    r'<li(\s[^>]*)?>(?!.*?<a\s)([^<]+)</li>\s*</ol>',
    re.DOTALL
)

fixed = []
skipped = []
already = []

for f in sorted(HTML_DIR.rglob("*.html")):
    text = f.read_text(encoding="utf-8")
    
    if 'class="breadcrumbs' not in text:
        continue
    
    if 'aria-current="page"' in text:
        # Проверяем, что aria-current внутри breadcrumbs block
        m = BREADCRUMB_BLOCK.search(text)
        if m and 'aria-current="page"' in m.group(0):
            already.append(f.relative_to(HTML_DIR))
            continue
    
    m = BREADCRUMB_BLOCK.search(text)
    if not m:
        skipped.append((f.relative_to(HTML_DIR), "no breadcrumb block"))
        continue
    
    block = m.group(0)
    li_match = LAST_LI_NO_LINK.search(block)
    
    if not li_match:
        skipped.append((f.relative_to(HTML_DIR), "last li has link or not found"))
        continue
    
    # Добавляем aria-current="page"
    old_li = li_match.group(0)
    attrs = li_match.group(1) or ""
    
    if 'aria-current' in old_li:
        already.append(f.relative_to(HTML_DIR))
        continue
    
    # Вставляем атрибут
    if attrs:
        new_li = old_li.replace(f"<li{attrs}>", f'<li{attrs} aria-current="page">', 1)
    else:
        new_li = old_li.replace("<li>", '<li aria-current="page">', 1)
    
    new_text = text.replace(old_li, new_li, 1)
    
    if new_text != text:
        f.write_text(new_text, encoding="utf-8")
        fixed.append(f.relative_to(HTML_DIR))
    else:
        skipped.append((f.relative_to(HTML_DIR), "replacement failed"))

print(f"\n✅ Добавлен aria-current='page': {len(fixed)} файлов")
for p in fixed:
    print(f"   {p}")

print(f"\n✔ Уже было: {len(already)} файлов")

if skipped:
    print(f"\n⚠ Пропущено: {len(skipped)} файлов")
    for p, reason in skipped:
        print(f"   {p} — {reason}")
