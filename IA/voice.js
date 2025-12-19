// voice.js - Reconocimiento de voz
class VoiceAssistant {
    constructor(aiAssistant) {
        this.ai = aiAssistant;
        this.recognition = null;
        this.isListening = false;
        
        this.init();
    }
    
    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.lang = 'es-ES';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('🗣️ Voz detectada:', transcript);
                
                // Enviar al chat
                document.getElementById('user-input').value = transcript;
                this.ai.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Error voz:', event.error);
                this.isListening = false;
            };
            
            console.log('✅ Reconocimiento de voz disponible');
        } else {
            console.warn('❌ Reconocimiento de voz no disponible');
        }
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            return true;
        }
        return false;
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            return true;
        }
        return false;
    }
}

// Añadir botón de voz a la UI
function addVoiceButton() {
    const inputArea = document.querySelector('.input-area');
    if (!inputArea) return;
    
    const voiceBtn = document.createElement('button');
    voiceBtn.id = 'voice-btn';
    voiceBtn.innerHTML = '🎤';
    voiceBtn.title = 'Hablar';
    voiceBtn.style.cssText = `
        background: #10b981;
        color: white;
        border: none;
        border-radius: 15px;
        width: 50px;
        font-size: 20px;
        cursor: pointer;
        margin-left: 5px;
    `;
    
    inputArea.appendChild(voiceBtn);
    
    let voiceAssistant = null;
    
    voiceBtn.addEventListener('click', () => {
        if (!voiceAssistant) {
            voiceAssistant = new VoiceAssistant(window.aiAssistant);
        }
        
        if (voiceAssistant.startListening()) {
            voiceBtn.style.background = '#ef4444';
            voiceBtn.innerHTML = '⏹️';
            voiceBtn.title = 'Detener';
            
            // Auto-detener después de 5 segundos
            setTimeout(() => {
                if (voiceAssistant.isListening) {
                    voiceAssistant.stopListening();
                    voiceBtn.style.background = '#10b981';
                    voiceBtn.innerHTML = '🎤';
                    voiceBtn.title = 'Hablar';
                }
            }, 5000);
        }
    });
}

// Inicializar cuando la IA esté lista
setTimeout(addVoiceButton, 2000);