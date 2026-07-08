// ==========================================
// 📊 ANALÍTICA Y BARRA SUPERIOR GLOBAL (AX)
// ==========================================
(function() {
    // 1. INYECTAR LOS ESTILOS CSS DIRECTAMENTE AL HEAD
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
            z-index: 9998;
            box-sizing: border-box;
            font-family: 'Courier New', Courier, monospace;
            background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0));
            pointer-events: none;
        }
        .ax-header-left {
            color: #ffffff;
            font-weight: bold;
            font-size: 18px;
            letter-spacing: 2px;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
            pointer-events: auto;
        }
        .ax-header-right {
            display: flex;
            gap: 8px;
            pointer-events: auto;
        }
        .ax-stat-box {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 6px 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #888da8;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .ax-stat-box .stat-value {
            color: #ffffff;
            font-weight: bold;
        }
        .ax-stat-box.online .stat-value {
            color: #00ffcc;
            text-shadow: 0 0 6px rgba(0, 255, 204, 0.4);
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
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }
    `;
    document.head.appendChild(styles);

    // 2. INYECTAR LA ESTRUCTURA HTML AL PRINCIPIO DEL BODY
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
        
        if (document.body) {
            document.body.insertBefore(header, document.body.firstChild);
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                document.body.insertBefore(header, document.body.firstChild);
            });
        }
    }

    // 3. ENRUTAMIENTO DINÁMICO DE FIREBASE CORE
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js").then((FirebaseApp) => {
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js").then((FirebaseDB) => {
            
            const firebaseConfig = {
                apiKey: "AIzaSyDI8C65d5SJa-DslwylhK58iWZcsf-3duE",
                authDomain: "open-817a9.firebaseapp.com",
                databaseURL: "https://open-817a9-default-rtdb.firebaseio.com",
                projectId: "open-817a9",
                storageBucket: "open-817a9.firebasestorage.app",
                messagingSenderId: "90367601661",
                appId: "1:90367601661:web:1f1fde2dbd29c8dd220794"
            };

            const app = FirebaseApp.initializeApp(firebaseConfig);
            const db = FirebaseDB.getDatabase(app);

            const visitsRef = FirebaseDB.ref(db, 'analytics/total_visits');
            const onlineRef = FirebaseDB.ref(db, 'analytics/online_users');

            // Transacción para contador global de vistas totales
            FirebaseDB.runTransaction(visitsRef, (currentValue) => {
                return (currentValue || 0) + 1;
            });

            // Pintar vistas totales actualizadas
            FirebaseDB.onValue(visitsRef, (snapshot) => {
                const total = snapshot.val() || 0;
                const viewEl = document.getElementById('global-total-visits');
                if (viewEl) viewEl.textContent = Number(total).toLocaleString();
            });

            // Lógica nativa de usuarios Online
            const connectedRef = FirebaseDB.ref(db, '.info/connected');
            FirebaseDB.onValue(connectedRef, (snap) => {
                if (snap.val() === true) {
                    const myUserRef = FirebaseDB.push(onlineRef);
                    FirebaseDB.onDisconnect(myUserRef).remove();
                    FirebaseDB.set(myUserRef, true);
                }
            });

            // Pintar usuarios activos en línea fluctuando en tiempo real
            FirebaseDB.onValue(onlineRef, (snapshot) => {
                let totalActive = 0;
                if (snapshot.exists()) {
                    snapshot.forEach(() => { totalActive++; });
                }
                const onlineEl = document.getElementById('global-active-users');
                if (onlineEl) onlineEl.textContent = totalActive;
            });

        });
    });
})();
