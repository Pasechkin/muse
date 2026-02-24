"""
Dual-color blue strategy: Replace text-primary → text-primary-text
on SMALL TEXT elements across all HTML files.

Rules:
- CHANGE: text-primary on links, breadcrumbs, TOC, small labels, CTA text
- KEEP: text-primary on prices (text-2xl, text-lg), step numbers (text-xl, text-lead),
        SVG icons (w-10 h-10), blog card titles (group-hover on text-xl), star ratings
"""

import re
import os
from pathlib import Path

ROOT = Path(r"c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html")

# Files to skip (already done or not applicable)
SKIP_FILES = {
    "calc.html",
    "colors.html",
    "deepseek_html_20260224_b4a936.html",
}

# Also skip output.css files
SKIP_DIRS = {"css"}

changes_log = []

def is_large_text_context(line: str, match_start: int) -> bool:
    """
    Determine if a text-primary usage is LARGE text (should NOT change).
    Checks surrounding classes in the same HTML tag.
    """
    # Find the opening < of the tag containing this match
    tag_start = line.rfind('<', 0, match_start)
    if tag_start == -1:
        tag_start = 0
    tag_end = line.find('>', match_start)
    if tag_end == -1:
        tag_end = len(line)
    tag_content = line[tag_start:tag_end + 1]

    # LARGE patterns — DO NOT change
    large_patterns = [
        r'text-2xl\b',           # prices
        r'text-xl\b',            # step numbers / card titles
        r'text-lg\b.*font-bold', # sticky price
        r'font-bold.*text-lg\b', # sticky price (reversed)
        r'text-lead\b',          # step numbers
        r'w-10\s+h-10',          # SVG icons
        r'h-10\s+w-10',          # SVG icons (reversed)
        r'group-hover:text-primary', # blog card titles (these are on text-xl parents)
        r'uppercase\s+tracking-wide', # press release labels
        r'uppercase\s+tracking-widest', # (smaller but still decorative)
        r'gap-x-1\s+text-primary',     # star ratings
        r'text-primary\s+gap-x-1',     # star ratings (reversed)
        r'data-city-reset',             # city reset button (standalone action)
        r'shadow-primary',              # button shadow
        r'px-3\s+py-2\s+.*text-primary.*shadow', # mode switch button (modular)
    ]

    for pat in large_patterns:
        if re.search(pat, tag_content, re.IGNORECASE):
            return True
    return False


def process_file(filepath: Path):
    """Process a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    file_changes = 0

    # Split into lines for context-aware replacement
    lines = content.split('\n')
    new_lines = []

    for line_num, line in enumerate(lines, 1):
        new_line = line

        # Pattern 1: hover:text-primary-hover → hover:text-primary-text-hover
        # (only the cookie banner pattern)
        if 'hover:text-primary-hover' in new_line:
            new_line = new_line.replace(
                'hover:text-primary-hover',
                'hover:text-primary-text-hover'
            )
            if new_line != line:
                file_changes += line.count('hover:text-primary-hover')

        # Pattern 2: hover:text-primary (not already hover:text-primary-text or hover:text-primary-hover)
        # These are almost always small text (breadcrumbs, legal links, city hover)
        hover_pattern = re.compile(r'hover:text-primary(?!-)')
        if hover_pattern.search(new_line):
            # Check if it's in a large-text context
            for m in list(hover_pattern.finditer(new_line)):
                if not is_large_text_context(new_line, m.start()):
                    pass  # Will replace below
                # Note: hover:text-primary on group-hover won't match this pattern
                # because group-hover:text-primary doesn't have "hover:" prefix 
            # Replace all hover:text-primary (non-large)
            temp = new_line
            new_line = hover_pattern.sub(
                lambda m: m.group(0) if is_large_text_context(new_line, m.start()) else 'hover:text-primary-text',
                new_line
            )
            if new_line != temp:
                file_changes += 1

        # Pattern 3: Static text-primary (not part of text-primary-hover, text-primary-light, text-primary-text, etc.)
        # and not bg-primary, border-primary, ring-primary, outline-primary, shadow-primary, accent-primary
        # and not hover:text-primary (already handled)
        # and not group-hover:text-primary (LARGE — blog card titles)
        static_pattern = re.compile(
            r'(?<![:\w-])text-primary(?!-)'  # text-primary not followed by - (not text-primary-*)
        )
        if static_pattern.search(new_line):
            # For each match, check if it's in a large-text context
            temp = new_line
            new_line = static_pattern.sub(
                lambda m: m.group(0) if is_large_text_context(new_line, m.start()) else 'text-primary-text',
                new_line
            )
            if new_line != temp:
                file_changes += 1

        new_lines.append(new_line)

    if file_changes > 0:
        new_content = '\n'.join(new_lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        rel = filepath.relative_to(ROOT)
        changes_log.append(f"  ✅ {rel}: {file_changes} replacements")
    return file_changes


def main():
    total_files = 0
    total_changes = 0

    for filepath in sorted(ROOT.rglob("*.html")):
        # Skip certain files and directories
        if filepath.name in SKIP_FILES:
            continue
        rel_parts = filepath.relative_to(ROOT).parts
        if any(d in SKIP_DIRS for d in rel_parts[:-1]):
            continue
        if 'output.css' in filepath.name:
            continue

        count = process_file(filepath)
        if count > 0:
            total_files += 1
            total_changes += count

    print(f"\n{'='*60}")
    print(f"Dual-color replacement complete!")
    print(f"Files modified: {total_files}")
    print(f"Total replacement operations: {total_changes}")
    print(f"{'='*60}\n")
    for entry in changes_log:
        print(entry)


if __name__ == "__main__":
    main()
