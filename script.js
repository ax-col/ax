// ======================================================
// VIDEOS, DETECCIÓN, SONIDO, ANIMACIÓN, TEMPORIZADOR (sin cambios)
// ======================================================

const videosPorDispositivo = {
  PC: ["AX-Files/AX-C1.mp4", "AX-Files/AX-C2.mp4"],
  MOVIL: ["AX-Files/AX-M1.mp4"]
};

function detectarDispositivo() {
  return (window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) 
    ? 'MOVIL' 
    : 'PC';
}

let videoFondo = null;
let botonesVideo = [];
let videosActuales = [];
let dispositivoActual = '';
let videoActualIndex = 0;

function inicializarVideo() {
  console.log('🎬 Inicializando sistema de video...');
  
  videoFondo = document.getElementById('videoFondo');
  
  // Lista de videos disponibles (puedes agregar más fácilmente)
  const videosDisponibles = [
    "AX-Files/AX-C1.mp4",
    "AX-Files/AX-C2.mp4"
  ];

  // Selecciona uno al azar
  const videoAleatorio = videosDisponibles[Math.floor(Math.random() * videosDisponibles.length)];
  
  console.log(`🎥 Video seleccionado: ${videoAleatorio}`);
  
  // Asigna el video seleccionado
  videoFondo.src = videoAleatorio;
  
  // Intenta reproducir
  videoFondo.play().catch(e => {
    console.log('⚠️ Autoplay bloqueado por el navegador:', e);
  });
  
  // Actualizar información si tienes ese elemento
  actualizarInfoVideo(videoAleatorio);
  
  // Configurar botones (si los tienes)
  configurarBotones();
}

function configurarBotones() {
  botonesVideo = document.querySelectorAll('.btn-video');
  botonesVideo.forEach((btn, index) => {
    if (index < videosActuales.length) {
      btn.style.display = 'inline-block';
      btn.onclick = () => cambiarVideo(index);
      if (index === videoActualIndex) btn.classList.add('activo');
    } else {
      btn.style.display = 'none';
    }
  });
}

function cambiarVideo(nuevoIndex) {
  if (nuevoIndex >= videosActuales.length) return;
  const nuevoVideo = videosActuales[nuevoIndex];
  videoFondo.src = nuevoVideo;
  videoFondo.play().catch(e => console.log('Error:', e));
  videoActualIndex = nuevoIndex;
  actualizarInfoVideo(nuevoVideo);
  botonesVideo.forEach((btn, i) => btn.classList.toggle('activo', i === nuevoIndex));
}

function actualizarInfoVideo(rutaVideo) {
  const nombreVideo = rutaVideo.split('/').pop();
  const infoElement = document.getElementById('infoVideo');
  if (infoElement) infoElement.textContent = `Video actual (${dispositivoActual}): ${nombreVideo}`;
}

window.toggleMute = function() {
  if (!videoFondo) return;
  videoFondo.muted = !videoFondo.muted;
  const btn = document.querySelector('.mute-toggle');
  if (videoFondo.muted) {
    btn.textContent = 'ACTIVAR SONIDO';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
  } else {
    btn.textContent = 'SILENCIAR';
    btn.style.background = 'linear-gradient(135deg, #FF0000 0%, #FF8800 100%)';
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
      spans[i].classList.add('color-red1');
    }
    currentIndex = (currentIndex + 1) % spans.length;
  }, 150);
}

// TEMPORIZADOR (sin cambios)
let previousTimerValues = { days: '00', hours: '00', minutes: '00', seconds: '00' };

function updateTimer() {
  const targetDate = new Date('2026-04-24T10:00:00').getTime();
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
    document.querySelectorAll('.timer-title').forEach(t => t.textContent = '¡BIENVENIDO 2026!');
  }
}

function updateTimerDisplay(elementId, value) {
  const formattedValue = String(value).padStart(2, '0');
  if (previousTimerValues[elementId] !== formattedValue) {
    const containers = document.querySelectorAll(`[id="${elementId}-container"]`);
    containers.forEach(container => {
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
// WIDGET ORO + BITCOIN - VERSIÓN FINAL (Cambio siempre actualizado)
// ======================================================

class GoldBitcoinWidget {
  constructor() {
    this.widget = document.getElementById('gold-counter-widget');
    this.goldGramElement = document.getElementById('gold-price-gram');
    this.goldUpdateElement = document.getElementById('gold-update-time');
    
    this.btcPriceElement = document.getElementById('btc-price');
    this.btcChangeElement = document.getElementById('btc-change');
    
    this.lastBtcPrice = 0;
    
    if (!this.widget) {
      console.error('❌ Widget no encontrado');
      return;
    }
    
    this.init();
  }

  init() {
    this.fetchGoldPrice();
    setInterval(() => this.fetchGoldPrice(), 4000);   // Oro cada 4s
    
    this.fetchBtcPrice();
    setInterval(() => this.fetchBtcPrice(), 1000);    // Bitcoin cada 1s
  }

  async fetchGoldPrice() {
    try {
      const goldRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
      const goldData = await goldRes.json();
      const usdPerOz = parseFloat(goldData.price);

      const exRes = await fetch('https://api.exchangerate.fun/latest?base=USD');
      const exData = await exRes.json();
      const exchangeRate = exData.rates?.COP || 4100;

      const copPerGram = (usdPerOz * exchangeRate) / 31.1035;

      this.goldGramElement.textContent = '$' + copPerGram.toLocaleString('es-CO', { maximumFractionDigits: 0 });
      
      const now = new Date();
      this.goldUpdateElement.textContent = now.toLocaleTimeString('es-CO', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      });
    } catch (e) {
      console.error("Error oro:", e);
      this.goldGramElement.textContent = '⚠️';
    }
  }

  async fetchBtcPrice() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const data = await res.json();
      const price = parseFloat(data.price);

      if (this.lastBtcPrice === 0) this.lastBtcPrice = price;

      const change = price - this.lastBtcPrice;
      const percentChange = this.lastBtcPrice ? ((change / this.lastBtcPrice) * 100) : 0;

      // Precio con dos decimales
      this.btcPriceElement.textContent = '$ ' + price.toLocaleString('es-CO', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });

      // Cambio siempre actualizado
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

      this.lastBtcPrice = price;
    } catch (e) {
      console.error("Error BTC:", e);
      this.btcPriceElement.textContent = '⚠️';
    }
  }
}

// ======================================================
// INICIALIZACIÓN GENERAL
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 AX Página cargada correctamente');
  
  inicializarVideo();
  animarTexto();
  
  if (document.getElementById('seconds-container')) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  window.goldBitcoinWidget = new GoldBitcoinWidget();

  const video = document.getElementById('videoFondo');
  if (video) video.play().catch(() => {});
});
