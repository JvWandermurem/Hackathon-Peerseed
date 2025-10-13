from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError
import asyncio
from . import crud
from shared.database import schemas
from shared.database import models
from shared.database.database import get_db, engine
from .middlewares import setup_cors
from app.security import get_current_user

# ------------------------------------

app = FastAPI(
    title="Serviço de Contas",
    description="Microsserviço responsável pelo cadastro, autenticação e gestão do schema do DB.",
    version="1.0.0"
)
setup_cors(app)


# --- LÓGICA DE STARTUP ---
@app.on_event("startup")
async def on_startup():
    """
    Este evento é executado quando a aplicação FastAPI inicia.
    Ele tenta se conectar ao banco de dados com retentativas e cria as tabelas.
    """
    print("--- Aguardando conexão com o banco de dados... ---")
    retries = 5
    while retries > 0:
        try:
            async with engine.begin() as conn:
                # Se a conexão for bem-sucedida, cria as tabelas
                await conn.run_sync(models.Base.metadata.create_all)
            print("--- Conexão bem-sucedida e tabelas criadas! ---")
            break # Sai do loop se a conexão for um sucesso
        except (OperationalError, ConnectionRefusedError) as e:
            print(f"Falha na conexão com o banco de dados: {e}")
            retries -= 1
            print(f"Tentando novamente em 5 segundos... ({retries} tentativas restantes)")
            await asyncio.sleep(5) # Espera 5 segundos antes de tentar de novo
    
    if retries == 0:
        print("ERRO FATAL: Não foi possível conectar ao banco de dados após várias tentativas.")
# --------------------------------

@app.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED, tags=["Autenticação"])
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado."
        )
    return await crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token, tags=["Autenticação"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    user = await crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_data = {
        "sub": user.email,
        "id": str(user.id),
        "perfil": user.perfil.value
    }
    access_token = crud.create_access_token(data=access_token_data)
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserResponse, tags=["Autenticação"])
async def read_current_user(current_user: models.Usuario = Depends(get_current_user)):
    return current_user

@app.get("/health", tags=["Monitoring"])
def health_check():
    """Verifica se o serviço está operacional."""
    return {"status": "ok", "message": "Serviço de Contas operacional."}