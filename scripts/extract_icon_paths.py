# -*- coding: utf-8 -*-
import re
from pathlib import Path

# Paths
html_file = Path("src/html/new-svg-icons-pack.html")
output_file = Path("icon_mapping.txt")

print("Reading icons file...")
html = html_file.read_text(encoding='utf-8')

# Find all icons: data-icon="icon-X" and corresponding <path d="...">
pattern = r'data-icon="(icon-\d+)".*?<path[^>]*d="([^"]+)"'
icons = re.findall(pattern, html, re.DOTALL)

print(f"Found {len(icons)} icons")

# Write to file
with output_file.open('w', encoding='utf-8') as f:
    f.write("# SVG Icon Mapping from new-svg-icons-pack.html\n")
    f.write("# Format: icon-N: <SVG path data>\n")
    f.write("=" * 80 + "\n\n")
    
    for icon_name, path_data in icons:
        f.write(f"{icon_name}:\n")
        f.write(f"{path_data}\n")
        f.write("-" * 80 + "\n\n")

print(f"Result saved to: {output_file.absolute()}")
print("\nFound icons:")
for icon_name, _ in icons:
    print(f"  - {icon_name}")
