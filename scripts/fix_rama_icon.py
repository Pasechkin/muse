import re
import os
import sys

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'
log_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\scripts\log.txt'

def log(msg):
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(msg + '\n')
    print(msg)
    sys.stdout.flush()

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Hardcoded start and end markers to find the block
    start_marker = '<!-- Рама -->'
    end_marker = '<h3 class="text-xl font-medium text-dark">Рама</h3>'

    start_index = content.find(start_marker)
    if start_index == -1:
        log("Could not find start marker")
        sys.exit(1)

    next_div_start = content.find('<div class="w-10 h-10 mx-auto mb-4 text-primary">', start_index)
    if next_div_start == -1:
        log("Could not find target div start")
        sys.exit(1)

    end_index = content.find(end_marker, next_div_start)
    if end_index == -1:
        log("Could not find end marker")
        sys.exit(1)

    # Find the </div> that belongs to the target div (it should be right before h3)
    target_div_end = content.rfind('</div>', next_div_start, end_index)
    if target_div_end == -1:
        log("Could not find target div end")
        sys.exit(1)

    # Include the '</div>' itself
    target_div_end += len('</div>')

    new_block = '<div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>'
    new_content = content[:next_div_start] + new_block + content[target_div_end:]

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(new_content)
        log("SUCCESS")
    else:
        log("No replacement made.")
except Exception as e:
    log(f"Error: {str(e)}")

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("No replacement made. Check the pattern.")
