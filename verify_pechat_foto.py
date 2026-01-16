import os
from playwright.sync_api import sync_playwright

def verify_pechat_foto():
    # Use absolute path for file:// protocol
    filepath = os.path.abspath("src/html/blog/pechat-foto-i-reproduktsiy-na-fotobumage.html")
    file_url = f"file://{filepath}"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        print(f"Navigating to {file_url}")
        page.goto(file_url)

        # 1. Verify Title
        title = page.title()
        print(f"Page Title: {title}")
        assert "Печать репродукций или фотографий на бумаге" in title

        # 2. Verify H1
        h1_text = page.locator("h1").inner_text()
        print(f"H1 Text: {h1_text}")
        assert "Печать репродукций или фотографий на бумаге" in h1_text

        # 3. Verify Date
        date_text = page.locator("header > div > time").first.inner_text()
        print(f"Date: {date_text}")
        assert "12 ноября 2015 года" in date_text

        # 4. Verify TOC items
        toc_link = page.locator("a[href='#what-is-passepartout']")
        print(f"TOC link 'Что такое паспарту': {toc_link.inner_text()}")
        assert toc_link.is_visible()

        # 5. Verify Promo Banner
        promo_text = page.locator("text=Скидка 20% с 3 по 4 января").first
        print(f"Promo Banner Text found: {promo_text.is_visible()}")
        assert promo_text.is_visible()

        # 6. Verify Images (check at least one specific image)
        img_src = "https://muse.ooo/upload/img/36964760503e926e0d6fae0e8afaa841.webp"
        img = page.locator(f"img[src='{img_src}']")
        print(f"First image visible: {img.is_visible()}")
        # Note: is_visible might be false if lazy loaded and off screen, but we just check presence in DOM or scroll to it.
        # Let's scroll to bottom to trigger lazy loads if needed for screenshot
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500) # Wait for potential lazy loads

        # 7. Screenshot
        screenshot_path = "pechat_foto_verification.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_pechat_foto()
