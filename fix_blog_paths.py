import os

# Путь к папке с блогом (тот, что вы указали)
blog_folder = r"C:\Users\Анна\Documents\Muse-tailwind\V2\muse-migration-tailwind-v4-10388599573794131211\src\html\blog"

# Неправильная строка (которая сейчас там)
wrong_code = '<script src="js/nav.js" defer></script>'

# Правильная строка (с выходом на уровень вверх)
correct_code = '<script src="../js/nav.js" defer></script>'

count = 0

if os.path.exists(blog_folder):
    print(f"Проверяю папку: {blog_folder}...")
    for filename in os.listdir(blog_folder):
        if filename.endswith(".html"):
            filepath = os.path.join(blog_folder, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Если нашли неправильный путь — меняем
                if wrong_code in content:
                    new_content = content.replace(wrong_code, correct_code)
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"✅ Исправлен: {filename}")
                    count += 1
                elif correct_code in content:
                    print(f"🆗 Уже правильный: {filename}")
                else:
                    print(f"⚠️ Скрипт не найден в: {filename}")
                    
            except Exception as e:
                print(f"❌ Ошибка с файлом {filename}: {e}")

    print(f"\nГотово! Всего исправлено файлов: {count}")
else:
    print(f"❌ Папка не найдена: {blog_folder}")
