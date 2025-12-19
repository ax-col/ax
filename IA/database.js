// database.js - VERSIÓN TEMPORAL SIMPLIFICADA
// Comentado por ahora debido a problemas con import


// Esta versión usa IndexedDB en lugar de SQL.js (más compatible)

class KnowledgeDB {
    constructor() {
        this.dbName = 'AIKnowledgeDB';
        this.storeName = 'knowledge';
    }
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

// Exportar si es módulo
if (typeof module !== 'undefined') {
    module.exports = KnowledgeDB;
}
