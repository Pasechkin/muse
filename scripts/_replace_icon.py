import pathlib, re

f = pathlib.Path(r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\portret-na-zakaz\style\portret-maslom-v7.html')
t = f.read_text(encoding='utf-8')

svg_file = pathlib.Path(r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\icons\optimized\icon-girl-pearl.svg')
sc = svg_file.read_text(encoding='utf-8').strip()

inner = re.search(r'<svg[^>]*>(.*)</svg>', sc, re.DOTALL).group(1)
vb = re.search(r'viewBox="([^"]+)"', sc).group(1)

new_svg = f'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-[1.875rem] h-[1.875rem] fill-current" viewBox="{vb}">{inner}</svg>'

old_pat = r'<svg[^>]*viewBox="-50 -36 4554 4550"[^>]*>.*?</svg>'
matches = re.findall(old_pat, t, re.DOTALL)
print(f'Found {len(matches)} match(es)')

if matches:
    t2 = re.sub(old_pat, new_svg, t, count=1, flags=re.DOTALL)
    f.write_text(t2, encoding='utf-8')
    print('Replaced successfully')
else:
    print('No match found - check if viewBox changed')
