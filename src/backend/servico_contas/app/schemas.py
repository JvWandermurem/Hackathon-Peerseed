import uuid
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from .models import PerfilEnum

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# Schema para a criação de um usuário (o que a API recebe)
class UserCreate(BaseModel):
    nome_completo: str = Field(..., example="João da Silva")
    email: EmailStr = Field(..., example="joao.silva@email.com")
    senha: str = Field(..., min_length=8, example="SenhaForte123!")
    cpf: str = Field(..., min_length=11, max_length=11, example="12345678900")
    celular: str = Field(..., example="11987654321")
    perfil: PerfilEnum

# Schema para a resposta da API (o que a API retorna) - Menos a Senha.
class UserResponse(BaseModel):
    id: uuid.UUID
    nome_completo: str
    email: EmailStr
    cpf: str
    celular: str
    perfil: PerfilEnum
    data_criacao: datetime

    class Config:
        from_attributes = True # Permite que o Pydantic leia dados de um objeto SQLAlchemy