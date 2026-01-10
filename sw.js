const CACHE_NAME = 'ax-offline-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',

  './raspa/',
  './raspa/index.html',
  './viwnet/',
  './viwnet/index.html',
  './web-apks/',
  './web-apks/index.html',
  './CPWEB/',
  './CPWEB/index.html',
  './Windows/',
  './Windows/index.html',
  './FF/',
  './FF/index.html',

  './png-principal/icon-192x192.png',
  './png-principal/icon-512x512.png'
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
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Navegación HTML
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(req).then(res => {
        if (res) return res;

        const indexPath = url.pathname.endsWith('/')
          ? `${url.pathname}index.html`
          : `${url.pathname}/index.html`;

        return caches.match(indexPath) || caches.match('./index.html');
      })
    );
    return;
  }

  // Videos (cache dinámico)
  if (req.destination === 'video') {
    event.respondWith(
      caches.open('AX-NAVEGADOR').then(cache =>
        cache.match(req).then(res =>
          res ||
          fetch(req).then(net => {
            cache.put(req, net.clone());
            return net;
          })
        )
      )
    );
    return;
  }

  // Recursos normales
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});