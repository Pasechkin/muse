import os

file_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\foto-na-kholste-sankt-peterburg.html'

with open(file_path, 'rb') as f:
    content = f.read()

# Using bytes to avoid any encoding/newline issues during find/replace
rama_marker = b'<!-- \xd0\xa0\xd0\xb0\xd0\xbc\xd0\xb0 -->' # <!-- Рама -->
gift_marker = b'<!-- \xd0\x9f\xd0\xbe\xd0\xb4\xd0\xb0\xd0\x81\xd0\xbe\xd1\x87\xd0\xbd\xd0\xb0\xd1\x8f \xd1\x83\xd0\xbf\xd0\xb0\xd0\xba\xd0\xbe\xd0\xb2\xd0\xba\xd0\xb0 -->' # <!-- Подарочная упаковка -->
# Wait, let's use search strings that are definitely there and unique
rama_marker = "<!-- Рама -->".encode('utf-8')
gift_marker = "<!-- Подарочная упаковка -->".encode('utf-8')
next_marker = "<!-- Как заказать -->".encode('utf-8')

rama_pos = content.find(rama_marker)
gift_pos = content.find(gift_marker)
next_pos = content.find(next_marker)

if rama_pos != -1 and gift_pos != -1 and next_pos != -1:
    # 1. Replace from rama_marker to gift_marker
    # We want to replace the whole block starting at rama_marker and ending before gift_marker
    # But wait, there is a </div> and some whitespace before gift_marker.
    
    # Let's find the LAST </div> before gift_marker
    end_rama_pos = content.rfind(b'</div>', rama_pos, gift_pos)
    if end_rama_pos != -1:
        end_rama_pos += 6 # length of </div>
        
    # Let's find the LAST </div> before next_marker
    end_gift_pos = content.rfind(b'</div>', gift_pos, next_pos)
    if end_gift_pos != -1:
        end_gift_pos += 6 # length of </div>

    new_rama = '''<!-- Рама -->
                    <div class="text-center">
                        <div class="icon-base icon-frame mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Рама</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Для визуализации и расчёта стоимости рамки в разделе <a href="#calc" class="text-primary underline hover:no-underline">«Цена»↑</a> загрузите изображение и установите размер. Или ожидайте нашего предложения после согласования макета.</p>
                    </div>'''.encode('utf-8')

    new_gift = '''<!-- Подарочная упаковка -->
                    <div class="text-center">
                        <div class="icon-base icon-gift mx-auto mb-4 text-primary"></div>
                        <h3 class="text-xl font-medium text-dark">Подарочная упаковка</h3>
                        <span class="text-gray-500">Дополнительная услуга</span>
                        <p class="text-body leading-7 text-left mt-3">Если картина — подарок, мы упакуем её в крафт-бумагу и перевяжем джутовым канатиком. Мы используем плотную бумагу, она исключает случайные повреждения и сохраняет эффект сюрприза.</p>
                    </div>'''.encode('utf-8')

    new_content = content[:rama_pos] + new_rama + content[end_rama_pos:gift_pos] + new_gift + content[end_gift_pos:]
    
    with open(file_path, 'wb') as f:
        f.write(new_content)
    print("Successfully updated with byte-level precision")
else:
    print(f"Markers not found: Rama={rama_pos}, Gift={gift_pos}, Next={next_pos}")
