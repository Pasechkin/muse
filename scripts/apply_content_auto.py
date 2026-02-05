#!/usr/bin/env python3
"""
Скрипт для массового добавления content-auto к секциям ниже fold.
Пропускает hero секции и первые секции после hero.
"""
import os
import re
from pathlib import Path

# Папка проекта
PROJECT_ROOT = Path(__file__).parent.parent
HTML_DIR = PROJECT_ROOT / "src" / "html"

# Файлы для обработки
FILES_TO_PROCESS = [
    # Style pages
    *list((HTML_DIR / "portret-na-zakaz" / "style").glob("*.html")),
    # Object pages
    *list((HTML_DIR / "portret-na-zakaz" / "object").glob("*.html")),
    # Info page
    HTML_DIR / "info" / "info.html",
]

# Секции которые НЕ нужно оптимизировать (hero и навигация)
SKIP_PATTERNS = [
    r'id="hero"',
    r'id="page-navigator"',
    r'class="bg-dark">\s*<div class="container">\s*<div class="py-4"',  # secondary nav
]

def should_skip_section(section_tag):
    """Проверяет, нужно ли пропустить эту секцию"""
    for pattern in SKIP_PATTERNS:
        if re.search(pattern, section_tag, re.DOTALL):
            return True
    return False

def add_content_auto_to_file(filepath):
    """Добавляет content-auto к секциям в файле"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Паттерн для <section с классами
    pattern = r'(<section\s+(?:id="[^"]*"\s+)?class=")([^"]*)"'
    
    def replace_section(match):
        full_match = match.group(0)
        prefix = match.group(1)
        classes = match.group(2)
        
        # Пропускаем если уже есть content-auto
        if 'content-auto' in classes:
            return full_match
        
        # Пропускаем hero и навигацию
        if should_skip_section(full_match):
            return full_match
        
        # Добавляем content-auto
        new_classes = classes + ' content-auto'
        return f'{prefix}{new_classes}"'
    
    new_content = re.sub(pattern, replace_section, content)
    
    # Также обрабатываем секции где class идёт перед id
    pattern2 = r'(<section\s+class=")([^"]*)"(\s+id="[^"]*")'
    
    def replace_section2(match):
        prefix = match.group(1)
        classes = match.group(2)
        suffix = match.group(3)
        
        # Проверяем id на hero
        if 'id="hero"' in suffix or 'id="page-navigator"' in suffix:
            return match.group(0)
        
        # Пропускаем если уже есть content-auto
        if 'content-auto' in classes:
            return match.group(0)
        
        new_classes = classes + ' content-auto'
        return f'{prefix}{new_classes}"{suffix}'
    
    new_content = re.sub(pattern2, replace_section2, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    print("Применяем content-auto к секциям...\n")
    
    modified_count = 0
    
    for filepath in FILES_TO_PROCESS:
        if not filepath.exists():
            print(f"⚠ Файл не найден: {filepath}")
            continue
        
        if add_content_auto_to_file(filepath):
            print(f"✓ {filepath.relative_to(PROJECT_ROOT)}")
            modified_count += 1
        else:
            print(f"- {filepath.relative_to(PROJECT_ROOT)} (без изменений)")
    
    print(f"\nГотово! Изменено файлов: {modified_count}")

if __name__ == "__main__":
    main()
