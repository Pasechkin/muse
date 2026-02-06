import re
from pathlib import Path

AUDIT_DIR = Path("c:/Users/Анна/Documents/Muse-tailwind/tailwind-project/docs/audits")
NOTE_PATTERN = re.compile(
    r"\n\n---\s*\n🔴 \*\*Примечание ИИ-агента согласно Task 1:.*\Z",
    re.S,
)

updated = 0
for path in AUDIT_DIR.glob("*.md"):
    text = path.read_text(encoding="utf-8")
    new_text, count = NOTE_PATTERN.subn("", text)
    if count:
        path.write_text(new_text.rstrip() + "\n", encoding="utf-8")
        updated += 1

print(f"Updated audits: {updated}")
