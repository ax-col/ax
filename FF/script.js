/* =========================
   CONFIGURACIÓN DE FECHAS
========================= */
const startDates = {
    creador: new Date(2017, 11, 3, 21, 37, 23),     // 3 DIC 2017
    "mod-br": new Date(2018, 4, 20, 0, 58, 10),    // 20 MAY 2018
    "mod-us": new Date(2018, 4, 21, 19, 39, 36),   // 21 MAY 2018
    cuenta1: new Date(2021, 3, 19, 20, 35, 57),    // 19 ABR 2021
    cuenta2: new Date(2023, 6, 29, 22, 1, 12),     // 29 JUL 2023
    cuenta3: new Date(2023, 7, 13, 15, 7, 37),     // 13 AGO 2023
    cuenta4: new Date(2026, 0, 2, 13, 13, 0),     // 2 ENE 2026
    cuenta5: new Date(2026, 0, 2, 13, 14, 0),     // 2 ENE 2026
    cuenta6: new Date(2026, 0, 2, 13, 15, 0)      // 2 ENE 2026
};

/* =========================
   VARIABLES GLOBALES
========================= */
let previousValues = {};
let wakeLock = null;

/* =========================
   WAKELOCK - EVITAR APAGADO DE PANTALLA
========================= */
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock activado - Pantalla no se apagará');
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

function handleVisibilityChange() {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().then(() => wakeLock = null);
    }
}

/* =========================
   FUNCIÓN PARA AÑOS BISIESTOS
========================= */
function esBisiesto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
}

/* =========================
   CALCULAR DIFERENCIA PRECISA
========================= */
function calculateCompleteTimeDifference(startDate) {
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    // Calcular años completos
    let years = now.getFullYear() - startDate.getFullYear();
    let meses = now.getMonth() - startDate.getMonth();
    let dias = now.getDate() - startDate.getDate();
    let horas = now.getHours() - startDate.getHours();
    let minutos = now.getMinutes() - startDate.getMinutes();
    let segundos = now.getSeconds() - startDate.getSeconds();
    
    // Ajustar segundos negativos
    if (segundos < 0) {
        segundos += 60;
        minutos--;
    }
    
    // Ajustar minutos negativos
    if (minutos < 0) {
        minutos += 60;
        horas--;
    }
    
    // Ajustar horas negativas
    if (horas < 0) {
        horas += 24;
        dias--;
    }
    
    // Ajustar días negativos
    if (dias < 0) {
        // Obtener días del mes anterior
        const ultimoDiaMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
        meses--;
    }
    
    // Ajustar meses negativos
    if (meses < 0) {
        meses += 12;
        years--;
    }
    
    // Convertir meses y días a días totales
    const diasEnMeses = meses * 30.44; // Promedio
    const totalDias = Math.floor(dias + diasEnMeses);
    
    // Separar años y días
    const añosFinales = years;
    const diasFinales = totalDias % 365;
    
    return { 
        years: añosFinales, 
        days: diasFinales, 
        hours: horas, 
        minutes: minutos, 
        seconds: segundos 
    };
}

/* =========================
   INICIALIZAR ESTRUCTURAS (5 UNIDADES)
========================= */
function initializeDisplays() {
    const displays = [
        'creador-display', 'mod-br-display', 'mod-us-display',
        'cuenta1-display', 'cuenta2-display', 'cuenta3-display',
        'cuenta4-display', 'cuenta5-display', 'cuenta6-display'
    ];
    
    displays.forEach(displayId => {
        const displayElement = document.getElementById(displayId);
        if (!displayElement) return;
        
        // Limpiar el display primero
        displayElement.innerHTML = '';
        
        const counterId = displayId.replace('-display', '');
        previousValues[counterId] = {
            years: '00',
            days: '000', // 3 dígitos para días (0-366)
            hours: '00',
            minutes: '00',
            seconds: '00'
        };
        
        // 5 UNIDADES: Años, Días, Horas, Minutos, Segundos
        const units = [
            { value: '00', label: 'A' },
            { value: '000', label: 'D' },
            { value: '00', label: 'H' },
            { value: '00', label: 'M' },
            { value: '00', label: 'S' }
        ];
        
        units.forEach((unit, index) => {
            const unitContainer = document.createElement('div');
            unitContainer.className = 'number-unit';
            
            const numberDisplay = document.createElement('div');
            numberDisplay.className = 'number-display';
            
            const unitTypes = ['years', 'days', 'hours', 'minutes', 'seconds'];
            numberDisplay.id = `${counterId}-${unitTypes[index]}`;
            
            // Ajustar ancho para días (3 dígitos)
            if (unit.label === 'D') {
                numberDisplay.style.width = '50px';
            }
            
            const currentDigit = document.createElement('div');
            currentDigit.className = 'number-digit current-digit';
            currentDigit.textContent = unit.value;
            
            numberDisplay.appendChild(currentDigit);
            unitContainer.appendChild(numberDisplay);
            
            const label = document.createElement('div');
            label.className = 'unit-label';
            label.textContent = unit.label;
            unitContainer.appendChild(label);
            
            displayElement.appendChild(unitContainer);
            
            if (index < units.length - 1) {
                const separator = document.createElement('div');
                separator.className = 'separator';
                separator.textContent = ':';
                displayElement.appendChild(separator);
            }
        });
    });
}

/* =========================
   ANIMAR TRANSICIÓN DE NÚMEROS
========================= */
function animateNumberChange(containerId, newValue) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const currentDigit = container.querySelector('.current-digit');
    if (!currentDigit) return;
    
    // Solo animar si el valor cambió
    if (currentDigit.textContent === newValue) return;
    
    const newDigit = document.createElement('div');
    newDigit.className = 'number-digit new-digit';
    newDigit.textContent = newValue;
    
    container.appendChild(newDigit);
    
    currentDigit.classList.add('rising');
    newDigit.classList.add('emerging');
    
    setTimeout(() => {
        currentDigit.classList.remove('rising');
        newDigit.classList.remove('emerging');
        
        currentDigit.textContent = newValue;
        
        if (newDigit.parentNode === container) {
            container.removeChild(newDigit);
        }
    }, 600);
}

/* =========================
   ACTUALIZAR TODOS LOS CONTADORES
========================= */
function updateAllCounters() {
    for (const counterId in startDates) {
        const timeDiff = calculateCompleteTimeDifference(startDates[counterId]);
        
        // Formatear valores
        const formattedValues = {
            years: String(timeDiff.years).padStart(2, '0'),
            days: String(timeDiff.days).padStart(3, '0'),
            hours: String(timeDiff.hours).padStart(2, '0'),
            minutes: String(timeDiff.minutes).padStart(2, '0'),
            seconds: String(timeDiff.seconds).padStart(2, '0')
        };
        
        // Actualizar cada unidad si cambió
        ['years', 'days', 'hours', 'minutes', 'seconds'].forEach(unit => {
            const elementId = `${counterId}-${unit}`;
            const currentValue = formattedValues[unit];
            
            if (previousValues[counterId] && previousValues[counterId][unit] !== currentValue) {
                animateNumberChange(elementId, currentValue);
                previousValues[counterId][unit] = currentValue;
            }
        });
    }
}

/* =========================
   INICIALIZAR Y EJECUTAR
========================= */
document.addEventListener('DOMContentLoaded', () => {
    initializeDisplays();
    updateAllCounters();
    setInterval(updateAllCounters, 1000);
    requestWakeLock();
    
    document.addEventListener('click', requestWakeLock);
    document.addEventListener('touchstart', requestWakeLock);
    document.addEventListener('keydown', requestWakeLock);
});

window.addEventListener('beforeunload', releaseWakeLock);