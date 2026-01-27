// ======================================================
// VIDEOS DISPONIBLES SEGÚN DISPOSITIVO
// ======================================================

const videosPC = [
  "AX-Files/AX-C1.mp4",
  "AX-Files/AX-C2.mp4", 
  "AX-Files/AX-C3.mp4",
  "AX-Files/AX-C4.mp4",
  "AX-Files/AX-C5.mp4",
  "AX-Files/AX-C6.mp4"
];

const videosMovil = [
  "AX-Files/AX-M1.mp4",
  "AX-Files/AX-M2.mp4"
  // Solo los que existen: M1 y M2
];

// ======================================================
// DETECCIÓN DE DISPOSITIVO
// ======================================================

function esMovil() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

function obtenerVideosSegunDispositivo() {
  return esMovil() ? videosMovil : videosPC;
}

function obtenerTipoDispositivo() {
  return esMovil() ? 'móvil' : 'PC';
}

// ======================================================
// VARIABLES GLOBALES
// ======================================================

let videoFondo = null;
let botonesVideo = [];
let listaVideosActual = [];
let tipoActual = '';

// ======================================================
// FUNCIONES PRINCIPALES
// ======================================================

// Inicializar el video de fondo
function inicializarVideoFondo() {
  videoFondo = document.getElementById("videoFondo");
  
  // Determinar qué videos usar según dispositivo
  listaVideosActual = obtenerVideosSegunDispositivo();
  tipoActual = obtenerTipoDispositivo();
  
  // Elegir un video al azar
  const indiceAleatorio = Math.floor(Math.random() * listaVideosActual.length);
  const videoAleatorio = listaVideosActual[indiceAleatorio];
  
  // Establecer el video de fondo
  videoFondo.src = videoAleatorio;
  videoFondo.load();
  videoFondo.play().catch(() => console.log('Autoplay bloqueado, haz clic en la página'));
  
  // Actualizar información
  actualizarInfoVideo(videoAleatorio);
}

// Inicializar botones
function inicializarBotones() {
  botonesVideo = document.querySelectorAll('.btn-video');
  
  // Ocultar botones que no tienen video
  botonesVideo.forEach((btn, index) => {
    if (index < listaVideosActual.length) {
      btn.style.display = 'inline-block';
      const rutaVideo = listaVideosActual[index];
      btn.onclick = () => cambiarVideoFondo(rutaVideo, index);
    } else {
      btn.style.display = 'none'; // Ocultar botones sin video
    }
  });
}

// Cambiar el video de fondo
function cambiarVideoFondo(rutaVideo, indice) {
  if (!videoFondo) return;
  
  videoFondo.src = rutaVideo;
  videoFondo.load();
  videoFondo.play().catch(e => console.log('Error al reproducir:', e));
  
  // Actualizar información
  actualizarInfoVideo(rutaVideo);
  
  // Activar botón correspondiente
  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo[indice]) {
    botonesVideo[indice].classList.add('activo');
  }
}

// Actualizar texto informativo
function actualizarInfoVideo(rutaVideo) {
  const nombreVideo = rutaVideo.split('/').pop();
  document.getElementById('infoVideo').textContent = 
    `Video actual (${tipoActual}): ${nombreVideo}`;
}

// Función de mute toggle
window.toggleMute = function() {
  if (!videoFondo) return;

  const btn = document.querySelector('.mute-toggle');
  videoFondo.muted = !videoFondo.muted;

  if (videoFondo.muted) {
    btn.textContent = 'ACTIVAR SONIDO';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
  } else {
    btn.textContent = 'SILENCIAR';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
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
// TEMPORIZADOR (ANIMACIÓN DE CAÍDA)
// ======================================================

let previousTimerValues = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
};

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
  // 1. Inicializar video de fondo
  inicializarVideoFondo();
  
  // 2. Inicializar botones
  inicializarBotones();
  
  // 3. Iniciar animación de texto
  animarTexto();
  
  // 4. Iniciar temporizador
  if (document.getElementById('seconds-container')) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }
  
  // 5. Permitir autoplay al hacer clic en la página
  document.body.addEventListener('click', () => {
    if (videoFondo && videoFondo.paused) {
      videoFondo.play();
    }
  });
});

// ======================================================
// SERVICE WORKER
// ======================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = window.location.pathname.includes('/ax/') 
      ? '/ax/sw.js' 
      : '/sw.js';

    navigator.serviceWorker.register(swPath)
      .then(reg => {
        console.log('✅ ServiceWorker registrado');
        reg.update();
      })
      .catch(err => {
        console.log('❌ Error:', err);
      });
  });
}