# Python script para convertir modelos a formato móvil
import transformers
import torch

# Cargar modelo
model = transformers.AutoModelForCausalLM.from_pretrained("microsoft/phi-2")

# Cuantizar a 4-bit (reduce tamaño 4x)
from transformers import BitsAndBytesConfig
quant_config = BitsAndBytesConfig(load_in_4bit=True)
model_quantized = transformers.AutoModelForCausalLM.from_pretrained(
    "microsoft/phi-2",
    quantization_config=quant_config
)

# Exportar a ONNX para navegador
torch.onnx.export(model_quantized, "mobile_model.onnx")