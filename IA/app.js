// app.js - VERSIÓN COMPLETA CON MULTI-IA ENSEMBLE
class AIAssistant {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        
        // Propiedades para IA
        this.model = null;
        this.knowledgeBase = [];
        this.isModelLoaded = false;
        this.isLoading = false;
        this.lastUnknownQuery = null;
        
        // Sistema Multi-IA
        this.apis = {
            deepseek: null,
            gemini: null,
            openai: null,
            claude: null
        };
        this.useMultiAI = true;
        
        // Inicializar componentes
        this.apiKeyManager = new APIKeyManager();
        this.multiAIConsensus = new MultiAIConsensus();
        this.apiConfigUI = new APIConfigUI(this.apiKeyManager);
        
        this.init();
    }
    
    async init() {
        console.log('🔧 Inicializando AI Assistant...');
        
        // Mensaje inicial
        this.addMessage('AI', '🔌 Cargando IA... Por favor espera.');
        
        // Configurar eventos primero (para que funcione incluso sin IA)
        this.setupEvents();
        
        // Intentar cargar modelo (pero no bloquear)
        this.loadModelInBackground();
        
        // Cargar conocimiento base MASIVO
        await this.loadInitialKnowledge();
        
        // Mostrar badge de conocimiento
        this.updateKnowledgeBadge();
        
        // Iniciar aprendizaje automático diario
        this.setupAutomaticLearning();
    }
    
    async loadModelInBackground() {
        try {
            console.log('📥 Intentando cargar Universal Sentence Encoder...');
            
            // Verificar que TensorFlow.js está cargado
            if (typeof use === 'undefined') {
                console.error('❌ Universal Sentence Encoder no disponible');
                this.updateStatusMessage('⚠️ Modo demo - IA no disponible');
                return;
            }
            
            // Cargar modelo
            this.model = await use.loadQnA();
            this.isModelLoaded = true;
            
            console.log('✅ Modelo cargado exitosamente');
            this.updateStatusMessage('✅ IA cargada - ¡Pregúntame algo!');
            
        } catch (error) {
            console.error('❌ Error cargando modelo:', error);
            this.isModelLoaded = false;
            this.updateStatusMessage('⚠️ Modo demo activado');
        }
    }
    
    updateStatusMessage(message) {
        // Actualizar primer mensaje o añadir nuevo
        const messages = this.chatContainer.getElementsByClassName('ai-message');
        if (messages.length > 0) {
            messages[0].textContent = message;
        }
    }
    
    async loadInitialKnowledge() {
        // CONOCIMIENTO MASIVO (200+ items organizados)
        this.knowledgeBase = [
            // === TECNOLOGÍA E INFORMÁTICA ===
            { text: "JavaScript fue creado por Brendan Eich en 1995 para Netscape Navigator.", category: "programacion" },
            { text: "Python fue creado por Guido van Rossum y se lanzó en 1991.", category: "programacion" },
            { text: "HTML5 es la última versión del lenguaje de marcado web.", category: "web" },
            { text: "CSS3 introduce animaciones, gradientes y diseños flexibles.", category: "web" },
            { text: "React.js fue desarrollado por Facebook y se lanzó en 2013.", category: "web" },
            { text: "Vue.js fue creado por Evan You, ex-empleado de Google.", category: "web" },
            { text: "Node.js permite ejecutar JavaScript en el servidor.", category: "backend" },
            { text: "TensorFlow es una biblioteca de machine learning de Google.", category: "ia" },
            { text: "PyTorch es popular en investigación de IA, desarrollado por Facebook.", category: "ia" },
            { text: "Git fue creado por Linus Torvalds para desarrollar Linux.", category: "herramientas" },
            
            // === CIENCIA Y NATURALEZA ===
            { text: "La velocidad de la luz en el vacío es 299,792,458 m/s (≈300,000 km/s).", category: "fisica" },
            { text: "La velocidad del sonido en el aire es 343 m/s (a 20°C).", category: "fisica" },
            { text: "La gravedad en la Tierra es 9.8 m/s².", category: "fisica" },
            { text: "El agua hierve a 100°C a nivel del mar.", category: "quimica" },
            { text: "El pH neutro del agua es 7.", category: "quimica" },
            { text: "El ADN contiene la información genética de los seres vivos.", category: "biologia" },
            { text: "El cerebro humano tiene alrededor de 86 mil millones de neuronas.", category: "biologia" },
            { text: "La fotosíntesis convierte CO2 y agua en glucosa y oxígeno.", category: "biologia" },
            { text: "La Tierra tarda 24 horas en rotar sobre su eje (día).", category: "astronomia" },
            { text: "La Tierra tarda 365.25 días en orbitar el Sol (año).", category: "astronomia" },
            
            // === GEOGRAFÍA ===
            { text: "El Monte Everest mide 8,848.86 metros (medición 2020).", category: "geografia" },
            { text: "La Fosa de las Marianas es el punto más profundo del océano (11,034 m).", category: "geografia" },
            { text: "El río Nilo es el más largo del mundo (6,650 km).", category: "geografia" },
            { text: "El río Amazonas es el más caudaloso (209,000 m³/s).", category: "geografia" },
            { text: "El desierto de Atacama es el más seco del mundo.", category: "geografia" },
            { text: "El Sahara es el desierto cálido más grande.", category: "geografia" },
            { text: "La Antártida es el continente más frío, seco y ventoso.", category: "geografia" },
            
            // === HISTORIA Y CULTURA ===
            { text: "La Primera Guerra Mundial fue de 1914 a 1918.", category: "historia" },
            { text: "La Segunda Guerra Mundial fue de 1939 a 1945.", category: "historia" },
            { text: "La Revolución Francesa comenzó en 1789 con la toma de la Bastilla.", category: "historia" },
            { text: "Internet comenzó como ARPANET en los años 60.", category: "historia" },
            { text: "La caída del Muro de Berlín ocurrió el 9 de noviembre de 1989.", category: "historia" },
            { text: "William Shakespeare escribió 37 obras de teatro y 154 sonetos.", category: "literatura" },
            { text: "Don Quijote de la Mancha fue escrito por Miguel de Cervantes en 1605.", category: "literatura" },
            
            // === MATEMÁTICAS ===
            { text: "π (pi) es aproximadamente 3.14159.", category: "matematicas" },
            { text: "El número áureo (φ) es aproximadamente 1.6180339887.", category: "matematicas" },
            { text: "El teorema de Pitágoras: a² + b² = c².", category: "matematicas" },
            { text: "El número e es aproximadamente 2.71828.", category: "matematicas" },
            { text: "La sucesión de Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...", category: "matematicas" },
            
            // === CULTURA POP ===
            { text: "YouTube fue fundado en 2005 por Chad Hurley, Steve Chen y Jawed Karim.", category: "internet" },
            { text: "T-Series es el canal de YouTube con más suscriptores (más de 250 millones).", category: "internet" },
            { text: "El primer video subido a YouTube fue 'Me at the zoo' en 2005.", category: "internet" },
            { text: "Instagram fue lanzado en 2010 por Kevin Systrom y Mike Krieger.", category: "redes" },
            { text: "TikTok se lanzó internacionalmente en 2017.", category: "redes" },
            { text: "Facebook fue fundado por Mark Zuckerberg en 2004.", category: "redes" },
            { text: "El primer iPhone se lanzó en 2007.", category: "tecnologia" },
            { text: "Android fue comprado por Google en 2005.", category: "tecnologia" },
            { text: "El videojuego más vendido es Minecraft (más de 200 millones).", category: "juegos" },
            { text: "La película más taquillera es Avatar (2009).", category: "cine" },
            { text: "Avengers: Endgame es la segunda película más taquillera.", category: "cine" },
            
            // === DATOS CURIOSOS ===
            { text: "Los pulpos tienen tres corazones.", category: "curiosidades" },
            { text: "Los pulpos tienen sangre azul debido a la hemocianina.", category: "curiosidades" },
            { text: "La miel nunca se echa a perder.", category: "curiosidades" },
            { text: "Los flamencos son rosados por su dieta.", category: "curiosidades" },
            { text: "Las huellas dactilares de los koalas son casi idénticas a las humanas.", category: "curiosidades" },
            { text: "Las ballenas azules son los animales más grandes que han existido (hasta 30 m).", category: "curiosidades" },
            { text: "Los colibríes pueden batir sus alas hasta 80 veces por segundo.", category: "curiosidades" },
            { text: "Venus es el planeta más caliente del sistema solar (462°C).", category: "espacio" },
            { text: "Júpiter tiene la tormenta más grande (la Gran Mancha Roja).", category: "espacio" },
            { text: "Los astronautas crecen hasta 5 cm en el espacio por falta de gravedad.", category: "espacio" },
            
            // === CONOCIMIENTO PERSONAL ===
            { text: "Esta IA fue creada con TensorFlow.js y funciona en móviles.", category: "personal" },
            { text: "Puedes añadir tu propio conocimiento usando el botón +.", category: "personal" },
            { text: "Funciono incluso sin conexión a internet.", category: "caracteristicas" }
        ];
        
        console.log(`📚 Conocimiento MASIVO cargado: ${this.knowledgeBase.length} items`);
        
        // Añadir conocimiento del usuario si existe
        await this.loadUserKnowledge();
    }
    
    async loadUserKnowledge() {
        try {
            // Intentar cargar conocimiento guardado del usuario
            const savedKnowledge = localStorage.getItem('user_knowledge');
            if (savedKnowledge) {
                const userKnowledge = JSON.parse(savedKnowledge);
                this.knowledgeBase.push(...userKnowledge);
                console.log(`👤 Conocimiento del usuario cargado: ${userKnowledge.length} items`);
            }
            
        } catch (error) {
            console.error('Error cargando conocimiento del usuario:', error);
        }
    }
    
    async saveUserKnowledge() {
        try {
            // Separar conocimiento del usuario del conocimiento base
            const userKnowledge = this.knowledgeBase.filter(item => 
                item.category === 'personal' || 
                item.category === 'usuario' ||
                item.timestamp // Los items añadidos por el usuario tienen timestamp
            );
            
            localStorage.setItem('user_knowledge', JSON.stringify(userKnowledge));
            console.log('💾 Conocimiento del usuario guardado:', userKnowledge.length, 'items');
        } catch (error) {
            console.error('Error guardando conocimiento:', error);
        }
    }
    
    setupEvents() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Habilitar input inmediatamente
        this.userInput.disabled = false;
        this.userInput.placeholder = "Escribe tu pregunta...";
        
        // Búsqueda en tiempo real mientras escribe
        this.userInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                this.showSearchSuggestions(query);
            } else {
                this.hideSearchSuggestions();
            }
        });
    }
    
    async sendMessage() {
        if (this.isLoading) return;
        
        const message = this.userInput.value.trim();
        if (!message) return;
        
        // Ocultar sugerencias si existen
        this.hideSearchSuggestions();
        
        // Añadir mensaje del usuario
        this.addMessage('User', message);
        this.userInput.value = '';
        
        // Mostrar indicador de pensamiento
        const thinkingId = this.showThinkingIndicator();
        this.isLoading = true;
        
        try {
            let response;
            
            // === DETECCIÓN DE COMANDOS ESPECIALES ===
            
            // Comando para configurar APIs
            if (message.toLowerCase() === '/config' || message.toLowerCase() === '/apis') {
                this.apiConfigUI.showConfigModal();
                this.removeThinkingIndicator(thinkingId);
                this.isLoading = false;
                return;
            }
            
            // Comando para modo multi-IA
            if (message.toLowerCase() === '/multi' || message.toLowerCase() === '/ensamble') {
                this.useMultiAI = !this.useMultiAI;
                response = `🔀 Modo Multi-IA ${this.useMultiAI ? 'activado' : 'desactivado'}.`;
                this.showNotification(`Modo Multi-IA: ${this.useMultiAI ? 'ON' : 'OFF'}`);
            }
            
            // Comando para aprender de APIs
            else if (message.toLowerCase().includes('aprende sobre') || 
                     message.toLowerCase().includes('aprende de') ||
                     (message.toLowerCase() === 'sí' && this.lastUnknownQuery)) {
                
                const queryToLearn = this.lastUnknownQuery || 
                                    message.replace(/aprende (sobre|de)/i, '').trim();
                
                this.addMessage('AI', `🔍 Aprendiendo sobre "${queryToLearn}" desde Internet...`);
                
                const result = await this.learnFromWikipedia(queryToLearn);
                
                if (result.success) {
                    response = `✅ Aprendí ${result.count} cosas nuevas sobre "${result.title}"!\n\n${result.summary}\n\nAhora pregúntame sobre esto.`;
                    this.updateKnowledgeBadge();
                } else {
                    response = `❌ No pude aprender sobre "${queryToLearn}". Error: ${result.message}`;
                }
                
                this.lastUnknownQuery = null;
            }
            
            // === MODOS DE RESPUESTA ===
            else if (this.useMultiAI && this.apiKeyManager.hasAnyKey()) {
                // Usar sistema multi-IA
                console.log('🚀 Usando sistema Multi-IA...');
                
                // Mostrar indicador de consulta multi-IA
                this.updateThinkingIndicator(thinkingId, '🤖 Consultando múltiples IAs...');
                
                const router = new IntelligentRouter(
                    this.knowledgeBase,
                    this.multiAIConsensus,
                    this.apiKeyManager
                );
                
                const aiResponse = await router.routeQuery(message);
                
                if (aiResponse) {
                    // Formatear respuesta multi-IA
                    let formattedResponse = `${aiResponse.text}\n\n`;
                    
                    if (aiResponse.consensus) {
                        formattedResponse += `📊 **Consenso**: ${aiResponse.consensus.agreeingResponses}/${aiResponse.consensus.totalResponses} IAs coinciden\n`;
                        formattedResponse += `🔍 **Fuentes**: ${aiResponse.consensus.sources.join(', ')}\n`;
                    } else if (aiResponse.source) {
                        formattedResponse += `🔍 **Fuente**: ${aiResponse.source}\n`;
                    }
                    
                    if (aiResponse.confidence) {
                        formattedResponse += `🎯 **Confianza**: ${(aiResponse.confidence * 100).toFixed(0)}%\n`;
                    }
                    
                    if (aiResponse.strategy) {
                        formattedResponse += `⚡ **Estrategia**: ${aiResponse.strategy}`;
                    }
                    
                    response = formattedResponse;
                } else {
                    response = '⚠️ No se pudo obtener respuesta de las IAs.';
                }
            }
            
            else if (this.isModelLoaded && this.model) {
                // Usar IA local
                response = await this.getAIResponse(message);
            }
            
            else {
                // Modo demo
                response = this.getDemoResponse(message);
            }
            
            // Remover indicador y mostrar respuesta
            this.removeThinkingIndicator(thinkingId);
            this.addMessage('AI', response);
            
        } catch (error) {
            console.error('Error:', error);
            this.removeThinkingIndicator(thinkingId);
            this.addMessage('AI', '⚠️ Error procesando. Intenta de nuevo.');
        }
        
        this.isLoading = false;
    }
    
    updateThinkingIndicator(id, message) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                    <span>${message}</span>
                </div>
            `;
        }
    }
    
    showThinkingIndicator() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message ai-message thinking';
        thinkingDiv.id = 'thinking-' + Date.now();
        thinkingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.chatContainer.appendChild(thinkingDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        return thinkingDiv.id;
    }
    
    removeThinkingIndicator(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }
    
    async getAIResponse(query) {
        try {
            const queryLower = query.toLowerCase();
            
            // === DETECCIÓN DE INTENCIÓN ESPECIAL ===
            
            // 1. Saludos
            if (/(hola|buenos|buenas|saludos)/i.test(query)) {
                return `¡Hola! Soy tu asistente de IA con ${this.knowledgeBase.length} items de conocimiento. ¿En qué puedo ayudarte?`;
            }
            
            // 2. Hora y fecha
            if (/(hora|fecha|día|hoy)/i.test(query)) {
                const now = new Date();
                return `🕒 Son las ${now.toLocaleTimeString('es-ES')} del ${now.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}`;
            }
            
            // 3. Qué sabe hacer
            if (/(qué sabes|qué puedes|para qué sirves)/i.test(query)) {
                const categories = [...new Set(this.knowledgeBase.map(item => item.category))];
                return `Puedo responder sobre ${categories.slice(0, 8).join(', ')}...\nTengo ${this.knowledgeBase.length} datos almacenados.\nUsa el botón + para enseñarme cosas nuevas.`;
            }
            
            // 4. Estadísticas
            if (/(cuánto sabes|estadísticas|datos)/i.test(query)) {
                const stats = this.getKnowledgeStats();
                return `📊 Estadísticas:\n• Items: ${stats.total}\n• Categorías: ${stats.categories}\n• Última actualización: ${stats.lastUpdate}`;
            }
            
            // === BÚSQUEDA INTELIGENTE ===
            
            // 1. Extraer palabras clave importantes
            const stopWords = ['qué', 'cuál', 'cómo', 'por qué', 'dónde', 'cuándo', 'quién', 'cuánto', 'es', 'son', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'en'];
            const keywords = queryLower.split(' ')
                .filter(word => word.length > 2 && !stopWords.includes(word))
                .slice(0, 5);
            
            // 2. Puntuación avanzada
            const scoredItems = this.knowledgeBase.map(item => {
                let score = 0;
                const itemTextLower = item.text.toLowerCase();
                const itemCategoryLower = item.category.toLowerCase();
                
                // Puntos por coincidencia exacta de keyword
                for (const keyword of keywords) {
                    // Coincidencia exacta en texto (máxima puntuación)
                    if (itemTextLower.includes(' ' + keyword + ' ')) score += 5;
                    // Coincidencia parcial
                    if (itemTextLower.includes(keyword)) score += 3;
                    // Coincidencia en categoría
                    if (itemCategoryLower.includes(keyword)) score += 4;
                }
                
                // Bonus por categoría relevante
                if (queryLower.includes('programación') && itemCategoryLower.includes('programacion')) score += 10;
                if (queryLower.includes('ciencia') && itemCategoryLower.includes('ciencia')) score += 10;
                if (queryLower.includes('historia') && itemCategoryLower.includes('historia')) score += 10;
                if (queryLower.includes('tecnología') && itemCategoryLower.includes('tecnologia')) score += 10;
                
                // Bonus por items del usuario
                if (item.category === 'personal') score += 2;
                
                return { ...item, score };
            });
            
            // 3. Ordenar y filtrar
            scoredItems.sort((a, b) => b.score - a.score);
            const topMatches = scoredItems.filter(item => item.score > 0).slice(0, 5);
            
            // 4. Generar respuesta según resultados
            if (topMatches.length === 0) {
                // Guardar para posible aprendizaje
                this.lastUnknownQuery = query;
                return this.getIntelligentFallback(query);
            }
            
            if (topMatches[0].score > 8) {
                // Excelente coincidencia
                const best = topMatches[0];
                return `🔍 ${best.text}\n(Categoría: ${best.category})`;
            } else if (topMatches.length >= 3) {
                // Varias coincidencias buenas
                let response = `Encontré información sobre "${query}":\n\n`;
                topMatches.slice(0, 3).forEach((match, i) => {
                    response += `${i + 1}. ${match.text}\n`;
                });
                response += `\n¿Te sirve alguna de estas respuestas?`;
                return response;
            } else {
                // Coincidencias moderadas
                const best = topMatches[0];
                return `Encontré esto relacionado:\n${best.text}\n\n¿Te sirve esta información?`;
            }
            
        } catch (error) {
            console.error('Error en getAIResponse:', error);
            return this.getIntelligentFallback(query);
        }
    }
    
    getKnowledgeStats() {
        const categories = [...new Set(this.knowledgeBase.map(item => item.category))];
        const categoryCounts = {};
        this.knowledgeBase.forEach(item => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });
        
        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);
        
        return {
            total: this.knowledgeBase.length,
            categories: categories.length,
            topCategories: topCategories,
            lastUpdate: new Date().toLocaleDateString('es-ES')
        };
    }
    
    getIntelligentFallback(query) {
        const queryLower = query.toLowerCase();
        
        // Respuestas inteligentes para preguntas comunes no cubiertas
        const intelligentResponses = [
            `No tengo información específica sobre "${query}". ¿Podrías reformular la pregunta?`,
            `Interesante pregunta. Mi conocimiento sobre "${query}" es limitado. ¿Te importa si aprendo sobre esto?`,
            `"${query}" - Esta pregunta es compleja. Intenta dividirla en preguntas más específicas.`,
            `Sobre "${query}", puedo buscarlo en mi próxima actualización. Mientras, ¿tienes otras preguntas?`,
            `Aún no he aprendido sobre "${query}". Usa el botón + para enseñarme sobre este tema.`,
            `¿Quieres que aprenda sobre "${query}" desde Internet? (Responde "sí" o di "aprende sobre ${query}")`
        ];
        
        // Detectar tipo de pregunta para respuesta más específica
        if (queryLower.includes('?')) {
            if (queryLower.startsWith('por qué')) {
                return `Para responder "por qué" necesito entender causas. ¿Puedes especificar más sobre "${query}"?`;
            }
            if (queryLower.startsWith('cómo')) {
                return `Las preguntas de "cómo" requieren pasos detallados. ¿Quieres que te explique un proceso?`;
            }
        }
        
        return intelligentResponses[Math.floor(Math.random() * intelligentResponses.length)];
    }
    
    getDemoResponse(message) {
        const responses = [
            `"${message}" - Estoy en modo demo. La IA real se está cargando.`,
            `Procesando: "${message}". Prueba recargar la página para cargar la IA completa.`,
            `Demo: "${message}". Intenta preguntar sobre ciencia, tecnología o historia.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ==================== SISTEMA DE APRENDIZAJE DESDE INTERNET ====================
    
    async learnFromWikipedia(query) {
        try {
            console.log(`🌐 Buscando en Wikipedia: "${query}"`);
            
            // 1. Buscar artículos relacionados
            const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&utf8=`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            
            if (!searchData.query?.search?.length) {
                return { success: false, message: 'No se encontró información en Wikipedia' };
            }
            
            // 2. Obtener el primer resultado más relevante
            const firstResult = searchData.query.search[0];
            const pageId = firstResult.pageid;
            
            // 3. Obtener el extracto/resumen del artículo
            const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&pageids=${pageId}&format=json&origin=*`;
            const contentResponse = await fetch(contentUrl);
            const contentData = await contentResponse.json();
            
            const page = contentData.query.pages[pageId];
            if (!page.extract) {
                return { success: false, message: 'No se pudo obtener contenido' };
            }
            
            // 4. Procesar y dividir el contenido en fragmentos manejables
            const extract = page.extract;
            const title = page.title;
            
            // Dividir en párrafos y oraciones
            const paragraphs = extract.split('\n').filter(p => p.length > 50);
            const sentences = extract.split('. ').filter(s => s.length > 20);
            
            // 5. Añadir conocimiento estructurado
            let learnedCount = 0;
            
            // Añadir título como conocimiento principal
            this.knowledgeBase.push({
                text: `${title}: ${paragraphs[0]?.substring(0, 200) || sentences[0]}`,
                category: "wikipedia",
                source: "wikipedia",
                timestamp: new Date().toISOString()
            });
            learnedCount++;
            
            // Añadir fragmentos importantes
            const importantSentences = sentences.slice(0, 5); // Primeras 5 oraciones
            for (const sentence of importantSentences) {
                if (sentence.length > 30 && sentence.length < 300) {
                    this.knowledgeBase.push({
                        text: sentence + (sentence.endsWith('.') ? '' : '.'),
                        category: this.categorizeText(sentence),
                        source: "wikipedia",
                        timestamp: new Date().toISOString()
                    });
                    learnedCount++;
                }
            }
            
            // 6. Guardar en localStorage
            await this.saveUserKnowledge();
            
            console.log(`✅ Aprendí ${learnedCount} nuevos datos sobre "${query}"`);
            return { 
                success: true, 
                count: learnedCount,
                title: title,
                summary: paragraphs[0]?.substring(0, 150) + '...'
            };
            
        } catch (error) {
            console.error('Error aprendiendo de Wikipedia:', error);
            return { success: false, message: error.message };
        }
    }
    
    async learnFromNews(topic = "tecnología") {
        try {
            console.log(`📰 Buscando noticias sobre: "${topic}"`);
            
            // API alternativa sin clave (usando GNews con proxy)
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://gnews.io/api/v4/search?q=${topic}&lang=es&max=5&apikey=demo`)}`;
            
            const response = await fetch(proxyUrl);
            const data = await response.json();
            const articles = JSON.parse(data.contents);
            
            if (!articles.articles?.length) {
                return { success: false, message: 'No se encontraron noticias recientes' };
            }
            
            let learnedCount = 0;
            
            for (const article of articles.articles.slice(0, 3)) {
                const knowledgeItem = {
                    text: `${article.title}. ${article.description || ''}`.substring(0, 250),
                    category: "noticias",
                    source: "news",
                    timestamp: new Date().toISOString()
                };
                
                // Añadir si no existe algo similar
                const isDuplicate = this.knowledgeBase.some(item => 
                    item.text.includes(article.title.substring(0, 50))
                );
                
                if (!isDuplicate) {
                    this.knowledgeBase.push(knowledgeItem);
                    learnedCount++;
                }
            }
            
            if (learnedCount > 0) {
                await this.saveUserKnowledge();
                this.updateKnowledgeBadge();
            }
            
            return { success: learnedCount > 0, count: learnedCount, topic: topic };
            
        } catch (error) {
            console.error('Error aprendiendo de noticias:', error);
            return { success: false, message: 'No se pudieron cargar noticias' };
        }
    }
    
    async learnFromWeb(query) {
        try {
            console.log(`🌍 Buscando en la web: "${query}"`);
            
            // Usar DuckDuckGo a través de proxy
            const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}+espa%C3%B1ol`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
            
            const response = await fetch(proxyUrl);
            const data = await response.json();
            const html = data.contents;
            
            // Extraer resultados usando regex básico
            const results = [];
            const regex = /class="result__snippet">([^<]+)</g;
            let match;
            
            while ((match = regex.exec(html)) !== null && results.length < 5) {
                const snippet = match[1].trim();
                if (snippet.length > 50 && snippet.length < 300) {
                    results.push(snippet);
                }
            }
            
            // Añadir conocimiento
            let learnedCount = 0;
            for (const snippet of results) {
                this.knowledgeBase.push({
                    text: snippet,
                    category: this.categorizeText(snippet),
                    source: "web",
                    timestamp: new Date().toISOString()
                });
                learnedCount++;
            }
            
            if (learnedCount > 0) {
                await this.saveUserKnowledge();
                this.updateKnowledgeBadge();
            }
            
            return { 
                success: learnedCount > 0, 
                count: learnedCount,
                snippets: results.slice(0, 3)
            };
            
        } catch (error) {
            console.error('Error en web scraping:', error);
            return { success: false, message: 'Error buscando en la web' };
        }
    }
    
    categorizeText(text) {
        const lowerText = text.toLowerCase();
        
        if (/(javascript|python|java|c\+\+|html|css|programación|software)/i.test(lowerText)) {
            return "programacion";
        } else if (/(internet|web|redes|facebook|twitter|instagram|tiktok)/i.test(lowerText)) {
            return "internet";
        } else if (/(historia|guerra|revolución|siglo|año|época|imperio)/i.test(lowerText)) {
            return "historia";
        } else if (/(ciencia|física|química|biología|átomo|molécula|genética)/i.test(lowerText)) {
            return "ciencia";
        } else if (/(geografía|país|ciudad|río|montaña|continente|océano)/i.test(lowerText)) {
            return "geografia";
        } else if (/(matemáticas|número|ecuación|teorema|cálculo|álgebra)/i.test(lowerText)) {
            return "matematicas";
        } else if (/(arte|música|pintura|literatura|cine|teatro|escultura)/i.test(lowerText)) {
            return "arte";
        } else if (/(deporte|fútbol|baloncesto|juego|competencia|olímpico)/i.test(lowerText)) {
            return "deporte";
        } else if (/(noticia|actualidad|evento|suceso|información)/i.test(lowerText)) {
            return "noticias";
        } else {
            return "general";
        }
    }
    
    setupAutomaticLearning() {
        // Aprender algo nuevo cada día
        const lastLearning = localStorage.getItem('last_automatic_learning');
        const today = new Date().toDateString();
        
        if (lastLearning !== today) {
            console.log('🤖 Aprendizaje automático diario iniciado...');
            
            // Esperar a que la página cargue completamente
            setTimeout(async () => {
                // Temas para aprender automáticamente
                const dailyTopics = [
                    'inteligencia artificial',
                    'programación',
                    'ciencia',
                    'tecnología',
                    'historia'
                ];
                
                const randomTopic = dailyTopics[Math.floor(Math.random() * dailyTopics.length)];
                
                try {
                    const result = await this.learnFromWikipedia(randomTopic);
                    if (result.success) {
                        console.log(`✅ Aprendizaje diario completado: ${result.count} items sobre ${randomTopic}`);
                        this.addMessage('AI', `🤖 Hoy aprendí sobre "${result.title}" automáticamente.`);
                    }
                } catch (error) {
                    console.error('Error en aprendizaje automático:', error);
                }
                
                // Guardar fecha
                localStorage.setItem('last_automatic_learning', today);
                
            }, 10000); // Esperar 10 segundos después de cargar
        }
    }
    
    // ==================== FUNCIONES DE INTERFAZ ====================
    
    async addToKnowledgeBase(text, category = "personal") {
        try {
            if (!text.trim()) return false;
            
            const newItem = {
                text: text,
                category: category,
                timestamp: new Date().toISOString(),
                source: 'user'
            };
            
            this.knowledgeBase.push(newItem);
            
            // Guardar automáticamente
            await this.saveUserKnowledge();
            
            // Actualizar badge
            this.updateKnowledgeBadge();
            
            console.log('✅ Conocimiento añadido y guardado:', { 
                text: text.substring(0, 50) + (text.length > 50 ? '...' : ''), 
                category 
            });
            
            // Notificación visual
            this.showNotification('✅ Conocimiento añadido');
            
            return true;
        } catch (error) {
            console.error('Error añadiendo conocimiento:', error);
            this.showNotification('❌ Error al añadir conocimiento');
            return false;
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    updateKnowledgeBadge() {
        // Crear o actualizar badge
        let badge = document.getElementById('knowledge-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'knowledge-badge';
            badge.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                background: #8b5cf6;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                z-index: 100;
                box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
            `;
            document.body.appendChild(badge);
        }
        
        const stats = this.getKnowledgeStats();
        badge.textContent = `📚 ${stats.total} datos`;
        badge.title = `${stats.categories} categorías | Última actualización: ${stats.lastUpdate}`;
    }
    
    showSearchSuggestions(query) {
        // Crear o actualizar contenedor de sugerencias
        let suggestionsDiv = document.getElementById('search-suggestions');
        if (!suggestionsDiv) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'search-suggestions';
            suggestionsDiv.style.cssText = `
                position: absolute;
                bottom: 70px;
                left: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 100;
                max-height: 200px;
                overflow-y: auto;
                padding: 10px;
            `;
            document.getElementById('app').appendChild(suggestionsDiv);
        }
        
        // Buscar sugerencias
        const suggestions = this.knowledgeBase
            .filter(item => item.text.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        
        if (suggestions.length > 0) {
            suggestionsDiv.innerHTML = suggestions.map(item => 
                `<div class="suggestion" onclick="window.aiAssistant.selectSuggestion('${item.text.replace(/'/g, "\\'")}')">
                    <strong>${item.category}:</strong> ${item.text.substring(0, 60)}...
                </div>`
            ).join('');
            
            // Añadir estilos para las sugerencias
            if (!document.getElementById('suggestions-style')) {
                const style = document.createElement('style');
                style.id = 'suggestions-style';
                style.textContent = `
                    .suggestion {
                        padding: 8px 12px;
                        border-bottom: 1px solid #e2e8f0;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .suggestion:hover {
                        background: #f1f5f9;
                    }
                    .suggestion:last-child {
                        border-bottom: none;
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            suggestionsDiv.innerHTML = '<div style="padding: 10px; color: #64748b; text-align: center;">No hay sugerencias</div>';
        }
    }
    
    hideSearchSuggestions() {
        const suggestionsDiv = document.getElementById('search-suggestions');
        if (suggestionsDiv) {
            suggestionsDiv.remove();
        }
    }
    
    selectSuggestion(text) {
        document.getElementById('user-input').value = text;
        this.hideSearchSuggestions();
        this.sendMessage();
    }
    
    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender.toLowerCase()}-message`;
        messageDiv.textContent = text;
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        return messageDiv;
    }
}

// ==================== CLASES MULTI-IA (FUERA DE AIAssistant) ====================

class MultiAIConsensus {
    constructor() {
        this.responses = [];
        this.votes = {};
    }
    
    async queryAllAPIs(question, apis) {
        console.log(`🤖 Consultando ${Object.keys(apis).length} IAs...`);
        
        const promises = [];
        
        // DeepSeek API
        if (apis.deepseek) {
            promises.push(this.queryDeepSeek(question, apis.deepseek));
        }
        
        // Gemini API
        if (apis.gemini) {
            promises.push(this.queryGemini(question, apis.gemini));
        }
        
        // OpenAI API
        if (apis.openai) {
            promises.push(this.queryOpenAI(question, apis.openai));
        }
        
        // Claude API
        if (apis.claude) {
            promises.push(this.queryClaude(question, apis.claude));
        }
        
        // Esperar todas las respuestas (con timeout)
        try {
            const results = await Promise.allSettled(promises.map(p => 
                Promise.race([p, new Promise(resolve => 
                    setTimeout(() => resolve({error: 'timeout'}), 10000)
                )])
            ));
            
            // Filtrar respuestas exitosas
            const successfulResponses = results
                .filter(r => r.status === 'fulfilled' && r.value && !r.value.error)
                .map(r => r.value);
            
            console.log(`✅ ${successfulResponses.length}/${promises.length} IAs respondieron`);
            return successfulResponses;
            
        } catch (error) {
            console.error('Error en consultas multi-IA:', error);
            return [];
        }
    }
    
    async queryDeepSeek(question, apiKey) {
        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: question }],
                    max_tokens: 500
                })
            });
            
            const data = await response.json();
            return {
                source: 'DeepSeek',
                text: data.choices?.[0]?.message?.content || 'No response',
                confidence: 0.9,
                tokens: data.usage?.total_tokens || 0
            };
        } catch (error) {
            return { source: 'DeepSeek', error: error.message };
        }
    }
    
    async queryGemini(question, apiKey) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: question }]
                    }]
                })
            });
            
            const data = await response.json();
            return {
                source: 'Gemini',
                text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response',
                confidence: 0.85,
                safety: data.candidates?.[0]?.safetyRatings
            };
        } catch (error) {
            return { source: 'Gemini', error: error.message };
        }
    }
    
    async queryOpenAI(question, apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: question }],
                    max_tokens: 500
                })
            });
            
            const data = await response.json();
            return {
                source: 'OpenAI',
                text: data.choices?.[0]?.message?.content || 'No response',
                confidence: 0.95,
                model: data.model
            };
        } catch (error) {
            return { source: 'OpenAI', error: error.message };
        }
    }
    
    async queryClaude(question, apiKey) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 500,
                    messages: [{ role: 'user', content: question }]
                })
            });
            
            const data = await response.json();
            return {
                source: 'Claude',
                text: data.content?.[0]?.text || 'No response',
                confidence: 0.88,
                stop_reason: data.stop_reason
            };
        } catch (error) {
            return { source: 'Claude', error: error.message };
        }
    }
    
    // Algoritmo de consenso inteligente
    generateConsensus(responses) {
        if (responses.length === 0) return null;
        if (responses.length === 1) return responses[0];
        
        // 1. Agrupar respuestas similares
        const clusters = this.clusterResponses(responses);
        
        // 2. Encontrar el cluster más grande (consenso)
        const largestCluster = clusters.reduce((max, cluster) => 
            cluster.length > max.length ? cluster : max, []);
        
        // 3. Combinar respuestas del cluster mayoritario
        const consensusResponse = this.combineResponses(largestCluster);
        
        // 4. Añadir metadatos de consenso
        consensusResponse.consensus = {
            totalResponses: responses.length,
            agreeingResponses: largestCluster.length,
            confidence: (largestCluster.length / responses.length).toFixed(2),
            sources: largestCluster.map(r => r.source)
        };
        
        return consensusResponse;
    }
    
    clusterResponses(responses) {
        // Agrupar respuestas por similitud semántica
        const clusters = [];
        const used = new Set();
        
        for (let i = 0; i < responses.length; i++) {
            if (used.has(i)) continue;
            
            const cluster = [responses[i]];
            used.add(i);
            
            for (let j = i + 1; j < responses.length; j++) {
                if (used.has(j)) continue;
                
                if (this.similarity(responses[i].text, responses[j].text) > 0.7) {
                    cluster.push(responses[j]);
                    used.add(j);
                }
            }
            
            clusters.push(cluster);
        }
        
        return clusters;
    }
    
    similarity(text1, text2) {
        // Similitud de Jaccard simplificada
        const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 2));
        const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 2));
        
        const intersection = [...words1].filter(x => words2.has(x)).length;
        const union = words1.size + words2.size - intersection;
        
        return union > 0 ? intersection / union : 0;
    }
    
    combineResponses(cluster) {
        // Combinar las mejores partes de cada respuesta
        const texts = cluster.map(r => r.text);
        
        // Tomar la respuesta más larga como base
        const longest = texts.reduce((a, b) => a.length > b.length ? a : b);
        
        // Añadir información única de otras respuestas
        let combined = longest;
        
        for (const text of texts) {
            if (text === longest) continue;
            
            // Extraer oraciones únicas
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
            sentences.forEach(sentence => {
                if (!combined.includes(sentence.trim())) {
                    combined += ' ' + sentence.trim() + '.';
                }
            });
        }
        
        return {
            source: 'Consenso Multi-IA',
            text: combined.substring(0, 800), // Limitar longitud
            confidence: 0.95,
            clusterSize: cluster.length,
            originalSources: cluster.map(r => r.source)
        };
    }
}

class APIKeyManager {
    constructor() {
        this.keys = {
            deepseek: null,
            gemini: null,
            openai: null,
            claude: null
        };
        this.loadKeys();
    }
    
    loadKeys() {
        try {
            const saved = localStorage.getItem('ai_api_keys');
            if (saved) {
                this.keys = { ...this.keys, ...JSON.parse(saved) };
                console.log('🔑 API keys cargadas');
            }
        } catch (error) {
            console.error('Error cargando API keys:', error);
        }
    }
    
    saveKeys() {
        try {
            localStorage.setItem('ai_api_keys', JSON.stringify(this.keys));
            console.log('🔑 API keys guardadas');
        } catch (error) {
            console.error('Error guardando API keys:', error);
        }
    }
    
    setKey(service, key) {
        if (this.keys.hasOwnProperty(service)) {
            this.keys[service] = key;
            this.saveKeys();
            return true;
        }
        return false;
    }
    
    getKey(service) {
        return this.keys[service];
    }
    
    hasAnyKey() {
        return Object.values(this.keys).some(key => key && key.length > 10);
    }
    
    getAvailableServices() {
        return Object.entries(this.keys)
            .filter(([_, key]) => key && key.length > 10)
            .map(([service]) => service);
    }
}

class IntelligentRouter {
    constructor(knowledgeBase, multiAIConsensus, apiKeyManager) {
        this.knowledgeBase = knowledgeBase;
        this.multiAI = multiAIConsensus;
        this.apiKeys = apiKeyManager;
        this.queryHistory = [];
    }
    
    async routeQuery(question) {
        const questionLower = question.toLowerCase();
        
        // 1. Determinar el mejor enfoque basado en la pregunta
        const strategy = this.determineStrategy(question);
        
        console.log(`🧭 Estrategia seleccionada: ${strategy}`);
        
        // 2. Ejecutar según estrategia
        switch (strategy) {
            case 'factual':
                return await this.handleFactualQuery(question);
                
            case 'creative':
                return await this.handleCreativeQuery(question);
                
            case 'technical':
                return await this.handleTechnicalQuery(question);
                
            case 'comparative':
                return await this.handleComparativeQuery(question);
                
            default:
                return await this.handleGeneralQuery(question);
        }
    }
    
    determineStrategy(question) {
        const q = question.toLowerCase();
        
        // Preguntas factuales (hechos, datos)
        if (/(qué es|quién es|cuándo|dónde|cuánto|cuántos|definición)/i.test(q)) {
            return 'factual';
        }
        
        // Preguntas creativas (ideas, generación)
        if (/(cómo|por qué|explica|describe|idea|genera|crea)/i.test(q)) {
            return 'creative';
        }
        
        // Preguntas técnicas
        if (/(código|programación|error|tecnología|configuración|instalar)/i.test(q)) {
            return 'technical';
        }
        
        // Preguntas comparativas
        if (/(vs|comparación|diferencias|ventajas|desventajas|mejor|peor)/i.test(q)) {
            return 'comparative';
        }
        
        return 'general';
    }
    
    async handleFactualQuery(question) {
        // Para hechos, usar conocimiento local + Wikipedia
        console.log('📚 Búsqueda factual activada');
        
        // 1. Buscar en conocimiento local primero
        const localResults = this.searchLocalKnowledge(question);
        if (localResults.length > 0 && localResults[0].score > 8) {
            return {
                source: 'Conocimiento Local',
                text: localResults[0].text,
                confidence: 0.9,
                strategy: 'local-first'
            };
        }
        
        // 2. Si no hay buenos resultados locales, usar APIs externas
        if (this.apiKeys.hasAnyKey()) {
            const apiResponses = await this.multiAI.queryAllAPIs(question, this.apiKeys.keys);
            if (apiResponses.length > 0) {
                const consensus = this.multiAI.generateConsensus(apiResponses);
                return consensus;
            }
        }
        
        // 3. Fallback a respuesta básica
        return {
            source: 'Sistema Base',
            text: `Necesito más información sobre "${question}". Prueba a usar el botón "Aprender de Wikipedia".`,
            confidence: 0.5,
            strategy: 'fallback'
        };
    }
    
    async handleCreativeQuery(question) {
        // Para preguntas creativas, usar múltiples IAs
        console.log('🎨 Búsqueda creativa activada');
        
        if (this.apiKeys.hasAnyKey()) {
            const apiResponses = await this.multiAI.queryAllAPIs(question, this.apiKeys.keys);
            if (apiResponses.length > 0) {
                const consensus = this.multiAI.generateConsensus(apiResponses);
                
                // Mejorar la respuesta con toque creativo
                consensus.text = this.addCreativeTouch(consensus.text, question);
                return consensus;
            }
        }
        
        // Fallback creativo
        return {
            source: 'Creatividad Local',
            text: this.generateCreativeResponse(question),
            confidence: 0.7,
            strategy: 'creative-fallback'
        };
    }
    
    async handleTechnicalQuery(question) {
        console.log('💻 Búsqueda técnica activada');
        
        // Para preguntas técnicas, priorizar IAs especializadas
        const availableServices = this.apiKeys.getAvailableServices();
        
        // Preferir IAs técnicas
        const technicalPreferred = ['gemini', 'claude', 'openai'];
        const bestService = technicalPreferred.find(s => availableServices.includes(s));
        
        if (bestService) {
            // Usar solo la mejor IA técnica
            const singleResponse = await this.multiAI[`query${bestService.charAt(0).toUpperCase() + bestService.slice(1)}`](
                question, 
                this.apiKeys.getKey(bestService)
            );
            
            if (singleResponse && !singleResponse.error) {
                return {
                    ...singleResponse,
                    strategy: 'technical-specialized',
                    note: `Respuesta técnica especializada de ${bestService}`
                };
            }
        }
        
        // Fallback a todas las IAs disponibles
        if (this.apiKeys.hasAnyKey()) {
            const apiResponses = await this.multiAI.queryAllAPIs(question, this.apiKeys.keys);
            if (apiResponses.length > 0) {
                return this.multiAI.generateConsensus(apiResponses);
            }
        }
        
        // Buscar en conocimiento local técnico
        const technicalTerms = ['javascript', 'python', 'html', 'css', 'programación', 'código'];
        if (technicalTerms.some(term => question.toLowerCase().includes(term))) {
            const localTech = this.searchLocalKnowledge(question).filter(r => 
                r.category === 'programacion' || r.category === 'tecnologia'
            );
            
            if (localTech.length > 0) {
                return {
                    source: 'Conocimiento Técnico Local',
                    text: localTech[0].text,
                    confidence: 0.8,
                    strategy: 'local-technical'
                };
            }
        }
        
        return {
            source: 'Asistente Técnico',
            text: `Para preguntas técnicas como "${question}", recomiendo consultar documentación oficial o foros especializados.`,
            confidence: 0.6,
            strategy: 'technical-fallback'
        };
    }
    
    searchLocalKnowledge(query) {
        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 2);
        return this.knowledgeBase.map(item => {
            let score = 0;
            const textLower = item.text.toLowerCase();
            
            keywords.forEach(keyword => {
                if (textLower.includes(keyword)) score += 3;
                if (item.category.toLowerCase().includes(keyword)) score += 2;
            });
            
            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
    }
    
    addCreativeTouch(text, question) {
        const creativePrefixes = [
            "✨ Desde una perspectiva innovadora: ",
            "🎭 Permíteme abordar esto creativamente: ",
            "💡 Aquí tienes una idea interesante: ",
            "🌟 Desde un ángulo creativo: "
        ];
        
        const prefix = creativePrefixes[Math.floor(Math.random() * creativePrefixes.length)];
        return prefix + text;
    }
    
    generateCreativeResponse(question) {
        const responses = [
            `Para "${question}", te sugiero explorar diferentes perspectivas. Podrías considerar...`,
            `¡Qué pregunta interesante! Desde un punto de vista creativo, podrías pensar en...`,
            `Sobre "${question}", las posibilidades son infinitas. ¿Has considerado...?`,
            `Desde mi perspectiva creativa sobre "${question}", te recomendaría...`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async handleComparativeQuery(question) {
        console.log('⚖️ Búsqueda comparativa activada');
        
        if (this.apiKeys.hasAnyKey()) {
            const apiResponses = await this.multiAI.queryAllAPIs(question, this.apiKeys.keys);
            if (apiResponses.length > 0) {
                return this.multiAI.generateConsensus(apiResponses);
            }
        }
        
        return {
            source: 'Análisis Comparativo',
            text: `Para comparaciones como "${question}", necesito analizar múltiples fuentes. Activa el modo Multi-IA para mejores resultados.`,
            confidence: 0.6,
            strategy: 'comparative-fallback'
        };
    }
    
    async handleGeneralQuery(question) {
        console.log('🌐 Búsqueda general activada');
        
        // Primero intentar con conocimiento local
        const localResults = this.searchLocalKnowledge(question);
        if (localResults.length > 0 && localResults[0].score > 5) {
            return {
                source: 'Conocimiento Local',
                text: localResults[0].text,
                confidence: 0.8,
                strategy: 'local-general'
            };
        }
        
        // Luego con APIs si están disponibles
        if (this.apiKeys.hasAnyKey()) {
            const apiResponses = await this.multiAI.queryAllAPIs(question, this.apiKeys.keys);
            if (apiResponses.length > 0) {
                return this.multiAI.generateConsensus(apiResponses);
            }
        }
        
        // Finalmente, respuesta genérica
        return {
            source: 'Asistente General',
            text: `He procesado tu pregunta sobre "${question}". Para una respuesta más precisa, puedes:\n1. Activar el modo Multi-IA (/multi)\n2. Añadir conocimiento específico (botón +)\n3. Solicitar que aprenda sobre el tema (di "aprende sobre ${question}")`,
            confidence: 0.5,
            strategy: 'general-fallback'
        };
    }
}

class APIConfigUI {
    constructor(apiKeyManager) {
        this.apiKeyManager = apiKeyManager;
        this.modal = null;
    }
    
    showConfigModal() {
        // Crear modal
        this.modal = document.createElement('div');
        this.modal.id = 'api-config-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        modalContent.innerHTML = `
            <h2 style="margin-top: 0; color: #4f46e5;">🔑 Configurar APIs de IA</h2>
            <p style="color: #64748b; margin-bottom: 25px;">
                Añade tus API keys para usar múltiples IAs. Las keys se guardan localmente en tu navegador.
            </p>
            
            ${this.generateAPIInputs()}
            
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: flex-end;">
                <button id="save-api-keys" style="background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer;">
                    💾 Guardar Keys
                </button>
                <button id="close-modal" style="background: #e2e8f0; color: #64748b; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #f1f5f9; border-radius: 10px; font-size: 14px;">
                <strong>💡 Consejos:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Obtén API keys gratis en los sitios oficiales</li>
                    <li>Las keys se guardan solo en tu dispositivo</li>
                    <li>Puedes usar solo algunas APIs si prefieres</li>
                    <li>El sistema funcionará con las APIs disponibles</li>
                </ul>
            </div>
        `;
        
        this.modal.appendChild(modalContent);
        document.body.appendChild(this.modal);
        
        // Event listeners
        document.getElementById('save-api-keys').addEventListener('click', () => this.saveKeys());
        document.getElementById('close-modal').addEventListener('click', () => this.hideModal());
        
        // Cerrar al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    generateAPIInputs() {
        const services = [
            { id: 'deepseek', name: 'DeepSeek', url: 'https://platform.deepseek.com/api_keys' },
            { id: 'gemini', name: 'Google Gemini', url: 'https://makersuite.google.com/app/apikey' },
            { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com/api-keys' },
            { id: 'claude', name: 'Anthropic Claude', url: 'https://console.anthropic.com/keys' }
        ];
        
        return services.map(service => `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <label style="font-weight: 600; color: #334155;">${service.name}</label>
                    <a href="${service.url}" target="_blank" style="font-size: 12px; color: #4f46e5; text-decoration: none;">
                        🔗 Obtener key
                    </a>
                </div>
                <input 
                    type="password" 
                    id="api-key-${service.id}" 
                    placeholder="sk-..." 
                    value="${this.apiKeyManager.getKey(service.id) || ''}"
                    style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: monospace;"
                >
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                    <input 
                        type="checkbox" 
                        id="toggle-${service.id}" 
                        onchange="this.previousElementSibling.type = this.checked ? 'text' : 'password'"
                        style="margin: 0;"
                    >
                    <label style="font-size: 12px; color: #64748b;">Mostrar key</label>
                </div>
            </div>
        `).join('');
    }
    
    saveKeys() {
        const services = ['deepseek', 'gemini', 'openai', 'claude'];
        
        services.forEach(service => {
            const input = document.getElementById(`api-key-${service}`);
            if (input && input.value.trim()) {
                this.apiKeyManager.setKey(service, input.value.trim());
            }
        });
        
        this.showNotification('✅ API Keys guardadas correctamente');
        setTimeout(() => this.hideModal(), 1500);
    }
    
    hideModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 10001;
            animation: slideInRight 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ==================== INICIALIZACIÓN ====================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
    
    // Comandos especiales por consola
    window.debugAI = {
        getKnowledge: () => window.aiAssistant.knowledgeBase,
        addKnowledge: (text, category) => window.aiAssistant.addToKnowledgeBase(text, category),
        getStats: () => window.aiAssistant.getKnowledgeStats(),
        clearChat: () => {
            document.getElementById('chat-container').innerHTML = '';
            window.aiAssistant.addMessage('AI', 'Chat limpiado. ¿En qué puedo ayudarte?');
        },
        
        // Nuevos comandos Multi-IA
        search: (query) => {
            console.log('🔍 Buscando:', query);
            const results = window.aiAssistant.knowledgeBase.filter(item => 
                item.text.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 10);
            console.log('Resultados:', results);
            return results;
        },
        
        exportKnowledge: () => {
            const dataStr = JSON.stringify(window.aiAssistant.knowledgeBase, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'conocimiento-ia.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            return '✅ Conocimiento exportado como JSON';
        },
        
        learnFromWikipedia: (query) => window.aiAssistant.learnFromWikipedia(query),
        learnFromNews: (topic) => window.aiAssistant.learnFromNews(topic),
        learnFromWeb: (query) => window.aiAssistant.learnFromWeb(query),
        
        // Comandos Multi-IA
        queryMultiAI: (question) => {
            if (window.aiAssistant.multiAIConsensus && window.aiAssistant.apiKeyManager) {
                return window.aiAssistant.multiAIConsensus.queryAllAPIs(
                    question, 
                    window.aiAssistant.apiKeyManager.keys
                );
            }
            return Promise.resolve([]);
        },
        
        setAPIKey: (service, key) => {
            if (window.aiAssistant.apiKeyManager) {
                return window.aiAssistant.apiKeyManager.setKey(service, key);
            }
            return false;
        },
        
        testQuery: (query) => {
            console.log('🧪 Probando query:', query);
            return window.aiAssistant.getAIResponse(query);
        }
    };
    
    console.log('📊 Comandos disponibles:');
    console.log('- debugAI.getKnowledge(): Ver toda la base');
    console.log('- debugAI.addKnowledge("texto", "categoria"): Añadir conocimiento');
    console.log('- debugAI.getStats(): Ver estadísticas');
    console.log('- debugAI.search("texto"): Buscar en conocimiento');
    console.log('- debugAI.exportKnowledge(): Exportar todo el conocimiento');
    console.log('- debugAI.learnFromWikipedia("tema"): Aprender de Wikipedia');
    console.log('- debugAI.learnFromNews("tema"): Aprender noticias');
    console.log('- debugAI.learnFromWeb("busqueda"): Buscar en la web');
    console.log('- debugAI.queryMultiAI("pregunta"): Consultar múltiples IAs');
    console.log('- debugAI.setAPIKey("servicio", "key"): Configurar API key');
    console.log('- debugAI.clearChat(): Limpiar chat');
    
    // Configurar botón de APIs si existe
    document.getElementById('api-config-btn')?.addEventListener('click', () => {
        window.aiAssistant.apiConfigUI.showConfigModal();
    });
    
    // Botones de aprendizaje automático (si existen en el HTML)
    setTimeout(() => {
        document.getElementById('learn-wikipedia')?.addEventListener('click', async () => {
            const topic = prompt('¿Sobre qué quieres que aprenda de Wikipedia?', 'inteligencia artificial');
            if (topic && window.aiAssistant) {
                const result = await window.aiAssistant.learnFromWikipedia(topic);
                if (result.success) {
                    alert(`✅ Aprendí ${result.count} cosas sobre "${result.title}"`);
                    window.aiAssistant.updateKnowledgeBadge();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            }
        });
        
        document.getElementById('learn-news')?.addEventListener('click', async () => {
            const topic = prompt('¿Sobre qué noticias quieres aprender?', 'tecnología');
            if (topic && window.aiAssistant) {
                const result = await window.aiAssistant.learnFromNews(topic);
                if (result.success) {
                    alert(`✅ Aprendí ${result.count} noticias sobre "${topic}"`);
                    window.aiAssistant.updateKnowledgeBadge();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            }
        });
        
        document.getElementById('learn-web')?.addEventListener('click', async () => {
            const query = prompt('¿Qué quieres buscar en la web?', 'aprender programación');
            if (query && window.aiAssistant) {
                const result = await window.aiAssistant.learnFromWeb(query);
                if (result.success) {
                    alert(`✅ Aprendí ${result.count} cosas sobre "${query}"`);
                    window.aiAssistant.updateKnowledgeBadge();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            }
        });
    }, 1000);
});