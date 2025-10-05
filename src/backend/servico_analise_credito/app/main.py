from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import List
from shared.database import schemas
# Importa todos os nossos módulos locais
from . import security, crud
from shared.database.database import get_db
from shared.database import models
from .scoring import predict_simulado, traduzir_probabilidade_para_negocio
from sqlalchemy.exc import OperationalError
import asyncio
from shared.database.database import get_db, engine
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="Serviço de Análise de Crédito",
    description="Responsável por receber solicitações de crédito, gerar o AgroScore e registrar a CPR.",
    version="1.0.0"
)

origins = [
    "http://localhost:8080",   # se você roda frontend em localhost
    "http://192.168.17.140:8080"  # seu IP local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Endpoints da API ---

@app.on_event("startup")
async def on_startup():
    """
    Este evento é executado quando a aplicação FastAPI inicia.
    Ele tenta se conectar ao banco de dados com retentativas e cria as tabelas.
    """
    print("--- Aguardando conexão com o banco de dados... ---")
    retries = 5
    while retries > 0:
        try:
            async with engine.begin() as conn:
                # Se a conexão for bem-sucedida, cria as tabelas
                await conn.run_sync(models.Base.metadata.create_all)
            print("--- Conexão bem-sucedida e tabelas criadas! ---")
            break # Sai do loop se a conexão for um sucesso
        except (OperationalError, ConnectionRefusedError) as e:
            print(f"Falha na conexão com o banco de dados: {e}")
            retries -= 1
            print(f"Tentando novamente em 5 segundos... ({retries} tentativas restantes)")
            await asyncio.sleep(5) # Espera 5 segundos antes de tentar de novo
    
    if retries == 0:
        print("ERRO FATAL: Não foi possível conectar ao banco de dados após várias tentativas.")

@app.post("/analise", response_model=schemas.AnaliseResponse, status_code=status.HTTP_201_CREATED, tags=["Análise de Crédito"])
async def criar_analise(
    request: schemas.AnaliseRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: security.AuthenticatedUser = Depends(security.get_current_user)
):
    """
    Recebe uma solicitação de crédito, executa o simulador de score
    e cria uma nova CPR no banco de dados.
    """
    # ------------------------------------------------------------------
    # CORREÇÃO CRÍTICA PARA O ERRO 403: Verificar se o perfil é AGRICULTOR
    # Usamos .upper() para garantir que aceita "AGRICULTOR" ou "agricultor"
    # ------------------------------------------------------------------
    if current_user.perfil.upper() != "AGRICULTOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas usuários com perfil de AGRICULTOR podem solicitar crédito."
        )

    # 1. Pega a predição "bruta" do nosso simulador
    probabilidade_inadimplencia = predict_simulado(request)
    
    # 2. --- CORREÇÃO APLICADA AQUI ---
    # Passamos o 'request' como segundo argumento e recebemos um dicionário completo
    resultado_negocio = traduzir_probabilidade_para_negocio(probabilidade_inadimplencia, request)

    # 3. Cria a CPR no banco de dados com os dados do dicionário
    nova_cpr = await crud.create_cpr(
        db=db, 
        agricultor_id=current_user.id,
        dados_analise=request,
        score=resultado_negocio["score_risco"],
        taxa=resultado_negocio["taxa_juros_anual"]
    )

    # 4. --- CORREÇÃO APLICADA AQUI ---
    # Montamos a resposta final usando o schema, incluindo os novos campos
    return schemas.AnaliseResponse(
        id=nova_cpr.id,
        status=nova_cpr.status,
        score_risco=nova_cpr.score_risco,
        taxa_juros_anual=nova_cpr.taxa_juros_anual,
        # Campos que faltavam:
        valor_solicitado=nova_cpr.valor_solicitado,
        prazo_meses=nova_cpr.prazo_meses,
        cultura=nova_cpr.cultura,
        # Campos do score inteligente:
        pontos_positivos=resultado_negocio["pontos_positivos"],
        sugestoes_melhora=resultado_negocio["sugestoes_melhora"]
    )


@app.get("/analises/minhas", response_model=List[schemas.AnaliseResponse], tags=["Análise de Crédito"])
async def ler_minhas_analises(
    db: AsyncSession = Depends(get_db),
    current_user: security.AuthenticatedUser = Depends(security.get_current_user)
):
    """Retorna todas as solicitações de crédito (CPRs) do usuário logado."""
    cprs = await crud.get_cprs_by_agricultor_id(db, agricultor_id=current_user.id)
    
    # SIMPLESMENTE RETORNE A LISTA DE OBJETOS DO BANCO.
    # Como o schema AnaliseResponse tem 'from_attributes = True', o FastAPI/Pydantic
    # fará a conversão automática dos objetos SQLAlchemy para o formato JSON correto.
    return cprs

@app.get("/analises/meu-score", response_model=schemas.AnaliseResponse, tags=["Análise de Crédito"])
async def ler_meu_score_mais_recente(
    db: AsyncSession = Depends(get_db),
    current_user: security.AuthenticatedUser = Depends(security.get_current_user)
):
    """Retorna a análise de crédito mais recente do usuário logado."""
    latest_cpr = await crud.get_latest_cpr_by_agricultor_id(db, agricultor_id=current_user.id)
    
    if not latest_cpr:
        raise HTTPException(status_code=404, detail="Nenhuma análise de crédito encontrada.")

    # --- CORREÇÃO APLICADA AQUI ---
    # Criamos o objeto AnaliseRequest com TODOS os campos necessários,
    # extraídos do objeto 'latest_cpr' que veio do banco.
    dados_para_simulador = schemas.AnaliseRequest(
        valor_solicitado=latest_cpr.valor_solicitado,
        prazo_meses=latest_cpr.prazo_meses,
        cultura=latest_cpr.cultura,
        finalidade=latest_cpr.finalidade,
        hectares=latest_cpr.hectares,
        possui_car=latest_cpr.possui_car,
        possui_certificacao=latest_cpr.possui_certificacao
    )

    probabilidade_mock = 0.18 # Valor de exemplo
    if latest_cpr.score_risco == 'A': probabilidade_mock = 0.05
    elif latest_cpr.score_risco == 'C': probabilidade_mock = 0.22
        
    resultado_negocio = traduzir_probabilidade_para_negocio(
        probabilidade_mock, 
        dados_para_simulador
    )

    # Convertemos o objeto do banco para um dicionário para poder atualizá-lo
    response_data = schemas.AnaliseResponse.from_orm(latest_cpr).dict()
    response_data.update(resultado_negocio)
    
    return response_data

@app.get("/health", tags=["Monitoring"])
def health_check():
    """Verifica se o serviço está operacional."""
    return {"status": "ok", "message": "Serviço de Análise de Crédito operacional."}
