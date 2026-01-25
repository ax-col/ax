const CACHE_NAME = 'ax-offline-v8';

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
  // AÑADE TUS VÍDEOS AQUÍ (ejemplos)
  './videos/CN4.mp4',
  './videos/CN3.mp4',
  './videos/CN2.mp4',
  // ... añade todos los vídeos que uses
];


// ---------- INSTALL ----------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-cacheando recursos...');
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
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
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

  // 🎬 Videos (Network First)
  if (req.destination === 'video') {
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
