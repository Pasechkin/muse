import os
import re

# Эталонная секция преимуществ
advantages_section = '''        <!-- Преимущества (на голубом фоне) -->
        <section class="bg-primary py-16 lg:py-24" id="preimushchestva">
            <div class="mx-auto px-4 max-w-[1170px] mb-12">
            <div class="container mb-12">
                <h2 class="text-3xl lg:text-4xl font-light text-white text-center">Преимущества</h2>
            </div>
            <div class="mx-auto px-4 max-w-[1170px]">
            <div class="container">
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Преимущество 1: Примеры работ -->
                    <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-27.svg" alt="Примеры работ" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Более 110 примеров от наших художников на сайте для ознакомления с уровнем работ</p>
                    </div>

                    <!-- Преимущество 2: Цифровая работа -->
                     <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-26.svg" alt="Цифровая работа" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Для 100% сходства, правок и быстрого согласования пишем портреты в цифровом виде</p>
                    </div>

                    <!-- Преимущество 3: Качество печати -->
                     <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-1.svg" alt="Качество печати" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Печатаем оригинальными чернилами на плотном холсте – срок службы картины от 50-ти лет</p>
                    </div> 

                    <!-- Преимущество 4: Соблюдение сроков -->
                    <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-25.svg" alt="Соблюдение сроков" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Крайне ответственно относимся к соблюдению сроков выполнения работ. Не беремся, если не успеваем</p>
                    </div>

                    <!-- Преимущество 5: Цена -->
                   <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-5.svg" alt="Цена" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Предлагаем выгодную цену благодаря полному циклу собственного производства: от эскиза до оформления в багет</p>
                    </div>

                    <!-- Преимущество 6: Гарантия -->
                   <div class="bg-white rounded-lg p-6 text-left text-dark">
                        <div class="w-16 h-16 mb-4 flex items-center justify-start">
                            <img src="../../../icons/icon-6.svg" alt="Гарантия" class="w-10 h-10" style="filter: invert(53%) sepia(90%) saturate(1207%) hue-rotate(187deg) brightness(94%) contrast(89%);">
                        </div>
                        <p class="text-lg">Предоставляем официальную гарантию и гордимся каждым положительным отзывов на странице</p>
                    </div>
                </div>
            </div>
        </section>'''

# Путь к папке
folder_path = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html\portret-na-zakaz\style'

# Исключаем эталонный файл
exclude_file = 'portret-maslom.html'

# Обрабатываем все HTML файлы
for filename in os.listdir(folder_path):
    if filename.endswith('.html') and filename != exclude_file:
        file_path = os.path.join(folder_path, filename)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Ищем секцию преимуществ (от начала комментария до закрывающего тега section)
            pattern = r'(\s*)<!-- Преимущества.*?</section>'
            
            # Заменяем найденную секцию на эталонную
            new_content = re.sub(pattern, advantages_section, content, flags=re.DOTALL)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'✅ {filename} - обновлен')
            else:
                print(f'⚠️  {filename} - секция не найдена')
                
        except Exception as e:
            print(f'❌ {filename} - ошибка: {e}')

print('\nГотово!')
