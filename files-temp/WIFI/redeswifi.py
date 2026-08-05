import os
import subprocess
import sys

# Colores ANSI para formatear la terminal
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def print_banner():
    """Limpia la pantalla y muestra el encabezado."""
    os.system("cls" if os.name == "nt" else "clear")
    print(f"{CYAN}{BOLD}")
    print("=" * 55)
    print("      W I - F I   P A S S W O R D   V A U L T      ")
    print("=" * 55)
    print(f"{RESET}")


def run_command(cmd):
    """Ejecuta comandos del sistema probando codificaciones estándar de Windows."""
    try:
        output = subprocess.check_output(
            cmd, shell=True, stderr=subprocess.DEVNULL
        )
        for encoding in ["cp850", "utf-8", "cp1252", "latin1"]:
            try:
                return output.decode(encoding)
            except UnicodeDecodeError:
                continue
        return output.decode("utf-8", errors="ignore")
    except subprocess.CalledProcessError:
        return ""


def get_wifi_profiles():
    """Obtiene todos los nombres de perfiles guardados."""
    raw_output = run_command("netsh wlan show profiles")
    profiles = []

    for line in raw_output.splitlines():
        if "Perfil" in line or "Profile" in line:
            parts = line.split(":", 1)
            if len(parts) > 1:
                profile_name = parts[1].strip()
                if profile_name:
                    profiles.append(profile_name)

    return profiles


def get_wifi_password(profile):
    """Obtiene la seguridad y contraseña de un perfil."""
    raw_output = run_command(f'netsh wlan show profile "{profile}" key=clear')

    password = f"{RED}Sin contraseña / No encontrada{RESET}"
    auth_type = "Desconocida"

    for line in raw_output.splitlines():
        if "Autenticaci" in line or "Authentication" in line:
            parts = line.split(":", 1)
            if len(parts) > 1:
                auth_type = parts[1].strip()

        if "Contenido de la clave" in line or "Key Content" in line:
            parts = line.split(":", 1)
            if len(parts) > 1:
                password = f"{GREEN}{BOLD}{parts[1].strip()}{RESET}"

    return auth_type, password


def main():
    if os.name != "nt":
        print(
            f"{RED}[!] Este script solo es compatible con sistemas Windows.{RESET}"
        )
        sys.exit(1)

    print_banner()

    profiles = get_wifi_profiles()

    if not profiles:
        print(
            f"{YELLOW}[i] No se encontraron redes Wi-Fi guardadas en el equipo.{RESET}"
        )
        input("\nPresiona Enter para salir...")
        return

    print(f"{BOLD}--- INVENTARIO COMPLETO DE CLAVES ---{RESET}\n")

    for profile in profiles:
        auth, pwd = get_wifi_password(profile)
        print(f"  • {BOLD}SSID:{RESET}       {CYAN}{profile}{RESET}")
        print(f"    {BOLD}Seguridad:{RESET}  {auth}")
        print(f"    {BOLD}Clave:{RESET}      {pwd}")
        print(f"{CYAN}" + "-" * 40 + f"{RESET}")

    # Pausa para evitar que la consola se cierre al hacer doble clic
    input("\nPresiona ENTER para salir...")


if __name__ == "__main__":
    main()
