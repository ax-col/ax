const videosDesktop = [
  "AX NAVEGADOR/CN1.mp4",
  "AX NAVEGADOR/CN2.mp4", 
  "AX NAVEGADOR/CN3.mp4",
  "AX NAVEGADOR/CN4.mp4",
  "AX NAVEGADOR/CN5.mp4",
  "AX NAVEGADOR/CN6.mp4" 
];

const videosMobile = [
  "AX NAVEGADOR/BG.mp4"
];

const isDesktop = window.innerWidth >= 768;
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

// Configurar video según dispositivo
function configurarVideo() {
  if (isDesktop) {
    videoElement = document.getElementById("videoDesktop");
    videoSource = document.getElementById("videoSourceDesktop");
    currentVideoIndex = Math.floor(Math.random() * videosDesktop.length);
    videoSource.src = videosDesktop[currentVideoIndex];
    document.getElementById('infoVideo').textContent = `Video actual: CN${currentVideoIndex + 1}.mp4`;
  } else {
    videoElement = document.getElementById("videoMobile");
    videoSource = document.getElementById("videoSourceMobile");
    videoSource.src = videosMobile[Math.floor(Math.random() * videosMobile.length)];
    document.getElementById('infoVideo').textContent = `Video actual: BG.mp4`;
  }
  videoElement.style.display = "block";
  videoElement.load();
}

// Función de mute toggle
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

// Cambiar video (solo escritorio)
window.cambiarVideo = function(rutaVideo, indice) {
  if (!isDesktop) return;
  videoSource.src = rutaVideo;
  videoElement.load();
  videoElement.play();
  
  document.getElementById('infoVideo').textContent = `Video actual: CN${indice + 1}.mp4`;
  
  botonesVideo.forEach(btn => btn.classList.remove('activo'));
  if (botonesVideo[indice]) {
    botonesVideo[indice].classList.add('activo');
  }
  
  currentVideoIndex = indice;
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
