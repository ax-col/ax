/*
|======================================================|
| GESTOR DE VERSIONES - CONTROL DE CACHÉ GLOBAL       |
| Fuerza la actualización de todos los archivos       |
| cuando cambias la versión                           |
|======================================================|
*/

class VersionManager {
  constructor() {
    this.versionFile = 'version.json';
    this.localStorageKey = 'app-version-cache';
    this.checkInterval = 10000; // Verificar cada 10 segundos
    this.init();
  }

  async init() {
    console.log('🔄 Inicializando Gestor de Versiones...');
    
    // Cargar versión actual
    await this.loadCurrentVersion();
    
    // Verificar cambios periódicamente
    this.startVersionCheck();
    
    // Verificar al cambiar de pestaña
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('🔍 Verificando versión...');
        this.checkForUpdates();
      }
    });
  }

  async loadCurrentVersion() {
    try {
      // Forzar que no use caché
      const response = await fetch(this.versionFile, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudo cargar version.json');
        return;
      }

      const versionData = await response.json();
      const storedVersion = localStorage.getItem(this.localStorageKey);

      // Guardar versión actual
      localStorage.setItem(this.localStorageKey, JSON.stringify(versionData));

      if (storedVersion && storedVersion !== JSON.stringify(versionData)) {
        console.log('🔄 Nueva versión detectada - Forzando actualización...');
        this.forceUpdate(versionData);
      } else if (!storedVersion) {
        console.log('✅ Versión inicial cargada:', versionData.version);
      }

      return versionData;
    } catch (error) {
      console.error('❌ Error cargando version.json:', error);
    }
  }

  async checkForUpdates() {
    try {
      const response = await fetch(this.versionFile + '?t=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) return;

      const newVersion = await response.json();
      const storedVersion = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');

      if (newVersion.version !== storedVersion.version) {
        console.log('🚀 Actualización disponible:', newVersion.version);
        this.forceUpdate(newVersion);
      }
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
    }
  }

  forceUpdate(newVersion) {
    console.log('💥 Forzando actualización global...');
    
    // 1. Limpiar caché del navegador
    this.clearBrowserCache();
    
    // 2. Actualizar localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(newVersion));
    
    // 3. Recargar todos los recursos
    this.reloadAllResources(newVersion);
    
    // 4. Mostrar notificación al usuario
    this.showUpdateNotification(newVersion);
  }

  clearBrowserCache() {
    // Limpiar Service Worker si existe
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log('🗑️ Service Worker deregistrado');
        });
      });
    }

    // Limpiar IndexedDB
    if (window.indexedDB) {
      const dbs = ['cache', 'data', 'app-cache'];
      dbs.forEach(dbName => {
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onsuccess = () => console.log(`🗑️ IndexedDB "${dbName}" limpiado`);
      });
    }

    console.log('🗑️ Caché del navegador limpiado');
  }

  reloadAllResources(newVersion) {
    // Recargar archivos CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('fonts.googleapis')) {
        const newHref = this.addVersionParam(href, newVersion.version);
        link.setAttribute('href', newHref);
        console.log('🔄 CSS recargado:', newHref);
      }
    });

    // Recargar archivos JS
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('cdn') && !src.includes('google')) {
        const newSrc = this.addVersionParam(src, newVersion.version);
        script.setAttribute('src', newSrc);
        console.log('🔄 JS recargado:', newSrc);
      }
    });

    // Recargar la página después de 1 segundo
    setTimeout(() => {
      console.log('🔄 Recargando página...');
      location.reload(true); // true = fuerza recarga sin caché
    }, 1000);
  }

  addVersionParam(url, version) {
    // Remover parámetro de versión anterior si existe
    const cleanUrl = url.split('?')[0];
    
    // Agregar nueva versión
    return `${cleanUrl}?v=${version}`;
  }

  showUpdateNotification(newVersion) {
    // Crear notificación visual
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
      color: #000;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 14px;">
        ✅ Actualización disponible: v${newVersion.version}
      </div>
      <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
        Recargando en 3 segundos...
      </div>
    `;

    // Agregar animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  startVersionCheck() {
    // Verificar cada 30 segundos
    setInterval(() => {
      this.checkForUpdates();
    }, this.checkInterval);

    console.log(`⏱️ Verificación de versión cada ${this.checkInterval / 1000} segundos`);
  }

  // Método para obtener versión actual
  getCurrentVersion() {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  // Método para forzar actualización manual
  forceManualUpdate() {
    console.log('👤 Actualización manual solicitada');
    this.loadCurrentVersion();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.versionManager = new VersionManager();
  });
} else {
  window.versionManager = new VersionManager();
}

// Exponer método para actualización manual desde consola
window.forceUpdate = () => {
  console.log('🚀 Forzando actualización...');
  window.versionManager.forceManualUpdate();
};
