import os

path = 'src/html/foto-na-kholste-sankt-peterburg.html'
if not os.path.exists(path):
    print(f"File {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_rama = False
in_svg_div = False

for line in lines:
    if '<!-- Рама -->' in line:
        in_rama = True
        new_lines.append(line)
        continue
    
    if in_rama:
        if '<div class="w-10 h-10 mx-auto mb-4 text-primary">' in line:
            in_svg_div = True
            new_lines.append('                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>\n')
            continue
        
        if in_svg_div:
            if '</div>' in line and not '<svg' in line: # Simple check for closing div of the icon
                # Wait, the SVG block might contain </div>? No, just </svg>.
                # But there is a </div> after all SVGs.
                # Let's check for the next h3.
                pass
            
            if '<h3 class="text-xl font-medium text-dark">Рама</h3>' in line:
                in_svg_div = False
                in_rama = False
                new_lines.append(line)
            continue

    new_lines.append(line)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(new_lines)
print("SUCCESS")
