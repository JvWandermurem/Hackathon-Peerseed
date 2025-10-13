from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

# --- ATENÇÃO: Importações corrigidas ---
from shared.database import schemas
from shared.database import models
# ------------------------------------

# Cria um contexto para hashing de senhas. Usaremos o bcrypt.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Segredos e configurações do token
SECRET_KEY = "sua_chave_secreta_super_segura_aqui" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha fornecida corresponde ao hash salvo."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera o hash de uma senha."""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Cria um novo token de acesso (JWT)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(db: AsyncSession, email: str):
    """Busca um usuário pelo email."""
    result = await db.execute(select(models.Usuario).filter(models.Usuario.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    """Cria um novo usuário no banco de dados."""
    hashed_password = get_password_hash(user.senha)
    
    db_user = models.Usuario(
        nome_completo=user.nome_completo,
        email=user.email,
        senha_hash=hashed_password,
        cpf=user.cpf,
        celular=user.celular,
        perfil=user.perfil
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user