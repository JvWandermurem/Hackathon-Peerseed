import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, Float, Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

# Cria uma classe Base para este serviço
Base = declarative_base()

# Cria Enums em Python
class StatusCprEnum(str, enum.Enum):
    ANALISE = "ANALISE"
    CAPTAÇÃO = "CAPTAÇÃO"
    FINANCIADO = "FINANCIADO"
    EM_PAGAMENTO = "EM_PAGAMENTO"
    QUITADO = "QUITADO"
    INADIMPLENTE = "INADIMPLENTE"

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
    # No mundo real, não usaríamos FK, mas para o hackathon isso simplifica
    agricultor_id = Column(UUID(as_uuid=True), nullable=False) 
    valor_solicitado = Column(Float, nullable=False)
    prazo_meses = Column(Integer, nullable=False)
    taxa_juros_anual = Column(Float, nullable=True) # Será definida pelo score
    
    # Adicionando um campo para o input do modelo
    cultura = Column(String(100), nullable=False)
    
    status = Column(Enum(StatusCprEnum), nullable=False, default=StatusCprEnum.ANALISE)
    score_risco = Column(Enum(RiscoEnum), nullable=True) # Será preenchido pela análise
    
    data_emissao = Column(DateTime(timezone=True))
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())