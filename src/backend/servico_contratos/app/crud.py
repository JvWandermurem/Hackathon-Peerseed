from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from shared.database import models
import fastapi

async def get_cpr_by_id(db: AsyncSession, cpr_id: UUID):
    """Busca uma CPR pelo seu ID."""
    result = await db.execute(select(models.CPR).filter(models.CPR.id == cpr_id))
    return result.scalars().first()

async def update_cpr_status_to_captacao(db: AsyncSession, cpr: models.CPR):
    """Atualiza o status de uma CPR para CAPTAÇÃO."""
    cpr.status = models.StatusCprEnum.CAPTAÇÃO
    db.add(cpr)
    await db.commit()
    await db.refresh(cpr)
    return cpr