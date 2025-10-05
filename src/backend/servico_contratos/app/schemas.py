import uuid
from pydantic import BaseModel
from shared.database.models import RiscoEnum

class CprUpdateResponse(BaseModel):
    id: uuid.UUID
    status: str
    score_risco: RiscoEnum | None
    
    class Config:
        from_attributes = True