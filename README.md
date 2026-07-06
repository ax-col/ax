# Subir los cambios a GitHub
git pull origin main # Actualizar repositorio global
git status
git add .
git commit -m "Update Web or App"
git push

# Ubicación Local com.ax.col
storage/downloads/AX-Root/AX_APP/ 

# EJECUTAR PARA ACTUALIZAR APP TERMUX
cd storage/downloads/AX-Root/AX_APP/
bash compilar.sh

# Visualizar Estructura
find . -maxdepth 3 -not -path '*/.*'

# AX
Plataforma Web de Ayuda Comunitaria
AX es una plataforma web progresiva pensada para ayudar a la comunidad. Centraliza información, recursos y ubicaciones locales en un solo lugar.
#Estructura AX WEB
#![Estructura del Proyecto WEB](png-principal/ax_web.png)
#Estructura AX APK
#![Estructura del Proyecto APK](png-principal/ax_apk.png)

# Características
- **PWA**: Instalable desde el navegador. Usa `manifest.json` y `sw.js` para funcionar offline.
- **Módulo Orito**: Muestra en `Orito/index.html` ubicaciones de sitios que Google no lista. Enfocado en ayuda local y puntos comunitarios.
- **Módulos**: Varias secciones independientes en carpetas para organizar contenido.
- **Gestor de versiones**: `version-manager.js` + `version.json` para controlar actualizaciones.
- **Multimedia**: Carpeta `AX-Files/` con videos informativos.

# Como Clonar
git clone https://github.com/ax-col/ax.git
cd ax

# Tecnologías
- HTML5, CSS3, JavaScript Vanilla
- PWA: Manifest + Service Worker
- Python y Java para utilidades y servicios
- Videos MP4 para contenido

---
Hecho para la comunidad.
