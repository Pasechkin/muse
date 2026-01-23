#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emergency cleanup script: Remove all lines after icon-9 closing brace
"""

input_file = r'c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\input.css'

# Read file
with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with icon-9's closing brace
# We want to keep everything up to and including line 484 (icon-9 closing brace)
# The structure is:
# Line 481: @utility icon-9 {
# Line 482:   mask-image: url(...);
# Line 483:   -webkit-mask-image: url(...);
# Line 484: }  <-- KEEP THIS
# Line 485+: GARBAGE - DELETE ALL

# Strategy: Find "  @utility icon-9 {" then keep 3 more lines (mask, -webkit-, })
# Then discard everything after

clean_lines = []
found_icon9 = False
lines_after_icon9 = 0

for i, line in enumerate(lines):
    if '@utility icon-9 {' in line:
        found_icon9 = True
        clean_lines.append(line)
        print(f"Found icon-9 at line {i+1}: {line.strip()}")
        continue
    
    if found_icon9:
        lines_after_icon9 += 1
        clean_lines.append(line)
        
        # After icon-9 header, we expect:
        # +1: mask-image line
        # +2: -webkit-mask-image line
        # +3: closing brace }
        if lines_after_icon9 == 3:
            print(f"Stopping at line {i+1}: {line.strip()}")
            break
    else:
        clean_lines.append(line)

# Write cleaned file
with open(input_file, 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(clean_lines)

print(f"\n✅ SUCCESS! Cleaned {input_file}")
print(f"📊 Kept {len(clean_lines)} lines")
print(f"🗑️ Deleted {len(lines) - len(clean_lines)} lines of garbage")
