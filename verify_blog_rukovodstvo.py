import os
import sys
from playwright.sync_api import sync_playwright

def verify_page():
    # Ensure the file exists
    file_path = "src/html/blog/rukovodstvo-po-pechati-na-kholste.html"
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} does not exist.")
        sys.exit(1)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load the page (using file:// protocol as we are local)
        # Convert relative path to absolute path for file://
        abs_path = os.path.abspath(file_path)
        page.goto(f"file://{abs_path}")

        # Verify Title
        title = page.title()
        expected_title = "Руководство по печати на холсте - Muse"
        if title != expected_title:
            print(f"Error: Title mismatch. Expected '{expected_title}', got '{title}'")
            # We don't exit here, we check other things too
        else:
            print("Title verified.")

        # Verify TOC exists
        toc = page.query_selector("text=Содержание")
        if not toc:
             print("Error: Table of Contents ('Содержание') not found.")
        else:
             print("TOC verified.")

        # Verify Header
        header = page.query_selector("h1")
        if header:
            print(f"Header found: {header.inner_text()}")
        else:
            print("Error: H1 header not found.")

        # Take a screenshot
        screenshot_path = "rukovodstvo_verification.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_page()
