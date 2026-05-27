const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

// Adiciona o plugin stealth ao Playwright
chromium.use(stealth);

async function buscarDados() {
    // Inicializa o navegador com o stealth ativado
    const browser = await chromium.launch({ 
        headless: true, // Precisa ser true na Render
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled' // Remove a bandeira de automação
        ]
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', // User-agent moderno de humano
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();
    
    // Seu código de navegação aqui...
    // await page.goto('https://sofascore.com...');
}

