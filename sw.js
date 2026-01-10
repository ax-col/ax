const CACHE_NAME = 'ax-offline-v7'; // Incrementamos la versión para forzar actualización

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
            console.log('[SW] Borrando caché antiguo:', k);
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

  // 🧭 Navegación (HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        // Si falla la red (offline), buscamos en el caché
        return caches.match(req).then(res => {
          if (res) return res;

          // Lógica para manejar rutas de carpetas /ax/raspa/ -> /ax/raspa/index.html
          let path = url.pathname;
          if (path.endsWith('/')) {
            path += 'index.html';
          } else if (!path.split('/').pop().includes('.')) {
            path += '/index.html';
          }

          return caches.match(path).then(r => r || caches.match('./index.html'));
        });
      })
    );
    return;
  }

  // 🎬 Videos (cache dinámico - Network First para evitar problemas de rango)
  if (req.destination === 'video') {
    event.respondWith(
      fetch(req).then(net => {
        const copy = net.clone();
        caches.open('AX-NAVEGADOR').then(cache => cache.put(req, copy));
        return net;
      }).catch(() => {
        return caches.match(req);
      })
    );
    return;
  }

  // 📦 Recursos normales (Cache First, fallback to Network)
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).then(net => {
        // Opcional: podrías guardar en caché dinámico aquí también
        return net;
      }).catch(err => {
        console.error('[SW] Error en fetch:', req.url, err);
        // Podrías devolver una imagen offline genérica aquí si fuera necesario
      });
    })
  );
});