import os
import re

file_path = r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Debug version
target_start = '<!-- Рама -->'
target_end = '>Рама</h3>'

print(f"File path: {file_path}")
print(f"File exists: {os.path.exists(file_path)}")

start_idx = content.find(target_start)
end_idx = content.find(target_end, start_idx)

print(f"Indices found: start={start_idx}, end={end_idx}")

if start_idx != -1 and end_idx != -1:
    # Find the div above Рама
    div_start = content.rfind('<div class="text-center">', 0, start_idx + 100)
    print(f"Div start search index: {div_start}")
    
    if div_start != -1:
        content_before = content[:div_start]
        content_after = content[end_idx + len(target_end):]
        
        new_block = '''<div class="text-center">
                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Рама</h3>'''
        
        new_content = content_before + new_block + content_after
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully replaced.")
else:
    print("Not found.")

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced Frame SVG with icon utility.")
else:
    print("Could not find the target Frame block.")
