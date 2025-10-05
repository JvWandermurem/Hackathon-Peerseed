from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlalchemy import select
from . import models, schemas

async def create_cpr(
    db: AsyncSession, 
    agricultor_id: UUID,
    dados_analise: schemas.AnaliseRequest,
    score: str,
    taxa: float
):
    """
    Cria um novo registro de CPR na base de dados.
    """
    
    db_cpr = models.CPR(
        agricultor_id=agricultor_id,
        valor_solicitado=dados_analise.valor_solicitado,
        prazo_meses=dados_analise.prazo_meses,
        cultura=dados_analise.cultura,
        score_risco=score,
        taxa_juros_anual=taxa,
        status=models.StatusCprEnum.ANALISE # Status inicial
    )
    
    db.add(db_cpr)
    await db.commit()
    await db.refresh(db_cpr)
    
    return db_cpr

async def get_cprs_by_agricultor_id(db: AsyncSession, agricultor_id: UUID):
    """Busca todas as CPRs de um agricultor específico."""
    result = await db.execute(select(models.CPR).filter(models.CPR.agricultor_id == agricultor_id))
    return result.scalars().all()