import os
import re

file_path = r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\input.css"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add prefixes to .icon-base
old_icon_base = """  .icon-base {
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
  }"""

new_icon_base = """  .icon-base {
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    mask-size: contain;
    -webkit-mask-size: contain;
  }"""

content = content.replace(old_icon_base, new_icon_base)

# Add -webkit-mask-image prefixes to all utilities with mask-image
# Using regex to find mask-image: url(...); and add -webkit-mask-image version before it
content = re.sub(r'mask-image: (url\("data:image/svg\+xml,[^"]+"\));', 
                 r'-webkit-mask-image: \1;\n    mask-image: \1;', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Prefixes added successfully.")
