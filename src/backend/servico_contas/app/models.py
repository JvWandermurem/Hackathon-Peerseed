import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

# Importa a Base do nosso arquivo de database
from .database import Base

# Cria Enums em Python para garantir a consistência dos dados
class PerfilEnum(str, enum.Enum):
    AGRICULTOR = "AGRICULTOR"
    INVESTIDOR = "INVESTIDOR"
    ADMIN = "ADMIN"

class StatusKycEnum(str, enum.Enum):
    PENDENTE = "PENDENTE"
    VERIFICADO = "VERIFICADO"
    REPROVADO = "REPROVADO"
    ANALISE_MANUAL = "ANALISE_MANUAL"


# Define a tabela 'usuarios' como uma classe Python
class Usuario(Base):
    __tablename__ = "usuarios"

    # Colunas da tabela
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome_completo = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    cpf = Column(String(11), unique=True, index=True, nullable=False)
    celular = Column(String(15), nullable=False)
    
    perfil = Column(Enum(PerfilEnum), nullable=False)
    status_kyc = Column(Enum(StatusKycEnum), nullable=False, default=StatusKycEnum.PENDENTE)
    
    # Colunas para o vínculo com o Telegram
    telegram_user_id = Column(String(255), unique=True, nullable=True)
    telegram_vinculado_em = Column(DateTime(timezone=True), nullable=True)

    # Timestamps automáticos
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    data_atualizacao = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)