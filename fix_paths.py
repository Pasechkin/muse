import os
from pathlib import Path

# Путь к папке блога
blog_path = r"src\html\blog"

# Получить все HTML файлы в папке блога
html_files = list(Path(blog_path).glob("*.html"))

if not html_files:
    print("❌ HTML файлы не найдены в", blog_path)
else:
    fixed_count = 0
    error_count = 0
    
    for file_path in html_files:
        try:
            # Читать файл
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Проверить, есть ли старый путь
            if '<script src="js/nav.js"' in content:
                # Заменить на новый путь
                new_content = content.replace(
                    '<script src="js/nav.js"',
                    '<script src="../js/nav.js"'
                )
                
                # Записать файл обратно
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"✅ {file_path.name}")
                fixed_count += 1
            else:
                print(f"⚠️  {file_path.name} - путь уже правильный или отсутствует")
        
        except Exception as e:
            print(f"❌ {file_path.name} - ОШИБКА: {e}")
            error_count += 1
    
    print(f"\n📊 ИТОГО: исправлено {fixed_count}, ошибок {error_count}, всего {len(html_files)}")
