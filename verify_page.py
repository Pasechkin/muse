from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Absolute path to the file
        file_path = os.path.abspath("src/html/modulnaya-kartina-syuzhet-razmer-tsvet.html")
        page.goto(f"file://{file_path}")

        # Take a screenshot
        screenshot_path = "/home/jules/verification/verification.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
