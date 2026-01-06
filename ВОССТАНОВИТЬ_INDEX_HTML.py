#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для восстановления index.html с внешним CSS
Заменяет инлайновый CSS на ссылку на внешний файл css/output.css
"""

import re
import os

# Путь к файлам
html_dir = os.path.join(os.path.dirname(__file__), 'src', 'html')
index_tailwind_path = os.path.join(html_dir, 'index_tailwind.html')
index_path = os.path.join(html_dir, 'index.html')

# Читаем файл index_tailwind.html
with open(index_tailwind_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Находим блок <style>...</style> и заменяем его на ссылку на внешний CSS
# Ищем от комментария "Инлайновый CSS" до закрывающего тега </style>
pattern = r'<!-- Инлайновый CSS для оптимизации критического пути -->\s*<style>.*?</style>'
replacement = '<link rel="stylesheet" href="css/output.css">'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Сохраняем в index.html
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ index.html восстановлен с внешним CSS")
print(f"📁 Файл сохранен: {index_path}")


