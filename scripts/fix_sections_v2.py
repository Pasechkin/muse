import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line numbers in read_file are 1-indexed.
# Rama block: starts with "<!-- Рама -->" at line 482
# Gift block: starts with "<!-- Подарочная упаковка -->" at line 521

rama_start = -1
gift_start = -1
gift_end = -1

for i, line in enumerate(lines):
    if "<!-- Рама -->" in line:
        rama_start = i
    if "<!-- Подарочная упаковка -->" in line:
        gift_start = i
    # The gift block ends at line 546 (which is index 545)
    # Let's find the closing </div> of the gift block which is followed by </div> </div> </section>
    if gift_start != -1 and i > gift_start and "</div>" in line:
        # Check if the next few lines lead to the end of the section
        if i + 3 < len(lines) and "</div>" in lines[i+1] and "</div>" in lines[i+2] and "</section>" in lines[i+3]:
            gift_end = i

print(f"Rama start: {rama_start}, Gift start: {gift_start}, Gift end: {gift_end}")

if rama_start != -1 and gift_start != -1 and gift_end != -1:
    new_rama = [
        '                    <!-- Рама -->\n',
        '                    <div class="text-center">\n',
        '                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>\n',
        '                        <h3 class="text-xl font-medium text-dark">Рама</h3>\n',
        '                        <span class="text-gray-500">Дополнительная услуга</span>\n',
        '                        <p class="text-body leading-7 text-left mt-3">Для визуализации и расчёта стоимости рамки в разделе <a href="#calc" class="text-primary underline hover:no-underline">«Цена»↑</a> загрузите изображение и установите размер. Или ожидайте нашего предложения после согласования макета.</p>\n',
        '                    </div>\n'
    ]
    
    new_gift = [
        '\n',
        '                    <!-- Подарочная упаковка -->\n',
        '                    <div class="text-center">\n',
        '                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>\n',
        '                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>\n',
        '                        <span class="text-gray-500">Дополнительная услуга</span>\n',
        '                        <p class="text-body leading-7 text-left mt-3">Если картина — подарок, мы упакуем её в крафт-бумагу и перевяжем джутовым канатиком. Мы используем плотную бумагу, она исключает случайные повреждения и сохраняет эффект сюрприза.</p>\n',
        '                    </div>\n'
    ]
    
    # Construct the new lines
    # From 0 to rama_start
    # + new_rama
    # + (any space between rama and gift if needed, but the original has a blank line)
    # + new_gift
    # + from gift_end + 1 to end
    
    # Original content between Rama and Gift:
    # After rama </div> (index rama_end) there is a blank line at line 520 (index 519)
    # Let's find rama_end first.
    rama_end = gift_start - 2 # Assuming index of line 519 is 518, and gift start at 520 is 521? 
    # Let's just find the first </div> before gift_start.
    for i in range(gift_start - 1, rama_start, -1):
        if "</div>" in lines[i]:
            rama_end = i
            break
            
    final_lines = lines[:rama_start] + new_rama + lines[rama_end+1:gift_start] + new_gift + lines[gift_end+1:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    print("Success")
else:
    print("Failure: Could not find indices")
