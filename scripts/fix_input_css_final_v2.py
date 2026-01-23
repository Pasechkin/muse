import os

file_path = r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\input.css"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_next_brace = False

for i, line in enumerate(lines):
    # Remove @layer utilities {
    if '@layer utilities {' in line:
        continue
    
    # Handle the closing brace of the removed @layer
    # It's at the very end of the file after icon-gift
    if i == len(lines) - 1 and line.strip() == '}':
        continue

    # Add -webkit prefixes for mask properties
    if 'mask-image:' in line:
        new_lines.append(line.replace('mask-image:', '-webkit-mask-image:'))
    if 'mask-size:' in line:
        new_lines.append(line.replace('mask-size:', '-webkit-mask-size:'))
    if 'mask-repeat:' in line:
        new_lines.append(line.replace('mask-repeat:', '-webkit-mask-repeat:'))
    if 'mask-position:' in line:
        new_lines.append(line.replace('mask-position:', '-webkit-mask-position:'))
    
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
