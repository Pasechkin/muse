import re
import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for Frame
# Match everything between <!-- Рама --> and the corresponding </h3>
# but use a non-greedy .*? to find the first <div class="w-10...div>
content = re.sub(
    r'(<!-- Рама -->\s+<div class="text-center">)\s+<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>',
    r'\1\n                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>',
    content,
    flags=re.DOTALL
)

# Pattern for Gift
content = re.sub(
    r'(<!-- Подарочная упаковка -->\s+<div class="text-center">)\s+<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>',
    r'\1\n                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
