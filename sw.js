const CACHE_NAME = 'ax-cache-v3'; // Cambia el número cuando hagas un cambio grande
const assets = [
  './',
  './index.html',
  './styles.css?v=M4V1',
  './script.js?v=M4V1',
  './manifest.json',
  './version.json'
];

// Instalación: Guarda los archivos esenciales
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 AX Cache: Guardando archivos...');
      return cache.addAll(assets);
    })
  );
});

// Activación: Borra cachés viejos automáticamente
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ AX Cache: Borrando versión antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia: Primero busca en internet, si falla, usa el caché
// (Ideal para que los precios de Bitcoin y Oro siempre estén frescos)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});