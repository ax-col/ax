const CACHE_NAME = 'ax-offline-v1';

// RUTAS PRINCIPALES (raíz + carpetas)
const PRECACHE_URLS = [
  '/',               // raíz
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',

  // carpetas principales (index internos)
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

  '/ffbeta/',
  '/ffbeta/ffbeta.html',

  // iconos PWA
  '/png-principal/icon-192x192.png',
  '/png-principal/icon-512x512.png'
];

// INSTALACIÓN → descarga todo al agregar a pantalla principal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
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

// FETCH → navegación tipo dominio / subdominio
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // SOLO navegación HTML
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(req).then(response => {
        if (response) return response;

        // Si entra a /carpeta → /carpeta/index.html
        if (!url.pathname.endsWith('.html')) {
          const indexPath = url.pathname.endsWith('/')
            ? `${url.pathname}index.html`
            : `${url.pathname}/index.html`;

          return caches.match(indexPath)
            .then(res => res || caches.match('/index.html'));
        }

        return caches.match('/index.html');
      })
    );
    return;
  }

  // Recursos normales (CSS, JS, imágenes)
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});