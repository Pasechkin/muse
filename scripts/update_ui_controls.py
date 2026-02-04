#!/usr/bin/env python3
"""
Скрипт для массовой замены video-play-icon и back-to-top на унифицированные ui-control классы.
Запуск: python scripts/update_ui_controls.py
"""

import os
import re
from pathlib import Path

# Директория с HTML файлами
BASE_DIR = Path(__file__).parent.parent / "src" / "html"

# Паттерны для замены back-to-top
BACK_TO_TOP_OLD = re.compile(
    r'<a href="#" id="back-to-top"\s+class="[^"]*hidden md:flex[^"]*fixed bottom-5 right-5[^"]*w-12 h-12[^"]*items-center justify-center[^"]*rounded-full[^"]*bg-white[^"]*"[^>]*aria-label="Наверх">\s*'
    r'<svg[^>]*viewBox="0 0 24 24"[^>]*fill="none"[^>]*stroke="currentColor"[^>]*stroke-width="2"[^>]*class="w-6 h-6">\s*'
    r'<path d="M18 15l-6-6-6 6"[^/]*/>\s*'
    r'</svg>\s*'
    r'</a>',
    re.DOTALL | re.MULTILINE
)

BACK_TO_TOP_NEW = '''<a href="#" id="back-to-top" class="ui-control ui-control--lg ui-control--light fixed bottom-5 right-5 z-50 opacity-0 pointer-events-none hidden md:flex" aria-label="Наверх">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </a>'''

# Паттерн для video-play-icon (button версия)
VIDEO_PLAY_BUTTON_OLD = re.compile(
    r'<button type="button" class="video-play-icon[^"]*cursor-pointer[^"]*"[^>]*data-play-btn[^>]*aria-label="[^"]*">\s*'
    r'<svg[^>]*width="80"[^>]*height="80"[^>]*viewBox="0 0 24 24"[^>]*fill="white"[^>]*class="drop-shadow-lg"[^>]*>'
    r'<path d="M8 5v14l11-7z"/></svg>\s*'
    r'</button>',
    re.DOTALL
)

VIDEO_PLAY_BUTTON_NEW = '''<button type="button" class="ui-control ui-control--xl ui-control--play" data-play-btn aria-label="Воспроизвести видео">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                                        </button>'''

# Паттерн для video-play-icon (div версия)
VIDEO_PLAY_DIV_OLD = re.compile(
    r'<div class="video-play-icon cursor-pointer" data-play-btn>\s*'
    r'<svg[^>]*width="80"[^>]*height="80"[^>]*viewBox="0 0 24 24"[^>]*fill="white"[^>]*class="drop-shadow-lg"[^>]*>\s*'
    r'<path d="M8 5v14l11-7z"/>\s*</svg>\s*'
    r'</div>',
    re.DOTALL
)

VIDEO_PLAY_DIV_NEW = '''<button type="button" class="ui-control ui-control--xl ui-control--play" data-play-btn aria-label="Воспроизвести видео">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                                </button>'''


def process_file(filepath: Path) -> tuple[bool, int]:
    """Обрабатывает один файл. Возвращает (изменён, количество замен)."""
    try:
        content = filepath.read_text(encoding='utf-8')
        original = content
        count = 0
        
        # Замена back-to-top (упрощённый паттерн)
        if 'id="back-to-top"' in content and 'ui-control' not in content:
            # Ищем старый формат back-to-top
            old_btn_pattern = r'<a href="#" id="back-to-top"[^>]*class="[^"]*"[^>]*aria-label="Наверх">\s*<svg[^>]*>[^<]*<path[^/]*/>\s*</svg>\s*</a>'
            if re.search(old_btn_pattern, content, re.DOTALL):
                content = re.sub(
                    old_btn_pattern,
                    BACK_TO_TOP_NEW,
                    content,
                    flags=re.DOTALL
                )
                count += 1
        
        # Замена video-play-icon (button)
        matches = VIDEO_PLAY_BUTTON_OLD.findall(content)
        if matches:
            content = VIDEO_PLAY_BUTTON_OLD.sub(VIDEO_PLAY_BUTTON_NEW, content)
            count += len(matches)
        
        # Замена video-play-icon (div)
        matches = VIDEO_PLAY_DIV_OLD.findall(content)
        if matches:
            content = VIDEO_PLAY_DIV_OLD.sub(VIDEO_PLAY_DIV_NEW, content)
            count += len(matches)
        
        if content != original:
            filepath.write_text(content, encoding='utf-8')
            return True, count
        
        return False, 0
        
    except Exception as e:
        print(f"  Ошибка: {e}")
        return False, 0


def main():
    print("=" * 60)
    print("Обновление UI Controls на сайте Muse")
    print("=" * 60)
    
    # Собираем все HTML файлы
    html_files = list(BASE_DIR.rglob("*.html"))
    
    # Исключаем output.css и другие нерелевантные
    html_files = [f for f in html_files if 'css' not in str(f)]
    
    print(f"\nНайдено {len(html_files)} HTML файлов")
    print("-" * 60)
    
    updated = 0
    total_replacements = 0
    
    for filepath in sorted(html_files):
        rel_path = filepath.relative_to(BASE_DIR)
        changed, count = process_file(filepath)
        
        if changed:
            print(f"✓ {rel_path} ({count} замен)")
            updated += 1
            total_replacements += count
    
    print("-" * 60)
    print(f"Обновлено файлов: {updated}")
    print(f"Всего замен: {total_replacements}")
    print("\nНе забудьте пересобрать CSS: npm run build:once; npm run copy-css")


if __name__ == "__main__":
    main()
