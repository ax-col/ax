import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://www.gov.co/';

async function runTestAndGeneratePDF() {
  console.log(`🔎 Escaneando rutas principales en: ${BASE_URL}`);
  
  // 1. Extraer enlaces usando fetch y cheerio
  const response = await fetch(BASE_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const pagesToTest = new Set([BASE_URL]);

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
      pagesToTest.add(new URL(href, BASE_URL).href);
    }
  });

  console.log(`📊 Se encontraron ${pagesToTest.size} páginas. Iniciando verificación en segundo plano...`);

  // 2. Iniciar Puppeteer en modo Headless (sin abrir pestañas visualmente)
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];

  for (const url of pagesToTest) {
    const page = await browser.newPage();
    const startTime = Date.now();
    let status = 0;
    let success = false;

    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      status = res ? res.status() : 0;
      success = status === 200;
    } catch (err) {
      status = 'ERROR';
    }

    const duration = Date.now() - startTime;
    results.push({ url, status, duration, success });

    console.log(`  [${success ? 'OK' : 'FAIL'}] ${status} - ${url} (${duration}ms)`);
    
    // Cierra la pestaña inmediatamente para liberar memoria RAM
    await page.close();
  }

  // 3. Renderizar vista HTML del reporte
  const total = results.length;
  const passed = results.filter(r => r.success).length;
  const rate = Math.round((passed / total) * 100);

  const reportHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 20px; color: #1e293b; }
      h1 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
      .summary { display: flex; gap: 20px; margin-bottom: 20px; }
      .card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; flex: 1; text-align: center; }
      .card-num { font-size: 20px; font-weight: bold; color: #2563eb; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-size: 13px; }
      th { background-color: #f1f5f9; }
      .badge-ok { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 10px; font-weight: bold; }
      .badge-fail { background: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 10px; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Reporte de Verificación de Páginas Web</h1>
    <p>Repositorio: <strong>${BASE_URL}</strong></p>
    
    <div class="summary">
      <div class="card"><div class="card-num">${total}</div>Total de URLs</div>
      <div class="card"><div class="card-num" style="color: #16a34a;">${passed}</div>Exitosas (200 OK)</div>
      <div class="card"><div class="card-num" style="color: #0284c7;">${rate}%</div>Tasa de Éxito</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>URL Escaneada</th>
          <th>Estado HTTP</th>
          <th>Tiempo Carga</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        ${results.map((r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${r.url}</td>
            <td>${r.status}</td>
            <td>${r.duration} ms</td>
            <td><span class="${r.success ? 'badge-ok' : 'badge-fail'}">${r.success ? 'PASÓ' : 'FALLÓ'}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
  </html>
  `;

  // 4. Convertir HTML a PDF en Puppeteer y guardarlo
  const reportPage = await browser.newPage();
  await reportPage.setContent(reportHtml);
  await reportPage.pdf({ path: 'reporte-verificacion-urls.pdf', format: 'A4', printBackground: true });

  await browser.close();
  console.log('✅ Reporte PDF generado con éxito: reporte-verificacion-urls.pdf');
}

runTestAndGeneratePDF();