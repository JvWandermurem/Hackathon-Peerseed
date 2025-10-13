import uuid
from pydantic import BaseModel, EmailStr, Field
from typing import List
from datetime import datetime

# Importa os Enums dos modelos para usar nos schemas
from .models import PerfilEnum, RiscoEnum

# --- Schemas de Autenticação e Usuário ---
class UserCreate(BaseModel):
    nome_completo: str
    email: EmailStr
    senha: str
    cpf: str
    celular: str
    perfil: PerfilEnum

class UserResponse(BaseModel):
    id: uuid.UUID
    nome_completo: str
    email: EmailStr
    perfil: PerfilEnum
    data_criacao: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# --- Schemas de Análise de Crédito ---
class AnaliseRequest(BaseModel):
    valor_solicitado: float
    prazo_meses: int
    cultura: str

class AnaliseResponse(BaseModel):
    id: uuid.UUID
    status: str
    score_risco: RiscoEnum | None
    taxa_juros_anual: float | None
    valor_solicitado: float
    prazo_meses: int
    cultura: str
    pontos_positivos: List[str] = []
    sugestoes_melhora: List[str] = []
    class Config: from_attributes = True

# --- Schemas de Contratos ---
class CprUpdateResponse(BaseModel):
    id: uuid.UUID
    status: str
    score_risco: RiscoEnum | None
    class Config: from_attributes = True

# --- Schemas do Marketplace ---
class OportunidadeResponse(BaseModel):
    id: uuid.UUID
    valor_solicitado: float
    taxa_juros_anual: float | None
    prazo_meses: int
    cultura: str
    score_risco: RiscoEnum | None
    class Config: from_attributes = True

class AnaliseRequest(BaseModel):
    valor_solicitado: float
    prazo_meses: int
    cultura: str
    # --- NOVOS CAMPOS ---
    finalidade: str
    hectares: int
    possui_car: bool
    possui_certificacao: bool