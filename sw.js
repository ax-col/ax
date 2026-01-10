const CACHE_NAME = 'ax-offline-v1';
const VIDEO_CACHE = 'ax-videos';

// ===================
// PRECACHE (instalación)
// ===================
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',

  // carpetas principales
  '/raspa/',
  '/raspa/index.html',

  '/viwnet/',
  '/viwnet/index.html',

  '/web-apks/',
  '/web-apks/index.html',

  '/CPWEB/',
  '/CPWEB/index.html',

  '/Windows/',
  '/Windows/index.html',

  '/FF/',
  '/FF/index.html',

  // iconos
  '/png-principal/icon-192x192.png',
  '/png-principal/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME && k !== VIDEO_CACHE) {
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ===================
// FETCH (todo en UNO)
// ===================
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🎥 VIDEOS → cache dinámico
  if (req.destination === 'video') {
    event.respondWith(
      caches.open(VIDEO_CACHE).then(cache =>
        cache.match(req).then(cached => {
          return (
            cached ||
            fetch(req).then(networkRes => {
              cache.put(req, networkRes.clone());
              return networkRes;
            })
          );
        })
      )
    );
    return;
  }

  // 🌐 NAVEGACIÓN HTML (raíz y carpetas)
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(req).then(res => {
        if (res) return res;

        if (!url.pathname.endsWith('.html')) {
          const indexPath = url.pathname.endsWith('/')
            ? `${url.pathname}index.html`
            : `${url.pathname}/index.html`;

          return caches.match(indexPath)
            .then(r => r || caches.match('/index.html'));
        }

        return caches.match('/index.html');
      })
    );
    return;
  }

  // 📦 RECURSOS NORMALES
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});