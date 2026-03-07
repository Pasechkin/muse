"""
Унификация фонов секций по образцу portret-maslom.html.

Правила:
  • <body …>  bg-white → bg-ah-25 ;  bg-ah-100 → bg-ah-25
  • <section …>  bg-dark → bg-ah-975
  • <section …>  bg-secondary → bg-ah-25
  • НЕ трогать bg-white / bg-secondary на НЕ-section тегах (кнопки, карточки, div-ы)
  • НЕ трогать файлы-исключения (эталоны, демо, калькулятор)

Запуск:
  python scripts/_unify_backgrounds.py          — dry-run (показывает что изменится)
  python scripts/_unify_backgrounds.py --apply  — применить
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "src" / "html"

# ── Файлы-исключения ──
SKIP = {
    "portret-maslom.html",     # эталон, уже ok
    "portret-maslom-v7.html",  # legacy
    "calc.html",               # embedded calc
    "colors.html",             # демо
    "ex.html",                 # демо
    "social-icons-demo.html",  # демо
}

DRY = "--apply" not in sys.argv

# ── Фазы и файлы ──
def collect_files():
    """Собрать все HTML-файлы, кроме исключений."""
    files = sorted(ROOT.rglob("*.html"))
    return [f for f in files if f.name not in SKIP]


# ── Замены ──
def process_file(path: pathlib.Path) -> list[str]:
    """Обработать один файл. Возвращает список описаний замен."""
    text = path.read_text(encoding="utf-8")
    original = text
    changes: list[str] = []

    # 1) body: bg-white → bg-ah-25
    new = re.sub(
        r'(<body\b[^>]*\bclass="[^"]*)\bbg-white\b',
        r'\1bg-ah-25',
        text,
    )
    if new != text:
        changes.append("body: bg-white → bg-ah-25")
        text = new

    # 2) body: bg-ah-100 → bg-ah-25
    new = re.sub(
        r'(<body\b[^>]*\bclass="[^"]*)\bbg-ah-100\b',
        r'\1bg-ah-25',
        text,
    )
    if new != text:
        changes.append("body: bg-ah-100 → bg-ah-25")
        text = new

    # 3) body: bg-dark → bg-ah-975  (404.html)
    new = re.sub(
        r'(<body\b[^>]*\bclass="[^"]*)\bbg-dark\b',
        r'\1bg-ah-975',
        text,
    )
    if new != text:
        changes.append("body: bg-dark → bg-ah-975")
        text = new

    # 4) <section …> bg-dark → bg-ah-975
    new = re.sub(
        r'(<section\b[^>]*\bclass="[^"]*)\bbg-dark\b',
        r'\1bg-ah-975',
        text,
    )
    if new != text:
        cnt = text.count("bg-dark") - new.count("bg-dark")
        # count only section-level replacements
        cnt = len(re.findall(r'<section\b[^>]*\bclass="[^"]*\bbg-dark\b', text))
        changes.append(f"section: bg-dark → bg-ah-975  (×{cnt})")
        text = new

    # 5) <section …> bg-secondary → bg-ah-25
    new = re.sub(
        r'(<section\b[^>]*\bclass="[^"]*)\bbg-secondary\b',
        r'\1bg-ah-25',
        text,
    )
    if new != text:
        cnt = len(re.findall(r'<section\b[^>]*\bclass="[^"]*\bbg-secondary\b', text))
        changes.append(f"section: bg-secondary → bg-ah-25  (×{cnt})")
        text = new

    # 6) <section …> bg-white → bg-ah-25
    new = re.sub(
        r'(<section\b[^>]*\bclass="[^"]*)\bbg-white\b',
        r'\1bg-ah-25',
        text,
    )
    if new != text:
        cnt = len(re.findall(r'<section\b[^>]*\bclass="[^"]*\bbg-white\b', text))
        changes.append(f"section: bg-white → bg-ah-25  (×{cnt})")
        text = new

    # 7) <section …> bg-primary → bg-ah-25  (pechat pages accent sections)
    new = re.sub(
        r'(<section\b[^>]*\bclass="[^"]*)\bbg-primary\b',
        r'\1bg-ah-25',
        text,
    )
    if new != text:
        cnt = len(re.findall(r'<section\b[^>]*\bclass="[^"]*\bbg-primary\b', text))
        changes.append(f"section: bg-primary → bg-ah-25  (×{cnt})")
        text = new

    if text != original and not DRY:
        path.write_text(text, encoding="utf-8")

    return changes


def main():
    files = collect_files()
    total_changes = 0
    changed_files = 0

    mode = "DRY RUN" if DRY else "APPLYING"
    print(f"\n{'='*60}")
    print(f"  Унификация фонов — {mode}")
    print(f"  Файлов к обработке: {len(files)}")
    print(f"{'='*60}\n")

    for f in files:
        changes = process_file(f)
        if changes:
            rel = f.relative_to(ROOT)
            print(f"  {rel}")
            for c in changes:
                print(f"    ✓ {c}")
            total_changes += len(changes)
            changed_files += 1

    print(f"\n{'─'*60}")
    print(f"  Итого: {total_changes} замен в {changed_files} файлах")
    if DRY:
        print(f"  (dry run — добавьте --apply для применения)")
    else:
        print(f"  ✅ Все изменения записаны")
    print(f"{'─'*60}\n")


if __name__ == "__main__":
    main()
