import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- CORREÇÃO DO CAMINHO DE IMPORTAÇÃO ---
# Adiciona o diretório /app (nosso WORKDIR) ao path do Python
# Isso permite que o Alembic encontre o módulo 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Agora a importação vai funcionar
from backend.shared.models import Base
# -------------------------------------------

# --- Configuração do Alembic ---
config = context.config

# Lê a URL do banco e ajusta para o Alembic (síncrono)
db_url = os.getenv("DATABASE_URL", "")
if "asyncpg" in db_url:
    db_url = db_url.replace("+asyncpg", "")
config.set_main_option("sqlalchemy.url", db_url)

# Configura o target_metadata para o autogenerate
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    # ... (o resto do arquivo pode continuar igual)
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    # ... (o resto do arquivo pode continuar igual)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()