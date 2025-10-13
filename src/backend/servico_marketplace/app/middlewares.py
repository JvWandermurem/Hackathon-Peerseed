from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI):
    """
    Configura o middleware de CORS para a aplicação.
    """
    # Como o frontend é em React, a porta padrão é 3000.
    # Adicionamos outras comuns por segurança.
    origins = [
        "http://localhost",
        "http://localhost:3000", # Porta padrão do React
        "http://localhost:5173", # Porta padrão do Vite (usado em alguns projetos React)
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )