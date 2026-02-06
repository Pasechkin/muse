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


audit_paths = sorted(audits_dir.glob("*.md"))
html_paths: list[pathlib.Path] = []
for audit_path in audit_paths:
    audit_text = audit_path.read_text(encoding="utf-8")
    html_path = extract_path(audit_text)
    if html_path:
        html_paths.append(root / html_path)

seen = set()
unique_html_paths = []
for path in html_paths:
    if path in seen:
        continue
    unique_html_paths.append(path)
    seen.add(path)

for path in unique_html_paths:
    text = path.read_text(encoding="utf-8")
    sections = list(re.finditer(r"<section\b[^>]*>", text, re.I))
    if not sections:
        continue
    bad = []
    for idx, match in enumerate(sections[:2], start=1):
        tag = match.group(0)
        if "content-auto" in tag:
            bad.append((idx, tag.strip()))
    if bad:
        print(path)
        for idx, tag in bad:
            print(f"  section {idx}: {tag}")
        print("")
