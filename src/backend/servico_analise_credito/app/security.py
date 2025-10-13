from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, UUID4
from jose import JWTError, jwt

# Segredos e configurações do token
SECRET_KEY = "sua_chave_secreta_super_segura_aqui" 
ALGORITHM = "HS256"

# MUDANÇA PRINCIPAL: Usando HTTPBearer. Ele é mais simples e espera apenas o token.
security_scheme = HTTPBearer()

class AuthenticatedUser(BaseModel):
    """Schema simples para representar os dados do usuário extraídos do token."""
    id: UUID4
    email: str
    perfil: str

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> AuthenticatedUser:
    """
    Extrai o token do cabeçalho, decodifica e retorna os dados do usuário.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("id")
        perfil: str = payload.get("perfil")
        if email is None or user_id is None or perfil is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return AuthenticatedUser(id=user_id, email=email, perfil=perfil)