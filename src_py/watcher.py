import os
import time
import shutil

# Definição dos diretórios
BASE_DIR = "/app/files"
WATCH_DIR = os.path.join(BASE_DIR, "pending")
IN_PROCESS_DIR = os.path.join(BASE_DIR, "in_process")
SUCCESS_DIR = os.path.join(BASE_DIR, "success")
ERROR_DIR = os.path.join(BASE_DIR, "error")

# Garante que as pastas existam
os.makedirs(WATCH_DIR, exist_ok=True)
os.makedirs(SUCCESS_DIR, exist_ok=True)
os.makedirs(ERROR_DIR, exist_ok=True)

def process_files():
    """Verifica e move arquivos da pasta 'pending' para 'success' ou 'error'."""
    while True:
        print("🔄 Verificando novos arquivos...")
        files = os.listdir(WATCH_DIR)  # Lista arquivos na pasta "pending"

        for file_name in files:
            file_path = os.path.join(WATCH_DIR, file_name)
            
            # Verifica se é um arquivo (não uma pasta)
            if os.path.isfile(file_path):
                target_dir = SUCCESS_DIR if len(file_name) > 10 else ERROR_DIR
                target_path = os.path.join(target_dir, file_name)

                shutil.move(file_path, target_path)  # Move o arquivo
                print(f"✅ Movido: {file_name} → {target_dir}")

        time.sleep(2)  # Aguarda 2 segundos antes de verificar novamente

if __name__ == "__main__":
    print("🔍 Monitorando a pasta 'rodar' para novos arquivos...")
    process_files()
