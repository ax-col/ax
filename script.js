// ======================================================
// VIDEOS, DETECCIÓN Y SISTEMA MULTI-DISPOSITIVO
// ======================================================

const videosPorDispositivo = {
  PC: ["AX-Files/AX-C1.mp4", "AX-Files/AX-C2.mp4", "AX-Files/AX-C3.mp4"],
  MOVIL: ["AX-Files/AX-M1.mp4", "AX-Files/AX-M2.mp4", "AX-Files/AX-M3.mp4", "AX-Files/AX-M4.mp4"]
};

function detectarDispositivo() {
  return (window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) 
    ? 'MOVIL' 
    : 'PC';
}

let videoFondo = null;
let dispositivoActual = detectarDispositivo();

function inicializarVideo() {
  console.log('🎬 Inicializando sistema de video...');
  videoFondo = document.getElementById('videoFondo');
  if (!videoFondo) return;

  // Selecciona lista según el dispositivo detectado
  const listaVideos = videosPorDispositivo[dispositivoActual] || videosPorDispositivo.PC;
  const videoAleatorio = listaVideos[Math.floor(Math.random() * listaVideos.length)];
  
  console.log(`🎥 Modo: ${dispositivoActual} | Video: ${videoAleatorio}`);
  
  videoFondo.src = videoAleatorio;
  videoFondo.play().catch(e => console.log('⚠️ Autoplay esperando interacción...'));
}

window.toggleMute = function() {
  if (!videoFondo) return;
  videoFondo.muted = !videoFondo.muted;
  const btn = document.querySelector('.mute-toggle');
  if (btn) {
    if (videoFondo.muted) {
      btn.textContent = 'ACTIVAR SONIDO';
      btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
    } else {
      btn.textContent = 'SILENCIAR';
      btn.style.background = 'linear-gradient(135deg, #FF0000 0%, #FF8800 100%)';
    }
  }
};

function animarTexto() {
  const textElement = document.getElementById('animated-text');
  if (!textElement) return;
  const text = textElement.textContent;
  const letters = text.split('');
  textElement.textContent = '';
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    textElement.appendChild(span);
  });

  let currentIndex = 0;
  setInterval(() => {
    const spans = textElement.querySelectorAll('span');
    spans.forEach(span => span.className = '');
    for (let i = currentIndex; i < currentIndex + 3 && i < spans.length; i++) {
      if (spans[i]) spans[i].classList.add('color-red1');
    }
    currentIndex = (currentIndex + 1) % spans.length;
  }, 150);
}

// ======================================================
// CONTADOR MUNDIAL (CON ANIMACIÓN ORIGINAL)
// ======================================================
let previousTimerValues = { days: '00', hours: '00', minutes: '00', seconds: '00' };

function updateTimer() {
  // Fecha original del mundial
  const targetDate = new Date('2026-06-11T10:00:00').getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateTimerDisplay('days', days);
    updateTimerDisplay('hours', hours);
    updateTimerDisplay('minutes', minutes);
    updateTimerDisplay('seconds', seconds);
  } else {
    document.querySelectorAll('.timer-title').forEach(t => t.textContent = '¡BIENVENIDO MUNDIAL!');
  }
}

function updateTimerDisplay(elementId, value) {
  const formattedValue = String(value).padStart(2, '0');
  if (previousTimerValues[elementId] !== formattedValue) {
    const containers = document.querySelectorAll(`[id="${elementId}-container"]`);
    containers.forEach(container => {
      // Solo anima si el elemento es visible (evita lag)
      if (container.offsetParent !== null) {
        const falling = document.createElement('div');
        falling.className = 'time-value-inner current-number';
        falling.textContent = previousTimerValues[elementId];
        const incoming = document.createElement('div');
        incoming.className = 'time-value-inner next-number';
        incoming.textContent = formattedValue;
        container.innerHTML = '';
        container.appendChild(falling);
        container.appendChild(incoming);
        setTimeout(() => {
          container.innerHTML = `<div class="time-value-inner">${formattedValue}</div>`;
        }, 800);
      } else {
        container.innerHTML = `<div class="time-value-inner">${formattedValue}</div>`;
      }
    });
    previousTimerValues[elementId] = formattedValue;
  }
}

// ======================================================
// WIDGET ORO + BITCOIN (LÓGICA AVANZADA DE CAMBIO)
// ======================================================
class GoldBitcoinWidget {
  constructor() {
    this.goldGramElement = document.getElementById('gold-price-gram');
    this.goldUpdateElement = document.getElementById('gold-update-time');
    this.btcPriceElement = document.getElementById('btc-price');
    this.btcChangeElement = document.getElementById('btc-change');
    this.lastBtcPrice = 0;
    
    if (this.goldGramElement) this.init();
  }

  init() {
    this.fetchGoldPrice();
    setInterval(() => this.fetchGoldPrice(), 5000);
    this.fetchBtcPrice();
    setInterval(() => this.fetchBtcPrice(), 2000);
  }

  async fetchGoldPrice() {
    try {
      // 1. Obtener precio Oro (PAXG) en USD
      const goldRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
      const goldData = await goldRes.json();
      const usdPerOz = parseFloat(goldData.price);

      // 2. Cálculo con tasa fija para estabilidad en APK o dinámica si prefieres
      const exchangeRate = 4100; 
      const copPerGram = (usdPerOz * exchangeRate) / 31.1035;

      this.goldGramElement.textContent = '$' + copPerGram.toLocaleString('es-CO', { maximumFractionDigits: 0 });
      this.goldUpdateElement.textContent = new Date().toLocaleTimeString('es-CO');
    } catch (e) { console.error("Error Oro:", e); }
  }

  async fetchBtcPrice() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const data = await res.json();
      const price = parseFloat(data.price);

      if (this.lastBtcPrice === 0) this.lastBtcPrice = price;
      const change = price - this.lastBtcPrice;
      const percentChange = ((change / this.lastBtcPrice) * 100);

      this.btcPriceElement.textContent = '$ ' + price.toLocaleString('es-CO', { minimumFractionDigits: 2 });
      
      if (this.btcChangeElement) {
        if (change > 0) {
          this.btcChangeElement.innerHTML = `▲ +${percentChange.toFixed(2)}%`;
          this.btcChangeElement.style.color = '#00ff9d';
        } else if (change < 0) {
          this.btcChangeElement.innerHTML = `▼ ${percentChange.toFixed(2)}%`;
          this.btcChangeElement.style.color = '#ff4d4d';
        } else {
          this.btcChangeElement.innerHTML = `— 0.00%`;
          this.btcChangeElement.style.color = '#aaa';
        }
      }
      this.lastBtcPrice = price;
    } catch (e) { console.error("Error BTC:", e); }
  }
}

// ======================================================
// INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarVideo();
  animarTexto();
  
  if (document.getElementById('seconds-container')) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  window.goldBitcoinWidget = new GoldBitcoinWidget();
});