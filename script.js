
const textElement = document.getElementById('animated-text');
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