import re
import pathlib
from html.parser import HTMLParser

root = pathlib.Path("c:/Users/Анна/Documents/Muse-tailwind/tailwind-project")
audits_dir = root / "docs" / "audits"

def extract_path(text: str) -> str | None:
    for key in ("path:", "source:"):
        match = re.search(r"^\s*" + re.escape(key) + r"\s*\"?([^\"\n]+)", text, re.M)
        if match:
            return match.group(1).strip()
    return None


def find_nested_containers(text: str) -> list[tuple[int, str]]:
    class Parser(HTMLParser):
        def __init__(self) -> None:
            super().__init__()
            self.stack: list[bool] = []
            self.matches: list[tuple[int, str]] = []
            self.void_tags = {
                "area",
                "base",
                "br",
                "col",
                "embed",
                "hr",
                "img",
                "input",
                "link",
                "meta",
                "param",
                "source",
                "track",
                "wbr",
            }

        def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
            cls = dict(attrs).get("class", "")
            is_container = "container" in cls.split()
            if is_container and any(self.stack):
                line = self.getpos()[0]
                snippet = f"<{tag} class=\"{cls}\">"
                self.matches.append((line, snippet))
            if tag not in self.void_tags:
                self.stack.append(is_container)

        def handle_endtag(self, tag: str) -> None:
            if self.stack:
                self.stack.pop()

    parser = Parser()
    parser.feed(text)
    return parser.matches


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
    matches = find_nested_containers(text)
    if not matches:
        continue
    print(path)
    for line, snippet in matches[:5]:
        print(f"  line {line}: {snippet}")
    if len(matches) > 5:
        print("  ...")
    print("")
