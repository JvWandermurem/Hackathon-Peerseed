from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone 
from . import models, schemas
from passlib.context import CryptContext
from jose import jwt

SECRET_KEY = "wandermurem" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # O token expira em 30 minutos

# Cria um contexto para hashing de senhas. Usaremos o bcrypt.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Gera o hash de uma senha."""
    return pwd_context.hash(password)

async def get_user_by_email(db: AsyncSession, email: str):
    """Busca um usuário pelo email."""
    result = await db.execute(select(models.Usuario).filter(models.Usuario.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    """Cria um novo usuário no banco de dados."""
    # Gera o hash da senha antes de salvar
    hashed_password = get_password_hash(user.senha)
    
    # Cria um objeto do modelo SQLAlchemy a partir dos dados do schema Pydantic
    db_user = models.Usuario(
        nome_completo=user.nome_completo,
        email=user.email,
        senha_hash=hashed_password,
        cpf=user.cpf,
        celular=user.celular,
        perfil=user.perfil
    )
    
    # Adiciona o novo usuário à sessão e commita no banco
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha fornecida corresponde ao hash salvo."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    """Cria um novo token de acesso (JWT)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
