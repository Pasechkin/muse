import re
import os

path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Рама
content = re.sub(
    r'<!-- Рама -->\s*<div class="text-center">\s*<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>\s*<h3 class="text-xl font-medium text-dark">Рама</h3>',
    r'<!-- Рама -->\n                    <div class="text-center">\n                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>\n                        <h3 class="text-xl font-medium text-dark">Рама</h3>',
    content, flags=re.DOTALL
)

# Replace Подарочная упаковка
content = re.sub(
    r'<!-- Подарочная упаковка -->\s*<div class="text-center">\s*<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>\s*<h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>',
    r'<!-- Подарочная упаковка -->\n                    <div class="text-center">\n                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>\n                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>',
    content, flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
