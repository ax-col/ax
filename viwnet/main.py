import subprocess

# Obtener los nombres de perfiles de Wi-Fi
data = subprocess.check_output(['netsh', 'wlan', 'show', 'profiles']).decode('utf-8').split('\n')
profiles = [i.split(":")[1][1:-1] for i in data if "All User Profile" in i]

# Encabezado
print("\n{:<30} | {:<}".format("Wi-Fi Name", "Password"))
print("-" * 45)

# Iterar sobre los perfiles de Wi-Fi y obtener la contraseña
for i in profiles:
    results = subprocess.check_output(['netsh', 'wlan', 'show', 'profile', i, 'key=clear']).decode('utf-8').split('\n')
    results = [b.split(":")[1][1:-1] for b in results if "Key Content" in b]

    try:
        print("{:<30} | {:<}".format(i, results[0]))
    except IndexError:
        print("{:<30} | {:<}".format(i, "No password"))