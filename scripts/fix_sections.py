import re
import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for Rama: from <!-- Рама --> to the last </div> before <!-- Подарочная упаковка -->
rama_pattern = r'(<!--\s*Рама\s*-->.*?</div>)\s*<!--\s*Подарочная упаковка\s*-->'
rama_replacement_content = '''<!-- Рама -->
                    <div class="text-center">
                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Рама</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Для визуализации и расчёта стоимости рамки в разделе <a href="#calc" class="text-primary underline hover:no-underline">«Цена»↑</a> загрузите изображение и установите размер. Или ожидайте нашего предложения после согласования макета.</p>
                    </div>'''

# Pattern for Gift: from <!-- Подарочная упаковка --> to the last </div> before the closing tags of the section
# In the file: </div>\n                </div>\n            </div>\n        </section>
gift_pattern = r'(<!--\s*Подарочная упаковка\s*-->.*?</div>)\s*</div>\s*</div>\s*</section>'
gift_replacement_content = '''<!-- Подарочная упаковка -->
                    <div class="text-center">
                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Если картина — подарок, мы упакуем её в крафт-бумагу и перевяжем джутовым канатиком. Мы используем плотную бумагу, она исключает случайные повреждения и сохраняет эффект сюрприза.</p>
                    </div>'''

# Use sub with captured group to keep the boundaries if needed, or just replace the whole thing.
# We want to replace the captured group.

def replace_block(regex, replacement, text):
    match = re.search(regex, text, re.DOTALL)
    if match:
        start, end = match.span(1)
        return text[:start] + replacement + text[end:]
    return text

new_content = replace_block(rama_pattern, rama_replacement_content, content)
new_content = replace_block(gift_pattern, gift_replacement_content, new_content)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")
else:
    print("No changes made. Patterns did not match.")

