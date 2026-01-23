from playwright.sync_api import sync_playwright
from pathlib import Path
import sys

html_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('src/html/portret-na-zakaz/style/portret-maslom.html')
exe = sys.argv[2] if len(sys.argv) > 2 else None
if not html_path.exists():
    print('File not found:', html_path)
    sys.exit(2)

out = Path('reports/screenshots')
out.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    if exe:
        browser = p.chromium.launch(executable_path=exe, headless=True)
    else:
        browser = p.chromium.launch()
    page = browser.new_page()
    url = html_path.resolve().as_uri()
    widths = [320, 768, 1280]
    results = []
    for w in widths:
        page.set_viewport_size({"width": w, "height": 900})
        page.goto(url)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(300)
        shot = out / f'portret-maslom_{w}.png'
        page.screenshot(path=str(shot), full_page=True)
        results.append(str(shot))
    browser.close()

print('Screenshots saved:')
for f in results:
    print(' -', f)
