import os

filepath = r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Frame replacement
frame_start = '<!-- Рама -->'
frame_end = '<h3 class="text-xl font-medium text-dark">Рама</h3>'

if frame_start in content and frame_end in content:
    start_idx = content.find(frame_start)
    end_idx = content.find(frame_end)
    
    div_search_start = content.find('<div class="text-center">', start_idx)
    inner_div_start = content.find('<div class="w-10 h-10 mx-auto mb-4 text-primary">', div_search_start)
    
    if inner_div_start != -1 and inner_div_start < end_idx:
        # Find the closing </div> of the inner div before the <h3>
        inner_div_end = content.rfind('</div>', div_search_start, end_idx)
        
        if inner_div_end != -1:
            old_block = content[inner_div_start:inner_div_end+6]
            new_block = '<div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>'
            content = content.replace(old_block, new_block)
            print("Replaced Frame icon")

# Gift replacement
gift_start = '<!-- Подарочная упаковка -->'
gift_end = '<h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>'

if gift_start in content and gift_end in content:
    start_idx = content.find(gift_start)
    end_idx = content.find(gift_end)
    
    div_search_start = content.find('<div class="text-center">', start_idx)
    inner_div_start = content.find('<div class="w-10 h-10 mx-auto mb-4 text-primary">', div_search_start)
    
    if inner_div_start != -1 and inner_div_start < end_idx:
        # Find the closing </div> of the inner div before the <h3>
        inner_div_end = content.rfind('</div>', div_search_start, end_idx)
        
        if inner_div_end != -1:
            old_block = content[inner_div_start:inner_div_end+6]
            new_block = '<div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>'
            content = content.replace(old_block, new_block)
            print("Replaced Gift icon")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
