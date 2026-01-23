import re
import sys

if len(sys.argv) < 2:
    print('Usage: python check_html_balance.py path/to/file.html')
    sys.exit(2)

path = sys.argv[1]

start_re = re.compile(r'<\s*(div|section)(?:\s[^>]*)?>', re.I)
end_re = re.compile(r'<\s*/\s*(div|section)\s*>', re.I)
self_closing_re = re.compile(r'/\s*>$')
comment_re = re.compile(r'<!--.*?-->', re.S)

stack = []

with open(path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, start=1):
        s = line
        # remove comments
        s = comment_re.sub('', s)
        # find all tags in line
        for m in start_re.finditer(s):
            tag = m.group(1).lower()
            # check if this start tag is actually immediately closed on same line
            end_on_same = s[m.end():].find('</')
            # push with line number
            stack.append((tag, i))
        for m in end_re.finditer(s):
            tag = m.group(1).lower()
            if stack and stack[-1][0] == tag:
                stack.pop()
            else:
                # try to find matching tag in stack
                found = False
                for idx in range(len(stack)-1, -1, -1):
                    if stack[idx][0] == tag:
                        found = True
                        # pop until that
                        for _ in range(len(stack)-idx):
                            popped = stack.pop()
                            print(f"Unclosed <{popped[0]}> opened at line {popped[1]}")
                        break
                if not found:
                    print(f"Stray closing </{tag}> at line {i}")

if stack:
    for tag, lineno in stack:
        print(f"Unclosed <{tag}> opened at line {lineno}")
else:
    print('All <div> and <section> tags are balanced')
