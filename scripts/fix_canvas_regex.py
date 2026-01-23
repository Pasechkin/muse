
import os
import re

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Ищем блок с текстом Холст
pattern = r'(<span[^>]*>Холст</span>\s*<div[^>]*>)\s*<svg.*?</svg>'
replacement = r'\1\n                                <span class="icon-base icon-canvas w-full h-full bg-current"></span>'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("NOT FOUND")
