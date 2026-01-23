import os

file_path = r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\input.css"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'mask-image: url(' in line:
        indent = line[:line.find('mask-image')]
        url_part = line[line.find('mask-image') + 12:]
        new_lines.append(f"{indent}-webkit-mask-image: {url_part}")
        new_lines.append(line)
    elif 'mask-repeat: no-repeat;' in line:
        indent = line[:line.find('mask-repeat')]
        new_lines.append(f"{indent}-webkit-mask-repeat: no-repeat;\n")
        new_lines.append(line)
    elif 'mask-position: center;' in line:
        indent = line[:line.find('mask-position')]
        new_lines.append(f"{indent}-webkit-mask-position: center;\n")
        new_lines.append(line)
    elif 'mask-size: contain;' in line:
        indent = line[:line.find('mask-size')]
        new_lines.append(f"{indent}-webkit-mask-size: contain;\n")
        new_lines.append(line)
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Prefixes added.")
