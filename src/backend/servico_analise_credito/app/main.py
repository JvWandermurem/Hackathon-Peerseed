from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

# Importa todos os nossos módulos locais
from . import schemas, security, models, crud
from .database import get_db, engine
from .scoring import predict_simulado, traduzir_probabilidade_para_negocio

app = FastAPI(
    title="Serviço de Análise de Crédito",
    description="Responsável por receber solicitações de crédito, gerar o AgroScore e registrar a CPR.",
    version="1.0.0"
)

# --- Evento de Startup (Opcional, mas boa prática) ---
# Este trecho de código foi removido pois o Alembic agora é nossa fonte da verdade
# @app.on_event("startup")
# async def startup():
#     async with engine.begin() as conn:
#         await conn.run_sync(models.Base.metadata.create_all)

# --- Endpoints da API ---

@app.post("/analise", response_model=schemas.AnaliseResponse, status_code=status.HTTP_201_CREATED, tags=["Análise de Crédito"])
async def criar_analise(
    request: schemas.AnaliseRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: security.AuthenticatedUser = Depends(security.get_current_user)
):
    """
    Recebe uma solicitação de crédito, executa o simulador de score
    e cria uma nova CPR no banco de dados.
    
    Este endpoint é protegido e requer um token JWT de um usuário autenticado.
    """
    # Adicionamos uma verificação de perfil para garantir que apenas agricultores solicitem crédito
    if current_user.perfil != "AGRICULTOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas usuários com perfil de AGRICULTOR podem solicitar crédito."
        )

    # 1. Pega a predição "bruta" do nosso simulador
    probabilidade_inadimplencia = predict_simulado(request)
    
    # 2. Traduz a predição para a lógica de negócio
    score_risco, taxa_sugerida = traduzir_probabilidade_para_negocio(probabilidade_inadimplencia)

    # 3. Cria a CPR no banco de dados com os dados calculados
    nova_cpr = await crud.create_cpr(
        db=db, 
        agricultor_id=current_user.id,
        dados_analise=request,
        score=score_risco,
        taxa=taxa_sugerida
    )

    # 4. Retorna a resposta formatada
    return nova_cpr


@app.get("/health", tags=["Monitoring"])
def health_check():
    """Verifica se o serviço está operacional."""
    return {"status": "ok", "message": "Serviço de Análise de Crédito operacional."}