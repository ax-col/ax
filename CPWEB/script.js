function updateMetrics() {
    // Generar valores de velocidad
    const downloadSpeed = Math.random() * 100;
    const uploadSpeed = Math.random() * 50;

    // Actualizar valores de subida y descarga
    document.getElementById('download').innerText = downloadSpeed.toFixed(2);
    document.getElementById('upload').innerText = uploadSpeed.toFixed(2);

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

  }

// Ejecutar la actualización de métricas cada segundo
window.onload = () => {
    setInterval(updateMetrics, 1000);
};