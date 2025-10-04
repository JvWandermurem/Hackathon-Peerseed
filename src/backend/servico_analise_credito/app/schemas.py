import uuid
from pydantic import BaseModel, Field
from .models import RiscoEnum

class AnaliseRequest(BaseModel):
    valor_solicitado: float = Field(..., gt=0, example=50000.00)
    prazo_meses: int = Field(..., gt=0, example=12)
    cultura: str = Field(..., example="Café")

class AnaliseResponse(BaseModel):
    id: uuid.UUID
    
    status: str
    score_risco: RiscoEnum
    taxa_juros_anual: float

    class Config:
        from_attributes = True