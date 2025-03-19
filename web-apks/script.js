// Espera 5 minutos (300,000 ms) antes de redirigir
window.onload = function() {
  setTimeout(function() {
    
    // Redirige a index2.html después de 5 minutos
    window.location.href = "index2.html";
  }, 3000);  // 3000ms = 3 segundos
};