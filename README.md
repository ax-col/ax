# Subir los cambios a GitHub
git status
git add .
git commit -m "Update all"
git push

# Ubicación Local com.ax.col
storage/downloads/AX-Root/AX_APP/ 

# EJECUTAR PARA ACTUALIZAR APP TERMUX
cd storage/downloads/AX-Root/AX_APP/
bash compilar.sh

# Visualizar Estructura
find . -maxdepth 3 -not -path '*/.*'

# AX
# Plataforma Web de Ayuda Comunitaria
AX es una plataforma web progresiva pensada para ayudar a la comunidad. Centraliza información, recursos y ubicaciones locales en un solo lugar.

# Características
- **PWA**: Instalable desde el navegador. Usa `manifest.json` y `sw.js` para funcionar offline.
- **Módulo Orito**: Muestra en `Orito/index.html` ubicaciones de sitios que Google no lista. Enfocado en ayuda local y puntos comunitarios.
- **Módulos**: Varias secciones independientes en carpetas para organizar contenido.
- **Gestor de versiones**: `version-manager.js` + `version.json` para controlar actualizaciones.
- **Multimedia**: Carpeta `AX-Files/` con videos informativos.


# Como Clonar
git clone https://github.com/ax-col/ax.git
cd ax

# Estructura del Proyecto
ax/
├── .
├── .git
├── Apk.java
├── AX-Service.java
├── AX.py
├── index.html
├── main_ax.html
├── manifest.json
├── README.md
├── repomix-output.xml
├── rf.html
├── script.js
├── styles.css
├── sw.js
├── version-manager.js
├── version.json
├── AX-Root/
│   ├── *
│   └── AndroidManifest.xml
├── CPWEB/
│   ├── index.html
│   ├── index1.html
│   ├── index2.html
│   ├── index3.html
│   ├── index4.html
│   ├── script.js
│   ├── styles.css
│   └── styles2.css
├── Windows/
│   ├── index.html
│   └── styles.css
├── Orito/
│   └── index.html
├── Testeo
│   ├── scripts/
│   ├── styles/
│   │   └── styles.css
│   └── index.html
├── Curts/
│   ├── index.html
│   └── styles.css
├── FF
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── AX-Files/
│   ├── AX-C1.mp4
│   ├── AX-C2.mp4
│   ├── AX-C3.mp4
│   ├── AX-M1.mp4
│   ├── AX-M2.mp4
│   ├── AX-M3.mp4
│   └── AX-M4.mp4
└── png-principal/
    ├── icon-192x192.png
    └── icon-512x512.png

# Tecnologías
- HTML5, CSS3, JavaScript Vanilla
- PWA: Manifest + Service Worker
- Python y Java para utilidades y servicios
- Videos MP4 para contenido

#
.
./.git
./orito
./orito/index.html
./CPWEB
./CPWEB/index.html
./CPWEB/index1.html
./CPWEB/index2.html
./CPWEB/index3.html
./CPWEB/index4.html
./CPWEB/script.js
./CPWEB/styles.css
./CPWEB/styles2.css
./FF
./FF/index.html
./FF/script.js
./FF/styles.css
./README.md
./Windows
./Windows/index.html
./Windows/styles.css
./AX.py
./curts
./curts/index.html
./curts/styles.css
./main_ax.html
./index.html
./manifest.json
./AX-Files
./AX-Files/AX-C1.mp4
./AX-Files/AX-C2.mp4
./AX-Files/AX-C3.mp4
./AX-Files/AX-M1.mp4
./AX-Files/AX-M2.mp4
./AX-Files/AX-M3.mp4
./AX-Files/AX-M4.mp4
./base.apk
./rf.html
./script.js
./styles.css
./sw.js
./version-manager.js
./version.json
./repomix-output.xml
./png-principal
./png-principal/icon-192x192.png
./png-principal/icon-512x512.png
---
Hecho para la comunidad.
