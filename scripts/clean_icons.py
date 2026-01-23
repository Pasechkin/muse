import re
import os

filepath = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of replacements for the "Options" section
# Each entry: (Block Comment/Search, Icon Class)
replacements = [
    # (re.escape('<!-- Крепление -->'), 'icon-mount'), # I'll be more specific below
]

def replace_icon_block(content, comment_text, icon_class):
    # Regex to find the block starting with the comment and ending before the closing div of the text-center
    # We want to keep the h3 and p, but replace the SVG div.
    
    # Pattern: 
    # 1. Comment
    # 2. Opening <div class="text-center">
    # 3. The SVG container <div class="w-10 h-10 ..."> ... </div>
    # 4. Remaining tags (h3, p, etc.) until the NEXT </div><!-- End of icon item -->
    
    # Actually, simpler: just find the SVG container div based on its proximity to the heading.
    
    pattern = rf'({re.escape(comment_text)}[\s\S]*?<div class="text-center">[\s\S]*?)<div class="w-10 h-10 mx-auto mb-4 text-primary">[\s\S]*?<\/div>([\s\S]*?<h3[\s\S]*?</h3>)'
    
    new_div = f'<div class="icon-base {icon_class} mx-auto mb-4 text-primary"></div>'
    
    return re.sub(pattern, rf'\1{new_div}\2', content)

# Apply replacements using a very loose regex for the SVG div
def clean_svg_in_block(content, icon_class, heading_text):
    # Match the SVG container div that is followed soon by the specific heading
    # Regex: Look for the specific heading, then look backward (or forward) for the SVG div.
    # Actually, matching the SVG div followed by the heading is better.
    
    # <div class="w-10 h-10 mx-auto mb-4 text-primary"> ... </div>
    # followed by <h3 ...>heading_text</h3>
    
    pattern = rf'<div class="w-10 h-10 mx-auto mb-4 text-primary">[\s\S]*?<\/div>(\s*<h3[^>]*>{re.escape(heading_text)}</h3>)'
    replacement = rf'<div class="icon-base {icon_class} mx-auto mb-4 text-primary"></div>\1'
    
    return re.sub(pattern, replacement, content)

content = clean_svg_in_block(content, 'icon-mount', 'Крепление')
content = clean_svg_in_block(content, 'icon-frame', 'Рама')
content = clean_svg_in_block(content, 'icon-gift', 'Подарочная упаковка')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
