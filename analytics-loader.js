// 📡 IMPORTACIONES ESTÁTICAS (Nativas para type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, push, onDisconnect, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 👑 1. INYECTAR ICONOS Y FAVICONS GLOBALES DE INMEDIATO
(function() {
    const faviconTags = [
        { tag: 'link', rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { tag: 'link', rel: 'icon', sizes: '192x192', href: '/png-principal/icon-192x192.png' },
        { tag: 'link', rel: 'icon', sizes: '512x512', href: '/png-principal/icon-512x512.png' },
        { tag: 'link', rel: 'apple-touch-icon', href: '/png-principal/icon-192x192.png' },
        { tag: 'link', rel: 'manifest', href: '/manifest.json' }
    ];

    faviconTags.forEach(item => {
        // Evitar duplicados si ya existen en el HTML
        if (!document.querySelector(`link[href="${item.href}"]`)) {
            const element = document.createElement(item.tag);
            Object.keys(item).forEach(key => {
                if (key !== 'tag') element.setAttribute(key, item[key]);
            });
            document.head.appendChild(element);
        }
    });
})();

// 🎨 2. INYECTAR ESTILOS DE LA BARRA SUPERIOR
const styles = document.createElement('style');
styles.innerHTML = `
    #ax-global-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 45px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 99999;
        box-sizing: border-box;
        font-family: 'Courier New', Courier, monospace;
        background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        pointer-events: none;
    }
    .ax-header-left {
        color: #ffffff !important;
        font-weight: bold !important;
        font-size: 18px !important;
        letter-spacing: 2px;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        pointer-events: auto;
    }
    .ax-header-right {
        display: flex;
        gap: 8px;
        pointer-events: auto;
    }
    .ax-stat-box {
        background: rgba(10, 10, 10, 0.75) !important;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 5px 10px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #a0a5c0;
    }
    .ax-stat-box .stat-value {
        color: #ffffff !important;
        font-weight: bold;
    }
    .ax-stat-box.online .stat-value {
        color: #00ffcc !important;
        text-shadow: 0 0 6px rgba(0, 255, 204, 0.6);
    }
    .ax-stat-box .stat-dot {
        width: 6px;
        height: 6px;
        background-color: #00ffcc;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 8px #00ffcc;
        animation: ax-pulse-dot 2s infinite;
    }
    @keyframes ax-pulse-dot {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
    }
`;
document.head.appendChild(styles);

// 🏢 3. FUNCIÓN PARA PINTAR LA ESTRUCTURA EN EL BODY
const injectHeader = () => {
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
        document.body.insertBefore(header, document.body.firstChild);
    }
};

if (document.body) {
    injectHeader();
} else {
    document.addEventListener("DOMContentLoaded", injectHeader);
}

// 🔥 4. ENTORNO CONFIGURACIÓN DE FIREBASE
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

runTransaction(visitsRef, (currentValue) => {
    return (currentValue || 0) + 1;
});

onValue(visitsRef, (snapshot) => {
    const total = snapshot.val() || 0;
    const viewEl = document.getElementById('global-total-visits');
    if (viewEl) viewEl.textContent = Number(total).toLocaleString();
});

const connectedRef = ref(db, '.info/connected');
onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
        const myUserRef = push(onlineRef);
        onDisconnect(myUserRef).remove();
        set(myUserRef, true);
    }
});

onValue(onlineRef, (snapshot) => {
    let totalActive = 0;
    if (snapshot.exists()) {
        snapshot.forEach(() => { totalActive++; });
    }
    const onlineEl = document.getElementById('global-active-users');
    if (onlineEl) onlineEl.textContent = totalActive;
});
