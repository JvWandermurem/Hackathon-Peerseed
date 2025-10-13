# servico_contas/app/middlewares.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI):
    """
    Configura o middleware de CORS para a aplicação.
    Permite requisições do frontend React/Vite.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Em produção, especifique as origens
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )