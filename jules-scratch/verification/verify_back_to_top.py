import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Constrói o caminho absoluto para o arquivo index.html
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Espera a página carregar
        page.wait_for_load_state('networkidle')

        # Rola até o final da página para fazer o botão aparecer
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        # Espera o botão estar visível
        back_to_top_button = page.locator('#back-to-top')
        expect(back_to_top_button).to_be_visible()

        # Tira um screenshot da parte inferior da página
        page.screenshot(path='jules-scratch/verification/back-to-top-button.png')

        browser.close()

if __name__ == '__main__':
    run_verification()
