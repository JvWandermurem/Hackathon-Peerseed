from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt

from . import crud, schemas
from .database import get_db

# Esta linha cria um "esquema" que diz ao FastAPI:
# "Para se proteger, procure por um token no cabeçalho 'Authorization: Bearer <token>'"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    """
    Dependência que valida o token JWT e retorna o usuário correspondente.
    Este será o "segurança" de todos os nossos endpoints protegidos.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica o token para extrair o "subject" (que é o email do usuário)
        payload = jwt.decode(token, crud.SECRET_KEY, algorithms=[crud.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    # Busca o usuário no banco de dados com o email extraído do token
    user = await crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
        
    return user