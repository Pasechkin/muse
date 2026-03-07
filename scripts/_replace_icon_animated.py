"""Replace the first benefit icon with animated dual-SVG icon (girl with pearl earring)."""
import re

HTML_FILE = r"src\html\portret-na-zakaz\style\portret-maslom-v7.html"
SVG01_FILE = r"draft\girl-with-pearl-earring-01.svg"
SVG02_FILE = r"draft\girl-with-pearl-earring-02.svg"

def extract_paths(svg_file):
    """Extract <path> elements from SVG file."""
    with open(svg_file, "r", encoding="utf-8") as f:
        content = f.read()
    return "".join(re.findall(r'<path[^/]*/>', content))

# Read SVG paths
paths_01 = extract_paths(SVG01_FILE)
paths_02 = extract_paths(SVG02_FILE)

# Build replacement HTML
new_icon = (
    '                        <div class="w-[7.25rem] h-[7.25rem] rounded-full bg-ah-50 text-ah-950 '
    'flex items-center justify-center mb-4 shrink-0 transition-all duration-300 '
    'group-hover:bg-ah-100 group-hover:scale-110 relative">\n'
    '                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '
    'class="w-[3.75rem] h-[3.75rem] fill-current absolute animate-icon-show" '
    f'viewBox="314 155 1743 1743">{paths_01}</svg>\n'
    '                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '
    'class="w-[3.75rem] h-[3.75rem] fill-current absolute animate-icon-hide" '
    f'viewBox="4 13 709 709">{paths_02}</svg>\n'
    '                        </div>'
)

# Read HTML file
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# Find the first benefit icon: match from the circle div through its closing tag
# Pattern: the div with w-[3.625rem] containing viewBox="150 350 400 400"
pattern = (
    r'<div class="w-\[3\.625rem\] h-\[3\.625rem\] rounded-full bg-ah-50 text-ah-950 '
    r'flex items-center justify-center mb-4 shrink-0 transition-all duration-300 '
    r'group-hover:bg-ah-100 group-hover:scale-110">\s*'
    r'<svg[^>]*viewBox="150 350 400 400"[^>]*>.*?</svg>\s*'
    r'</div>'
)

match = re.search(pattern, html, re.DOTALL)
if match:
    html = html[:match.start()] + new_icon + html[match.end():]
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"SUCCESS: Replaced icon at position {match.start()}-{match.end()}")
    print(f"  SVG-01 paths: {len(paths_01)} chars, viewBox='314 155 1743 1743'")
    print(f"  SVG-02 paths: {len(paths_02)} chars, viewBox='4 13 709 709'")
    print(f"  Circle: 7.25rem (116px), Icons: 3.75rem (60px) = 2x original")
else:
    print("ERROR: Could not find the icon pattern to replace")
    # Debug: show what's around the benefits section
    idx = html.find('viewBox="150 350')
    if idx >= 0:
        print(f"Found viewBox at index {idx}")
        print(html[max(0,idx-200):idx+200])
    else:
        print("viewBox='150 350' not found at all")
        # Try finding ANY benefit icon
        idx = html.find('Более 110 примеров')
        if idx >= 0:
            print(f"Found text at {idx}, context:")
            print(html[max(0,idx-500):idx])
