import uuid
import enum
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, Enum, Float, Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy import Boolean


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
    __table_args__ = {"schema": "contas"}


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

class StatusCprEnum(str, enum.Enum):
    ANALISE = "ANALISE"
    CAPTAÇÃO = "CAPTAÇÃO"
    FINANCIADO = "FINANCIADO"
    EM_PAGAMENTO = "EM_PAGAMENTO"
    QUITADO = "QUITADO"
    INADIMPLENTE = "INADIMPLENTE"
    NENHUMA = "NENHUMA"

class RiscoEnum(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

# Define a tabela 'cprs'
class CPR(Base):
    __tablename__ = "cprs"
    __table_args__ = {"schema": "analise_credito"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agricultor_id = Column(UUID(as_uuid=True), nullable=False) 
    valor_solicitado = Column(Float, nullable=False)
    prazo_meses = Column(Integer, nullable=False)
    taxa_juros_anual = Column(Float, nullable=True)
    cultura = Column(String(100), nullable=False)
    
    # --- COLUNAS QUE ESTAVAM FALTANDO ---
    finalidade = Column(String(255), nullable=True)
    hectares = Column(Integer, nullable=True)
    possui_car = Column(Boolean, default=False)
    possui_certificacao = Column(Boolean, default=False)
    # ------------------------------------

    status = Column(Enum(StatusCprEnum), nullable=False, default=StatusCprEnum.ANALISE)
    score_risco = Column(Enum(RiscoEnum), nullable=True)
    
    data_emissao = Column(DateTime(timezone=True))
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())