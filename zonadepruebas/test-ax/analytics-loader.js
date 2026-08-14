// 📡 IMPORTACIONES ESTÁTICAS NATIVAS DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, onDisconnect, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 👑 1. DETECTAR RUTA BASE AUTOMÁTICAMENTE
const getBaseURL = () => {
    const loc = window.location;
    if (loc.hostname.includes("github.io") && loc.pathname.startsWith("/ax")) {
        return "/ax";
    }
    return ""; 
};

const baseUrl = getBaseURL();

// 🚀 2. INYECTAR FAVICONS Y METADATOS
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

// 🎨 3. ESTILOS UI/UX SIN MANCHAS: FONDO TOTALMENTE TRANSPARENTE, SOLO CAJAS ACTIVAS
const styleId = 'ax-absolute-styles';
const oldStyle = document.getElementById(styleId);
if (oldStyle) oldStyle.remove();

const styles = document.createElement('style');
styles.id = styleId;
styles.innerHTML = `
    #ax-global-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 70px !important;
        padding: 10px 20px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        z-index: 2147483647 !important;
        box-sizing: border-box !important;
        font-family: 'Courier New', Courier, monospace !important;
        pointer-events: none !important;
        background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%) !important;
    }
    
    .ax-header-left {
        color: #ffffff !important;
        font-weight: bold !important;
        font-size: 18px !important;
        letter-spacing: 5px !important;
        text-shadow: 0 0 5px rgb(255, 39, 2) !important;
        pointer-events: auto !important;
        cursor: pointer !important;
    }

    .ax-header-right {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        gap: 6px !important;
        pointer-events: auto !important;
    }

    .ax-stats-row {
        display: flex !important;
        gap: 6px !important;
    }

    .ax-stat-box {
        background: rgba(1, 1, 1, 0.85) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        display: flex !important;
        align-items: center !important;
        gap: 5px !important;
        font-size: 11px !important;
        color: #a0a5c0 !important;
    }

    .ax-stat-box .stat-value {
        color: #ffffff !important;
        font-weight: bold !important;
    }

    .ax-stat-box.online .stat-value {
        color: #00ffcc !important;
        text-shadow: 0 0 5px rgba(0, 255, 204, 0.8) !important;
    }

    .ax-stat-dot {
        width: 6px !important;
        height: 6px !important;
        background-color: #00ffcc !important;
        border-radius: 50% !important;
        display: inline-block !important;
        box-shadow: 0 0 8px #00ffcc !important;
    }

    /* BOTÓN < */
    #axMenuBtn {
        background: rgba(255, 0, 0, 0.3) !important;
        border: 2px solid #ff0000 !important;
        color: #ffffff !important;
        padding: 4px 20px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-weight: bold !important;
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px !important;
        letter-spacing: 3px !important;
        box-shadow: 0 0 12px rgba(255, 0, 0, 0.5) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    #axMenuBtn:hover {
        background: #ff0000 !important;
        box-shadow: 0 0 20px #ff0000 !important;
        transform: scale(1.05);
    }

    /* CONTENEDOR GENERAL DEL MENÚ - CERO FONDO, TOTALMENTE TRANSPARENTE */
    #ax-side-drawer {
        position: fixed !important;
        top: 70px !important;
        left: 0 !important;
        width: 100% !important;
        max-height: 0 !important;
        overflow: hidden !important;
        background: transparent !important;
        z-index: 2147483648 !important;
        transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-sizing: border-box !important;
        pointer-events: none !important;
        font-family: 'Courier New', Courier, monospace !important;
    }

    #ax-side-drawer.open {
        max-height: calc(100vh - 70px) !important;
        overflow-y: auto !important;
        pointer-events: auto !important;
    }

    /* BARRA DE SECCIONES - SIN NINGÚN COLOR DE FONDO */
    .ax-menu-bar {
        display: flex !important;
        justify-content: flex-end !important;
        gap: 12px !important;
        padding: 15px 30px !important;
        background: transparent !important;
        box-sizing: border-box !important;
    }

    /* CADA SECCIÓN */
    .ax-section-item {
        position: relative !important;
        background: transparent !important;
        border: none !important;
        min-width: 160px !important;
        width: 180px !important;
        transition: all 0.3s ease !important;
    }

    .ax-section-header {
        padding: 10px 14px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        cursor: pointer !important;
        color: #ffffff !important;
        font-size: 12px !important;
        font-weight: bold !important;
        letter-spacing: 1px !important;
        background: rgba(10, 10, 20, 0.85) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 8px !important;
        backdrop-filter: blur(8px) !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
    }

    .ax-section-header:hover {
        background: rgba(0, 255, 204, 0.2) !important;
        border-color: rgba(0, 255, 204, 0.5) !important;
        color: #00ffcc !important;
        box-shadow: 0 0 15px rgba(0, 255, 204, 0.2) !important;
    }

    .ax-section-arrow {
        color: #00ffcc !important;
        font-size: 14px !important;
        font-weight: bold !important;
        transition: transform 0.3s ease, color 0.3s ease !important;
    }

    .ax-section-item.open .ax-section-arrow {
        transform: rotate(90deg) !important;
        color: #ff0055 !important;
    }

    .ax-section-item.open .ax-section-header {
        background: rgba(0, 255, 204, 0.25) !important;
        border-color: rgba(0, 255, 204, 0.6) !important;
        color: #00ffcc !important;
        border-radius: 8px 8px 0 0 !important;
        box-shadow: 0 0 20px rgba(0, 255, 204, 0.3) !important;
    }

    /* CONTENIDO DESPLEGABLE */
    .ax-section-content {
        max-height: 0 !important;
        overflow: hidden !important;
        transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        background: rgba(8, 8, 16, 0.95) !important;
        backdrop-filter: blur(15px) !important;
        border-radius: 0 0 8px 8px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    .ax-section-item.open .ax-section-content {
        max-height: 300px !important;
        padding: 10px !important;
        border: 1px solid rgba(0, 255, 204, 0.6) !important;
        border-top: none !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8) !important;
    }

    .ax-drawer-btn {
        display: block !important;
        padding: 8px 10px !important;
        background: rgba(0, 255, 204, 0.05) !important;
        border: 1px solid rgba(0, 255, 204, 0.2) !important;
        color: #00ffcc !important;
        text-decoration: none !important;
        border-radius: 5px !important;
        font-size: 11px !important;
        text-align: center !important;
        transition: all 0.2s ease !important;
        letter-spacing: 1px !important;
        box-sizing: border-box !important;
        width: 100% !important;
    }

    .ax-drawer-btn:hover {
        background: #00ffcc !important;
        color: #000000 !important;
        box-shadow: 0 0 12px rgba(0, 255, 204, 0.7) !important;
        transform: translateY(-1px);
    }

    #ax-global-canvas {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: -9999 !important;
        pointer-events: none !important;
        display: block !important;
    }

    /* --- AJUSTE MÓVIL: APILADO LIMPIO SIN FONDO GENERAL --- */
    @media screen and (max-width: 768px) {
        .ax-menu-bar {
            flex-direction: column !important;
            align-items: flex-end !important;
            justify-content: flex-start !important;
            padding: 15px !important;
            gap: 10px !important;
            background: transparent !important; /* Eliminada la mancha negra por completo */
            backdrop-filter: none !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .ax-section-item {
            width: 220px !important;
            min-width: unset !important;
        }
    }
`;
document.head.appendChild(styles);

// 🏢 4. INYECTAR ELEMENTOS EN EL DOM
const injectElements = () => {
    if (!document.body) return;

    const targetUrl = baseUrl ? `${baseUrl}/index.html` : '/index.html';

    const existingHeader = document.getElementById('ax-global-header');
    if (existingHeader) existingHeader.remove();

    const header = document.createElement('div');
    header.id = 'ax-global-header';
    header.innerHTML = `
        <div class="ax-header-left" id="axLogoHome">ANX</div>
        <div class="ax-header-right">
            <div class="ax-stats-row">
                <div class="ax-stat-box">
                    <span>VISTAS:</span>
                    <span id="global-total-visits" class="stat-value">--</span>
                </div>
                <div class="ax-stat-box online">
                    <span class="ax-stat-dot"></span>
                    <span>ONLINE:</span>
                    <span id="global-active-users" class="stat-value">--</span>
                </div>
            </div>
            <button id="axMenuBtn">&lt;</button>
        </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const existingDrawer = document.getElementById('ax-side-drawer');
    if (existingDrawer) existingDrawer.remove();

    const drawer = document.createElement('div');
    drawer.id = 'ax-side-drawer';
    drawer.innerHTML = `
        <div class="ax-menu-bar">
            <!-- SECCIÓN 4 -->
            <div class="ax-section-item" data-section="4">
                <div class="ax-section-header">
                    <span>SECCIÓN 4</span>
                    <span class="ax-section-arrow">&gt;</span>
                </div>
                <div class="ax-section-content">
                    <a href="${baseUrl}/estructure.html" class="ax-drawer-btn">Estructura AX</a>
                    <a href="https://github.com/ax-col/app" class="ax-drawer-btn">Repositorio APP</a>
                    <a href="https://github.com/ax-col/ax" target="_blank" class="ax-drawer-btn">Repositorio AX</a>
                </div>
            </div>

            <!-- SECCIÓN 3 -->
            <div class="ax-section-item" data-section="3">
                <div class="ax-section-header">
                    <span>SECCIÓN 3</span>
                    <span class="ax-section-arrow">&gt;</span>
                </div>
                <div class="ax-section-content">
                    <a href="${baseUrl}/TIME/index.html" class="ax-drawer-btn">Zonas Horarias</a>
                    <a href="${baseUrl}/FF/index.html" class="ax-drawer-btn">Countdown FF</a>
                    <a href="#" class="ax-drawer-btn">Pendiente</a>
                    <a href="#" class="ax-drawer-btn">Pendiente</a>
                </div>
            </div>

            <!-- SECCIÓN 2 -->
            <div class="ax-section-item" data-section="2">
                <div class="ax-section-header">
                    <span>SECCIÓN 2</span>
                    <span class="ax-section-arrow">&gt;</span>
                </div>
                <div class="ax-section-content">
                    <a href="${baseUrl}/Windows/index.html" class="ax-drawer-btn">Windows</a>
                    <a href="${baseUrl}/curts/index.html" class="ax-drawer-btn">Acortar Enlaces</a>
                    <a href="#" class="ax-drawer-btn">Pendiente</a>
                </div>
            </div>

            <!-- SECCIÓN 1 -->
            <div class="ax-section-item" data-section="1">
                <div class="ax-section-header">
                    <span>SECCIÓN 1</span>
                    <span class="ax-section-arrow">&gt;</span>
                </div>
                <div class="ax-section-content">
                    <a href="#" class="ax-drawer-btn">CPWEB</a>
                    <a href="${baseUrl}/YJPO/index.html" class="ax-drawer-btn">Pendiente</a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(drawer);

    if (!document.getElementById('ax-global-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'ax-global-canvas';
        document.body.appendChild(canvas);
        initCanvasAnimation(canvas);
    }

    document.getElementById('axLogoHome').onclick = () => { window.location.href = targetUrl; };
    
    const menuBtn = document.getElementById('axMenuBtn');
    const sideDrawer = document.getElementById('ax-side-drawer');

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        sideDrawer.classList.toggle('open');
    };

    const sectionItems = drawer.querySelectorAll('.ax-section-item');
    sectionItems.forEach(item => {
        const itemHeader = item.querySelector('.ax-section-header');
        itemHeader.onclick = (e) => {
            e.stopPropagation();
            const isOpen = item.classList.contains('open');
            sectionItems.forEach(s => s.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        };
    });

    document.addEventListener('click', (e) => {
        if (!sideDrawer.contains(e.target) && e.target !== menuBtn) {
            sideDrawer.classList.remove('open');
            sectionItems.forEach(s => s.classList.remove('open'));
        }
    });

    startFirebaseAnalytics();
};

// 🌌 5. ANIMACIÓN DE PARTÍCULAS CANVAS
const initCanvasAnimation = (canvas) => {
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let p = [];
    for(let i=0; i<120; i++) {
        p.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4
        });
    }

    function animate() {
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

if (document.readyState === "complete" || document.readyState === "interactive") {
    injectElements();
} else {
    window.addEventListener("DOMContentLoaded", injectElements);
    window.addEventListener("load", injectElements);
}

// 🔥 6. ANALÍTICA DE FIREBASE
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

    runTransaction(visitsRef, (currentValue) => { return (currentValue || 0) + 1; });
    
    onValue(visitsRef, (snapshot) => {
        const total = snapshot.val() || 0;
        const viewEl = document.getElementById('global-total-visits');
        if (viewEl) viewEl.textContent = Number(total).toLocaleString();
    });

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
