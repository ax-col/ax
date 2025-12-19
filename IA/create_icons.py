# create_icons.py
from PIL import Image, ImageDraw

# Crear icono simple
for size in [192, 512]:
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Dibujar un cerebro simple
    center = size // 2
    draw.ellipse([center-30, center-30, center+30, center+30], 
                 fill='white', outline='white')
    
    img.save(f'icon-{size}.png')
    print(f'Created icon-{size}.png')