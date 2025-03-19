const toggleBtn = document.getElementById('toggle-btn');
        const toggleIcon = document.getElementById('toggle-icon');
        const dropdownContent = document.getElementById('dropdown-content');

        toggleBtn.addEventListener('click', () => {
            toggleIcon.classList.toggle('active');
            dropdownContent.classList.toggle('active');
        });

const cursor = document.querySelector('.cursor');

// Posicionar el cursor en el centro al cargar la página
window.addEventListener('load', () => {
  cursor.style.left = '50%';
  cursor.style.top = '50%';
});

// Mover el cursor con el ratón
document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.pageX}px`;
  cursor.style.top = `${e.pageY}px`;
});

// Cambiar tamaño al hacer clic
document.addEventListener('mousedown', () => {
  cursor.style.width = '25px';
  cursor.style.height = '25px';
});

document.addEventListener('mouseup', () => {
  cursor.style.width = '30px';
  cursor.style.height = '30px';
});