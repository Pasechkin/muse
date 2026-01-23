import os

def fix_canvas():
    filepath = r'c:/Users/Анна/Documents/Muse-tailwind/tailwind-project/src/html/foto-na-kholste-sankt-peterburg.html'
    logfile = r'c:/Users/Анна/Documents/Muse-tailwind/tailwind-project/scripts/fix_log.txt'
    
    with open(logfile, 'w', encoding='utf-8') as log:
        if not os.path.exists(filepath):
            log.write(f"File not found: {filepath}\n")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        import re
        svg_pattern = re.compile(r'<svg[^>]*viewBox="0 0 1889 1889"[^>]*>.*?</svg>', re.DOTALL)
        match = svg_pattern.search(content)
        
        if match:
            full_svg = match.group(0)
            log.write(f"Found SVG of length {len(full_svg)}\n")
            new_span = '<span class="icon-base icon-canvas w-full h-full bg-current"></span>'
            new_content = content.replace(full_svg, new_span)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            log.write("Success: Canvas SVG replaced.\n")
        else:
            log.write("SVG with viewBox 1889 not found.\n")
    else:
        print("SVG with viewBox 1889 not found near 'Холст'")

if __name__ == "__main__":
    fix_canvas()
