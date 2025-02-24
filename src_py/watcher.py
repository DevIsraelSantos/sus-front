import os
import time
import shutil
from log_req import log_request

# Definição dos diretórios
BASE_DIR = "/app/files"
WATCH_DIR = os.path.join(BASE_DIR, "pending")
IN_PROCESS_DIR = os.path.join(BASE_DIR, "in_process")

# Garante que as pastas existam
os.makedirs(WATCH_DIR, exist_ok=True)
os.makedirs(IN_PROCESS_DIR, exist_ok=True)

def process_files():
    """Verifica e move arquivos da pasta 'pending' para 'success' ou 'error'."""
    while True:
        print("🔄 Verificando novos arquivos...")
        files = os.listdir(WATCH_DIR)  # Lista arquivos na pasta "pending"

        for file_name in files:
            file_path = os.path.join(WATCH_DIR, file_name)
            
            # Verifica se é um arquivo (não uma pasta)
            if os.path.isfile(file_path):
                print(f"🔧 Processando: {file_name}")
                # INIT = Iniciando o processamento
                # END = Processamento finalizado com sucesso
                
                # Move o arquivo para a pasta "in_process"
                in_process_path = os.path.join(IN_PROCESS_DIR, file_name)
                shutil.move(file_path, in_process_path)
                log_request(file_name, f"INIT", "INFO")

                # Simula o envio do arquivo
                time.sleep(5)
                log_request(file_name, f"Enviado 5M de 10M", "INFO")                
                time.sleep(5)
                log_request(file_name, f"Enviado 10M de 10M", "INFO")
                time.sleep(5)

                # Remove o arquivo da pasta "in_process" e gera o log
                os.remove(in_process_path)
                log_request(file_name, f"END", "INFO")

        time.sleep(10)  # Aguarda 10 segundos antes de verificar novamente

if __name__ == "__main__":
    print("🔍 Monitorando a pasta 'rodar' para novos arquivos...")
    process_files()
