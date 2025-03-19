// script.js

function updateMetrics() {
    // Simular la calidad del Internet (valor entre 0 y 1, donde 1 es la mejor calidad)
    const internetQuality = Math.random();

    // Generar valores de velocidad en Kb/s, con un máximo de 10 MB/s (10,000 Kb/s)
    const maxSpeedKb = 1500; // 5 MB en Kb
    const downloadSpeedKb = (internetQuality * maxSpeedKb).toFixed(2);
    const uploadSpeedKb = (internetQuality * maxSpeedKb).toFixed(2);

    // Convertir y mostrar velocidades
    document.getElementById('download').innerText = formatSpeed(downloadSpeedKb);
    document.getElementById('upload').innerText = formatSpeed(uploadSpeedKb);

    // Calcular ping
    const startTime = Date.now();
    const imageUrl = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";

    fetch(imageUrl, { mode: 'no-cors' })
        .then(() => {
            const endTime = Date.now();
            let ping = endTime - startTime;

            // Limitar el valor del ping a un máximo de 999 ms
            ping = Math.min(Math.round(ping), 999);

            // Mostrar el ping en la página
            document.getElementById('ping').textContent = `Ping: ${ping} ms`;
        })
        .catch(() => {
            document.getElementById('ping').textContent = "Ping: Error al calcular.";
        });
}

// Función para formatear la velocidad en Kb/s o MB/s
function formatSpeed(speedKb) {
    const speed = parseFloat(speedKb);
    if (speed >= 1000) {
        // Convertir a MB si la velocidad es mayor o igual a 1000 Kb
        return `${(speed / 1000).toFixed(2)} MB/s`;
    } else {
        // Mostrar en Kb si la velocidad es menor a 1000 Kb
        return `${speed.toFixed(2)} Kb/s`;
    }
}

// Efecto de cortina de tres letras en texto
const textElement = document.getElementById('animated-text');
const text = textElement.textContent;
const letters = text.split('');

// Limpiamos el contenido y envolvemos cada letra en un <span>
textElement.textContent = '';
letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    textElement.appendChild(span);
});

// Función para aplicar el efecto de cortina de tres letras
function changeColor() {
    const spans = textElement.querySelectorAll('span');
    let currentIndex = 0;

    const interval = setInterval(() => {
        spans.forEach(span => span.className = '');
        for (let i = currentIndex; i < currentIndex + 3 && i < spans.length; i++) {
            spans[i].classList.add('color-red1');
        }
        currentIndex++;
        if (currentIndex >= spans.length) {
            currentIndex = 0;
        }
    }, 150);
}

// Temporizador desde una fecha específica
function startTimer() {
    const startDate = new Date("2024-09-22T15:10:00");
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const specialButton = document.getElementById('special-button');

    function updateTimer() {
        const now = new Date();
        const elapsedTime = Math.floor((now - startDate) / 1000);

        let days = Math.floor(elapsedTime / 86400);
        let hours = Math.floor((elapsedTime % 86400) / 3600);
        let minutes = Math.floor((elapsedTime % 3600) / 60);
        let seconds = elapsedTime % 60;

        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');

        // Mostrar el botón entre 9:15 AM y 3:30 PM
        const startHour = 9;
        const startMinute = 15;
        const endHour = 15;
        const endMinute = 30;

        if (
            (now.getHours() > startHour || (now.getHours() === startHour && now.getMinutes() >= startMinute)) &&
            (now.getHours() < endHour || (now.getHours() === endHour && now.getMinutes() <= endMinute))
        ) {
            specialButton.style.display = 'block';
        } else {
            specialButton.style.display = 'none';
        }
    }

    setInterval(updateTimer, 500);
}

// Iniciar funciones cuando la página cargue
window.onload = () => {
    setInterval(updateMetrics, 500); // Actualizar métricas cada segundo
    changeColor(); // Iniciar el efecto de cortina de letras
    startTimer(); // Iniciar temporizador
};