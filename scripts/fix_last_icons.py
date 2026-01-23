import re
import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for Frame
frame_pattern = re.compile(r'<!-- Рама -->.*?<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>', re.DOTALL)
content = frame_pattern.sub('<!-- Рама -->\n                    <div class="text-center">\n                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>', content)

# Pattern for Gift
gift_pattern = re.compile(r'<!-- Подарочная упаковка -->.*?<div class="w-10 h-10 mx-auto mb-4 text-primary">.*?</div>', re.DOTALL)
content = gift_pattern.sub('<!-- Подарочная упаковка -->\n                    <div class="text-center">\n                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
