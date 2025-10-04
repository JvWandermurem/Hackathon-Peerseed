from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from . import crud, schemas, security, models
from .database import get_db

app = FastAPI(
    title="Serviço de Contas",
    description="Microsserviço responsável pelo cadastro e autenticação de usuários.",
    version="1.0.0"
)

@app.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED, tags=["Autenticação"])
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Cria um novo usuário na plataforma.
    """
    # Verifica se já existe um usuário com o mesmo email
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado."
        )
    
    # Cria o novo usuário
    return await crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token, tags=["Autenticação"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    """
    Autentica um usuário e retorna um token de acesso JWT.
    
    Atenção: FastAPI usa o padrão OAuth2, que espera os campos
    'username' e 'password' de um formulário. Mapeamos nosso 'email'
    para o campo 'username' aqui.
    """
    user = await crud.get_user_by_email(db, email=form_data.username)
    
    # Verifica se o usuário existe e se a senha está correta
    if not user or not crud.verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Cria o token de acesso
    access_token = crud.create_access_token(
        data={"sub": user.email}
    )
    
    # Retorna o token
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse, tags=["Usuários"])
async def read_users_me(current_user: models.Usuario = Depends(security.get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.
    
    Este endpoint é protegido. Você precisa fornecer um token JWT válido.
    """
    return current_user

@app.get("/health", tags=["Monitoring"])
def health_check():
    """Verifica se o serviço está operacional."""
    return {"status": "ok", "message": "Serviço de Contas operacional."}