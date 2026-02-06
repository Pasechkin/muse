import re
import pathlib
from html.parser import HTMLParser

root = pathlib.Path("c:/Users/Анна/Documents/Muse-tailwind/tailwind-project")
audits = sorted((root / "docs" / "audits").glob("*.md"))


def extract_path(text: str) -> str | None:
    for key in ("path:", "source:"):
        match = re.search(r"^\s*" + re.escape(key) + r"\s*\"?([^\"\n]+)", text, re.M)
        if match:
            return match.group(1).strip()
    return None


paths: list[str] = []
for audit_path in audits:
    text = audit_path.read_text(encoding="utf-8")
    html_path = extract_path(text)
    if html_path:
        paths.append(html_path)

paths = sorted(dict.fromkeys(paths))


class Dom(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.head_scripts: list[dict[str, str]] = []
        self.body_scripts: list[dict[str, str]] = []
        self.inline_events: list[tuple[str, str]] = []
        self.imgs: list[tuple[int, dict[str, str]]] = []
        self.inputs: list[tuple[int, dict[str, str]]] = []
        self.data_play_btn: list[tuple[int, str, dict[str, str]]] = []
        self.has_el = False
        self.head_styles: list[str] = []
        self.links: list[dict[str, str]] = []
        self.html_attrs: dict[str, str] = {}
        self.in_head = False
        self.in_style = False
        self.current_style: list[str] = []
        self.section_index = 0
        self.content_auto_sections: list[tuple[int, int, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {k: v or "" for k, v in attrs}
        if tag == "html":
            self.html_attrs = attrs_dict
        if tag == "head":
            self.in_head = True
        if tag == "style" and self.in_head:
            self.in_style = True
            self.current_style = []
        if tag == "section":
            self.section_index += 1
        if "content-auto" in (attrs_dict.get("class") or ""):
            snippet = (attrs_dict.get("id") or "")
            if not snippet:
                snippet = (attrs_dict.get("class") or "")[:80]
            self.content_auto_sections.append((self.section_index, self.getpos()[0], snippet))
        if tag.startswith("el-"):
            self.has_el = True
        for key in list(attrs_dict):
            if key.lower().startswith("on"):
                self.inline_events.append((tag, key))
        if tag == "script":
            if self.in_head:
                self.head_scripts.append(attrs_dict)
            else:
                self.body_scripts.append(attrs_dict)
        if tag == "link":
            self.links.append(attrs_dict)
        if tag == "img":
            self.imgs.append((self.getpos()[0], attrs_dict))
        if tag == "input":
            self.inputs.append((self.getpos()[0], attrs_dict))
        if "data-play-btn" in attrs_dict:
            self.data_play_btn.append((self.getpos()[0], tag, attrs_dict))

    def handle_endtag(self, tag: str) -> None:
        if tag == "style" and self.in_style:
            self.in_style = False
            self.head_styles.append("".join(self.current_style))
            self.current_style = []
        if tag == "head":
            self.in_head = False

    def handle_data(self, data: str) -> None:
        if self.in_style:
            self.current_style.append(data)


def find_nested_containers(text: str) -> list[int]:
    class ContainerParser(HTMLParser):
        def __init__(self) -> None:
            super().__init__()
            self.stack: list[bool] = []
            self.nested_lines: list[int] = []

        def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
            cls = dict(attrs).get("class", "")
            is_container = "container" in cls.split()
            if is_container and any(self.stack):
                self.nested_lines.append(self.getpos()[0])
            self.stack.append(is_container)

        def handle_endtag(self, tag: str) -> None:
            if self.stack:
                self.stack.pop()

    parser = ContainerParser()
    parser.feed(text)
    return parser.nested_lines


def check_file(path: str) -> list[str]:
    file_path = root / path
    text = file_path.read_text(encoding="utf-8")
    dom = Dom()
    dom.feed(text)

    findings: list[str] = []
    if dom.html_attrs.get("lang") != "ru":
        findings.append("A: html lang not ru")
    if not re.search(r"<meta\s+charset=\"?UTF-8\"?", text, re.I):
        findings.append("A: meta charset missing")
    if not re.search(r"<meta\s+name=\"viewport\"", text, re.I):
        findings.append("A: meta viewport missing")
    if not re.search(r"<title>.*?</title>", text, re.I | re.S):
        findings.append("A: title missing")
    if not re.search(r"<meta\s+name=\"description\"", text, re.I):
        findings.append("A: meta description missing")
    if not re.search(r"<link\s+[^>]*rel=\"canonical\"", text, re.I):
        findings.append("A: canonical missing")
    if not re.search(r"<meta\s+name=\"robots\"[^>]*noindex[^>]*nofollow", text, re.I):
        findings.append("A: robots noindex,nofollow missing")
    nested_lines = find_nested_containers(text)
    if nested_lines:
        line_list = ", ".join(str(line) for line in nested_lines[:5])
        suffix = "" if len(nested_lines) <= 5 else "..."
        findings.append(f"A: nested .container found (lines {line_list}{suffix})")

    if not any(
        "output.css" in (link.get("href") or "")
        for link in dom.links
        if (link.get("rel") == "stylesheet" or "stylesheet" in (link.get("rel") or ""))
    ):
        findings.append("B: output.css not linked")
    for style in dom.head_styles:
        if re.search(r"\.sr-only|\.page-navigator|\.carousel-scroll", style):
            findings.append("B: forbidden selector in critical css")
            break
        if re.search(r"\.[a-zA-Z0-9_-]+", style):
            findings.append("B: extra class selector in critical css")
            break

    if dom.content_auto_sections:
        details = "; ".join(
            f"sec#{sec} line {line} {snippet}" for sec, line, snippet in dom.content_auto_sections[:5]
        )
        suffix = "" if len(dom.content_auto_sections) <= 5 else "..."
        findings.append(f"B: content-auto present ({details}{suffix})")

    for script in dom.head_scripts:
        if script.get("type", "") != "application/ld+json":
            findings.append("C: non-JSON-LD script in head")
            break

    nav_scripts = [s for s in dom.body_scripts if "nav.js" in (s.get("src") or "")]
    if not nav_scripts:
        findings.append("C: nav.js missing")
    else:
        if not any("defer" in s for s in nav_scripts):
            findings.append("C: nav.js missing defer")

    if dom.inline_events:
        findings.append("C: inline JS events found")

    if re.search(r"tailwindplus-elements", text):
        findings.append("C: tailwindplus-elements present")

    if dom.has_el or re.search(r"<el-", text):
        findings.append("C: el-* tags present")

    missing_wh = [line for line, img in dom.imgs if not img.get("width") or not img.get("height")]
    if missing_wh:
        line_list = ", ".join(str(line) for line in missing_wh[:5])
        suffix = "" if len(missing_wh) <= 5 else "..."
        findings.append(f"D: img missing width/height at lines {line_list}{suffix}")

    bad_format = [
        (line, img)
        for line, img in dom.imgs
        if img.get("src") and not img.get("src").startswith("data:") and not img.get("src").endswith(".webp")
    ]
    if bad_format:
        line_list = ", ".join(str(line) for line, _ in bad_format[:5])
        suffix = "" if len(bad_format) <= 5 else "..."
        findings.append(f"D: non-webp img src at lines {line_list}{suffix}")

    svg_img = [line for line, img in dom.imgs if img.get("src", "").endswith(".svg")]
    if svg_img:
        line_list = ", ".join(str(line) for line in svg_img[:5])
        suffix = "" if len(svg_img) <= 5 else "..."
        findings.append(f"D: svg img tag at lines {line_list}{suffix}")

    missing_dec = [line for line, img in dom.imgs if "decoding" not in img]
    if missing_dec:
        line_list = ", ".join(str(line) for line in missing_dec[:5])
        suffix = "" if len(missing_dec) <= 5 else "..."
        findings.append(f"D: img missing decoding at lines {line_list}{suffix}")

    missing_load = [line for line, img in dom.imgs if "loading" not in img]
    if missing_load:
        line_list = ", ".join(str(line) for line in missing_load[:5])
        suffix = "" if len(missing_load) <= 5 else "..."
        findings.append(f"D: img missing loading at lines {line_list}{suffix}")

    range_missing = [line for line, i in dom.inputs if i.get("type") == "range" and "aria-label" not in i]
    if range_missing:
        line_list = ", ".join(str(line) for line in range_missing[:5])
        suffix = "" if len(range_missing) <= 5 else "..."
        findings.append(f"E: range input missing aria-label at lines {line_list}{suffix}")

    play_missing = [line for line, _, a in dom.data_play_btn if "aria-label" not in a]
    if play_missing:
        line_list = ", ".join(str(line) for line in play_missing[:5])
        suffix = "" if len(play_missing) <= 5 else "..."
        findings.append(f"E: data-play-btn missing aria-label at lines {line_list}{suffix}")

    return findings


for path in paths:
    issues = check_file(path)
    if issues:
        print(path)
        for issue in issues:
            print(" -", issue)
        print("")
