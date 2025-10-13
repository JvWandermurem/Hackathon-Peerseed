from fastapi import FastAPI

# Cria a instância da aplicação FastAPI
# O título será diferente para cada serviço quando os desenvolvermos, mas por agora pode ser genérico.
app = FastAPI(
    title="Serviço PeerSeed",
    description="Microsserviço da plataforma PeerSeed - Hackathon.",
    version="1.0.0"
)

@app.get("/health", tags=["Monitoring"])
def health_check():
    """
    Este endpoint serve para o Docker e o Kubernetes verificarem se o serviço está
    funcionando corretamente. É a primeira coisa que implementamos.
    """
    return {"status": "ok", "message": "Serviço operacional."}