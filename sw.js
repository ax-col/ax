const CACHE_NAME = 'ax-offline-v26.3';  // Nueva versión URGENTE

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './play.html',
  './offline.html',
  './png-principal/icon-192x192.png',
  './png-principal/icon-512x512.png',
  './raspa/index.html',
  './viwnet/index.html',
  './web-apks/index.html',
  './CPWEB/index.html',
  './Windows/index.html',
  './FF/index.html',
  
  // VIDEOS QUE SÍ EXISTEN (8 videos):
  './AX-Files/AX-C1.mp4',
  './AX-Files/AX-C2.mp4',
  './AX-Files/AX-C3.mp4',
  './AX-Files/AX-C4.mp4',
  './AX-Files/AX-C5.mp4',
  './AX-Files/AX-C6.mp4',
  './AX-Files/AX-M1.mp4',
  './AX-Files/AX-M2.mp4'
  // NO incluir AX-M3, AX-M4, AX-M5, AX-U0 (no existen)
];

// ---------- INSTALL ----------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW v11] Pre-cacheando recursos con videos por orientación...');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME && k !== 'AX-NAVEGADOR') {
            console.log('[SW v11] Eliminando cache antiguo:', k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
  console.log('[SW v11] Activado y listo para todos dispositivos');
});

// ---------- FETCH ----------
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo manejar peticiones del mismo origen
  if (url.origin !== self.location.origin) return;

  // 🧭 Navegación (HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match(req).then(res => {
          if (res) return res;

          // Lógica de rutas para GitHub Pages (/ax/carpeta/ -> /ax/carpeta/index.html)
          let path = url.pathname;
          if (path.endsWith('/')) {
            path += 'index.html';
          } else if (!path.split('/').pop().includes('.')) {
            path += '/index.html';
          }

          return caches.match(path).then(r => r || caches.match('./offline.html') || caches.match('./index.html'));
        });
      })
    );
    return;
  }

  // 🎬 Videos (Network First) - Detección mejorada
  if (req.destination === 'video' || req.url.match(/\.(mp4|webm|ogg)$/i)) {
    event.respondWith(
      fetch(req).then(net => {
        const copy = net.clone();
        caches.open('AX-NAVEGADOR').then(cache => cache.put(req, copy));
        return net;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 📦 Recursos normales (Cache First)
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
