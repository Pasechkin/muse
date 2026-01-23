import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Мы ищем теги SVG и заменяем их целиком на новые спаны
printer_svg_start = '<svg class="w-full h-full fill-current" viewBox="0 0 325.9 325.9" xmlns="http://www.w3.org/2000/svg">'
printer_target = '<span class="icon-base icon-printer w-full h-full bg-current"></span>'

ink_svg_start = '<svg class="w-full h-full fill-current" viewBox="0 0 492.3 492.3" xmlns="http://www.w3.org/2000/svg">'
ink_target = '<span class="icon-base icon-ink w-full h-full bg-current"></span>'

canvas_svg_start = '<svg class="w-full h-full fill-current" viewBox="0 0 1889 1889" xmlns="http://www.w3.org/2000/svg">'
canvas_target = '<span class="icon-base icon-canvas w-full h-full bg-current"></span>'

def replace_svg(data, start_tag, replacement):
    idx = data.find(start_tag)
    if idx == -1:
        return data
    end_idx = data.find('</svg>', idx)
    if end_idx == -1:
        return data
    return data[:idx] + replacement + data[end_idx+6:]

content = replace_svg(content, printer_svg_start, printer_target)
content = replace_svg(content, ink_svg_start, ink_target)
content = replace_svg(content, canvas_svg_start, canvas_target)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated Advantages section icons.")
