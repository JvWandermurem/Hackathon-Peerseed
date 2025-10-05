from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

# Importações da nossa biblioteca compartilhada e módulos locais
from shared.database.database import get_db
from . import crud
from .middlewares import setup_cors
from shared.database import schemas
from shared.database import models

app = FastAPI(
    title="Serviço de Marketplace",
    description="Responsável por exibir as oportunidades de investimento.",
    version="1.0.0"
)
setup_cors(app)

@app.get("/oportunidades", response_model=List[schemas.OportunidadeResponse], tags=["Marketplace"])
async def listar_oportunidades(db: AsyncSession = Depends(get_db)):
    """
    Endpoint público que retorna uma lista de todas as CPRs
    disponíveis para investimento (status = CAPTAÇÃO).
    """
    oportunidades = await crud.get_cprs_em_captacao(db=db)
    return oportunidades

@app.get("/health", tags=["Monitoring"])
def health_check():
    return {"status": "ok"}