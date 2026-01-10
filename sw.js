const CACHE_NAME = 'ax-offline-v4';

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './play.html',

  // iconos
  './png-principal/icon-192x192.png',
  './png-principal/icon-512x512.png',

  // carpetas (index internos)
  './raspa/index.html',
  './viwnet/index.html',
  './web-apks/index.html',
  './CPWEB/index.html',
  './Windows/index.html',
  './FF/index.html'
];

// ---------- INSTALL ----------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    )
  );
  self.clients.claim();
});

// ---------- FETCH ----------
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🧭 Navegación (APP, raíz, carpetas, con parámetros)
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then(res => res || fetch(req))
    );
    return;
  }

  // 🎬 Videos (cache dinámico)
  if (req.destination === 'video') {
    event.respondWith(
      caches.open('AX-NAVEGADOR').then(cache =>
        cache.match(req).then(res => {
          return (
            res ||
            fetch(req).then(net => {
              cache.put(req, net.clone());
              return net;
            })
          );
        })
      )
    );
    return;
  }

  // 📦 Recursos normales
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});