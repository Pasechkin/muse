import sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if not path or not path.exists():
    print('Usage: python validate_html_strict.py path/to/file.html')
    sys.exit(2)

html_text = path.read_text(encoding='utf-8')

# Try to import lxml/bs4; if running with system Python, add project venv site-packages to sys.path
try:
    from lxml import etree, html
except Exception as e:
    venv_site = Path(__file__).resolve().parents[1] / '.venv' / 'Lib' / 'site-packages'
    if venv_site.exists():
        sys.path.insert(0, str(venv_site))
        try:
            from lxml import etree, html
        except Exception as e2:
            print('lxml: not available even after adding venv site-packages:', repr(e2))
            etree = None
            html = None
    else:
        print('lxml: not available and venv site-packages not found')
        etree = None
        html = None

if etree and html:
    try:
        parser = etree.HTMLParser(recover=False)
        doc = html.fromstring(html_text, parser=parser)
        print('lxml: parsed without fatal errors (recover=False).')
    except Exception as e:
        print('lxml: parsing raised an exception:')
        print(repr(e))
else:
    print('Skipping lxml strict parse (not available).')

# Fallback/secondary check: BeautifulSoup with html5lib
try:
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_text, 'html5lib')
    # Compare number of top-level <html> elements: html5lib should always create 1
    top_html = soup.find_all('html')
    print(f'BeautifulSoup(html5lib): top-level <html> elements found: {len(top_html)}')
    # Quick heuristic: find stray closing tags by scanning original for patterns that look like </div> on lines
    lines = html_text.splitlines()
    stray_lines = []
    stack = []
    voids = set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]) 
    import re
    tag_re = re.compile(r"<\s*(/)?\s*([a-zA-Z0-9-]+)([^>]*)>")
    for i,l in enumerate(lines, start=1):
        for m in tag_re.finditer(l):
            closing = bool(m.group(1))
            tag = m.group(2).lower()
            rest = m.group(3) or ''
            self_close = '/' in rest or rest.strip().endswith('/')
            if tag in voids or self_close:
                continue
            if not closing:
                stack.append((tag, i))
            else:
                if stack and stack[-1][0] == tag:
                    stack.pop()
                else:
                    # record stray closing
                    stray_lines.append((i, tag, l.strip()))
    if stray_lines:
        print('Heuristic scanner found stray closing tags or mismatches at:')
        for ln, tag, text in stray_lines[:20]:
            print(f'  line {ln}: </{tag}>  -- context: {text[:120]}')
    else:
        print('Heuristic scanner: no stray closing tags found.')
except Exception as e:
    print('BeautifulSoup stage raised an exception:')
    print(repr(e))

print('\nDone.')
