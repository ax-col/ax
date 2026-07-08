async function iniciarAuditoriaAutomatica() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const statusDiv = document.getElementById('status');
    const tabla = document.getElementById('tabla-resultados');
    const cuerpo = document.getElementById('cuerpo-tabla');

    if (!email || !password) return alert("Por favor, completa ambos campos.");

    statusDiv.innerText = "⏳ Abriendo puente seguro con Udeki... No cierres las pestañas.";
    cuerpo.innerHTML = "";
    tabla.style.display = "none";

    // Creamos una ventana emergente oculta/pequeña para interactuar con la sesión real del usuario
    const udekiWindow = window.open('https://app.udeki.com/login', 'UdekiBridge', 'width=400,height=400,opacity=0');

    if (!udekiWindow) {
        statusDiv.innerText = "";
        return alert("⚠️ Por favor, permite los permisos de ventanas emergentes (pop-ups) en tu navegador para automatizar el proceso.");
    }

    // Esperamos a que cargue la página de Udeki e inyectamos las credenciales de forma humana
    const intervalo = setInterval(() => {
        try {
            if (udekiWindow.location.href.includes('login')) {
                const doc = udekiWindow.document;
                const emailInput = doc.querySelector('input[type="email"]') || doc.querySelector('input[name="email"]');
                const passInput = doc.querySelector('input[type="password"]');
                const btnSubmit = doc.querySelector('button[type="submit"]');

                if (emailInput && passInput && btnSubmit) {
                    emailInput.value = email;
                    passInput.value = password;
                    clearInterval(intervalo);
                    btnSubmit.click(); // Iniciamos sesión de forma nativa con sus cookies legítimas
                    
                    // Esperamos a que pase al panel de calificaciones
                    esperarCalificaciones(udekiWindow, statusDiv, tabla, cuerpo);
                }
            }
        } catch (e) {
            // Ignoramos errores de carga temporal entre transiciones de páginas
        }
    }, 1000);
}

function esperarCalificaciones(udekiWindow, statusDiv, tabla, cuerpo) {
    let intentos = 0;
    const checkNotas = setInterval(() => {
        intentos++;
        try {
            // Si el login fue exitoso, lo redirigimos a la sección interna de notas si no va solo
            if (udekiWindow.location.pathname.includes('home') || udekiWindow.location.pathname === '/') {
                udekiWindow.location.href = 'https://app.udeki.com/desempenio/estudiante';
            }

            // Buscamos las asignaturas directamente en la memoria global de la pestaña (la mina de oro que descubrimos)
            const notasCargadas = udekiWindow.asignaturas || udekiWindow.asignaturasMv || null;

            if (notasCargadas && notasCargadas.length > 0) {
                clearInterval(checkNotas);
                statusDiv.innerText = "✅ ¡Datos recuperados con éxito!";
                udekiWindow.close(); // Cerramos la pestaña fantasma automáticamente

                // Pintamos los datos directamente en tu hermosa interfaz
                procesarYRenderizar(notasCargadas, tabla, cuerpo);
            }
        } catch (e) {
            // Manejo de seguridad del navegador
        }

        if (intentos > 15) {
            clearInterval(checkNotas);
            udekiWindow.close();
            statusDiv.innerText = "❌ Tiempo de espera agotado. Revisa tus credenciales directamente en Udeki.";
        }
    }, 1500);
}

function procesarYRenderizar(asignaturas, tabla, cuerpo) {
    tabla.style.display = "table";
    
    asignaturas.forEach(materia => {
        let logrados = 0;
        let periodos = materia.periodos || [];
        
        periodos.forEach(p => {
            let logros = p.logros || [];
            logros.forEach(l => {
                if (['SUPERIOR', 'ALTO', 'BASICO'].includes(l.nombre_escala)) {
                    logrados++;
                }
            });
        });

        const meta = 4; // Tu regla matemática del 80%
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${materia.asignatura || materia.nombre}</strong></td>
            <td>${materia.nota || logrados}</td>
            <td>${meta}</td>
            <td><span class="${logrados >= meta ? 'cumple' : 'alerta'}">${logrados >= meta ? 'CUMPLE ✅' : 'ALERTA ❌'}</span></td>
        `;
        cuerpo.appendChild(fila);
    });
}