import re
import urllib.parse

def encode_svg_data_uri(match):
    prefix = match.group(1)
    svg_content = match.group(2)
    suffix = match.group(3)
    
    # Мы хотим закодировать содержимое SVG, но оставить саму структуру data:image/svg+xml
    # Часто проблемы вызывают пробелы, решетки, кавычки и скобки.
    
    # Но подождите, если я использую quote, он может перекодировать то, что уже закодировано (например %3Csvg).
    # Поэтому лучше всего просто заменить пробелы на %20.
    encoded_content = svg_content.replace(' ', '%20')
    
    return f'{prefix}{encoded_content}{suffix}'

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\input.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Ищем url("data:image/svg+xml, <content> ")
new_content = re.sub(r'(url\("data:image/svg\+xml,)(.*?)("\))', encode_svg_data_uri, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SVG data URIs in input.css have been updated with encoded spaces.")
