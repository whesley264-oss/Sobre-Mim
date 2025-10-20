from playwright.sync_api import sync_playwright, expect
import os

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    file_path = os.path.abspath('index.html')
    page.goto(f'file://{file_path}')

    # 1. Verify that the main content becomes visible
    main_content = page.locator('#main-content')
    expect(main_content).to_be_visible(timeout=10000)

    # 2. Verify that the preloader is hidden
    preloader = page.locator('#preloader')
    expect(preloader).not_to_be_visible()

    # 3. Take a screenshot of the loaded page
    page.screenshot(path='jules-scratch/verification/bugfix_preloader.png')

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Verification script finished. Preloader bug is fixed.")
