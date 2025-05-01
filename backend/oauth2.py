from fastapi import HTTPException, status, Request
from datetime import timedelta, datetime, timezone
from typing import Dict
from backend.config import config
import jwt
from backend.schemas import TokenData

ALGORITHM = config['ALGORITHM']
JWT_SECRET_KEY = config['JWT_SECRET_KEY']
ACCESS_TOKEN_EXPIRE_MINUTES = config['ACCESS_TOKEN_EXPIRE_MINUTES']


def create_access_token(
    data: Dict, 
    expire_minutes: timedelta = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
) -> str:
    to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + expire_minutes
    
    to_encode.update({'exp': expire_time})
    jwt_token = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    return jwt_token

def verify_access_token(access_token: str, credentials_exception: Exception) -> TokenData:
    if not access_token: 
        raise credentials_exception
    try:
        payload = jwt.decode(access_token, JWT_SECRET_KEY, [ALGORITHM])
        user_id = payload.user_id
        return TokenData(user_id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

def get_current_user(request: Request) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Couldn't validate credentials",
    )
    access_token = request.cookies.get('access_token')
    return verify_access_token(access_token, credentials_exception)