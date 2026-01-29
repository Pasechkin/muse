"""
Скрипт для удаления <header> и <footer> из HTML файлов в папке style.
Оставляет комментарии <!-- Header --> и <!-- Footer --> как заглушки.
"""
import re
from pathlib import Path

# Папка со страницами стилей
STYLE_DIR = Path(__file__).parent.parent / "src" / "html" / "portret-na-zakaz" / "style"

# Регулярные выражения для поиска header и footer
HEADER_PATTERN = re.compile(
    r'([ \t]*)<!-- Header -->\s*<header[\s\S]*?</header>',
    re.IGNORECASE
)
FOOTER_PATTERN = re.compile(
    r'([ \t]*)<!-- Footer -->\s*<footer[\s\S]*?</footer>',
    re.IGNORECASE
)

# Также ищем без комментария перед тегом
HEADER_PATTERN_NO_COMMENT = re.compile(
    r'([ \t]*)<header[\s\S]*?</header>',
    re.IGNORECASE
)
FOOTER_PATTERN_NO_COMMENT = re.compile(
    r'([ \t]*)<footer[\s\S]*?</footer>',
    re.IGNORECASE
)

def process_file(filepath):
    """Обрабатывает один HTML файл"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # Заменяем header
    if HEADER_PATTERN.search(content):
        content = HEADER_PATTERN.sub(r'\1<!-- Header -->\n\1', content)
        changes.append('header')
    elif HEADER_PATTERN_NO_COMMENT.search(content):
        content = HEADER_PATTERN_NO_COMMENT.sub(r'\1<!-- Header -->\n\1', content)
        changes.append('header')
    
    # Заменяем footer
    if FOOTER_PATTERN.search(content):
        content = FOOTER_PATTERN.sub(r'\1<!-- Footer -->\n\1', content)
        changes.append('footer')
    elif FOOTER_PATTERN_NO_COMMENT.search(content):
        content = FOOTER_PATTERN_NO_COMMENT.sub(r'\1<!-- Footer -->\n\1', content)
        changes.append('footer')
    
    # Записываем только если были изменения
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes
    return None

def main():
    print(f"Обработка файлов в: {STYLE_DIR}\n")
    
    if not STYLE_DIR.exists():
        print(f"ОШИБКА: Папка не найдена: {STYLE_DIR}")
        return
    
    html_files = list(STYLE_DIR.glob("*.html"))
    
    if not html_files:
        print("HTML файлы не найдены")
        return
    
    print(f"Найдено файлов: {len(html_files)}\n")
    
    modified_count = 0
    for filepath in sorted(html_files):
        changes = process_file(filepath)
        if changes:
            print(f"✓ {filepath.name}: удалено {', '.join(changes)}")
            modified_count += 1
        else:
            print(f"  {filepath.name}: без изменений")
    
    print(f"\n{'='*50}")
    print(f"Обработано: {len(html_files)} файлов")
    print(f"Изменено: {modified_count} файлов")

if __name__ == "__main__":
    main()
