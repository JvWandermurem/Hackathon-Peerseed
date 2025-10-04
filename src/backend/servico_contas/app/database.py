import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

# Pega a URL do banco de dados da variável de ambiente que configuramos no docker-compose
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("Variável de ambiente DATABASE_URL não configurada.")

# Cria o motor de conexão assíncrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Cria uma fábrica de sessões assíncronas
AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria uma classe Base para nossos modelos declarativos
Base = declarative_base()

# Função para ser usada como dependência no FastAPI e nos dar uma sessão de banco
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session