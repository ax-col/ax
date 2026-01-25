// VIDEO PARA TODOS LOS DISPOSITIVOS
const todosLosVideos = [
  "AX NAVEGADOR/CN1.mp4",
  "AX NAVEGADOR/CN2.mp4", 
  "AX NAVEGADOR/CN3.mp4",
  "AX NAVEGADOR/CN4.mp4",
  "AX NAVEGADOR/CN5.mp4",
  "AX NAVEGADOR/CN6.mp4", 
  "AX NAVEGADOR/CN7.mp4",
  "AX NAVEGADOR/BG.mp4"  // Incluimos también el BG
];

let videoElement, videoSource;
let currentVideoIndex = 0;
let botonesVideo = [];

// Inicializar los botones CN
function inicializarBotonesCN() {
  botonesVideo = document.querySelectorAll('.btn-video');

  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo.length > 0 && botonesVideo[currentVideoIndex]) {
    botonesVideo[currentVideoIndex].classList.add('activo');
  }
}

// Configurar video PARA TODOS LOS DISPOSITIVOS
function configurarVideo() {
  // USAR SIEMPRE EL VIDEO DESKTOP (EL MISMO PARA TODOS)
  videoElement = document.getElementById("videoDesktop");
  videoSource = document.getElementById("videoSourceDesktop");
  
  // Elegir un video al azar de TODA la lista
  currentVideoIndex = Math.floor(Math.random() * todosLosVideos.length);
  videoSource.src = todosLosVideos[currentVideoIndex];
  
  // Actualizar información
  const nombreVideo = todosLosVideos[currentVideoIndex].split('/').pop();
  document.getElementById('infoVideo').textContent = `Video actual: ${nombreVideo}`;
  
  // Mostrar siempre el video
  videoElement.style.display = "block";
  videoElement.load();
  
  // OCULTAR EL MENSAJE DE "solo escritorio" en móviles
  document.querySelector('.mensaje-movil').style.display = "none";
}

// Función de mute toggle (igual que antes)
window.toggleMute = function() {
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

// Cambiar video - FUNCIONA EN TODOS LOS DISPOSITIVOS AHORA
window.cambiarVideo = function(rutaVideo, indice) {
  // ELIMINAMOS LA RESTRICCIÓN "if (!isDesktop) return;"
  videoSource.src = rutaVideo;
  videoElement.load();
  videoElement.play();

  const nombreVideo = rutaVideo.split('/').pop();
  document.getElementById('infoVideo').textContent = `Video actual: ${nombreVideo}`;

  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo[indice]) {
    botonesVideo[indice].classList.add('activo');
  }

  currentVideoIndex = indice;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    if (regs.length > 0) {
      console.log('✅ Service Worker ACTIVO:', regs);
      alert('Service Worker ACTIVO');
    } else {
      console.log('❌ No hay Service Worker');
      alert('NO hay Service Worker');
    }
  });
}

// Animación de texto
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

// Recarga automática al detectar cambios en version.txt
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

// Registrar service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('ServiceWorker registrado con éxito: ', reg.scope))
      .catch(err => console.log('Error al registrar ServiceWorker: ', err));
  });
}

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
  configurarVideo();
  inicializarBotonesCN();
  animarTexto();
  videoElement.play().catch(() => console.log('Autoplay bloqueado'));
});

/*
|======================================================|
| LÓGICA DEL TEMPORIZADOR (ANIMACIÓN DE CAÍDA)         |
|======================================================|
*/

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