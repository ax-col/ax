const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auditar-ultra-automatico', async (req, res) => {
    console.log("🤖 Robot AX activado. Abriendo navegador en las sombras...");
    
    let browser;
    try {
        // Lanzamos un Chrome controlado por código
        browser = await puppeteer.launch({
            headless: true, // true para que sea invisible, false si quieres ver cómo se mueve solo
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Nos disfrazamos de un celular común para evitar cualquier bloqueo
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36');

        console.path = "🔗 Navegando directo a la sección de desempeños...";
        // Vamos directo a la URL de notas (Udeki pedirá login de forma nativa si no hay sesión)
        await page.goto('https://app.udeki.com/desempenio/estudiante', { waitUntil: 'networkidle2' });

        // --- AQUÍ EL ROBOT ESPERA A QUE LAS NOTAS ESTÉN EN PANTALLA ---
        console.log("⏳ Esperando que carguen las asignaturas en la memoria de Udeki...");
        
        // Esperamos a que la variable global 'asignaturas' exista y tenga datos en la ventana
        await page.waitForFunction(() => window.asignaturas && window.asignaturas.length > 0, { timeout: 30000 });

        console.log("📦 ¡Mina de oro detectada! Extrayendo array directo de la memoria...");
        // Extraemos el objeto 'asignaturas' en caliente directo de la pestaña
        const asignaturasCargadas = await page.evaluate(() => {
            return window.asignaturas;
        });

        // Procesamos los datos con tu regla del 80%
        const datosProcesados = asignaturasCargadas.map(materia => {
            let logrados = 0;
            let periodos = materia.periodos || [];
            
            periodos.forEach(p => {
                let logros = p.logros || [];
                logros.forEach(l => {
                    if (['SUPERIOR', 'ALTO', 'BASICO'].includes(l.nombre_escala)) {
                        logrados++;
                    }
                });
            });

            const meta = 4; // Tu meta estándar
            return {
                materia: materia.asignatura || materia.nombre,
                nota: materia.nota || 0,
                tengo: logrados,
                meta80: meta,
                cumple: (materia.nota >= 3.5 || logrados >= meta)
            };
        });

        await browser.close();
        console.log("✅ ¡Auditoría completada con éxito!");
        res.json({ success: true, datos: datosProcesados });

    } catch (error) {
        if (browser) await browser.close();
        console.error("❌ Fallo en el escaneo automático:", error.message);
        res.status(500).json({ 
            success: false, 
            error: 'No se detectó la sección de notas activa o el tiempo de espera expiró.' 
        });
    }
});

app.listen(3000, () => {
    console.log('🚀 Servidor Mágico AX corriendo en http://localhost:3000');
});