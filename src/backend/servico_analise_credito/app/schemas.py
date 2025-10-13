import uuid
from pydantic import BaseModel, Field
from shared.database.models import RiscoEnum
from typing import List

class AnaliseRequest(BaseModel):
    valor_solicitado: float = Field(..., gt=0, example=50000.00)
    prazo_meses: int = Field(..., gt=0, example=12)
    cultura: str = Field(..., example="Café")

score_risco: RiscoEnum | None