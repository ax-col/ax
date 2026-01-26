// ======================================================
// VIDEOS POR ORIENTACIÓN - NUEVA ESTRUCTURA
// ======================================================

// VIDEOS QUE REALMENTE TIENES
const videosDesktop = [
  "AX-Files/AX-C1.mp4",
  "AX-Files/AX-C2.mp4", 
  "AX-Files/AX-C3.mp4",
  "AX-Files/AX-C4.mp4",
  "AX-Files/AX-C5.mp4",
  "AX-Files/AX-C6.mp4"  // ¡Añade este!
];

const videosMobile = [
  "AX-Files/AX-M1.mp4",
  "AX-Files/AX-M2.mp4"
  // NO incluir AX-M3.mp4, AX-M4.mp4, AX-M5.mp4 si no existen
];
const videosHorizontal = videosDesktop;
const videosVertical = videosMobile;

// ======================================================
// FUNCIONES DE DETECCIÓN
// ======================================================

// Detectar si es dispositivo móvil
function esDispositivoMovil() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// Detectar si está en orientación vertical
function esOrientacionVertical() {
  return window.innerHeight > window.innerWidth;
}

// Obtener lista de videos según orientación
function obtenerVideosSegunOrientacion() {
  // Si es móvil Y está en vertical, usar videos verticales
  if (esDispositivoMovil() && esOrientacionVertical()) {
    return {
      lista: videosVertical,
      tipo: 'vertical'
    };
  }
  
  // Para todo lo demás (PC, TV, móvil horizontal): videos horizontales
  return {
    lista: videosHorizontal,
    tipo: 'horizontal'
  };
}

// ======================================================
// VARIABLES GLOBALES
// ======================================================

let videoElement, videoSource;
let currentVideoIndex = 0;
let botonesVideo = [];
let listaVideosActual = videosHorizontal;
let tipoVideoActual = 'horizontal';
let orientacionAnterior = esOrientacionVertical() ? 'vertical' : 'horizontal';

// ======================================================
// FUNCIONES PRINCIPALES
// ======================================================

// Inicializar los botones según la lista actual
function inicializarBotones() {
  botonesVideo = document.querySelectorAll('.btn-video');
  
  // Mostrar/ocultar botones según cantidad de videos
  botonesVideo.forEach((btn, index) => {
    if (index < listaVideosActual.length) {
      btn.style.display = 'inline-block';
      // Actualizar el onclick con el índice correcto
      const rutaVideo = listaVideosActual[index];
      btn.onclick = () => cambiarVideo(rutaVideo, index);
    } else {
      btn.style.display = 'none';
    }
  });
  
  // Activar el botón actual
  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo.length > 0 && botonesVideo[currentVideoIndex] && currentVideoIndex < listaVideosActual.length) {
    botonesVideo[currentVideoIndex].classList.add('activo');
  }
}

// Configurar video según orientación
function configurarVideo() {
  const seleccion = obtenerVideosSegunOrientacion();
  listaVideosActual = seleccion.lista;
  tipoVideoActual = seleccion.tipo;
  
  // USAR SIEMPRE EL VIDEO DESKTOP (EL MISMO PARA TODOS)
  videoElement = document.getElementById("videoDesktop");
  videoSource = document.getElementById("videoSourceDesktop");
  
  // Elegir un video al azar de la lista apropiada
  currentVideoIndex = Math.floor(Math.random() * listaVideosActual.length);
  videoSource.src = listaVideosActual[currentVideoIndex];
  
  // Actualizar información
  const nombreVideo = listaVideosActual[currentVideoIndex].split('/').pop();
  document.getElementById('infoVideo').textContent = 
    `Video ${tipoVideoActual}: ${nombreVideo}`;
  
  // Mostrar siempre el video
  videoElement.style.display = "block";
  videoElement.load();
  
  // OCULTAR EL MENSAJE DE "solo escritorio" en móviles
  const mensajeMovil = document.querySelector('.mensaje-movil');
  if (mensajeMovil) {
    mensajeMovil.style.display = "none";
  }
  
  // Inicializar botones apropiados
  inicializarBotones();
  
  // Ajustar CSS según orientación
  ajustarVideoPorOrientacion();
}

// Ajustar estilos del video según orientación
function ajustarVideoPorOrientacion() {
  if (!videoElement) return;
  
  if (tipoVideoActual === 'vertical') {
    // Para videos verticales en móvil
    videoElement.style.objectFit = 'contain'; // Mostrar completo sin recortar
    videoElement.style.backgroundColor = '#000'; // Fondo negro para bordes
    videoElement.style.maxHeight = '80vh'; // Limitar altura
  } else {
    // Para videos horizontales
    videoElement.style.objectFit = 'cover'; // Cubrir toda el área
    videoElement.style.backgroundColor = 'transparent';
    videoElement.style.maxHeight = '100vh';
  }
}

// Función de mute toggle
window.toggleMute = function() {
  if (!videoElement) return;
  
  const btn = document.querySelector('.mute-toggle');
  videoElement.muted = !videoElement.muted;

  if (videoElement.muted) {
    btn.textContent = 'ACTIVAR SONIDO';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
  } else {
    btn.textContent = 'SILENCIAR';
    btn.style.background = 'linear-gradient(135deg, #00FF00 0%, #4169E1 100%)';
  }
}

// Cambiar video según lista actual
window.cambiarVideo = function(rutaVideo, indice) {
  if (!videoElement || !videoSource) return;
  
  // Verificar que el índice esté en la lista actual
  if (indice >= listaVideosActual.length) {
    console.log('Índice fuera de rango:', indice);
    return;
  }
  
  videoSource.src = rutaVideo;
  videoElement.load();
  videoElement.play().catch(e => console.log('Error al reproducir:', e));

  const nombreVideo = rutaVideo.split('/').pop();
  document.getElementById('infoVideo').textContent = 
    `Video ${tipoVideoActual}: ${nombreVideo}`;

  // Activar botón correspondiente
  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo[indice]) {
    botonesVideo[indice].classList.add('activo');
  }

  currentVideoIndex = indice;
  ajustarVideoPorOrientacion();
}

// ======================================================
// DETECCIÓN DE CAMBIO DE ORIENTACIÓN
// ======================================================

// Detectar cambios de orientación (girar el móvil)
function verificarCambioOrientacion() {
  const nuevaOrientacion = esOrientacionVertical() ? 'vertical' : 'horizontal';
  
  if (nuevaOrientacion !== orientacionAnterior && esDispositivoMovil()) {
    console.log(`🔄 Cambio de orientación: ${orientacionAnterior} → ${nuevaOrientacion}`);
    orientacionAnterior = nuevaOrientacion;
    
    // Recargar video con nueva orientación
    configurarVideo();
    videoElement.play().catch(() => console.log('Autoplay bloqueado'));
  }
}

// ======================================================
// SERVICE WORKER
// ======================================================

// Registrar service worker PARA TODOS LOS DISPOSITIVOS
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // IMPORTANTE: Usar ruta absoluta para GitHub Pages
    const swPath = window.location.pathname.includes('/ax/') 
      ? '/ax/sw.js' 
      : '/sw.js';
    
    navigator.serviceWorker.register(swPath)
      .then(reg => {
        console.log('✅ ServiceWorker registrado con éxito en:', reg.scope);
        
        // Forzar actualización inmediata en todos los dispositivos
        reg.update();
        
        // Detectar y mostrar estado
        if (reg.active) {
          console.log('🟢 Service Worker ACTIVO en este dispositivo');
        }
      })
      .catch(err => {
        console.log('❌ Error al registrar ServiceWorker: ', err);
        // Intentar ruta alternativa
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('✅ SW registrado con ruta alternativa'))
          .catch(e => console.log('❌ Falló también la ruta alternativa'));
      });
  });
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
// RECARGA AUTOMÁTICA
// ======================================================

(function autoReloadOnChange() {
  let lastVersion = null;

  async function checkVersion() {
    try {
      const res = await fetch("version.txt", { cache: "no-store" });
      const currentVersion = (await res.text()).trim();
      if (!lastVersion) lastVersion = currentVersion;
      else if (lastVersion !== currentVersion) location.reload();
    } catch (err) {
      console.error("Error comprobando cambios:", err);
    }
  }

  setInterval(checkVersion, 5000);
})();

// ======================================================
// INICIALIZACIÓN GENERAL
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  // Configurar video
  configurarVideo();
  
  // Iniciar animación de texto
  animarTexto();
  
  // Intentar reproducir automáticamente
  if (videoElement) {
    videoElement.play().catch(() => console.log('Autoplay bloqueado'));
  }
  
  // Iniciar verificación de cambio de orientación
  setInterval(verificarCambioOrientacion, 500);
  
  // Forzar primer ajuste de orientación
  setTimeout(ajustarVideoPorOrientacion, 100);
});

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
            // Solo animar si el contenedor es visible (no está comentado)
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
                // Si está oculto/comentado, solo actualizar el texto sin animación compleja
                container.innerHTML = `<div class="time-value-inner">${formattedValue}</div>`;
            }
        });

        previousTimerValues[elementId] = formattedValue;
    }
}

// Iniciar temporizador si existen los elementos
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('seconds-container')) {
        updateTimer();
        setInterval(updateTimer, 1000);
    }
});
