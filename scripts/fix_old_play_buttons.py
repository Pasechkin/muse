#!/usr/bin/env python3
"""Замена старых кнопок Play на новый ui-control стиль."""
import re
from pathlib import Path

SRC_DIR = Path(__file__).parent.parent / "src" / "html"

# Паттерн для старой кнопки Play (многострочный)
OLD_PATTERN = re.compile(
    r'<button type="button" class="absolute inset-0 flex items-center justify-center z-10 cursor-pointer\s+'
    r'bg-black/20 hover:bg-black/30 transition-colors\s+'
    r'group-\[\.video-playing\]:opacity-0 group-\[\.video-playing\]:pointer-events-none"\s+'
    r'data-play-btn aria-label="[^"]+">.*?'
    r'<svg width="80" height="80" viewBox="0 0 24 24" fill="white" class="drop-shadow-lg">.*?'
    r'<path d="M8 5v14l11-7z"/>.*?'
    r'</svg>.*?'
    r'</button>',
    re.DOTALL
)

NEW_BUTTON = '''<button type="button" class="ui-control ui-control--xl ui-control--play absolute inset-0 m-auto group-[.video-playing]:opacity-0 group-[.video-playing]:pointer-events-none" data-play-btn aria-label="Воспроизвести видео">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>'''

def main():
    updated = 0
    for html_file in SRC_DIR.rglob("*.html"):
        content = html_file.read_text(encoding="utf-8")
        if 'svg width="80" height="80"' in content:
            new_content, count = OLD_PATTERN.subn(NEW_BUTTON, content)
            if count > 0:
                html_file.write_text(new_content, encoding="utf-8")
                print(f"✓ {html_file.name}: {count} замен")
                updated += count
    print(f"\nВсего замен: {updated}")

if __name__ == "__main__":
    main()
