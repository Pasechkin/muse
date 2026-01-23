
import os

filepath = os.path.join(os.getcwd(), 'src', 'input.css')
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if 'mask-image: url' in line and '-webkit-mask-image' not in line:
        # Дубль для webkit
        webkit_line = line.replace('mask-image:', '-webkit-mask-image:')
        new_lines.append(webkit_line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Successfully added -webkit-mask-image to all utilities.")
