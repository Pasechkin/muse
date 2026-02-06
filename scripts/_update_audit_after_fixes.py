import pathlib
import re

root = pathlib.Path("c:/Users/Анна/Documents/Muse-tailwind/tailwind-project")
audits_dir = root / "docs" / "audits"

remove_markers = [
    "вложенные .container",
    "`content-auto`",
    "у hero img нет `decoding",
    "`el-*` разметка",
]


def cleanup_addendum(text: str) -> str:
    marker = "## Дополнение 2026-02-06"
    if marker not in text:
        return text

    parts = text.split(marker)
    head = parts[0]
    tail = marker.join(parts[1:])
    # Split the addendum from the rest by next header or EOF
    split = re.split(r"\n(?=## )", tail, maxsplit=1)
    if len(split) == 1:
        addendum, rest = split[0], ""
        sep = ""
    else:
        addendum, rest = split[0], split[1]
        sep = "\n"
    addendum_lines = [line for line in addendum.splitlines() if line.strip()]

    filtered = []
    for line in addendum_lines:
        if any(marker in line for marker in remove_markers):
            continue
        filtered.append(line)

    # Keep status line if problems remain
    has_problem_bullets = any(line.strip().startswith("-") for line in filtered)
    if not has_problem_bullets:
        new_addendum = [
            marker,
            "Статус: ✅",
            "Проблемы: устранены (content-auto/hero decoding/el-*).",
        ]
    else:
        # Ensure status is ⚠️
        new_filtered = []
        for line in filtered:
            if line.startswith("Статус:"):
                new_filtered.append("Статус: ⚠️")
            else:
                new_filtered.append(line)
        new_addendum = [marker] + new_filtered

    rebuilt = head + "\n" + "\n".join(new_addendum).rstrip() + "\n"
    if sep:
        rebuilt += sep + rest.lstrip("\n")
    return rebuilt


for audit_path in audits_dir.glob("*.md"):
    text = audit_path.read_text(encoding="utf-8")
    updated = cleanup_addendum(text)
    if updated != text:
        audit_path.write_text(updated, encoding="utf-8")
