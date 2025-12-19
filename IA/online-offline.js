// online-offline.js - Detectar conexión
class ConnectionManager {
    constructor() {
        this.statusElement = document.getElementById('connection-status');
        this.isOnline = navigator.onLine;
        
        this.init();
    }
    
    init() {
        // Actualizar estado inicial
        this.updateStatus();
        
        // Escuchar cambios de conexión
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateStatus();
            this.showNotification('✅ Conectado a internet');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus();
            this.showNotification('⚠️ Modo offline activado');
        });
    }
    
    updateStatus() {
        if (!this.statusElement) return;
        
        if (this.isOnline) {
            this.statusElement.textContent = '🟢 Online';
            this.statusElement.style.color = '#10b981';
        } else {
            this.statusElement.textContent = '🔴 Offline';
            this.statusElement.style.color = '#ef4444';
        }
    }
    
    showNotification(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.isOnline ? '#10b981' : '#ef4444'};
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.connectionManager = new ConnectionManager();
});