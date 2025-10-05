from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from . import crud, schemas, security
from shared.database.database import get_db

app = FastAPI(
    title="Serviço de Contratos",
    description="Responsável por gerenciar o ciclo de vida dos contratos (CPRs).",
    version="1.0.0"
)

@app.post("/contratos/{cpr_id}/assinar", response_model=schemas.CprUpdateResponse, tags=["Contratos"])
async def assinar_contrato(
    cpr_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: security.AuthenticatedUser = Depends(security.get_current_user)
):
    """
    Simula a assinatura de uma CPR, mudando seu status para 'CAPTAÇÃO'.
    """
    # Busca a CPR no banco de dados
    db_cpr = await crud.get_cpr_by_id(db, cpr_id=cpr_id)
    if not db_cpr:
        raise HTTPException(status_code=404, detail="CPR não encontrada.")
    
    # Verifica se o usuário logado é o dono da CPR
    if db_cpr.agricultor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado: você não é o dono desta CPR.")
        
    # Verifica se a CPR está no status correto para ser assinada
    if db_cpr.status != "ANALISE":
        raise HTTPException(status_code=400, detail=f"Ação inválida: CPR já está no status '{db_cpr.status}'.")

    # Atualiza o status
    updated_cpr = await crud.update_cpr_status_to_captacao(db, cpr=db_cpr)
    return updated_cpr


@app.get("/health", tags=["Monitoring"])
def health_check():
    return {"status": "ok"}