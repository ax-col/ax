// ======================================================
// VIDEOS DISPONIBLES SEGÚN DISPOSITIVO
// ======================================================

const videosPorDispositivo = {
  PC: ["AX-Files/AX-C1.mp4", "AX-Files/AX-C2.mp4", "AX-Files/AX-C3.mp4", 
       "AX-Files/AX-C4.mp4", "AX-Files/AX-C5.mp4", "AX-Files/AX-C6.mp4"],
  MOVIL: ["AX-Files/AX-M1.mp4", "AX-Files/AX-M2.mp4"]
};

// ======================================================
// DETECCIÓN DE DISPOSITIVO
// ======================================================

function detectarDispositivo() {
  return (window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) 
    ? 'MOVIL' 
    : 'PC';
}

// ======================================================
// VARIABLES GLOBALES
// ======================================================

let videoFondo = null;
let botonesVideo = [];
let videosActuales = [];
let dispositivoActual = '';
let videoActualIndex = 0;

// ======================================================
// INICIALIZACIÓN
// ======================================================

function inicializarVideo() {
  console.log('🎬 Inicializando sistema de video...');
  
  // 1. Obtener elementos
  videoFondo = document.getElementById('videoFondo');
  
  // 2. Detectar dispositivo
  dispositivoActual = detectarDispositivo();
  console.log(`📱 Dispositivo: ${dispositivoActual}`);
  
  // 3. Obtener videos para este dispositivo
  videosActuales = videosPorDispositivo[dispositivoActual];
  console.log(`🎥 Videos disponibles: ${videosActuales.length}`);
  
  // 4. Elegir video aleatorio
  videoActualIndex = Math.floor(Math.random() * videosActuales.length);
  const videoAleatorio = videosActuales[videoActualIndex];
  
  // 5. Establecer video de fondo
  videoFondo.src = videoAleatorio;
  
  // 6. Intentar reproducir
  videoFondo.play().catch(e => {
    console.log('⚠️ Autoplay bloqueado:', e);
  });
  
  // 7. Actualizar información
  actualizarInfoVideo(videoAleatorio);
  
  // 8. Configurar botones
  configurarBotones();
}

function configurarBotones() {
  botonesVideo = document.querySelectorAll('.btn-video');
  console.log(`🔄 Configurando ${botonesVideo.length} botones...`);
  
  botonesVideo.forEach((btn, index) => {
    if (index < videosActuales.length) {
      // MOSTRAR y configurar botón
      btn.style.display = 'inline-block';
      btn.onclick = () => cambiarVideo(index);
      
      // Marcar como activo si es el video actual
      if (index === videoActualIndex) {
        btn.classList.add('activo');
      } else {
        btn.classList.remove('activo');
      }
    } else {
      // OCULTAR botón (no hay video)
      btn.style.display = 'none';
    }
  });
}

function cambiarVideo(nuevoIndex) {
  if (nuevoIndex >= videosActuales.length) return;
  
  const nuevoVideo = videosActuales[nuevoIndex];
  console.log(`🔄 Cambiando a: ${nuevoVideo}`);
  
  // Cambiar video
  videoFondo.src = nuevoVideo;
  videoFondo.play().catch(e => console.log('Error:', e));
  
  // Actualizar índice
  videoActualIndex = nuevoIndex;
  
  // Actualizar información
  actualizarInfoVideo(nuevoVideo);
  
  // Actualizar botones activos
  botonesVideo.forEach((btn, index) => {
    if (index === nuevoIndex) {
      btn.classList.add('activo');
    } else {
      btn.classList.remove('activo');
    }
  });
}

function actualizarInfoVideo(rutaVideo) {
  const nombreVideo = rutaVideo.split('/').pop();
  const infoElement = document.getElementById('infoVideo');
  if (infoElement) {
    infoElement.textContent = `Video actual (${dispositivoActual}): ${nombreVideo}`;
  }
}

// ======================================================
// CONTROL DE SONIDO
// ======================================================

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
}

// ======================================================
// ANIMACIÓN DE TEXTO
// ======================================================

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

// ======================================================
// TEMPORIZADOR
// ======================================================

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
    const titles = document.querySelectorAll('.timer-title');
    titles.forEach(t => t.textContent = '¡BIENVENIDO 2026!');
  }
}

function updateTimerDisplay(elementId, value) {
  const formattedValue = String(value).padStart(2, '0');
  if (previousTimerValues[elementId] !== formattedValue) {
    const containers = document.querySelectorAll(`[id="${elementId}-container"]`);
    containers.forEach(container => {
      if (container.offsetParent !== null) {
        const fallingNumber = document.createElement('div');
        fallingNumber.className = 'time-value-inner current-number';
        fallingNumber.textContent = previousTimerValues[elementId];
        fallingNumber.style.zIndex = '2';

        const incomingNumber = document.createElement('div');
        incomingNumber.className = 'time-value-inner next-number';
        incomingNumber.textContent = formattedValue;
        incomingNumber.style.zIndex = '1';

        container.innerHTML = '';
        container.appendChild(fallingNumber);
        container.appendChild(incomingNumber);

        setTimeout(() => {
          container.innerHTML = '';
          const finalNumber = document.createElement('div');
          finalNumber.className = 'time-value-inner';
          finalNumber.textContent = formattedValue;
          container.appendChild(finalNumber);
        }, 800);
      } else {
        container.innerHTML = `<div class="time-value-inner">${formattedValue}</div>`;
      }
    });
    previousTimerValues[elementId] = formattedValue;
  }
}

// ======================================================
// INICIALIZACIÓN GENERAL
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página cargada, iniciando...');
  
  // 1. Inicializar video
  inicializarVideo();
  
  // 2. Animación de texto
  animarTexto();
  
  // 3. Temporizador
  if (document.getElementById('seconds-container')) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }
  
  // 4. Permitir reproducción al hacer clic
  document.addEventListener('click', function iniciarAudio() {
    if (videoFondo && videoFondo.paused) {
      videoFondo.play();
    }
    document.removeEventListener('click', iniciarAudio);
  });
});