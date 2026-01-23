import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will use a very specific but literal piece of the file to replace.
# Since I have the full content from read_file, I can pick a start and end marker.

start_marker = '                    <!-- Рама -->'
end_marker = 'Упакуем заказ в подарочную бумагу с красивым бантом. Предложение с вариантами упаковки пришлем на согласование.</p>\n                    </div>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_marker)
    
    replacement = '''                    <!-- Рама -->
                    <div class="text-center">
                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Рама</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Для визуализации и расчёта стоимости рамки в разделе <a href="#calc" class="text-primary underline hover:no-underline">«Цена»↑</a> загрузите изображение и установите размер. Или ожидайте нашего предложения после согласования макета.</p>
                    </div>

                    <!-- Подарочная упаковка -->
                    <div class="text-center">
                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Если картина — подарок, мы упакуем её в крафт-бумагу и перевяжем джутовым канатиком. Мы используем плотную бумагу, она исключает случайные повреждения и сохраняет эффект сюрприза.</p>
                    </div>'''
    
    new_content = content[:start_idx] + replacement + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success: Literals replaced")
else:
    print(f"Failure: start_idx={start_idx}, end_idx={end_idx}")
