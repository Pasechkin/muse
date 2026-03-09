#!/usr/bin/env python3
"""
Масштабирование эталона portret-maslom.html на портретные страницы.

Приводит HTML-структуру 17 страниц в src/html/portret-na-zakaz/style/
к единому стандарту эталона portret-maslom.html.

Шаги:
  1.1  HERO — убрать lg:py-20, добавить id="hero", обёртку max-w-xl
  1.2  SALE BANNER — унификация формата
  1.3  HARAKTERISTIKI — text-ah-950 → text-ah-975, добавить скрытый video-tab + panel
  1.4  BEFORE-AFTER — <figure> → <div>, z-20 → z-40
  1.5  (review-modal: ничего не делаем, он только на эталоне)
  1.6  VIDEO-MODAL — проверить наличие, если есть video-card но нет модала — предупредить

Запуск:
  python scripts/_scale_reference.py              # dry-run (по умолчанию)
  python scripts/_scale_reference.py --apply      # применить изменения
  python scripts/_scale_reference.py --file pop-art-portret.html  # только один файл
"""
import os
import re
import sys
import glob
import argparse
from pathlib import Path

STYLE_DIR = Path(__file__).resolve().parent.parent / "src" / "html" / "portret-na-zakaz" / "style"
SKIP_FILES = {"portret-maslom.html", "portret-maslom-v7.html"}

# ── Шаблон скрытого video-tab (кнопка + панель) из эталона ──
HIDDEN_VIDEO_TAB_BUTTON = '''\
                                    <button type="button" class="relative flex h-20 cursor-pointer items-center justify-center rounded-xl bg-ah-50 text-sm font-medium text-ah-975 hover:bg-ah-75 focus:ring-2 focus:ring-ah-600/50 focus:ring-offset-2 focus:outline-hidden hidden" data-video-tab>
                                        <span class="sr-only">Видео</span>
                                        <span class="absolute inset-0 overflow-hidden rounded-xl">
                                            <img src="https://muse.ooo/upload/imgsite/canvas-on-wall-345-185.webp" alt="Девушка вешает картину на стену" title="Девушка вешает картину на стену" class="size-full object-cover" loading="lazy" decoding="async" width="345" height="185" />
                                            <span class="ui-control ui-control--sm absolute inset-0 m-auto">
                                                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                            </span>
                                        </span>
                                        <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent ring-offset-2 in-aria-selected:ring-ah-600"></span>
                                    </button>'''

HIDDEN_VIDEO_TAB_PANEL = '''\
                                <div hidden data-video-panel class="hidden">
                                    <div class="video-cover aspect-video rounded-lg" data-video-cover>
                                        <img src="https://muse.ooo/upload/imgsite/canvas-on-wall-345-185.webp" alt="Девушка вешает картину на стену" class="w-full h-full object-cover rounded-lg" loading="lazy" decoding="async" width="345" height="185" />
                                        <button type="button" class="ui-control ui-control--xl ui-control--play" data-play-btn aria-label="Воспроизвести видео">
                                            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </button>
                                        <video title="Девушка вешает картину на стену" preload="none" playsinline class="hidden">
                                            <source src="https://muse.ooo/video/devushka-veshaet-kartinu-na-stenu.webm" type="video/webm">
                                            <source src="https://muse.ooo/video/devushka-veshaet-kartinu-na-stenu.mp4" type="video/mp4">
                                        </video>
                                    </div>
                                </div>'''


def step_hero(html: str, fname: str) -> tuple[str, list[str]]:
    """1.1 HERO: добавить id='hero', убрать lg:py-20, добавить max-w-xl."""
    changes = []

    # 1.1a: section class → добавить id="hero" и убрать lg:py-20
    pattern = r'(<section)\s+class="bg-ah-975 py-12 lg:py-20"'
    replacement = r'\1 id="hero" class="bg-ah-975 py-12"'
    new_html, n = re.subn(pattern, replacement, html, count=1)
    if n:
        changes.append("  HERO: section → id=\"hero\" class=\"bg-ah-975 py-12\"")
        html = new_html

    # 1.1b: текстовый div внутри hero — добавить max-w-xl
    # Ищем паттерн: grid lg:grid-cols-2 ... > \n ... <div> — именно пустой div после grid
    # Учитываем разные варианты форматирования (комментарии, пробелы)
    hero_match = re.search(
        r'(grid lg:grid-cols-2 gap-8 items-center">\s*(?:<!--[^>]*-->\s*)?)<div>',
        html
    )
    if hero_match:
        start = hero_match.start(0)
        old = hero_match.group(0)
        new = hero_match.group(1) + '<div class="max-w-xl">'
        html = html[:start] + new + html[start + len(old):]
        changes.append("  HERO: text wrapper → <div class=\"max-w-xl\">")

    return html, changes


def step_sale_banner(html: str, fname: str) -> tuple[str, list[str]]:
    """1.2 SALE BANNER: унификация формата."""
    changes = []

    # Заменяем <strong>Скидка 20%</strong> с 6 по 7 марта
    pattern = r'<strong>Скидка 20%</strong>\s+с 6 по 7 марта'
    replacement = 'Скидка 20% &mdash; с 6 по 7 марта'
    new_html, n = re.subn(pattern, replacement, html)
    if n:
        changes.append(f"  SALE BANNER: <strong> → plain text с &mdash; ({n} замен)")
        html = new_html

    return html, changes


def _strip_html_comments(html: str) -> str:
    """Убрать HTML-комментарии для проверки наличия атрибутов."""
    return re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)


def step_harakteristiki_tabs(html: str, fname: str) -> tuple[str, list[str]]:
    """1.3 HARAKTERISTIKI: text-ah-950 → text-ah-975 в tab-кнопках; добавить hidden video-tab."""
    changes = []

    # Удаляем ВИДЕО-ШАБЛОН комментарии — они заменяются скрытыми video-tab/panel
    html, n_removed = re.subn(r'<!--\s*ВИДЕО-ШАБЛОН.*?-->\s*\n?', '', html, flags=re.DOTALL)
    if n_removed:
        changes.append(f"  HARAKTERISTIKI: удалён ВИДЕО-ШАБЛОН комментарий ({n_removed})")

    # 1.3a: text-ah-950 → text-ah-975 в tab-кнопках характеристик
    tab_list_match = re.search(r'(<div[^>]*data-tab-list[^>]*>.*?</div>)', html, re.DOTALL)
    if tab_list_match:
        tab_block = tab_list_match.group(1)
        new_tab_block = tab_block.replace('text-ah-950', 'text-ah-975')
        if new_tab_block != tab_block:
            count = tab_block.count('text-ah-950')
            html = html.replace(tab_block, new_tab_block)
            changes.append(f"  HARAKTERISTIKI tabs: text-ah-950 → text-ah-975 ({count} кнопок)")
    else:
        # Fallback: role="tablist" (например fantasy-art)
        tablist_match = re.search(r'(<div[^>]*role="tablist"[^>]*>)(.*?)(</div>)', html, re.DOTALL)
        if tablist_match:
            tab_block = tablist_match.group(0)
            new_tab_block = tab_block.replace('text-ah-950', 'text-ah-975')
            if new_tab_block != tab_block:
                count = tab_block.count('text-ah-950')
                html = html.replace(tab_block, new_tab_block)
                changes.append(f"  HARAKTERISTIKI tabs: text-ah-950 → text-ah-975 ({count} кнопок) [role=tablist]")

    # 1.3b: добавить скрытый video-tab если его нет
    if 'data-video-tab' not in html:
        # Кнопка: найти data-tab-list div, вставить после последней </button>
        tab_list_block = re.search(
            r'(<div[^>]*data-tab-list[^>]*>)(.*?)(</div>)',
            html, re.DOTALL
        )
        if tab_list_block:
            tab_content = tab_list_block.group(2)
            last_button = tab_content.rfind('</button>')
            if last_button != -1:
                insert_pos = last_button + len('</button>')
                new_tab_content = tab_content[:insert_pos] + '\n' + HIDDEN_VIDEO_TAB_BUTTON + tab_content[insert_pos:]
                html = html.replace(tab_list_block.group(0),
                    tab_list_block.group(1) + new_tab_content + tab_list_block.group(3))
                changes.append("  HARAKTERISTIKI tabs: добавлен скрытый video-tab button")
        else:
            changes.append(f"  ⚠️ HARAKTERISTIKI: нет data-tab-list — video-tab кнопка пропущена (ручная правка)")

        # Панель: найти data-tab-panels div, вставить перед последними двумя </div>
        panels_match = re.search(
            r'(<div[^>]*data-tab-panels[^>]*>)(.*?)(</div>\s*\n\s*</div>)',
            html, re.DOTALL
        )
        if panels_match:
            panels_content = panels_match.group(2)
            html = html.replace(
                panels_match.group(0),
                panels_match.group(1) + panels_content + '\n' + HIDDEN_VIDEO_TAB_PANEL + '\n' + ' ' * 24 + panels_match.group(3)
            )
            changes.append("  HARAKTERISTIKI tabs: добавлена скрытая video-panel")
        else:
            changes.append(f"  ⚠️ HARAKTERISTIKI: нет data-tab-panels — video-panel пропущена (ручная правка)")

    return html, changes


def step_before_after(html: str, fname: str) -> tuple[str, list[str]]:
    """1.4 BEFORE-AFTER: <figure> → <div>, z-20 → z-40."""
    changes = []

    # 1.4a: <figure class="before-after-slider ... → <div class="before-after-slider ...
    pattern = r'<figure(\s+class="before-after-slider[^"]*")'
    new_html, n = re.subn(pattern, r'<div\1', html)
    if n:
        changes.append(f"  BEFORE-AFTER: <figure> → <div> ({n})")
        html = new_html

    # Также fix closing </figure> for before-after-slider
    # We need to be precise: only close the one that was a before-after-slider
    # Find the before-after-slider <div> and its corresponding </figure>
    if n:  # only if we changed opening tags
        # Find all before-after-slider divs and fix their closing tags
        # The closing </figure> is typically near ba-handle or ba-divider
        ba_pattern = re.compile(
            r'(<div\s+class="before-after-slider[^"]*"[^>]*>)(.*?)(</figure>)',
            re.DOTALL
        )
        new_html = ba_pattern.sub(r'\1\2</div>', html)
        if new_html != html:
            html = new_html
            changes.append(f"  BEFORE-AFTER: </figure> → </div>")

    # 1.4b: z-20 → z-40 на input range внутри before-after-slider
    ba_range_pattern = r'(cursor-ew-resize\s+w-full\s+h-full\s+m-0\s+)z-20'
    new_html, n = re.subn(ba_range_pattern, r'\1z-40', html)
    if n:
        changes.append(f"  BEFORE-AFTER: z-20 → z-40 ({n})")
        html = new_html

    return html, changes


def step_video_modal_check(html: str, fname: str) -> tuple[str, list[str]]:
    """1.6 VIDEO-MODAL: проверить наличие, предупредить если есть video-card но нет модала."""
    changes = []
    has_video_card = 'class="video-card' in html or "class='video-card" in html
    has_video_modal = 'id="video-modal"' in html
    if has_video_card and not has_video_modal:
        changes.append(f"  ⚠️  VIDEO-MODAL: есть video-card, но нет video-modal (проверить вручную!)")
    return html, changes


def process_file(filepath: Path, dry_run: bool) -> list[str]:
    """Обработать один файл, вернуть список изменений."""
    html = filepath.read_text(encoding='utf-8')
    original = html
    fname = filepath.name
    all_changes = []

    for step_fn in [step_hero, step_sale_banner, step_harakteristiki_tabs,
                    step_before_after, step_video_modal_check]:
        html, changes = step_fn(html, fname)
        all_changes.extend(changes)

    if html != original:
        if not dry_run:
            filepath.write_text(html, encoding='utf-8')
            all_changes.append("  ✅ Файл обновлён")
        else:
            all_changes.append("  🔍 DRY-RUN: файл не изменён")
    else:
        all_changes.append("  — Без изменений")

    return all_changes


def main():
    parser = argparse.ArgumentParser(description="Масштабирование эталона portret-maslom.html")
    parser.add_argument("--apply", action="store_true", help="Применить изменения (без флага = dry-run)")
    parser.add_argument("--file", type=str, help="Обработать только указанный файл (имя файла)")
    args = parser.parse_args()

    dry_run = not args.apply

    if dry_run:
        print("=" * 60)
        print("  DRY-RUN: изменения НЕ записываются")
        print("  Для применения: python scripts/_scale_reference.py --apply")
        print("=" * 60)

    files = sorted(STYLE_DIR.glob("*.html"))
    files = [f for f in files if f.name not in SKIP_FILES]

    if args.file:
        files = [f for f in files if f.name == args.file]
        if not files:
            print(f"Файл '{args.file}' не найден в {STYLE_DIR}")
            sys.exit(1)

    total_changed = 0
    for filepath in files:
        print(f"\n{'─' * 40}")
        print(f"📄 {filepath.name}")
        changes = process_file(filepath, dry_run)
        for c in changes:
            print(c)
        if any("обновлён" in c or "DRY-RUN" in c for c in changes):
            total_changed += 1

    print(f"\n{'═' * 60}")
    print(f"Итого: {total_changed} из {len(files)} файлов {'обновлены' if not dry_run else 'будут обновлены'}")
    if dry_run:
        print("Для применения: python scripts/_scale_reference.py --apply")


if __name__ == "__main__":
    main()
