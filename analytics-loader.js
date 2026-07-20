// 📡 IMPORTACIONES ESTÁTICAS NATIVAS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, push, onDisconnect, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 👑 1. DETECTAR LA RUTA BASE AUTOMÁTICAMENTE
const getBaseURL = () => {
    const loc = window.location;
    if (loc.hostname.includes("github.io") && loc.pathname.startsWith("/ax")) {
        return "/ax";
    }
    return ""; 
};

const baseUrl = getBaseURL();

// 🚀 INYECTAR ICONOS Y FAVICONS GLOBALES
(function() {
    const faviconTags = [
        { tag: 'link', rel: 'icon', href: `${baseUrl}/favicon.ico`, type: 'image/x-icon' },
        { tag: 'link', rel: 'icon', sizes: '192x192', href: `${baseUrl}/png-principal/icon-192x192.png` },
        { tag: 'link', rel: 'icon', sizes: '512x512', href: `${baseUrl}/png-principal/icon-512x512.png` },
        { tag: 'link', rel: 'apple-touch-icon', href: `${baseUrl}/png-principal/icon-192x192.png` },
        { tag: 'link', rel: 'manifest', href: `${baseUrl}/manifest.json` }
    ];

    faviconTags.forEach(item => {
        if (!document.querySelector(`link[href="${item.href}"]`)) {
            const element = document.createElement(item.tag);
            Object.keys(item).forEach(key => {
                if (key !== 'tag') element.setAttribute(key, item[key]);
            });
            document.head.appendChild(element);
        }
    });
})();

// 🎨 2. INYECTAR ESTILOS GLOBALES CONTROLADOS (Sin romper fondos de subpáginas)
const styles = document.createElement('style');
styles.innerHTML = `
    /* BARRA SUPERIOR AX GLOBAL */
    #ax-global-header {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 45px; padding: 0 20px;
        display: flex; justify-content: space-between; align-items: center;
        z-index: 999999; box-sizing: border-box;
        font-family: 'Courier New', Courier, monospace;
        background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        pointer-events: none;
    }
    .ax-header-left {
        color: #ffffff !important; font-weight: bold !important; font-size: 18px !important;
        letter-spacing: 5px; text-shadow: 0 0 5px rgb(255, 39, 2); pointer-events: auto;
    }
    .ax-header-right { display: flex; gap: 8px; pointer-events: auto; }
    .ax-stat-box {
        background: rgba(1, 1, 1, 0.5) !important; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 10px; border-radius: 6px;
        display: flex; align-items: center; gap: 6px; font-size: 11px; color: #a0a5c0;
    }
    .ax-stat-box .stat-value { color: #ffffff !important; font-weight: bold; }
    .ax-stat-box.online .stat-value { color: #00ffcc !important; text-shadow: 0 0 5px rgba(0, 255, 204, 0.6); }
    .ax-stat-box .stat-dot {
        width: 6px; height: 6px; background-color: #00ffcc; border-radius: 50%;
        display: inline-block; box-shadow: 0 0 8px #00ffcc; animation: ax-pulse-dot 2s infinite;
    }
    @keyframes ax-pulse-dot { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }

    /* MARCO RGB GLOBAL INTELIGENTE */
    .ax-global-border {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        border: 3px solid;
        border-image: linear-gradient(90deg, 
            #ff0000, #ff4000, #ff8000, #ffbf00, #ffff00, #bfff00, #80ff00, #40ff00, #00ff00, 
            #00ff40, #00ff80, #00ffbf, #00ffff, #00bfff, #0080ff, #0040ff, #0000ff, #4000ff, 
            #8000ff, #bf00ff, #ff00ff, #ff00bf, #ff0080, #ff0040, #ff0000) 1;
        animation: axMoveBorder 3s linear infinite;
        pointer-events: none;
        box-sizing: border-box;
        z-index: 999998;
    }
    @keyframes axMoveBorder {
        0% { border-image-source: linear-gradient(0deg, #ff0000, #00ff00, #0000ff, #ff0000); }
        50% { border-image-source: linear-gradient(180deg, #ff0000, #00ff00, #0000ff, #ff0000); }
        100% { border-image-source: linear-gradient(360deg, #ff0000, #00ff00, #0000ff, #ff0000); }
    }

    /* CANVAS ADAPTATIVO DE FONDO NO INTRUSIVO */
    #ax-global-canvas {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: -9999; /* Fondo ultra absoluto para no tapar fondos nativos de subpáginas */
        pointer-events: none;
        display: block;
    }
`;
document.head.appendChild(styles);

// 🏢 3. INYECTOR GLOBAL BLINDADO (Garantiza carga en cualquier estructura HTML)
const injectGlobalElements = () => {
    if (!document.body) return; // Salvaguarda mecánica

    // Asegurar inyección de la barra superior
    if (!document.getElementById('ax-global-header')) {
        const header = document.createElement('div');
        header.id = 'ax-global-header';
        header.innerHTML = `
            <div class="ax-header-left">AX</div>
            <div class="ax-header-right">
                <div class="ax-stat-box">
                    <span class="stat-label">VISTAS:</span>
                    <span id="global-total-visits" class="stat-value">--</span>
                </div>
                <div class="ax-stat-box online">
                    <span class="stat-dot"></span>
                    <span class="stat-label">ONLINE:</span>
                    <span id="global-active-users" class="stat-value">--</span>
                </div>
            </div>
        `;
        // Lo insertamos al inicio del body de forma segura
        document.body.insertBefore(header, document.body.firstChild);
    }

    // Asegurar inyección del marco RGB
    if (!document.querySelector('.ax-global-border')) {
        const borderFrame = document.createElement('div');
        borderFrame.className = 'ax-global-border';
        document.body.appendChild(borderFrame);
    }

    // Asegurar inyección del Canvas interactivo
    if (!document.getElementById('ax-global-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'ax-global-canvas';
        document.body.appendChild(canvas);
        initCanvasAnimation(canvas);
    }
    
    // Conectar Firebase una vez que la estructura visual está asegurada
    startFirebaseAnalytics();
};

// 🌌 ANIMACIÓN DE PARTICULAS REORGANIZADA
const initCanvasAnimation = (canvas) => {
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let p = [];
    for(let i=0; i<150; i++) {
        p.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6
        });
    }

    function animate() {
        // Mantiene la estela sin sobreescribir con negro sólido los diseños nativos
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1100ff';
        
        p.forEach((p1) => {
            p1.x += p1.vx;
            p1.y += p1.vy;
            
            if(p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
            if(p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;
            
            p.forEach(p2 => {
                if(Math.hypot(p1.x - p2.x, p1.y - p2.y) < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();
};

// 🧭 CONTROL DE CICLO DE VIDA PARA INYECCIÓN MANDATORIA
if (document.readyState === "complete" || document.readyState === "interactive") {
    injectGlobalElements();
} else {
    document.addEventListener("DOMContentLoaded", injectGlobalElements);
    window.addEventListener("load", injectGlobalElements); // Doble seguro si la página es pesada
}

// 🔥 4. SUBSISTEMA DE ANALÍTICA DE FIREBASE (Aislado de la carga del DOM)
function startFirebaseAnalytics() {
    const firebaseConfig = {
        apiKey: "AIzaSyDI8C65d5SJa-DslwylhK58iWZcsf-3duE",
        authDomain: "open-817a9.firebaseapp.com",
        databaseURL: "https://open-817a9-default-rtdb.firebaseio.com",
        projectId: "open-817a9",
        storageBucket: "open-817a9.firebasestorage.app",
        messagingSenderId: "90367601661",
        appId: "1:90367601661:web:1f1fde2dbd29c8dd220794"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const visitsRef = ref(db, 'analytics/total_visits');
    const onlineRef = ref(db, 'analytics/online_users');

    // Transacción de visitas totales
    runTransaction(visitsRef, (currentValue) => { return (currentValue || 0) + 1; });
    
    onValue(visitsRef, (snapshot) => {
        const total = snapshot.val() || 0;
        const viewEl = document.getElementById('global-total-visits');
        if (viewEl) viewEl.textContent = Number(total).toLocaleString();
    });

    // Control Anti-Duplicados Avanzado por Sesión
    let sessionToken = sessionStorage.getItem('ax_user_session');
    if (!sessionToken) {
        sessionToken = 'user_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('ax_user_session', sessionToken);
    }

    const connectedRef = ref(db, '.info/connected');
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            const myUserRef = ref(db, `analytics/online_users/${sessionToken}`);
            onDisconnect(myUserRef).remove();
            set(myUserRef, true);
        }
    });

    onValue(onlineRef, (snapshot) => {
        let totalActive = 0;
        if (snapshot.exists()) { snapshot.forEach(() => { totalActive++; }); }
        const onlineEl = document.getElementById('global-active-users');
        if (onlineEl) onlineEl.textContent = totalActive;
    });
}
