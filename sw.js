const CACHE_NAME = 'ax-pwa-v1';

// Archivos esenciales (precarga)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './styles.css',
  './script.js',
  './manifest.json',

  // Íconos PWA
  './png-principal/icon-192x192.png',
  './png-principal/icon-512x512.png'
];

// INSTALACIÓN
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVACIÓN → limpia cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH → online primero, fallback offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda en caché lo que sí cargó
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(res => res || caches.match('./offline.html'))
      )
  );
});