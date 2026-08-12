import puppeteer, { KnownDevices } from 'puppeteer';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://ax-col.github.io/ax/';

// Obtiene el modo desde los argumentos ('mobile' o 'desktop')
const MODE = process.argv[2] || 'desktop';

async function openAllPagesInChrome() {
  try {
    console.log(`Buscando enlaces en: ${BASE_URL}...`);
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);

    const pagesToOpen = new Set([BASE_URL]);

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        pagesToOpen.add(new URL(href, BASE_URL).href);
      }
    });

    console.log(`Se encontraron ${pagesToOpen.size} páginas. Iniciando Chrome (${MODE})...`);

    // Lanza Google Chrome en modo visible (headless: false)
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    for (const url of pagesToOpen) {
      const page = await browser.newPage();

      if (MODE === 'mobile') {
        // Emula la resolución, pantalla táctil y User-Agent de un dispositivo móvil
        await page.emulate(KnownDevices['Pixel 5']);
      }

      console.log(`Cargando [${MODE}]: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    }

  } catch (error) {
    console.error('Error al ejecutar el script:', error.message);
    process.exit(1);
  }
}

openAllPagesInChrome();