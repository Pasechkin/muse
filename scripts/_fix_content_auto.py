import re
import pathlib

root = pathlib.Path("c:/Users/Анна/Documents/Muse-tailwind/tailwind-project")
audits_dir = root / "docs" / "audits"


def extract_path(text: str) -> str | None:
    for key in ("path:", "source:"):
        match = re.search(r"^\s*" + re.escape(key) + r"\s*\"?([^\"\n]+)", text, re.M)
        if match:
            return match.group(1).strip()
    return None


def clean_class_attr(tag: str) -> str:
    def _replace(match: re.Match) -> str:
        classes = match.group(2).split()
        classes = [c for c in classes if c != "content-auto"]
        if not classes:
            return ""
        return f"{match.group(1)}{' '.join(classes)}{match.group(3)}"

    # Double-quoted class
    new_tag = re.sub(r"(class\s*=\s*\")(.*?)(\")", _replace, tag, count=1)
    if new_tag == tag:
        # Single-quoted class
        new_tag = re.sub(r"(class\s*=\s*')(.*?)(')", _replace, tag, count=1)
    # If class attr was removed, clean extra spaces
    new_tag = re.sub(r"\s+>\s*$", ">", new_tag)
    return new_tag


def remove_content_auto_from_first_sections(text: str, max_sections: int = 2) -> str:
    sections = list(re.finditer(r"<section\b[^>]*>", text, re.I))
    if not sections:
        return text

    edits = []
    for index, match in enumerate(sections[:max_sections], start=1):
        tag = match.group(0)
        if "content-auto" not in tag:
            continue
        cleaned = clean_class_attr(tag)
        if cleaned != tag:
            edits.append((match.start(), match.end(), cleaned))

    if not edits:
        return text

    # Apply edits from end to start to preserve indices
    out = text
    for start, end, replacement in reversed(edits):
        out = out[:start] + replacement + out[end:]
    return out


audit_paths = sorted(audits_dir.glob("*.md"))
html_paths: list[pathlib.Path] = []
for audit_path in audit_paths:
    audit_text = audit_path.read_text(encoding="utf-8")
    html_path = extract_path(audit_text)
    if html_path:
        html_paths.append(root / html_path)

# Deduplicate
seen = set()
unique_html_paths = []
for path in html_paths:
    if path in seen:
        continue
    unique_html_paths.append(path)
    seen.add(path)

changed = []
for path in unique_html_paths:
    text = path.read_text(encoding="utf-8")
    updated = remove_content_auto_from_first_sections(text, max_sections=2)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        changed.append(path)

print("Updated:")
for path in changed:
    print(path)
