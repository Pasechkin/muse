import os
import re

# Use relative path to avoid Cyrillic mangling in absolute path
file_path = 'src/html/foto-na-kholste-sankt-peterburg.html'

if not os.path.exists(file_path):
    print(f"Error: {file_path} not found from {os.getcwd()}")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

rama_start = -1
gift_start = -1
gift_end = -1

for i, line in enumerate(lines):
    if "<!-- Рама -->" in line:
        rama_start = i
    if "<!-- Подарочная упаковка -->" in line:
        gift_start = i
    # The gift block ends with </div> and next lines are closing markers
    if gift_start != -1 and i > gift_start and "</div>" in line:
        if i + 3 < len(lines) and "</div>" in lines[i+1] and "</div>" in lines[i+2] and "</section>" in lines[i+3]:
            gift_end = i

if rama_start != -1 and gift_start != -1 and gift_end != -1:
    # Find the end of rama (the first </div> before gift_start)
    rama_end = -1
    for i in range(gift_start - 1, rama_start, -1):
        if "</div>" in lines[i]:
            rama_end = i
            break
            
    if rama_end != -1:
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
            '                    <!-- Подарочная упаковка -->\n',
            '                    <div class="text-center">\n',
            '                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>\n',
            '                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>\n',
            '                        <span class="text-gray-500">Дополнительная услуга</span>\n',
            '                        <p class="text-body leading-7 text-left mt-3">Если картина — подарок, мы упакуем её в крафт-бумагу и перевяжем джутовым канатиком. Мы используем плотную бумагу, она исключает случайные повреждения и сохраняет эффект сюрприза.</p>\n',
            '                    </div>\n'
        ]
        
        # Original lines between blocks (contains blank line)
        between = lines[rama_end+1:gift_start]
        
        final_lines = lines[:rama_start] + new_rama + between + new_gift + lines[gift_end+1:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(final_lines)
        print("SUCCESS")
    else:
        print("Error: Could not find rama_end")
else:
    print(f"Error: Markers not found. Rama: {rama_start}, Gift: {gift_start}, GiftEnd: {gift_end}")
