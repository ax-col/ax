// ======================================================
// VIDEOS, DETECCIÓN Y SISTEMA MULTI-DISPOSITIVO
// ======================================================

const videosPorDispositivo = {
  PC: ["AX-Files/AX-C1.mp4", "AX-Files/AX-C2.mp4", "AX-Files/AX-C3.mp4", "AX-Files/AX-C4.mp4"],
  MOVIL: ["AX-Files/AX-M1.mp4"]
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
// CONTADOR 2027 (CON ANIMACIÓN ORIGINAL)
// ======================================================
let previousTimerValues = { days: '00', hours: '00', minutes: '00', seconds: '00' };

function updateTimer() {
  const targetDate = new Date('2027-01-01T10:00:00').getTime();
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
    document.querySelectorAll('.timer-title').forEach(t => t.textContent = '¡BIENVENIDO 2027!');
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
// COMPONENTE DESPLEGABLE DE HORAS UTC POR PAÍS
// ======================================================
class UTCWidget {
  constructor() {
    this.container = document.getElementById('utcAccordion');
    this.data = [
      { label: "UTC -12", countries: [{ name: "Isla Baker", flag: "🇺🇲", timeZone: "Etc/GMT+12" }, { name: "Isla Howland", flag: "🇺🇲", timeZone: "Etc/GMT+12" }] },
      { label: "UTC -11", countries: [{ name: "Samoa Americana", flag: "🇦🇸", timeZone: "Pacific/Pago_Pago" }, { name: "Niue", flag: "🇳🇺", timeZone: "Pacific/Niue" }] },
      { label: "UTC -10", countries: [{ name: "EE.UU. (Hawái)", flag: "🇺🇸", timeZone: "Pacific/Honolulu" }, { name: "Polinesia Fr.", flag: "🇵🇫", timeZone: "Pacific/Tahiti" }, { name: "Islas Cook", flag: "🇨🇰", timeZone: "Pacific/Rarotonga" }] },
      { label: "UTC -9", countries: [{ name: "EE.UU. (Alaska)", flag: "🇺🇸", timeZone: "America/Anchorage" }, { name: "Islas Gambier", flag: "🇵🇫", timeZone: "Pacific/Gambier" }] },
      { label: "UTC -8", countries: [{ name: "EE.UU. (Pacífico)", flag: "🇺🇸", timeZone: "America/Los_Angeles" }, { name: "Canadá (Vancouver)", flag: "🇨🇦", timeZone: "America/Vancouver" }, { name: "México (Tijuana)", flag: "🇲🇽", timeZone: "America/Tijuana" }] },
      { label: "UTC -7", countries: [{ name: "EE.UU. (Montaña)", flag: "🇺🇸", timeZone: "America/Denver" }, { name: "México (Hermosillo)", flag: "🇲🇽", timeZone: "America/Hermosillo" }, { name: "Canadá (Calgary)", flag: "🇨🇦", timeZone: "America/Edmonton" }] },
      { label: "UTC -6", countries: [{ name: "México (CDMX)", flag: "🇲🇽", timeZone: "America/Mexico_City" }, { name: "Guatemala", flag: "🇬🇹", timeZone: "America/Guatemala" }, { name: "Costa Rica", flag: "🇨🇷", timeZone: "America/Costa_Rica" }, { name: "Honduras", flag: "🇭🇳", timeZone: "America/Tegucigalpa" }, { name: "El Salvador", flag: "🇸🇻", timeZone: "America/El_Salvador" }, { name: "Nicaragua", flag: "🇳🇮", timeZone: "America/Managua" }] },
      { label: "UTC -5", countries: [{ name: "Colombia", flag: "🇨🇴", timeZone: "America/Bogota" }, { name: "Perú", flag: "🇵🇪", timeZone: "America/Lima" }, { name: "Ecuador", flag: "🇪🇨", timeZone: "America/Guayaquil" }, { name: "Panamá", flag: "🇵🇦", timeZone: "America/Panama" }, { name: "Cuba", flag: "🇨🇺", timeZone: "America/Havana" }, { name: "EE.UU. (Este)", flag: "🇺🇸", timeZone: "America/New_York" }] },
      { label: "UTC -4", countries: [{ name: "Venezuela", flag: "🇻🇪", timeZone: "America/Caracas" }, { name: "Bolivia", flag: "🇧🇴", timeZone: "America/La_Paz" }, { name: "Chile", flag: "🇨🇱", timeZone: "America/Santiago" }, { name: "Rep. Dominicana", flag: "🇩🇴", timeZone: "America/Santo_Domingo" }, { name: "Puerto Rico", flag: "🇵🇷", timeZone: "America/Puerto_Rico" }, { name: "Paraguay", flag: "🇵🇾", timeZone: "America/Asuncion" }] },
      { label: "UTC -3", countries: [{ name: "Argentina", flag: "🇦🇷", timeZone: "America/Argentina/Buenos_Aires" }, { name: "Brasil (Brasilia)", flag: "🇧🇷", timeZone: "America/Sao_Paulo" }, { name: "Uruguay", flag: "🇺🇾", timeZone: "America/Montevideo" }] },
      { label: "UTC -2", countries: [{ name: "Brasil (Noronha)", flag: "🇧🇷", timeZone: "America/Noronha" }, { name: "Islas Sándwich", flag: "🇬🇸", timeZone: "Atlantic/South_Georgia" }] },
      { label: "UTC -1", countries: [{ name: "Cabo Verde", flag: "🇨🇻", timeZone: "Atlantic/Cape_Verde" }, { name: "Groenlandia", flag: "🇬🇱", timeZone: "America/Scoresbysund" }, { name: "Portugal (Açores)", flag: "🇵🇹", timeZone: "Atlantic/Azores" }] },
      { label: "UTC ±0", countries: [{ name: "Reino Unido", flag: "🇬🇧", timeZone: "Europe/London" }, { name: "Portugal", flag: "🇵🇹", timeZone: "Europe/Lisbon" }, { name: "Irlanda", flag: "🇮🇪", timeZone: "Europe/Dublin" }, { name: "Marruecos", flag: "🇲🇦", timeZone: "Africa/Casablanca" }, { name: "Ghana", flag: "🇬🇭", timeZone: "Africa/Accra" }, { name: "Islandia", flag: "🇮🇸", timeZone: "Atlantic/Reykjavik" }] },
      { label: "UTC +1", countries: [{ name: "España (Madrid)", flag: "🇪🇸", timeZone: "Europe/Madrid" }, { name: "Alemania", flag: "🇩🇪", timeZone: "Europe/Berlin" }, { name: "Francia", flag: "🇫🇷", timeZone: "Europe/Paris" }, { name: "Italia", flag: "🇮🇹", timeZone: "Europe/Rome" }, { name: "Nigeria", flag: "🇳🇬", timeZone: "Africa/Lagos" }, { name: "Argelia", flag: "🇩🇿", timeZone: "Africa/Algiers" }] },
      { label: "UTC +2", countries: [{ name: "Egipto", flag: "🇪🇬", timeZone: "Africa/Cairo" }, { name: "Grecia", flag: "🇬🇷", timeZone: "Europe/Athens" }, { name: "Sudáfrica", flag: "🇿🇦", timeZone: "Africa/Johannesburg" }, { name: "Ucrania", flag: "🇺🇦", timeZone: "Europe/Kyiv" }, { name: "Israel", flag: "🇮🇱", timeZone: "Asia/Jerusalem" }] },
      { label: "UTC +3", countries: [{ name: "Rusia (Moscú)", flag: "🇷🇺", timeZone: "Europe/Moscow" }, { name: "Arabia Saudita", flag: "🇸🇦", timeZone: "Asia/Riyadh" }, { name: "Turquía", flag: "🇹🇷", timeZone: "Europe/Istanbul" }, { name: "Kenia", flag: "🇰🇪", timeZone: "Africa/Nairobi" }] },
      { label: "UTC +4", countries: [{ name: "Emiratos Árabes", flag: "🇦🇪", timeZone: "Asia/Dubai" }, { name: "Georgia", flag: "🇬🇪", timeZone: "Asia/Tbilisi" }, { name: "Azerbaiyán", flag: "🇦🇿", timeZone: "Asia/Baku" }] },
      { label: "UTC +5", countries: [{ name: "Pakistán", flag: "🇵🇰", timeZone: "Asia/Karachi" }, { name: "Uzbekistán", flag: "🇺🇿", timeZone: "Asia/Tashkent" }] },
      { label: "UTC +6", countries: [{ name: "Bangladés", flag: "🇧🇩", timeZone: "Asia/Dhaka" }, { name: "Kazajistán", flag: "🇰🇿", timeZone: "Asia/Almaty" }] },
      { label: "UTC +7", countries: [{ name: "Tailandia", flag: "🇹🇭", timeZone: "Asia/Bangkok" }, { name: "Vietnam", flag: "🇻🇳", timeZone: "Asia/Ho_Chi_Minh" }, { name: "Indonesia", flag: "🇮🇩", timeZone: "Asia/Jakarta" }] },
      { label: "UTC +8", countries: [{ name: "China (Pekín)", flag: "🇨🇳", timeZone: "Asia/Shanghai" }, { name: "Singapur", flag: "🇸🇬", timeZone: "Asia/Singapore" }, { name: "Filipinas", flag: "🇵🇭", timeZone: "Asia/Manila" }, { name: "Malasia", flag: "🇲🇾", timeZone: "Asia/Kuala_Lumpur" }] },
      { label: "UTC +9", countries: [{ name: "Japón", flag: "🇯🇵", timeZone: "Asia/Tokyo" }, { name: "Corea del Sur", flag: "🇰🇷", timeZone: "Asia/Seoul" }] },
      { label: "UTC +10", countries: [{ name: "Australia (Sídney)", flag: "🇦🇺", timeZone: "Australia/Sydney" }, { name: "Papúa N. Guinea", flag: "🇵🇬", timeZone: "Pacific/Port_Moresby" }] },
      { label: "UTC +11", countries: [{ name: "Nueva Caledonia", flag: "🇳🇨", timeZone: "Pacific/Noumea" }, { name: "Islas Salomón", flag: "🇸🇧", timeZone: "Pacific/Guadalcanal" }] },
      { label: "UTC +12", countries: [{ name: "Nueva Zelanda", flag: "🇳🇿", timeZone: "Pacific/Auckland" }, { name: "Fiyi", flag: "🇫🇯", timeZone: "Pacific/Fiji" }] },
      { label: "UTC +13", countries: [{ name: "Samoa", flag: "🇼🇸", timeZone: "Pacific/Apia" }, { name: "Tonga", flag: "🇹🇴", timeZone: "Pacific/Tongatapu" }] },
      { label: "UTC +14", countries: [{ name: "Kiribati", flag: "🇰🇮", timeZone: "Pacific/Kiritimati" }] }
    ];
    if (this.container) this.init();
  }

  init() {
    this.render();
    this.startClock();
    this.setupInteractions();
  }

  render() {
    this.container.innerHTML = "";
    this.data.forEach((group, gIdx) => {
      const card = document.createElement('div');
      card.className = "utc-card";
      
      const utcClean = group.label.replace("UTC", "").replace("±", "").trim();
      card.setAttribute('data-utc', utcClean);

      const header = document.createElement('div');
      header.className = "utc-card-header";
      header.innerHTML = `
        <span class="utc-card-title">${group.label}</span>
        <span class="utc-card-arrow">▼</span>
      `;

      const content = document.createElement('div');
      content.className = "utc-card-content";

      group.countries.forEach((c, cIdx) => {
        const row = document.createElement('div');
        row.className = "utc-country-row";
        row.innerHTML = `
          <span class="utc-country-name">
            <span class="utc-flag">${c.flag}</span> ${c.name}
          </span>
          <span class="utc-country-time" id="utc-time-${gIdx}-${cIdx}">--:--:--</span>
        `;
        content.appendChild(row);
      });

      card.appendChild(header);
      card.appendChild(content);
      this.container.appendChild(card);
    });
  }

setupInteractions() {
    const cards = Array.from(this.container.querySelectorAll('.utc-card'));
    let isWidgetActive = false; // Estado para saber si el usuario interactuó

    // 1. Rueda del ratón para scroll horizontal en PC
    this.container.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      this.container.scrollLeft += evt.deltaY;
    });

    // 2. Función para actualizar aperturas según el scroll (solo si está activo)
    const updateActiveBlockOnScroll = () => {
      if (!isWidgetActive) return; // Si no hay clic activo, se mantienen cerradas

      const containerRect = this.container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      // Buscar el UTC más cercano al centro
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      // Abrir el centro + 2 izq + 2 der
      cards.forEach((card, i) => {
        if (i === closestIndex) {
          card.classList.add('open', 'active-focus');
          card.classList.remove('neighbor-focus', 'dimmed');
        } else if (i >= closestIndex - 2 && i <= closestIndex + 2) {
          card.classList.add('open', 'neighbor-focus');
          card.classList.remove('active-focus', 'dimmed');
        } else {
          card.classList.remove('open', 'active-focus', 'neighbor-focus');
          card.classList.add('dimmed');
        }
      });
    };

    // 3. Detectar scroll fluido
    let isTicking = false;
    this.container.addEventListener('scroll', () => {
      if (isWidgetActive && !isTicking) {
        window.requestAnimationFrame(() => {
          updateActiveBlockOnScroll();
          isTicking = false;
        });
        isTicking = true;
      }
    });

    // 4. Lógica de Clic (Abrir / Cerrar todo)
    cards.forEach((card) => {
      const header = card.querySelector('.utc-card-header');
      header.addEventListener('click', () => {
        const isCurrentActive = card.classList.contains('active-focus');

        if (isCurrentActive) {
          // SI SE VUELVE A CLICAR EL ACTIVO: Cierra absolutamente todo
          isWidgetActive = false;
          cards.forEach(c => c.classList.remove('open', 'active-focus', 'neighbor-focus', 'dimmed'));
        } else {
          // SI SE CLICA UNO NUEVO: Activa el modo de interacción y desplaza
          isWidgetActive = true;
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          
          // Ejecutamos la actualización tras un leve delay para dejar que termine la animación del scroll
          setTimeout(() => updateActiveBlockOnScroll(), 150);
        }
      });
    });

    // 5. Al cargar: Solo centra UTC 0 en pantalla, pero lo MANTIENE CERRADO
    setTimeout(() => {
      this.centerUTCZero();
    }, 250);
  }

  centerUTCZero() {
    const utcZeroCard = this.container.querySelector('[data-utc="0"]');
    if (utcZeroCard) {
      utcZeroCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  updateTimes() {
    const now = new Date();
    this.data.forEach((group, gIdx) => {
      group.countries.forEach((c, cIdx) => {
        const el = document.getElementById(`utc-time-${gIdx}-${cIdx}`);
        if (el) {
          try {
            const timeStr = new Intl.DateTimeFormat('es-CO', {
              timeZone: c.timeZone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }).format(now);
            el.textContent = timeStr;
          } catch(e) {
            el.textContent = "--:--:--";
          }
        }
      });
    });
  }

  startClock() {
    this.updateTimes();
    setInterval(() => this.updateTimes(), 1000);
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

  window.utcWidget = new UTCWidget();
});