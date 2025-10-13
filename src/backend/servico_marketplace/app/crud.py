from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from shared.database import models

async def get_cprs_em_captacao(db: AsyncSession):
    """
    Busca no banco de dados todas as CPRs que estão com status 'CAPTAÇÃO'.
    """
    query = select(models.CPR).filter(models.CPR.status == models.StatusCprEnum.CAPTAÇÃO)
    result = await db.execute(query)
    return result.scalars().all()