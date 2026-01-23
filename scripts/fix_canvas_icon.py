
import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Ищем блок холста по характерному тексту
target_text = '<span>Холст</span>'
if target_text not in content:
    target_text = '<span class="text-lg font-medium text-dark">Холст</span>'

if target_text in content:
    # Ищем следующий за этим текстом SVG блок
    start_search = content.find(target_text)
    svg_start = content.find('<svg', start_search)
    svg_end = content.find('</svg>', svg_start) + 6
    
    if svg_start != -1 and svg_end != -1:
        new_icon = '<span class="icon-base icon-canvas w-full h-full bg-current"></span>'
        new_content = content[:svg_start] + new_icon + content[svg_end:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully replaced Canvas SVG")
    else:
        print("Could not find SVG block after 'Холст'")
else:
    print("Could not find 'Холст' text")
