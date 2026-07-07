import os
import sys
import subprocess
import time

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')

def ejecutar_comando(comando):
    try:
        subprocess.run(comando, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        print(f"\n❌ Error al ejecutar: {comando}")
        input("\nPresiona Enter para continuar...")
        return False

def verificar_url_ax():
    try:
        url_actual = subprocess.check_output("git remote get-url origin", shell=True, text=True).strip()
        if "ax-col/ax" not in url_actual:
            print("\n⚙️ Git Shield: Actualizando enlace del repositorio Web (ax)...")
            subprocess.run("git remote set-url origin https://github.com/ax-col/ax.git", shell=True)
            time.sleep(1)
    except Exception:
        pass

def main():
    verificar_url_ax()
    while True:
        limpiar_pantalla()
        print("==================================================")
        print("🛰️  SISTEMA DE CONTROL AX - JEFE WEB (ax)")
        print("==================================================")
        print("1. Ver Estado Local (git status)")
        print("2. Descargar Cambios de GitHub (git pull)")
        print("3. Subir Cambios a GitHub (git add + commit + push)")
        print("4. Volver al Panel Líder")
        print("==================================================")
        opc = input("Selecciona una opción (1-4): ").strip()

        if opc == "1":
            ejecutar_comando("git status")
            input("\nPresiona Enter para volver...")
        elif opc == "2":
            print("\n📥 Descargando repositorio...")
            ejecutar_comando("git pull origin main")
            input("\nPresiona Enter para volver...")
        elif opc == "3":
            msg = input("Mensaje del commit (deja vacío para usar por defecto): ").strip()
            if not msg:
                msg = "Update Web Production via run.py"
            
            print("\n➕ Indexando archivos con calma...")
            time.sleep(1.5)
            if ejecutar_comando("git add ."):
                print("💬 Creando el commit de actualización...")
                time.sleep(1.5)
                if ejecutar_comando(f'git commit -m "{msg}"'):
                    print("🚀 Iniciando subida a los servidores de GitHub (Push)...")
                    time.sleep(2)
                    ejecutar_comando("git push origin main")
            input("\nPresiona Enter para volver...")
        elif opc == "4":
            break

if __name__ == "__main__":
    main()
