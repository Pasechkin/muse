from playwright.sync_api import sync_playwright, expect
import os

def test_blog_page_kollazh():
    # Use absolute path for file protocol
    abs_path = os.path.abspath("src/html/blog/kollazh-i-fotokollazh.html")
    file_url = f"file://{abs_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to page
        page.goto(file_url)

        # 1. Verify Title
        expect(page).to_have_title("Что такое фотоколлаж? - Muse")

        # 2. Verify Breadcrumbs
        breadcrumbs = page.locator("nav[aria-label='Хлебные крошки']")
        expect(breadcrumbs).to_be_visible()
        expect(breadcrumbs).to_contain_text("Что такое фотоколлаж?")

        # 3. Verify Table of Contents
        toc = page.get_by_role("heading", name="Содержание")
        expect(toc).to_be_visible()

        # 4. Verify Images exist (check a specific one)
        img = page.locator('img[alt="Коллаж Пабло Пикассо. Натюрморт со сломанным стулом"]')
        expect(img).to_be_visible()

        # 5. Verify Content Sections
        expect(page.locator("#collage")).to_contain_text("Что такое коллаж?")
        expect(page.locator("#rules")).to_contain_text("Правила подборки фотографий")

        # Take screenshot
        screenshot_path = "/home/jules/verification/kollazh_full.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    test_blog_page_kollazh()
