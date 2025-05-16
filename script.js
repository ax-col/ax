// ============ ANIMACIÓN DE TEXTO ============
document.addEventListener('DOMContentLoaded', function() {
  const textElement = document.getElementById('animated-text');
  if (textElement) { // Verifica si el elemento existe
    const text = textElement.textContent;
    const letters = text.split('');

    // Limpiar y envolver cada letra en un <span>
    textElement.textContent = '';
    letters.forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      textElement.appendChild(span);
    });

    // Animación tipo cortina
    function changeColor() {
      const spans = textElement.querySelectorAll('span');
      let currentIndex = 0;

      setInterval(() => {
        spans.forEach(span => span.className = '');
        for (let i = currentIndex; i < currentIndex + 3 && i < spans.length; i++) {
          spans[i].classList.add('color-red1');
        }
        currentIndex = (currentIndex + 1) % spans.length;
      }, 150);
    }

    changeColor();
  }
});

// ============ SERVICE WORKER ============
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(
      function(registration) {
        console.log('ServiceWorker registrado con éxito: ', registration.scope);
      },
      function(err) {
        console.log('Error al registrar ServiceWorker: ', err);
      }
    );
  });
}