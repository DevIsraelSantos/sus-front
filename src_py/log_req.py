import requests

def log_request(fileName:str, message: str, log_level: str = "INFO"):
    """Função para enviar logs para a API."""
    
    fileId = fileName.split(".")[0]  # Nome do arquivo sem a extensão

    log_data = {
        "fileId": fileId,  # Nome do arquivo
        "message": message,  # Mensagem
        "type": log_level  # Nível do log
    }

    url = "http://portal-web:3000/api/history"
    
    try:
        response = requests.post(url, json=log_data)  # Envia os dados de log como JSON
        if response.status_code == 200:
            print(f"Log enviado com sucesso! {fileId} - {message}")
        else:
            print(f"Erro ao enviar log: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar à API de logs: {e}")