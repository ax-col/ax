// ======================================================
// VIDEOS DISPONIBLES - DEFINIDOS POR TIPO
// ======================================================

const videosPorTipo = {
  'PC': [
    "AX-Files/AX-C1.mp4",
    "AX-Files/AX-C2.mp4", 
    "AX-Files/AX-C3.mp4",
    "AX-Files/AX-C4.mp4",
    "AX-Files/AX-C5.mp4",
    "AX-Files/AX-C6.mp4"
  ],
  'MOVIL': [
    "AX-Files/AX-M1.mp4",
    "AX-Files/AX-M2.mp4"
    // Solo M1 y M2 porque son los que existen
  ]
};

// ======================================================
// DETECCIÓN DE DISPOSITIVO
// ======================================================

function detectarDispositivo() {
  const esMovil = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                  window.innerWidth <= 768;
  return esMovil ? 'MOVIL' : 'PC';
}

// ======================================================
// VARIABLES GLOBALES
// ======================================================

let videoFondo = null;
let botonesVideo = [];
let tipoDispositivo = '';
let videosDisponibles = [];
let videoActualIndex = 0;

// ======================================================
// FUNCIONES PRINCIPALES
// ======================================================

function inicializarSistema() {
  // 1. Obtener video de fondo
  videoFondo = document.getElementById("videoFondo");
  
  // 2. Detectar dispositivo
  tipoDispositivo = detectarDispositivo();
  console.log(`📱 Dispositivo detectado: ${tipoDispositivo}`);
  
  // 3. Obtener lista de videos para este dispositivo
  videosDisponibles = videosPorTipo[tipoDispositivo];
  console.log(`🎬 Videos disponibles: ${videosDisponibles.length}`);
  
  // 4. Elegir un video ALEATORIO al inicio
  videoActualIndex = Math.floor(Math.random() * videosDisponibles.length);
  const videoAleatorio = videosDisponibles[videoActualIndex];
  
  // 5. Establecer el video de fondo
  videoFondo.src = videoAleatorio;
  videoFondo.load();
  
  // 6. Reproducir (con manejo de autoplay)
  const promesaReproduccion = videoFondo.play();
  if (promesaReproduccion !== undefined) {
    promesaReproduccion.catch(error => {
      console.log('⚠️ Autoplay bloqueado, requiere interacción del usuario');
      // Mostrar mensaje si es necesario
    });
  }
  
  // 7. Actualizar información
  actualizarInfoVideo(videoAleatorio);
  
  // 8. Configurar botones
  configurarBotones();
  
  // 9. Añadir evento para permitir reproducción con clic en cualquier lugar
  document.addEventListener('click', permitirReproduccion, { once: true });
}

function permitirReproduccion() {
  if (videoFondo.paused) {
    videoFondo.play().then(() => {
      console.log('▶️ Reproducción iniciada después de interacción del usuario');
    }).catch(e => {
      console.log('❌ Error al reproducir:', e);
    });
  }
}

function configurarBotones() {
  botonesVideo = document.querySelectorAll('.btn-video');
  
  // Mostrar/ocultar botones según videos disponibles
  botonesVideo.forEach((btn, index) => {
    if (index < videosDisponibles.length) {
      // MOSTRAR botón (tiene video disponible)
      btn.style.display = 'inline-block';
      btn.dataset.videoIndex = index;
      
      // Asignar evento de clic
      btn.onclick = () => {
        cambiarVideo(index);
      };
      
      // Marcar como activo si es el video actual
      if (index === videoActualIndex) {
        btn.classList.add('activo');
      } else {
        btn.classList.remove('activo');
      }
    } else {
      // OCULTAR botón (no hay video para este índice)
      btn.style.display = 'none';
    }
  });
}

function cambiarVideo(nuevoIndex) {
  if (nuevoIndex >= videosDisponibles.length) {
    console.log('❌ Índice de video no válido');
    return;
  }
  
  const nuevoVideo = videosDisponibles[nuevoIndex];
  console.log(`🔄 Cambiando a video: ${nuevoVideo}`);
  
  // Cambiar el video
  videoFondo.src = nuevoVideo;
  videoFondo.load();
  videoFondo.play().catch(e => {
    console.log('Error al reproducir nuevo video:', e);
  });
  
  // Actualizar índice actual
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
  const elementoInfo = document.getElementById('infoVideo');
  if (elementoInfo) {
    elementoInfo.textContent = `Video actual (${tipoDispositivo}): ${nombreVideo}`;
  }
}

// ======================================================
// TOGGLE MUTE (CONTROL DE SONIDO)
// ======================================================

window.toggleMute = function() {
  if (!videoFondo) return;

  const btn = document.querySelector('.mute-toggle');
  
  // Alternar mute
  videoFondo.muted = !videoFondo.muted;
  
  // Actualizar texto del botón
  if (videoFondo.muted) {
    btn.textContent = 'ACTIVAR SONIDO';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
  } else {
    btn.textContent = 'SILENCIAR';
    btn.style.background = 'linear-gradient(135deg, #FF0000 0%, #FF8800 100%)';
  }
}

// ======================================================
// ANIMACIÓN DE TEXTO (MANTENER)
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
// TEMPORIZADOR (MANTENER)
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
// SERVICE WORKER (OPCIONAL)
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
        console.log('❌ Error al registrar SW:', err);
      });
  });
}

// ======================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando sistema de video...');
  
  // 1. Inicializar sistema de video
  inicializarSistema();
  
  // 2. Iniciar animación de texto
  animarTexto();
  
  // 3. Iniciar temporizador
  if (document.getElementById('seconds-container')) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }
  
  // 4. Añadir botón de mute si existe
  const muteBtn = document.querySelector('.mute-toggle');
  if (muteBtn && videoFondo) {
    // Configurar estado inicial del botón
    muteBtn.textContent = videoFondo.muted ? 'ACTIVAR SONIDO' : 'SILENCIAR';
  }
});

// ======================================================
// MANEJO DE RECARGA/REDIMENSIONAMIENTO
// ======================================================

// Recargar video si cambia el tamaño de ventana (cambio de dispositivo simulado)
window.addEventListener('resize', () => {
  const nuevoTipo = detectarDispositivo();
  if (nuevoTipo !== tipoDispositivo) {
    console.log('🔄 Cambio de dispositivo detectado, recargando...');
    setTimeout(() => {
      location.reload();
    }, 500);
  }
});